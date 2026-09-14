import './styles/main.css'
import { mountHomeScreen } from './ui/home-screen.js'
import { mountLevelSelect } from './ui/level-select.js'
import { mountGameScreen } from './ui/game-screen.js'
import { mountSettingsModal } from './ui/settings-modal.js'
import { mountGuideModal } from './ui/guide-modal.js'
import { createHomeScene } from './engine/home-scene.js'
import { createZenBgm } from './audio/zen-bgm.js'
import { setSfxEnabled, playButton } from './audio/sfx.js'
import { setLanguage, getLanguage } from './i18n/index.js'
import { saveStore } from './store/save.js'
import { LEVELS, getLevel } from './data/levels.js'

function faviconSvg(letter) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6ede2"/><stop offset="1" stop-color="#e4d3c4"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf5ee"/><stop offset="1" stop-color="#efe3d6"/></linearGradient></defs><polygon points="10,14 17,7 61,7 54,14" fill="url(#t)"/><polygon points="54,14 61,7 61,51 54,58" fill="#d8c6b8"/><rect x="10" y="14" width="44" height="44" rx="10" fill="url(#f)" stroke="#cbb6a8" stroke-width="2.5"/><text x="32" y="34" text-anchor="middle" dominant-baseline="central" font-family="PingFang SC,Microsoft YaHei,Arial,sans-serif" font-size="30" font-weight="700" fill="#5b5349">${letter}</text></svg>`
}

function applyLanguageChrome() {
  const zh = getLanguage() === 'zh-CN'
  document.documentElement.lang = zh ? 'zh-CN' : 'en'
  document.title = zh ? 'WordFlow 字·谜' : 'WordFlow'
  const link = document.querySelector('link[rel="icon"]')
  if (link) {
    const svg = faviconSvg(zh ? '字' : 'W')
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
  }
}

export function startApp() {
  const root = document.getElementById('app')
  let current = null
  let currentRefresh = null

  // 首次进入按浏览器语言识别；中文 → 中文，其它 → 英文
  if (!saveStore.settings.language) {
    const detected = String(navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
    saveStore.setSetting('language', detected)
  }
  setLanguage(saveStore.settings.language)
  applyLanguageChrome()
  setSfxEnabled(saveStore.settings.sfx)

  // 全局按钮点击音效（委托）
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('button')
    if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return
    playButton()
  })

  const bgm = createZenBgm({ volume: saveStore.settings.volume })
  let bgmStarted = false

  function applyBgm() {
    if (!saveStore.settings.bgm) {
      bgm.setVolume(0)
      return
    }
    if (bgmStarted) {
      bgm.start()
      bgm.setVolume(saveStore.settings.volume)
    }
  }

  function unlockAudio() {
    if (bgmStarted) return
    bgmStarted = true
    bgm.start()
    applyBgm()
    window.removeEventListener('pointerdown', unlockAudio)
    window.removeEventListener('keydown', unlockAudio)
    window.removeEventListener('touchstart', unlockAudio)
  }
  window.addEventListener('pointerdown', unlockAudio)
  window.addEventListener('keydown', unlockAudio)
  window.addEventListener('touchstart', unlockAudio)

  function mount(screen, refresh) {
    if (current) {
      current.dispose?.()
      current.el.remove()
    }
    current = screen
    currentRefresh = refresh || null
    root.appendChild(screen.el)
  }

  function refreshCurrent() {
    currentRefresh?.()
  }

  function showHome() {
    const screen = mountHomeScreen({
      onStart: () => showLevelSelect(),
      onSettings: () => openSettings(),
      onGuide: () => openGuide(),
    })
    const scene = createHomeScene(screen.canvas)
    mount({ el: screen.el, dispose: () => scene.dispose() }, () => showHome())
  }

  function showLevelSelect() {
    const screen = mountLevelSelect({
      levels: LEVELS,
      save: saveStore,
      onPlay: (id) => showGame(id),
      onBack: () => showHome(),
      onSettings: () => openSettings(),
      onGuide: () => openGuide(),
    })
    mount(screen, () => showLevelSelect())
  }

  function nextLevelId(currentId) {
    const level = getLevel(currentId)
    const list = LEVELS.filter((entry) => entry.language === level.language)
    const index = list.findIndex((entry) => entry.id === currentId)
    return index >= 0 && index < list.length - 1 ? list[index + 1].id : null
  }

  function showGame(levelId) {
    const level = getLevel(levelId)
    if (!level) {
      showLevelSelect()
      return
    }
    const screen = mountGameScreen({
      level,
      onExit: () => showLevelSelect(),
      onRetry: () => showGame(levelId),
      onGuide: () => openGuide(),
      onNext: () => {
        const next = nextLevelId(levelId)
        if (next) showGame(next)
        else showLevelSelect()
      },
    })
    mount(screen)
  }

  function openSettings() {
    const modal = mountSettingsModal({
      save: saveStore,
      onClose: () => modal.el.remove(),
      onLanguageChange: (lang) => {
        setLanguage(lang)
        saveStore.setSetting('language', lang)
        applyLanguageChrome()
        modal.el.remove()
        refreshCurrent()
        openSettings()
      },
      onBgmChange: () => applyBgm(),
    })
    root.appendChild(modal.el)
  }

  function openGuide() {
    const modal = mountGuideModal({
      onClose: () => {
        modal.el.remove()
        if (!saveStore.flags.guideSeen) saveStore.setFlag('guideSeen', true)
      },
    })
    root.appendChild(modal.el)
  }

  showHome()
}
