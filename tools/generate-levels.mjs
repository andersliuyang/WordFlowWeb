import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Board } from '../src/game/board.js'
import { compileLevel, solve } from '../src/game/level.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const ZH_FILLER = [...'山水风月花草林木云雨天地江海星火石金土田人心思春秋冬夏日夜明光高远长清秀语香暖收藏阔厚意一二三飞鸟鱼虫江河湖海']
const EN_FILLER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const DIRECTIONS = [[1, 0], [0, 1], [1, 1], [1, -1], [-1, 0], [0, -1], [-1, -1], [-1, 1]]

function shuffle(list, random) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

function findBlockStart(seq, word) {
  for (let i = 0; i + word.text.length <= seq.length; i += 1) {
    let ok = true
    for (let j = 0; j < word.text.length; j += 1) {
      if (seq[i + j].id !== word.id || seq[i + j].index !== j) {
        ok = false
        break
      }
    }
    if (ok) return i
  }
  return -1
}

/**
 * 构造单列“级联链”：chain 为按消除顺序排列的词。
 * 返回自顶向下的字母序列；消除 chain[0] 后 chain[1] 会因重力相邻而级联，
 * 依此类推。递归地用前置词的字隔开后续词的字。
 */
function buildChainColumn(chain) {
  if (chain.length === 0) return []
  const [first, ...rest] = chain
  if (rest.length === 0) {
    return [...first.text].map((ch, index) => ({ id: first.id, index }))
  }
  const tail = buildChainColumn(rest)
  const start = findBlockStart(tail, rest[0])
  const insertAt = start + 1
  const block = [...first.text].map((ch, index) => ({ id: first.id, index }))
  return [...tail.slice(0, insertAt), ...block, ...tail.slice(insertAt)]
}

function tryPlaceStraight(cells, cols, rows, text, random) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [dx, dy] = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)]
    const sx = Math.floor(random() * cols)
    const sy = Math.floor(random() * rows)
    const path = []
    let ok = true
    for (let i = 0; i < text.length; i += 1) {
      const x = sx + dx * i
      const y = sy + dy * i
      if (x < 0 || y < 0 || x >= cols || y >= rows || cells[y][x]) {
        ok = false
        break
      }
      path.push([x, y])
    }
    if (ok) {
      for (let i = 0; i < text.length; i += 1) cells[path[i][1]][path[i][0]] = text[i]
      return path
    }
  }
  return null
}

function buildBoard(spec, random) {
  const { grid, words } = spec
  const cols = grid.x
  const rows = grid.y
  const cells = Array.from({ length: rows }, () => Array(cols).fill(null))
  const byId = new Map(words.map((w) => [w.id, w]))

  const chains = (spec.chains || []).filter((chain) =>
    chain.reduce((sum, id) => sum + byId.get(id).text.length, 0) <= rows,
  )
  const chained = new Set(chains.flat())

  // place chains into distinct columns
  const freeColumns = shuffle([...Array(cols).keys()], random)
  for (const chain of chains) {
    const column = freeColumns.pop()
    if (column === undefined) return null
    const seq = buildChainColumn(chain.map((id) => byId.get(id)))
    const top = rows - seq.length
    seq.forEach((cell, i) => {
      cells[top + i][column] = byId.get(cell.id).text[cell.index]
    })
  }

  // place remaining words as straight lines
  for (const word of shuffle(words.filter((w) => !chained.has(w.id)).slice(), random)) {
    if (!tryPlaceStraight(cells, cols, rows, word.text, random)) return null
  }

  // place bonus words (optional easter eggs the player may discover)
  const targetTexts = new Set(words.map((w) => w.text))
  const bonusPlaced = []
  for (const text of shuffle((spec.bonus || []).filter((t) => !targetTexts.has(t)), random)) {
    if (tryPlaceStraight(cells, cols, rows, text, random)) bonusPlaced.push(text)
  }

  // filler
  const usedChars = new Set(words.flatMap((w) => [...w.text]))
  let pool = (spec.language === 'zh-CN' ? ZH_FILLER : EN_FILLER).filter((c) => !usedChars.has(c))
  if (pool.length < 6) pool = spec.language === 'zh-CN' ? ZH_FILLER : EN_FILLER
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!cells[y][x]) cells[y][x] = pool[Math.floor(random() * pool.length)]
    }
  }

  return { rows: cells.map((row) => row.join('')), bonus: bonusPlaced }
}

