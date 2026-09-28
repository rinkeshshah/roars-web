# Handoff — roars-web rebuild

Written at the end of the session that built the Menu overlay and rebuilt the
homepage Services section. Read this before touching layout.

---

## 1. What this project is

Rebuild of roarsinc.com as a static Astro 7 site, implementing an approved
"Claude Design" prototype export with real content and images, keeping every
URL and the SEO scheme intact. No CMS. Content ships as files in the repo.

- **Prototypes:** `design/prototypes/*.dc.html` — the visual target.
  `design/prototypes/MANIFEST.md` maps prototype to route and flags which
  files are explorations rather than pages. Read it before opening anything.
- **URLs:** `docs/URL-INVENTORY.csv` is the only source of truth. Never invent
  a URL. When a design and the CSV disagree, the CSV wins.
- **Deploy:** push `main` → GitHub Actions builds → force-pushes `dist/` to
  the orphan `deploy` branch → Plesk pulls → dev.roarsinc.com. Production is
  a separate manual cutover. See `docs/DEPLOYMENT.md`.

---

## 2. The three things I got wrong, and what they cost

Read this section even if you skip the rest. All three cost hours.

### 2.1 An instrument that measures the wrong thing is worse than no instrument

`scripts/visual-diff.mjs` originally compared **text only**. Rules, dots,
dividers, circles, backgrounds, box geometry and the whole overlay frame were
invisible to it. So the Menu table read "184 deltas" while the deployed page
was missing its divider rules, its accent marks, its stat row, its logo and
its starfield. The number looked like progress and wasn't.

Three separate instrument bugs, each of which sent me chasing ghosts:

| Bug | Symptom | Fix |
|---|---|---|
| Canvas scale read from the transform matrix | 0.9932 vs the true 1.0000 — 0.7%, which is 6px at the hero and 68px down the page | calibrate from an **authored** dimension (`[data-screen-label][style*="height:"]`) |
| Text paired globally, not per section | "Product Development" in the hero rail paired with the one in Services, inventing ±2211px deltas | scope pairing to the section band |
| Overlap detector ignored clipping | Every closed accordion answer looked like it sat on the next question — a collapsed panel is `height:0;overflow:hidden` and its children still return full layout boxes | walk ancestors, drop anything a clipping one excludes; also skip `display:inline`, whose rect is a union of line boxes |

**Rule:** when the table disagrees with your eyes, suspect the table first.
Verify an instrument by reintroducing a bug it should catch.

### 2.2 Astro scoped styles do not cross component boundaries

A class passed to a component compiles to a selector that matches **nothing**,
silently. This shipped twice: a `Reveal` wrapper left 14 call sites' CSS inert,
and `.hero { min-height: 900px }` never applied because `class` was handed to
`Section`.

`scripts/assert-styles.mjs` now fails the build on any scoped selector that
matches nothing in `dist/`. It is wired into CI and `npm run verify`. Runtime
classes (`.is-open`, `.is-scrolled`, `.is-missing`) are exempt by an `.is-*`
rule — they are absent from static HTML by definition.

Also: the scoped-style compiler **strips a leading attribute selector**.
`[data-side='inner'] .x` silently collapses to `.x`. Use classes.

### 2.3 Flow layout was the wrong translation for one component

Every page here is flow layout, correctly — a page has to work at any width
and its content length is not known in advance.

The **Menu overlay is not a page.** It is a fixed overlay with a fixed amount
of content, and the export draws it as a 1440×900 canvas scaled to fit. I
translated that into flow layout and produced: arrow collisions at x=489
crossing the panel boundary, a `898fr` track that let the widest panel shove
the nav column off the left edge, and a contact bar that fell off any viewport
shorter than 900px.

`NavOverlay.astro` now does what the export does: one canvas, one
`scale(min(vw/1440, vh/900))`, geometry transcribed rather than re-derived.
Result: **zero deltas, text and non-text.** Mobile below 760px swaps to the
export's own flowing accordion.

This is the **only** component that gets this treatment. Do not extend it to
pages.

---

## 3. Standing rules

