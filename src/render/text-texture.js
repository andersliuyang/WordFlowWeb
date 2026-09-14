import * as THREE from 'three'

const cache = new Map()

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * 使用离屏 Canvas 2D 程序化生成字符纹理（零外部资源）。
 */
export function createTextTexture(text, options = {}) {
  const {
    size = 256,
    top = '#1c2b47',
    bottom = '#0c1425',
    color = '#eaf4ff',
    accent = '#59c2ff',
    fontFamily = '"PingFang SC","Microsoft YaHei","Segoe UI",sans-serif',
  } = options

  const key = [text, size, top, bottom, color, accent].join('|')
  if (cache.has(key)) return cache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const pad = size * 0.05
  const radius = size * 0.22

  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, top)
  grad.addColorStop(1, bottom)
  ctx.fillStyle = grad
  roundRect(ctx, pad, pad, size - pad * 2, size - pad * 2, radius)
  ctx.fill()

  ctx.lineWidth = size * 0.028
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.5
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = text.length > 1 ? size * 0.42 : size * 0.56
  ctx.font = `700 ${fontSize}px ${fontFamily}`
  ctx.shadowColor = accent
  ctx.shadowBlur = size * 0.12
  ctx.fillStyle = color
  ctx.fillText(text, size / 2, size / 2 + size * 0.03)
  ctx.shadowBlur = 0

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  cache.set(key, texture)
  return texture
}

export function disposeTextTextureCache() {
  for (const texture of cache.values()) texture.dispose()
  cache.clear()
}
