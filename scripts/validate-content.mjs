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
/**
 * Everything the page actually says, not just its markdown body.
 *
 * The industry and service templates carry most of their copy in structured
 * front matter — the hero statement, the six journey moments, the surfaces
 * tabs, the featured project, the closing CTA. All of it is rendered. Counting
 * only the markdown body measured a fraction of the page and called four real
 * pages thin while their word count was double the floor.
 *
 * Machinery is excluded: URLs, labels, tag lists and the sector navigation,
 * which is identical on every page and would flatter the uniqueness ratio.
 */
const SKIP_KEYS = new Set([
  'href', 'ctaHref', 'ctaLabel', 'label', 'footerTagline', 'n', 'suffix',
  'primaryIntent', 'schemaType', 'eyebrow', 'sectors', 'tags', 'time',
  'statuses', 'statusLabel', 'totalLabel', 'footnote', 'paid', 'meta',
])
function frontMatterProse(data) {
  const out = []
  const walk = (v, key) => {
    if (SKIP_KEYS.has(key)) return
    if (typeof v === 'string') {
      // A word with a space in it is copy; a slug or a token is not.
      if (v.includes(' ')) out.push(v)
      return
    }
    if (Array.isArray(v)) return v.forEach((x) => walk(x, key))
    if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) walk(x, k)
    }
  }
  /* Industry keys and service keys. The service template carries its copy in
     bands, process, featured, receipts and close — none of which were in this
     list, so eight real service pages counted about 150 words when they carry
     four times that. */
  /* Resource keys. A guide's designed page renders `summary` in the hero and
     `sections` in the long read, and never mounts <Content />, so the markdown
     body of a designed guide is not on the page at all. Counting only the body
     measured the one part of a guide nobody sees, and would have passed a page
     with nine hundred words of front matter and an empty section list. */
  for (const k of [
    'headline', 'standfirst', 'hero', 'journey', 'surfaces', 'proof', 'cta',
    'bands', 'process', 'featured', 'receipts', 'close', 'faq',
    'summary', 'sections',
  ]) {
    if (data[k] !== undefined) walk(data[k], k)
  }
  return out.join(' ')
}
const pageText = (data, body) => `${frontMatterProse(data)} ${prose(body)}`.trim()

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

  /**
   * MIGRATED entries carry the metadata WordPress actually served. Nine of
   * the twenty journal titles and eleven descriptions are over the SERP
   * limits on live URLs today; rewriting them would be inventing content,
   * which the migration brief forbids. They WARN so the debt is printed on
   * every run, and still FAIL for anything authored here.
   */
  const soft = data.migrated === true ? warn : fail

  // --- SEO fields ---
  if (!s.title) fail(file, 'seo.title', 'missing')
  else if (s.title.length < TITLE_MIN || s.title.length > TITLE_MAX) {
    soft(file, 'seo.title', `${s.title.length} chars, needs ${TITLE_MIN}-${TITLE_MAX}. Aim for 50-60.`)
  }

  if (!s.description) fail(file, 'seo.description', 'missing')
  else if (s.description.length < DESC_MIN || s.description.length > DESC_MAX) {
    soft(file, 'seo.description', `${s.description.length} chars, needs ${DESC_MIN}-${DESC_MAX}. Aim for 140-160.`)
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

  /* --- The unique-asset rule ---
   *
   * "Every page must carry at least one asset that cannot exist on any other
   * page." A named client and what changed for them, a real number with its
   * unit and timeframe, a constraint only this service deals with, or a real
   * artefact. A page with none of those is a holding page in a costume, and
   * twelve of them teach a search engine that the site is generic.
   *
   * The check is deliberately crude: it looks for a case study link, a figure
   * with a unit, or an exclusion list, because those are the three shapes the
   * rule takes in this schema. It is a floor, not a judgement about quality.
   */
  if (e.collection === 'services' || e.collection === 'industries') {
    const asset =
      Boolean(data.anchor?.href) ||
      Boolean(data.featured?.href) ||
      Boolean(data.proof?.featured?.href) ||
      Boolean(data.frame?.proof?.value) ||
      (data.scope?.excludes?.length ?? 0) > 0 ||
      /\b\d+([.,]\d+)?\s*(%|x|weeks?|days?|hours?|months?)\b/i.test(
        `${data.frame?.h1 ?? ''} ${data.cost?.body ?? ''} ${data.hero?.statement ?? ''}`,
      )
    if (!asset && data.needsReview !== true) {
      fail(
        file, 'no unique asset',
        'nothing on this page could not appear on another one. Add a named client and ' +
          'what changed, a number with its unit and timeframe, a constraint only this ' +
          'page has, or a real artefact. Or leave the page as a holding page.',
      )
    }
  }

  /* --- House style ---
   *
   * No em dashes and no en dashes used as punctuation. They are the surest
   * tell that a machine wrote the sentence, and this site's copy is meant to
   * sound like a person. A hyphen inside a word is fine.
   */
  /* Prose only. The design uses a dash as a GLYPH in two places: the section
     counter, "INDUSTRIES / 04 — 09", and a tracked label like
     "3-6 WEEKS TO PILOT". Those are typography, not sentences, and rewriting
     them to "04, 09" would be nonsense. */
  const prosey = { ...data }
  delete prosey.eyebrow
  const dashes = [...`${JSON.stringify(prosey)} ${body}`.matchAll(/\S*[\u2014\u2013]\S*/g)]
    .map((m) => m[0])
    .filter((x) => !/^[a-z]+\u2013[a-z]+$/i.test(x))
    // a tracked uppercase label, e.g. "3-6 WEEKS TO PILOT"
    .filter((x) => !/^[\d\u2013\u2014]+$/.test(x.replace(/[",]/g, '')))
  if (dashes.length) {
    warn(file, 'em dash', `${dashes.length} found, e.g. ${dashes.slice(0, 2).join(' , ')}. Use a comma, a full stop or a colon.`)
  }

  // --- Body ---
  const text = pageText(data, body)
  const count = words(text).length
  if (count < MIN_WORDS) {
    /* needsRewrite is the flag for exactly this: high impressions, near-zero
       clicks, copy that is known to be too thin. It is tracked rather than
       hidden — every run prints it. */
    ;(data.needsRewrite === true ? warn : fail)(
      file, 'thin content', `${count} words, needs at least ${MIN_WORDS}.`,
    )
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
      /* The migration brief: preserve real alt text, and where it is missing
         leave it empty and LIST it. Inventing alt from a filename is worse
         than none — "874700.jpeg" describes nothing. */
      soft(file, 'image without alt', `${m[2]}. Use alt="" only for decorative images.`)
    }
  }

  // --- Internal links ---
  for (const m of body.matchAll(/(!?)\[[^\]]*\]\((\/[^)]*)\)/g)) {
    if (m[1] === '!') continue // an image, not a link
    let href = m[2].split('#')[0].split('?')[0]
    if (!href) continue
    /* Assets are files, not pages. /wp-content/uploads/x.jpg has no trailing
       slash and never will, and it is not in the URL inventory either. */
    if (href.startsWith('/wp-content/') || href.startsWith('/tools/') || /\.[a-z0-9]{2,5}$/i.test(href)) continue
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
    const siblings = group.filter((o) => o !== e).map((o) => pageText(o.data, o.body))
    const ratio = uniqueRatio(pageText(e.data, e.body), siblings)

    /* The prose on its own, as well as the whole page.
     *
     * Counting the structured front matter is right for the page as a crawler
     * sees it, but it also lifts two pages whose PROSE is nearly identical
     * over the line, because their journey and surfaces blocks differ. That is
     * how /travel-and-hospitality/ and /retail-ecommerce/ — 29% and 34% unique
     * against each other in body copy alone — stopped being reported the
     * moment the measurement got more generous. Both numbers stay visible. */
    const bodyRatio = uniqueRatio(
      prose(e.body),
      group.filter((o) => o !== e).map((o) => prose(o.body)),
    )
    if (bodyRatio < UNIQUE_WARN && e.body.trim()) {
      warn(
        e.file,
        'near-duplicate prose',
        `body copy is ${Math.round(bodyRatio * 100)}% unique versus other ${collection} ` +
          `(whole page ${Math.round(ratio * 100)}%). Two pages that say the same thing ` +
          'in different slots are still two pages that say the same thing.',
      )
    }
    if (ratio < UNIQUE_BLOCK) {
      fail(e.file, 'not unique enough', `${Math.round(ratio * 100)}% unique versus other ${collection}. Needs over ${UNIQUE_BLOCK * 100}%. If the only difference is a noun swap, it should be one page.`)
    } else if (ratio < UNIQUE_WARN) {
      warn(e.file, 'thin uniqueness', `${Math.round(ratio * 100)}% unique versus other ${collection}.`)
    }
  }
}

/* -------------------------------------------- the guide allowlist in PHP */

/**
 * public/api/contact.php holds a hardcoded list of guide slugs. It is the only
 * thing standing between a POSTed string and a filename, so it has to be a
 * literal in the PHP — but a literal drifts, and a slug that falls off it is a
 * guide whose download silently stops working.
 *
 * So it is checked against the inventory here, in both directions. This is the
 * same reasoning as assert-styles: the failure mode is silence, so something
 * has to fail loudly instead.
 */
const ENDPOINT = join(ROOT, 'public/api/contact.php')
if (existsSync(ENDPOINT)) {
  const php = readFileSync(ENDPOINT, 'utf8')
  const block = php.match(/const GUIDE_SLUGS = \[([\s\S]*?)\];/)
  if (!block) {
    errors.push({
      file: 'public/api/contact.php',
      rule: 'guide-allowlist',
      msg: 'GUIDE_SLUGS is gone. The guide download resolves a filename from a POSTed slug and that list is what makes it safe.',
    })
  } else {
    const inPhp = new Set([...block[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]))
    const inCsv = new Set(
      [...inventoryPaths]
        .filter((p) => /^\/resources\/[^/]+\/$/.test(p))
        .map((p) => p.split('/')[2]),
    )
    for (const slug of inCsv) {
      if (!inPhp.has(slug)) {
        errors.push({
          file: 'public/api/contact.php',
          rule: 'guide-allowlist',
          msg: `/resources/${slug}/ is in the inventory but not in GUIDE_SLUGS, so its download would be refused.`,
        })
      }
    }
    for (const slug of inPhp) {
      if (!inCsv.has(slug)) {
        errors.push({
          file: 'public/api/contact.php',
          rule: 'guide-allowlist',
          msg: `GUIDE_SLUGS carries "${slug}", which is not a /resources/ row in the inventory.`,
        })
      }
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
