# Menu — element spec

Source prototype: `design/Roars v2 - Menu.dc.html`

## Head / global CSS
```
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=IBM+Plex+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#050505; }
  body { font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  * { box-sizing:border-box; }
  a { color:inherit; text-decoration:none; }
  a:hover { color:#FFD400; }
</style>
```

## Tweakable props
```json
{
  "accent": {
    "editor": "color",
    "default": "#FFD400",
    "tsType": "string",
    "options": [
      "#FFD400",
      "#FFFFFF",
      "#FF7A00",
      "#4ADE80"
    ]
  },
  "openOnLoad": {
    "editor": "boolean",
    "default": true,
    "tsType": "boolean",
    "section": "Behaviour"
  },
  "reveal": {
    "editor": "enum",
    "options": [
      "circle",
      "curtain",
      "fade"
    ],
    "default": "circle",
    "tsType": "string",
    "section": "Behaviour"
  },
  "motion": {
    "editor": "boolean",
    "default": true,
    "tsType": "boolean",
    "section": "Behaviour"
  }
}
```

## Full element tree

- div — w:100%  |  background:#000000; overflow:hidden
  - div — l:0 t:0 w:1440px h:150px  |  z-index:90
    - div
      - div — l:39px t:36px w:1366px h:111px
        - a — l:-9px t:-4px w:52px h:52px  |  border-radius:999px; display:flex; align-items:center; justify-content:center  |  href="Roars v2 - Main.dc.html"
          - img — w:26px h:auto  |  display:block; filter:brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)  |  src="brand/roars-mark.png"  |  alt="Roars"
        - span — l:1246px t:16px  |  type 10px / 500 / 0.2em / rgba(255,255,255,.66)  |  white-space:nowrap
            text: "CLOSE"
        - div — l:1330px t:6px w:46px h:30px  |  display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:4px
          - span — w:26px h:2px  |  background:rgb(255,255,255); display:block
          - span — w:26px h:2px  |  background:rgb(255,255,255); display:block
  - div — l:0 t:0  |  right:0; bottom:0; background:#000; display:none; overflow:hidden
    - img — l:0 t:0 w:100% h:100%  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
    - div — l:0 h:60%  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.8) 70%,rgb(0,0,0) 100%)
    - div — l:20px  |  right:20px; bottom:48px; display:flex; flex-direction:column; gap:12px
      - span — type 88px / 600 / 76px / -0.05em / rgb(251,251,251)
          text: "roars"
      - span — type 15px / 500 / 22px / -0.03em / rgba(255,255,255,.8)
          text: "Product Developmentfor Startups & SMEs"
        - br
  - div — w:1440px h:900px  |  background:#000000
    - div — l:0 t:0 w:1440px h:900px  |  background:rgb(255,255,255); overflow:hidden  |  data-screen-label="Page behind"
      - img — l:433px t:-106px w:1553.732px h:1035.948px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
      - div — l:330px t:0 w:190px h:900px  |  background:linear-gradient(90deg,rgb(255,255,255) 0%,rgba(255,255,255,.92) 32%,rgba(255,255,255,0) 100%)
      - div — l:395px t:258px w:89px h:78px  |  overflow:hidden
        - div — l:0 t:3px w:75px h:75px  |  background:radial-gradient(52.9% 52.9% at 90.36% 15.66%, rgb(78,73,72) 0%, rgb(0,0,0) 100%); border-radius:60px
        - div — l:75px t:0 w:14px h:14px  |  background:rgb(6,6,6); border-radius:60px
      - div — l:488.849px t:477px w:682.151px h:323px  |  overflow:hidden
        - span — l:13.151px t:75px w:555px h:186px  |  type 212px / 600 / 86px / -0.04em / rgb(251,251,251)  |  white-space:nowrap
            text: "roars"
        - span — l:246.151px t:356px w:220px h:48px  |  type 16px / 500 / 24px / -0.03em / rgb(255,255,255)
            text: "Product Developmentfor Startups & SMEs"
          - br
      - div — l:39px t:600px w:249px h:96px  |  overflow:hidden
        - div — l:0 t:0 w:200px h:96px  |  type 14px / 600 / 24px / -0.05em / rgb(0,0,0)  |  white-space:nowrap
            text: "Product DevelopmentUI/UX and Product DesignMobile App DevelopmentAI Automation"
          - br
          - br
          - br
  - div — l:0 t:0 h:64px  |  right:0; display:none; align-items:center; justify-content:space-between; padding:0 16px; z-index:95
    - a — w:44px h:44px  |  display:flex; align-items:center; justify-content:center  |  href="Roars v2 - Main.dc.html"
      - img — w:24px h:auto  |  display:block; filter:brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)  |  src="brand/roars-mark.png"  |  alt="Roars"
    - div — display:flex; align-items:center; gap:12px
      - span — type 10px / 500 / 0.2em / rgba(255,255,255,.66)  |  white-space:nowrap
          text: "CLOSE"
      - div — w:44px h:44px  |  display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:4px
        - span — w:24px h:2px  |  background:rgb(255,255,255); display:block
        - span — w:24px h:2px  |  background:rgb(255,255,255); display:block
  - div — l:0 t:0  |  right:0; bottom:0; background:#050505; overflow:hidden; z-index:70  |  data-menu="1"
    - img — l:-2% t:-2% w:104% h:104%  |  opacity:.3; transform:scale(1.04); object-fit:cover  |  src="assets/space.jpg"
    - div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(5,5,5,.62) 0%,rgba(5,5,5,.86) 58%,rgba(5,5,5,.97) 100%)
    - div — l:0 t:0  |  right:0; bottom:0; display:none; padding:80px 20px 44px
      - span — type 10px / 500 / 0.2em / rgba(255,255,255,.45)  |  display:block
          text: "NAVIGATION"
      - div — w:16px h:1.5px  |  background:#FFD400
      - div — border-top:1px solid rgba(255,255,255,.12); display:flex; flex-direction:column
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "01"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "home"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Main.dc.html"
                - span
                    text: "Overview"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Approach.dc.html"
                - span
                    text: "How we work"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Projects.dc.html"
                - span
                    text: "Selected work"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "02"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "about us"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Agency.dc.html"
                - span
                    text: "The agency"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Agency.dc.html"
                - span
                    text: "Leadership & team"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Brand Guidelines.dc.html"
                - span
                    text: "Brand guidelines"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "03"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "approach"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Approach.dc.html"
                - span
                    text: "Discovery"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Approach.dc.html"
                - span
                    text: "Design"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Approach.dc.html"
                - span
                    text: "Build"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Approach.dc.html"
                - span
                    text: "Launch & scale"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "04"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "work"
            - span — type 9px / 500 / 0.16em / rgba(255,255,255,.5)  |  white-space:nowrap
                text: "10 PROJECTS"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "Snowman Logistics"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "GymBait.AI"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "Parqly"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "Concierge Loyalty"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "GISAID"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars  v2 - Project Detail.dc.html"
                - span
                    text: "Advisee"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Projects.dc.html"
                - span
                    text: "All 10 projects"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "05"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "industries"
            - span — type 9px / 500 / 0.16em / rgba(255,255,255,.5)  |  white-space:nowrap
                text: "8 SECTORS"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Restaurant"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Fitness"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "eCommerce"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Travel"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Logistics"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "SaaS"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Healthcare"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Industries.dc.html"
                - span
                    text: "Concierge"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "06"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "services"
            - span — type 9px / 500 / 0.16em / rgba(255,255,255,.5)  |  white-space:nowrap
                text: "5 SERVICES"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Main.dc.html"
                - span
                    text: "Product Development"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Main.dc.html"
                - span
                    text: "User Experience Design"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Main.dc.html"
                - span
                    text: "Mobile App Development"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Main.dc.html"
                - span
                    text: "MVP Development"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - AI Automation.dc.html"
                - span
                    text: "AI Automation"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "07"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "resources"
            - span — type 9px / 500 / 0.16em / rgba(255,255,255,.5)  |  white-space:nowrap
                text: "3 KITS"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Guides.dc.html"
                - span
                    text: "Guides"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Insights.dc.html"
                - span
                    text: "Insights"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Brand Guidelines.dc.html"
                - span
                    text: "Brand guidelines"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "08"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "our journal"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Insight-details.dc.html"
                - span
                    text: "AI App Development vs Traditional App Development"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Insight-details.dc.html"
                - span
                    text: "20 Years of Roars: Built on Purpose, Driven by Impact"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Insight-details.dc.html"
                - span
                    text: "The Unexpected Insight — We built a meal planning app"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Insights.dc.html"
                - span
                    text: "All insights"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
        - div — border-bottom:1px solid rgba(255,255,255,.12)
          - div — display:flex; align-items:center; gap:14px; padding:14px 0
            - span — w:22px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.55)
                text: "09"
            - span — type 28px / 600 / 34px / -0.05em / rgba(255,255,255,.92)  |  flex:1
                text: "contact us"
            - span — w:24px h:24px  |  type 20px / 300 / 1 / rgba(255,255,255,.5)  |  display:flex; align-items:center; justify-content:center
                text: "+"
          - div — h:0  |  overflow:hidden
            - div — display:flex; flex-direction:column
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Contact.dc.html"
                - span
                    text: "Book a discovery call"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
              - a — type 16px / 500 / 22px / -0.03em / rgba(255,255,255,.72)  |  display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 0 12px 36px  |  href="Roars v2 - Contact.dc.html"
                - span
                    text: "Contact details"
                - span — type 14px / rgba(255,255,255,.35)
                    text: "→"
      - div — border-top:1px solid rgba(153,152,149,.4); display:flex; flex-direction:column; gap:20px
        - div — display:flex; gap:24px 40px
          - div — display:flex; flex-direction:column; gap:6px
            - span — type 10px / 500 / 0.2em / rgba(255,255,255,.62)
                text: "USA"
            - a — type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap  |  href="tel:+13025051200"
                text: "+1 (302) 505-1200"
          - div — display:flex; flex-direction:column; gap:6px
            - span — type 10px / 500 / 0.2em / rgba(255,255,255,.62)
                text: "UK"
            - a — type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap  |  href="tel:+447537183399"
                text: "+44 (7537) 183399"
          - div — display:flex; flex-direction:column; gap:6px
            - span — type 10px / 500 / 0.2em / rgba(255,255,255,.62)
                text: "EMAIL"
            - a — type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap  |  href="mailto:sales@roarsinc.com"
                text: "sales@roarsinc.com"
        - a — w:100% h:52px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 22px  |  href="Roars v2 - Contact.dc.html"
          - span — type 13px / 500 / -0.03em / rgb(255,255,255)
              text: "Book a discovery call"
          - span — display:flex; gap:3px
            - span — w:8px h:8px  |  background:rgba(153,152,149,.7); border-radius:50%
            - span — w:8px h:8px  |  background:#FFD400; border-radius:50%
    - div — l:0 t:0 w:1440px h:900px
      - div — l:39px t:150px w:400px h:614px
        - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
            text: "NAVIGATION"
        - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
        - a — l:0 t:50px w:400px h:60px  |  display:block  |  href="Roars v2 - Main.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "01"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "home"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:110px w:400px h:60px  |  display:block  |  href="Roars v2 - Agency.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "02"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "about us"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:170px w:400px h:60px  |  display:block  |  href="Roars v2 - Approach.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "03"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "approach"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:230px w:400px h:60px  |  display:block  |  href="Roars v2 - Projects.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "04"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "work"
          - span — l:264px t:27px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
              text: "10 PROJECTS"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:290px w:400px h:60px  |  display:block  |  href="Roars v2 - Industries.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "05"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "industries"
          - span — l:274px t:27px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
              text: "8 SECTORS"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:350px w:400px h:60px  |  display:block  |  href="Roars v2 - AI Automation.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "06"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "services"
          - span — l:266px t:27px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
              text: "5 SERVICES"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:410px w:400px h:60px  |  display:block  |  href="Roars v2 - Resources.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "07"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "resources"
          - span — l:286px t:27px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
              text: "3 KITS"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:470px w:400px h:60px  |  display:block  |  href="Roars v2 - Insights.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "08"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "our journal"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
        - a — l:0 t:530px w:400px h:60px  |  display:block  |  href="Roars v2 - Contact.dc.html"
          - div — l:0 t:0 w:400px h:1px  |  background:rgba(255,255,255,.12)
          - div — l:0 t:59px w:400px h:1px  |  background:rgba(255,255,255,.12)
          - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
              text: "09"
          - span — l:26px t:30px w:6px h:6px  |  background:#FFD400; border-radius:50%; opacity:0
          - span — l:44px t:14px  |  type 32px / 600 / 36px / -0.05em / rgba(255,255,255,.72)  |  white-space:nowrap
              text: "contact us"
          - span — l:372px t:22px  |  type 16px / 16px / rgba(255,255,255,.6)  |  opacity:0
              text: "→"
      - div — l:470px t:150px w:1px h:614px  |  background:rgba(255,255,255,.14)
      - div — l:520px t:150px w:881px h:614px
        - div — l:0 t:0 w:881px h:614px  |  data-panel="-1"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "ROARS — SINCE 2005"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:720px h:200px  |  type 60px / 600 / 64px / -0.05em / rgb(251,251,251)
              text: "We create delightful experiences that matters."
          - span — l:0 t:270px  |  type 11px / 500 / 0.18em / rgba(255,255,255,.5)  |  white-space:nowrap
              text: "20 YEARS OF EXCELLENCE IN PRODUCT CONSULTING"
          - div — l:0 t:330px w:860px h:130px
            - div — l:0 t:0 w:250px h:130px
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 56px / 600 / 56px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
                  text: "20+"
              - span — l:0 t:96px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "YEARS IN PRODUCT"
            - div — l:290px t:0 w:250px h:130px
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 56px / 600 / 56px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
                  text: "250+"
              - span — l:0 t:96px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "PROJECTS DELIVERED"
            - div — l:580px t:0 w:250px h:130px
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 56px / 600 / 56px / -0.05em / rgb(255,255,255)  |  white-space:nowrap
                  text: "96%"
              - span — l:0 t:96px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "RETURNING CUSTOMERS"
          - span — l:0 t:520px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)  |  white-space:nowrap
              text: "HOVER A SECTION TO EXPLORE"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="0"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "01 — HOME"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:120px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Space of Product Solutions"
          - span — l:0 t:190px w:440px h:92px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.66)
              text: "Product development for startups and SMEs. Strategy, design and engineering under one roof, run by the same team since 2005."
          - div — l:0 t:310px w:860px h:200px
            - a — l:0 t:0 w:420px h:58px  |  display:block  |  href="Roars v2 - Main.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "Overview"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
            - a — l:0 t:58px w:420px h:58px  |  display:block  |  href="Roars v2 - Approach.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "How we work"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
            - a — l:0 t:116px w:420px h:58px  |  display:block  |  href="Roars v2 - Projects.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - div — l:0 t:57px w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "Selected work"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="1"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "02 — ABOUT US"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:120px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "The team behind 250 products"
          - span — l:0 t:190px w:440px h:92px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.66)
              text: "Founded in 2005 by Riinkesh A Sshah. Eight senior people, five ventures of our own, and clients who come back for the next build."
          - div — l:0 t:310px w:860px h:230px
            - a — l:0 t:0 w:420px h:58px  |  display:block  |  href="Roars v2 - Agency.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "The agency"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
            - a — l:0 t:58px w:420px h:58px  |  display:block  |  href="Roars v2 - Agency.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "Leadership & team"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
            - a — l:0 t:116px w:420px h:58px  |  display:block  |  href="Roars v2 - Brand Guidelines.dc.html"
              - div — l:0 t:0 w:420px h:1px  |  background:rgba(255,255,255,.18)
              - div — l:0 t:57px w:420px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 20px / 600 / 24px / -0.04em / rgba(255,255,255,.9)
                  text: "Brand guidelines"
              - span — l:390px t:22px  |  type 14px / rgba(255,255,255,.5)
                  text: "→"
            - div — l:490px t:0 w:370px h:174px
              - div — l:0 t:0 w:370px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:20px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "OUR OWN VENTURES"
              - span — l:0 t:52px w:370px h:120px  |  type 18px / 500 / 30px / -0.04em / rgba(255,255,255,.82)
                  text: "Produit · Hostwala · UX Audit ProMicrokopy · GetAutomation"
                - br
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="2"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "03 — APPROACH"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:120px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "How an engagement runs"
          - span — l:0 t:190px w:440px h:60px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.66)
              text: "Four stages, a named project manager, and a monthly cadence you can scale up or down."
          - div — l:0 t:280px w:860px h:260px
            - a — l:0 t:0 w:700px h:62px  |  display:block  |  href="Roars v2 - Approach.dc.html"
              - div — l:0 t:0 w:700px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "01"
              - span — l:44px t:18px  |  type 24px / 600 / 28px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Discovery"
              - span — l:300px t:24px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Workshops, market review, product definition"
            - a — l:0 t:62px w:700px h:62px  |  display:block  |  href="Roars v2 - Approach.dc.html"
              - div — l:0 t:0 w:700px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "02"
              - span — l:44px t:18px  |  type 24px / 600 / 28px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Design"
              - span — l:300px t:24px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Flows, prototypes, a tested interface"
            - a — l:0 t:124px w:700px h:62px  |  display:block  |  href="Roars v2 - Approach.dc.html"
              - div — l:0 t:0 w:700px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "03"
              - span — l:44px t:18px  |  type 24px / 600 / 28px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Build"
              - span — l:300px t:24px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Two-week sprints, demo every Friday"
            - a — l:0 t:186px w:700px h:62px  |  display:block  |  href="Roars v2 - Approach.dc.html"
              - div — l:0 t:0 w:700px h:1px  |  background:rgba(255,255,255,.18)
              - div — l:0 t:61px w:700px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "04"
              - span — l:44px t:18px  |  type 24px / 600 / 28px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Launch & scale"
              - span — l:300px t:24px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Release, measure, iterate on real usage"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="3"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "04 — WORK"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:60px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Selected projects"
          - div — l:0 t:150px w:860px h:390px
            - a — l:0 t:0 w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Snowman Logistics"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "LOGISTICS"
            - a — l:290px t:0 w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "GymBait.AI"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "FITNESS"
            - a — l:580px t:0 w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Parqly"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "MOBILITY"
            - a — l:0 t:130px w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Concierge Loyalty"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "CONCIERGE"
            - a — l:290px t:130px w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "GISAID"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "HEALTHCARE"
            - a — l:580px t:130px w:280px h:120px  |  display:block  |  href="Roars  v2 - Project Detail.dc.html"
              - div — l:0 t:0 w:250px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:22px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Advisee"
              - span — l:0 t:60px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.62)  |  white-space:nowrap
                  text: "SAAS"
            - a — l:0 t:290px w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="Roars v2 - Projects.dc.html"
              - span — l:20px t:11px  |  type 12px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
                  text: "All 10 projects"
              - span — l:203px t:17px w:8px h:8px  |  background:rgba(153,152,149,.7); border-radius:50%
              - span — l:214px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="4"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "05 — INDUSTRIES"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:60px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Sectors we already understand"
          - div — l:0 t:160px w:860px h:300px
            - a — l:0 t:0 w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "01"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Restaurant"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:216px t:0 w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "02"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Fitness"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:432px t:0 w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "03"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "eCommerce"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:648px t:0 w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "04"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Travel"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:0 t:150px w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "05"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Logistics"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:216px t:150px w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "06"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "SaaS"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:432px t:150px w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "07"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Healthcare"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
            - a — l:648px t:150px w:200px h:120px  |  display:block  |  href="Roars v2 - Industries.dc.html"
              - div — l:0 t:0 w:180px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:18px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "08"
              - span — l:0 t:44px  |  type 21px / 600 / 26px / -0.04em / rgba(255,255,255,.9)
                  text: "Concierge"
              - span — l:0 t:80px  |  type 10px / 500 / 0.16em / rgba(255,255,255,.6)  |  white-space:nowrap
                  text: "VIEW SECTOR"
          - span — l:0 t:520px w:520px h:40px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
              text: "We build in sectors we already know, so discovery starts from something, not nothing."
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="5"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "06 — SERVICES"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:60px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "What we do"
          - div — l:0 t:150px w:860px h:340px
            - a — l:0 t:0 w:740px h:64px  |  display:block  |  href="Roars v2 - Main.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "01"
              - span — l:44px t:18px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Product Development"
              - span — l:400px t:25px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Strategy through engineering"
            - a — l:0 t:64px w:740px h:64px  |  display:block  |  href="Roars v2 - Main.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "02"
              - span — l:44px t:18px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "User Experience Design"
              - span — l:400px t:25px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Research, flows, interface"
            - a — l:0 t:128px w:740px h:64px  |  display:block  |  href="Roars v2 - Main.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "03"
              - span — l:44px t:18px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "Mobile App Development"
              - span — l:400px t:25px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "iOS, Android, cross-platform"
            - a — l:0 t:192px w:740px h:64px  |  display:block  |  href="Roars v2 - Main.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "04"
              - span — l:44px t:18px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "MVP Development"
              - span — l:400px t:25px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Eight to sixteen weeks to launch"
            - a — l:0 t:256px w:740px h:64px  |  display:block  |  href="Roars v2 - AI Automation.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - div — l:0 t:63px w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.6)
                  text: "05"
              - span — l:44px t:18px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                  text: "AI Automation"
              - span — l:400px t:25px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
                  text: "Agents and workflow automation"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="6"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "07 — RESOURCES"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:60px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Tools, guides and templates"
          - span — l:0 t:130px w:460px h:46px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.66)
              text: "Free downloads we use in our own discovery work."
          - div — l:0 t:210px w:860px h:220px
            - a — l:0 t:0 w:272px h:200px  |  border-radius:2px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.18); display:block  |  HOVER { box-shadow:inset 0 0 0 1px rgba(255,255,255,.45) }  |  href="Roars v2 - Guides.dc.html"
              - span — l:22px t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "01 / DOWNLOADS"
              - span — l:22px t:64px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.92)
                  text: "Guides"
              - span — l:22px t:110px w:210px h:44px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.55)
                  text: "Canvases and one-pagers, free as PDF"
              - span — l:22px t:160px  |  type 14px / rgba(255,255,255,.6)
                  text: "→"
            - a — l:294px t:0 w:272px h:200px  |  border-radius:2px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.18); display:block  |  HOVER { box-shadow:inset 0 0 0 1px rgba(255,255,255,.45) }  |  href="Roars v2 - Insights.dc.html"
              - span — l:22px t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "02 / READING"
              - span — l:22px t:64px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.92)
                  text: "Insights"
              - span — l:22px t:110px w:210px h:44px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.55)
                  text: "What we learned building products"
              - span — l:22px t:160px  |  type 14px / rgba(255,255,255,.6)
                  text: "→"
            - a — l:588px t:0 w:272px h:200px  |  border-radius:2px; box-shadow:inset 0 0 0 1px rgba(255,255,255,.18); display:block  |  HOVER { box-shadow:inset 0 0 0 1px rgba(255,255,255,.45) }  |  href="Roars v2 - Brand Guidelines.dc.html"
              - span — l:22px t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "03 / SYSTEM"
              - span — l:22px t:64px  |  type 26px / 600 / 30px / -0.04em / rgba(255,255,255,.92)
                  text: "Brand guidelines"
              - span — l:22px t:110px w:210px h:44px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.55)
                  text: "How the Roars identity is used"
              - span — l:22px t:160px  |  type 14px / rgba(255,255,255,.6)
                  text: "→"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="7"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "08 — OUR JOURNAL"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:60px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Notes from the studio"
          - div — l:0 t:160px w:860px h:340px
            - a — l:0 t:0 w:740px h:96px  |  display:block  |  href="Roars v2 - Insight-details.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "15 MAY"
              - span — l:120px t:24px w:600px h:56px  |  type 21px / 600 / 28px / -0.04em / rgba(255,255,255,.88)
                  text: "AI App Development vs Traditional App Development"
            - a — l:0 t:96px w:740px h:96px  |  display:block  |  href="Roars v2 - Insight-details.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "04 MAY"
              - span — l:120px t:24px w:600px h:56px  |  type 21px / 600 / 28px / -0.04em / rgba(255,255,255,.88)
                  text: "20 Years of Roars: Built on Purpose, Driven by Impact"
            - a — l:0 t:192px w:740px h:96px  |  display:block  |  href="Roars v2 - Insight-details.dc.html"
              - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
              - div — l:0 t:95px w:740px h:1px  |  background:rgba(255,255,255,.18)
              - span — l:0 t:26px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                  text: "11 DEC"
              - span — l:120px t:24px w:600px h:56px  |  type 21px / 600 / 28px / -0.04em / rgba(255,255,255,.88)
                  text: "The Unexpected Insight — We built a meal planning app"
        - div — l:0 t:0 w:881px h:614px  |  opacity:0  |  data-panel="8"
          - span — l:0 t:0  |  type 11px / 500 / 0.2em / rgba(255,255,255,.45)  |  white-space:nowrap
              text: "09 — CONTACT US"
          - div — l:0 t:26px w:16px h:1.5px  |  background:#FFD400
          - span — l:0 t:56px w:700px h:120px  |  type 44px / 600 / 52px / -0.05em / rgb(251,251,251)
              text: "Tell us what you are building"
          - span — l:0 t:190px w:440px h:70px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.66)
              text: "A 30 minute call with Riinkesh, no pitch deck. We will tell you what the build takes and what it costs."
          - div — l:0 t:300px w:860px h:180px
            - div — l:0 t:0 w:740px h:1px  |  background:rgba(255,255,255,.18)
            - span — l:0 t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                text: "USA"
            - span — l:0 t:48px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                text: "+1 (302) 505-1200"
            - span — l:300px t:24px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                text: "UK"
            - span — l:300px t:48px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                text: "+44 (7537) 183399"
            - span — l:0 t:110px  |  type 10px / 500 / 0.18em / rgba(255,255,255,.62)
                text: "EMAIL"
            - span — l:0 t:134px  |  type 22px / 600 / 26px / -0.04em / rgba(255,255,255,.9)  |  white-space:nowrap
                text: "sales@roarsinc.com"
            - a — l:536px t:120px w:204px h:47px  |  background:rgb(255,255,255); border-radius:60px; display:block  |  HOVER { transform:translateY(-2px) }  |  href="Roars v2 - Contact.dc.html"
              - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(10,10,10)  |  white-space:nowrap
                  text: "Book a call"
              - span — l:167px t:20px w:8px h:8px  |  background:rgba(10,10,10,.3); border-radius:50%
              - span — l:177px t:20px w:8px h:8px  |  background:rgb(10,10,10); border-radius:50%
      - div — l:39px t:796px w:1362px h:80px
        - div — l:0 t:0 w:1362px h:1px  |  background:rgba(153,152,149,.4)
        - span — l:0 t:22px  |  type 10px / 500 / 0.2em / rgba(255,255,255,.62)  |  white-space:nowrap
            text: "USA"
        - span — l:0 t:42px  |  type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap
            text: "+1 (302) 505-1200"
        - span — l:250px t:22px  |  type 10px / 500 / 0.2em / rgba(255,255,255,.62)  |  white-space:nowrap
            text: "UK"
        - span — l:250px t:42px  |  type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap
            text: "+44 (7537) 183399"
        - span — l:500px t:22px  |  type 10px / 500 / 0.2em / rgba(255,255,255,.62)  |  white-space:nowrap
            text: "EMAIL"
        - span — l:500px t:42px  |  type 16px / 500 / 22px / -0.04em / rgba(255,255,255,.92)  |  white-space:nowrap
            text: "sales@roarsinc.com"
        - a — l:1119px t:26px w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="Roars v2 - Contact.dc.html"
          - span — l:20px t:11px  |  type 12px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
              text: "Book a discovery call"
          - span — l:203px t:17px w:8px h:8px  |  background:rgba(153,152,149,.7); border-radius:50%
          - span — l:214px t:17px w:8px h:8px  |  background:#FFD400; border-radius:50%

