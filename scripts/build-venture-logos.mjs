#!/usr/bin/env node
/**
 * Normalise the five venture logos into one set.
 *
 *   node scripts/build-venture-logos.mjs <dir-with-the-unzipped-logos>
 *
 * These arrive as five files in four formats at five sizes, from 146x50 to
 * 4800x1600, two with transparency and three on solid white. Dropped into a
 * row as supplied they would read as five logos at random weights, which is
 * the thing that makes a venture wall look like a clip-art folder.
 *
 * WHAT THE PROCESSING DOES, and why each step is needed.
 *
 *   FLOOD FILL, NOT A WHITE KEY. The three on white need that white gone, but
 *   removing every near-white pixel in the image would punch holes in the
 *   logos themselves: UXAuditPro's "UX" is white type inside an orange badge,
 *   and MicroKopy's "mk" is white inside a green disc. So the fill starts at
 *   the four borders and spreads only through connected near-white — the paper
 *   is reachable from the edge, the letters inside a badge are not.
 *
 *   COLOUR IS KEPT. The page greys them with a CSS filter and drops the filter
 *   on hover, which is what was asked for. Shipping them pre-greyed would make
 *   that impossible, and shipping two copies of each would be two things to
 *   keep in step.
 *
 *   TRIM. Each is cropped to its own ink, so the box a logo sits in is the
 *   logo, not whatever padding its author left around it.
 *
 *   HEIGHT, NOT AREA. These are all wordmarks — a lockup that is wide and
 *   short next to one that is nearly square should share a CAP HEIGHT, not a
 *   bounding box. Each is fitted to a common height and allowed its own width,
 *   with a cap so an unusually long wordmark cannot run away with the row.
 *
 * Output is public/ventures/<slug>.png, served from this repo so it resolves
 * in every build, unlike /wp-content/uploads/ which only exists on the
 * webspace.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/ventures')
const SRC = process.argv[2]
if (!SRC) {
  console.error('usage: node scripts/build-venture-logos.mjs <dir>')
  process.exit(1)
}

/** Source filename stem to the slug we ship. */
const NAMED = {
  produit: 'produit',
  hostwala: 'hostwala',
  'logo-uxauditpro': 'uxauditpro',
  microkopy: 'microkopy',
  'get-automation': 'getautomation',
}

/**
 * The common height, and the width no wordmark may exceed.
 *
 * 60 IS SET BY THE SMALLEST SOURCE, NOT BY THE DESIGN. Produit and Hostwala
 * arrive at 146x50; fitting the set to a 132px height would upscale those two
 * by 2.6 and they would ship visibly soft next to MicroKopy, which arrives at
 * 4800x1600. 60 is twice the ~30px the row displays at, so every mark is
 * crisp on a 2x screen and only those two are resampled at all, by 1.2.
 * If better Produit and Hostwala files turn up, raise this and re-run.
 */
const H = 60
const MAXW = 280
const PAPER = 232 // at or above this, on all three channels, counts as paper

/**
 * Clear the background by flooding inward from the four edges.
 * Returns RGBA raw data with the paper made transparent.
 */
function clearPaper(data, w, h, channels) {
  const rgba = Buffer.alloc(w * h * 4)
  for (let i = 0, j = 0; i < w * h; i++, j += channels) {
    rgba[i * 4] = data[j]
    rgba[i * 4 + 1] = data[j + 1]
    rgba[i * 4 + 2] = data[j + 2]
    rgba[i * 4 + 3] = channels === 4 ? data[j + 3] : 255
  }

  const isPaper = (i) =>
    rgba[i * 4 + 3] > 20 &&
    rgba[i * 4] >= PAPER && rgba[i * 4 + 1] >= PAPER && rgba[i * 4 + 2] >= PAPER

  /* An explicit stack, not recursion: a 4800x1600 image would blow the call
     stack long before it finished a corner. */
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) { stack.push(x, (h - 1) * w + x) }
  for (let y = 0; y < h; y++) { stack.push(y * w, y * w + w - 1) }

  while (stack.length) {
    const i = stack.pop()
    if (seen[i]) continue
    seen[i] = 1
    if (!isPaper(i)) continue
    rgba[i * 4 + 3] = 0
    const x = i % w, y = (i / w) | 0
    if (x > 0) stack.push(i - 1)
    if (x < w - 1) stack.push(i + 1)
    if (y > 0) stack.push(i - w)
    if (y < h - 1) stack.push(i + w)
  }
  return rgba
}

/** Bounding box of everything still opaque. */
function inkBox(rgba, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rgba[(y * w + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  return { x0, y0, x1, y1 }
}

mkdirSync(OUT, { recursive: true })
const files = readdirSync(SRC).filter((f) => !f.startsWith('.') && !f.startsWith('__'))
const manifest = []

for (const [stem, slug] of Object.entries(NAMED)) {
  const file = files.find((f) => f.toLowerCase().replace(/\s+/g, '-').startsWith(stem))
  if (!file) {
    console.error(`FAIL: no source for ${stem}`)
    process.exit(1)
  }

  const { data, info } = await sharp(join(SRC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = clearPaper(data, info.width, info.height, info.channels)
  const { x0, y0, x1, y1 } = inkBox(rgba, info.width, info.height)
  if (x1 < 0) {
    console.error(`FAIL: ${file} came out empty`)
    process.exit(1)
  }
  const cw = x1 - x0 + 1
  const ch = y1 - y0 + 1

  const cropped = Buffer.alloc(cw * ch * 4)
  for (let y = 0; y < ch; y++) {
    rgba.copy(cropped, y * cw * 4, ((y + y0) * info.width + x0) * 4, ((y + y0) * info.width + x0 + cw) * 4)
  }

  /* Fit the height, then pull the width back if the wordmark is very long. */
  let outH = H
  let outW = Math.round((cw / ch) * H)
  if (outW > MAXW) {
    outW = MAXW
    outH = Math.round((ch / cw) * MAXW)
  }

  const png = await sharp(cropped, { raw: { width: cw, height: ch, channels: 4 } })
    .resize({ width: outW, height: outH, fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer()

  writeFileSync(join(OUT, `${slug}.png`), png)
  manifest.push({ slug, from: file, w: outW, h: outH, bytes: png.length })
}

console.log(`\nwrote ${manifest.length} logo(s) to public/ventures/\n`)
for (const m of manifest) {
  console.log(
    `  ${m.slug.padEnd(16)} ${String(m.w).padStart(4)}x${String(m.h).padEnd(4)} ` +
    `${String(Math.round(m.bytes / 1024)).padStart(3)}KB   ${m.from}`,
  )
}
console.log(`\ntotal ${Math.round(manifest.reduce((n, m) => n + m.bytes, 0) / 1024)}KB`)
