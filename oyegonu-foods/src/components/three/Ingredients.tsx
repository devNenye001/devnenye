import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { MeshDistortMaterial } from '@react-three/drei'

/* ------------------------------------------------------------------------------------------
 * Procedural, dependency-free ingredient models. Geometry is generated once per type and
 * shared between instances, so a whole scene costs only a handful of draw calls.
 * ---------------------------------------------------------------------------------------- */

const cache = new Map<string, THREE.BufferGeometry>()
function shared(key: string, build: () => THREE.BufferGeometry) {
  let g = cache.get(key)
  if (!g) {
    g = build()
    cache.set(key, g)
  }
  return g
}

/** Weld seams after deforming so normals stay smooth. */
function finish(g: THREE.BufferGeometry) {
  g.deleteAttribute('uv')
  g.deleteAttribute('normal')
  const merged = mergeVertices(g, 1e-4)
  merged.computeVertexNormals()
  return merged
}

/** A tube whose radius follows `taper(u)`, optionally vertex-coloured along its length. */
function taperTube(
  curve: THREE.Curve<THREE.Vector3>,
  radius: number,
  taper: (u: number) => number,
  segments = 80,
  radial = 20,
  colorAt?: (u: number) => THREE.Color,
) {
  const g = new THREE.TubeGeometry(curve, segments, radius, radial, false)
  const pos = g.attributes.position
  const center = new THREE.Vector3()
  const v = new THREE.Vector3()
  const colors = colorAt ? new Float32Array(pos.count * 3) : null
  for (let i = 0; i <= segments; i++) {
    const u = i / segments
    curve.getPointAt(u, center)
    const f = taper(u)
    const c = colorAt?.(u)
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j
      v.fromBufferAttribute(pos, idx).sub(center).multiplyScalar(f).add(center)
      pos.setXYZ(idx, v.x, v.y, v.z)
      if (colors && c) colors.set([c.r, c.g, c.b], idx * 3)
    }
  }
  if (colors) g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  g.computeVertexNormals()
  return g
}

/* ---------------------------------------- Materials --------------------------------------- */

const mats = {
  tomato: new THREE.MeshPhysicalMaterial({
    color: '#c8170c',
    roughness: 0.3,
    clearcoat: 0.9,
    clearcoatRoughness: 0.18,
    sheen: 0.35,
    sheenColor: new THREE.Color('#ff7a52'),
  }),
  leaf: new THREE.MeshStandardMaterial({ color: '#3f6e22', roughness: 0.6 }),
  stem: new THREE.MeshStandardMaterial({ color: '#557a2a', roughness: 0.7 }),
  chili: new THREE.MeshPhysicalMaterial({ color: '#b3120a', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1 }),
  onionWhite: new THREE.MeshPhysicalMaterial({ color: '#f3f0e3', roughness: 0.35, clearcoat: 0.6, sheen: 0.5, sheenColor: new THREE.Color('#ffffff') }),
  onionLeaf: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.4 }),
  root: new THREE.MeshStandardMaterial({ color: '#d8cdb0', roughness: 0.9 }),
  ringOuter: new THREE.MeshPhysicalMaterial({ color: '#8d2a58', roughness: 0.3, clearcoat: 0.8 }),
  ringMid: new THREE.MeshPhysicalMaterial({ color: '#c98bab', roughness: 0.3, clearcoat: 0.8 }),
  ringInner: new THREE.MeshPhysicalMaterial({ color: '#f1dfe8', roughness: 0.3, clearcoat: 0.8 }),
  droplet: new THREE.MeshPhysicalMaterial({ color: '#7a1709', roughness: 0.1, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 }),
}

const bonnetMats = new Map<string, THREE.MeshPhysicalMaterial>()
function bonnetMaterial(color: string) {
  let m = bonnetMats.get(color)
  if (!m) {
    m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 })
    bonnetMats.set(color, m)
  }
  return m
}

/* ----------------------------------------- Tomato ----------------------------------------- */

const tomatoGeometry = () =>
  shared('tomato', () => {
    const g = new THREE.SphereGeometry(1, 72, 56)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const az = Math.atan2(v.z, v.x)
      const ridge = 1 + 0.035 * Math.cos(az * 5) * (1 - Math.abs(v.y))
      v.x *= ridge
      v.z *= ridge
      v.y *= 0.8
      const rxz = Math.hypot(v.x, v.z)
      if (v.y > 0) v.y -= 0.14 * Math.exp(-(rxz * rxz) / 0.06) // stem dimple
      if (v.y < 0) v.y *= 0.92
      p.setXYZ(i, v.x, v.y, v.z)
    }
    return finish(g)
  })

