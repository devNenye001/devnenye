import type { CSSProperties, ReactNode } from 'react';

const cursorColors = {
  purple: '#8a61fa',
  green: '#35ccad',
  orange: '#ee9318',
} as const;

/** Collaborator cursor with a name tag, as scattered across the reference's case-study boards. */
export function Cursor({ name, color = 'purple', style, flip = false, className = '' }: { name: string; color?: keyof typeof cursorColors; style?: CSSProperties; flip?: boolean; className?: string }) {
  const c = cursorColors[color];
  return (
    <div className={`cursor ${className}`} style={{ ...style, flexDirection: flip ? 'row-reverse' : 'row' }} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill={c} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="cursor__name" style={{ background: c }}>
        {name}
      </span>
    </div>
  );
}

/** Green "↗ value" chip. */
export function Chip({ children, down = false, stroked = false, className = '', style }: { children: ReactNode; down?: boolean; stroked?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`chip ${stroked ? 'chip--stroked' : ''} ${className}`} style={style}>
      <span className="chip__arrow" style={down ? { transform: 'rotate(135deg)' } : undefined} aria-hidden="true">
        ↑
      </span>
      {children}
    </span>
  );
}

/** Highlight word box, e.g. "to [↗work] your". The arrow and letters are animated by the parent. */
export function BoxedWord({ word, arrow = true, className = '' }: { word: string; arrow?: boolean; className?: string }) {
  return (
    <span className={`boxed-word ${className}`}>
      {arrow && (
        <span className="boxed-word__arrow" aria-hidden="true">
          ↑
        </span>
      )}
      <span className="boxed-word__text">{word}</span>
    </span>
  );
}
