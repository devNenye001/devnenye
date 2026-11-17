/**
 * Tiny mutable stores shared between the DOM and the WebGL scenes.
 * They're read every frame inside useFrame, so they deliberately avoid React state.
 */
export const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
export const heroScroll = { progress: 0 }
export const intro = { revealed: false }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}

/** Smoothed pointer, call once per frame. */
export function tickPointer(delta: number) {
  const k = 1 - Math.exp(-delta * 4)
  pointer.sx += (pointer.x - pointer.sx) * k
  pointer.sy += (pointer.y - pointer.sy) * k
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
