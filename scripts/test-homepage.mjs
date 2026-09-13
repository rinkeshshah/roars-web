#!/usr/bin/env node
/**
 * Phase 3 exit test: LCP, CLS and total page JS on the homepage.
 *
 *   (cd dist && python3 -m http.server 4325 &)
 *   node scripts/test-homepage.mjs
 *
 * Throttled to the "Fast 3G"-ish profile the budget names: 1.6 Mbps down,
 * 750 Kbps up, 150ms RTT, with a 4x CPU slowdown so the measurement is not
 * flattered by a build machine that is faster than a phone.
 *
 * Caveats worth stating rather than hiding: this is a lab measurement over
 * loopback against a Python static server, on container CPU. It is a useful
 * regression guard and it is not field data. The real numbers come from CrUX
 * once the site is live behind nginx with the real caching headers.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://127.0.0.1:4325'
const BUDGET = { lcp: 2000, cls: 0.05, js: 25 * 1024 }

const out = []
const ok = (n, c, d = '') => out.push(`${c ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

// Count every script byte the page actually pulls, inline or external.
let jsBytes = 0
page.on('response', async (res) => {
  const type = res.headers()['content-type'] || ''
  if (/javascript|ecmascript/.test(type)) {
    try { jsBytes += (await res.body()).length } catch { /* redirects etc. */ }
  }
})

const client = await ctx.newCDPSession(page)
await client.send('Network.enable')
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
})
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })

await page.goto(`${BASE}/`, { waitUntil: 'load' })

const metrics = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let lcp = 0
      let cls = 0
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) lcp = Math.max(lcp, e.startTime)
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value
      }).observe({ type: 'layout-shift', buffered: true })
      // Settle, then scroll the page so late shifts are counted too.
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0]
          resolve({ lcp, cls, ttfb: nav ? nav.responseStart : 0 })
        }, 1200)
      }, 1500)
    }),
)

// Inline module scripts never hit the network, so add them from the DOM.
const inlineJs = await page.evaluate(() =>
  [...document.querySelectorAll('script:not([src])')].reduce(
    (n, s) => n + new Blob([s.textContent || '']).size,
    0,
  ),
)
const totalJs = jsBytes + inlineJs

ok(`LCP under ${BUDGET.lcp}ms`, metrics.lcp > 0 && metrics.lcp < BUDGET.lcp, `${Math.round(metrics.lcp)}ms`)
ok(`CLS under ${BUDGET.cls}`, metrics.cls < BUDGET.cls, metrics.cls.toFixed(4))
ok(`page JS under ${BUDGET.js / 1024}KB`, totalJs < BUDGET.js, `${(totalJs / 1024).toFixed(2)}KB (${inlineJs}B inline, ${jsBytes}B external)`)

// One h1, and it is the wordmark that carries the page's name.
const h1s = await page.locator('h1').count()
ok('exactly one h1', h1s === 1, `${h1s}`)

// The cross-fade must not leave the slot empty or double-exposed.
const opacities = await page.$$eval('[data-slide]', (els) =>
  els.map((e) => Number(getComputedStyle(e).opacity)),
)
const sum = opacities.reduce((a, b) => a + b, 0)
ok('cross-fade opacities sum to 1', Math.abs(sum - 1) < 0.02, sum.toFixed(3))

await ctx.close()
await browser.close()

console.log(out.join('\n'))
console.log(`\nTTFB ${Math.round(metrics.ttfb)}ms  ·  lab measurement, not field data`)
const failed = out.some((l) => l.startsWith('FAIL'))
console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS')
process.exit(failed ? 1 : 0)
