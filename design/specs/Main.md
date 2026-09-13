# Main — element spec

Source prototype: `design/Roars v2 - Main.dc.html`  ·  desktop canvas 1440px wide, all desktop elements absolutely positioned inside their section (coordinates are relative to the section unless noted).

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
        - span — l:0 t:71px w:160px h:40px  |  type 14px / 500 / 20px / -0.04em / rgb(255,255,255)  |  opacity:.75
            text: "Reach out to start your project"
        - div — l:0 t:0 w:285px h:42px
          - div — l:0 t:0 w:42px h:42px  |  background:rgb(255,255,255); border-radius:60px; overflow:hidden
            - img — l:5px t:5px w:32px h:32px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
          - a — l:42px t:0 w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="Roars v2 - Contact.dc.html"
            - span — l:18px t:11px  |  type 12px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
                text: "Contact Now"
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

### Industries  (top 5725px, height 1060px)
background: rgb(245,245,245)  ·  overflow: hidden

- span — l:503px t:121px  |  type 124px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "Industries"
- div — l:42px t:300px w:200px h:120px  |  overflow:hidden
  - div — l:0 t:0 w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - span — l:0 t:20px  |  type 14px / 500 / 21px / -0.06em / rgb(0,0,0)  |  white-space:nowrap
      text: "Eight sectors"
  - span — l:0 t:40px  |  type 14px / 400 / 21px / -0.06em / rgb(153,152,149)  |  white-space:nowrap
      text: "Where we work"
- span — l:503px t:296px w:756px h:70px  |  type 22px / 500 / 32px / -0.04em / rgb(2,2,2)
    text: "We build in sectors we already understand, so the discovery work starts from domain knowledge rather than from scratch."
