# Industries v2 — element spec

Source prototype: `design/Roars v2 - Industries v2.dc.html`  ·  desktop canvas 1440px wide, all desktop elements absolutely positioned inside their section (coordinates are relative to the section unless noted).

## Head / global CSS
```
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#FFFFFF; }
  body { font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  * { box-sizing:border-box; }
  a { color:inherit; text-decoration:none; }
  a:hover { color:#FFD400; }
  @keyframes swoosh { from { clip-path:inset(0 100% 0 0); } to { clip-path:inset(0 0 0 0); } }
  @keyframes tick { 0%,100% { opacity:1; } 50% { opacity:.18; } }
  @media (prefers-reduced-motion: reduce) { [data-swoosh], [data-blink] { animation:none !important; } }
</style>
```

## Tweakable props (data-props)
```json
{
  "accent": {
    "editor": "color",
    "default": "#FFD400",
    "tsType": "string",
    "options": [
      "#FFD400",
      "#FF6A2B",
      "#B9FF3D",
      "#FFFFFF"
    ]
  },
  "ticketStage": {
    "editor": "int",
    "default": null,
    "min": 0,
    "max": 4,
    "tsType": "number | null",
    "section": "Hero ticket"
  },
  "motion": {
    "editor": "boolean",
    "default": true,
    "tsType": "boolean"
  }
}
```

## Fixed top bar (desktop)
- div — l:0 t:0 w:1440px h:150px  |  z-index:50
  - div
    - div — l:39px t:36px w:1366px h:111px  |  overflow:hidden
      - a — l:-9px t:-4px w:52px h:52px  |  border-radius:999px; display:flex; align-items:center; justify-content:center  |  href="Roars v2 - Main.dc.html"
        - span — background:conic-gradient(#FFD400 0turn,rgba(255,212,0,.14) 0turn); border-radius:999px; opacity:0
        - img — w:26px h:auto  |  display:block  |  src="brand/roars-mark.png"  |  alt="Roars"
      - div — l:929px t:0 w:285px h:111px  |  overflow:hidden
        - span — l:0 t:71px w:180px h:40px  |  type 14px / 500 / 20px / -0.04em / rgb(255,255,255)  |  opacity:.75
            text: "We reply within 24 hours"
        - div — l:0 t:0 w:285px h:42px
          - div — l:0 t:0 w:42px h:42px  |  background:rgb(255,255,255); border-radius:60px; overflow:hidden
            - img — l:5px t:5px w:32px h:32px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
          - a — l:42px t:0 w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  href="https://meet.roarsinc.com/sales"
            - span — l:18px t:11px  |  type 12px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
                text: "Setup a Meeting"
            - span — l:205px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
            - span — l:216px t:17px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%
      - div — l:1340px t:18px w:26px h:6px  |  display:flex; flex-direction:column; justify-content:space-between
        - span — w:26px h:2px  |  background:rgb(255,255,255); display:block
        - span — w:26px h:2px  |  background:rgb(255,255,255); display:block

## Fixed top bar (mobile, ≤760px)
- div — l:0 t:0 h:60px  |  right:0; background:rgba(255,255,255,.86); border-bottom:1px solid rgba(153,152,149,.25); display:none; align-items:center; justify-content:space-between; padding:0 16px; backdrop-filter:blur(14px); z-index:60
  - a — w:44px h:44px  |  display:flex; align-items:center; justify-content:center; margin-left:-10px  |  href="Roars v2 - Main.dc.html"
    - img — w:24px h:auto  |  display:block; filter:brightness(0)  |  src="brand/roars-mark.png"  |  alt="Roars"
  - div — display:flex; align-items:center; gap:12px
    - a — h:34px  |  type 12px / 500 / -0.03em / rgb(15,15,15)  |  border-radius:60px; box-shadow:inset 0 0 0 1.5px rgba(15,15,15,.28); display:flex; align-items:center; padding:0 16px  |  href="Roars v2 - Contact.dc.html"
        text: "Contact"
    - a — w:44px h:44px  |  display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:5px  |  href="Roars v2 - Menu.dc.html"
      - span — w:24px h:2px  |  background:rgb(15,15,15); display:block
      - span — w:24px h:2px  |  background:rgb(15,15,15); display:block

## Desktop sections

### Hero  (top 0, height 820px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-40px w:1440px h:900px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,.2) 44%,rgba(0,0,0,.55) 100%)
- div — l:39px t:168px w:400px h:340px
  - span — l:0 t:0  |  type 12px / 500 / 19px / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
      text: "INDUSTRIES / 01 — 08"
  - div — l:0 t:38px w:16px h:1.5px  |  background:#FFD400
  - span — l:0 t:66px w:390px h:96px  |  type 22px / 500 / 30px / -0.04em / rgba(255,255,255,.94)
      text: "We build the best-in-class solutions that help you serve your diners better!"
  - span — l:0 t:180px w:370px h:52px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.6)
      text: "Four surfaces, one kitchen, one order that never loses its place."
  - a — l:0 t:262px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="#cta"
    - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
        text: "Shall we chat?"
    - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
    - span — l:169px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%
- div — l:440px t:380px w:700px h:340px
  - div — l:8px t:0 w:62px h:24px
    - span — l:0 t:4px  |  type 20px / 600 / 20px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
        text: "roars"
    - img — l:52px t:0 w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
  - span — l:2px t:44px w:520px h:70px  |  type 66px / 600 / 70px / -0.05em / rgba(255,255,255,.62)  |  white-space:nowrap
      text: "food &"
  - img — l:6px t:112px w:96px h:11px  |  transform:rotate(5.4deg); filter:invert(1)  |  src="assets/union.svg"
  - span — l:0 t:116px w:900px h:160px  |  type 140px / 600 / 150px / -0.055em / rgb(251,251,251)  |  white-space:nowrap
      text: "restaurant"
  - span — l:6px t:282px w:520px h:30px  |  type 24px / 500 / 34px / -0.04em / rgba(255,255,255,.72)  |  white-space:nowrap
      text: "App development, end to end"
