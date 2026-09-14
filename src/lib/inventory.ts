/**
 * The URL inventory, read at build time.
 *
 * docs/URL-INVENTORY.csv is the authoritative route list (CLAUDE.md rule 1),
 * so routes are generated FROM it rather than from the content collections.
 * That inverts the usual order deliberately: a slug that ranks today must get
 * a page even when its body has not been migrated yet, otherwise the URL 404s
 * at cutover and twenty years of equity goes with it.
 *
 * Pages with no collection entry render a clearly-marked pending state and
 * carry noindex. They are listed in every build report.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Resolved from the project root, not from import.meta.url. Astro bundles this
 * module into dist/.prerender before running getStaticPaths, so a URL relative
 * to the module points inside dist/ and the read fails.
 */
const CSV = join(process.cwd(), 'docs', 'URL-INVENTORY.csv')

export interface InventoryRow {
  url: string
  path: string
  slug: string
  wpType: string
  /**
   * The WordPress `modified` value, verbatim. TRUST IT ONLY WHERE
   * `staleness === 'revised'`: 37 never-touched rows share 2022-08-31, which
   * is the import date, and the bulk-edit rows cluster 14 and 10 deep on a
   * single value. See CLAUDE.md, known landmines.
   */
  lastmod: string
  /** 'revised' | 'bulk-edit-only' | 'never-touched' | '' */
  staleness: string
}

/** Minimal RFC4180 read. The notes column carries quoted commas. */
function parse(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
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

const raw = parse(readFileSync(CSV, 'utf8'))
const head = raw[0].map((h) => h.trim())
const iUrl = head.indexOf('url')
const iType = head.indexOf('wp_type')
const iMod = head.indexOf('lastmod')
const iStale = head.indexOf('staleness')

export const inventory: InventoryRow[] = raw.slice(1).map((r) => {
  const url = r[iUrl]
  let path = url.includes('://') ? url.slice(url.indexOf('://') + 3).replace(/^[^/]*/, '') : url
  if (!path.startsWith('/')) path = '/' + path
  if (!path.endsWith('/')) path += '/'
  const parts = path.split('/').filter(Boolean)
  return {
    url, path, slug: parts[parts.length - 1] ?? '', wpType: r[iType],
    lastmod: r[iMod] ?? '', staleness: r[iStale] ?? '',
  }
})

/** Every slug of one wp_type, in inventory order. */
export const slugsOf = (wpType: string): string[] =>
  inventory.filter((r) => r.wpType === wpType).map((r) => r.slug)

/**
 * Turn a slug into the page's own name. Not invented copy: it is the words
 * already in the URL, cased for display. Used only where no entry exists yet.
 */
export function nameFromSlug(slug: string): string {
  const keep: Record<string, string> = {
    ai: 'AI', ux: 'UX', ui: 'UI', mvp: 'MVP', saas: 'SaaS',
    devops: 'DevOps', ecommerce: 'eCommerce', roi: 'ROI', swot: 'SWOT',
  }
  return slug
    .split('-')
    .map((w) => keep[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
