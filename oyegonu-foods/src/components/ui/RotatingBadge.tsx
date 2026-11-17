import { useId, type ReactNode } from 'react'

interface Props {
  text: string
  className?: string
  children?: ReactNode
}

/** Circular text that slowly spins around a centre mark. */
export function RotatingBadge({ text, className = '', children }: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`relative grid aspect-square place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-sans text-[14.5px] font-bold uppercase tracking-[0.3em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
