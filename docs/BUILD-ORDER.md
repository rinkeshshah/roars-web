# Build Order

Eight phases. Each has an exit test. Do not start the next until the current one passes.

The ordering is not arbitrary. Later phases depend on decisions locked earlier, and every expensive mistake available on this project comes from building routes before the URL map is settled.

---

## Phase 0: Foundation

**Goal:** an empty site that already behaves correctly at the HTTP level.

1. Scaffold Astro with the MDX and sitemap integrations. TypeScript strict.
2. Drop in `astro.config.mjs`, `src/lib/site.ts`, `src/lib/redirects.mjs`, `src/styles/tokens.css`.
3. Self-host Inter: one variable file, latin subset, `font-display: swap`, `size-adjust` metric-matched fallback. Preload it.
4. Write `scripts/validate-redirects.mjs` and `scripts/assert-urls.mjs`. Wire both into CI.
5. Set up the GitHub Actions workflow. Confirm a build artifact is produced.
6. Configure the Plesk vhost: document root, trailing-slash behaviour, the redirect include, and the `/wp-content/uploads/*` rewrite.

**Exit test:** a push to `main` builds in Actions and lands static files on the server. `curl -sI /about-us` returns 301 to `/about-us/`. The four confirmed redirects resolve in one hop. `assert-urls.mjs` runs and reports the expected 194.

---

## Phase 1: Design system primitives

**Goal:** the shared vocabulary every page is built from.

Build these and nothing else. Each needs a rendered state matching its spec, plus hover, focus-visible and reduced-motion behaviour.

- Primary button (204x47, r60, two dots at x167 and x177)
- Ghost button, light and dark
- Filter chip with `n / total` readout
- Accordion row (`button`, `aria-expanded`, one open at a time)
- Avatar stack (42px, -9px overlap, 3px ring, leading counter chip)
- Stat block (name, 1.5px rule, 84px number, supporting line)
- Section header (124px at the inner column, label plus rule in the rail)
- Section wrapper reading `data-ground="light|surface|dark"`
- Top bar with intersection-driven ink inversion
- Logo chip with scroll-progress ring
- Nav overlay (focus trap, `aria-expanded`)
- Shared footer
- CTA band
- Reveal-on-intersect wrapper, one shared observer for the whole page

**On the ink inversion:** the prototypes hard-code pixel bands like `[[0,900],[3339,4679]]`. Do not port those. Drive it from IntersectionObserver on sections marked dark.

**On islands:** only the nav overlay, filter chips, accordion and cross-fade get `client:` directives. Reveal is CSS plus the one shared observer. Everything else ships zero JS.

**Exit test:** a components page renders all of the above. Keyboard navigation works throughout. `prefers-reduced-motion` kills every animation. Total JS on that page under 15KB.

---

## Phase 2: Content collections

**Goal:** the schemas, before any page consumes them.

`src/content/config.ts` with Zod schemas for `posts`, `projects`, `services`, `industries`, `resources`, `pages`. Every one includes the shared `seo` object with lengths enforced by Zod, so a bad value fails the build.

Write `scripts/validate-content.mjs`. Seed two or three real entries per collection from the specs to prove the shapes.

**Exit test:** a deliberately thin entry fails the build with a readable error naming the rule it broke.

---

## Phase 3: Homepage

The most complex page and the one that proves the system. Nine sections, spec in `design/specs/Main.md`.

The projects cross-fade is the hard part. Single parameter `p`, eased `p²(3−2p)`, opacities always summing to 1 so the slot is never empty. IntersectionObserver plus a rAF-throttled handler; never read `scrollY` per event.

**Exit test:** LCP under 2.0s on 4G throttle, CLS under 0.05. Canonical, robots, and the Organization plus WebSite JSON-LD all visible in `curl` output. Total page JS under 25KB.

---

## Phase 4: Marketing pages

`/about-us/`, `/approach/`, `/contact-us/`, `/work/[slug]/`, `/s/[slug]/`, `/industries/[slug]/`, `/resources/`, `/resources/[slug]/`, `/terms-of-service/`, `/privacy-policy/`.

**Build the `/work/` detail pages but leave the `/work/` index until the layout is resolved.** The design shows five projects at ~707px per row. There are 23. That is a 16,000px page, and it is an open design decision.

Contact form: the PHP endpoint, plus its own MySQL user with INSERT only on one table. Prepared statements, Turnstile, honeypot, rate limit.

**Exit test:** every non-post, non-category URL in the inventory returns 200. The form writes to MySQL and sends both emails. `assert-urls.mjs` passes for everything built so far.

---

## Phase 5: Content migration

**Needs the WordPress REST export and the Squirrly `wp_qss` export.**

1. Run the migration script to a scratch directory. Inspect ten posts by hand before the full run.
2. Strip Elementor wrappers. Real content is in `.elementor-widget-container`.
3. Carry real `date` values. **Never the bulk `modified` dates.**
4. Port the Squirrly titles and descriptions, then improve them.
5. Import `wp-content/uploads`, preserving filenames. Confirm the nginx rewrite resolves old paths.
6. Fix post 15170. Check for others.
7. Build `/our-journal/`, `/our-journal/[slug]/` and the category archives. Page 1 indexable, `page/2+` noindex.

**Exit test:** all 115 posts resolve at their original URLs. No Elementor markup survives. Spot-check twenty against the live originals.

---

## Phase 6: Cutover

1. Full launch checklist, `docs/SEO-SPEC.md` section 16.
2. `assert-urls.mjs` green on all 194.
3. Point the document root at the static site. Keep the WordPress files until step 6.
4. Submit the sitemap index. Request indexing on the top 20 URLs by clicks.
5. Watch Coverage and Crawl Stats daily for two weeks.
6. Once stable: archive the WordPress database dump and files off-server, then delete. This is also what resolves the 50 GB against a 25 GB quota.

**Exit test:** every inventory URL returns 200 or one 301. Impressions hold within normal variance for two weeks.

**Publish nothing new during this window.** If rankings move you need to know whether the rebuild or new content caused it.

---

## Phase 7: Consolidation

**Needs the Search Console exports. Do not start without them.**

Resolve the MVP cluster, the crypto tail, the UK city pages and the remaining cannibalisation clusters in `docs/URL-INVENTORY-FINDINGS.md`. Merge content first, then redirect. Fill in the PENDING arrays in `src/lib/redirects.mjs`.

**Exit test:** one URL per intent. Every retired URL redirects in one hop.

---

## Phase 8: Comparison pages

`/compare/` and its hub, then Tier 1 from `docs/KEYWORD-PLAN.md`. Four pages published together, at least four weeks after cutover. Wait six to eight weeks and assess before Tier 2.

---

## Not in scope

Do not build without asking: a search page, comments, a newsletter archive, author archives, tag archives, a `/brand/` page, or programmatic industry-by-service pages. Each adds indexable URLs, and this project's whole risk profile is URL discipline.
