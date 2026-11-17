import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { publishedProjects } from '../data/projects';

/**
 * Project-name strip. Same mechanics as the reference's client-logo track:
 * every 3s it steps one cell (20vw on desktop) with expo.out, then snaps back
 * invisibly once a full set has passed.
 */
export function NamesMarquee() {
  const root = useRef<HTMLElement>(null);
  const names = publishedProjects.map((p) => ({ name: p.name.replace(/ (Ltd\.|Nigeria Ltd\.)$/, ''), industry: p.industry }));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector<HTMLElement>('.names__track')!;
      const cell = () => track.querySelector<HTMLElement>('.names__cell')!.offsetWidth;
      let step = 0;
      let call: gsap.core.Tween;
      const next = () => {
        step++;
        if (step > names.length) {
          step = 1;
          gsap.set(track, { x: 0 });
        }
        gsap.to(track, { x: -step * cell(), duration: 0.8, ease: 'expo.out' });
        call = gsap.delayedCall(3, next);
      };
      call = gsap.delayedCall(3, next);
      return () => call?.kill();
    },
    { scope: root },
  );

  const cells = [...names, ...names];
  return (
    <section ref={root} className="names" aria-label="Businesses I've built websites for">
      <ul className="names__track">
        {cells.map((n, i) => (
          <li className="names__cell" key={i} aria-hidden={i >= names.length}>
            <span className="names__name">{n.name}</span>
            <span className="names__industry">{n.industry}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
