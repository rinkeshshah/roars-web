# AI Automation — element spec

Source prototype: `design/Roars v2 - AI Automation.dc.html`  ·  desktop canvas 1440px wide, all desktop elements absolutely positioned inside their section (coordinates are relative to the section unless noted).

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
  @keyframes tick { 0%,100% { opacity:1; } 50% { opacity:.15; } }
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
  "openQuestion": {
    "editor": "int",
    "default": 0,
    "min": 0,
    "max": 6,
    "tsType": "number",
    "section": "FAQ"
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

### Hero  (top 0, height 840px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-40px w:1440px h:920px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.2) 44%,rgba(0,0,0,.55) 100%)
- div — l:39px t:168px w:400px h:420px
  - span — l:0 t:0  |  type 12px / 500 / 19px / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
      text: "SERVICES / AI AUTOMATION"
  - div — l:0 t:38px w:16px h:1.5px  |  background:#FFD400
  - span — l:0 t:64px w:400px h:96px  |  type 22px / 500 / 30px / -0.04em / rgba(255,255,255,.94)
      text: "Your team shouldn’t spend time on work a system can own."
  - span — l:0 t:172px w:380px h:52px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.62)
      text: "AI automation that removes friction from real work."
  - div — l:0 t:244px w:400px h:80px  |  display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "80% FEWER MANUAL TASKS"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "3–6 WEEKS TO PILOT"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "HUMANS IN CONTROL"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "ZERO RETAINER"
  - a — l:0 t:364px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="#form-section"
    - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
        text: "Shall we chat?"
    - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
    - span — l:169px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%
- div — l:420px t:400px w:700px h:340px
  - div — l:8px t:0 w:62px h:24px
    - span — l:0 t:4px  |  type 20px / 600 / 20px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
        text: "roars"
    - img — l:52px t:0 w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
  - span — l:2px t:44px w:300px h:70px  |  type 66px / 600 / 70px / -0.05em / rgba(255,255,255,.62)  |  white-space:nowrap
      text: "AI"
  - img — l:6px t:112px w:88px h:10px  |  transform:rotate(5.4deg); filter:invert(1)  |  src="assets/union.svg"
  - span — l:0 t:116px w:900px h:150px  |  type 132px / 600 / 140px / -0.055em / rgb(251,251,251)  |  white-space:nowrap
      text: "automation"
  - span — l:6px t:270px w:520px h:30px  |  type 24px / 500 / 34px / -0.04em / rgba(255,255,255,.72)  |  white-space:nowrap
      text: "Services — agents, workflows, plumbing"
- div — l:1130px t:182px w:272px h:520px  |  background:rgba(8,8,8,.92); box-shadow:inset 0 0 0 1px rgba(255,255,255,.16), 0 26px 60px rgba(0,0,0,.5); overflow:hidden
  - div — l:18px t:18px w:236px h:484px  |  type rgba(255,255,255,.88)
    - span — l:0 t:0  |  type 11px / 600 / 0.2em / rgba(255,255,255,.55)
        text: "EVAL RUN"
    - span — l:160px t:0 w:76px  |  type 11px / 500 / 0.06em / rgba(255,255,255,.55)
        text: "#0092"
    - div — l:0 t:24px w:236px h:1px  |  border-top:1px dashed rgba(255,255,255,.22)
    - div — l:0 t:40px w:236px h:230px  |  type 11px / 500 / 19px / 0.02em
      - div — h:38px
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "contract_triage"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.97 · 38 clauses"
      - div — h:38px
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "first_response_draft"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.94 · human sends"
      - div — h:38px
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "clause_extract"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "HOLD · 0.89 · to paralegal"
      - div — h:38px
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "invoice_to_erp"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.96 · 2 flagged"
      - div — h:38px
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "kb_answer_cited"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.99 · source req."
    - div — l:0 t:290px w:236px h:1px  |  border-top:1px dashed rgba(255,255,255,.22)
    - span — l:0 t:306px  |  type 10px / 600 / 0.22em / rgba(255,255,255,.5)
        text: "STATUS"
    - div — l:0 t:326px w:236px h:20px
      - span — l:0 t:5px w:7px h:7px  |  background:#FFD400
      - span — l:16px t:0 w:220px  |  type 12px / 600 / 0.04em / rgb(255,255,255)  |  white-space:nowrap
          text: "RUNNING EVALS…"
    - div — l:0 t:366px w:236px h:3px  |  background:rgba(255,255,255,.14)
      - div — l:0 t:0 w:20% h:3px  |  background:#FFD400
    - span — l:0 t:404px w:236px  |  type 11px / 500 / 18px / 0.02em / rgba(255,255,255,.55)
        text: "Baseline +38%. Nothing shipswithout proof it beats thestatus quo."
      - br
      - br
    - span — l:0 t:466px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.4)
        text: "EVALS BEFORE PROMPTS"

### Services  (top 840px, height 1060px)
background: rgb(245,245,245)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "WHAT WE BUILD"
- span — l:33px t:148px w:880px h:210px  |  type 84px / 600 / 92px / -0.05em / rgb(36,36,36)
    text: "Six ways AI actually earns its place."
- div — l:962px t:158px w:440px h:220px
  - span — l:0 t:0 w:440px h:160px  |  type 18px / 500 / 27px / -0.04em / rgba(20,20,20,.8)
      text: "We don’t sell We ship small, specific systems that remove friction from the work your team already does then we measure whether they helped. If they didn’t, we turn them off."
    - span — type 700 / rgb(20,20,20)
        text: "“AI transformation.”"
