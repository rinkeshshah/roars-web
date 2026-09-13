# Export runbook: Squirrly meta, WordPress content, anomaly check

Tasks A, B and C from the v2 migration prep. All three are **scripts plus a
runbook rather than finished output**, for one reason:

> **This build container cannot reach the site or the database.**
> The egress proxy answers `403 Forbidden` to `CONNECT` for
> `www.roarsinc.com:443`, `dev.roarsinc.com:443` and `roarsinc.com:443`
> (organisation policy denial, confirmed against
> `$HTTPS_PROXY/__agentproxy/status`). And `wp-config.php` is untracked by
> design, per the repo's `CLAUDE.md`, so there are no database credentials
> here and no dump in the tree.
>
> This is the same wall `docs/PHASE-4-RUNBOOK.md` hit, and it says so in its
> own opening paragraph. Same answer: run these where the access is.

Every script has been syntax-checked, and `content-anomalies.py` and
`compare-freshness.py` were run end to end against a fixture built to
reproduce the post-15170 shape. They work; they just need real input.

Run them from the WordPress root on the server, or from any machine that can
reach the site.

---

## A. Squirrly meta

```bash
wp eval-file docs/roars-v2-build-handoff/export/squirrly-meta.php \
    docs/roars-v2-build-handoff/squirrly-meta.csv
```

### The handoff's query is incomplete, and this matters

The bundle proposes:

```sql
SELECT ... FROM wp_posts p JOIN wp_postmeta m ON m.post_id = p.ID
WHERE p.post_status = 'publish'
  AND (m.meta_key LIKE '_sq%' OR m.meta_key LIKE 'sq_%');
```

Two problems, both verified against the plugin source in this repo:

**1. It misses `wp_qss`, which is where the snippets actually live.**
Squirrly SEO keeps per-URL SEO in its own table, not in postmeta:

```
wp_qss ( id, blog_id, post, URL, url_hash, seo, date_time )
```

`squirrly-seo/config/config.php:28` defines `_SQ_DB_` as `'qss'`, and
`models/Qss.php:281` creates the table. Both `seo` and `post` are
PHP-serialised arrays written through `maybe_serialize` (`models/Qss.php:146`,
`:199`). Rows are keyed by `url_hash`, not by post ID, so there is no join to
`wp_posts` at all. Run the handoff's query and you get the overrides while the
real titles and descriptions stay behind.

**2. The `sq_%` half matches nothing.** Every `sq_*` name in the plugin
(`sq_seosettings`, `sq_manage_snippet`, `sq_auto_metas`, and so on) is an
option in `wp_options`. None are post meta.

What postmeta *does* carry is a small set of per-post overrides: `_sq_title`,
`_sq_description`, `_sq_keywords`, `_sq_old_slug`, `_sq_sla`, `_sq_video`,
`_sq_jsonld_custom`, `_sq_jsonld_builder`, `_sq_pixel_custom`,
`_sq_woocommerce`, `_sq_image_downloaded`. Of these, `_sq_title` and
`_sq_description` are read as overrides in `models/domain/Sq.php:79` and `:95`,
so **where both stores hold a value, postmeta wins** and the migration must
resolve it that way.

`squirrly-meta.php` exports both, unpacking the serialised `qss.seo` blob into
one row per key. Columns:

| Column | Notes |
|---|---|
| `source` | `qss` or `postmeta` — decides precedence on conflict |
| `post_id` | resolved by permalink; empty for orphaned qss rows |
| `post_type`, `post_name`, `post_title` | |
| `url` | the qss URL, or the permalink |
| `meta_key` | unpacked key, e.g. `title`, `description`, `_sq_title` |
| `meta_value` | scalars as-is, nested arrays JSON-encoded |
| `date_time` | qss row timestamp |

It writes nothing back.

### Reading the freshness summary

The script prints the published-document count and the newest `post_date_gmt`
and `post_modified_gmt`. Production had **194 published URLs when crawled on
13 Sep 2026**. A materially lower count, or a newest-modified date behind the
newest `lastmod` in `../docs/URL-INVENTORY.csv`, means the source is behind
production. For the per-URL picture, run the comparator in section D.

---

## B. WordPress REST export

