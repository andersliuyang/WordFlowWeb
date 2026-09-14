const STORAGE_KEY = 'wordflow.save.v1'

const DEFAULT_SAVE = {
  version: 1,
  settings: { language: 'zh-CN', sfx: true, bgm: true, volume: 0.6 },
  progress: { completed: {} },
  wallet: { coins: 200, hints: { normal: 3, targeted: 1, wand: 0 } },
  stats: { totalWords: 0, totalCombos: 0 },
  flags: { guideSeen: false, tips: {} },
}

export const HINT_COST = { normal: 20, targeted: 40, wand: 80 }
export const SHUFFLE_COST = 30

function deepMerge(base, patch) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return patch ?? base
  const out = { ...base }
  for (const [key, value] of Object.entries(patch || {})) {
    out[key] = deepMerge(base ? base[key] : undefined, value)
  }
  return out
}

class SaveStore {
  constructor() {
    this.data = this._load()
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return structuredClone(DEFAULT_SAVE)
      const parsed = JSON.parse(raw)
      const merged = deepMerge(structuredClone(DEFAULT_SAVE), parsed)
      merged.version = DEFAULT_SAVE.version
      return merged
    } catch {
      return structuredClone(DEFAULT_SAVE)
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    } catch {
      /* ignore quota errors */
    }
  }

  get settings() {
    return this.data.settings
  }

  get wallet() {
    return this.data.wallet
  }

  get progress() {
    return this.data.progress
  }

  get flags() {
    return this.data.flags
  }

  setFlag(key, value) {
    this.data.flags[key] = value
    this.save()
  }

  hasTip(id) {
    return !!(this.data.flags.tips && this.data.flags.tips[id])
  }

  markTip(id) {
    if (!this.data.flags.tips) this.data.flags.tips = {}
    this.data.flags.tips[id] = true
    this.save()
  }

  setSetting(key, value) {
    this.data.settings[key] = value
    this.save()
  }

  isCompleted(levelId) {
    return !!this.data.progress.completed[levelId]
  }

  levelStars(levelId) {
    return this.data.progress.completed[levelId]?.stars ?? 0
  }

  completeLevel(levelId, { stars, moves }) {
    const prev = this.data.progress.completed[levelId]
    const bestMoves = prev ? Math.min(prev.bestMoves, moves) : moves
    this.data.progress.completed[levelId] = {
      stars: Math.max(prev?.stars ?? 0, stars),
      bestMoves,
    }
    this.save()
  }

  addCoins(amount) {
    this.data.wallet.coins += amount
    this.save()
  }

  spendCoins(amount) {
    if (this.data.wallet.coins < amount) return false
    this.data.wallet.coins -= amount
    this.save()
    return true
  }

  hintCount(type) {
    return this.data.wallet.hints[type] ?? 0
  }

  addHint(type, amount = 1) {
    this.data.wallet.hints[type] = (this.data.wallet.hints[type] ?? 0) + amount
    this.save()
  }

  useHint(type) {
    if (this.hintCount(type) <= 0) return false
    this.data.wallet.hints[type] -= 1
    this.save()
    return true
  }

  reset() {
    this.data = structuredClone(DEFAULT_SAVE)
    this.save()
  }
}

export const saveStore = new SaveStore()
