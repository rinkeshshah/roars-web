import { chromium } from 'playwright'
const V='/tmp/vendor'
const CDN={'https://unpkg.com/react@18.3.1/umd/react.production.min.js':`${V}/react/umd/react.production.min.js`,'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js':`${V}/react-dom/umd/react-dom.production.min.js`,'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':`${V}/babel-standalone/babel.min.js`}
const b=await chromium.launch()
const p=await (await b.newContext({viewport:{width:1440,height:1200},deviceScaleFactor:1})).newPage()
await p.route('https://unpkg.com/**',async r=>{const l=CDN[r.request().url()];if(!l)return r.abort();await r.fulfill({path:l,contentType:'application/javascript'})})
await p.goto('http://127.0.0.1:4349/design/prototypes/Roars%20v2%20-%20Main.dc.html',{waitUntil:'networkidle',timeout:60000}).catch(()=>{})
await p.waitForTimeout(4500)
const [lo,hi]=[Number(process.argv[2]),Number(process.argv[3])]
const out=await p.evaluate(([lo,hi])=>{const res=[];for(const el of document.querySelectorAll('*')){const r=el.getBoundingClientRect();const y=r.y+scrollY;if(y<lo||y>hi||!r.width||!r.height)continue;const c=getComputedStyle(el);const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('').slice(0,42);const isImg=el.tagName==='IMG';if(!own&&!isImg&&c.backgroundImage==='none'&&c.backgroundColor==='rgba(0, 0, 0, 0)')continue;res.push({tag:el.tagName,t:own||(isImg?'<'+(el.getAttribute('src')||'').split('/').pop():'[bg]'),x:Math.round(r.x),y:Math.round(y),w:Math.round(r.width),h:Math.round(r.height),fs:c.fontSize,fw:c.fontWeight,col:c.color,bg:c.backgroundColor,br:c.borderRadius})}return res},[lo,hi])
for(const r of out) console.log(`x=${String(r.x).padStart(5)} y=${String(r.y).padStart(5)} ${String(r.w).padStart(4)}x${String(r.h).padStart(3)} ${r.fs.padStart(5)}/${r.fw} ${r.br.padEnd(6)} ${r.bg.padEnd(22)} ${r.t}`)
await b.close()
