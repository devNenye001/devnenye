import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { navLinks, primaryContactUrl } from '../config/site';
import { CtaButton } from './Buttons';
import { GridRow } from './GridRow';

function Hamburger({ open }: { open: boolean }) {
  return (
    <span className={`hmenu ${open ? 'is-open' : ''}`} aria-hidden="true">
      <span className="hmenu__bar hmenu__bar--top" />
      <span className="hmenu__bar hmenu__bar--mid" />
      <span className="hmenu__bar hmenu__bar--bottom" />
    </span>
  );
}

export function Nav() {
  const root = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const [hidden, setHidden] = useState(false);
  const first = useRef(true);

  // Dock the pill to the top of the viewport once the original nav row has scrolled away.
  // While docked it hides on scroll-down (so it never covers what you're reading) and returns on scroll-up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setFloating(y > 110);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Open/close: the items container grows from 0 (width on desktop, height on mobile),
  // then links fade up 10px with a 0.2s staggered amount, the same values as the reference.
  useGSAP(
    () => {
      const items = itemsRef.current;
      if (!items) return;
      const links = items.querySelectorAll('[data-nav-item]');
      const mobile = window.matchMedia('(max-width: 991px)').matches;
      const dim = mobile ? 'height' : 'width';
      const reduce = prefersReducedMotion();

      if (first.current) {
        first.current = false;
        gsap.set(items, { [dim]: 0, autoAlpha: 0 });
        return;
      }
      if (open) {
        gsap.timeline()
          .fromTo(items, { [dim]: 0, autoAlpha: 0 }, { [dim]: 'auto', autoAlpha: 1, duration: reduce ? 0 : 0.45, ease: 'expo.out' })
          .fromTo(links, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.2, stagger: { amount: 0.2 }, ease: 'power2.out' }, reduce ? 0 : 0.1);
      } else {
        gsap.timeline()
          .to(links, { autoAlpha: 0, y: 6, duration: reduce ? 0 : 0.1, stagger: { amount: 0.05, from: 'end' } })
          .to(items, { [dim]: 0, autoAlpha: 0, duration: reduce ? 0 : 0.35, ease: 'expo.inOut' });
      }
    },
    { dependencies: [open], scope: root },
  );

  // Entrance: pill drops in from above, matching the page-load reveal.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.nav', { y: -24, autoAlpha: 0, duration: 1, delay: 0.15, ease: 'expo.out', clearProps: CLEAR });
      gsap.from('.nav-version', { autoAlpha: 0, duration: 0.8, delay: 0.6 });
    },
    { scope: root },
  );

  const close = () => setOpen(false);

  return (
    <header ref={root} className="nav-row">
      <GridRow className="nav-row__grid" centralClassName="nav-row__central" sideClassName="nav-row__side">
        <div className="nav-row__placeholder">
          <nav className={`nav ${open ? 'is-open' : ''} ${floating ? 'is-floating' : ''} ${floating && hidden && !open ? 'is-hidden' : ''}`} aria-label="Main">
            <div className="nav__bar">
              <button
                type="button"
                className={`menu-toggle ${open ? 'is-close' : ''}`}
                aria-expanded={open}
                aria-controls="nav-items"
                onClick={() => setOpen((o) => !o)}
              >
                <Hamburger open={open} />
                <span>{open ? 'Close' : 'Menu'}</span>
              </button>

              <div className="nav__items" id="nav-items" ref={itemsRef}>
                <ul className="nav__list">
                  {navLinks.map((l) => (
                    <li key={l.href} data-nav-item>
                      <a className="nav__link" href={l.href} onClick={close} tabIndex={open ? 0 : -1}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="nav__mobile-cta" data-nav-item>
                  <CtaButton href="#contact" variant="dark" avatar={false} title="Start a project" sub="Tell me what you have in mind" onClick={close} />
                </div>
              </div>

              <CtaButton className="nav__cta" href={primaryContactUrl} variant="white" avatar="sm" title={<>Let&rsquo;s <span className="text-purple">talk</span></>} />
            </div>
          </nav>
        </div>
      </GridRow>
      <span className="nav-version capsule" aria-hidden="true">
        portfolio v1.0
      </span>
    </header>
  );
}
