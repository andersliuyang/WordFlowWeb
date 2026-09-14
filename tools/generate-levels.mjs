import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Board } from '../src/game/board.js'
import { compileLevel, solve } from '../src/game/level.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LEVELS_PER_LANGUAGE = 100

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

function hashSeed(str) {
  let h = 2166136261
  for (const ch of str) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const ZH_FILLER = [...'山水风月花草林木云雨天地江海星火石金土田人心思春秋冬夏日夜明光高远长清秀语香暖收藏阔厚意一二三飞鸟鱼虫江河湖海松竹梅兰舟桥雪霜']
const EN_FILLER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const DIRECTIONS = [[1, 0], [0, 1], [1, 1], [1, -1], [-1, 0], [0, -1], [-1, -1], [-1, 1]]

const ZH2 = [...new Set(['山水', '明月', '春风', '江河', '花草', '森林', '云海', '日月', '山川', '星光', '青山', '绿水', '白云', '夏雨', '秋月', '冬雪', '天高', '地厚', '海阔', '天空', '春华', '秋实', '花明', '柳暗', '山明', '水秀', '鸟语', '花香', '清风', '夜雨', '阳光', '流水', '星月', '云淡', '风轻', '花好', '月圆', '天长', '地久', '山高', '水长', '风花', '雪月', '春色', '心旷', '神怡', '松风', '竹影', '梅香', '兰韵', '湖光', '山色', '天朗', '气清', '秋高', '气爽', '冰天', '雪地', '桃红', '柳绿', '春暖', '花开', '秋收', '冬藏', '五谷', '丰登', '风和', '日丽', '万紫', '千红', '莺歌', '燕舞', '波澜', '壮阔', '一望', '无际', '水波', '荡漾', '景色', '宜人', '大河', '奔流', '寒来', '暑往', '春去', '秋来', '江山', '烟雨', '晨曦', '暮色', '归鸟', '远山', '银河', '碧空'])]
const ZH3 = ['春江水', '山外山', '云中月', '花间语', '林间风', '水上舟', '山中月', '天边云', '雪中梅', '雨后春', '一叶秋', '半山亭', '十里香', '千重浪', '万里云']
const ZH4 = ['春暖花开', '山清水秀', '鸟语花香', '花好月圆', '春华秋实', '山明水秀', '云淡风轻', '柳暗花明', '海阔天空', '天高云淡', '青山绿水', '风和日丽', '冰天雪地', '桃红柳绿', '百花齐放', '万紫千红', '莺歌燕舞', '层峦叠翠', '波澜壮阔', '一望无际', '星罗棋布', '五谷丰登', '风调雨顺', '心旷神怡', '水波荡漾', '景色宜人', '大河奔流', '高山流水', '秋高气爽', '万物复苏']
const EN3 = ['CAT', 'DOG', 'FOX', 'OWL', 'BAT', 'EGG', 'BEE', 'COW', 'SUN', 'SKY', 'SEA', 'ICE', 'ARM', 'ART', 'FAN', 'HAT', 'RUG', 'JAM', 'MUD', 'POT', 'BAG', 'BED', 'CUP', 'KEY', 'MAP', 'NET', 'PEN', 'RAM', 'TAP', 'VAN', 'WAX', 'YAK', 'ZIP', 'AXE', 'BOX', 'BUS', 'CAR', 'HEN', 'JAR', 'KIT', 'LOG', 'MOP', 'OAK', 'PIG', 'RAT', 'SAW', 'TOY', 'URN']
const EN4 = ['TREE', 'LEAF', 'MOON', 'STAR', 'ROCK', 'WAVE', 'SAND', 'FIRE', 'WIND', 'RAIN', 'SNOW', 'LAKE', 'FISH', 'BIRD', 'WOLF', 'BEAR', 'LION', 'FROG', 'DUCK', 'SWAN', 'MOSS', 'FERN', 'SEED', 'ROOT', 'VINE', 'CAVE', 'HILL', 'LAWN', 'POND', 'REEF', 'DUNE', 'PEAK', 'GALE', 'FROST', 'MIST', 'HAIL', 'DUSK', 'DAWN', 'PATH', 'GATE']

const ZH_THEMES = ['自然', '四季', '山水', '田园', '风物', '江河', '星月', '花木']
const EN_THEMES = ['Nature', 'Seasons', 'Animals', 'Sky', 'Objects', 'Elements', 'Landscape']

function shuffle(list, random) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

function pickWords(lang, rand, count, allowLong) {
  const pool = []
  if (lang === 'zh-CN') {
    const long = allowLong ? shuffle([...ZH3, ...ZH4], rand) : []
    const longCount = allowLong ? Math.min(long.length, Math.max(1, Math.floor(count / 2))) : 0
    pool.push(...long.slice(0, longCount))
    pool.push(...shuffle(ZH2.slice(), rand))
  } else {
    const long = allowLong ? shuffle(EN4.slice(), rand) : []
    const longCount = allowLong ? Math.min(long.length, Math.max(1, Math.floor(count / 2))) : 0
    pool.push(...long.slice(0, longCount))
    pool.push(...shuffle(EN3.slice(), rand))
  }
  const out = []
  const seen = new Set()
  for (const text of pool) {
    if (seen.has(text)) continue
    seen.add(text)
    out.push(text)
    if (out.length >= count) break
  }
  return out
}

function tierOf(n) {
  if (n <= 8) return 'tutorial'
  if (n <= 20) return 'easy'
  if (n <= 38) return 'medium'
  if (n <= 58) return 'medium2'
  if (n <= 78) return 'hard'
  if (n <= 92) return 'hard2'
  return 'expert'
}

function gridOf(n, rand) {
  const t = tierOf(n)
  if (t === 'tutorial') return { x: 3, y: 3 }
  if (t === 'easy') return n <= 14 ? { x: 4, y: 4 } : { x: 4, y: 5 }
  if (t === 'medium') return rand() < 0.5 ? { x: 5, y: 5 } : { x: 5, y: 4 }
  if (t === 'medium2') return rand() < 0.5 ? { x: 6, y: 6 } : { x: 5, y: 6 }
  if (t === 'hard') return rand() < 0.5 ? { x: 6, y: 6 } : { x: 6, y: 7 }
  if (t === 'hard2') return rand() < 0.5 ? { x: 7, y: 7 } : { x: 7, y: 8 }
  return { x: 8, y: 8 }
}

function wordCountOf(n, rand) {
  const t = tierOf(n)
  if (t === 'tutorial') return n <= 4 ? 2 : 3
  if (t === 'easy') return n <= 14 ? 3 : 4
  if (t === 'medium') return 4
  if (t === 'medium2') return rand() < 0.5 ? 4 : 5
  if (t === 'hard') return 5
  if (t === 'hard2') return 6
  return rand() < 0.5 ? 6 : 7
}

function chainSizesOf(n, rand) {
  const t = tierOf(n)
  if (n < 17) return []
  if (t === 'easy') return [2]
  if (t === 'medium') return rand() < 0.5 ? [2] : [2, 2]
  if (t === 'medium2') return rand() < 0.5 ? [2, 2] : [2, 2, 2]
  if (t === 'hard') return rand() < 0.5 ? [2, 2] : [3, 2]
  if (t === 'hard2') return rand() < 0.5 ? [3, 2] : [2, 2, 2]
  return rand() < 0.5 ? [3, 2] : [3, 2, 2]
}

function obstaclesOf(n) {
  const plan = {}
  if (n >= 30) plan.ice = n >= 79 ? 2 : 1
  if (n >= 43) plan.bomb = n >= 92 ? 2 : 1
  if (n >= 52) plan.lock = 1
  if (n >= 68) plan.stone = n >= 90 ? 2 : 1
  plan.iceHp = n >= 79 ? 3 : 2
  plan.bombCountdown = n < 60 ? 8 : n < 82 ? 6 : 4
  return plan
}

function makeSpec(lang, n) {
  const rand = mulberry32(hashSeed(`${lang}:${n}`) ^ (n * 2654435761))
  const grid = gridOf(n, rand)
  const count = wordCountOf(n, rand)
  const allowLong = n >= 21
  const texts = pickWords(lang, rand, count + 2, allowLong).slice(0, count)

  const words = texts.map((text, i) => ({ id: `w${i + 1}`, text, hint: '' }))

  // 链：按 chainSizes 顺序分组，长度和需 ≤ 行数，否则余下的作普通词
  const chains = []
  let cursor = 0
  for (const size of chainSizesOf(n, rand)) {
    const group = words.slice(cursor, cursor + size)
    if (group.length < size) break
    const sum = group.reduce((acc, w) => acc + w.text.length, 0)
    if (sum > grid.y) break
    chains.push(group.map((w) => w.id))
    cursor += size
  }

  return {
    id: `wf_${lang === 'zh-CN' ? 'zh' : 'en'}_${String(n).padStart(3, '0')}`,
    language: lang,
    theme: lang === 'zh-CN' ? ZH_THEMES[n % ZH_THEMES.length] : EN_THEMES[n % EN_THEMES.length],
    tier: tierOf(n),
    grid,
    words,
    chains,
    obstacles: obstaclesOf(n),
    bonus: [],
  }
}

// ---------------- 摆放 ----------------

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
  const wordCells = new Map()

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
      const y = top + i
      cells[y][column] = byId.get(cell.id).text[cell.index]
      if (!wordCells.has(cell.id)) wordCells.set(cell.id, [])
      wordCells.get(cell.id).push([column, y])
    })
  }

  for (const word of shuffle(words.filter((w) => !chained.has(w.id)).slice(), random)) {
    const path = tryPlaceStraight(cells, cols, rows, word.text, random)
    if (!path) return null
    wordCells.set(word.id, path)
  }

  const usedChars = new Set(words.flatMap((w) => [...w.text]))
  let pool = (spec.language === 'zh-CN' ? ZH_FILLER : EN_FILLER).filter((c) => !usedChars.has(c))
  if (pool.length < 6) pool = spec.language === 'zh-CN' ? ZH_FILLER : EN_FILLER
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!cells[y][x]) cells[y][x] = pool[Math.floor(random() * pool.length)]
    }
  }

  return { rows: cells.map((row) => row.join('')), wordCells }
}

