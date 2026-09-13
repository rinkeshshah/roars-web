# URL Inventory: findings and decisions

Source: the six live Squirrly sitemaps, crawled 13 Sep 2026. Full machine-readable list in `URL-INVENTORY.csv`.

**194 URLs.** This supersedes the partial list in the SEO spec.

| Type | Count | Path pattern |
|---|---|---|
| Journal posts | 115 | `/our-journal/[slug]/` |
| Case studies | 23 | `/work/[slug]/` |
| Pages | 20 | root level |
| Resources | 15 | `/resources/[slug]/` |
| Services | 12 | `/s/[slug]/` |
| Industries | 9 | `/industries/[slug]/` |

Not in any sitemap but indexed: `/category/our-journal/[cat]/` and its `/page/[n]/` variants.

---

## 1. Corrections to the handoff route table

Three more mismatches beyond what I flagged last time.

| Handoff assumed | Reality | Decision |
|---|---|---|
| `/resources/guides/[slug]` | `/resources/[slug]/`, flat, 15 items | Drop the `/guides/` level. It does not exist and inventing it costs you 15 redirects for nothing. |
| 10 case studies | **23** | The footer surfaces 10. Thirteen are live, indexed, and unreachable from navigation. |
| 8 industries | **9** | `education-mobile-app-development` exists and is missing from the nav. |
| 11 services | **12** | `/s/web-app-development/` exists and is missing from the nav. |

**Fifteen live pages are orphaned from your navigation.** They are in the sitemap and indexed, but a user cannot click to them and internal link equity does not reach them. The v2 nav should surface all 23 case studies through `/work/` with filtering, and all 12 services and 9 industries in the menu overlay. That is a free win and it costs one design decision.

---

## 2. Cannibalisation, confirmed

### 2.1 The direct collision

```
/industries/healthcare-app-development-company/
/our-journal/healthcare-app-development-company/
```

Identical slug, two paths, same topic. You are competing with yourself on an exact match. Google is picking one and probably not the one you want.

**Fix:** the industry page is the commercial page and wins. 301 the journal post into it, or merge its useful content in first and then 301.

### 2.2 WordPress duplicate-slug artefacts

Three `-2` suffixed URLs, which is what WordPress does when you publish a post whose slug already exists:

```
/our-journal/end-to-end-development-seamlessly-transforming-concepts-into-market-ready-products-2/
/our-journal/end-to-end-development-seamlessly-transforming-concepts-into-market-ready-products/
/our-journal/crafting-one-of-a-kind-experiences-the-power-of-personalization-in-ux-design-2/
/our-journal/the-presidents-club-2/
```

The first pair is the clearest case: two near-identical posts, published days apart, both indexed, both in the sitemap. Pure self-competition.

`/our-journal/the-presidents-club-2/` also competes with the real case study at `/work/the-presidents-club/`.

**Fix:** keep the stronger URL of each pair per GSC, merge content, 301 the other. Four redirects total.

### 2.3 The MVP pile

Eleven posts on minimum viable products:

```
what-is-minimum-viable-product
minimum-viable-product-learn
minimum-viable-product-mvp-brilliant-success-stories
benefits-of-minimum-viable-product-development
importance-innovation-creating-mvps
validating-ideas-mvp-development
success-with-mvp-development
steps-towards-success-with-mvp-development
make-mvp-foolproof
an-mvp-can-get-your-startup-funded
one-thing-mvp-no-one-talking
```

Plus the commercial page at `/s/mvp-development/`.

`success-with-mvp-development` and `steps-towards-success-with-mvp-development` are barely distinguishable. Several others are 2022-era and short.

Eleven thin posts competing for the same intent is how you end up ranking position 14 for everything. One strong pillar beats eleven fragments, every time.

**Fix:** pick the best three or four as a genuine cluster (what an MVP is, how to scope one, funding with an MVP, real examples), merge the rest into them, 301 everything else. Expect to retire six or seven URLs.

### 2.4 Other clusters worth auditing the same way

| Cluster | Posts |
|---|---|
| UX design, general | 22 |
| ChatGPT and AI | 10 |
| Mobile app | 9 |
| Personas and research | 7 |
| Blockchain and crypto | 6 |

