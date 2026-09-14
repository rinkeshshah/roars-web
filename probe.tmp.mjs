import { chromium } from 'playwright'
const V='/tmp/vendor'
const CDN={'https://unpkg.com/react@18.3.1/umd/react.production.min.js':`${V}/react/umd/react.production.min.js`,'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':`${V}/react-dom/umd/react-dom.production.min.js`,'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':`${V}/babel-standalone/babel.min.js`}
const b=await chromium.launch()
const ctx=await b.newContext({viewport:{width:1440,height:1200},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.route('https://unpkg.com/**',async r=>{const l=CDN[r.request().url()];if(!l)return r.abort();await r.fulfill({path:l,contentType:'application/javascript'})})
await p.goto('http://127.0.0.1:4349/design/prototypes/Roars%20v2%20-%20Main.dc.html',{waitUntil:'networkidle',timeout:60000}).catch(()=>{})
await p.waitForTimeout(4500)
const out=await p.evaluate(()=>{const res=[];for(const el of document.querySelectorAll('span,div,a,p')){const t=(el.textContent||'').trim();if(!t||t.length>70)continue;if(el.children.length)continue;const r=el.getBoundingClientRect();if(!r.width)continue;const c=getComputedStyle(el);res.push({t:t.slice(0,46),x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),fs:c.fontSize,fw:c.fontWeight,col:c.color})}return res})
const want=process.argv[2]?new RegExp(process.argv[2],'i'):/./
for(const r of out) if(want.test(r.t)) console.log(`${r.fs.padStart(6)} ${r.fw.padStart(4)} x=${String(r.x).padStart(5)} y=${String(r.y).padStart(5)} w=${String(r.w).padStart(4)} ${r.col.padEnd(22)} ${r.t}`)
await b.close()
