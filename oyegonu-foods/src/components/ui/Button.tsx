import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Variant = 'lid' | 'cream' | 'ghost' | 'ink'

const styles: Record<Variant, string> = {
  lid: 'bg-lid text-cream hover:bg-lid-soft',
  cream: 'bg-cream text-stew-900 hover:bg-white',
  ink: 'bg-ink text-cream hover:bg-stew-800',
  ghost: 'ring-1 ring-inset ring-current hover:bg-white/10',
}

interface Props {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: Variant
  type?: 'button' | 'submit'
  className?: string
  icon?: boolean
  disabled?: boolean
}

/** Magnetic pill button: drifts gently toward the cursor. */
export function Button({ children, onClick, href, variant = 'lid', type = 'button', className = '', icon = true, disabled }: Props) {
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const cls = `group relative inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-colors duration-300 disabled:opacity-60 ${styles[variant]} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-current opacity-15" />
          <svg viewBox="0 0 16 16" className="relative h-3 w-3 transition-transform duration-500 ease-expo group-hover:-rotate-45" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 8h12M9 3l5 5-5 5" />
          </svg>
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault()
            onClick()
          }
        }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ x: sx, y: sy }}
        className={cls}
      >
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cls}
    >
      {inner}
    </motion.button>
  )
}
