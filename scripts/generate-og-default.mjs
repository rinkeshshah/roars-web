#!/usr/bin/env node
/**
 * The default Open Graph card.
 *
 *   node scripts/generate-og-default.mjs      (runs from `npm run build`)
 *
 * Writes public/og/roars-default-1200x630.jpg.
 *
 * WHY THIS EXISTS AT ALL. site.ts has always named
 * `/og/roars-default-1200x630.jpg` as `defaultOgImage`, and BaseLayout puts it
 * in `og:image` and `twitter:image` on every page. The file was never made. So
 * all 292 pages pointed a share card at a URL that 404s, and every link posted
 * to LinkedIn, Slack, WhatsApp or X rendered as a bare grey rectangle. Nothing
 * catches this: assert-urls checks the inventory, which is pages, and a
 * missing image is a silent failure by definition.
 *
 * NO TEXT IN THE IMAGE, DELIBERATELY. Rendering type here would mean either
 * shipping a second copy of a headline that already exists in `og:title` right
 * next to the card, or picking whatever font librsvg happens to resolve, which
 * on a build machine is not Inter. The card is the wordmark on the brand
 * ground with the accent rule, which is the one thing that is true of every
 * page on the site and needs no font to draw.
 *
 * THIS IS THE FALLBACK, not the goal. Per-page OG cards are a post-launch job.
 * What this fixes is the case where there is nothing at all.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const WORDMARK = join(ROOT, 'src/assets/roars-horizontal.png')
const OUT_DIR = join(ROOT, 'public/og')
const OUT = join(OUT_DIR, 'roars-default-1200x630.jpg')

const W = 1200
const H = 630
/** --c-ink-body and --c-accent, src/styles/tokens.css. */
const INK = { r: 20, g: 20, b: 20 }
const ACCENT = { r: 255, g: 212, b: 0 }

/** The wordmark is black on transparent, same as the favicon source, so it is
 *  recoloured the same way: lift the alpha and use it as a mask for flat
 *  paper. Tinting cannot lighten black. */
async function wordmark(width) {
  /* TRIM FIRST. roars-horizontal.png carries transparent padding, more on the
     right than the left, so composing it on its own bounding box puts the
     optical centre of the lockup about 40px left of the card's centre. Trim
     makes the box the ink, which is what "centred" has to mean here. */
  const trimmed = await sharp(WORDMARK)
    .ensureAlpha()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .png()
    .toBuffer()
  /* resolveWithObject, not metadata(). sharp's metadata() reports the INPUT
     image, so on a pipeline that has resized it still answers 916x240 and the
     composite gets centred against a box half again as wide as the thing in
     it, which is how the lockup ended up left of centre. */
  const { data: mask, info } = await sharp(trimmed)
    .ensureAlpha()
    .resize({ width, fit: 'inside' })
    .extractChannel('alpha')
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const buf = await sharp({
    create: { width: w, height: h, channels: 3, background: { r: 251, g: 251, b: 251 } },
  })
    .joinChannel(mask, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer()
  return { buf, w, h }
}

const mark = await wordmark(600)

/* CENTRED, not set to the left margin.
   A card is shown at a dozen sizes nobody controls: full width in a LinkedIn
   feed, a 120px square in a Slack unfurl, cropped to 2:1 by X. A lockup in the
   left third survives the first and loses its balance in the other two.
   Centred, every crop keeps the mark in the middle of what is left.

   THE ACCENT IS THE BOTTOM EDGE, not a rule under the wordmark. The wordmark
   already draws its own white rule under "roars", so a second short rule below
   it read as two rules arguing. Full width along the bottom is the same device
   the site uses for a band edge, it cannot collide with the type, and it is
   the one part of the card still visible when Slack crops it to a square. */
const BAR_H = 14

const bar = await sharp({
  create: { width: W, height: BAR_H, channels: 3, background: ACCENT },
})
  .png()
  .toBuffer()

await mkdir(OUT_DIR, { recursive: true })

/* Optically centred, not arithmetically. The lockup's top third is the thin
   "USER EXPERIENCE MATTERS" line, so a box centred on its bounding box sits
   low; lifting it by 4% of the height puts the weight of the word "roars" on
   the card's middle, which is what the eye reads as centred. */
const top = Math.round((H - mark.h) / 2 - H * 0.04)

await sharp({ create: { width: W, height: H, channels: 3, background: INK } })
  .composite([
    { input: mark.buf, left: Math.round((W - mark.w) / 2), top },
    { input: bar, left: 0, top: H - BAR_H },
  ])
  /* 88 rather than the usual 82: the card is flat colour with a hard-edged
     mark, which is exactly what JPEG rings around. */
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(OUT)

console.log('--- generate-og-default ---')
console.log(`wrote ${W}x${H} -> public/og/roars-default-1200x630.jpg`)
