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
import { DIE_SVG, drawAppIcon } from './ui/app-icon.js'

function setupPwa() {
  const setLink = (rel, href, type) => {
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    if (type) link.type = type
    link.href = href
  }
  setLink('icon', `data:image/svg+xml,${encodeURIComponent(DIE_SVG)}`, 'image/svg+xml')

  try {
    setLink('apple-touch-icon', drawAppIcon(180))
    const manifest = {
      name: '字·谜',
      short_name: '字·谜',
      description: '字·谜 — 3D 消除填字游戏',
      start_url: './',
      scope: './',
      display: 'standalone',
      orientation: 'any',
      background_color: '#f7f3ec',
      theme_color: '#f7f3ec',
      icons: [
        { src: drawAppIcon(192), sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: drawAppIcon(512), sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    }
    setLink('manifest', `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`)
  } catch {
    /* canvas unavailable: keep favicon only */
  }
}

function isStandalone() {
  return (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true
  )
}

function addToHomeInfo() {
  if (isStandalone() || saveStore.flags.a2hsDismissed) return null
  const ua = navigator.userAgent || ''
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const android = /Android/i.test(ua)
  if (!ios && !android) return null
  return { ios, android }
}

function applyLanguageChrome() {
  const zh = getLanguage() === 'zh-CN'
  document.documentElement.lang = zh ? 'zh-CN' : 'en'
  document.title = '字·谜'
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
  setupPwa()
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
      a2hs: addToHomeInfo(),
      onDismissA2hs: () => saveStore.setFlag('a2hsDismissed', true),
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
