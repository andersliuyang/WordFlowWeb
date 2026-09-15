/**
 * 应用图标：与游戏内一致的“字母骰子”。
 * DIE_SVG 用于浏览器图标；drawAppIcon 用 canvas 生成 PNG（iOS 主屏 / PWA 清单）。
 */
export const DIE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#f7f3ec"/>
  <g stroke-linejoin="round" stroke-linecap="round">
    <polygon points="32,7 57,21 32,35 7,21" fill="#f6ecdc" stroke="#e6d6c2" stroke-width="2"/>
    <polygon points="7,21 32,35 32,58 7,44" fill="#e3d3c0" stroke="#d3c1a9" stroke-width="2"/>
    <polygon points="32,35 57,21 57,44 32,58" fill="#d2bfa8" stroke="#c3ae94" stroke-width="2"/>
  </g>
  <g fill="#4f483f" font-family="Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle">
    <text x="32" y="26" font-size="14">W</text>
    <text x="19" y="45" font-size="13">O</text>
    <text x="45" y="45" font-size="13">R</text>
  </g>
</svg>`

const FACES = [
  { pts: [[32, 7], [57, 21], [32, 35], [7, 21]], fill: '#f6ecdc', letter: 'W', lx: 32, ly: 17 },
  { pts: [[7, 21], [32, 35], [32, 58], [7, 44]], fill: '#e3d3c0', letter: 'O', lx: 19, ly: 38 },
  { pts: [[32, 35], [57, 21], [57, 44], [32, 58]], fill: '#d2bfa8', letter: 'R', lx: 45, ly: 38 },
]

/** 用离屏 canvas 生成骰子图标 PNG（dataURL）。 */
export function drawAppIcon(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const s = size / 64

  ctx.fillStyle = '#f7f3ec'
  ctx.fillRect(0, 0, size, size)

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (const face of FACES) {
    ctx.beginPath()
    face.pts.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x * s, y * s)
      else ctx.lineTo(x * s, y * s)
    })
    ctx.closePath()
    ctx.fillStyle = face.fill
    ctx.fill()
    ctx.strokeStyle = 'rgba(150,130,105,0.35)'
    ctx.lineWidth = 2 * s
    ctx.stroke()
  }

  ctx.fillStyle = '#4f483f'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const face of FACES) {
    ctx.font = `700 ${13 * s}px Arial, Helvetica, sans-serif`
    ctx.fillText(face.letter, face.lx * s, face.ly * s)
  }

  return canvas.toDataURL('image/png')
}
