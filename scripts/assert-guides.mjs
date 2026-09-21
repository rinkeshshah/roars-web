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
 * It went exactly the way that sets up. The 15 PDFs lived in the WordPress
 * httpdocs/tools/. When Plesk was repointed at the `production` branch,
 * httpdocs became a checkout of a repo that has never contained them, and all
 * 15 went with it. Every download since has been a 404 with no attachment,
 * and nothing anywhere said so — contact.php treats a missing file as a soft
 * failure on purpose (the row is still saved, sales is still notified, the
 * lead is not lost), which is right for the visitor and silent for us.
 * It surfaced because a human clicked one of the links.
 *
 * THE FIX THIS GATE ASSUMES. The PDFs belong in public/tools/, in the repo,
 * so the build carries them and a redeploy cannot lose them again. Anything
 * that lives only in httpdocs survives exactly until the next deploy.
 *
 * THE EXEMPTION LIST IS THE OUTAGE, WRITTEN DOWN. Every slug below is a guide
 * whose PDF we do not have a copy of yet. It is not a list of files that are
 * allowed to be missing — it is the list of downloads that are broken right
 * now. Drop public/tools/<name>.pdf into the repo and DELETE ITS LINE, and
 * this gate holds it there for good.
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/**
 * Slugs whose PDF is not in the repo yet. Restore the file to public/tools/
 * and remove the slug. An empty set here means every guide delivers.
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

for (const g of guides) {
  const p = join(DIST, 'tools', g.file)
  if (!existsSync(p)) {
    ;(MISSING_PDFS.has(g.slug) ? stale : missing).push(g)
    continue
  }
  if (statSync(p).size === 0) empty.push(g)
  else present.push(g)
}

/* An exempt slug whose file HAS arrived is not a pass, it is a stale list.
   Left alone the exemption would quietly cover the next disappearance too. */
const returned = guides.filter((g) => MISSING_PDFS.has(g.slug) && present.some((p) => p.slug === g.slug))

console.log(`guides in the manifest : ${guides.length}`)
console.log(`PDFs in the build      : ${present.length}`)
console.log(`known missing          : ${stale.length}  (public/tools/ is empty; see the header)`)

for (const g of stale) console.log(`  missing (known): /tools/${g.file}`)

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
