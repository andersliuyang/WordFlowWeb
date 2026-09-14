import { t } from '../i18n/index.js'

/**
 * 游戏内情境提示（coach mark）：高亮目标区域并弹出说明卡片。
 * anchor 为 DOM 元素或返回元素的函数；为空时卡片居中显示。
 */
export function mountCoach({ anchor, title, body, onClose }) {
  const el = document.createElement('div')
  el.className = 'coach'
  el.innerHTML = `
    <div class="coach__ring" data-role="ring"></div>
    <div class="coach__card">
      <h4 class="coach__title"></h4>
      <p class="coach__body"></p>
      <button class="btn btn--primary" data-role="ok" type="button">${t('gotIt')}</button>
    </div>
  `
  el.querySelector('.coach__title').textContent = title
  el.querySelector('.coach__body').textContent = body
  document.body.appendChild(el)

  const ring = el.querySelector('[data-role="ring"]')
  const card = el.querySelector('.coach__card')

  function resolveAnchor() {
    return typeof anchor === 'function' ? anchor() : anchor
  }

  function layout() {
    const node = resolveAnchor()
    const rect = node && node.getBoundingClientRect ? node.getBoundingClientRect() : null
    if (!rect || rect.width === 0 || rect.height === 0) {
      ring.hidden = true
      card.style.left = '50%'
      card.style.top = '50%'
      card.style.transform = 'translate(-50%, -50%)'
      return
    }
    const pad = 8
    ring.hidden = false
    ring.style.left = `${rect.left - pad}px`
    ring.style.top = `${rect.top - pad}px`
    ring.style.width = `${rect.width + pad * 2}px`
    ring.style.height = `${rect.height + pad * 2}px`

    const below = rect.bottom + 180 < window.innerHeight
    card.style.left = '50%'
    card.style.transform = 'translateX(-50%)'
    card.style.top = below ? `${rect.bottom + 16}px` : `${Math.max(12, rect.top - 170)}px`
  }

  layout()
  window.addEventListener('resize', layout)

  function close() {
    onClose?.()
  }
  el.querySelector('[data-role="ok"]').addEventListener('click', close)
  ring.addEventListener('click', close)
  el.addEventListener('click', (event) => {
    if (event.target === el) close()
  })

  return {
    el,
    relayout: layout,
    dispose() {
      window.removeEventListener('resize', layout)
      el.remove()
    },
  }
}
