let context = null

export function getAudioContext() {
  if (context) return context
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  context = AudioCtx ? new AudioCtx() : null
  return context
}

export function resumeAudioContext() {
  const ctx = getAudioContext()
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  return ctx
}