- div — l:40px t:440px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "01"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "Custom AI agents"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Goal-driven assistants that can read a ticket, query your CRM, draft a response, and route it for review. Built for one job, evaluated like software, not demoed like magic."
- div — l:504px t:440px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "02"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "Workflow automation"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "End-to-end automation across the apps you already pay for. Trigger from Slack, read from Salesforce, write to Notion, post to Linear with an LLM doing the thinking in between."
- div — l:968px t:440px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "03"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "RAG & knowledge assistants"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Private retrieval systems trained on your contracts, docs, tickets, codebase. Answers cite their sources. No hallucinated policies. No “based on my training data” disclaimers."
- div — l:40px t:760px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "04"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "Document intelligence"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Pull structured data out of PDFs, invoices, contracts and emails. Validate against your schema. Hand only the edge cases to a human. The other 80% just… happens."
- div — l:504px t:760px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "05"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "LLM integration"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Bring AI into the products and tools your team already lives in. Private model routing, prompt management, telemetry, cost controls the unglamorous plumbing that makes it work in production."
- div — l:968px t:760px w:434px h:280px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "06"
  - span — l:0 t:50px w:400px h:64px  |  type 24px / 600 / 30px / -0.04em / rgb(36,36,36)
      text: "AI readiness audit"
  - span — l:0 t:124px w:420px h:150px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Two weeks. We sit with your team, map the work, find the three highest-ROI automations and the three to never attempt. You get a build plan and a clear “no.” If you want."

### Featured work  (top 1900px, height 620px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-60px w:1440px h:740px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.64) 0%,rgba(0,0,0,.3) 50%,rgba(0,0,0,.64) 100%)
- div — l:40px t:90px w:16px h:1.5px  |  background:rgba(180,174,174,.7)
- span — l:40px t:110px  |  type 12px / 500 / 19px / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
    text: "FEATURED WORK"
- span — l:34px t:186px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(251,251,251)  |  white-space:nowrap
    text: "GYMBAIT.AI"
- div — l:962px t:192px w:440px h:220px
  - span — l:0 t:0 w:440px h:200px  |  type 18px / 500 / 27px / -0.04em / rgba(255,255,255,.9)
      text: "Unleash your potential with bespoke Artificial Intelligence Training. GymBAIT flipped the script by using AI to predict engagement gaps, adapt routines to individual goals, and offer encouragement when users lag."
- div — l:40px t:390px w:1362px h:0.5px  |  background:rgba(255,255,255,.22)
- div — l:40px t:428px w:760px h:80px  |  display:flex; gap:88px
  - div — display:flex; flex-direction:column; gap:6px
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
        text: "SYSTEM"
    - span — type 18px / 500 / 24px / -0.04em / rgba(255,255,255,.9)
        text: "Engagement prediction"
  - div — display:flex; flex-direction:column; gap:6px
    - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
        text: "HUMAN IN THE LOOP"
    - span — type 18px / 500 / 24px / -0.04em / rgba(255,255,255,.9)
        text: "Coach reviews every nudge"
- a — l:1207px t:428px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="https://www.roarsinc.com/work/gymbait/"
  - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
      text: "View Project"
  - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
  - span — l:169px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%

### Process  (top 2520px, height 1000px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:100px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "HOW WE WORK"
- span — l:33px t:136px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "Ask first. Build second."
- span — l:962px t:146px w:440px h:170px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.72)
    text: "Every Roars engagement starts with the same question: does this actually help someone? If it doesn’t, we tell you before we take the brief. If it does, here’s how we get from idea to in-production."
- div — l:40px t:380px w:1362px h:2px
  - div — l:0 t:0 w:1362px h:0  |  border-top:1px dashed rgba(20,20,20,.3)
  - div — l:0 t:-0.5px w:0 h:2px  |  background:#FFD400
  - span — l:-6px t:-6px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:334px t:-6px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:674px t:-6px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
  - span — l:1014px t:-6px w:13px h:13px  |  background:rgb(255,255,255); box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
- div — l:40px t:310px w:310px h:46px
  - span — l:0 t:0  |  type 11px / 600 / 0.16em / rgb(20,20,20)
      text: "WEEK 1"
  - span — l:0 t:20px  |  type 11px / 500 / 0.16em / rgb(145,145,145)
      text: "DISCOVERY"
- div — l:40px t:412px w:310px h:290px
  - span — l:0 t:0 w:300px h:80px  |  type 32px / 600 / 38px / -0.05em / rgb(36,36,36)
      text: "Ask the right question"
  - span — l:0 t:96px w:300px h:190px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "We sit with your team and map the work. Not the org chart — the actual hour-by-hour. We’re looking for friction, repetition, and the moments where a person is doing what a system should."
- div — l:380px t:310px w:310px h:46px
  - span — l:0 t:0  |  type 11px / 600 / 0.16em / rgb(20,20,20)
      text: "WEEK 2"
  - span — l:0 t:20px  |  type 11px / 500 / 0.16em / rgb(145,145,145)
      text: "ARCHITECTURE"
- div — l:380px t:412px w:310px h:290px
  - span — l:0 t:0 w:300px h:80px  |  type 32px / 600 / 38px / -0.05em / rgb(36,36,36)
      text: "Map the system"
  - span — l:0 t:96px w:300px h:190px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Data flows, decision points, edge cases, human-in-the-loop gates. We draw the whole thing before we touch a model. You sign off on a diagram, not a vibe."
- div — l:720px t:310px w:310px h:46px
  - span — l:0 t:0  |  type 11px / 600 / 0.16em / rgb(20,20,20)
      text: "WEEKS 3–6"
  - span — l:0 t:20px  |  type 11px / 500 / 0.16em / rgb(145,145,145)
      text: "PILOT"
- div — l:720px t:412px w:310px h:290px
  - span — l:0 t:0 w:300px h:80px  |  type 32px / 600 / 38px / -0.05em / rgb(36,36,36)
      text: "Build & evaluate"
  - span — l:0 t:96px w:300px h:190px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Working pilot inside your stack. Real data, real users, real tests. We write evals before we write prompts. Nothing ships without measurable proof it’s better than the status quo."
- div — l:1060px t:310px w:310px h:46px
  - span — l:0 t:0  |  type 11px / 600 / 0.16em / rgb(20,20,20)
      text: "WEEKS 7+"
  - span — l:0 t:20px  |  type 11px / 500 / 0.16em / rgb(145,145,145)
      text: "PRODUCTION"
- div — l:1060px t:412px w:342px h:290px
  - span — l:0 t:0 w:330px h:80px  |  type 32px / 600 / 38px / -0.05em / rgb(36,36,36)
      text: "Measure & hand off"
  - span — l:0 t:96px w:330px h:190px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "We instrument every decision the system makes. You see what it cost, what it saved, what it got wrong. We hand off runbooks and train your team to own it. Or we stay on retainer. Your call."
