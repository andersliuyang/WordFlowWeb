const PREFIX = 'wordflow:'
const MAX_SCAN = 5000
const MAX_SCORE = 10_000_000
const MAX_MOVES = 10_000
const MAX_TIME_MS = 24 * 60 * 60 * 1000

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function cleanName(value) {
  const name = String(value || '')
    .replace(/[\u0000-\u001f<>]/g, '')
    .trim()
  return name.slice(0, 12) || 'anonymous'
}

function cleanId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 48)
}

function levelPrefix(levelId) {
  return `${PREFIX}l:${levelId}:`
}

function scoreKey(levelId, name) {
  return `${levelPrefix(levelId)}${encodeURIComponent(name)}`
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url)
    }
    return env.ASSETS.fetch(request)
  },
}

async function handleApi(request, env, url) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (url.pathname === '/api/score' && request.method === 'POST') {
    return submitScore(request, env)
  }

  if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
    return getLeaderboard(env, url)
  }

  return json({ error: 'not_found' }, 404)
}

async function submitScore(request, env) {
  const body = await request.json().catch(() => null)
  if (!body) return json({ error: 'bad_json' }, 400)

  const levelId = cleanId(body.levelId)
  if (!levelId) return json({ error: 'bad_level' }, 400)

  const name = cleanName(body.name)
  const score = Number(body.score)
  const moves = Number(body.moves)
  const timeMs = Number(body.timeMs)

  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return json({ error: 'bad_score' }, 400)
  }
  if (!Number.isFinite(moves) || moves < 1 || moves > MAX_MOVES) {
    return json({ error: 'bad_moves' }, 400)
  }
  if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > MAX_TIME_MS) {
    return json({ error: 'bad_time' }, 400)
  }

  const key = scoreKey(levelId, name)
  const existing = await env.LEADERBOARD.getWithMetadata(key, 'json')
  const previous = existing && existing.metadata
  if (previous && previous.score >= score) {
    return json({ ok: true, kept: true })
  }

  await env.LEADERBOARD.put(key, '1', {
    metadata: {
      name,
      levelId,
      score: Math.round(score),
      moves: Math.round(moves),
      timeMs: Math.round(timeMs),
      ts: Date.now(),
    },
  })
  return json({ ok: true })
}

async function getLeaderboard(env, url) {
  const levelId = cleanId(url.searchParams.get('level'))
  if (!levelId) return json({ error: 'bad_level' }, 400)

  const requested = Number(url.searchParams.get('limit'))
  const limit = Math.min(Math.max(Number.isFinite(requested) ? requested : 50, 1), 100)
  const prefix = levelPrefix(levelId)

  const scores = []
  let cursor
  let scanned = 0
  do {
    const list = await env.LEADERBOARD.list({ prefix, limit: 1000, cursor })
    for (const item of list.keys) {
      if (item.metadata) scores.push(item.metadata)
    }
    scanned += list.keys.length
    cursor = list.list_complete ? null : list.cursor
  } while (cursor && scanned < MAX_SCAN)

  scores.sort((a, b) => b.score - a.score || a.timeMs - b.timeMs)
  return json({ levelId, scores: scores.slice(0, limit) })
}
