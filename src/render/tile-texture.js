import * as THREE from 'three'

const glyphCache = new Map()

/**
 * 顶面字符贴片纹理：透明背景 + 字符（可选状态装饰）。
 * 仅用于骰子顶面，其它面保持纯色，不含任何文字。
 */
export function createGlyphTexture(char, options = {}) {
  const { type = 'normal', countdown = 0, locked = false, size = 256 } = options
  const key = [char, type, countdown, locked, size].join('|')
  if (glyphCache.has(key)) return glyphCache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (type === 'ice') {
    ctx.fillStyle = 'rgba(176,220,238,0.38)'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = size * 0.02
    for (let i = 0; i < 3; i += 1) {
      const y = size * (0.2 + i * 0.3)
      ctx.beginPath()
      ctx.moveTo(size * 0.14, y)
      ctx.lineTo(size * 0.86, y + size * 0.06)
      ctx.stroke()
    }
  }

  if (type === 'lock' && locked) {
    ctx.fillStyle = 'rgba(94,104,120,0.34)'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(245,248,252,0.9)'
    ctx.lineWidth = size * 0.04
    for (let i = -1; i <= 1; i += 1) {
      const off = size * 0.5 + i * size * 0.24
      ctx.beginPath()
      ctx.moveTo(off - size * 0.2, size * 0.16)
      ctx.lineTo(off + size * 0.2, size * 0.84)
      ctx.stroke()
    }
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = char.length > 1 ? size * 0.42 : size * 0.6
  ctx.font = `700 ${fontSize}px "PingFang SC","Microsoft YaHei","Segoe UI",sans-serif`
  ctx.lineJoin = 'round'
  ctx.lineWidth = size * 0.07
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.strokeText(char, size / 2, size / 2 + size * 0.02)
  ctx.fillStyle = '#4f483f'
  ctx.fillText(char, size / 2, size / 2 + size * 0.02)

  if (type === 'bomb') {
    const r = size * 0.17
    const cx = size - r - size * 0.12
    const cy = r + size * 0.12
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = '#d97b6c'
    ctx.fill()
    ctx.fillStyle = '#fff6ee'
    ctx.font = `700 ${size * 0.2}px "PingFang SC",sans-serif`
    ctx.fillText(String(countdown), cx, cy + size * 0.008)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  glyphCache.set(key, texture)
  return texture
}

export function disposeTileTextureCache() {
  for (const texture of glyphCache.values()) texture.dispose()
  glyphCache.clear()
}