- div — l:40px t:760px w:1362px h:0.5px  |  background:rgba(153,152,149,.5)
- span — l:34px t:816px w:1100px h:120px  |  type 38px / 600 / 50px / -0.05em / rgb(36,36,36)
    text: "Twenty years of building software taught us one thing about new tools: more than the technology."
  - span
      text: "the question matters"

### Engagements  (top 3520px, height 1120px)
background: rgb(245,245,245)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "IN PRODUCTION"
- span — l:33px t:148px w:880px h:200px  |  type 84px / 600 / 92px / -0.05em / rgb(36,36,36)
    text: "Six places AI earned its keep."
- span — l:962px t:158px w:440px h:160px  |  type 18px / 500 / 27px / -0.04em / rgba(20,20,20,.8)
    text: "A few illustrative engagements named industries, real outcomes. Every number below comes from production telemetry, not a launch deck."
- div — l:40px t:420px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "01 / LEGAL"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "Contract triage & clause extraction"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Vision-LLM pipeline extracts 38 clause types from inbound PDFs. Confidence-scored; anything under 0.92 routes to a paralegal. Audit log per decision, exportable for compliance."
- div — l:504px t:420px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "02 / SUPPORT"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "First-response draft agent"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Reads ticket, pulls customer context from CRM and product analytics. Drafts a reply with cited docs; agent edits and sends. Never auto-sends. The human is always the last keystroke."
- div — l:968px t:420px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "03 / RETAIL"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "Product copy at catalog scale"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Generates titles, descriptions and metadata for 60k SKUs. Tone-of-voice fine-tuning on the brand’s top-100 sellers. Approval queue for new categories; auto-publish for refreshes."
- div — l:40px t:780px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "04 / HEALTHCARE"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "Private knowledge assistant"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "RAG over SOPs, clinical guidelines and 4 years of Slack archives. Every answer cites the source paragraph. No source no answer. Deployed inside the VPC. Zero data leaves the perimeter."
- div — l:504px t:780px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "05 / SUPPLY CHAIN"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "Inbox to system-of-record"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Reads supplier emails, extracts POs, reconciles against ERP. Flags discrepancies; auto-resolves the obvious ones. Replaces a spreadsheet, two macros and a Tuesday meeting."
- div — l:968px t:780px w:434px h:300px
  - div — l:0 t:0 w:434px h:0.5px  |  background:rgba(153,152,149,.5)
  - span — l:0 t:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "06 / MEDIA"
  - span — l:0 t:50px w:410px h:70px  |  type 24px / 600 / 32px / -0.04em / rgb(36,36,36)
      text: "Research copilot for editors"
  - span — l:0 t:132px w:420px h:160px  |  type 16px / 500 / 25px / -0.045em / rgba(20,20,20,.75)
      text: "Searches archives, pulls quotes with provenance, drafts angles. Editor stays in control agent is a faster intern, not a byline. Plagiarism & bias checks built into the pipeline."

### Receipts  (top 4640px, height 760px)
background: rgb(0,0,0)  ·  overflow: hidden

- img — l:0 t:-80px w:1440px h:920px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:linear-gradient(180deg,rgba(0,0,0,.66) 0%,rgba(0,0,0,.34) 45%,rgba(0,0,0,.68) 100%)
- div — l:40px t:90px w:16px h:1.5px  |  background:rgba(180,174,174,.7)
- span — l:40px t:110px  |  type 12px / 500 / 19px / 0.18em / rgba(255,255,255,.55)  |  white-space:nowrap
    text: "TRACK RECORD"
- span — l:34px t:156px w:700px h:120px  |  type 56px / 600 / 62px / -0.05em / rgb(251,251,251)
    text: "Twenty years.Plenty of receipts."
  - br
- span — l:962px t:166px w:440px h:170px  |  type 16px / 500 / 25px / -0.04em / rgba(255,255,255,.75)
    text: "Roars has been shipping production software since 2005 long before large language models, but with the same question driving every decision. AI is the new tool. The discipline is older."
- div — l:40px t:360px w:1362px h:0.5px  |  background:rgba(255,255,255,.22)
- span — l:40px t:382px  |  type 11px / 500 / 0.16em / rgba(255,255,255,.5)  |  white-space:nowrap
    text: "BUILDING SOFTWARE WITH ONE STUBBORN QUESTION IN THE ROOM."
- div — l:40px t:470px w:420px h:190px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "20"
    - span — type 36px / 500 / 86px / -0.05em / rgb(251,251,251)
        text: "Yrs"
  - span — l:0 t:130px w:400px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.7)
      text: "AI & automation systems running for clients across 9 industries."
- div — l:501px t:470px w:420px h:190px
  - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "3"
    - span — type 36px / 500 / 86px / -0.05em / rgb(251,251,251)
        text: "+"
  - span — l:0 t:130px w:400px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.7)
      text: "Weeks. The shortest distance between “what if” and a working pilot."
- div — l:962px t:470px w:440px h:190px
  - div — l:0 t:0 w:440px h:1px  |  background:rgba(255,255,255,.28)
  - div — l:-3px t:30px h:90px  |  display:flex; align-items:baseline
    - span — type 36px / 500 / 86px / -0.05em / rgb(251,251,251)
        text: "$"
    - span — type 84px / 600 / 86px / -0.05em / rgb(251,251,251)
        text: "0"
  - span — l:0 t:130px w:420px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.7)
      text: "No retainer, no engagement, no goodbye fee. We tell you before you sign."

### FAQ  (top 5400px, height 940px)
background: rgb(255,255,255)  ·  overflow: hidden

- div — l:40px t:80px w:1362px h:1.5px  |  background:rgba(153,152,149,.7)
- span — l:40px t:104px  |  type 12px / 500 / 19px / 0.18em / rgb(145,145,145)  |  white-space:nowrap
    text: "FREQUENTLY ASKED"
