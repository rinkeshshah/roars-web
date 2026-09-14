/**
 * The journal's list, its dates, and where the page breaks fall.
 *
 * One source for both routes — /our-journal/ and /our-journal/page/N/ — so
 * page 1 and page 2 cannot disagree about how many pages there are.
 *
 * THE INDEX LISTS MIGRATED POSTS ONLY. It used to list all 115 inventory
 * rows, which made sense while nothing had been migrated: the URLs were live
 * and a title in a list beat no list at all. Now that the export has landed,
 * that would be a reader clicking ninety-odd cards to find that most of them
 * say "content pending migration". A journal is a reading surface, and a
 * reading surface should not advertise pages that have nothing to read.
 *
 * The unmigrated URLs still BUILD — src/pages/our-journal/[slug].astro takes
 * its paths from the inventory, not from here, so every one of them keeps
 * returning 200 with its noindex holding page. They are simply not listed.
 * They stop being orphans the moment they are migrated or redirected, and the
 * ones that are never coming back have 301s in dist/.htaccess already.
 *
 * DATES: every migrated post carries its real WordPress publish date, so
 * every card printed here is dated. The old inventory path had to hide dates
 * on 37 rows that shared the import date; that problem left with the rows.
 */
import { getCollection } from 'astro:content'

/** Four rows of three. Twelve keeps the page near the homepage's height. */
export const PER_PAGE = 12

export interface JournalItem {
  slug: string
  href: string
  name: string
  /** "15" */
  day?: string
  /** "May" */
  month?: string
  /** The post's own description, never a generated one. */
  excerpt?: string
  /** Hero, root-relative under /wp-content/uploads/. */
  hero?: string
  /** ISO date. The sort key, newest first. */
  sort: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const JOURNAL: JournalItem[] = (await getCollection('posts'))
  .map((e) => {
    const iso = e.data.publishedAt.toISOString().slice(0, 10)
    const [, mm, dd] = iso.split('-')
    return {
      slug: e.id,
      href: `/our-journal/${e.id}/`,
      name: e.data.title,
      day: dd,
      month: MONTHS[Number(mm) - 1],
      excerpt: e.data.seo.description,
      hero: e.data.heroImage,
      sort: iso,
    }
  })
  .sort((a, b) => b.sort.localeCompare(a.sort))

/** The lead card on page one. The newest post. */
export const FEATURED = JOURNAL[0]
/** Everything else, featured removed so it is not printed twice. */
export const REST = JOURNAL.filter((p) => p.slug !== FEATURED?.slug)

export const LAST_PAGE = Math.max(1, Math.ceil(REST.length / PER_PAGE))

export const pageItems = (page: number): JournalItem[] =>
  REST.slice((page - 1) * PER_PAGE, page * PER_PAGE)