- a — l:503px t:470px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/food-restaurant-app-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "R"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Restaurant"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:733px t:470px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/on-demand-fitness-app-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "F"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Fitness"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:963px t:470px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/retail-ecommerce-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "e"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "eCommerce"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:1193px t:470px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/concierge-app-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "C"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Concierge"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:503px t:670px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/travel-and-hospitality-app-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "T"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Travel"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:733px t:670px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/logistics-transportation-app-development/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "L"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Logistics"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:963px t:670px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/saas-application-development-services/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "S"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "SaaS"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- a — l:1193px t:670px w:210px h:170px  |  display:block  |  href="https://www.roarsinc.com/industries/healthcare-app-development-company/"
  - div — l:0 t:0 w:210px h:1px  |  background:rgba(153,152,149,.7)
  - div — l:0 t:28px w:64px h:64px  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center  |  HOVER { box-shadow:inset 0 0 0 1.5px #FFD400;background:rgba(255,212,0,.14) }
    - span — type 22px / 600 / 1 / -0.05em / rgb(36,36,36)
        text: "H"
  - span — l:76px t:46px w:134px h:28px  |  type 22px / 600 / 28px / -0.05em / rgb(36,36,36)
      text: "Healthcare"
  - span — l:76px t:74px  |  type 12px / 500 / 19px / -0.04em / rgb(153,152,149)  |  white-space:nowrap
      text: "View sector"
- div — l:503px t:920px w:436px h:47px  |  overflow:hidden
  - img — l:0 t:15px w:17px h:17px  |  src="assets/star-3.svg"
  - img — l:22px t:15px w:17px h:17px  |  src="assets/star-5.svg"
  - a — l:232px t:0 w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Projects.dc.html"
    - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
        text: "See the work"
    - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%

### Insights  (top 6785px, height 1010px)
background: rgb(255,255,255)  ·  overflow: hidden

- span — l:503px t:121px  |  type 124px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "Insights"
- div — l:503px t:299px w:756px h:113px  |  overflow:hidden
  - img — l:0 t:7px w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
  - span — l:0 t:60px  |  type 14px / 600 / 20px / -0.05em / rgb(22,22,22)  |  white-space:nowrap
      text: "Riinkesh A Sshah"
  - span — l:0 t:80px  |  type 14px / 500 / 20px / -0.05em / rgb(145,144,142)  |  white-space:nowrap
      text: "Founder"
  - span — l:232px t:0 w:524px h:113px  |  type 22px / 500 / 32px / -0.04em / rgb(2,2,2)
      text: "We have a lot to say about product work — how we approach the process, what the AI shift actually changes, and the nuances of building for founders."
- sc-for [{{ insights }}]
  - a — l:{{ i.x }} t:525px w:435px h:265px  |  display:block  |  href="Roars v2 - Insight.dc.html"
    - div — l:234px t:0 w:138px h:138px  |  background-color:rgb(217,217,217); background-image:{{ i.bg }}; border-radius:50%
    - div — l:2px t:174px w:433px h:1px  |  background:rgba(153,152,149,.7)
    - span — l:0 t:187px  |  type 42px / 600 / 43px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
        text: "{{ i.day }}"
    - span — l:55px t:188px  |  type 18px / 500 / 43px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
        text: "{{ i.month }}"
    - span — l:232px t:199px w:195px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(20,20,20)
        text: "{{ i.title }}"
- div — l:503px t:884px w:436px h:47px  |  overflow:hidden
  - img — l:0 t:15px w:17px h:17px  |  src="assets/star-3.svg"
  - img — l:22px t:15px w:17px h:17px  |  src="assets/star-5.svg"
  - a — l:232px t:0 w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Insights.dc.html"
    - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
        text: "All Insights"
    - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%

### FAQ  (top 7795px, height 1122px)
background: rgb(245,245,245)  ·  overflow: hidden

- span — l:503px t:121px  |  type 124px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "FAQ"
- div — l:42px t:308px w:195px h:180px  |  overflow:hidden
  - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
  - span — l:0 t:52px  |  type 12px / 500 / 19px / -0.06em / rgb(0,0,0)  |  white-space:nowrap
      text: "Riinkesh A Sshah"
  - span — l:0 t:70px  |  type 12px / 400 / 19px / -0.06em / rgb(153,152,149)  |  white-space:nowrap
      text: "CEO / Founder"
  - span — l:0 t:114px w:195px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(20,20,20)
      text: "Behind every project: the thinking that fuels how Roars builds."
- div — l:503px t:308px w:901px h:504px  |  overflow:hidden
  - sc-for [{{ faqs }}]
    - div — l:0 t:{{ f.top }} w:901px h:{{ f.h }}
      - div — l:0 t:0 w:901px h:{{ f.ruleH }}  |  background:{{ f.ruleColor }}
      - span — l:2px t:{{ f.qTop }} w:700px  |  type {{ f.qSize }} / {{ f.qWeight }} / 22px / -0.06em / rgb(20,20,20)
          text: "{{ f.q }}"
      - sc-if [{{ f.open }}]
        - span — l:2px t:75px w:613px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(20,20,20)
            text: "{{ f.a }}"
      - div — l:863px t:{{ f.iconTop }} w:36px h:36px  |  background:rgb(255,255,255); border-radius:60px
        - span — l:0 t:0 w:36px h:36px  |  type {{ f.iconSize }} / 300 / 1 / -0.05em / rgb(0,0,0)  |  display:flex; align-items:center; justify-content:center
            text: "{{ f.icon }}"
- div — l:505px t:918px w:434px h:66px  |  overflow:hidden
  - span — l:0 t:0 w:166px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(20,20,20)
      text: "Didn’t find the answer? Ask us about our services!"
  - a — l:230px t:10px w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
    - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
        text: "Ask your Question"
    - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%

### Footer  (top 8917px, height 1105px)
background: rgb(11,11,11)  ·  overflow: hidden

- img — l:-37px t:-10px w:1672.305px h:1115.006px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:44px t:61px w:1073px h:192px  |  overflow:hidden
  - img — l:0 t:0 w:21px h:21px  |  filter:invert(1)  |  src="assets/mark.svg"  |  alt="Roars"
  - div — l:458px t:5px w:384px h:187px  |  overflow:hidden
    - span — l:0 t:0 w:384px h:120px  |  type 22px / 500 / 30px / -0.04em / rgb(147,147,147)
        text: "Find how we can help you get from A to B. Our love for innovation design and technology is evident in all our work. No detail is too small."
    - div — l:0 t:145px w:170px h:42px
      - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - span — l:56px t:3px  |  type 12px / 400 / 19px / -0.06em / rgba(255,255,255,.9)  |  white-space:nowrap
          text: "Riinkesh A Sshah"
      - span — l:56px t:21px  |  type 12px / 400 / 19px / -0.06em / rgba(255,255,255,.5)  |  white-space:nowrap
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
  - div — l:459px t:58px w:200px h:200px  |  type 24px / 600 / 40px / -0.06em / rgba(255,255,255,.9)  |  display:flex; flex-direction:column
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
        text: "USA · UK · India"
    - span — l:926px t:3px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Built by"
    - span — l:926px t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "Roars Technologies"

### People say  (top 4679px, height 1046px)
background: rgb(255,255,255)  ·  overflow: hidden

- span — l:503px t:132px  |  type 124px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "People say"
- span — l:506px t:239px  |  type 42px / 600 / 43px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "4.9/5"
- div — l:39px t:329px w:1365px h:525px  |  overflow:hidden
  - div — l:695px t:0 w:435px h:336px  |  overflow:hidden
    - img — l:0 t:0 w:80px h:80px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
    - span — l:2px t:95px  |  type 14px / 600 / 19px / -0.06em / rgb(31,31,31)  |  white-space:nowrap
        text: "Jayeis Sonill"
    - span — l:2px t:114px  |  type 14px / 500 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
        text: "CEO, Aum Investment"
    - div — l:2px t:152px w:433px h:1.5px  |  background:rgba(153,152,149,.7)
    - div — l:1px t:176px  |  display:flex; gap:4px
      - img — w:14px h:14px  |  src="assets/star-5.svg"
      - img — w:14px h:14px  |  src="assets/star-5.svg"
      - img — w:14px h:14px  |  src="assets/star-5.svg"
      - img — w:14px h:14px  |  src="assets/star-5.svg"
      - img — w:14px h:14px  |  src="assets/star-5.svg"
    - span — l:0 t:206px w:408px h:160px  |  type 24px / 500 / 32px / -0.04em / rgb(0,0,0)
        text: "Roars has consistently positioned themselves at the forefront of innovation and technology. They understand business needs and craft technologies to address them."
  - div — l:349px t:264px w:339px h:261px  |  overflow:hidden
    - img — l:0 t:0 w:65px h:65px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"
    - span — l:2px t:74px  |  type 13px / 600 / 19px / -0.06em / rgb(31,31,31)  |  white-space:nowrap
        text: "James Hadley"
    - span — l:2px t:90px  |  type 13px / 500 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
        text: "CEO, Simthing New, LLC"
    - div — l:2px t:117px w:337px h:1.5px  |  background:rgba(153,152,149,.7)
    - div — l:0px t:138px  |  display:flex; gap:4px
      - img — w:12px h:12px  |  src="assets/star-5.svg"
      - img — w:12px h:12px  |  src="assets/star-5.svg"
      - img — w:12px h:12px  |  src="assets/star-5.svg"
      - img — w:12px h:12px  |  src="assets/star-5.svg"
      - img — w:12px h:12px  |  src="assets/star-5.svg"
    - span — l:0 t:162px w:304px h:119px  |  type 18px / 500 / 25px / -0.04em / rgb(0,0,0)
        text: "I was pleased with the deliverables. I was able to see and understand the efforts required to scale the solution in development."
  - div — l:0 t:108px w:292px h:225px  |  overflow:hidden
    - img — l:0 t:0 w:57px h:57px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
    - span — l:1px t:64px  |  type 12px / 600 / 19px / -0.06em / rgb(31,31,31)  |  white-space:nowrap
        text: "Avinash Kumar"
    - span — l:1px t:78px  |  type 12px / 500 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
        text: "Project Manager, Roars"
    - div — l:1px t:100px w:291px h:1.5px  |  background:rgba(153,152,149,.7)
    - div — l:0px t:120px  |  display:flex; gap:3px
      - img — w:11px h:11px  |  src="assets/star-5.svg"
      - img — w:11px h:11px  |  src="assets/star-5.svg"
      - img — w:11px h:11px  |  src="assets/star-5.svg"
      - img — w:11px h:11px  |  src="assets/star-5.svg"
      - img — w:11px h:11px  |  src="assets/star-5.svg"
    - span — l:0 t:142px w:239px h:102px  |  type 15px / 500 / 21px / -0.04em / rgb(0,0,0)
        text: "From discovery to launch, the team brought our platform to life with precision. A genuine product partner."
  - div — l:1159px t:230px w:206px h:156px  |  overflow:hidden
    - img — l:0 t:0 w:40px h:40px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Khusboo.webp"
    - span — l:1px t:44px  |  type 10px / 600 / 19px / -0.06em / rgb(31,31,31)  |  white-space:nowrap
        text: "Khusboo Panchal"
    - span — l:1px t:55px  |  type 10px / 500 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
        text: "Digital Marketing"
    - div — l:0 t:71px w:206px h:1px  |  background:rgba(153,152,149,.7)
    - div — l:0px t:85px  |  display:flex; gap:2px
      - img — w:9px h:9px  |  src="assets/star-5.svg"
      - img — w:9px h:9px  |  src="assets/star-5.svg"
      - img — w:9px h:9px  |  src="assets/star-5.svg"
      - img — w:9px h:9px  |  src="assets/star-5.svg"
      - img — w:9px h:9px  |  src="assets/star-5.svg"
    - span — l:0 t:102px w:178px h:70px  |  type 12px / 500 / 17px / -0.04em / rgb(0,0,0)
        text: "Fast, smart and beautiful. We will be back for round two soon."
- div — l:386px t:880px w:190px h:24px
  - span — l:0 t:8px w:8px h:8px  |  background:rgba(0,0,0,.4); border-radius:100px
  - span — l:20px t:0  |  type 16px / 500 / 24px / -0.05em / rgba(0,0,0,.4)
      text: "Prev."
  - span — l:128px t:0  |  type 16px / 500 / 24px / -0.05em / rgb(8,8,8)
      text: "Next"
  - span — l:182px t:8px w:8px h:8px  |  background:rgb(8,8,8); border-radius:100px
- div — l:737px t:866px w:433px h:95px  |  overflow:hidden
  - img — l:0 t:3px w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px rgb(255,255,255); object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"
  - img — l:32px t:3px w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px rgb(255,255,255); object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"
  - img — l:64px t:3px w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px rgb(255,255,255); object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Khusboo.webp"
  - div — l:96px t:3px w:42px h:42px  |  background:rgb(20,20,20); border-radius:60px; box-shadow:0 0 0 3px rgb(255,255,255)
    - span — l:0 t:0 w:42px h:42px  |  type 15px / 600 / -0.04em / rgb(255,255,255)  |  display:flex; align-items:center; justify-content:center
        text: "37"
  - span — l:150px t:6px w:70px  |  type 13px / 500 / 18px / -0.05em / rgb(71,71,71)
      text: "reviews4.9 average"
    - br
  - a — l:229px t:0 w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
    - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
        text: "Leave a Review"
    - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%

### Projects  (top 3339px, height 1340px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:-78.809px t:0 w:1553.732px h:1605px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:501px t:129px w:489px h:251px  |  overflow:hidden
  - span — l:0 t:0 w:459px h:86px  |  type 124px / 600 / 86px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
      text: "Projects"
  - span — l:5px t:109px  |  type 40px / 600 / 43px / -0.05em / rgb(236,234,228)  |  white-space:nowrap
      text: "250"
  - span — l:73px t:112px  |  type 22px / 500 / 43px / -0.05em / rgb(236,234,228)
      text: "+"
  - div — l:231px t:147px w:258px h:104px  |  overflow:hidden
    - span — l:0 t:0 w:230px h:112px  |  type 16px / 500 / 28px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
        text: "Recent ProjectsProduct DevelopmentUI/UX and Product DesignMobile and AI"
      - br
      - br
      - br
    - div — l:242px t:17px w:16px h:84px  |  display:flex; flex-direction:column; justify-content:space-between
      - span — w:16px h:1px  |  background:rgb(255,255,255); display:block
      - span — w:16px h:1px  |  background:rgb(255,255,255); display:block
      - span — w:16px h:1px  |  background:rgb(255,255,255); display:block
      - span — w:16px h:1px  |  background:rgb(255,255,255); display:block
- div — l:39px t:457px w:1363px h:584px  |  overflow:hidden
  - div — l:0 t:0 w:1363px h:580px  |  overflow:hidden  |  data-slide-a="1"
    - div — l:0 t:3px w:86px h:68px  |  overflow:hidden
      - span — l:0 t:0  |  type 24px / 500 / 19px / -0.06em / rgb(251,251,251)  |  white-space:nowrap
          text: "02 Jul"
      - div — l:1px t:38px w:85px h:1.25px  |  background:rgba(153,152,149,.7)
      - span — l:0 t:49px  |  type 14px / 500 / 19px / -0.06em / rgb(153,152,149)  |  white-space:nowrap
          text: "2025"
    - a — l:120px t:1px w:1129px h:579px  |  background:rgb(30,30,30); border-radius:12px; display:block; overflow:hidden  |  href="Roars  v2 - Project Detail.dc.html"
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/07/parqly-parking-mobile-app.jpg"  |  alt="Parqly"
    - div — l:1277px t:0 w:86px h:89px  |  overflow:hidden
      - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
      - img — l:0 t:47px w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"
    - span — l:696px t:476px w:400px h:42px  |  type 36px / 600 / 42px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
        text: "Parqly."
  - div — l:0 t:0 w:1363px h:580px  |  overflow:hidden  |  data-slide="1"
    - div — l:0 t:3px w:86px h:68px  |  overflow:hidden
      - span — l:0 t:0  |  type 24px / 500 / 19px / -0.06em / rgb(251,251,251)  |  white-space:nowrap
          text: "15 Oct"
      - div — l:1px t:38px w:85px h:1.25px  |  background:rgba(153,152,149,.7)
      - span — l:0 t:49px  |  type 14px / 500 / 19px / -0.06em / rgb(153,152,149)  |  white-space:nowrap
          text: "2026"
    - a — l:120px t:1px w:1129px h:579px  |  background:rgb(30,30,30); border-radius:12px; display:block; overflow:hidden  |  href="Roars  v2 - Project Detail.dc.html"
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/02/Snowman-Logistics-app-solution.jpg"  |  alt="Snowman Logistics"
    - div — l:1277px t:0 w:86px h:89px  |  overflow:hidden
      - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"
      - img — l:0 t:47px w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
    - span — l:696px t:476px w:400px h:42px  |  type 36px / 600 / 42px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
        text: "Snowman Logistics."
- div — l:503px t:1148px w:430px h:47px  |  overflow:hidden
  - img — l:0 t:16px w:17px h:17px  |  filter:invert(1)  |  src="assets/star-3.svg"
  - img — l:23px t:16px w:17px h:17px  |  filter:invert(1)  |  src="assets/star-5.svg"
  - a — l:226px t:0 w:204px h:47px  |  background:rgb(255,255,255); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Projects.dc.html"
    - span — l:24px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(0,0,0)  |  white-space:nowrap
        text: "All Projects"
    - span — l:166px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(0,0,0); border-radius:50%

### Services  (top 1979px, height 1360px)
background: rgb(245,245,245)  ·  overflow: hidden

- span — l:503px t:121px  |  type 124px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "Services"
- div — l:38px t:306px w:1364px h:647px  |  overflow:hidden
  - div — l:0 t:0 w:1362px h:195px  |  overflow:hidden
    - div — l:0 t:0 w:16px h:1.5px  |  background:rgba(153,152,149,.7)
    - div — l:464px t:0 w:898px h:1.5px  |  background:rgba(153,152,149,.7)
    - span — l:2px t:25px  |  type 20px / 600 / 19px / -0.04em / rgb(17,17,17)
        text: "/01"
    - span — l:464px t:21px w:221px h:80px  |  type 32px / 600 / 40px / -0.04em / rgb(0,0,0)
        text: "Product Development"
    - div — l:705px t:30px w:178px h:138px  |  overflow:hidden
      - div — l:0 t:0 w:138px h:138px  |  background:rgb(217,217,217); border-radius:50%; overflow:hidden
        - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2023/06/produc-consultant.jpg"
      - div — l:141px t:5px w:37px h:37px  |  background:rgb(102,102,102); border-radius:50%; overflow:hidden
        - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/04/beautiful-experience.jpg"
    - div — l:928px t:26px w:200px h:169px
      - span — l:0 t:0 w:200px  |  type 16px / 500 / 23px / -0.05em / rgb(14,14,14)
          text: "We take products from idea to launch — strategy, design and engineering in one team"
      - span — l:0 t:131px w:176px h:38px  |  type 14px / 500 / 19px / -0.06em / rgb(71,71,71)  |  opacity:.8
          text: "Discovery, Architecture, Engineering, Launch"
    - div — l:1159px t:26px w:160px h:100px  |  type 16px / 600 / 22px / -0.04em / rgb(0,0,0)  |  display:flex; flex-direction:column; gap:10px
      - span
          text: "Snowman Logistics"
      - span
          text: "Parqly"
      - span — type 500 / rgb(145,144,142)
          text: "+ 11"
    - div — l:1326px t:29px w:36px h:36px  |  background:rgb(255,255,255); border-radius:60px
      - span — l:0 t:0 w:36px h:36px  |  type 26px / 300 / 1 / -0.05em / rgb(0,0,0)  |  display:flex; align-items:center; justify-content:center
          text: "–"
  - div — l:0 t:235px w:904px h:119px  |  overflow:hidden
    - div — l:0 t:0 w:899px h:1px  |  background:rgba(153,152,149,.7)
    - span — l:0 t:27px  |  type 24px / 600 / 32px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
        text: "UI/UX and Product Design"
    - span — l:465px t:27px w:191px h:92px  |  type 16px / 500 / 23px / -0.06em / rgb(2,2,2)
        text: "Human-centered design that turns complex ideas into easy, elegant user experiences"
    - div — l:697px t:27px w:206px h:32px
      - span — l:0 t:0  |  type 32px / 600 / 32px / -0.05em / rgb(0,0,0)
          text: "40"
      - span — l:56px t:7px  |  type 14px / 500 / 19px / -0.05em / rgb(0,0,0)  |  opacity:.9
          text: "Projects"
    - div — l:863px t:27px w:36px h:36px  |  background:rgb(255,255,255); border-radius:60px
      - span — l:0 t:0 w:36px h:36px  |  type 28px / 300 / 1 / -0.05em / rgb(0,0,0)  |  display:flex; align-items:center; justify-content:center
          text: "+"
  - div — l:463px t:397px w:901px h:96px  |  overflow:hidden
    - div — l:2px t:0 w:898px h:1px  |  background:rgba(153,152,149,.7)
    - span — l:0 t:27px  |  type 24px / 600 / 32px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
        text: "Mobile App Development"
    - span — l:465px t:27px w:168px h:69px  |  type 16px / 500 / 23px / -0.06em / rgb(2,2,2)
        text: "Native and cross-platform apps built to scale with your user base"
    - div — l:697px t:27px w:206px h:32px
      - span — l:0 t:0  |  type 32px / 600 / 32px / -0.05em / rgb(0,0,0)
          text: "35"
      - span — l:56px t:7px  |  type 14px / 500 / 19px / -0.05em / rgb(0,0,0)  |  opacity:.9
          text: "Projects"
    - div — l:863px t:27px w:36px h:36px  |  background:rgb(255,255,255); border-radius:60px
      - span — l:0 t:0 w:36px h:36px  |  type 28px / 300 / 1 / -0.05em / rgb(0,0,0)  |  display:flex; align-items:center; justify-content:center
          text: "+"
  - div — l:1px t:551px w:902px h:96px  |  overflow:hidden
    - div — l:0 t:0 w:898px h:1px  |  background:rgba(153,152,149,.7)
    - span — l:0 t:27px  |  type 24px / 600 / 32px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
        text: "AI Automation"
    - span — l:464px t:27px w:177px h:69px  |  type 16px / 500 / 23px / -0.06em / rgb(2,2,2)
        text: "Workflow automation and AI features wired into your product and operations."
    - div — l:697px t:27px w:206px h:32px
      - span — l:0 t:0  |  type 32px / 600 / 32px / -0.05em / rgb(0,0,0)
          text: "17"
      - span — l:56px t:7px  |  type 14px / 500 / 19px / -0.05em / rgb(0,0,0)  |  opacity:.9
          text: "Projects"
    - div — l:863px t:27px w:36px h:36px  |  background:rgb(255,255,255); border-radius:60px
      - span — l:0 t:0 w:36px h:36px  |  type 28px / 300 / 1 / -0.05em / rgb(0,0,0)  |  display:flex; align-items:center; justify-content:center
          text: "+"
- div — l:503px t:1025px w:668px h:128px  |  overflow:hidden
  - span — l:0 t:0 w:356px h:128px  |  type 22px / 500 / 32px / -0.04em / rgb(0,0,0)
      text: "Roars helps founders stand out with bold product design and smart digital solutions. We mix strategy, creativity and technology."
  - a — l:464px t:2px w:204px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
    - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
        text: "Start a Project"
    - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — l:177px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%

### Header  (top 0, height 900px)
background: rgb(255,255,255)  ·  overflow: hidden

- img — l:433px t:-106px w:1553.732px h:1035.948px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:330px t:0 w:190px h:900px  |  background:linear-gradient(90deg,rgb(255,255,255) 0%,rgba(255,255,255,.92) 32%,rgba(255,255,255,0) 100%)
- div — l:-130px t:367px w:523px h:62px  |  overflow:hidden
  - div — l:23px t:12px w:471px h:1px  |  background:rgb(23,23,23); transform:rotate(2.7deg)
  - div — l:0 t:54px w:523px h:1px  |  background:rgb(23,23,23); transform:rotate(-2.8deg)
  - img — l:106px t:54px w:48px h:7px  |  transform:rotate(181.3deg)  |  src="assets/asteroids.svg"
  - img — l:124px t:0 w:107px h:10px  |  transform:rotate(6.2deg)  |  src="assets/asteroids-2.svg"
- div — l:395px t:258px w:89px h:78px  |  overflow:hidden
  - div — l:0 t:3px w:75px h:75px  |  background:radial-gradient(52.9% 52.9% at 90.36% 15.66%, rgb(78,73,72) 0%, rgb(0,0,0) 100%); border-radius:60px
  - img — l:3px t:26px w:29px h:5px  |  opacity:.78; filter:invert(1)  |  src="assets/asteroids-2.svg"
  - div — l:75px t:0 w:14px h:14px  |  background:rgb(6,6,6); border-radius:60px
- div — l:488.849px t:477px w:682.151px h:323px  |  overflow:hidden
  - div — l:0 t:75px w:568.151px h:186px  |  overflow:hidden
    - img — l:1px t:51px w:73.4px h:9px  |  transform:rotate(6.7deg); filter:invert(1)  |  src="assets/union.svg"
    - span — l:13.151px t:0 w:555px h:186px  |  type 212px / 600 / 86px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
        text: "roars"
    - div — l:521.151px t:19px w:31px h:31px  |  background:#FFD400; border-radius:60px; overflow:hidden
      - span — l:0 t:0 w:31px h:31px  |  type 13px / 600 / 1 / 0 / rgb(31,31,31)  |  display:flex; align-items:center; justify-content:center
          text: "®"
  - span — l:246.151px t:281px w:220px h:48px  |  type 16px / 500 / 24px / -0.03em / rgb(255,255,255)
      text: "Product Developmentfor Startups & SMEs"
    - br
  - span — l:479.151px t:0 w:210px h:64px  |  type 24px / 500 / 32px / -0.02em / rgb(255,255,255)
      text: "Space of ProductSolutions"
    - br
- div — l:39px t:600px w:249px h:96px  |  overflow:hidden
  - div — l:0 t:0 w:200px h:96px  |  type 14px / 600 / 24px / -0.05em / rgb(0,0,0)  |  white-space:nowrap
      text: "Product DevelopmentUI/UX and Product DesignMobile App DevelopmentAI Automation"
    - br
    - br
    - br
  - div — l:233px t:13px w:16px h:73px  |  display:flex; flex-direction:column; justify-content:space-between
    - span — w:16px h:1px  |  background:rgb(0,0,0); display:block
    - span — w:16px h:1px  |  background:rgb(0,0,0); display:block
    - span — w:16px h:1px  |  background:rgb(0,0,0); display:block
    - span — w:16px h:1px  |  background:rgb(0,0,0); display:block

### About  (top 900px, height 1079px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:42px t:139px w:52px h:22px
  - img — l:0 t:0 w:20px h:20px  |  src="assets/star-3.svg"
  - img — l:26px t:0 w:20px h:20px  |  src="assets/star-5.svg"
- div — l:39px t:139px w:1362px h:362px  |  overflow:hidden
  - div — l:463px t:0 w:899px h:138px  |  overflow:hidden
    - div — l:0 t:0 w:435px h:138px  |  overflow:hidden
      - span — l:2px t:0  |  type 22px / 600 / 19px / -0.06em / rgb(0,0,0)  |  white-space:nowrap
          text: "Projects Delivered"
      - div — l:2px t:43px w:433px h:1.5px  |  background:rgba(153,152,149,.7)
      - span — l:0 t:54px  |  type 84px / 600 / 84px / -0.05em / rgb(0,0,0)  |  white-space:nowrap
          text: "250"
      - span — l:152px t:71px w:27px h:31px  |  type 36px / 500 / 31px / -0.05em / rgb(0,0,0)
          text: "+"
      - span — l:235px t:73px w:170px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(71,71,71)  |  opacity:.78
          text: "Products launched successfully since 2005"
    - div — l:464px t:0 w:435px h:135px  |  overflow:hidden
      - span — l:2px t:0  |  type 22px / 600 / 19px / -0.06em / rgb(0,0,0)  |  white-space:nowrap
          text: "Returning Customers"
      - div — l:2px t:43px w:433px h:1.5px  |  background:rgba(153,152,149,.7)
      - span — l:0 t:54px  |  type 84px / 600 / 84px / -0.05em / rgb(0,0,0)  |  white-space:nowrap
          text: "96"
      - span — l:110px t:73px w:27px h:31px  |  type 26px / 700 / 31px / -0.05em / rgb(0,0,0)
          text: "%"
      - span — l:235px t:73px w:170px h:66px  |  type 16px / 500 / 22px / -0.06em / rgb(71,71,71)  |  opacity:.78
          text: "Clients who return for their next product"
  - div — l:698px t:187px w:664px h:175px  |  overflow:hidden
    - span — l:0 t:0  |  type 18px / 600 / 19px / -0.06em / rgb(54,53,53)  |  white-space:nowrap
        text: "Year of Establishment"
    - div — l:0 t:38px w:664px h:1.5px  |  background:rgba(153,152,149,.7)
    - div — l:0 t:60px w:448px h:115px
      - span — l:0 t:0 w:170px h:115px  |  type 16px / 500 / 23px / -0.06em / rgb(71,71,71)  |  opacity:.78
          text: "The year Riinkesh A Sshah founded Roars — a first product for an early-stage startup."
      - span — l:228px t:-11px  |  type 84px / 600 / 84px / -0.05em / rgb(0,0,0)  |  white-space:nowrap
          text: "2005"
      - div — l:230px t:82px w:62px h:28px
        - img — l:0 t:0 w:28px h:28px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Ankush.webp"
        - img — l:22px t:0 w:28px h:28px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
- div — l:39px t:584px w:1315px h:340px  |  overflow:hidden
  - div — l:0 t:0 w:152px h:228px  |  overflow:hidden
    - span — l:0 t:0  |  type 24px / 600 / 19px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
        text: "Team of Roars"
    - div — l:1px t:43px w:16px h:1.5px  |  background:rgb(180,174,174)
    - div — l:1px t:85px w:145px h:143px  |  overflow:hidden
      - div — l:0 t:0 w:42px h:42px  |  overflow:hidden
        - div — l:0 t:0 w:42px h:42px  |  background:rgba(153,152,149,.18); border-radius:60px
        - span — l:10px t:8px  |  type 18px / 600 / 43px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
            text: "59"
        - img — l:30px t:6px w:9px h:9px  |  src="assets/star-3.svg"
      - img — l:103px t:0 w:42px h:42px  |  background:rgb(173,173,173); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"  |  alt="Suzanne Martin"
      - img — l:52px t:50px w:42px h:42px  |  background:rgb(173,173,173); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"  |  alt="Chetna Shah"
      - img — l:0 t:101px w:42px h:42px  |  background:rgb(173,173,173); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"  |  alt="Avinash Kumar"
      - img — l:103px t:101px w:42px h:42px  |  background:rgb(173,173,173); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"  |  alt="Shiva Kumar"
  - div — l:464px t:0 w:850px h:215px  |  overflow:hidden
    - div — l:0 t:0 w:198px h:197px  |  overflow:hidden
      - span — l:0 t:0  |  type 24px / 600 / 19px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
          text: "Roars"
      - span — l:0 t:30px  |  type 24px / 600 / 19px / -0.04em / rgb(71,71,71)  |  opacity:.7; white-space:nowrap
          text: "Product Company"
      - img — l:1px t:85px w:60px h:60px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
      - span — l:0 t:157px  |  type 14px / 600 / 19px / -0.06em / rgb(22,22,22)  |  white-space:nowrap
          text: "Riinkesh A Sshah"
      - span — l:0 t:178px  |  type 14px / 500 / 19px / -0.06em / rgb(145,144,142)  |  white-space:nowrap
          text: "CEO / Founder"
    - span — l:233px t:79px w:617px h:136px  |  type 24px / 500 / 34px / -0.04em / rgb(0,0,0)
        text: "We work with you as thinkers, creators, consultants, designers and implementers"
      - span — type rgb(71,71,71)
          text: "to turn your product into a high quality marketable offering."
      - span — type rgb(145,144,142)
          text: "Our approach is simple — we bring clarity to complex situations."
  - div — l:686px t:296px w:629px h:44px  |  overflow:hidden
    - div — l:6px t:0 w:617px h:44px  |  opacity:.62; display:flex; align-items:center; gap:44px; filter:grayscale(1)
      - img — w:auto h:22px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand01.png"  |  alt="Samsung"
      - img — w:auto h:27px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand02.png"  |  alt="TATA"
      - img — w:auto h:24px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand03.png"  |  alt="GISAID"
      - img — w:auto h:22px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand04.png"  |  alt="Forbes"
      - img — w:auto h:27px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand05.png"  |  alt="Reliance"
      - img — w:auto h:22px  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand06.png"  |  alt="DDB"
    - div — l:0 t:0 w:54px h:44px  |  background:linear-gradient(270deg,rgba(255,255,255,0) 0%,rgb(255,255,255) 100%)
    - div — l:575px t:0 w:54px h:44px  |  background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgb(255,255,255) 100%)

