const FIXED_TYPES = new Set(['lock', 'bomb'])

export function isFixed(tile) {
  return !!tile && FIXED_TYPES.has(tile.type)
}

export function reverseText(text) {
  return [...text].reverse().join('')
}

/**
 * 棋盘逻辑模型：二维网格 + 相邻寻路 + 重力下落。
 * 纯逻辑，不依赖渲染层。
 */
export class Board {
  constructor(cols, rows) {
    this.cols = cols
    this.rows = rows
    this.cells = Array.from({ length: rows }, () => Array(cols).fill(null))
  }

  static fromTiles(cols, rows, tiles) {
    const board = new Board(cols, rows)
    for (const tile of tiles) {
      board.set(tile.x, tile.y, { ...tile })
    }
    return board
  }

  clone() {
    const board = new Board(this.cols, this.rows)
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const tile = this.cells[y][x]
        if (tile) board.cells[y][x] = { ...tile }
      }
    }
    return board
  }

  inside(x, y) {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows
  }

  get(x, y) {
    return this.inside(x, y) ? this.cells[y][x] : null
  }

  set(x, y, tile) {
    if (this.inside(x, y)) this.cells[y][x] = tile
  }

  remove(x, y) {
    if (this.inside(x, y)) this.cells[y][x] = null
  }

  tiles() {
    const out = []
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const tile = this.cells[y][x]
        if (tile) out.push(tile)
      }
    }
    return out
  }

  neighbors(x, y) {
    const out = []
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (this.inside(nx, ny)) out.push([nx, ny])
      }
    }
    return out
  }

  /**
   * 在棋盘上寻找拼出 text（或其反序）的相邻路径（8 方向，不可重复，跳过锁定块）。
   * 返回 [[x,y], ...] 或 null。
   */
  findPath(text) {
    const variants = [text]
    const reversed = reverseText(text)
    if (text.length > 1 && reversed !== text) variants.push(reversed)

    for (const word of variants) {
      for (let y = 0; y < this.rows; y += 1) {
        for (let x = 0; x < this.cols; x += 1) {
          const tile = this.get(x, y)
          if (!tile || tile.locked || tile.char !== word[0]) continue
          const found = this._dfs(word, 0, x, y, [[x, y]], new Set([`${x},${y}`]))
          if (found) return found
        }
      }
    }
    return null
  }

  _dfs(word, index, x, y, path, visited) {
    if (index === word.length - 1) return path.slice()
    for (const [nx, ny] of this.neighbors(x, y)) {
      const key = `${nx},${ny}`
      if (visited.has(key)) continue
      const tile = this.get(nx, ny)
      if (!tile || tile.locked || tile.char !== word[index + 1]) continue
      visited.add(key)
      path.push([nx, ny])
      const result = this._dfs(word, index + 1, nx, ny, path, visited)
      if (result) return result
      visited.delete(key)
      path.pop()
    }
    return null
  }

  /**
   * 重力下落：每列内非固定块塌落到该列分段底部；锁链/炸弹固定不动。
   * 返回移动记录 [{ tile, fromY, toY }]，供动画使用。
   */
  applyGravity() {
    const moves = []
    for (let x = 0; x < this.cols; x += 1) {
      let segmentStart = 0
      for (let y = 0; y <= this.rows; y += 1) {
        const barrier = y === this.rows || isFixed(this.get(x, y))
        if (!barrier) continue

        const segment = []
        for (let sy = segmentStart; sy < y; sy += 1) {
          const tile = this.get(x, sy)
          if (tile) segment.push(tile)
        }

        let write = y - 1
        for (let i = segment.length - 1; i >= 0; i -= 1) {
          const tile = segment[i]
          if (tile.y !== write) moves.push({ tile, fromY: tile.y, toY: write })
          this.cells[write][x] = tile
          tile.y = write
          write -= 1
        }
        for (let wy = segmentStart; wy <= write; wy += 1) {
          this.cells[wy][x] = null
        }

        segmentStart = y + 1
      }
    }
    return moves
  }

  hash() {
    let out = ''
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const tile = this.cells[y][x]
        out += tile
          ? `${tile.char}${tile.type[0]}${tile.hp || 0}${tile.locked ? 1 : 0}${tile.countdown || 0}|`
          : '.|'
      }
    }
    return out
  }
}
