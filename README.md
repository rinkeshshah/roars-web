# Roars v2: Astro handoff

Static site. No CMS, no database for content, no server runtime except one
PHP form endpoint. Claude Code is the editor: content is markdown in this
repo, and pages are composed from a fixed component library.

Drop this folder into the repo root. `CLAUDE.md` sits at root where Claude
Code reads it automatically.

## Read in this order

1. **`CLAUDE.md`** — build rules. The overriding rules are in the first third.
2. **`docs/BUILD-ORDER.md`** — eight phases, each with an exit test.
3. **`docs/URL-INVENTORY.csv`** — 194 live URLs. Authoritative. When this and a design spec disagree, this wins.
4. **`docs/URL-INVENTORY-FINDINGS.md`** — what is wrong with the current site, and what needs a human decision.
5. **`docs/SEO-SPEC.md`** — every meta tag, schema block, header and analytics event.
6. **`docs/DEPLOYMENT.md`** — Plesk setup, nginx directives, security posture.
7. **`docs/DESIGN-SYSTEM.md`** — why the tokens are what they are.
8. **`design/`** — the approved design. `specs/*.md` has exact values. `prototypes/*.dc.html` opens in a browser.

## Files ready to use

```
CLAUDE.md                       build rules, root level
astro.config.mjs                trailing slash, redirects, sitemap, images
.github/workflows/deploy.yml    build in CI, rsync to Plesk
src/styles/tokens.css           design tokens, ten-step type scale
src/lib/site.ts                 global constants
src/lib/redirects.mjs           301 map + CI validator
scripts/README.md               what each build-time script must do
docs/CLAUDE-DESIGN-PROMPT.md    for designing NEW pages later, not this build
docs/KEYWORD-PLAN.md            intent map, phase 8 content plan
```

## What changed from the Next.js handoff

Carried over untouched: the URL inventory and findings, all 17 design specs
and prototypes, `tokens.css`, the design system doc, the keyword plan, and
roughly 95% of the SEO spec.

Rewritten: `CLAUDE.md`, the build order, `next.config.js` to
`astro.config.mjs`, `redirects.ts` to `redirects.mjs`, and the Payload
collections to Astro content collections with Zod schemas.

Two things got better:

- The CMS publish gate became a build-time script. Thin content fails CI
  instead of failing on save.
- No SPA double-count in analytics. Static pages mean full page loads, so
  standard GTM behaviour is correct and the `page_view_spa` workaround in
  `SEO-SPEC.md` 14.2 does not apply.

## Three things still open

**Search Console exports.** Block Phase 7. Domain property, 16 months, all
rows: Queries, Pages, and Queries filtered to positions 5-20.

**WordPress content export.** Blocks Phase 5. REST API is open, so no full
database dump is needed. Squirrly meta is the exception: it lives in
`wp_qss`, not postmeta, and needs its own export.

**The `/work/` index layout.** 23 projects against a design drawn for five.
Design decision, brief in `docs/CLAUDE-DESIGN-PROMPT.md`.

## Five ways this goes wrong

1. `trailingSlash: 'always'` gets dropped, or nginx strips slashes, and all 194 URLs duplicate.
2. A route gets built from a design spec instead of the CSV, and a ranking page 404s.
3. `assert-urls.mjs` is not wired into CI, so a dropped URL ships silently.
4. Astro's built-in redirects ship as meta-refresh pages instead of real nginx 301s.
5. The prototypes' `transform: scale()` canvas trick gets ported as if it were layout.

Each is covered in `CLAUDE.md`. Each is cheap to prevent and expensive to find later.
