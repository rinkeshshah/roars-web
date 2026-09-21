#!/usr/bin/env node
/**
 * No internal link points at a URL we redirect away from.
 *
 *   node scripts/assert-no-redirect-links.mjs      (part of `npm run verify`)
 *
 * WHY. A link to a 301 source costs the visitor a round trip and spends
 * crawl budget on a URL we have already said is not the one. It is invisible
 * from the inside: the link works, the page arrives, nothing logs. It shows up
 * in a crawl months later as "internal links to redirects", by which time
 * nobody remembers where the link came from.
 *
 * This found three, and the shape of them is the argument for the gate:
 *
 *   /our-journal/ai-app-development-vs-…/   207 pages. ONE source: a hardcoded
 *                                           item in the src/lib/nav.ts mega
 *                                           menu, so it was on every page.
 *   /our-journal/blockchain-revolutionise-digital-world/   3 pages
 *   /our-journal/one-thing-mvp-no-one-talking/             1 page
 *
 * BOTH SPELLINGS, WHICH IS THE WHOLE TRICK. The nav one is a relative
 * `href="/our-journal/…/"`. The other four are ABSOLUTE —
 * `href="https://www.roarsinc.com/our-journal/…/"` — because they sit in the
 * body of posts migrated from WordPress, where the editor wrote full URLs.
 * A first pass of this check looked only for relative hrefs, reported one
 * offender, and was wrong by four. Anything that normalises before comparing
 * has to normalise the host away too.
 *
 * WHAT IS NOT A LINK. A page's own canonical and og:url name the page itself;
 * a 301 source that still ships as a built page (57 of them do) carries both,
 * and reading them as links would report every one of those pages as linking
 * to itself. Only <a href> counts here.
 *
 * WHAT IT READS. dist/.htaccess, which scripts/generate-htaccess.mjs has
 * already written by the time this runs — the same file Apache will serve, so
 * the gate and production cannot disagree about what redirects. Pattern rules
 * (the ones with capture groups) are skipped: they exist to catch URL shapes
 * nothing on the site should be linking anyway, and matching them here would
 * need mod_rewrite's own regex engine to be sure.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const HTACCESS = join(DIST, '.htaccess')

if (!existsSync(DIST) || !existsSync(HTACCESS)) {
  console.error('no dist/.htaccess. Run npm run build first.')
  process.exit(1)
}

/** Exact 301 sources, as site paths, mapped to where they send you. */
const dest = new Map()
for (const line of readFileSync(HTACCESS, 'utf8').split('\n')) {
  const m = line.match(/^RewriteRule \^(\S+?)\s+https:\/\/www\.roarsinc\.com(\S*)\s+\[R=301/)
  if (!m) continue
  const pat = m[1].replace(/\\\./g, '.').replace(/\/\?\$$/, '/').replace(/\$$/, '')
  if (/[()*+?\[\]|]/.test(pat)) continue // a pattern, not a literal path
  dest.set('/' + pat.replace(/^\/+|\/+$/g, '') + '/', m[2])
}

if (dest.size === 0) {
  console.error('assert-no-redirect-links: parsed no 301 sources out of dist/.htaccess.')
  console.error('The generator changed shape and this gate is now blind. Fix the parse.')
  process.exit(1)
}

const pages = []
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    statSync(p).isDirectory() ? walk(p) : n.endsWith('.html') && pages.push(p)
  }
}
walk(DIST)

/** Host-relative, query and fragment dropped, one trailing slash. */
const normalise = (href) => {
  let u = href.trim().replace(/^https?:\/\/(www\.)?roarsinc\.com/i, '')
  if (!u.startsWith('/')) return null // off-site, or a mailto:/tel:/#anchor
  u = u.split('#')[0].split('?')[0]
  if (u === '') return null
  return u.endsWith('/') ? u : u + '/'
}

const offenders = new Map()
for (const file of pages) {
  const html = readFileSync(file, 'utf8')
  for (const m of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/gi)) {
    const u = normalise(m[1])
    if (u === null || !dest.has(u)) continue
    if (!offenders.has(u)) offenders.set(u, new Set())
    offenders.get(u).add(file.replace(DIST, '') || '/')
  }
}

const rows = [...offenders.entries()].sort((a, b) => b[1].size - a[1].size)
console.log(`exact 301 sources      : ${dest.size}`)
console.log(`pages scanned          : ${pages.length}`)
console.log(`sources linked internally: ${rows.length}`)

if (rows.length === 0) {
  console.log('\nPASS: no internal link points at a URL we redirect away from.')
  process.exit(0)
}

console.error('')
console.error('FAIL: internal links point at URLs that 301. Each one costs the')
console.error('visitor a round trip and tells a crawler to go somewhere else.')
for (const [url, where] of rows) {
  console.error('')
  console.error(`  ${url}`)
  console.error(`    301s to ${dest.get(url)}`)
  console.error(`    linked from ${where.size} page(s): ${[...where].slice(0, 5).join(', ')}${where.size > 5 ? ' …' : ''}`)
}
console.error('')
console.error('Point the link at the destination. If it is on every page it is')
console.error('probably src/lib/nav.ts; if it is on a handful it is probably an')
console.error('absolute URL in a migrated post body under src/content/posts/.')
process.exit(1)
