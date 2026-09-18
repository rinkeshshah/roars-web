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

const page=await b.newPage({viewport:{width:410,height:820}})
await page.goto(BASE+'/work/',{waitUntil:'networkidle'})
await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
await page.waitForTimeout(200)
console.log('WORK DATE:', await page.evaluate(()=>{
  const li=document.querySelectorAll('.wf__rows li')[1]
  const d=li.querySelector('.wf__date'), bEl=d.querySelector('b')
  const out={}
  const rg=document.createRange(); rg.selectNodeContents(bEl)
  const tq=rg.getBoundingClientRect(); const bq=bEl.getBoundingClientRect(); const dq=d.getBoundingClientRect()
  const cs=getComputedStyle(bEl), dcs=getComputedStyle(d)
  out.text=bEl.textContent
  out.textRun=`${Math.round(tq.left)}..${Math.round(tq.right)}`
  out.bBox=`${Math.round(bq.left)}..${Math.round(bq.right)}`
  out.dateBox=`${Math.round(dq.left)}..${Math.round(dq.right)}`
  out.bFontSize=cs.fontSize; out.bLetterSpacing=cs.letterSpacing
  out.dateOverflow=dcs.overflow; out.bOverflow=cs.overflow
  out.liLeft=Math.round(li.getBoundingClientRect().left)
  // what siblings does .wf__date have
  out.dateChildren=[...d.children].map(c=>`${c.tagName.toLowerCase()}.${c.className||''} ${Math.round(c.getBoundingClientRect().left)}..${Math.round(c.getBoundingClientRect().right)}`)
  return out
}))
await page.close()

const p2=await b.newPage({viewport:{width:410,height:820}})
await p2.goto(BASE+'/contact-us/',{waitUntil:'networkidle'})
await p2.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
await p2.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
await p2.waitForTimeout(200)
console.log('CALLBACK PILL:', await p2.evaluate(()=>{
  const a=document.querySelector('.cs__callback'); if(!a) return 'not found'
  const cs=getComputedStyle(a); const q=a.getBoundingClientRect()
  const span=a.querySelector('span'); const sq=span?span.getBoundingClientRect():null
  return { box:`${Math.round(q.left)}..${Math.round(q.right)} w=${Math.round(q.width)} h=${Math.round(q.height)}`,
           width:cs.width, padding:cs.padding, overflow:cs.overflow, whiteSpace:cs.whiteSpace,
           label: span?`"${span.textContent}" ${Math.round(sq.left)}..${Math.round(sq.right)} w=${Math.round(sq.width)}`:'no span',
           overflowsPill: sq ? (sq.right > q.right - 2) : null }
}))
await b.close(); s.close()