- span — l:33px t:146px w:900px h:100px  |  type 84px / 600 / 86px / -0.05em / rgb(36,36,36)  |  white-space:nowrap
    text: "The honest answers."
- span — l:962px t:156px w:440px h:120px  |  type 16px / 500 / 25px / -0.04em / rgba(20,20,20,.72)
    text: "The questions we get most often, answered in fewer words than a sales call. If yours isn’t here, ask it directly we’d rather have the conversation than guess at it."
- div — l:40px t:340px w:620px h:500px
  - div — l:0 t:0 w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "01"
    - span — l:44px t:16px w:540px h:44px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "What is AI automation, and how is it different from regular automation?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:70px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "02"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "Which AI automation services does Roars actually offer?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:140px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "03"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "How long does an AI automation project take?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:210px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "04"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "Do you work with our existing tools, or do we have to rebuild?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:280px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "05"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "How do you handle data privacy and security?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:350px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "06"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "Will AI automation replace our team?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
  - div — l:0 t:420px w:620px h:70px
    - div — l:0 t:0 w:620px h:0.5px  |  background:rgba(153,152,149,.5)
    - span — l:0 t:28px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
        text: "07"
    - span — l:44px t:22px w:540px h:30px  |  type 19px / 600 / 25px / -0.04em / rgba(36,36,36,.5)
        text: "How do you know an automation is actually working?"
    - span — l:604px t:31px w:8px h:8px  |  background:rgba(20,20,20,.18); border-radius:50%
    - div — l:0 t:69.5px w:620px h:0.5px  |  background:rgba(153,152,149,.5)
- div — l:722px t:340px w:680px h:500px
  - div — l:0 t:0 w:680px h:400px
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "Traditional automation follows fixed rules — if X, then Y. AI automation handles the messy, judgement-heavy work in between: reading unstructured documents, drafting responses, deciding which path to take, summarising context for a human. We use large language models, retrieval systems and orchestration tools to extend automation into work that used to require a person to think for thirty seconds."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "We design and build custom AI agents, workflow automation across your existing stack, RAG-powered internal assistants, document and email triage systems, AI-augmented support, and integrations between LLMs and the tools your team already uses (CRM, ERP, ticketing, data warehouses). We also run AI readiness audits for teams that aren’t sure where to start."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "A focused pilot ships in 3 to 6 weeks. A production-grade rollout with evaluations, guardrails and human-in-the-loop where it matters typically takes 8 to 14 weeks. We don’t sell year-long engagements that hide the bill. You’ll see value inside the first month, or we tell you to stop."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "We work with what you have. Salesforce, HubSpot, Notion, Slack, Zendesk, Snowflake, custom internal tools we integrate, we don’t replace. The whole point of automation is that the work happens where the work already lives."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "Your data stays your data. We default to private deployments (Azure OpenAI, AWS Bedrock, self-hosted models) and never train foundation models on your information. SOC 2-aligned practices, role-based access, full audit logs, and a clear data-flow diagram before a single line of code is written."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "Not how we build it. Every Roars system has a clear seam between what the AI does and where a human owns the decision. Our best engagements give teams back their afternoons, not their jobs. If a client’s goal is purely headcount reduction, we’re probably not the right agency."
  - div — l:0 t:0 w:680px h:400px  |  opacity:0
    - span — l:0 t:0 w:680px h:280px  |  type 20px / 500 / 32px / -0.04em / rgba(20,20,20,.85)
        text: "We write evaluations before we write prompts. Every decision the system makes is logged, sampled, and graded. You get a dashboard with the metrics that matter to your business not vanity numbers like “tasks completed.” If quality drifts, we get paged. If it doesn’t improve on the baseline, we turn it off."

### CTA  (top 6340px, height 460px)
background: rgb(245,245,245)  ·  overflow: hidden

- span — l:34px t:96px w:860px h:160px  |  type 64px / 600 / 70px / -0.05em / rgb(36,36,36)
    text: "Bring us your least favourite part of the week."
- span — l:38px t:274px w:820px h:100px  |  type 18px / 500 / 27px / -0.04em / rgba(20,20,20,.72)
    text: "A 30-minute call. We listen, ask questions, and tell you whether AI automation is the right answer or whether you’d be better off fixing a process first. Either way, you leave with a clearer head and zero pressure to engage."
- span — l:962px t:100px w:440px h:120px  |  type 22px / 500 / 32px / -0.04em / rgb(20,20,20)
    text: "You get honest answers and a clear next step. No sales theater."
- a — l:962px t:250px w:240px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { transform:translateY(-2px) }  |  href="https://meet.roarsinc.com/suzanne/"
  - span — l:25px t:13px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
      text: "Book a 30-Min Audit"
  - span — l:203px t:19px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
  - span — l:213px t:19px w:8px h:8px  |  background:#FFD400; border-radius:50%
- span — l:962px t:324px  |  type 11px / 500 / 0.16em / rgba(20,20,20,.5)  |  white-space:nowrap
    text: "USA +1 (302) 505-1200 / SALES@ROARSINC.COM"

