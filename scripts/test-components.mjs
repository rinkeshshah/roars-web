/**
 * Phase 1 exit test, as a script so it can be re-run and wired into CI.
 *
 *   npx http-server dist -p 4323 --silent &
 *   node scripts/test-components.mjs
 *
 * Covers what the exit test asks for and cannot be checked by reading code:
 * keyboard reachability, focus trap and return, one-open-at-a-time accordion,
 * filtering without a URL change, intersection-driven ink inversion, reveal
 * on intersect, and that prefers-reduced-motion kills every animation.
 *
 * Uses the Playwright already installed globally in the build image, so it
 * adds no dependency to package.json.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const base = 'http://127.0.0.1:4323'
const out = []
const ok = (n, c, d = '') => out.push(`${c ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`)

const browser = await chromium.launch()

// ---------- keyboard + islands ----------
let ctx = await browser.newContext()
let p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(`${base}/components/`, { waitUntil: 'networkidle' })

ok('no page errors', errs.length === 0, errs.join('; '))

const trig = p.locator('[data-nav-trigger]')
await trig.focus()
ok('nav trigger focusable', await trig.evaluate((el) => el === document.activeElement))
await p.keyboard.press('Enter')
await p.waitForTimeout(200)
ok('overlay opens', await p.locator('[data-nav-overlay]').isVisible())
ok('aria-expanded true', (await trig.getAttribute('aria-expanded')) === 'true')
ok('focus moved into overlay',
  await p.evaluate(() => !!document.activeElement?.closest('[data-nav-overlay]')))
await p.keyboard.press('Escape')
await p.waitForTimeout(200)
ok('overlay closes on Escape', await p.locator('[data-nav-overlay]').isHidden())
ok('focus returned to trigger', await trig.evaluate((el) => el === document.activeElement))

const accs = p.locator('[data-accordion] button[aria-expanded]')
await accs.nth(0).click(); await p.waitForTimeout(350)
ok('accordion row 1 opens', (await accs.nth(0).getAttribute('aria-expanded')) === 'true')
await accs.nth(1).click(); await p.waitForTimeout(350)
ok('opening row 2 closes row 1',
  (await accs.nth(1).getAttribute('aria-expanded')) === 'true' &&
  (await accs.nth(0).getAttribute('aria-expanded')) === 'false')

const before = p.url()
await p.locator('[data-filter="ux"]').click(); await p.waitForTimeout(150)
const visible = await p.locator('[data-filter-item="demo"]:not([hidden])').count()
ok('filter narrows to 1', visible === 1, `saw ${visible}`)
ok('readout updates', (await p.locator('[data-filter-readout]').textContent())?.trim() === '1 / 5')
ok('filtering does not change the URL', p.url() === before)

await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(250)
ok('top bar light at top (light ground)',
  await p.locator('[data-topbar]').evaluate((el) => el.classList.contains('is-light')))
await p.evaluate(() => {
  const dark = document.querySelector('[data-ground="dark"]')
  window.scrollTo(0, dark.getBoundingClientRect().top + window.scrollY + 20)
}); await p.waitForTimeout(350)
ok('top bar inverts over dark ground',
  await p.locator('[data-topbar]').evaluate((el) => !el.classList.contains('is-light')))

// Scroll the reveal tiles into view first; at page top none are near the
// viewport, so checking before scrolling was testing nothing.
await p.locator('.ex__reveals').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
const tiles = await p.locator('.ex__reveals [data-reveal]').count()
const tilesIn = await p.locator('.ex__reveals [data-reveal].is-in').count()
ok('reveal applies is-in on intersect', tiles > 0 && tiles === tilesIn, `${tilesIn}/${tiles}`)
await ctx.close()

// ---------- reduced motion ----------
ctx = await browser.newContext({ reducedMotion: 'reduce' })
p = await ctx.newPage()
await p.goto(`${base}/components/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(250)
const anim = await p.evaluate(() => {
  const bad = []
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el)
    const d = parseFloat(s.transitionDuration) || 0
    const a = parseFloat(s.animationDuration) || 0
    if (d > 0.05 || a > 0.05) bad.push(el.tagName + '.' + String(el.className).slice(0, 20))
  }
  return bad
})
ok('reduced motion kills every transition/animation', anim.length === 0, anim.slice(0, 3).join(', '))
const revealed = await p.locator('[data-reveal]').count()
const shown = await p.locator('[data-reveal].is-in').count()
ok('reveal content still visible under reduced motion', revealed === shown, `${shown}/${revealed}`)
await ctx.close()

await browser.close()
console.log(out.join('\n'))
console.log(out.some((l) => l.startsWith('FAIL')) ? '\nRESULT: FAIL' : '\nRESULT: PASS')
process.exit(out.some((l) => l.startsWith('FAIL')) ? 1 : 0)