1. **Where the prototype is irregular, the irregularity IS the design.**
   Never normalise it. Two worked examples:
   - Services rows: the **indent** alternates (rows 1,3 at the rail; 2,4 at
     the container edge) but the **tracks** follow open/closed, not the
     indent, and the gaps below the rows are 40/43/58/0 — not a rhythm. I
     flattened this twice because "two rows disagreed with two rows". There
     was no majority because it alternates.
   - People say is a **cascade**: four sizes, four vertical offsets. Not a row.
2. **Counts are facts about the site, not mock values.** The export ships
   10 PROJECTS / 8 SECTORS / 5 SERVICES / 3 KITS. Ours are the inventory's:
   23 / 9 / 12 / 15.
3. **"Rinkesh A Shah" is permanent.** The export still ships the name
   scrambled as "Riinkesh A Sshah", 12 instances in Main alone.
4. **Five countries in the footer**, not the prototype's three. An office list
   is a factual claim, and five were measured to fit the slot.
5. **Testimonial attributions fail the build** until real names are supplied
   (`scripts/assert-attribution.mjs`). Do not invent them.
6. **Yellow is a ground where the prototype uses it as one, an accent
   everywhere else.** Do not introduce yellow grounds the prototype lacks.
7. **Ten-step type scale. Do not add an eleventh.** Prototype sizes snap to
   the nearest step, max 2px, recorded in the ACCEPTED register.
8. **No hot-linking roarsinc.com.** WordPress is being deleted. Images are
   root-relative `/wp-content/uploads/...` served by the new host.
9. **Deliberate additions must be labelled as such in a comment**, or a later
   pass "corrects" them out — or, worse, they get mistaken for fidelity work
   and defended. See §5.

---

## 4. Instruments

Run all of these before claiming anything is done.

| Script | What it catches | Notes |
|---|---|---|
| `scripts/visual-diff.mjs` | per-page geometry, type, colour vs the prototype | needs `SRC` on :4349 (repo root) and `BUILD` on :4351 (`dist/`). ~2 min per page. |
| `scripts/menu-diff.mjs` | the Menu overlay, in **canvas coordinates**, text **and** non-text furniture | serves `dist/` at its own root — serving it under `/dist/` 404s every asset and the island never hydrates |
| `scripts/assert-overlap.mjs` | any two painted text elements overlapping >6px, plus status, console errors, horizontal overflow, across all 8 basic pages | fast, ~30s. Run this on every layout change. |
| `scripts/assert-styles.mjs` | scoped CSS that matches nothing | in CI |
| `scripts/assert-urls.mjs` | inventory coverage | in CI |
| `scripts/assert-attribution.mjs` | unsourced names | in CI |

**Batch your edits and measure once.** Re-running visual-diff after every
CSS change is what made this session slow — fifteen runs at two minutes each.

---

## 5. Deliberate additions (do not "fix" these out, and do not defend them blindly)

- **Client logo row motion.** The export's row is static. Each mark fades up
  in turn and comes to full colour on hover. Staggered off `--i`.
- **`Contact Now` dot pulse.** Four seconds on the trailing dot only.
- **The scroll-progress ring on the logo: RESTORED, by request.** It was
  removed once, and the removal was right at the time: it reused the export's
  conic element and rendered as a pale filled circle behind the mark — the
  badge that had been explicitly cut — and came back as a complaint three
  times. The client has since asked for it back.

  **What was actually wrong was the construction, not the idea.** The ring
  must be a conic gradient with a radial MASK punching its centre out, so it
  is an annulus and cannot read as a disc on any ground. Without the mask the
  gradient fills the whole 52px circle and you get the badge again. Verified
  at three scroll positions and on both grounds; the centre stays clear.
  `src/components/LogoChip.astro` carries the note.

  The export's intro animation ships with it: a quarter turn and a slight
  overshoot on load, 1100ms after a 300ms delay. Both skip under
  `prefers-reduced-motion`.

