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
await page.waitForTimeout(200)
console.log(await page.evaluate(()=>{
  const li=document.querySelectorAll('.wf__rows li')[1]
  const a=li.querySelector('a'), d=li.querySelector('.wf__date'), sh=li.querySelector('.wf__shot')
  const dump=(el,label)=>{
    const cs=getComputedStyle(el)
    const be=getComputedStyle(el,'::before'), af=getComputedStyle(el,'::after')
    return {
      [label]: { bg: cs.background.slice(0,90), bgImage: cs.backgroundImage.slice(0,90) },
      [label+'::before']: { content: be.content, bgImage: be.backgroundImage.slice(0,90), pos: be.position, box: `${be.top}/${be.right}/${be.bottom}/${be.left}`, h: be.height, w: be.width },
      [label+'::after']: { content: af.content, bgImage: af.backgroundImage.slice(0,90), pos: af.position, box: `${af.top}/${af.right}/${af.bottom}/${af.left}`, h: af.height, w: af.width },
    }
  }
  return Object.assign({}, dump(li,'li'), dump(a,'a'), dump(d,'date'), dump(sh,'shot'))
}))
await b.close(); s.close()
