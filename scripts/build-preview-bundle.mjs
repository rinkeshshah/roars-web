#!/usr/bin/env node
/**
 * Bundle one built page from dist/ into a self-contained folder that can be
 * published as an Artifact for review.
 *
 *   node scripts/build-preview-bundle.mjs <page-path> <out-dir>
 *   node scripts/build-preview-bundle.mjs / /tmp/preview
 *   node scripts/build-preview-bundle.mjs /approach/ /tmp/preview-approach
 *
 * WHY IT IS NOT A COPY. The build writes root-absolute asset paths, which only
 * resolve when the site is served from a domain root. An artifact is not, so
 * every reference has to be rewritten — and there are three kinds, each with a
 * different base:
 *
 *   src / href / srcset   resolve against the DOCUMENT  -> plain relative
 *   url() in an inline    is substituted into a rule that lives in a stylesheet
 *     custom property     under astro/, so it resolves against THAT SHEET
 *                         -> needs ../ , which also resolves correctly from the
 *                            document because .. clamps at the root
 *   url() inside a .css   resolves against the sheet     -> needs ../
 *
 * Getting the second one wrong is not loud: the page renders, and the Roars
 * mark, the grain texture and the two star marks quietly do not, because they
 * are CSS masks pointed at astro/astro/… Found that way once already.
 *
 * `_astro` is also renamed to `astro`: the artifact service reserves published
 * paths starting with an underscore.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const page = process.argv[2] ?? '/'
const OUT = process.argv[3]
if (!OUT) {
  console.error('usage: build-preview-bundle.mjs <page-path> <out-dir>')
  process.exit(1)
}

const src = join(DIST, page.replace(/^\/|\/$/g, ''), 'index.html')
if (!existsSync(src)) {
  console.error(`no build output at ${src}. Run npm run build first.`)
  process.exit(1)
}

let html = readFileSync(src, 'utf8')

const refs = new Set()
for (const m of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) refs.add(m[1])
for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const part of m[1].split(',')) {
    const u = part.trim().split(' ')[0]
    if (u.startsWith('/')) refs.add(u)
  }
}
for (const m of html.matchAll(/url\((\/[^)"']+)\)/g)) refs.add(m[1])

/* Longest first, so /a/b.png is rewritten before any /a prefix of it. */
/* isFile, not exists: a link to another page — /our-journal/<slug>/ — is a
   real DIRECTORY in dist/, so an exists check calls it an asset and the copy
   dies on EISDIR. Page links are left alone; they simply do not resolve inside
   a one-page bundle, which is what a preview of one page means. */
const isFile = (p) => {
  try {
    return statSync(join(DIST, p)).isFile()
  } catch {
    return false
  }
}
const assets = [...refs].filter(isFile).sort((a, b) => b.length - a.length)
const published = (a) => {
  const r = a.replace(/^\//, '')
  return r.startsWith('_astro/') ? 'astro/' + r.slice('_astro/'.length) : r
}

for (const a of assets) {
  const r = published(a)
  html = html.split(`url(${a})`).join(`url(../${r})`)
  html = html.split(`"${a}"`).join(`"${r}"`)
  html = html.split(`"${a} `).join(`"${r} `)
  html = html.split(` ${a} `).join(` ${r} `)
  html = html.split(`,${a} `).join(`,${r} `)
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'home.html'), html)

const files = { 'home.html': 'home.html' }
for (const a of assets) {
  const r = published(a)
  const dest = join(OUT, r)
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(join(DIST, a), dest)
  files[r] = r
}

const astroDir = join(OUT, 'astro')
if (existsSync(astroDir)) {
  for (const f of readdirSync(astroDir)) {
    if (!f.endsWith('.css')) continue
    const p = join(astroDir, f)
    const before = readFileSync(p, 'utf8')
    const after = before.replace(/url\(\/([^)"']+)\)/g, 'url(../$1)')
    if (after !== before) writeFileSync(p, after)
  }
}

writeFileSync(join(OUT, 'files.json'), JSON.stringify(files, null, 0))
console.log(`${page} -> ${OUT}  (${assets.length} assets)`)
