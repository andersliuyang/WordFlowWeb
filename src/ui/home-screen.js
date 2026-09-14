/**
 * 首页 DOM 覆盖层。仅负责结构，不含玩法逻辑。
 */
export function mountHomeScreen(root) {
  root.innerHTML = `
    <div class="home">
      <canvas class="home__canvas" aria-hidden="true"></canvas>
      <div class="home__glow" aria-hidden="true"></div>
      <div class="home__content">
        <header class="home__header">
          <div class="brand">
            <span class="brand__en">WordFlow</span>
            <span class="brand__zh">字 · 谜</span>
          </div>
        </header>
        <main class="home__actions">
          <button class="btn btn--primary" id="btn-start" type="button">开始游戏</button>
          <button class="btn btn--ghost" id="btn-settings" type="button">设置</button>
        </main>
        <footer class="home__footer">
          <span>v0.1.0 · Preview</span>
        </footer>
      </div>
    </div>
  `

  return {
    canvas: root.querySelector('.home__canvas'),
    startButton: root.querySelector('#btn-start'),
    settingsButton: root.querySelector('#btn-settings'),
  }
}