function assignObstacles(spec, wordCells, random) {
  const plan = spec.obstacles || {}
  const obstacles = {}
  const used = new Set()
  const entries = [...wordCells.entries()]

  const pickCell = () => {
    for (const [id, cells] of shuffle(entries.slice(), random)) {
      for (const [x, y] of shuffle(cells.slice(), random)) {
        const key = `${x},${y}`
        if (!used.has(key)) return { id, x, y, key }
      }
    }
    return null
  }

  const add = (type, extra) => {
    const cell = pickCell()
    if (!cell) return
    obstacles[cell.key] = { type, ...extra }
    used.add(cell.key)
  }

  for (let i = 0; i < (plan.ice || 0); i += 1) add('ice', { hp: plan.iceHp || 2 })
  for (let i = 0; i < (plan.bomb || 0); i += 1) add('bomb', { countdown: plan.bombCountdown || 6 })
  for (let i = 0; i < (plan.stone || 0); i += 1) add('stone', {})
  for (let i = 0; i < (plan.lock || 0); i += 1) {
    const cell = pickCell()
    if (!cell) continue
    const candidates = spec.words.filter(
      (w) => w.id !== cell.id && !(wordCells.get(w.id) || []).some(([x, y]) => x === cell.x && y === cell.y),
    )
    const keyWord = candidates.length ? candidates[Math.floor(random() * candidates.length)] : null
    obstacles[cell.key] = { type: 'lock', lockKey: keyWord ? keyWord.id : null }
    used.add(cell.key)
  }
  return obstacles
}

