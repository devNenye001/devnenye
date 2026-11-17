import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

// The reference's motion is snappy and springy: expo/back eases, short durations.
gsap.defaults({ ease: 'expo.out', duration: 0.8 });

/**
 * GSAP writes inline `translate/rotate/scale: none` on elements it transforms, which
 * overrides CSS resting tilts and hover effects. Entrance tweens pass this as
 * `clearProps` so the stylesheet takes over again once they finish.
 */
export const CLEAR = 'transform,translate,rotate,scale';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate elements marked with [data-reveal] in from below when they enter the viewport.
 * Mirrors Webflow's "scroll into view" fade-up used across the reference.
 */
export function revealOnScroll(scope: Element, selector = '[data-reveal]') {
  const items = gsap.utils.toArray<HTMLElement>(selector, scope);
  items.forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? 0);
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: Number(el.dataset.revealY ?? 30) },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: 'expo.out',
        clearProps: CLEAR,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
}

/** Split a heading into words and slide them up through a mask, like the reference's section titles. */
export function splitWordsUp(el: Element, opts: { delay?: number; scroll?: boolean } = {}) {
  const split = SplitText.create(el, { type: 'words', mask: 'words' });
  gsap.from(split.words, {
    yPercent: 110,
    duration: 0.9,
    stagger: 0.06,
    delay: opts.delay ?? 0,
    ease: 'expo.out',
    scrollTrigger: opts.scroll === false ? undefined : { trigger: el, start: 'top 85%', once: true },
  });
  return split;
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
