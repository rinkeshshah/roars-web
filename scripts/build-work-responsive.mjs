#!/usr/bin/env node
/**
 * Responsive AVIF and WebP for the case-study covers.
 *
 *   node scripts/build-work-responsive.mjs        (runs from `npm run build`)
 *
 * WHY THIS AND NOT ASTRO'S <Image>. The pipeline wants an imported asset under
 * src/assets/. These nineteen live in public/work/ and are referenced as plain
 * strings from four different places — the /work/ card, the case-study header,
 * the industry proof band and the city pages — and, more to the point, by
 * `heroImage` in twenty-three content files, where the value is validated
 * against the registry by scripts/validate-content.mjs. Moving them would mean
 * changing the shape of content frontmatter to fix a byte-size problem. So the
 * derivatives are generated beside the originals instead, and the markup picks
 * between them.
 *
 * WHAT IT COSTS TODAY. /work/ ships 3.39 MB, of which 3.32 MB is eleven JPEGs
 * at up to 487 KB each, and every one of them is a 2400px file painted into a
 * card a fraction of that wide. Nothing about that is visible in the page: it
 * renders correctly, it just costs a phone several seconds.
 *
 * FOUR WIDTHS, because the card is ~600px on a laptop and the same image is
 * the full-bleed header on the case-study page. 640 covers a phone at 2x,
 * 2400 keeps the original's detail for the header, and the browser picks.
 *
 * AVIF FIRST, WebP SECOND, JPEG LAST — the JPEG is the original, untouched, so
 * a browser that understands neither still gets exactly what it gets today.
 * Idempotent: a derivative newer than its source is left alone, so this costs
 * nothing on a rebuild.
 */
import { readdirSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'public/work')
const OUT = join(SRC, 'r')

export const WIDTHS = [640, 1024, 1600, 2400]

if (!existsSync(SRC)) {
  console.log('--- build-work-responsive ---')
  console.log('no public/work/. Nothing to do.')
  process.exit(0)
}
mkdirSync(OUT, { recursive: true })

const covers = readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f))
let made = 0, skipped = 0, bytesIn = 0, bytesOut = 0

for (const file of covers) {
  const src = join(SRC, file)
  const slug = basename(file).replace(/\.jpe?g$/i, '')
  const srcStat = statSync(src)
  bytesIn += srcStat.size

  const meta = await sharp(src).metadata()
  for (const w of WIDTHS) {
    /* Never upscale: a 640px source asked for at 2400 is just a bigger file
       with the same information in it. */
    if (meta.width && w > meta.width) continue
    for (const [ext, encode] of [
      ['avif', (p) => p.avif({ quality: 50, effort: 4 })],
      ['webp', (p) => p.webp({ quality: 74 })],
    ]) {
      const out = join(OUT, `${slug}-${w}.${ext}`)
      if (existsSync(out) && statSync(out).mtimeMs >= srcStat.mtimeMs) {
        bytesOut += statSync(out).size
        skipped++
        continue
      }
      await encode(sharp(src).resize(w, null, { withoutEnlargement: true })).toFile(out)
      bytesOut += statSync(out).size
      made++
    }
  }
}

const kb = (n) => (n / 1024).toFixed(0)
console.log('--- build-work-responsive ---')
console.log(`covers          : ${covers.length}`)
console.log(`derivatives     : ${made} written, ${skipped} already current`)
console.log(`source jpeg     : ${kb(bytesIn)} KB total`)
console.log(`derivatives     : ${kb(bytesOut)} KB total (all widths, both formats)`)