## Mobile layout (≤760px, normal document flow)

### M1 section (dark)
padding: 120px 20px 44px · background: #000 · layout: flex column gap —
- img — l:0 t:0 w:100% h:100%  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:0 h:70%  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 55%,rgba(0,0,0,.92) 100%)
- div — display:flex; flex-direction:column; gap:22px
  - span — type 19px / 500 / 26px / -0.02em / rgb(255,255,255)
      text: "Space of ProductSolutions"
    - br
    - span — type #FFD400
        text: "*"
  - div — display:flex; align-items:flex-start; gap:8px
    - span — type 92px / 600 / 76px / -0.04em / rgb(251,251,251)
        text: "roars"
    - span — w:24px h:24px  |  type 11px / 600 / rgb(31,31,31)  |  background:#FFD400; border-radius:60px; display:flex; align-items:center; justify-content:center
        text: "®"
  - span — type 16px / 500 / 24px / -0.03em / rgb(255,255,255)
      text: "Product Developmentfor Startups & SMEs"
    - br
  - div — type 14px / 600 / 24px / -0.05em / rgba(255,255,255,.9)  |  border-top:1px solid rgba(255,255,255,.25); display:flex; flex-direction:column; gap:2px
    - span
        text: "Product Development"
    - span
        text: "UI/UX and Product Design"
    - span
        text: "Mobile App Development"
    - span
        text: "AI Automation"

