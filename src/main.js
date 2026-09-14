import './styles/main.css'
import { mountHomeScreen } from './ui/home-screen.js'
import { createHomeScene } from './engine/home-scene.js'
import { createZenBgm } from './audio/zen-bgm.js'
import { showToast } from './ui/toast.js'

const root = document.getElementById('app')
const { canvas, startButton, settingsButton } = mountHomeScreen(root)

const homeScene = createHomeScene(canvas)
const bgm = createZenBgm({ volume: 0.16 })

let audioStarted = false

function startAudio() {
  if (audioStarted) return
  audioStarted = true
  bgm.start()
  window.removeEventListener('pointerdown', startAudio)
  window.removeEventListener('keydown', startAudio)
  window.removeEventListener('touchstart', startAudio)
}

window.addEventListener('pointerdown', startAudio)
window.addEventListener('keydown', startAudio)
window.addEventListener('touchstart', startAudio)

startButton.addEventListener('click', () => {
  showToast('游戏开发中 · 敬请期待')
})

settingsButton.addEventListener('click', () => {
  showToast('设置功能即将上线')
})

window.addEventListener('beforeunload', () => {
  homeScene.dispose()
  bgm.dispose()
})
