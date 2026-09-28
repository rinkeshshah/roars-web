# Roars — Work Presentation (case-study template)

Self-contained handoff for implementation.

## Files
- `Roars v2 - Work Presentation.dc.html` — the design. Opens directly in a browser (double-click). All layout is inline-styled; all case content lives in the `PROJECTS` object in the `<script data-dc-script>` block at the bottom.
- `support.js` — runtime required by the .dc.html (same folder).
- `brand/`, `uploads/` — image assets referenced by relative path.
- `DESIGN-NOTES.md` — the Roars v2 token/type/colour reference the page follows.

## What it is
One case-study template, seven cases (Advisee, Concierges, Snowman, GymBait.AI, Parqly, President's Club, FlowRow). The pills in the dark top strip switch case; everything else is data-driven.

## Structure (acts, in order)
1. Cover — kicker, name, one-line claim, date, team avatars, cover plate, meta row
2. Challenge — label column + lead + body
3. Groundwork — wireframes, desaturated (only if `wires` is non-empty)
4. Design system — artifact plinths (only if `artifacts` is non-empty)
5. What shipped — one-at-a-time reel with counter, prev/next, and a list of screens (only if `screens` is non-empty)
6. Full page — scrollable tall plate (only if `tall` is set)
7. In the hand — phone grid, uniform crop via `mobileRatio` (only if `mobile` is non-empty)
8. Tech & architecture — key/value rows
9. Outcomes — four big figures
10. Client — quote + portrait (only if `quote` is set)
11. Next case — switches to the next project
12. Footer — the standard Roars footer

Every act collapses when the case has no assets of that class. That is the point of the template: image-rich and image-poor cases both read as complete.

## Image rules (keep these)
- Screenshots: ring field goes BEHIND them (section-level), never on them.
- Photographs: ring field goes ON the image (`coverIsPhoto: true`, or a `mobile` item without `screenshot: true`).
- Cover photographs get a bottom gradient scrim instead of rings.
- Ring construction (from the Roars photo-graphic system, option 8a): two masked layers centred at `-6% 108%` — white hairlines `rgba(255,255,255,.26)` at 42px pitch, yellow `rgba(255,212,0,.9)` at 372px pitch. On light grounds: 16% black hairlines and `#D6B200` instead of `#FFD400`.
- Empty `coverPlate` renders the striped "COVER IMAGE — TO BE SUPPLIED" placeholder.

## Adding a case
Append an entry to `PROJECTS` with the same keys as an existing one, and point the previous case's `nextName` / `nextLine` / `nextImg` at it. Omit `artifacts`, `wires`, `screens`, `tall`, `mobile` or `quote` to drop those acts.

## Tokens
Inter 400–700. Labels 14px/-0.06em `#919191`; body 18px/28px `rgb(71,71,71)`; section heads `clamp(34px,5vw,72px)`/-0.05em `#242424`; stats up to 84px/-0.05em. Rules 1.5px `rgba(153,152,149,.7)`. Accent `#FFD400`, used only as a marker (active reel item, small rules, hover). Dark acts use `linear-gradient(100deg,#0D0D0C,#121110,#17150E,#0A0A0A)`. Page gutters `clamp(20px,3vw,39px)`.
