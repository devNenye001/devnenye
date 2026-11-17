import type { Project, ProjectImage, ShotKind } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECTS: the single source of truth for every project on the site.
 *
 *  Add a project:
 *    1. Screenshot it:   npm run screenshots -- <slug> <url>   (see README)
 *    2. Optimise images: node scripts/optimize-images.mjs screenshots-raw
 *    3. Add an entry below. Only `slug, name, url, type, industry, category,
 *       summary, tech, images` are required; everything else is optional and
 *       hidden when empty.
 *
 *  Descriptions here are based on each live site's own content (captured
 *  Nov 2026). Tech tags list only what was verified from source code or the
 *  live build. Edit `role`, `requirement` and `built` with your own details.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const shot = (slug: string, kind: ShotKind, name: string): ProjectImage => ({
  src: `/projects/${slug}-${kind}`,
  kind,
  alt: `${name} website, ${kind === 'mobile' ? 'mobile view' : kind === 'desktop' ? 'homepage on desktop' : 'section on desktop'}`,
});

const shots = (slug: string, name: string, kinds: ShotKind[]) => kinds.map((k) => shot(slug, k, name));

export const projects: Project[] = [
  {
    slug: 'canchuks',
    name: 'Canchuks Corrosion Nigeria Ltd.',
    url: 'https://canchukscorrosionng.com/',
    type: 'business',
    industry: 'Oil & Gas',
    category: 'Corrosion engineering',
    summary:
      'Corporate website for a corrosion and materials engineering company serving Nigeria’s oil and gas industry, covering pipeline integrity, CMIT inspection and cathodic protection.',
    tech: ['React', 'JavaScript', 'Vite', 'Framer Motion'],
    images: shots('canchuks', 'Canchuks Corrosion', ['desktop', 'section', 'mobile', 'section2']),
    stickers: ['Pipeline integrity', 'CMIT inspection', 'Cathodic protection', 'Oil & gas'],
    featured: true,
    overview:
      'The official website of Canchuks Corrosion Nigeria Limited, a subsidiary of Canchuks Corrosion Inc., Canada, presenting its corrosion engineering and pipeline integrity services.',
    background:
      'Canchuks provides specialised corrosion and materials engineering solutions for the oil and gas industry, including pipeline integrity assessments, Contactless Magnetic Inspection Technology (CMIT), ECDA, ICDA, SCCDA and cathodic protection.',
    role: 'Web Developer: development, deployment and maintenance.',
    built: [
      'Multi-page site: Home, About Us, Services, Partners, Knowledge and Contact',
      'Dedicated content for Contactless Magnetic Inspection Technology (CMIT)',
      'Responsive layouts with animated sections',
    ],
    features: ['Service overviews', 'Knowledge section', 'Partners page', 'Contact calls to action'],
    steps: [
      { title: 'The brief', text: 'Present a technical engineering company clearly: who they are, what they inspect and protect, and how to reach them.' },
      { title: 'The build', text: 'A responsive React site with pages for services, partners and knowledge, plus a dedicated section on CMIT technology.' },
      { title: 'Live', text: 'Deployed on the company’s own domain and maintained as their web developer.' },
    ],
  },
  {
    slug: 'onlyonehairboss',
    name: 'OnlyOneHairBoss',
    url: 'https://onlyonehairboss.com/',
    type: 'ecommerce',
    industry: 'Beauty',
    category: 'Luxury wigs',
    summary: 'Online store for a luxury wig brand, with a product collection, add-to-cart, customer reviews and a community feed.',
    tech: ['React'],
    images: shots('onlyonehairboss', 'OnlyOneHairBoss', ['desktop', 'section2', 'mobile']),
    stickers: ['Luxury wigs', 'Soft glam', 'New Ins', 'Shop now'],
    featured: true,
    overview: 'An e-commerce website for OnlyOneHairBoss, a brand selling premium-quality wigs for women who love elegance and bold styles.',
    background: 'The brand offers luxury wigs, from sleek straight looks to bold curls, with a focus on quality, comfort and confidence.',
    built: [
      'Shop pages with product prices and sale pricing',
      'Add-to-cart flow',
      'Customer reviews and an Instagram-style community section',
      'About and contact pages',
    ],
    features: ['Product collection', 'Shopping cart', 'Customer reviews', 'Order processing notice banner'],
    steps: [
      { title: 'The brief', text: 'Give a luxury wig brand an online store that feels as premium as its products.' },
      { title: 'The build', text: 'A product collection with sale pricing and add-to-cart, plus reviews, a community feed and contact pages.' },
      { title: 'Live', text: 'Live on onlyonehairboss.com, with shop, about and contact pages ready for customers.' },
    ],
  },
  {
    slug: 'greenverify',
    name: 'Greenverify',
    url: 'https://greenverify.com.ng/',
    type: 'webapp',
    industry: 'Compliance',
    category: 'Identity & CAC services',
    summary:
      'Platform for NIN verification, NIN slips, Tax ID and CAC business registration in Nigeria, with service listings and user login.',
    tech: ['React'],
    images: shots('greenverify', 'Greenverify', ['desktop', 'section', 'mobile', 'section2']),
    inHeroFan: true,
    overview:
      'Greenverify is a Nigerian compliance and verification service provider offering identity validation, corporate registration assistance and regulatory support.',
    built: [
      'Service catalogue: identity & verification, CAC registration, post-incorporation, EFCC SCUML, trademarks',
      'Login and “Get Started” onboarding entry points',
      'Responsive marketing pages',
    ],
  },
  {
    slug: 'oge-jewelry',
    name: 'Oge Jewelry',
    // NOTE: the URL originally supplied (ogejewerly.com) does not resolve; ogejewelry.com is the live store.
    url: 'https://ogejewelry.com/',
    type: 'ecommerce',
    industry: 'Fashion',
    category: 'Fine jewelry',
    summary: 'Online store for a luxury jewelry brand: handcrafted rings, earrings and necklaces, organised into signature collections.',
    tech: ['Shopify'],
    images: shots('oge-jewelry', 'Oge Jewelry', ['desktop', 'section', 'mobile', 'section2']),
    inHeroFan: true,
  },
  {
    slug: 'lmeventz',
    name: 'LMEVENTZ+',
    url: 'https://lmeventzplus.com/',
    type: 'business',
    industry: 'Events',
    category: 'Event planning',
    summary:
      'Website for an events company covering planning and coordination, space transformation, booth fabrication and venue management.',
    tech: ['React', 'JavaScript', 'Vite'],
    images: shots('lmeventz', 'LMEVENTZ+', ['desktop', 'section', 'mobile', 'section2']),
    built: ['Services overview', 'Featured projects portfolio', 'Four-step process section', 'Consultation booking call to action'],
  },
  {
    slug: 'four-gates',
    name: 'Four Gates Links Construction',
    url: 'https://four-links-gate-construction.vercel.app/',
    type: 'business',
    industry: 'Construction',
    category: 'Real estate & building',
    summary:
      'Website for a construction and civil engineering firm in Minna, Niger State, covering construction, electrical works, project management and housing on credit.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    images: shots('four-gates', 'Four Gates Links Construction', ['desktop', 'section', 'mobile', 'section2']),
    built: ['Services and projects pages', '“Build now, pay small small” housing-on-credit section', 'Animated service ticker', 'Contact pages'],
  },
  {
    slug: 'exclusive',
    name: 'Exclusive Shop',
    url: 'https://exclusiveng.netlify.app/',
    type: 'ecommerce',
    industry: 'Retail',
    category: 'Multi-category store',
    summary: 'E-commerce storefront with category browsing, flash sales, product listings with discounts, wishlist, cart and sign-up.',
    tech: ['React'],
    images: shots('exclusive', 'Exclusive Shop', ['desktop', 'section2', 'mobile', 'section']),
  },
  {
    slug: 'yum-delivery',
    name: 'Yum Delivery',
    url: 'https://yum-delivery.netlify.app/',
    type: 'business',
    industry: 'Food & Drinks',
    category: 'Food delivery',
    summary: 'Website for a food delivery and catering business, with a menu, customer favourites, gallery and order calls to action.',
    tech: ['React'],
    images: shots('yum-delivery', 'Yum Delivery', ['desktop', 'section', 'mobile', 'section2']),
    inHeroFan: true,
  },
  {
    slug: '7g-richy',
    name: '7G Upgraded Richy Communication',
    url: 'https://7g-upgraded-richy-communication.vercel.app/',
    type: 'ecommerce',
    industry: 'Electronics',
    category: 'Phones & repairs',
    summary: 'Shop for phones, gadgets and accessories with product listings, plus a phone-repair booking flow.',
    tech: ['React'],
    images: shots('7g-richy', '7G Upgraded Richy Communication', ['desktop', 'section', 'mobile', 'section2']),
    inHeroFan: true,
  },
  {
    slug: 'akpaka',
    name: 'Akpaka Shoe Enterprise',
    url: 'https://akpaka-shoe-enterprise.netlify.app/',
    type: 'ecommerce',
    industry: 'Fashion',
    category: 'Handcrafted footwear',
    summary: 'Brand and shop website for a handcrafted luxury footwear maker, featuring signature pieces and a simple ordering process.',
    tech: ['React'],
    images: shots('akpaka', 'Akpaka Shoe Enterprise', ['desktop', 'section', 'mobile', 'section2']),
    inHeroFan: true,
  },

  /* ── Drafts: add a live URL + screenshots and remove `draft` to publish ── */
  { slug: 'always-hotel', name: 'Always Hotel', url: '', type: 'business', industry: '', category: '', summary: '', tech: [], images: [], draft: true },
  { slug: 'heritage-shelter', name: 'Heritage Shelter', url: '', type: 'business', industry: '', category: '', summary: '', tech: ['React', 'TypeScript', 'Framer Motion'], images: [], draft: true },
  { slug: 'builda-toolz', name: 'Builda Toolz', url: '', type: 'business', industry: '', category: '', summary: '', tech: [], images: [], draft: true },
  { slug: 'emmiphal-global', name: 'Emmiphal Global', url: '', type: 'business', industry: '', category: '', summary: '', tech: [], images: [], draft: true },
];

export const publishedProjects = projects.filter((p) => !p.draft && p.url && p.images.length > 0);
export const featuredProjects = publishedProjects.filter((p) => p.featured);
export const otherProjects = publishedProjects.filter((p) => !p.featured);
export const heroFanProjects = publishedProjects.filter((p) => p.inHeroFan).slice(0, 5);

export const projectCounts = {
  business: publishedProjects.filter((p) => p.type === 'business').length,
  ecommerce: publishedProjects.filter((p) => p.type === 'ecommerce').length,
  webapp: publishedProjects.filter((p) => p.type === 'webapp').length,
};

export const imageFor = (p: Project, kind: ShotKind) => p.images.find((i) => i.kind === kind) ?? p.images[0];