const sepalGeometry = () => shared('sepal', () => new THREE.SphereGeometry(1, 16, 10))

export function Tomato() {
  const geo = tomatoGeometry()
  const sepal = sepalGeometry()
  const sepals = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + (i % 2) * 0.15), [])
  return (
    <group>
      <mesh geometry={geo} material={mats.tomato} />
      <group position={[0, 0.66, 0]}>
        {sepals.map((a, i) => (
          <group key={i} rotation={[0, a, 0]}>
            <mesh geometry={sepal} material={mats.leaf} position={[0.2, -0.015, 0]} rotation={[0, 0, -0.32]} scale={[0.27, 0.025, 0.065]} />
          </group>
        ))}
        <mesh material={mats.stem} position={[0.02, 0.1, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.032, 0.05, 0.22, 10]} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------- Scotch bonnet -------------------------------------- */

const bonnetGeometry = () =>
  shared('bonnet', () => {
    const profile = [
      [0, -0.4], [0.18, -0.46], [0.42, -0.44], [0.62, -0.3], [0.74, -0.08], [0.75, 0.12],
      [0.66, 0.33], [0.46, 0.46], [0.22, 0.5], [0, 0.47],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const g = new THREE.LatheGeometry(profile, 72)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const az = Math.atan2(v.z, v.x)
      const lowness = THREE.MathUtils.smoothstep(-v.y, -0.3, 0.45)
      const lobes = 1 + 0.13 * Math.cos(az * 4) * (0.4 + lowness)
      const wrinkle = 1 + 0.025 * Math.sin(az * 11 + v.y * 9)
      v.x *= lobes * wrinkle
      v.z *= lobes * wrinkle
      // crumpled lantern bottom
      if (v.y < -0.3) v.y += 0.06 * Math.cos(az * 4)
      p.setXYZ(i, v.x, v.y, v.z)
    }
    return finish(g)
  })

export function ScotchBonnet({ color = '#e3341b' }: { color?: string }) {
  const sepal = sepalGeometry()
  return (
    <group>
      <mesh geometry={bonnetGeometry()} material={bonnetMaterial(color)} />
      <mesh geometry={sepal} material={mats.leaf} position={[0, 0.5, 0]} scale={[0.22, 0.05, 0.22]} />
      <mesh material={mats.stem} position={[0.04, 0.66, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.06, 0.32, 10]} />
      </mesh>
    </group>
  )
}

/* ----------------------------------------- Chilli ----------------------------------------- */

const chiliCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.2, 0),
  new THREE.Vector3(0.22, 0.6, 0.05),
  new THREE.Vector3(0.12, -0.2, 0.1),
  new THREE.Vector3(-0.25, -0.9, 0),
  new THREE.Vector3(-0.65, -1.3, -0.05),
])

const chiliGeometry = () =>
  shared('chili', () => {
    const g = taperTube(chiliCurve, 0.24, (u) => (0.4 + 0.6 * Math.sin(Math.min(u / 0.1, 1) * Math.PI * 0.5)) * Math.pow(1 - u, 0.7), 110, 24)
    return finish(g)
  })

const chiliStemCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.18, 0),
  new THREE.Vector3(-0.03, 1.42, 0),
  new THREE.Vector3(-0.16, 1.58, 0.02),
])
const chiliStemGeometry = () => shared('chiliStem', () => taperTube(chiliStemCurve, 0.05, (u) => 1 - u * 0.35, 20, 10))

export function Chili() {
  return (
    <group>
      <mesh geometry={chiliGeometry()} material={mats.chili} />
      <mesh geometry={sepalGeometry()} material={mats.leaf} position={[0.01, 1.2, 0]} scale={[0.16, 0.06, 0.16]} />
      <mesh geometry={chiliStemGeometry()} material={mats.stem} />
    </group>
  )
}

/* -------------------------------------- Spring onion -------------------------------------- */

const pale = new THREE.Color('#e9ecd0')
const green = new THREE.Color('#3f7a1f')
const leafCurves = [
  [0, 0.15, 0.4, 1.6, 0.3, 2.5, 0.45],
  [0, -0.1, 0.4, 1.7, -0.25, 2.7, -0.5],
  [0.02, 0.05, 0.42, 1.5, 0.05, 2.3, 0.1],
  [-0.02, 0.0, 0.38, 1.9, -0.05, 2.9, 0.15],
].map(
  ([x0, x1, y1, y2, x2, y3, x3]) =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(x0, 0.35, 0),
      new THREE.Vector3(x1 * 0.5, y1 + 0.4, x1 * 0.3),
      new THREE.Vector3(x2, y2, x2 * 0.4),
      new THREE.Vector3(x3, y3, x3 * 0.3),
    ]),
)

