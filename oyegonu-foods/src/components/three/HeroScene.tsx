import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Floater, JarMesh, StudioLights, clamp01, easeOutBack, type FieldItem } from './SceneKit'
import { heroScroll, intro, pointer, tickPointer } from '../../lib/store'

/** Composed for a 16:9 frame (~11 × 6.3 world units at z = 0); rescaled for other ratios. */
const ITEMS: FieldItem[] = [
  { kind: 'tomato', p: [-3.3, -1.55, 1.6], s: 0.78, r: [0.3, 0.2, 0.1], d: 0.15 },
  { kind: 'tomato', p: [3.5, 1.55, -2.4], s: 0.95, r: [-0.2, 0.5, 0.2], d: 0.35 },
  { kind: 'tomato', p: [2.05, -2.05, 1.3], s: 0.42, r: [0.6, 0, -0.3], d: 0.5 },
  { kind: 'bonnet', p: [-2.35, 1.75, 0.7], s: 0.55, color: '#e3341b', d: 0.25 },
  { kind: 'bonnet', p: [2.75, -0.15, 1.7], s: 0.42, color: '#f2c21f', d: 0.45 },
  { kind: 'bonnet', p: [-4.3, 0.35, -2.2], s: 0.62, color: '#f0861a', d: 0.6 },
  { kind: 'chili', p: [1.95, 1.7, 1.0], s: 0.5, r: [0, 0, -0.9], d: 0.3 },
  { kind: 'chili', p: [-1.7, -2.35, -0.6], s: 0.45, r: [0.2, 0.4, 1.9], d: 0.55 },
  { kind: 'onion', p: [4.6, -1.4, -0.8], s: 0.62, r: [0.2, 0.3, 0.55], d: 0.4 },
  { kind: 'rings', p: [-4.6, -2.0, 0.4], s: 0.75, r: [1.1, 0.3, 0], d: 0.5 },
  { kind: 'rings', p: [4.0, 2.65, -1.2], s: 0.55, r: [0.6, -0.4, 0.2], d: 0.65 },
  { kind: 'blob', p: [-1.45, 0.85, 2.0], s: 0.22, d: 0.7 },
  { kind: 'blob', p: [1.55, -1.15, 2.5], s: 0.15, d: 0.75 },
  { kind: 'blob', p: [-3.1, 2.55, -1.6], s: 0.32, d: 0.8 },
  { kind: 'blob', p: [3.0, -2.6, -0.5], s: 0.2, d: 0.85 },
  { kind: 'drop', p: [-0.9, 2.3, 1.2], s: 0.07, d: 0.9 },
  { kind: 'drop', p: [1.2, 2.45, 0.6], s: 0.05, d: 0.95 },
  { kind: 'drop', p: [-2.3, -0.4, 2.2], s: 0.06, d: 1.0 },
]

function Jar({ portrait, scale }: { portrait: boolean; scale: number }) {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(-0.05)
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    if (intro.revealed) t.current += dt
    const k = clamp01(t.current / 1.3)
    const e = easeOutBack(k)
    const p = heroScroll.progress
    const baseY = portrait ? 0.95 : 0.05
    g.position.y = baseY + (1 - e) * -4 + Math.sin(t.current * 0.9) * 0.06 + p * 1.6
    g.rotation.y = pointer.sx * 0.22 + Math.sin(t.current * 0.45) * 0.06 + p * 0.5 + (1 - e) * 0.8
    g.rotation.x = -pointer.sy * 0.06
    g.rotation.z = (1 - e) * -0.15 + p * -0.08
    g.scale.setScalar(scale * (1 - p * 0.18))
  })
  return (
    <group ref={ref} position-y={-6}>
      <JarMesh />
    </group>
  )
}

function Rig() {
  const { viewport, camera } = useThree()
  const portrait = viewport.aspect < 0.85
  const vw = viewport.width
  const sx = Math.min(1.15, Math.max(0.3, vw / 11))
  const sy = portrait ? 1.05 : 1
  const si = Math.min(1, Math.max(0.55, (vw / 11) * 1.5))
  const jarScale = portrait ? Math.min(0.75, (vw * 0.58) / 2.06) : Math.min(1, viewport.height / 6.3)
  const group = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    tickPointer(dt)
    if (group.current) {
      group.current.rotation.y = pointer.sx * 0.08
      group.current.rotation.x = -pointer.sy * 0.05
    }
    camera.position.z = 10 - heroScroll.progress * 1.2
  })

  return (
    <group ref={group}>
      <Jar portrait={portrait} scale={jarScale} />
      {ITEMS.map((item, i) => (
        <Floater key={i} item={item} sx={sx} sy={sy} si={si} scatter={heroScroll} />
      ))}
    </group>
  )
}

export default function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <StudioLights />
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </Canvas>
  )
}
