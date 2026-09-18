/**
 * Drop every noindex URL from the sitemap, and prove none is left.
 *
 * THE BUG THIS EXISTS FOR. A sitemap is a request to index. A `noindex` meta
 * tag is a refusal. A URL carrying both asks and withdraws in the same breath,
 * and Google's own guidance is that it erodes trust in the whole file — the
 * cost is not the one URL, it is the other hundred.
 *
 * In the first indexed build ever made, 26 of 134 sitemap URLs were noindex:
 * the six industry pages held back by the content gate, fourteen /resources/
 * guides, /privacy-policy/, /terms-of-service/, /components/ and three
 * standalone pages. astro.config.mjs already filters two categories by hand —
 * held-back case studies and unmigrated journal posts — and those two lists
 * were simply the ones somebody had thought of. Every other reason a page can
 * end up noindex was missing, and would have stayed missing until the next
 * one was added.
 *
 * WHY THIS READS dist/ RATHER THAN THE CONTENT. The config filter cannot see
 * the answer. `noindex` is decided inside BaseLayout from four different
 * inputs — `needsReview` on four collections, the held-back list, a page
 * passing the prop directly, and the global indexing switch — and the config
 * runs before any of that has happened. Anything it checks is a
 * RE-DERIVATION, and a re-derivation drifts the first time someone adds a
 * fifth reason.
 *
 * The emitted HTML does not re-derive anything. It is the answer. So this
 * runs after the build, reads what each page actually says about itself, and
 * removes those URLs from the sitemap. A new reason for a page to be noindex
 * needs no change here.
 *
 * IT ALSO FAILS THE BUILD, on the way out, if any noindex URL survived — so
 * this cannot quietly stop working.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'

if (!existsSync(DIST)) {
  console.error('prune-sitemap: no dist/. Run the build first.')
  process.exit(1)
}

const sitemaps = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f))
if (sitemaps.length === 0) {
  /* The pre-launch build emits no sitemap at all, by design: while
     PUBLIC_ALLOW_INDEXING is unset every page is noindex and shipping a
     sitemap beside that would be the same contradiction at file scale. So
     nothing to do is the correct outcome here, not a failure. */
  console.log('--- prune-sitemap ---')
  console.log('No sitemap in dist/ (pre-launch build, indexing switched off). Nothing to do.')
  process.exit(0)
}

/** Every URL in the build whose page says noindex. */
const noindexUrls = new Set()
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { walk(p); continue }
    if (e.name !== 'index.html') continue
    const html = readFileSync(p, 'utf8')
    const m = html.match(/<meta name="robots" content="([^"]*)"/)
    if (!m || !m[1].includes('noindex')) continue
    /* dist/about-us/index.html -> /about-us/ ; dist/index.html -> / */
    const path = p.slice(DIST.length).replace(/index\.html$/, '')
    noindexUrls.add(path)
  }
}
walk(DIST)

console.log('--- prune-sitemap ---')

let removed = 0
let kept = 0
const stillWrong = []

for (const file of sitemaps) {
  const path = join(DIST, file)
  const xml = readFileSync(path, 'utf8')

  /* One <url> element at a time, so the <lastmod> and anything else inside it
     goes with its URL rather than being left behind as an orphan. */
  const out = xml.replace(/<url>([\s\S]*?)<\/url>/g, (whole, inner) => {
    const loc = (inner.match(/<loc>([^<]+)<\/loc>/) || [])[1]
    if (!loc) return whole
    let p
    try { p = new URL(loc).pathname } catch { return whole }
    if (noindexUrls.has(p)) { removed++; return '' }
    kept++
    return whole
  })

  if (out !== xml) writeFileSync(path, out)

  for (const loc of out.match(/<loc>[^<]+<\/loc>/g) ?? []) {
    const u = loc.slice(5, -6)
    try { if (noindexUrls.has(new URL(u).pathname)) stillWrong.push(u) } catch { /* ignore */ }
  }
}

console.log(`pages carrying noindex : ${noindexUrls.size}`)
console.log(`sitemap URLs removed   : ${removed}`)
console.log(`sitemap URLs kept      : ${kept}`)

if (stillWrong.length) {
  console.error('\nFAIL: noindex URLs are still listed in the sitemap:')
  for (const u of stillWrong) console.error('    ' + u)
  process.exit(1)
}

if (kept === 0) {
  console.error('\nFAIL: the sitemap is now empty. That is not a prune, that is a bug.')
  process.exit(1)
}

console.log('\nPASS: every URL left in the sitemap is one the page asks to have indexed.')
