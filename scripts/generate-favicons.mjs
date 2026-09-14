#!/usr/bin/env node
/**
 * The favicon set, generated from the brand icon.
 *
 *   node scripts/generate-favicons.mjs
 *
 * Source: design/prototypes/brand/roars-icon.png — the mark on the #FFD400
 * ground, 417x417. Not the transparent wordmark: a favicon is shown against
 * whatever chrome the browser has, and a black mark with no ground disappears
 * on a dark tab strip.
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
const SRC = join(ROOT, 'design/prototypes/brand/roars-icon.png')
const OUT = join(ROOT, 'public')

const png = (size) =>
  sharp(SRC).resize(size, size, { fit: 'cover', kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer()

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
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]
for (const [name, size] of files) await writeFile(join(OUT, name), await png(size))

const manifest = {
  name: 'Roars Technologies',
  short_name: 'Roars',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  theme_color: '#FFD400',
  background_color: '#0B0B0B',
  display: 'standalone',
  start_url: '/',
}
await writeFile(join(OUT, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n')

console.log('--- generate-favicons ---')
console.log(`favicon.ico          ${icoSizes.join(' + ')}  (${icoImages.reduce((n, i) => n + i.data.length, 0)} bytes of PNG)`)
for (const [name, size] of files) console.log(`${name.padEnd(21)}${size}`)
console.log('site.webmanifest')
