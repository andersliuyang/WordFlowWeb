import * as THREE from 'three'
import { createTextTexture } from '../render/text-texture.js'

const GLYPHS = ['W', 'O', 'R', 'D', 'F', 'L', 'O', 'W', '字', '谜', '消', '词', '拼', '合', '风', '云']

function mulberry32(seed) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 首页 3D 背景：悬浮字符方块 + 星场 + 指针视差。
 * 所有视觉均由代码生成，不加载任何外部资源。
 */
export function createHomeScene(canvas) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x070b17, 0.038)

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 14)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)

  scene.add(new THREE.AmbientLight(0x9fc7ff, 0.85))

  const key = new THREE.DirectionalLight(0xffffff, 1.7)
  key.position.set(6, 9, 11)
  scene.add(key)

  const rim = new THREE.PointLight(0x4f7cff, 90, 60)
  rim.position.set(-9, -4, 7)
  scene.add(rim)

  const warm = new THREE.PointLight(0xff7ecb, 70, 60)
  warm.position.set(10, -7, 5)
  scene.add(warm)

  const group = new THREE.Group()
  scene.add(group)

  const random = mulberry32(20260914)
  const geometry = new THREE.BoxGeometry(1.7, 1.7, 1.7)
  const cubes = []
  const count = GLYPHS.length

  for (let i = 0; i < count; i += 1) {
    const glyph = GLYPHS[i]
    const material = new THREE.MeshStandardMaterial({
      map: createTextTexture(glyph),
      roughness: 0.32,
      metalness: 0.18,
    })
    const mesh = new THREE.Mesh(geometry, material)

    const angle = (i / count) * Math.PI * 2 + random() * 0.7
    const radius = 8.5 * (0.45 + random() * 0.55)
    mesh.position.set(
      Math.cos(angle) * radius,
      (random() - 0.5) * 9,
      -1.5 - random() * 9,
    )
    mesh.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI)
    mesh.userData = {
      rx: (random() - 0.5) * 0.5,
      ry: (random() - 0.5) * 0.5,
      baseY: mesh.position.y,
      bob: 0.25 + random() * 0.5,
      phase: random() * Math.PI * 2,
    }
    group.add(mesh)
    cubes.push(mesh)
  }

  const starCount = 420
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i += 1) {
    starPositions[i * 3] = (random() - 0.5) * 46
    starPositions[i * 3 + 1] = (random() - 0.5) * 30
    starPositions[i * 3 + 2] = -6 - random() * 34
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({
    color: 0x9fd0ff,
    size: 0.09,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  })
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  const pointer = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }

  const host = canvas.parentElement || document.body
  const size = { width: 1, height: 1 }

  function resize() {
    size.width = host.clientWidth || window.innerWidth
    size.height = host.clientHeight || window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(size.width, size.height, false)
  }
  resize()

  const observer = new ResizeObserver(resize)
  observer.observe(host)

  function onPointerMove(event) {
    target.x = (event.clientX / window.innerWidth) * 2 - 1
    target.y = (event.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const clock = new THREE.Clock()
  let rafId = 0

  function render() {
    const t = clock.getElapsedTime()
    pointer.x += (target.x - pointer.x) * 0.045
    pointer.y += (target.y - pointer.y) * 0.045

    group.rotation.y = pointer.x * 0.22
    group.rotation.x = pointer.y * 0.12

    for (const cube of cubes) {
      cube.rotation.x += cube.userData.rx * 0.006
      cube.rotation.y += cube.userData.ry * 0.006
      cube.position.y = cube.userData.baseY + Math.sin(t * cube.userData.bob + cube.userData.phase) * 0.35
    }

    stars.rotation.z = t * 0.008

    camera.position.x = pointer.x * 1.1
    camera.position.y = -pointer.y * 0.7
    camera.lookAt(0, 0, -3)

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(render)
  }
  render()

  return {
    dispose() {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      geometry.dispose()
      for (const cube of cubes) cube.material.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
      renderer.dispose()
    },
  }
}