## Behaviour + data (logic class, verbatim)
```js
class Component extends DCLogic {
  componentDidMount() {
    const accent = this.props.accent || '#FFD400';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || this.props.motion === false;
    const reveal = this.props.reveal || 'circle';
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];

    qa('[data-accent-bg]').forEach(el => { el.style.background = accent; });

    // ---- fit: page canvas + fixed layers scale from the 1440 design width
    //      below 760px the scaled canvas is swapped for a flowing mobile layout
    this.mq = matchMedia('(max-width: 760px)');
    this.fit = () => {
      const wrap = q('[data-fit]');
      const canvas = q('[data-canvas]');
      if (!wrap || !canvas) return;
      const m = this.mq.matches;
      const barM = q('[data-topbar-m]');
      const mm = q('[data-menu-mobile]');
      const mcEl = q('[data-menu-canvas]');
      const barEl = q('[data-topbar]');
      if (barEl) barEl.style.display = m ? 'none' : 'block';
      if (barM) barM.style.display = m ? 'flex' : 'none';
      if (mcEl) mcEl.style.display = m ? 'none' : 'block';
      if (mm) mm.style.display = m ? 'block' : 'none';
      const behindM = q('[data-behind-m]');
      if (behindM) behindM.style.display = m ? 'block' : 'none';
      if (m) {
        canvas.style.display = 'none';
        wrap.style.height = innerHeight + 'px';
        this.s = 1;
        return;
      }
      canvas.style.display = 'block';
      const s = wrap.clientWidth / 1440;
      this.s = s;
      canvas.style.transform = 'scale(' + s + ')' + (this.open ? ' scale(.985)' : '');
      wrap.style.height = (900 * s) + 'px';
      const bar = q('[data-topbar]');
      const left = wrap.getBoundingClientRect().left;
      if (bar) { bar.style.transform = 'scale(' + s + ')'; bar.style.left = left + 'px'; }
      const mc = q('[data-menu-canvas]');
      if (mc) {
        // the whole menu always fits: scale down further on short viewports
        const ms = Math.min(s, innerHeight / 900);
        mc.style.transform = 'scale(' + ms + ')';
        mc.style.left = (left + (wrap.clientWidth - 1440 * ms) / 2) + 'px';
        mc.style.top = Math.max(0, (innerHeight - 900 * ms) / 2) + 'px';
      }
    };

    // ---- panels: the right side answers whatever the cursor is on
    const panels = qa('[data-panel]');
    const items = qa('[data-nav]');
    this.show = (key) => {
      panels.forEach(p => {
        const on = p.getAttribute('data-panel') === String(key);
        p.style.opacity = on ? '1' : '0';
        p.style.transform = on ? 'translateY(0)' : 'translateY(-10px)';
        p.style.pointerEvents = on ? 'auto' : 'none';
      });
      items.forEach(a => {
        const on = a.getAttribute('data-nav') === String(key);
        const label = a.querySelector('[data-nav-label]');
        const dot = a.querySelector('[data-nav-dot]');
        const arrow = a.querySelector('[data-nav-arrow]');
        a.style.transform = on ? 'translateX(10px)' : 'translateX(0)';
        if (label) label.style.color = on ? 'rgb(255,255,255)' : 'rgba(255,255,255,.78)';
        if (dot) dot.style.opacity = on ? '1' : '0';
        if (arrow) { arrow.style.opacity = on ? '1' : '0'; arrow.style.transform = on ? 'translateX(0)' : 'translateX(-8px)'; }
      });
    };
    items.forEach(a => {
      const k = a.getAttribute('data-nav');
      a.addEventListener('mouseenter', () => this.show(k));
      a.addEventListener('focus', () => this.show(k));
    });
    // ---- mobile: tap a section to open its submenu (one at a time)
    this.macc = qa('[data-macc]');
    this.macc.forEach(acc => {
      const head = acc.querySelector('[data-macc-head]');
      const body = acc.querySelector('[data-macc-body]');
      const inner = acc.querySelector('[data-macc-inner]');
      const ico = acc.querySelector('[data-macc-ico]');
      if (!head || !body || !inner) return;
      const set = (on) => {
        acc.dataset.open = on ? '1' : '';
        body.style.height = on ? inner.offsetHeight + 'px' : '0px';
        if (ico) { ico.style.transform = on ? 'rotate(45deg)' : 'none'; ico.style.color = on ? accent : 'rgba(255,255,255,.5)'; }
      };
      acc.__set = set;
      head.addEventListener('click', () => {
        const on = acc.dataset.open !== '1';
        this.macc.forEach(o => { if (o !== acc && o.__set) o.__set(false); });
        set(on);
      });
    });

    const col = q('[data-nav-col]');
    if (col) col.addEventListener('mouseleave', () => this.show(-1));

    // ---- secondary rows: subtle lift on hover
    qa('[data-row]').forEach(r => {
      r.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
      r.addEventListener('mouseenter', () => { r.style.transform = 'translateX(6px)'; });
      r.addEventListener('mouseleave', () => { r.style.transform = 'translateX(0)'; });
    });
    qa('[data-card]').forEach(c => {
      c.addEventListener('mouseenter', () => { c.style.transform = 'translateY(-4px)'; });
      c.addEventListener('mouseleave', () => { c.style.transform = 'translateY(0)'; });
    });

    // ---- open / close
    const menu = q('[data-menu]');
    const btn = q('[data-menu-btn]');
    const barLabel = q('[data-bar-label]');
    const lines = qa('[data-mline]');
    this.open = true;

    const linesM = qa('[data-mline-m]');
    const barLabelM = q('[data-bar-label-m]');

    this.burger = () => {
      [lines, linesM].forEach(set => {
        if (set.length < 2) return;
        set[0].style.transform = this.open ? 'translateY(3px) rotate(45deg)' : 'none';
        set[1].style.transform = this.open ? 'translateY(-3px) rotate(-45deg)' : 'none';
      });
      [barLabel, barLabelM].forEach(el => {
        if (!el) return;
        el.textContent = this.open ? 'CLOSE' : 'MENU';
        el.style.color = 'rgba(255,255,255,.66)';
      });
    };

    this.origin = () => {
      if (this.mq.matches) return [(innerWidth - 34).toFixed(0) + 'px', '32px'];
      const wrap = q('[data-fit]');
      const s = wrap ? wrap.clientWidth / 1440 : 1;
      const left = wrap ? wrap.getBoundingClientRect().left : 0;
      return [(left + 1392 * s).toFixed(0) + 'px', (57 * s).toFixed(0) + 'px'];
    };

    this.setOpen = (on, animate) => {
      this.open = on;
      if (!menu) return;
      const [ox, oy] = this.origin();
      const dur = animate && !reduce ? (on ? 820 : 520) : 0;
      menu.style.transition = 'clip-path ' + dur + 'ms cubic-bezier(.16,1,.3,1), opacity ' + Math.round(dur * 0.5) + 'ms ease, transform ' + dur + 'ms cubic-bezier(.16,1,.3,1)';
      if (reveal === 'curtain') {
        menu.style.clipPath = on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)';
      } else if (reveal === 'fade') {
        menu.style.clipPath = 'none';
        menu.style.opacity = on ? '1' : '0';
        menu.style.transform = on ? 'scale(1)' : 'scale(1.02)';
      } else {
        menu.style.clipPath = on ? 'circle(160% at ' + ox + ' ' + oy + ')' : 'circle(0px at ' + ox + ' ' + oy + ')';
      }
      menu.style.pointerEvents = on ? 'auto' : 'none';

      // navigation rises in on open
      if (on) {
        const rising = this.mq.matches ? this.macc : items;
        rising.forEach((a, i) => {
          if (animate && !reduce) {
            a.style.transition = 'none';
            a.style.opacity = '0';
            a.style.transform = 'translateY(22px)';
            requestAnimationFrame(() => {
              a.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1) ' + (140 + i * 45) + 'ms, opacity .5s ease ' + (140 + i * 45) + 'ms';
              a.style.opacity = '1';
              a.style.transform = 'translateY(0)';
            });
          } else {
            a.style.opacity = '1';
            a.style.transform = 'translateY(0)';
          }
        });
        this.show(-1);
      }
      const canvas = q('[data-canvas]');
      if (canvas) {
        const s = this.s || 1;
        canvas.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), filter .8s ease';
        canvas.style.transform = 'scale(' + s + ')' + (on ? ' scale(.985)' : '');
        canvas.style.filter = on ? 'blur(3px) brightness(.5)' : 'none';
      }
      this.burger();
    };

    const toggle = (e) => { e.preventDefault(); this.setOpen(!this.open, true); };
    if (btn) btn.addEventListener('click', toggle);
    const btnM = q('[data-menu-btn-m]');
    if (btnM) btnM.addEventListener('click', toggle);
    this.onMq = () => { this.fit(); this.setOpen(this.open, false); };
    if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq);
    this.onKey = (e) => { if (e.key === 'Escape' && this.open) this.setOpen(false, true); };
    addEventListener('keydown', this.onKey);

    // ---- parallax on the starfield
    const bg = q('[data-menu-bg]');
    this.onMove = (e) => {
      if (!bg || reduce || !this.open) return;
      const x = (e.clientX / innerWidth - 0.5) * 18;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      bg.style.transform = 'scale(1.06) translate(' + (-x).toFixed(1) + 'px,' + (-y).toFixed(1) + 'px)';
    };
    addEventListener('mousemove', this.onMove);

    this.fit();
    addEventListener('resize', this.fit);
    const wrap = q('[data-fit]');
    if (wrap && window.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.fit());
      this.ro.observe(wrap);
    }
    this.setOpen(this.props.openOnLoad === false ? false : true, false);
  }
  componentWillUnmount() {
    removeEventListener('resize', this.fit);
    removeEventListener('keydown', this.onKey);
    removeEventListener('mousemove', this.onMove);
    if (this.ro) this.ro.disconnect();
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
  }
}
```