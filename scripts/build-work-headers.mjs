#!/usr/bin/env node
/**
 * Turn the supplied case-study photography into one consistent set.
 *
 *   node scripts/build-work-headers.mjs <dir-with-the-unzipped-headers>
 *
 * Eighteen photographs arrive at 2400px wide in five different shapes, from
 * 1.33:1 to 1.78:1. Both places they appear — the /work/ card and the
 * /work/[slug]/ header — are 2:1, so every one is cropped to that here rather
 * than by `object-fit` in the browser: cropping once at build time means the
 * bytes sent match the pixels shown, and a 1.33:1 file in a 2:1 box is 33% of
 * its own height thrown away on every request.
 *
 * SATURATION IS CAPPED AT 0.8, baked in. The handoff calls this "the only
 * treatment applied to any image anywhere in the system", and it is done here
 * rather than as a CSS filter so the file and the page cannot disagree, and so
 * nothing has to composite a filter on a 2400px image at paint time.
 *
 * GRAVITY IS 'attention', not centre. A 2400x1600 frame loses a third of its
 * height; sharp's attention strategy keeps the region with the most entropy
 * and detail, which on these photographs is the subject rather than the sky or
 * the floor. Centre-cropping put the horizon through the middle of several.
 *
 * It also runs the handoff's colour sampler over each image and writes the
 * result to src/lib/work-fields.json — dominant hue, accent hue, the share
 * between them, and which path the share guard took. That file is an audit
 * trail, not a dependency: see the note at the bottom of this comment.
 *
 * Output is public/work/<slug>.jpg, served from this repo so it resolves in
 * every build, unlike /wp-content/uploads/ which only exists on the webspace.
 *
 * THE SAMPLER'S OUTPUT IS RECORDED BUT NOT USED FOR A FIELD COLOUR. The
 * handoff's own "Known limitation" says the accent carries 0-11.8% of the
 * dominant hue's weight, so for most images the colour it produces has no
 * parent a viewer can point to in the photograph. The owner read that and
 * dropped it. The numbers are kept because they were expensive to establish
 * and because the decision is easier to revisit with them than without.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/work')
const SRC = process.argv[2]
if (!SRC) {
  console.error('usage: node scripts/build-work-headers.mjs <dir>')
  process.exit(1)
}

/**
 * Source filename prefix to inventory slug.
 *
 * Keyed on the leading number because the rest of each filename carries a
 * photographer credit that will change when the real shoot replaces these.
 * "06-findafriend" is Friendo and "12-flowrow-erg" is Flowrow; both are the
 * product's working name rather than the slug.
 */
const BY_PREFIX = {
  '01': 'warehouse-compliance-checklist-app',
  '02': 'parqly-parking-solution',
  '04': '411drives-on-demand-car-loan-app',
  '05': 'gisaid-health-tech',
  '06': 'friendo-healthcare-mobile-app-development',
  '07': 'the-presidents-club',
  '08': 'les-concierges',
  '09': 'reward-butler',
  '10': 'concierge-loyalty-program',
  '11': 'gymbait',
  '12': 'flowrow-fitness-app',
  '13': 'tanishq-data-analytics',
  '14': 'ventura-law-firm',
  '15': 'advisee',
  '16': 'community-social-residential-community-app',
  '17': 'club-social',
  '18': 'go-champions-go',
  '19': 'counter-cabinet',
  /* Supplied later, after the first eighteen. 01 is Snowman's OWN fleet in
     front of their own cold store, replacing a stock trailer yard — a real
     client photograph beats a lookalike. 20 is Onus. */
  '20': 'onus',
}

const W = 2400
const H = 1200 // 2:1, the shape of both the card and the page header
const SAT = 0.8

/** sRGB to HSL, hue in degrees. */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0))
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [h * 60, s, l]
}

/** The handoff's sampler, verbatim in behaviour: 120x120, 36 buckets of 10
 *  degrees, pixels weighted by saturation cubed, accent at least 60 degrees
 *  from the dominant, and a 0.005 share guard. */
async function extractField(file) {
  const { data } = await sharp(file)
    .resize(120, 120, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const N = 36
  const weight = new Array(N).fill(0)
  const hueSum = new Array(N).fill(0)
  for (let i = 0; i < data.length; i += 3) {
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    if (s < 0.18 || l < 0.1 || l > 0.92) continue
    const b = Math.floor(h / 10) % N
    const w = s * s * s
    weight[b] += w
    hueSum[b] += h * w
  }
  let dom = 0
  for (let i = 1; i < N; i++) if (weight[i] > weight[dom]) dom = i
  let acc = -1
  for (let i = 0; i < N; i++) {
    const dist = Math.min(Math.abs(i - dom), N - Math.abs(i - dom))
    if (dist < 6) continue
    if (acc < 0 || weight[i] > weight[acc]) acc = i
  }
  const share = acc < 0 ? 0 : weight[acc] / weight[dom]
  const usedAccent = share >= 0.005
  const pick = usedAccent ? acc : dom
  const hue = Math.round(hueSum[pick] / weight[pick])
  return {
    dominantHue: Math.round(hueSum[dom] / weight[dom]),
    accentHue: acc < 0 ? null : Math.round(hueSum[acc] / weight[acc]),
    share: Number(share.toFixed(4)),
    usedAccent,
    hue,
    field: `hsl(${hue} 28% 16%)`,
  }
}

mkdirSync(OUT, { recursive: true })
const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith('.'))
const fields = {}
const rows = []

for (const [prefix, slug] of Object.entries(BY_PREFIX)) {
  const file = files.find((f) => f.startsWith(prefix + '-'))
  if (!file) {
    console.error(`FAIL: no source for ${prefix} (${slug})`)
    process.exit(1)
  }
  const src = join(SRC, file)

  const buf = await sharp(src)
    .resize(W, H, { fit: 'cover', position: sharp.strategy.attention })
    .modulate({ saturation: SAT })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  writeFileSync(join(OUT, `${slug}.jpg`), buf)

  fields[slug] = await extractField(src)
  rows.push({ slug, file, kb: Math.round(buf.length / 1024), ...fields[slug] })
}

writeFileSync(join(ROOT, 'src/lib/work-fields.json'), JSON.stringify(fields, null, 2) + '\n')

console.log(`\nwrote ${rows.length} header(s) to public/work/ at ${W}x${H}\n`)
for (const r of rows) {
  console.log(
    `  ${r.slug.padEnd(42)} ${String(r.kb).padStart(4)}KB  dom ${String(r.dominantHue).padStart(3)}°  ` +
    `acc ${String(r.accentHue ?? '—').padStart(3)}°  share ${(r.share * 100).toFixed(1).padStart(5)}%  ` +
    `${r.usedAccent ? 'accent  ' : 'FALLBACK'}  ${r.field}`,
  )
}
console.log(`\ntotal ${Math.round(rows.reduce((n, r) => n + r.kb, 0) / 1024)}MB`)
