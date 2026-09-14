/**
 * The journal's list, its dates, and where the page breaks fall.
 *
 * One source for both routes — /our-journal/ and /our-journal/page/N/ — so
 * page 1 and page 2 cannot disagree about how many pages there are.
 *
 * Posts come from the INVENTORY, not the collection: src/content/posts/ is
 * empty until the WXR export lands, and all 115 URLs are live and indexed
 * today. Names are the words already in the URL; nothing is invented.
 *
 * DATES: the CSV's lastmod is exactly what the design prints — the export's
 * cards read 15 May, 04 May, 11 Dec and the CSV holds 2026-05-15, 2026-05-04,
 * 2025-12-11 for those same three posts. But it is a WordPress `modified`
 * value, and only the 34 rows marked `revised` carry a real one: 37
 * never-touched rows share 2022-08-31, the import date, and the bulk-edit
 * rows cluster 14 and 10 deep on single values. Printing those would put the
 * same day on 37 cards and call it a publish date.
 *
 * So a card shows a date when it has one and shows none when it does not, and
 * the list is ordered newest first so the dated posts lead.
 */
import { inventory, nameFromSlug } from './inventory'
import { getCollection } from 'astro:content'

/** Four rows of three. Twelve keeps the page near the homepage's height. */
export const PER_PAGE = 12

export interface JournalItem {
  slug: string
  href: string
  name: string
  /** "15" — absent when the row's date is not trustworthy. */
  day?: string
  /** "May" */
  month?: string
  /** The post's own description. Migrated entries only. */
  excerpt?: string
  /** Hero, root-relative under /wp-content/uploads/. Migrated entries only. */
  hero?: string
  /** Sort key. Present even where the date is not shown, so the ordering is
   *  still roughly right rather than alphabetical. */
  sort: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * A MIGRATED entry always wins. It carries the post's real title, its real
 * publish date from WordPress, and an excerpt — none of which the inventory
 * has. Slugs without one keep the CSV's row so all 115 URLs stay listed and
 * crawlable while the rest of the export lands.
 */
const migrated = new Map(
  (await getCollection('posts')).map((e) => [e.id, e.data]),
)

export const JOURNAL: JournalItem[] = inventory
  .filter((r) => r.wpType === 'post')
  .map((r) => {
    const m = migrated.get(r.slug)
    if (m) {
      const iso = m.publishedAt.toISOString().slice(0, 10)
      const [, mm, dd] = iso.split('-')
      return {
        slug: r.slug,
        href: r.path,
        name: m.title,
        day: dd,
        month: MONTHS[Number(mm) - 1],
        excerpt: m.seo.description,
        hero: m.heroImage,
        sort: iso,
      }
    }
    const trusted = r.staleness === 'revised' && /^\d{4}-\d{2}-\d{2}$/.test(r.lastmod)
    const [y, m2, d] = r.lastmod.split('-')
    return {
      slug: r.slug,
      href: r.path,
      name: nameFromSlug(r.slug),
      day: trusted ? d : undefined,
      month: trusted ? MONTHS[Number(m2) - 1] : undefined,
      sort: r.lastmod || '0000-00-00',
    }
  })
  .sort((a, b) => b.sort.localeCompare(a.sort))

/** The lead card on page one. The newest post that has a real date. */
export const FEATURED = JOURNAL.find((p) => p.day) ?? JOURNAL[0]
/** Everything else, featured removed so it is not printed twice. */
export const REST = JOURNAL.filter((p) => p.slug !== FEATURED?.slug)

export const LAST_PAGE = Math.max(1, Math.ceil(REST.length / PER_PAGE))

export const pageItems = (page: number): JournalItem[] =>
  REST.slice((page - 1) * PER_PAGE, page * PER_PAGE)
