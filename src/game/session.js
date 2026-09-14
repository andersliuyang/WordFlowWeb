import { Board, reverseText } from './board.js'
import { pathHasSturdyIce, crackIce, clearPath, unlockLocks, breakStones, tickBombs, findCascadeWord } from './rules.js'
import { solveBoard } from './level.js'

const COMBO_WINDOW_MS = 3000

const DIRECTIONS = [
  [1, 0], [0, 1], [1, 1], [1, -1],
  [-1, 0], [0, -1], [-1, -1], [-1, 1],
]

function shuffleArray(list, random) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

function findPlacement(board, cols, rows, length, random) {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    const [dx, dy] = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)]
    const sx = Math.floor(random() * cols)
    const sy = Math.floor(random() * rows)
    const path = []
    let ok = true
    for (let i = 0; i < length; i += 1) {
      const x = sx + dx * i
      const y = sy + dy * i
      if (x < 0 || y < 0 || x >= cols || y >= rows || board.get(x, y)) {
        ok = false
        break
      }
      path.push([x, y])
    }
    if (ok) return path
  }
  return null
}

function cloneInitialTiles(initialBoard) {
  return initialBoard.map((tile, index) => ({ ...tile, id: `t${index}` }))
}

/**
 * 单局游戏状态机：提交路径、障碍结算、重力级联、连击、提示、胜负。
 * 纯逻辑，便于测试；渲染层根据返回的事件播放动画。
 */
export class GameSession {
  constructor(level, options = {}) {
    this.level = level
    this.cloneBoard = options.cloneBoard ?? ((tiles) => Board.fromTiles(level.grid_dim.x, level.grid_dim.y, tiles))
    this.reset()
  }

  reset() {
    const tiles = cloneInitialTiles(this.level.initial_board)
    this.board = this.cloneBoard(tiles)
    this.remaining = new Map(this.level.target_words.map((word) => [word.id, word]))
    this.completed = new Set()
    this.bonusDictionary = this.level.bonus_dictionary || []
    this.bonusCollected = []
    this.bonusTarget = this.level.bonus_target || 3
    this.coins = 0
    this.moves = 0
    this.combo = 0
    this.lastClearAt = 0
    this.status = 'playing'
    this.reason = null
  }

  now() {
    return Date.now()
  }

  wordIdForText(text) {
    for (const word of this.remaining.values()) {
      if (word.text === text) return word.id
      if ((word.allow_reverse ?? true) && reverseText(word.text) === text) return word.id
    }
    return null
  }

  submitPath(cells) {
    if (this.status !== 'playing') return { type: 'noop', events: [] }
    const tiles = cells.map(([x, y]) => this.board.get(x, y)).filter(Boolean)
    let result
    if (!tiles.length) {
      result = { type: 'invalid', events: [] }
    } else {
      const text = tiles.map((tile) => tile.char).join('')
      const reversed = reverseText(text)
      const wordId = this.wordIdForText(text)
      if (wordId) {
        result = this._resolveWord(this.remaining.get(wordId), cells)
      } else {
        const bonus = this.bonusDictionary.find((entry) => entry === text || entry === reversed)
        if (bonus && !this.completed.has(`bonus:${bonus}`) && !this.bonusCollected.includes(bonus)) {
          result = this._resolveBonus(bonus)
        } else {
          result = { type: 'invalid', events: [] }
        }
      }
    }
    return this._finishTurn(result)
  }

  /** 每次提交（无论成败）结算一次炸弹倒计时。 */
  _finishTurn(result) {
    const { ticked, exploded } = this._tickBombsAndCollect()
    if (ticked.length) {
      result.events.push({
        kind: 'bombTick',
        tiles: ticked.map((t) => ({ x: t.x, y: t.y, countdown: t.countdown })),
      })
    }
    if (exploded.length) {
      result.events.push({ kind: 'bombExplode', tiles: exploded.map((t) => ({ x: t.x, y: t.y })) })
    }
    this._advanceTurn(exploded)
    result.status = this.status
    result.reason = this.reason
    if (result.combo === undefined) result.combo = this.combo
    return result
  }

