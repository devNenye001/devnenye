/**
 * Business details for Oyegonu Foods.
 *
 * Anything left empty here is information we did not have when the site was built.
 * Fill these in before launch — the UI adapts automatically:
 *  - whatsappNumber: international format, digits only (e.g. "234XXXXXXXXXX").
 *    When set, order requests open a pre-filled WhatsApp chat.
 *  - orderUrl: an external shop/checkout link. When set, it takes priority for ordering.
 *  - formEndpoint: a JSON form backend (Formspree, Basin, your own API…) that receives
 *    order requests and reviews.
 *  - email / instagram: shown in the footer only when provided.
 */
export const brand = {
  name: 'Oyegonu Foods',
  product: 'Real Stew',
  tagline: 'Spicy and Deliciously Spicy',
  shelfLife: '5–6 months',
  storage: 'Store in a cool, dry place',

  whatsappNumber: '',
  orderUrl: '',
  formEndpoint: '',
  email: '',
  instagram: '',
} as const

export const assets = {
  jar: '/brand/jar.webp',
  jarSmall: '/brand/jar-sm.webp',
  jarPhoto: '/brand/jar-photo.jpg',
  logoCream: '/brand/logo-cream.png',
  logoInk: '/brand/logo-ink.png',
  stewTexture: '/brand/stew-texture.jpg',
}

export const navLinks = [
  { id: 'intro', label: 'About' },
  { id: 'product', label: 'The Jar' },
  { id: 'table', label: 'Pairings' },
  { id: 'why', label: 'Why Oyegonu' },
  { id: 'story', label: 'Story' },
  { id: 'reviews', label: 'Reviews' },
] as const
