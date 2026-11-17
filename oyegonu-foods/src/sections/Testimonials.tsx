import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { testimonials } from '../content/testimonials'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Button } from '../components/ui/Button'
import { ReviewDialog } from '../components/ReviewDialog'

const QuoteMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 48" className={className} fill="currentColor" aria-hidden>
    <path d="M0 48V28C0 12 8 2 26 0l2 7C18 10 14 16 14 24h12v24zm36 0V28c0-16 8-26 26-28l2 7c-10 3-14 9-14 17h12v24z" />
  </svg>
)

export function Testimonials() {
  const [open, setOpen] = useState(false)
  const rail = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section id="reviews" className="relative overflow-hidden bg-paper py-28 text-stew-900 sm:py-40">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="06" className="mb-8">Reviews</SectionLabel>
            <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
              From <span className="italic text-lid">your</span> table.
            </h2>
          </div>
          <Button variant="ink" onClick={() => setOpen(true)}>
            Share your review
          </Button>
        </div>

        {testimonials.length > 0 ? (
          <div ref={rail} className="-mx-4 overflow-hidden px-4 sm:-mx-8 sm:px-8">
            <motion.div drag="x" dragConstraints={rail} className="flex w-max cursor-grab gap-6 active:cursor-grabbing">
              {testimonials.map((t, i) => (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex w-[82vw] max-w-[420px] flex-col justify-between rounded-[2rem] p-8 sm:p-10 ${i % 3 === 1 ? 'bg-gold' : i % 3 === 2 ? 'bg-stew-900 text-cream' : 'bg-cream'}`}
                >
                  <QuoteMark className="h-8 w-10 text-lid" />
                  <blockquote className="mt-6 font-display text-2xl leading-snug">{t.quote}</blockquote>
                  <figcaption className="mt-8 text-sm">
                    <span className="font-bold">{t.name}</span>
                    {t.location && <span className="opacity-60"> · {t.location}</span>}
                    {t.pairing && <span className="eyebrow mt-1 block opacity-60">With {t.pairing}</span>}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-cream p-8 sm:p-14">
              <QuoteMark className="h-12 w-16 text-lid" />
              <p className="mt-8 max-w-xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                This space is saved for the people who've tasted it. Tried Real Stew? Tell us how you served it.
              </p>
              <button onClick={() => setOpen(true)} className="eyebrow mt-10 inline-flex items-center gap-3 text-lid">
                Be the first to review <span aria-hidden>→</span>
              </button>
              <QuoteMark className="absolute -bottom-10 -right-6 h-48 w-64 rotate-180 text-gold/30" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {['Rice night?', 'Dodo duty?', 'Yam morning?', 'Bread & dip?'].map((q, i) => (
                <button
                  key={q}
                  onClick={() => setOpen(true)}
                  className={`group flex aspect-square flex-col justify-between rounded-[1.5rem] p-5 text-left transition-transform duration-500 ease-expo hover:-translate-y-1 sm:p-6 ${
                    i === 0 ? 'bg-gold' : i === 1 ? 'bg-stew-900 text-cream' : i === 2 ? 'bg-lid text-cream' : 'bg-stew-900/5'
                  }`}
                >
                  <span className="eyebrow opacity-70">Your story</span>
                  <span className="font-display text-xl font-semibold leading-tight sm:text-2xl">{q}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <ReviewDialog open={open} onClose={close} />
    </section>
  )
}
