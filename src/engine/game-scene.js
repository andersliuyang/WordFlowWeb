import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createGlyphTexture } from '../render/tile-texture.js'
import { playClear, playSelect, playSlide, playImpact, playShatter, playIceBreak, playUnlock, playTick, playExplosion, playDefuse } from '../audio/sfx.js'

const TILE_SIZE = 1
const SPACING = 1.16
const TILE_GEO = new RoundedBoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE, 3, 0.16)
const DECAL_GEO = new THREE.PlaneGeometry(0.66, 0.66)
const SHARD_GEO = new THREE.BoxGeometry(0.17, 0.17, 0.17)

function decalKey(tile) {
  return [tile.char, tile.type, tile.hp ?? '', tile.countdown ?? 0, tile.locked ? 1 : 0].join('|')
}

function tileColor(tile) {
  if (tile.type === 'ice') return (tile.hp || 1) > 1 ? 0xbfe0ec : 0xf0e4d6
  if (tile.type === 'lock') return tile.locked ? 0xc6ccd6 : 0xf0e4d6
  if (tile.type === 'bomb') return 0xf0d7d0
  return 0xf0e4d6
}

const easeOutCubic = (p) => 1 - (1 - p) ** 3

function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* ignore */
    }
  }
}

/**
 * 3D 棋盘视图 + 射线拾取输入 + 消除/级联动画时间线。
 */
