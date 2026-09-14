#!/usr/bin/env node
/**
 * Render the approved prototype and the build side by side at 1440px.
 *
 *   node scripts/compare-prototype.mjs
 *
 * The prototype is the visual target. This does not copy anything out of it:
 * it screenshots both so the difference is visible rather than inferred from
 * measurements. Reading specs/*.md and never looking at the rendered page is
 * how a build ends up correct in every dimension and wrong as a whole.
 *
 * Output goes to .compare/ (gitignored).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, '.compare')
const SRC = process.env.SRC || 'http://127.0.0.1:4340'
const BUILD = process.env.BUILD || 'http://127.0.0.1:4341'

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

/**
 * The prototype boots React and Babel from unpkg, which this environment's
 * egress policy blocks, so it renders blank. npm works, so the byte-identical
 * UMD builds are served from a local vendor directory instead.
 *
 * This is interception at request time. The prototype file is not modified and
 * React never enters the project's dependencies.
 */
const VENDOR = '/tmp/vendor'
const CDN = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js':
    `${VENDOR}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':
    `${VENDOR}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':
    `${VENDOR}/babel-standalone/babel.min.js`,
}
await page.route('https://unpkg.com/**', async (route) => {
  const local = CDN[route.request().url()]
  if (!local) return route.abort()
  await route.fulfill({ path: local, contentType: 'application/javascript' })
})

/** Remote imagery lives on roarsinc.com, which this environment cannot reach.
 *  Those slots render empty in BOTH shots, so the comparison stays fair. */
const blocked = new Set()
page.on('requestfailed', (r) => {
  const u = r.url()
  if (/roarsinc\.com/.test(u)) blocked.add(u.split('/').pop())
})

async function shot(url, name, settle = 2500) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  // support.js sizes the canvas on load and on resize; give it both.
  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.waitForTimeout(settle)
  // Walk the page so intersection-driven reveals fire before capture.
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)

  const height = await page.evaluate(() =>
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
  )
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true })
  console.log(`${name.padEnd(12)} ${url}`)
  console.log(`${''.padEnd(12)} full height ${height}px`)
  return height
}

const protoUrl = `${SRC}/design/prototypes/Roars%20v2%20-%20Main.dc.html`
const protoH = await shot(protoUrl, 'prototype', 4000)
const buildH = await shot(`${BUILD}/`, 'build')

console.log('')
console.log(`height delta : ${buildH - protoH}px  (build ${buildH}, prototype ${protoH})`)
if (blocked.size) {
  console.log(`blocked remote images (both shots): ${blocked.size}`)
}

await ctx.close()
await browser.close()