- div — l:1174px t:178px w:228px h:566px  |  background:#FBFBF9; box-shadow:0 26px 60px rgba(0,0,0,.45); transform:rotate(-1.1deg); overflow:hidden
  - div — l:0 t:0 w:228px h:8px  |  background:repeating-linear-gradient(90deg,#FBFBF9 0 8px,rgba(0,0,0,0) 8px 16px)
  - div — l:0 w:228px h:8px  |  bottom:0; background:repeating-linear-gradient(90deg,#FBFBF9 0 8px,rgba(0,0,0,0) 8px 16px)
  - div — l:20px t:30px w:188px h:500px  |  type #141414
    - span — l:0 t:0  |  type 11px / 600 / 0.24em
        text: "ROARS POS"
    - span — l:132px t:0  |  type 11px / 500 / 0.04em
        text: "19:42:07"
    - div — l:0 t:26px w:188px h:1px  |  border-top:1px dashed rgba(20,20,20,.35)
    - span — l:0 t:38px  |  type 12px / 500 / 0.02em
        text: "TABLE 12 · 4 COVERS"
    - span — l:0 t:58px  |  type 12px / 500 / 0.02em / rgba(20,20,20,.55)
        text: "ORDER #4471"
    - div — l:0 t:86px w:188px h:1px  |  border-top:1px dashed rgba(20,20,20,.35)
    - div — l:0 t:102px w:188px h:150px  |  type 12px / 500 / 26px / 0.01em  |  display:flex; flex-direction:column
      - span
          text: "2× Thali"
        - span — type rgba(20,20,20,.55)
            text: "480"
      - span
          text: "1× Paneer tikka"
        - span — type rgba(20,20,20,.55)
            text: "320"
      - span
          text: "1× Cold coffee"
        - span — type rgba(20,20,20,.55)
            text: "180"
      - span
          text: "2× Gulab jamun"
        - span — type rgba(20,20,20,.55)
            text: "260"
      - span — type rgba(20,20,20,.45)
          text: "— no onion, table 12"
    - div — l:0 t:256px w:188px h:1px  |  border-top:1px dashed rgba(20,20,20,.35)
    - span — l:0 t:272px  |  type 14px / 600 / 0.02em
        text: "TOTAL"
    - span — l:120px t:272px w:68px  |  type 14px / 600 / 0.02em
        text: "1,240"
    - span — l:0 t:296px  |  type 11px / 500 / 0.02em / rgba(20,20,20,.5)
        text: "PAID · UPI"
    - div — l:0 t:326px w:188px h:1px  |  border-top:1px dashed rgba(20,20,20,.35)
    - span — l:0 t:342px  |  type 10px / 600 / 0.22em / rgba(20,20,20,.5)
        text: "STATUS"
    - div — l:0 t:362px w:188px h:20px
      - span — l:0 t:5px w:7px h:7px  |  background:#FFD400
      - span — l:16px t:0 w:172px  |  type 13px / 600 / 0.03em / #141414  |  white-space:nowrap
          text: "IN THE KITCHEN"
    - div — l:0 t:402px w:188px h:36px  |  display:flex; gap:4px
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
    - div — l:0 t:452px w:188px h:1px  |  border-top:1px dashed rgba(20,20,20,.35)
    - span — l:0 t:468px  |  type 10px / 500 / 0.14em / rgba(20,20,20,.5)
        text: "BUILT BY ROARS"

### The order  (top 820px, height 2160px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "THE JOURNEY"
- span — l:33px t:148px w:900px h:210px  |  type 112px / 600 / 104px / -0.05em / rgb(36,36,36)
    text: "one order,end to end"
  - br
- div — l:962px t:158px w:440px h:220px
  - span — l:0 t:0 w:440px h:130px  |  type 22px / 500 / 32px / -0.04em / rgb(20,20,20)
      text: "A restaurant is not one app. It is six moments that have to agree with each other."
  - span — l:0 t:150px w:440px h:70px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
      text: "We design and build the surfaces each moment needs, and the plumbing that keeps them in step."
- div — l:120px t:470px w:20px h:1420px
  - div — l:0 t:0 w:0 h:1420px
  - div — l:-1px t:0 w:2px h:0  |  background:#FFD400
  - span — l:-6px t:-6px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6px t:264px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6px t:534px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6px t:804px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6px t:1074px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6px t:1344px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
- div — l:40px t:440px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "01"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Discover"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "They find you before they are hungry."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Menus, hours, reviews and location-aware discovery, so the people already three streets away end up at your table instead of somebody else’s."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "FINDER APP"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "WEB PORTAL"
- div — l:40px t:710px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "02"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Order"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "One cart for dine-in, pickup and delivery."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Modifiers, allergens, combos and upsells that read the same on a phone at the bus stop and on a tablet at the pass."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "DINER APP"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "TABLE BOOKING"
- div — l:40px t:980px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "03"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Pay"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Settled before the plate leaves the pass."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Cards, wallets, net banking, promo codes and split bills — with the failure states designed, not left to chance."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "PAYMENTS"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "COUPONS"
- div — l:40px t:1250px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "04"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Fire"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "The kitchen reads it in station order."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Tickets land on the display grouped by station. Prep timers, holds and an 86 list that updates every other surface at once."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "KITCHEN DISPLAY"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "MANAGEMENT"
- div — l:40px t:1520px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "05"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Serve"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Nobody has to ask where the order is."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Runner assignment, waiter handoff, live tracking and the alerts that keep a full floor from turning into guesswork."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "WAITER APP"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "DELIVERY"
- div — l:40px t:1790px w:1362px h:230px
  - span — l:104px t:0  |  type 12px / 500 / 0.14em / rgb(145,145,145)
      text: "06"
  - span — l:74px t:26px  |  type 60px / 600 / 66px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Return"
  - span — l:78px t:104px w:400px h:60px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "The second visit is the cheapest one."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:130px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.8)
      text: "Ratings, loyalty points and offers built from what they actually ordered — not from a generic blast to the whole list."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:90px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "LOYALTY"
    - span — type 11px / 500 / 0.12em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "PUSH & CRM"
  - div — l:580px t:200px w:782px h:0.5px  |  background:rgba(153,152,149,.5)

### Surfaces  (top 2980px, height 720px)
background: rgb(245,245,245)  ·  overflow: hidden

- div — l:40px t:80px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:100px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "SURFACES"
- span — l:34px t:136px w:760px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "four apps"
- span — l:38px t:238px w:500px h:30px  |  type 22px / 500 / 32px / -0.04em / rgba(20,20,20,.62)  |  white-space:nowrap
    text: "one kitchen — pick a seat"
- div — l:40px t:330px w:520px h:300px
  - div — l:0 t:0 w:520px h:74px
    - div — l:0 t:0 w:520px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "01"
    - span — l:54px t:18px  |  type 38px / 600 / 46px / -0.05em / rgba(36,36,36,.45)  |  white-space:nowrap
        text: "Diner"
    - span — l:504px t:34px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:74px w:520px h:74px
    - div — l:0 t:0 w:520px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "02"
    - span — l:54px t:18px  |  type 38px / 600 / 46px / -0.05em / rgba(36,36,36,.45)  |  white-space:nowrap
        text: "Waiter"
    - span — l:504px t:34px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:148px w:520px h:74px
    - div — l:0 t:0 w:520px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "03"
    - span — l:54px t:18px  |  type 38px / 600 / 46px / -0.05em / rgba(36,36,36,.45)  |  white-space:nowrap
        text: "Kitchen"
    - span — l:504px t:34px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:222px w:520px h:74px
    - div — l:0 t:0 w:520px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "04"
    - span — l:54px t:18px  |  type 38px / 600 / 46px / -0.05em / rgba(36,36,36,.45)  |  white-space:nowrap
        text: "Owner"
    - span — l:504px t:34px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
    - div — l:0 t:73.5px w:520px h:0.5px  |  background:rgba(153,152,149,.5)
- div — l:660px t:330px w:742px h:300px
  - div — l:0 t:0 w:742px h:300px
    - span — l:0 t:0 w:640px h:70px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)
        text: "Order, book a table, collect points."
    - div — l:0 t:104px w:742px h:0.5px  |  background:rgba(153,152,149,.5)
    - div — l:0 t:128px w:742px h:120px  |  type 16px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:grid; gap:14px 40px
      - span
          text: "Menu, modifiers, allergens"
      - span
          text: "Table booking with prices and reviews"
      - span
          text: "Loyalty wallet and coupon drops"
      - span
          text: "Live order tracking, pickup or delivery"
    - span — l:0 t:262px  |  type 12px / 600 / 0.16em / #141414
        text: "REORDER IN 3 TAPS"
  - div — l:0 t:0 w:742px h:300px  |  opacity:0
    - span — l:0 t:0 w:640px h:70px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)
        text: "Take the order without walking to the till."
    - div — l:0 t:104px w:742px h:0.5px  |  background:rgba(153,152,149,.5)
    - div — l:0 t:128px w:742px h:120px  |  type 16px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:grid; gap:14px 40px
      - span
          text: "Multiple table orders on one device"
      - span
          text: "Select and deselect on confirmation"
      - span
          text: "Course timing and table alerts"
      - span
          text: "Bill generation and split"
    - span — l:0 t:262px  |  type 12px / 600 / 0.16em / #141414
        text: "12 TABLES PER DEVICE"
  - div — l:0 t:0 w:742px h:300px  |  opacity:0
    - span — l:0 t:0 w:640px h:70px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)
        text: "Every ticket, in the order the line works."
    - div — l:0 t:104px w:742px h:0.5px  |  background:rgba(153,152,149,.5)
    - div — l:0 t:128px w:742px h:120px  |  type 16px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:grid; gap:14px 40px
      - span
          text: "Ticket queue by station"
      - span
          text: "Prep timers and holds"
      - span
          text: "86 list synced everywhere"
      - span
          text: "Completed and awaited orders"
    - span — l:0 t:262px  |  type 12px / 600 / 0.16em / #141414
        text: "SYNC UNDER 200MS"
  - div — l:0 t:0 w:742px h:300px  |  opacity:0
    - span — l:0 t:0 w:640px h:70px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)
        text: "See the whole floor from anywhere."
    - div — l:0 t:104px w:742px h:0.5px  |  background:rgba(153,152,149,.5)
    - div — l:0 t:128px w:742px h:120px  |  type 16px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:grid; gap:14px 40px
      - span
          text: "Sales, covers and average bill"
      - span
          text: "Menu engineering by margin"
      - span
          text: "Staff rota and delivery SLAs"
      - span
          text: "Multi-outlet in one view"
    - span — l:0 t:262px  |  type 12px / 600 / 0.16em / #141414
        text: "ALL OUTLETS, ONE DASHBOARD"

### Proof  (top 3700px, height 1000px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-70px w:1440px h:1140px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.66) 0%,rgba(0,0,0,.34) 45%,rgba(0,0,0,.68) 100%)
- div — l:40px t:90px w:16px h:1.5px  |  background:rgba(180,174,174,.7)
- span — l:40px t:110px  |  type 12px / 500 / 19px / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
    text: "PROOF"
