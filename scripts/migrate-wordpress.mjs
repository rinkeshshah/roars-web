#!/usr/bin/env node
/**
 * Phase 5 WordPress migration.
 *
 *   node scripts/migrate-wordpress.mjs --dry-run     # report, write nothing
 *   node scripts/migrate-wordpress.mjs --wxr <file>  # not implemented yet
 *
 * STATUS
 * ------
 * The Squirrly join is complete and testable on its own. The WXR side is not
 * written: the export has not arrived, and writing a converter against a file
 * format I cannot run it on would be guesswork dressed as progress. What is
 * here is the half that has real input, and `--dry-run` reports exactly what
 * the join will produce once the WXR lands.
 *
 * WHAT SQUIRRLY GIVES US
 * ----------------------
 * docs/migration/squirrly-meta.csv, 280 rows unserialised out of the wp_qss
 * table. Hand-written titles and descriptions that are live and performing.
 * They are ported verbatim. Nothing here truncates, rewrites or "fixes" a
 * value: the build-time gate refusing an over-length title is the correct
 * outcome and the reason the gate exists.
 *
 * Two confirmations that came with the export, both recorded in CLAUDE.md:
 * wp_qss holds zero redirects, and the postmeta override query returned
 * nothing, so wp_qss is the single source and there is no precedence conflict.
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SQUIRRLY = join(ROOT, 'docs', 'migration', 'squirrly-meta.csv')
const INVENTORY = join(ROOT, 'docs', 'URL-INVENTORY.csv')

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const WXR = args.includes('--wxr') ? args[args.indexOf('--wxr') + 1] : null

/* Our own limits, from src/content.config.ts. Used to REPORT, never to edit. */
const TITLE_MAX = 65
const DESC_MAX = 165
const DESC_MIN = 120

/* ------------------------------------------------------------------ csv */

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

function readCsv(path) {
  const raw = parseCsv(readFileSync(path, 'utf8'))
  const head = raw[0].map((h) => h.trim())
  return raw.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
}

/** Path only, no trailing slash. The join key. */
function normalise(url) {
  if (!url) return ''
  let p = url.trim()
  if (p.includes('://')) {
    p = p.slice(p.indexOf('://') + 3)
    p = p.includes('/') ? p.slice(p.indexOf('/')) : '/'
  }
  if (!p.startsWith('/')) p = '/' + p
  return p.length > 1 ? p.replace(/\/+$/, '') : '/'
}

const isQueryUrl = (url) => /[?&](p|page_id|cat)=/.test(url)

/** Entities the export should already have decoded. Reported, not repaired. */
const ENTITY = /&#?\w+;/g

/* ------------------------------------------------------------- squirrly */

/**
 * Build the lookup the WXR pass will use.
 *
 * Two of the stated join rules conflict, and this is where that is resolved:
 *
 *   "54 rows carry ?p= URLs ... resolve by post_id. Do not discard them."
 *   "Ignore rows where in_inventory is no."
 *
 * Every one of the 54 ?p= rows is in_inventory=no, because a query-string URL
 * cannot match an inventory path. Applying the second rule literally would
 * discard exactly what the first rule protects. Looking at what they actually
 * are settles it: 49 are `revision` and 5 are real `post` rows. So the rule
 * that matters is post_type, not in_inventory. Revisions go, the 5 real posts
 * are kept for resolution by ID.
 */
export function loadSquirrly() {
  const rows = readCsv(SQUIRRLY)

  /** Types that are never a page: WordPress and Elementor internals. */
  const NOISE = new Set([
    'revision', 'attachment', 'elementor_library', 'elementor-hf',
    'custom_css', 'nav_menu_item', 'elementskit_content',
  ])

  const byPath = new Map()
  const byPostId = new Map()
  const dropped = []
  const pendingId = []

  for (const row of rows) {
    if (NOISE.has(row.post_type)) { dropped.push(row); continue }

    const entry = {
      postId: row.post_id || null,
      postType: row.post_type,
      url: row.url,
      // Verbatim. No trimming, no truncation, no case changes.
      title: row.title,
      description: row.description,
      ogMedia: row.og_media || null,
      inInventory: row.in_inventory === 'yes',
    }

    if (isQueryUrl(row.url)) {
      // No permalink to join on. The WXR pass resolves these by ID.
      pendingId.push(entry)
      if (entry.postId) byPostId.set(entry.postId, entry)
      continue
    }

    const path = normalise(row.url)

    // Dedupe on post_id, preferring the permalink row. Currently a no-op:
    // the export has zero duplicate post_ids. Kept as a guard so a future
    // re-export that does contain them resolves the same way rather than
    // letting whichever row happens to be last win.
    const existing = entry.postId ? byPostId.get(entry.postId) : null
    if (existing && isQueryUrl(existing.url)) {
      byPath.delete(normalise(existing.url))
    }

    byPath.set(path, entry)
    if (entry.postId) byPostId.set(entry.postId, entry)
  }

  return { rows, byPath, byPostId, pendingId, dropped }
}