  _resolveWord(word, cells) {
    const events = []

    if (pathHasSturdyIce(this.board, cells)) {
      crackIce(this.board, cells)
      events.push({ kind: 'crack', wordId: word.id, text: word.text, path: cells })
      return { type: 'target', events, combo: this.combo, status: this.status }
    }

    const preFormable = new Set()
    for (const entry of this.remaining.values()) {
      if (entry.id === word.id) continue
      if (this.board.findPath(entry.text)) preFormable.add(entry.id)
    }

    const result = this._clearWord(word, cells, { countMove: true })
    events.push(result.event)
    if (result.unlocked.length) {
      events.push({ kind: 'unlock', tiles: result.unlocked.map((t) => ({ x: t.x, y: t.y })) })
    }
    if (result.broken.length) {
      events.push({ kind: 'break', tiles: result.broken.map((t) => ({ x: t.x, y: t.y })) })
    }

    this._resolveCascades(events, preFormable, result.event.moves)

    return {
      type: 'target',
      events,
      combo: this.combo,
      coinsGained: this.coins,
    }
  }

  _clearWord(word, cells, { countMove }) {
    this.completed.add(word.id)
    this.remaining.delete(word.id)
    const removed = clearPath(this.board, cells)
    const unlocked = unlockLocks(this.board, word.id, cells)
    const broken = breakStones(this.board, cells)
    const moves = this.board.applyGravity()

    const now = this.now()
    if (now - this.lastClearAt <= COMBO_WINDOW_MS) this.combo += 1
    else this.combo = 0
    this.lastClearAt = now

    const gained = Math.round(10 * (1 + 0.2 * this.combo))
    this.coins += gained
    if (countMove) this.moves += 1

    const clearedBomb = removed.some((tile) => tile.type === 'bomb')

    return {
      event: {
        kind: 'clear',
        wordId: word.id,
        text: word.text,
        path: cells,
        removed,
        moves,
        combo: this.combo,
        coins: gained,
        cascade: false,
      },
      clearedBomb,
      unlocked,
      broken,
    }
  }

  _resolveCascades(events, preFormable, initialMoves) {
    let lastMoves = initialMoves || []
    let guard = 0
    while (guard < 20) {
      guard += 1
      const movedSet = new Set(lastMoves.map((move) => move.tile))
      if (!movedSet.size) break

      const found = this._findCascadeWord(movedSet, preFormable)
      if (!found) break

      this.completed.add(found.word.id)
      this.remaining.delete(found.word.id)
      const removed = clearPath(this.board, found.path)
      const unlocked = unlockLocks(this.board, found.word.id, found.path)
      const broken = breakStones(this.board, found.path)
      const moves = this.board.applyGravity()
      this.combo += 1
      const gained = Math.round(10 * (1 + 0.2 * this.combo))
      this.coins += gained

      events.push({
        kind: 'clear',
        wordId: found.word.id,
        text: found.word.text,
        path: found.path,
        removed,
        moves,
        combo: this.combo,
        coins: gained,
        cascade: true,
      })
      if (unlocked.length) {
        events.push({ kind: 'unlock', tiles: unlocked.map((t) => ({ x: t.x, y: t.y })) })
      }
      if (broken.length) {
        events.push({ kind: 'break', tiles: broken.map((t) => ({ x: t.x, y: t.y })) })
      }
      lastMoves = moves
    }
  }

  _findCascadeWord(movedSet, preFormable) {
    const found = findCascadeWord(this.board, [...this.remaining.values()], movedSet, preFormable)
    return found
  }

  _tickBombsAndCollect() {
    const exploded = tickBombs(this.board)
    const ticked = this.board.tiles().filter((tile) => tile.type === 'bomb')
    return { ticked, exploded }
  }

  _resolveBonus(word) {
    this.bonusCollected.push(word)
    this.coins += 5
    const events = [{ kind: 'bonus', text: word }]
    if (this.bonusCollected.length >= this.bonusTarget) {
      this.coins += 30
      this.bonusCollected = []
      events.push({ kind: 'bonusReward', coins: 30 })
    }
    return { type: 'bonus', events, combo: this.combo, coinsGained: this.coins, status: this.status }
  }

  _advanceTurn(exploded) {
    if (this.remaining.size === 0) {
      this.status = 'won'
      return
    }
    if (exploded && exploded.length > 0) {
      this.status = 'lost'
      this.reason = 'bomb'
      return
    }
    if (this.level.move_limit && this.moves >= this.level.move_limit) {
      this.status = 'lost'
      this.reason = 'moves'
    }
  }

