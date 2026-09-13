#!/usr/bin/env node
/**
 * THE GUARD. Nothing ships without this passing.
 *
 * Reads docs/URL-INVENTORY.csv and asserts that every one of the 194 live URLs
 * either has a built page in dist/ or appears in the redirect map. A URL that
 * has neither would 404 on launch, and a 404 on a page with twenty years of
 * accumulated ranking equity is a permanent loss that nobody notices for weeks.
 *
 * Run AFTER `astro build` and AFTER `generate-nginx-redirects.mjs`.
 *
 *   node scripts/assert-urls.mjs
 *   node scripts/assert-urls.mjs --phase 0-3   # allow known-unbuilt routes
 *
 * Exit codes: 0 pass, 1 fail. Never make a failure non-fatal in CI.
 *
 * It also asserts two things about what shipped, because both are silent
 * failures that only show up in a crawler weeks later:
 *
 *   1. No meta-refresh redirect pages in dist/. Astro's built-in `redirects`
 *      emit those in static output, and they pass equity poorly. Real 301s
 *      come from nginx via generate-nginx-redirects.mjs. See PHASE GATING
 *      below for why the config only applies them in dev.
 *   2. Every built page is directory-format (`<route>/index.html`), which is
 *      what lets nginx serve the trailing-slash URL with no rewrite.
 *
 * PHASE GATING
 * ------------
 * Before Phase 6 most routes do not exist yet, so a bare run would fail on
 * ~194 counts and teach everyone to ignore it. `--phase` takes the highest
 * completed build phase and only enforces the routes that phase should have
 * produced. The full set is enforced from Phase 6, and `--phase 6` (or no
 * flag at all) is what the cutover gate runs.
 *
 * Never widen a phase's expected set to make a red run green. That inverts
 * the point of the file.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const INVENTORY = join(ROOT, 'docs', 'URL-INVENTORY.csv')

/* ---------------------------------------------------------------- args */

const args = process.argv.slice(2)
const phaseArg = args.includes('--phase')
  ? args[args.indexOf('--phase') + 1]
  : process.env.BUILD_PHASE || '6'
/** Highest completed phase. "0-3" and "3" both mean the same thing. */
const PHASE = Number(String(phaseArg).split('-').pop())

/** The root-level pages phase 4 builds, by path. */
const PHASE_4_PAGES = new Set([
  '/about-us/',
  '/approach/',
  '/contact-us/',
  '/terms-of-service/',
  '/privacy-policy/',
  '/resources/',
  // Live and indexed, no design spec. Built as real routes so the URLs keep
  // resolving; bodies arrive with the content migration.
  '/startup-consultant-services/',
  '/vision-pro-app-development/',
  '/terrapay-payment-api-integration-services/',
])

/**
 * DEFERRED. Live, indexed URLs that no phase covers yet.
 *
 * Printed on every run so the exclusion stays visible instead of quietly
 * becoming permanent. Nothing here is an oversight; each row says what it is
 * waiting on. The list must be empty before cutover, because phase 6 enforces
 * the full inventory and any survivor here fails the build then.
 */
const DEFERRED = new Map([
  ['/product-development-agency-in-london/', 'UK city pages: open decision, docs/URL-INVENTORY-FINDINGS.md §3'],
  ['/product-development-agency-in-manchester/', 'UK city pages: open decision, shared imagery with the London page'],
  ['/product-development-agency-in-birmingham/', 'UK city pages: open decision, shared Elementor thumbnail'],
  ['/ui-ux-design-services-london/', 'UK city pages: open decision, and two naming conventions to reconcile'],
  ['/ui-ux-design-services-bristol/', 'UK city pages: open decision'],
  ['/ui-and-ux-design-agency-birmingham/', 'UK city pages: open decision, non-standard slug pattern'],
  ['/ui-and-ux-design-agency-manchester/', 'UK city pages: open decision, non-standard slug pattern'],
  ['/thankyou/', 'utility page, marked noindex in the inventory; not a page to design'],
])

