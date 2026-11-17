import { lazy, Suspense, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { assets, brand } from '../config/brand'
import { isOrderChannelConfigured, submitForm, type SubmitResult } from '../lib/forms'

const FieldScene = lazy(() => import('../components/three/FieldScene'))

const field =
  'w-full rounded-xl border border-stew-900/15 bg-white/80 px-4 py-3 text-sm text-stew-900 outline-none transition-colors placeholder:text-stew-900/40 focus:border-lid'

const RESULT_COPY: Record<SubmitResult, string> = {
  whatsapp: 'We’ve opened WhatsApp with your order ready to send. Hit send and we’ll take it from there.',
  redirect: 'We’ve opened our order page in a new tab.',
  sent: 'Your order request is in. We’ll be in touch to confirm delivery.',
  saved: 'Your order request has been noted. We’ll be in touch to confirm.',
}

function OrderForm() {
  const [qty, setQty] = useState(2)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    data.jars = String(qty)
    const summary = [
      `Hello ${brand.name}! I'd like to order ${qty} jar${qty > 1 ? 's' : ''} of ${brand.product}.`,
      `Name: ${data.name}`,
      `Contact: ${data.contact}`,
      `Delivery area: ${data.area}`,
      data.note ? `Note: ${data.note}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    setStatus('sending')
    try {
      setResult(await submitForm('order', data, summary))
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative rounded-[2rem] bg-cream p-6 text-stew-900 shadow-[0_40px_80px_-20px_rgba(37,10,6,0.5)] sm:p-10">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
            <img src={assets.jarSmall} alt="" className="mx-auto h-32 w-auto" />
            <p className="mt-6 font-display text-3xl font-semibold">Stew is on the way to the table.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-stew-900/70">{RESULT_COPY[result]}</p>
            <button onClick={() => setResult(null)} className="eyebrow mt-8 text-lid">
              Place another order
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-lid">Order</p>
                <p className="mt-1 font-display text-2xl font-semibold">{brand.product}</p>
                <p className="text-xs text-stew-900/60">{brand.tagline}</p>
              </div>
              <div className="flex items-center rounded-full bg-stew-900/5 p-1" role="group" aria-label="Number of jars">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full text-lg hover:bg-white" aria-label="Fewer jars">
                  −
                </button>
                <span className="w-10 text-center font-display text-xl font-semibold tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button type="button" onClick={() => setQty((q) => Math.min(48, q + 1))} className="grid h-10 w-10 place-items-center rounded-full text-lg hover:bg-white" aria-label="More jars">
                  +
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required placeholder="Full name" className={field} autoComplete="name" />
              <input name="contact" required placeholder="Phone or email" className={field} autoComplete="tel" />
            </div>
            <input name="area" required placeholder="Delivery city / area" className={field} autoComplete="address-level2" />
            <textarea name="note" rows={2} placeholder="Anything we should know? (optional)" className={`${field} resize-none`} />
            {status === 'error' && <p className="text-sm text-lid">We couldn't send that just now. Please try again.</p>}
            <Button type="submit" className="mt-2 justify-between" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : `Order ${qty} jar${qty > 1 ? 's' : ''}`}
            </Button>
            <p className="text-xs leading-relaxed text-stew-900/55">
              We'll confirm price, availability and delivery with you before anything is final.
            </p>
            {import.meta.env.DEV && !isOrderChannelConfigured() && (
              <p className="rounded-lg bg-gold/40 px-3 py-2 text-[11px] text-stew-900">
                Dev note: no order channel set. Add a WhatsApp number, order URL or form endpoint in src/config/brand.ts.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FinalCTA() {
  const section = useRef<HTMLElement>(null)
  const active = useInView(section)

  return (
    <section ref={section} id="order" className="grain relative overflow-hidden bg-lid text-cream">
      <div className="absolute inset-0 opacity-90">
        <Suspense fallback={null}>
          <FieldScene active={active} />
        </Suspense>
      </div>

      <div className="container-x relative grid items-center gap-14 py-28 sm:py-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionLabel index="07" className="mb-8 text-cream/80">Order</SectionLabel>
          <h2 className="font-display text-[3.4rem] font-semibold leading-[0.9] tracking-tight sm:text-7xl lg:text-[6.5rem]">
            Dinner starts
            <br />
            <span className="italic text-gold-soft">at the lid.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-cream/85">
            Authentic Nigerian stew, ready-made and shelf-stable for up to {brand.shelfLife}. Order a few jars and keep a proper meal within reach.
          </p>
          <motion.img
            src={assets.jar}
            alt="Oyegonu Real Stew jar"
            className="mt-10 hidden w-40 drop-shadow-[0_30px_40px_rgba(37,10,6,0.5)] lg:block"
            animate={{ y: [0, -14, 0], rotate: [-4, 2, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            loading="lazy"
          />
        </div>
        <OrderForm />
      </div>
    </section>
  )
}
