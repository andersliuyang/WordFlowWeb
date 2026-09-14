import { t, getGuide, getLanguage } from '../i18n/index.js'

function tile(x, y, char, fill = '#f6ede2', stroke = '#cbb6a8', color = '#5b5349') {
  return `<rect x="${x}" y="${y}" width="44" height="44" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + 22}" y="${y + 29}" text-anchor="middle" font-size="22" font-weight="700" fill="${color}" font-family="PingFang SC,Microsoft YaHei,Arial,sans-serif">${char}</text>`
}

const ICON_PATHS = {
  hint: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 1 4 10.4V16H8v-2.6A6 6 0 0 1 12 3z"/>',
  target:
    '<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
  wand: '<path d="M4 20l10-10"/><path d="M15 3.5l.9 2.1L18 6.5l-2.1.9L15 9.5l-.9-2.1L12 6.5l2.1-.9z" fill="currentColor" stroke="none"/><path d="M19.5 12.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor" stroke="none"/>',
  shuffle:
    '<path d="M16 4l4 3-4 3"/><path d="M20 7H8a4 4 0 0 0-4 4"/><path d="M16 14l4 3-4 3"/><path d="M20 17H8a4 4 0 0 1-4-4"/>',
  coin: '<circle cx="12" cy="12" r="9" fill="#e7b84f" stroke="#c8912f" stroke-width="1.6"/><circle cx="12" cy="12" r="5.7" fill="none" stroke="#f7dd9b" stroke-width="1.4"/><path d="M9 8.4l3 3.8 3-3.8M12 12.2V16M9.6 12.9h4.8M9.6 14.9h4.8" fill="none" stroke="#8a5a18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
}

function iconG(paths, x, y, px = 20, color = '#5b5349') {
  const s = px / 24
  return `<g transform="translate(${x},${y}) scale(${s})" color="${color}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`
}

function chip(x, y, paths) {
  return (
    `<rect x="${x}" y="${y}" width="44" height="44" rx="14" fill="#fdfaf5" stroke="#cbb6a8" stroke-width="2"/>` +
    iconG(paths, x + 12, y + 12, 20)
  )
}

function hintVisual(costText, font) {
  return `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
    ${chip(15, 20, ICON_PATHS.hint)}
    ${chip(73, 20, ICON_PATHS.target)}
    ${chip(131, 20, ICON_PATHS.wand)}
    ${chip(189, 20, ICON_PATHS.shuffle)}
    ${iconG(ICON_PATHS.coin, 74, 82, 18)}
    <text x="98" y="96" text-anchor="start" font-size="14" fill="#8f887c" font-family="${font}">${costText}</text>
  </svg>`
}

function frostLines(x, y) {
  let out = ''
  for (let i = 0; i < 3; i += 1) {
    const yy = y + 14 + i * 10
    out += `<line x1="${x + 8}" y1="${yy}" x2="${x + 36}" y2="${yy + 3}" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>`
  }
  return out
}

function iceTile(x, y) {
  return `<rect x="${x}" y="${y}" width="44" height="44" rx="12" fill="#cfe6ef" stroke="#9dc4d4" stroke-width="2"/>${frostLines(x, y)}`
}

function lockTile(x, y) {
  return `<rect x="${x}" y="${y}" width="44" height="44" rx="12" fill="#d9dde3" stroke="#aab2bd" stroke-width="2"/>
    <path d="M${x + 14} ${y + 22} a8 8 0 0 1 16 0" fill="none" stroke="#3f3a33" stroke-width="4" stroke-linecap="round"/>
    <rect x="${x + 10}" y="${y + 20}" width="24" height="18" rx="4" fill="#3f3a33"/>
    <circle cx="${x + 22}" cy="${y + 27}" r="3" fill="#f2e9dd"/>
    <rect x="${x + 20.4}" y="${y + 27}" width="3.2" height="7" fill="#f2e9dd"/>`
}

