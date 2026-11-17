import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, CLEAR } from '../lib/gsap';
import { tools } from '../data/content';
import { site } from '../config/site';
import { GridRow } from '../components/GridRow';
import { SectionTitle } from '../components/SectionTitle';
import { Cursor } from '../components/Decor';

// Fixed (not random) tilts so the board looks hand-placed and stays stable between renders.
const tilts = [-6, 4, -2, 7, -8, 3, 5, -4, 8, -3, 2, -7];

export function Toolkit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Stickers get slapped onto the board one after another
      gsap.from('.tool-sticker', {
        scale: 1.6,
        autoAlpha: 0,
        y: -30,
        rotate: (i) => tilts[i % tilts.length] * 3,
        duration: 0.7,
        ease: 'back.out(1.6)',
        stagger: { each: 0.07, from: 'random' },
        clearProps: CLEAR,
        scrollTrigger: { trigger: '.board', start: 'top 75%', once: true },
      });

      // Collaborator cursors wander around the board
      gsap.utils.toArray<HTMLElement>('.board .cursor').forEach((c, i) => {
        const wander = () =>
          gsap.to(c, {
            left: `${gsap.utils.random(8, 78)}%`,
            top: `${gsap.utils.random(8, 80)}%`,
            duration: gsap.utils.random(2.2, 3.6),
            ease: 'power2.inOut',
            delay: i * 0.6 + gsap.utils.random(0.6, 1.6),
            onComplete: wander,
          });
        wander();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="tech" aria-labelledby="tech-title">
      <SectionTitle id="tech-title" title="My Toolkit" sub="The technologies I use to bring ideas to life." />
      <GridRow>
        <div className="board-wrap">
          <span className="capsule capsule--lg">Tech stack</span>
          <div className="board">
            <ul className="board__stickers">
              {tools.map((t, i) => (
                <li
                  key={t.name}
                  className={`sticker tool-sticker sticker--${t.color === 'yellow' ? 'yellow' : t.color}`}
                  style={{ ['--tilt' as string]: `${tilts[i % tilts.length]}deg` }}
                >
                  <span className="tool-sticker__name">{t.name}</span>
                  <span className="tool-sticker__note">{t.note}</span>
                </li>
              ))}
            </ul>
            <Cursor name={site.nickname} color="purple" style={{ left: '40%', top: '12%' }} />
            <Cursor name="AI pair" color="green" style={{ left: '70%', top: '64%' }} />
          </div>
        </div>
      </GridRow>
    </section>
  );
}
