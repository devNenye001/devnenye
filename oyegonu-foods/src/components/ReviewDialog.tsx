import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { meals } from '../content/meals'
import { submitForm } from '../lib/forms'
import { useSmoothScroll } from '../hooks/SmoothScroll'
import { Button } from './ui/Button'

const field =
  'w-full rounded-xl border border-stew-900/15 bg-white/70 px-4 py-3 text-sm text-stew-900 outline-none transition-colors placeholder:text-stew-900/40 focus:border-lid'

export function ReviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { stop, start } = useSmoothScroll()
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!open) return
    stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, stop, start])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setStatus('sending')
    try {
      await submitForm('review', data, `Review from ${data.name}: ${data.review}`)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const close = () => {
    onClose()
    setTimeout(() => setStatus('idle'), 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-stew-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-paper p-6 text-stew-900 sm:rounded-[2rem] sm:p-10"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button onClick={close} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-stew-900/5 text-xl hover:bg-stew-900/10" aria-label="Close">
              ×
            </button>

            {status === 'done' ? (
              <div className="py-10 text-center">
                <p className="font-display text-4xl font-semibold">Thank you!</p>
                <p className="mx-auto mt-3 max-w-xs text-stew-900/70">Your review has been received. We read every one.</p>
                <Button className="mt-8" variant="ink" onClick={close} icon={false}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <h3 id="review-title" className="font-display text-3xl font-semibold tracking-tight">
                  How did you serve it?
                </h3>
                <p className="-mt-2 text-sm text-stew-900/65">Tell us about your Real Stew moment.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="name" required placeholder="Your name" className={field} autoComplete="given-name" />
                  <input name="location" placeholder="City (optional)" className={field} autoComplete="address-level2" />
                </div>
                <select name="pairing" className={field} defaultValue="">
                  <option value="" disabled>
                    Served with…
                  </option>
                  {meals.map((m) => (
                    <option key={m.kind}>{m.name}</option>
                  ))}
                  <option>Something else</option>
                </select>
                <textarea name="review" required rows={4} placeholder="Your review" className={`${field} resize-none`} />
                {status === 'error' && <p className="text-sm text-lid">Something went wrong sending that. Please try again.</p>}
                <Button type="submit" className="mt-2 self-start" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Submit review'}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
