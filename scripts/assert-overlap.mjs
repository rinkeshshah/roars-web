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
  /* The footer wordmark is 182px of "roars" that the columns sit across. It
     is the one place in the design where type is deliberately a ground. */
  { a: /^roars$/, b: /^(Privacy Policy|Offices|Agency|Home|Projects|Insights|Contact|Twitter)/,
    why: 'footer wordmark: the nav columns sit over it by design' },
  /* Every masthead is a small word tucked over a large one — "food &" over
     "restaurant". The descender of the first crosses the cap line of the
     second, which is the lockup, not a collision. */
  { a: /^(AI|food &|clinics &|mvp|user|page|web app|mobile app|growth|digital|retail &|travel &|members &|transport &|learning &|innovation|dedicated|devops|product|ecommerce)$/i,
    b: /^(automation|restaurant|healthcare|development|experience|not found|hacking|transformation|ecommerce|hospitality|concierge|logistics|education|design|developers|services)$/i,
    why: 'masthead lockup: the small word is set over the large one' },
  /* The guide masthead is the same lockup, built from the guide's own title:
     56px on a 60px line over a 124px line. The boxes overlap by the leading,
     the glyphs do not touch. Listed by word, like the rule above, so a real
     collision on some other page still fails. */
  { a: /^(SWOT)$/, b: /^(Analysis)$/,
    why: 'guide masthead lockup: the small word is set over the large one' },
  /* A display heading with its figure set beside it — "Projects" and "250+".
     The heading's descenders reach past the figure's cap line; no ink meets. */
  { a: /^(Projects|People say)$/, b: /^(250\+|4\.9\/5)$/,
    why: 'display heading and its figure, set close on purpose' },
]
const accepted = (a, b) => ACCEPTED.some((r) => r.a.test(a) && r.b.test(b))

/*
 * One entry per page SHAPE, not per page. Every service page now runs through
 * s/[slug].astro and every industry page through industries/[slug].astro, so
 * one hand-built and one migrated example of each covers the layouts; the rest
 * differ only in how long their sentences are.
 */
