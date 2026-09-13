#!/usr/bin/env node
/**
 * The publish gate. There is no CMS, so this is what stops a thin or
 * duplicated page shipping.
 *
 *   node scripts/validate-content.mjs
 *   node scripts/validate-content.mjs --dir src/content   # override root
 *
 * Zod (src/content.config.ts) checks one entry at a time. These are the rules
 * that need the whole set, or need the body rather than the front matter:
 *
 *   BLOCK  body under 300 words
 *   BLOCK  duplicate seo.title or seo.description anywhere in the content set
 *   BLOCK  content under 30% unique versus siblings in the same collection
 *   BLOCK  more than one h1
 *   BLOCK  images with no alt text
 *   BLOCK  missing or out-of-range seo fields (belt and braces with Zod, so
 *          this still catches them when run standalone)
 *   WARN   content 30-40% unique
 *   WARN   skipped heading levels
 *   WARN   internal link to a path that is not in the inventory
 *
 * Runs before `astro build` in CI, so a failure costs a red run rather than a
 * bad page. Exit 0 pass, 1 fail.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, extname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad, JSON_SCHEMA } from 'js-yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const dirArg = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'src/content'
const CONTENT = isAbsolute(dirArg) ? dirArg : join(ROOT, dirArg)
const INVENTORY = join(ROOT, 'docs', 'URL-INVENTORY.csv')

const MIN_WORDS = 300
const UNIQUE_BLOCK = 0.3
const UNIQUE_WARN = 0.4
const TITLE_MIN = 30, TITLE_MAX = 65
const DESC_MIN = 120, DESC_MAX = 165

const errors = []
const warnings = []
const fail = (file, rule, msg) => errors.push({ file, rule, msg })
const warn = (file, rule, msg) => warnings.push({ file, rule, msg })

/* --------------------------------------------------------- front matter */

/**
 * Front matter is parsed with js-yaml, not by hand.
 *
 * An earlier version split lines on the first colon. That is the wrong shape
 * of tool for the job: it silently mis-reads a description containing a colon,
 * a title with an escaped quote, a folded scalar, or an anchor, and a gate that
 * quietly mis-reads its input passes content it should have blocked. A parser
 * that throws on malformed input is the only kind worth having here.
 *
 * The build itself reads these files through Astro's content layer, which uses
 * the same YAML grammar and then applies the Zod schemas in
 * src/content.config.ts. Those schemas remain the authority for per-entry
 * rules. This script exists for the rules that need the whole set at once
 * (duplicates, sibling uniqueness, link targets) and to fail fast in CI before
 * `astro build` runs, which is why it cannot simply call getCollection():
 * `astro:content` only resolves inside Astro's module graph, not in a plain
 * node script.
 */
function parseFrontMatter(file, raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const close = raw.indexOf('\n---', 3)
  if (close === -1) {
    throw new Error(`${file}: front matter opens with --- but never closes.`)
  }
  const head = raw.slice(3, close)
  const body = raw.slice(close + 4)

  let data
  try {
    data = yamlLoad(head, { filename: file, schema: JSON_SCHEMA })
  } catch (err) {
    // Loud, with the line number, rather than a silent empty object.
    throw new Error(`${file}: invalid YAML front matter.\n    ${err.message}`)
  }

  if (data === null || data === undefined) return { data: {}, body }
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${file}: front matter must be a mapping, got ${Array.isArray(data) ? 'a list' : typeof data}.`)
  }
  return { data, body }
}

/* -------------------------------------------------------------- helpers */

const WORD = /[a-z0-9']+/g
const STOP = new Set(
  `a an and are as at be but by for from has have how if in into is it its of on or that the
   their they this to was were what when where which who why will with you your our we us can
   do does not no more most other some such than then these those about after before over under`
    .split(/\s+/),
)

const words = (t) => t.toLowerCase().match(WORD) || []
const meaningful = (t) => words(t).filter((w) => !STOP.has(w) && w.length > 2)

/** Strip code fences, then markdown syntax, leaving prose. */
function prose(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>#|-]/g, ' ')
}

/** Trigram overlap. Template boilerplate counts, which is the point. */
function uniqueRatio(text, siblings) {
  const shingles = (s) => {
    const w = meaningful(s)
    const out = new Set()
    for (let i = 0; i + 2 < w.length; i++) out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`)
    return out
  }
  const mine = shingles(text)
  if (!mine.size) return 0
  const theirs = new Set()
  for (const s of siblings) for (const g of shingles(s)) theirs.add(g)
  let shared = 0
  for (const g of mine) if (theirs.has(g)) shared++
  return (mine.size - shared) / mine.size
}

/* ------------------------------------------------------------ inventory */

let inventoryPaths = new Set()
if (existsSync(INVENTORY)) {
  for (const line of readFileSync(INVENTORY, 'utf8').split('\n').slice(1)) {
    const url = line.split(',')[0]
    if (!url) continue
    let p = url.includes('://') ? url.slice(url.indexOf('://') + 3).replace(/^[^/]*/, '') : url
    if (!p.startsWith('/')) p = '/' + p
    if (!p.endsWith('/')) p += '/'
    inventoryPaths.add(p)
  }
}

/* ----------------------------------------------------------------- load */

