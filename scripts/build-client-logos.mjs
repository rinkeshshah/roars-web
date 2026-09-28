#!/usr/bin/env node
/**
 * Turn the supplied client marks into one consistent set.
 *
 *   node scripts/build-client-logos.mjs <dir-with-the-unzipped-logos>
 *
 * Input is thirteen 326x112 JPEGs, light grey on near-white, plus the 1000x1000
 * composite. GISAID and Zee Cinema were never sent on their own, so they are
 * SLICED OUT OF THE COMPOSITE: its grid is found by measuring ink rather than
 * by hard-coded offsets, so a re-export at a different size still cuts in the
 * right place.
 *
 * WHAT THE PROCESSING DOES, and why each step is needed.
 *
 *   TRIM. Every file is the same 326x112 canvas, so each mark carries a
 *   different amount of white padding. Laid out in a grid that reads as
 *   logos at random sizes, which is the thing that makes a client wall look
 *   amateur. Each is cropped to its own ink first.
 *
 *   BLACK PLUS ALPHA. The sources are grey ON WHITE with no transparency, so
 *   on any ground that is not pure white they would sit in a pale rectangle.
 *   Luminance is inverted into the alpha channel instead: the ink becomes
 *   black at full opacity and the paper becomes transparent. The page then
 *   controls the weight with CSS opacity, on any background.
 *
 *   NORMALISE. The sources are not equally dark. Airlift is very light and
 *   DDB is much heavier, so at one CSS opacity Airlift would disappear while
 *   DDB shouted. Each mark's darkest pixel is scaled to full alpha, which
 *   levels them without touching their shapes.
 *
 *   OPTICAL HEIGHT, not bounding-box height. A wide wordmark like ZAPAK and a
 *   tall stacked lockup like DDB should not both be set to the same box
 *   height: the stacked one then reads as tiny. Each is fitted inside a
 *   common box on its longest axis, which is what the eye actually judges.
 *
 * Output is public/clients/<slug>.png, served from this repo so it resolves in
 * every build, unlike /wp-content/uploads/ which only exists on the webspace.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/clients')
const SRC = process.argv[2]
if (!SRC) {
  console.error('usage: node scripts/build-client-logos.mjs <dir>')
  process.exit(1)
}

/** Source file (without extension) to the slug and display name we ship. */
const NAMED = {
  samsung: ['samsung', 'Samsung'],
  tata: ['tata', 'TATA'],
  facedrive: ['facedrive', 'Facedrive'],
  forbes: ['forbes', 'Forbes'],
  airlift: ['airlift', 'Airlift'],
  tanishq: ['tanishq', 'Tanishq'],
  reliance: ['reliance', 'Reliance'],
  ddbmudra: ['ddb-mudra', 'DDB Mudra Group'],
  jwt: ['jwt', 'JWT'],
  rmg: ['rmg-connect', 'RMG Connect'],
  bollywoodhungama: ['bollywood-hungama', 'Bollywood Hungama'],
  woodland: ['woodland', 'Woodland'],
  zapak: ['zapak', 'Zapak'],
}

/**
 * The two that only exist inside the composite, by grid position.
 *
 * ZERO-INDEXED AGAINST THE LOGO ROWS, which is after the title row has
 * already been dropped by the slice below. Counting from the top of the image
 * instead put GISAID one row low: it came out as Zee Cinema, and Zee Cinema
 * came out as Reliance, so the wall shipped Reliance twice and no GISAID.
 *
 *   row 0  Samsung    TATA     GISAID
 *   row 1  facedrive  Forbes   Zee Cinema
 *   row 2  Airlift    Tanishq  Reliance
 */
const FROM_SHEET = [
  { row: 0, col: 2, slug: 'gisaid', name: 'GISAID' },
  { row: 1, col: 2, slug: 'zee-cinema', name: 'Zee Cinema' },
]

const COMPOSITE = 'roars-client-logo.jpg'
const INK = 238 // below this is ink, above it is paper
const BOX = 320 // the long edge every mark is fitted to

/** Contiguous runs where the profile is above `min`, ignoring specks. */
function bands(profile, min, minRun = 12) {
  const out = []
  let start = -1
  for (let i = 0; i < profile.length; i++) {
    const on = profile[i] > min
    if (on && start < 0) start = i
    if (!on && start >= 0) {
      if (i - start >= minRun) out.push([start, i])
      start = -1
    }
  }
  if (start >= 0) out.push([start, profile.length])
  return out
}

/**
 * Grey-on-white to black-with-alpha, trimmed and level.
 * Returns a PNG buffer.
 */