const PAGES = [
  ['home', '/'], ['agency', '/about-us/'], ['approach', '/approach/'],
  ['contact', '/contact-us/'], ['work', '/work/'], ['resources', '/resources/'],
  ['guides', '/resources/guides/'],
  /* A guide DETAIL page, not just the shelf. Its long-read blocks are a fixed
     520px with the body absolutely positioned inside them, so a section whose
     copy runs long paints over the next section's rule rather than pushing it
     down. Nothing on the shelf page would show that. */
  ['guide', '/resources/swot-analysis/'],
  /* The two archives share one route and differ in which branch renders, so
     both are listed: a grouped list of links on one, a grouped list of plain
     blocks plus the draft notice on the other. */
  ['arch-tools', '/resource/tools/'],
  ['arch-picks', '/resource/staff-picks/'],
  ['hub-s', '/s/'],
  ['hub-ind', '/industries/'],
  ['industry', '/industries/food-restaurant-app-development/'],
  /* One MIGRATED industry page as well as the hand-built one. Their copy is
     longer than the design assumed — a capability name where the design has a
     single word — and that only shows up on a page built from the real text. */
  ['industry-m', '/industries/healthcare-app-development-company/'],
  ['service', '/s/ai-automation-services/'],
  ['service-m', '/s/mvp-development/'],
  ['project', '/work/warehouse-compliance-checklist-app/'],
  /* Two projects, because they exercise different halves of the template.
     Snowman has three pictures and no dimensions on any of them, so it runs
     the original grids. Parqly has eleven with w and h, which is what turns
     on the full-width contact sheets and the photograph stages — and the
     stage is the one element on this page that deliberately reaches past the
     1362 column to the viewport edge, which is exactly the shape of thing
     that starts a horizontal scrollbar. */
  ['project-wide', '/work/parqly-parking-solution/'],
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
      /* Absolutely placed boxes are IN, fixed ones are out.
         Skipping absolute boxes was how three real collisions got past this:
         a 60px capability name wrapping down through the lead under it, a
         featured client name reaching into the paragraph beside it, and a
         section heading sitting under an absolutely placed intro. Half this
         site's layouts are absolute — excluding them excluded the bugs.
         `fixed` stays out: the top bar is meant to sit over the page. */
      if (c.position === 'fixed') return false
      const r = el.getBoundingClientRect()
      if (r.width <= 4 || r.height <= 4) return false
      if (clipped(el, r)) return false
      for (let a = el.parentElement; a; a = a.parentElement) {
        const ac = getComputedStyle(a)
        if (ac.display === 'none' || ac.visibility === 'hidden' || parseFloat(ac.opacity) < 0.05) return false
      }
      return true
    })
    /* INK, not the element box.
     *
     * A block-level heading's box is the full column width whatever the
     * words are, so every short heading "overlaps" anything absolutely
     * placed beside it — dozens of reports where not a pixel of type
     * touches. A Range over the element's own text nodes returns one rect
     * per line of actual glyphs, which is what a reader sees.
     *
     * The rects are unioned per element. Comparing line by line would be
     * more precise still and would also start reporting the descender of
     * one line against the ascender of the next in a tight setting. */
    const box = (el) => {
      const range = document.createRange()
      let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity
      for (const n of el.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue
        range.selectNodeContents(n)
        for (const q of range.getClientRects()) {
          if (q.width < 1 || q.height < 1) continue
          l = Math.min(l, q.left); t = Math.min(t, q.top)
          r = Math.max(r, q.right); b = Math.max(b, q.bottom)
        }
      }
      if (l === Infinity) return null
      return { l, t: t + scrollY, r, b: b + scrollY, el }
    }
    const bs = els.map(box).filter(Boolean)
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
        /* INSIDE A SIDEWAYS SCROLLER IS NOT OFF-SCREEN.
           This gate exists to catch content painted where nobody can reach
           it. Content in a box the reader can drag is reachable — that is
           what the box is for. The case study contact sheets are 760px of
           four phone screens inside a 350px column on a phone, deliberately,
           because fitted to the column each screen is 85px and shows
           nothing. Without this the gate reports the picture as off the page
           every time, which is the kind of false positive that gets a gate
           switched off. The document-level scrollWidth check above is
           untouched, so a real overflow still fails. */
        const ox = getComputedStyle(a).overflowX
        if (ox === 'auto' || ox === 'scroll') return
      }
      const key = el.tagName.toLowerCase() + (cls ? '.' + cls.split(' ').filter(c => !c.startsWith('astro-')).join('.') : '')
      seen.set(key, Math.max(seen.get(key) || 0, Math.round(q.right)))
    })
    return [...seen].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, BLEEDS_BY_DESIGN.source)

  /* TEXT THAT IS IN THE MARKUP AND PAINTS NOTHING.
   *
   * The two checks above both skip a zero-width box — the overlap collector at
   * `r.width <= 4`, the off-screen check at `q.width <= 0` — because a box with
   * no width cannot collide with anything and has no right edge worth
   * measuring. Which is how the case study H1 was invisible on every phone for
   * as long as the template has existed and this file reported clean: the title
   * block kept a desktop `margin-left: 452px` inside a 350px column, measured
   * width 0, and both checks stepped over it.
   *
   * So: take every element with its own text, ask where its glyphs actually
   * landed, and fail if the answer is nowhere a reader can see. That is the
   * question the other two are each asking half of.
   *
   * WHAT IS NOT A FINDING. Text that is deliberately there for something other
   * than eyes, and text inside a box the reader can drag sideways. Four
   * idioms, all of them already in use on this site and each excluded by the
   * property that makes it deliberate rather than by a class name:
   *
   *   aria-hidden="true"        the contact and guide honeypots. A field that
   *                             is hidden from people AND from screen readers
   *                             is doing exactly its job by painting nothing.
   *   font-size: 0              the full-row overlay link on the homepage
   *   color: transparent        services list. Its text is the accessible name
   *                             for a link whose visible label is the h3 next
   *                             to it, so it must not paint.
   *   clip / clip-path          the classic screen-reader-only pattern.
   *   <noscript>                its contents are markup, not rendered text,
   *                             whenever scripting is on, which it is here.
   */
  const unpainted = await p.evaluate((bleed) => {
    const re = new RegExp(bleed)
    const out = new Map()
    const range = document.createRange()
    const transparent = (v) => /rgba?\([^)]*,\s*0(\.0+)?\s*\)$/.test(v)
    document.querySelectorAll('main *').forEach((el) => {
      if (el.closest('noscript')) return
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('')
        .trim()
      if (!own) return
      if (el.closest('[aria-hidden="true"]')) return
      const c = getComputedStyle(el)
      if (c.display === 'none' || c.visibility === 'hidden') return
      if (parseFloat(c.opacity) < 0.05) return
      if (parseFloat(c.fontSize) < 1 || transparent(c.color)) return
      if (c.clipPath !== 'none' || c.clip !== 'auto') return
      const cls = typeof el.className === 'string' ? el.className : ''
      if (re.test(cls)) return
      for (let a = el.parentElement; a; a = a.parentElement) {
        const ac = getComputedStyle(a)
        if (ac.display === 'none' || ac.visibility === 'hidden') return
        if (parseFloat(ac.opacity) < 0.05) return
        if (re.test(typeof a.className === 'string' ? a.className : '')) return
        const ox = ac.overflowX
        if (ox === 'auto' || ox === 'scroll') return
      }
      let painted = false
      for (const n of el.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue
        range.selectNodeContents(n)
        for (const q of range.getClientRects()) {
          if (q.width < 1 || q.height < 1) continue
          /* Inside the viewport horizontally, by at least a few pixels. A rect
             that starts past the right edge is glyphs nobody will ever see. */
          if (q.right > 4 && q.left < window.innerWidth - 4) painted = true
        }
      }
      if (painted) return
      const key =
        el.tagName.toLowerCase() +
        (cls ? '.' + cls.split(' ').filter((x) => !x.startsWith('astro-')).join('.') : '')
      if (!out.has(key)) out.set(key, own.slice(0, 40))
    })
    return [...out].slice(0, 6)
  }, BLEEDS_BY_DESIGN.source)

  const bad = real.length || overflowX || off.length || unpainted.length
  if (bad) failures++
  console.log(
    `${name.padEnd(10)} @${String(width).padStart(4)} ${String(r?.status() ?? 'ERR').padEnd(4)}` +
    ` h=${String(h).padEnd(6)} xScroll=${overflowX ? 'YES' : 'no '}` +
    ` errs=${errs.length} overlaps=${real.length} offscreen=${off.length}` +
    ` unpainted=${unpainted.length}`,
  )
  for (const e of errs.slice(0, 2)) console.log('      err: ' + e)
  for (const o of real) console.log('      overlap: ' + JSON.stringify(o))
  for (const [k, right] of off) console.log(`      offscreen: ${k} right=${right} (viewport ${width})`)
  for (const [k, text] of unpainted) console.log(`      unpainted: ${k} — "${text}"`)
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