- span — l:36px t:142px w:700px h:50px  |  type 42px / 600 / 50px / -0.05em / rgb(251,251,251)  |  white-space:nowrap
    text: "Practised since 2005"
- div — l:40px t:264px w:420px h:150px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "20"
    - span — type 36px / 500 / 86px / -0.05em / rgb(251,251,251)
        text: "+"
  - span — l:0 t:128px  |  type 11px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
      text: "YEARS IN PRODUCT DEVELOPMENT"
- div — l:501px t:264px w:420px h:150px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "250"
    - span — type 36px / 500 / 86px / -0.05em / rgb(251,251,251)
        text: "+"
  - span — l:0 t:128px  |  type 11px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
      text: "PROJECTS DELIVERED"
- div — l:962px t:264px w:440px h:150px
  - div — l:0 t:0 w:440px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "96"
    - span — type 26px / 700 / 86px / -0.05em / rgb(251,251,251)
        text: "%"
  - span — l:0 t:128px  |  type 11px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
      text: "RETURNING CUSTOMERS"
- div — l:40px t:520px w:1362px h:0.5px  |  background:rgba(255,255,255,.22)
- span — l:40px t:562px  |  type 12px / 500 / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
    text: "FEATURED WORK"
- span — l:34px t:614px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(251,251,251)  |  white-space:nowrap
    text: "The Club Social"
- span — l:962px t:620px w:440px h:100px  |  type 22px / 500 / 32px / -0.04em / rgba(255,255,255,.9)
    text: "Single app to manage club amenities/ Restaurant from one single app for members and club"
- div — l:40px t:790px w:760px h:80px  |  display:flex; gap:88px
  - div — display:flex; flex-direction:column; gap:6px
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
        text: "INDUSTRY"
    - span — type 18px / 500 / 24px / -0.04em / rgba(255,255,255,.9)
        text: "Restaurant & clubs"
  - div — display:flex; flex-direction:column; gap:6px
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
        text: "SURFACES"
    - span — type 18px / 500 / 24px / -0.04em / rgba(255,255,255,.9)
        text: "Member app · Amenities · Ordering"
- a — l:1207px t:790px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="https://www.roarsinc.com/work/club-social/"
  - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
      text: "View Project"
  - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
  - span — l:169px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%

### All industries  (top 4700px, height 980px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "WHERE ELSE WE WORK"
- span — l:33px t:146px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "seven more"
- span — l:962px t:156px w:440px h:80px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "Same four-phase process, different floor. Hover a sector to see what we go after first."
- a — l:40px t:368px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/food-restaurant-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "01"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Restaurant"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "One order, six moments, four surfaces that have to agree."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:430px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/on-demand-fitness-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "02"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Fitness"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Booking, streaks and coaching that survives week three."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:492px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/retail-ecommerce-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "03"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "eCommerce"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Catalogue, checkout and the drop-off between them."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:554px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/concierge-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "04"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Concierge"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Requests, members and loyalty that feels personal."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:616px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/travel-and-hospitality-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "05"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Travel"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Search, itinerary and the day the plan changes."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:678px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/logistics-transportation-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "06"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Logistics"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Compliance on the warehouse floor, not in a binder."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:740px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/saas-application-development-services/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "07"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Saas"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Onboarding, activation and the metric behind both."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:802px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/industries/healthcare-app-development-company/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "08"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Healthcare"
  - span — l:640px t:22px w:600px  |  type 16px / 500 / 22px / -0.04em / rgba(20,20,20,.7)  |  opacity:0; transform:translateX(-8px)
      text: "Records, appointments and rules that cannot bend."
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
  - div — l:0 t:61.5px w:1362px h:0.5px  |  background:rgba(153,152,149,.5)

### CTA  (top 5680px, height 340px)
background: rgb(245,245,245)  ·  overflow: hidden

- span — l:34px t:92px w:860px h:130px  |  type 46px / 600 / 54px / -0.05em / rgb(36,36,36)
    text: "Bring unique food & restaurant app ideas to life with our unique solutions!"
- span — l:962px t:100px w:360px h:30px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "Fill up form and schedule free consultation"
- a — l:962px t:150px w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { transform:translateY(-2px) }  |  href="https://meet.roarsinc.com/sales"
  - span — l:25px t:13px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
      text: "Shall we chat?"
  - span — l:167px t:19px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
  - span — l:177px t:19px w:8px h:8px  |  background:#FFD400; border-radius:50%
- span — l:962px t:224px  |  type 11px / 500 / 0.16em / rgba(20,20,20,.5)  |  white-space:nowrap
    text: "USA +1 (302) 505-1200 / SALES@ROARSINC.COM"

### Footer  (top 6020px, height 1105px)
background: rgb(11,11,11)  ·  overflow: hidden

- img — l:-37px t:-10px w:1672.305px h:1115.006px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:44px t:61px w:1073px h:192px  |  overflow:hidden
  - img — l:0 t:0 w:21px h:21px  |  filter:invert(1)  |  src="assets/mark.svg"  |  alt="Roars"
  - div — l:458px t:5px w:384px h:187px  |  overflow:hidden
    - span — l:0 t:0 w:384px h:120px  |  type 22px / 500 / 30px / -0.04em / rgb(147,147,147)
        text: "Find how we can help you get from A to B. Our love for innovation design and technology is evident in all our work. No detail is too small."
    - div — l:0 t:145px w:170px h:42px
      - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - span — l:56px t:3px  |  type 14px / 600 / 20px / -0.05em / rgba(255,255,255,.95)  |  white-space:nowrap
          text: "Riinkesh A Sshah"
      - span — l:56px t:23px  |  type 14px / 500 / 20px / -0.05em / rgba(255,255,255,.6)  |  white-space:nowrap
          text: "CEO / Founder"
  - span — l:921px t:11px w:180px h:48px  |  type 18px / 500 / 24px / -0.02em / rgb(255,255,255)
      text: "Space of ProductSolutions"
    - br
    - span — type #FFD400
        text: "*"
- div — l:43px t:378px w:1356px h:258px  |  overflow:hidden
  - div — l:0 t:36px w:249px h:81px
    - div — l:1px t:0 w:16px h:1.5px  |  background:rgba(180,174,174,.7)
    - span — l:0 t:34px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "USA +1 (302) 505-1200"
    - a — l:1px t:57px  |  type 20px / 600 / 24px / -0.02em / rgba(255,255,255,.95)  |  white-space:nowrap  |  href="mailto:sales@roarsinc.com"
        text: "sales@roarsinc.com"
  - span — l:459px t:0  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Navigation"
  - div — l:459px t:39px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - div — l:459px t:58px w:200px h:240px  |  type 24px / 600 / 40px / -0.06em / rgba(255,255,255,.9)  |  display:flex; flex-direction:column
    - a — href="Roars v2 - Main.dc.html"
        text: "Home"
    - a — href="Roars v2 - Agency.dc.html"
        text: "Agency"
    - a — href="Roars v2 - Approach.dc.html"
        text: "Approach"
    - a — href="Roars v2 - Projects.dc.html"
        text: "Projects"
    - a — href="Roars v2 - Insights.dc.html"
        text: "Insights"
    - a — href="Roars v2 - Contact.dc.html"
        text: "Contact"
  - div — l:692px t:64px w:120px h:90px  |  type 16px / 500 / 30px / -0.06em / rgba(255,255,255,.78)  |  display:flex; flex-direction:column
    - a — href="https://www.twitter.com/roarstech"
        text: "Twitter"
    - a — href="https://www.instagram.com/roarstech"
        text: "Instagram"
    - a — href="https://in.linkedin.com/company/roars-technologies-pvt.-ltd./"
        text: "LinkedIn"
  - span — l:925px t:0  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Subscribe our News"
  - div — l:926px t:39px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - div — l:926px t:70px w:430px h:182px  |  overflow:hidden
    - span — l:0 t:0  |  type 16px / 400 / 19px / -0.06em / rgb(255,255,255)  |  white-space:nowrap
        text: "Your name *"
    - div — l:0 t:40px w:430px h:1px  |  background:rgba(231,231,231,.3)
    - span — l:0 t:66px  |  type 16px / 400 / 19px / -0.06em / rgb(255,255,255)  |  white-space:nowrap
        text: "Email *"
    - div — l:0 t:106px w:430px h:1px  |  background:rgba(231,231,231,.3)
    - div — l:0 t:140px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)
      - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
          text: "Subscribe"
      - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — l:169px t:17px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%
