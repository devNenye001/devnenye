import type { CSSProperties } from 'react';
import type { ProjectImage } from '../data/types';

interface ShotProps {
  image: ProjectImage;
  /** CSS sizes hint for the browser's srcset choice. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}

/** Responsive WebP screenshot. Desktop shots ship at 600/1200w, mobile at 300/600w. */
export function Shot({ image, sizes, className = '', style, eager = false }: ShotProps) {
  const mobile = image.kind === 'mobile';
  const [sm, lg] = mobile ? [300, 600] : [600, 1200];
  return (
    <img
      className={className}
      style={style}
      src={`${image.src}-${lg}.webp`}
      srcSet={`${image.src}-${sm}.webp ${sm}w, ${image.src}-${lg}.webp ${lg}w`}
      sizes={sizes ?? (mobile ? '160px' : '(max-width: 767px) 90vw, 40vw')}
      width={mobile ? 300 : 600}
      height={mobile ? 649 : 375}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
