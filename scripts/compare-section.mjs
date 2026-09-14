#!/usr/bin/env node
/**
 * Render a prototype section and its built counterpart side by side.
 *
 *   node scripts/compare-section.mjs "Roars v2 - Main" / Services
 *   node scripts/compare-section.mjs "Roars v2 - AI Automation" /s/product-development-company/
 *
 *   SRC=http://127.0.0.1:4349    serves the repo root
 *   BUILD=http://127.0.0.1:4351  serves dist/
 *   OUT=.compare/name.png
 *
 * WHY THIS EXISTS ALONGSIDE visual-diff.mjs
 * -----------------------------------------
 * visual-diff pairs elements by their TEXT, so anything without text is
 * invisible to it, and so is anything whose box it deliberately skips. On the
 * About section it reported zero rows for two real faults: the + and % were
 * run on after the digits instead of placed (inline boxes are skipped, since
 * their rect is a union of line boxes), and every missing-image slot was
 * hidden outright, which took the drawn placeholder discs with it and left
 * five of six slots reading as empty.
 *
 * Both were obvious the moment the two renders were beside each other.
 * Measure with visual-diff; decide with this.
 *
 * Sections are addressed by the prototype's [data-screen-label]; the build
 * side takes the .sec at the same ordinal. Omit the label for whole pages.
 */
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = process.env.SRC || 'http://127.0.0.1:4349'
const BUILD = process.env.BUILD || 'http://127.0.0.1:4351'
const VENDOR = '/tmp/vendor'
const CDN = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': `${VENDOR}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': `${VENDOR}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': `${VENDOR}/babel-standalone/babel.min.js`,
}

const [proto, route, label] = process.argv.slice(2)
if (!proto || !route) {
  console.error('usage: compare-section.mjs "<prototype>" <route> [section label]')
  process.exit(1)
}
const OUT = process.env.OUT || join(ROOT, '.compare', `${(label || 'page').replace(/\W+/g, '-')}.png`)
mkdirSync(join(OUT, '..'), { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
/* The prototype's Google Fonts request fails closed in a sandboxed runner and
   the page falls back to Arial without saying so — 24% narrower than Inter, so
   every wrapped column breaks in the wrong place. Serve it the site's own
   woff2, which is also the font that ships. See visual-diff.mjs for the full
   note. */
const INTER = join(ROOT, 'public', 'fonts', 'inter-var-latin.woff2')
if (existsSync(INTER)) {
  const css =
    `@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;` +
    `src:url(data:font/woff2;base64,${readFileSync(INTER).toString('base64')}) format('woff2-variations');}`
  await page.route('https://fonts.googleapis.com/**', (r) =>
    r.fulfill({ status: 200, contentType: 'text/css', body: css }),
  )
} else {
  console.warn('WARNING: public/fonts/inter-var-latin.woff2 missing; the prototype will render in a fallback font.')
}

await page.route('https://unpkg.com/**', async (r) => {
  const local = CDN[r.request().url()]
  if (!local || !existsSync(local)) return r.abort()
  await r.fulfill({ path: local, contentType: 'application/javascript' })
})

/* Same walk as visual-diff: a third of a viewport, so no reveal block is
   stepped over and caught mid-transform. */
async function settle(url, isProto) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.waitForTimeout(isProto ? 4000 : 1500)
  await page.evaluate(async () => {
    const step = Math.max(200, Math.round(window.innerHeight / 3))
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1000)
}

async function shot(file, sel) {
  const el = sel ? page.locator(sel).first() : null
  if (el && (await el.count())) await el.screenshot({ path: file })
  else await page.screenshot({ path: file, fullPage: true })
}

await settle(`${SRC}/design/prototypes/${encodeURIComponent(proto)}.dc.html`, true)
/* Order the bands by their authored top, NOT by DOM order. The export emits
   them shuffled — Main's come out Industries, Insights, FAQ, Footer, People
   say, Projects, Services, Header, About — so a raw findIndex pairs the wrong
   section against the build's nth .sec and silently compares two different
   parts of the page. The first run of this script put Services beside
   Insights and looked, briefly, like a catastrophe. */
const ordinal = label
  ? await page.evaluate((l) => {
      const top = (b) =>
        parseFloat((/(?:^|;)\s*top\s*:\s*(-?[\d.]+)px/.exec(b.getAttribute('style') || '') || [])[1] ?? 'NaN')
      const bands = [...document.querySelectorAll('[data-screen-label]')]
        .filter((b) => Number.isFinite(top(b)))
        .sort((a, b) => top(a) - top(b))
      return bands.findIndex((b) => b.getAttribute('data-screen-label') === l)
    }, label)
  : -1
if (label && ordinal < 0) { console.error(`no section "${label}" in ${proto}`); process.exit(1) }
await shot('/tmp/.cmp-proto.png', label ? `[data-screen-label="${label}"]` : null)

await settle(`${BUILD}${route}`, false)
await shot('/tmp/.cmp-build.png', label ? `.sec >> nth=${ordinal}` : null)

const enc = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64')
await page.setViewportSize({ width: 1464, height: 900 })
await page.setContent(`<html><body style="margin:0;background:#e8e8e8;font:600 13px ui-sans-serif,system-ui">
<div style="display:flex;gap:16px;padding:16px;align-items:flex-start">
  <div><div style="padding:6px 2px">EXPORT — ${proto}${label ? ', ' + label : ''}</div>
    <img src="${enc('/tmp/.cmp-proto.png')}" style="display:block;width:700px;border:1px solid #bbb"></div>
  <div><div style="padding:6px 2px">BUILD — ${route}${label ? ', ' + label : ''}</div>
    <img src="${enc('/tmp/.cmp-build.png')}" style="display:block;width:700px;border:1px solid #bbb"></div>
</div></body></html>`)
await page.waitForTimeout(600)
await page.screenshot({ path: OUT, fullPage: true })
await browser.close()
console.log(OUT)
