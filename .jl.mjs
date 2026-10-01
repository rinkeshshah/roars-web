import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
const ROOT = '/home/claude/roars-web/dist'
const OUT = '/tmp/claude-0/-home-claude-repo/3f0a1bbd-3546-520b-bc11-f44156b2ab79/scratchpad'
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' }
const srv = createServer(async (q, s) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'
  try { const b = await readFile(join(ROOT, p)); s.writeHead(200, { 'content-type': T[extname(p)] ?? 'application/octet-stream' }); s.end(b) } catch { s.writeHead(404); s.end('x') } })
await new Promise((r) => srv.listen(4522, r))
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
for (const [u, W, H, tag] of [['/our-journal/', 1440, 900, 'jl-d'], ['/our-journal/page/2/', 1440, 900, 'jl-p2'], ['/our-journal/', 390, 844, 'jl-m']]) {
  const p = await b.newPage({ viewport: { width: W, height: H }, isMobile: W < 700, hasTouch: W < 700 })
  await p.goto('http://127.0.0.1:4522' + u, { waitUntil: 'load' })
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 55)) } })
  await p.waitForTimeout(1300)
  const info = await p.evaluate(() => {
    const d = [...document.querySelectorAll('.jl__disc')].slice(0, 3).map(e => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e)
      return { w: Math.round(r.width), h: Math.round(r.height), radius: cs.borderRadius, overflow: cs.overflow }
    })
    const heights = new Set(d.map(x => x.h))
    return { sample: d, allSameHeight: heights.size === 1 }
  })
  console.log(tag, JSON.stringify(info))
  const el = await p.$('.jl__grid')
  if (el) {
    await el.scrollIntoViewIfNeeded()
    /* Lazy images only decode once near the viewport, so wait for the first
       row's pictures before shooting or the boxes come out as placeholders. */
    await p.waitForFunction(() => {
      const imgs = [...document.querySelectorAll('.jl__disc img')].slice(0, 3)
      return imgs.length > 0 && imgs.every((i) => i.complete && i.naturalWidth > 0)
    }, { timeout: 8000 }).catch(() => {})
    await p.waitForTimeout(500)
    const bb = await el.boundingBox()
    await p.screenshot({ path: `${OUT}/${tag}.png`, clip: { x: 0, y: Math.max(0, bb.y), width: W, height: 330 } })
  }
  await p.close()
}
await b.close(); srv.close()
