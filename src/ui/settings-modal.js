import { t, setLanguage, getLanguage } from '../i18n/index.js'

export function mountSettingsModal({ save, onClose, onLanguageChange, onBgmChange }) {
  const el = document.createElement('div')
  el.className = 'modal'
  const settings = save.settings

  el.innerHTML = `
    <div class="modal__panel">
      <h2 class="modal__title">${t('settings')}</h2>
      <div class="field">
        <span class="field__label">${t('language')}</span>
        <div class="segmented">
          <button type="button" data-lang="zh-CN" class="${getLanguage() === 'zh-CN' ? 'is-active' : ''}">中文</button>
          <button type="button" data-lang="en-US" class="${getLanguage() === 'en-US' ? 'is-active' : ''}">English</button>
        </div>
      </div>
      <div class="field">
        <span class="field__label">${t('audio')}</span>
        <button class="toggle ${settings.sfx ? 'is-on' : ''}" data-role="sfx" type="button"><span></span></button>
      </div>
      <div class="field">
        <span class="field__label">${t('music')}</span>
        <button class="toggle ${settings.bgm ? 'is-on' : ''}" data-role="bgm" type="button"><span></span></button>
      </div>
      <div class="field">
        <span class="field__label">${t('volume')}</span>
        <input class="range" data-role="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}" />
      </div>
      <button class="btn btn--danger" data-role="reset" type="button">${t('resetProgress')}</button>
      <button class="btn btn--primary" data-role="close" type="button">${t('back')}</button>
    </div>
  `

  el.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang
      setLanguage(lang)
      save.setSetting('language', lang)
      el.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang))
      onLanguageChange?.(lang)
    })
  })

  el.querySelector('[data-role="sfx"]').addEventListener('click', (event) => {
    const next = !save.settings.sfx
    save.setSetting('sfx', next)
    event.currentTarget.classList.toggle('is-on', next)
  })

  el.querySelector('[data-role="bgm"]').addEventListener('click', (event) => {
    const next = !save.settings.bgm
    save.setSetting('bgm', next)
    event.currentTarget.classList.toggle('is-on', next)
    onBgmChange?.(next, save.settings.volume)
  })

  el.querySelector('[data-role="volume"]').addEventListener('input', (event) => {
    const value = Number(event.target.value)
    save.setSetting('volume', value)
    onBgmChange?.(save.settings.bgm, value)
  })

  el.querySelector('[data-role="reset"]').addEventListener('click', () => {
    if (window.confirm(t('resetConfirm'))) {
      save.reset()
      onClose?.(true)
    }
  })

  el.querySelector('[data-role="close"]').addEventListener('click', () => onClose?.(false))
  el.addEventListener('click', (event) => {
    if (event.target === el) onClose?.(false)
  })

  return { el }
}
