import './styles/main.css'
import { mountHomeScreen } from './ui/home-screen.js'
import { mountLevelSelect } from './ui/level-select.js'
import { mountGameScreen } from './ui/game-screen.js'
import { mountSettingsModal } from './ui/settings-modal.js'
import { mountGuideModal } from './ui/guide-modal.js'
import { createHomeScene } from './engine/home-scene.js'
import { createZenBgm } from './audio/zen-bgm.js'
import { setSfxEnabled } from './audio/sfx.js'
import { setLanguage } from './i18n/index.js'
import { saveStore } from './store/save.js'
import { LEVELS, getLevel } from './data/levels.js'

export function startApp() {
  const root = document.getElementById('app')
  let current = null

  setLanguage(saveStore.settings.language)
  setSfxEnabled(saveStore.settings.sfx)

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

  function mount(screen) {
    if (current) {
      current.dispose?.()
      current.el.remove()
    }
    current = screen
    root.appendChild(screen.el)
  }

  function showHome() {
    const screen = mountHomeScreen({
      onStart: () => showLevelSelect(),
      onSettings: () => openSettings(),
      onGuide: () => openGuide(),
    })
    const scene = createHomeScene(screen.canvas)
    mount({ el: screen.el, dispose: () => scene.dispose() })
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
    mount(screen)
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
      onLanguageChange: (lang) => setLanguage(lang),
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