/**
 * Which inventory rows each phase is expected to have built.
 * Keyed on the CSV's own wp_type column so the mapping is checkable.
 */
const PHASE_SCOPE = {
  // Phases 0-2 build no routable pages at all: foundation, primitives and
  // schemas. Only 404 and the components page exist, neither in the inventory.
  0: () => false,
  1: () => false,
  2: () => false,
  // Phase 3 adds the homepage and nothing else.
  3: (row) => row.path === '/',
  // Phase 4 adds exactly the routes the phase brief names, plus three live
  // indexed root pages that had been missed:
  //   /about-us/ /approach/ /contact-us/ /terms-of-service/ /privacy-policy/
  //   /resources/ /resources/[slug]/ /s/[slug]/ /industries/[slug]/ /work/[slug]/
  //
  // NOT phase 4, and deliberately excluded:
  //   /work/                    the index; layout is an open design decision
  //   the seven UK city pages   keep / consolidate / retire is an open decision
  //                             (docs/URL-INVENTORY-FINDINGS.md section 3)
  //   /vision-pro-app-development/, /terrapay-.../, /schedule-ux-ui-meeting/,
  //   /startup-consultant-services/
  //                             root pages with no design spec; they belong
  //                             with the phase 5 content migration
  //   /thankyou/                utility page, marked noindex in the inventory
  //   /our-journal/             phase 5
  4: (row) =>
    row.path === '/' ||
    ['service', 'industries', 'free_stuff', 'post(work)'].includes(row.wp_type) ||
    PHASE_4_PAGES.has(row.path),
  // Phase 5 adds the journal. Everything except the /work/ index.
  5: (row) => row.path !== '/work/',
  // Phase 6 is cutover. Everything, no exceptions.
  6: () => true,
}
const inScope = PHASE_SCOPE[PHASE] ?? PHASE_SCOPE[6]

/* ----------------------------------------------------------- inventory */

/** Minimal RFC4180 parser. The notes column contains quoted commas. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { quoted = false }
      } else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((v) => v !== ''))
}

/** Path-only, always with a leading and trailing slash, for comparison. */
function toPath(url) {
  if (!url) return ''
  let p = url
  if (p.includes('://')) p = p.slice(p.indexOf('://') + 3).replace(/^[^/]*/, '')
  if (!p.startsWith('/')) p = '/' + p
  if (!p.endsWith('/')) p += '/'
  return p
}

if (!existsSync(INVENTORY)) {
  console.error(`FATAL: inventory not found at ${relative(ROOT, INVENTORY)}`)
  process.exit(1)
}

const csv = parseCsv(readFileSync(INVENTORY, 'utf8'))
const header = csv[0]
const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]))
const inventory = csv.slice(1).map((r) => ({
  url: r[idx.url],
  path: toPath(r[idx.url]),
  wp_type: r[idx.wp_type],
  action: r[idx.action],
}))

/* ------------------------------------------------------------ redirects */

const { redirectList } = await import('../src/lib/redirects.mjs')
const redirectSources = new Set(redirectList.map((r) => toPath(r.source)))
const redirectDests = new Set(redirectList.map((r) => toPath(r.destination)))

/* ----------------------------------------------------------------- dist */

if (!existsSync(DIST)) {
  console.error('FATAL: dist/ not found. Run `npm run build` first.')
  process.exit(1)
}

/** Every route dist/ actually serves, as a trailing-slash path. */
const built = new Set()
const htmlFiles = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else if (name.endsWith('.html')) {
      htmlFiles.push(full)
      const rel = relative(DIST, full)
      built.add(rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, ''))
    }
  }
})(DIST)

/* ---------------------------------------------------------------- check */

const missing = []
const viaRedirect = []
const built_ = []

for (const row of inventory) {
  if (!inScope(row)) continue
  if (built.has(row.path)) built_.push(row)
  else if (redirectSources.has(row.path)) viaRedirect.push(row)
  else missing.push(row)
}