### M2 section
padding: 56px 20px · background: rgb(255,255,255) · layout: flex column gap 38px
- div — display:flex; gap:6px
  - img — w:20px h:20px  |  src="assets/star-3.svg"
  - img — w:20px h:20px  |  src="assets/star-5.svg"
- div — display:flex; flex-direction:column; gap:10px
  - span — type 20px / 600 / 19px / -0.06em / rgb(0,0,0)
      text: "Projects Delivered"
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - div — display:flex; align-items:flex-end; gap:16px
    - span — type 72px / 600 / 72px / -0.05em / rgb(0,0,0)
        text: "250"
      - span — type 32px / 500
          text: "+"
    - span — type 15px / 500 / 21px / -0.06em / rgb(71,71,71)  |  opacity:.78; flex:1
        text: "Products launched successfully since 2005"
- div — display:flex; flex-direction:column; gap:10px
  - span — type 20px / 600 / 19px / -0.06em / rgb(0,0,0)
      text: "Returning Customers"
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - div — display:flex; align-items:flex-end; gap:16px
    - span — type 72px / 600 / 72px / -0.05em / rgb(0,0,0)
        text: "96"
      - span — type 26px / 700
          text: "%"
    - span — type 15px / 500 / 21px / -0.06em / rgb(71,71,71)  |  opacity:.78; flex:1
        text: "Clients who return for their next product"