- div — l:43px t:734px w:1053px h:310px  |  overflow:hidden
  - div — l:459px t:0 w:594px h:186px  |  overflow:hidden
    - img — l:5px t:61px w:58px h:7px  |  transform:rotate(6.7deg); filter:invert(1)  |  src="assets/asteroids.svg"
    - span — l:0 t:0 w:555px h:186px  |  type 182px / 600 / 86px / -0.04em / rgb(255,255,255)  |  white-space:nowrap
        text: "roars"
    - div — l:443px t:28px w:31px h:31px  |  background:#FFD400; border-radius:60px
      - span — l:0 t:0 w:31px h:31px  |  type 13px / 600 / 1 / 0 / rgb(31,31,31)  |  display:flex; align-items:center; justify-content:center
          text: "®"
  - div — l:0 t:238px w:1053px h:72px  |  overflow:hidden
    - span — l:0 t:5px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "© 2026"
    - span — l:0 t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Roars Technologies"
    - div — l:459px t:0 w:247px h:72px  |  type 12px / 500 / 21px / -0.04em / rgba(255,255,255,.8)  |  display:flex; flex-direction:column
      - a — href="#"
          text: "Privacy Policy"
      - a — href="#"
          text: "Terms of Service"
      - a — href="https://link.roars.in/F39Mv"
          text: "Company Profile"
    - span — l:692px t:3px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Offices"
    - span — l:692px t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "India · USA · UK · Belgium · Germany"
    - span — l:926px t:3px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Built by"
    - span — l:926px t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "Roars Technologies"

## Mobile layout (≤760px, normal document flow)

### M1 section (dark)
padding: 96px 20px 48px · background: #000 · layout: flex column gap 30px
- img — l:0 t:-6% w:100% h:112%  |  object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.64) 0%,rgba(0,0,0,.24) 44%,rgba(0,0,0,.6) 100%)
- div — display:flex; flex-direction:column; gap:30px
  - div — display:flex; flex-direction:column; gap:14px
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "INDUSTRIES / 01 — 08"
    - div — w:16px h:1.5px  |  background:#FFD400
    - span — type 19px / 500 / 28px / -0.04em / rgba(255,255,255,.94)
        text: "We build the best-in-class solutions that help you serve your diners better!"
    - span — type 15px / 500 / 22px / -0.04em / rgba(255,255,255,.6)
        text: "Four surfaces, one kitchen, one order that never loses its place."
  - div — display:flex; flex-direction:column; gap:8px
    - div — display:flex; align-items:center; gap:6px
      - span — type 18px / 600 / -0.04em / rgb(251,251,251)
          text: "roars"
      - img — w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
    - span — type 40px / 600 / 42px / -0.05em / rgba(255,255,255,.62)
        text: "food &"
    - span — type 58px / 600 / 58px / -0.055em / rgb(251,251,251)
        text: "restaurant"
    - span — type 18px / 500 / -0.04em / rgba(255,255,255,.72)
        text: "App development, end to end"
  - a — h:48px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 22px  |  href="#cta"
    - span — type 13px / 500 / rgb(255,255,255)
        text: "Shall we chat?"
    - span — display:flex; gap:3px
      - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — w:8px h:8px  |  background:#FFD400; border-radius:50%
  - div — w:100%  |  type #141414  |  max-width:280px; background:#FBFBF9; box-shadow:0 20px 44px rgba(0,0,0,.45); transform:rotate(-1.1deg); display:flex; flex-direction:column; gap:0; padding:24px 20px 20px
    - div — l:0 t:0 w:100% h:8px  |  background:repeating-linear-gradient(90deg,#FBFBF9 0 8px,rgba(0,0,0,0) 8px 16px)
    - div — l:0 w:100% h:8px  |  bottom:0; background:repeating-linear-gradient(90deg,#FBFBF9 0 8px,rgba(0,0,0,0) 8px 16px)
    - div — display:flex; align-items:baseline; justify-content:space-between
      - span — type 11px / 600 / 0.24em
          text: "ROARS POS"
      - span — type 11px / 500 / 0.04em
          text: "19:42:07"
    - div — border-top:1px dashed rgba(20,20,20,.35); margin:12px 0
    - span — type 12px / 500 / 0.02em
        text: "TABLE 12 · 4 COVERS"
    - span — type 12px / 500 / 0.02em / rgba(20,20,20,.55)
        text: "ORDER #4471"
    - div — border-top:1px dashed rgba(20,20,20,.35); margin:12px 0
    - div — type 12px / 500 / 0.01em  |  display:flex; flex-direction:column; gap:6px
      - span — display:flex; justify-content:space-between
        - span
            text: "2× Thali"
        - span — type rgba(20,20,20,.55)
            text: "480"
      - span — display:flex; justify-content:space-between
        - span
            text: "1× Paneer tikka"
        - span — type rgba(20,20,20,.55)
            text: "320"
      - span — display:flex; justify-content:space-between
        - span
            text: "1× Cold coffee"
        - span — type rgba(20,20,20,.55)
            text: "180"
      - span — display:flex; justify-content:space-between
        - span
            text: "2× Gulab jamun"
        - span — type rgba(20,20,20,.55)
            text: "260"
      - span — type rgba(20,20,20,.45)
          text: "— no onion, table 12"
    - div — border-top:1px dashed rgba(20,20,20,.35); margin:12px 0
    - div — type 14px / 600 / 0.02em  |  display:flex; justify-content:space-between
      - span
          text: "TOTAL"
      - span
          text: "1,240"
    - span — type 11px / 500 / 0.02em / rgba(20,20,20,.5)
        text: "PAID · UPI"
    - div — border-top:1px dashed rgba(20,20,20,.35); margin:12px 0
    - span — type 10px / 600 / 0.22em / rgba(20,20,20,.5)
        text: "STATUS"
    - div — display:flex; align-items:center; gap:10px
      - span — w:7px h:7px  |  background:#FFD400
      - span — type 13px / 600 / 0.03em / #141414
          text: "IN THE KITCHEN"
    - div — display:flex; gap:4px
      - span — h:3px  |  background:#FFD400; flex:1
      - span — h:3px  |  background:#FFD400; flex:1
      - span — h:3px  |  background:#FFD400; flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
      - span — h:3px  |  background:rgba(20,20,20,.15); flex:1
    - div — border-top:1px dashed rgba(20,20,20,.35); margin:14px 0 0
    - span — type 10px / 500 / 0.14em / rgba(20,20,20,.5)
        text: "BUILT BY ROARS"

### M2 section
padding: 44px 20px 52px · background: #fff · layout: flex column gap 24px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "THE JOURNEY"
- span — type 52px / 600 / 52px / -0.05em / rgb(36,36,36)
    text: "one order,end to end"
  - br
- span — type 19px / 500 / 28px / -0.04em / rgb(20,20,20)
    text: "A restaurant is not one app. It is six moments that have to agree with each other."
- span — type 15px / 500 / 22px / -0.04em / rgba(20,20,20,.62)
    text: "We design and build the surfaces each moment needs, and the plumbing that keeps them in step."
- div — display:flex; flex-direction:column
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 34px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "01"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Discover"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "They find you before they are hungry."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Menus, hours, reviews and location-aware discovery, so the people already three streets away end up at your table instead of somebody else’s."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "FINDER APP"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "WEB PORTAL"
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 34px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "02"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Order"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "One cart for dine-in, pickup and delivery."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Modifiers, allergens, combos and upsells that read the same on a phone at the bus stop and on a tablet at the pass."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "DINER APP"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "TABLE BOOKING"
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 34px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "03"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Pay"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "Settled before the plate leaves the pass."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Cards, wallets, net banking, promo codes and split bills — with the failure states designed, not left to chance."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "PAYMENTS"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "COUPONS"
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 34px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "04"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Fire"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "The kitchen reads it in station order."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Tickets land on the display grouped by station. Prep timers, holds and an 86 list that updates every other surface at once."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "KITCHEN DISPLAY"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "MANAGEMENT"
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 34px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "05"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Serve"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "Nobody has to ask where the order is."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Runner assignment, waiter handoff, live tracking and the alerts that keep a full floor from turning into guesswork."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "WAITER APP"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "DELIVERY"
  - div — display:flex; flex-direction:column; gap:12px; padding:0 0 6px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "06"
    - span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
        text: "Return"
    - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
        text: "The second visit is the cheapest one."
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.8)
        text: "Ratings, loyalty points and offers built from what they actually ordered — not from a generic blast to the whole list."
    - div — display:flex; gap:8px
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "LOYALTY"
      - span — type 11px / 500 / 0.12em  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
          text: "PUSH & CRM"

### M3 section
padding: 44px 20px 52px · background: rgb(245,245,245) · layout: flex column gap 22px
- div — display:flex; flex-direction:column; gap:10px
  - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "SURFACES"
- div — display:flex; flex-direction:column; gap:6px
  - span — type 52px / 600 / 52px / -0.05em / rgb(36,36,36)
      text: "four apps"
  - span — type 19px / 500 / -0.04em / rgba(20,20,20,.62)
      text: "one kitchen — pick a seat"
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:baseline; gap:14px
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "01"
    - span — type 32px / 600 / -0.05em / rgb(36,36,36)
        text: "Diner"
  - span — type 22px / 600 / 30px / -0.05em / rgb(36,36,36)
      text: "Order, book a table, collect points."
  - div — type 15px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:flex; flex-direction:column; gap:8px
    - span
        text: "Menu, modifiers, allergens"
    - span
        text: "Table booking with prices and reviews"
    - span
        text: "Loyalty wallet and coupon drops"
    - span
        text: "Live order tracking, pickup or delivery"
  - span — type 12px / 600 / 0.16em / #141414
      text: "REORDER IN 3 TAPS"
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:baseline; gap:14px
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "02"
    - span — type 32px / 600 / -0.05em / rgb(36,36,36)
        text: "Waiter"
  - span — type 22px / 600 / 30px / -0.05em / rgb(36,36,36)
      text: "Take the order without walking to the till."
  - div — type 15px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:flex; flex-direction:column; gap:8px
    - span
        text: "Multiple table orders on one device"
    - span
        text: "Select and deselect on confirmation"
    - span
        text: "Course timing and table alerts"
    - span
        text: "Bill generation and split"
  - span — type 12px / 600 / 0.16em / #141414
      text: "12 TABLES PER DEVICE"
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:baseline; gap:14px
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "03"
    - span — type 32px / 600 / -0.05em / rgb(36,36,36)
        text: "Kitchen"
  - span — type 22px / 600 / 30px / -0.05em / rgb(36,36,36)
      text: "Every ticket, in the order the line works."
  - div — type 15px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:flex; flex-direction:column; gap:8px
    - span
        text: "Ticket queue by station"
    - span
        text: "Prep timers and holds"
    - span
        text: "86 list synced everywhere"
    - span
        text: "Completed and awaited orders"
  - span — type 12px / 600 / 0.16em / #141414
      text: "SYNC UNDER 200MS"
- div — border-top:.5px solid rgba(153,152,149,.5); border-bottom:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:12px; padding:18px 0 0
  - div — display:flex; align-items:baseline; gap:14px
    - span — type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "04"
    - span — type 32px / 600 / -0.05em / rgb(36,36,36)
        text: "Owner"
  - span — type 22px / 600 / 30px / -0.05em / rgb(36,36,36)
      text: "See the whole floor from anywhere."
  - div — type 15px / 500 / -0.04em / rgba(20,20,20,.8)  |  display:flex; flex-direction:column; gap:8px
    - span
        text: "Sales, covers and average bill"
    - span
        text: "Menu engineering by margin"
    - span
        text: "Staff rota and delivery SLAs"
    - span
        text: "Multi-outlet in one view"
  - span — type 12px / 600 / 0.16em / #141414
      text: "ALL OUTLETS, ONE DASHBOARD"

### M4 section (dark)
padding: 48px 20px 52px · background: #000 · layout: flex column gap 26px
- img — l:0 t:-6% w:100% h:112%  |  object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.4) 45%,rgba(0,0,0,.72) 100%)
- div — display:flex; flex-direction:column; gap:26px
  - div — display:flex; flex-direction:column; gap:10px
    - div — w:16px h:1.5px  |  background:rgba(180,174,174,.7)
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "PROOF"
  - span — type 36px / 600 / 42px / -0.05em / rgb(251,251,251)
      text: "Practised since 2005"
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "20"
      - span — type 28px / 500
          text: "+"
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.6)
        text: "YEARS IN PRODUCT DEVELOPMENT"
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "250"
      - span — type 28px / 500
          text: "+"
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.6)
        text: "PROJECTS DELIVERED"
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "96"
      - span — type 24px / 700
          text: "%"
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.6)
        text: "RETURNING CUSTOMERS"
  - div — border-top:.5px solid rgba(255,255,255,.22); display:flex; flex-direction:column; gap:14px
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "FEATURED WORK"
    - span — type 44px / 600 / 46px / -0.05em / rgb(251,251,251)
        text: "The Club Social"
    - span — type 19px / 500 / 28px / -0.04em / rgba(255,255,255,.9)
        text: "Single app to manage club amenities/ Restaurant from one single app for members and club"
  - div — display:flex; flex-direction:column; gap:16px
    - div — display:flex; flex-direction:column; gap:4px
      - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
          text: "INDUSTRY"
      - span — type 17px / 500 / -0.04em / rgba(255,255,255,.9)
          text: "Restaurant & clubs"
    - div — display:flex; flex-direction:column; gap:4px
      - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
          text: "SURFACES"
      - span — type 17px / 500 / -0.04em / rgba(255,255,255,.9)
          text: "Member app · Amenities · Ordering"
  - a — h:48px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 22px  |  href="https://www.roarsinc.com/work/club-social/"
    - span — type 13px / 500 / rgb(255,255,255)
        text: "View Project"
    - span — display:flex; gap:3px
      - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — w:8px h:8px  |  background:#FFD400; border-radius:50%

