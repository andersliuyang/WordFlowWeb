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
