# Approach — element spec

Source prototype: `design/Roars v2 - Approach.dc.html`  ·  desktop canvas 1440px wide, all desktop elements absolutely positioned inside their section (coordinates are relative to the section unless noted).

## Head / global CSS
```
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#FFFFFF; }
  body { font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  * { box-sizing:border-box; }
  a { color:inherit; text-decoration:none; }
  a:hover { color:#FFD400; }
  @keyframes swoosh { from { clip-path:inset(0 100% 0 0); } to { clip-path:inset(0 0 0 0); } }
  @keyframes headPulse { 0%,100% { box-shadow:0 0 0 0 rgba(255,212,0,.55); } 70% { box-shadow:0 0 0 9px rgba(255,212,0,0); } }
  @media (prefers-reduced-motion: reduce) {
    [data-swoosh], [data-head] { animation:none !important; }
  }
</style>
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
          - a — l:42px t:0 w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="https://meet.roarsinc.com/sales"
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

### Header  (top 0, height 780px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-40px w:1440px h:860px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.18) 42%,rgba(0,0,0,.5) 100%)
- div — l:39px t:150px w:384px h:300px
  - img — l:0 t:0 w:32px h:27px  |  opacity:.55  |  src="assets/quote.svg"
  - span — l:0 t:34px w:384px h:100px  |  type 22px / 500 / 30px / -0.04em / rgba(255,255,255,.94)
      text: "Most products don’t fail because of bad design."
  - span — l:0 t:122px w:384px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.62)
      text: "They fail because no one fixed the problem first."
  - div — l:0 t:196px w:300px h:42px
    - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
    - span — l:56px t:3px  |  type 14px / 600 / 20px / -0.05em / rgba(255,255,255,.95)  |  white-space:nowrap
        text: "Riinkesh A Sshah"
    - span — l:56px t:23px  |  type 14px / 500 / 20px / -0.05em / rgba(255,255,255,.6)  |  white-space:nowrap
        text: "CEO / Founder"
- div — l:488.849px t:440px w:778.151px h:253px
  - div — l:0 t:23px w:449.152px h:157.176px
    - img — l:1.026px t:139.875px w:73.401px h:8.868px  |  transform:rotate(6.66deg); filter:invert(1)  |  src="assets/union.svg"
    - span — l:6.151px t:52px w:560px h:86px  |  type 124px / 600 / 86px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
        text: "Approach"
    - div — l:13.152px t:0 w:62px h:24px
      - span — l:0 t:4px w:59px h:20px  |  type 20px / 600 / 20px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
          text: "roars"
      - img — l:52px t:0 w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
  - div — l:601px t:14px w:233px h:132px
    - span — l:0 t:0  |  type 14px / 600 / 19px / -0.06em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "One process, four phases"
    - div — l:0 t:30px w:300px h:100px  |  type 14px / 500 / 25px / -0.04em / rgba(255,255,255,.8)  |  display:flex; flex-direction:column
      - span
          text: "Explore"
        - span — type rgba(255,255,255,.45)
            text: "01"
      - span
          text: "Define"
        - span — type rgba(255,255,255,.45)
            text: "02"
      - span
          text: "Ideate"
        - span — type rgba(255,255,255,.45)
            text: "03"
      - span
          text: "Transform"
        - span — type rgba(255,255,255,.45)
            text: "04"
  - span — l:246.151px t:213px w:280px h:40px  |  type 14px / 500 / 20px / -0.06em / rgb(255,255,255)  |  opacity:.89
      text: "We start with what’s brokenin your business."
    - br

### Process  (top 780px, height 2240px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
    text: "Method"
- span — l:33px t:150px w:900px h:120px  |  type 124px / 600 / 110px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "problem first"
- div — l:962px t:158px w:440px h:250px
  - span — l:0 t:0 w:440px h:130px  |  type 22px / 500 / 32px / -0.04em / rgb(20,20,20)
      text: "At Roars, we don’t start with screens. We start with what’s broken in your business."
  - span — l:0 t:150px w:440px h:90px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
      text: "Then we design, build, and scale products that actually move metrics."
- div — l:40px t:396px w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
- div — l:40px t:500px w:1362px h:30px
  - span — l:0 t:0  |  type 18px / 600 / 24px / -0.05em / rgb(107,107,107)  |  white-space:nowrap
      text: "The process, end to end"
  - span — l:1080px t:0 w:282px  |  type 18px / 500 / 24px / -0.04em / rgba(20,20,20,.62)  |  white-space:nowrap
      text: "problem ↓ performance"
- div — l:120px t:570px w:20px h:1500px
  - div — l:0 t:0 w:1px h:1500px  |  background:rgba(153,152,149,.45)
  - div — l:-0.5px t:0 w:2px h:0  |  background:#FFD400
  - span — l:-4.5px t:-5px w:10px h:10px  |  background:#FFD400; border-radius:50%; opacity:0
  - span — l:-9.5px t:-9.5px w:19px h:19px  |  background:rgb(255,255,255); border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-9.5px t:390.5px w:19px h:19px  |  background:rgb(255,255,255); border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-9.5px t:790.5px w:19px h:19px  |  background:rgb(255,255,255); border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-9.5px t:1190.5px w:19px h:19px  |  background:rgb(255,255,255); border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:-6.5px t:1493.5px w:13px h:13px  |  background:rgb(255,255,255); border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
- div — l:40px t:550px w:1362px h:330px
  - span — l:110px t:2px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)
      text: "01"
  - span — l:75px t:42px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Explore"
  - span — l:78px t:156px w:420px h:110px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Understanding your customers, business, and where you’re losing opportunity"
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:240px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.8)
      text: "Conduct focused interviews to uncover real customer behavior, not assumptions. Analyze how users currently interact with your product or service. Identify gaps, friction points, and missed opportunities in your existing experience. Map where your business can create more value through better journeys or new offerings."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:110px  |  display:flex; gap:8px
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "PEOPLE"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "STRATEGY"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "INTERACTION"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "TECHNOLOGY"
- div — l:40px t:950px w:1362px h:330px
  - span — l:110px t:2px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)
      text: "02"
  - span — l:75px t:42px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Define"
  - span — l:78px t:156px w:420px h:110px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Aligning insights into clear product direction and priorities."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:240px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.8)
      text: "Translate research into actionable insights that guide decisions. Define the problems worth solving based on impact and feasibility. Align business goals with user needs and product direction. Prioritize features and opportunities to avoid unnecessary complexity."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:110px  |  display:flex; gap:8px
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "CUSTOMER"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "BUSINESS"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "OBJECTIVES"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "INSIGHT"
- div — l:40px t:1350px w:1362px h:330px
  - span — l:110px t:2px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)
      text: "03"
  - span — l:75px t:42px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Ideate"
  - span — l:78px t:156px w:420px h:110px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Exploring solutions and validating ideas before building."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:240px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.8)
      text: "Generate multiple solution directions based on defined problems. Create quick prototypes to visualize and test concepts early. Gather feedback to refine ideas and remove weak assumptions. Iterate rapidly to arrive at solutions that are both usable and viable."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:110px  |  display:flex; gap:8px
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "HYPOTHESIS"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "DESIGN"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "TEST"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "EVALUATE"
- div — l:40px t:1750px w:1362px h:330px
  - span — l:110px t:2px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)
      text: "04"
  - span — l:75px t:42px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Transform"
  - span — l:78px t:156px w:420px h:110px  |  type 20px / 500 / 28px / -0.04em / rgba(20,20,20,.78)
      text: "Designing, building, and improving products that perform."
  - div — l:580px t:14px w:400px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:580px t:38px w:400px h:240px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.8)
      text: "Translate validated ideas into scalable product experiences. Design and develop with a focus on usability, speed, and clarity. Continuously test and optimize based on real user behavior. Evolve the product to improve performance, engagement, and growth."
  - div — l:1022px t:14px w:340px h:0.5px  |  background:rgba(153,152,149,.5)
  - div — l:1022px t:38px w:340px h:110px  |  display:flex; gap:8px
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "GUIDE"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "IMPLEMENT"
    - span — type 13px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:8px 14px  |  HOVER { box-shadow:inset 0 0 0 1px #FFD400;background:rgba(255,212,0,.14) }
        text: "SUPPORT"

### Track record  (top 3020px, height 640px)
background: rgb(245,245,245)  ·  overflow: hidden

- div — l:40px t:90px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:110px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
    text: "Track record"
- span — l:36px t:142px w:700px h:50px  |  type 42px / 600 / 50px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "Practised since 2005"
- span — l:962px t:150px w:440px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "The same four phases, run for startups and enterprises across five countries."
- div — l:40px t:320px w:420px h:160px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:-3px t:34px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(36,36,36)
        text: "20"
    - span — type 36px / 500 / 86px / -0.05em / rgb(36,36,36)
        text: "+"
  - span — l:0 t:134px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Years in product development"
- div — l:501px t:320px w:420px h:160px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:-3px t:34px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(36,36,36)
        text: "250"
    - span — type 36px / 500 / 86px / -0.05em / rgb(36,36,36)
        text: "+"
  - span — l:0 t:134px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Projects delivered"
- div — l:962px t:320px w:440px h:160px
  - div — l:0 t:0 w:440px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:-3px t:34px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(36,36,36)
        text: "96"
    - span — type 26px / 700 / 86px / -0.05em / rgb(36,36,36)
        text: "%"
  - span — l:0 t:134px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Returning customers"

### Services  (top 3660px, height 780px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
    text: "Where we apply it"
- span — l:33px t:150px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "what we build"
- span — l:962px t:160px w:440px h:70px  |  type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "Five practices, one process. Every engagement runs Explore through Transform."
- a — l:40px t:348px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/s/product-development-company/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 12px / 500 / 19px / -0.04em / rgb(145,145,145)
      text: "01"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Product Development"
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:410px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/s/user-experience-design-agency/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 12px / 500 / 19px / -0.04em / rgb(145,145,145)
      text: "02"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "User Experience Design"
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:472px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/s/mobile-app-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 12px / 500 / 19px / -0.04em / rgb(145,145,145)
      text: "03"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "Mobile App Development"
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:534px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/s/mvp-development/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 12px / 500 / 19px / -0.04em / rgb(145,145,145)
      text: "04"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "MVP Development"
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
- a — l:40px t:596px w:1362px h:62px  |  display:block  |  HOVER { background:rgba(255,212,0,.10) }  |  href="https://www.roarsinc.com/s/ai-automation-services/"
  - div — l:0 t:0 w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:14px t:26px  |  type 12px / 500 / 19px / -0.04em / rgb(145,145,145)
      text: "05"
  - span — l:70px t:16px  |  type 32px / 600 / 40px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
      text: "AI Automation Services"
  - span — l:1290px t:20px  |  type 24px / 500 / 32px / rgba(20,20,20,.45)
      text: "→"
  - div — l:0 t:61.5px w:1362px h:0.5px  |  background:rgba(153,152,149,.5)

### Footer  (top 4440px, height 1105px)
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
padding: 96px 20px 44px · background: #000 · layout: flex column gap 34px
- img — l:0 t:0 w:100% h:100%  |  object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,.28) 42%,rgba(0,0,0,.78) 100%)
- div — display:flex; flex-direction:column; gap:34px
  - div — display:flex; flex-direction:column; gap:14px
    - img — w:28px h:24px  |  opacity:.55  |  src="assets/quote.svg"
    - span — type 20px / 500 / 29px / -0.04em / rgba(255,255,255,.94)
        text: "Most products don’t fail because of bad design."
    - span — type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.62)
        text: "They fail because no one fixed the problem first."
    - div — display:flex; align-items:center; gap:12px
      - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - div — display:flex; flex-direction:column; gap:2px
        - span — type 14px / 600 / -0.05em / rgba(255,255,255,.95)
            text: "Riinkesh A Sshah"
        - span — type 14px / 500 / -0.05em / rgba(255,255,255,.6)
            text: "CEO / Founder"
  - div — display:flex; flex-direction:column; gap:10px
    - div — display:flex; align-items:center; gap:6px
      - span — type 18px / 600 / -0.04em / rgb(251,251,251)
          text: "roars"
      - img — w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
    - span — type 62px / 600 / 62px / -0.04em / rgb(251,251,251)
        text: "Approach"
    - span — type 14px / 500 / 20px / -0.06em / rgb(255,255,255)  |  opacity:.89
        text: "We start with what’s brokenin your business."
      - br
  - div — border-top:1px solid rgba(255,255,255,.2); display:flex; flex-direction:column; gap:8px
    - span — type 13px / 600 / -0.06em / rgba(255,255,255,.5)
        text: "One process, four phases"
    - div — type 15px / 500 / -0.04em / rgba(255,255,255,.8)  |  display:flex; gap:8px 22px
      - span
          text: "Explore"
        - span — type rgba(255,255,255,.45)
            text: "01"
      - span
          text: "Define"
        - span — type rgba(255,255,255,.45)
            text: "02"
      - span
          text: "Ideate"
        - span — type rgba(255,255,255,.45)
            text: "03"
      - span
          text: "Transform"
        - span — type rgba(255,255,255,.45)
            text: "04"

### M2 section
padding: 48px 20px 56px · background: #fff · layout: flex column gap 22px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Method"
- span — type 52px / 600 / 52px / -0.05em / rgb(36,36,36)
    text: "problem first"
- span — type 19px / 500 / 28px / -0.04em / rgb(20,20,20)
    text: "At Roars, we don’t start with screens. We start with what’s broken in your business."
- span — type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "Then we design, build, and scale products that actually move metrics."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:6px
  - span — type 17px / 600 / -0.05em / rgb(107,107,107)
      text: "The process, end to end"
  - span — type 17px / 500 / -0.04em / rgba(20,20,20,.62)
      text: "problem ↓ performance"

### M3 section
padding: 0 20px 56px · background: #fff · layout: flex column gap —
- div — display:flex; flex-direction:column; gap:14px; padding:0 0 40px 26px
  - span — l:-8px t:2px w:15px h:15px  |  background:#fff; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "01"
  - span — type 46px / 600 / 48px / -0.05em / rgb(36,36,36)
      text: "Explore"
  - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
      text: "Understanding your customers, business, and where you’re losing opportunity"
  - span — type 15px / 500 / 24px / -0.04em / rgba(20,20,20,.8)
      text: "Conduct focused interviews to uncover real customer behavior, not assumptions. Analyze how users currently interact with your product or service. Identify gaps, friction points, and missed opportunities in your existing experience. Map where your business can create more value through better journeys or new offerings."
  - div — display:flex; gap:8px
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "PEOPLE"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "STRATEGY"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "INTERACTION"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "TECHNOLOGY"
- div — display:flex; flex-direction:column; gap:14px; padding:0 0 40px 26px
  - span — l:-8px t:2px w:15px h:15px  |  background:#fff; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "02"
  - span — type 46px / 600 / 48px / -0.05em / rgb(36,36,36)
      text: "Define"
  - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
      text: "Aligning insights into clear product direction and priorities."
  - span — type 15px / 500 / 24px / -0.04em / rgba(20,20,20,.8)
      text: "Translate research into actionable insights that guide decisions. Define the problems worth solving based on impact and feasibility. Align business goals with user needs and product direction. Prioritize features and opportunities to avoid unnecessary complexity."
  - div — display:flex; gap:8px
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "CUSTOMER"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "BUSINESS"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "OBJECTIVES"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "INSIGHT"
- div — display:flex; flex-direction:column; gap:14px; padding:0 0 40px 26px
  - span — l:-8px t:2px w:15px h:15px  |  background:#fff; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "03"
  - span — type 46px / 600 / 48px / -0.05em / rgb(36,36,36)
      text: "Ideate"
  - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
      text: "Exploring solutions and validating ideas before building."
  - span — type 15px / 500 / 24px / -0.04em / rgba(20,20,20,.8)
      text: "Generate multiple solution directions based on defined problems. Create quick prototypes to visualize and test concepts early. Gather feedback to refine ideas and remove weak assumptions. Iterate rapidly to arrive at solutions that are both usable and viable."
  - div — display:flex; gap:8px
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "HYPOTHESIS"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "DESIGN"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "TEST"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "EVALUATE"
- div — display:flex; flex-direction:column; gap:14px; padding:0 0 10px 26px
  - span — l:-8px t:2px w:15px h:15px  |  background:#fff; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "04"
  - span — type 46px / 600 / 48px / -0.05em / rgb(36,36,36)
      text: "Transform"
  - span — type 18px / 500 / 26px / -0.04em / rgba(20,20,20,.78)
      text: "Designing, building, and improving products that perform."
  - span — type 15px / 500 / 24px / -0.04em / rgba(20,20,20,.8)
      text: "Translate validated ideas into scalable product experiences. Design and develop with a focus on usability, speed, and clarity. Continuously test and optimize based on real user behavior. Evolve the product to improve performance, engagement, and growth."
  - div — display:flex; gap:8px
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "GUIDE"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "IMPLEMENT"
    - span — type 12px / 600 / -0.02em / rgb(20,20,20)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(20,20,20,.16); padding:7px 13px
        text: "SUPPORT"

### M4 section
padding: 48px 20px 56px · background: rgb(245,245,245) · layout: flex column gap 26px
- div — display:flex; flex-direction:column; gap:10px
  - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Track record"
- span — type 38px / 600 / 44px / -0.05em / rgb(36,36,36)
    text: "Practised since 2005"
- span — type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "The same four phases, run for startups and enterprises across five countries."
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:8px
  - span — type 62px / 600 / 64px / -0.05em / rgb(36,36,36)
      text: "20"
    - span — type 28px / 500
        text: "+"
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Years in product development"
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:8px
  - span — type 62px / 600 / 64px / -0.05em / rgb(36,36,36)
      text: "250"
    - span — type 28px / 500
        text: "+"
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Projects delivered"
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:8px
  - span — type 62px / 600 / 64px / -0.05em / rgb(36,36,36)
      text: "96"
    - span — type 24px / 700
        text: "%"
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Returning customers"

### M5 section
padding: 48px 20px 56px · background: #fff · layout: flex column gap 22px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "Where we apply it"
- span — type 48px / 600 / 52px / -0.05em / rgb(36,36,36)
    text: "what we build"
- span — type 16px / 500 / 23px / -0.04em / rgba(20,20,20,.62)
    text: "Five practices, one process. Every engagement runs Explore through Transform."
- div — display:flex; flex-direction:column
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; align-items:center; gap:14px; padding:16px 0  |  href="https://www.roarsinc.com/s/product-development-company/"
    - span — w:22px  |  type 12px / 500 / -0.04em / rgb(145,145,145)
        text: "01"
    - span — type 24px / 600 / 30px / -0.05em / rgb(36,36,36)  |  flex:1
        text: "Product Development"
    - span — type 20px / rgba(20,20,20,.45)
        text: "→"
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; align-items:center; gap:14px; padding:16px 0  |  href="https://www.roarsinc.com/s/user-experience-design-agency/"
    - span — w:22px  |  type 12px / 500 / -0.04em / rgb(145,145,145)
        text: "02"
    - span — type 24px / 600 / 30px / -0.05em / rgb(36,36,36)  |  flex:1
        text: "User Experience Design"
    - span — type 20px / rgba(20,20,20,.45)
        text: "→"
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; align-items:center; gap:14px; padding:16px 0  |  href="https://www.roarsinc.com/s/mobile-app-development/"
    - span — w:22px  |  type 12px / 500 / -0.04em / rgb(145,145,145)
        text: "03"
    - span — type 24px / 600 / 30px / -0.05em / rgb(36,36,36)  |  flex:1
        text: "Mobile App Development"
    - span — type 20px / rgba(20,20,20,.45)
        text: "→"
  - a — border-top:.5px solid rgba(153,152,149,.5); display:flex; align-items:center; gap:14px; padding:16px 0  |  href="https://www.roarsinc.com/s/mvp-development/"
    - span — w:22px  |  type 12px / 500 / -0.04em / rgb(145,145,145)
        text: "04"
    - span — type 24px / 600 / 30px / -0.05em / rgb(36,36,36)  |  flex:1
        text: "MVP Development"
    - span — type 20px / rgba(20,20,20,.45)
        text: "→"
  - a — border-top:.5px solid rgba(153,152,149,.5); border-bottom:.5px solid rgba(153,152,149,.5); display:flex; align-items:center; gap:14px; padding:16px 0  |  href="https://www.roarsinc.com/s/ai-automation-services/"
    - span — w:22px  |  type 12px / 500 / -0.04em / rgb(145,145,145)
        text: "05"
    - span — type 24px / 600 / 30px / -0.05em / rgb(36,36,36)  |  flex:1
        text: "AI Automation Services"
    - span — type 20px / rgba(20,20,20,.45)
        text: "→"

### M6 section (dark)
padding: 56px 20px 40px · background: rgb(11,11,11) · layout: flex column gap 34px
- img — l:0 t:0 w:100% h:100%  |  opacity:.55; transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
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
        - a — href="Roars v2 - Approach.dc.html"
            text: "Approach"
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
          text: "India · USA · UK · Belgium · Germany"
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "Built by"
      - span — type rgba(255,255,255,.8)
          text: "Roars Technologies"

## Behaviour + data (logic class, verbatim)
```js
class Component extends DCLogic {
  componentDidMount() {
    const H = 5545;
    const DARK = [[0, 780], [4440, H]];
    const SPINE = 1500; // vertical spine length in canvas px
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - innerHeight);
        const prog = Math.min(1, Math.max(0, scrollY / max));
        const onLight = !onDark;
        if (ring) {
          ring.style.background = 'conic-gradient(#FFD400 ' + prog.toFixed(4) + 'turn, rgba(255,212,0,.14) 0turn)';
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

    // the spine draws downward as the process section passes through the viewport
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
        const head = document.querySelector('[data-head]');
        if (head) {
          head.style.opacity = prog > 0.005 && prog < 0.995 ? '1' : '0';
          head.style.transform = 'translateY(' + px.toFixed(1) + 'px)';
        }
        const dots = [...document.querySelectorAll('[data-station]')];
        let last = -1;
        dots.forEach(d => { if (px >= +d.getAttribute('data-sy') - 2) last = +d.getAttribute('data-station'); });
        dots.forEach(dot => {
          const i = +dot.getAttribute('data-station');
          const on = px >= +dot.getAttribute('data-sy') - 2;
          dot.style.background = on ? '#FFD400' : 'rgb(255,255,255)';
          dot.style.boxShadow = 'inset 0 0 0 1.5px ' + (on ? '#FFD400' : 'rgba(20,20,20,.5)');
          dot.style.transform = last === i && i < 4 ? 'scale(1.22)' : 'scale(1)';
        });
      }