- div — display:flex; flex-direction:column; gap:10px
  - span — type 16px / 600 / 19px / -0.06em / rgb(54,53,53)
      text: "Year of Establishment"
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - div — display:flex; align-items:flex-end; gap:16px
    - span — type 72px / 600 / 72px / -0.05em / rgb(0,0,0)
        text: "2005"
    - span — type 15px / 500 / 21px / -0.06em / rgb(71,71,71)  |  opacity:.78; flex:1
        text: "The year Riinkesh A Sshah founded Roars — a first product for an early-stage startup."
- div — display:flex; flex-direction:column; gap:16px
  - span — type 22px / 600 / 19px / -0.04em / rgb(0,0,0)
      text: "Team of Roars"
  - div — w:16px h:1.5px  |  background:rgb(180,174,174)
  - div — display:flex; align-items:center; gap:-8px
    - div — display:flex; align-items:center
      - div — w:42px h:42px  |  type 16px / 600 / -0.04em / rgb(0,0,0)  |  background:rgba(153,152,149,.18); border-radius:60px; display:flex; align-items:center; justify-content:center
          text: "59"
      - img — w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
      - img — w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
      - img — w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"
      - img — w:42px h:42px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"
- div — display:flex; flex-direction:column; gap:18px
  - div — display:flex; flex-direction:column; gap:2px
    - span — type 22px / 600 / 26px / -0.04em / rgb(0,0,0)
        text: "Roars"
    - span — type 22px / 600 / 26px / -0.04em / rgb(71,71,71)  |  opacity:.7
        text: "Product Company"
  - span — type 19px / 500 / 28px / -0.04em / rgb(0,0,0)
      text: "We work with you as thinkers, creators, consultants, designers and implementers"
    - span — type rgb(71,71,71)
        text: "to turn your product into a high quality marketable offering."
    - span — type rgb(145,144,142)
        text: "Our approach is simple — we bring clarity to complex situations."
  - div — display:flex; align-items:center; gap:12px
    - img — w:52px h:52px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
    - div — display:flex; flex-direction:column; gap:2px
      - span — type 14px / 600 / 19px / -0.06em / rgb(22,22,22)
          text: "Riinkesh A Sshah"
      - span — type 14px / 500 / 19px / -0.06em / rgb(145,144,142)
          text: "CEO / Founder"
- div — opacity:.62; display:flex; align-items:center; gap:34px; filter:grayscale(1)
  - img — w:auto h:20px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand01.png"  |  alt="Samsung"
  - img — w:auto h:24px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand02.png"  |  alt="TATA"
  - img — w:auto h:22px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand03.png"  |  alt="GISAID"
  - img — w:auto h:20px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand04.png"  |  alt="Forbes"
  - img — w:auto h:24px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand05.png"  |  alt="Reliance"
  - img — w:auto h:20px  |  flex:none  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/home-brand06.png"  |  alt="DDB"

### M3 section
padding: 56px 20px 64px · background: rgb(245,245,245) · layout: flex column gap 32px
- span — type 56px / 600 / 56px / -0.05em / rgb(36,36,36)
    text: "Services"
