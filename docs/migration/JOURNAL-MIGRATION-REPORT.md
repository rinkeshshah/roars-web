# Journal migration report

Twenty `/our-journal/` posts, moved from the WordPress export into the Astro
content collection. Written 2026-09-14.

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
| healthcare-app-development-company | 1089 | rank_math | Y | N | 0 | 0 | clean |

**Mangled: none.** Two needed real repair work and got it:

- `end-to-end-development-...` carried 33 shortcodes. Stripped, text intact.
- `loyalty-reward-program-app` was the only body built in Elementor. Unwrapped
  cleanly; its five images survived with their `src`, without their alt.

---

## 2. Descriptions

**All 20 have one. None was written by me.**

Two sources, in priority order:

1. `rank_math_description` from the export — 14 posts.
2. `docs/migration/squirrly-meta.csv` — the remaining 6.

The old site reused one excerpt across three posts. That does not survive here:
`scripts/assert-journal.mjs` fails the build if any two migrated posts emit the
same `<meta name="description">`. It currently passes, so all 20 are distinct.

**Length debt, carried deliberately.** 10 descriptions and 9 titles are longer
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
| healthcare-app-development-company | 78 | 205 |

---

## 3. Alt text

**Nothing was invented.** No alt was generated from a filename, and none was
generated from the image's surroundings.

**Hero images: 20 of 20 present. 13 have no alt text in the export.**

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
healthcare-app-development-company
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

## 5. Redirects

Source of truth: `docs/migration/roarsinc-redirects.conf`, supplied with the
Search Console decisions. Journal lines only; the other sections keep their
rules until they migrate.

`scripts/generate-journal-htaccess.mjs` emits `dist/.htaccess` on every build
(wired into `postbuild`, so it cannot be forgotten).

**48 rules shipped. 6 held back.** Held rules are written into the file as
comments with their reason, so the omission is visible on the server and not
only in the generator.

### Chained and broken rules found

