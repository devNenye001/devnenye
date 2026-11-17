import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { heroFanProjects, imageFor } from '../data/projects';
import { Shot } from '../components/Shot';
import { useCaseStudy } from '../components/CaseStudyContext';

// Order the fan so position classes match the reference: far-left, left, centre, right, far-right.
const positions = ['is-left-2', 'is-left-1', 'is-center', 'is-right-1', 'is-right-2'];

export function WorkSlides() {
  const root = useRef<HTMLElement>(null);
  const { open } = useCaseStudy();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const slides = gsap.utils.toArray<HTMLElement>('.work-slide');
      // "work slides pop in": rise up from below with a little spring, centre first, outer ones last
      gsap.from(slides, {
        yPercent: 60,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'back.out(1.2)',
        stagger: { each: 0.08, from: 'center' },
        delay: 0.9,
        clearProps: CLEAR,
      });
      // "Work screens scroll": the fan drifts up over the hero as you scroll (scrubbed parallax)
      gsap.to('.work-slides__track', {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work-slides" aria-label="Recent work previews">
      <div className="work-slides__track">
        {heroFanProjects.map((p, i) => (
          <button
            type="button"
            className={`work-slide ${positions[i] ?? ''}`}
            key={p.slug}
            onClick={() => open(p.slug)}
            aria-label={`Open ${p.name} case study`}
          >
            <span className="work-slide__labels">
              <span className="capsule capsule--grey">{p.category}</span>
              <span className="capsule">{p.industry}</span>
            </span>
            <Shot image={imageFor(p, 'desktop')} className="work-slide__img" sizes="(max-width: 767px) 40vw, 25vw" eager={i > 0 && i < 4} />
          </button>
        ))}
      </div>
    </section>
  );
}
