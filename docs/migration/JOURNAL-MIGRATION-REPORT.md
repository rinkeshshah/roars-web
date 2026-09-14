# Journal migration report

Nineteen `/our-journal/` posts, moved from the WordPress export into the Astro
content collection. Written 2026-09-14, revised after the decisions in
[Decisions](#decisions) came back.

**Nineteen, not twenty.** `healthcare-app-development-company` was dropped
from the migration — see decision 3.

Scope was journal only. The two files touched outside `src/content/posts/`,
`src/pages/our-journal/`, `src/lib/journal.ts` and the journal scripts are
named in [Out of scope, and why](#out-of-scope-and-why) at the bottom.

---

## 1. How the content came out

**Source:** the WXR export
(`...craftingdigitalexperiencestohelpambitious.WordPress.2026-09-14.xml`),
parsed with `xml.etree`. No scraping, no HTML fetched from the live site.

**Tooling, committed so it can be re-run:**

```
scripts/wordpress-export/journal/posts.txt    the 20 slugs; first 8 as-is, last 12 needsRewrite
scripts/wordpress-export/journal/extract.py   WXR -> one JSON per post + coverage table
scripts/wordpress-export/journal/write.py     JSON -> src/content/posts/*.md
```

```
python3 scripts/wordpress-export/journal/extract.py path/to/export.xml
python3 scripts/wordpress-export/journal/write.py
```

**What the cleaner removes:** shortcodes, Elementor and ElementsKit wrapper
elements (`div`, `section`, `span`, `figure`, `figcaption` — unwrapped, never
deleted with their text), `style`, `class`, `id`, `data-*`, `srcset`, `sizes`,
`loading`, `decoding`, `width`, `height`, and HTML comments. Headings,
paragraphs, lists, links, emphasis and images survive.

**What it does not do:** it never rewrites a word. Every sentence on those
twenty pages is the sentence that was on WordPress. Where a post reads thinly,
that is the original copy.

### The one thing that was changed, and why

**Heading depth is normalised.** Several bodies open at `h3` or `h4` with no
`h2` above them. That was fine when WordPress rendered the title separately;
it is a skipped level the moment the post title becomes the `h1`. The
extractor walks the headings with a stack and maps the levels a post actually
uses onto consecutive levels starting at `h2`, so relative depth survives and
the sequence never gaps. Heading *text* is untouched.

### Per-post extraction result

| slug | words | description from | hero | hero alt | body imgs | imgs w/o alt | notes |
|---|---:|---|:-:|:-:|---:|---:|---|
| end-to-end-development-seamlessly-transforming-concepts-into-market-ready-products | 2009 | squirrly | Y | Y | 0 | 0 | 33 shortcodes stripped; wrappers unwrapped |
| 5-simple-guidelines-for-mobile-app-design | 1124 | rank_math | Y | Y | 1 | 1 | clean |
| from-empathy-to-iteration-the-stages-of-design-thinking-for-successful-product-development | 1535 | rank_math | Y | N | 0 | 0 | clean |
| utilizing-sensation-and-perception-in-ux-designing-processes-for-2023 | 832 | rank_math | Y | N | 2 | 2 | clean |
| the-dark-side-of-ux-design-how-dark-mode-is-revolutionizing-user-experience | 1546 | rank_math | Y | N | 0 | 0 | clean |
| steps-towards-success-with-mvp-development | 666 | rank_math | Y | N | 0 | 0 | clean |
| loyalty-reward-program-app | 582 | rank_math | Y | N | 5 | 5 | wrappers unwrapped |
| 20-years-of-roars-built-on-purpose-driven-by-impact | 1010 | squirrly | Y | N | 0 | 0 | clean |
| how-to-hire-dedicated-developers | 216 | rank_math | Y | N | 0 | 0 | clean, but thin |
| roars-now-listed-clutch-manifest | 381 | rank_math | Y | N | 0 | 0 | clean |
| top-fintech-marketing-trends-that-drive-growth | 1119 | squirrly | Y | Y | 0 | 0 | clean |
| how-ux-design-can-revolutionize-healthcare-ux-delivery | 867 | rank_math | Y | Y | 1 | 0 | clean |
| the-unexpected-insight-we-built-a-meal-planning-app | 581 | squirrly | Y | N | 0 | 0 | clean |
| build-cloud-based-saas-application | 517 | rank_math | Y | N | 0 | 0 | clean |
| game-on-how-gamification-is-reshaping-user-experience-and-engagement | 1339 | rank_math | Y | Y | 0 | 0 | clean |
| ai-ux-in-harmony-elevating-ai-user-experience | 1004 | squirrly | Y | Y | 0 | 0 | clean |
| how-ai-is-transforming-user-experience-design | 1382 | squirrly | Y | Y | 0 | 0 | clean |
| benefits-of-minimum-viable-product-development | 266 | rank_math | Y | N | 0 | 0 | clean, but thin |
| minimum-viable-product-mvp-brilliant-success-stories | 731 | rank_math | Y | N | 0 | 0 | clean |

**Mangled: none.** Two needed real repair work and got it:

- `end-to-end-development-...` carried 33 shortcodes. Stripped, text intact.
- `loyalty-reward-program-app` was the only body built in Elementor. Unwrapped
  cleanly; its five images survived with their `src`, without their alt.

---

## 2. Descriptions

**All 19 have one. None was written by me.**

Two sources, in priority order:

1. `rank_math_description` from the export — 13 posts.
2. `docs/migration/squirrly-meta.csv` — the remaining 6.

The old site reused one excerpt across three posts. That does not survive here:
`scripts/assert-journal.mjs` fails the build if any two migrated posts emit the
same `<meta name="description">`. It currently passes, so all 19 are distinct.

**Length debt, carried deliberately.** 9 descriptions and 8 titles are longer
than the 165 / 65 character targets, because they are the real ones from the
old site and the alternative was inventing shorter ones. The schema accepts
them under a `seoMigrated` variant; `validate-content` and `assert-journal`
warn on each rather than failing, so the list stays visible instead of being
silently normalised. Worst offenders, if you want to rewrite them:

| slug | title | description |
|---|---:|---:|
| the-dark-side-of-ux-design-... | 84 | 446 |
| utilizing-sensation-and-perception-... | 77 | 295 |
| from-empathy-to-iteration-... | — | 336 |
| game-on-how-gamification-... | 77 | 207 |

---

## 3. Alt text

**Nothing was invented.** No alt was generated from a filename, and none was
generated from the image's surroundings.

**Hero images: 19 of 19 present. 12 have no alt text in the export.**

```
from-empathy-to-iteration-the-stages-of-design-thinking-for-successful-product-development
utilizing-sensation-and-perception-in-ux-designing-processes-for-2023
the-dark-side-of-ux-design-how-dark-mode-is-revolutionizing-user-experience
steps-towards-success-with-mvp-development
loyalty-reward-program-app
20-years-of-roars-built-on-purpose-driven-by-impact
how-to-hire-dedicated-developers
roars-now-listed-clutch-manifest
the-unexpected-insight-we-built-a-meal-planning-app
build-cloud-based-saas-application
benefits-of-minimum-viable-product-development
minimum-viable-product-mvp-brilliant-success-stories
```

**Body images: 9 across 3 posts. 8 have no alt text.**

```
5-simple-guidelines-for-mobile-app-design               1 of 1
loyalty-reward-program-app                              5 of 5
utilizing-sensation-and-perception-in-ux-designing...   2 of 2
```

The one that does have alt text is in `how-ux-design-can-revolutionize-
healthcare-ux-delivery`, and it was kept verbatim.

`validate-content` lists every one of these on each run. They are warnings,
not failures, so the posts ship — an image with no alt is worse than one with
good alt and better than one with a guess.

---

## 4. Images

**None failed to fetch, because nothing was fetched.**

Every image is referenced root-relative at its original path, e.g.
`/wp-content/uploads/2022/08/presidentclub-mobileapp1.png`. Those files are
already on the webspace at exactly that path, so the migrated posts point at
the same bytes the old site served. Nothing was downloaded, re-hosted,
re-encoded or bundled.

The one thing this depends on: the `/wp-content/uploads/` tree must stay in
place on the server. If it is ever cleared, these images break and so do the
work pages and guide covers, which use the same registry.

I could not verify any of the URLs resolve. Outbound access to roarsinc.com is
blocked from this environment (see section 6), so "the file is at that path" is
taken from the export's attachment records, not from a 200.

---

## 5. The index

`/our-journal/` lists the migrated posts and nothing else: one featured card
plus 18, twelve to a page, two pages. It used to list all 115 inventory rows,
which was right while nothing had been migrated — the URLs were live and a
title in a list beat no list at all. Now it would mean clicking ninety-odd
cards to find that most of them say "content pending migration".

The unlisted URLs **still build and still return 200**.
`src/pages/our-journal/[slug].astro` takes its paths from the inventory, not
from the index, so every legacy URL keeps resolving to its noindex holding
page. They are simply not advertised.

Two knock-on fixes came with that:

- **Sitemap.** Unmigrated journal URLs are now filtered out
  (`astro.config.mjs`). A sitemap is a list of pages you are asking to have
  indexed, and those carry `noindex`; listing them asks and refuses at once.
  With `PUBLIC_ALLOW_INDEXING=true` the sitemap now carries 19 posts plus the
  index, and no holding pages.
- **Pager.** The number list used to window to five around the current page
  with an ellipsis for the gap. At two pages the elision can never fire, which
  left a styled ellipsis that nothing rendered, and `assert-styles` refused it.
  Both the window and its style came out together, with a note to bring them
  back together once the journal passes about nine pages.

---

## 6. Redirects

Source of truth: `docs/migration/roarsinc-redirects.conf`, supplied with the
Search Console decisions, **never edited**. Corrections layer on top from
`docs/migration/journal-redirect-overrides.conf`, each with a `# why:` line
beside it. That way re-exporting the decisions cannot silently drop a fix, and
the generator fails loudly if an override goes stale (its source vanished
upstream) or redundant (upstream now sets the same target).

`scripts/generate-journal-htaccess.mjs` emits `dist/.htaccess` on every build,
wired into `postbuild` so it cannot be forgotten.

**53 rules shipped. 5 corrected. 1 held back.**

### The five corrections

The supplied map's topic-fallback rule aimed every generic UX post at
`why-invest-in-ux-design-services-essential` without checking whether that
target was itself in the redirect bucket. It was, so it redirected to itself
and took four other rules down with it. That post is not being migrated — 57
impressions and zero clicks is not a reason to promote a page that was only
load-bearing by accident.

| source | now goes to |
|---|---|
| `/our-journal/why-invest-in-ux-design-services-essential/` | `/s/user-experience-design-agency/` |
| `/our-journal/saas-ux-design-how-to-build-products-that-users-actually-want-to-pay-for/` | `/s/user-experience-design-agency/` |
| `/our-journal/10-key-things-to-consider-when-doing-uxdesign/` | `/s/user-experience-design-agency/` |
| `/our-journal/3-design-mistakes-ux-designers-avoid/` | `/s/user-experience-design-agency/` |
| `/our-journal/top-20-most-promising-ui-ux-companies/` | `/about-us/` |

Both targets build and both are in the URL inventory.

### The one still held back

`/our-journal/loyalty-reward-program-app/` → `/our-journal/`. The source is a
migrated post; shipping this would hide it. Confirmed to stay held. The rule
is written into `dist/.htaccess` as a comment with its reason, so the omission
is visible on the server and not only in the generator.

### Trailing slash: already handled, no rule added

The no-slash → slash 301 is already there, and site-wide. `docs/DEPLOYMENT.md`
requires this nginx directive:

```nginx
rewrite ^/(.*[^/])$ /$1/ permanent;
```

nginx evaluates a server-level `rewrite` before location matching, so
`/our-journal/loyalty-reward-program-app` is canonicalised to the slashed form
with a 301 before any redirect rule is consulted. A second rule for that one
post could never fire.

Writing it into `.htaccess` instead would have been worse than useless.
Apache's `Redirect` is a **prefix** match, so
`Redirect 301 /our-journal/loyalty-reward-program-app https://.../loyalty-reward-program-app/`
also matches the already-slashed request, appends the remainder, and sends it
to `.../loyalty-reward-program-app//`. That is a loop, not a canonicalisation.

So instead of one rule for one post, the **live verification now asserts it for
all 19**: each migrated URL's no-slash form must answer 301 with a `Location`
of the slashed form. That covers what the Search Console split was about, for
every post rather than the one that happened to surface it, and it fails loudly
if the nginx directive is ever dropped.

While looking at that, the static half gained a prefix check: no shipped rule's
source may be a path prefix of another rule's source or of a migrated URL,
because Apache would swallow that URL too. Nothing currently trips it. A rule
with `/our-journal/` as its source would.

### Chains

**None.** No shipped rule's target is another rule's source, in either layer.
The two layers claim one source in common,
`end-to-end-development-...-2`, and they agree on its target.

### Verification

`scripts/verify-journal-redirects.mjs`, re-runnable, two halves.

**Static half — ran here, passed.** Reads the emitted `.htaccess`, the nginx
map, and the built pages:

- every shipped rule declares 301, never 302
- trailing slash on both ends of every rule
- no rule redirects to itself
- no rule's target is another rule's source (no chains)
- no source declared twice
- no migrated post used as a redirect source, in either layer
- no source is a path prefix of another URL (Apache `Redirect` is a prefix match)
- all 53 targets and all 19 migrated URLs exist as pages in `dist/`
- the two layers never claim one source with different targets

**Live half — did not run, and is not reported as passing.** The assertions
that matter are HTTP facts:

- every journal redirect returns 301, not 302
- exactly one hop, no chains
- the target returns 200
- each of the 19 migrated URLs returns 200 at its trailing-slash form and does
  not itself redirect
- each of the 19 answers 301 to the slashed form at its no-slash form

Those cannot be observed from here. Outbound access to roarsinc.com is blocked
at the agent proxy — `https://www.roarsinc.com/` answers 403 to every request,
including the root. The script probes the root first for exactly this reason:
without that probe, a blocked proxy reports "all 72 journal URLs returned 403",
which looks like a catastrophic site failure and is entirely an artefact of the
network. It prints `LIVE DID NOT RUN` and exits 1.

Run this from the Plesk box over SSH, or locally, before cutover:

```
node scripts/verify-journal-redirects.mjs --live
node scripts/verify-journal-redirects.mjs --live --base=https://dev.roarsinc.com
```

Exit codes: `0` both halves ran and passed · `1` something failed ·
`2` static passed and live never ran. There is no path that returns 0 without
the live half having actually executed, except `--static-only`, which says so
in its own output and is what `npm run verify` uses.

**Until that passes, the redirect map is written but unproven.**

---

## 7. What I could not check

- **Any live HTTP status.** Egress to roarsinc.com is blocked (403 on CONNECT
  at the agent proxy), confirmed with curl, WebFetch and the proxy's own
  status endpoint. Every redirect claim in section 6 is static analysis of the
  config and the build output.
- **That the `/wp-content/uploads/` images resolve.** Same reason.

### `assert:urls` is red on purpose

Nine inventory URLs have no page: seven UK location pages,
`/schedule-ux-ui-meeting/` and `/thankyou/`. It failed before this work too —
verified by stashing these changes and re-running — so it is not a regression.

**Do not build the seven location pages to make this go green.** They use
three different URL patterns and Birmingham has two competing pages:

```
/product-development-agency-in-london/
/product-development-agency-in-manchester/
/product-development-agency-in-birmingham/
/ui-ux-design-services-london/
/ui-ux-design-services-bristol/
/ui-and-ux-design-agency-birmingham/
/ui-and-ux-design-agency-manchester/
```

The pattern has to be decided before anything is built, and the gate staying
red is what keeps that visible. See `docs/URL-INVENTORY-FINDINGS.md` §3.

---

## Decisions

All four came back. Recorded here so the reasoning survives the conversation.

### 1. `why-invest-in-ux-design-services-essential` — not migrated ✔

A bug in the upstream redirect generator: a topic-fallback rule pointed every
generic UX post at that URL without checking the target was itself being
redirected. 57 impressions, zero clicks — promoting it to post 20 would reward
a page for being accidentally load-bearing.

Four of the five sources now go to `/s/user-experience-design-agency/`, which
is topically exact and commercial. `top-20-most-promising-ui-ux-companies` is
the 2018 CIO Review press piece, so it goes to `/about-us/` — credibility
rather than services. Shipped via the overrides file.

### 2. `loyalty-reward-program-app` — hold stands ✔

One page, two URLs; Search Console split the stats, the no-slash form catching
the click and the slashed form catching 56 impressions. Site convention is the
trailing slash, so the slashed URL is canonical and the post is live. The
`→ /our-journal/` rule stays held back.

The requested no-slash 301 was **not added as a rule**, because the site-wide
nginx `rewrite` already does it and an `.htaccess` version would loop on a
prefix match. It is asserted for all 19 posts in the live verification instead.
Details under [Trailing slash](#trailing-slash-already-handled-no-rule-added).

### 3. `healthcare-app-development-company` — redirect restored ✔

`redirects.mjs` had it right and the CSV row was wrong. The journal post draws
206 impressions; `/industries/healthcare-app-development-company/` draws 2,800.
Same slug, same intent, and migrating the post keeps the two cannibalising each
other.

Dropped from the migration — that is why it is 19 and not 20 — and the redirect
to the industries page is restored in `src/lib/redirects.mjs` with the full
history in the comment.

`how-ux-design-can-revolutionize-healthcare-ux-delivery` is **not** affected.
It is a genuine editorial angle rather than a second copy of the industry page,
and it stays migrated.

### 4. `crafting-one-of-a-kind-...-2` — supplied map wins ✔

Redirecting to a noindex holding page would have been the worse outcome. The
nginx entry is commented out in `src/lib/redirects.mjs`; the supplied map's
rule, to the migrated `from-empathy-to-iteration-...`, is the only one for that
URL.

---

## Out of scope, and why

Files touched outside `src/content/posts/`, `src/pages/our-journal/`,
`src/components/JournalIndex.astro`, `src/lib/journal.ts` and the journal
scripts:

- **`src/lib/redirects.mjs`** — journal redirects, which the brief put in
  scope. `healthcare-app-development-company` restored; `crafting-...-2`
  commented out with its reasoning. No non-journal rule was touched.
- **`package.json`** — `postbuild` now also runs the journal `.htaccess`
  generator, and `verify` gained the two journal gates. Without the first, the
  redirect file is generated only when somebody remembers, and `dist/` is
  rebuilt from scratch on every deploy, so it would never reach the server.
- **`astro.config.mjs`** — the sitemap filter, so unmigrated journal URLs are
  not both requested for indexing and marked `noindex`. Journal paths only;
  every other route's sitemap entry is unchanged.
- **`src/layouts/BaseLayout.astro`** — an optional `siteName` prop, so
  `og:site_name` can be `Roars` on journal posts as the brief requires. The
  default is unchanged, so every other route emits exactly what it did before.
