import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { SectionLabel } from '../components/ui/SectionLabel'
import { assets, brand } from '../config/brand'

const reveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-15% 0px' },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
} as const

const STEPS = [
  {
    label: 'Open',
    icon: (
      <path d="M14 18h20v4H14zM15 22h18l2 4v14a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V26z M18 10l-4 6M30 10l4 6" />
    ),
  },
  {
    label: 'Warm',
    icon: <path d="M24 6c4 6 10 10 10 20a10 10 0 0 1-20 0c0-5 3-8 5-11 1 4 3 6 5 6-1-5-1-10 0-15zM12 44h24" />,
  },
  {
    label: 'Serve',
    icon: <path d="M6 30h36M10 30a14 14 0 0 1 28 0M24 16v-4M20 12h8M8 36h32" />,
  },
]

function MonthsRing() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.month-seg',
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const segs = 6
  const gap = 4
  const r = 90
  return (
    <svg ref={ref} viewBox="0 0 220 220" className="h-full w-full -rotate-90" aria-hidden>
      <circle cx="110" cy="110" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="14" />
      {Array.from({ length: segs }, (_, i) => {
        const a0 = (i / segs) * 360 + gap / 2
        const a1 = ((i + 1) / segs) * 360 - gap / 2
        const p = (a: number) => [110 + r * Math.cos((a * Math.PI) / 180), 110 + r * Math.sin((a * Math.PI) / 180)]
        const [x0, y0] = p(a0)
        const [x1, y1] = p(a1)
        return (
          <path
            key={i}
            className="month-seg"
            d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`}
            fill="none"
            stroke={i < 5 ? '#d4241c' : '#e3b862'}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
          />
        )
      })}
    </svg>
  )
}

export function WhyOyegonu() {
  return (
    <section id="why" className="relative bg-cream py-28 text-stew-900 sm:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:h-max">
          <SectionLabel index="04" className="mb-8">Why Oyegonu</SectionLabel>
          <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Proper stew,
            <br />
            <span className="italic text-lid">minus</span> the
            <br />
            long afternoon.
          </h2>
          <p className="mt-8 max-w-sm leading-relaxed text-stew-900/70">
            Three reasons a jar of Real Stew earns its place in the cupboard, and on the table.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Convenience */}
          <motion.article {...reveal} className="rounded-[2rem] bg-paper p-8 sm:p-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="eyebrow text-lid">Convenience</span>
                <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Open. Warm. Serve.</h3>
              </div>
              <span className="font-display text-sm italic text-stew-900/40">i.</span>
            </div>
            <p className="mt-4 max-w-md leading-relaxed text-stew-900/70">
              The cooking is already done. Ready-made Nigerian stew means a full, proper meal on a weeknight, after a long day, or the moment hunger arrives.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6">
              {STEPS.map((s, i) => (
                <div key={s.label} className="group flex flex-col items-center gap-3 rounded-2xl border border-stew-900/10 py-6 transition-colors duration-500 hover:border-lid hover:bg-lid hover:text-cream">
                  <svg viewBox="0 0 48 48" className="h-10 w-10 sm:h-12 sm:w-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    <span className="mr-1 opacity-50">{i + 1}</span>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Flavour */}
          <motion.article {...reveal} className="relative overflow-hidden rounded-[2rem] bg-stew-900 p-8 text-cream sm:p-12">
            <img src={assets.stewTexture} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-br from-stew-900 via-stew-900/80 to-transparent" />
            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="eyebrow text-gold">Flavour</span>
                  <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    Authentically
                    <br />
                    Nigerian.
                  </h3>
                </div>
                <span className="font-display text-sm italic text-cream/40">ii.</span>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-cream/75">
                Deep red, rich and peppery: the stew flavour you grew up with or fell in love with. And as the label promises — {brand.tagline.toLowerCase()}.
              </p>
              <div className="mt-10 flex flex-wrap gap-2">
                {['Tomato', 'Pepper', 'Onion', 'Spicy'].map((t) => (
                  <span key={t} className="rounded-full border border-cream/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>

          {/* Shelf stability */}
          <motion.article {...reveal} className="rounded-[2rem] bg-gold p-8 sm:p-12">
            <div className="flex items-start justify-between gap-6">
              <span className="eyebrow text-stew-900">Shelf-stable</span>
              <span className="font-display text-sm italic text-stew-900/50">iii.</span>
            </div>
            <div className="mt-6 grid items-center gap-8 sm:grid-cols-[auto_1fr]">
              <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60">
                <MonthsRing />
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <span className="block font-display text-6xl font-bold leading-none tracking-tight">5–6</span>
                    <span className="eyebrow mt-1 block">months</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Keeps for months, ready for any day.</h3>
                <p className="mt-4 leading-relaxed text-stew-900/75">
                  Shelf-stable for up to {brand.shelfLife} when stored in a cool, dry place. Stock up and there's always stew in the house.
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