### Footer  (top 6800px, height 1105px)
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
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.66) 0%,rgba(0,0,0,.24) 44%,rgba(0,0,0,.6) 100%)
- div — display:flex; flex-direction:column; gap:30px
  - div — display:flex; flex-direction:column; gap:14px
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "SERVICES / AI AUTOMATION"
    - div — w:16px h:1.5px  |  background:#FFD400
    - span — type 19px / 500 / 28px / -0.04em / rgba(255,255,255,.94)
        text: "Your team shouldn’t spend time on work a system can own."
    - span — type 15px / 500 / 22px / -0.04em / rgba(255,255,255,.62)
        text: "AI automation that removes friction from real work."
  - div — display:flex; gap:8px
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "80% FEWER MANUAL TASKS"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "3–6 WEEKS TO PILOT"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "HUMANS IN CONTROL"
    - span — type 11px / 500 / 0.12em / rgba(255,255,255,.88)  |  border-radius:60px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.24); padding:7px 13px
        text: "ZERO RETAINER"
  - div — display:flex; flex-direction:column; gap:8px
    - div — display:flex; align-items:center; gap:6px
      - span — type 18px / 600 / -0.04em / rgb(251,251,251)
          text: "roars"
      - img — w:10px h:10px  |  filter:invert(1)  |  src="assets/star-5.svg"
    - span — type 40px / 600 / 42px / -0.05em / rgba(255,255,255,.62)
        text: "AI"
    - span — type 54px / 600 / 56px / -0.055em / rgb(251,251,251)
        text: "automation"
    - span — type 17px / 500 / -0.04em / rgba(255,255,255,.72)
        text: "Services — agents, workflows, plumbing"
  - a — h:48px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 22px  |  href="#form-section"
    - span — type 13px / 500 / rgb(255,255,255)
        text: "Shall we chat?"
    - span — display:flex; gap:3px
      - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — w:8px h:8px  |  background:#FFD400; border-radius:50%
  - div — w:100%  |  type rgba(255,255,255,.88)  |  background:rgba(8,8,8,.92); box-shadow:inset 0 0 0 1px rgba(255,255,255,.16), 0 20px 44px rgba(0,0,0,.5); display:flex; flex-direction:column; padding:18px
    - div — display:flex; align-items:baseline; justify-content:space-between
      - span — type 11px / 600 / 0.2em / rgba(255,255,255,.55)
          text: "EVAL RUN"
      - span — type 11px / 500 / 0.06em / rgba(255,255,255,.55)
          text: "#0092"
    - div — border-top:1px dashed rgba(255,255,255,.22); margin:12px 0
    - div — type 11px / 500 / 17px / 0.02em  |  display:flex; flex-direction:column; gap:10px
      - div
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "contract_triage"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.97 · 38 clauses"
      - div
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "first_response_draft"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.94 · human sends"
      - div
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "clause_extract"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "HOLD · 0.89 · to paralegal"
      - div
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "invoice_to_erp"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.96 · 2 flagged"
      - div
        - span — type rgba(255,255,255,.92)  |  display:block
            text: "kb_answer_cited"
        - span — type rgba(255,255,255,.45)  |  display:block
            text: "PASS · 0.99 · source req."
    - div — border-top:1px dashed rgba(255,255,255,.22); margin:14px 0 12px
    - span — type 10px / 600 / 0.22em / rgba(255,255,255,.5)
        text: "STATUS"
    - div — display:flex; align-items:center; gap:10px
      - span — w:7px h:7px  |  background:#FFD400
      - span — type 12px / 600 / 0.04em / rgb(255,255,255)
          text: "RUNNING EVALS…"
    - div — h:3px  |  background:rgba(255,255,255,.14)
      - div — l:0 t:0 w:72% h:3px  |  background:#FFD400
    - span — type 11px / 500 / 18px / 0.02em / rgba(255,255,255,.55)
        text: "Baseline +38%. Nothing ships without proof it beats the status quo."
    - span — type 10px / 500 / 0.16em / rgba(255,255,255,.4)
        text: "EVALS BEFORE PROMPTS"

### M2 section
padding: 44px 20px 52px · background: rgb(245,245,245) · layout: flex column gap 24px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "WHAT WE BUILD"
- span — type 44px / 600 / 48px / -0.05em / rgb(36,36,36)
    text: "Six ways AI actually earns its place."
- span — type 17px / 500 / 26px / -0.04em / rgba(20,20,20,.8)
    text: "We don’t sell We ship small, specific systems that remove friction from the work your team already does then we measure whether they helped. If they didn’t, we turn them off."
  - span — type 700 / rgb(20,20,20)
      text: "“AI transformation.”"
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "01"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "Custom AI agents"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Goal-driven assistants that can read a ticket, query your CRM, draft a response, and route it for review. Built for one job, evaluated like software, not demoed like magic."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "02"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "Workflow automation"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "End-to-end automation across the apps you already pay for. Trigger from Slack, read from Salesforce, write to Notion, post to Linear with an LLM doing the thinking in between."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "03"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "RAG & knowledge assistants"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Private retrieval systems trained on your contracts, docs, tickets, codebase. Answers cite their sources. No hallucinated policies. No “based on my training data” disclaimers."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "04"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "Document intelligence"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Pull structured data out of PDFs, invoices, contracts and emails. Validate against your schema. Hand only the edge cases to a human. The other 80% just… happens."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "05"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "LLM integration"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Bring AI into the products and tools your team already lives in. Private model routing, prompt management, telemetry, cost controls the unglamorous plumbing that makes it work in production."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "06"
  - span — type 22px / 600 / 28px / -0.04em / rgb(36,36,36)
      text: "AI readiness audit"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Two weeks. We sit with your team, map the work, find the three highest-ROI automations and the three to never attempt. You get a build plan and a clear “no.” If you want."

### M3 section (dark)
padding: 48px 20px 52px · background: #000 · layout: flex column gap 24px
- img — l:0 t:-6% w:100% h:112%  |  object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.68) 0%,rgba(0,0,0,.36) 50%,rgba(0,0,0,.68) 100%)
- div — display:flex; flex-direction:column; gap:24px
  - div — display:flex; flex-direction:column; gap:10px
    - div — w:16px h:1.5px  |  background:rgba(180,174,174,.7)
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "FEATURED WORK"
  - span — type 44px / 600 / 46px / -0.05em / rgb(251,251,251)
      text: "GYMBAIT.AI"
  - span — type 17px / 500 / 26px / -0.04em / rgba(255,255,255,.9)
      text: "Unleash your potential with bespoke Artificial Intelligence Training. GymBAIT flipped the script by using AI to predict engagement gaps, adapt routines to individual goals, and offer encouragement when users lag."
  - div — border-top:.5px solid rgba(255,255,255,.22); display:flex; flex-direction:column; gap:16px
    - div — display:flex; flex-direction:column; gap:4px
      - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
          text: "SYSTEM"
      - span — type 17px / 500 / -0.04em / rgba(255,255,255,.9)
          text: "Engagement prediction"
    - div — display:flex; flex-direction:column; gap:4px
      - span — type 11px / 500 / 0.16em / rgba(255,255,255,.55)
          text: "HUMAN IN THE LOOP"
      - span — type 17px / 500 / -0.04em / rgba(255,255,255,.9)
          text: "Coach reviews every nudge"
  - a — h:48px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 22px  |  href="https://www.roarsinc.com/work/gymbait/"
    - span — type 13px / 500 / rgb(255,255,255)
        text: "View Project"
    - span — display:flex; gap:3px
      - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — w:8px h:8px  |  background:#FFD400; border-radius:50%

