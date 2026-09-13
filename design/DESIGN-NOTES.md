# Roars v2 — build notes

New build (do NOT touch the four older `Roars - *.dc.html` files).
Files are prefixed `Roars v2 - `.

## Source split
- **Figma "Astra agency"** = design source of truth (layout, type, spacing, colour, components).
- **roarsinc.com** = content + asset source.

## Palette decision (user asked me to decide)
Astra's system is black / white / grey. Roars' brand is black + yellow.
→ Keep Astra structure and neutrals exactly; the one accent (Astra used amber
rgb(255,170,1)) becomes Roars yellow **#FFD400**, used as sparingly as Astra used amber.
Space photography stays as the dark-section art direction (it is a Figma treatment,
not content); all people / project / client imagery is real Roars imagery.

## Tokens (exact, from the .fig at 1440 canvas)
Font: Inter (400/500/600/700/800). Button labels: Helvetica Neue Medium.

| role | value |
|---|---|
| page gutters | left 39 → right 1401 (content 1362) |
| inner column | left 503, width 901 (rail 464 wide) |
| section header | Inter 600 · 124px · ls -0.05em · #242424 (dark: #FFF, 0.9 op, blend difference) |
| hero wordmark | Inter 600 · 212px · lh 86px · ls -0.04em · #FBFBFB, blend difference |
| footer wordmark | Inter 600 · 182px · lh 86px |
| h-name | Inter 600 · 24px · ls -0.04em |
| big stat | Inter 600 · 84px · lh 43px · ls -0.05em ; suffix + 36px/500, % 26px/700 |
| stat mid | Inter 600 · 42px (or 28px) · ls -0.05em |
| intro | Inter 500 · 22px/32px · ls -0.04em |
| intro lg | Inter 500 · 24px/34px · ls -0.04em · 0.7 op |
| body | Inter 500 · 16px/22–23px · ls -0.06em · #141414 / #020202 |
| label | Inter 600 · 14px · ls -0.06em · #919191 |
| micro | Inter 400/500 · 12px/19px · ls -0.06em |
| nav (footer) | Inter 600 · 24px/40px · ls -0.06em · 0.9 op |
| rule top | 1.5px #999895 @ .7 |
| rule bottom | 0.5px #999895 @ .5 |
| button | 204×47 · r60 · #000 · label HN 500 14px ls -.03em #FFF at x25 · dots 8px at x167 (#999895 @.6) and x177 (#FFF) |
| ghost button (dark) | 195×42 (or 243×42) · r60 · inset 0 0 0 2px #FFF @ .25 · label 12px |
| plus/minus icon | 36px white circle r60 · "+" 28px/300 · "–" 26px/300 |
| avatar | 42px circle (60px on About) |
| section bg | #FFF · #F5F5F5 (services, FAQ) · #000 + space.jpg (projects, pricing, team, footer) |

## Section order — Astra - Main (1440×12965)
header 0 · about 900 · services 1979 · projects 3339 · pricing 4944 · testimonials 6281 ·
dashboard 7444 · team 8649 · insights 9659 · FAQ 10738 · footer 11860

## Roars content used
- Stats: 20+ years (since 2005) · 250+ projects delivered · 96% returning customers
- Services: Product Development · User Experience Design · Mobile App Development ·
  MVP Development · AI Automation
- Work: Snowman Logistics · GymBait.AI · Parqly · Concierge Loyalty · GISAID · Advisee ·
  Company Guru · Ventura Law Firm · The President's Club · 411Drives
- Team: Riinkesh A Sshah (CEO/Founder), Suzanne Martin, Avinash Kumar, Kevin Jacob,
  Shiva Kumar, Chetna Shah, Khusboo Panchal, Ankush A Sshah
- Ventures: Produit · Hostwala · UX Audit Pro · Microkopy · GetAutomation
- Contact: USA +1 (302) 505-1200 · UK +44 (7537) 183399 · sales@roarsinc.com
