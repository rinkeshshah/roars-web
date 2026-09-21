#!/usr/bin/env node
/**
 * Every gated guide's PDF is actually in the build.
 *
 *   node scripts/assert-guides.mjs        (part of `npm run verify`)
 *
 * WHY THIS EXISTS, AND WHY assert-assets COULD NEVER HAVE CAUGHT IT.
 *
 * assert-assets walks the emitted HTML and proves every src/href/og:image
 * resolves in dist/. That works because those URLs are IN a page. The guide
 * PDFs are not. Nothing on the site links them: the download URL is built by
 * public/api/contact.php, in PHP, at send time, out of guides.php —
 *
 *     $url = "{$site}/tools/" . rawurlencode($guide['name']);
 *
 * and the same directory is where it looks for the bytes to attach. So the
 * one artefact the whole /resources/ funnel exists to deliver was the one
 * artefact no gate in the chain could see.
 *
 * WHAT ACTUALLY BROKE, which was not what it first looked like. The files
 * were never lost. They were in httpdocs/tools/ the whole time under
 * WordPress-era names — Business-Model-canvas.pdf, Evidence-Planning.pdf —
 * while the manifest asked for business-model-canvas.pdf. Linux serves files
 * case-sensitively, so all 15 were 404s pointing at files sitting right
 * there. Nothing said so: contact.php treats a missing file as a soft failure
 * on purpose (the row is saved, sales is notified, the lead is not lost),
 * which is right for the visitor and silent for us. It surfaced because a
 * human clicked one of the links.
 *
 * AND "IT IS A CASE MISMATCH" IS ITSELF A TRAP. Two are differently WORDED,
 * not differently cased: business-plan.pdf is Business-plans.pdf, and
 * people-connection-map.pdf is People-connection.pdf. Any fix built on
 * lowercasing and comparing repairs thirteen and leaves those two broken —
 * the two nobody would think to re-test. So this gate compares bytes and
 * never folds case to decide a pass.
 *
 * THE FIX THIS GATE ASSUMES. The PDFs belong in public/tools/, in the repo,
 * so the build carries them and no redeploy can lose them or leave them
 * renamed out from under the manifest. Anything living only in httpdocs
 * survives exactly until the next deploy.
 *
 * THE EXEMPTION LIST IS THE OUTAGE, WRITTEN DOWN. Every slug below is a guide
 * whose PDF is not in the repo yet, so it is being served by the copy on the
 * server and reached through the /tools/ redirects in the generated
 * .htaccess. Drop public/tools/<name>.pdf in and DELETE ITS LINE, and this
 * gate holds it there for good.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/**
 * Slugs whose PDF is not in the REPO yet. Copy the file into public/tools/ and
 * remove the slug. An empty set here means every guide delivers out of the
 * build and nothing depends on a file that only exists on the server.
 *
 * FOURTEEN OF THESE FIFTEEN ARE FINE IN PRODUCTION. Their PDF is in
 * httpdocs/tools/ under its WordPress-era name and the /tools/ rules in the
 * generated .htaccess carry the link there. They are listed because the
 * repository cannot see them, which is a durability problem, not an outage.
 *
 * ONE IS NOT. See NO_FILE_ANYWHERE below.
 */
const MISSING_PDFS = new Set([
  'building-partnerships',
  'business-model-canvas',
  'business-plan',
  'evidence-planning',
  'innovation-flowchart',
  'learning-loop',
  'people-connection-map',
  'pitching-checklist',
  'problem-definition',
  'product-solution-benefit',
  'prototype-testing-plan',
  'swot-analysis',
  'target-group',
  'value-proposition',
  'website-redesign-roi-calculator',
])

/**
 * A different gap, and the list must not let it hide among the others.
 *
 * website-redesign-roi-calculator has no file in httpdocs/tools/ — the folder
 * holds 14 PDFs for 15 guides — and going back through the migration there is
 * no evidence it ever had one. Its `file:` value was never read off the old
 * site: the guide was one of the five drafted in b90e5899 with no content
 * file, and the name was derived from the slug on the spot. What WAS read off
 * the live archives (scripts/resource-collections.mjs) is its title, category
 * and summary — nothing about a download. Its own frontmatter still says the
 * long read "needs checking against the PDF", a check that never happened
 * because there is nothing to check it against.
 *
 * So this is not a lost file. It is a page offering a download that may never
 * have existed. Until there is a file, every submission on it ends in an email
 * with a dead link — see docs/DEPLOYMENT.md for the options.
 */
const NO_FILE_ANYWHERE = new Set(['website-redesign-roi-calculator'])

if (!existsSync(DIST)) {
  console.error('no dist/. Run npm run build first.')
  process.exit(1)
}

/* guides.php is generated from the same frontmatter the site renders, and
   validate-content already proves it matches the inventory. Reading it here
   rather than the markdown means this gate checks the exact manifest
   contact.php will read at send time. */
