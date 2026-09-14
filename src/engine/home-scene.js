import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createTextTexture } from '../render/text-texture.js'

const GLYPHS = ['字', '谜', 'W', 'O', '词', 'R', 'D', '风']

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

function makeFloater(mesh, random) {
  mesh.userData = {
    rx: (random() - 0.5) * 0.45,
    ry: (random() - 0.5) * 0.45,
    baseY: mesh.position.y,
    bob: 0.2 + random() * 0.45,
    phase: random() * Math.PI * 2,
  }
}

/**
 * 首页 3D 背景：圆角字符骰子 + 柔和粒子 + 指针视差。
 * 莫兰迪 / 马卡龙风格，全部由代码生成，不加载任何外部资源。
 */
export function createHomeScene(canvas) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xf1ebe2, 16, 46)

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 15)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe0d5c8, 1.15))

  const key = new THREE.DirectionalLight(0xfff6ee, 1.15)
  key.position.set(6, 9, 10)
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xcad8e6, 0.55)
  fill.position.set(-8, -4, 6)
  scene.add(fill)

  const group = new THREE.Group()
  scene.add(group)

  const random = mulberry32(20260915)
  const floaters = []
  const disposables = []

  const cubeGeometry = new RoundedBoxGeometry(1.6, 1.6, 1.6, 4, 0.26)
  disposables.push(cubeGeometry)

  const cubeCount = 14
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < cubeCount; i += 1) {
    const glyph = GLYPHS[i % GLYPHS.length]
    const material = new THREE.MeshStandardMaterial({
      map: createTextTexture(glyph),
      roughness: 0.72,
      metalness: 0,
    })
    const mesh = new THREE.Mesh(cubeGeometry, material)

    const angle = i * goldenAngle + (random() - 0.5) * 0.4
    const spread = (i + 0.5) / cubeCount
    const distance = 3.2 + Math.sqrt(spread) * 6.8 + (random() - 0.5) * 1.1

    mesh.position.set(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance * 0.72,
      -1.5 - random() * 6.5,
    )

    // 沿径向向外翻滚的姿态，制造爆散感
    mesh.rotation.set(
      (random() - 0.5) * 1.1,
      random() * Math.PI,
      angle * 0.45 + (random() - 0.5) * 0.6,
    )
    mesh.scale.setScalar(0.82 + random() * 0.42)
    makeFloater(mesh, random)

    group.add(mesh)
    floaters.push(mesh)
    disposables.push(material)
  }

  const particleCount = 240
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i += 1) {
    particlePositions[i * 3] = (random() - 0.5) * 44
    particlePositions[i * 3 + 1] = (random() - 0.5) * 28
    particlePositions[i * 3 + 2] = -5 - random() * 32
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xfdf6ec,
    size: 0.11,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  })
  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)
  disposables.push(particleGeometry, particleMaterial)

  const pointer = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }

  const host = canvas.parentElement || document.body

  function resize() {
    const width = host.clientWidth || window.innerWidth
    const height = host.clientHeight || window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
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

    for (const mesh of floaters) {
      mesh.rotation.x += mesh.userData.rx * 0.006
      mesh.rotation.y += mesh.userData.ry * 0.006
      mesh.position.y =
        mesh.userData.baseY + Math.sin(t * mesh.userData.bob + mesh.userData.phase) * 0.35
    }

    particles.rotation.z = t * 0.006

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
      for (const item of disposables) item.dispose()
      renderer.dispose()
    },
  }
}
