import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const OUT='/tmp/claude-0/-home-claude-repo/3f0a1bbd-3546-520b-bc11-f44156b2ab79/scratchpad'
const b=await chromium.launch()
const page=await b.newPage({viewport:{width:410,height:820},deviceScaleFactor:3})
await page.goto(`http://127.0.0.1:${s.address().port}/work/`,{waitUntil:'networkidle'})
await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
await page.evaluate(()=>document.querySelectorAll('.wf__rows li')[1].scrollIntoView({block:'center'}))
await page.waitForTimeout(400)
const box = await page.evaluate(()=>{
  const li=document.querySelectorAll('.wf__rows li')[1]
  const d=li.querySelector('.wf__date').getBoundingClientRect()
  return {x:0, y:Math.round(d.top)-14, width:200, height:Math.round(d.height)+28}
})
await page.screenshot({path:`${OUT}/date-zoom.png`, clip:box})
await b.close(); s.close(); console.log('clip', JSON.stringify(box))