function assignObstacles(spec, board, random) {
  const obstacles = {}
  const plan = spec.obstacles || {}
  const cells = []
  for (let y = 0; y < spec.grid.y; y += 1) {
    for (let x = 0; x < spec.grid.x; x += 1) cells.push([x, y])
  }
  shuffle(cells, random)
  let cursor = 0
  const take = () => {
    const cell = cells[cursor]
    cursor += 1
    return cell
  }
  for (let i = 0; i < (plan.ice || 0); i += 1) {
    const [x, y] = take()
    if (x === undefined) break
    obstacles[`${x},${y}`] = { type: 'ice', hp: 2 }
  }
  for (let i = 0; i < (plan.bomb || 0); i += 1) {
    const [x, y] = take()
    if (x === undefined) break
    obstacles[`${x},${y}`] = { type: 'bomb', countdown: plan.bombCountdown || 5 }
  }
  for (let i = 0; i < (plan.lock || 0); i += 1) {
    const [x, y] = take()
    if (x === undefined) break
    obstacles[`${x},${y}`] = { type: 'lock', lockKey: null }
  }
  return obstacles
}

function buildLevel(spec, seed) {
  const random = mulberry32(seed)
  const bonusList = spec.bonus || BONUS[spec.id] || []
  const built = buildBoard({ ...spec, bonus: bonusList }, random)
  if (!built) return null

  const obstacles = assignObstacles(spec, built.rows, random)
  const def = {
    id: spec.id,
    language: spec.language,
    theme: spec.theme,
    tier: spec.tier,
    grid: spec.grid,
    board: built.rows,
    obstacles,
    moveLimit: spec.moveLimit ?? null,
    bonusTarget: spec.bonusTarget ?? 3,
    reward: spec.reward ?? { coins: 40 + spec.words.length * 15, stars: 3 },
    words: spec.words.map((word) => ({ id: word.id, text: word.text, hint: word.hint })),
    bonus: built.bonus,
  }

  const level = compileLevel(def)

  // 校验：链首词开局可拼，链上后续词开局不可拼（必须靠级联）
  const check = Board.fromTiles(spec.grid.x, spec.grid.y, level.initial_board)
  for (const chain of spec.chains || []) {
    for (let i = 0; i < chain.length; i += 1) {
      const word = spec.words.find((w) => w.id === chain[i])
      const formable = check.findPath(word.text) !== null
      if (i === 0 && !formable) return null
      if (i > 0 && formable) return null
    }
  }

  const flow = solve(level)
  if (!flow) return null
  level.solution_flow = flow

  const cascadeCount = flow.reduce((sum, step) => sum + (step.cascades ? step.cascades.length : 0), 0)
  return { level, cascadeCount, chainCount: (spec.chains || []).length }
}