### M5 section
padding: 44px 20px 52px · background: #fff · layout: flex column gap 22px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "WHERE ELSE WE WORK"
- span — type 52px / 600 / 52px / -0.05em / rgb(36,36,36)
    text: "seven more"
- span — type 15px / 500 / 22px / -0.04em / rgba(20,20,20,.62)
    text: "Same four-phase process, different floor."
- div — display:flex; flex-direction:column
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/food-restaurant-app-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "01"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Restaurant"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "One order, six moments, four surfaces that have to agree."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/on-demand-fitness-app-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "02"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Fitness"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Booking, streaks and coaching that survives week three."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/retail-ecommerce-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "03"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "eCommerce"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Catalogue, checkout and the drop-off between them."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/concierge-app-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "04"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Concierge"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Requests, members and loyalty that feels personal."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/travel-and-hospitality-app-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "05"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Travel"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Search, itinerary and the day the plan changes."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/logistics-transportation-app-development/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "06"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Logistics"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Compliance on the warehouse floor, not in a binder."
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/saas-application-development-services/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "07"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Saas"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Onboarding, activation and the metric behind both."
  - a — border-top:.5px solid rgba(153,152,149,.5); border-bottom:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px; padding:15px 0  |  href="https://www.roarsinc.com/industries/healthcare-app-development-company/"
    - div — display:flex; align-items:center; gap:14px
      - span — w:22px  |  type 11px / 0.14em / rgb(145,145,145)
          text: "08"
      - span — type 26px / 600 / -0.05em / rgb(36,36,36)  |  flex:1
          text: "Healthcare"
      - span — type 20px / rgba(20,20,20,.45)
          text: "→"
    - span — type 14px / 500 / 20px / -0.04em / rgba(20,20,20,.7)
        text: "Records, appointments and rules that cannot bend."

### M6 section
padding: 44px 20px 52px · background: rgb(245,245,245) · layout: flex column gap 20px
- span — type 34px / 600 / 40px / -0.05em / rgb(36,36,36)
    text: "Bring unique food & restaurant app ideas to life with our unique solutions!"
- span — type 15px / 500 / 22px / -0.04em / rgba(20,20,20,.62)
    text: "Fill up form and schedule free consultation"
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="https://meet.roarsinc.com/sales"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Shall we chat?"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#FFD400; border-radius:50%
- span — type 11px / 500 / 0.16em / rgba(20,20,20,.5)
    text: "USA +1 (302) 505-1200 / SALES@ROARSINC.COM"

