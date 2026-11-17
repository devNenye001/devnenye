import { useRef } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { testimonials } from '../data/content';
import { primaryContactUrl } from '../config/site';
import { GridRow } from '../components/GridRow';
import { SectionTitle } from '../components/SectionTitle';
import { TestimonialCard } from '../components/TestimonialCard';

/**
 * Renders genuine testimonials from src/data/content.ts.
 * While none have been added, shows a single honest invitation card instead of placeholders.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const hasAny = testimonials.length > 0;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.testimonials__grid > *', {
        y: 60,
        rotate: (i) => (i % 2 ? 3 : -3),
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        clearProps: CLEAR,
        scrollTrigger: { trigger: '.testimonials__grid', start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="testimonials" aria-labelledby="testimonials-title">
      <SectionTitle id="testimonials-title" title="Kind Words" sub={hasAny ? 'What clients say about working together.' : 'Client stories, coming soon.'} />
      <GridRow>
        <div className={`testimonials__grid ${hasAny ? '' : 'is-empty'}`}>
          {hasAny ? (
            testimonials.map((t) => <TestimonialCard key={t.name + t.company} t={t} />)
          ) : (
            <div className="note-card testimonials__invite">
              <MessageSquareQuote size={22} className="text-purple" aria-hidden="true" />
              <p className="testimonials__invite-title">Worked with me on a project?</p>
              <p className="testimonials__invite-text">I&rsquo;d love to feature your experience here. Send a few words and I&rsquo;ll add them with your permission.</p>
              <a className="btn-outline" href={primaryContactUrl} target={primaryContactUrl.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                Share your feedback
              </a>
            </div>
          )}
        </div>
      </GridRow>
    </section>
  );
}
