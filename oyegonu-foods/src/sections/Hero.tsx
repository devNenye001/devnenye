import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { heroScroll } from '../lib/store'
import { useInView } from '../hooks/useInView'
import { useSmoothScroll } from '../hooks/SmoothScroll'
import { Button } from '../components/ui/Button'
import { RotatingBadge } from '../components/ui/RotatingBadge'
import { assets, brand } from '../config/brand'

const HeroScene = lazy(() => import('../components/three/HeroScene'))

const ease = [0.16, 1, 0.3, 1] as const

function BigWord({ word, ready, delay, className }: { word: string; ready: boolean; delay: number; className: string }) {
  return (
    <span className={`flex overflow-hidden ${className}`} aria-hidden>
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '110%' }}
          animate={ready ? { y: '0%' } : undefined}
          transition={{ duration: 1.2, delay: delay + i * 0.06, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null)
  const words = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const active = useInView(section)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            heroScroll.progress = self.progress
          },
        },
      })
        .to(words.current, { yPercent: 35, scale: 1.08, opacity: 0.25, ease: 'none' }, 0)
        .to(copy.current, { yPercent: -40, opacity: 0, ease: 'none' }, 0)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="top" className="grain relative h-[100svh] min-h-[620px] overflow-hidden bg-stew-900 text-cream">
      {/* warm glow behind the jar */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_45%,#7f2512_0%,#3f1109_45%,transparent_75%)]" />

      {/* "REAL STEW" — echoing the ribbon on the label, sitting behind the 3D jar */}
      <div ref={words} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center font-display font-black uppercase leading-[0.78] tracking-tightest">
        <div className="flex w-full flex-col items-center gap-[2vh] md:flex-row md:justify-between md:gap-0 md:px-[2vw]">
          <BigWord word="Real" ready={ready} delay={0.2} className="text-[30vw] text-gold md:text-[19vw]" />
          <BigWord word="Stew" ready={ready} delay={0.35} className="text-outline text-[30vw] text-gold/70 md:text-[19vw]" />
        </div>
      </div>

      {/* WebGL: the real jar surrounded by tomatoes, peppers, onions and stew */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <img src={assets.jar} alt="" className="absolute left-1/2 top-[47%] h-[56vh] -translate-x-1/2 -translate-y-1/2 object-contain opacity-90" />
          }
        >
          <HeroScene active={active} />
        </Suspense>
      </div>
      <h2 className="sr-only">Oyegonu Real Stew jar — {brand.tagline}</h2>

      {/* Copy */}
      <div ref={copy} className="container-x pointer-events-none absolute inset-x-0 bottom-0 pb-8 sm:pb-10">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <motion.p
              className="eyebrow mb-4 text-gold"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.9, duration: 0.9, ease }}
            >
              Oyegonu Foods — Real Stew
            </motion.p>
            <h1 className="font-display text-[2.5rem] font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {['Nigerian stew,', 'ready when', 'you are.'].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className={`block ${i === 2 ? 'italic text-gold-soft' : ''}`}
                    initial={{ y: '105%' }}
                    animate={ready ? { y: '0%' } : undefined}
                    transition={{ delay: 1 + i * 0.1, duration: 1.1, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1.4, duration: 0.9, ease }}
            >
              <Button href="#order" onClick={() => scrollTo('order')}>
                Order Real Stew
              </Button>
              <Button href="#product" variant="ghost" icon={false} onClick={() => scrollTo('product')} className="text-cream">
                Meet the jar
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="hidden text-gold md:block"
            initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ delay: 1.5, duration: 1.2, ease }}
          >
            <RotatingBadge text="Shelf-stable · up to 5–6 months · " className="w-36 lg:w-44">
              <span className="block text-center font-display text-3xl font-semibold leading-none">
                5–6
                <span className="block font-sans text-[0.6rem] font-bold uppercase tracking-[0.25em]">months</span>
              </span>
            </RotatingBadge>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-cream/60 sm:flex lg:right-12"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.8 }}
      >
        <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-16 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
      </motion.div>
    </section>
  )
}
