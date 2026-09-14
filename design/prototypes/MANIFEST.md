# Prototype manifest — export 2

Assets (`assets/`, `brand/`) are **byte-identical** to the previous export.
Only the `.dc.html` files changed. Do not recommit assets.

## CANONICAL — these are the build targets

| Prototype | Route |
|---|---|
| Roars v2 - Main | `/` |
| Roars v2 - Agency | `/about-us/` |
| Roars v2 - Approach | `/approach/` |
| Roars v2 - Contact | `/contact-us/` |
| Roars v2 - Projects | `/work/` |
| Roars  v2 - Project Detail | `/work/[slug]/` (note: TWO spaces after "Roars") |
| Roars v2 - AI Automation | `/s/[slug]/` template |
| Roars v2 - Industries v2 | `/industries/[slug]/` template |
| Roars v2 - Insights | `/our-journal/` |
| Roars v2 - Insight-details | `/our-journal/[slug]/` |
| Roars v2 - Guides | `/resources/` |
| Roars v2 - Guide Detail | `/resources/[slug]/` |
| Roars v2 - Menu | nav overlay, not a route |
| Roars v2 - CTA Band | shared component |
| Roars v2 - Brand Guidelines | reference only, not a route |

**All 12 page prototypes changed in this export.** Every one needs
re-diffing, not just Main.

## EXPLORATION / REFERENCE — do NOT build as routes

| File | What it is |
|---|---|
| Roars v2 - Hero Backgrounds | hero ground explorations |
| Roars v2 - Footer Backgrounds | footer ground explorations |
| Roars v2 - Hero Footer WOW | hero/footer exploration |
| Roars v2 - Inner Header Options | inner-page header explorations |
| Roars v2 - Inner Page Headers | inner-page header treatment — may be canonical for inner pages, ASK |
| Roars v2 - Signature Element | brand device, NEW — ASK before using |
| Roars v2 - Signature System | brand system, NEW — ASK before using |
| Canvas | empty, 206 bytes |
| Roars - Main / About / Projects / Project Detail | **V1 files.** Superseded. Ignore. |

## Known issues that survive every re-export

- **"Riinkesh A Sshah"** is scrambled in the export itself (12 instances in
  Main alone). Correct to "Rinkesh Shah" on import, permanently, via the
  accepted register. It will come back on every future export.
- **Footer offices** show 3 in the prototype. We use 5 countries: an office
  list is a factual claim, and 5 were measured to fit the slot.

## Confirmed changes in Main

- `space.jpg` removed entirely: 6 usages before, 0 now.
- Hero is a **full-bleed yellow ground** — "Ship product that scales",
  black display type, pill CTA, five-label rule across the base.
- Footer is a warm dark grain texture with a large `roars` wordmark.
- Projects section changed.
- Total height unchanged at 10,022px.
