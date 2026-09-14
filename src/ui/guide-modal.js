import { t, getGuide } from '../i18n/index.js'

function tile(x, y, char, fill = '#f6ede2', stroke = '#cbb6a8', color = '#5b5349') {
  return `<rect x="${x}" y="${y}" width="44" height="44" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + 22}" y="${y + 29}" text-anchor="middle" font-size="22" font-weight="700" fill="${color}" font-family="PingFang SC,Microsoft YaHei,sans-serif">${char}</text>`
}

const VISUALS = {
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
  obstacles: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
    ${tile(24, 34, '冰', '#cfe6ef', '#9dc4d4')}
    ${tile(108, 34, '锁', '#d9dde3', '#aab2bd')}
    ${tile(192, 34, '炸', '#f0d7d0', '#dba99c')}
    <circle cx="224" cy="46" r="12" fill="#d97b6c"/>
    <text x="224" y="51" text-anchor="middle" font-size="13" font-weight="700" fill="#fff6ee" font-family="PingFang SC,sans-serif">3</text>
    <text x="130" y="108" text-anchor="middle" font-size="14" fill="#8f887c" font-family="PingFang SC,sans-serif">两次 · 解锁 · 倒计时</text>
  </svg>`,
  hint: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
    <rect x="18" y="40" width="66" height="36" rx="18" fill="#fdfaf5" stroke="#cbb6a8" stroke-width="2"/>
    <text x="51" y="63" text-anchor="middle" font-size="15" fill="#5b5349" font-family="PingFang SC,sans-serif">提示</text>
    <rect x="96" y="40" width="66" height="36" rx="18" fill="#fdfaf5" stroke="#cbb6a8" stroke-width="2"/>
    <text x="129" y="63" text-anchor="middle" font-size="15" fill="#5b5349" font-family="PingFang SC,sans-serif">定向</text>
    <rect x="174" y="40" width="66" height="36" rx="18" fill="#fdfaf5" stroke="#cbb6a8" stroke-width="2"/>
    <text x="207" y="63" text-anchor="middle" font-size="15" fill="#5b5349" font-family="PingFang SC,sans-serif">魔棒</text>
    <text x="130" y="104" text-anchor="middle" font-size="14" fill="#8f887c" font-family="PingFang SC,sans-serif">20 · 40 · 80 金币</text>
  </svg>`,
  goal: `<svg viewBox="0 0 260 120" role="img" aria-hidden="true">
    <text x="130" y="66" text-anchor="middle" font-size="46" fill="#e2b25e" font-family="PingFang SC,sans-serif">★ ★ ★</text>
    <text x="130" y="104" text-anchor="middle" font-size="15" fill="#8f887c" font-family="PingFang SC,sans-serif">消完全部目标词通关</text>
  </svg>`,
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

  function render() {
    const step = steps[index]
    el.querySelector('[data-role="visual"]').innerHTML = VISUALS[step.visual] || ''
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
