import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets, navLinks } from '../config/brand'
import { useSmoothScroll } from '../hooks/SmoothScroll'

export function Nav({ ready }: { ready: boolean }) {
  const { scrollTo, stop, start } = useSmoothScroll()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  // tuck the bar away while scrolling down, bring it back on the way up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 400)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) stop()
    else start()
  }, [open, stop, start])

  const go = (id: string) => {
    setOpen(false)
    // let the menu close before scrolling
    setTimeout(() => scrollTo(id), open ? 450 : 0)
  }

  const shown = ready && (!hidden || open)

  return (
    <>
      {/* Blend layer: cream ink that inverts against whatever section is underneath */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: shown ? 0 : -100 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference"
      >
        <div className="container-x flex h-20 items-center justify-between text-cream">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              go('top')
            }}
            className="pointer-events-auto"
            aria-label="Oyegonu Foods — back to top"
          >
            <img src={assets.logoCream} alt="Oyegonu" className="h-8 w-auto sm:h-9" />
          </a>
          <nav className="pointer-events-auto hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.id)
                }}
                className="group relative text-[0.8rem] font-semibold tracking-wide"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <span className="w-[150px] lg:w-[170px]" />
        </div>
      </motion.header>

      {/* Solid controls (not blended) */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: shown ? 0 : -100 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      >
        <div className="container-x flex h-20 items-center justify-end gap-2">
          <a
            href="#order"
            onClick={(e) => {
              e.preventDefault()
              go('order')
            }}
            className="pointer-events-auto rounded-full bg-lid px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-cream transition-colors hover:bg-lid-soft"
          >
            Order
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-cream text-stew-900 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
            </span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="grain fixed inset-0 z-[55] flex flex-col justify-between bg-stew-900 px-4 pb-10 pt-28 text-cream sm:px-8"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[...navLinks, { id: 'order', label: 'Order' }].map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(l.id)
                  }}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl font-medium leading-tight sm:text-6xl"
                >
                  <span className="mr-4 align-top font-sans text-xs text-gold">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <p className="eyebrow text-cream/50">Real Stew — Spicy and Deliciously Spicy</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
