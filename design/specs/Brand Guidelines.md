# Brand Guidelines — element spec

Source prototype: `design/Roars v2 - Brand Guidelines.dc.html`

## Head / global CSS
```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; }
  * { box-sizing:border-box; }
  doc-page:not(:defined) { visibility:hidden; }
  a { color:#141414; text-decoration:none; }
  a:hover { color:#B99A00; }
</style>
<script src="./doc-page.js"></script>
```

## Full element tree

- doc-page — type #141414
  - div — type 10pt / -0.02em / #6A6A67  |  border-top:1px solid #E6E5E2; display:flex; align-items:center; justify-content:space-between  |  slot="footer"
    - span
        text: "Roars v2 — Brand & Build Guidelines"
    - span
        text: "Source: Figma “Astra agency” + roarsinc.com"
  - div — type #FFFFFF  |  background:#0B0B0B; border-radius:10px; padding:34px 30px 30px
    - div — type 10pt / 600 / 0.14em / #BFBFBC  |  display:flex; align-items:center; gap:10px
      - span — w:9px h:9px  |  background:#FFD400; border-radius:50%; display:block
      - span
          text: "Internal reference · v2 build system"
    - div — type 40pt / 600 / 1.02 / -0.045em
        text: "Brand & buildguidelines"
      - br
    - div — type 13pt / 500 / 1.5 / -0.03em / #D4D4D1  |  max-width:430px
        text: "Everything established while building the Roars v2 pages — tokens, grid, components, page shell and content facts. Apply this to every new page so the set stays one design."
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "01 — Source of truth"
    - div — type 20pt / 600 / -0.04em
        text: "Two sources, never mixed"
    - div — display:grid; gap:18px; grid-template-columns:1fr 1fr
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "Figma — “Astra agency”"
        - div — type 12pt / 500 / 1.5 / -0.02em / #4A4A4A
            text: "Layout, type scale, spacing, colour neutrals, components. Values are copied verbatim from the file at its 1440 canvas — never rounded to a 4/8px grid."
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "roarsinc.com"
        - div — type 12pt / 500 / 1.5 / -0.02em / #4A4A4A
            text: "All copy, names, numbers and imagery. People, project and client images are real Roars assets pulled from the live site."
    - div — type 12pt / 500 / 1.55 / -0.02em / #4A4A4A
        text: "The four original files are frozen. New work lands as ."
      - span — type 600 / #141414
          text: "Roars - *.dc.html"
      - span — type 600 / #141414
          text: "Roars v2 - <Page>.dc.html"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "02 — Colour"
    - div — type 20pt / 600 / -0.04em
        text: "Astra’s neutrals, Roars’ one yellow"
    - div — type 12pt / 500 / 1.55 / -0.02em / #4A4A4A  |  max-width:560px
        text: "Astra’s system is black / white / grey with a single amber accent (rgb 255,170,1). That accent becomes Roars yellow , used exactly as sparingly: hover fills, the wordmark badge, the scroll ring. Never a yellow background panel, never yellow body text."
      - span — type 600 / #141414
          text: "#FFD400"
    - div — display:grid; gap:10px; grid-template-columns:repeat(5,1fr)
      - div
        - div — h:54px  |  background:#000000; border-radius:6px
        - div — type 10.5pt / 600
            text: "#000000"
        - div — type 10pt / #6A6A67
            text: "dark sections, buttons"
      - div
        - div — h:54px  |  background:#0B0B0B; border-radius:6px
        - div — type 10.5pt / 600
            text: "#0B0B0B"
        - div — type 10pt / #6A6A67
            text: "footer ground"
      - div
        - div — h:54px  |  background:#141414; border-radius:6px
        - div — type 10.5pt / 600
            text: "#141414"
        - div — type 10pt / #6A6A67
            text: "body ink"
      - div
        - div — h:54px  |  background:#242424; border-radius:6px
        - div — type 10.5pt / 600
            text: "#242424"
        - div — type 10pt / #6A6A67
            text: "section headers"
      - div
        - div — h:54px  |  background:#474747; border-radius:6px
        - div — type 10.5pt / 600
            text: "#474747"
        - div — type 10pt / #6A6A67
            text: "micro captions"
      - div
        - div — h:54px  |  background:#919191; border-radius:6px
        - div — type 10.5pt / 600
            text: "#919191"
        - div — type 10pt / #6A6A67
            text: "labels"
      - div
        - div — h:54px  |  background:#999895; border-radius:6px
        - div — type 10.5pt / 600
            text: "#999895"
        - div — type 10pt / #6A6A67
            text: "rules, dot 1"
      - div
        - div — h:54px  |  background:#F5F5F5; border-radius:6px; border:1px solid #E6E5E2
        - div — type 10.5pt / 600
            text: "#F5F5F5"
        - div — type 10pt / #6A6A67
            text: "services, FAQ bg"
      - div
        - div — h:54px  |  background:#FBFBFB; border-radius:6px; border:1px solid #E6E5E2
        - div — type 10.5pt / 600
            text: "#FBFBFB"
        - div — type 10pt / #6A6A67
            text: "hero wordmark"
      - div
        - div — h:54px  |  background:#FFD400; border-radius:6px
        - div — type 10.5pt / 600
            text: "#FFD400"
        - div — type 10pt / #6A6A67
            text: "accent — sparing"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "03 — Typography"
    - div — type 20pt / 600 / -0.04em
        text: "Inter, tight tracking, one exception"
    - div — type 12pt / 500 / 1.55 / -0.02em / #4A4A4A  |  max-width:560px
        text: "Inter 400–800 everywhere. Button labels are the single exception: Helvetica Neue Medium. Negative tracking is the signature — display type at −0.04/−0.05em, body and labels as tight as −0.06em."
    - div — border-bottom:1px solid #E6E5E2
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "hero wordmark"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 212px · lh 86 · ls −0.04em · #FBFBFB · blend difference"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "footer wordmark"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 182px · lh 86 · ls −0.04em"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "section header"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 124px · ls −0.05em · #242424 (dark: #FFF at 0.9, blend difference)"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "big stat"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 84px · lh 43 · ls −0.05em · suffix 36px/500 · % 26px/700"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "stat mid"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 42px or 28px · ls −0.05em"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "name / h-name"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 24px · ls −0.04em"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "intro"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 500 · 22/32 · ls −0.04em — large variant 24/34 at 0.7 opacity"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "body"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 500 · 16/22–23 · ls −0.06em · #141414 or #020202"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "label"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 14px · ls −0.06em · #919191"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "micro"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 400/500 · 12/19 · ls −0.06em — 13/18 ls −0.05em #474747 for captions"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "footer nav"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 600 · 24/40 · ls −0.06em · 0.9 opacity"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "button label"
        - div — type 11.5pt / #4A4A4A
            text: "Helvetica Neue 500 · 14px · ls −0.03em (ghost variant 12px)"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "04 — Canvas & grid"
    - div — type 20pt / 600 / -0.04em
        text: "1440 canvas, absolute positions"
    - div — type 12pt / 500 / 1.55 / -0.02em / #4A4A4A  |  max-width:560px
        text: "Every page is authored at the Figma canvas width of 1440 with absolutely-positioned children, then scaled to the container. Positions come from the file — don’t re-flow them into flex."
    - div — border-bottom:1px solid #E6E5E2
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "page gutters"
        - div — type 11.5pt / #4A4A4A
            text: "left 39 → right 1401 · content width 1362"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "inner column"
        - div — type 11.5pt / #4A4A4A
            text: "left 503 · width 901 (left rail 464 wide)"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "top bar"
        - div — type 11.5pt / #4A4A4A
            text: "fixed · 1440×150 · inner block at 39,36 sized 1366×111 · z-index 50"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "rule pair"
        - div — type 11.5pt / #4A4A4A
            text: "top 1.5px #999895 at 0.7 · bottom 0.5px #999895 at 0.5"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "image cards"
        - div — type 11.5pt / #4A4A4A
            text: "radius 12 · placeholder ground rgb(30,30,30) · object-fit cover"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:7px 0; grid-template-columns:140px 1fr
        - div — type 11.5pt / 600
            text: "section grounds"
        - div — type 11.5pt / #4A4A4A
            text: "#FFF default · #F5F5F5 services & FAQ · #000 + space.jpg for projects, pricing, team, footer"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "05 — Components"
    - div — type 20pt / 600 / -0.04em
        text: "Pill buttons and two dots"
    - div — display:grid; gap:16px; grid-template-columns:1fr 1fr
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "Primary button"
        - div — w:204px h:47px  |  background:#000000; border-radius:60px
          - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / #FFFFFF  |  white-space:nowrap
              text: "Contact Now"
          - span — l:167px t:20px w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
          - span — l:177px t:20px w:8px h:8px  |  background:#FFFFFF; border-radius:50%
        - div — type 11.5pt / 1.5 / #4A4A4A
            text: "204×47 · r60 · black. Label at x25; dots 8px at x167 (#999895 @.6) and x177 (#FFF). On dark sections it inverts to white with black label. Hover fills ."
          - span — type 600 / #141414
              text: "#FFD400"
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "Ghost button (dark ground)"
        - div — w:243px h:42px  |  background:#0B0B0B; border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)
          - span — l:18px t:11px  |  type 12px / 500 / 20px / -0.03em / #FFFFFF  |  white-space:nowrap
              text: "Contact Now"
          - span — l:205px t:17px w:8px h:8px  |  background:#999895; border-radius:50%
          - span — l:216px t:17px w:8px h:8px  |  background:#FFFFFF; border-radius:50%
        - div — type 11.5pt / 1.5 / #4A4A4A
            text: "195×42 or 243×42 · r60 · inset ring 2px #FFF at 0.25 · 12px label. Used in the top bar beside the 42px founder avatar."
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "Accordion toggle"
        - div — display:flex; gap:10px
          - span — w:36px h:36px  |  type 24px / 300 / 1 / #FFFFFF  |  background:#0B0B0B; border-radius:60px; display:flex; align-items:center; justify-content:center
              text: "+"
          - span — w:36px h:36px  |  type 22px / 300 / 1 / #141414  |  background:#F0F0EE; border-radius:60px; display:flex; align-items:center; justify-content:center
              text: "–"
        - div — type 11.5pt / 1.5 / #4A4A4A
            text: "36px circle, r60, white on dark grounds. “+” 28px/300, “–” 26px/300."
      - div — border-radius:8px; border:1px solid #E6E5E2; padding:16px
        - div — type 12pt / 600 / -0.03em
            text: "Wordmark badge & avatars"
        - div — display:flex; align-items:center; gap:14px
          - span — type 44px / 600 / 1 / -0.04em / #141414
              text: "roars"
            - span — t:-2px w:20px h:20px  |  type 9px / #0B0B0B  |  right:-16px; background:#FFD400; border-radius:60px; display:flex; align-items:center; justify-content:center
                text: "↗"
        - div — type 11.5pt / 1.5 / #4A4A4A
            text: "Badge: 31px yellow circle r60 with a 13px/600 glyph, pinned to the wordmark’s last letter. Avatars are 42px circles (60px on About), r60, white ground."
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "06 — Page shell"
    - div — type 20pt / 600 / -0.04em
        text: "The recipe every v2 page repeats"
    - div — border-bottom:1px solid #E6E5E2
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "[data-fit]"
        - div — type 11.5pt / #4A4A4A
            text: "outer wrapper, width 100%, overflow hidden. Its height is set to canvasHeight × scale."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "[data-canvas]"
        - div — type 11.5pt / #4A4A4A
            text: "the 1440-wide artboard, transform: scale(containerWidth / 1440), origin 0 0."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "[data-topbar]"
        - div — type 11.5pt / #4A4A4A
            text: "fixed bar, scaled by the same factor and left-aligned to the wrapper’s bounding box."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "DARK ranges"
        - div — type 11.5pt / #4A4A4A
            text: "array of [startY, endY] canvas bands that are dark. The bar recolours as it crosses them."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "[data-ink] / [data-fill]"
        - div — type 11.5pt / #4A4A4A
            text: "bar elements whose colour / background flip between #FFF and #141414 per band."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "[data-ring]"
        - div — type 11.5pt / #4A4A4A
            text: "scroll-progress ring: conic-gradient(#FFD400 <turn>, rgba(255,212,0,.14) 0turn), shown on light bands only."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "wiring"
        - div — type 11.5pt / #4A4A4A
            text: "fit() + tint() on mount, on resize, on scroll, and via a ResizeObserver on the wrapper."
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "helmet"
        - div — type 11.5pt / #4A4A4A
            text: "Inter 300–800 from Google Fonts; body reset; ; box-sizing border-box."
          - span — type 600 / #141414
              text: "a:hover { color:#FFD400 }"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:150px 1fr
        - div — type 11.5pt / 600
            text: "labels"
        - div — type 11.5pt / #4A4A4A
            text: "each section carries data-screen-label (“Footer”, “Hero”…) for review context."
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "07 — Motion"
    - div — type 20pt / 600 / -0.04em
        text: "Slow ease-out, nothing bouncy"
    - div — type 12pt / 500 / 1.6 / -0.02em / #4A4A4A  |  max-width:600px
        text: "Entrances use at ~1.1s with a short delay; hovers and bar recolours use .25s ease. The mark rotates 45° and turns yellow over light bands. Everything motion-related is skipped when matches."
      - span — type 600 / #141414
          text: "cubic-bezier(.16,1,.3,1)"
      - span — type 600 / #141414
          text: "prefers-reduced-motion: reduce"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "08 — Content facts"
    - div — type 20pt / 600 / -0.04em
        text: "Reuse these, don’t invent new ones"
    - div — border-bottom:1px solid #E6E5E2
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Stats"
        - div — type 11.5pt / #4A4A4A
            text: "20+ years (since 2005) · 250+ projects delivered · 96% returning customers · 4.9 average review"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Services"
        - div — type 11.5pt / #4A4A4A
            text: "Product Development · User Experience Design · Mobile App Development · MVP Development · AI Automation"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Work"
        - div — type 11.5pt / #4A4A4A
            text: "Snowman Logistics · GymBait.AI · Parqly · Concierge Loyalty · GISAID · Advisee · Company Guru · Ventura Law Firm · The President’s Club · 411Drives"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Team"
        - div — type 11.5pt / #4A4A4A
            text: "Riinkesh A Sshah (CEO / Founder) · Suzanne Martin · Avinash Kumar · Kevin Jacob · Shiva Kumar · Chetna Shah · Khusboo Panchal · Ankush A Sshah"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Ventures"
        - div — type 11.5pt / #4A4A4A
            text: "Produit · Hostwala · UX Audit Pro · Microkopy · GetAutomation"
      - div — border-top:1px solid #E6E5E2; display:grid; gap:16px; padding:8px 0; grid-template-columns:110px 1fr
        - div — type 11.5pt / 600
            text: "Contact"
        - div — type 11.5pt / #4A4A4A
            text: "USA +1 (302) 505-1200 · UK +44 (7537) 183399 · sales@roarsinc.com"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "09 — Imagery"
    - div — type 20pt / 600 / -0.04em
        text: "Space for grounds, real photos for people"
    - div — type 12pt / 500 / 1.6 / -0.02em / #4A4A4A  |  max-width:600px
        text: "The space photograph (, often flipped with scaleY(-1)) is the dark-section art direction inherited from the Figma file — it is treatment, not content. Everything depicting Roars — founders, team, office, client work — uses real imagery from roarsinc.com. Small line marks (stars, asteroids, union) live in as SVG and are inverted with filter: invert(1) on dark grounds."
      - span — type 600 / #141414
          text: "assets/space.jpg"
      - span — type 600 / #141414
          text: "assets/"
  - div
    - div — type 10pt / 600 / 0.14em / #6A6A67
        text: "10 — New page checklist"
    - div — type 20pt / 600 / -0.04em
        text: "Before calling a page done"
    - div — display:grid; gap:7px
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "File named ; the four v1 files untouched."
          - span — type 600 / #141414
              text: "Roars v2 - <Page>.dc.html"
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "1440 canvas, gutters at 39 / 1401, inner column at 503 where a rail is used."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "Top bar copied intact, with DARK ranges updated to the new page’s dark bands."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "fit() height constant matches the real canvas height."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "Footer block with the 182px wordmark, nav and contact lines present."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "Yellow appears only as hover, badge or ring — no yellow panels or yellow text."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "Cross-links point to existing v2 files; every new page is linked from the footer nav."
      - div — type 11.5pt / 1.5 / #4A4A4A  |  display:grid; gap:10px; grid-template-columns:16px 1fr
        - span — type 700 / #FFD400
            text: "✓"
        - span
            text: "Copy comes from roarsinc.com verbatim; no invented stats, names or client logos."