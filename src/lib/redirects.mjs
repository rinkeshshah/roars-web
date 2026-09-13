/**
 * 301 redirect map.
 *
 * Consumed twice: by astro.config.mjs for dev-server parity, and by
 * scripts/generate-nginx-redirects.mjs which emits the real nginx rules.
 * nginx does the redirecting in production. Astro's built-in redirects
 * emit meta-refresh pages, which pass equity poorly.
 *
 * RULES
 *  - Permanent moves are 301. Never 302.
 *  - One hop maximum. If A -> B and B -> C, point A at C.
 *  - Trailing slashes on both sides.
 *  - Every retired URL appears here. No 404s on anything ever indexed.
 *
 * CONFIRMED entries are evidence-backed and safe to ship.
 * PENDING entries need Search Console data and a human decision.
 *
 * What exists: docs/URL-INVENTORY.csv
 * Why: docs/URL-INVENTORY-FINDINGS.md
 */

/** CONFIRMED. WordPress duplicate-slug artefacts. */
export const duplicateSlugRedirects = [
  {
    // Near-identical twin published days apart. Both indexed, both in the
    // sitemap, same lastmod (2025-05-29).
    source:
      '/our-journal/end-to-end-development-seamlessly-transforming-concepts-into-market-ready-products-2/',
    destination:
      '/our-journal/end-to-end-development-seamlessly-transforming-concepts-into-market-ready-products/',
  },
  {
    // "-2" artefact alongside the stronger ux-psychology post on the same
    // subject, same lastmod (2023-11-23).
    source:
      '/our-journal/crafting-one-of-a-kind-experiences-the-power-of-personalization-in-ux-design-2/',
    destination:
      '/our-journal/cracking-the-code-how-ux-psychology-powers-success-insights-from-a-premier-ux-agency/',
  },
  {
    // Journal post competing with the real case study of the same name.
    // The case study is the commercial page and wins.
    source: '/our-journal/the-presidents-club-2/',
    destination: '/work/the-presidents-club/',
  },
  {
    // EXACT slug collision across two path prefixes. The industry page
    // is commercial and wins.
    source: '/our-journal/healthcare-app-development-company/',
    destination: '/industries/healthcare-app-development-company/',
  },
]

/**
 * PENDING: MVP cluster. Eleven posts compete for one intent, plus
 * /s/mvp-development/. Four refreshed in 2025, seven stale since 2022.
 *
 * Note the tension: `what-is-minimum-viable-product` is the best slug for
 * the pillar but the most neglected. `success-with-mvp-development` and
 * `steps-towards-success-with-mvp-development` are near-identical and were
 * each refreshed separately rather than merged.
 *
 * Decide the survivor from GSC impressions, not slug quality.
 */
export const mvpClusterRedirects = []

/**
 * PENDING: blockchain / crypto tail. Six posts, all stale since 2022-2023,
 * off current positioning. A stale post with real impressions is a rewrite,
 * not a redirect. Check GSC first.
 */
export const cryptoTailRedirects = []

/**
 * PENDING: UK city pages. Seven pages, two naming conventions, shared
 * imagery. /product-development-agency-in-london/ and .../manchester/ have
 * IDENTICAL image sets, one named "manchester" while serving on London.
 * See docs/URL-INVENTORY-FINDINGS.md section 3.
 */
export const ukCityRedirects = []

export const redirects = Object.fromEntries(
  [
    ...duplicateSlugRedirects,
    ...mvpClusterRedirects,
    ...cryptoTailRedirects,
    ...ukCityRedirects,
  ].map((r) => [r.source, { status: 301, destination: r.destination }]),
)

export const redirectList = [
  ...duplicateSlugRedirects,
  ...mvpClusterRedirects,
  ...cryptoTailRedirects,
  ...ukCityRedirects,
]

/** Guard against chains, self-redirects and duplicates. Run in CI. */
export function validateRedirects(list = redirectList) {
  const errors = []
  const sources = new Set()
  const destinations = new Set(list.map((r) => r.destination))

  for (const r of list) {
    if (r.source === r.destination) errors.push(`Self-redirect: ${r.source}`)
    if (sources.has(r.source)) errors.push(`Duplicate source: ${r.source}`)
    if (destinations.has(r.source)) {
      errors.push(
        `Chain: ${r.source} is both source and destination. Point its ` +
          `upstream sources at the final destination instead.`,
      )
    }
    if (!r.source.endsWith('/') || !r.destination.endsWith('/')) {
      errors.push(`Missing trailing slash: ${r.source} -> ${r.destination}`)
    }
    sources.add(r.source)
  }
  return errors
}