const php = readFileSync(join(ROOT, 'public/api/guides.php'), 'utf8')
const guides = []
for (const m of php.matchAll(/'([a-z0-9-]+)'\s*=>\s*\[[^\]]*?'file'\s*=>\s*'([^']+)'/gs)) {
  guides.push({ slug: m[1], file: m[2] })
}

if (guides.length === 0) {
  console.error('assert-guides: read no guides out of public/api/guides.php. The')
  console.error('manifest format changed and this gate is now blind. Fix the parse.')
  process.exit(1)
}

const missing = []
const empty = []
const present = []
const stale = []
const miscased = []

/*
 * EXACT CASE, and existsSync cannot be trusted to check it.
 *
 * This is the whole bug, so the gate has to be literal about it. The files
 * were never missing: they sat in httpdocs/tools/ as Business-Model-canvas.pdf
 * while the manifest asked for business-model-canvas.pdf, and Linux said no.
 *
 * existsSync answers the filesystem's question, not ours. On Linux it is
 * case-sensitive and would catch this; on a developer's macOS or Windows
 * checkout it is not, and the mismatch would pass locally and 404 in
 * production — which is exactly the failure that got us here, one layer up.
 * So the directory is listed and the name compared as bytes, and the gate
 * gives the same answer on every machine.
 */
const dir = join(DIST, 'tools')
const onDisk = existsSync(dir) ? readdirSync(dir) : []
const byLower = new Map()
for (const name of onDisk) {
  if (!byLower.has(name.toLowerCase())) byLower.set(name.toLowerCase(), [])
  byLower.get(name.toLowerCase()).push(name)
}

for (const g of guides) {
  const exact = onDisk.includes(g.file)
  if (!exact) {
    /* A file whose name differs only in case is a different failure from a
       file that is not there, and it needs a different sentence: one is "find
       the PDF", the other is "you are one character from working". */
    const near = (byLower.get(g.file.toLowerCase()) ?? []).filter((n) => n !== g.file)
    if (near.length) { miscased.push({ ...g, near }); continue }
    ;(MISSING_PDFS.has(g.slug) ? stale : missing).push(g)
    continue
  }
  if (statSync(join(dir, g.file)).size === 0) empty.push(g)
  else present.push(g)
}

/* An exempt slug whose file HAS arrived is not a pass, it is a stale list.
   Left alone the exemption would quietly cover the next disappearance too. */
const returned = guides.filter((g) => MISSING_PDFS.has(g.slug) && present.some((p) => p.slug === g.slug))

console.log(`guides in the manifest : ${guides.length}`)
console.log(`PDFs in the build      : ${present.length}`)
console.log(`known missing          : ${stale.length}  (public/tools/ is empty; see the header)`)

for (const g of stale) {
  const note = NO_FILE_ANYWHERE.has(g.slug)
    ? 'NO FILE ANYWHERE — this download is broken in production'
    : 'served from httpdocs/tools/ via the .htaccess rules'
  console.log(`  not in repo: ${g.file.padEnd(32)} ${note}`)
}

let bad = false

if (missing.length) {
  bad = true
  console.error('')
  console.error('FAIL: a guide PDF is missing from the build and is NOT a known gap.')
  console.error('Its download link 404s and its email carries no attachment.')
  for (const g of missing) console.error(`  ${g.slug}  ->  dist/tools/${g.file}`)
  console.error('')
  console.error('Put the file in public/tools/ so the build ships it.')
}

if (empty.length) {
  bad = true
  console.error('')
  console.error('FAIL: a guide PDF is present but zero bytes.')
  for (const g of empty) console.error(`  ${g.slug}  ->  dist/tools/${g.file}`)
}

if (miscased.length) {
  bad = true
  console.error('')
  console.error('FAIL: a guide PDF is on disk under a DIFFERENT CASE. Linux serves')
  console.error('files case-sensitively, so this 404s in production even though the')
  console.error('file is right there. This is the bug that broke all 15 downloads.')
  for (const g of miscased) {
    console.error(`  ${g.slug}`)
    console.error(`      manifest wants : ${g.file}`)
    console.error(`      on disk        : ${g.near.join(', ')}`)
  }
  console.error('')
  console.error('Make the two agree: rename the file, or set `file:` in')
  console.error('src/content/resources/<slug>.md and re-run build-email-manifest.mjs.')
}

if (returned.length) {
  bad = true
  console.error('')
  console.error('FAIL: these slugs are in MISSING_PDFS but their file is now in the')
  console.error('build. Remove them from the list in scripts/assert-guides.mjs so the')
  console.error('gate starts holding them.')
  for (const g of returned) console.error(`  ${g.slug}`)
}

if (bad) process.exit(1)

if (stale.length === 0) console.log('PASS: every gated guide has its PDF in the build.')
else console.log(`PASS (with ${stale.length} known gap${stale.length === 1 ? '' : 's'}): nothing regressed.`)
