/**
 * Menu overlay diff.
 *
 * The menu is the only component drawn as a scaled 1440x900 canvas, in both
 * the export and the build, so it needs its own instrument: visual-diff.mjs
 * compares viewport coordinates against a page's section bands, and the menu
 * has neither. This one finds the canvas in each, then reports every text
 * element's position IN CANVAS COORDINATES — (viewport position - canvas
 * origin) / canvas scale. That is apples-to-apples regardless of what
 * viewport either side happened to render at, which is what made the earlier
 * "table at 184" reading meaningless: it was measuring panel content in two
 * different coordinate spaces and never looked at the overlay frame at all.
 *
 * It compares NON-TEXT elements too — rules, dots, circles, box geometry —
 * which is the gap that let the menu ship without its divider rules, its
 * accent marks, its stat row or its logo while the text table read low.
 *
 * The export stacks all nine panels visible at once; a working menu shows
 * one. So the build is captured once per row and the results unioned, which
 * also means every panel gets checked rather than whichever was open.
 *
 *   node scripts/menu-diff.mjs
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const TOL = 2
const ROOT = process.cwd()
const PROTO = '/design/prototypes/Roars v2 - Menu.dc.html'
const VENDOR = '/tmp/vendor'
const UNPKG = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': `${VENDOR}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': `${VENDOR}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': `${VENDOR}/babel-standalone/babel.min.js`,
}
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json',
}

/* Divergences that are decisions, not drift. Each one has a reason and stays
   out of the table so the table means something. */
const ACCEPTED = [
  { match: /^(23 PROJECTS|9 SECTORS|12 SERVICES|15 KITS|All 23 projects|10 PROJECTS|8 SECTORS|5 SERVICES|3 KITS|All 10 projects)$/, why: 'counts are the inventory’s, not the mock’s (export: 10/8/5/3)' },
  { match: /Riinkesh|Sshah|Rinkesh/, why: 'the export ships the founder’s name scrambled; the build corrects it' },
  { match: /^Skip to content$/, why: 'a11y: the export is div soup and ships no skip link' },
  { match: /GetAutomation|GetAuto/, why: 'venture name as the export spells it' },
  { match: /^CLOSE$/, why: 'the close bar sits inside the canvas so it scales with it; the export keeps it in a separately-scaled fixed topbar at the same 1285,52' },
  { field: 'x', match: /^(10 PROJECTS|8 SECTORS|5 SERVICES|3 KITS)$/, why: 'row metas share a right edge at 348; the export hard-codes four different lefts for its own shorter strings' },
]
const accepted = (t, field) =>
  ACCEPTED.find((a) => a.match.test(t) && (!a.field || a.field === field))

function serve(port, base) {
  const s = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0])
    let f = join(base, normalize(p).replace(/^(\.\.[/\\])+/, ''))
    try {
      if ((await stat(f)).isDirectory()) f = join(f, 'index.html')
    } catch { res.writeHead(404).end(); return }
    try {
      const b = await readFile(f)
      res.writeHead(200, { 'content-type': MIME[extname(f).toLowerCase()] || 'application/octet-stream' }).end(b)
    } catch { res.writeHead(404).end() }
  })
  return new Promise((r) => s.listen(port, '127.0.0.1', () => r(s)))
}

/* Runs in the page. Finds the 1440-wide canvas, then reports everything
   inside it in canvas coordinates. */
