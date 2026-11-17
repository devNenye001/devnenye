import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Floater, StudioLights, type FieldItem } from './SceneKit'
import { tickPointer } from '../../lib/store'

/** A looser, jar-less arrangement that frames content around the edges. */
const ITEMS: FieldItem[] = [
  { kind: 'tomato', p: [-4.6, 2.0, -1], s: 0.9, r: [0.4, 0, 0.2] },
  { kind: 'tomato', p: [4.9, -2.1, 0.5], s: 0.7, r: [-0.3, 0.4, 0] },
  { kind: 'bonnet', p: [4.4, 2.3, -0.5], s: 0.6, color: '#f2c21f' },
  { kind: 'bonnet', p: [-4.9, -2.3, 0.8], s: 0.5, color: '#e3341b' },
  { kind: 'chili', p: [-3.2, -0.2, 1.5], s: 0.45, r: [0, 0, 2.2] },
  { kind: 'onion', p: [5.6, 0.3, -1.5], s: 0.55, r: [0, 0, -0.5] },
  { kind: 'rings', p: [-2.1, 2.7, 0.2], s: 0.5, r: [1, 0.2, 0] },
  { kind: 'blob', p: [2.4, 2.8, 1], s: 0.22 },
  { kind: 'blob', p: [-1.5, -2.8, 1.4], s: 0.18 },
  { kind: 'blob', p: [3.4, -0.6, -2.5], s: 0.35 },
]

function Rig() {
  const { viewport } = useThree()
  const vw = viewport.width
  const sx = Math.min(1.1, Math.max(0.42, vw / 11))
  const si = Math.min(1, Math.max(0.5, (vw / 11) * 1.4))
  useFrame((_, dt) => tickPointer(dt))
  return (
    <>
      {ITEMS.map((item, i) => (
        <Floater key={i} item={item} sx={sx} sy={1} si={si} />
      ))}
    </>
  )
}

export default function FieldScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping
      }}
    >
      <StudioLights warm="#ffb347" />
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </Canvas>
  )
}
