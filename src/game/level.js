import { Board } from './board.js'
import {
  pathHasSturdyIce,
  crackIce,
  clearPath,
  unlockLocks,
  tickBombs,
  findCascadeWord,
} from './rules.js'

/**
 * 将紧凑关卡定义编译为运行时关卡对象（对齐设计文档第 7 章 Schema）。
 */
export function compileLevel(def) {
  const { id, language, theme, tier, grid, board, obstacles = {}, words, bonus = [] } = def

  const tiles = []
  for (let y = 0; y < grid.y; y += 1) {
    for (let x = 0; x < grid.x; x += 1) {
      const char = board[y][x]
      const tile = { x, y, char, type: 'normal' }
      const obs = obstacles[`${x},${y}`]
      if (obs) {
        tile.type = obs.type
        if (obs.type === 'ice') tile.hp = obs.hp ?? 2
        if (obs.type === 'lock') {
          tile.lockKey = obs.lockKey ?? null
          tile.locked = true
        }
        if (obs.type === 'bomb') tile.countdown = obs.countdown ?? 5
      }
      tiles.push(tile)
    }
  }

  return {
    id,
    language,
    theme,
    tier,
    grid_dim: { x: grid.x, y: grid.y },
    move_limit: def.moveLimit ?? null,
    bonus_target: def.bonusTarget ?? 3,
    reward: def.reward ?? { coins: 50, stars: 3 },
    initial_board: tiles,
    target_words: words.map((word, index) => ({
      id: word.id ?? `w${index + 1}`,
      text: word.text,
      hint_text: word.hint ?? '',
      default_path: word.path ? word.path.map(([x, y]) => ({ x, y })) : null,
      allow_reverse: word.allowReverse ?? true,
    })),
    bonus_dictionary: bonus,
    solution_flow: null,
  }
}

/**
 * 通用求解器：给定棋盘与待完成词列表，返回标准解步骤数组，或 null（无解）。
 * 同一步骤内会处理裂冰、锁链解锁、重力、级联与炸弹倒计时。
 */
export function solveBoard(cols, rows, tiles, wordList, options = {}) {
  const { maxDepth = 400 } = options
  const words = new Map(wordList.map((word) => [word.id, word]))
  const initialBoard = Board.fromTiles(cols, rows, tiles)
  const failed = new Set()

  function recurse(board, remaining, steps, depth) {
    if (remaining.size === 0) return steps.slice()
    if (depth > maxDepth) return null

    const key = `${board.hash()}|${[...remaining].sort().join(',')}`
    if (failed.has(key)) return null
    failed.add(key)

    for (const id of [...remaining].sort()) {
      const word = words.get(id)
      const path = board.findPath(word.text)
      if (!path) continue

      const next = board.clone()

      if (pathHasSturdyIce(next, path)) {
        crackIce(next, path)
        // 运行时：每次提交都会推进炸弹倒计时（含破冰这一步）
        const crackExploded = tickBombs(next)
        if (crackExploded.length > 0) continue
        const result = recurse(
          next,
          remaining,
          steps.concat({
            step: steps.length + 1,
            word_id: id,
            text: word.text,
            path,
            cracked: true,
            triggers_gravity: false,
            combo: 0,
          }),
          depth + 1,
        )
        if (result) return result
        continue
      }

      const nextRemaining = new Set(remaining)
      nextRemaining.delete(id)

      // 移动前就可拼出的词不参与级联
      const preFormable = new Set()
      for (const wid of nextRemaining) {
        if (board.findPath(words.get(wid).text)) preFormable.add(wid)
      }

      const clearedCells = path.map(([x, y]) => [x, y])
      clearPath(next, path)
      unlockLocks(next, id, clearedCells)
      let moves = next.applyGravity()

      const cascades = []
      let movedTiles = moves.map((move) => move.tile)
      let guard = 0
      while (guard < 20) {
        guard += 1
        const found = findCascadeWord(
          next,
          wordList.filter((word) => nextRemaining.has(word.id)),
          movedTiles,
          preFormable,
        )
        if (!found) break
        nextRemaining.delete(found.word.id)
        clearPath(next, found.path)
        unlockLocks(next, found.word.id, found.path)
        moves = next.applyGravity()
        movedTiles = moves.map((move) => move.tile)
        cascades.push({ word_id: found.word.id, text: found.word.text, path: found.path })
      }

      const exploded = tickBombs(next)
      if (exploded.length > 0) continue

      const result = recurse(
        next,
        nextRemaining,
        steps.concat({
          step: steps.length + 1,
          word_id: id,
          text: word.text,
          path,
          cracked: false,
          triggers_gravity: moves.length > 0,
          cascades,
          combo: 0,
        }),
        depth + 1,
      )
      if (result) return result
    }

    return null
  }

  return recurse(initialBoard, new Set(words.keys()), [], 0)
}

export function solve(level, options = {}) {
  return solveBoard(level.grid_dim.x, level.grid_dim.y, level.initial_board, level.target_words, options)
}

export function isSolvable(level) {
  return solve(level) !== null
}
