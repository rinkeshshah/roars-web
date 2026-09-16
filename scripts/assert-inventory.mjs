#!/usr/bin/env node
/**
 * CROSS-CHECKS THE INVENTORY AGAINST EVERYTHING ELSE THAT NAMES A URL.
 *
 * WHY THIS EXISTS. assert-urls.mjs passed 196 of 196 while
 * /work/the-revolver-life-concierge-app/ was live, indexed, linked from the
 * production travel page and about to 404 at cutover. It passed because it
 * asks one question — does every URL in the inventory resolve — and the
 * inventory was the thing that was wrong. It came from the WordPress sitemap,
 * and a WordPress sitemap is a plugin's opinion about what exists, not a
 * record of it.
 *
 * So this gate asks the other question: what names a URL that the inventory
 * has never heard of? It reads every source in the repo that mentions a
 * roarsinc.com path and reports each one the CSV is missing.
 *
 * SOURCES IT READS
 *   1. scripts/wordpress-export/**\/out/*.json  — the migrated page bodies, in
 *      the client's own markup. Their `links` and `body` are the internal
 *      linking of the live site, which is independent of the sitemap.
 *   2. src/content/**\/*.md — every href this site now writes.
 *   3. docs/migration/*.{csv,conf} — the decision and redirect records.
 *   4. docs/search-console/pages.csv and .../links.csv — the Search Console
 *      exports. THESE ARE THE IMPORTANT ONES: Console knows about pages no
 *      reading of this repo can find, which is exactly the class of URL that
 *      got missed. The Pages export is here and is read. The Links export
 *      (top linked pages) is not, and the gate says so on every run rather
 *      than passing quietly — drop it at that path and it starts reading it.
 *
 * WHAT IT DOES NOT READ. site: queries against Google. Those need the network
 * and a person, so they stay a manual step; what this gate can do is make the
 * absence of the other sources visible on every run instead of at cutover.
 *
 * EXIT CODES. 0 pass, 1 fail. A URL found here is either added to the
 * inventory or added to IGNORED below with a reason. Never widen IGNORED to
 * make a red run green without writing down why the URL is not real.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { patternRedirects, redirectList } from '../src/lib/redirects.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const INVENTORY = join(ROOT, 'docs', 'URL-INVENTORY.csv')

/* The prefixes that hold real content. A path outside these is a WordPress
   artefact, an asset or somebody else's site, and not this gate's business. */
const WATCHED = ['/work/', '/industries/', '/industry/', '/s/', '/our-journal/']

/**
 * Paths that turn up in the sources but are not pages of this site, with the
 * reason each one is not. Anything not listed here has to be explained before
 * it can be silenced.
 */
const IGNORED = new Map([
  ['/our-journal/page/', 'WordPress pagination stub, never a page on its own.'],
  ['/work/page/', 'WordPress pagination stub.'],
])

/* -------------------------------------------------------------- helpers */

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (name === 'node_modules' || name === '__pycache__') continue
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

/** Normalise to a site-root path with both slashes, or null if it is not one. */
const toPath = (raw) => {
  let u = String(raw).trim().replace(/[)\]'",;]+$/, '')
  u = u.replace(/^https?:\/\/(www\.|dev\.)?roarsinc\.com/i, '')
  if (!u.startsWith('/')) return null
  u = u.split('#')[0].split('?')[0]
  if (!u.endsWith('/')) u += '/'
  if (extname(u.slice(0, -1))) return null // a file, not a page
  return u
}

const inWatched = (p) => WATCHED.some((w) => p.startsWith(w) && p.length > w.length)

/* ------------------------------------------------------------ inventory */

const inventory = new Set()
for (const line of readFileSync(INVENTORY, 'utf8').split('\n').slice(1)) {
  const first = line.split(',')[0]
  const p = first && toPath(first)
  if (p) inventory.add(p)
}

/* ------------------------------------------------------------ redirects
 *
 * A URL that is in the inventory is one this site answers. A URL that has a
 * 301 is one this site answers too, just with a different status code, so it
 * is not a finding either. The question this gate asks is narrower than it
 * looks: what would 404?
 *
 * Both layers count — the map in src/lib/redirects.mjs that becomes nginx
 * rules, and the Apache directives in docs/migration/*.conf that ship as
 * dist/.htaccess. A 410 counts as covered as well: the page is deliberately
 * gone, which is a decision, not an oversight. */
const redirectSources = new Set()
const redirectPatterns = patternRedirects.map((r) => new RegExp(r.pattern))

for (const r of redirectList) {
  const p = toPath(r.source)
  if (p) redirectSources.add(p)
}

