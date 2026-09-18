import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const b=await chromium.launch()
const page=await b.newPage({viewport:{width:473,height:844}})
await page.goto(`http://127.0.0.1:${s.address().port}/about-us/`,{waitUntil:'networkidle'})
await page.waitForTimeout(300)
const h=await page.evaluate(()=>document.documentElement.scrollHeight)
const bad=[]
for (let y=0; y<h-800; y+=400) {
  await page.evaluate((yy)=>window.scrollTo(0,yy), y)
  await page.waitForTimeout(220)
  const r=await page.evaluate(()=>{
    const bar=document.querySelector('.topbar')
    const isLight=bar.classList.contains('is-light')
    const isScrolled=bar.classList.contains('is-scrolled')
    // what section is actually under the probe line
    const el=document.elementFromPoint(window.innerWidth/2, 60)
    let ground='?', node=el
    while(node){ if(node.dataset && node.dataset.ground){ground=node.dataset.ground; break} node=node.parentElement }
    const barColor=getComputedStyle(document.querySelector('.topbar__bar')).backgroundColor
    return {isLight, isScrolled, ground, barColor, y:Math.round(window.scrollY)}
  })
  // a light ground with white bars and no opaque backing = invisible burger
  const whiteBars = r.barColor === 'rgb(255, 255, 255)'
  const mismatch = (r.ground !== 'dark' && whiteBars)
  if (mismatch) bad.push(`y=${r.y} ground=${r.ground} is-light=${r.isLight} is-scrolled=${r.isScrolled} bars=${r.barColor}`)
}
console.log(bad.length ? `MISMATCHES (light ground, white bars):\n  ${bad.join('\n  ')}` : 'ink matches the ground at every scroll position')
await b.close(); s.close()
