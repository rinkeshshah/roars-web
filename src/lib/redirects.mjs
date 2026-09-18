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
  {
    // EXACT slug collision across two path prefixes. The industry page is
    // commercial and wins.
    //
    // The journal migration briefly listed this slug as a post to keep, on
    // the strength of roars-url-decisions.csv line 76 (REWRITE, same URL).
    // That row was wrong and the rule here was right: the journal post draws
    // 206 impressions, /industries/healthcare-app-development-company/ draws
    // 2,800. Same slug, same intent, and migrating the post keeps the two
    // cannibalising each other. The post was dropped from the migration,
    // which is why it is 19 and not 20.
    //
    // `how-ux-design-can-revolutionize-healthcare-ux-delivery` is NOT part of
    // this. It is a genuine editorial angle rather than a second copy of the
    // industry page, and it stays migrated.
    source: '/our-journal/healthcare-app-development-company/',
    destination: '/industries/healthcare-app-development-company/',
  },
]

/**
 * CONFIRMED. The old singular `/industry/` prefix, linked from Clutch.
 *
 * The Roars profile on Clutch links nine industry pages at `/industry/<slug>/`.
 * Those are backlinks from a high-authority profile and every one of them is a
 * 404 on this site, which spends the link and gets nothing.
 *
 * Six of the nine slugs are unchanged and only the prefix moved. THREE ARE
 * DIFFERENT SLUGS, which is why this is nine explicit rules and not one regex:
 *
 *   on-demand-fitness-app                   -> on-demand-fitness-app-development
 *   healthcare-app-development              -> healthcare-app-development-company
 *   logistics-and-transportation-app-...    -> logistics-transportation-app-...
 *
 * A bare `/industry/(.*)` -> `/industries/$1` rule would send all three into a
 * 404 while looking like it had handled them. The pattern rule still ships, in
 * `patternRedirects` below, but it sits behind these so it only ever sees a
 * slug nobody here has heard of.
 */
