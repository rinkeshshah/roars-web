#!/usr/bin/env node
/**
 * THE PHONE PASS. Five widths, five questions assert-overlap does not ask.
 *
 * assert-overlap runs 1440, 768 and 390 and asks whether text collides, runs
 * off the page, or paints nothing. That is the layout. This asks the other
 * half: is the result usable with a thumb, on the narrowest phone still in
 * service, and at the two widths between 390 and a tablet where a flex-basis
 * is most likely to strand half a row.
 *
 * WHAT IT CHECKS, and why each one is here rather than in assert-overlap:
 *
 *   TAP TARGETS      A link or button under 24px in either axis. Found the
 *                    case-study back link at 22px tall — the presentation
 *                    design draws it as bare 14px type with no padding, which
 *                    is correct on an artboard and not something a finger can
 *                    hit. 24 is the floor; 44 is comfortable.
 *   TINY TYPE        Rendered text under 10px. A clamp with a vw term can fall
 *                    below its own floor if something above it shrinks.
 *   OFF-VIEWPORT     Painted content past the right edge, ignoring anything
 *                    inside a box the reader can drag sideways.
 *   HORIZONTAL SCROLL  On the document itself.
 *   UNPAINTED TEXT   Text in the markup whose glyphs land nowhere visible.
 *
 * WIDTHS. 320 is an iPhone SE and the narrowest thing worth supporting; 360
 * and 390 are where most Android and iPhone traffic sits; 414 is the large
 * phones; 768 is the seam where the desktop grids are still in force.
 *
 *   node scripts/assert-mobile.mjs            every case study
 *   node scripts/assert-mobile.mjs /work/gymbait/ /about-us/
 */
import sharp from 'sharp'
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
}
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  let body = null
  try { body = await readFile(join(DIST, p)) } catch { /* 404 below */ }
  if (body) { res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(body) }
  else { res.writeHead(404); res.end('not found') }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const BASE = `http://127.0.0.1:${server.address().port}`

const WIDTHS = [320, 360, 390, 414, 768]
/* Deliberately wider than their box, and the same list assert-overlap keeps:
   the logo marquee is a strip inside an overflow:hidden window and the grain
   drift is a decorative blur that bleeds past the section edge on purpose. */
const BLEEDS_BY_DESIGN = 'about__logo-track|about__logo-row|gf__drift|ins__grid|\\bdh\\b'
const MIN_TAP = 24
const MIN_TYPE = 10

/**
 * EVERY CASE STUDY, PLUS ONE OF EVERY OTHER TEMPLATE.
 *
 * This checked /work/ only, and /work/ is the one section that had already
 * been through a phone pass. The pages that had not were the ones a reader
 * actually landed on from search: a heading capping at 62% of its column
 * broke one word per line on every industry and service page for as long as
 * they have existed, and nothing here ever loaded one.
 *
 * One page per template rather than all of them, because these templates are
 * data-driven and the second page of a kind finds what the first did -- except
 * for the two noted below, where the copy is the variable.
 */
const TEMPLATES = [
  '/',
  '/about-us/',
  '/approach/',
  '/contact-us/',
  '/work/',
  '/industries/',
  /* Hand-built and migrated: the migrated pages carry the client's own copy,
     which is longer than the design assumed. */
  '/industries/food-restaurant-app-development/',
  '/industries/healthcare-app-development-company/',
  '/s/',
  '/s/ai-automation-services/',
  '/s/mvp-development/',
  '/resources/',
  '/our-journal/',
  '/thankyou/',
]