  /** 是否已无词可拼（死局）。 */
  isDeadlocked() {
    if (this.remaining.size === 0) return false
    for (const word of this.remaining.values()) {
      if (this.board.findPath(word.text)) return false
    }
    return true
  }

  /**
   * 重排剩余方块，使全部未完成词重新可拼且整体可解。
   * 保留方块字符与障碍状态，返回是否成功。
   */
  shuffle(random = Math.random) {
    const cols = this.level.grid_dim.x
    const rows = this.level.grid_dim.y
    const words = [...this.remaining.values()]
    if (words.length === 0) return false

    const baseTiles = this.board.tiles().map((tile) => ({ ...tile }))
    const remainingIds = new Set(words.map((word) => word.id))

    for (let attempt = 0; attempt < 300; attempt += 1) {
      const pool = baseTiles.map((tile) => ({ ...tile }))
      for (const tile of pool) {
        if (tile.type === 'lock' && tile.lockKey && !remainingIds.has(tile.lockKey)) tile.locked = false
      }

      const board = new Board(cols, rows)
      const used = new Set()
      let ok = true

      for (const word of shuffleArray(words.slice(), random)) {
        const path = findPlacement(board, cols, rows, word.text.length, random)
        if (!path) {
          ok = false
          break
        }
        for (let i = 0; i < path.length; i += 1) {
          const index = pool.findIndex((tile) => tile.char === word.text[i] && !used.has(tile))
          if (index < 0) {
            ok = false
            break
          }
          const tile = pool.splice(index, 1)[0]
          const [x, y] = path[i]
          tile.x = x
          tile.y = y
          board.set(x, y, tile)
          used.add(tile)
        }
        if (!ok) break
      }
      if (!ok) continue

      const empties = []
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) if (!board.get(x, y)) empties.push([x, y])
      }
      shuffleArray(empties, random)
      for (const tile of pool) {
        const cell = empties.pop()
        if (!cell) break
        tile.x = cell[0]
        tile.y = cell[1]
        board.set(cell[0], cell[1], tile)
      }

      if (solveBoard(cols, rows, board.tiles(), words)) {
        this.board = board
        return true
      }
    }
    return false
  }

  /** 返回可立即消除的一个未完成词与路径（用于普通提示 / 魔棒）。 */
  findHint() {
    // 优先按已验证的标准解顺序推进，避免走入死局
    const flow = this.level.solution_flow || []
    for (const step of flow) {
      const word = this.remaining.get(step.word_id)
      if (!word) continue
      const path = this.board.findPath(word.text)
      if (path) return { word, path }
    }

    let fallback = null
    for (const word of this.remaining.values()) {
      const path = this.board.findPath(word.text)
      if (!path) continue
      const hasHazard = path.some(([x, y]) => {
        const tile = this.board.get(x, y)
        return tile && (tile.type === 'bomb' || (tile.type === 'ice' && (tile.hp || 1) > 1))
      })
      if (hasHazard) return { word, path }
      if (!fallback) fallback = { word, path }
    }
    return fallback
  }

  /** 定向提示：返回包含指定格子的未完成词路径。 */
  findHintForCell(x, y) {
    for (const word of this.remaining.values()) {
      const path = this.board.findPath(word.text)
      if (path && path.some(([px, py]) => px === x && py === y)) return { word, path }
    }
    return null
  }

  /** 直接完成一个词（魔棒）；若当前无词可拼则先自动重排。 */
  autoCompleteOne() {
    let hint = this.findHint()
    if (!hint && this.shuffle()) hint = this.findHint()
    if (!hint) return null
    return this._finishTurn(this._resolveWord(hint.word, hint.path))
  }

  snapshot() {
    return {
      levelId: this.level.id,
      moves: this.moves,
      moveLimit: this.level.move_limit,
      coins: this.coins,
      combo: this.combo,
      bonusCollected: this.bonusCollected.slice(),
      bonusTarget: this.bonusTarget,
      status: this.status,
      reason: this.reason,
      words: this.level.target_words.map((word) => ({
        id: word.id,
        text: word.text,
        hint: word.hint_text,
        done: this.completed.has(word.id),
      })),
    }
  }
}
