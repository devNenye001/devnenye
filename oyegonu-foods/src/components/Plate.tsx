import { useId, useMemo, type ReactElement } from 'react'
import type { MealKind } from '../content/meals'
import { assets } from '../config/brand'

/* Deterministic RNG so every render of a plate looks identical. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function blobPath(cx: number, cy: number, r: number, wobble: number, seed: number, points = 14) {
  const rand = rng(seed)
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2
    const rr = r * (1 - wobble / 2 + rand() * wobble)
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]
  })
  // closed Catmull-Rom → cubic Bézier
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % points]
    const p3 = pts[(i + 2) % points]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

/** Scatter n points inside a circle, denser toward the centre (a mound). */
function mound(n: number, cx: number, cy: number, r: number, seed: number) {
  const rand = rng(seed)
  return Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2
    const d = Math.pow(rand(), 0.65) * r
    return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, rot: rand() * 180, t: rand(), depth: 1 - d / r }
  })
}

function Rice({ uid }: { uid: string }) {
  const grains = useMemo(() => mound(420, 160, 190, 92, 7).sort((a, b) => a.depth - b.depth), [])
  return (
    <g filter={`url(#${uid}-soft)`}>
      {grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.x}
          cy={g.y}
          rx={7}
          ry={2.6}
          transform={`rotate(${g.rot} ${g.x} ${g.y})`}
          fill={g.t > 0.85 ? '#efe7d4' : '#fffcf4'}
          stroke="#d9cdb4"
          strokeWidth={0.6}
          opacity={0.75 + g.depth * 0.25}
        />
      ))}
    </g>
  )
}

function Dodo({ uid }: { uid: string }) {
  const slices = useMemo(() => {
    const rand = rng(11)
    return Array.from({ length: 11 }, (_, i) => {
      const row = Math.floor(i / 4)
      return { x: 95 + (i % 4) * 42 + row * 14 + rand() * 8, y: 130 + row * 52 + rand() * 10, rot: -30 + rand() * 20 }
    })
  }, [])
  return (
    <g filter={`url(#${uid}-soft)`}>
      {slices.map((s, i) => (
        <g key={i} transform={`rotate(${s.rot} ${s.x} ${s.y})`}>
          <ellipse cx={s.x} cy={s.y + 3} rx={28} ry={17} fill="#5a2208" opacity={0.25} />
          <ellipse cx={s.x} cy={s.y} rx={28} ry={17} fill={`url(#${uid}-dodo)`} stroke="#8a3d10" strokeWidth={1.4} />
          <ellipse cx={s.x - 6} cy={s.y - 5} rx={9} ry={4} fill="#fff1b8" opacity={0.35} />
        </g>
      ))}
    </g>
  )
}

