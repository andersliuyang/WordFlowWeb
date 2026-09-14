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

// 1) 标准解（生成器给出的 solution_flow）应能通关
for (const level of LEVELS) {
  try {
    const session = new GameSession(level)
    for (const step of level.solution_flow) {
      if (!session.remaining.has(step.word_id)) continue
      const word = session.remaining.get(step.word_id)
      const path = session.board.findPath(word.text)
      check(path, `${level.id}: '${word.text}' not formable in solution`)
      const res = session.submitPath(path)
      check(res.type === 'target', `${level.id}: solution submit -> ${res.type}`)
      check(session.status !== 'lost', `${level.id}: lost during solution`)
    }
    check(session.status === 'won', `${level.id}: solution ended '${session.status}' remaining=${session.remaining.size}`)
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id}: ${error.message}`)
    failed += 1
  }
}

// 2) 乱序游玩：死局可重排；允许因炸弹爆炸而失败
for (const level of LEVELS) {
  try {
    const session = new GameSession(level)
    const random = mulberry32(97 + level.id.length * 31)
    let guard = 0
    while (session.status === 'playing' && guard < 500) {
      guard += 1
      const candidates = [...session.remaining.values()].filter((word) => session.board.findPath(word.text))
      if (candidates.length === 0) {
        check(session.shuffle(random), `${level.id}: shuffle failed`)
        continue
      }
      const word = candidates[Math.floor(random() * candidates.length)]
      const res = session.submitPath(session.board.findPath(word.text))
      check(res.type === 'target', `${level.id}: random submit -> ${res.type}`)
    }
    if (session.status === 'lost') {
      check(session.reason === 'bomb', `${level.id}: random lost by ${session.reason}`)
    } else {
      check(session.status === 'won', `${level.id}: random play stuck (remaining=${session.remaining.size})`)
    }
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id} (random): ${error.message}`)
    failed += 1
  }
}

// 3) 彩蛋词可拼出并计入彩蛋槽
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
    passed += 1
  } catch (error) {
    console.log(`FAIL ${level.id} (bonus): ${error.message}`)
    failed += 1
  }
}

// 4) 匹配器用例
try {
  const board = new Board(3, 3)
  board.set(0, 0, { x: 0, y: 0, char: 'A', type: 'normal' })
  board.set(1, 0, { x: 1, y: 0, char: 'B', type: 'normal' })
  board.set(2, 0, { x: 2, y: 0, char: 'C', type: 'normal' })
  check(board.findPath('ABC'), 'forward match')
  check(board.findPath('CBA'), 'reverse match')
  board.set(1, 0, { x: 1, y: 0, char: 'X', type: 'normal' })
  check(!board.findPath('ABC'), 'gap must not match')
  passed += 1
} catch (error) {
  console.log(`FAIL matcher: ${error.message}`)
  failed += 1
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
