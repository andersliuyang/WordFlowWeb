const STRINGS = {
  'zh-CN': {
    start: '开始游戏',
    settings: '设置',
    back: '返回',
    home: '主页',
    levelSelect: '选择关卡',
    language: '语言',
    audio: '音效',
    music: '音乐',
    volume: '音量',
    resetProgress: '重置进度',
    resetConfirm: '确定要重置所有进度吗？',
    resetDone: '进度已重置',
    locked: '未解锁',
    moves: '步数',
    coins: '金币',
    targetWords: '目标词',
    bonusSlot: '彩蛋',
    hintNormal: '提示',
    hintTargeted: '定向',
    hintWand: '魔棒',
    hintTargetedPrompt: '点击一个格子',
    pause: '暂停',
    resume: '继续',
    restart: '重开',
    restartConfirm: '确定要重开本关吗？',
    won: '通关！',
    lost: '游戏结束',
    lostBomb: '炸弹爆炸了',
    lostMoves: '步数用尽',
    next: '下一关',
    retry: '再来一次',
    noCoins: '金币不足',
    noHintItem: '道具不足',
    invalid: '不是有效词汇',
    bonusGot: '彩蛋 +1',
    tapHint: '拖动或点击字母连线成词',
    loading: '加载中…',
    star: '星',
    tapToStart: '点击屏幕开始',
    guide: '玩法向导',
    guideNext: '下一步',
    guideStart: '开始游戏',
    guideSkip: '跳过',
    gotIt: '知道了',
    shuffle: '重排',
    deadlock: '没有可拼的词了，点「重排」继续',
    lockKeyHint: '锁住了：需先消除',
    lockAdjacent: '锁住了：需先消除相邻的词',
    confirm: '确定',
  },
  'en-US': {
    start: 'Start Game',
    settings: 'Settings',
    back: 'Back',
    home: 'Home',
    levelSelect: 'Select Level',
    language: 'Language',
    audio: 'Sound',
    music: 'Music',
    volume: 'Volume',
    resetProgress: 'Reset Progress',
    resetConfirm: 'Reset all progress?',
    resetDone: 'Progress reset',
    locked: 'Locked',
    moves: 'Moves',
    coins: 'Coins',
    targetWords: 'Words',
    bonusSlot: 'Bonus',
    hintNormal: 'Hint',
    hintTargeted: 'Target',
    hintWand: 'Wand',
    hintTargetedPrompt: 'Tap a cell',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart',
    restartConfirm: 'Restart this level?',
    won: 'Level Clear!',
    lost: 'Game Over',
    lostBomb: 'A bomb exploded',
    lostMoves: 'Out of moves',
    next: 'Next',
    retry: 'Retry',
    noCoins: 'Not enough coins',
    noHintItem: 'No item left',
    invalid: 'Not a valid word',
    bonusGot: 'Bonus +1',
    tapHint: 'Drag or tap letters to form a word',
    loading: 'Loading…',
    star: 'star',
    tapToStart: 'Tap to start',
    guide: 'How to Play',
    guideNext: 'Next',
    guideStart: 'Start Game',
    guideSkip: 'Skip',
    gotIt: 'Got it',
    shuffle: 'Shuffle',
    deadlock: 'No words can be formed — tap Shuffle',
    lockKeyHint: 'Locked — clear',
    lockAdjacent: 'Locked — clear an adjacent word',
    confirm: 'Confirm',
  },
}

let current = 'zh-CN'