- **The dashed rule under inner-page titles: REMOVED.** `assets/union.svg`,
  the hand-drawn scribble the export draws under "Agency", "Projects" and
  "Insights". Asked about once in the design chat and again on the built page,
  and removed both times. It is IN the export, so a fidelity pass will want to
  put it back and the visual diff will never object, because it carries no
  text. Do not restore it on any inner page.

  The industry hero is an inner page: the export draws the same scribble under
  "food &" at 6,112 with a `swoosh` keyframe, and it is NOT in the build. The
  star mark beside "roars" IS — that is `star-5.svg`, a different asset and a
  different decision.

The lesson generalises: an addition that resembles something the client
already rejected is not an addition, it is a regression with a comment on it.

---

## 6. Done

- **Menu overlay** — `scripts/menu-diff.mjs` reports **no deltas above 2px**,
  text (195/194) and furniture (85/83). Phase 1 accessibility intact and
  re-verified: focus trap, Escape, focus returned to the trigger,
  `aria-expanded` in sync, both close buttons wired (only the first was, so
  mobile close was dead), `prefers-reduced-motion` respected.
- **Homepage** — hero (all five positions zero), Services rows rebuilt
  structurally, About stats, Projects all-line, star marks, hero labels,
  review bar. Table 363 → ~250.
- **All 8 basic pages** — 0 overlaps, no horizontal scroll, all 200. Only
  console errors are the `/wp-content/uploads/` 404s.
- **69 of 194 inventory URLs build**, plus 4 covered by redirect: home, about,
  approach, contact, work + 23 project pages, 9 industries, 12 services,
  resources, legal.
- **Industry template** — `/industries/food-restaurant-app-development/`,
  built from `Roars v2 - Industries v2`. Table **232 → 109**, and ~79 of the
  109 are one artefact: the build has six sections where the export has seven
  (the closing grey band is removed, §5), and `visual-diff.mjs` joins sections
  BY ORDINAL, so the export's Footer pairs with nothing and every footer
  string reports MISSING and EXTRA at once. Nothing real is over 7px except
  the band itself and the shared top bar's right rail.
  Three things the geometry tree alone would not have given:
  the journey is **three** columns, not two — the tags are a column of their
  own at 1022 with a hairline of their own, not a strip under the body copy;
  the surfaces panels are **stacked**, all four in one 742x300 box, so the
  section height never moves when a seat is picked; and the selected tab
  steps 10px right and lights a dot at 504. Only the side-by-side showed the
  last one.
- **The receipt is live.** `src/scripts/ticket.ts`: the clock runs and the
  order walks its five states, as the export does — but only while the ticket
  is on screen, which on a 6800px page is the first screenful and nothing
  after it. The states are content (`statuses` in the entry) and
  `statusIndex` is server-rendered, so a crawler and a reduced-motion reader
  both get a real printed ticket rather than a stopped animation.
- **Search Console analysis** — `docs/search-console/FINDINGS.md`. Three
  findings that matter more than any layout delta; see §8.
- **Star marks as CSS masks.** The SVGs ship `fill="currentColor"`, which is
  meaningless in an `<img>` — it resolves to black, so every mark on a dark
  ground was invisible. Masks take the ink from context; no per-section
  `invert(1)`.

---

## 7. Pending, in priority order

### Blocking a production release
1. **WXR content export.** `src/content/posts/` is empty; the build warns
   every run. **121 of 194 URLs are missing and ~115 are `/our-journal/`
   posts.** They are indexed and earning impressions. Cutting over without
   them 404s all of them. This is content, not code — it needs
   *wp-admin → Tools → Export → All content*, or `wp export`.
   I cannot fetch it: this environment's network policy returns 403 on
   CONNECT to `www.roarsinc.com`.
2. **`wp-content/uploads/` and `httpdocs/tools/` uploads.** 20 images on the
   homepage alone 404 — founder portrait, 5 team avatars, 6 client logos,
   Services row-1 photo, project card photos. Every slot already holds its
   size and position, so these are not blockers, but the site looks unfinished
   without them.
3. **Two broken redirect targets** fail `assert-urls`: both point at journal
   posts that do not exist yet. They resolve themselves with item 1.

### Homepage, to finish it
- Footer bottom block sits ~38px high; the wordmark's y is +65 while the legal
  line is -38, so the wordmark box is still wrong relative to it.
