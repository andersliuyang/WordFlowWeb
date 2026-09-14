import { t, getLanguage } from '../i18n/index.js'

export function mountHomeScreen({ onStart, onSettings, onGuide }) {
  const el = document.createElement('div')
  el.className = 'home'
  const showZh = getLanguage() === 'zh-CN'
  el.innerHTML = `
    <canvas class="home__canvas" aria-hidden="true"></canvas>
    <div class="home__glow" aria-hidden="true"></div>
    <div class="home__content">
      <header class="home__header">
        <div class="brand">
          <span class="brand__en">WordFlow</span>
          ${showZh ? '<span class="brand__zh">字 · 谜</span>' : ''}
        </div>
      </header>
      <main class="home__actions">
        <button class="btn btn--primary" data-role="start" type="button">${t('start')}</button>
        <div class="home__links">
          <button class="btn btn--ghost" data-role="guide" type="button">${t('guide')}</button>
          <button class="btn btn--ghost" data-role="settings" type="button">${t('settings')}</button>
        </div>
      </main>
      <footer class="home__footer">
        <span>v0.1.0 · Preview</span>
      </footer>
    </div>
  `
  el.querySelector('[data-role="start"]').addEventListener('click', () => onStart?.())
  el.querySelector('[data-role="settings"]').addEventListener('click', () => onSettings?.())
  el.querySelector('[data-role="guide"]').addEventListener('click', () => onGuide?.())
  return {
    el,
    canvas: el.querySelector('.home__canvas'),
  }
}
