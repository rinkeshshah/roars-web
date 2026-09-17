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
const BLEEDS_BY_DESIGN = 'about__logo-track|about__logo-row|gf__drift|ins__grid'
const MIN_TAP = 24
const MIN_TYPE = 10

const args = process.argv.slice(2)
const paths = args.length
  ? args
  : (await readdir(join(DIST, 'work'), { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => `/work/${e.name}/`)

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
    /* Reveal animations start elements at opacity 0. Measuring them mid-flight
       reports every one of them as unpainted, so they are settled first. */
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'))
    })
    await page.waitForTimeout(150)

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
            if (q.height < MIN_TAP || q.width < MIN_TAP) {
              tap.push(`${name(el)} ${Math.round(q.width)}x${Math.round(q.height)}`)
            }
          }
          const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim()
          if (!own || hiddenAbove(el) || parseFloat(cs.opacity) <= 0.05) return
          const fs = parseFloat(cs.fontSize)
          if (fs > 0 && fs < MIN_TYPE) tiny.push(`${name(el)} ${cs.fontSize}`)
          if (fs < 1 || cs.color.endsWith(', 0)')) return
          if (cs.clipPath !== 'none' || cs.clip !== 'auto') return
          if (el.closest('[aria-hidden="true"]') || el.closest('noscript')) return
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
