#!/usr/bin/env node
/**
 * The /our-journal/ 301s, as Apache rules, emitted into dist/.htaccess.
 *
 * Source of truth: docs/migration/roarsinc-redirects.conf, supplied with the
 * Search Console decisions, with corrections layered on from
 * docs/migration/journal-redirect-overrides.conf. Journal lines only — the
 * other sections migrate later and their rules stay out until they do.
 *
 * The supplied map is never edited. Five of its rules aimed at a target that
 * redirected to itself, a fallback bug upstream; the overrides file points
 * them at real pages and says why, next to each rule.
 *
 * ONE RULE IS STILL HELD BACK, not silently dropped:
 *
 *   loyalty-reward-program-app -> /our-journal/.
 *   That slug is on the migrate-as-is list. The decisions CSV carries the
 *   page twice, split by a trailing slash — "KEEP, earned clicks" without,
 *   "REDIRECT, no demand" with — and the map took the REDIRECT row. Shipping
 *   it would redirect a post that was just migrated. Confirmed to stay held.
 *
 * Held rules are written to the file as comments so the omission is visible
 * on the server rather than only in this script.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'docs/migration/roarsinc-redirects.conf')
const OVERRIDES = join(ROOT, 'docs/migration/journal-redirect-overrides.conf')
const ADDITIONS = join(ROOT, 'docs/migration/journal-redirect-additions.conf')
const POSTS = join(ROOT, 'src/content/posts')

const migrated = new Set(
  existsSync(POSTS) ? readdirSync(POSTS).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')) : [],
)

const strip = (u) => u.replace(/^https?:\/\/[^/]+/, '')
const slugOf = (p) => (p.match(/^\/our-journal\/([^/]+)\/$/) || [])[1]

const parse = (file) => {
  const out = []
  let why = ''
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim()
    const w = line.match(/^#\s*why:\s*(.+)$/)
    if (w) { why = w[1]; continue }
    const m = line.match(/^Redirect 301 (\S+) (\S+)$/)
    if (!m) { if (!line.startsWith('#')) why = ''; continue }
    out.push({ from: m[1], to: m[2], toPath: strip(m[2]), why })
    why = ''
  }
  return out
}

const rules = parse(SRC).filter((r) => r.from.startsWith('/our-journal/'))
const bySource = new Map(rules.map((r) => [r.from, r]))

/**
 * Apply the corrections. Both failure modes are loud, because a stale
 * override is how a fixed map quietly reverts and a redundant one is how a
 * file fills with rules nobody can tell apart from the real ones.
 */
const applied = []
for (const o of parse(OVERRIDES)) {
  const base = bySource.get(o.from)
  if (!base) {
    console.error(`FAIL: override for ${o.from} has no matching rule in the supplied map.`)
    console.error('    The upstream map changed. Re-check the override and delete it if it is done.')
    process.exit(1)
  }
  if (base.to === o.to) {
    console.error(`FAIL: override for ${o.from} sets the target the supplied map already has.`)
    console.error('    Upstream is fixed. Delete this override.')
    process.exit(1)
  }
  applied.push({ from: o.from, was: base.toPath, now: o.toPath, why: o.why })
  base.to = o.to
  base.toPath = o.toPath
}

/**
 * Rules the supplied map never had. An override cannot express these: its
 * stale-override check would reject a source the map does not list, and that
 * check is worth keeping. A source that IS in the map is rejected here for
 * the mirror-image reason, so the two files cannot both own a rule.
 *
 * Added rules go through every safety check below, exactly like the rest.
 */
const added = []
for (const a of parse(ADDITIONS)) {
  if (bySource.has(a.from)) {
    console.error(`FAIL: addition for ${a.from} is already in the supplied map.`)
    console.error('    Correct its target in journal-redirect-overrides.conf instead.')
    process.exit(1)
  }
  rules.push(a)
  bySource.set(a.from, a)
  added.push(a)
}

const sources = new Set(rules.map((r) => r.from))
const held = []
const safe = []
for (const r of rules) {
  if (r.from === r.toPath) { held.push({ ...r, why: 'redirects to itself: infinite loop' }); continue }
  const s = slugOf(r.from)
  if (s && migrated.has(s)) { held.push({ ...r, why: 'source is a migrated post; shipping this hides it' }); continue }
  const t = slugOf(r.toPath)
  // A non-migrated journal URL still resolves — it renders the noindex
  // "content pending migration" holding page — so this is not a 404. It is
  // worse in the way that matters: the source drops out of the index and
  // hands its equity to a page that is explicitly not indexable.
  if (t && !migrated.has(t)) {
    held.push({ ...r, why: `target /our-journal/${t}/ is a noindex holding page, not migrated content` })
    continue
  }
  if (sources.has(r.toPath)) { held.push({ ...r, why: 'target is itself a redirect source: would chain' }); continue }
  safe.push(r)
}

/**
 * THE TWO PHP INCLUDES ARE NOT PAGES.
 *
 * roars-smtp.php and roars-integrations.php are required by contact.php and
 * live in the document root only because that is where the deploy puts
 * everything, so each has a URL it never wanted. Both carry a ROARS_ENTRY
 * guard that answers a direct request with 403 -- this is the second lock, for
 * the case the first cannot cover: if the PHP handler is ever disabled or
 * misconfigured for this vhost, Apache serves the SOURCE, and the source of
 * the file that reads the secrets is a map to where they are.
 *
 * <FilesMatch>, not <Files>: one directive covering both, and it still matches
 * if a copy ends up in a subdirectory.
 */
const GUARDED_INCLUDES = [
  '# PHP includes, not pages. contact.php requires these; nothing fetches them.',
  '# They also guard themselves with ROARS_ENTRY -- this is the lock that still',
  '# holds if the PHP handler is ever off and Apache would serve the source.',
  '<FilesMatch "^(roars-smtp|roars-integrations|roars-secrets.*|contact-config.*|guides)\\.php$">',
  '  Require all denied',
  '</FilesMatch>',
  '',
]

/**
 * THIS NO LONGER WRITES THE FILE.
 *
 * It used to own dist/.htaccess outright, back when the journal 301s were the
 * only Apache rules the site had. They are not any more: this host's Plesk
 * hides both the nginx and the Apache directives boxes, so everything that was
 * going to be pasted into the panel — the other redirect map, the trailing
 * slash, the 410s, the headers, the caching — has to live in the same file.
 *
 * One file with several owners is a merge conflict waiting on a build, and the
 * ORDER between those sections is load-bearing: a redirect that runs after the
 * trailing-slash rule becomes a second hop. So scripts/generate-htaccess.mjs
 * owns the file and decides the order, and this exports its rules to it.
 *
 * The reporting below still runs on import, so the build log says the same
 * things it always did about what shipped and what is held back.
 */
export const journalRules = { safe, held, applied, guardedIncludes: GUARDED_INCLUDES }

console.log('--- generate-journal-htaccess ---')
console.log(`prepared ${safe.length} rule(s) for dist/.htaccess`)
if (applied.length) {
  console.log(`\nCORRECTED (${applied.length}) from journal-redirect-overrides.conf:`)
  for (const a of applied) console.log(`    ${a.from}\n        was ${a.was}\n        now ${a.now}`)
}
if (held.length) {
  console.log(`\nHELD BACK (${held.length}) — commented out in the file:`)
  for (const r of held) console.log(`    ${r.from}\n        -> ${r.toPath}\n        ${r.why}`)
}