- Insights date column needs a 27px inset (`x` 39 vs the export's 66).
- Industries intro paragraph is 65px high.
- The hero rotator starts on "lasts"; the export starts on "works".

### Pages not yet built against the v2 export
Only Main and Menu have been. Starting tables:

```
Main          ->  /                                              ~250
Approach      ->  /approach/                                      220
AI Automation ->  /s/product-development-company/    (12 routes)  221
Agency        ->  /about-us/                                      196
Industries v2 ->  /industries/food-restaurant-app-development/     251   (9 routes)
Contact       ->  /contact-us/                                    163
Resources     ->  /resources/                                     158
Projects      ->  /work/                                          144
```

Templates before instances — they cover the most routes per hour. Project
Detail (23 routes) and Insight-details (115 routes) are not in the diff
harness yet and should be added to `PAGES` in `visual-diff.mjs`.

### Not started
- `/tools/*.pdf` → add to the URL inventory so `assert-urls` covers them, and
  check whether any appear in the sitemap or are otherwise indexed.
- Contact form endpoint. Security constraints are non-negotiable and recorded:
  prepared statements only, no interpolation into SQL, never echo user input,
  credentials outside the document root, its own MySQL user with `INSERT` on
  one table and no `SELECT`/`DROP`, and `generate_lead` fired from the
  server's JSON response rather than the submit handler.
- UK city pages (8 URLs) — open decision, `docs/URL-INVENTORY-FINDINGS.md` §3.

---

## 8. Three findings that outrank any layout delta

From `docs/search-console/FINDINGS.md`:

1. **dev.roarsinc.com is indexed — 62 URLs** — against the rule that staging
   never is. The indexed dev paths are not Roars content: Japanese e-commerce
   boilerplate (`/info/wcontents/kadenho.html`, `/products/detail/312655727`).
   The same shape appears on the main host and on email.roarsinc.com.
   Injected URLs across four hosts in an unrelated language and vertical reads
   as a compromise, not a misconfiguration. **The rebuild does not fix this.
   The files are on the server now.**
2. **The homepage is split across `http://` and `https://`,** and the insecure
   version earns 198 clicks to the secure one's 153. That is 351 clicks
   divided across two URLs that should be one. A 301 is worth more than
   anything on the layout list.
3. **96 descriptions over 165 chars and 54 titles over 65.** The United States
   produces 31,827 impressions — 55% of the site's total — and 8 clicks: a
   0.03% CTR at position 37.5. `/s/ecommerce-development-company/` alone has
   7,231 impressions and zero clicks. The publish gate fixes this by
   construction. **Do not let anyone "fix" it by relaxing the gate.**

---

## 9. How to work this project

1. **Work from the deployed URL, not screenshots.** dev.roarsinc.com carries
   every push. Asking the client to annotate screenshots put the work back on
   them and I still misread the marks. A URL plus a section name is enough.
2. **One page at a time, driven to zero, then the next.** Agreed working
   order after Main: templates before instances.
3. **Systemic causes before individual rows.** One wrong token produces thirty
   deltas. In this session: a line-height of 43px where the export had 84
   accounted for 41px of section drift and everything below it; a 25px error
   in one margin moved four Services rows at once.
4. **Batch edits, measure once, report the table.** Before and after, so the
   number is visible.
5. **Run `assert-overlap.mjs` on every layout change.** It is fast, and it
   caught a collision I had just introduced — pinning the testimonial band to
   the export's 525px ran the longest quote into "Prev." by 14px. The band is
   `min-height` now: the export's mock quotes fit, the real ones are longer,
   and truncating a client's words to save 37px is not a trade worth making.
6. **Say what is not done.** Report the table, the accepted register, and the
   list of what was skipped and why.

---

## 10. Where real content beats the prototype

The export is a mock. Its quotes are short, its counts are invented, its
founder's name is misspelled and its office list is three countries. Where
real content does not fit the mock's box, the content wins and the box grows —
and the divergence gets recorded in the ACCEPTED register with a reason, so
the table keeps meaning something.

That register is the project's memory. Keep it honest and keep it short.
