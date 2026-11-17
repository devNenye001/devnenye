import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { SectionLabel } from '../components/ui/SectionLabel'
import { assets } from '../config/brand'

type Token = string | { img: string; alt: string; wide?: boolean }

const STATEMENT: Token[] = [
  'Oyegonu Foods makes',
  { img: assets.jarSmall, alt: 'Oyegonu Real Stew jar' },
  'real Nigerian stew — the rich, red, peppery kind that usually takes an afternoon at the pot.',
  { img: assets.stewTexture, alt: 'Close-up of Oyegonu stew', wide: true },
  'We cook it, seal it in a jar, and give you the afternoon back.',
]

export function BrandIntro() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.intro-word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.intro-statement', start: 'top 78%', end: 'bottom 55%', scrub: true },
        },
      )
      gsap.fromTo(
        '.intro-pill',
        { scale: 0.4, rotate: -12 },
        {
          scale: 1,
          rotate: 0,
          ease: 'back.out(2)',
          stagger: 0.3,
          scrollTrigger: { trigger: '.intro-statement', start: 'top 75%', end: 'center 55%', scrub: true },
        },
      )
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="intro" className="relative overflow-hidden bg-paper py-28 text-stew-900 sm:py-40">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-center justify-between gap-4">
          <SectionLabel index="01">Oyegonu Foods</SectionLabel>
          <span className="eyebrow text-stew-900/50">Ready-made · Authentic · Shelf-stable</span>
        </div>

        <p className="intro-statement max-w-[1200px] font-display text-[2rem] font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[4.2rem]">
          {STATEMENT.map((t, i) =>
            typeof t === 'string' ? (
              t.split(' ').map((w, j) => (
                <span key={`${i}-${j}`} className="intro-word inline">
                  {w}{' '}
                </span>
              ))
            ) : (
              <span
                key={i}
                className={`intro-pill relative mx-1 inline-block h-[0.95em] translate-y-[0.12em] overflow-hidden rounded-full bg-gold align-baseline ${t.wide ? 'w-[2.4em]' : 'w-[1.6em]'}`}
              >
                <img src={t.img} alt={t.alt} className={`absolute inset-0 h-full w-full ${t.wide ? 'object-cover' : 'object-contain py-[0.06em]'}`} loading="lazy" />
              </span>
            ),
          )}
        </p>

        <div className="mt-20 grid gap-10 border-t border-stew-900/15 pt-10 sm:grid-cols-3">
          {[
            ['Authentic flavour', 'Tomatoes, peppers and onions, cooked down the Nigerian way.'],
            ['Ready-made', 'Open the jar and a proper Nigerian meal is minutes away.'],
            ['Shelf-stable', 'Keeps for up to 5–6 months stored in a cool, dry place.'],
          ].map(([title, body], i) => (
            <div key={title} className="flex gap-5">
              <span className="font-display text-sm italic text-lid">0{i + 1}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-stew-900/70">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