const entries = []
if (existsSync(CONTENT)) {
  for (const collection of readdirSync(CONTENT)) {
    const dir = join(CONTENT, collection)
    if (!statSync(dir).isDirectory() || collection.startsWith('_')) continue
    ;(function walk(d) {
      for (const name of readdirSync(d)) {
        const full = join(d, name)
        if (statSync(full).isDirectory()) { walk(full); continue }
        if (!['.md', '.mdx'].includes(extname(name))) continue
        const raw = readFileSync(full, 'utf8')
        const { data, body } = parseFrontMatter(relative(ROOT, full), raw)
        entries.push({ file: relative(ROOT, full), collection, data, body })
      }
    })(dir)
  }
}

/* ---------------------------------------------------------------- rules */

const byCollection = new Map()
for (const e of entries) {
  if (!byCollection.has(e.collection)) byCollection.set(e.collection, [])
  byCollection.get(e.collection).push(e)
}

const titles = new Map()
const descriptions = new Map()

for (const e of entries) {
  const { file, data, body } = e
  const s = data.seo || {}
  if (data.draft === true) continue

  // --- SEO fields ---
  if (!s.title) fail(file, 'seo.title', 'missing')
  else if (s.title.length < TITLE_MIN || s.title.length > TITLE_MAX) {
    fail(file, 'seo.title', `${s.title.length} chars, needs ${TITLE_MIN}-${TITLE_MAX}. Aim for 50-60.`)
  }

  if (!s.description) fail(file, 'seo.description', 'missing')
  else if (s.description.length < DESC_MIN || s.description.length > DESC_MAX) {
    fail(file, 'seo.description', `${s.description.length} chars, needs ${DESC_MIN}-${DESC_MAX}. Aim for 140-160.`)
  }

  if (!s.primaryIntent) fail(file, 'seo.primaryIntent', 'missing. One page owns one intent.')

  if (s.title) {
    if (titles.has(s.title)) fail(file, 'duplicate title', `same seo.title as ${titles.get(s.title)}`)
    else titles.set(s.title, file)
  }
  if (s.description) {
    if (descriptions.has(s.description)) {
      fail(file, 'duplicate description', `same seo.description as ${descriptions.get(s.description)}`)
    } else descriptions.set(s.description, file)
  }

  // --- Body ---
  const text = prose(body)
  const count = words(text).length
  if (count < MIN_WORDS) {
    fail(file, 'thin content', `${count} words, needs at least ${MIN_WORDS}.`)
  }

  // --- Headings ---
  const headings = [...body.matchAll(/^(#{1,6})\s+(.*)$/gm)].map((m) => m[1].length)
  const h1s = headings.filter((h) => h === 1).length
  if (h1s > 1) {
    fail(file, 'multiple h1', `${h1s} level-1 headings. The page title is the h1; body headings start at h2.`)
  }
  let previous = 1
  for (const level of headings) {
    if (level > previous + 1) {
      warn(file, 'skipped heading level', `h${previous} followed by h${level}.`)
      break
    }
    previous = level
  }

  // --- Images ---
  for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    if (!m[1].trim()) {
      fail(file, 'image without alt', `${m[2]}. Use alt="" only for decorative images.`)
    }
  }

  // --- Internal links ---
  for (const m of body.matchAll(/\[[^\]]*\]\((\/[^)]*)\)/g)) {
    let href = m[1].split('#')[0].split('?')[0]
    if (!href) continue
    if (!href.endsWith('/')) {
      fail(file, 'internal link without trailing slash', `${href} would 301. Link the final URL.`)
      continue
    }
    if (inventoryPaths.size && !inventoryPaths.has(href)) {
      warn(file, 'link outside the inventory', `${href} is not in URL-INVENTORY.csv.`)
    }
  }
}

// --- Uniqueness against siblings ---
for (const [collection, group] of byCollection) {
  if (group.length < 2) continue
  for (const e of group) {
    const siblings = group.filter((o) => o !== e).map((o) => prose(o.body))
    const ratio = uniqueRatio(prose(e.body), siblings)
    if (ratio < UNIQUE_BLOCK) {
      fail(e.file, 'not unique enough', `${Math.round(ratio * 100)}% unique versus other ${collection}. Needs over ${UNIQUE_BLOCK * 100}%. If the only difference is a noun swap, it should be one page.`)
    } else if (ratio < UNIQUE_WARN) {
      warn(e.file, 'thin uniqueness', `${Math.round(ratio * 100)}% unique versus other ${collection}.`)
    }
  }
}

/* --------------------------------------------------------------- report */

console.log('--- validate-content ---')
console.log(`entries: ${entries.length}${entries.length === 0 ? '  (collections are empty; migration is phase 5)' : ''}`)
for (const [c, g] of byCollection) console.log(`  ${c}: ${g.length}`)
console.log('')

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`)
  for (const w of warnings) console.log(`    ${w.file}\n        ${w.rule}: ${w.msg}`)
  console.log('')
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} blocking problem(s):`)
  for (const e of errors) console.error(`    ${e.file}\n        ${e.rule}: ${e.msg}`)
  console.error('\nNothing ships until these are fixed.')
  process.exit(1)
}

console.log('PASS: content gate clean.')