const onionLeafGeometries = () =>
  leafCurves.map((c, i) =>
    shared(`leaf${i}`, () =>
      taperTube(c, 0.075 - i * 0.008, (u) => 1 - u * 0.55, 60, 12, (u) => pale.clone().lerp(green, THREE.MathUtils.smoothstep(u, 0.02, 0.3))),
    ),
  )

const bulbGeometry = () =>
  shared('bulb', () => {
    const profile = [
      [0, -0.28], [0.1, -0.27], [0.19, -0.18], [0.21, -0.04], [0.16, 0.12], [0.1, 0.3], [0.085, 0.5], [0, 0.5],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return finish(new THREE.LatheGeometry(profile, 32))
  })

const rootGeometry = () =>
  shared('roots', () => {
    const parts: THREE.BufferGeometry[] = []
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2
      const r = 0.25 + (i % 3) * 0.08
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.26, 0),
        new THREE.Vector3(Math.cos(a) * r * 0.5, -0.4, Math.sin(a) * r * 0.5),
        new THREE.Vector3(Math.cos(a) * r, -0.5 - (i % 2) * 0.1, Math.sin(a) * r),
      ])
      const t = new THREE.TubeGeometry(c, 8, 0.008, 4, false)
      t.deleteAttribute('uv')
      parts.push(t)
    }
    return mergeGeometries(parts)
  })

function mergeGeometries(parts: THREE.BufferGeometry[]) {
  // Lightweight merge for non-indexed tube parts sharing the same attributes.
  const nonIndexed = parts.map((p) => (p.index ? p.toNonIndexed() : p))
  const total = nonIndexed.reduce((n, p) => n + p.attributes.position.count, 0)
  const pos = new Float32Array(total * 3)
  const nor = new Float32Array(total * 3)
  let o = 0
  for (const p of nonIndexed) {
    pos.set(p.attributes.position.array as Float32Array, o * 3)
    nor.set(p.attributes.normal.array as Float32Array, o * 3)
    o += p.attributes.position.count
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  return g
}

export function SpringOnion() {
  const leaves = onionLeafGeometries()
  return (
    <group position={[0, -1.2, 0]}>
      <mesh geometry={bulbGeometry()} material={mats.onionWhite} />
      {leaves.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.onionLeaf} />
      ))}
      <mesh geometry={rootGeometry()} material={mats.root} />
    </group>
  )
}

/* --------------------------------------- Onion rings -------------------------------------- */

export function OnionRings() {
  return (
    <group>
      <mesh material={mats.ringOuter}>
        <torusGeometry args={[0.56, 0.045, 14, 72]} />
      </mesh>
      <mesh material={mats.ringMid} scale={0.99}>
        <torusGeometry args={[0.44, 0.04, 14, 64]} />
      </mesh>
      <mesh material={mats.ringInner}>
        <torusGeometry args={[0.32, 0.036, 14, 56]} />
      </mesh>
    </group>
  )
}

/* -------------------------------------- Stew splashes ------------------------------------- */

export function StewBlob({ speed = 1.6, distort = 0.38 }: { speed?: number; distort?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#7c1a0a"
        roughness={0.1}
        metalness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.06}
        distort={distort}
        speed={speed}
      />
    </mesh>
  )
}

export function Droplet() {
  return (
    <mesh material={mats.droplet} scale={[0.7, 1, 0.7]}>
      <sphereGeometry args={[1, 24, 24]} />
    </mesh>
  )
}

/* ------------------------------------------ Lookup ---------------------------------------- */

export type IngredientKind = 'tomato' | 'bonnet' | 'chili' | 'onion' | 'rings' | 'blob' | 'drop'

export function Ingredient({ kind, color }: { kind: IngredientKind; color?: string }) {
  switch (kind) {
    case 'tomato':
      return <Tomato />
    case 'bonnet':
      return <ScotchBonnet color={color} />
    case 'chili':
      return <Chili />
    case 'onion':
      return <SpringOnion />
    case 'rings':
      return <OnionRings />
    case 'blob':
      return <StewBlob />
    case 'drop':
      return <Droplet />
  }
}