- div — border-top:1.5px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:16px
  - div — display:flex; align-items:baseline; justify-content:space-between; gap:12px
    - span — type 26px / 600 / 32px / -0.04em / rgb(0,0,0)
        text: "Product Development"
    - span — type 15px / 600 / -0.04em / rgb(17,17,17)
        text: "/01"
  - div — display:flex; align-items:center; gap:10px
    - div — w:96px h:96px  |  background:rgb(217,217,217); border-radius:50%; overflow:hidden; flex:none
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2023/06/produc-consultant.jpg"
    - div — w:40px h:40px  |  background:rgb(102,102,102); border-radius:50%; overflow:hidden; flex:none
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/04/beautiful-experience.jpg"
  - span — type 16px / 500 / 23px / -0.05em / rgb(14,14,14)
      text: "We take products from idea to launch — strategy, design and engineering in one team"
  - span — type 14px / 500 / 19px / -0.06em / rgb(71,71,71)  |  opacity:.8
      text: "Discovery, Architecture, Engineering, Launch"
  - div — type 15px / 600 / -0.04em / rgb(0,0,0)  |  display:flex; gap:8px 16px
    - span
        text: "Snowman Logistics"
    - span
        text: "Parqly"
    - span — type 500 / rgb(145,144,142)
        text: "+ 11"
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px
  - div — display:flex; align-items:flex-start; justify-content:space-between; gap:12px
    - span — type 22px / 600 / 28px / -0.04em / rgb(0,0,0)
        text: "UI/UX and Product Design"
    - span — w:34px h:34px  |  type 24px / 300 / #000  |  background:#fff; border-radius:60px; display:flex; align-items:center; justify-content:center; flex:none
        text: "+"
  - span — type 15px / 500 / 22px / -0.06em / rgb(2,2,2)
      text: "Human-centered design that turns complex ideas into easy, elegant user experiences"
  - div — display:flex; align-items:baseline; gap:10px
    - span — type 28px / 600 / -0.05em / rgb(0,0,0)
        text: "40"
    - span — type 14px / 500 / rgb(0,0,0)  |  opacity:.9
        text: "Projects"
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px
  - div — display:flex; align-items:flex-start; justify-content:space-between; gap:12px
    - span — type 22px / 600 / 28px / -0.04em / rgb(0,0,0)
        text: "Mobile App Development"
    - span — w:34px h:34px  |  type 24px / 300 / #000  |  background:#fff; border-radius:60px; display:flex; align-items:center; justify-content:center; flex:none
        text: "+"
  - span — type 15px / 500 / 22px / -0.06em / rgb(2,2,2)
      text: "Native and cross-platform apps built to scale with your user base"
  - div — display:flex; align-items:baseline; gap:10px
    - span — type 28px / 600 / -0.05em / rgb(0,0,0)
        text: "35"
    - span — type 14px / 500 / rgb(0,0,0)  |  opacity:.9
        text: "Projects"
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px
  - div — display:flex; align-items:flex-start; justify-content:space-between; gap:12px
    - span — type 22px / 600 / 28px / -0.04em / rgb(0,0,0)
        text: "AI Automation"
    - span — w:34px h:34px  |  type 24px / 300 / #000  |  background:#fff; border-radius:60px; display:flex; align-items:center; justify-content:center; flex:none
        text: "+"
  - span — type 15px / 500 / 22px / -0.06em / rgb(2,2,2)
      text: "Workflow automation and AI features wired into your product and operations."
  - div — display:flex; align-items:baseline; gap:10px
    - span — type 28px / 600 / -0.05em / rgb(0,0,0)
        text: "17"
    - span — type 14px / 500 / rgb(0,0,0)  |  opacity:.9
        text: "Projects"
- span — type 19px / 500 / 28px / -0.04em / rgb(0,0,0)
    text: "Roars helps founders stand out with bold product design and smart digital solutions. We mix strategy, creativity and technology."
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Start a Project"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M4 section (dark)
padding: 56px 20px 64px · background: #000 · layout: flex column gap 28px
- img — l:0 t:0 w:100% h:100%  |  opacity:.9; transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.75) 100%)
- div — display:flex; flex-direction:column; gap:28px
  - span — type 56px / 600 / 56px / -0.04em / rgb(251,251,251)
      text: "Projects"
  - div — display:flex; align-items:flex-end; gap:20px
    - span — type 40px / 600 / 40px / -0.05em / rgb(236,234,228)
        text: "250"
      - span — type 20px / 500
          text: "+"
    - span — type 14px / 500 / 24px / -0.05em / rgb(255,255,255)  |  flex:1
        text: "Recent ProjectsProduct DevelopmentUI/UX and Product DesignMobile and AI"
      - br
      - br
      - br
  - a — display:flex; flex-direction:column; gap:12px  |  href="Roars  v2 - Project Detail.dc.html"
    - div — display:flex; align-items:center; justify-content:space-between
      - span — type 20px / 500 / -0.06em / rgb(251,251,251)
          text: "15 Oct"
        - span — type rgb(153,152,149)
            text: "2026"
      - div — display:flex
        - img — w:34px h:34px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"
        - img — w:34px h:34px  |  border-radius:60px; margin-left:-8px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
    - div — background:rgb(30,30,30); border-radius:12px; overflow:hidden; aspect-ratio:4/3
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/02/Snowman-Logistics-app-solution.jpg"  |  alt="Snowman Logistics"
    - span — type 28px / 600 / 34px / -0.05em / rgb(255,255,255)
        text: "Snowman Logistics."
  - a — display:flex; flex-direction:column; gap:12px  |  href="Roars  v2 - Project Detail.dc.html"
    - div — display:flex; align-items:center; justify-content:space-between
      - span — type 20px / 500 / -0.06em / rgb(251,251,251)
          text: "02 Jul"
        - span — type rgb(153,152,149)
            text: "2025"
      - div — display:flex
        - img — w:34px h:34px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
        - img — w:34px h:34px  |  border-radius:60px; margin-left:-8px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"
    - div — background:rgb(30,30,30); border-radius:12px; overflow:hidden; aspect-ratio:4/3
      - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/07/parqly-parking-mobile-app.jpg"  |  alt="Parqly"
    - span — type 28px / 600 / 34px / -0.05em / rgb(255,255,255)
        text: "Parqly."
  - a — h:52px  |  background:rgb(255,255,255); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Projects.dc.html"
    - span — type 14px / 500 / -0.03em / rgb(0,0,0)
        text: "All Projects"
    - span — display:flex; gap:3px
      - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
      - span — w:8px h:8px  |  background:#000; border-radius:50%

### M5 section
padding: 56px 20px 64px · background: rgb(255,255,255) · layout: flex column gap 30px
- div — display:flex; flex-direction:column; gap:8px
  - span — type 56px / 600 / 56px / -0.05em / rgb(36,36,36)
      text: "People say"
  - span — type 32px / 600 / 36px / -0.05em / rgb(36,36,36)
      text: "4.9/5"
- div — border-top:1.5px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:center; gap:12px
    - img — w:56px h:56px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
    - div — display:flex; flex-direction:column; gap:2px
      - span — type 14px / 600 / -0.06em / rgb(31,31,31)
          text: "Jayeis Sonill"
      - span — type 14px / 500 / -0.06em / rgb(145,145,145)
          text: "CEO, Aum Investment"
  - div — display:flex; gap:4px
    - img — w:13px h:13px  |  src="assets/star-5.svg"
    - img — w:13px h:13px  |  src="assets/star-5.svg"
    - img — w:13px h:13px  |  src="assets/star-5.svg"
    - img — w:13px h:13px  |  src="assets/star-5.svg"
    - img — w:13px h:13px  |  src="assets/star-5.svg"
  - span — type 19px / 500 / 27px / -0.04em / rgb(0,0,0)
      text: "Roars has consistently positioned themselves at the forefront of innovation and technology. They understand business needs and craft technologies to address them."
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:center; gap:12px
    - img — w:50px h:50px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"
    - div — display:flex; flex-direction:column; gap:2px
      - span — type 13px / 600 / -0.06em / rgb(31,31,31)
          text: "James Hadley"
      - span — type 13px / 500 / -0.06em / rgb(145,145,145)
          text: "CEO, Simthing New, LLC"
  - div — display:flex; gap:4px
    - img — w:12px h:12px  |  src="assets/star-5.svg"
    - img — w:12px h:12px  |  src="assets/star-5.svg"
    - img — w:12px h:12px  |  src="assets/star-5.svg"
    - img — w:12px h:12px  |  src="assets/star-5.svg"
    - img — w:12px h:12px  |  src="assets/star-5.svg"
  - span — type 17px / 500 / 25px / -0.04em / rgb(0,0,0)
      text: "I was pleased with the deliverables. I was able to see and understand the efforts required to scale the solution in development."
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:center; gap:12px
    - img — w:46px h:46px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
    - div — display:flex; flex-direction:column; gap:2px
      - span — type 12px / 600 / -0.06em / rgb(31,31,31)
          text: "Avinash Kumar"
      - span — type 12px / 500 / -0.06em / rgb(145,145,145)
          text: "Project Manager, Roars"
  - div — display:flex; gap:3px
    - img — w:11px h:11px  |  src="assets/star-5.svg"
    - img — w:11px h:11px  |  src="assets/star-5.svg"
    - img — w:11px h:11px  |  src="assets/star-5.svg"
    - img — w:11px h:11px  |  src="assets/star-5.svg"
    - img — w:11px h:11px  |  src="assets/star-5.svg"
  - span — type 16px / 500 / 23px / -0.04em / rgb(0,0,0)
      text: "From discovery to launch, the team brought our platform to life with precision. A genuine product partner."