const SPECS = [
  // ---------- 中文 · 新手引导：3x3，2~3 词，无级联 ----------
  { id: 'wf_zh_001', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: '山水', hint: '山与水的合称' }, { id: 'w2', text: '明月', hint: '明亮的月亮' }] },
  { id: 'wf_zh_002', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: '春风', hint: '春天的风' }, { id: 'w2', text: '江河', hint: '江与河' }] },
  { id: 'wf_zh_003', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: '花草', hint: '花与草' }, { id: 'w2', text: '森林', hint: '成片的树木' }, { id: 'w3', text: '云海', hint: '像海一样的云' }] },

  // ---------- 中文 · 成长期：4x4，引入级联 ----------
  { id: 'wf_zh_004', language: 'zh-CN', theme: '自然', tier: 'easy', grid: { x: 4, y: 4 },
    chains: [['w1', 'w2']],
    words: [{ id: 'w1', text: '日月', hint: '太阳与月亮' }, { id: 'w2', text: '山川', hint: '山与河流' }, { id: 'w3', text: '星光', hint: '星星的光' }] },
  { id: 'wf_zh_005', language: 'zh-CN', theme: '自然', tier: 'easy', grid: { x: 4, y: 4 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: '青山', hint: '青翠的山' }, { id: 'w2', text: '绿水', hint: '碧绿的水' }, { id: 'w3', text: '白云', hint: '白色的云' }, { id: 'w4', text: '夏雨', hint: '夏天的雨' }] },
  { id: 'wf_zh_006', language: 'zh-CN', theme: '四季', tier: 'easy', grid: { x: 4, y: 4 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: '秋月', hint: '秋天的月' }, { id: 'w2', text: '冬雪', hint: '冬天的雪' }, { id: 'w3', text: '天高', hint: '天空高远' }, { id: 'w4', text: '地厚', hint: '大地深厚' }] },

  // ---------- 中文 · 进阶：5x5，更多词 ----------
  { id: 'wf_zh_007', language: 'zh-CN', theme: '胸怀', tier: 'medium', grid: { x: 5, y: 5 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: '海阔', hint: '大海辽阔' }, { id: 'w2', text: '天空', hint: '高高的天' }, { id: 'w3', text: '春华', hint: '春天的花朵' }, { id: 'w4', text: '秋实', hint: '秋天的果实' }, { id: 'w5', text: '花明', hint: '花光明媚' }] },
  { id: 'wf_zh_008', language: 'zh-CN', theme: '自然', tier: 'medium', grid: { x: 5, y: 5 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: '柳暗', hint: '柳色深暗' }, { id: 'w2', text: '山明', hint: '山水明秀' }, { id: 'w3', text: '水秀', hint: '水色秀丽' }, { id: 'w4', text: '鸟语', hint: '鸟儿的鸣叫' }, { id: 'w5', text: '花香', hint: '花朵的芬芳' }] },

  // ---------- 中文 · 挑战：6x6，长链（一步清 3）+ 障碍 ----------
  { id: 'wf_zh_009', language: 'zh-CN', theme: '四季', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    words: [{ id: 'w1', text: '春风', hint: '春天的风' }, { id: 'w2', text: '夏雨', hint: '夏天的雨' }, { id: 'w3', text: '秋月', hint: '秋天的月' }, { id: 'w4', text: '冬雪', hint: '冬天的雪' }, { id: 'w5', text: '江河', hint: '江与河' }] },
  { id: 'wf_zh_010', language: 'zh-CN', theme: '自然', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    obstacles: { ice: 1 },
    words: [{ id: 'w1', text: '森林', hint: '成片的树木' }, { id: 'w2', text: '云海', hint: '像海一样的云' }, { id: 'w3', text: '日月', hint: '太阳与月亮' }, { id: 'w4', text: '山川', hint: '山与河流' }, { id: 'w5', text: '星光', hint: '星星的光' }] },
  { id: 'wf_zh_011', language: 'zh-CN', theme: '自然', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    obstacles: { lock: 1 },
    words: [{ id: 'w1', text: '青山', hint: '青翠的山' }, { id: 'w2', text: '绿水', hint: '碧绿的水' }, { id: 'w3', text: '白云', hint: '白色的云' }, { id: 'w4', text: '花草', hint: '花与草' }, { id: 'w5', text: '森林', hint: '成片的树木' }] },
  { id: 'wf_zh_012', language: 'zh-CN', theme: '四季', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    obstacles: { ice: 1, lock: 1, bomb: 1, bombCountdown: 9 },
    words: [{ id: 'w1', text: '冬雪', hint: '冬天的雪' }, { id: 'w2', text: '天高', hint: '天空高远' }, { id: 'w3', text: '地厚', hint: '大地深厚' }, { id: 'w4', text: '海阔', hint: '大海辽阔' }, { id: 'w5', text: '天空', hint: '高高的天' }] },

  // ---------- English · tutorial: 3x3, no chains ----------
  { id: 'wf_en_001', language: 'en-US', theme: 'Animals', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: 'CAT', hint: 'A small furry pet' }, { id: 'w2', text: 'DOG', hint: 'A loyal pet' }] },
  { id: 'wf_en_002', language: 'en-US', theme: 'Sky', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: 'SUN', hint: 'The star we orbit' }, { id: 'w2', text: 'SKY', hint: 'The space above us' }] },
  { id: 'wf_en_003', language: 'en-US', theme: 'Animals', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [{ id: 'w1', text: 'SEA', hint: 'The ocean' }, { id: 'w2', text: 'ICE', hint: 'Frozen water' }, { id: 'w3', text: 'FOX', hint: 'A wild canine' }] },

  // ---------- English · growth: 6x6, chains of two 3-letter words ----------
  { id: 'wf_en_004', language: 'en-US', theme: 'Animals', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: 'CAT', hint: 'A small furry pet' }, { id: 'w2', text: 'DOG', hint: 'A loyal pet' }, { id: 'w3', text: 'FOX', hint: 'A wild canine' }, { id: 'w4', text: 'OWL', hint: 'A night bird' }] },
  { id: 'wf_en_005', language: 'en-US', theme: 'Animals', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: 'BAT', hint: 'A flying mammal' }, { id: 'w2', text: 'EGG', hint: 'Laid by birds' }, { id: 'w3', text: 'BEE', hint: 'A buzzing insect' }, { id: 'w4', text: 'COW', hint: 'A farm animal' }] },
  { id: 'wf_en_006', language: 'en-US', theme: 'Nature', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: 'ARM', hint: 'Part of the body' }, { id: 'w2', text: 'ART', hint: 'Creative work' }, { id: 'w3', text: 'SEA', hint: 'The ocean' }, { id: 'w4', text: 'ICE', hint: 'Frozen water' }] },
  { id: 'wf_en_007', language: 'en-US', theme: 'Objects', tier: 'medium', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: 'FAN', hint: 'Moves air' }, { id: 'w2', text: 'HAT', hint: 'Worn on the head' }, { id: 'w3', text: 'RUG', hint: 'A floor cover' }, { id: 'w4', text: 'JAM', hint: 'Fruit spread' }, { id: 'w5', text: 'MUD', hint: 'Wet soil' }] },
  { id: 'wf_en_008', language: 'en-US', theme: 'Sky', tier: 'medium', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [{ id: 'w1', text: 'SUN', hint: 'The star we orbit' }, { id: 'w2', text: 'SKY', hint: 'The space above us' }, { id: 'w3', text: 'MUD', hint: 'Wet soil' }, { id: 'w4', text: 'POT', hint: 'A container' }, { id: 'w5', text: 'ARM', hint: 'Part of the body' }] },
  { id: 'wf_en_009', language: 'en-US', theme: 'Objects', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1 },
    words: [{ id: 'w1', text: 'FOX', hint: 'A wild canine' }, { id: 'w2', text: 'OWL', hint: 'A night bird' }, { id: 'w3', text: 'BEE', hint: 'A buzzing insect' }, { id: 'w4', text: 'COW', hint: 'A farm animal' }] },
  { id: 'wf_en_010', language: 'en-US', theme: 'Objects', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { lock: 1 },
    words: [{ id: 'w1', text: 'FAN', hint: 'Moves air' }, { id: 'w2', text: 'HAT', hint: 'Worn on the head' }, { id: 'w3', text: 'BAG', hint: 'Carries things' }, { id: 'w4', text: 'JAM', hint: 'Fruit spread' }] },
  { id: 'wf_en_011', language: 'en-US', theme: 'Sky', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1, lock: 1, bomb: 1, bombCountdown: 9 },
    words: [{ id: 'w1', text: 'SUN', hint: 'The star we orbit' }, { id: 'w2', text: 'SKY', hint: 'The space above us' }, { id: 'w3', text: 'SEA', hint: 'The ocean' }, { id: 'w4', text: 'ICE', hint: 'Frozen water' }] },
]

