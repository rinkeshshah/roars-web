# Scripts

All run in CI before deploy. None run on the server.

## `validate-content.mjs`
Replaces the CMS publish gate. Fails the build on: body under 300 words,
duplicate `seo.title` or `seo.description`, content under 30% unique versus
siblings, missing or out-of-range SEO fields, more than one `h1`, skipped
heading levels, broken internal links, images without alt text.

## `assert-urls.mjs`
**The important one.** Reads `docs/URL-INVENTORY.csv` and asserts that every
URL either exists in `dist/` or appears in the redirect map. Fails the build
otherwise. This is what makes it impossible to silently drop a ranking URL.

## `validate-redirects.mjs`
Wraps `validateRedirects()` from `src/lib/redirects.mjs`. Catches chains,
self-redirects, duplicates and missing trailing slashes.

## `generate-nginx-redirects.mjs`
Emits `dist/nginx-redirects.conf` from the redirect map, as real 301s.
Astro's built-in redirects are meta-refresh pages and pass equity poorly.
Paste the output into Plesk's Apache & nginx Settings for the domain, or
include it from there.

## `migrate-wordpress.mjs`
Not written yet. Waiting on the WordPress export. Must:

1. Read the REST export (`posts`, `pages`, plus REST-exposed custom types).
2. **Strip Elementor wrappers.** Content sits ~15 div layers deep; real text
   is in `.elementor-widget-container`. Unwrap, then drop all `elementor-*`
   classes and `data-*` attributes.
3. Convert the remaining HTML to clean markdown.
4. Map `date` to `publishedAt`. **Do not map `modified`.** 37 posts share
   2022-08-31, 14 share 2025-08-26, 10 share 2023-04-12. Bulk operations,
   and reproducing them is a manufactured-freshness signal.
5. Join the Squirrly export onto `seo.title` / `seo.description`. Squirrly
   lives in `wp_qss` (serialised, keyed on `url_hash`), with per-post
   overrides in postmeta that take precedence.
6. Map categories and tags. Posts carry up to four categories.
7. Rewrite in-body `wp-content` image URLs to local asset paths.
8. Flag, do not silently migrate:
   - Post 15170 (title, excerpt and body are three different articles)
   - Any post whose title shares under 20% of its vocabulary with its body
   - Any post under 300 words, for the consolidation list
9. Write a report: migrated, flagged, skipped, with reasons.

Run against a scratch directory first. Inspect ten by hand. Idempotent.
