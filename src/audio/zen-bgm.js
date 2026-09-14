import { resumeAudioContext } from './audio-context.js'

const PENTATONIC = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]

function makeReverbImpulse(ctx, seconds = 3.4, decay = 2.6) {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * seconds)
  const impulse = ctx.createBuffer(2, length, rate)
  for (let ch = 0; ch < 2; ch += 1) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return impulse
}

/**
 * 程序化禅意 BGM：低频正弦持续音 + 五声调式拨弦 + 生成式混响。
 * 零音频文件，全部由 Web Audio API 实时合成。
 */
export function createZenBgm({ volume = 0.16 } = {}) {
  let ctx = null
  let master = null
  let dry = null
  let reverb = null
  let started = false
  let disposed = false
  let timer = 0
  const droneNodes = []

  function build() {
    ctx = resumeAudioContext()
    if (!ctx) return false

    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    reverb = ctx.createConvolver()
    reverb.buffer = makeReverbImpulse(ctx)
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.85
    reverb.connect(reverbGain)
    reverbGain.connect(master)

    dry = ctx.createGain()
    dry.gain.value = 0.5
    dry.connect(master)

    const droneFilter = ctx.createBiquadFilter()
    droneFilter.type = 'lowpass'
    droneFilter.frequency.value = 850
    droneFilter.Q.value = 0.4
    droneFilter.connect(dry)
    droneFilter.connect(reverb)

    const roots = [
      { freq: 110.0, gain: 0.085 },
      { freq: 164.81, gain: 0.05 },
    ]
    for (const { freq, gain } of roots) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const amp = ctx.createGain()
      amp.gain.value = gain

      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.04 + Math.random() * 0.03
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = gain * 0.35
      lfo.connect(lfoGain)
      lfoGain.connect(amp.gain)

      osc.connect(amp)
      amp.connect(droneFilter)
      osc.start()
      lfo.start()
      droneNodes.push(osc, lfo, amp, lfoGain)
    }

    return true
  }

  function pluck(freq, time, gainValue) {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.linearRampToValueAtTime(gainValue, time + 0.025)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 3.4)
    osc.connect(env)
    env.connect(dry)
    env.connect(reverb)
    osc.start(time)
    osc.stop(time + 3.6)

    const overtone = ctx.createOscillator()
    overtone.type = 'sine'
    overtone.frequency.value = freq * 2.004
    const overtoneEnv = ctx.createGain()
    overtoneEnv.gain.setValueAtTime(0.0001, time)
    overtoneEnv.gain.linearRampToValueAtTime(gainValue * 0.35, time + 0.01)
    overtoneEnv.gain.exponentialRampToValueAtTime(0.0001, time + 1.7)
    overtone.connect(overtoneEnv)
    overtoneEnv.connect(reverb)
    overtone.start(time)
    overtone.stop(time + 1.9)
  }

  function scheduleNote() {
    if (disposed) return
    const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)]
    pluck(freq, ctx.currentTime + 0.05, 0.1 + Math.random() * 0.06)
    timer = window.setTimeout(scheduleNote, 1400 + Math.random() * 2800)
  }

  return {
    start() {
      if (started || disposed) return
      if (!build()) return
      started = true
      const now = ctx.currentTime
      master.gain.setValueAtTime(0, now)
      master.gain.linearRampToValueAtTime(volume, now + 3.5)
      scheduleNote()
    },
    setVolume(value) {
      if (master) master.gain.setTargetAtTime(value, ctx.currentTime, 0.4)
    },
    dispose() {
      disposed = true
      window.clearTimeout(timer)
      for (const node of droneNodes) {
        if (typeof node.stop === 'function') {
          try {
            node.stop()
          } catch {}
        }
      }
      if (master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
    },
  }
}
