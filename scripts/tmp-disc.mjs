import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
const DIST='/home/claude/roars-web/dist'
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json'}
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';let b=null;try{b=await readFile(join(DIST,p))}catch{};if(b){r.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});r.end(b)}else{r.writeHead(404);r.end('')}})
await new Promise(r=>s.listen(0,'127.0.0.1',r))
const b=await chromium.launch()
for (const w of [320,390,556,680,768,1040,1440]) {
  const page=await b.newPage({viewport:{width:w,height:900}})
  await page.goto(`http://127.0.0.1:${s.address().port}/about-us/`,{waitUntil:'networkidle'})
  await page.addStyleTag({content:'[data-reveal],[data-reveal] *{transition:none!important;opacity:1!important;transform:none!important}'})
  await page.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in')))
  await page.waitForTimeout(120)
  console.log(`@${String(w).padStart(4)}`, await page.evaluate(()=>{
    const out=[]
    document.querySelectorAll('.agb__rest').forEach((r,i)=>{
      const disc=r.querySelector('.agb__rest-disc'), n=r.querySelector('.agb__rest-n')
      const dq=disc.getBoundingClientRect(), nq=n.getBoundingClientRect()
      const cs=getComputedStyle(n)
      // the text run alone, without the star
      const t=[...n.childNodes].find(x=>x.nodeType===3)
      let tw=0
      if(t){const rg=document.createRange();rg.selectNode(t);tw=Math.round(rg.getBoundingClientRect().width)}
      const fits = nq.left>=dq.left && nq.right<=dq.right
      out.push(`${i===0?'team ':'client'} disc=${Math.round(dq.width)} group=${Math.round(nq.width)} text=${tw} fs=${cs.fontSize} ${fits?'fits':'OVERFLOWS by '+Math.round(Math.max(dq.left-nq.left,nq.right-dq.right))+'px'}`)
    })
    return out.join('  |  ')
  }))
  await page.close()
}
await b.close(); s.close()
