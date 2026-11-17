interface Props {
  index: string
  children: string
  className?: string
}

export function SectionLabel({ index, children, className = '' }: Props) {
  return (
    <div className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="font-display text-sm font-medium normal-case italic tracking-normal">{index}</span>
      <span className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </div>
  )
}