### M4 section
padding: 44px 20px 52px · background: #fff · layout: flex column gap 24px
- div — display:flex; flex-direction:column; gap:10px
  - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "HOW WE WORK"
- span — type 46px / 600 / 48px / -0.05em / rgb(36,36,36)
    text: "Ask first. Build second."
- span — type 16px / 500 / 24px / -0.04em / rgba(20,20,20,.72)
    text: "Every Roars engagement starts with the same question: does this actually help someone? If it doesn’t, we tell you before we take the brief. If it does, here’s how we get from idea to in-production."
- div — display:flex; flex-direction:column
  - div — display:flex; flex-direction:column; gap:10px; padding:0 0 32px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - div — display:flex; flex-direction:column; gap:3px
      - span — type 11px / 600 / 0.16em / rgb(20,20,20)
          text: "WEEK 1"
      - span — type 11px / 500 / 0.16em / rgb(145,145,145)
          text: "DISCOVERY"
    - span — type 28px / 600 / 34px / -0.05em / rgb(36,36,36)
        text: "Ask the right question"
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
        text: "We sit with your team and map the work. Not the org chart — the actual hour-by-hour. We’re looking for friction, repetition, and the moments where a person is doing what a system should."
  - div — display:flex; flex-direction:column; gap:10px; padding:0 0 32px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - div — display:flex; flex-direction:column; gap:3px
      - span — type 11px / 600 / 0.16em / rgb(20,20,20)
          text: "WEEK 2"
      - span — type 11px / 500 / 0.16em / rgb(145,145,145)
          text: "ARCHITECTURE"
    - span — type 28px / 600 / 34px / -0.05em / rgb(36,36,36)
        text: "Map the system"
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
        text: "Data flows, decision points, edge cases, human-in-the-loop gates. We draw the whole thing before we touch a model. You sign off on a diagram, not a vibe."
  - div — display:flex; flex-direction:column; gap:10px; padding:0 0 32px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - div — display:flex; flex-direction:column; gap:3px
      - span — type 11px / 600 / 0.16em / rgb(20,20,20)
          text: "WEEKS 3–6"
      - span — type 11px / 500 / 0.16em / rgb(145,145,145)
          text: "PILOT"
    - span — type 28px / 600 / 34px / -0.05em / rgb(36,36,36)
        text: "Build & evaluate"
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
        text: "Working pilot inside your stack. Real data, real users, real tests. We write evals before we write prompts. Nothing ships without measurable proof it’s better than the status quo."
  - div — display:flex; flex-direction:column; gap:10px; padding:0 0 6px 26px
    - span — l:-7px t:4px w:13px h:13px  |  background:#fff; box-shadow:inset 0 0 0 1.5px rgba(20,20,20,.5)
    - div — display:flex; flex-direction:column; gap:3px
      - span — type 11px / 600 / 0.16em / rgb(20,20,20)
          text: "WEEKS 7+"
      - span — type 11px / 500 / 0.16em / rgb(145,145,145)
          text: "PRODUCTION"
    - span — type 28px / 600 / 34px / -0.05em / rgb(36,36,36)
        text: "Measure & hand off"
    - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
        text: "We instrument every decision the system makes. You see what it cost, what it saved, what it got wrong. We hand off runbooks and train your team to own it. Or we stay on retainer. Your call."
- span — type 26px / 600 / 36px / -0.05em / rgb(36,36,36)  |  border-top:.5px solid rgba(153,152,149,.5)
    text: "Twenty years of building software taught us one thing about new tools: more than the technology."
  - span
      text: "the question matters"

### M5 section
padding: 44px 20px 52px · background: rgb(245,245,245) · layout: flex column gap 24px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "IN PRODUCTION"
- span — type 44px / 600 / 48px / -0.05em / rgb(36,36,36)
    text: "Six places AI earned its keep."
- span — type 17px / 500 / 26px / -0.04em / rgba(20,20,20,.8)
    text: "A few illustrative engagements named industries, real outcomes. Every number below comes from production telemetry, not a launch deck."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "01 / LEGAL"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "Contract triage & clause extraction"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Vision-LLM pipeline extracts 38 clause types from inbound PDFs. Confidence-scored; anything under 0.92 routes to a paralegal. Audit log per decision, exportable for compliance."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "02 / SUPPORT"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "First-response draft agent"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Reads ticket, pulls customer context from CRM and product analytics. Drafts a reply with cited docs; agent edits and sends. Never auto-sends. The human is always the last keystroke."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "03 / RETAIL"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "Product copy at catalog scale"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Generates titles, descriptions and metadata for 60k SKUs. Tone-of-voice fine-tuning on the brand’s top-100 sellers. Approval queue for new categories; auto-publish for refreshes."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "04 / HEALTHCARE"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "Private knowledge assistant"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "RAG over SOPs, clinical guidelines and 4 years of Slack archives. Every answer cites the source paragraph. No source no answer. Deployed inside the VPC. Zero data leaves the perimeter."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "05 / SUPPLY CHAIN"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "Inbox to system-of-record"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Reads supplier emails, extracts POs, reconciles against ERP. Flags discrepancies; auto-resolves the obvious ones. Replaces a spreadsheet, two macros and a Tuesday meeting."
- div — border-top:.5px solid rgba(153,152,149,.5); display:flex; flex-direction:column; gap:10px
  - span — type 11px / 500 / 0.14em / rgb(145,145,145)
      text: "06 / MEDIA"
  - span — type 22px / 600 / 29px / -0.04em / rgb(36,36,36)
      text: "Research copilot for editors"
  - span — type 15px / 500 / 23px / -0.045em / rgba(20,20,20,.75)
      text: "Searches archives, pulls quotes with provenance, drafts angles. Editor stays in control agent is a faster intern, not a byline. Plagiarism & bias checks built into the pipeline."