const TIPS = {
  'zh-CN': {
    connect: { title: '连线成词', body: '拖动经过相邻方块即可连线成词（8 方向相邻、不可重复）；也可逐个点击后按「确定」。正反拼写都算。' },
    gravity: { title: '重力下落', body: '消除后上方方块会下落补位。若掉落新凑成一个原本拼不出的词，会自动级联消除并加分。' },
    combo: { title: '连击', body: '3 秒内连续消除会累积连击，金币与得分更高。' },
    bonus: { title: '彩蛋词', body: '拼出合法但非目标的词会存入彩蛋槽，集满可兑换金币和道具。' },
    ice: { title: '冰冻方块', body: '冰冻方块需要消除两次；第一次碎裂后会恢复成普通方块。' },
    lock: { title: '锁链方块', body: '锁链方块不能选取；点它可查看需先消除哪个词，解锁后才能拼出它所在的目标词。' },
    bomb: { title: '炸弹方块', body: '炸弹每次提交（含拼错）倒计时 -1；归零会爆炸，把全场方块炸飞并判负，优先拆掉它！' },
    stone: { title: '石头方块', body: '石头不能选取；消除它相邻的方块即可把它震碎，之后恢复成普通方块。' },
    hint: { title: '提示道具', body: '卡住了？用「提示 / 定向 / 魔棒」，消耗金币或道具帮你脱困。' },
  },
  'en-US': {
    connect: { title: 'Connect letters', body: 'Drag across adjacent tiles (8-way, no repeats), or tap them then press Confirm. Forward or backward both work.' },
    gravity: { title: 'Gravity', body: 'Tiles fall into gaps. If a fall newly forms a word that was not possible before, it clears automatically with a cascade bonus.' },
    combo: { title: 'Combo', body: 'Clearing words within 3 seconds builds a combo, boosting coins and score.' },
    bonus: { title: 'Bonus words', body: 'Valid words outside the targets go to the bonus slot. Fill it for coins and items.' },
    ice: { title: 'Ice tile', body: 'Ice tiles must be cleared twice — the first hit cracks them into a normal tile.' },
    lock: { title: 'Locked tile', body: 'Locked tiles cannot be picked. Tap one to see which word unlocks it.' },
    bomb: { title: 'Bomb tile', body: 'The bomb counter drops on every move (even wrong ones). At zero it explodes and blasts the whole board — defuse it fast!' },
    stone: { title: 'Stone tile', body: 'Stone cannot be picked. Clear a tile next to it to shatter it into a normal tile.' },
    hint: { title: 'Hints', body: 'Stuck? Use Hint / Target / Wand, costing coins or items, to get unstuck.' },
  },
}

export function getTips() {
  return TIPS[current] || TIPS['zh-CN']
}

export function getTip(id) {
  return getTips()[id] || null
}

const GUIDE = {
  'zh-CN': [
    {
      visual: 'connect',
      title: '连线成词',
      body: '拖动经过相邻的方块，或逐个点击后再按「确定」。正向、反向拼写都算命中。',
    },
    {
      visual: 'gravity',
      title: '重力与连击',
      body: '消除后上方方块会下落补位；3 秒内连续消除触发连击，掉落后自动成词会级联消除。',
    },
    {
      visual: 'bonus',
      title: '彩蛋词',
      body: '拼出合法但不在目标里的词，会存入彩蛋槽，集满即可兑换金币与道具。',
    },
    {
      visual: 'obstacles',
      title: '障碍方块',
      body: '冰：需消除两次（第一次碎裂后恢复成普通方块）；锁：点它可查看需先消除哪个词；炸弹：每次提交（含拼错）倒计时 -1，归零爆炸炸飞全场；石：消除相邻方块即可震碎。',
    },
    {
      visual: 'hint',
      title: '提示道具',
      body: '普通 / 定向 / 魔棒三种提示，消耗金币或道具，帮你摆脱僵局。',
    },
    {
      visual: 'goal',
      title: '通关目标',
      body: '消完全部目标词即可通关，用更少的步数拿满三星。',
    },
  ],
  'en-US': [
    {
      visual: 'connect',
      title: 'Connect letters',
      body: 'Drag across adjacent tiles, or tap them one by one then press Confirm. Forward and backward spellings both count.',
    },
    {
      visual: 'gravity',
      title: 'Gravity & combo',
      body: 'Tiles fall to fill gaps. Clearing words within 3s builds a combo; tiles that fall into a word trigger cascades.',
    },
    {
      visual: 'bonus',
      title: 'Bonus words',
      body: 'Valid words outside the targets go to the bonus slot. Fill it to earn coins and items.',
    },
    {
      visual: 'obstacles',
      title: 'Obstacle tiles',
      body: 'Ice: clear twice (cracks, then becomes a normal tile). Lock: tap it to see which word unlocks it. Bomb: the counter drops on every move — at zero it blasts the whole board. Stone: clear a neighboring tile to shatter it.',
    },
    {
      visual: 'hint',
      title: 'Hints',
      body: 'Normal, targeted and wand hints cost coins or items and help you escape a dead end.',
    },
    {
      visual: 'goal',
      title: 'Goal',
      body: 'Clear every target word to win, and finish with fewer moves for three stars.',
    },
  ],
}

export function setLanguage(language) {
  current = STRINGS[language] ? language : 'zh-CN'
}

export function getLanguage() {
  return current
}

export function getGuide() {
  return GUIDE[current] || GUIDE['zh-CN']
}

export function t(key) {
  return STRINGS[current]?.[key] ?? STRINGS['zh-CN'][key] ?? key
}