function bombTile(x, y) {
  return `<rect x="${x}" y="${y}" width="44" height="44" rx="12" fill="#f0d7d0" stroke="#dba99c" stroke-width="2"/>
    <circle cx="${x + 22}" cy="${y + 27}" r="12" fill="#4a4740"/>
    <circle cx="${x + 18}" cy="${y + 23}" r="3.4" fill="rgba(255,255,255,0.32)"/>
    <path d="M${x + 26} ${y + 17} q 7 -6 2 -13" fill="none" stroke="#8a6a4f" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${x + 28}" cy="${y + 4.5}" r="2.6" fill="#f6b23e"/>`
}

function obstaclesVisual(label, font) {
  return `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
    ${iceTile(24, 32)}
    ${lockTile(108, 32)}
    ${bombTile(192, 32)}
    <circle cx="${192 + 38}" cy="${32 + 8}" r="9" fill="#d97b6c"/>
    <text x="${192 + 38}" y="${32 + 12}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff6ee" font-family="${font}">3</text>
    <text x="130" y="104" text-anchor="middle" font-size="13" fill="#8f887c" font-family="${font}">${label}</text>
  </svg>`
}

const VISUALS = {
  'zh-CN': {
    connect: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(20, 30, '山', '#f5dca0', '#d8a85c')}
      ${tile(74, 30, '水', '#f5dca0', '#d8a85c')}
      ${tile(128, 30, '云')}
      ${tile(182, 30, '风')}
      <path d="M42 86 C 70 106, 96 106, 118 86" stroke="#d0a48f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="42" cy="86" r="4" fill="#d0a48f"/>
      <circle cx="118" cy="86" r="4" fill="#d0a48f"/>
    </svg>`,
    gravity: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(70, 6, '花', '#f2e6d8', '#e0d0c0', '#c3b4a4')}
      ${tile(70, 60, '月')}
      <path d="M150 24 L150 86" stroke="#aec1d4" stroke-width="4" stroke-linecap="round"/>
      <path d="M140 74 L150 90 L160 74" stroke="#aec1d4" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="202" y="66" text-anchor="middle" font-size="14" fill="#8f887c" font-family="PingFang SC,sans-serif">下落 / 级联</text>
    </svg>`,
    bonus: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(58, 34, '春', '#cfe0d6', '#a9c4b6')}
      ${tile(110, 34, '风', '#cfe0d6', '#a9c4b6')}
      <rect x="162" y="34" width="44" height="44" rx="12" fill="none" stroke="#cbb6a8" stroke-width="2" stroke-dasharray="6 5"/>
      <text x="130" y="106" text-anchor="middle" font-size="15" font-weight="700" fill="#d0a48f" font-family="PingFang SC,sans-serif">+ 金币 / 道具</text>
    </svg>`,
    obstacles: obstaclesVisual('两次 · 解锁 · 倒计时', 'PingFang SC,sans-serif'),
    hint: hintVisual('20 · 40 · 80 · 30 金币', 'PingFang SC,sans-serif'),
    goal: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      <text x="130" y="66" text-anchor="middle" font-size="46" fill="#e2b25e" font-family="PingFang SC,sans-serif">★ ★ ★</text>
      <text x="130" y="104" text-anchor="middle" font-size="15" fill="#8f887c" font-family="PingFang SC,sans-serif">消完全部目标词通关</text>
    </svg>`,
  },
  'en-US': {
    connect: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(20, 30, 'C', '#f5dca0', '#d8a85c')}
      ${tile(74, 30, 'A', '#f5dca0', '#d8a85c')}
      ${tile(128, 30, 'T')}
      ${tile(182, 30, 'S')}
      <path d="M42 86 C 70 106, 96 106, 118 86" stroke="#d0a48f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="42" cy="86" r="4" fill="#d0a48f"/>
      <circle cx="118" cy="86" r="4" fill="#d0a48f"/>
    </svg>`,
    gravity: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(70, 6, 'L', '#f2e6d8', '#e0d0c0', '#c3b4a4')}
      ${tile(70, 60, 'A')}
      <path d="M150 24 L150 86" stroke="#aec1d4" stroke-width="4" stroke-linecap="round"/>
      <path d="M140 74 L150 90 L160 74" stroke="#aec1d4" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="202" y="60" text-anchor="middle" font-size="13" fill="#8f887c" font-family="Arial,sans-serif">Fall &amp;</text>
      <text x="202" y="76" text-anchor="middle" font-size="13" fill="#8f887c" font-family="Arial,sans-serif">cascade</text>
    </svg>`,
    bonus: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      ${tile(58, 34, 'S', '#cfe0d6', '#a9c4b6')}
      ${tile(110, 34, 'U', '#cfe0d6', '#a9c4b6')}
      <rect x="162" y="34" width="44" height="44" rx="12" fill="none" stroke="#cbb6a8" stroke-width="2" stroke-dasharray="6 5"/>
      <text x="130" y="106" text-anchor="middle" font-size="14" font-weight="700" fill="#d0a48f" font-family="Arial,sans-serif">+ coins / items</text>
    </svg>`,
    obstacles: obstaclesVisual('2x · Unlock · Timer', 'Arial,sans-serif'),
    hint: hintVisual('20 · 40 · 80 · 30 coins', 'Arial,sans-serif'),
    goal: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
      <text x="130" y="66" text-anchor="middle" font-size="46" fill="#e2b25e" font-family="Arial,sans-serif">★ ★ ★</text>
      <text x="130" y="104" text-anchor="middle" font-size="14" fill="#8f887c" font-family="Arial,sans-serif">Clear every target word</text>
    </svg>`,
  },
}