export function createGameScene(canvas, level, callbacks = {}) {
  const cols = level.grid_dim.x
  const rows = level.grid_dim.y

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 400)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe0d5c8, 1.1))
  const key = new THREE.DirectionalLight(0xfff6ee, 1.15)
  key.position.set(6, 12, 8)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xcad8e6, 0.5)
  fill.position.set(-9, 4, 6)
  scene.add(fill)

  const group = new THREE.Group()
  scene.add(group)

  const views = new Map()
  const bursts = []
  const shards = []
  const anims = []
  let busy = false
  let shake = 0
  let lastSlideAt = 0
  let downWasSingleSelected = false
  let selection = []
  let selecting = false
  let moved = false
  let downPoint = { x: 0, y: 0 }
  let rafId = 0
  let disposed = false
  let previewTimer = 0

  const raycaster = new THREE.Raycaster()
  const pointerNDC = new THREE.Vector2()

  function worldPos(x, y) {
    return new THREE.Vector3((x - (cols - 1) / 2) * SPACING, 0, (y - (rows - 1) / 2) * SPACING)
  }

  function projectToScreen(world) {
    const v = world.clone().project(camera)
    return {
      x: (v.x * 0.5 + 0.5) * (canvas.clientWidth || window.innerWidth),
      y: (1 - (v.y * 0.5 + 0.5)) * (canvas.clientHeight || window.innerHeight),
    }
  }

  function fitCamera() {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    camera.aspect = width / height
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
    const tilt = THREE.MathUtils.degToRad(67)
    const sinTilt = Math.sin(tilt)
    const boardW = (cols - 1) * SPACING + TILE_SIZE
    const boardH = ((rows - 1) * SPACING + TILE_SIZE) * sinTilt

    // 横屏 / 桌面：预留更大 HUD 空间，并把棋盘缩到约 80%
    const wide = width >= 900 && height >= 600
    const topInset = Math.min(wide ? 190 : 150, height * (wide ? 0.26 : 0.2))
    const bottomInset = Math.min(wide ? 150 : 130, height * (wide ? 0.2 : 0.16))
    const sideInset = Math.max(20, width * (wide ? 0.1 : 0.07))
    const shrink = wide ? 1.08 : 1
    const safeH = Math.max(140, height - topInset - bottomInset)
    const safeW = Math.max(140, width - sideInset * 2)

    const distW = (boardW * width) / (2 * tanHalf * camera.aspect * safeW)
    const distH = (boardH * height) / (2 * tanHalf * safeH)
    const dist = Math.max(distW, distH) * shrink
    camera.position.set(0, sinTilt * dist, Math.cos(tilt) * dist)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    key.position.set(6, dist, 8)
  }

  function buildView(tile) {
    const material = new THREE.MeshStandardMaterial({
      color: tileColor(tile),
      roughness: 0.72,
      metalness: 0,
      emissive: new THREE.Color(0x000000),
    })
    const mesh = new THREE.Mesh(TILE_GEO, material)

    const decalMaterial = new THREE.MeshBasicMaterial({
      map: createGlyphTexture(tile.char, tile),
      transparent: true,
      depthWrite: false,
    })
    const decal = new THREE.Mesh(DECAL_GEO, decalMaterial)
    decal.rotation.x = -Math.PI / 2
    decal.position.y = TILE_SIZE / 2 + 0.005
    mesh.add(decal)

    mesh.userData.tile = tile
    mesh.position.copy(worldPos(tile.x, tile.y))
    mesh.scale.setScalar(0.01)
    group.add(mesh)
    const view = {
      mesh,
      material,
      decal,
      decalMaterial,
      decalKey: decalKey(tile),
      colorKey: tileColor(tile),
      targetScale: 1,
      removing: false,
      manual: false,
      tile,
    }
    views.set(tile.id, view)
    return view
  }

  function disposeView(view) {
    group.remove(view.mesh)
    view.material.dispose()
    view.decalMaterial.dispose()
  }

  function sync(board) {
    const current = new Map()
    for (const tile of board.tiles()) current.set(tile.id, tile)

    for (const [id, tile] of current) {
      let view = views.get(id)
      if (!view) view = buildView(tile)
      view.tile = tile
      view.manual = false
      view.targetPos = worldPos(tile.x, tile.y)
      view.removing = false
      view.targetScale = 1
      view.mesh.visible = true

      updateTileVisual(view)
    }

    for (const [id, view] of views) {
      if (!current.has(id) && !view.removing && !view.manual) {
        view.removing = true
        view.targetScale = 0
      }
    }

    applySelectionHighlight()
  }

  function applySelectionHighlight() {
    const selectedIds = new Set(
      selection.map(([x, y]) => {
        const tile = findTileAt(x, y)
        return tile ? tile.id : null
      }),
    )
    for (const [id, view] of views) {
      const on = selectedIds.has(id)
      view.material.emissive.set(on ? 0xffb85c : 0x000000)
      view.material.emissiveIntensity = on ? 0.5 : 0
      if (!view.removing && !view.manual) view.targetScale = on ? 1.12 : 1
    }
  }

  function findTileAt(x, y) {
    let found = null
    for (const view of views.values()) {
      const tile = view.tile
      if (tile && tile.x === x && tile.y === y && !view.removing) found = tile
    }
    return found
  }

  function selectionText() {
    return selection
      .map(([x, y]) => {
        const tile = findTileAt(x, y)
        return tile ? tile.char : ''
      })
      .join('')
  }

  function emitSelectionChange() {
    callbacks.onSelectionChange?.(selection.slice(), selectionText())
  }

  function clearSelection() {
    selection = []
    applySelectionHighlight()
    emitSelectionChange()
  }

  function isAdjacent(a, b) {
    return Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1
  }

  function pickAny(event) {
    const rect = canvas.getBoundingClientRect()
    pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointerNDC, camera)
    const targets = []
    for (const view of views.values()) {
      if (!view.removing && !view.manual && view.targetScale > 0.5) targets.push(view.mesh)
    }
    const hits = raycaster.intersectObjects(targets, false)
    if (!hits.length) return null
    return hits[0].object.userData.tile || null
  }

  function pick(event) {
    const tile = pickAny(event)
    if (!tile || tile.locked) return null
    return tile
  }

  function addToSelection(tile) {
    const cell = [tile.x, tile.y]
    const isFirst = selection.length === 0
    if (isFirst) {
      selection = [cell]
    } else if (isAdjacent(selection[selection.length - 1], cell)) {
      if (!selection.some(([x, y]) => x === cell[0] && y === cell[1])) selection = selection.concat([cell])
    } else {
      selection = [cell]
    }
    if (isFirst || selection.length === 1) {
      playSelect()
    } else {
      const now = performance.now()
      if (now - lastSlideAt > 45) {
        playSlide()
        lastSlideAt = now
      }
    }
    applySelectionHighlight()
    emitSelectionChange()
  }

  function onPointerDown(event) {
    if (disposed || busy) return
    const tile = pickAny(event)
    if (!tile) return
    if (tile.locked) {
      callbacks.onLockedTap?.(tile)
      return
    }
    selecting = true
    moved = false
    downPoint = { x: event.clientX, y: event.clientY }
    canvas.setPointerCapture?.(event.pointerId)

    const cell = [tile.x, tile.y]
    const last = selection[selection.length - 1]
    downWasSingleSelected = !!last && selection.length === 1 && last[0] === cell[0] && last[1] === cell[1]
    if (last && last[0] === cell[0] && last[1] === cell[1] && selection.length > 1) {
      selection = selection.slice(0, -1)
      applySelectionHighlight()
      emitSelectionChange()
      return
    }
    addToSelection(tile)
  }

  function onPointerMove(event) {
    if (!selecting || disposed || busy) return
    if (Math.hypot(event.clientX - downPoint.x, event.clientY - downPoint.y) > 6) moved = true
    const tile = pick(event)
    if (!tile) return
    const cell = [tile.x, tile.y]
    const last = selection[selection.length - 1]
    if (!last) return
    if (isAdjacent(last, cell) && !selection.some(([x, y]) => x === cell[0] && y === cell[1])) {
      addToSelection(tile)
    }
  }

  function onPointerUp(event) {
    if (!selecting) return
    selecting = false
    canvas.releasePointerCapture?.(event.pointerId)
    const text = selectionText()
    if (moved) {
      if (selection.length >= 2 && text) callbacks.onSubmit?.(selection.slice())
      clearSelection()
    } else if (downWasSingleSelected) {
      // 再次点击已选中的单个方块 → 取消选中
      clearSelection()
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  // ---------- particles ----------
  function burstAtWorld(center, opts = {}) {
    const {
      color = 0xe8b06a,
      count = 20,
      size = 0.18,
      speedMin = 0.05,
      speedMax = 0.12,
      up = 0.06,
      gravity = 0.5,
      ttl = 0.75,
    } = opts
    const positions = new Float32Array(count * 3)
    const velocities = []
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = center.x
      positions[i * 3 + 1] = center.y
      positions[i * 3 + 2] = center.z
      const angle = (i / count) * Math.PI * 2
      const speed = speedMin + Math.random() * (speedMax - speedMin)
      velocities.push(new THREE.Vector3(Math.cos(angle) * speed, up + Math.random() * up, Math.sin(angle) * speed))
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 1, depthWrite: false })
    const points = new THREE.Points(geometry, material)
    scene.add(points)
    bursts.push({ points, geometry, material, velocities, gravity, life: 0, ttl })
  }

  function burst(cells) {
    if (!cells || !cells.length) return
    const center = new THREE.Vector3()
    for (const [x, y] of cells) center.add(worldPos(x, y))
    center.multiplyScalar(1 / cells.length)
    burstAtWorld(center)
  }

  function showWordPop(world, text) {
    const parent = canvas.parentElement
    if (!parent || !text) return
    const p = projectToScreen(world)
    const el = document.createElement('div')
    el.className = 'word-pop'
    el.textContent = text
    el.style.left = `${p.x}px`
    el.style.top = `${p.y}px`
    parent.appendChild(el)
    window.setTimeout(() => el.remove(), 950)
  }

  function updateTileVisual(view) {
    if (!view) return
    const tile = view.tile
    const dk = decalKey(tile)
    if (view.decalKey !== dk) {
      view.decalMaterial.map = createGlyphTexture(tile.char, tile)
      view.decalKey = dk
      view.decalMaterial.needsUpdate = true
    }
    const color = tileColor(tile)
    if (view.colorKey !== color) {
      view.material.color.setHex(color)
      view.colorKey = color
    }
  }

  function tileViewsAt(cells) {
    return cells
      .map(({ x, y }) => findTileAt(x, y))
      .filter(Boolean)
      .map((t) => views.get(t.id))
      .filter(Boolean)
  }

  function flashViews(list, duration, done) {
    if (!list.length) {
      done()
      return
    }
    list.forEach((v) => {
      v.manual = true
    })
    let t = 0
    anims.push({
      update(dt) {
        t += dt
        const p = Math.min(1, t / duration)
        const s = 1 + Math.sin(p * Math.PI) * 0.16
        list.forEach((v) => v.mesh.scale.setScalar(s))
        if (p >= 1) {
          list.forEach((v) => {
            v.mesh.scale.setScalar(1)
            v.manual = false
          })
          done()
          return true
        }
        return false
      },
    })
  }

  function holdStep(duration, done) {
    let t = 0
    anims.push({
      update(dt) {
        t += dt
        if (t >= duration) {
          done()
          return true
        }
        return false
      },
    })
  }

  /** 炸弹爆炸：从炸点把全场方块轰飞，散开后坠落出地图 */
  function blowUpAll(center, done) {
    const list = []
    for (const view of views.values()) {
      view.manual = true
      const pos = view.mesh.position
      const dir = pos.clone().sub(center)
      if (dir.lengthSq() < 1e-4) dir.set(Math.random() - 0.5, 0.6, Math.random() - 0.5)
      dir.normalize()
      const dist = Math.max(0.25, pos.distanceTo(center))
      const power = 1.6 + 5 / (0.6 + dist)
      list.push({
        view,
        vel: dir
          .multiplyScalar(power * (0.5 + Math.random() * 0.6))
          .add(new THREE.Vector3(0, 0.4 + Math.random() * 1.1, 0)),
        spin: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16),
      })
    }

    burstAtWorld(center, { color: 0xffb24a, count: 60, size: 0.34, ttl: 1.1, speedMin: 0.12, speedMax: 0.3, up: 0.18, gravity: 1.0 })
    burstAtWorld(center, { color: 0xd97b6c, count: 40, size: 0.28, ttl: 1.1, speedMin: 0.08, speedMax: 0.22, up: 0.14, gravity: 1.0 })
    shake = 0.6
    playExplosion()
    vibrate([40, 40, 90])

    let t = 0
    anims.push({
      update(dt) {
        t += dt
        let allOut = true
        for (const item of list) {
          const mesh = item.view.mesh
          mesh.position.addScaledVector(item.vel, dt)
          item.vel.y -= 20 * dt
          mesh.rotation.x += item.spin.x * dt
          mesh.rotation.y += item.spin.y * dt
          mesh.rotation.z += item.spin.z * dt
          if (mesh.position.y > -9) allOut = false
        }
        if (allOut || t >= 1.6) {
          for (const item of list) {
            if (views.has(item.view.tile.id)) {
              disposeView(item.view)
              views.delete(item.view.tile.id)
            }
          }
          done()
          return true
        }
        return false
      },
    })
  }

  function setOpacity(view, value) {
    view.material.transparent = true
    view.material.opacity = value
    view.decalMaterial.opacity = value
    view.material.needsUpdate = true
  }

  function spawnShards(hex, pos, count = 9) {
    for (let i = 0; i < count; i += 1) {
      const mat = new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 1 })
      const mesh = new THREE.Mesh(SHARD_GEO, mat)
      mesh.position.copy(pos)
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.7 + 0.15, Math.random() - 0.5).normalize()
      shards.push({
        mesh,
        mat,
        vel: dir.multiplyScalar(2.4 + Math.random() * 2.4),
        ang: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12),
        life: 0,
        ttl: 0.5 + Math.random() * 0.25,
      })
      group.add(mesh)
    }
  }

  function shockwave(center, color = 0xffd27a) {
    const geo = new THREE.RingGeometry(0.18, 0.3, 36)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(center)
    mesh.rotation.x = -Math.PI / 2
    group.add(mesh)
    let t = 0
    anims.push({
      update(dt) {
        t += dt
        const p = Math.min(1, t / 0.45)
        mesh.scale.setScalar(0.6 + p * 5)
        mat.opacity = Math.max(0, 0.9 * (1 - p))
        if (p >= 1) {
          group.remove(mesh)
          geo.dispose()
          mat.dispose()
          return true
        }
        return false
      },
    })
  }

  function pulseTiles(path, done) {
    const targets = path.map(([x, y]) => findTileAt(x, y)).filter(Boolean).map((t) => views.get(t.id)).filter(Boolean)
    targets.forEach((v) => {
      v.manual = true
    })
    let t = 0
    anims.push({
      update(dt) {
        t += dt
        const p = Math.min(1, t / 0.3)
        const s = 1 + Math.sin(p * Math.PI) * 0.3
        targets.forEach((v) => v.mesh.scale.setScalar(s))
        if (p >= 1) {
          targets.forEach((v) => {
            v.mesh.scale.setScalar(1)
            v.manual = false
          })
          done()
          return true
        }
        return false
      },
    })
  }

  // ---------- resolution timeline ----------
  function playResolution(events, finalBoard, opts = {}) {
    if (disposed) return
    busy = true
    if (selection.length) clearSelection()

    let skipFinalSync = false
    const originPositions = new Map()
    for (const [id, view] of views) originPositions.set(id, view.mesh.position.clone())

    const cascadeIds = new Set()
    for (const ev of events) {
      if (ev.kind === 'clear' && ev.cascade) for (const tile of ev.removed) cascadeIds.add(tile.id)
    }

    let index = 0
    function nextStep() {
      if (index >= events.length) {
        busy = false
        if (!skipFinalSync) sync(finalBoard)
        opts.onDone?.()
        return
      }
      const ev = events[index]
      index += 1
      opts.onEvent?.(ev)

      if (ev.kind === 'crack') {
        const vs = tileViewsAt(ev.path.map(([x, y]) => ({ x, y })))
        vs.forEach((v) => {
          updateTileVisual(v)
          burstAtWorld(v.mesh.position, {
            color: 0xdff2fb,
            count: 34,
            size: 0.32,
            ttl: 0.8,
            speedMin: 0.09,
            speedMax: 0.22,
            up: 0.16,
            gravity: 0.7,
          })
          spawnShards(0xbfe6f5, v.mesh.position, 14)
          shockwave(v.mesh.position, 0xaee3f5)
        })
        shake = Math.max(shake, 0.26)
        vibrate(28)
        playIceBreak()
        pulseTiles(ev.path, nextStep)
      } else if (ev.kind === 'unlock') {
        const vs = tileViewsAt(ev.tiles)
        vs.forEach((v) => {
          updateTileVisual(v)
          burstAtWorld(v.mesh.position, { color: 0xe2b25e, count: 16, size: 0.12, ttl: 0.6, up: 0.12 })
        })
        playUnlock()
        flashViews(vs, 0.32, nextStep)
      } else if (ev.kind === 'bombTick') {
        const vs = tileViewsAt(ev.tiles)
        vs.forEach((v) => {
          updateTileVisual(v)
          if ((v.tile.countdown || 0) <= 2) {
            burstAtWorld(v.mesh.position, { color: 0xd97b6c, count: 8, size: 0.12, ttl: 0.5, up: 0.09 })
          }
        })
        playTick()
        flashViews(vs, 0.18, nextStep)
      } else if (ev.kind === 'bombExplode') {
        const vs = tileViewsAt(ev.tiles)
        const center = vs.length ? vs[0].mesh.position.clone() : new THREE.Vector3()
        skipFinalSync = true
        blowUpAll(center, nextStep)
      } else if (ev.kind === 'clear') {
        animateClear(ev, cascadeIds, originPositions, nextStep)
      } else {
        nextStep()
      }
    }
    nextStep()
  }

  function animateClear(ev, cascadeIds, originPositions, done) {
    const removedViews = ev.removed.map((t) => views.get(t.id)).filter(Boolean)
    const movedViews = ev.moves
      .filter((m) => !cascadeIds.has(m.tile.id))
      .map((m) => ({ view: views.get(m.tile.id), to: worldPos(m.tile.x, m.toY) }))
      .filter((m) => m.view)

    removedViews.forEach((v) => {
      v.manual = true
    })
    movedViews.forEach((m) => {
      m.view.manual = true
      m.from = m.view.mesh.position.clone()
    })

    // 级联：从本次操作开始的位置（上下两端）飞入；普通消除：从当前位置微撞
    const starts = removedViews.map((v) => {
      const origin = ev.cascade ? originPositions.get(v.tile.id) : v.mesh.position
      return (origin || v.mesh.position).clone()
    })
    removedViews.forEach((v, k) => v.mesh.position.copy(starts[k]))

    const centroid = new THREE.Vector3()
    starts.forEach((s) => centroid.add(s))
    centroid.multiplyScalar(1 / Math.max(1, starts.length))

    let phase = 0
    let t = 0
    let mStarts = null
    const T_CONVERGE = 0.16
    const T_GRAVITY = 0.18

    anims.push({
      update(dt) {
        t += dt
        if (phase === 0) {
          const p = Math.min(1, t / T_CONVERGE)
          const e = easeOutCubic(p)
          removedViews.forEach((v, k) => {
            v.mesh.position.lerpVectors(starts[k], centroid, e)
            v.mesh.rotation.y += dt * 10
            v.mesh.scale.setScalar(1 + e * 0.12)
          })
          if (p >= 1) {
            // 硬碰撞：破碎成小块 + 粒子 + 词名 + 震动 + 音效
            const bombHex = 0xffd27a
            removedViews.forEach((v) =>
              spawnShards(v.tile.type === 'bomb' ? bombHex : v.material.color.getHex(), v.mesh.position),
            )
            const bombPositions = removedViews
              .filter((v) => v.tile.type === 'bomb')
              .map((v) => v.mesh.position.clone())
            removedViews.forEach((v) => {
              disposeView(v)
              views.delete(v.tile.id)
            })
            burstAtWorld(centroid)
            showWordPop(centroid, ev.text)
            shake = 0.24
            playImpact()
            vibrate(30)
            if (bombPositions.length) {
              // 拆弹：金色冲击环 + 火花 + 强震
              bombPositions.forEach((pos) => {
                shockwave(pos, bombHex)
                burstAtWorld(pos, {
                  color: bombHex,
                  count: 30,
                  size: 0.22,
                  speedMin: 0.08,
                  speedMax: 0.22,
                  up: 0.13,
                  gravity: 0.7,
                  ttl: 0.85,
                })
              })
              shake = Math.max(shake, 0.36)
              vibrate([20, 30, 40])
              playDefuse()
            } else {
              playShatter(0.06)
            }
            if (ev.cascade) window.setTimeout(() => playClear(ev.combo), 130)
            mStarts = movedViews.map((m) => m.view.mesh.position.clone())
            phase = 1
            t = 0
          }
        } else {
          const p = Math.min(1, t / T_GRAVITY)
          const e = easeOutCubic(p)
          movedViews.forEach((m, k) => m.view.mesh.position.lerpVectors(mStarts[k], m.to, e))
          if (p >= 1) {
            movedViews.forEach((m) => {
              m.view.manual = false
            })
            done()
            return true
          }
        }
        return false
      },
    })
  }

  const clock = new THREE.Clock()
  function render() {
    if (disposed) return
    const dt = Math.min(clock.getDelta(), 0.05)

    for (const [id, view] of [...views]) {
      if (view.manual) continue
      const mesh = view.mesh
      if (view.targetPos) mesh.position.lerp(view.targetPos, Math.min(1, dt * 9))
      const s = view.mesh.scale.x + (view.targetScale - view.mesh.scale.x) * Math.min(1, dt * 10)
      mesh.scale.setScalar(Math.max(s, 0.001))
      if (view.removing) {
        setOpacity(view, Math.max(0, view.material.opacity - dt * 4))
        if (mesh.scale.x < 0.03) {
          disposeView(view)
          views.delete(id)
        }
      }
    }

    for (let i = anims.length - 1; i >= 0; i -= 1) {
      if (anims[i].update(dt)) anims.splice(i, 1)
    }

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const b = bursts[i]
      b.life += dt
      const arr = b.geometry.attributes.position.array
      for (let j = 0; j < b.velocities.length; j += 1) {
        arr[j * 3] += b.velocities[j].x
        arr[j * 3 + 1] += b.velocities[j].y
        arr[j * 3 + 2] += b.velocities[j].z
        b.velocities[j].y -= dt * (b.gravity ?? 0.5)
      }
      b.geometry.attributes.position.needsUpdate = true
      b.material.opacity = Math.max(0, 1 - b.life / b.ttl)
      if (b.life >= b.ttl) {
        scene.remove(b.points)
        b.geometry.dispose()
        b.material.dispose()
        bursts.splice(i, 1)
      }
    }

    for (let i = shards.length - 1; i >= 0; i -= 1) {
      const s = shards[i]
      s.life += dt
      s.mesh.position.addScaledVector(s.vel, dt)
      s.vel.y -= 8 * dt
      s.mesh.rotation.x += s.ang.x * dt
      s.mesh.rotation.y += s.ang.y * dt
      s.mesh.rotation.z += s.ang.z * dt
      s.mat.opacity = Math.max(0, 1 - s.life / s.ttl)
      if (s.life >= s.ttl) {
        group.remove(s.mesh)
        s.mat.dispose()
        shards.splice(i, 1)
      }
    }

    if (shake > 0) {
      shake = Math.max(0, shake - dt)
      const mag = shake * 0.5
      group.position.set((Math.random() - 0.5) * mag, 0, (Math.random() - 0.5) * mag)
    } else if (group.position.lengthSq() !== 0) {
      group.position.set(0, 0, 0)
    }

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(render)
  }

  const observer = new ResizeObserver(fitCamera)
  observer.observe(canvas)
  fitCamera()
  render()

  if (import.meta.env.DEV) {
    window.__wfDebug = {
      cols,
      rows,
      project: (x, y) => projectToScreen(worldPos(x, y)),
      corners: () => [
        projectToScreen(worldPos(0, 0)),
        projectToScreen(worldPos(cols - 1, 0)),
        projectToScreen(worldPos(0, rows - 1)),
        projectToScreen(worldPos(cols - 1, rows - 1)),
      ],
    }
  }

  return {
    sync,
    playResolution,
    clearSelection,
    submitSelection() {
      if (busy) return
      if (selection.length >= 2 && selectionText()) callbacks.onSubmit?.(selection.slice())
      clearSelection()
    },
    previewPath(cells) {
      if (busy) return
      selection = cells.slice()
      applySelectionHighlight()
      emitSelectionChange()
      window.clearTimeout(previewTimer)
      previewTimer = window.setTimeout(() => clearSelection(), 1600)
    },
    burst,
    getSelection() {
      return selection.slice()
    },
    dispose() {
      disposed = true
      busy = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(previewTimer)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      for (const view of views.values()) disposeView(view)
      views.clear()
      for (const s of shards) {
        group.remove(s.mesh)
        s.mat.dispose()
      }
      shards.length = 0
      renderer.dispose()
    },
  }
}
