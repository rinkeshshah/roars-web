#!/usr/bin/env node
/**
 * Print a prototype section's AUTHORED geometry as a tree.
 *
 *   node scripts/export-geometry.mjs "Roars v2 - Main" About
 *   node scripts/export-geometry.mjs "Roars v2 - Agency"          # list sections
 *
 *   SRC=http://127.0.0.1:4349   serves the repo root
 *
 * WHY
 * ---
 * visual-diff.mjs tells you a row is wrong. It does not tell you what the
 * export actually draws, and reading the .dc.html by hand does not either:
 * the prototypes render through React and Babel, so the file holds template
 * variables rather than values, and the desktop and mobile trees both match
 * any grep you write.
 *
 * Reading COMPUTED styles off the render has its own trap — it flattens the
 * structure. The About stats looked like two rows with a gap, and were
 * actually one 1362x362 block with the third stat nested inside it at 698,187.
 * Built as two grid rows it sat 15px low with the year 18px adrift, and no
 * amount of nudging the gap would have fixed it, because the model was wrong.
 *
 * This reads the INLINE style attributes in tree order, which is the export's
 * own authored intent: offsets relative to the parent, and the nesting that
 * says which offsets belong together. Translate that into flow layout;
 * do not transcribe it.
 *
 * Coordinates are parent-relative. A child at @698,187 inside a block at
 * @39,139 sits at 737,326 in the section.
 */
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const SRC = process.env.SRC || 'http://127.0.0.1:4349'
const VENDOR = '/tmp/vendor'
const CDN = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': `${VENDOR}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': `${VENDOR}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': `${VENDOR}/babel-standalone/babel.min.js`,
}

const [file, label] = process.argv.slice(2)
if (!file) {
  console.error('usage: export-geometry.mjs "<prototype basename>" [section label]')
  process.exit(1)
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.route('https://unpkg.com/**', async (route) => {
  const local = CDN[route.request().url()]
  if (!local || !existsSync(local)) return route.abort()
  await route.fulfill({ path: local, contentType: 'application/javascript' })
})
await page.goto(`${SRC}/design/prototypes/${encodeURIComponent(file)}.dc.html`, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const out = await page.evaluate((label) => {
  const bands = [...document.querySelectorAll('[data-screen-label]')]
  if (!label) return { list: bands.map((b) => b.getAttribute('data-screen-label')) }
  const sec = bands.find((b) => b.getAttribute('data-screen-label') === label)
  if (!sec) return { err: `no section "${label}". have: ${bands.map((b) => b.getAttribute('data-screen-label')).join(', ')}` }

  /* Inline attributes only. A computed value would resolve the cascade and
     lose the distinction between "authored here" and "inherited". */
  const read = (css) => {
    const o = {}
    for (const k of ['left', 'top', 'width', 'height', 'font-size', 'font-weight',
      'line-height', 'letter-spacing', 'color', 'background', 'border-radius', 'opacity']) {
      const m = new RegExp('(?:^|;)\\s*' + k + '\\s*:\\s*([^;]+)').exec(css)
      if (m) o[k] = m[1].trim()
    }
    return o
  }

  const lines = []
  const walk = (el, depth) => {
    for (const child of el.children) {
      const a = read(child.getAttribute('style') || '')
      /* Text this element owns, not its descendants' — otherwise every
         ancestor repeats the whole section's copy. */
      const own = [...child.childNodes].filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim()).join(' ').trim()
      const bits = []
      if (a.left !== undefined || a.top !== undefined) bits.push(`@${a.left || '-'},${a.top || '-'}`)
      if (a.width || a.height) bits.push(`${a.width || '-'}x${a.height || '-'}`)
      if (a['font-size']) bits.push(`${a['font-size']}/${a['font-weight'] || '-'}/${a['line-height'] || '-'}/${a['letter-spacing'] || '-'}`)
      if (a.color) bits.push(a.color)
      if (a.background) bits.push('bg:' + a.background.slice(0, 44))
      if (a['border-radius']) bits.push('r' + a['border-radius'])
      if (a.opacity) bits.push('op' + a.opacity)
      lines.push('  '.repeat(depth) + `${child.tagName} ${bits.join(' ')}` + (own ? `  "${own.slice(0, 58)}"` : ''))
      walk(child, depth + 1)
    }
  }
  walk(sec, 0)
  return { style: (sec.getAttribute('style') || '').replace(/\s+/g, ' '), lines }
}, label)

if (out.err) { console.error(out.err); process.exitCode = 1 }
else if (out.list) console.log(out.list.join('\n'))
else { console.log(`SECTION ${label} — ${out.style}`); console.log(out.lines.join('\n')) }

await browser.close()
