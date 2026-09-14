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
 *   node scripts/assert-overlap.mjs      (needs dist/ served on :4351)
 */
import { chromium } from 'playwright'
/* Overlaps that are the design. The team cluster on Agency is seven 60px
   avatars deliberately shingled by 9px; reporting it every run would train
   us to ignore the output. Anything not matched here is a bug. */
const ACCEPTED = [
  { a: /^[A-Z]{2}$/, b: /^[A-Z]{2}$/, why: 'Agency team cluster: avatars are shingled on purpose' },
]
const accepted = (a, b) => ACCEPTED.some((r) => r.a.test(a) && r.b.test(b))

const PAGES = [
  ['home', '/'], ['agency', '/about-us/'], ['approach', '/approach/'],
  ['contact', '/contact-us/'], ['work', '/work/'], ['resources', '/resources/'],
  ['industry', '/industries/food-restaurant-app-development/'],
  ['service', '/s/product-development-company/'],
]
const b = await chromium.launch()
for (const [name, url] of PAGES) {
  const p = await b.newPage()
  const errs = []
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)) })
  p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 90)))
  await p.setViewportSize({ width: 1440, height: 900 })
  const r = await p.goto('http://127.0.0.1:4351' + url, { waitUntil: 'networkidle' }).catch(e => null)
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
  console.log(`${name.padEnd(10)} ${String(r?.status() ?? 'ERR').padEnd(4)} h=${String(h).padEnd(6)} xScroll=${overflowX ? 'YES' : 'no '} errs=${errs.length} overlaps=${real.length}`)
  for (const e of errs.slice(0, 2)) console.log('      err: ' + e)
  for (const o of real) console.log('      overlap: ' + JSON.stringify(o))
  await p.close()
}
await b.close()