async function normalise(input) {
  const { data, info } = await sharp(input).greyscale().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info

  // Ink strength per pixel, and the darkest value present.
  const ink = new Uint8Array(w * h)
  let peak = 0
  for (let i = 0; i < w * h; i++) {
    const v = 255 - data[i]
    ink[i] = v
    if (v > peak) peak = v
  }
  if (peak < 8) throw new Error('image is blank')

  // Bounding box of anything meaningfully darker than the paper.
  const thr = Math.max(6, peak * 0.12)
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (ink[y * w + x] > thr) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  const cw = x1 - x0 + 1
  const ch = y1 - y0 + 1

  // Black, with the (levelled) ink as alpha. Paper becomes transparent.
  const rgba = Buffer.alloc(cw * ch * 4)
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const a = Math.min(255, Math.round((ink[(y + y0) * w + (x + x0)] / peak) * 255))
      const o = (y * cw + x) * 4
      rgba[o] = 0; rgba[o + 1] = 0; rgba[o + 2] = 0; rgba[o + 3] = a
    }
  }

  // Fit the LONGEST axis to the box, so a stacked lockup is not shrunk to
  // nothing next to a wide wordmark.
  const scale = BOX / Math.max(cw, ch)
  return sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
    .resize({
      width: Math.max(1, Math.round(cw * scale)),
      height: Math.max(1, Math.round(ch * scale)),
      fit: 'fill',
    })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer()
}

mkdirSync(OUT, { recursive: true })
const files = readdirSync(SRC)
const manifest = []

/* ── the thirteen supplied on their own ─────────────────────────────── */
for (const [stem, [slug, name]] of Object.entries(NAMED)) {
  const file = files.find((f) => f.toLowerCase().startsWith(stem + '.'))
  if (!file) {
    console.error(`FAIL: no source for ${stem}`)
    process.exit(1)
  }
  const png = await normalise(join(SRC, file))
  writeFileSync(join(OUT, `${slug}.png`), png)
  const m = await sharp(png).metadata()
  manifest.push({ slug, name, w: m.width, h: m.height, bytes: png.length })
}

/* ── the two cut out of the composite ───────────────────────────────── */
const sheetPath = join(SRC, COMPOSITE)
const { data: sd, info: si } = await sharp(sheetPath).greyscale().raw().toBuffer({ resolveWithObject: true })
const SW = si.width, SH = si.height
const rowInk = [], colInk = []
for (let y = 0; y < SH; y++) { let n = 0; for (let x = 0; x < SW; x++) if (sd[y * SW + x] < INK) n++; rowInk.push(n) }
for (let x = 0; x < SW; x++) { let n = 0; for (let y = 0; y < SH; y++) if (sd[y * SW + x] < INK) n++; colInk.push(n) }

/* The first and last row bands are the "Trusted by" title and the footer
   line, not logos. Dropped by position rather than by measuring text. */
const rows = bands(rowInk, 2).slice(1, -1)
/* Columns can split where a mark has an internal gap, so narrow runs are
   merged back into the one before them.
   THE THRESHOLD HAS TO BE SMALL. The gutters between columns are only about
   ten pixels, while the split inside the GISAID lockup is two, so a generous
   merge distance eats the real column boundaries and reads the whole sheet
   as one column. Measured: gutters 10 and 11, internal gap 2. */
const rawCols = bands(colInk, 2)
const cols = []
for (const c of rawCols) {
  const prev = cols[cols.length - 1]
  if (prev && c[0] - prev[1] <= 5) prev[1] = c[1]
  else cols.push([...c])
}
console.log(`composite grid: ${rows.length} rows x ${cols.length} columns`)
if (rows.length < 5 || cols.length < 3) {
  console.error('FAIL: the composite did not read as a 5x3 grid. Check the file.')
  process.exit(1)
}

const PAD = 6
for (const { row, col, slug, name } of FROM_SHEET) {
  const [top, bottom] = rows[row]
  const [left, right] = cols[col]
  const cell = await sharp(sheetPath)
    .extract({
      left: Math.max(0, left - PAD),
      top: Math.max(0, top - PAD),
      width: Math.min(SW, right + PAD) - Math.max(0, left - PAD),
      height: Math.min(SH, bottom + PAD) - Math.max(0, top - PAD),
    })
    .png()
    .toBuffer()
  const png = await normalise(cell)
  writeFileSync(join(OUT, `${slug}.png`), png)
  const m = await sharp(png).metadata()
  manifest.push({ slug, name, w: m.width, h: m.height, bytes: png.length, from: 'composite' })
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug))
console.log(`\nwrote ${manifest.length} logo(s) to public/clients/\n`)
for (const m of manifest) {
  console.log(
    `  ${m.slug.padEnd(20)} ${String(m.w).padStart(4)}x${String(m.h).padEnd(4)} ` +
    `${String(Math.round(m.bytes / 1024)).padStart(3)}KB${m.from ? '  (from the composite)' : ''}`,
  )
}
console.log(`\ntotal ${Math.round(manifest.reduce((n, m) => n + m.bytes, 0) / 1024)}KB`)
