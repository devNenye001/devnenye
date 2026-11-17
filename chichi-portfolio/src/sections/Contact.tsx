import { useRef } from 'react';
import { Mail, Linkedin, Github, ArrowUpRight, MapPin } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { site, emailUrl, whatsappUrl, primaryContactUrl } from '../config/site';
import { GridRow } from '../components/GridRow';
import { CtaButton } from '../components/Buttons';
import { BoxedWord } from '../components/Decor';
import { DashedArrow } from '../components/DashedArrow';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.05 21.5a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 1 1 8 4.42M20.08 4.04A11.27 11.27 0 0 0 .7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.28l5.67-1.49a11.34 11.34 0 0 0 16.8-9.88c0-3.03-1.18-5.88-3.32-8.02" />
  </svg>
);

export function Contact() {
  const root = useRef<HTMLElement>(null);

  const channels = [
    emailUrl && { label: 'Email', value: site.contact.email, href: emailUrl, icon: <Mail size={18} aria-hidden="true" /> },
    whatsappUrl && { label: 'WhatsApp', value: '+234 813 606 1304', href: whatsappUrl, icon: <WhatsAppIcon /> },
    { label: 'LinkedIn', value: 'Chinenye Ndubuisi', href: site.contact.linkedin, icon: <Linkedin size={18} aria-hidden="true" /> },
    { label: 'GitHub', value: '@devNenye001', href: site.contact.github, icon: <Github size={18} aria-hidden="true" /> },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: JSX.Element }[];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top 70%', once: true } });
      tl.from('.contact .caps-line', { y: 12, autoAlpha: 0, duration: 0.7 })
        .from('.contact__line-inner', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.4')
        .from('.contact .boxed-word', { scaleX: 0.5, autoAlpha: 0, transformOrigin: '0% 50%', duration: 0.7 }, '-=0.6')
        .fromTo('.contact .boxed-word__arrow', { rotate: 0 }, { rotate: 45, duration: 0.6, ease: 'back.out(3)' }, '-=0.3')
        .from('.contact__copy, .contact__actions > *', { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.4')
        .from('.contact-row', { x: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 0.5);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="contact" id="contact" aria-labelledby="contact-title">
      <GridRow>
        <div className="book book--final">
          <div className="book__content">
            <p className="caps-line">
              Have something in <span className="capsule">mind</span>?
            </p>
            <h2 className="book__title" id="contact-title">
              <span className="sr-only">Have something in mind? Let&rsquo;s build something great.</span>
              <span className="contact__line" aria-hidden="true">
                <span className="contact__line-inner">Let&rsquo;s</span>
              </span>
              <span className="contact__line" aria-hidden="true">
                <span className="contact__line-inner">
                  <BoxedWord word="build" /> something
                </span>
              </span>
              <span className="contact__line" aria-hidden="true">
                <span className="contact__line-inner">great.</span>
              </span>
            </h2>
            <p className="contact__copy">Tell me about your business, your goals and what you need. Let&rsquo;s work out the best way to bring it to life.</p>
            <div className="contact__actions">
              <CtaButton href={primaryContactUrl} title="Let's talk about your project" sub={whatsappUrl ? 'Chat with me on WhatsApp' : emailUrl ? site.contact.email : 'Message me on LinkedIn'} />
              {emailUrl && whatsappUrl && <CtaButton href={emailUrl} variant="white" avatar={false} title="Prefer email?" sub={site.contact.email} />}
            </div>
          </div>

          <div className="book__embed">
            <div className="book__cta" aria-hidden="true">
              <span className="capsule capsule--lg">Say hello</span>
              <DashedArrow className="book__arrow" />
            </div>
            <div className="contact-card">
              <ul className="contact-card__list">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a className="contact-row" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      <span className="contact-row__icon">{c.icon}</span>
                      <span className="contact-row__text">
                        <span className="contact-row__label">{c.label}</span>
                        <span className="contact-row__value">{c.value}</span>
                      </span>
                      <ArrowUpRight className="contact-row__arrow" size={20} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <span className="capsule contact-card__note">*No long forms, just a real conversation</span>
            </div>
          </div>
        </div>
      </GridRow>
    </section>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.footer__inner > *', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 95%', once: true } });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer">
      <GridRow centralClassName="footer__central">
        <div className="footer__inner">
          <p className="footer__location">
            {site.location ? (
              <>
                <MapPin size={18} aria-hidden="true" /> {site.location}
              </>
            ) : (
              <>
                © {new Date().getFullYear()} {site.name}
              </>
            )}
          </p>
          <nav className="footer__links" aria-label="Social">
            <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={site.contact.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {emailUrl && <a href={emailUrl}>Email me</a>}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
          </nav>
          <CtaButton href={primaryContactUrl} variant="white" avatar="sm" title="Let's talk" />
        </div>
      </GridRow>
    </footer>
  );
}