**The blockchain and crypto set deserves a direct question.** Six posts from 2018 to 2022 on bitcoin, crypto tokens and blockchain. You are positioning as a product and AI automation agency. Do these still support that, or are they a tail that dilutes topical authority and adds nothing? My read: retire or consolidate into one retrospective. But check GSC first. If one of them pulls traffic, keep it.

---

## 3. The UK city pages

Seven of them:

```
/product-development-agency-in-london/
/product-development-agency-in-manchester/
/product-development-agency-in-birmingham/
/ui-ux-design-services-london/
/ui-ux-design-services-bristol/
/ui-and-ux-design-agency-birmingham/
/ui-and-ux-design-agency-manchester/
```

Two problems.

**Inconsistent naming.** London and Bristol use `ui-ux-design-services-[city]`. Birmingham and Manchester use `ui-and-ux-design-agency-[city]`. Same page type, two URL patterns, chosen apparently at random.

**Shared imagery.** The London and Manchester product development pages both use `product-consulting-manchester.jpg`. The Birmingham, London and Manchester pages all share the same Elementor thumbnail. That is the signature of templated location pages with the city name swapped, which is the exact pattern the programmatic SEO rules flag as penalty risk. Google's scaled content abuse enforcement escalated through 2025 and specifically targets location pages that differ only by city name.

**Decision needed from you.** Three options:

1. **Keep and invest.** Each page gets a real local case study, a named UK client, genuine city-specific content. You have a UK office and a UK phone number, so this is defensible. Pick the stronger URL pattern (`/[service]-[city]/`) and 301 the other three into it.
2. **Consolidate.** One `/uk/` service page per service, cities mentioned within. Seven URLs become two.
3. **Keep as-is.** Only if GSC shows they pull real traffic, and even then, fix the naming inconsistency.

Do not build 40 more of these in the v2 programmatic system until this set is either fixed or retired. Check GSC before deciding.

---

## 4. Sitemap problems on the current site

Fix these in the new build. They are all mechanical.

| Issue | Detail |
|---|---|
| Stale generation | The index claims `lastmod` 14 Aug 2026, but the pages, industries and resources sitemaps were generated 17 Jun 2026. Two months out of date. |
| Meaningless priority | Every page is `0.6`, every service `0.8`, every post `0.8`. Google ignores `priority` entirely. |
| Wrong changefreq | Industries are marked `daily`, but their real `lastmod` values are from Jun 2025. Also ignored, and it signals sloppiness. |
| Query-string sitemap URLs | `sitemap-custom-posts.xml?type=service`. Works, but fragile. Use clean paths in the rebuild. |
| Homepage without slash | Listed as `https://www.roarsinc.com` with no trailing slash, while every other URL has one, and the site 308s to the slash version. |
| `/thankyou/` included | A post-submit utility page in the sitemap. Should be `noindex` and excluded. |
| No category sitemap | Category archives are indexed but absent from the sitemap. |
| No video sitemap entry | One post embeds YouTube and carries video markup inline. Fine, but worth handling deliberately. |

The new build emits sitemaps from Payload, so all of this is solved by generating them correctly once.

---

## 5. Migration volume, revised

| Collection | Records |
|---|---|
| `posts` | 115 (fewer after consolidation) |
| `projects` | 23 |
| `services` | 12 |
| `industries` | 9 |
| `guides` | 15 |
| `pages` | ~20 |

The `/work/` collection at 23 records is more substantial than the design assumes. The Projects index in the handoff shows five entries in a tall scrolling list, roughly 707px per row. At 23 records that is a 16,000px page. It needs filtering and probably pagination. Worth resolving in design before the build, not during it.

---

## 6. Next actions

**Yours, and it unblocks everything else:**

The three GSC exports. `roarsinc.com` Domain property, 16 months, all rows:
1. Queries tab
2. Pages tab
3. Queries filtered to positions 5 to 20

The CSV has empty `gsc_clicks`, `gsc_impressions`, `gsc_position`, `primary_intent` and `canonical_for_cluster` columns waiting for exactly this. With them I can fill in the consolidation decisions with evidence instead of judgement, and hand you a finished redirect map.

**What I can do without waiting:**

- `docs/REDIRECTS.ts` for the four confirmed duplicate-slug cases, which need no GSC data
- The Payload collection configs, sized to the real record counts above
- `next.config.js` with `trailingSlash`, the redirect map and the legacy `wp-content` rewrite

Say which and I will start.
