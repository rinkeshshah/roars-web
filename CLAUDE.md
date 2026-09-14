# CLAUDE.md

Build rules for roarsinc.com v2. Read fully before writing code. Re-read `docs/SEO-SPEC.md` before touching anything that emits `<head>`, routes or sitemaps.

---

## What this project is

Replacing a 20-year-old WordPress site with a static Astro site. WordPress is being removed entirely, not kept as a bridge.

Three things carry the risk:

1. **194 live URLs with accumulated ranking equity.** `docs/URL-INVENTORY.csv` is authoritative. Breaking one is permanent.
2. **An approved design.** `design/specs/*.md` has exact values per element. Reproduce, do not reinterpret.
3. **No CMS.** You are the editor. Content is markdown in this repo, and every page is composed from the component library. If you reach for a one-off instead of a component, the system erodes and nobody is there to catch it.

---

## Stack, fixed

| Layer | Choice |
|---|---|
| Generator | Astro, static output (`output: 'static'`) |
| Content | Markdown + MDX in `src/content/`, typed with Zod collections |
| Styling | `src/styles/tokens.css` + scoped component styles |
| Interactivity | Four islands only (see below). Vanilla JS, no framework. |
| Build | GitHub Actions. **Never on the server.** |
| Server | Nginx serving static files on Plesk. No Node, no PHP, no database. |
| Forms | One PHP endpoint writing to MySQL. The only server-side code. |
| Deploy | Actions builds and force-pushes `dist/` to an orphan `deploy` branch; Plesk pulls it. No rsync, no server credentials in CI. |

Do not add: React, Vue, Svelte, Tailwind, an animation library, a UI kit, or a CMS. If you think you need one, build without it and make the case in your report.

**The security model is the point.** No database to inject, no runtime to exploit, no admin panel to brute-force. Every dependency added to the server erodes that. Adding server-side anything requires asking first.

---

## Rules that override everything else

### 1. Never invent a URL

Every route traces to a row in `docs/URL-INVENTORY.csv`. When a design spec and the CSV disagree, the CSV wins and you flag it.

Already resolved:

| Spec says | Build |
|---|---|
| `/agency` | `/about-us/` |
| `/contact` | `/contact-us/` |
| `/projects`, `/projects/[slug]` | `/work/`, `/work/[slug]/` |
| `/services/*` | `/s/[slug]/` |
| `/insights` | `/our-journal/` |
| `/resources/guides/[slug]` | `/resources/[slug]/` (flat) |

Nav labels need not match URLs. Label it "Insights", serve `/our-journal/`. Deliberate.

### 2. Trailing slashes

`trailingSlash: 'always'` in `astro.config.mjs`, and nginx must not strip them. The live site uses them on all 194 URLs. Getting this wrong duplicates every one.

### 3. Zero JavaScript by default

Astro ships no JS unless you ask. Four islands are approved:

- Nav overlay (focus trap, `aria-expanded`)
- Filter chips on `/work/`, `/resources/`, `/industries/`
- Accordion / FAQ
- Projects cross-fade on the homepage

Everything else, including all reveal-on-scroll, is CSS plus a single shared IntersectionObserver. A fifth island needs a reason.

### 4. Do not rewrite copy

All copy in `design/specs/*.md` is Roars' own and final. Port exactly, typos included. Flag, do not fix.

### 5. Ask before consolidating content

`docs/URL-INVENTORY-FINDINGS.md` lists duplicate posts, cannibalisation clusters and retire candidates. Those need Search Console data and a human. Do not merge, delete or redirect on your own judgement.

### 6. No fabricated data

If a case study, stat, testimonial or client name is not in the specs or the migrated content, leave it empty and report it. Never invent a client name, a metric, or placeholder text that could ship.

---

## Design system

`src/styles/tokens.css` is the source of truth. Rationale in `docs/DESIGN-SYSTEM.md`.

**If a value is not a token, it does not exist.** The prototypes use 46 font sizes because they were prototypes. The scale is ten. Snap to the nearest and report anything that will not fit.

- Inter only, 400/500/600, self-hosted variable file, latin subset. Not Google Fonts.
- White, `#F5F5F5`, black, `#0B0B0B`, `#242424` ink, `#FFD400` accent.
- **Yellow is an accent, never a ground.** Max two yellow moments per viewport. The page is predominantly white; black sections are punctuation.
- `border-radius: 60px` on pills and buttons. Cards square. No other radii.
- Borders are `box-shadow: inset`, not `border`.
- `prefers-reduced-motion` respected everywhere.
- No dark mode. Dark grounds are a per-section device via `data-ground`, not a user preference.

