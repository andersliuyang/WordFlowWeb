import * as THREE from 'three'

const glyphCache = new Map()

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
 * 顶面字符贴片纹理：透明背景 + 字符（可选状态装饰）。
 * 仅用于骰子顶面，其它面保持纯色，不含任何文字。
 */
export function createGlyphTexture(char, options = {}) {
  const { type = 'normal', countdown = 0, locked = false, hp = 2, size = 256 } = options
  const key = [char, type, countdown, locked, hp, size].join('|')
  if (glyphCache.has(key)) return glyphCache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // 冰冻外观仅在尚未破碎（hp>1）时显示；破碎后恢复普通样式
  if (type === 'ice' && hp > 1) {
    ctx.fillStyle = `rgba(176,220,238,${0.3 + 0.14 * (hp - 1)})`
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

  // 锁定时用一个大挂锁盖住字符
  let skipChar = false
  if (type === 'lock' && locked) {
    skipChar = true
    const cx = size / 2
    const bw = size * 0.52
    const bh = size * 0.38
    const bx = cx - bw / 2
    const by = size * 0.42

    // 锁梁
    ctx.strokeStyle = '#3f3a33'
    ctx.lineWidth = size * 0.08
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(cx, by, bw * 0.3, Math.PI, Math.PI * 2)
    ctx.stroke()

    // 锁体
    ctx.fillStyle = '#3f3a33'
    roundRect(ctx, bx, by, bw, bh, size * 0.06)
    ctx.fill()

    // 锁孔
    ctx.fillStyle = '#f2e9dd'
    ctx.beginPath()
    ctx.arc(cx, by + bh * 0.38, size * 0.05, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(cx - size * 0.02, by + bh * 0.38, size * 0.04, bh * 0.36)
  }

  if (!skipChar) {
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
  }

  if (type === 'bomb') {
    const r = size * 0.16
    const cx = size - r - size * 0.11
    const cy = r + size * 0.2

    // 引线
    ctx.strokeStyle = '#8a6a4f'
    ctx.lineWidth = size * 0.028
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx + r * 0.5, cy - r * 0.72)
    ctx.quadraticCurveTo(cx + r * 1.5, cy - r * 1.5, cx + r * 0.45, cy - r * 1.95)
    ctx.stroke()

    // 火花
    ctx.fillStyle = '#f6b23e'
    ctx.beginPath()
    ctx.arc(cx + r * 0.45, cy - r * 1.95, r * 0.24, 0, Math.PI * 2)
    ctx.fill()

    // 弹体
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = '#4a4740'
    ctx.fill()

    // 高光
    ctx.beginPath()
    ctx.arc(cx - r * 0.34, cy - r * 0.34, r * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fill()

    // 倒计时数字
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff6ee'
    ctx.font = `700 ${size * 0.19}px "PingFang SC",sans-serif`
    ctx.fillText(String(countdown), cx, cy + size * 0.004)
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
