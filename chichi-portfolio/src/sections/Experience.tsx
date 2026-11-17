import { useRef } from 'react';
import { Heart, ArrowRight, GraduationCap, Briefcase, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { experience } from '../data/content';
import { site, primaryContactUrl } from '../config/site';
import { GridRow } from '../components/GridRow';
import { SectionTitle } from '../components/SectionTitle';
import { CtaButton } from '../components/Buttons';
import { Counter } from '../components/Counter';

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.xp-card--primary', { y: 80, rotate: -3, autoAlpha: 0, duration: 1.2, ease: 'expo.out', clearProps: CLEAR, scrollTrigger: { trigger: '.xp', start: 'top 80%', once: true } });
      gsap.from('.xp-side > *', { y: 60, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.xp', start: 'top 75%', once: true } });
      gsap.from('.xp-card--primary .xp-list li', { x: -12, autoAlpha: 0, duration: 0.6, stagger: 0.08, delay: 0.5, scrollTrigger: { trigger: '.xp', start: 'top 75%', once: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="experience" aria-labelledby="xp-title">
      <SectionTitle id="xp-title" title="Experience" sub="Frontend developer. Freelancer. First Class graduate." />
      <GridRow>
        <div className="xp">
          <div className="xp-main">
            <span className="capsule capsule--lg">Freelance</span>
            <article className="xp-card xp-card--primary">
              <span className="xp-badge">
                <Heart size={14} fill="currentColor" aria-hidden="true" /> Open to projects
              </span>
              <h3 className="xp-card__title">Freelance Web Developer</h3>
              <p className="xp-card__big">
                <Counter value={site.stats.websitesHosted} suffix={site.stats.websitesHostedSuffix} /> websites hosted
              </p>
              <hr className="xp-card__rule" />
              <p className="xp-card__text">
                Working with businesses across different industries, from engineering and construction to beauty, fashion, events and food.
                <br />
                <br />
                What I deliver:
              </p>
              <ul className="xp-list">
                <li>
                  <ArrowRight size={14} aria-hidden="true" /> Business websites
                </li>
                <li>
                  <ArrowRight size={14} aria-hidden="true" /> E-commerce platforms
                </li>
                <li>
                  <ArrowRight size={14} aria-hidden="true" /> Custom web applications
                </li>
                <li>
                  <ArrowRight size={14} aria-hidden="true" /> Development, deployment &amp; maintenance
                </li>
              </ul>
              <CtaButton href={primaryContactUrl} variant="dark" avatar={false} title="Start a project" sub="Chat with me on WhatsApp" />
            </article>
          </div>

          <div className="xp-side">
            {experience.map((e) => (
              <article className="xp-card xp-card--white" key={e.company}>
                <span className="xp-card__icon" aria-hidden="true">
                  <Briefcase size={18} />
                </span>
                <h3 className="xp-card__role">{e.role}</h3>
                <p className="xp-card__company">{e.company}</p>
                {e.period && <span className="chip chip--stroked chip--purple">{e.period}</span>}
                {e.points && (
                  <ul className="xp-points">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                {e.link && (
                  <a className="xp-card__link" href={e.link} target="_blank" rel="noopener noreferrer">
                    {e.link.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}

            <article className="xp-card xp-card--white xp-card--edu">
              <span className="xp-card__icon" aria-hidden="true">
                <GraduationCap size={18} />
              </span>
              <h3 className="xp-card__role">{site.education.degree}</h3>
              <p className="xp-card__company">{site.education.institution}</p>
              <div className="xp-card__grade">
                <span className="chip chip--stroked">{site.education.classification}</span>
                <span className="chip chip--stroked chip--purple">
                  CGPA {site.education.cgpa}/{site.education.scale}
                </span>
              </div>
            </article>
          </div>
        </div>
      </GridRow>
    </section>
  );
}