/* --------------------------------------------------------------- report */

function report() {
  const { rows, byPath, byPostId, pendingId, dropped } = loadSquirrly()
  const inventory = readCsv(INVENTORY).map((r) => normalise(r.url))

  const matched = []
  const noMeta = []
  for (const path of inventory) {
    if (byPath.has(path)) matched.push(path)
    else noMeta.push(path)
  }

  /* Quality, measured from the strings themselves.
     The export's own over_limit column carries ONE value per row, so a row
     that breaks both limits reports only "title". 25 rows do exactly that,
     which is why these are recomputed rather than counted from the column. */
  const all = rows.filter((r) => !new Set([
    'revision', 'attachment', 'elementor_library', 'elementor-hf',
    'custom_css', 'nav_menu_item', 'elementskit_content',
  ]).has(r.post_type))

  const titleOver = rows.filter((r) => r.title.length > TITLE_MAX)
  const descOver = rows.filter((r) => r.description.length > DESC_MAX)
  const descUnder = rows.filter((r) => r.description.length < DESC_MIN)
  const both = rows.filter((r) => r.title.length > TITLE_MAX && r.description.length > DESC_MAX)
  const underReported = both.filter((r) => r.over_limit !== 'both')

  const stragglers = rows.flatMap((r) =>
    [...`${r.title} ${r.description}`.matchAll(ENTITY)].map((m) => ({ url: r.url, entity: m[0] })),
  )

  const L = []
  L.push('--- migrate-wordpress: squirrly join (dry run) ---')
  L.push('')
  L.push(`squirrly rows          : ${rows.length}`)
  L.push(`  real content         : ${all.length}`)
  L.push(`  dropped as internals : ${dropped.length}`)
  L.push(`joinable by permalink  : ${byPath.size}`)
  L.push(`awaiting ID resolution : ${pendingId.length}  (resolved against the WXR by post_id)`)
  L.push('')
  L.push(`inventory URLs         : ${inventory.length}`)
  L.push(`  meta found           : ${matched.length}  (${Math.round((matched.length / inventory.length) * 100)}%)`)
  L.push(`  no meta, fields left empty : ${noMeta.length}`)
  for (const p of noMeta) L.push(`      ${p}/`)
  L.push('')
  L.push('quality, ported verbatim and left for the build gate to refuse:')
  L.push(`  titles over ${TITLE_MAX}        : ${titleOver.length}   longest ${Math.max(0, ...titleOver.map((r) => r.title.length))}`)
  L.push(`  descriptions over ${DESC_MAX} : ${descOver.length}   longest ${Math.max(0, ...descOver.map((r) => r.description.length))}`)
  L.push(`  descriptions under ${DESC_MIN}: ${descUnder.length}`)
  L.push(`  breaking both limits   : ${both.length}`)
  L.push(`  under-reported by the export's over_limit column: ${underReported.length}`)
  L.push('')
  L.push(`entity stragglers      : ${stragglers.length}`)
  for (const s of stragglers.slice(0, 10)) L.push(`      ${s.entity}  ${s.url}`)
  L.push('')

  if (!WXR) {
    L.push('WXR export not supplied. The join above is what will be applied to it.')
    L.push('Nothing written.')
  }
  console.log(L.join('\n'))

  return { matched, noMeta, pendingId }
}

/* ----------------------------------------------------------------- main */

if (!existsSync(SQUIRRLY)) {
  console.error(`FATAL: ${SQUIRRLY} not found.`)
  process.exit(1)
}

if (WXR) {
  console.error('The WXR pass is not implemented yet. Run with --dry-run.')
  console.error('')
  console.error('When the export lands it must, per CLAUDE.md and scripts/README.md:')
  console.error('  - strip Elementor wrappers; real text is in .elementor-widget-container')
  console.error('  - map `date` to publishedAt, and NEVER map `modified`: 37 posts share')
  console.error('    2022-08-31, 14 share 2025-08-26, 10 share 2023-04-12. Bulk edits.')
  console.error('  - join this Squirrly lookup on by permalink, then by post_id')
  console.error('  - flag post 15170, whose title, excerpt and body are three articles')
  console.error('  - rewrite in-body wp-content URLs to local asset paths')
  process.exit(1)
}

report()
