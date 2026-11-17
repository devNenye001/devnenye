// Converts raw PNG screenshots into responsive WebP files for /public/projects.
//
//   node scripts/optimize-images.mjs <rawDir>
//
// Expects files named <slug>-<kind>.png where kind is desktop | section | section2 | mobile.
// Outputs <slug>-<kind>-<width>.webp. Desktop shots are cropped to 16:10, mobile to 9:19.5.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const rawDir = resolve(process.argv[2] ?? 'screenshots-raw');
const outDir = resolve('public/projects');
mkdirSync(outDir, { recursive: true });

const sizes = {
  desktop: { widths: [600, 1200], ratio: 10 / 16 },
  section: { widths: [600, 1200], ratio: 10 / 16 },
  section2: { widths: [600, 1200], ratio: 10 / 16 },
  mobile: { widths: [300, 600], ratio: 844 / 390 },
};

const files = readdirSync(rawDir).filter((f) => f.endsWith('.png'));
for (const file of files) {
  const match = file.match(/^(.+)-(desktop|section2|section|mobile)\.png$/);
  if (!match) continue;
  const [, slug, kind] = match;
  const { widths, ratio } = sizes[kind];
  const meta = await sharp(join(rawDir, file)).metadata();
  const cropH = Math.min(meta.height, Math.round(meta.width * ratio));
  for (const w of widths) {
    await sharp(join(rawDir, file))
      .extract({ left: 0, top: 0, width: meta.width, height: cropH })
      .resize({ width: w })
      .webp({ quality: 78, effort: 5 })
      .toFile(join(outDir, `${slug}-${kind}-${w}.webp`));
  }
  console.log('✓', slug, kind);
}