for (const file of walk(join(ROOT, 'docs', 'migration')).filter((f) => f.endsWith('.conf'))) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim()
    if (t.startsWith('#')) continue
    const exact = t.match(/^Redirect\s+(?:301|410)\s+(\S+)/i)
    if (exact) {
      const p = toPath(exact[1])
      if (p) redirectSources.add(p)
      continue
    }
    const match = t.match(/^RedirectMatch\s+(?:301|410)\s+(\S+)/i)
    if (match) {
      try {
        redirectPatterns.push(new RegExp(match[1]))
      } catch {
        /* An Apache regex node cannot parse is the .conf's problem, not this
           gate's. It shows up as an uncovered URL, which is the safe way to
           be wrong. */
      }
    }
  }
}

const covered = (p) =>
  inventory.has(p) || redirectSources.has(p) || redirectPatterns.some((re) => re.test(p))

/* --------------------------------------------------------------- scan */

/** path -> Set of the files that named it. */
const found = new Map()
const note = (path, where) => {
  if (!found.has(path)) found.set(path, new Set())
  found.get(path).add(where)
}

/**
 * The lookbehind and the greedy tail are both load-bearing.
 *
 *   (?<![\w.:-])  stops the pattern matching mid-path. Without it
 *                 /category/our-journal/business/page/2/ reports as
 *                 /our-journal/business/, and scripts/wordpress-export/work/out/
 *                 reports as /work/out/. Both are substrings of something that
 *                 is not a URL of this site, and both were false findings on
 *                 the first run.
 *
 *   [\w./~%-]+    runs across slashes so a path is captured whole. Stopping at
 *                 the first segment turns /work/parqly/device.jpg into
 *                 /work/parqly/, which is a directory in public/, not a page,
 *                 and the extension check in toPath never gets to see it.
 */
const URL_RE =
  /(?<![\w.:-])(?:https?:\/\/(?:www\.|dev\.)?roarsinc\.com)?\/(?:work|industries|industry|s|our-journal)\/[A-Za-z0-9._~%/-]+\/?/g

const scan = (file) => {
  const text = readFileSync(file, 'utf8')
  const rel = file.slice(ROOT.length + 1)
  for (const hit of text.match(URL_RE) ?? []) {
    const p = toPath(hit)
    if (p && inWatched(p)) note(p, rel)
  }
}

const sources = [
  ...walk(join(ROOT, 'scripts', 'wordpress-export')).filter((f) => f.endsWith('.json')),
  ...walk(join(ROOT, 'src', 'content')).filter((f) => f.endsWith('.md')),
  ...walk(join(ROOT, 'docs', 'migration')).filter(
    (f) => f.endsWith('.csv') || f.endsWith('.conf'),
  ),
]

const GSC = [
  join(ROOT, 'docs', 'search-console', 'pages.csv'),
  join(ROOT, 'docs', 'search-console', 'links.csv'),
]
const gscPresent = GSC.filter((f) => existsSync(f))
sources.push(...gscPresent)

for (const f of sources) scan(f)

/* ------------------------------------------------------------- verdict */

const missing = [...found.keys()]
  .filter((p) => !covered(p))
  .filter((p) => ![...IGNORED.keys()].some((i) => p.startsWith(i)))
  .sort()

console.log('--- assert-inventory ---')
console.log(`inventory URLs    : ${inventory.size}`)
console.log(`redirect sources  : ${redirectSources.size} exact, ${redirectPatterns.length} pattern`)
console.log(`sources scanned   : ${sources.length} file(s)`)
console.log(`URLs found in them: ${found.size}`)
console.log(
  `Search Console    : ${
    gscPresent.length === 2
      ? 'both exports read'
      : `${gscPresent.length} of 2 present — put the Pages and Links exports at ` +
        'docs/search-console/pages.csv and docs/search-console/links.csv'
  }`,
)

if (missing.length) {
  console.error(
    `\nFAIL: ${missing.length} URL(s) named in the repo are neither in the ` +
      'inventory nor covered by a redirect:',
  )
  for (const p of missing) {
    console.error(`    ${p}`)
    for (const w of found.get(p)) console.error(`        named in ${w}`)
  }
  console.error('\nEach one is a page that has to be built and added to')
  console.error('docs/URL-INVENTORY.csv, a URL that needs a 301, or a dead link')
  console.error('to be fixed at its source. Doing nothing means a 404 at cutover.')
  process.exit(1)
}

console.log('\nPASS: every URL named anywhere in the repo is in the inventory')
console.log('      or covered by a redirect.')
if (gscPresent.length < 2) {
  console.log('NOTE: this is a pass over the repo only. The Search Console exports')
  console.log('      are the half that finds pages no file here mentions, and they')
  console.log('      are not present. Cutover is not clear until they are.')
}
