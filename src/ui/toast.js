let toastEl = null
let toastTimer = 0

export function showToast(message, duration = 2200) {
  if (!toastEl) {
    toastEl = document.createElement('div')
    toastEl.className = 'toast'
    document.body.appendChild(toastEl)
  }

  toastEl.textContent = message
  toastEl.classList.add('toast--visible')

  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove('toast--visible')
  }, duration)
}