// 每关彩蛋候选（真实词组，生成器会放置并在可拼出时保留）
const BONUS = {
  'wf_zh_001': ['夜雨', '清风'],
  'wf_zh_002': ['山水', '明月'],
  'wf_zh_003': ['春风', '秋雨'],
  'wf_zh_004': ['花月', '云海'],
  'wf_zh_005': ['江河', '阳光'],
  'wf_zh_006': ['春风', '夏雨'],
  'wf_zh_007': ['山明', '水秀'],
  'wf_zh_008': ['明月', '清风'],
  'wf_zh_009': ['星光', '山川'],
  'wf_zh_010': ['花海', '阳光'],
  'wf_zh_011': ['流水', '秋月'],
  'wf_zh_012': ['春暖', '花开'],
  'wf_en_001': ['SKY', 'ARM'],
  'wf_en_002': ['SEA', 'FOX'],
  'wf_en_003': ['CAT', 'SUN'],
  'wf_en_004': ['BAT', 'EGG'],
  'wf_en_005': ['FOX', 'ARM'],
  'wf_en_006': ['SUN', 'POT'],
  'wf_en_007': ['BAG', 'SUN'],
  'wf_en_008': ['ART', 'HAT'],
  'wf_en_009': ['CAT', 'JAM'],
  'wf_en_010': ['RUG', 'POT'],
  'wf_en_011': ['FOX', 'ARM'],
}

function generate() {
  const levels = []
  const report = []
  for (const spec of SPECS) {
    let built = null
    for (let attempt = 0; attempt < 120 && !built; attempt += 1) {
      built = buildLevel(spec, 1000 + attempt * 7919 + spec.id.length * 131)
    }
    if (!built) {
      report.push(`FAIL  ${spec.id}`)
      continue
    }
    levels.push(built.level)
    report.push(`OK    ${spec.id}  words=${built.level.target_words.length} flow=${built.level.solution_flow.length} cascades=${built.cascadeCount}`)
  }
  return { levels, report }
}

const { levels, report } = generate()
for (const line of report) console.log(line)

const header = `// 本文件由 tools/generate-levels.mjs 自动生成，请勿手改。\n// 语言：zh-CN / en-US\n\n`
const body = `export const LEVELS = ${JSON.stringify(levels, null, 2)}\n\nexport const LEVELS_BY_LANGUAGE = {\n  'zh-CN': LEVELS.filter((l) => l.language === 'zh-CN'),\n  'en-US': LEVELS.filter((l) => l.language === 'en-US'),\n}\n\nexport function getLevel(id) {\n  return LEVELS.find((level) => level.id === id) || null\n}\n`

writeFileSync(join(__dirname, '..', 'src', 'data', 'levels.js'), header + body)
console.log(`\n已写入 ${levels.length} 个关卡 -> src/data/levels.js`)
