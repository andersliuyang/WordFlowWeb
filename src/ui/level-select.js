import { t, getLanguage } from '../i18n/index.js'

function starsMarkup(stars) {
  let out = ''
  for (let i = 0; i < 3; i += 1) out += `<span class="star ${i < stars ? 'star--on' : ''}">★</span>`
  return out
}

/**
 * 关卡选择。每个语言分组内按顺序解锁（完成前一关解锁下一关）。
 */
export function mountLevelSelect({ levels, save, onPlay, onBack, onSettings, onGuide }) {
  const el = document.createElement('div')
  el.className = 'screen level-select'

  // 中文用户显示中英两组；非中文只显示英文
  const groups =
    getLanguage() === 'zh-CN'
      ? [
          { language: 'zh-CN', label: '中文' },
          { language: 'en-US', label: 'English' },
        ]
      : [{ language: 'en-US', label: 'English' }]

  const sections = groups
    .map((group) => {
      const list = levels.filter((level) => level.language === group.language)
      const cards = list
        .map((level, index) => {
          const prev = index > 0 ? list[index - 1] : null
          const unlocked = index === 0 || (prev && save.isCompleted(prev.id))
          const stars = save.levelStars(level.id)
          const state = unlocked ? '' : 'level-card--locked'
          const disabled = unlocked ? '' : 'disabled'
          return `
            <button class="level-card ${state}" data-id="${level.id}" type="button" ${disabled}>
              <span class="level-card__no">${String(index + 1).padStart(2, '0')}</span>
              <span class="level-card__theme">${level.theme}</span>
              <span class="level-card__stars">${unlocked ? starsMarkup(stars) : '<span class="lock">🔒</span>'}</span>
            </button>
          `
        })
        .join('')
      return `
        <section class="level-group">
          ${groups.length > 1 ? `<h2 class="level-group__title">${group.label}</h2>` : ''}
          <div class="level-grid">${cards}</div>
        </section>
      `
    })
    .join('')

  el.innerHTML = `
    <header class="screen__bar">
      <button class="icon-btn" data-role="back" type="button">←</button>
      <h1 class="screen__title">${t('levelSelect')}</h1>
      <button class="icon-btn" data-role="guide" type="button" title="${t('guide')}">?</button>
      <button class="icon-btn" data-role="settings" type="button">⚙</button>
    </header>
    <div class="screen__body">${sections}</div>
  `

  el.querySelector('[data-role="back"]').addEventListener('click', () => onBack?.())
  el.querySelector('[data-role="settings"]').addEventListener('click', () => onSettings?.())
  el.querySelector('[data-role="guide"]').addEventListener('click', () => onGuide?.())
  el.querySelectorAll('.level-card:not(.level-card--locked)').forEach((button) => {
    button.addEventListener('click', () => onPlay?.(button.dataset.id))
  })

  return { el }
}
