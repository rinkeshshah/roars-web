import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const BASE=`http://127.0.0.1:${s.address().port}`
const OUT='/tmp/claude-0/-home-claude-repo/3f0a1bbd-3546-520b-bc11-f44156b2ab79/scratchpad'
const b=await chromium.launch()
// 473 wide, scrolled to the "63 %" / "Year of Establishment" block from the screenshot
const page=await b.newPage({viewport:{width:473,height:480},deviceScaleFactor:2})
await page.goto(BASE+'/about-us/',{waitUntil:'networkidle'})
await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
await page.evaluate(()=>{
  const t=[...document.querySelectorAll('*')].find(e=>e.textContent.trim().startsWith('Year of Establishment') && e.children.length===0)
  if(t) t.scrollIntoView({block:'center'})
})
await page.waitForTimeout(600)
await page.screenshot({path:`${OUT}/burger-473.png`})
// and the counter disc
await page.evaluate(()=>{const d=document.querySelector('.agb__grid--clients .agb__rest'); if(d) d.scrollIntoView({block:'center'})})
await page.waitForTimeout(600)
await page.screenshot({path:`${OUT}/disc-473.png`})
await b.close(); s.close(); console.log('ok')
