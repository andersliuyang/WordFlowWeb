import { GameSession } from '../game/session.js'
import { createGameScene } from '../engine/game-scene.js'
import { saveStore, HINT_COST, SHUFFLE_COST } from '../store/save.js'
import { t, getTip } from '../i18n/index.js'
import { playClick, playClear, playBonus, playFail, playWin, playLose } from '../audio/sfx.js'
import { showToast } from './toast.js'
import { mountCoach } from './coach.js'

function starsFor(moves, wordCount) {
  if (moves <= wordCount) return 3
  if (moves <= wordCount * 2) return 2
  return 1
}

export function mountGameScreen({ level, onExit, onNext, onRetry, onGuide }) {
  const session = new GameSession(level)
  const el = document.createElement('div')
  el.className = 'screen game-screen'
  el.innerHTML = `
    <canvas class="game__canvas"></canvas>
    <div class="hud">
      <header class="hud__top">
        <div class="hud__top-left">
          <button class="icon-btn" data-role="back" type="button">←</button>
          <button class="icon-btn" data-role="guide" type="button" title="${t('guide')}">?</button>
        </div>
        <div class="hud__stats">
          <span class="stat"><span class="stat__label">${t('moves')}</span><span class="stat__value" data-role="moves">0</span></span>
          <span class="stat"><span class="stat__label">${t('coins')}</span><span class="stat__value" data-role="coins">0</span></span>
        </div>
      </header>
      <div class="hud__words" data-role="words"></div>
      <div class="hud__bonus" data-role="bonus"></div>
      <div class="hud__selection" data-role="selection"></div>
      <div class="hud__bottom">
        <button class="chip-btn" data-role="hint-normal" type="button">${t('hintNormal')} · <b data-role="cost-normal">${HINT_COST.normal}</b></button>
        <button class="chip-btn" data-role="hint-targeted" type="button">${t('hintTargeted')} · <b>${HINT_COST.targeted}</b></button>
        <button class="chip-btn" data-role="hint-wand" type="button">${t('hintWand')} · <b>${HINT_COST.wand}</b></button>
        <button class="chip-btn" data-role="shuffle" type="button">${t('shuffle')} · <b>${SHUFFLE_COST}</b></button>
        <button class="btn btn--primary submit-btn" data-role="submit" type="button" hidden>确定</button>
      </div>
    </div>
    <div class="result" data-role="result" hidden></div>
  `

  const canvas = el.querySelector('.game__canvas')
  const wordsEl = el.querySelector('[data-role="words"]')
  const bonusEl = el.querySelector('[data-role="bonus"]')
  const movesEl = el.querySelector('[data-role="moves"]')
  const coinsEl = el.querySelector('[data-role="coins"]')
  const selectionEl = el.querySelector('[data-role="selection"]')
  const submitBtn = el.querySelector('[data-role="submit"]')
  const resultEl = el.querySelector('[data-role="result"]')
  const normalBtn = el.querySelector('[data-role="hint-normal"]')

  let targetedMode = false
  let finished = false

  // ---- 情境向导 ----
  const bottomEl = el.querySelector('.hud__bottom')
  const TIP_ANCHORS = {
    connect: null,
    gravity: null,
    combo: null,
    ice: null,
    lock: null,
    bomb: null,
    bonus: () => (bonusEl.hidden ? null : bonusEl),
    hint: () => bottomEl,
  }
  const tipQueue = []
  let activeTipId = null

  function enqueueTip(id) {
    if (finished || saveStore.hasTip(id)) return
    if (activeTipId === id || tipQueue.includes(id)) return
    tipQueue.push(id)
    pumpTips()
  }

  function pumpTips() {
    if (activeTipId || finished) return
    const id = tipQueue.shift()
    if (!id) return
    const tip = getTip(id)
    if (!tip) {
      pumpTips()
      return
    }
    activeTipId = id
    const coach = mountCoach({
      anchor: TIP_ANCHORS[id] || null,
      title: tip.title,
      body: tip.body,
      onClose: () => {
        saveStore.markTip(id)
        coach.dispose()
        activeTipId = null
        pumpTips()
      },
    })
    activeCoach = coach
  }
  let activeCoach = null

  function scheduleInitialTips() {
    const types = new Set(level.initial_board.map((tile) => tile.type))
    const initial = ['connect']
    for (const type of ['ice', 'lock', 'bomb']) if (types.has(type)) initial.push(type)
    if ((level.bonus_dictionary || []).length) initial.push('bonus')
    initial.push('hint')
    for (const id of initial) if (!saveStore.hasTip(id)) tipQueue.push(id)
    window.setTimeout(pumpTips, 650)
  }

  const scene = createGameScene(canvas, level, {
    onSelectionChange(cells, text) {
      selectionEl.textContent = text
      submitBtn.hidden = !(cells.length >= 2)
      if (targetedMode && cells.length === 1) {
        targetedMode = false
        resolveTargeted(cells[0])
      }
    },
    onSubmit(cells) {
      handleResolution(session.submitPath(cells))
    },
  })
  scene.sync(session.board)

  function updateHud() {
    movesEl.textContent = level.move_limit ? `${session.moves}/${level.move_limit}` : String(session.moves)
    coinsEl.textContent = String(saveStore.wallet.coins)
    normalBtn.innerHTML = `${t('hintNormal')} · <b>${saveStore.hintCount('normal') > 0 ? `x${saveStore.hintCount('normal')}` : HINT_COST.normal}</b>`

    wordsEl.innerHTML = level.target_words
      .map((word) => {
        const done = session.completed.has(word.id)
        return `<span class="word-chip ${done ? 'word-chip--done' : ''}" title="${word.hint_text || ''}">${word.text}</span>`
      })
      .join('')

    if (session.bonusDictionary.length === 0) {
      bonusEl.hidden = true
    } else {
      bonusEl.hidden = false
      let slots = ''
      for (let i = 0; i < session.bonusTarget; i += 1) {
        const filled = i < session.bonusCollected.length
        slots += `<span class="bonus-slot ${filled ? 'bonus-slot--on' : ''}"></span>`
      }
      bonusEl.innerHTML = `<span class="bonus-label">${t('bonusSlot')}</span>${slots}`
    }
  }

  function canPay(type, cost) {
    if (saveStore.hintCount(type) > 0) {
      saveStore.useHint(type)
      updateHud()
      return true
    }
    if (saveStore.spendCoins(cost)) {
      updateHud()
      return true
    }
    showToast(t('noCoins'))
    return false
  }

  function handleResolution(res) {
    if (!res || res.type === 'invalid') {
      if (res) playFail()
      if (res) showToast(t('invalid'))
      return
    }

    let sawClear = false
    for (const event of res.events || []) {
      if (event.kind === 'crack') {
        playClick()
        scene.burst(event.path)
      } else if (event.kind === 'clear') {
        sawClear = true
        playClear(event.combo)
        scene.burst(event.path)
      } else if (event.kind === 'bonus') {
        playBonus()
        showToast(t('bonusGot'))
      } else if (event.kind === 'bonusReward') {
        showToast(`+${event.coins}`)
      }
    }
    if (!sawClear && (res.events || []).some((e) => e.kind === 'crack')) {
      showToast('冰冻: 再消除一次')
    }

    if (sawClear) enqueueTip('gravity')
    if (res.combo >= 1) enqueueTip('combo')

    scene.sync(session.board)
    updateHud()

    if (session.status === 'playing' && session.isDeadlocked()) {
      showToast(t('deadlock'))
    }

    if (session.status === 'won') finishWin()
    else if (session.status === 'lost') finishLose()
  }

  function resolveTargeted(cell) {
    const hint = session.findHintForCell(cell[0], cell[1])
    if (!hint) {
      showToast(t('invalid'))
      return
    }
    scene.previewPath(hint.path)
  }

  function refreshCoins() {
    coinsEl.textContent = String(saveStore.wallet.coins)
  }

  function finishWin() {
    if (finished) return
    finished = true
    if (activeCoach) {
      activeCoach.dispose()
      activeCoach = null
      activeTipId = null
    }
    const wordCount = level.target_words.length
    const stars = starsFor(session.moves, wordCount)
    const first = !saveStore.isCompleted(level.id)
    const reward = session.coins + (first ? level.reward.coins : 0)
    saveStore.addCoins(reward)
    saveStore.completeLevel(level.id, { stars, moves: session.moves })
    playWin()
    window.setTimeout(() => showResult('won', { stars, reward }), 450)
  }

  function finishLose() {
    if (finished) return
    finished = true
    if (activeCoach) {
      activeCoach.dispose()
      activeCoach = null
      activeTipId = null
    }
    playLose()
    window.setTimeout(() => showResult('lost', {}), 450)
  }

  function showResult(kind, data) {
    const isWin = kind === 'won'
    const starHtml = isWin
      ? [0, 1, 2].map((i) => `<span class="star ${i < data.stars ? 'star--on' : ''}">★</span>`).join('')
      : ''
    const reason = session.reason === 'bomb' ? t('lostBomb') : t('lostMoves')
    resultEl.hidden = false
    resultEl.innerHTML = `
      <div class="result__panel">
        <h2>${isWin ? t('won') : t('lost')}</h2>
        ${isWin ? `<div class="result__stars">${starHtml}</div><p class="result__coins">+${data.reward} ${t('coins')}</p>` : `<p class="result__coins">${reason}</p>`}
        <div class="result__actions">
          <button class="btn btn--ghost" data-role="home" type="button">${t('home')}</button>
          <button class="btn btn--ghost" data-role="retry" type="button">${t('retry')}</button>
          ${isWin ? `<button class="btn btn--primary" data-role="next" type="button">${t('next')}</button>` : ''}
        </div>
      </div>
    `
    resultEl.querySelector('[data-role="home"]').addEventListener('click', () => onExit?.())
    resultEl.querySelector('[data-role="retry"]').addEventListener('click', () => onRetry?.())
    resultEl.querySelector('[data-role="next"]')?.addEventListener('click', () => onNext?.())
  }

  el.querySelector('[data-role="back"]').addEventListener('click', () => onExit?.())
  el.querySelector('[data-role="guide"]').addEventListener('click', () => onGuide?.())
  el.querySelector('[data-role="submit"]').addEventListener('click', () => scene.submitSelection())
  normalBtn.addEventListener('click', () => {
    if (!canPay('normal', HINT_COST.normal)) return
    const hint = session.findHint()
    if (!hint) return
    scene.previewPath(hint.path)
    showToast(`${t('hintNormal')}: ${hint.word.text}`)
  })
  el.querySelector('[data-role="hint-targeted"]').addEventListener('click', () => {
    if (!canPay('targeted', HINT_COST.targeted)) return
    targetedMode = true
    scene.clearSelection()
    showToast(t('hintTargetedPrompt'))
  })
  el.querySelector('[data-role="hint-wand"]').addEventListener('click', () => {
    if (!canPay('wand', HINT_COST.wand)) return
    const res = session.autoCompleteOne()
    if (res) handleResolution(res)
  })
  el.querySelector('[data-role="shuffle"]').addEventListener('click', () => {
    const free = session.isDeadlocked()
    if (!free && !saveStore.spendCoins(SHUFFLE_COST)) {
      showToast(t('noCoins'))
      return
    }
    updateHud()
    if (session.shuffle()) {
      scene.clearSelection()
      scene.sync(session.board)
      showToast(t('shuffle'))
    } else {
      showToast(t('noHintItem'))
    }
  })

  updateHud()
  scheduleInitialTips()

  return {
    el,
    dispose() {
      if (activeCoach) {
        activeCoach.dispose()
        activeCoach = null
      }
      scene.dispose()
    },
  }
}