### M6 section (dark)
padding: 48px 20px 52px · background: #000 · layout: flex column gap 24px
- img — l:0 t:-6% w:100% h:112%  |  object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.4) 45%,rgba(0,0,0,.72) 100%)
- div — display:flex; flex-direction:column; gap:24px
  - div — display:flex; flex-direction:column; gap:10px
    - div — w:16px h:1.5px  |  background:rgba(180,174,174,.7)
    - span — type 11px / 500 / 0.18em / rgba(255,255,255,.55)
        text: "TRACK RECORD"
  - span — type 38px / 600 / 44px / -0.05em / rgb(251,251,251)
      text: "Twenty years.Plenty of receipts."
    - br
  - span — type 16px / 500 / 24px / -0.04em / rgba(255,255,255,.75)
      text: "Roars has been shipping production software since 2005 long before large language models, but with the same question driving every decision. AI is the new tool. The discipline is older."
  - span — type 11px / 500 / 18px / 0.16em / rgba(255,255,255,.5)  |  border-top:.5px solid rgba(255,255,255,.22)
      text: "BUILDING SOFTWARE WITH ONE STUBBORN QUESTION IN THE ROOM."
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "20"
      - span — type 26px / 500
          text: "Yrs"
    - span — type 15px / 500 / 22px / -0.04em / rgba(255,255,255,.7)
        text: "AI & automation systems running for clients across 9 industries."
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "3"
      - span — type 26px / 500
          text: "+"
    - span — type 15px / 500 / 22px / -0.04em / rgba(255,255,255,.7)
        text: "Weeks. The shortest distance between “what if” and a working pilot."
  - div — border-top:1px solid rgba(255,255,255,.28); display:flex; flex-direction:column; gap:8px
    - span — type 62px / 600 / 64px / -0.05em / rgb(251,251,251)
        text: "0"
      - span — type 26px / 500
          text: "$"
    - span — type 15px / 500 / 22px / -0.04em / rgba(255,255,255,.7)
        text: "No retainer, no engagement, no goodbye fee. We tell you before you sign."

### M7 section
padding: 44px 20px 52px · background: #fff · layout: flex column gap 22px
- div — display:flex; flex-direction:column; gap:10px
  - div — h:1.5px  |  background:rgba(153,152,149,.7)
  - span — type 11px / 500 / 0.18em / rgb(145,145,145)
      text: "FREQUENTLY ASKED"
- span — type 44px / 600 / 48px / -0.05em / rgb(36,36,36)
    text: "The honest answers."
- span — type 16px / 500 / 24px / -0.04em / rgba(20,20,20,.72)
    text: "The questions we get most often, answered in fewer words than a sales call. If yours isn’t here, ask it directly we’d rather have the conversation than guess at it."
- div — display:flex; flex-direction:column
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "01"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "What is AI automation, and how is it different from regular automation?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "Traditional automation follows fixed rules — if X, then Y. AI automation handles the messy, judgement-heavy work in between: reading unstructured documents, drafting responses, deciding which path to take, summarising context for a human. We use large language models, retrieval systems and orchestration tools to extend automation into work that used to require a person to think for thirty seconds."
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "02"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "Which AI automation services does Roars actually offer?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "We design and build custom AI agents, workflow automation across your existing stack, RAG-powered internal assistants, document and email triage systems, AI-augmented support, and integrations between LLMs and the tools your team already uses (CRM, ERP, ticketing, data warehouses). We also run AI readiness audits for teams that aren’t sure where to start."
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "03"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "How long does an AI automation project take?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "A focused pilot ships in 3 to 6 weeks. A production-grade rollout with evaluations, guardrails and human-in-the-loop where it matters typically takes 8 to 14 weeks. We don’t sell year-long engagements that hide the bill. You’ll see value inside the first month, or we tell you to stop."
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "04"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "Do you work with our existing tools, or do we have to rebuild?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "We work with what you have. Salesforce, HubSpot, Notion, Slack, Zendesk, Snowflake, custom internal tools we integrate, we don’t replace. The whole point of automation is that the work happens where the work already lives."
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "05"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "How do you handle data privacy and security?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "Your data stays your data. We default to private deployments (Azure OpenAI, AWS Bedrock, self-hosted models) and never train foundation models on your information. SOC 2-aligned practices, role-based access, full audit logs, and a clear data-flow diagram before a single line of code is written."
  - div — border-top:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "06"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "Will AI automation replace our team?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "Not how we build it. Every Roars system has a clear seam between what the AI does and where a human owns the decision. Our best engagements give teams back their afternoons, not their jobs. If a client’s goal is purely headcount reduction, we’re probably not the right agency."
  - div — border-top:.5px solid rgba(153,152,149,.5); border-bottom:.5px solid rgba(153,152,149,.5)  |  data-macc="1"
    - div — display:flex; align-items:flex-start; gap:14px; padding:16px 0
      - span — w:22px  |  type 11px / 500 / 0.14em / rgb(145,145,145)
          text: "07"
      - span — type 18px / 600 / 25px / -0.04em / rgb(36,36,36)  |  flex:1
          text: "How do you know an automation is actually working?"
      - span — w:24px h:24px  |  type 20px / 300 / rgba(20,20,20,.5)  |  display:flex; align-items:center; justify-content:center; flex:none
          text: "+"
    - div — h:0  |  overflow:hidden
      - div — padding:0 0 18px 36px
        - span — type 16px / 500 / 26px / -0.04em / rgba(20,20,20,.85)
            text: "We write evaluations before we write prompts. Every decision the system makes is logged, sampled, and graded. You get a dashboard with the metrics that matter to your business not vanity numbers like “tasks completed.” If quality drifts, we get paged. If it doesn’t improve on the baseline, we turn it off."

### M8 section
padding: 44px 20px 52px · background: rgb(245,245,245) · layout: flex column gap 20px
- span — type 40px / 600 / 44px / -0.05em / rgb(36,36,36)
    text: "Bring us your least favourite part of the week."
