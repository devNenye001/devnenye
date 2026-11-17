import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, splitWordsUp } from '../lib/gsap';

/** Lined title band between sections: big serif heading + one-line subtitle. */
export function SectionTitle({ title, sub, id }: { title: string; sub?: string; id?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      splitWordsUp(root.current!.querySelector('h2')!);
      if (sub) gsap.from('.section-title__sub', { autoAlpha: 0, y: 10, duration: 0.8, delay: 0.25, scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="section-title">
      <div className="section-title__wrap">
        <h2 id={id}>{title}</h2>
        {sub && <p className="section-title__sub">{sub}</p>}
      </div>
    </div>
  );
}