- div — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:12px
  - div — display:flex; align-items:center; gap:12px
    - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Khusboo.webp"
    - div — display:flex; flex-direction:column; gap:2px
      - span — type 12px / 600 / -0.06em / rgb(31,31,31)
          text: "Khusboo Panchal"
      - span — type 12px / 500 / -0.06em / rgb(145,145,145)
          text: "Digital Marketing"
  - div — display:flex; gap:3px
    - img — w:10px h:10px  |  src="assets/star-5.svg"
    - img — w:10px h:10px  |  src="assets/star-5.svg"
    - img — w:10px h:10px  |  src="assets/star-5.svg"
    - img — w:10px h:10px  |  src="assets/star-5.svg"
    - img — w:10px h:10px  |  src="assets/star-5.svg"
  - span — type 15px / 500 / 22px / -0.04em / rgb(0,0,0)
      text: "Fast, smart and beautiful. We will be back for round two soon."
- div — display:flex; align-items:center; gap:14px
  - div — display:flex; align-items:center
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Atul.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 3px #fff; margin-left:-10px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Khusboo.webp"
    - div — w:38px h:38px  |  type 13px / 600 / -0.04em / #fff  |  background:rgb(20,20,20); border-radius:60px; box-shadow:0 0 0 3px #fff; display:flex; align-items:center; justify-content:center; margin-left:-10px
        text: "37"
  - span — type 13px / 500 / 18px / -0.05em / rgb(71,71,71)
      text: "reviews4.9 average"
    - br
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Leave a Review"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M6 section
padding: 56px 20px 64px · background: rgb(245,245,245) · layout: flex column gap 28px
- span — type 56px / 600 / 56px / -0.05em / rgb(36,36,36)
    text: "Industries"
- div — display:flex; flex-direction:column; gap:4px
  - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 14px / 500 / 21px / -0.06em / rgb(0,0,0)
      text: "Eight sectors"
  - span — type 14px / 400 / 21px / -0.06em / rgb(153,152,149)
      text: "Where we work"
- span — type 19px / 500 / 28px / -0.04em / rgb(2,2,2)
    text: "We build in sectors we already understand, so the discovery work starts from domain knowledge rather than from scratch."
- div — display:grid; gap:22px 16px
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/food-restaurant-app-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "R"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Restaurant"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/on-demand-fitness-app-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "F"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Fitness"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/retail-ecommerce-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "e"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "eCommerce"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/concierge-app-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "C"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Concierge"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/travel-and-hospitality-app-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "T"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Travel"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/logistics-transportation-app-development/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "L"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Logistics"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/saas-application-development-services/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "S"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "SaaS"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
  - a — border-top:1px solid rgba(153,152,149,.7); display:flex; flex-direction:column; gap:10px  |  href="https://www.roarsinc.com/industries/healthcare-app-development-company/"
    - div — w:48px h:48px  |  type 18px / 600 / -0.05em / rgb(36,36,36)  |  border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.35); display:flex; align-items:center; justify-content:center
        text: "H"
    - span — type 18px / 600 / 24px / -0.05em / rgb(36,36,36)
        text: "Healthcare"
    - span — type 11px / 500 / -0.04em / rgb(153,152,149)
        text: "View sector"
- div — display:flex; align-items:center; gap:12px
  - img — w:17px h:17px  |  src="assets/star-3.svg"
  - img — w:17px h:17px  |  src="assets/star-5.svg"
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Projects.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "See the work"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M7 section
padding: 56px 20px 64px · background: rgb(255,255,255) · layout: flex column gap 28px
- span — type 56px / 600 / 56px / -0.05em / rgb(36,36,36)
    text: "Insights"
- span — type 19px / 500 / 28px / -0.04em / rgb(2,2,2)
    text: "We have a lot to say about product work — how we approach the process, what the AI shift actually changes, and the nuances of building for founders."
- div — display:flex; align-items:center; gap:12px
  - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
  - div — display:flex; flex-direction:column; gap:2px
    - span — type 14px / 600 / -0.05em / rgb(22,22,22)
        text: "Riinkesh A Sshah"
    - span — type 14px / 500 / -0.05em / rgb(145,144,142)
        text: "Founder"
- div — display:flex; flex-direction:column
  - sc-for [{{ insights }}]
    - a — border-top:1px solid rgba(153,152,149,.7); display:flex; align-items:center; gap:16px; padding:18px 0  |  href="Roars v2 - Insight-details.dc.html"
      - div — w:76px h:76px  |  background-color:rgb(217,217,217); background-image:{{ i.bg }}; border-radius:50%; flex:none
      - div — display:flex; flex-direction:column; gap:6px; flex:1
        - span — type 13px / 600 / -0.05em / rgb(145,144,142)
            text: "{{ i.day }} {{ i.month }}"
        - span — type 17px / 500 / 23px / -0.05em / rgb(20,20,20)
            text: "{{ i.title }}"
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Insights.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "All Insights"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M8 section
padding: 56px 20px 64px · background: rgb(245,245,245) · layout: flex column gap 26px
- span — type 56px / 600 / 56px / -0.05em / rgb(36,36,36)
    text: "FAQ"
- div — display:flex; align-items:center; gap:12px
  - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
  - span — type 15px / 500 / 21px / -0.06em / rgb(20,20,20)  |  flex:1
      text: "Behind every project: the thinking that fuels how Roars builds."
- div — display:flex; flex-direction:column
  - sc-for [{{ faqs }}]
    - div — border-top:1px solid rgba(153,152,149,.6); display:flex; flex-direction:column; gap:12px; padding:18px 0
      - div — display:flex; align-items:flex-start; gap:14px
        - span — type 17px / 600 / 24px / -0.05em / rgb(20,20,20)  |  flex:1
            text: "{{ f.q }}"
        - span — w:34px h:34px  |  type 22px / 300 / 1 / rgb(0,0,0)  |  background:#fff; border-radius:60px; display:flex; align-items:center; justify-content:center; flex:none
            text: "{{ f.icon }}"
      - sc-if [{{ f.open }}]
        - span — type 15px / 500 / 22px / -0.05em / rgb(71,71,71)
            text: "{{ f.a }}"