### The rendered prototype is the visual target

**Render it and match it.** `design/prototypes/*.dc.html` is what the page is supposed to look like. Open it in a browser at 1440px, screenshot it, screenshot your build, and put them side by side. `scripts/compare-prototype.mjs` does exactly this.

**How you achieve it is flow layout and tokens.** That is the whole rule. The prototype says what; the design system says how.

This used to be a list of prohibitions with no positive instruction, and the homepage was built entirely from measurements in `design/specs/*.md` without anyone ever rendering `Main.dc.html`. Every dimension was defensible. The page was wrong: no accordion, no cascade, a full-bleed hero instead of a panel, and none of the art direction. Measurements are not a picture.

The prohibitions still stand, because they are about technique, not about fidelity:

- **Do not** copy `support.js` or the `transform: scale(vw/1440)` routine.
- **Do not** use absolute positioning for layout. Decoration floating over a composition is not layout: the hero's planet and starbelt are absolutely positioned and that is correct, because nothing below them depends on where they sit.
- **Do not** port the hard-coded ink-inversion pixel bands. Drive it from IntersectionObserver on sections marked dark. Pixel bands break the moment content length changes.
- **Do** treat coordinates as measurements. A child at `l:503` in a section at `l:39` means a 464px left rail.
- **Do** use each spec's mobile section directly. It is already flow layout.

**Read computed styles, not the static markup.** The prototypes render through React and Babel and fill template variables at runtime, so `font-size:{{ f.qSize }}` in the file tells you nothing. Query the live DOM.

**When the prototype and a spec disagree, say so. Do not pick silently.** Same when the prototype disagrees with *itself*: the Services rows put the row name in the left rail twice and in the inner column twice, and one collapsed row is indented 463px for no reason. Normalise it, and write down which reading you took and why.

**Decisions taken so far, so they are not relitigated:**

| Conflict | Resolution |
|---|---|
| Accordion toggle: Brand Guidelines says a 36px dark circle on the left; the prototype renders a white disc at the right | Prototype wins. Brand doc unchanged. |
| Footer nav: the Approach spec lists six items, Main lists five | Prototype wins, five, Approach out of the footer only. |
| Offices: the Approach spec says five countries, Main shows three, the build showed five cities | Five countries. The slot is 234px; five countries measure 185px, five cities 234.05px, which is why they collided. A factual list is not a visual treatment. |
| Top bar CTA: six prototypes say "Contact Now", eight say "Setup a Meeting" | Both are real. It is a `cta` prop on `TopBar`; Brand Guidelines' "Contact Now" is the default. |

### Scoped CSS does not cross a component boundary

A class handed to a component lands on an element the parent never scoped, so the parent's rule compiles to a selector that matches nothing — no error, no warning, CSS that is present and correct and inert.

This cost the homepage its About grid and its hero height, through `<Reveal class="about__stats">` and `<Section class="hero">`. Both reviewed clean.

- **Style an element the page itself owns.** If you want a wrapper's box styled, render the wrapper yourself.
- **Do not add a `class` prop to a layout component.** `Section` deliberately has none.
- `scripts/assert-styles.mjs` fails the build on any scoped rule that matches nothing in `dist/`. It runs in CI and in `npm run verify`. Never make it non-fatal.

Breakpoints: desktop grid to ~1040px, documented mobile stack at 760px. Tablet was never designed. Propose before inventing.

### Semantics the prototypes lack

They are div soup. In the rebuild: real headings with one `h1` per page, accordions as `button` with `aria-expanded`, focus trapping on the nav overlay, real `<label>` elements on form fields, `alt=""` on decorative images. Check contrast on `rgba(20,20,20,.62)` and `#919191` at 14px; keep for display type, darken for small body copy.

---

## Content collections

`src/content/`, each with a Zod schema in `src/content/config.ts`.

| Collection | Route | Entries |
|---|---|---|
| `posts` | `/our-journal/[slug]/` | 115 |
| `projects` | `/work/[slug]/` | **23, not 5** |
| `services` | `/s/[slug]/` | 12 |
| `industries` | `/industries/[slug]/` | 9 |
| `resources` | `/resources/[slug]/` | 15 |
| `pages` | various | ~20 |

Every schema includes the shared `seo` object: `title` (30-65 chars), `description` (120-165), `primaryIntent`, `ogImage`, `noindex`, `schemaType`. Zod enforces lengths at build time, so a bad value fails the build rather than shipping.

**Flag before building `/work/`:** the design shows five projects at ~707px per row. There are 23. That is a 16,000px page. Layout is an open design decision, not an implementation one. Build the detail pages and the data layer; leave the index until it is resolved.

