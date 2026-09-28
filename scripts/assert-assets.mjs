#!/usr/bin/env node
/**
 * Every asset the built pages ask for is in the build.
 *
 *   node scripts/assert-assets.mjs        (part of `npm run verify`)
 *
 * WHY THIS IS SEPARATE FROM assert-urls.
 *
 * assert-urls walks docs/URL-INVENTORY.csv and proves every URL that ranks
 * today resolves. That is about PAGES. It has nothing to say about the things
 * a page then loads: an image, a stylesheet, a font, an og:image.
 *
 * This gate was written because of one of them. site.ts had always named
 * `/og/roars-default-1200x630.jpg` as defaultOgImage and BaseLayout put it in
 * og:image and twitter:image on all 292 pages. The file did not exist and
 * never had. Every link posted to LinkedIn, Slack or WhatsApp unfurled with no
 * card. Nothing failed, nothing logged, and it would have shipped.
 *
 * That is the shape of the whole class: a missing asset is a 404 the visitor's
 * browser absorbs quietly. The page still renders. So the build has to be the
 * thing that notices.
 *
 * WHAT IS EXEMPT, AND WHY.
 *
 *   /wp-content/uploads/*   Served by nginx from the WordPress uploads
 *                           directory, aliased in docs/DEPLOYMENT.md. These
 *                           are deliberately NOT in dist/ and asserting on
 *                           them here would fail every run. The live half is
 *                           scripts/verify-server.mjs.
 *   external URLs           Not ours to guarantee.
 *   data: and mailto: etc   Not files.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

if (!existsSync(DIST)) {
  console.error('no dist/. Run npm run build first.')
  process.exit(1)
}

const html = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.html')) html.push(p)
  }
}
walk(DIST)

const SITE = 'https://www.roarsinc.com'
/** src, href and the content= of a meta tag, which is where og:image lives. */
const ATTR = /(?:src|href|content)="([^"]+)"/g
const SKIP = /^(?:data:|mailto:|tel:|javascript:|#)/

/** A path is satisfied by the file itself, or by its index.html for a
 *  directory-format route. */
const resolves = (p) => {
  const f = join(DIST, p)
  return existsSync(f) || (p.endsWith('/') && existsSync(join(f, 'index.html')))
}

const missing = new Map()

for (const file of html) {
  const text = readFileSync(file, 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, ' ')
  for (const m of text.matchAll(ATTR)) {
    let v = m[1]
    if (SKIP.test(v)) continue
    if (v.startsWith(SITE)) v = v.slice(SITE.length)
    else if (/^https?:\/\//.test(v)) continue
    else if (!v.startsWith('/')) continue
    const path = v.split(/[?#]/)[0]
    if (!path || path === '/') continue
    if (path.startsWith('/wp-content/uploads/')) continue
    /* Only assets. A route that does not resolve is assert-urls' job, and
       checking it here would double-report every held-back page. */
    if (!/\.[a-z0-9]{2,5}$/i.test(path)) continue
    if (resolves(path)) continue
    const rel = file.slice(DIST.length) || '/'
    if (!missing.has(path)) missing.set(path, new Set())
    missing.get(path).add(rel)
  }
}

console.log('--- assert-assets ---')
console.log(`pages scanned: ${html.length}`)

if (missing.size) {
  console.error(`\nFAIL: ${missing.size} asset path(s) referenced but not in dist/:\n`)
  for (const [path, pages] of [...missing].sort((a, b) => b[1].size - a[1].size)) {
    const list = [...pages]
    console.error(`    ${path}`)
    console.error(`        on ${list.length} page(s), e.g. ${list.slice(0, 3).join(', ')}`)
  }
  console.error('\nA missing asset is a 404 the browser swallows. Nothing ships until these resolve.')
  process.exit(1)
}

console.log('PASS: every referenced asset is in the build.')
