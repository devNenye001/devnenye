import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { CaseStudyProvider } from './components/CaseStudyContext';
import { CaseStudyModal } from './components/CaseStudyModal';
import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { WorkSlides } from './sections/WorkSlides';
import { About } from './sections/About';
import { NamesMarquee } from './sections/NamesMarquee';
import { Work } from './sections/Work';
import { Experience } from './sections/Experience';
import { Services } from './sections/Services';
import { Toolkit } from './sections/Toolkit';
import { Testimonials } from './sections/Testimonials';
import { Contact, Footer } from './sections/Contact';

export function App() {
  // Late-loading images change layout height; keep scroll trigger positions accurate.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <CaseStudyProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-wrapper">
        <Nav />
        <main id="main">
          <Hero />
          <WorkSlides />
          <About />
          <NamesMarquee />
          <Work />
          <Experience />
          <Services />
          <Toolkit />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
      <CaseStudyModal />
    </CaseStudyProvider>
  );
}