export const legacyIndustryRedirects = [
  // The three that changed slug, not just prefix.
  {
    source: '/industry/on-demand-fitness-app/',
    destination: '/industries/on-demand-fitness-app-development/',
  },
  {
    source: '/industry/healthcare-app-development/',
    destination: '/industries/healthcare-app-development-company/',
  },
  {
    // Clutch truncates this one in its own markup. The full slug is the only
    // one it can be: there is exactly one logistics page on either site.
    source: '/industry/logistics-and-transportation-app-development/',
    destination: '/industries/logistics-transportation-app-development/',
  },
  // The six where only the prefix moved. Explicit anyway, so a future edit to
  // any one slug breaks a named rule rather than silently falling through to
  // the pattern and 301ing into a 404.
  {
    source: '/industry/education-mobile-app-development/',
    destination: '/industries/education-mobile-app-development/',
  },
  {
    source: '/industry/concierge-app-development/',
    destination: '/industries/concierge-app-development/',
  },
  {
    source: '/industry/saas-application-development-services/',
    destination: '/industries/saas-application-development-services/',
  },
  {
    source: '/industry/travel-and-hospitality-app-development/',
    destination: '/industries/travel-and-hospitality-app-development/',
  },
  {
    source: '/industry/retail-ecommerce-development/',
    destination: '/industries/retail-ecommerce-development/',
  },
  {
    source: '/industry/food-restaurant-app-development/',
    destination: '/industries/food-restaurant-app-development/',
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

/**
 * CONFIRMED. Live URLs the sitemap-derived inventory never knew about.
 *
 * All six came out of docs/migration/squirrly-meta.csv, which is the SEO
 * plugin's own table and therefore a record of what WordPress actually had,
 * not of what its sitemap advertised. Every one is `post_type: post` with a
 * real title and a real meta description, and every one was missing from
 * docs/URL-INVENTORY.csv. scripts/assert-inventory.mjs now fails on this class
 * rather than waiting for somebody to notice at cutover.
 *
 * Three are the old category-nested permalink shape, `/our-journal/<category>/
 * <slug>/`. The post each one points at is migrated and live at the flat slug,
 * so these are one hop into real content.
 *
 * Three are /work/ pages:
 *   gymbait-2 is a duplicate-slug artefact of the GymBait case study, which is
 *     migrated, featured and live. Same project, so it goes there.
 *   orderdirect and addictlab-collabration-tool are real case studies that were
 *     never migrated. There is no export for either, no images, and a meta
 *     description is not a case study, so writing a page for them would be
 *     inventing a client's project. They 301 to the nearest page that is
 *     actually about the work — the logistics sector page for one, product
 *     development for the other. Flagged to the owner 16 Sep: if the original
 *     copy turns up, both become case studies and these two rules come out.
 */
export const missingFromInventoryRedirects = [
  {
    source: '/our-journal/business/minimum-viable-product-learn/',
    destination: '/our-journal/minimum-viable-product-learn/',
  },
  {
    source: '/our-journal/user-experience/ux-design-principles-designers-must-know-3/',
    destination: '/our-journal/ux-design-principles-designers-must-know/',
  },
  {
    source: '/our-journal/user-experience/how-ai-is-transforming-user-experience-design-in-2025/',
    destination: '/our-journal/how-ai-is-transforming-user-experience-design/',
  },
  {
    source: '/work/gymbait-2/',
    destination: '/work/gymbait/',
  },
  {
    // "Logistics App Development Company", post 7365.
    source: '/work/orderdirect/',
    destination: '/industries/logistics-transportation-app-development/',
  },
  {
    // "Creative Collaboration Tool Development Case study", post 7357. There is
    // no collaboration-tools sector page, and the service that built it is the
    // honest nearest thing.
    source: '/work/addictlab-collabration-tool/',
    destination: '/s/product-development-company/',
  },
]

/**
 * THE SHORT PATHS PEOPLE TYPE, AND THAT CARELESS LINKS GUESS.
 *
 * Reported as "old WordPress URLs that 404". They do 404, and they would have
 * gone on 404ing however the redirect map was deployed, because THEY WERE
 * NEVER LIVE URLS HERE. Checked before writing a single one:
 *
 *   docs/search-console/pages.csv has no row for /services, /blog, /journal,
 *   /contact or /about — not one impression between them. What it does have
 *   is /about-us/ (84 impressions), /about-us without its slash (3), and
 *   /contact-us/ (1). The old site used the long names too.
 *
 *   docs/URL-INVENTORY.csv, the 194 URLs that must keep resolving, has none
 *   of them either.
 *
 * So these are not restorations of anything. They are the five paths a person
 * guesses from the address bar, and each has exactly one plausible
 * destination. A 301 costs nothing and turns a dead end into the right page.
 *
 * They are deliberately NOT added to docs/URL-INVENTORY.csv: that file is the
 * record of what was actually live, and padding it with paths that never
 * existed would stop it meaning that.
 */
export const guessedPathRedirects = [
  { source: '/services/', destination: '/s/' },
  { source: '/blog/', destination: '/our-journal/' },
  { source: '/journal/', destination: '/our-journal/' },
  { source: '/contact/', destination: '/contact-us/' },
  { source: '/about/', destination: '/about-us/' },
]

/**
 * REGEX RULES, not exact paths. These are emitted after every exact rule and
 * only ever see a path none of them matched.
 *
 * They are kept out of `redirectList` on purpose: that list is exact-match
 * `location =` rules, and validateRedirects checks each source for a trailing
 * slash, which a pattern does not have.
 */
export const patternRedirects = [
  {
    // Everything else under the retired singular prefix. All nine real slugs
    // are named above, so what reaches this is a path that does not exist on
    // either site. It gets a 301 to the same slug under the new prefix, which
    // is the best guess available; if that does not exist either it is a 404,
    // the same 404 it would have been without the rule.
    pattern: '^/industry/(.*)$',
    destination: '/industries/$1',
  },
  {
    /* WordPress attachment pages: one thin page per uploaded image, at
       <parent>/attachment/<image-slug>/. Five turned up in squirrly-meta.csv
       under /work/, /s/ and /industries/, and there is one per image on the
       old site, so naming them individually is a list that is wrong the moment
       anybody uploads anything. Each goes to the page it hangs off, which is
       the page a person landing on it was looking for. */
    pattern: '^(/.*)/attachment/[^/]+/?$',
    destination: '$1/',
  },
]

export const redirects = Object.fromEntries(
  [
    ...duplicateSlugRedirects,
    ...legacyIndustryRedirects,
    ...missingFromInventoryRedirects,
    ...guessedPathRedirects,
    ...mvpClusterRedirects,
    ...cryptoTailRedirects,
    ...ukCityRedirects,
  ].map((r) => [r.source, { status: 301, destination: r.destination }]),
)

export const redirectList = [
  ...duplicateSlugRedirects,
  ...legacyIndustryRedirects,
  ...missingFromInventoryRedirects,
  ...guessedPathRedirects,
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
