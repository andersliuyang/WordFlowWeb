const PALETTES = [
  { a: '#b9c7b3', b: '#d7b8b2', c: '#f0e4d6' },
  { a: '#aec1d4', b: '#c9b6d4', c: '#eef0f3' },
  { a: '#d0a48f', b: '#e0ccac', c: '#f6ece0' },
  { a: '#c3d6cd', b: '#e6c9c0', c: '#f3f0ea' },
  { a: '#b7a6c9', b: '#9fb8c9', c: '#eee8f0' },
  { a: '#c9c39a', b: '#dcb4a6', c: '#f4efe4' },
]

const THEME_MOTIF = {
  自然: 'leaf',
  四季: 'sun',
  山水: 'mountain',
  田园: 'wheat',
  风物: 'cloud',
  江河: 'wave',
  星月: 'moon',
  花木: 'flower',
  Nature: 'leaf',
  Seasons: 'sun',
  Animals: 'paw',
  Sky: 'cloud',
  Objects: 'gem',
  Elements: 'flame',
  Landscape: 'mountain',
}

function hash(str) {
  let h = 2166136261
  for (const ch of str) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const wrap = (inner) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`

const MOTIFS = {
  leaf: ({ a, b, c }) => wrap(`
    <path d="M50 10 C 18 30, 18 72, 50 90 C 82 72, 82 30, 50 10 Z" fill="${a}"/>
    <path d="M50 20 L50 82" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 40 L32 33 M50 53 L68 46 M50 66 L32 59" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="18" r="4" fill="${b}"/>`),
  mountain: ({ a, b, c }) => wrap(`
    <circle cx="74" cy="24" r="11" fill="${b}"/>
    <path d="M6 84 L36 32 L56 62 L68 46 L94 84 Z" fill="${a}"/>
    <path d="M36 32 L36 84 M68 46 L68 84" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`),
  sun: ({ a, b }) => {
    let rays = ''
    for (let i = 0; i < 8; i += 1) {
      const ang = (i * Math.PI) / 4
      rays += `<line x1="${50 + Math.cos(ang) * 26}" y1="${50 + Math.sin(ang) * 26}" x2="${50 + Math.cos(ang) * 38}" y2="${50 + Math.sin(ang) * 38}"/>`
    }
    return wrap(`<circle cx="50" cy="50" r="18" fill="${a}"/><g stroke="${b}" stroke-width="5" stroke-linecap="round">${rays}</g>`)
  },
  snow: ({ a, b }) => {
    let arms = ''
    for (let i = 0; i < 6; i += 1) {
      const ang = (i * Math.PI) / 3
      arms += `<line x1="50" y1="50" x2="${50 + Math.cos(ang) * 34}" y2="${50 + Math.sin(ang) * 34}"/>`
    }
    return wrap(`<g stroke="${a}" stroke-width="4" stroke-linecap="round">${arms}</g><circle cx="50" cy="50" r="6" fill="${b}"/>`)
  },
  wheat: ({ a, b }) => wrap(`
    <path d="M50 92 L50 30" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
    ${[0, 1, 2, 3]
      .map((i) => {
        const y = 34 + i * 14
        return `<path d="M50 ${y} q -16 -4 -20 -16 q 16 0 20 16" fill="${b}"/><path d="M50 ${y} q 16 -4 20 -16 q -16 0 -20 16" fill="${b}"/>`
      })
      .join('')}`),
  cloud: ({ a, b }) => wrap(`
    <path d="M28 66 a15 15 0 0 1 1 -30 a19 19 0 0 1 36 4 a13 13 0 0 1 -2 26 Z" fill="${a}"/>
    <circle cx="66" cy="30" r="8" fill="${b}"/>`),
  wave: ({ a, b }) => wrap(`
    <path d="M4 44 q 12 -14 24 0 t 24 0 t 24 0 t 20 0" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round"/>
    <path d="M4 64 q 12 -14 24 0 t 24 0 t 24 0 t 20 0" fill="none" stroke="${b}" stroke-width="6" stroke-linecap="round"/>`),
  moon: ({ a, b }) => wrap(`
    <path d="M62 16 a30 30 0 1 0 0 60 a23 23 0 1 1 0 -60 Z" fill="${a}"/>
    <path d="M74 26 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="${b}"/>`),
  flower: ({ a, b, c }) => {
    let petals = ''
    for (let i = 0; i < 5; i += 1) {
      const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2
      petals += `<circle cx="${50 + Math.cos(ang) * 20}" cy="${50 + Math.sin(ang) * 20}" r="14" fill="${a}"/>`
    }
    return wrap(`${petals}<circle cx="50" cy="50" r="10" fill="${b}"/><circle cx="50" cy="50" r="4" fill="${c}"/>`)
  },
  paw: ({ a, b }) => wrap(`
    <ellipse cx="50" cy="62" rx="18" ry="15" fill="${a}"/>
    <circle cx="28" cy="40" r="8" fill="${a}"/><circle cx="42" cy="30" r="8" fill="${a}"/>
    <circle cx="58" cy="30" r="8" fill="${a}"/><circle cx="72" cy="40" r="8" fill="${a}"/>
    <circle cx="50" cy="62" r="5" fill="${b}"/>`),
  gem: ({ a, b }) => wrap(`
    <polygon points="50,10 80,40 50,90 20,40" fill="${a}"/>
    <polygon points="50,10 80,40 50,46 20,40" fill="${b}"/>`),
  flame: ({ a, b }) => wrap(`
    <path d="M50 8 C 30 34, 26 48, 36 62 C 26 62, 28 78, 50 92 C 72 78, 74 62, 64 62 C 74 48, 70 34, 50 8 Z" fill="${a}"/>
    <path d="M50 40 C 44 52, 44 60, 50 68 C 56 60, 56 52, 50 40 Z" fill="${b}"/>`),
}

/** 取关卡的主题图案（内联 SVG 字符串）。 */
export function levelMotif(level) {
  const kind = THEME_MOTIF[level.theme] || 'leaf'
  const palette = PALETTES[hash(level.id) % PALETTES.length]
  const fn = MOTIFS[kind] || MOTIFS.leaf
  return fn(palette)
}
