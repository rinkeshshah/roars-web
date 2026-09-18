import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const b=await chromium.launch()
const page=await b.newPage({viewport:{width:410,height:820}})
await page.goto(`http://127.0.0.1:${s.address().port}/work/`,{waitUntil:'networkidle'})
await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
await page.waitForTimeout(300)
console.log(await page.evaluate(()=>{
  const li=document.querySelectorAll('.wf__rows li')[1]
  li.scrollIntoView({block:'start'})
  const d=li.querySelector('.wf__date'), sh=li.querySelector('.wf__shot')
  const dq=d.getBoundingClientRect(), sq=sh.getBoundingClientRect()
  const liq=li.getBoundingClientRect(), aq=li.querySelector('a').getBoundingClientRect()
  const shCS=getComputedStyle(sh)
  const before=getComputedStyle(sh,'::before'), after=getComputedStyle(sh,'::after')
  return {
    li:`${Math.round(liq.left)}..${Math.round(liq.right)} y ${Math.round(liq.top)}..${Math.round(liq.bottom)}`,
    a:`${Math.round(aq.left)}..${Math.round(aq.right)} y ${Math.round(aq.top)}..${Math.round(aq.bottom)}`,
    date:`${Math.round(dq.left)}..${Math.round(dq.right)} y ${Math.round(dq.top)}..${Math.round(dq.bottom)}`,
    shot:`${Math.round(sq.left)}..${Math.round(sq.right)} y ${Math.round(sq.top)}..${Math.round(sq.bottom)}`,
    shotPos: shCS.position, shotOverflow: shCS.overflow,
    beforeInset:`${before.top} ${before.right} ${before.bottom} ${before.left}`, beforeBg: before.background.slice(0,70),
    afterInset:`${after.top} ${after.right} ${after.bottom} ${after.left}`, afterBg: after.background.slice(0,70),
    // what's at the band just above the shot
    atBand: (()=>{const el=document.elementFromPoint(200, Math.round(sq.top)-8); return el?`${el.tagName.toLowerCase()}.${(typeof el.className==='string'?el.className.split(' ')[0]:'')}`:'none'})(),
  }
}))
await b.close(); s.close()
