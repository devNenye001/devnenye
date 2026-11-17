/**
 * Personal details used across the site. Edit this file to update identity and contact links.
 * Anything left as an empty string is hidden automatically (no broken links).
 */
export const site = {
  name: 'Chinenye Ndubuisi',
  firstName: 'Chinenye',
  nickname: 'Chichi',
  initials: 'C',
  title: 'Frontend Developer',
  subtitle: 'Software Engineer',
  /** Role shown in the hero's top line. */
  heroRole: 'Web Developer',

  /** Headline numbers. `websitesHosted` covers all client sites, not only those in the portfolio. */
  stats: {
    websitesHosted: 20,
    websitesHostedSuffix: '+',
  },

  /** Optional photo for buttons and the about card, e.g. '/me.webp' placed in /public. */
  avatar: '',

  education: {
    degree: "Bachelor's Degree in Computer Science",
    institution: 'Godfrey Okoye University',
    institutionShort: 'GOU',
    classification: 'First Class Honours',
    cgpa: '4.52',
    scale: '5.00',
  },

  contact: {
    /** TODO: add your email address, e.g. 'hello@yourdomain.com' */
    email: '',
    /** WhatsApp number in international format without '+' or spaces. */
    whatsapp: '2348136061304',
    whatsappMessage: "Hi Chinenye, I'd like to talk about a website project.",
    linkedin: 'https://www.linkedin.com/in/chinenye-ndubuisi-018a87387/',
    github: 'https://github.com/devNenye001',
  },

  /** Shown in the footer next to the pin icon, e.g. 'Currently in Enugu, Nigeria.' Leave empty to hide. */
  location: '',
} as const;

export const whatsappUrl = site.contact.whatsapp
  ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(site.contact.whatsappMessage)}`
  : '';

export const emailUrl = site.contact.email ? `mailto:${site.contact.email}` : '';

/** Primary call to action ("Let's talk"): WhatsApp, then email, then LinkedIn. */
export const primaryContactUrl = whatsappUrl || emailUrl || site.contact.linkedin;

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const;