- span — type 17px / 500 / 26px / -0.04em / rgba(20,20,20,.72)
    text: "A 30-minute call. We listen, ask questions, and tell you whether AI automation is the right answer or whether you’d be better off fixing a process first. Either way, you leave with a clearer head and zero pressure to engage."
- span — type 20px / 500 / 30px / -0.04em / rgb(20,20,20)
    text: "You get honest answers and a clear next step. No sales theater."
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="https://meet.roarsinc.com/suzanne/"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Book a 30-Min Audit"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#FFD400; border-radius:50%
- span — type 11px / 500 / 0.16em / rgba(20,20,20,.5)
    text: "USA +1 (302) 505-1200 / SALES@ROARSINC.COM"

### M9 section (dark)
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
    const H = 7905;
    const DARK = [[0, 840], [1900, 2520], [4640, 5400], [6800, H]];
    const accent = this.props.accent || '#FFD400';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      || this.props.motion === false;

    this.paintAccent = () => {
      document.querySelectorAll('[data-accent-bg]').forEach(el => { el.style.background = accent; });
      document.querySelectorAll('[data-accent-tx]').forEach(el => { el.style.color = accent; });
    };

    // ── hero terminal: eval rows resolving one by one ─────────────────
    this.terminal = () => {
      const rows = [...document.querySelectorAll('[data-row]')];
      const status = document.querySelector('[data-status]');
      const bar = document.querySelector('[data-progress]');
      const run = document.querySelector('[data-run]');
      if (!rows.length) return;
      let i = 0;
      const paint = () => {
        rows.forEach((r, k) => {
          const done = k <= i;
          r.style.opacity = done ? '1' : '.34';
          const v = r.querySelector('[data-verdict]');
          if (v) {
            const hold = v.textContent.indexOf('HOLD') === 0;
            v.style.color = done ? (hold ? accent : 'rgba(255,255,255,.62)') : 'rgba(255,255,255,.3)';
          }
        });
        if (bar) bar.style.width = Math.round(((i + 1) / rows.length) * 100) + '%';
        if (status) status.textContent = i >= rows.length - 1 ? 'BASELINE BEATEN \u00b7 SHIPPING' : 'RUNNING EVALS\u2026';
      };
      paint();
      if (reduce) { i = rows.length - 1; paint(); return; }
      let n = 92;
      this.evalId = setInterval(() => {
        i = (i + 1) % rows.length;
        if (i === 0 && run) { n += 1; run.textContent = '#' + String(n).padStart(4, '0'); }
        paint();
      }, 1500);
    };

    // ── FAQ two-pane ─────────────────────────────────────────────────
    this.faq = () => {
      const qs = [...document.querySelectorAll('[data-q]')];
      const as = [...document.querySelectorAll('[data-a]')];
      if (!qs.length) return;
      const select = n => {
        qs.forEach(q => {
          const on = +q.getAttribute('data-q') === n;
          const name = q.querySelector('[data-q-name]');
          const dot = q.querySelector('[data-q-dot]');
          const num = q.querySelector('[data-q-num]');
          if (name) {
            name.style.color = on ? 'rgb(20,20,20)' : 'rgba(36,36,36,.5)';
            name.style.transform = on ? 'translateX(8px)' : 'none';
          }
          if (dot) dot.style.background = on ? accent : 'rgba(20,20,20,.18)';
          if (num) num.style.color = on ? 'rgb(20,20,20)' : 'rgb(145,145,145)';
        });
        as.forEach(a => {
          const on = +a.getAttribute('data-a') === n;
          a.style.opacity = on ? '1' : '0';
          a.style.pointerEvents = on ? 'auto' : 'none';
          a.style.transform = on ? 'none' : 'translateY(10px)';
        });
      };
      qs.forEach(q => {
        const n = +q.getAttribute('data-q');
        q.addEventListener('mouseenter', () => select(n));
        q.addEventListener('click', () => select(n));
      });
      select(this.props.openQuestion != null ? Math.min(6, Math.max(0, this.props.openQuestion | 0)) : 0);
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

    // horizontal process rail draws as the section crosses the viewport
    this.motion = () => {
      const rail = document.querySelector('[data-rail]');
      if (rail) {
        const r = rail.getBoundingClientRect();
        let prog = (innerHeight * 0.78 - r.top) / (innerHeight * 0.55);
        prog = Math.min(1, Math.max(0, prog));
        const px = prog * 1362;
        const fill = document.querySelector('[data-rail-fill]');
        if (fill) fill.style.width = px.toFixed(1) + 'px';
        const nodes = [...document.querySelectorAll('[data-node]')];
        let last = -1;
        nodes.forEach(n => { if (px >= +n.getAttribute('data-nx') - 2) last = +n.getAttribute('data-node'); });
        nodes.forEach(n => {
          const i = +n.getAttribute('data-node');
          const on = px >= +n.getAttribute('data-nx') - 2;
          n.style.background = on ? accent : 'rgb(255,255,255)';
          n.style.boxShadow = 'inset 0 0 0 1.5px ' + (on ? accent : 'rgba(20,20,20,.5)');
          n.style.transform = last === i ? 'scale(1.3) rotate(45deg)' : 'scale(1)';
        });
      }
      if (reduce) return;
      document.querySelectorAll('[data-par]').forEach(el => {
        const f = parseFloat(el.getAttribute('data-par'));
        const rr = el.getBoundingClientRect();
        const off = ((rr.top + rr.height / 2) - innerHeight / 2) * f;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
      const tm = document.querySelector('[data-terminal]');
      if (tm) {
        const rr = tm.getBoundingClientRect();
        const k = ((rr.top + rr.height / 2) - innerHeight / 2) / innerHeight;
        tm.style.transform = 'translate3d(0,' + (k * -40).toFixed(1) + 'px,0)';
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
          if (reduce || target === 0) { el.textContent = target; return; }
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
          if (el.hasAttribute && (el.hasAttribute('data-par') || el.hasAttribute('data-rail') || el.hasAttribute('data-terminal'))) return;
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
    this.terminal();
    this.faq();
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
    if (this.evalId) clearInterval(this.evalId);
  }
}
```