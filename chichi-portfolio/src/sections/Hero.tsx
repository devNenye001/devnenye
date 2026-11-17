import { useRef } from 'react';
import { Globe, Layers, LayoutGrid, GraduationCap } from 'lucide-react';
import { gsap, SplitText, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { site, primaryContactUrl } from '../config/site';
import { publishedProjects } from '../data/projects';
import { GridRow } from '../components/GridRow';
import { CtaButton } from '../components/Buttons';
import { BoxedWord, Chip } from '../components/Decor';
import { Counter } from '../components/Counter';

const industries = new Set(publishedProjects.map((p) => p.industry)).size;

const stats = [
  { label: 'Websites built & hosted', icon: Globe, value: site.stats.websitesHosted, suffix: site.stats.websitesHostedSuffix },
  { label: 'Industries served', icon: Layers, value: industries, suffix: '' },
  { label: 'Projects showcased here', icon: LayoutGrid, value: publishedProjects.length, suffix: '' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.25 });

      // Headline lines rise through a mask
      tl.from('.hero__caps', { y: 12, autoAlpha: 0, duration: 0.8 })
        .from('.hero__line-inner', { yPercent: 110, duration: 1.1, stagger: 0.1 }, '<0.05');

      // Boxed word: letters drop in one by one, then the arrow tilts ↑ → ↗
      const split = SplitText.create('.hero .boxed-word__text', { type: 'chars' });
      tl.from('.hero .boxed-word', { scaleX: 0.6, autoAlpha: 0, transformOrigin: '0% 50%', duration: 0.7 }, '-=0.6')
        .from(split.chars, { yPercent: 80, autoAlpha: 0.15, duration: 0.6, stagger: 0.09, ease: 'back.out(2)' }, '<0.1')
        .fromTo('.hero .boxed-word__arrow', { rotate: 0 }, { rotate: 45, duration: 0.6, ease: 'back.out(3)' }, '<0.2');

      // Copy fades from grey to full, then capsules and CTA
      tl.from('.hero__copy p', { autoAlpha: 0.25, y: 10, duration: 0.9, stagger: 0.12 }, '-=0.4')
        .from('.hero .impact', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.12 }, '-=0.5')
        .from('.hero .btn', { autoAlpha: 0, y: 16, scale: 0.94, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.4')
        .from('.hero__credential', { autoAlpha: 0, y: 8, duration: 0.6 }, '-=0.5');

      // Sticker slides in from the bottom-right, rotated, then settles
      gsap.from('.hero .sticker', { x: 100, y: 100, rotate: -10, autoAlpha: 0, duration: 1.4, delay: 1.1, ease: 'expo.out', clearProps: CLEAR });

      // Arrow keeps nudging between ↑ and ↗, like the reference's "up" box
      gsap.to('.hero .boxed-word__arrow', { rotate: 0, duration: 0.5, ease: 'back.inOut(2)', repeat: -1, yoyo: true, repeatDelay: 2.4, delay: 3.5 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="home" aria-labelledby="hero-title">
      <GridRow pattern className="hero__grid" centralClassName="hero__central" sideClassName="hero__side">
        <div className="hero__wrap">
          <p className="caps-line hero__caps">
            I&rsquo;m {site.firstName}, a <span className="capsule">{site.heroRole}</span> for businesses &amp; brands
          </p>

          <h1 className="hero__title" id="hero-title">
            <span className="sr-only">
              {site.name}, {site.title}. Digital experiences that work beautifully.
            </span>
            <span className="hero__line" aria-hidden="true">
              <span className="hero__line-inner">Digital experiences</span>
            </span>
            <span className="hero__line hero__line--mid" aria-hidden="true">
              <span className="hero__line-inner">
                that <BoxedWord word="work" />
              </span>
            </span>
            <span className="hero__line" aria-hidden="true">
              <span className="hero__line-inner">beautifully.</span>
            </span>
          </h1>

          <div className="hero__copy">
            <p>
              I work with businesses and brands to turn ideas into functional, modern websites <em>and</em> web applications. From business
              websites and e-commerce platforms to custom web solutions, I build digital experiences that help businesses establish their online
              presence.
            </p>
            <p className="hero__lead">At a glance:</p>
          </div>

          <ul className="hero__builds" aria-label="At a glance">
            {stats.map(({ label, icon: Icon, value, suffix }) => (
              <li className="impact" key={label}>
                <span className="impact__icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={2} />
                </span>
                {label}
                <Chip>
                  <Counter value={value} suffix={suffix} />
                </Chip>
              </li>
            ))}
          </ul>

          <div className="hero__cta">
            <CtaButton href={primaryContactUrl} title={<>Start your project</>} sub="Chat with me on WhatsApp" />
            <p className="hero__credential">
              <GraduationCap size={14} aria-hidden="true" />
              <span>First Class Computer Science Graduate</span>
              <span className="hero__credential-sep" aria-hidden="true">
                |
              </span>
              <span>
                CGPA {site.education.cgpa}/{site.education.scale}
              </span>
            </p>
          </div>

          <div className="sticker hero__sticker" aria-hidden="true">
            Hey, I&rsquo;m {site.nickname}! {site.title}
          </div>
        </div>
      </GridRow>
    </section>
  );
}
