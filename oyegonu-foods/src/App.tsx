import { useCallback, useEffect, useState } from 'react'
import { SmoothScrollProvider } from './hooks/SmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { Preloader } from './components/Preloader'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { BrandIntro } from './sections/BrandIntro'
import { ProductShowcase } from './sections/ProductShowcase'
import { JarToTable } from './sections/JarToTable'
import { WhyOyegonu } from './sections/WhyOyegonu'
import { BrandStory } from './sections/BrandStory'
import { Testimonials } from './sections/Testimonials'
import { FinalCTA } from './sections/FinalCTA'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  // pinned sections change the page height, so re-measure once fonts and images settle
  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    return () => clearTimeout(id)
  }, [ready])

  return (
    <SmoothScrollProvider>
      <Preloader onDone={onLoaded} />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <BrandIntro />
        <ProductShowcase />
        <JarToTable />
        <WhyOyegonu />
        <BrandStory />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </SmoothScrollProvider>
  )
}
