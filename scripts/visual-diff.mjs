#!/usr/bin/env node
/**
 * Measure a built page against its approved prototype. No prose, no eyeballing.
 *
 *   node scripts/visual-diff.mjs Main /
 *   node scripts/visual-diff.mjs Agency /about-us/
 *   node scripts/visual-diff.mjs            # every mapped page
 *
 *   SRC=http://127.0.0.1:4349   serves the repo root (for design/prototypes/)
 *   BUILD=http://127.0.0.1:4351 serves dist/
 *
 * WHY
 * ---
 * Reading specs and describing differences in prose missed, in order: a scope
 * bug that made 14 rules inert, a second one that cost the hero 170px of
 * height, a 40px indent error repeated in eleven places, and five section
 * heights that were individually wrong but summed to roughly nothing. Every
 * one of those is obvious in a table of numbers and invisible in a paragraph.
 *
 * The point is not pixel-identity. The prototypes are absolutely positioned
 * 1440 canvases; the build is flow layout that has to work at every width.
 * The goal is visually indistinguishable AT 1440. Where closing a delta would
 * require absolute positioning, that is reported as UNFIXABLE-IN-FLOW rather
 * than done.
 *
 * HOW ELEMENTS ARE MATCHED
 * ------------------------
 * The prototypes are div soup with no stable hooks, so the only reliable join
 * key is the rendered text itself. Leaf elements carrying text are collected
 * from both sides, normalised, and paired in document order within each
 * duplicate group ("View sector" appears eight times). Text on one side only
 * is reported as MISSING or EXTRA, which is how a dropped block shows up.
 *
 * Sections join by ordinal against the prototype's [data-screen-label] bands.
 *
 * THE CANVAS SCALE
 * ----------------
 * support.js scales the 1440 canvas to the viewport. getBoundingClientRect is
 * affected by that transform; computed font metrics are not. So geometry from
 * the prototype is divided back out by the measured scale and type is read
 * as-is. Getting this wrong would make every coordinate silently ~1% off.
 */
import { chromium } from 'playwright'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC = process.env.SRC || 'http://127.0.0.1:4349'
const BUILD = process.env.BUILD || 'http://127.0.0.1:4351'

/** Built route -> prototype basename. Routes not built yet are simply absent. */
const PAGES = [
  ['Main', '/'],
  ['Agency', '/about-us/'],
  ['Approach', '/approach/'],
  ['Contact', '/contact-us/'],
  ['Projects', '/work/'],
  ['Industries v2', '/industries/food-restaurant-app-development/'],
  ['AI Automation', '/s/product-development-company/'],
  ['Resources', '/resources/'],
]

