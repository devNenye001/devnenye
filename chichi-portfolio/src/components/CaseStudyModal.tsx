import { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { publishedProjects } from '../data/projects';
import type { Project } from '../data/types';
import { useCaseStudy } from './CaseStudyContext';
import { Shot } from './Shot';

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="cs-block" data-cs-reveal>
      <span className="capsule">{label}</span>
      <div className="cs-block__body">{children}</div>
    </section>
  );
}

function Content({ p }: { p: Project }) {
  const desktop = p.images.filter((i) => i.kind !== 'mobile');
  const mobile = p.images.filter((i) => i.kind === 'mobile');
  return (
    <>
      <header className="cs-head" data-cs-reveal>
        <div className="cs-head__labels">
          <span className="capsule capsule--grey">{p.category}</span>
          <span className="capsule">{p.industry}</span>
        </div>
        <h2 className="cs-head__title" id="cs-title">
          {p.name}
        </h2>
        <p className="cs-head__summary">{p.summary}</p>
        <a className="btn-outline" href={p.url} target="_blank" rel="noopener noreferrer">
          Visit {host(p.url)} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>

      <div className="browser cs-hero" data-cs-reveal>
        <div className="browser__bar">
          <span className="browser__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="browser__url">{host(p.url)}</span>
        </div>
        <Shot image={desktop[0]} sizes="(max-width: 767px) 92vw, 900px" eager />
      </div>

      <div className="cs-grid">
        {p.overview && (
          <Block label="Overview">
            <p>{p.overview}</p>
          </Block>
        )}
        {p.background && (
          <Block label="The business">
            <p>{p.background}</p>
          </Block>
        )}
        {p.requirement && (
          <Block label="The requirement">
            <p>{p.requirement}</p>
          </Block>
        )}
        {p.role && (
          <Block label="My role">
            <p>{p.role}</p>
          </Block>
        )}
        {p.built && (
          <Block label="What I built">
            <ul className="cs-list">
              {p.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Block>
        )}
        {p.features && (
          <Block label="Key features">
            <div className="cs-chips">
              {p.features.map((f) => (
                <span className="chip chip--stroked" key={f}>
                  {f}
                </span>
              ))}
            </div>
          </Block>
        )}
        {p.tech.length > 0 && (
          <Block label="Technologies">
            <div className="cs-chips">
              {p.tech.map((t) => (
                <span className="chip chip--stroked chip--purple" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </Block>
        )}
      </div>

      {(desktop.length > 1 || mobile.length > 0) && (
        <section className="cs-gallery" data-cs-reveal aria-label="Screenshots">
          <span className="capsule">Screenshots</span>
          <div className="cs-gallery__grid">
            {desktop.slice(1).map((img) => (
              <Shot key={img.src} image={img} className="cs-gallery__desktop" sizes="(max-width: 767px) 92vw, 440px" />
            ))}
            {mobile.map((img) => (
              <Shot key={img.src} image={img} className="cs-gallery__mobile" sizes="180px" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export function CaseStudyModal() {
  const { slug, open, close } = useCaseStudy();
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState<string | null>(null);

  const idx = publishedProjects.findIndex((p) => p.slug === (slug ?? shown));
  const project = idx >= 0 ? publishedProjects[idx] : null;
  const prev = publishedProjects[(idx - 1 + publishedProjects.length) % publishedProjects.length];
  const next = publishedProjects[(idx + 1) % publishedProjects.length];

  // Deep link support: #work/<slug> opens the case study.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#work\/(.+)$/);
      if (m && publishedProjects.some((p) => p.slug === m[1])) open(m[1]);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [open]);

  // Open / close animation, scroll lock, focus handling
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (slug) {
      const firstOpen = !shown;
      setShown(slug);
      if (location.hash !== `#work/${slug}`) history.replaceState(null, '', `#work/${slug}`);
      if (firstOpen) {
        lastFocus.current = document.activeElement as HTMLElement;
        document.documentElement.style.overflow = 'hidden';
      }
      requestAnimationFrame(() => {
        if (!panel.current) return;
        panel.current.scrollTop = 0;
        if (firstOpen) {
          gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.4 });
          gsap.fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: reduce ? 0 : 0.9, ease: 'expo.out' });
        }
        if (!reduce) {
          gsap.fromTo(panel.current.querySelectorAll('[data-cs-reveal]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, delay: firstOpen ? 0.35 : 0, ease: 'expo.out' });
        }
        panel.current.querySelector<HTMLElement>('.cs-close')?.focus({ preventScroll: true });
      });
    } else if (shown) {
      if (location.hash.startsWith('#work/')) history.replaceState(null, '', '#work');
      gsap.to(panel.current, { yPercent: 100, duration: reduce ? 0 : 0.6, ease: 'expo.in' });
      gsap.to(overlay.current, {
        autoAlpha: 0,
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : 0.15,
        onComplete: () => {
          setShown(null);
          document.documentElement.style.overflow = '';
          lastFocus.current?.focus?.({ preventScroll: true });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && panel.current) {
        // keep focus inside the dialog
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slug, close]);

  if (!project || (!slug && !shown)) return null;

  return (
    <div className="cs-overlay" ref={overlay} onClick={(e) => e.target === overlay.current && close()}>
      <div className="cs-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="cs-title">
        <div className="cs-topbar">
          <span className="capsule capsule--lg">
            Case study {idx + 1}/{publishedProjects.length}
          </span>
          <button type="button" className="menu-toggle is-close cs-close" onClick={close}>
            <X size={18} aria-hidden="true" /> Close
          </button>
        </div>

        <div className="cs-content">
          <Content p={project} />

          <nav className="cs-pager" aria-label="Other case studies">
            <button type="button" className="cs-pager__btn" onClick={() => open(prev.slug)}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>
                <small>Previous</small>
                {prev.name}
              </span>
            </button>
            <button type="button" className="cs-pager__btn cs-pager__btn--next" onClick={() => open(next.slug)}>
              <span>
                <small>Next</small>
                {next.name}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
