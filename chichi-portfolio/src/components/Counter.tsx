import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';

/** Counts up from 0 to `value` the first time it scrolls into view. */
export function Counter({ value, suffix = '', duration = 1.4 }: { value: number; suffix?: string; duration?: number }) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!el.current || prefersReducedMotion()) return;
    const obj = { n: 0 };
    el.current.textContent = `0${suffix}`;
    gsap.to(obj, {
      n: value,
      duration,
      ease: 'power3.out',
      scrollTrigger: { trigger: el.current, start: 'top 95%', once: true },
      onUpdate: () => {
        if (el.current) el.current.textContent = `${Math.round(obj.n)}${suffix}`;
      },
    });
  });

  return (
    <span ref={el}>
      {value}
      {suffix}
    </span>
  );
}
