import { useRef } from 'react';
import { GraduationCap, Github, Linkedin, Briefcase } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion, revealOnScroll } from '../lib/gsap';
import { site } from '../config/site';
import { experience } from '../data/content';
import { GridRow } from '../components/GridRow';
import { WhatsAppButton } from '../components/Buttons';
import { BoxedWord, Chip } from '../components/Decor';
import { DashedArrow } from '../components/DashedArrow';

export function About() {
  const root = useRef<HTMLElement>(null);
  const cgpa = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      revealOnScroll(root.current!);

      const tl = gsap.timeline({ scrollTrigger: { trigger: '.about__text', start: 'top 75%', once: true } });
      tl.from('.about__line-inner', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'expo.out' })
        .from('.about .boxed-word', { scaleX: 0.5, autoAlpha: 0, transformOrigin: '0% 50%', duration: 0.7, ease: 'expo.out' }, '-=0.7')
        .fromTo('.about .boxed-word__arrow', { rotate: 0 }, { rotate: 45, duration: 0.6, ease: 'back.out(3)' }, '-=0.3');

      // Flying chips bob gently, each with its own tilt (rotations are set in CSS)
      gsap.utils.toArray<HTMLElement>('.about__fly').forEach((el, i) => {
        gsap.from(el, { autoAlpha: 0, scale: 0.6, duration: 0.8, delay: 0.4 + i * 0.15, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        gsap.to(el, { y: i % 2 ? 6 : -6, duration: 2.2 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });

      // CGPA counts up to its real value
      const obj = { v: 0 };
      gsap.to(obj, {
        v: Number(site.education.cgpa),
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.profile-card', start: 'top 75%', once: true },
        onUpdate: () => {
          if (cgpa.current) cgpa.current.textContent = obj.v.toFixed(2);
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="about" id="about" aria-labelledby="about-title">
      <GridRow>
        <div className="book">
          <div className="book__content about__text">
            <p className="caps-line">
              For <span className="capsule">businesses</span> that need their website to work
            </p>
            <h2 className="book__title" id="about-title">
              <span className="sr-only">Hey, I&rsquo;m {site.firstName}.</span>
              <span className="about__line" aria-hidden="true">
                <span className="about__line-inner">Hey,</span>
              </span>
              <span className="about__line" aria-hidden="true">
                <span className="about__line-inner">
                  I&rsquo;m <BoxedWord word={site.firstName} />.
                </span>
              </span>
            </h2>

            <div className="book__copy">
              <p data-reveal>I&rsquo;m a frontend developer passionate about building useful digital products and creating thoughtful web experiences.</p>
              <p data-reveal>
                I work across <strong>business websites</strong>, <strong>e-commerce platforms</strong> and <strong>custom web applications</strong>,
                combining clean code with attention to detail.
              </p>
              <p data-reveal>I enjoy solving problems, exploring new technologies and bringing ideas to life through the web.</p>
            </div>

            <p className="about__credential" data-reveal>
              <GraduationCap size={16} aria-hidden="true" />
              <span>
                <strong>First Class Computer Science Graduate</strong> | CGPA {site.education.cgpa}/{site.education.scale}
              </span>
            </p>

            <div className="about__actions" data-reveal>
              <WhatsAppButton />
              <a className="btn-outline btn-outline--ghost" href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} aria-hidden="true" /> LinkedIn
              </a>
              <a className="btn-outline btn-outline--ghost" href={site.contact.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} aria-hidden="true" /> GitHub
              </a>
            </div>
          </div>

          <div className="book__embed">
            <div className="book__cta" aria-hidden="true">
              <div className="about__flying">
                <Chip stroked className="about__fly about__fly--1">
                  {site.stats.websitesHosted}
                  {site.stats.websitesHostedSuffix} sites hosted
                </Chip>
                <Chip stroked className="about__fly about__fly--2">
                  CGPA {site.education.cgpa}
                </Chip>
                <Chip stroked className="about__fly about__fly--3">
                  1st Class
                </Chip>
              </div>
              <span className="capsule capsule--lg">My profile</span>
              <DashedArrow className="book__arrow" />
            </div>

            <article className="profile-card" data-reveal aria-label="Profile summary">
              <header className="profile-card__head">
                {site.avatar ? (
                  <img className="profile-card__avatar" src={site.avatar} alt={site.name} width={72} height={72} />
                ) : (
                  <span className="profile-card__avatar" aria-hidden="true">
                    {site.initials}
                  </span>
                )}
                <div>
                  <h3 className="profile-card__name">{site.name}</h3>
                  <p className="profile-card__role">
                    {site.title} <span aria-hidden="true">/</span> {site.subtitle}
                  </p>
                </div>
              </header>

              <div className="profile-card__edu">
                <span className="capsule">Education</span>
                <p className="profile-card__degree">{site.education.degree}</p>
                <p className="profile-card__school">{site.education.institution}</p>
                <div className="profile-card__grade">
                  <div>
                    <span className="profile-card__cgpa">
                      <span ref={cgpa}>{site.education.cgpa}</span>
                      <small>/{site.education.scale}</small>
                    </span>
                    <span className="profile-card__label">CGPA</span>
                  </div>
                  <span className="profile-card__honours">
                    <GraduationCap size={16} aria-hidden="true" /> {site.education.classification}
                  </span>
                </div>
              </div>

              <ul className="profile-card__exp">
                {experience.map((e) => (
                  <li key={e.company}>
                    <Briefcase size={14} aria-hidden="true" />
                    <span>
                      <strong>{e.role}</strong>, {e.company}
                      {e.period && <em> · {e.period}</em>}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </GridRow>
    </section>
  );
}
