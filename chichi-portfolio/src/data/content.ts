import type { Testimonial } from './types';

/* ---------------------------------------------------------------------------
   Services: rendered as the reference's toolkit cards
   --------------------------------------------------------------------------- */
export type ServiceIcon = 'building' | 'cart' | 'rocket' | 'refresh' | 'blocks' | 'wrench';

export interface Service {
  title: string;
  text: string;
  icon: ServiceIcon;
  /**
   * One or two screenshots (project slug + kind) that pop out of the card.
   * Visitors may read these as examples of that exact service, so pick projects that match
   * (e.g. a real redesign under "Website Redesign").
   */
  shots: { slug: string; kind: 'desktop' | 'mobile' | 'section' }[];
}

export const services: Service[] = [
  {
    title: 'Business Website Development',
    text: 'Fast, responsive websites that present your business clearly and make it easy for customers to reach you.',
    icon: 'building',
    shots: [
      { slug: 'canchuks', kind: 'desktop' },
      { slug: 'four-gates', kind: 'mobile' },
    ],
  },
  {
    title: 'E-commerce Website Development',
    text: 'Online stores with product catalogues, carts and clean checkout flows that work on every screen.',
    icon: 'cart',
    shots: [
      { slug: 'exclusive', kind: 'desktop' },
      { slug: 'oge-jewelry', kind: 'mobile' },
    ],
  },
  {
    title: 'Landing Page Development',
    text: 'Focused, single-purpose pages built to introduce an offer and turn visitors into enquiries.',
    icon: 'rocket',
    shots: [{ slug: 'lmeventz', kind: 'desktop' }],
  },
  {
    title: 'Website Redesign',
    text: 'Modernising dated websites with a cleaner layout, better structure and a mobile-first build.',
    icon: 'refresh',
    shots: [
      { slug: 'onlyonehairboss', kind: 'desktop' },
      { slug: 'onlyonehairboss', kind: 'mobile' },
    ],
  },
  {
    title: 'Custom Web Applications',
    text: 'Interactive web apps with React, TypeScript, REST APIs and Supabase for data and authentication.',
    icon: 'blocks',
    shots: [
      { slug: 'yum-delivery', kind: 'desktop' },
      { slug: 'greenverify', kind: 'mobile' },
    ],
  },
  {
    title: 'Website Maintenance',
    text: 'Ongoing updates, fixes, content changes and deployment so your website keeps running smoothly.',
    icon: 'wrench',
    // Canchuks is the project with confirmed ongoing maintenance.
    shots: [
      { slug: 'canchuks', kind: 'section' },
      { slug: 'canchuks', kind: 'mobile' },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Experience: rendered with the reference's pricing-card treatment
   --------------------------------------------------------------------------- */
export interface Experience {
  role: string;
  company: string;
  period?: string;
  /** Only add bullet points you're comfortable stating publicly. */
  points?: string[];
  link?: string;
  highlight?: boolean;
}

export const experience: Experience[] = [
  {
    role: 'Web Developer',
    company: 'Canchuks Corrosion Nigeria Ltd',
    link: 'https://canchukscorrosionng.com/',
    highlight: true,
  },
  {
    role: 'Frontend Development Intern',
    company: 'Genesys Tech Hub',
    period: 'April 2025 – September 2025',
  },
];

/* ---------------------------------------------------------------------------
   Testimonials: add genuine client words only. The section shows an
   invitation card while this list is empty.
   --------------------------------------------------------------------------- */
export const testimonials: Testimonial[] = [
  // {
  //   quote: 'Exact words from the client, used with their permission.',
  //   highlight: ['a phrase to bold'],
  //   name: 'Client Name',
  //   role: 'Founder',
  //   company: 'Business Name',
  //   avatar: '/clients/client-name.webp',
  //   projectSlug: 'canchuks',
  // },
];

/* ---------------------------------------------------------------------------
   Technology toolkit
   --------------------------------------------------------------------------- */
export interface Tool {
  name: string;
  note: string;
  color: 'yellow' | 'blue' | 'green' | 'red' | 'orange';
}

export const tools: Tool[] = [
  { name: 'React', note: 'Components & UI', color: 'blue' },
  { name: 'TypeScript', note: 'Safer code', color: 'yellow' },
  { name: 'JavaScript', note: 'The foundation', color: 'green' },
  { name: 'HTML5', note: 'Semantic markup', color: 'orange' },
  { name: 'CSS3', note: 'Layouts & motion', color: 'red' },
  { name: 'Tailwind CSS', note: 'Fast styling', color: 'blue' },
  { name: 'Supabase', note: 'Data & auth', color: 'green' },
  { name: 'REST APIs', note: 'Connecting data', color: 'yellow' },
  { name: 'Git & GitHub', note: 'Version control', color: 'orange' },
  { name: 'Vite', note: 'Build tooling', color: 'red' },
  { name: 'Vercel & Netlify', note: 'Deployment', color: 'blue' },
  { name: 'AI-assisted dev', note: 'Faster iteration', color: 'yellow' },
];