      if (reduce) return;
      document.querySelectorAll('[data-par]').forEach(el => {
        const f2 = parseFloat(el.getAttribute('data-par'));
        const rr = el.getBoundingClientRect();
        const off = ((rr.top + rr.height / 2) - innerHeight / 2) * f2;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    };

    // stat count-up
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
            const e = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(target * e);
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
          if (el.hasAttribute && (el.hasAttribute('data-par') || el.hasAttribute('data-track'))) return;
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

    this.logoIntro();
    this.counts();
    this.tint();
    if (!reduce) requestAnimationFrame(() => this.reveal());
    addEventListener('scroll', this.onScroll, { passive: true });

    this.mobileMotion = () => {
      const mob = document.querySelector('[data-mobile]');
      if (!mob || this.mio) return;
      const items = [...mob.querySelectorAll('[data-mrev]')];
      if (!reduce) {
        items.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'transform .7s cubic-bezier(.22,.68,.28,1), opacity .6s ease';
        });
        this.mio = new IntersectionObserver(ens => {
          ens.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.style.opacity = '1';
            el.style.transform = 'none';
            const dot = el.querySelector('[data-mdot]');
            if (dot) { dot.style.background = '#FFD400'; dot.style.boxShadow = 'inset 0 0 0 1.5px rgba(20,20,20,.15)'; }
            this.mio.unobserve(el);
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
        items.forEach(el => this.mio.observe(el));
      }
      const bar = document.querySelector('[data-topbar-m]');
      const darks = [...mob.querySelectorAll('[data-mdark]')];
      this.mtint = () => {
        if (!bar || !this.mq.matches) return;
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

    this.fit();
    this.motion();
    addEventListener('resize', this.fit);
    const wrap = document.querySelector('[data-fit]');
    if (wrap && window.ResizeObserver) {
      this.ro = new ResizeObserver(() => { this.fit(); this.motion(); });
      this.ro.observe(wrap);
    }
  }

  componentWillUnmount() {
    removeEventListener('resize', this.fit);
    if (this.mtint) removeEventListener('scroll', this.mtint);
    if (this.mio) this.mio.disconnect();
    if (this.mio2) this.mio2.disconnect();
    if (this.mextra) removeEventListener('scroll', this.mextra);
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
    removeEventListener('scroll', this.onScroll);
    if (this.io) this.io.disconnect();
    if (this.io2) this.io2.disconnect();
    if (this.ro) this.ro.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}
```