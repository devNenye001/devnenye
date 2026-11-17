import { useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useTexture } from '@react-three/drei'
import { Ingredient, type IngredientKind } from './Ingredients'
import { intro, pointer } from '../../lib/store'
import { assets } from '../../config/brand'

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
export const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/** Warm studio lighting with soft reflections — computed once, no HDR download. */
export function StudioLights({ warm = '#ff6b3d' }: { warm?: string }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-6, -2, -4]} intensity={2.2} color={warm} />
      <pointLight position={[-3, 3, 4]} intensity={18} color="#ffd9a0" distance={14} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff6e8" position={[0, 5, 2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} color="#ffe2b8" position={[5, 1, 3]} scale={[3, 6, 1]} rotation-y={-Math.PI / 3} />
        <Lightformer form="ring" intensity={2.5} color="#ff8a5c" position={[-5, 0, -2]} scale={3} rotation-y={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1} color="#3a0e06" position={[0, -5, 0]} scale={[12, 12, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
    </>
  )
}

export interface FieldItem {
  kind: IngredientKind
  p: [number, number, number]
  s: number
  r?: [number, number, number]
  color?: string
  /** intro delay in seconds */
  d?: number
}

interface FloaterProps {
  item: FieldItem
  sx: number
  sy: number
  si: number
  /** 0..1 — how far the field has been scattered by scrolling */
  scatter?: { progress: number }
  children?: ReactNode
}

/** Animates one ingredient: pop-in, idle bob and spin, pointer parallax and scroll scatter. */
export function Floater({ item, sx, sy, si, scatter }: FloaterProps) {
  const ref = useRef<THREE.Group>(null)
  const state = useRef({ t: -(item.d ?? 0), seed: Math.random() * 100 })
  const base = useMemo(() => new THREE.Vector3(item.p[0] * sx, item.p[1] * sy, item.p[2]), [item.p, sx, sy])
  const outward = useMemo(() => base.clone().setZ(0).normalize(), [base])
  const rot = item.r ?? [0, 0, 0]

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const st = state.current
    if (intro.revealed) st.t += dt
    const k = easeOutBack(clamp01(st.t / 1.15))
    const time = st.t + st.seed
    const p = scatter?.progress ?? 0
    const depth = (base.z + 4) * 0.09

    g.position.set(
      base.x + outward.x * p * 3.2 + pointer.sx * depth,
      base.y + Math.sin(time * 0.8) * 0.12 + outward.y * p * 2.6 + pointer.sy * depth * 0.6,
      base.z + p * 2.2,
    )
    g.rotation.set(
      rot[0] + Math.sin(time * 0.5) * 0.18 + p * 1.2,
      rot[1] + time * 0.22 + p * 2,
      rot[2] + Math.cos(time * 0.4) * 0.12,
    )
    g.scale.setScalar(Math.max(0.0001, item.s * si * k))
  })

  return (
    <group ref={ref} scale={0.0001}>
      <Ingredient kind={item.kind} color={item.color} />
    </group>
  )
}

/** Jar dimensions in world units (aspect taken from the supplied product photograph). */
export const JAR_H = 3.6
export const JAR_W = JAR_H * (1180 / 2058)

/**
 * The real Oyegonu jar photograph, mapped onto a shallow cylinder segment.
 * Seen head-on it is exactly the photo; as it turns it gains believable curvature.
 */
export function JarMesh() {
  const tex = useTexture(assets.jar)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8

  const geometry = useMemo(() => {
    const theta = Math.PI * 0.7
    const half = JAR_W / 2
    const R = half / Math.sin(theta / 2)
    const g = new THREE.CylinderGeometry(R, R, JAR_H, 64, 1, true, -theta / 2, theta)
    const pos = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      uv.setX(i, 0.5 + pos.getX(i) / (2 * half))
    }
    // pull the arc back so its front face sits at z = 0
    g.translate(0, 0, -R)
    return g
  }, [])

  return (
    <mesh geometry={geometry} position-z={JAR_W / 2 / Math.sin(Math.PI * 0.35)}>
      <meshBasicMaterial map={tex} transparent toneMapped={false} alphaTest={0.02} />
    </mesh>
  )
}
