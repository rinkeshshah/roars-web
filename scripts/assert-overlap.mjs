/**
 * Overlap assertion. Asked for after four separate overlap bugs — the
 * cross-fade slides, the top bar over the footer, the top bar over the hero
 * strip and the Services tag line through the row title — on the grounds that
 * one instrument listing every instance at once beats fixing them one
 * screenshot at a time.
 *
 * For every basic page: HTTP status, console errors, horizontal overflow, and
 * any two painted text elements whose boxes intersect by more than 6px in
 * both axes.
 *
 *   node scripts/assert-overlap.mjs      (serves dist/ itself)
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/* Serves dist/ itself. This is a build gate, so it cannot depend on somebody
   having remembered to start a static server first — a gate that only runs
   when you set it up by hand is a gate that does not run. */
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  try {
    const body = await readFile(join(DIST, p))
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
/* Port 0: the OS picks a free one. A fixed port collides with whatever the
   last debugging session left running, and a gate that fails because of a
   stale process teaches people to ignore it. */
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const BASE = `http://127.0.0.1:${server.address().port}`
/* Overlaps that are the design. The team cluster on Agency is seven 60px
   avatars deliberately shingled by 9px; reporting it every run would train
   us to ignore the output. Anything not matched here is a bug. */
const ACCEPTED = [
  { a: /^[A-Z]{2}$/, b: /^[A-Z]{2}$/, why: 'Agency team cluster: avatars are shingled on purpose' },
]
const accepted = (a, b) => ACCEPTED.some((r) => r.a.test(a) && r.b.test(b))

/*
 * One entry per DESIGNED page. The other service and industry URLs — 11 of 12
 * and 8 of 9 — render the noindex "content pending migration" holding page,
 * which is a heading and a paragraph and has nothing to break. Listing them
 * would triple the run time to assert that a paragraph fits on a phone.
 */
const PAGES = [
  ['home', '/'], ['agency', '/about-us/'], ['approach', '/approach/'],
  ['contact', '/contact-us/'], ['work', '/work/'], ['resources', '/resources/'],
  ['guides', '/resources/guides/'],
  ['industry', '/industries/food-restaurant-app-development/'],
  ['service', '/s/ai-automation-services/'],
  ['pending', '/s/product-development-company/'],
  ['project', '/work/warehouse-compliance-checklist-app/'],
  ['journal', '/our-journal/'],
  ['post', '/our-journal/how-ai-is-transforming-user-experience-design/'],
  ['404', '/404.html'],
]
/*
 * Widths. 1440 is the design canvas; 390 is a phone and 768 is the band
 * between them, where the desktop grids are still in force and the page is
 * too narrow for them.
 *
 * The phone widths also assert OFF-CANVAS CONTENT, which the desktop pass
 * does not need. Every section clips with overflow:hidden, so a fixed track
 * that does not fit does not produce a scrollbar — it silently paints the
 * content outside the box and the reader never sees it. The homepage was
 * losing 105 elements that way and nothing in the build said a word.
 */
const WIDTHS = [1440, 768, 390]

/* Deliberately wider than their box: the logo marquee is a scrolling strip
   inside an overflow:hidden window, and the grain drift is a decorative blur
   that bleeds past the section edge on purpose. */
const BLEEDS_BY_DESIGN = /about__logo-track|about__logo-row|gf__drift|ins__grid/

let failures = 0
const b = await chromium.launch()
for (const [name, url] of PAGES) for (const width of WIDTHS) {
  const p = await b.newPage()
  const errs = []
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)) })
  p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 90)))
  await p.setViewportSize({ width, height: 900 })
  const r = await p.goto(BASE + url, { waitUntil: 'networkidle' }).catch(e => null)
  await p.waitForTimeout(600)
  // scroll the whole page so reveals fire and lazy content lands
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) }
    window.scrollTo(0, 0)
  })
  await p.waitForTimeout(500)
  // overlap assertion: any two visible text elements whose boxes intersect
  const overlaps = await p.evaluate(() => {
    /* CLIPPING IS NOT OPTIONAL HERE.
       A collapsed accordion panel is `height: 0; overflow: hidden`, and a
       child of it still returns its full layout box from
       getBoundingClientRect() — the box is real, it is just not painted. A
       detector that ignores that reports every closed FAQ answer as sitting
       on top of the next question, which is a ghost. So walk the ancestors
       and drop anything that falls outside a clipping one.

       Inline elements are skipped too: an inline span's rect is the union of
       its line boxes, so two spans in the same flowing paragraph legitimately
       "overlap" without a pixel of ink touching. */
    const clipped = (el, r) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const c = getComputedStyle(a)
        if (!/hidden|clip|scroll|auto/.test(c.overflow + c.overflowY + c.overflowX)) continue
        const ar = a.getBoundingClientRect()
        if (ar.height < 1 || ar.width < 1) return true
        const ox = Math.min(ar.right, r.right) - Math.max(ar.left, r.left)
        const oy = Math.min(ar.bottom, r.bottom) - Math.max(ar.top, r.top)
        if (ox <= 1 || oy <= 1) return true
      }
      return false
    }
    const els = [...document.querySelectorAll('*')].filter(el => {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()
      if (!own) return false
      const c = getComputedStyle(el)
      if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) < 0.05) return false
      if (c.display === 'inline') return false
      if (c.position === 'absolute' || c.position === 'fixed') return false
      const r = el.getBoundingClientRect()
      if (r.width <= 4 || r.height <= 4) return false
      if (clipped(el, r)) return false
      for (let a = el.parentElement; a; a = a.parentElement) {
        const ac = getComputedStyle(a)
        if (ac.display === 'none' || ac.visibility === 'hidden' || parseFloat(ac.opacity) < 0.05) return false
      }
      return true
    })
    const box = el => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top + scrollY, r: r.right, b: r.bottom + scrollY, el } }
    const bs = els.map(box)
    const hits = []
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], c = bs[j]
      if (a.el.contains(c.el) || c.el.contains(a.el)) continue
      const ox = Math.min(a.r, c.r) - Math.max(a.l, c.l)
      const oy = Math.min(a.b, c.b) - Math.max(a.t, c.t)
      if (ox > 6 && oy > 6) hits.push([a.el.textContent.trim().slice(0, 28), c.el.textContent.trim().slice(0, 28), Math.round(ox) + 'x' + Math.round(oy)])
    }
    return hits.slice(0, 40)
  })
  const real = overlaps.filter(([a, b]) => !accepted(a, b))
  const h = await p.evaluate(() => document.body.scrollHeight)
  const overflowX = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)

  /* Content painted outside the viewport. A tolerance of 4px absorbs
     sub-pixel rounding on fractional tracks. */
  const off = await p.evaluate((bleed) => {
    const re = new RegExp(bleed)
    const seen = new Map()
    document.querySelectorAll('main *').forEach(el => {
      const q = el.getBoundingClientRect()
      if (q.width <= 0 || q.right <= window.innerWidth + 4) return
      const cls = typeof el.className === 'string' ? el.className : ''
      if (re.test(cls)) return
      for (let a = el.parentElement; a; a = a.parentElement) {
        if (re.test(typeof a.className === 'string' ? a.className : '')) return
      }
      const key = el.tagName.toLowerCase() + (cls ? '.' + cls.split(' ').filter(c => !c.startsWith('astro-')).join('.') : '')
      seen.set(key, Math.max(seen.get(key) || 0, Math.round(q.right)))
    })
    return [...seen].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, BLEEDS_BY_DESIGN.source)

  const bad = real.length || overflowX || off.length
  if (bad) failures++
  console.log(
    `${name.padEnd(10)} @${String(width).padStart(4)} ${String(r?.status() ?? 'ERR').padEnd(4)}` +
    ` h=${String(h).padEnd(6)} xScroll=${overflowX ? 'YES' : 'no '}` +
    ` errs=${errs.length} overlaps=${real.length} offscreen=${off.length}`,
  )
  for (const e of errs.slice(0, 2)) console.log('      err: ' + e)
  for (const o of real) console.log('      overlap: ' + JSON.stringify(o))
  for (const [k, right] of off) console.log(`      offscreen: ${k} right=${right} (viewport ${width})`)
  await p.close()
}
await b.close()

server.close()

console.log('')
if (failures) {
  console.error(`assert-overlap FAILED: ${failures} page/width combination(s) have overlapping text, horizontal scroll, or content painted off-screen.`)
  process.exit(1)
}
console.log('assert-overlap: OK at ' + WIDTHS.join(', ') + '.')