### M7 section (dark)
padding: 56px 20px 40px · background: rgb(11,11,11) · layout: flex column gap 34px
- img — l:0 t:-6% w:100% h:112%  |  opacity:.55; transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(11,11,11,.6) 0%,rgba(11,11,11,.9) 100%)
- div — display:flex; flex-direction:column; gap:34px
  - div — display:flex; flex-direction:column; gap:18px
    - img — w:21px h:21px  |  filter:invert(1)  |  src="assets/mark.svg"  |  alt="Roars"
    - span — type 18px / 500 / 26px / -0.02em / rgb(255,255,255)
        text: "Space of ProductSolutions"
      - br
      - span — type #FFD400
          text: "*"
    - span — type 17px / 500 / 26px / -0.04em / rgb(147,147,147)
        text: "Find how we can help you get from A to B. Our love for innovation design and technology is evident in all our work. No detail is too small."
    - div — display:flex; align-items:center; gap:12px
      - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - div — display:flex; flex-direction:column; gap:2px
        - span — type 12px / 400 / -0.06em / rgba(255,255,255,.9)
            text: "Riinkesh A Sshah"
        - span — type 12px / 400 / -0.06em / rgba(255,255,255,.5)
            text: "CEO / Founder"
  - div — border-top:1px solid rgba(180,174,174,.35); display:flex; flex-direction:column; gap:8px
    - span — type 12px / 500 / -0.04em / rgba(255,255,255,.8)
        text: "USA +1 (302) 505-1200"
    - a — type 20px / 600 / -0.02em / rgba(255,255,255,.95)  |  href="mailto:sales@roarsinc.com"
        text: "sales@roarsinc.com"
  - div — display:flex; gap:40px
    - div — display:flex; flex-direction:column; gap:8px
      - span — type 13px / 600 / -0.06em / rgb(145,145,145)
          text: "Navigation"
      - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
      - div — type 20px / 600 / 30px / -0.06em / rgba(255,255,255,.9)  |  display:flex; flex-direction:column; gap:4px
        - a — href="Roars v2 - Main.dc.html"
            text: "Home"
        - a — href="Roars v2 - Agency.dc.html"
            text: "Agency"
        - a — href="Roars v2 - Projects.dc.html"
            text: "Projects"
        - a — href="Roars v2 - Insights.dc.html"
            text: "Insights"
        - a — href="Roars v2 - Contact.dc.html"
            text: "Contact"
    - div — type 15px / 500 / 26px / -0.06em / rgba(255,255,255,.78)  |  display:flex; flex-direction:column; gap:6px
      - a — href="https://www.twitter.com/roarstech"
          text: "Twitter"
      - a — href="https://www.instagram.com/roarstech"
          text: "Instagram"
      - a — href="https://in.linkedin.com/company/roars-technologies-pvt.-ltd./"
          text: "LinkedIn"
  - div — border-top:1px solid rgba(180,174,174,.35); display:flex; flex-direction:column; gap:14px
    - span — type 13px / 600 / -0.06em / rgb(145,145,145)
        text: "Subscribe our News"
    - div — display:flex; flex-direction:column; gap:6px
      - span — type 15px / 400 / -0.06em / rgb(255,255,255)
          text: "Your name *"
      - div — h:1px  |  background:rgba(231,231,231,.3)
    - div — display:flex; flex-direction:column; gap:6px
      - span — type 15px / 400 / -0.06em / rgb(255,255,255)
          text: "Email *"
      - div — h:1px  |  background:rgba(231,231,231,.3)
    - div — h:46px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 20px
      - span — type 12px / 500 / rgb(255,255,255)
          text: "Subscribe"
      - span — display:flex; gap:3px
        - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
        - span — w:8px h:8px  |  background:#fff; border-radius:50%
  - div — display:flex; align-items:flex-start; gap:8px
    - span — type 84px / 600 / 72px / -0.04em / rgb(255,255,255)
        text: "roars"
    - span — w:24px h:24px  |  type 11px / 600 / rgb(31,31,31)  |  background:#FFD400; border-radius:60px; display:flex; align-items:center; justify-content:center
        text: "®"
  - div — type 12px / 500 / 19px / -0.04em  |  border-top:1px solid rgba(180,174,174,.25); display:flex; gap:22px 40px
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "© 2026"
      - span — type rgba(255,255,255,.5)
          text: "Roars Technologies"
    - div — type rgba(255,255,255,.8)  |  display:flex; flex-direction:column
      - a — href="#"
          text: "Privacy Policy"
      - a — href="#"
          text: "Terms of Service"
      - a — href="https://link.roars.in/F39Mv"
          text: "Company Profile"
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "Offices"
      - span — type rgba(255,255,255,.8)
          text: "USA · UK · India"
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "Built by"
      - span — type rgba(255,255,255,.8)
          text: "Roars Technologies"