```bash
./docs/roars-v2-build-handoff/export/wp-rest-export.sh

# or against dev, which sits behind basic auth
BASE=https://dev.roarsinc.com BASIC_USER=... BASIC_PASS=... \
  ./docs/roars-v2-build-handoff/export/wp-rest-export.sh
```

Pulls `types.json` first, then every needed collection at `per_page=100`,
paging on the `X-WP-TotalPages` header, into `../wp-export/`. Taxonomies and
users follow.

The types it looks for, taken from the `wp_type` column of
`URL-INVENTORY.csv`:

| `wp_type` | Records | Post type |
|---|---|---|
| `post` | 115 | `post` |
| `page` | 20 | `page` |
| `service` | 12 | `service` |
| `industries` | 9 | `industries` |
| `free_stuff` | 15 | `free_stuff` |
| `post(work)` | 23 | `work` |

**On the work type.** The inventory records it as `post(work)`, which reads as
case studies living under the standard `post` type rather than a custom one.
The existing theme has `single-service.php`, `archive-industries.php` and
`archive-free_stuff.php` but no `single-work.php`, and `work.php` queries
`cat=22` — a *category*, not a post type. So `/work/[slug]/` is most likely
category 22 of `post`, and the script's probe for a `work` type will report it
as not exposed. That is the expected result, not a failure: pull those 23 via
`categories` instead. The script's report will make which it is unambiguous.

`EXPORT-REPORT.md` lists the exposed types, the needed-but-not-exposed ones
(the only ones requiring a database route) and the record count per collection.
Check those counts against the table above before moving on.

---

## C. Content anomalies

```bash
python3 docs/roars-v2-build-handoff/export/content-anomalies.py \
    docs/roars-v2-build-handoff/wp-export \
    docs/roars-v2-build-handoff/content-anomalies.md
```

Needs B's output. For each document it measures what share of the distinct
meaningful words in the title also appear in the body, dropping stopwords and
words of three characters or fewer so the score reflects subject matter rather
than grammar. Under **20 percent** is flagged.

Post 15170 is the known case and the reason for the check: its title, excerpt
and body are three different articles. The report shows title/excerpt and
excerpt/body alongside title/body, because 15170 diverges on all three and that
pattern distinguishes a genuinely mismatched record from a merely oblique title.

It also lists, without flagging:

- documents under **300 words** — the Phase 7 consolidation shortlist, and the
  threshold at which `src/fields/seo.ts` blocks publishing
- duplicate and near-duplicate titles, to cross-check against the
  cannibalisation clusters in `../docs/URL-INVENTORY-FINDINGS.md`

Reports only. Fixes nothing, by instruction.

Verified against a fixture reproducing the 15170 shape: it scored the mismatched
record at 0 percent, caught a thin post and a duplicate-title pair, and did not
false-flag a well-formed post.

---

## D. Freshness comparison

```bash
python3 docs/roars-v2-build-handoff/export/compare-freshness.py \
    docs/roars-v2-build-handoff/wp-export \
    docs/roars-v2-build-handoff/docs/URL-INVENTORY.csv
```

Diffs whatever was exported against the production reference in the inventory:
URLs missing from the export, URLs the inventory does not list, and per-URL date
drift where the export's `modified` predates production's `lastmod`. Ends with a
verdict. Run it if the export came from dev, or from any source whose currency
is uncertain.

---

## What is not blocked, and its answer

**Is the Redirection plugin installed? No.**

`wp-content/plugins/` holds 26 plugins and Redirection is not among them, which
confirms what the repo's `CLAUDE.md` already states. There is no
`wp_redirection_items` table to export and no existing 301 map to conflict with
the new one.

What is installed is `wpcf7-redirect`, which is Contact Form 7's post-submit
form redirect and has nothing to do with URL-level 301s.

The practical consequence for the migration: **`src/lib/redirects.ts` is the
only redirect map**, so there is no legacy layer to reconcile. Worth confirming
two things on the server, since neither is visible from the filesystem:

1. Root `.htaccess` — the only other place a hand-written 301 could hide.
   `CLAUDE.md` marks it as environment-specific and not to be promoted between
   environments, so dev's copy may not match production's. Check production's.
2. Cloudflare — you are on Cloudflare DNS, and Redirect Rules or Page Rules
   configured there would be invisible to both the filesystem and the database.

```bash
grep -nE 'Redirect|RewriteRule' /path/to/wordpress/.htaccess
```