const COLLECT = () => {
  const cands = [...document.querySelectorAll('div')].filter((el) => {
    const st = el.getAttribute('style') || ''
    return /width:\s*1440px/.test(st) || el.hasAttribute('data-nav-canvas')
  })
  /* the menu's own canvas, not the page-behind canvas: the one whose subtree
     carries the NAVIGATION kicker */
  const canvas = cands.find((el) => /NAVIGATION/.test(el.textContent || '')) || cands[cands.length - 1]
  if (!canvas) return null
  const cr = canvas.getBoundingClientRect()
  const scale = cr.width / 1440
  const X = (v) => Math.round(((v - cr.x) / scale) * 10) / 10
  const Y = (v) => Math.round(((v - cr.y) / scale) * 10) / 10
  const S = (v) => Math.round((v / scale) * 10) / 10

  const seen = (el, r) => {
    const c = getComputedStyle(el)
    if (c.visibility === 'hidden' || c.display === 'none') return false
    if (parseFloat(c.opacity) < 0.05) return false
    for (let p = el; p; p = p.parentElement) {
      const pc = getComputedStyle(p)
      if (pc.display === 'none' || pc.visibility === 'hidden') return false
      if (parseFloat(pc.opacity) < 0.05) return false
      if (p.hidden) return false
    }
    if (c.clip === 'rect(0px, 0px, 0px, 0px)' || (r.width <= 2 && r.height <= 2)) return false
    return r.width > 0 && r.height > 0
  }

  const text = []
  const marks = []
  for (const el of canvas.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (!seen(el, r)) continue
    const c = getComputedStyle(el)
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('')
    const t = own.replace(/\s+/g, ' ').trim()
    if (t) {
      text.push({
        t, x: X(r.x), y: Y(r.y),
        fs: Math.round(parseFloat(c.fontSize) / scale * 10) / 10,
        fw: c.fontWeight,
        ls: c.letterSpacing,
        col: c.color,
      })
      continue
    }
    /* Non-text furniture: rules, dots, pill outlines, the accent marks.
       These are what the text-only table could never see. */
    const w = S(r.width), h = S(r.height)
    if (w < 1 && h < 1) continue
    const bg = c.backgroundColor
    const ring = c.boxShadow !== 'none'
    if (bg === 'rgba(0, 0, 0, 0)' && !ring && el.tagName !== 'IMG') continue
    marks.push({
      kind: el.tagName === 'IMG' ? 'img' : h <= 2 ? 'rule' : w <= 2 ? 'vrule' : parseFloat(c.borderRadius) >= 40 ? 'pill' : 'box',
      x: X(r.x), y: Y(r.y), w, h, bg, r: c.borderRadius,
    })
  }
  return { scale, cw: S(cr.width), ch: S(cr.height), text, marks }
}

const near = (a, b) => Math.abs(a - b) <= TOL

async function grab(page, url, { build }) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(900)
  if (build) await page.click('[data-nav-trigger]').catch(() => {})
  await page.waitForTimeout(500)

  /* BOTH sides are captured the same way: the resting state, then once per
     nav row with that row active, and the results unioned. The export leaves
     its eight inactive panels at opacity 0, so capturing it once only ever
     saw the resting panel — which is what made the build's nine panels read
     as 200 "extra" strings and hid every real delta inside them. */
  const sel = build ? '[data-menu-row]' : '[data-nav]'
  const rows = await page.locator(sel).count()
  const merged = { text: [], marks: [], scale: 1, cw: 0, ch: 0 }
  for (let i = -1; i < rows; i++) {
    if (i < 0) {
      await page.mouse.move(1430, 890)
    } else if (build) {
      await page.locator(sel).nth(i).focus()
    } else {
      await page.locator(sel).nth(i).dispatchEvent('mouseenter')
    }
    await page.waitForTimeout(700)
    const shot = await page.evaluate(COLLECT)
    if (!shot) continue
    merged.scale = shot.scale; merged.cw = shot.cw; merged.ch = shot.ch
    for (const e of shot.text) {
      if (!merged.text.some((x) => x.t === e.t && near(x.x, e.x) && near(x.y, e.y))) merged.text.push(e)
    }
    for (const m of shot.marks) {
      if (!merged.marks.some((x) => x.kind === m.kind && near(x.x, m.x) && near(x.y, m.y) && near(x.w, m.w))) merged.marks.push(m)
    }
  }
  return merged
}

const server = await serve(4451, ROOT)
/* dist is served at ITS OWN ROOT on a second port. Serving it at /dist/ was
   the whole reason the build side came back empty: every /_astro/* asset
   404'd, so the island never hydrated and the overlay never opened. */
const distServer = await serve(4452, join(ROOT, 'dist'))
const browser = await chromium.launch()
const page = await browser.newPage()
await page.route('https://unpkg.com/**', async (route) => {
  const f = UNPKG[route.request().url()]
  if (!f) return route.abort()
  route.fulfill({ status: 200, contentType: 'text/javascript', body: await readFile(f) })
})
await page.route('https://fonts.googleapis.com/**', (r) => r.abort())
await page.route('https://fonts.gstatic.com/**', (r) => r.abort())

const proto = await grab(page, `http://127.0.0.1:4451${encodeURI(PROTO)}`, { build: false })
const build = await grab(page, 'http://127.0.0.1:4452/', { build: true })
await browser.close()
server.close()
distServer.close()