Four problems, three of which need your decision. They are listed in full at
the end of this document under [Decisions needed](#decisions-needed).

1. `why-invest-in-ux-design-services-essential` redirects to itself. Infinite
   loop. Four more rules point at that same URL, so six break together.
2. `loyalty-reward-program-app` redirects to `/our-journal/`, but that slug is
   on your migrate-as-is list. `roars-url-decisions.csv` carries it twice with
   opposite verdicts.
3. `/our-journal/healthcare-app-development-company/` was already a redirect
   source in `src/lib/redirects.mjs`, pointing at the industries page. Same
   collision: migrate the post and then redirect away from it.
4. The two redirect layers disagreed about
   `crafting-one-of-a-kind-experiences-...-2`.

**No surviving chains.** After the holds, no shipped rule's target is another
rule's source, in either layer.

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
- all 48 targets and all 20 migrated URLs exist as pages in `dist/`
- the two layers never claim one source with different targets

**Live half — did not run, and is not reported as passing.** The four
assertions your brief actually asks about are HTTP facts:

- every journal redirect returns 301, not 302
- exactly one hop, no chains
- the target returns 200
- each of the 20 migrated URLs returns 200 at its trailing-slash form and does
  not itself redirect

Those cannot be observed from here. Outbound access to roarsinc.com is blocked
at the agent proxy — `https://www.roarsinc.com/` answers 403 to every request,
including the root. The script probes the root first for exactly this reason:
without that probe, a blocked proxy reports "all 68 journal URLs returned 403",
which looks like a catastrophic site failure and is entirely an artefact of the
network. It now prints `LIVE DID NOT RUN` and exits 1.

Run this from anywhere that can reach the site:

```
node scripts/verify-journal-redirects.mjs --live
node scripts/verify-journal-redirects.mjs --live --base=https://dev.roarsinc.com
```

Exit codes: `0` both halves ran and passed · `1` something failed ·
`2` static passed and live never ran. There is no path that returns 0 without
the live half having actually executed, except `--static-only`, which says so
in its own output and is what `npm run verify` uses.

---

## 6. What I could not check

- **Any live HTTP status.** Egress to roarsinc.com is blocked (403 on CONNECT
  at the agent proxy), confirmed with curl, WebFetch and the proxy's own
  status endpoint. Every redirect claim in section 5 is static analysis of the
  config and the build output.
- **That the `/wp-content/uploads/` images resolve.** Same reason.
- **`npm run assert:urls` fails**, and did so before this work — verified by
  stashing these changes and re-running. Nine inventory URLs have no page yet:
  seven UK city pages (open decision), `/schedule-ux-ui-meeting/` and
  `/thankyou/`. Nothing journal-related. It is pre-existing debt, not a
  regression, and it will block a phase-6 deploy gate until those pages land.

---

## Decisions needed

### 1. `why-invest-in-ux-design-services-essential` — infinite loop

The supplied map contains:

```
Redirect 301 /our-journal/why-invest-in-ux-design-services-essential/ \
             https://www.roarsinc.com/our-journal/why-invest-in-ux-design-services-essential/
```

That comes straight from `roars-url-decisions.csv` line 93, where the "target"
column was filled in with the source URL:

```
.../our-journal/why-invest-in-ux-design-services-essential/  0 clicks, 57 impr, REDIRECT,
  target .../our-journal/why-invest-in-ux-design-services-essential/
```

A rule pointing at its own source. Apache would loop until the browser gives
up. Four further rules aim at that same URL:

```
/our-journal/10-key-things-to-consider-when-doing-uxdesign/
/our-journal/3-design-mistakes-ux-designers-avoid/
/our-journal/saas-ux-design-how-to-build-products-that-users-actually-want-to-pay-for/
/our-journal/top-20-most-promising-ui-ux-companies/
```

Unlooping it does not fix them. `why-invest-in-ux-design-services-essential`
is not on the migrate-as-is list, so it renders the noindex "content pending
migration" holding page. A 301 into a noindex page drops the source from the
index and hands its equity to something that cannot hold it.

All six are held back. **What should those five source URLs point at?** If
`why-invest-...` is meant to be the destination, it needs to be migrated too,
which makes it post number 21.

### 2. `loyalty-reward-program-app` — migrated and redirected at the same time

The map redirects it to `/our-journal/`. It is also slug number 7 on your
migrate-as-is list, and it is now built with its five images.
`docs/migration/roars-url-decisions.csv` carries it **twice, with opposite
verdicts** — the only difference between the two rows is a trailing slash:

```
line  31  .../our-journal/loyalty-reward-program-app    1 click,  2 impr,  KEEP      "Earned clicks. Migrate at the identical slug."
line  94  .../our-journal/loyalty-reward-program-app/   0 clicks, 56 impr, REDIRECT  "No traffic, no demand. Fold into the nearest surviving page."
```

Same page, split across two Search Console rows. The KEEP row has the click,
the REDIRECT row has the impressions. The redirect map took the REDIRECT row.
I held it back, so the post is live. **Keep the post, or redirect it and drop
it from the twenty?**

### 3. `healthcare-app-development-company` — post vs industry page

`src/lib/redirects.mjs` already redirected
`/our-journal/healthcare-app-development-company/` to
`/industries/healthcare-app-development-company/`, on the note "EXACT slug
collision across two path prefixes. The industry page is commercial and wins."

That rule predates your migrate list, and your own decisions file contradicts
it. `docs/migration/roars-url-decisions.csv` line 76:

```
.../our-journal/healthcare-app-development-company/  0 clicks, 206 impr, REWRITE, target "same"
  "206 impressions, no clicks, avg pos 66. Google gets the topic, the page does not deliver."
```

REWRITE at the same URL, not REDIRECT. The paths do not actually collide
either — `/our-journal/...` and `/industries/...` are different URLs. What
collides is the intent: both target "healthcare app development", which is
presumably what prompted the original rule.

I commented the rule out with its reasoning intact; the post is live and
flagged `needsRewrite`, which matches the decisions file. **Confirm that is
right, or restore the redirect** — the only reason this is a question and not
a silent fix is that the note in `redirects.mjs` was a deliberate editorial
call by somebody.

### 4. `crafting-one-of-a-kind-experiences-...-2` — the two layers disagreed

| layer | target | state of that target |
|---|---|---|
| `.htaccess`, from your supplied map | `from-empathy-to-iteration-...` | migrated, real copy |
| `src/lib/redirects.mjs` → nginx | `cracking-the-code-how-ux-psychology-...` | not migrated, noindex holding page |

Your decisions file backs the supplied map. `roars-url-decisions.csv` line 103
sends it to `from-empathy-to-iteration-...`; the `redirects.mjs` entry was the
outlier, written earlier from slug similarity rather than from the Search
Console data.

So I stood the nginx entry down and kept the supplied map's rule: a 301 into
live content beats a 301 into a placeholder, and one URL should have one rule
rather than two layers racing. This one I decided rather than blocking on,
since the decisions file already answers it. **If `cracking-the-code-...` is
the better destination editorially, say so** — but then change the target in
the supplied map, not in `redirects.mjs`, so there is still only one rule for
that URL.

---

## Out of scope, and why

Two files outside the journal were touched. Both are journal redirects, which
your brief put in scope, and neither changes a non-journal page:

- **`src/lib/redirects.mjs`** — the two entries in decisions 3 and 4 above.
  Commented out with their reasoning, not deleted, so either is one edit to
  restore.
- **`package.json`** — `postbuild` now also runs the journal `.htaccess`
  generator, and `verify` gained the two journal gates. Without the first, the
  redirect file is generated only when somebody remembers, and `dist/` is
  rebuilt from scratch on every deploy, so it would never reach the server.

One more, which is journal-adjacent rather than outside it:

- **`src/layouts/BaseLayout.astro`** gained an optional `siteName` prop, so
  `og:site_name` can be `Roars` on journal posts as the brief requires. The
  default is unchanged, so every other route emits exactly what it did before.
