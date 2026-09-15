/**
 * Case studies that are BUILT but not offered.
 *
 * Eleven of the twenty-three are listed on /work/ for now. These twelve keep
 * their URLs and their content, but they are off the index, carry noindex, and
 * stay out of the sitemap.
 *
 * WHY THIS IS NOT A REDIRECT MAP. All twelve are live, indexed URLs with real
 * copy:
 *
 *   - A 301 is permanent and cached hard by browsers. "For now" is not
 *     permanent, and un-caching a 301 across every visitor who hit one is not
 *     a thing you can do later.
 *   - Twelve case studies all pointing at the /work/ index is the shape search
 *     engines read as a soft 404. The index is not an equivalent page for any
 *     one of them.
 *   - Six industry and service pages carry NAMED receipts for these projects —
 *     "Les Concierges", "Friendo", "Reward Butler" — each with its own
 *     situation and outcome. Those links still resolve to the real page.
 *     Repointing them at a surviving project would make the receipt's own text
 *     untrue; pointing them at the index would strand the reader mid-claim.
 *
 * Bringing one back is deleting its line here.
 *
 * WHY .mjs, AND WHY THIS IS THE ONLY COPY. astro.config.mjs needs it to keep
 * these URLs out of the sitemap and cannot import the TypeScript module, so
 * the list lives here and src/lib/projects.ts imports it. A second copy in the
 * config would be a list that silently disagrees with itself the first time
 * somebody edits one of them.
 */
export const HELD_BACK_WORK = [
  'companyguru',
  'ventura-law-firm',
  '411drives-on-demand-car-loan-app',
  'gypsy',
  'blelp',
  'super-social',
  'community-social-residential-community-app',
  'les-concierges',
  'reward-butler',
  'friendo-healthcare-mobile-app-development',
  'counter-cabinet',
  'go-champions-go',
]

/** True for a /work/<slug>/ path that is held back. Used by the sitemap filter. */
export const isHeldBackWorkUrl = (page) => {
  const m = String(page).match(/\/work\/([^/]+)\/?$/)
  return m ? HELD_BACK_WORK.includes(m[1]) : false
}
