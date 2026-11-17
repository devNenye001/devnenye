import { assets, brand, navLinks } from '../config/brand'
import { useSmoothScroll } from '../hooks/SmoothScroll'

export function Footer() {
  const { scrollTo } = useSmoothScroll()

  return (
    <footer className="grain relative overflow-hidden bg-stew-950 pt-20 text-cream">
      <div className="container-x">
        <div className="grid gap-12 border-b border-cream/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="max-w-sm font-display text-3xl leading-tight">
              Real Nigerian stew, <span className="italic text-gold">ready when you are.</span>
            </p>
            <p className="mt-6 text-sm text-cream/50">
              {brand.storage}. Shelf-stable for up to {brand.shelfLife}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-5 text-cream/40">Explore</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(l.id)
                    }}
                    className="text-cream/80 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-5 text-cream/40">Get Real Stew</p>
            <ul className="space-y-2 text-cream/80">
              <li>
                <a
                  href="#order"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo('order')
                  }}
                  className="hover:text-gold"
                >
                  Place an order
                </a>
              </li>
              {brand.email && (
                <li>
                  <a href={`mailto:${brand.email}`} className="hover:text-gold">
                    {brand.email}
                  </a>
                </li>
              )}
              {brand.instagram && (
                <li>
                  <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer" className="hover:text-gold">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 py-8 text-xs text-cream/40 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <button onClick={() => scrollTo(0)} className="eyebrow text-cream/60 hover:text-gold">
            Back to top ↑
          </button>
        </div>
      </div>

      {/* oversized wordmark, cropped by the page edge */}
      <div className="pointer-events-none flex justify-center px-4">
        <img src={assets.logoCream} alt="" aria-hidden className="w-full max-w-[1400px] translate-y-[22%] opacity-[0.08]" loading="lazy" />
      </div>
    </footer>
  )
}