---

## Build-time validation

`scripts/validate-content.mjs`, run in CI before `astro build`. This replaces the CMS publish gate. It fails the build on:

- Body under 300 words
- Duplicate `seo.title` or `seo.description` across the content set
- Content under 30% unique versus siblings in the same collection
- Missing or out-of-range SEO fields
- More than one `h1`, or skipped heading levels
- Broken internal links
- Images without alt text
- Any URL in the inventory that has no corresponding built page

That last check is the important one. It is what makes it impossible to silently drop a ranking URL.

---

## Known landmines

**Elementor wrapper HTML.** Post content sits ~15 div layers deep. Real content is in `.elementor-widget-container`. Strip and unwrap before converting to markdown. Test on ten and eyeball before the full run.

**Post 15170 is broken.** Title, excerpt and body are three different articles. Its body appears to belong to `the-unexpected-insight-we-built-a-meal-planning-app`. Flag, do not migrate silently, and check for others.

**Fake modified dates.** 37 posts share `2022-08-31`, 14 share `2025-08-26`, 10 share `2023-04-12`. Bulk operations, not edits. Carry real `date` values. **Never carry those `modified` values into `dateModified`.** Manufactured freshness is a spam signal.

**Squirrly meta is not in `wp_postmeta`.** It lives in the `wp_qss` table as PHP-serialised arrays keyed on `url_hash`. Exported and unserialised into `docs/migration/squirrly-meta.csv`, 280 rows covering 186 of the 194 inventory URLs.

Two things the export settled, both previously open:

- **The postmeta override query returned nothing.** `wp_qss` is the single source, so the old "postmeta wins where both hold a value" rule is moot. There is no precedence to resolve.
- **`wp_qss` holds zero redirects**, which confirms the earlier finding that no legacy redirect map exists to collide with `src/lib/redirects.mjs`. Production `.htaccess` and Cloudflare rules are still the two places a stray 301 could hide.

Port every value verbatim, over-length ones included. The build gate refusing an 88-character title is the correct outcome, not a problem to route around by truncating during migration.

**Multi-category posts.** Up to four categories each, so `/category/our-journal/*/` archives overlap heavily. Page 1 indexable, `page/2+` noindex.

**Legacy image URLs.** `/wp-content/uploads/*` paths are indexed in Google Images. Preserve filenames on import and add an nginx rewrite so old paths resolve 200.

**Six resource pages ship images named `placeholder`.** They are gated download pages. Flag; do not ship placeholder art on a lead capture form.

---

## Forms

The only server-side code on the box. Keep it small enough to read in one sitting.

`public/api/contact.php`, roughly 40 lines: verify Cloudflare Turnstile, check the honeypot, rate-limit by IP, prepared-statement insert into MySQL, send two emails, return JSON.

Non-negotiable: prepared statements only, no string interpolation into SQL. Never echo user input. Credentials in a file outside the document root. Its own MySQL user with INSERT only on one table, no SELECT, no DROP.

Fire `generate_lead` from the **server's JSON response**, never from the submit handler. Clicking is not converting.

---

## Performance budgets

LCP under 2.0s, INP under 150ms, CLS under 0.05. Static HTML makes these easy, so treat a miss as a bug, not a tuning exercise.

Four design-specific risks:

1. The 212px hero wordmark sits over a full-bleed photo. That photo is the LCP element. Preload, AVIF, explicit dimensions.
2. `mix-blend-mode: difference` on the wordmark. Extra compositing plus a legibility gamble. Ship a solid-colour fallback.
3. The projects cross-fade must not read `scrollY` per event. IntersectionObserver plus a rAF-throttled handler.
4. Inter: one self-hosted variable file with a metric-matched fallback, preloaded.

---

## Analytics

Reuse the existing GTM container and GA4 property. Do not create new ones; that resets all historical comparison.

Static pages mean full page loads, so **there is no SPA double-count problem.** The `page_view_spa` workaround in `docs/SEO-SPEC.md` 14.2 does not apply here. Standard GTM behaviour is correct. Everything else in section 14 stands: the event spec, Consent Mode v2 before the GTM snippet, and server-side `generate_lead`.

---

## Working agreement

- Follow `docs/BUILD-ORDER.md` in sequence. Each phase has an exit test.
- One phase per branch. Small commits.
- After any route or head change, verify with `curl -s <url> | grep -E 'canonical|robots|og:'`. Not DevTools, which shows the hydrated DOM and will lie.
- This file beats a spec. The CSV beats everything.
- If something is ambiguous, ask. A wrong guess about a URL is expensive and hard to detect later.