const args = process.argv.slice(2)
const paths = args.length
  ? args
  : [
      ...TEMPLATES,
      ...(await readdir(join(DIST, 'work'), { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => `/work/${e.name}/`),
    ]

let findings = 0
const browser = await chromium.launch()

console.log('--- assert-mobile ---')
console.log(`pages: ${paths.length}   widths: ${WIDTHS.join(', ')}`)
console.log('')

for (const path of paths) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 844 },
      deviceScaleFactor: 2,
      isMobile: width < 700,
      hasTouch: width < 700,
    })
    await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => null)
    await page.waitForTimeout(300)
    /**
     * REVEALS ARE SWITCHED OFF, not waited out.
     *
     * These start at opacity 0, and measuring one mid-flight reports it as
     * unpainted. Adding `is-in` and waiting 150ms was the first answer and it
     * was a silent under-report: several blocks carry a transition-delay of
     * 110-120ms on top of the transition itself, so at the 150ms mark they
     * were still near zero, hiddenAbove() read them as hidden, and every link
     * inside them was skipped. Five 17px-tall social links on /contact-us/
     * went unreported that way -- the gate said PASS because it never looked.
     *
     * A stylesheet that removes the transition has no timing to get wrong.
     */
    await page.addStyleTag({
      content: `[data-reveal], [data-reveal] * {
        transition: none !important;
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }`,
    })
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'))
    })
    await page.waitForTimeout(80)

    const r = await page.evaluate(
      ({ MIN_TAP, MIN_TYPE, BLEEDS }) => {
        const bleeds = new RegExp(BLEEDS)
        const name = (el) =>
          (typeof el.className === 'string' && el.className
            ? '.' + el.className.split(' ').filter((c) => !c.startsWith('astro-'))[0]
            : el.tagName.toLowerCase())
        const inScroller = (el) => {
          for (let a = el.parentElement; a; a = a.parentElement) {
            const ox = getComputedStyle(a).overflowX
            if (ox === 'auto' || ox === 'scroll') return true
          }
          return false
        }
        /* A hidden ancestor hides its children too. Without this every slide in
           a one-at-a-time reel reports its kicker, title and note as unpainted. */
        const hiddenAbove = (el) => {
          for (let a = el.parentElement; a; a = a.parentElement) {
            const c = getComputedStyle(a)
            if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) <= 0.05) return true
          }
          return false
        }
        const tap = [], tiny = [], over = [], unpainted = []
        const range = document.createRange()
        document.querySelectorAll('main *, section *').forEach((el) => {
          const q = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          if (cs.display === 'none' || cs.visibility === 'hidden') return
          if (q.width > 0 && q.right > window.innerWidth + 4 && !inScroller(el)) {
            const cls = typeof el.className === 'string' ? el.className : ''
            let byDesign = bleeds.test(cls)
            for (let a = el.parentElement; a && !byDesign; a = a.parentElement) {
              byDesign = bleeds.test(typeof a.className === 'string' ? a.className : '')
            }
            if (!byDesign) over.push(`${name(el)}@${Math.round(q.right)}`)
          }
          if ((el.tagName === 'A' || el.tagName === 'BUTTON') && q.width > 0 && !hiddenAbove(el)) {
            /* INLINE IN A SENTENCE IS EXEMPT, and that is the spec's own
               exemption rather than a convenience: WCAG 2.5.8 excludes a
               target whose size is "constrained by the line-height of
               non-target text". The two phone numbers on /thankyou/ sit inside
               "call the office nearest to you: USA ..., UK ...". Padding them
               to 44px would push them over the lines above and below, so the
               fix for the measurement is worse than the measurement.
               The test is structural, not a list of blessed selectors: does
               the parent hold real text of its own alongside this link? A row
               of links in a <ul> does not and stays enforced. */
            const parent = el.parentElement
            const around = parent
              ? [...parent.childNodes]
                  .filter((n) => n.nodeType === 3 && n.textContent.trim())
                  .map((n) => n.textContent.trim())
                  .join('')
              : ''
            const inlineInProse = around.length > 2
            if (!inlineInProse && (q.height < MIN_TAP || q.width < MIN_TAP)) {
              tap.push(`${name(el)} ${Math.round(q.width)}x${Math.round(q.height)}`)
            }
          }
          const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim()
          if (!own || hiddenAbove(el) || parseFloat(cs.opacity) <= 0.05) return
          const fs = parseFloat(cs.fontSize)
          if (fs > 0 && fs < MIN_TYPE) tiny.push(`${name(el)} ${cs.fontSize}`)
          if (fs < 1 || cs.color.endsWith(', 0)')) return
          if (cs.clipPath !== 'none' || cs.clip !== 'auto') return
          /* `option` and `optgroup` for the same reason scripts/assert-overlap.mjs
             excludes them, where the reasoning is written out: a closed select's
             options are painted by the browser's own dropdown, which is not in
             the document and has no client rects, so every one of them reads as
             text that landed nowhere. */
          if (el.closest('[aria-hidden="true"]') || el.closest('noscript, option, optgroup')) return
          let painted = false
          for (const n of el.childNodes) {
            if (n.nodeType !== 3 || !n.textContent.trim()) continue
            range.selectNodeContents(n)
            for (const t of range.getClientRects()) {
              if (t.width >= 1 && t.height >= 1 && t.right > 4 && t.left < window.innerWidth - 4) painted = true
            }
          }
          if (!painted && !inScroller(el)) unpainted.push(name(el))
        })
        const uniq = (a) => [...new Set(a)]
        return {
          xScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
          tap: uniq(tap), tiny: uniq(tiny), over: uniq(over), unpainted: uniq(unpainted),
        }
      },
      { MIN_TAP, MIN_TYPE, BLEEDS: BLEEDS_BY_DESIGN },
    )

    const bad = r.xScroll || r.tap.length || r.tiny.length || r.over.length || r.unpainted.length
    if (bad) {
      findings++
      console.log(`FAIL ${path} @${width}`)
      if (r.xScroll) console.log('       horizontal scroll on the document')
      for (const t of r.tap) console.log(`       tap target under ${MIN_TAP}px: ${t}`)
      for (const t of r.tiny) console.log(`       type under ${MIN_TYPE}px: ${t}`)
      for (const o of r.over) console.log(`       painted past the right edge: ${o}`)
      for (const u of r.unpainted) console.log(`       text that paints nothing: ${u}`)
    }
    /**
     * THE STICKY BAR, WITH THE PAGE SCROLLED UNDER IT.
     *
     * Every other check here reads the page at rest, and at rest nothing is
     * under the header -- which is exactly why a transparent header was
     * shipped on every page and never caught. assert-overlap has the same
     * blind spot. The bug it hid: page copy painting straight through the
     * logo and the burger, so "Awarded" read as the mark with an A behind it
     * and the only navigation on the page lost its contrast.
     *
     * THE RULE, not the appearance: if text is inside the bar's box, the bar
     * must be opaque there. A transparent header is fine over its hero. A
     * transparent header with a paragraph behind it is not. Either is allowed
     * as long as they do not happen at once.
     *
     * Two positions, because the first screenful is the one that behaves and
     * the rest are the ones that do not.
     */
    for (const frac of [0.33, 0.66]) {
      /* SCROLL, THEN WAIT, THEN MEASURE -- in three steps, not one.
         src/scripts/topbar.ts throttles its scroll handler through
         requestAnimationFrame, so the class that makes the bar opaque is set
         on the frame AFTER the scroll. Reading styles in the same tick as the
         scrollTo reports the bar as it was before it moved, which failed every
         page including the ones that were correct. */
      await page.evaluate((f) => {
        window.scrollTo(0, Math.round((document.documentElement.scrollHeight - window.innerHeight) * f))
      }, frac)
      await page.waitForTimeout(250)

      const clash = await page.evaluate(() => {
        const bar = document.querySelector('[data-topbar], .topbar')
        if (!bar) return null
        if (getComputedStyle(bar).position !== 'fixed') return null

        const box = bar.getBoundingClientRect()
        if (box.height < 1) return null

        /* Opaque means: something inside the bar paints a fully opaque fill
           across it. The ground is drawn on a pseudo-element, so both it and
           the bar itself are asked. */
        const alpha = (c) => {
          const m = /rgba?\(([^)]+)\)/.exec(c)
          if (!m) return 0
          const parts = m[1].split(',').map((x) => parseFloat(x))
          return parts.length < 4 ? 1 : parts[3]
        }
        const solid = [bar, null].some((el) => {
          const cs = el ? getComputedStyle(el) : getComputedStyle(bar, '::before')
          return alpha(cs.backgroundColor) >= 0.99 && parseFloat(cs.opacity) >= 0.99
        })
        if (solid) return null

        /* FROSTED IS ALLOWED, BUT IT HAS TO EARN IT.
         *
         * This check used to demand a fully opaque fill, and the note in
         * TopBar.astro explains why: a blur cannot be trusted sight unseen,
         * and the only navigation on the page is not going to depend on one.
         * The bar is frosted now by request, so the rule is no longer "is it
         * opaque" but "does it actually hide what is under it" — which is the
         * question the alpha test was standing in for all along.
         *
         * Three conditions, and all three have to hold. The first two are
         * declarations and are cheap; the third is a measurement, taken from
         * the rendered page further down, and it is the one that matters.
         *
         *   1. alpha >= 0.8. A blur over a nearly clear fill still lets
         *      shapes through; this is a floor, not a pass.
         *   2. a real backdrop-filter, AND an @supports rule guarding it with
         *      an opaque fallback — so a browser that cannot composite the
         *      blur gets the solid plate instead of a see-through bar.
         *   3. the clashing text, sampled where it actually lands under the
         *      bar, comes back flat. Measured in Node with sharp.
         *
         * Fail any of them and this is an ordinary see-through header again.
         */
        const frostedCandidate = [bar, null].some((el) => {
          const cs = el ? getComputedStyle(el) : getComputedStyle(bar, '::before')
          const bd = cs.backdropFilter || cs.webkitBackdropFilter || 'none'
          return bd !== 'none' && alpha(cs.backgroundColor) >= 0.8
        })

        /* The guard has to be in the stylesheet, not in the computed value:
           a computed backdrop-filter says the browser understood it, not that
           the author left anything behind for a browser that does not. */
        const guarded = (() => {
          const walk = (rules) => {
            for (const r of rules) {
              if (r.conditionText && /backdrop-filter/i.test(r.conditionText)) return true
              if (r.cssRules && walk(r.cssRules)) return true
            }
            return false
          }
          for (const sheet of document.styleSheets) {
            try {
              if (walk(sheet.cssRules)) return true
            } catch {
              /* cross-origin sheet, nothing to read */
            }
          }
          return false
        })()

        const hits = []
        const range = document.createRange()
        document.querySelectorAll('h1, h2, h3, h4, p, li, dt, dd, span, a, blockquote').forEach((el) => {
          if (el.closest('[data-topbar], .topbar, .nav')) return
          const cs = getComputedStyle(el)
          if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) <= 0.05) return
          for (const n of el.childNodes) {
            if (n.nodeType !== 3 || !n.textContent.trim()) continue
            range.selectNodeContents(n)
            for (const t of range.getClientRects()) {
              if (t.width < 1 || t.height < 1) continue
              if (t.top < box.bottom && t.bottom > box.top && t.left < box.right && t.right > box.left) {
                hits.push({
                  label: `"${n.textContent.trim().slice(0, 30)}"`,
                  rect: { x: t.left, y: t.top, w: t.width, h: t.height },
                })
              }
            }
          }
        })
        const labels = [...new Set(hits.map((h) => h.label))].slice(0, 3)

        /* THE BAR'S OWN CONTROLS ARE NOT TEXT SHOWING THROUGH, and the first
           version of this measured them anyway: a clashing rect that happens
           to lie across the mark came back at stdev 91 — black glyph on a
           white plate, the most contrast on the page — while every rect that
           was genuinely behind the blur measured 0 to 1.3. One overlap with
           the logo was failing pages that were completely correct.
           So each sample is clipped to the widest horizontal run of the rect
           that no control sits on, and a rect with no such run is dropped. */
        const own = [...bar.querySelectorAll('*')]
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 2 && r.height > 2)

        const clear = (rect) => {
          const blockers = own
            .filter((o) => o.top < rect.y + rect.h && o.bottom > rect.y)
            .map((o) => [o.left, o.right])
            .sort((a, b) => a[0] - b[0])
          let best = null
          let cursor = rect.x
          for (const [l, r] of [...blockers, [rect.x + rect.w, rect.x + rect.w]]) {
            const gap = Math.min(l, rect.x + rect.w) - cursor
            if (gap > 4 && (!best || gap > best.w)) best = { x: cursor, w: gap }
            cursor = Math.max(cursor, r)
            if (cursor >= rect.x + rect.w) break
          }
          return best ? { x: best.x, y: rect.y, w: best.w, h: rect.h } : null
        }

        return {
          labels,
          rects: hits.map((h) => clear(h.rect)).filter(Boolean).slice(0, 6),
          frosted: frostedCandidate && guarded,
          bar: { x: box.left, y: box.top, w: box.width, h: box.height },
        }
      })

      /* The measurement. A frosted bar that is doing its job leaves the text
         under it as a flat wash; text that is genuinely showing through has
         the hard light-dark edges of glyphs. Sample each clashing rect from
         the rendered page and take the standard deviation of its greyscale —
         letterforms put it in the tens, a smooth panel keeps it in single
         figures. 12 sits well clear of both in the samples this repo has. */
      if (clash && clash.labels.length && clash.frosted) {
        let showsThrough = false
        for (const r of clash.rects) {
          const x = Math.max(0, Math.round(Math.max(r.x, clash.bar.x)))
          const y = Math.max(0, Math.round(Math.max(r.y, clash.bar.y)))
          const w = Math.round(Math.min(r.x + r.w, clash.bar.x + clash.bar.w) - x)
          const h = Math.round(Math.min(r.y + r.h, clash.bar.y + clash.bar.h) - y)
          if (w < 2 || h < 2) continue
          const png = await page.screenshot({ clip: { x, y, width: w, height: h } })
          const { channels } = await sharp(png).greyscale().stats()
          if (channels[0].stdev > 12) { showsThrough = true; break }
        }
        if (!showsThrough) continue
      }

      if (clash && clash.labels.length) {
        findings++
        console.log(`FAIL ${path} @${width}`)
        console.log(`       text under a see-through sticky header at ${Math.round(frac * 100)}% scroll: ${clash.labels.join(', ')}`)
      }
    }

    await page.close()
  }
}

await browser.close()
server.close()

if (findings) {
  console.log('')
  console.error(`assert-mobile FAILED: ${findings} page/width combination(s) with findings.`)
  process.exit(1)
}
console.log(`PASS: ${paths.length * WIDTHS.length} combinations, nothing under a thumb or off the page.`)
