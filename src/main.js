import './styles/main.css'
import { mountHomeScreen } from './ui/home-screen.js'
import { createHomeScene } from './engine/home-scene.js'
import { showToast } from './ui/toast.js'

const root = document.getElementById('app')
const { canvas, startButton, settingsButton } = mountHomeScreen(root)

const homeScene = createHomeScene(canvas)

startButton.addEventListener('click', () => {
  showToast('游戏开发中 · 敬请期待')
})

settingsButton.addEventListener('click', () => {
  showToast('设置功能即将上线')
})

window.addEventListener('beforeunload', () => {
  homeScene.dispose()
})
