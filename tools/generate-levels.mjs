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

const ZH_FILLER = [...'山水风月花草林木云雨天地江海星火石金土田人心思春秋冬夏日夜明光高远长清秀语香暖收藏阔厚意一二三飞鸟鱼虫江河湖海松竹梅兰舟桥雪霜']
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

function buildChainColumn(chain, random) {
  const seq = buildChainSeq(chain, random)
  if (random() < 0.5) seq.reverse()
  return seq
}

function buildChainSeq(chain, random) {
  if (chain.length === 0) return []
  const [first, ...rest] = chain
  if (rest.length === 0) {
    return [...first.text].map((ch, index) => ({ id: first.id, index }))
  }
  const tail = buildChainSeq(rest, random)
  const start = findBlockStart(tail, rest[0])
  const span = rest[0].text.length
  const offset = 1 + Math.floor(random() * Math.max(1, span - 1))
  const insertAt = start + Math.min(offset, span - 1)
  const block = [...first.text].map((ch, index) => ({ id: first.id, index }))
  return [...tail.slice(0, insertAt), ...block, ...tail.slice(insertAt)]
}

function tryPlaceStraight(cells, cols, rows, text, random) {
  for (let attempt = 0; attempt < 260; attempt += 1) {
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

  const freeColumns = shuffle([...Array(cols).keys()], random)
  for (const chain of chains) {
    const column = freeColumns.pop()
    if (column === undefined) return null
    const seq = buildChainColumn(chain.map((id) => byId.get(id)), random)
    const slack = rows - seq.length
    const bottomPad = Math.floor(random() * (slack + 1))
    const top = slack - bottomPad
    seq.forEach((cell, i) => {
      cells[top + i][column] = byId.get(cell.id).text[cell.index]
    })
  }

  for (const word of shuffle(words.filter((w) => !chained.has(w.id)).slice(), random)) {
    if (!tryPlaceStraight(cells, cols, rows, word.text, random)) return null
  }

  const targetTexts = new Set(words.map((w) => w.text))
  const bonusPlaced = []
  for (const text of shuffle((spec.bonus || []).filter((t) => !targetTexts.has(t)), random)) {
    if (tryPlaceStraight(cells, cols, rows, text, random)) bonusPlaced.push(text)
  }

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

function assignObstacles(spec, random) {
  const obstacles = {}
  const plan = spec.obstacles || {}
  const cells = []
  for (let y = 0; y < spec.grid.y; y += 1) {
    for (let x = 0; x < spec.grid.x; x += 1) cells.push([x, y])
  }
  shuffle(cells, random)
  const kinds = []
  for (let i = 0; i < (plan.ice || 0); i += 1) kinds.push('ice')
  for (let i = 0; i < (plan.bomb || 0); i += 1) kinds.push('bomb')
  for (let i = 0; i < (plan.lock || 0); i += 1) kinds.push('lock')
  kinds.forEach((kind, index) => {
    const [x, y] = cells[index]
    if (x === undefined) return
    if (kind === 'ice') obstacles[`${x},${y}`] = { type: 'ice', hp: 2 }
    if (kind === 'bomb') obstacles[`${x},${y}`] = { type: 'bomb', countdown: plan.bombCountdown || 6 }
    if (kind === 'lock') obstacles[`${x},${y}`] = { type: 'lock', lockKey: null }
  })
  return obstacles
}

function buildLevel(spec, seed) {
  const random = mulberry32(seed)
  const bonusList = spec.bonus || BONUS[spec.id] || []
  const built = buildBoard({ ...spec, bonus: bonusList }, random)
  if (!built) return null

  const obstacles = assignObstacles(spec, random)
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
  return { level, cascadeCount, chainShape: (spec.chains || []).map((c) => c.length).join('+') || '-' }
}

const W = (id, text, hint) => ({ id, text, hint })

// 链的长度混合 2/3/4 字词，使列高与块型各不相同
const SPECS = [
  // ================= 中文：2/3/4 字混合 =================
  { id: 'wf_zh_001', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', '山水', '山与水的合称'), W('w2', '明月', '明亮的月亮')] },
  { id: 'wf_zh_002', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', '春风', '春天的风'), W('w2', '江河', '江与河')] },
  { id: 'wf_zh_003', language: 'zh-CN', theme: '自然', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', '花草', '花与草'), W('w2', '森林', '成片的树木'), W('w3', '云海', '像海一样的云')] },

  { id: 'wf_zh_004', language: 'zh-CN', theme: '自然', tier: 'easy', grid: { x: 4, y: 4 },
    chains: [['w1', 'w2']],
    words: [W('w1', '日月', '太阳与月亮'), W('w2', '山川', '山与河流'), W('w3', '星光', '星星的光')] },
  { id: 'wf_zh_005', language: 'zh-CN', theme: '自然', tier: 'easy', grid: { x: 4, y: 5 },
    chains: [['w1', 'w2']],
    words: [W('w1', '春江水', '春天的江水'), W('w2', '明月', '明亮的月亮'), W('w3', '青山', '青翠的山'), W('w4', '绿水', '碧绿的水')] },
  { id: 'wf_zh_006', language: 'zh-CN', theme: '四季', tier: 'easy', grid: { x: 5, y: 5 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', '春风', '春天的风'), W('w2', '夏雨', '夏天的雨'), W('w3', '秋月', '秋天的月'), W('w4', '冬雪', '冬天的雪'), W('w5', '江河', '江与河')] },
  { id: 'wf_zh_007', language: 'zh-CN', theme: '山野', tier: 'medium', grid: { x: 5, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', '山外山', '山外还有山'), W('w2', '云海', '像海一样的云'), W('w3', '花间语', '花丛中的话语'), W('w4', '森林', '成片的树木'), W('w5', '星光', '星星的光')] },
  { id: 'wf_zh_008', language: 'zh-CN', theme: '自然', tier: 'medium', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', '春暖花开', '春天温暖，花朵盛开'), W('w2', '山水', '山与水的合称'), W('w3', '鸟语花香', '鸟儿鸣叫，花朵芬芳'), W('w4', '明月', '明亮的月亮')] },
  { id: 'wf_zh_009', language: 'zh-CN', theme: '胸怀', tier: 'medium', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2']],
    words: [W('w1', '海阔天空', '形容广阔无边'), W('w2', '春风', '春天的风'), W('w3', '星光', '星星的光'), W('w4', '山川', '山与河流'), W('w5', '花草', '花与草'), W('w6', '江河', '江与河')] },
  { id: 'wf_zh_010', language: 'zh-CN', theme: '四季', tier: 'hard', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    words: [W('w1', '春风', '春天的风'), W('w2', '夏雨', '夏天的雨'), W('w3', '秋月', '秋天的月'), W('w4', '江河', '江与河'), W('w5', '花草', '花与草')] },
  { id: 'wf_zh_011', language: 'zh-CN', theme: '自然', tier: 'hard', grid: { x: 6, y: 7 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1 },
    words: [W('w1', '云淡风轻', '形容天气晴好'), W('w2', '青山', '青翠的山'), W('w3', '花好月圆', '美好圆满'), W('w4', '绿水', '碧绿的水')] },
  { id: 'wf_zh_012', language: 'zh-CN', theme: '自然', tier: 'hard', grid: { x: 6, y: 8 },
    chains: [['w1', 'w2', 'w3'], ['w4', 'w5']],
    obstacles: { ice: 1, lock: 1, bomb: 1, bombCountdown: 9 },
    words: [W('w1', '山清水秀', '山水秀丽'), W('w2', '白云', '白色的云'), W('w3', '夏雨', '夏天的雨'), W('w4', '天高云淡', '天气晴朗'), W('w5', '秋月', '秋天的月')] },

  // ================= English：3/4 字母混合 =================
  { id: 'wf_en_001', language: 'en-US', theme: 'Animals', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', 'CAT', 'A small furry pet'), W('w2', 'DOG', 'A loyal pet')] },
  { id: 'wf_en_002', language: 'en-US', theme: 'Sky', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', 'SUN', 'The star we orbit'), W('w2', 'SKY', 'The space above us')] },
  { id: 'wf_en_003', language: 'en-US', theme: 'Animals', tier: 'tutorial', grid: { x: 3, y: 3 },
    words: [W('w1', 'SEA', 'The ocean'), W('w2', 'ICE', 'Frozen water'), W('w3', 'FOX', 'A wild canine')] },

  { id: 'wf_en_004', language: 'en-US', theme: 'Animals', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', 'CAT', 'A small furry pet'), W('w2', 'DOG', 'A loyal pet'), W('w3', 'FOX', 'A wild canine'), W('w4', 'OWL', 'A night bird')] },
  { id: 'wf_en_005', language: 'en-US', theme: 'Animals', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', 'BAT', 'A flying mammal'), W('w2', 'EGG', 'Laid by birds'), W('w3', 'BEE', 'A buzzing insect'), W('w4', 'COW', 'A farm animal')] },
  { id: 'wf_en_006', language: 'en-US', theme: 'Nature', tier: 'easy', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2']],
    words: [W('w1', 'ARM', 'Part of the body'), W('w2', 'ART', 'Creative work'), W('w3', 'SEA', 'The ocean'), W('w4', 'ICE', 'Frozen water')] },
  { id: 'wf_en_007', language: 'en-US', theme: 'Nature', tier: 'medium', grid: { x: 6, y: 7 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', 'TREE', 'A tall plant'), W('w2', 'SKY', 'The space above us'), W('w3', 'MOON', 'Earth’s satellite'), W('w4', 'ICE', 'Frozen water'), W('w5', 'RAIN', 'Falling water')] },
  { id: 'wf_en_008', language: 'en-US', theme: 'Elements', tier: 'medium', grid: { x: 7, y: 7 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', 'MOON', 'Earth’s satellite'), W('w2', 'SKY', 'The space above us'), W('w3', 'FIRE', 'Burning flame'), W('w4', 'POT', 'A container'), W('w5', 'ROCK', 'A large stone')] },
  { id: 'wf_en_009', language: 'en-US', theme: 'Nature', tier: 'medium', grid: { x: 6, y: 6 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    words: [W('w1', 'SEA', 'The ocean'), W('w2', 'ICE', 'Frozen water'), W('w3', 'FOX', 'A wild canine'), W('w4', 'OWL', 'A night bird'), W('w5', 'ARM', 'Part of the body'), W('w6', 'ART', 'Creative work')] },
  { id: 'wf_en_010', language: 'en-US', theme: 'Nature', tier: 'hard', grid: { x: 6, y: 7 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1 },
    words: [W('w1', 'TREE', 'A tall plant'), W('w2', 'SEA', 'The ocean'), W('w3', 'LEAF', 'Part of a plant'), W('w4', 'ICE', 'Frozen water')] },
  { id: 'wf_en_011', language: 'en-US', theme: 'Sky', tier: 'hard', grid: { x: 6, y: 8 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1, lock: 1 },
    words: [W('w1', 'MOON', 'Earth’s satellite'), W('w2', 'STAR', 'A distant sun'), W('w3', 'TREE', 'A tall plant'), W('w4', 'LEAF', 'Part of a plant')] },
  { id: 'wf_en_012', language: 'en-US', theme: 'Elements', tier: 'hard', grid: { x: 6, y: 8 },
    chains: [['w1', 'w2'], ['w3', 'w4']],
    obstacles: { ice: 1, lock: 1, bomb: 1, bombCountdown: 10 },
    words: [W('w1', 'FIRE', 'Burning flame'), W('w2', 'WIND', 'Moving air'), W('w3', 'RAIN', 'Falling water'), W('w4', 'SNOW', 'Frozen precipitation')] },
]

const BONUS = {
  'wf_zh_001': ['夜雨', '清风'],
  'wf_zh_002': ['山水', '明月'],
  'wf_zh_003': ['春风', '秋雨'],
  'wf_zh_004': ['花月', '云海'],
  'wf_zh_005': ['江河', '阳光'],
  'wf_zh_006': ['星光', '山川'],
  'wf_zh_007': ['明月', '清风'],
  'wf_zh_008': ['花好月圆', '云淡风轻'],
  'wf_zh_009': ['春暖花开', '山清水秀'],
  'wf_zh_010': ['森林', '云海'],
  'wf_zh_011': ['鸟语花香', '柳暗花明'],
  'wf_zh_012': ['海阔天空', '春华秋实'],
  'wf_en_001': ['SKY', 'ARM'],
  'wf_en_002': ['SEA', 'FOX'],
  'wf_en_003': ['CAT', 'SUN'],
  'wf_en_004': ['BAT', 'EGG'],
  'wf_en_005': ['FOX', 'ARM'],
  'wf_en_006': ['SUN', 'POT'],
  'wf_en_007': ['STAR', 'LEAF'],
  'wf_en_008': ['ROCK', 'WAVE'],
  'wf_en_009': ['CAT', 'DOG'],
  'wf_en_010': ['ROCK', 'WAVE'],
  'wf_en_011': ['SAND', 'ROCK'],
  'wf_en_012': ['MOON', 'STAR'],
}

function hashSeed(str) {
  let h = 2166136261
  for (const ch of str) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function generate() {
  const levels = []
  const report = []
  for (const spec of SPECS) {
    let built = null
    const baseSeed = hashSeed(spec.id)
    for (let attempt = 0; attempt < 160 && !built; attempt += 1) {
      built = buildLevel(spec, baseSeed + attempt * 7919)
    }
    if (!built) {
      report.push(`FAIL  ${spec.id}`)
      continue
    }
    levels.push(built.level)
    const g = spec.grid
    const lens = built.level.solution_flow
      .map((s) => s.text.length)
      .join('/')
    report.push(
      `OK    ${spec.id}  ${g.x}x${g.y}  words=${built.level.target_words.length}  chain=${built.chainShape}  lens=${lens}  flow=${built.level.solution_flow.length}  cascades=${built.cascadeCount}`,
    )
  }
  return { levels, report }
}

const { levels, report } = generate()
for (const line of report) console.log(line)

const header = `// 本文件由 tools/generate-levels.mjs 自动生成，请勿手改。\n// 语言：zh-CN / en-US\n\n`
const body = `export const LEVELS = ${JSON.stringify(levels, null, 2)}\n\nexport const LEVELS_BY_LANGUAGE = {\n  'zh-CN': LEVELS.filter((l) => l.language === 'zh-CN'),\n  'en-US': LEVELS.filter((l) => l.language === 'en-US'),\n}\n\nexport function getLevel(id) {\n  return LEVELS.find((level) => level.id === id) || null\n}\n`

writeFileSync(join(__dirname, '..', 'src', 'data', 'levels.js'), header + body)
console.log(`\n已写入 ${levels.length} 个关卡 -> src/data/levels.js`)
