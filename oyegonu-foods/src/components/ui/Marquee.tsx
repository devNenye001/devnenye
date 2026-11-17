import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../../lib/gsap'

interface Props {
  items: string[]
  className?: string
  speed?: number
  separator?: ReactNode
}

/** Infinite marquee that briefly speeds up and follows the scroll direction. */
export function Marquee({ items, className = '', speed = 40, separator }: Props) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const tween = gsap.to(el, { xPercent: -50, ease: 'none', duration: speed, repeat: -1 })
    let last = window.scrollY
    const onScroll = () => {
      const dir = window.scrollY >= last ? 1 : -1
      last = window.scrollY
      gsap.to(tween, {
        timeScale: dir * 3,
        duration: 0.2,
        overwrite: true,
        onComplete: () => void gsap.to(tween, { timeScale: dir, duration: 1 }),
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      tween.kill()
      window.removeEventListener('scroll', onScroll)
    }
  }, [speed])

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 md:px-10">{t}</span>
          {separator ?? <span className="text-[0.5em]">✺</span>}
        </span>
      ))}
    </div>
  )

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max">
        {row}
        {row}
      </div>
    </div>
  )
}
