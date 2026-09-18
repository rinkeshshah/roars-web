import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const BASE=`http://127.0.0.1:${s.address().port}`
const b=await chromium.launch()
for (const w of [390,473,556,768]) {
  for (const y of [0, 2600]) {
    const page=await b.newPage({viewport:{width:w,height:844},isMobile:w<700,hasTouch:w<700})
    await page.goto(BASE+'/about-us/',{waitUntil:'networkidle'})
    await page.evaluate((yy)=>window.scrollTo(0,yy), y); await page.waitForTimeout(400)
    const r=await page.evaluate(()=>{
      const bg=document.querySelector('.topbar__burger')
      if(!bg) return {burger:'ELEMENT MISSING'}
      const q=bg.getBoundingClientRect(); const cs=getComputedStyle(bg)
      const bars=[...bg.querySelectorAll('.topbar__bar')].map(x=>{
        const c=getComputedStyle(x); const r2=x.getBoundingClientRect()
        return `${Math.round(r2.width)}x${Math.round(r2.height)}@${Math.round(r2.left)},${Math.round(r2.top)} ${c.backgroundColor}`
      })
      // what is painted at the burger's centre
      const cx=Math.round(q.left+q.width/2), cy=Math.round(q.top+q.height/2)
      const top=document.elementFromPoint(cx,cy)
      return {
        box:`${Math.round(q.left)},${Math.round(q.top)} ${Math.round(q.width)}x${Math.round(q.height)}`,
        display:cs.display, opacity:cs.opacity, visibility:cs.visibility,
        inViewport: q.right<=window.innerWidth && q.left>=0,
        bars,
        topAtCentre: top ? `${top.tagName.toLowerCase()}.${(typeof top.className==='string'?top.className.split(' ')[0]:'')}` : 'none',
      }
    })
    console.log(`@${w} y=${y}`, JSON.stringify(r))
    await page.close()
  }
}
await b.close(); s.close()
