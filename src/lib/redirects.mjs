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
  // SUPERSEDED, not deleted. This source is now also covered by the journal
  // 301 map in docs/migration/roarsinc-redirects.conf, which ships as
  // dist/.htaccess:
  //
  //   {
  //     // "-2" artefact alongside the stronger ux-psychology post on the
  //     // same subject, same lastmod (2023-11-23).
  //     source:
  //       '/our-journal/crafting-one-of-a-kind-experiences-the-power-of-personalization-in-ux-design-2/',
  //     destination:
  //       '/our-journal/cracking-the-code-how-ux-psychology-powers-success-insights-from-a-premier-ux-agency/',
  //   },
  //
  // The two maps disagreed on where to send it. This one aimed at
  // `cracking-the-code-...`, which is not on the migrate-as-is list and so
  // resolves to a noindex holding page. The supplied map aims at
  // `from-empathy-to-iteration-...`, which is migrated and carries real copy,
  // and docs/migration/roars-url-decisions.csv line 103 names that same
  // target. The entry below was written from slug similarity, before the
  // Search Console data existed.
  // A 301 into live content beats a 301 into a placeholder, so the supplied
  // map keeps the source and this entry stands down rather than both layers
  // racing. The editorial judgement above may still be the better one; if so,
  // change the target in the supplied map, not here, so there is still only
  // one rule for this URL.
  {
    // Journal post competing with the real case study of the same name.
    // The case study is the commercial page and wins.
    source: '/our-journal/the-presidents-club-2/',
    destination: '/work/the-presidents-club/',
  },
  // HELD BACK, awaiting a decision. Not deleted, because the reasoning below
  // may still be the right call.
  //
  //   {
  //     // EXACT slug collision across two path prefixes. The industry page
  //     // is commercial and wins.
  //     source: '/our-journal/healthcare-app-development-company/',
  //     destination: '/industries/healthcare-app-development-company/',
  //   },
  //
  // This rule was written before the journal migration. It predates the
  // migrate-as-is list, which names `healthcare-app-development-company` as
  // one of the twenty posts to keep. Shipping both means the post is built
  // and then immediately redirected away from, so the migration would have
  // produced a page nobody can reach.
  //
  // docs/migration/roars-url-decisions.csv also contradicts it, line 76:
  // REWRITE at the same URL, target "same", on "206 impressions, no clicks,
  // avg pos 66". Rewrite the post, keep the URL. Not redirect.
  //
  // The two URLs do not actually collide — /our-journal/... and
  // /industries/... are different paths. What collides is the intent: both
  // target "healthcare app development", which is presumably what prompted
  // the rule. That is a ranking judgement, not a technical one, so it is not
  // mine to overturn silently even with the decisions file agreeing. The post
  // stays reachable and carries needsRewrite; restore the block above to
  // reverse it. scripts/verify-journal-redirects.mjs fails if both ship.
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
