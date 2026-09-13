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
 * Deliberately small YAML reader. Front matter here is flat scalars, lists of
 * scalars, and lists of {question, answer}. Pulling in a YAML parser for that
 * would be a dependency the stack does not need.
 */
function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: raw }
  const body = raw.slice(end + 4)

  const lines = raw
    .slice(3, end)
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))

  const indentOf = (l) => l.length - l.trimStart().length

  /** Parse the block of lines at `depth`, returning an object or an array. */
  function block(from, to, depth) {
    // A block is a list when its first line at this depth is a "- " item.
    const isList = lines.slice(from, to).some(
      (l) => indentOf(l) === depth && l.trim().startsWith('- '),
    )
    const out = isList ? [] : {}

    let i = from
    while (i < to) {
      const line = lines[i]
      if (indentOf(line) !== depth) { i++; continue }
      const text = line.trim()

      // Where does this entry's nested block end?
      let j = i + 1
      while (j < to && indentOf(lines[j]) > depth) j++

      if (isList) {
        const item = text.slice(2)
        const colon = item.indexOf(':')
        if (colon !== -1 && !item.startsWith('"') && !item.startsWith("'")) {
          // "- question: ..." starts an inline map that may continue below.
          const obj = {}
          obj[item.slice(0, colon).trim()] = unquote(item.slice(colon + 1).trim())
          for (let k = i + 1; k < j; k++) {
            const t = lines[k].trim()
            const c = t.indexOf(':')
            if (c !== -1) obj[t.slice(0, c).trim()] = unquote(t.slice(c + 1).trim())
          }
          out.push(obj)
        } else {
          out.push(unquote(item))
        }
        i = j
        continue
      }

      const colon = text.indexOf(':')
      if (colon === -1) { i = j; continue }
      const key = text.slice(0, colon).trim()
      const value = text.slice(colon + 1).trim()

      if (value === '') {
        // Nested block on the following lines. Its shape is decided by
        // looking at those lines, not guessed from this one.
        out[key] = j > i + 1 ? block(i + 1, j, indentOf(lines[i + 1])) : {}
      } else if (value.startsWith('[')) {
        out[key] = value
          .slice(1, -1)
          .split(',')
          .map((v) => unquote(v.trim()))
          .filter(Boolean)
      } else {
        out[key] = unquote(value)
      }
      i = j
    }
    return out
  }

  const data = lines.length ? block(0, lines.length, indentOf(lines[0])) : {}
  return { data, body }
}

const unquote = (v) =>
  (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
    ? v.slice(1, -1)
    : v

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
        const { data, body } = parseFrontMatter(raw)
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
  if (data.draft === 'true' || data.draft === true) continue

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
