export type ShotKind = 'desktop' | 'section' | 'section2' | 'mobile';

export interface ProjectImage {
  /** Path without size suffix, e.g. '/projects/canchuks-desktop'. Files are '<src>-<width>.webp' (see scripts/optimize-images.mjs). */
  src: string;
  alt: string;
  kind: ShotKind;
}

export interface CaseStudyStep {
  /** Short header shown big in the slider, e.g. 'The brief'. */
  title: string;
  text: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Live URL. Projects without one are kept as drafts and not rendered. */
  url: string;
  /** Drives the hero counters. */
  type: 'business' | 'ecommerce' | 'webapp';
  /** Industry label (purple capsule), e.g. 'Industrial'. */
  industry: string;
  /** Niche label (grey capsule), e.g. 'Corrosion control'. */
  category: string;
  /** One or two sentences for cards. */
  summary: string;
  /** Only stacks verified from source code or the live build. */
  tech: string[];
  images: ProjectImage[];
  /** Keywords pulled from the client's own site, used as stickers in the case-study visuals. */
  stickers?: string[];
  /** Featured projects get the full "tiny case study" slider treatment. */
  featured?: boolean;
  /** Shown in the hero fan of screenshots. */
  inHeroFan?: boolean;
  draft?: boolean;

  /* --- Optional case-study fields. Leave out anything you can't verify; empty fields are hidden. --- */
  overview?: string;
  background?: string;
  requirement?: string;
  role?: string;
  built?: string[];
  features?: string[];
  steps?: [CaseStudyStep, CaseStudyStep, CaseStudyStep];
}

export interface Testimonial {
  quote: string;
  /** Words in the quote to set in bold, matching the reference's emphasis style. */
  highlight?: string[];
  name: string;
  role: string;
  company: string;
  avatar?: string;
  projectSlug?: string;
}
