import { chromium } from 'playwright'
const V='/tmp/vendor'
const CDN={'https://unpkg.com/react@18.3.1/umd/react.production.min.js':`${V}/react/umd/react.production.min.js`,'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':`${V}/react-dom/umd/react-dom.production.min.js`,'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':`${V}/babel-standalone/babel.min.js`}
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1200},deviceScaleFactor:1})).newPage()
await p.route('https://unpkg.com/**',async r=>{const l=CDN[r.request().url()];if(!l)return r.abort();await r.fulfill({path:l,contentType:'application/javascript'})})
await p.goto(`http://127.0.0.1:4349/design/prototypes/${encodeURIComponent(process.argv[2])}`,{waitUntil:'networkidle'}).catch(()=>{})
await p.waitForTimeout(4200)
console.log(await p.evaluate(()=>{
  const out=[]
  for(const el of document.querySelectorAll('div,section')){
    const r=el.getBoundingClientRect(); const c=getComputedStyle(el)
    if(r.width<900||r.height<400) continue
    const bg=c.backgroundColor, bi=c.backgroundImage
    if(bg==='rgba(0, 0, 0, 0)'&&bi==='none') continue
    out.push(`x=${Math.round(r.x)} y=${Math.round(r.y+scrollY)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${bg} img=${bi.slice(0,60)}`)
  }
  return out.slice(0,10).join('\n')
}))
await b.close()
