/**
 * 关卡与规则回归验证。
 * 用法：npm run verify
 */
import { LEVELS } from '../src/data/levels.js'
import { Board } from '../src/game/board.js'
import { GameSession } from '../src/game/session.js'

let passed = 0
let failed = 0

function check(condition, message) {
  if (!condition) throw new Error(message)
}

for (const level of LEVELS) {
  try {
    const session = new GameSession(level)
    let guard = 0
    while (session.status === 'playing' && guard < 200) {
      guard += 1
      const hint = session.findHint()
      if (!hint) break
      const res = session.submitPath(hint.path)
      check(res.type === 'target', `${level.id}: expected target, got ${res.type}`)
    }
    check(session.status === 'won', `${level.id}: ended '${session.status}' remaining=${session.remaining.size}`)
    console.log(`OK   ${level.id}  moves=${session.moves}`)
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id}: ${error.message}`)
    failed += 1
  }
}

// 乱序游玩 + 死局重排：验证任何情况下都能通关
function mulberry32(seed) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

for (const level of LEVELS) {
  try {
    const session = new GameSession(level)
    const random = mulberry32(97 + level.id.length)
    let guard = 0
    let shuffles = 0
    while (session.status === 'playing' && guard < 400) {
      guard += 1
      const candidates = [...session.remaining.values()].filter((word) => session.board.findPath(word.text))
      if (candidates.length === 0) {
        check(session.shuffle(random), `${level.id}: shuffle failed`)
        shuffles += 1
        continue
      }
      const word = candidates[Math.floor(random() * candidates.length)]
      const res = session.submitPath(session.board.findPath(word.text))
      check(res.type === 'target', `${level.id}: random submit -> ${res.type}`)
    }
    check(session.status === 'won', `${level.id}: random play ended '${session.status}'`)
    console.log(`OK   ${level.id}  random-play shuffles=${shuffles}`)
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id} (random): ${error.message}`)
    failed += 1
  }
}

// 彩蛋词：每关登记的彩蛋都应能在开局拼出并计入彩蛋槽
for (const level of LEVELS) {
  if (!level.bonus_dictionary || level.bonus_dictionary.length === 0) continue
  try {
    const session = new GameSession(level)
    for (const text of level.bonus_dictionary) {
      const path = session.board.findPath(text)
      check(path, `${level.id}: bonus '${text}' not formable`)
      const res = session.submitPath(path)
      check(res.type === 'bonus', `${level.id}: bonus '${text}' -> ${res.type}`)
    }
    console.log(`OK   ${level.id}  bonus=${level.bonus_dictionary.join(',')}`)
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id} (bonus): ${error.message}`)
    failed += 1
  }
}

try {
  const board = new Board(3, 3)
  board.set(0, 0, { x: 0, y: 0, char: 'A', type: 'normal' })
  board.set(1, 0, { x: 1, y: 0, char: 'B', type: 'normal' })
  board.set(2, 0, { x: 2, y: 0, char: 'C', type: 'normal' })
  check(board.findPath('ABC'), 'forward match')
  check(board.findPath('CBA'), 'reverse match')
  board.set(1, 0, { x: 1, y: 0, char: 'X', type: 'normal' })
  check(!board.findPath('ABC'), 'gap must not match')
  console.log('OK   matcher (adjacency / reverse)')
  passed += 1
} catch (error) {
  console.log(`FAIL matcher: ${error.message}`)
  failed += 1
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