/**
 * 玩法向导（分步指南，支持点击 / 滑动翻页）。
 */
export function mountGuideModal({ onClose }) {
  const steps = getGuide()
  let index = 0

  const el = document.createElement('div')
  el.className = 'modal guide'
  el.innerHTML = `
    <div class="modal__panel guide__panel">
      <button class="guide__close" data-role="close" type="button" aria-label="close">×</button>
      <div class="guide__visual" data-role="visual"></div>
      <h2 class="guide__title" data-role="title"></h2>
      <p class="guide__body" data-role="body"></p>
      <div class="guide__dots" data-role="dots"></div>
      <div class="guide__actions">
        <button class="btn btn--ghost" data-role="skip" type="button">${t('guideSkip')}</button>
        <button class="btn btn--primary" data-role="next" type="button">${t('guideNext')}</button>
      </div>
    </div>
  `

  const visualsByLang = VISUALS[getLanguage()] || VISUALS['zh-CN']

  function render() {
    const step = steps[index]
    el.querySelector('[data-role="visual"]').innerHTML = visualsByLang[step.visual] || ''
    el.querySelector('[data-role="title"]').textContent = step.title
    el.querySelector('[data-role="body"]').textContent = step.body
    el.querySelector('[data-role="dots"]').innerHTML = steps
      .map((_, i) => `<span class="dot ${i === index ? 'dot--on' : ''}"></span>`)
      .join('')
    el.querySelector('[data-role="next"]').textContent =
      index === steps.length - 1 ? t('guideStart') : t('guideNext')
  }

  function next() {
    if (index < steps.length - 1) {
      index += 1
      render()
    } else {
      onClose?.()
    }
  }

  function prev() {
    if (index > 0) {
      index -= 1
      render()
    }
  }

  el.querySelector('[data-role="next"]').addEventListener('click', next)
  el.querySelector('[data-role="skip"]').addEventListener('click', () => onClose?.())
  el.querySelector('[data-role="close"]').addEventListener('click', () => onClose?.())
  el.addEventListener('click', (event) => {
    if (event.target === el) onClose?.()
  })

  let startX = 0
  el.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX
  }, { passive: true })
  el.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - startX
    if (Math.abs(dx) < 40) return
    if (dx < 0) next()
    else prev()
  })

  render()
  return { el }
}