- span — type 15px / 500 / 22px / -0.06em / rgb(20,20,20)
    text: "Didn’t find the answer? Ask us about our services!"
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Ask your Question"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M9 section (dark)
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
        - a — href="Roars v2 - Projects.dc.html"
            text: "Projects"
        - a — href="Roars v2 - Insights.dc.html"
            text: "Insights"
        - a — href="Roars v2 - Contact.dc.html"
            text: "Contact"
    - div — display:flex; flex-direction:column; gap:8px
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
      wrap.style.height = (10022 * s) + 'px';
      const bar = document.querySelector('[data-topbar]');
      if (bar) {
        bar.style.transform = 'scale(' + s + ')';
        bar.style.left = wrap.getBoundingClientRect().left + 'px';
      }
      if (this.slide) this.slide();
    };
    // the bar flips ink depending on the section behind it
    const DARK = [[0, 900], [3339, 4679], [8917, 10022]];
    this.tint = () => {
      const wrap = document.querySelector('[data-fit]');
      const bar = document.querySelector('[data-topbar]');
      if (!wrap || !bar) return;
      const s = wrap.clientWidth / 1440;
      const yy = (scrollY + 60) / s;
      const onDark = DARK.some(r => yy >= r[0] && yy < r[1]);
      const ink = onDark ? 'rgb(255,255,255)' : 'rgb(15,15,15)';
      bar.querySelectorAll('[data-ink]').forEach(el => { el.style.color = ink; });
      bar.querySelectorAll('[data-fill]').forEach(el => { el.style.background = ink; });
      const contact = bar.querySelector('[data-contact]');
      if (contact) {
        const gone = scrollY > 80;
        contact.style.opacity = gone ? '0' : '1';
        contact.style.transform = gone ? 'translateY(-12px)' : 'none';
        contact.style.pointerEvents = gone ? 'none' : 'auto';
      }
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
    // projects: the second card slides up over the first as the section scrolls through
    this.slide = () => {
      const wrap = document.querySelector('[data-fit]');
      const b = document.querySelector('[data-slide]');
      const a = document.querySelector('[data-slide-a]');
      if (!wrap || !a || !b) return;
      const s = wrap.clientWidth / 1440;
      // card A holds full-frame until the section is well into view, then hands over to card B
      // hold card A at full opacity until the slider is fully in frame, then hand over
      const sliderTop = (3339 + 457) * s;
      const start = sliderTop - innerHeight * 0.12;
      const span = 620 * s;
      let p = (scrollY - start) / span;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      // single-parameter cross-fade: the two opacities always sum to 1, so the slot is never empty
      const e = p * p * (3 - 2 * p);
      a.style.transform = 'translateY(' + (-e * 56).toFixed(1) + 'px) scale(' + (1 - e * 0.04).toFixed(3) + ')';
      a.style.opacity = (1 - e).toFixed(3);
      a.style.pointerEvents = e > 0.5 ? 'none' : 'auto';
      b.style.transform = 'translateY(' + ((1 - e) * 56).toFixed(1) + 'px) scale(' + (0.96 + e * 0.04).toFixed(3) + ')';
      b.style.opacity = e.toFixed(3);
      b.style.pointerEvents = e > 0.5 ? 'auto' : 'none';
    };

    this.onScroll = () => { this.tint(); this.slide(); };
    this.logoIntro = () => {
      const img0 = document.querySelector('[data-logo-img]');
      if (!img0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      img0.animate(
        [{ transform: 'scale(.2) rotate(-90deg)', opacity: 0.001 },
         { transform: 'scale(1.12) rotate(8deg)', opacity: 1, offset: 0.62 },
         { transform: 'scale(1) rotate(0deg)', opacity: 1 }],
        { duration: 1100, delay: 300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      );
    };
    this.logoIntro();
    this.tint();
    this.slide();
    addEventListener('scroll', this.onScroll, { passive: true });
    // subtle scroll reveal: direct blocks of each section rise and fade in once
    this.reveal = () => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;
      const items = [];
      [...canvas.querySelectorAll('[data-screen-label]')].forEach(sec => {
        [...sec.children].forEach(el => {
          if (el.tagName === 'IMG' && el.parentElement === sec) return;
          if (el.dataset.slide !== undefined || el.dataset.slideA !== undefined) return;
          if (!el.style || el.style.position !== 'absolute') return;
          el.style.willChange = 'transform,opacity';
          el.style.transition = 'transform .72s cubic-bezier(.22,.68,.28,1), opacity .62s ease';
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
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
      items.forEach(el => io.observe(el));
      this.io = io;
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(() => this.reveal());


    // ---- mobile: scroll reveal for the flowing layout + bar ink over dark sections
    this.mobileMotion = () => {
      const mob = document.querySelector('[data-mobile]');
      if (!mob || this.mio) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
            en.target.style.opacity = '1';
            en.target.style.transform = 'none';
            this.mio.unobserve(en.target);
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
        items.forEach(el => this.mio.observe(el));
      }
      const bar = document.querySelector('[data-topbar-m]');
      const darks = [...mob.querySelectorAll('[data-mdark]')];
      this.mtint = () => {
        if (!bar || !this.mq.matches) return;
        const y = 30;
        const onDark = darks.some(s => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
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
    addEventListener('resize', this.fit);
    const wrap = document.querySelector('[data-fit]');
    if (wrap && window.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.fit());
      this.ro.observe(wrap);
    }
  }
  componentWillUnmount() {
    removeEventListener('resize', this.fit);
    removeEventListener('scroll', this.onScroll);
    if (this.mtint) removeEventListener('scroll', this.mtint);
    if (this.mio) this.mio.disconnect();
    if (this.mio2) this.mio2.disconnect();
    if (this.mextra) removeEventListener('scroll', this.mextra);
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect();
  }
  state = { openFaq: 0 };

  INSIGHTS = [
    { day: '15', month: 'May', title: 'AI App Development vs Traditional App Development', img: 'https://www.roarsinc.com/wp-content/uploads/2025/07/ai-fitness-home.jpg' },
    { day: '04', month: 'May', title: '20 Years of Roars: Built on Purpose, Driven by Impact', img: 'https://www.roarsinc.com/wp-content/uploads/2024/11/roars-office-upscale-768x768.jpg' },
    { day: '11', month: 'Dec', title: 'The Unexpected Insight — We built a meal planning app', img: 'https://www.roarsinc.com/wp-content/uploads/2025/04/beautiful-experience.jpg' }
  ];

  FAQS = [
    { q: 'How long does it take to build a product?', a: 'The timeline depends on complexity and specific requirements. An MVP typically runs eight to sixteen weeks. We provide a detailed timeline during the initial consultation to ensure clear expectations.' },
    { q: 'What\u2019s included in your product strategy?', a: 'Discovery workshops, market and competitor review, product definition, technical feasibility and a costed delivery roadmap.' },
    { q: 'How does the monthly engagement model work?', a: 'A dedicated team bills monthly and works to your cadence. You can scale up or down at the end of any month, with a named project manager throughout.' },
    { q: 'Can you take over an existing product?', a: 'Yes. We start with a technical and design audit, then agree a plan to stabilise what exists before extending it.' },
    { q: 'Do you work with pre-seed startups?', a: 'Regularly. Much of our work is with founders building a first version, and we scope to the funding available.' }
  ];

  renderVals() {
    const xs = ['39px', '503px', '967px'];
    const insights = this.INSIGHTS.map((i, n) => Object.assign({}, i, { x: xs[n], bg: 'url("' + i.img + '")' }));

    let top = 0;
    const faqs = this.FAQS.map((f, i) => {
      const open = this.state.openFaq === i;
      const last = i === this.FAQS.length - 1;
      const h = open ? 178 : 90;
      const row = {
        q: f.q, a: f.a, open,
        toggle: () => this.setState({ openFaq: open ? -1 : i }),
        top: top + 'px',
        h: h + 'px',
        ruleH: i === 0 ? '1.5px' : '1px',
        ruleColor: i === 0 ? 'rgba(153,152,149,.7)' : 'rgba(153,152,149,.5)',
        qTop: open ? '31px' : '34px',
        qSize: open ? '22px' : '20px',
        qWeight: open ? 600 : 500,
        iconTop: open ? '26px' : '27px',
        iconLeft: open ? '12px' : '9px',
        iconSize: open ? '26px' : '28px',
        icon: open ? '\u2013' : '+'
      };
      top += h;
      return row;
    });

    const charts = [
      { x: '0px', title: 'Projects by Field', bg: 'url("assets/chart-field.png")', desc: 'The ranking is based on the predominant domain of a project.' },
      { x: '464px', title: 'Projects Launched', bg: 'url("assets/chart-launched.png")', desc: 'Products shipped per year across all engagement types.' },
      { x: '928px', title: 'People making a Project', bg: 'url("assets/chart-people.png")', desc: 'Average number of people from the team involved in the project.' }
    ];

    const cases = [
      { x: '0px', client: 'Snowman Logistics', n: '80', suffix: '%', headline: 'Less time spent on manual compliance reporting', quote: 'We tried several partners over the years, but only Roars managed to achieve this level of operational clarity.', name: 'Jayeis Sonill', role: 'CEO, Aum Investment', bg: 'url("https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp")' },
      { x: '464px', client: 'GymBait.AI', n: '75', suffix: '%', headline: 'Faster trainer-to-gym placement after launch', quote: 'Thanks to the Roars team for the great work — the platform shipped on schedule and converts far better than our first build.', name: 'James Hadley', role: 'CEO, Simthing New', bg: 'url("https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp")' },
      { x: '929px', client: 'Parqly', n: '61', suffix: '%', headline: 'Increased user retention in the first month', quote: 'We did not expect retention could improve this quickly. The onboarding rework alone paid for the project.', name: 'Suzanne Martin', role: 'Director, Global Sales', bg: 'url("https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp")' }
    ];

    return { insights, faqs, charts, cases };
  }
}
```