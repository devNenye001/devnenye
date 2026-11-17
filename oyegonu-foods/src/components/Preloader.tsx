import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets } from '../config/brand'
import { intro } from '../lib/store'

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })

/** Counts up while fonts and the hero jar load, then lifts away like a lid. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let ready = false
    Promise.all([document.fonts?.ready, loadImage(assets.jar), loadImage(assets.logoCream)]).then(() => {
      ready = true
    })
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const elapsed = (now - start) / 1600
      // creep toward 90 until assets are in, then finish
      const target = ready ? Math.min(100, elapsed * 100) : Math.min(90, elapsed * 100)
      setCount((c) => Math.max(c, Math.floor(target)))
      if (ready && elapsed >= 1) {
        setVisible(false)
        intro.revealed = true
        onDone()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stew-900 text-cream"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={assets.logoCream}
            alt="Oyegonu"
            className="w-48 sm:w-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="mt-8 h-px w-48 overflow-hidden bg-cream/15 sm:w-64">
            <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${count}%` }} />
          </div>
          <div className="absolute bottom-6 left-4 right-4 flex items-end justify-between sm:bottom-10 sm:left-10 sm:right-10">
            <span className="eyebrow text-cream/50">Real Stew · Nigerian kitchen</span>
            <span className="font-display text-6xl font-light tabular-nums leading-none sm:text-8xl">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
