#!/usr/bin/env node
/**
 * The favicon set, generated from the brand icon.
 *
 *   node scripts/generate-favicons.mjs
 *
 * TRANSPARENT, and yellow rather than black.
 *
 * The source mark (src/assets/roars-mark.png) is black on transparent. Shipped
 * as-is it disappears on a dark tab strip, which is half of all browsers now.
 * So the alpha channel is kept and the ink is replaced with the brand yellow:
 * #FFD400 reads on a dark strip and stays legible on a light one, and it is
 * the colour the mark is drawn in everywhere else on the site.
 *
 * THE APPLE TOUCH ICON IS THE EXCEPTION and keeps its yellow ground. iOS does
 * not honour transparency on a home-screen icon — it composites onto black —
 * so a transparent one would be a yellow mark on a black tile, which is not
 * the brand's square.
 *
 * Output, all into public/ so Astro copies them to the site root:
 *
 *   favicon.ico          16 + 32 + 48, for the address bar and old browsers
 *   favicon-96.png       high-DPI tabs
 *   apple-touch-icon.png 180, for an iOS home screen
 *   icon-192.png         Android home screen
 *   icon-512.png         splash screens and the install prompt
 *   site.webmanifest     names the above, plus the brand colours
 *
 * The .ico is assembled here rather than pulled in as a dependency. An ICO is
 * a 6-byte header, a 16-byte directory entry per image and then the image
 * payloads; since Vista those payloads may be PNG as-is, so there is nothing
 * to encode — only offsets to get right. That is a smaller thing to own than
 * another package in the tree.
 */
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
/** The mark alone, black on transparent. */
const MARK = join(ROOT, 'src/assets/roars-mark.png')
/** The same mark on its yellow square, for the one icon that needs a ground. */
const TILE = join(ROOT, 'design/prototypes/brand/roars-icon.png')
const OUT = join(ROOT, 'public')

const ACCENT = { r: 255, g: 212, b: 0 }
/** Breathing room, as a fraction of the icon. At 16px a mark that touches the
 *  edges reads as a smudge; the tab strip gives it no margin of its own. */
const PAD = 0.12

/**
 * The mark in brand yellow, on transparency, square and centred.
 *
 * sharp's tint() multiplies, and anything multiplied by black is black, so the
 * ink cannot be recoloured in place. Instead the alpha channel is lifted off
 * and used as the mask for a flat yellow fill — the shape is the mark's, the
 * colour is the brand's.
 */
const png = async (size) => {
  const inner = Math.round(size * (1 - PAD * 2))
  const mask = await sharp(MARK)
    .ensureAlpha()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.floor((size - inner) / 2), bottom: Math.ceil((size - inner) / 2),
      left: Math.floor((size - inner) / 2), right: Math.ceil((size - inner) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extractChannel('alpha')
    .toBuffer()
  return sharp({ create: { width: size, height: size, channels: 3, background: ACCENT } })
    .joinChannel(mask)
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** The yellow square, for the Apple touch icon only. */
const tile = (size) =>
  sharp(TILE).resize(size, size, { fit: 'cover', kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer()

/** ICO container around already-encoded PNGs. */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // 1 = icon
  header.writeUInt16LE(images.length, 4)

  const dir = Buffer.alloc(16 * images.length)
  let offset = header.length + dir.length
  images.forEach(({ size, data }, i) => {
    const e = i * 16
    // 256 is written as 0; every other size fits in a byte.
    dir.writeUInt8(size >= 256 ? 0 : size, e + 0)
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1)
    dir.writeUInt8(0, e + 2) // palette colours: 0, true colour
    dir.writeUInt8(0, e + 3) // reserved
    dir.writeUInt16LE(1, e + 4) // colour planes
    dir.writeUInt16LE(32, e + 6) // bits per pixel
    dir.writeUInt32LE(data.length, e + 8)
    dir.writeUInt32LE(offset, e + 12)
    offset += data.length
  })
  return Buffer.concat([header, dir, ...images.map((i) => i.data)])
}

await mkdir(OUT, { recursive: true })

const icoSizes = [16, 32, 48]
const icoImages = await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(size) })))
await writeFile(join(OUT, 'favicon.ico'), ico(icoImages))

const files = [
  ['favicon-96.png', 96],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]
for (const [name, size] of files) await writeFile(join(OUT, name), await png(size))
await writeFile(join(OUT, 'apple-touch-icon.png'), await tile(180))

const manifest = {
  name: 'Roars Technologies',
  short_name: 'Roars',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    /* No maskable entry. A maskable icon is cropped to whatever shape the
       launcher wants and must bleed its background to the edges; a
       transparent one would be cropped to a yellow mark on nothing. */
  ],
  theme_color: '#FFD400',
  background_color: '#0B0B0B',
  display: 'standalone',
  start_url: '/',
}
await writeFile(join(OUT, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n')

console.log('--- generate-favicons ---')
console.log(`favicon.ico          ${icoSizes.join(' + ')}  transparent  (${icoImages.reduce((n, i) => n + i.data.length, 0)} bytes of PNG)`)
for (const [name, size] of files) console.log(`${name.padEnd(21)}${String(size).padEnd(5)}transparent`)
console.log('apple-touch-icon.png 180  yellow ground (iOS does not honour alpha)')
console.log('site.webmanifest')