function buildLevel(spec, seed) {
  const random = mulberry32(seed)
  const built = buildBoard(spec, random)
  if (!built) return null

  const obstacles = assignObstacles(spec, built.wordCells, random)
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
    reward: spec.reward ?? { coins: 40 + spec.words.length * 12, stars: 3 },
    words: spec.words.map((word) => ({ id: word.id, text: word.text, hint: word.hint })),
    bonus: spec.bonus || [],
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

  const usedCells = new Set()
  for (const step of flow) {
    for (const [x, y] of step.path) usedCells.add(`${x},${y}`)
    for (const cascade of step.cascades || []) {
      for (const [x, y] of cascade.path) usedCells.add(`${x},${y}`)
    }
  }
  for (const tile of level.initial_board) {
    if (tile.type !== 'normal' && !usedCells.has(`${tile.x},${tile.y}`)) return null
  }
  return level
}

function buildWithFallback(spec) {
  const base = hashSeed(spec.id)
  const variants = [
    spec,
    { ...spec, obstacles: undefined },
    { ...spec, obstacles: undefined, chains: undefined },
    {
      ...spec,
      obstacles: undefined,
      chains: undefined,
      words: spec.words.slice(0, Math.max(2, spec.words.length - 1)),
    },
  ]
  for (let v = 0; v < variants.length; v += 1) {
    const variant = variants[v]
    for (let a = 0; a < 240; a += 1) {
      const built = buildLevel(variant, base + a * 7919 + v * 104729 + 1)
      if (built) return built
    }
  }
  return null
}

function generate() {
  const levels = []
  const report = []
  for (const lang of ['zh-CN', 'en-US']) {
    for (let n = 1; n <= LEVELS_PER_LANGUAGE; n += 1) {
      const spec = makeSpec(lang, n)
      const level = buildWithFallback(spec)
      if (!level) {
        report.push(`FAIL  ${spec.id}`)
        continue
      }
      levels.push(level)
      if (n % 20 === 0 || n <= 3) {
        const g = level.grid_dim
        const obs = level.initial_board.filter((t) => t.type !== 'normal').length
        report.push(
          `OK    ${level.id}  ${g.x}x${g.y}  words=${level.target_words.length}  flow=${level.solution_flow.length}  obstacles=${obs}  tier=${level.tier}`,
        )
      }
    }
  }
  return { levels, report }
}

const { levels, report } = generate()
for (const line of report) console.log(line)

const header = `// 本文件由 tools/generate-levels.mjs 自动生成，请勿手改。\n// 语言：zh-CN / en-US\n\n`
const body = `export const LEVELS = ${JSON.stringify(levels, null, 2)}\n\nexport const LEVELS_BY_LANGUAGE = {\n  'zh-CN': LEVELS.filter((l) => l.language === 'zh-CN'),\n  'en-US': LEVELS.filter((l) => l.language === 'en-US'),\n}\n\nexport function getLevel(id) {\n  return LEVELS.find((level) => level.id === id) || null\n}\n`

writeFileSync(join(__dirname, '..', 'src', 'data', 'levels.js'), header + body)
console.log(`\n已写入 ${levels.length} 个关卡 -> src/data/levels.js`)
