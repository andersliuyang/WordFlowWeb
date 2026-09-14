import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createGlyphTexture } from '../render/tile-texture.js'
import { playClick } from '../audio/sfx.js'

const TILE_SIZE = 1
const SPACING = 1.16
const TILE_GEO = new RoundedBoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE, 3, 0.16)
const DECAL_GEO = new THREE.PlaneGeometry(0.66, 0.66)

function decalKey(tile) {
  return [tile.char, tile.type, tile.countdown ?? 0, tile.locked ? 1 : 0].join('|')
}

function tileColor(tile) {
  if (tile.type === 'ice') return (tile.hp || 1) > 1 ? 0xbfe0ec : 0xd9eff7
  if (tile.type === 'lock') return tile.locked ? 0xc6ccd6 : 0xe8dccb
  if (tile.type === 'bomb') return 0xf0d7d0
  return 0xf0e4d6
}

/**
 * 3D 棋盘视图 + 射线拾取输入。
 * 纯表现层：渲染 session.board，并把玩家选取的路径回调出去。
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

  function fitCamera() {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    camera.aspect = width / height
    const fovRad = THREE.MathUtils.degToRad(camera.fov)
    const halfW = (cols * SPACING) / 2 + 1
    const halfD = (rows * SPACING) / 2 + 1
    const distW = halfW / (Math.tan(fovRad / 2) * camera.aspect)
    const distH = halfD / Math.tan(fovRad / 2)
    const dist = Math.max(distW, distH) * 1.28
    // 接近俯视：仰角约 67°
    const tilt = THREE.MathUtils.degToRad(67)
    camera.position.set(0, Math.sin(tilt) * dist, Math.cos(tilt) * dist)
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
    }
    views.set(tile.id, view)
    return view
  }

  function sync(board) {
    const current = new Map()
    for (const tile of board.tiles()) current.set(tile.id, tile)

    for (const [id, tile] of current) {
      let view = views.get(id)
      if (!view) view = buildView(tile)
      view.tile = tile
      view.targetPos = worldPos(tile.x, tile.y)
      view.removing = false
      view.targetScale = 1

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

    for (const [id, view] of views) {
      if (!current.has(id) && !view.removing) {
        view.removing = true
        view.targetScale = 0
      }
    }

    applySelectionHighlight()
  }

  function applySelectionHighlight() {
    const selectedIds = new Set(selection.map(([x, y]) => {
      const tile = findTileAt(x, y)
      return tile ? tile.id : null
    }))
    for (const [id, view] of views) {
      const on = selectedIds.has(id)
      view.material.emissive.set(on ? 0xffb85c : 0x000000)
      view.material.emissiveIntensity = on ? 0.5 : 0
      if (!view.removing) view.targetScale = on ? 1.12 : 1
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

  function pick(event) {
    const rect = canvas.getBoundingClientRect()
    pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointerNDC, camera)
    const targets = []
    for (const view of views.values()) {
      if (!view.removing && view.targetScale > 0.5) targets.push(view.mesh)
    }
    const hits = raycaster.intersectObjects(targets, false)
    if (!hits.length) return null
    const tile = hits[0].object.userData.tile
    if (!tile || tile.locked) return null
    return tile
  }

  function addToSelection(tile) {
    const cell = [tile.x, tile.y]
    if (selection.length === 0) {
      selection = [cell]
    } else if (isAdjacent(selection[selection.length - 1], cell)) {
      if (!selection.some(([x, y]) => x === cell[0] && y === cell[1])) selection = selection.concat([cell])
    } else {
      selection = [cell]
    }
    playClick()
    applySelectionHighlight()
    emitSelectionChange()
  }

  function onPointerDown(event) {
    if (disposed) return
    const tile = pick(event)
    if (!tile) return
    selecting = true
    moved = false
    downPoint = { x: event.clientX, y: event.clientY }
    canvas.setPointerCapture?.(event.pointerId)

    const cell = [tile.x, tile.y]
    const last = selection[selection.length - 1]
    if (last && last[0] === cell[0] && last[1] === cell[1] && selection.length > 1) {
      selection = selection.slice(0, -1)
      applySelectionHighlight()
      emitSelectionChange()
      return
    }
    addToSelection(tile)
  }

  function onPointerMove(event) {
    if (!selecting || disposed) return
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
      if (selection.length >= 2 && text) {
        callbacks.onSubmit?.(selection.slice())
        clearSelection()
      } else {
        clearSelection()
      }
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  function burst(cells) {
    if (!cells.length) return
    const center = new THREE.Vector3()
    for (const [x, y] of cells) center.add(worldPos(x, y))
    center.multiplyScalar(1 / cells.length)

    const count = 18
    const positions = new Float32Array(count * 3)
    const velocities = []
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = center.x
      positions[i * 3 + 1] = center.y
      positions[i * 3 + 2] = center.z
      const angle = (i / count) * Math.PI * 2
      const speed = 0.04 + Math.random() * 0.06
      velocities.push(new THREE.Vector3(Math.cos(angle) * speed, 0.05 + Math.random() * 0.06, Math.sin(angle) * speed))
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ color: 0xe8b06a, size: 0.16, transparent: true, opacity: 0.95, depthWrite: false })
    const points = new THREE.Points(geometry, material)
    scene.add(points)
    bursts.push({ points, geometry, material, velocities, life: 0, ttl: 0.7 })
  }

  const clock = new THREE.Clock()
  function render() {
    if (disposed) return
    const dt = Math.min(clock.getDelta(), 0.05)

    for (const [id, view] of [...views]) {
      const mesh = view.mesh
      if (view.targetPos) mesh.position.lerp(view.targetPos, Math.min(1, dt * 9))
      const s = mesh.scale.x + (view.targetScale - mesh.scale.x) * Math.min(1, dt * 10)
      mesh.scale.setScalar(Math.max(s, 0.001))
      if (view.removing && mesh.scale.x < 0.03) {
        group.remove(mesh)
        view.material.dispose()
        view.decalMaterial.dispose()
        views.delete(id)
      }
    }

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const b = bursts[i]
      b.life += dt
      const arr = b.geometry.attributes.position.array
      for (let j = 0; j < b.velocities.length; j += 1) {
        arr[j * 3] += b.velocities[j].x
        arr[j * 3 + 1] += b.velocities[j].y
        arr[j * 3 + 2] += b.velocities[j].z
        b.velocities[j].y -= dt * 0.35
      }
      b.geometry.attributes.position.needsUpdate = true
      b.material.opacity = Math.max(0, 0.95 * (1 - b.life / b.ttl))
      if (b.life >= b.ttl) {
        scene.remove(b.points)
        b.geometry.dispose()
        b.material.dispose()
        bursts.splice(i, 1)
      }
    }

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(render)
  }

  const observer = new ResizeObserver(fitCamera)
  observer.observe(canvas)
  fitCamera()
  render()

  return {
    sync,
    clearSelection,
    submitSelection() {
      if (selection.length >= 2 && selectionText()) {
        callbacks.onSubmit?.(selection.slice())
      }
      clearSelection()
    },
    beginTargeted() {
      callbacks.onSelectionMode?.('targeted')
    },
    previewPath(cells) {
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
      cancelAnimationFrame(rafId)
      window.clearTimeout(previewTimer)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      for (const view of views.values()) {
        view.material.dispose()
        view.decalMaterial.dispose()
      }
      views.clear()
      renderer.dispose()
    },
  }
}
