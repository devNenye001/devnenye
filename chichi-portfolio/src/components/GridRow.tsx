import type { CSSProperties, ReactNode } from 'react';

interface GridRowProps {
  children?: ReactNode;
  /** White dotted central cell (hero, nav panel). */
  pattern?: boolean;
  /** Diagonal line pattern behind the whole row (work section). */
  lined?: boolean;
  className?: string;
  centralClassName?: string;
  sideClassName?: string;
  style?: CSSProperties;
}

/** The reference's signature layout: two narrow side cells framing a wide central cell, all with dashed borders. */
export function GridRow({ children, pattern, lined, className = '', centralClassName = '', sideClassName = '', style }: GridRowProps) {
  return (
    <div className={`grid ${lined ? 'grid--lined' : ''} ${className}`} style={style}>
      <div className={`grid__cell grid__cell--side grid__cell--left ${sideClassName}`} aria-hidden="true" />
      <div className={`grid__cell grid__cell--central ${pattern ? 'grid__cell--pattern' : ''} ${centralClassName}`}>{children}</div>
      <div className={`grid__cell grid__cell--side grid__cell--right ${sideClassName}`} aria-hidden="true" />
    </div>
  );
}
