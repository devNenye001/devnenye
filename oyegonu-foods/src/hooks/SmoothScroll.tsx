import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/store'

type ScrollTo = (target: string | number, opts?: { offset?: number; immediate?: boolean }) => void

interface SmoothScrollApi {
  scrollTo: ScrollTo
  stop: () => void
  start: () => void
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback<ScrollTo>((target, opts = {}) => {
    const el = typeof target === 'string' ? document.getElementById(target.replace('#', '')) : null
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(el ?? (target as number), {
        offset: opts.offset ?? 0,
        immediate: opts.immediate,
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [])

  const stop = useCallback(() => lenisRef.current?.stop(), [])
  const start = useCallback(() => lenisRef.current?.start(), [])

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider')
  return ctx
}
