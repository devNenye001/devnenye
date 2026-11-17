import { useRef } from 'react';
import { Building2, ShoppingCart, Rocket, RefreshCw, Blocks, Wrench } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { services, type ServiceIcon } from '../data/content';
import { projects, imageFor } from '../data/projects';
import { GridRow } from '../components/GridRow';
import { SectionTitle } from '../components/SectionTitle';
import { Shot } from '../components/Shot';

const icons: Record<ServiceIcon, typeof Building2> = {
  building: Building2,
  cart: ShoppingCart,
  rocket: Rocket,
  refresh: RefreshCw,
  blocks: Blocks,
  wrench: Wrench,
};

export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.tool-card').forEach((card, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        tl.from(card, { y: 50, autoAlpha: 0, duration: 0.9, delay: (i % 3) * 0.1, ease: 'expo.out' })
          // screenshots pop up out of the card, tilted, like the reference's toolkit images
          .from(card.querySelectorAll('.tool-card__shot'), { y: 60, rotate: (j) => (j ? 12 : -12), scale: 0.7, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.5)', clearProps: CLEAR }, '-=0.5');
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="services" id="services" aria-labelledby="services-title">
      <SectionTitle id="services-title" title="Services" sub="What I can build for your business." />
      <GridRow>
        <ul className="toolkit">
          {services.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li className="tool-card" key={s.title}>
                <div className={`tool-card__shots ${s.shots.length === 1 ? 'is-single' : ''}`} aria-hidden="true">
                  {s.shots.map((ref, j) => {
                    const p = projects.find((x) => x.slug === ref.slug);
                    if (!p) return null;
                    const img = imageFor(p, ref.kind);
                    return (
                      <div className={`tool-card__shot tool-card__shot--${img.kind === 'mobile' ? 'mobile' : 'desktop'} is-${j}`} key={j}>
                        <Shot image={img} sizes={img.kind === 'mobile' ? '90px' : '220px'} />
                      </div>
                    );
                  })}
                </div>
                <div className="tool-card__info">
                  <Icon size={20} className="tool-card__icon" aria-hidden="true" />
                  <h3 className="tool-card__title">{s.title}</h3>
                  <p className="tool-card__text">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </GridRow>
    </section>
  );
}
