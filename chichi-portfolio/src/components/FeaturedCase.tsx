import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Lightbulb, Code2, Globe } from 'lucide-react';
import { gsap, SplitText, ScrollTrigger, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import type { Project } from '../data/types';
import { imageFor } from '../data/projects';
import { testimonials } from '../data/content';
import { Shot } from './Shot';
import { Cursor } from './Decor';
import { TestimonialCard } from './TestimonialCard';
import { useCaseStudy } from './CaseStudyContext';
import { site } from '../config/site';

const STEP_MS = 6000;
const stepIcons = [Lightbulb, Code2, Globe];
const stickerColors = ['', 'sticker--blue', 'sticker--green', 'sticker--red'];
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function FeaturedCase({ project, index, total }: { project: Project; index: number; total: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const { open } = useCaseStudy();
  const steps = project.steps!;
  const testimonial = testimonials.find((t) => t.projectSlug === project.slug);
  const reduce = prefersReducedMotion();

  // Only run the auto-advance while the slider is on screen.
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 80%', end: 'bottom 20%', onToggle: (s) => setInView(s.isActive) });
    },
    { scope: root },
  );

  // Purple progress line fills over STEP_MS, then advances (1/3 → 2/3 → 3/3 → loop).
  useEffect(() => {
    const line = root.current?.querySelectorAll<HTMLElement>('.case-info__fill')[step];
    root.current?.querySelectorAll<HTMLElement>('.case-info__fill').forEach((l, i) => i !== step && gsap.set(l, { height: '0%' }));
    if (!line) return;
    if (!inView || reduce) {
      gsap.set(line, { height: '100%' });
      return;
    }
    const tween = gsap.fromTo(line, { height: '0%' }, { height: '100%', duration: STEP_MS / 1000, ease: 'none', onComplete: () => setStep((s) => (s + 1) % 3) });
    return () => {
      tween.kill();
    };
  }, [step, inView, reduce]);

  // Each step's visual pops in; its header drops letter by letter (the reference's slide headers).
  useGSAP(
    () => {
      if (reduce) return;
      const panel = root.current!.querySelectorAll<HTMLElement>('.case-panel')[step];
      if (!panel) return;
      const header = panel.querySelector('.case-panel__header-text');
      const tl = gsap.timeline();
      if (header) {
        const split = SplitText.create(header, { type: 'chars' });
        tl.from(split.chars, { y: -50, rotate: () => gsap.utils.random(-25, 25), autoAlpha: 0, duration: 0.7, stagger: 0.035, ease: 'back.out(2)' });
      }
      tl.from(panel.querySelectorAll('[data-pop]'), { scale: 0.6, autoAlpha: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'back.out(1.7)', clearProps: CLEAR }, 0.1);
      tl.from(panel.querySelectorAll('.cursor'), { x: () => gsap.utils.random(-60, 60), y: () => gsap.utils.random(-40, 40), autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.3);
    },
    { dependencies: [step], scope: root, revertOnUpdate: true },
  );

  return (
    <div ref={root} className="case">
      <span className="capsule capsule--lg">
        Tiny case study {index + 1}/{total}
      </span>

      <div className="case__slider">
        <div className="case__visuals" aria-live="polite">
          {/* Step 1: sticker board */}
          <div className={`case-panel case-panel--board ${step === 0 ? 'is-active' : ''}`} aria-hidden={step !== 0}>
            <div className="case-board__row">
              {(project.stickers ?? []).slice(0, 2).map((s, i) => (
                <div key={s} className={`sticker case-sticker ${stickerColors[i]}`} data-pop style={{ rotate: `${i ? -6 : 7}deg` }}>
                  {s}
                </div>
              ))}
            </div>
            <div className="case-panel__header">
              <span className="case-panel__header-text">{steps[0].title}</span>
            </div>
            <div className="case-board__row case-board__row--bottom">
              {(project.stickers ?? []).slice(2, 4).map((s, i) => (
                <div key={s} className={`sticker case-sticker ${stickerColors[i + 2]}`} data-pop style={{ rotate: `${i ? -10 : 5}deg` }}>
                  {s}
                </div>
              ))}
            </div>
            <Cursor name={site.nickname} color="purple" style={{ left: '58%', top: '30%' }} />
            <Cursor name="Client" color="green" flip style={{ left: '22%', top: '62%' }} />
          </div>

          {/* Step 2: build composition, desktop + mobile */}
          <div className={`case-panel case-panel--build ${step === 1 ? 'is-active' : ''}`} aria-hidden={step !== 1}>
            <div className="case-panel__header case-panel__header--boxed">
              <span className="case-panel__header-text">{steps[1].title}</span>
            </div>
            <div className="case-build">
              <div className="case-build__desktop" data-pop>
                <Shot image={imageFor(project, 'desktop')} sizes="(max-width: 767px) 80vw, 560px" />
              </div>
              <div className="case-build__mobile" data-pop>
                <Shot image={imageFor(project, 'mobile')} sizes="150px" />
              </div>
            </div>
            <Cursor name={site.nickname} color="orange" style={{ right: '12%', top: '22%' }} />
          </div>

          {/* Step 3: live, browser frame */}
          <div className={`case-panel case-panel--live ${step === 2 ? 'is-active' : ''}`} aria-hidden={step !== 2}>
            <div className="case-panel__header case-panel__header--boxed">
              <span className="case-panel__header-text">{steps[2].title}</span>
            </div>
            <div className="browser" data-pop>
              <div className="browser__bar">
                <span className="browser__dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="browser__url">{host(project.url)}</span>
              </div>
              <Shot image={project.images.find((i) => i.kind === 'section') ?? imageFor(project, 'section2')} sizes="(max-width: 767px) 85vw, 600px" />
            </div>
          </div>
        </div>

        <div className="case-info" role="tablist" aria-label={`${project.name} steps`}>
          {steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <button
                type="button"
                role="tab"
                aria-selected={step === i}
                key={s.title}
                className={`case-info__item ${step === i ? 'is-active' : ''}`}
                onClick={() => setStep(i)}
              >
                <span className="case-info__line" aria-hidden="true">
                  <span className="case-info__fill" />
                </span>
                <span className="case-info__body">
                  <Icon size={18} className="case-info__icon" aria-hidden="true" />
                  <span className="case-info__title">{s.title}</span>
                  <span className="case-info__text">{s.text}</span>
                  <span className="capsule case-info__count">
                    {i + 1}/3
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="case__intro">
        <div className="case__intro-text">
          <h3>{project.name}</h3>
          <p className="case__summary">{project.overview ?? project.summary}</p>
          <ul className="case__results">
            <li className="impact">
              <span className="impact__icon" aria-hidden="true">
                <Globe size={16} />
              </span>
              Industry
              <span className="chip chip--stroked">{project.industry}</span>
            </li>
            <li className="impact">
              <span className="impact__icon" aria-hidden="true">
                <Code2 size={16} />
              </span>
              Built with
              <span className="case__tech">
                {project.tech.map((t) => (
                  <span className="chip chip--stroked chip--purple" key={t}>
                    {t}
                  </span>
                ))}
              </span>
            </li>
          </ul>
          <div className="case__actions">
            <a className="btn-outline" href={project.url} target="_blank" rel="noopener noreferrer">
              Open Website <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button type="button" className="btn-outline btn-outline--ghost" onClick={() => open(project.slug)}>
              Read case study <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="case__aside">
          {testimonial ? (
            <TestimonialCard t={testimonial} />
          ) : (
            project.built && (
              <div className="note-card">
                <span className="capsule">What I built</span>
                <ul className="note-card__list">
                  {project.built.slice(0, 4).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
