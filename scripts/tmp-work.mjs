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
for (const w of [410, 390]) {
  const page=await b.newPage({viewport:{width:w,height:820},deviceScaleFactor:2})
  await page.goto(`http://127.0.0.1:${s.address().port}/work/`,{waitUntil:'networkidle'})
  await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
  await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
  await page.evaluate(()=>{const r=document.querySelector('.wf__rows li'); if(r) r.scrollIntoView({block:'start'})})
  await page.waitForTimeout(500)
  await page.screenshot({path:`${OUT}/work-${w}.png`})
  // geometry of the first two cards
  console.log(`@${w}`, await page.evaluate(()=>{
    const out=[]
    document.querySelectorAll('.wf__rows li').forEach((li,i)=>{
      if(i>1) return
      const d=li.querySelector('.wf__date'), sh=li.querySelector('.wf__shot'), img=sh.querySelector('img')
      const dq=d.getBoundingClientRect(), sq=sh.getBoundingClientRect()
      const iq=img?img.getBoundingClientRect():null
      out.push(`date=${Math.round(dq.top)}..${Math.round(dq.bottom)} shot=${Math.round(sq.top)}..${Math.round(sq.bottom)} (${Math.round(sq.width)}x${Math.round(sq.height)}) img=${iq?Math.round(iq.width)+'x'+Math.round(iq.height):'none'} overlap=${dq.bottom>sq.top?'YES '+Math.round(dq.bottom-sq.top)+'px':'no'}`)
    })
    return out
  }))
  await page.close()
}
await b.close(); s.close()