/** A redirect whose destination does not exist is a 301 into a 404. */
const danglingDests = []
if (PHASE >= 6) {
  for (const r of redirectList) {
    const dest = toPath(r.destination)
    if (!built.has(dest)) danglingDests.push(r)
  }
}

/** Astro's built-in redirects would ship these. nginx must do the 301s. */
const metaRefresh = htmlFiles.filter((f) =>
  /<meta[^>]+http-equiv=["']?refresh/i.test(readFileSync(f, 'utf8')),
)

/** Directory format keeps trailing-slash URLs served without a rewrite. */
const flatPages = htmlFiles
  .map((f) => relative(DIST, f))
  .filter((r) => !r.endsWith('index.html') && r !== '404.html')

/* --------------------------------------------------------------- report */

const scoped = inventory.filter(inScope).length
console.log('--- assert-urls ---')
console.log(`phase                 : ${PHASE}${PHASE < 6 ? ' (partial scope)' : ' (full inventory)'}`)
console.log(`inventory URLs        : ${inventory.length}`)
console.log(`in scope for phase    : ${scoped}`)
console.log(`  built in dist/      : ${built_.length}`)
console.log(`  covered by redirect : ${viaRedirect.length}`)
console.log(`  MISSING             : ${missing.length}`)
console.log(`pages built in total  : ${built.size}`)
console.log('')

/* Deferred rows, printed every run so they cannot be quietly forgotten. */
const stillDeferred = [...DEFERRED].filter(([path]) => !built.has(path))
if (stillDeferred.length) {
  console.log(`deferred, not yet covered : ${stillDeferred.length}`)
  for (const [path, why] of stillDeferred) console.log(`    ${path}\n        ${why}`)
  console.log('    These are live, indexed URLs. Phase 6 enforces the full')
  console.log('    inventory, so each one must be built or redirected by then.')
  console.log('')
}

let failed = false

if (PHASE >= 6 && stillDeferred.length) {
  failed = true
  console.error(`FAIL: ${stillDeferred.length} deferred URL(s) are still unresolved at cutover.`)
  console.error('    Each needs a page or a redirect before phase 6 can pass.')
  console.error('')
}

if (missing.length) {
  failed = true
  console.error(`FAIL: ${missing.length} inventory URL(s) have neither a page nor a redirect:`)
  for (const m of missing.slice(0, 40)) console.error(`    ${m.path}  (${m.wp_type})`)
  if (missing.length > 40) console.error(`    ... and ${missing.length - 40} more`)
  console.error('')
}

if (danglingDests.length) {
  failed = true
  console.error(`FAIL: ${danglingDests.length} redirect(s) point at a page that does not exist:`)
  for (const r of danglingDests) console.error(`    ${r.source} -> ${r.destination}`)
  console.error('')
}

if (metaRefresh.length) {
  failed = true
  console.error(`FAIL: ${metaRefresh.length} meta-refresh page(s) in dist/.`)
  console.error('    Astro\'s built-in redirects emit these in static output and they')
  console.error('    pass equity poorly. The map belongs in nginx via')
  console.error('    generate-nginx-redirects.mjs; astro.config.mjs applies it in dev only.')
  for (const f of metaRefresh.slice(0, 10)) console.error(`    ${relative(DIST, f)}`)
  console.error('')
}

if (flatPages.length) {
  failed = true
  console.error(`FAIL: ${flatPages.length} page(s) are not directory-format:`)
  console.error('    build.format must stay "directory" so /route/index.html exists and')
  console.error('    nginx serves the trailing-slash URL with no rewrite.')
  for (const f of flatPages.slice(0, 10)) console.error(`    ${f}`)
  console.error('')
}

if (failed) {
  console.error('assert-urls FAILED. Do not deploy.')
  process.exit(1)
}

console.log(`PASS: every in-scope inventory URL resolves.`)
if (PHASE < 6) {
  console.log(`      ${inventory.length - scoped} URL(s) deferred to a later phase.`)
  console.log('      The full set is enforced from phase 6 (cutover).')
}
process.exit(0)