## Behaviour + data (logic class, verbatim)
```js
class Component extends DCLogic {
  componentDidMount() {
    const H = 7125;
    const DARK = [[0, 820], [3700, 4700], [6020, H]];
    const SPINE = 1420;
    const accent = this.props.accent || '#FFD400';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      || this.props.motion === false;

    this.paintAccent = () => {
      document.querySelectorAll('[data-accent-bg]').forEach(el => { el.style.background = accent; });
      document.querySelectorAll('[data-accent-tx]').forEach(el => { el.style.color = accent; });
    };

    // ── hero ticket: live clock + cycling order status ────────────────
    this.ticket = () => {
      const status = document.querySelector('[data-status]');
      const clock = document.querySelector('[data-clock]');
      const steps = [...document.querySelectorAll('[data-step]')];
      const states = ['ORDER RECEIVED', 'IN THE KITCHEN', 'PLATED', 'ON THE WAY', 'DELIVERED'];
      let i = this.props.ticketStage != null ? Math.min(4, Math.max(0, this.props.ticketStage | 0)) : 1;

      const paint = () => {
        if (status) status.textContent = states[i];
        steps.forEach((s, k) => { s.style.background = k <= i ? accent : 'rgba(20,20,20,.15)'; });
      };
      paint();

      let t = 19 * 3600 + 42 * 60 + 7;
      this.clockId = setInterval(() => {
        t += 1;
        if (clock) {
          const h = String(Math.floor(t / 3600) % 24).padStart(2, '0');
          const m = String(Math.floor(t / 60) % 60).padStart(2, '0');
          const s = String(t % 60).padStart(2, '0');
          clock.textContent = h + ':' + m + ':' + s;
        }
      }, 1000);

      if (reduce || this.props.ticketStage != null) return;
      this.stageId = setInterval(() => {
        i = (i + 1) % states.length;
        if (status) {
          status.style.transition = 'opacity .2s ease';
          status.style.opacity = '0';
          setTimeout(() => { paint(); status.style.opacity = '1'; }, 200);
        } else paint();
      }, 2600);
    };

    // ── surfaces switcher ────────────────────────────────────────────
    this.surfaces = () => {
      const tabs = [...document.querySelectorAll('[data-tab]')];
      const panels = [...document.querySelectorAll('[data-panel]')];
      if (!tabs.length) return;
      const select = n => {
        tabs.forEach(t => {
          const on = +t.getAttribute('data-tab') === n;
          const name = t.querySelector('[data-tab-name]');
          const dot = t.querySelector('[data-tab-dot]');
          const num = t.querySelector('[data-tab-num]');
          if (name) {
            name.style.color = on ? 'rgb(20,20,20)' : 'rgba(36,36,36,.45)';
            name.style.transform = on ? 'translateX(10px)' : 'none';
          }
          if (dot) dot.style.background = on ? accent : 'rgba(20,20,20,.18)';
          if (num) num.style.color = on ? 'rgb(20,20,20)' : 'rgb(145,145,145)';
        });
        panels.forEach(p => {
          const on = +p.getAttribute('data-panel') === n;
          p.style.opacity = on ? '1' : '0';
          p.style.pointerEvents = on ? 'auto' : 'none';
          p.style.transform = on ? 'none' : 'translateY(10px)';
        });
      };
      tabs.forEach(t => {
        const n = +t.getAttribute('data-tab');
        t.addEventListener('mouseenter', () => select(n));
        t.addEventListener('click', () => select(n));
      });
      select(0);
    };

    // ── industries hover lines ───────────────────────────────────────
    this.indexRows = () => {
      document.querySelectorAll('[data-ind]').forEach(row => {
        const line = row.querySelector('[data-ind-line]');
        const mark = row.querySelector('[data-ind-mark]');
        row.addEventListener('mouseenter', () => {
          if (line) { line.style.opacity = '1'; line.style.transform = 'none'; }
          if (mark) { mark.style.color = accent; mark.style.transform = 'translateX(6px)'; }
        });
        row.addEventListener('mouseleave', () => {
          if (line) { line.style.opacity = '0'; line.style.transform = 'translateX(-8px)'; }
          if (mark) { mark.style.color = 'rgba(20,20,20,.45)'; mark.style.transform = 'none'; }
        });
        if (mark) mark.style.transition = 'color .3s ease, transform .3s cubic-bezier(.16,1,.3,1)';
      });
    };

    this.mq = matchMedia('(max-width: 760px)');
    this.fit = () => {
      const wrap = document.querySelector('[data-fit]');
      const canvas = document.querySelector('[data-canvas]');
      if (!wrap || !canvas) return;
      const m = this.mq.matches;
      const mob = document.querySelector('[data-mobile]');
      const barM = document.querySelector('[data-topbar-m]');
      const barD = document.querySelector('[data-topbar]');
      if (mob) mob.style.display = m ? 'block' : 'none';
      if (barM) barM.style.display = m ? 'flex' : 'none';
      if (barD) barD.style.display = m ? 'none' : 'block';
      canvas.style.display = m ? 'none' : 'block';
      if (m) { wrap.style.height = 'auto'; return; }
      const s = wrap.clientWidth / 1440;
      canvas.style.transform = 'scale(' + s + ')';
      wrap.style.height = (H * s) + 'px';
      const bar = document.querySelector('[data-topbar]');
      if (bar) {
        bar.style.transform = 'scale(' + s + ')';
        bar.style.left = wrap.getBoundingClientRect().left + 'px';
      }
    };

    this.tint = () => {
      const wrap = document.querySelector('[data-fit]');
      const bar = document.querySelector('[data-topbar]');
      if (!wrap || !bar) return;
      const s = wrap.clientWidth / 1440;
      const yy = (scrollY + 60) / s;
      const onDark = DARK.some(r => yy >= r[0] && yy < r[1]);
      const ink = onDark ? 'rgb(255,255,255)' : 'rgb(15,15,15)';
      const contact = bar.querySelector('[data-contact]');
      if (contact) {
        const gone = scrollY > 80;
        contact.style.opacity = gone ? '0' : '1';
        contact.style.transform = gone ? 'translateY(-12px)' : 'none';
        contact.style.pointerEvents = gone ? 'none' : 'auto';
      }
      bar.querySelectorAll('[data-ink]').forEach(el => { el.style.color = ink; });
      bar.querySelectorAll('[data-fill]').forEach(el => { el.style.background = ink; });
      bar.querySelectorAll('[data-ring]').forEach(el => {
        el.style.boxShadow = 'inset 0 0 0 2px ' + (onDark ? 'rgba(255,255,255,.25)' : 'rgba(15,15,15,.28)');
      });
      const mark = bar.querySelector('[data-mark]');
      if (mark) {
        const ring = mark.querySelector('[data-logo-ring]');
        const img = mark.querySelector('[data-logo-img]');
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        const prog = Math.min(1, Math.max(0, scrollY / max));
        const onLight = !onDark;
        if (ring) {
          ring.style.background = 'conic-gradient(' + accent + ' ' + prog.toFixed(4) + 'turn, rgba(255,212,0,.14) 0turn)';
          ring.style.opacity = onLight ? '1' : '0';
        }
        mark.style.background = onLight ? '#FBFBF9' : 'transparent';
        mark.style.boxShadow = onLight ? '0 1px 0 rgba(10,10,10,.06)' : 'none';
        if (img) {
          img.style.filter = onLight
            ? 'brightness(0)'
            : 'brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)';
          img.style.transform = onLight ? 'rotate(45deg) scale(.92)' : 'rotate(0deg) scale(1)';
        }
      }
    };

    this.motion = () => {
      const track = document.querySelector('[data-track]');
      if (track) {
        const r = track.getBoundingClientRect();
        const anchor = innerHeight * 0.42;
        let prog = (anchor - r.top) / Math.max(1, r.height);
        prog = Math.min(1, Math.max(0, prog));
        const px = prog * SPINE;
        const fill = document.querySelector('[data-spine-fill]');
        if (fill) fill.style.height = px.toFixed(1) + 'px';
        const dots = [...document.querySelectorAll('[data-station]')];
        let last = -1;
        dots.forEach(d => { if (px >= +d.getAttribute('data-sy') - 2) last = +d.getAttribute('data-station'); });
        dots.forEach(dot => {
          const i = +dot.getAttribute('data-station');
          const on = px >= +dot.getAttribute('data-sy') - 2;
          dot.style.background = on ? accent : 'rgb(255,255,255)';
          dot.style.boxShadow = 'inset 0 0 0 1.5px ' + (on ? accent : 'rgba(20,20,20,.5)');
          dot.style.transform = last === i ? 'scale(1.3) rotate(45deg)' : 'scale(1)';
        });
      }
      if (reduce) return;
      document.querySelectorAll('[data-par]').forEach(el => {
        const f = parseFloat(el.getAttribute('data-par'));
        const rr = el.getBoundingClientRect();
        const off = ((rr.top + rr.height / 2) - innerHeight / 2) * f;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
      const tk = document.querySelector('[data-ticket]');
      if (tk) {
        const rr = tk.getBoundingClientRect();
        const k = ((rr.top + rr.height / 2) - innerHeight / 2) / innerHeight;
        tk.style.transform = 'translate3d(0,' + (k * -46).toFixed(1) + 'px,0) rotate(' + (-1.1 + k * 1.6).toFixed(2) + 'deg)';
      }
    };

    this.counts = () => {
      const els = [...document.querySelectorAll('[data-count]')];
      if (!els.length) return;
      const io2 = new IntersectionObserver(ents => {
        ents.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          io2.unobserve(el);
          const target = +el.getAttribute('data-count');
          if (reduce) { el.textContent = target; return; }
          const t0 = performance.now();
          const step = now => {
            const k = Math.min(1, (now - t0) / 1100);
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      els.forEach(el => io2.observe(el));
      this.io2 = io2;
    };

    this.onScroll = () => {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = null;
        this.tint();
        this.motion();
      });
    };

    this.logoIntro = () => {
      const img0 = document.querySelector('[data-logo-img]');
      if (!img0 || reduce) return;
      img0.animate(
        [{ transform: 'scale(.2) rotate(-90deg)', opacity: 0.001 },
         { transform: 'scale(1.12) rotate(8deg)', opacity: 1, offset: 0.62 },
         { transform: 'scale(1) rotate(0deg)', opacity: 1 }],
        { duration: 1100, delay: 300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      );
    };

    this.reveal = () => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;
      const items = [];
      [...canvas.querySelectorAll('[data-screen-label]')].forEach(sec => {
        [...sec.children].forEach(el => {
          if (el.tagName === 'IMG' && el.parentElement === sec) return;
          if (el.hasAttribute && (el.hasAttribute('data-par') || el.hasAttribute('data-track') || el.hasAttribute('data-ticket'))) return;
          if (!el.style || el.style.position !== 'absolute') return;
          el.style.willChange = 'transform,opacity';
          el.style.transition = 'transform .72s cubic-bezier(.22,.68,.28,1), opacity .62s ease';
          const d = el.getAttribute('data-delay');
          if (d) el.style.transitionDelay = d;
          el.style.opacity = '0';
          items.push(el);
        });
      });
      const base = new Map();
      items.forEach(el => base.set(el, el.style.transform || ''));
      items.forEach(el => { el.style.transform = (base.get(el) + ' translateY(26px)').trim(); });
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.style.transform = base.get(el);
          el.style.opacity = '1';
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.04 });
      items.forEach(el => io.observe(el));
      this.io = io;
    };

    this.paintAccent();
    this.ticket();
    this.surfaces();
    this.indexRows();
    this.counts();
    this.logoIntro();
    this.tint();
    if (!reduce) requestAnimationFrame(() => this.reveal());
    addEventListener('scroll', this.onScroll, { passive: true });

    this.fit();
    this.motion();
    this.mobileMotion = () => {
      const mob = document.querySelector('[data-mobile]');
      if (!mob || this.mio) return;
      const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const bar = document.querySelector('[data-topbar-m]');
      if (bar && !bar.querySelector('[data-mprog]')) {
        const p = document.createElement('span');
        p.setAttribute('data-mprog', '1');
        p.style.cssText = 'position:absolute;left:0;bottom:-1px;height:2px;width:0;background:#FFD400;transition:width .12s linear';
        bar.appendChild(p);
      }
      if (!soft) {
        [...mob.querySelectorAll('[data-mrev]')].forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px) scale(.985)';
          el.style.transition = 'transform .8s cubic-bezier(.22,.68,.28,1), opacity .6s ease';
          [...el.children].forEach((c, i) => {
            if (i > 7) return;
            c.style.opacity = '0';
            c.style.transform = 'translateY(12px)';
            c.style.transition = 'transform .66s cubic-bezier(.22,.68,.28,1) ' + (60 + i * 70) + 'ms, opacity .5s ease ' + (60 + i * 70) + 'ms';
          });
        });
        this.mio = new IntersectionObserver(ens => {
          ens.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.style.opacity = '1';
            el.style.transform = 'none';
            [...el.children].forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
            const dot = el.querySelector('[data-mdot]');
            if (dot) { dot.style.background = '#FFD400'; dot.style.boxShadow = 'inset 0 0 0 1.5px rgba(20,20,20,.15)'; }
            this.mio.unobserve(el);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
        [...mob.querySelectorAll('[data-mrev]')].forEach(el => this.mio.observe(el));
      }
      const darks = [...mob.querySelectorAll('[data-mdark]')];
      const pars = [...mob.querySelectorAll('[data-mpar]')];
      this.mtint = () => {
        if (!this.mq.matches) return;
        const doc = document.documentElement;
        const prog = Math.min(1, Math.max(0, scrollY / Math.max(1, doc.scrollHeight - innerHeight)));
        const pb = bar && bar.querySelector('[data-mprog]');
        if (pb) pb.style.width = (prog * 100).toFixed(2) + '%';
        if (!soft) pars.forEach(el => {
          const r = el.getBoundingClientRect();
          const k = parseFloat(el.getAttribute('data-mpar')) || 0.06;
          const off = (r.top + r.height / 2 - innerHeight / 2) * -k;
          const flip = (el.style.transform || '').indexOf('scaleY(-1)') >= 0 ? ' scaleY(-1)' : '';
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)' + flip;
        });
        if (!bar) return;
        const onDark = darks.some(s => { const r = s.getBoundingClientRect(); return r.top <= 30 && r.bottom > 30; });
        bar.style.background = onDark ? 'rgba(10,10,10,.55)' : 'rgba(255,255,255,.86)';
        bar.style.borderBottomColor = onDark ? 'rgba(255,255,255,.16)' : 'rgba(153,152,149,.25)';
        const ink = onDark ? 'rgb(255,255,255)' : 'rgb(15,15,15)';
        bar.querySelectorAll('[data-mbar-line]').forEach(el => { el.style.background = ink; });
        const pill = bar.querySelector('[data-mbar-pill]');
        if (pill) { pill.style.color = ink; pill.style.boxShadow = 'inset 0 0 0 1.5px ' + (onDark ? 'rgba(255,255,255,.3)' : 'rgba(15,15,15,.28)'); }
        const img = bar.querySelector('[data-mbar-img]');
        if (img) img.style.filter = onDark ? 'brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)' : 'brightness(0)';
      };
      // ── mobile: tap-to-open accordions ──────────────────────────────
      const maccs = [...mob.querySelectorAll('[data-macc]')];
      maccs.forEach(acc => {
        if (acc.dataset.wired) return;
        acc.dataset.wired = '1';
        const head = acc.querySelector('[data-macc-head]');
        const body = acc.querySelector('[data-macc-body]');
        const inner = acc.querySelector('[data-macc-inner]');
        const ico = acc.querySelector('[data-macc-ico]');
        if (!head || !body || !inner) return;
        const set = on => {
          acc.dataset.open = on ? '1' : '';
          body.style.height = on ? inner.offsetHeight + 'px' : '0px';
          if (ico) {
            ico.style.transform = on ? 'rotate(45deg)' : 'none';
            ico.style.color = on ? '#FFD400' : 'rgba(20,20,20,.5)';
          }
        };
        acc.__set = set;
        head.addEventListener('click', () => {
          const on = acc.dataset.open !== '1';
          maccs.forEach(o => { if (o !== acc && o.__set) o.__set(false); });
          set(on);
        });
      });

      // ── mobile: filter chips ────────────────────────────────────────
      const mchips = [...mob.querySelectorAll('[data-mfilter]')];
      const mcards = [...mob.querySelectorAll('[data-mcard]')];
      if (mchips.length && mcards.length) {
        const mcount = mob.querySelector('[data-mcount]');
        const applyM = key => {
          let n = 0;
          mcards.forEach(c => {
            const on = key === 'all' || (' ' + c.getAttribute('data-mcat') + ' ').indexOf(' ' + key + ' ') >= 0;
            c.style.display = on ? 'flex' : 'none';
            if (on) n += 1;
          });
          if (mcount) mcount.textContent = n + ' / ' + mcards.length;
          mchips.forEach(ch => {
            const on = ch.getAttribute('data-mfilter') === key;
            ch.style.background = on ? '#FFD400' : 'transparent';
            ch.style.boxShadow = 'inset 0 0 0 1px ' + (on ? '#FFD400' : 'rgba(20,20,20,.16)');
          });
        };
        mchips.forEach(ch => ch.addEventListener('click', () => applyM(ch.getAttribute('data-mfilter'))));
      }

      // ── mobile: stagger children + reveal, progress bar, parallax ───
      const soft2 = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (bar && !bar.querySelector('[data-mprog]')) {
        const pb0 = document.createElement('span');
        pb0.setAttribute('data-mprog', '1');
        pb0.style.cssText = 'position:absolute;left:0;bottom:-1px;height:2px;width:0;background:#FFD400;transition:width .12s linear';
        bar.appendChild(pb0);
      }
      if (!soft2) {
        mob.querySelectorAll('section > img').forEach(im => {
          if (!im.hasAttribute('data-mpar') && !im.hasAttribute('data-mpar2')) {
            im.setAttribute('data-mpar2', '0.05');
            im.style.willChange = 'transform';
          }
        });
        const revs = [...mob.querySelectorAll('[data-mrev]')];
        revs.forEach(el => {
          el.style.willChange = 'transform,opacity';
          if (!el.style.transition) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px) scale(.985)';
            el.style.transition = 'transform .8s cubic-bezier(.22,.68,.28,1), opacity .6s ease';
          }
          [...el.children].forEach((c, i) => {
            if (i > 7 || c.dataset.stag) return;
            c.dataset.stag = '1';
            c.style.opacity = '0';
            c.style.transform = 'translateY(12px)';
            c.style.transition = 'transform .66s cubic-bezier(.22,.68,.28,1) ' + (60 + i * 70) + 'ms, opacity .5s ease ' + (60 + i * 70) + 'ms';
          });
        });
        this.mio2 = new IntersectionObserver(ens => {
          ens.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.style.opacity = '1';
            el.style.transform = 'none';
            [...el.children].forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
            const dot = el.querySelector('[data-mdot]');
            if (dot) { dot.style.background = '#FFD400'; dot.style.boxShadow = 'inset 0 0 0 1.5px rgba(20,20,20,.15)'; }
            this.mio2.unobserve(el);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
        revs.forEach(el => this.mio2.observe(el));
      }
      const pars2 = [...mob.querySelectorAll('[data-mpar2]')];
      this.mextra = () => {
        if (!this.mq.matches) return;
        const pb = bar && bar.querySelector('[data-mprog]');
        if (pb) {
          const prog = Math.min(1, Math.max(0, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
          pb.style.width = (prog * 100).toFixed(2) + '%';
        }
        if (soft2) return;
        pars2.forEach(el => {
          const r = el.getBoundingClientRect();
          const k = parseFloat(el.getAttribute('data-mpar2')) || 0.05;
          const off = (r.top + r.height / 2 - innerHeight / 2) * -k;
          const flip = (el.getAttribute('style') || '').indexOf('scaleY(-1)') >= 0 ? ' scaleY(-1)' : '';
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)' + flip;
        });
      };
      this.mextra();
      addEventListener('scroll', this.mextra, { passive: true });

      this.mtint();
      addEventListener('scroll', this.mtint, { passive: true });
    };
    this.mobileMotion();
    this.onMq = () => this.fit();
    if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq);

    addEventListener('resize', this.fit);
    const wrap = document.querySelector('[data-fit]');
    if (wrap && window.ResizeObserver) {
      this.ro = new ResizeObserver(() => { this.fit(); this.motion(); });
      this.ro.observe(wrap);
    }
  }

  componentWillUnmount() {
    if (this.mtint) removeEventListener('scroll', this.mtint);
    if (this.mio) this.mio.disconnect();
    if (this.mio2) this.mio2.disconnect();
    if (this.mextra) removeEventListener('scroll', this.mextra);
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
    removeEventListener('resize', this.fit);
    removeEventListener('scroll', this.onScroll);
    if (this.io) this.io.disconnect();
    if (this.io2) this.io2.disconnect();
    if (this.ro) this.ro.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.clockId) clearInterval(this.clockId);
    if (this.stageId) clearInterval(this.stageId);
  }
}
```