function Yam({ uid }: { uid: string }) {
  const chunks = [
    { x: 85, y: 120, w: 80, h: 58, r: -14 },
    { x: 150, y: 150, w: 86, h: 62, r: 10 },
    { x: 78, y: 195, w: 78, h: 60, r: 4 },
    { x: 140, y: 232, w: 82, h: 56, r: -8 },
    { x: 100, y: 272, w: 70, h: 50, r: 16 },
  ]
  return (
    <g filter={`url(#${uid}-soft)`}>
      {chunks.map((c, i) => (
        <g key={i} transform={`rotate(${c.r} ${c.x + c.w / 2} ${c.y + c.h / 2})`}>
          <rect x={c.x + 2} y={c.y + 5} width={c.w} height={c.h} rx={16} fill="#6b4a1c" opacity={0.18} />
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={16} fill={`url(#${uid}-yam)`} stroke="#d9c38f" strokeWidth={1.5} />
          <path d={`M${c.x + 12} ${c.y + 14} q ${c.w / 3} -6 ${c.w - 24} 4`} stroke="#fff" strokeOpacity={0.5} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

function Beans({ uid }: { uid: string }) {
  const beans = useMemo(() => mound(260, 160, 195, 95, 23).sort((a, b) => a.depth - b.depth), [])
  return (
    <g filter={`url(#${uid}-soft)`}>
      {beans.map((b, i) => (
        <g key={i} transform={`rotate(${b.rot} ${b.x} ${b.y})`}>
          <ellipse cx={b.x} cy={b.y} rx={8} ry={5} fill={b.t > 0.5 ? '#a0582c' : '#8a4521'} stroke="#5e2a12" strokeWidth={0.6} />
          <ellipse cx={b.x - 2} cy={b.y - 1.6} rx={3} ry={1.2} fill="#f3c79b" opacity={0.45} />
        </g>
      ))}
    </g>
  )
}

function Bread({ uid }: { uid: string }) {
  const slices = [
    { x: 70, y: 110, r: -18 },
    { x: 105, y: 165, r: -6 },
    { x: 75, y: 225, r: 8 },
  ]
  const slice = 'M0 30 Q0 0 30 0 Q50 -8 70 0 Q100 0 100 30 L96 110 Q96 118 88 118 L12 118 Q4 118 4 110 Z'
  return (
    <g filter={`url(#${uid}-soft)`}>
      {slices.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r} 50 60)`}>
          <path d={slice} transform="translate(3 6)" fill="#5b3412" opacity={0.18} />
          <path d={slice} fill="#b9763a" />
          <path d={slice} transform="translate(7 7) scale(0.86)" fill={`url(#${uid}-crumb)`} />
        </g>
      ))}
    </g>
  )
}

const foods: Record<MealKind, (p: { uid: string }) => ReactElement> = {
  rice: Rice,
  dodo: Dodo,
  yam: Yam,
  beans: Beans,
  bread: Bread,
}

/** Top-down illustrated plate: the meal on one side, a pool of real Oyegonu stew on the other. */
export function Plate({ kind, className = '' }: { kind: MealKind; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const Food = foods[kind]
  const seed = kind.length * 13 + 5
  const stew = useMemo(() => blobPath(262, 215, 84, 0.32, seed), [seed])
  const garnish = useMemo(() => mound(9, 262, 210, 60, seed + 3), [seed])

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`Oyegonu stew served with ${kind}`}>
      <defs>
        <radialGradient id={`${uid}-plate`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f3ece0" />
          <stop offset="100%" stopColor="#d9cdb9" />
        </radialGradient>
        <radialGradient id={`${uid}-well`} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#fbf7f0" />
          <stop offset="100%" stopColor="#e6dccb" />
        </radialGradient>
        <radialGradient id={`${uid}-dodo`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffd56b" />
          <stop offset="60%" stopColor="#f0a531" />
          <stop offset="100%" stopColor="#b2531a" />
        </radialGradient>
        <linearGradient id={`${uid}-yam`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#efe0b6" />
        </linearGradient>
        <radialGradient id={`${uid}-crumb`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fbecc9" />
          <stop offset="100%" stopColor="#ecd09a" />
        </radialGradient>
        <radialGradient id={`${uid}-gloss`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#2a0703" stopOpacity="0.35" />
        </radialGradient>
        <pattern id={`${uid}-stew`} patternUnits="userSpaceOnUse" width="260" height="150">
          <image href={assets.stewTexture} width="260" height="150" preserveAspectRatio="xMidYMid slice" />
        </pattern>
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#3b1a08" floodOpacity="0.25" />
        </filter>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#1a0603" floodOpacity="0.45" />
        </filter>
      </defs>

      <circle cx="200" cy="200" r="190" fill={`url(#${uid}-plate)`} filter={`url(#${uid}-shadow)`} />
      <circle cx="200" cy="200" r="190" fill="none" stroke="#c9b48f" strokeWidth="1" opacity="0.6" />
      <circle cx="200" cy="200" r="140" fill={`url(#${uid}-well)`} />
      <circle cx="200" cy="200" r="176" fill="none" stroke="#c6913a" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.55" />

      <Food uid={uid} />

      <g>
        <path d={stew} fill="#3d0d05" transform="translate(2 4)" opacity="0.35" />
        <path d={stew} fill={`url(#${uid}-stew)`} />
        <path d={stew} fill="#8e1f0b" opacity="0.28" style={{ mixBlendMode: 'multiply' }} />
        <path d={stew} fill={`url(#${uid}-gloss)`} />
        {garnish.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={3 + g.t * 2.5} fill="none" stroke="#7fae4a" strokeWidth={2} opacity={0.9} />
        ))}
      </g>
    </svg>
  )
}
