import { chromium } from 'playwright'
const V='/tmp/vendor'
const CDN={'https://unpkg.com/react@18.3.1/umd/react.production.min.js':`${V}/react/umd/react.production.min.js`,'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':`${V}/react-dom/umd/react-dom.production.min.js`,'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':`${V}/babel-standalone/babel.min.js`}
const b=await chromium.launch()
const p=await (await b.newContext({viewport:{width:1440,height:1200},deviceScaleFactor:1})).newPage()
await p.route('https://unpkg.com/**',async r=>{const l=CDN[r.request().url()];if(!l)return r.abort();await r.fulfill({path:l,contentType:'application/javascript'})})
await p.goto(`http://127.0.0.1:4349/design/prototypes/${encodeURIComponent(process.argv[2])}`,{waitUntil:'networkidle',timeout:60000}).catch(()=>{})
await p.waitForTimeout(4500)
const lo=Number(process.argv[3]), hi=Number(process.argv[4])
console.log(await p.evaluate(([lo,hi])=>{
  const out=[]
  for(const el of document.querySelectorAll('*')){
    const r=el.getBoundingClientRect(); const y=r.y+scrollY
    if(y<lo||y>hi||!r.width||!r.height) continue
    const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('')
    if(!own) continue
    const c=getComputedStyle(el)
    out.push(`x=${String(Math.round(r.x)).padStart(5)} y=${String(Math.round(y)).padStart(5)} ${c.fontSize.padStart(5)}/${c.fontWeight} ${own.slice(0,46)}`)
  }
  return out.join('\n')
},[lo,hi]))
await b.close()
