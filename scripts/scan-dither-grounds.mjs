#!/usr/bin/env node
/**
 * One ground per dither band, at mobile width.
 *
 *   npx http-server dist -p 4434 --silent &
 *   node scripts/scan-dither-grounds.mjs [http://127.0.0.1:4434]
 *
 * THE BUG THIS EXISTS FOR, which has now come back three times. Below 1040
 * the dither canvas is masked, so whatever the band paints underneath shows
 * through it. If that is a gradient — GrainField's wash, .wp-strip's own
 * linear-gradient, a radial glow — the page ends up with two unrelated
 * backgrounds stacked, and it reads as a pale streak crossing the hero with
 * the dither dots sitting on top. Every instance was reported from a phone
 * and none of them were visible on a desktop.
 *
 * The fix is always the same: below 1040, drop the gradient and set the band
 * to the exact flat colour the shader writes — #FFD400 for roar-wave,
 * #070706 for carbon-heat. Exact matters. A near-miss (--c-black is #000000
 * against the shader's #070706) is what reads as a band, which is the bug
 * again rather than a fix for it.
 *
 * WHY IT READS COMPUTED STYLE AND DOES NOT SAMPLE PIXELS. The first version
 * screenshotted a strip of each band and measured its spread. Every page came
 * back "GRADIENT" with an almost identical number, which is the tell: it was
 * sampling the top bar's logo — black glyph on a light plate — and not the
 * ground at all. Reading backgroundImage off the layers under the canvas
 * cannot be confused by content sitting on top of them.
 *
 * A gradient that is genuinely a design element will show up here too: the
 * industries page's receipt-tear edge and the 404 ring are both real
 * gradients inside the band. Look at what it prints; do not assume a hit is
 * a defect.
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://127.0.0.1:4434'

/* One page per template that carries a dither band. */
const PAGES = [
  '/', '/about-us/', '/approach/', '/contact-us/', '/work/',
  '/work/warehouse-compliance-checklist-app/', '/work/the-revolver-life-concierge-app/',
  '/s/', '/s/mvp-development/', '/industries/',
  '/industries/food-restaurant-app-development/', '/resources/', '/resources/guides/',
  '/our-journal/', '/our-journal/ai-ux-in-harmony-elevating-ai-user-experience/',
  '/404.html', '/thankyou/',
]

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
})

let hits = 0
for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const res = await page.goto(BASE + path, { waitUntil: 'load' }).catch(() => null)
  if (!res || res.status() >= 400) {
    console.log(`skip      ${path} (${res ? res.status() : 'error'})`)
    await page.close()
    continue
  }
  await page.waitForTimeout(900)

  const out = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-dither-hero]')
    if (!canvas) return { none: true }
    const band = canvas.parentElement
    const name = (el) =>
      (typeof el.className === 'string' ? el.className : '')
        .split(' ')
        .filter((c) => !c.startsWith('astro-'))
        .join('.') || el.tagName.toLowerCase()
    const found = []
    for (const el of [band, ...band.querySelectorAll('*')]) {
      if (el === canvas) continue
      const s = getComputedStyle(el)
      if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) continue
      if (s.backgroundImage !== 'none' && /gradient/.test(s.backgroundImage)) {
        found.push(`${name(el)} :: ${s.backgroundImage.slice(0, 60)}`)
      }
    }
    return { band: name(band), ground: getComputedStyle(band).backgroundColor, found }
  })

  if (out.none) console.log(`no dither ${path}`)
  else if (out.found.length) {
    hits++
    console.log(`GRADIENT  ${path.padEnd(54)} .${out.band}`)
    out.found.forEach((f) => console.log(`            ${f}`))
  } else {
    console.log(`flat      ${path.padEnd(54)} .${out.band}  ${out.ground}`)
  }
  await page.close()
}

await browser.close()
console.log(
  hits
    ? `\n${hits} band(s) paint a gradient under the canvas. Check each: a design element is fine, a second ground is not.`
    : '\nPASS: one ground per dither band at 390.',
)
