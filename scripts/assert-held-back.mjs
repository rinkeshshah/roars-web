#!/usr/bin/env node
/**
 * NO INDEXED PAGE MAY OFFER A HELD-BACK CASE STUDY AS A RECEIPT.
 *
 * Twelve case studies are held back: built, but noindex and out of the
 * sitemap. That is a decision about what we put in front of people, and it
 * only works if the rest of the site agrees with it.
 *
 * It did not. Nine cards across six industry pages and two service pages named
 * a held-back client and linked to its page — Les Concierges twice, Community
 * Social, Reward Butler, Friendo, Blelp, Go Champions Go. Every one of those
 * pages is in the sitemap, so the shape was: an indexed page spends a link and
 * a reader's attention on a page we have asked search engines to ignore, and
 * the reader lands on a dead end that looks like a mistake because it is one.
 *
 * The rule this enforces is narrow on purpose. It is NOT "never link to a
 * held-back page":
 *
 *   - /work/[slug]/ prev/next may reach one. Those are already skipped in the
 *     template, but the principle is that navigation between case studies is a
 *     different thing from offering one as proof.
 *   - A held-back page linking to another held-back page is fine. Neither is
 *     indexed, so nothing is being spent.
 *
 * What is forbidden is a RECEIPT: a card in a `cases` or `featured` block, or
 * a service page's `anchor`, that names a client and points at their case
 * study, on a page that is in the sitemap. Those are the blocks whose whole
 * job is "here is the proof, go and read it".
 *
 * Reads built HTML rather than content files, because the question is what a
 * crawler sees. An industry page's markdown body is not rendered, so a link
 * left in one is invisible and is correctly not a finding here.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HELD_BACK_WORK } from '../src/lib/held-back.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/* The four link classes the receipt blocks render with, one per block:
     icz__cta        industry `cases` card
     ip__feat-cta    industry `proof.featured` card
     sv-anchor__cta  service `anchor` block
     sv-feat__cta    service `featured` block
   Named rather than pattern-matched, so a new block has to be added here
   deliberately and cannot opt itself out by being called something else. */
const RECEIPT = /\b(?:icz__cta|ip__feat-cta|sv-anchor__cta|sv-feat__cta)\b/

const held = new Set(HELD_BACK_WORK)

const pages = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name === 'index.html') pages.push(p)
  }
}
if (!existsSync(DIST)) {
  console.error('FAIL: no dist/. Build first.')
  process.exit(1)
}
walk(DIST)

const findings = []
let checked = 0

for (const file of pages) {
  const url = '/' + relative(DIST, dirname(file)).split('\\').join('/') + '/'
  /* SCOPE IS STRUCTURAL, NOT THE ROBOTS META.
     Every page in a pre-launch build carries noindex, so reading the meta tag
     would make this gate pass trivially on every run until cutover and then
     start failing on the one build nobody wants surprises in. The question is
     which pages are offered to search engines AT LAUNCH, and for the four
     blocks this gate reads — which only ever render on industry and service
     pages — the single exclusion that matters is a held-back case study
     linking to another one. Neither is indexed, so nothing is spent. */
  if (/^\/work\/([^/]+)\/$/.test(url) && held.has(url.split('/')[2])) continue
  checked++
  const html = readFileSync(file, 'utf8')

  for (const m of html.matchAll(/<a\b([^>]*)href=["']\/work\/([^/"']+)\/["']([^>]*)>/g)) {
    const slug = m[2]
    if (!held.has(slug)) continue
    const attrs = m[1] + m[3]
    /* Only receipts. A link from somewhere else on an indexed page is a
       different question and not this gate's. */
    if (!RECEIPT.test(attrs)) continue
    findings.push({ url: url === '//' ? '/' : url, slug, attrs: attrs.trim().slice(0, 90) })
  }
}

console.log('--- assert-held-back ---')
console.log(`held back        : ${held.size}`)
console.log(`in scope at launch: ${checked} of ${pages.length} built`)

if (findings.length) {
  console.error(`\nFAIL: ${findings.length} receipt(s) on indexed pages point at a held-back case study:`)
  for (const f of findings) {
    console.error(`    ${f.url}`)
    console.error(`        -> /work/${f.slug}/  (${f.attrs})`)
  }
  console.error('\nEither swap the card for a case study that is shown, or drop the')
  console.error('block. A card naming a client and linking to a noindex page spends')
  console.error('the link and leaves the reader on a dead end.')
  process.exit(1)
}

console.log('\nPASS: no indexed page offers a held-back case study as proof.')
