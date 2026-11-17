import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { meals } from '../content/meals'
import { Plate } from '../components/Plate'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Button } from '../components/ui/Button'
import { useSmoothScroll } from '../hooks/SmoothScroll'
import { assets } from '../config/brand'

export function JarToTable() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      tl.to(track.current, { x: () => -distance(), ease: 'none' }, 0)
        .to('.plate-spin', { rotate: 140, ease: 'none' }, 0)
        .fromTo('.table-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="table" className="grain relative h-[100svh] min-h-[620px] overflow-hidden bg-stew-800 text-cream">
      <div className="absolute inset-x-0 top-0 z-10">
        <div className="container-x flex items-center justify-between pt-24 sm:pt-28">
          <SectionLabel index="03" className="text-gold">From Jar to Table</SectionLabel>
          <div className="hidden h-px w-40 bg-cream/15 sm:block">
            <div className="table-progress h-full origin-left bg-gold" />
          </div>
        </div>
      </div>

      <div ref={track} className="flex h-full w-max items-center">
        {/* opening panel */}
        <div className="flex h-full w-[100vw] shrink-0 items-center px-4 sm:px-8 md:w-[62vw] lg:px-12">
          <div className="relative">
            <h2 className="font-display text-[3.4rem] font-semibold leading-[0.9] tracking-tight sm:text-7xl lg:text-[7.5rem]">
              One jar.
              <br />
              <span className="italic text-gold">Every</span> plate.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-cream/70">
              Real Stew is the red stew at the centre of so many Nigerian meals. Here's where it goes next — scroll on and pull up a chair.
            </p>
            <img src={assets.jarSmall} alt="" aria-hidden className="absolute -right-4 -top-24 hidden w-24 rotate-12 drop-shadow-2xl sm:block lg:-right-16 lg:w-32" loading="lazy" />
          </div>
        </div>

        {meals.map((m, i) => (
          <article key={m.kind} className="flex h-full w-[100vw] shrink-0 items-center px-4 sm:w-[78vw] sm:px-8 lg:w-[56vw]">
            <div className="grid w-full items-center gap-6 pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
              <div className="relative mx-auto aspect-square w-[min(78vw,52vh)] lg:w-full lg:max-w-[min(34vw,64vh)]">
                {m.photo ? (
                  <img src={m.photo} alt={`Oyegonu stew with ${m.name}`} className="h-full w-full rounded-full object-cover" loading="lazy" />
                ) : (
                  <Plate kind={m.kind} className="plate-spin h-full w-full" />
                )}
              </div>
              <div className="text-center lg:text-left">
                <span className="font-display text-sm italic text-gold">0{i + 1} — with</span>
                <h3 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">{m.name}</h3>
                {m.local && <p className="eyebrow mt-3 text-cream/45">{m.local}</p>}
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream/75 sm:text-base lg:mx-0">{m.line}</p>
              </div>
            </div>
          </article>
        ))}

        {/* closing panel */}
        <div className="flex h-full w-[100vw] shrink-0 flex-col items-start justify-center px-4 sm:w-[60vw] sm:px-8 lg:w-[44vw] lg:px-12">
          <p className="font-display text-4xl font-medium leading-tight sm:text-5xl">
            What will <span className="italic text-gold">you</span> serve it with?
          </p>
          <Button className="mt-8" href="#order" onClick={() => scrollTo('order')}>
            Get a jar
          </Button>
        </div>
      </div>
    </section>
  )
}
