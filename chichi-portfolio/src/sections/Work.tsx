import { useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, Flip, CLEAR } from '../lib/gsap';
import { featuredProjects, otherProjects, imageFor } from '../data/projects';
import type { Project } from '../data/types';
import { GridRow } from '../components/GridRow';
import { SectionTitle } from '../components/SectionTitle';
import { FeaturedCase } from '../components/FeaturedCase';
import { Shot } from '../components/Shot';
import { useCaseStudy } from '../components/CaseStudyContext';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'business', label: 'Business' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'webapp', label: 'Web apps' },
] as const;
type FilterKey = (typeof filters)[number]['key'];

const INITIAL = 6;

function ProjectCard({ p }: { p: Project }) {
  const { open } = useCaseStudy();
  const second = p.images.find((i) => i.kind === 'section') ?? p.images[1];
  return (
    <article className="project-card" data-flip-id={p.slug}>
      <button type="button" className="project-card__media" onClick={() => open(p.slug)} aria-label={`Open ${p.name} case study`}>
        <Shot image={imageFor(p, 'desktop')} className="project-card__img project-card__img--a" sizes="(max-width: 767px) 88vw, 36vw" />
        {second && <Shot image={second} className="project-card__img project-card__img--b" sizes="(max-width: 767px) 88vw, 36vw" />}
        <span className="project-card__labels">
          <span className="capsule capsule--grey">{p.category}</span>
          <span className="capsule">{p.industry}</span>
        </span>
      </button>
      <div className="project-card__body">
        <h3 className="project-card__name">{p.name}</h3>
        <p className="project-card__summary">{p.summary}</p>
        <ul className="project-card__tech" aria-label="Technologies">
          {p.tech.map((t) => (
            <li className="capsule capsule--grey" key={t}>
              {t}
            </li>
          ))}
        </ul>
        <div className="project-card__actions">
          <a className="btn-outline" href={p.url} target="_blank" rel="noopener noreferrer">
            Visit site <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button type="button" className="btn-outline btn-outline--ghost" onClick={() => open(p.slug)}>
            Case study <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [showAll, setShowAll] = useState(false);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const available = filters.filter((f) => f.key === 'all' || otherProjects.some((p) => p.type === f.key));
  const filtered = otherProjects.filter((p) => filter === 'all' || p.type === filter);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL);

  const change = (fn: () => void) => {
    if (grid.current && !prefersReducedMotion()) flipState.current = Flip.getState(grid.current.querySelectorAll('.project-card'));
    fn();
  };

  // Cards re-flow smoothly when filtering (Flip), entering cards scale in.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.7,
        ease: 'expo.out',
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', clearProps: CLEAR }),
        onComplete: () => {
          gsap.set('.project-card', { clearProps: CLEAR });
        },
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.3 }),
      });
      flipState.current = null;
    },
    { dependencies: [filter, showAll], scope: root },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.case').forEach((c) => {
        gsap.from(c, { y: 80, autoAlpha: 0, duration: 1.1, ease: 'expo.out', clearProps: CLEAR, scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
      });
      gsap.from('.project-card', {
        y: 60,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        clearProps: CLEAR,
        scrollTrigger: { trigger: '.more-work__grid', start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work" id="work" aria-labelledby="work-title">
      <SectionTitle id="work-title" title="Latest Work" sub="Websites and web apps built for real businesses." />

      {featuredProjects.map((p, i) => (
        <GridRow lined key={p.slug} centralClassName="work__central">
          <FeaturedCase project={p} index={i} total={featuredProjects.length} />
        </GridRow>
      ))}

      <GridRow lined centralClassName="work__central">
        <div className="more-work">
          <div className="more-work__head">
            <span className="capsule capsule--lg">More work · {otherProjects.length} projects</span>
            <div className="more-work__filters" role="group" aria-label="Filter projects">
              {available.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`filter ${filter === f.key ? 'is-active' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => change(() => setFilter(f.key))}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div ref={grid} className="more-work__grid">
            {visible.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>

          {filtered.length > INITIAL && (
            <button type="button" className="btn-outline more-work__toggle" onClick={() => change(() => setShowAll((s) => !s))}>
              {showAll ? 'Show fewer' : `Show all ${filtered.length} projects`}
            </button>
          )}
        </div>
      </GridRow>
    </section>
  );
}
