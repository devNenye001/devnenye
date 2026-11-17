import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Marquee } from '../components/ui/Marquee'
import { assets, brand } from '../config/brand'

export function BrandStory() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.story-bg', { yPercent: -12, scale: 1.15 }, {
        yPercent: 12,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo('.story-jar', { yPercent: 25, rotate: 14 }, {
        yPercent: -15,
        rotate: -6,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.story-line', {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.story-quote', start: 'top 80%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} id="story" className="grain relative overflow-hidden bg-stew-950 text-cream">
      <div className="absolute inset-0 overflow-hidden">
        <img src={assets.stewTexture} alt="" aria-hidden className="story-bg h-full w-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-stew-950 via-stew-950/70 to-stew-950" />
      </div>

      <div className="container-x relative py-28 sm:py-40">
        <SectionLabel index="05" className="mb-12 text-gold">Our Story</SectionLabel>

        <div className="grid items-center gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <blockquote className="story-quote font-display text-[2.3rem] font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {['Every Nigerian home', 'has a pot of stew.', 'We made ours', 'fit in a jar.'].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-1">
                  <span className={`story-line block ${i >= 2 ? 'italic text-gold' : ''}`}>{l}</span>
                </span>
              ))}
            </blockquote>

            <div className="mt-14 grid max-w-3xl gap-8 text-cream/70 sm:grid-cols-2">
              <p className="leading-relaxed">
                In Nigerian kitchens, stew is more than a recipe. It's the red base of Sunday rice, the dip for fried plantain, the reason the whole house smells like home. It's also a slow job: hours of blending, frying and stirring.
              </p>
              <p className="leading-relaxed">
                {brand.name} started from a simple idea: keep the flavour, lose the wait. Real Stew is our answer: authentic, ready-made and shelf-stable, so a proper Nigerian meal is always within reach.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-[60%] max-w-[340px] lg:w-full">
            <div className="absolute inset-[10%] rounded-full bg-lid/40 blur-3xl" />
            <img src={assets.jar} alt="Oyegonu Real Stew" className="story-jar relative w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]" loading="lazy" />
          </div>
        </div>
      </div>

      <Marquee
        items={['Real Stew', 'Spicy and Deliciously Spicy', 'Ready when you are', 'Authentic Nigerian flavour']}
        className="relative border-y border-cream/10 py-6 font-display text-4xl font-medium italic text-cream/90 sm:text-6xl"
        separator={<span className="text-2xl not-italic text-lid sm:text-3xl">●</span>}
      />
    </section>
  )
}
