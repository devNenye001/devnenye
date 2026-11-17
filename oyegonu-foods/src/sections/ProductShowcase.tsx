import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { SectionLabel } from '../components/ui/SectionLabel'
import { assets, brand } from '../config/brand'

/** Hotspots in % of the jar photo. */
const CALLOUTS = [
  {
    x: 50,
    y: 4,
    title: 'The red lid',
    body: 'Bright, unmistakable, and the only thing standing between you and dinner. Twist, and the stew is ready to serve.',
  },
  {
    x: 50,
    y: 48.5,
    title: 'Real Stew',
    body: 'Exactly what the ribbon says: a proper Nigerian red stew, made to spoon straight over your meal.',
  },
  {
    x: 50,
    y: 54.5,
    title: 'Spicy and Deliciously Spicy',
    body: 'The heat is the point. A bold, peppery stew for people who like their food with a kick.',
  },
  {
    x: 27,
    y: 86,
    title: 'Clear glass',
    body: 'Nothing hidden. The deep red colour of the stew is right there through the glass, from lid to base.',
  },
]

const SPECS = [
  ['Product', brand.product],
  ['Heat', 'Spicy'],
  ['Shelf life', `Up to ${brand.shelfLife}`],
  ['Storage', 'Cool, dry place'],
]

export function ProductShowcase() {
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 120, damping: 20 })
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 20 })
  const sheenX = useTransform(rotY, [-14, 14], ['-30%', '130%'])

  const onMove = (e: PointerEvent) => {
    const r = section.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => setActive(Math.min(CALLOUTS.length - 1, Math.floor(self.progress * CALLOUTS.length))),
        },
      })
      tl.fromTo('.showcase-spicy', { xPercent: 10 }, { xPercent: -45, ease: 'none' }, 0)
        .fromTo('.showcase-jar', { scale: 0.86, y: 40 }, { scale: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0)
        .fromTo('.showcase-bar', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
    }, section)
    return () => ctx.revert()
  }, [])

  const c = CALLOUTS[active]

  return (
    <section
      ref={section}
      id="product"
      onPointerMove={onMove}
      className="grain relative h-[100svh] min-h-[640px] overflow-hidden bg-gold text-stew-900"
    >
      {/* giant scrolling tagline */}
      <div className="showcase-spicy pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[34vw] font-black italic leading-none tracking-tightest text-gold-deep/60 md:text-[22vw]">
        Deliciously Spicy
      </div>

      <div className="container-x relative grid h-full grid-rows-[auto_1fr_auto] gap-4 pb-8 pt-24 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:items-center md:gap-8 md:pb-0 md:pt-0">
        {/* Left: active callout */}
        <div className="order-1 md:order-none">
          <SectionLabel index="02" className="mb-6 md:mb-10">The Jar</SectionLabel>
          <div className="relative min-h-[150px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-display text-sm italic text-lid">
                  0{active + 1} / 0{CALLOUTS.length}
                </span>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-[1.02] tracking-tight sm:text-4xl lg:text-6xl">{c.title}</h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-stew-900/75 sm:text-base">{c.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Centre: the real jar, tilting in 3D */}
        <div className="showcase-jar relative order-2 mx-auto h-full max-h-[52vh] md:order-none md:max-h-[78vh]" style={{ perspective: 1200 }}>
          <motion.div className="relative h-full" style={{ rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}>
            <div className="absolute -bottom-6 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-[50%] bg-stew-900/40 blur-xl" />
            <img src={assets.jar} alt="Oyegonu Real Stew jar, Spicy and Deliciously Spicy" className="relative h-full w-auto object-contain drop-shadow-[0_30px_40px_rgba(37,10,6,0.35)]" />
            {/* glass sheen that follows the tilt */}
            <motion.div
              className="pointer-events-none absolute inset-y-[4%] w-[22%] bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light"
              style={{ left: sheenX, maskImage: `url(${assets.jar})`, maskSize: '100% 100%' }}
            />
            {CALLOUTS.map((h, i) => (
              <span
                key={h.title}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%) translateZ(40px)' }}
              >
                <span className={`relative grid h-6 w-6 place-items-center rounded-full transition-all duration-500 ${i === active ? 'scale-100 bg-cream' : 'scale-50 bg-cream/70'}`}>
                  <span className="h-2 w-2 rounded-full bg-lid" />
                  {i === active && <span className="absolute inset-0 animate-ping rounded-full bg-cream/70" />}
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: specs + progress */}
        <div className="order-3 flex flex-col gap-6 md:order-none md:items-end">
          <dl className="grid w-full max-w-xs grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-1 md:text-right">
            {SPECS.map(([k, v]) => (
              <div key={k} className="border-t border-stew-900/20 pt-2">
                <dt className="eyebrow text-stew-900/55">{k}</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="hidden h-px w-full max-w-xs bg-stew-900/15 md:block">
            <div className="showcase-bar h-full origin-left bg-lid" />
          </div>
        </div>
      </div>
    </section>
  )
}