const VENDOR = '/tmp/vendor'
const CDN = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': `${VENDOR}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': `${VENDOR}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': `${VENDOR}/babel-standalone/babel.min.js`,
}

/**
 * THE PROTOTYPES ASK GOOGLE FONTS FOR INTER AND DO NOT GET IT.
 *
 * `<link href="fonts.googleapis.com/css2?family=Inter...">` fails closed in a
 * sandboxed runner — here with ERR_CONNECTION_RESET — and the page silently
 * falls through its stack to Arial. `document.fonts` comes back EMPTY and
 * nothing in the render says anything is wrong.
 *
 * Arial is far narrower than Inter at the same size and tracking: the string
 * "Human-centered design that turns complex ideas into easy, elegant user
 * experiences" measures 458px against Inter's 569px, a 24% difference. So a
 * 191px column takes three lines in the prototype and four in the build, and
 * every block whose height follows wrapped text, and everything positioned
 * under it, disagrees. That is not the build being wrong.
 *
 * Declared type — size, weight, leading, tracking, colour — was never
 * affected, because those are computed values. Wrapping, block heights and
 * anything that flows after them were, for every page measured before this.
 *
 * Serving BOTH sides the site's own woff2 is also the honest comparison: it
 * is the font that ships. Inlined as a data URI so it needs no CORS header
 * and no second request.
 */
const INTER = join(import.meta.dirname, '..', 'public', 'fonts', 'inter-var-latin.woff2')
const INTER_CSS = existsSync(INTER)
  ? `@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;` +
    `src:url(data:font/woff2;base64,${readFileSync(INTER).toString('base64')}) format('woff2-variations');}`
  : null

/** Fulfil the prototype's Google Fonts request with that face. */
async function routeFonts(page) {
  if (!INTER_CSS) {
    console.warn('WARNING: public/fonts/inter-var-latin.woff2 missing; the prototype will render in a fallback font and every wrap will be wrong.')
    return
  }
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: INTER_CSS }),
  )
}

/* Tolerances. 2px on geometry is the brief; type and colour must match. */
const GEO_TOL = 2

/**
 * Deliberate divergences from the prototype, with the reason. These are
 * DECISIONS, not debt: they are listed separately so they stop reappearing as
 * work, and so that anyone reading the table can see what was chosen and why.
 * Adding to this list is how you close a delta by deciding, rather than by
 * changing the build. Do not add anything here to make a number go away.
 */
const ACCEPTED = [
  { match: /^Skip to content$/, why: 'a11y: the prototypes are div soup and ship no skip link' },
  { match: /^(Open|Close) menu$/, why: 'a11y: real button label; the prototype uses a bare glyph' },
  { match: /^[+\u2013\u2212\u00d7*\u00ae]$/, why: 'accordion glyphs are drawn as CSS bars so the +/- change is one transform, not a font swap' },
  { match: /^USA · UK · India$/, why: 'offices: five countries by decision; measured 185px in a 234px slot' },
  { match: /^India · USA · UK · Belgium · Germany$/, why: 'offices: see above' },
  { match: /^Sign-up opens when the new site goes live\.$/, why: 'honest pending state; the endpoint is not wired' },
  { match: /^Read about /, why: 'accordion panels need a real link out; the prototype has none' },
  { match: /^Approach$/, why: 'footer nav is five items by decision; Approach stays in the overlay' },

  /* The footer's closing CTA and its tagline are PER PAGE by decision. The
     export prints one sentence and "Space of Product Solutions*" on all
     fourteen routes; a visitor who read the CTA band then reached the footer
     read the same line twice, and every page offered search engines the same
     closing copy. So the export's strings are MISSING and each page's own are
     EXTRA, on every page, forever. That is the decision working, not drift. */
  { match: /^Find how we can help you get from A to B\. Our love/, why: 'footer CTA is per page; this is the default, not every page' },
  { match: /^Space of ProductSolutions$/, why: 'footer tagline is per page; the house line is "user experience matters"' },
  { match: /^(Let.s get your project started\.|Want the team behind 250 products\?|Got something that isn.t working\?|Bring us your least favourite part of the week\.)$/, why: 'per-page footer CTA title' },
  { match: /^(Tell us what you are building|Tell us what is broken|A 30-minute call\. We tell you honestly)/, why: 'per-page footer CTA description' },
  { match: /^(user experience matters|250 products since 2005|problem first, always|automation that earns its place)$/, why: 'per-page footer tagline' },

  /* REMOVED: four entries excusing the Services normalisation — "row name in
     the left rail on every row" and "mock drift on row 3, normalised". Both
     described a build that had flattened the export's alternating indent, and
     both were wrong: the indent alternates by design and row 3 is indented on
     purpose. The rows now follow the export, so there is nothing to excuse.
     An ACCEPTED entry that outlives the decision it recorded is worse than no
     entry, because it suppresses the row that would have caught the regression. */
  /* The ten-step scale HOLDS. The prototypes use 46 sizes; collapsing them was
     the point, so an 18px or 20px value snaps to the nearest step and the 2px
     difference is accepted. A scale that grows to fit every prototype value
     is not a scale. See CLAUDE.md, Design system. */
  { field: 'fs', match: /./, why: 'ten-step type scale: prototype sizes snap to the nearest step, max 2px' },
  /* The prototypes carry the corrupted spelling. The build carries the
     corrected one, so the diff reports it on both sides. See
     scripts/assert-attribution.mjs. */
  { match: /Riinkesh|Sshah/, why: 'prototype ships the scrambled founder name; the build corrects it' },
  { match: /Rinkesh A Shah|Rinkesh, no pitch deck/, why: 'corrected founder name, see above' },
]
/* An entry with `field` accepts only that measurement for that text; an entry
   without one accepts the element's presence or absence outright. */
const acceptedReason = (t, field) =>
  (ACCEPTED.find((a) => a.match.test(t.trim()) && (a.field ? a.field === field : !field)) || {}).why

const norm = (s) => s.replace(/\s+/g, ' ').trim()
const px = (v) => Math.round(parseFloat(v) * 10) / 10

/** Runs in the page. Collects sections and text leaves with their metrics. */
const COLLECT = (opts) => {
  const { protoMode, noScale } = opts

  /* The canvas transform scales rects but not computed type. */
  /**
   * Calibrate against an AUTHORED dimension rather than reading the transform
   * matrix. Reading the matrix looked right and was off by 0.7%, which is 6px
   * on the hero and 68px down the page — enough to make every section report a
   * delta that did not exist. The bands carry their true height in an inline
   * style, so the ratio of rendered to authored height is the real scale.
   */
  let scale = 1
  if (protoMode && !noScale) {
    const samples = []
    for (const el of document.querySelectorAll('[data-screen-label][style*="height:"]')) {
      const m = el.getAttribute('style').match(/height:\s*([\d.]+)px/)
      if (!m) continue
      const authored = parseFloat(m[1])
      const rendered = el.getBoundingClientRect().height
      if (authored > 100 && rendered > 0) samples.push(rendered / authored)
    }
    if (samples.length) {
      samples.sort((a, b) => a - b)
      scale = samples[Math.floor(samples.length / 2)]
    }
  }

  const visible = (el, r) => {
    if (!r.width || !r.height) return false
    const c = getComputedStyle(el)
    if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) === 0) return false
    if (typeof el.checkVisibility === 'function' && !el.checkVisibility()) return false
    /* A closed accordion panel is height:0 with overflow:hidden, so its text
       still reports a box. Without this every closed answer counted as text
       the prototype was missing. */
    for (let a = el.parentElement; a; a = a.parentElement) {
      const ac = getComputedStyle(a)
      if (ac.overflow !== 'visible' && a.clientHeight === 0) return false
      if (a.hasAttribute && a.hasAttribute('hidden') && ac.display !== 'none') return false
    }
    return true
  }

  const sections = []
  const sel = protoMode ? '[data-screen-label]' : '.sec, footer.ft'
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect()
    if (!visible(el, r)) continue
    sections.push({
      name: protoMode ? el.dataset.screenLabel : (el.className || el.tagName).toString().slice(0, 24),
      y: (r.y + scrollY) / scale,
      h: r.height / scale,
      bg: getComputedStyle(el).backgroundColor,
    })
  }
  sections.sort((a, b) => a.y - b.y)

  /* In overlay mode the prototype renders the page behind the menu as well.
     Only the overlay is being compared, so scope the walk to it: the
     full-viewport block with the near-black ground. */
  let root = document
  if (opts.overlayOnly) {
    const candidates = [...document.querySelectorAll('div,section')].filter((el) => {
      const r = el.getBoundingClientRect()
      const c = getComputedStyle(el)
      return r.width >= 1400 && r.height >= 900 && /rgb\(5, 5, 5\)|rgb\(11, 11, 11\)|rgb\(0, 0, 0\)/.test(c.backgroundColor)
    })
    if (candidates.length) root = candidates[candidates.length - 1]
  }

  const text = []
  for (const el of root.querySelectorAll('*')) {
    /* Leaf-ish: only elements whose own child text nodes carry the content,
       so a wrapper is not counted as a duplicate of its child. */
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('')
    const t = own.replace(/\s+/g, ' ').trim()
    if (!t) continue
    const r = el.getBoundingClientRect()
    if (!visible(el, r)) continue
    const c = getComputedStyle(el)
    const sy = (r.y + scrollY) / scale
    let band = -1
    for (let i = 0; i < sections.length; i++) {
      if (sy >= sections[i].y - 1 && sy < sections[i].y + sections[i].h) { band = i; break }
    }
    text.push({
      band,
      t: t.slice(0, 60),
      x: r.x / scale,
      y: (r.y + scrollY) / scale,
      /* Y measured from the top of its own section. Absolute y cascades: one
         section 250px tall in the wrong place makes every element below it
         look misplaced, burying the in-section errors that are the real work.
         This is the number to fix; absolute y is reported for sections only. */
      ry: band >= 0 ? sy - sections[band].y : sy,
      fs: c.fontSize,
      lh: c.lineHeight,
      ls: c.letterSpacing,
      fw: c.fontWeight,
      color: c.color,
    })
  }
  text.sort((a, b) => a.y - b.y || a.x - b.x)
  return { sections, text, scale }
}

/**
 * Scroll the whole page so every reveal-on-intersect block has fired before
 * anything is measured.
 *
 * The step used to be a full viewport, which silently skipped blocks. The
 * reveal observer takes `threshold: 0.04` with a `-12%` bottom root margin,
 * so at a 1200px viewport the root bottom is 1056. A 138px block at y1065 is
 * outside the root at scroll 0, and at scroll 1200 only 3px of it are inside
 * — 2.2%, under the threshold. It never revealed, and its five rows showed up
 * in the table as a +26px offset, which is exactly `--reveal-y`. The build
 * was correct; the walk was measuring an element mid-transition.
 *
 * A third of a viewport guarantees any block taller than a few px is fully
 * traversed, and the settle covers `--dur-reveal` (720ms) so nothing is
 * caught part-way through its transform.
 */
async function walk(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.round(window.innerHeight / 3))
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, 120))
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
}

async function capture(page, url, { protoMode, settle, openMenu }) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.waitForTimeout(settle)
  /* The menu is an overlay, not a route. Open it before capturing so the
     comparison is against what a visitor actually sees. */
  if (openMenu) {
    await page.click('[data-nav-trigger]').catch(() => {})
    await page.waitForTimeout(500)
    /* The prototype stacks all nine panel states in one place and shows them
       simultaneously. A working mega-menu shows one. Comparing the two
       directly would report eight panels "missing" that are simply not the
       active state, so the build is captured once per row and the results
       unioned — which also means every panel is actually checked, rather
       than only whichever one happened to be open. */
    if (!protoMode) {
      const rows = await page.locator('[data-menu-row]').count()
      const merged = { sections: null, text: [], scale: 1 }
      for (let i = 0; i < rows; i++) {
        await page.locator('[data-menu-row]').nth(i).focus()
        await page.waitForTimeout(120)
        const shot = await page.evaluate(COLLECT, { protoMode, noScale: true, overlayOnly: true })
        if (!merged.sections) { merged.sections = shot.sections; merged.scale = shot.scale }
        for (const t of shot.text) {
          if (!merged.text.some((x) => x.t === t.t && Math.round(x.x) === Math.round(t.x) && Math.round(x.y) === Math.round(t.y))) {
            merged.text.push(t)
          }
        }
      }
      return merged
    }
  }
  await walk(page)
  /* The menu overlay is position:fixed at the real viewport width, outside the
     canvas transform, so the canvas scale must NOT be divided out of its
     coordinates. Doing so inflated every y by 1.5% — about 11px at the foot of
     the panel, which is five times the tolerance. */
  return page.evaluate(COLLECT, { protoMode, noScale: openMenu, overlayOnly: openMenu })
}

/** Pair by normalised text, in document order within each duplicate group. */
function pairText(a, b) {
  /* Keyed by band + text. Scoping to the section is what stops "Product
     Development" in the hero rail pairing with the one in Services and
     reporting a 2211px delta that does not exist. */
  const group = (arr) => {
    const m = new Map()
    arr.forEach((e) => {
      const k = `${e.band}\u0000${norm(e.t)}`
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(e)
    })
    return m
  }
  const A = group(a)
  const B = group(b)
  const pairs = []
  const missing = []
  const extra = []
  for (const [k, list] of A) {
    const other = B.get(k) || []
    const n = Math.min(list.length, other.length)
    for (let i = 0; i < n; i++) pairs.push([list[i], other[i]])
    for (let i = n; i < list.length; i++) missing.push(list[i])
  }
  for (const [k, list] of B) {
    const other = A.get(k) || []
    for (let i = other.length; i < list.length; i++) extra.push(list[i])
  }
  return { pairs, missing, extra }
}

function diffPage(proto, build, opts = {}) {
  const rows = []

  if (opts.textOnly) return textOnlyDiff(proto, build)
  const n = Math.max(proto.sections.length, build.sections.length)
  for (let i = 0; i < n; i++) {
    const p = proto.sections[i]
    const b = build.sections[i]
    if (!p || !b) {
      rows.push({ kind: 'SECTION', what: (p || b).name, field: p ? 'MISSING in build' : 'EXTRA in build', delta: Infinity, proto: '', build: '' })
      continue
    }
    for (const f of ['y', 'h']) {
      const d = b[f] - p[f]
      if (Math.abs(d) > GEO_TOL) {
        rows.push({ kind: 'SECTION', what: p.name, field: f, delta: d, proto: Math.round(p[f]), build: Math.round(b[f]) })
      }
    }
    if (p.bg !== b.bg) {
      rows.push({ kind: 'SECTION', what: p.name, field: 'background', delta: NaN, proto: p.bg, build: b.bg })
    }
  }

  const { pairs, missing, extra } = pairText(proto.text, build.text)
  const accepted = []
  for (const e of missing) {
    const why = acceptedReason(e.t)
    if (why) { accepted.push({ what: e.t, side: 'prototype only', why }); continue }
    rows.push({ kind: 'TEXT', what: e.t, field: 'MISSING in build', delta: Infinity, proto: `@${Math.round(e.y)}`, build: '' })
  }
  for (const e of extra) {
    const why = acceptedReason(e.t)
    if (why) { accepted.push({ what: e.t, side: 'build only', why }); continue }
    rows.push({ kind: 'TEXT', what: e.t, field: 'EXTRA in build', delta: Infinity, proto: '', build: `@${Math.round(e.y)}` })
  }

  for (const [p, b] of pairs) {
    for (const f of ['x', 'ry']) {
      const d = b[f] - p[f]
      if (Math.abs(d) > GEO_TOL) {
        const why = acceptedReason(p.t, f)
        if (why) { accepted.push({ what: p.t, side: `${f} delta ${Math.round(d)}`, why }); continue }
        rows.push({ kind: 'POS', what: p.t, field: f === 'ry' ? 'y-in-section' : f, delta: d, proto: Math.round(p[f]), build: Math.round(b[f]) })
      }
    }
    for (const f of ['fs', 'lh', 'ls', 'fw', 'color']) {
      if (p[f] === b[f]) continue
      /* Numeric type fields get a real delta so the table can sort by it. */
      const pv = parseFloat(p[f])
      const bv = parseFloat(b[f])
      const d = Number.isFinite(pv) && Number.isFinite(bv) ? bv - pv : NaN
      if (Number.isFinite(d) && Math.abs(d) < 0.51) continue
      const why = acceptedReason(p.t, f)
      if (why) { accepted.push({ what: p.t, side: `${f} ${p[f]} -> ${b[f]}`, why }); continue }
      rows.push({ kind: 'TYPE', what: p.t, field: f, delta: d, proto: p[f], build: b[f] })
    }
  }

  rows.accepted = accepted
  rows.sort((a, b) => {
    const av = Math.abs(a.delta)
    const bv = Math.abs(b.delta)
    if (Number.isNaN(av) && Number.isNaN(bv)) return 0
    if (Number.isNaN(av)) return 1
    if (Number.isNaN(bv)) return -1
    return bv - av
  })
  return rows
}

/* For the overlay there is no section band to anchor to, so y is compared
   against the document rather than a section, and only text metrics matter. */
function textOnlyDiff(proto, build) {
  const rows = []
  const accepted = []
  const { pairs, missing, extra } = pairText(
    proto.text.map((t) => ({ ...t, band: 0 })),
    build.text.map((t) => ({ ...t, band: 0 })),
  )
  for (const e of missing) {
    const why = acceptedReason(e.t)
    if (why) { accepted.push({ what: e.t, side: 'prototype only', why }); continue }
    rows.push({ kind: 'TEXT', what: e.t, field: 'MISSING in build', delta: Infinity, proto: `@${Math.round(e.y)}`, build: '' })
  }
  for (const e of extra) {
    const why = acceptedReason(e.t)
    if (why) { accepted.push({ what: e.t, side: 'build only', why }); continue }
    rows.push({ kind: 'TEXT', what: e.t, field: 'EXTRA in build', delta: Infinity, proto: '', build: `@${Math.round(e.y)}` })
  }
  for (const [p, b] of pairs) {
    for (const f of ['x', 'y']) {
      const d = b[f] - p[f]
      if (Math.abs(d) > GEO_TOL) {
        const why = acceptedReason(p.t, f)
        if (why) { accepted.push({ what: p.t, side: `${f} ${Math.round(d)}`, why }); continue }
        rows.push({ kind: 'POS', what: p.t, field: f, delta: d, proto: Math.round(p[f]), build: Math.round(b[f]) })
      }
    }
    for (const f of ['fs', 'lh', 'ls', 'fw', 'color']) {
      if (p[f] === b[f]) continue
      const pv = parseFloat(p[f]); const bv = parseFloat(b[f])
      const d = Number.isFinite(pv) && Number.isFinite(bv) ? bv - pv : NaN
      if (Number.isFinite(d) && Math.abs(d) < 0.51) continue
      const why = acceptedReason(p.t, f)
      if (why) { accepted.push({ what: p.t, side: `${f}`, why }); continue }
      rows.push({ kind: 'TYPE', what: p.t, field: f, delta: d, proto: p[f], build: b[f] })
    }
  }
  rows.accepted = accepted
  rows.sort((a, b) => {
    const av = Math.abs(a.delta), bv = Math.abs(b.delta)
    if (Number.isNaN(av) && Number.isNaN(bv)) return 0
    if (Number.isNaN(av)) return 1
    if (Number.isNaN(bv)) return -1
    return bv - av
  })
  return rows
}

function table(rows, label) {
  console.log('')
  console.log(`=== ${label} — ${rows.length} delta(s) ===`)
  if (!rows.length) { console.log('  clean'); return }
  void 0
  const head = ['KIND', 'FIELD', 'PROTO', 'BUILD', 'DELTA', 'WHAT']
  const body = rows.map((r) => [
    r.kind,
    r.field,
    String(r.proto),
    String(r.build),
    Number.isFinite(r.delta) ? (r.delta > 0 ? `+${Math.round(r.delta)}` : `${Math.round(r.delta)}`) : (r.delta === Infinity ? '—' : '≠'),
    r.what.slice(0, 46),
  ])
  const w = head.map((h, i) => Math.max(h.length, ...body.map((b) => b[i].length)))
  const line = (c) => console.log('  ' + c.map((v, i) => v.padEnd(w[i])).join('  '))
  line(head)
  line(w.map((n) => '-'.repeat(n)))
  body.forEach(line)
}

function acceptedTable(rows) {
  const acc = rows.accepted || []
  if (!acc.length) return
  const seen = new Set()
  console.log(`  --- ${acc.length} accepted divergence(s), by decision ---`)
  for (const a of acc) {
    const k = a.why
    if (seen.has(k)) continue
    seen.add(k)
    console.log(`    ${a.why}`)
  }
}

/* ------------------------------------------------------------------ main */

const args = process.argv.slice(2)
const wanted = args.length ? [[args[0], args[1]]] : PAGES

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await routeFonts(page)
await page.route('https://unpkg.com/**', async (route) => {
  const local = CDN[route.request().url()]
  if (!local) return route.abort()
  await route.fulfill({ path: local, contentType: 'application/javascript' })
})

let worst = 0
for (const [name, route] of wanted) {
  const protoUrl = `${SRC}/design/prototypes/${encodeURIComponent(`Roars v2 - ${name}.dc.html`)}`
  const openMenu = name === 'Roars v2 - Menu' || name === 'Menu'
  const proto = await capture(page, protoUrl, { protoMode: true, settle: 4200 })
  if (!proto.sections.length) {
    console.error(`\n${name}: prototype rendered no sections. Is ${SRC} serving the repo root?`)
    process.exitCode = 1
    continue
  }
  const build = await capture(page, `${BUILD}${route}`, { protoMode: false, settle: 1200, openMenu })
  const rows = diffPage(proto, build, { textOnly: openMenu })
  table(rows, `${name}  ->  ${route}   (canvas scale ${proto.scale.toFixed(4)})`)
  acceptedTable(rows)
  worst = Math.max(worst, rows.length)
}

await ctx.close()
await browser.close()
process.exitCode = worst ? (process.exitCode || 0) : (process.exitCode || 0)
