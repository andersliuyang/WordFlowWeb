import { getAudioContext, resumeAudioContext } from './audio-context.js'

let sfxEnabled = true

export function setSfxEnabled(value) {
  sfxEnabled = !!value
}

export function isSfxEnabled() {
  return sfxEnabled
}

const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99]

function tone(freq, { start = 0, dur = 0.18, type = 'sine', peak = 0.16, sweepTo = null } = {}) {
  const ctx = getAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime + start
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, sweepTo), t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export function playClick() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(880, { dur: 0.09, type: 'sine', peak: 0.12 })
}

export function playSelect() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(660, { dur: 0.12, type: 'triangle', peak: 0.13 })
}

export function playClear(combo = 0) {
  if (!sfxEnabled) return
  resumeAudioContext()
  const base = Math.min(combo, 4)
  const notes = [PENTATONIC[base % PENTATONIC.length], PENTATONIC[(base + 2) % PENTATONIC.length], PENTATONIC[(base + 4) % PENTATONIC.length]]
  notes.forEach((freq, index) => {
    tone(freq, { start: index * 0.07, dur: 0.24, type: 'sine', peak: 0.14 })
  })
}

export function playBonus() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(1046.5, { dur: 0.14, type: 'sine', peak: 0.12 })
  tone(1318.5, { start: 0.1, dur: 0.2, type: 'sine', peak: 0.12 })
}

export function playFail() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(220, { dur: 0.2, type: 'sawtooth', peak: 0.1, sweepTo: 130 })
}

export function playWin() {
  if (!sfxEnabled) return
  resumeAudioContext()
  ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
    tone(freq, { start: index * 0.12, dur: 0.5, type: 'sine', peak: 0.16 })
  })
}

export function playLose() {
  if (!sfxEnabled) return
  resumeAudioContext()
  ;[392.0, 329.63, 261.63, 196.0].forEach((freq, index) => {
    tone(freq, { start: index * 0.16, dur: 0.5, type: 'triangle', peak: 0.14 })
  })
}

// ---------- 新增：滑动 / 碰撞 / 破碎 ----------

let noiseBuffer = null

function getNoise(ctx) {
  if (noiseBuffer) return noiseBuffer
  const length = Math.floor(ctx.sampleRate * 0.4)
  noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return noiseBuffer
}

/** 滑动连线：更轻更高的短促音 */
export function playSlide() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(1000, { dur: 0.04, type: 'sine', peak: 0.07 })
}

/** UI 按钮点击：柔和清脆 */
export function playButton() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(520, { dur: 0.07, type: 'triangle', peak: 0.11 })
  tone(1040, { start: 0.008, dur: 0.05, type: 'sine', peak: 0.05 })
}

/** 碰撞：低频闷响 + 中频爆点（手机外放也能听到） */
export function playImpact() {
  if (!sfxEnabled) return
  const ctx = resumeAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime
  tone(150, { dur: 0.22, type: 'sine', peak: 0.34, sweepTo: 48 })

  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 1500
  bandpass.Q.value = 0.7
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.13)
  src.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + 0.15)
}

/** 破碎：明亮噪声碎响 + 玻璃脆音 */
export function playShatter(delay = 0) {
  if (!sfxEnabled) return
  const ctx = resumeAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime + delay

  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 1600
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(0.42, t0 + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35)
  src.connect(highpass)
  highpass.connect(gain)
  gain.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + 0.4)

  ;[1568, 2093, 2637].forEach((freq, index) => {
    tone(freq, { start: delay + index * 0.03, dur: 0.12, type: 'sine', peak: 0.1 })
  })
}

/** 破冰：玻璃/冰块碎裂质感 */
export function playCrack() {
  if (!sfxEnabled) return
  const ctx = resumeAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime

  // 玻璃碎屑噪声（带通高频）
  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 3200
  bandpass.Q.value = 0.9
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(0.42, t0 + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3)
  src.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + 0.32)

  // 冰晶脆音（多个非谐波高频）
  ;[2200, 2960, 3520, 4400].forEach((freq, index) => {
    tone(freq, { start: 0.005 + index * 0.02, dur: 0.16 + index * 0.03, type: 'sine', peak: 0.12 })
  })

  // 低频破裂感
  tone(320, { dur: 0.12, type: 'triangle', peak: 0.16, sweepTo: 170 })
}

/** 破冰强化版（用于整块碎裂） */
export function playIceBreak() {
  playCrack()
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(5200, { start: 0.02, dur: 0.22, type: 'sine', peak: 0.07 })
  tone(6400, { start: 0.06, dur: 0.24, type: 'sine', peak: 0.05 })
}

/** 解锁：明亮的上行双音 */
export function playUnlock() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(784, { dur: 0.14, type: 'sine', peak: 0.12 })
  tone(1174.7, { start: 0.08, dur: 0.22, type: 'sine', peak: 0.12 })
}

/** 炸弹滴答：低沉短促 */
export function playTick() {
  if (!sfxEnabled) return
  resumeAudioContext()
  tone(220, { dur: 0.05, type: 'square', peak: 0.07 })
}

/** 爆炸：低频轰鸣 + 噪声 */
export function playExplosion() {
  if (!sfxEnabled) return
  const ctx = resumeAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime
  tone(180, { dur: 0.55, type: 'sine', peak: 0.42, sweepTo: 36 })

  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 900
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.44, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5)
  src.connect(lowpass)
  lowpass.connect(gain)
  gain.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + 0.55)
}

/** 拆弹：闷响 + 火花嘶声 + 化解音 */
export function playDefuse() {
  if (!sfxEnabled) return
  const ctx = resumeAudioContext()
  if (!ctx) return
  const t0 = ctx.currentTime
  tone(150, { dur: 0.2, type: 'sine', peak: 0.32, sweepTo: 70 })

  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 2000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3)
  src.connect(highpass)
  highpass.connect(gain)
  gain.connect(ctx.destination)
  src.start(t0)
  src.stop(t0 + 0.34)

  tone(880, { start: 0.06, dur: 0.18, type: 'sine', peak: 0.12 })
  tone(1320, { start: 0.12, dur: 0.22, type: 'sine', peak: 0.1 })
}