if (!proto) { console.error('menu-diff: no canvas found in the prototype'); process.exit(1) }
if (!build) { console.error('menu-diff: no canvas found in the build'); process.exit(1) }

if (process.env.DUMP) {
  console.log('--- build ---'); for (const t of build.text) console.log(JSON.stringify(t.t), t.x, t.y)
  console.log('--- proto ---'); for (const t of proto.text) console.log(JSON.stringify(t.t), t.x, t.y)
}
const rows = []
const skipped = []
const usedB = new Set()

/* text, paired by rendered string */
for (const p of proto.text) {
  const norm = (s) => s.replace(/—/g, '—').trim()
  let bi = build.text.findIndex((b, i) => !usedB.has(i) && norm(b.t) === norm(p.t))
  if (bi < 0) {
    const a = accepted(p.t)
    if (a) { skipped.push([p.t, a.why]); continue }
    rows.push({ d: 9999, what: `MISSING  "${p.t.slice(0, 52)}"`, detail: `export has it at ${p.x},${p.y}` })
    continue
  }
  usedB.add(bi)
  const b = build.text[bi]
  for (const [f, label] of [['x', 'x'], ['y', 'y'], ['fs', 'font-size']]) {
    const d = Math.round((b[f] - p[f]) * 10) / 10
    if (Math.abs(d) <= TOL) continue
    if (accepted(p.t, f)) { skipped.push([`${p.t} (${f})`, accepted(p.t, f).why]); continue }
    rows.push({ d: Math.abs(d), what: `${label.padEnd(9)} "${p.t.slice(0, 40)}"`, detail: `${b[f]} vs ${p[f]}  (${d > 0 ? '+' : ''}${d})` })
  }
  if (b.fw !== p.fw) rows.push({ d: 3, what: `weight    "${p.t.slice(0, 40)}"`, detail: `${b.fw} vs ${p.fw}` })
}
for (const [i, b] of build.text.entries()) {
  if (usedB.has(i)) continue
  const a = accepted(b.t)
  if (a) { skipped.push([b.t, a.why]); continue }
  rows.push({ d: 9998, what: `EXTRA    "${b.t.slice(0, 52)}"`, detail: `build only, at ${b.x},${b.y}` })
}

/* non-text furniture, paired by position+size */
const usedM = new Set()
for (const p of proto.marks) {
  const mi = build.marks.findIndex(
    (b, i) => !usedM.has(i) && b.kind === p.kind && near(b.x, p.x) && near(b.y, p.y) && near(b.w, p.w) && near(b.h, p.h),
  )
  if (mi >= 0) { usedM.add(mi); continue }
  const loose = build.marks.findIndex((b, i) => !usedM.has(i) && b.kind === p.kind && near(b.x, p.x) && near(b.y, p.y))
  if (loose >= 0) {
    usedM.add(loose)
    const b = build.marks[loose]
    rows.push({ d: Math.abs(b.w - p.w) + Math.abs(b.h - p.h), what: `${p.kind} size @ ${p.x},${p.y}`, detail: `${b.w}x${b.h} vs ${p.w}x${p.h}` })
    continue
  }
  rows.push({ d: 9997, what: `MISSING ${p.kind}`, detail: `export has ${p.w}x${p.h} at ${p.x},${p.y}` })
}

rows.sort((a, b) => b.d - a.d)

console.log(`\nMENU OVERLAY  —  canvas ${build.cw}x${build.ch} (export ${proto.cw}x${proto.ch})`)
console.log(`text: ${build.text.length} build / ${proto.text.length} export      furniture: ${build.marks.length} / ${proto.marks.length}\n`)
if (!rows.length) console.log('  no deltas above 2px.\n')
else {
  for (const r of rows.slice(0, 70)) console.log(`  ${r.what.padEnd(58)} ${r.detail}`)
  if (rows.length > 70) console.log(`  … and ${rows.length - 70} more`)
  console.log(`\n  ${rows.length} delta(s).\n`)
}
if (skipped.length) {
  console.log('ACCEPTED (decisions, not drift):')
  const once = new Map()
  for (const [t, why] of skipped) if (!once.has(why)) once.set(why, t)
  for (const [why, t] of once) console.log(`  ${why}`)
  console.log('')
}
