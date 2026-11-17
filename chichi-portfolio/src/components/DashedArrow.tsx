import { useId, useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';

const PATH = 'M6 6 V40 Q6 52 18 52 H104 Q116 52 116 64 V96';

/**
 * The reference's dotted connector: a dot, a dashed elbow line and an arrowhead
 * pointing from a label into the card. It draws itself when scrolled into view
 * (a solid mask path is revealed over the dashed stroke).
 */
export function DashedArrow({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mask = svg.current?.querySelector<SVGPathElement>('.dashed-arrow__mask');
      if (!mask) return;
      const len = mask.getTotalLength();
      gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len });
      gsap
        .timeline({ scrollTrigger: { trigger: svg.current, start: 'top 85%', once: true } })
        .from('.dashed-arrow__dot', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)' })
        .to(mask, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
        .from('.dashed-arrow__head', { autoAlpha: 0, y: -6, duration: 0.3 }, '-=0.15');
    },
    { scope: svg },
  );

  return (
    <svg ref={svg} className={`dashed-arrow ${className}`} width="124" height="104" viewBox="0 0 124 104" fill="none" aria-hidden="true">
      <defs>
        <mask id={`m${id}`}>
          <path className="dashed-arrow__mask" d={PATH} stroke="#fff" strokeWidth="6" />
        </mask>
      </defs>
      <circle className="dashed-arrow__dot" cx="6" cy="6" r="4" fill="var(--purple-dark)" />
      <path d={PATH} stroke="var(--purple-dark)" strokeWidth="1.5" strokeDasharray="5 4" mask={`url(#m${id})`} />
      <path className="dashed-arrow__head" d="M110 94 L116 102 L122 94 Z" fill="var(--purple-dark)" />
    </svg>
  );
}
