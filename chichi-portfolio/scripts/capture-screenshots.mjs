// Captures real screenshots of a live project for the portfolio.
//
//   npm i -D puppeteer-core            (once)
//   npm run screenshots -- <slug> <url>
//   node scripts/optimize-images.mjs screenshots-raw
//
// Uses your installed Google Chrome. Saves <slug>-desktop|section|section2|mobile.png
// into ./screenshots-raw (git-ignored).
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error('Usage: npm run screenshots -- <slug> <url>');
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = 'screenshots-raw';
mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// wait until visible images and videos have actually loaded (hero backgrounds etc.)
const settle = (page) =>
  page.evaluate(
    () =>
      new Promise((res) => {
        const t0 = Date.now();
        const check = () => {
          const imgs = [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight * 1.5);
          const ok = imgs.every((i) => i.complete) && [...document.querySelectorAll('video')].every((v) => v.readyState >= 2);
          if (ok || Date.now() - t0 > 25000) res();
          else setTimeout(check, 400);
        };
        check();
      }),
  );

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
const shots = [
  { kind: 'desktop', viewport: { width: 1440, height: 900 }, scrollTo: 0 },
  { kind: 'section', viewport: { width: 1440, height: 900 }, scrollTo: 1000 },
  { kind: 'section2', viewport: { width: 1440, height: 900 }, scrollTo: 0.45 },
  { kind: 'mobile', viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, scrollTo: 0 },
];

for (const s of shots) {
  // a fresh page per shot: switching to a mobile viewport reloads the page
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  await page.setViewport(s.viewport);
  await page.goto(url, { waitUntil: 'networkidle2' }).catch(() => {});
  if (s.scrollTo) {
    const target = s.scrollTo < 1 ? await page.evaluate((f) => document.body.scrollHeight * f, s.scrollTo) : s.scrollTo;
    for (let y = 0; y <= target; y += 250) {
      await page.evaluate((v) => scrollTo(0, v), y);
      await sleep(250);
    }
  }
  await settle(page);
  await sleep(5000);
  await page.screenshot({ path: `${out}/${slug}-${s.kind}.png` });
  console.log('✓', slug, s.kind);
  await page.close();
}
await browser.close();
