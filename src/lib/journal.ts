/**
 * The journal's list, and where the page breaks fall.
 *
 * One source for both routes — /our-journal/ and /our-journal/page/N/ — so
 * page 1 and page 2 cannot disagree about how many pages there are.
 *
 * Posts come from the INVENTORY, not the collection: src/content/posts/ is
 * empty until the WXR export lands, and all 115 URLs are live and indexed
 * today. Names are the words already in the URL; nothing is invented.
 */
import { slugsOf, nameFromSlug } from './inventory'

/** Four rows of three. Twelve keeps the page near the homepage's height. */
export const PER_PAGE = 12

export interface JournalItem {
  slug: string
  href: string
  name: string
  /** Absent until the bodies migrate: see JournalIndex.astro on bulk dates. */
  date?: string
}

export const JOURNAL: JournalItem[] = slugsOf('post').map((slug) => ({
  slug,
  href: `/our-journal/${slug}/`,
  name: nameFromSlug(slug),
}))

export const LAST_PAGE = Math.max(1, Math.ceil(JOURNAL.length / PER_PAGE))

export const pageItems = (page: number): JournalItem[] =>
  JOURNAL.slice((page - 1) * PER_PAGE, page * PER_PAGE)
