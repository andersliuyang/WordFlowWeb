import * as THREE from 'three'

const cache = new Map()

/**
 * 使用离屏 Canvas 2D 程序化生成字符纹理（零外部资源）。
 * 满幅绘制、无透明区域，避免在方块上出现黑边。
 * 默认配色为莫兰迪 / 马卡龙柔和色系。
 */
export function createTextTexture(text, options = {}) {
  const {
    size = 256,
    top = '#f6ede2',
    bottom = '#e4d3c4',
    color = '#5b5349',
    fontFamily = '"PingFang SC","Microsoft YaHei","Segoe UI",sans-serif',
  } = options

  const key = [text, size, top, bottom, color].join('|')
  if (cache.has(key)) return cache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, top)
  grad.addColorStop(1, bottom)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const highlight = ctx.createRadialGradient(
    size * 0.5,
    size * 0.36,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.72,
  )
  highlight.addColorStop(0, 'rgba(255,255,255,0.34)')
  highlight.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = highlight
  ctx.fillRect(0, 0, size, size)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = text.length > 1 ? size * 0.42 : size * 0.56
  ctx.font = `700 ${fontSize}px ${fontFamily}`
  ctx.shadowColor = 'rgba(91,83,73,0.18)'
  ctx.shadowBlur = size * 0.05
  ctx.shadowOffsetY = size * 0.012
  ctx.fillStyle = color
  ctx.fillText(text, size / 2, size / 2 + size * 0.03)
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

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
