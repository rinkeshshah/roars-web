#!/usr/bin/env node
/**
 * Fill the empty alt on images inside migrated journal bodies.
 *
 *   node scripts/fill-journal-alt.mjs [--write]
 *
 * WHAT THIS CAN AND CANNOT KNOW. These images live on the webspace under
 * /wp-content/uploads/, not in this repository, so nothing here has ever seen
 * one. The only evidence available is the filename the original author chose
 * and the post it sits in. Where the filename says what the picture is —
 * design-thinking-process, responsive-design-adaptive-design — that is a real
 * description and it becomes the alt. Where it does not — yy.jpg, a stock
 * photo's upload hash — no honest alt can be derived, and inventing one from
 * the post's keywords is the exact failure the brief called out. Those are
 * listed instead, for someone who can open the image.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(ROOT, 'src/content/posts'), join(ROOT, 'src/content/projects')]
const WRITE = process.argv.includes('--write')

/** A filename that describes nothing: a camera dump, a stock hash, a stub. */
const OPAQUE = [
  /^[a-z]{1,3}\.\w+$/i,              // yy.jpg
  /unsplash/i,                       // photographer + hash
  /^\w+-\d{5,}/,                     // student-849825_960_720
  /^(img|dsc|image|photo)[-_]?\d+/i,
  /^dribble/i,
]
/** Words that are size or upload noise, not description. */
const NOISE = /^(\d+x\d+|\d{3,}|scaled|copy|final|v\d+|min|new|\d)$/i

const humanise = (file) => {
  const base = file.replace(/\.[a-z0-9]+$/i, '')
  const words = base
    .replace(/[_+]/g, '-')
    .split('-')
    .filter((w) => w && !NOISE.test(w))
  if (words.length === 0) return null
  const text = words.join(' ').replace(/\s+/g, ' ').trim()
  if (text.length < 4) return null
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

let filled = 0
const skipped = []
for (const DIR of DIRS)
for (const name of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const path = join(DIR, name)
  const src = readFileSync(path, 'utf8')
  let out = src
  /* A case study's gallery is the same product shot after shot, named
     companyguru-1, Cguru-4, cguru-6. Humanising those gives "Cguru 4", which
     is not a description of anything. The entry's own title plus the frame
     number is, and it is true. */
  const title = (src.match(/^title:\s*["']?(.+?)["']?\s*$/m) ?? [])[1] ?? null
  const asFrame = (file) => {
    const m = file.replace(/\.[a-z0-9]+$/i, '').match(/^(.+?)[-_ ]?(\d{1,2})$/)
    if (!m || !title) return null
    const stem = m[1].replace(/[-_]/g, '').toLowerCase()
    const key = title.replace(/[^a-z0-9]/gi, '').toLowerCase()
    /* only when the filename really is the project's own name */
    if (!key.startsWith(stem.slice(0, 5)) && !stem.startsWith(key.slice(0, 5))) return null
    return `${title}, screen ${Number(m[2])}`
  }

  // markdown: ![](url)
  out = out.replace(/!\[\]\(([^)\s]+)([^)]*)\)/g, (whole, url, rest) => {
    const file = url.split('/').pop()
    if (OPAQUE.some((r) => r.test(file))) { skipped.push({ name, file }); return whole }
    const alt = asFrame(file) ?? humanise(file)
    if (!alt) { skipped.push({ name, file }); return whole }
    filled++
    return `![${alt}](${url}${rest})`
  })

  // raw html in the body: <img ... alt="" ...>
  out = out.replace(/<img\b([^>]*)\balt=""([^>]*)>/g, (whole, a, b) => {
    const m = (a + b).match(/\bsrc="([^"]*)"/)
    if (!m) return whole
    const file = m[1].split('/').pop()
    if (OPAQUE.some((r) => r.test(file))) { skipped.push({ name, file }); return whole }
    const alt = asFrame(file) ?? humanise(file)
    if (!alt) { skipped.push({ name, file }); return whole }
    filled++
    return `<img${a}alt="${alt}"${b}>`
  })

  if (out !== src && WRITE) writeFileSync(path, out)
}

console.log(`${WRITE ? 'filled' : 'would fill'}: ${filled}`)
console.log(`no honest alt from the filename: ${skipped.length}`)
for (const s of skipped) console.log(`  ${s.file.padEnd(38)} ${s.name}`)

/* ── frontmatter galleries ────────────────────────────────────────────────
   A case study's gallery and showcase are `- src: … / alt: ""` pairs in the
   entry's own frontmatter, not markdown images, so the two passes above never
   see them. Same rule: the entry's title and the frame number where the
   filename is the project's own name, the humanised filename where it says
   something, and nothing invented where it does not. */
{
  let n = 0
  const more = []
  for (const DIR of DIRS) {
    for (const name of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
      const path = join(DIR, name)
      const src = readFileSync(path, 'utf8')
      const title = (src.match(/^title:\s*["']?(.+?)["']?\s*$/m) ?? [])[1] ?? null
      const asFrame = (file) => {
        const m = file.replace(/\.[a-z0-9]+$/i, '').match(/^(.+?)[-_ ]?(\d{1,2})$/)
        if (!m || !title) return null
        const stem = m[1].replace(/[-_]/g, '').toLowerCase()
        const key = title.replace(/[^a-z0-9]/gi, '').toLowerCase()
        if (!key.startsWith(stem.slice(0, 5)) && !stem.startsWith(key.slice(0, 5))) return null
        return `${title}, screen ${Number(m[2])}`
      }
      const out = src.replace(
        /(- src:\s*"([^"]+)"\s*\n(\s*)alt:\s*)""/g,
        (whole, head, url, _indent) => {
          const file = url.split('/').pop()
          if (OPAQUE.some((r) => r.test(file))) { more.push({ name, file }); return whole }
          const alt = asFrame(file) ?? humanise(file)
          if (!alt) { more.push({ name, file }); return whole }
          n++
          return `${head}"${alt.replace(/"/g, '')}"`
        },
      )
      if (out !== src && WRITE) writeFileSync(path, out)
    }
  }
  console.log(`\ngallery/showcase ${WRITE ? 'filled' : 'would fill'}: ${n}`)
  if (more.length) {
    console.log(`no honest alt from the filename: ${more.length}`)
    for (const s of more) console.log(`  ${s.file.padEnd(38)} ${s.name}`)
  }
}
