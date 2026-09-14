/**
 * 消除规则：冰冻 / 锁链 / 炸弹与路径结算。
 * 规则要点（与设计文档 v7.3 一致）：
 * - 冰冻：路径中存在 hp>1 的冰块的匹配仅“裂冰”（hp-1），不消除任何方块，保证可解性。
 * - 锁链：锁定时不可选取；lockKey 词完成时解锁；无 lockKey 时相邻消除即解锁。
 * - 炸弹：每次“成功消除”倒计时 -1，归零即判负。
 */

export function pathHasSturdyIce(board, path) {
  return path.some(([x, y]) => {
    const tile = board.get(x, y)
    return tile && tile.type === 'ice' && (tile.hp || 1) > 1
  })
}

export function crackIce(board, path) {
  for (const [x, y] of path) {
    const tile = board.get(x, y)
    if (tile && tile.type === 'ice') tile.hp = (tile.hp || 1) - 1
  }
}

export function clearPath(board, path) {
  const removed = []
  for (const [x, y] of path) {
    const tile = board.get(x, y)
    if (tile) {
      removed.push(tile)
      board.remove(x, y)
    }
  }
  return removed
}

export function unlockLocks(board, wordId, clearedCells) {
  const unlocked = []
  for (const tile of board.tiles()) {
    if (tile.type !== 'lock' || !tile.locked) continue
    const shouldUnlock = tile.lockKey
      ? tile.lockKey === wordId
      : clearedCells.some(([x, y]) => Math.abs(x - tile.x) <= 1 && Math.abs(y - tile.y) <= 1)
    if (shouldUnlock) {
      tile.locked = false
      unlocked.push(tile)
    }
  }
  return unlocked
}

export function tickBombs(board) {
  const exploded = []
  for (const tile of board.tiles()) {
    if (tile.type !== 'bomb') continue
    tile.countdown = (tile.countdown || 0) - 1
    if (tile.countdown <= 0) exploded.push(tile)
  }
  return exploded
}

/**
 * 级联消除：重力落位后，若某个“原本拼不出”的未完成词因方块掉落而新凑成，则自动消除。
 * excludeIds 为移动前就已可拼出的词，不应触发级联。
 * words 需按固定顺序传入，保证求解器与运行时行为一致。
 */
export function findCascadeWord(board, words, movedTiles, excludeIds) {
  const movedSet = movedTiles instanceof Set ? movedTiles : new Set(movedTiles)
  if (movedSet.size === 0) return null
  for (const word of words) {
    if (excludeIds && excludeIds.has(word.id)) continue
    const path = board.findPath(word.text)
    if (!path) continue
    if (path.some(([x, y]) => movedSet.has(board.get(x, y)))) return { word, path }
  }
  return null
}
