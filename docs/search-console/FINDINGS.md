# Search Console, last 16 months

Raw exports in this directory. 409 clicks total (279 desktop, 129 mobile,
1 tablet) against ~57,400 impressions. What the data changes.

---

## 1. dev.roarsinc.com IS INDEXED — 62 URLs

CLAUDE.md says "Dev is protected (basic auth + `blog_public = 0`). Never let
staging get indexed." It is indexed.

Worse, the indexed dev URLs are not Roars content:

```
dev.roarsinc.com/info/wcontents/guide_shitadori.html
dev.roarsinc.com/info/wcontents/kadenho.html
dev.roarsinc.com/products/detail/312655727
dev.roarsinc.com/category/205/009/
```

Japanese e-commerce boilerplate and product/category paths. The same shape
appears on the main host as `/details/173489217`, `/cate-89`, `/cate-72-76`
and on `email.roarsinc.com/?products/detail/...`.

**This reads as a compromise, not a misconfiguration.** Injected URLs across
four hosts, in a language and vertical unrelated to the business, is the
signature of a spam injection. It is not something the rebuild fixes: the
files or database rows are on the server now.

**Recommended, in order:** confirm whether those paths return 200 today; if
so, treat it as an incident before cutover. Then `Disallow` and remove dev
from the index. Do not migrate anything from those paths.

Other hosts also indexed, all with zero clicks: `projects.` (220 impressions),
`meet.` (37), `email.` (25), `notes.` (8).

---

## 2. The homepage is split across http:// and https://

| URL | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| `http://www.roarsinc.com/` | **198** | 4,969 | 3.98% | 16.31 |
| `https://www.roarsinc.com/` | 153 | 18,041 | 0.85% | 9.08 |

The **insecure** version earns more clicks than the secure one. 351 homepage
clicks are split across two URLs that should be one. The nginx config must
301 http→https and www→www consistently, and that is worth more than any
layout work on this list.

Note the CTR gap: 3.98% at position 16 against 0.85% at position 9. The
better-ranking URL converts five times worse, which points at the title and
description, not the ranking.

---

## 3. Huge impressions, zero clicks — the meta-length problem, quantified

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| `/s/ecommerce-development-company/` | 7,231 | **0** | 63.2 |
| `/industries/healthcare-app-development-company/` | 2,800 | 1 | 45.8 |
| `/our-journal/end-to-end-development…-2/` | 1,364 | **0** | 60.5 |
| `/our-journal/how-to-hire-dedicated-developers/` | 1,941 | **0** | 77.4 |
| `/s/growth-hacking-agency/` | 1,494 | **0** | 60.5 |

By country the same pattern is stark:

| | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| India | 321 | 10,800 | 2.97% | 13.2 |
| United States | 8 | **31,827** | **0.03%** | 37.5 |
| United Kingdom | 9 | 7,588 | 0.12% | 38.9 |

The US produces 55% of all impressions and 2% of all clicks, at position 37.
This is the 96 over-length descriptions and 54 over-length titles showing up
as revenue. The publish gate in `src/content.config.ts` fixes it by
construction — see docs/OPEN-DECISIONS.md, and do not widen the gate.

Note `…-2` in that table: a duplicate URL with 1,364 impressions. The
canonical version has 2,347. Both are indexed and competing.

---

## 4. Mobile ranks far better than desktop

| Device | Impressions | Position |
|---|---|---|
| Desktop | 42,884 | 35.8 |
| Mobile | 14,269 | **19.3** |

Sixteen places better on mobile. The rebuild is mobile-capable by default,
but this says desktop is where the ranking problem lives.

---

## 5. Every page that earns clicks is in the inventory

Checked all 204 main-host URLs against `docs/URL-INVENTORY.csv`. Every URL
with a click is present. 67 are absent, and all of them are one of:
WordPress pagination (`/our-journal/page/3/`), taxonomy
(`/category/…`, `/tag/…`, `/author/admin/`), Elementor internals
(`/elementskit-content/…`), the injected paths above, or
`/Roars-Corporate-Presentation-website.pdf` (68 impressions, a root-level PDF).

**Nothing with traffic is at risk of being lost at cutover.** That was the
open question and the answer is clean.

`/work/the-presidents-club/` deserves a note: 10 clicks at position 5.76,
the best-performing page on the site after the homepage. It is in the
inventory and it is built.

---

## 6. A gap in the data, and a recent change

`chart.csv` jumps from 2026-07-19 to 2026-09-09 with nothing between. The
three days that follow are unlike anything before them:

| Date | Impressions | Position |
|---|---|---|
| 2026-09-09 | 568 | **12.3** |
| 2026-09-10 | 495 | **9.0** |
| 2026-09-11 | 386 | **10.4** |

Average position across the prior 16 months is roughly 31. Three days at 9-12
is a step change, not noise. Worth knowing what happened on 9 September
before attributing any post-launch movement to the rebuild.
