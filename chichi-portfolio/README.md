# Chinenye Ndubuisi: Portfolio

React + TypeScript + Vite, animated with GSAP (ScrollTrigger, SplitText, Flip).

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
```

Deploy: import the folder into Vercel (framework preset **Vite**). Set `VITE_SITE_URL` to your final domain in Vercel's environment variables (used for canonical and Open Graph tags).

## Where to edit things

| What | File |
| --- | --- |
| Name, contact links, WhatsApp, email, photo, stats | `src/config/site.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Services, experience, testimonials, tech stack | `src/data/content.ts` |
| Colours, fonts, spacing tokens | `src/styles/global.css` (`:root`) |

### Adding a project

1. `npm i -D puppeteer-core` (once), then `npm run screenshots -- my-slug https://example.com`
2. `node scripts/optimize-images.mjs screenshots-raw` writes WebP files to `public/projects/`
3. Add an entry to `src/data/projects.ts`. Optional case-study fields are hidden when empty.

The draft entries (Always Hotel, Heritage Shelter, Builda Toolz, Emmiphal Global) appear automatically once they have a `url`, `images` and no `draft: true`.

### Adding a testimonial

Add a real quote to `testimonials` in `src/data/content.ts`. Set `projectSlug` to show it beside that featured case study. While the list is empty, the section shows an invitation card instead.

### Fonts

Headings in the reference use Tiempos Text, a commercial Klim typeface. This build uses **Source Serif 4** (open licence) as the closest match. If you buy a Tiempos licence, self-host it and put it first in `--font-serif`.
