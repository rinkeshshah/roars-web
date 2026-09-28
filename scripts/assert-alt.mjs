#!/usr/bin/env node
/**
 * Every image either says what it is, or says it is decoration. Out loud.
 *
 *   node scripts/assert-alt.mjs        (part of `npm run verify`)
 *
 * THE POINT IS THE SECOND HALF. `alt=""` is correct markup for an image that
 * carries no information — a rule, a glyph, a face beside its own printed
 * name — and a gate that simply banned it would push us into writing alt text
 * that makes screen readers worse, not better. So empty alt stays legal, and
 * has to be declared: `alt="" data-decorative`. The attribute costs nothing
 * at runtime and moves the decision into the source, where the next person
 * can see it was a decision.
 *
 * WHAT THE AUDIT GOT RIGHT AND WHAT IT COULD NOT SEE. A crawl reported 744
 * images with empty alt and called it a defect. In the build it was 1146 —
 * and two images were 843 of them: the Roars mark, which sits inside
 * `<a href="/" aria-label="Roars, home">` and is therefore correctly silent,
 * and the founder's portrait, which sits next to "Rinkesh A Shah / CEO /
 * Founder" in readable text. Describing either would make a screen reader say
 * the same thing twice. Of the 40 distinct image tags in src/, most are that
 * shape; a handful were real content going unnamed. Those are now named, and
 * the rest are marked.
 *
 * ALSO CHECKED: an image inside a link, where the link has no other text and
 * no aria-label, leaves that link with no accessible name at all — a screen
 * reader reads out the URL. Empty alt is not the bug there, the nameless link
 * is, and it is the one case where `data-decorative` is not enough.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

if (!existsSync(DIST)) {
  console.error('no dist/. Run npm run build first.')
  process.exit(1)
}

/**
 * Images nobody here could describe. Empty, and it should stay that way.
 *
 * Five migrated journal images once sat here: a stock photographer's slug, an
 * upload hash, "Dribble.gif". They live on the webspace, not in this repo, so
 * no process in this build has ever seen one, and their filenames said
 * nothing. Writing alt for them from the surrounding article would have
 * produced confident sentences about pictures nobody had looked at — worse
 * than silence, because a screen reader user would be told what the image
 * shows and it might simply be wrong.
 *
 * So they were listed rather than guessed at, and a human opened them and
 * wrote the alt text. Two turned out to be optical illusions — Müller-Lyer
 * and Ponzo — which is exactly the case where an invented description would
 * have been confidently, uselessly wrong.
 *
 * Add to this list only when an image genuinely cannot be seen from here, and
 * treat every entry as a question for a person rather than a permanent pass.
 */
const CANNOT_DESCRIBE = new Set([])

const pages = []
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    statSync(p).isDirectory() ? walk(p) : n.endsWith('.html') && pages.push(p)
  }
}
walk(DIST)

let total = 0, described = 0, decorative = 0
const undeclared = new Map()   // empty alt, no data-decorative
const missing = new Map()      // no alt attribute at all
const namelessLinks = new Map()

for (const file of pages) {
  const html = readFileSync(file, 'utf8')
  const where = file.replace(DIST, '') || '/'

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0]
    total++
    const src = (tag.match(/\bsrc="([^"]*)"/) ?? [])[1] ?? '(no src)'
    const altM = tag.match(/\balt="([^"]*)"/)
    /* `alt` with no value is valid HTML and means empty, so a check that only
       looks for alt="..." reports a correctly-empty image as having none.
       Got this wrong once already on this site. */
    const bare = !altM && /\balt(?=[\s/>])/.test(tag)

    if (!altM && !bare) {
      const k = `${src} :: ${where}`
      if (!missing.has(k)) missing.set(k, { src, where })
      continue
    }
    const value = altM ? altM[1].trim() : ''
    if (value !== '') { described++; continue }
    if (/\bdata-decorative\b/.test(tag)) { decorative++; continue }
    if (CANNOT_DESCRIBE.has(src)) { decorative++; continue }
    decorative++
    const k = src
    if (!undeclared.has(k)) undeclared.set(k, new Set())
    undeclared.get(k).add(where)
  }

  /* A link whose only content is an image with empty alt has no name. The
     aria-label on the anchor is the usual fix and is what the Roars mark
     already does. */
  for (const m of html.matchAll(/<a\b([^>]*)>((?:(?!<\/a>)[\s\S])*?)<\/a>/g)) {
    const attrs = m[1], inner = m[2]
    if (!/<img\b/.test(inner)) continue
    if (/aria-label="[^"]+"|title="[^"]+"/.test(attrs)) continue
    const text = inner.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, '').trim()
    if (text !== '') continue
    const imgAlts = [...inner.matchAll(/<img\b[^>]*>/g)]
      .map((i) => (i[0].match(/\balt="([^"]*)"/) ?? [, ''])[1].trim())
    if (imgAlts.some((a) => a !== '')) continue
    const href = (attrs.match(/href="([^"]*)"/) ?? [, '?'])[1]
    if (!namelessLinks.has(href)) namelessLinks.set(href, new Set())
    namelessLinks.get(href).add(where)
  }
}

console.log(`<img> tags          : ${total}`)
console.log(`  described         : ${described}`)
console.log(`  declared decorative: ${decorative - undeclared.size ? decorative : decorative}`)
console.log(`pages scanned       : ${pages.length}`)

let bad = false

if (missing.size) {
  bad = true
  console.error('')
  console.error('FAIL: image with no alt attribute at all. A screen reader falls back')
  console.error('to reading the filename, which is worse than silence.')
  for (const { src, where } of [...missing.values()].slice(0, 20)) {
    console.error(`  ${src}  on ${where}`)
  }
}

if (undeclared.size) {
  bad = true
  console.error('')
  console.error('FAIL: empty alt with no `data-decorative`. Decide which it is:')
  console.error('  - it carries information -> give it alt text')
  console.error('  - it is decoration       -> alt="" data-decorative')
  for (const [src, where] of [...undeclared.entries()].slice(0, 20)) {
    console.error(`  ${src}`)
    console.error(`      ${where.size} page(s), e.g. ${[...where].slice(0, 3).join(', ')}`)
  }
}

if (namelessLinks.size) {
  bad = true
  console.error('')
  console.error('FAIL: link whose only content is a silent image, so the link has no')
  console.error('accessible name. Put aria-label on the <a>, or alt on the image.')
  for (const [href, where] of [...namelessLinks.entries()].slice(0, 20)) {
    console.error(`  href="${href}"  ${where.size} page(s), e.g. ${[...where][0]}`)
  }
}

if (bad) process.exit(1)
console.log('\nPASS: every image is described or declared decorative, and no link')
console.log('      is left nameless by a silent image.')
