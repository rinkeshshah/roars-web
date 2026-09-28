#!/usr/bin/env node
/**
 * The journal migration's own gate. Re-runnable, and it fails loudly.
 *
 * Checks the EMITTED HTML, not the source, because the whole point of the
 * brief is that these tags are in the file rather than injected by script.
 * Everything here was asked for explicitly in the migration brief; each
 * check names the rule it enforces.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const POSTS = join(ROOT, 'src/content/posts')
const SITE = 'https://www.roarsinc.com'

const errors = []
const warnings = []
const fail = (slug, rule, msg) => errors.push({ slug, rule, msg })
const warn = (slug, rule, msg) => warnings.push({ slug, rule, msg })

if (!existsSync(DIST)) {
  console.error('assert-journal: no dist/. Run `npm run build` first.')
  process.exit(1)
}

const slugs = readdirSync(POSTS).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
if (!slugs.length) {
  console.error('assert-journal: no posts in src/content/posts/.')
  process.exit(1)
}

const ideal = { title: 65, description: 165 }

for (const slug of slugs) {
  const file = join(DIST, 'our-journal', slug, 'index.html')
  if (!existsSync(file)) {
    fail(slug, 'trailing-slash URL', `dist/our-journal/${slug}/index.html was not emitted`)
    continue
  }
  const h = readFileSync(file, 'utf8')
  const head = h.slice(0, h.indexOf('</head>'))
  const one = (re) => (h.match(re) || [])[1]

  // --- head tags, literal in the HTML ---
  const title = one(/<title>([\s\S]*?)<\/title>/)
  if (!title) fail(slug, 'title', 'no <title>')
  else if (!title.endsWith(' | Roars')) fail(slug, 'title', `does not end "| Roars": ${title}`)

  const desc = one(/<meta name="description" content="([^"]*)"/)
  if (!desc) fail(slug, 'description', 'no meta description')

  const canon = one(/<link rel="canonical" href="([^"]*)"/)
  if (canon !== `${SITE}/our-journal/${slug}/`) fail(slug, 'canonical', `got ${canon}`)

  const need = {
    'og:type': 'article',
    'og:site_name': 'Roars',
    'twitter:card': 'summary_large_image',
  }
  for (const [k, v] of Object.entries(need)) {
    const got = one(new RegExp(`<meta (?:property|name)="${k}" content="([^"]*)"`))
    if (got !== v) fail(slug, k, `expected "${v}", got "${got}"`)
  }
  for (const k of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!new RegExp(`<meta property="${k}" content="[^"]+"`).test(head)) fail(slug, k, 'missing or empty')
  }
  const ogUrl = one(/<meta property="og:url" content="([^"]*)"/)
  if (ogUrl !== `${SITE}/our-journal/${slug}/`) fail(slug, 'og:url', `got ${ogUrl}`)

  // twitter:description must be the post's own, not scraped body text.
  const twd = one(/<meta name="twitter:description" content="([^"]*)"/)
  if (twd !== desc) fail(slug, 'twitter:description', 'does not match the post description')

  // The brief: drop meta keywords entirely.
  if (/<meta name="keywords"/i.test(head)) fail(slug, 'keywords', 'meta keywords is present')

  // --- JSON-LD ---
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1]) } catch { return null } })
  const art = blocks.find((b) => b && /BlogPosting|Article/.test(b['@type'] || ''))
  if (!art) fail(slug, 'JSON-LD', 'no Article/BlogPosting block')
  else {
    for (const k of ['headline', 'datePublished', 'dateModified', 'author', 'image']) {
      if (!art[k]) fail(slug, 'JSON-LD', `missing ${k}`)
    }
  }

  // --- body ---
  const h1s = [...h.matchAll(/<h1[\s>]/g)].length
  if (h1s !== 1) fail(slug, 'h1', `${h1s} h1 elements, expected exactly 1`)
  if (!/<time datetime="\d{4}-\d{2}-\d{2}"/.test(h)) fail(slug, 'time', 'no <time datetime="YYYY-MM-DD">')

  // Heading order: never skip a level.
  const levels = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
  let prev = 0
  for (const l of levels) {
    if (prev && l > prev + 1) { fail(slug, 'heading order', `h${prev} followed by h${l}`); break }
    prev = l
  }

  // --- the debt the migration is knowingly carrying ---
  const src = readFileSync(join(POSTS, `${slug}.md`), 'utf8')
  const isMigrated = /^migrated:\s*true/m.test(src)
  if (title && title.length > ideal.title) {
    (isMigrated ? warn : fail)(slug, 'title length', `${title.length} chars, ideal max ${ideal.title}`)
  }
  if (desc && desc.length > ideal.description) {
    (isMigrated ? warn : fail)(slug, 'description length', `${desc.length} chars, ideal max ${ideal.description}`)
  }
  if (/^needsRewrite:\s*true/m.test(src) && !h.includes('<!-- NEEDS-REWRITE -->')) {
    fail(slug, 'NEEDS-REWRITE', 'flagged in front matter but the marker is not in the HTML')
  }
}

// Descriptions must be unique: the old site served one excerpt for three posts.
const seen = new Map()
for (const slug of slugs) {
  const file = join(DIST, 'our-journal', slug, 'index.html')
  if (!existsSync(file)) continue
  const d = (readFileSync(file, 'utf8').match(/<meta name="description" content="([^"]*)"/) || [])[1]
  if (!d) continue
  if (seen.has(d)) fail(slug, 'duplicate description', `identical to ${seen.get(d)}`)
  else seen.set(d, slug)
}

console.log('--- assert-journal ---')
console.log(`posts checked: ${slugs.length}`)
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s) — migrated metadata over the ideal length, carried as-is:`)
  for (const w of warnings) console.log(`    ${w.slug}\n        ${w.rule}: ${w.msg}`)
}
if (errors.length) {
  console.error(`\nFAIL: ${errors.length} problem(s):`)
  for (const e of errors) console.error(`    ${e.slug}\n        ${e.rule}: ${e.msg}`)
  process.exit(1)
}
console.log('\nPASS: every migrated post carries its tags in the emitted HTML.')
