import { Fragment } from 'react';
import type { Testimonial } from '../data/types';

function Stars() {
  return (
    <span className="stars" aria-label="5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="#ffd84d" />
        </svg>
      ))}
    </span>
  );
}

/** Bold the highlighted phrases inside the quote, as the reference does. */
function Quote({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  if (!highlight.length) return <>{text}</>;
  const re = new RegExp(`(${highlight.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return (
    <>
      {text.split(re).map((part, i) => (highlight.includes(part) ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="note-card testimonial">
      <Stars />
      <blockquote className="testimonial__quote">
        <Quote text={t.quote} highlight={t.highlight} />
      </blockquote>
      <figcaption className="testimonial__who">
        {t.avatar ? (
          <img className="testimonial__avatar" src={t.avatar} alt="" width={56} height={56} loading="lazy" />
        ) : (
          <span className="testimonial__avatar" aria-hidden="true">
            {t.name.charAt(0)}
          </span>
        )}
        <span>
          <strong>{t.name}</strong>
          <span className="testimonial__role">
            {t.role} <span className="text-purple">{t.company}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
