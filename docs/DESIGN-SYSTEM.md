# Design System

`src/styles/tokens.css` is the source of truth. This file explains the decisions behind it so nobody re-litigates them mid-build.

## Why the type scale is ten steps

The prototypes measure **46 distinct font sizes** across 16 pages. That is what a prototype looks like, not a system. Shipping it would mean no two pages agreeing on what "body copy" is.

Collapsed to ten, chosen from the highest-usage values in the measured inventory:

| Token | px | Replaces (from the prototype inventory) |
|---|---|---|
| `--fs-micro` | 12 | 10, 11, 12, 13 (580 uses combined) |
| `--fs-label` | 14 | 14, 15 (344) |
| `--fs-body` | 16 | 16, 17, 18 (335) |
| `--fs-intro` | 22 | 19, 20, 22 (221) |
| `--fs-item` | 24 | 24, 26, 28 (134) |
| `--fs-stat` | 42 | 32, 34, 36, 38, 40, 42, 44, 46, 48 (104) |
| `--fs-display` | 84 | 52, 54, 56, 58, 60, 62, 64, 65, 66, 72, 84 (105) |
| `--fs-heading` | 124 | 112, 124, 132, 140, 148 (19) |
| `--fs-wordmark` | 182 | 182 (12) |
| `--fs-hero` | 212 | 212 (2) |

Snap every value to the nearest step. If something genuinely does not fit, flag it rather than adding an eleventh step. Eleven becomes forty-six again within a month.

Same principle for spacing: eight steps, and anything between them rounds.

## Colour discipline

The palette is white, `#F5F5F5`, black, `#0B0B0B`, and one accent.

**Yellow at `#FFD400` is an accent, never a ground.** In the approved design it appears as: the dot inside a primary button, an active filter chip, hover ink, the logo scroll-progress ring, the registered badge, and a single marked character in one headline. That is the whole vocabulary.

Rule: **maximum two yellow moments per viewport.** If a composition has three, remove one.

The page is predominantly white. Black sections are punctuation: heroes, featured work, proof bands, footer. An earlier ink-heavy direction was rejected, so this is a decision, not a default.

## No dark mode

There is no user-facing theme switch. Dark grounds are a compositional device applied per section via `data-ground="dark"`, not a preference. `tokens.css` sets no `prefers-color-scheme` overrides, deliberately.

## Grid

At the 1440 design width:

```
|39|-------- rail 464 --------|503|------- column 901 -------|1401|
 gutter      labels, markers        headings, body, cards      edge
```

The recurring rhythm is a small label in the left rail and the content column starting at 503. Section headings are the exception: they sit at the top of the inner column at 124px.

Use the prototype coordinates as **measurements**, never as CSS. A child at `l:503` inside a section at `l:39` means a 464px rail, not `position: absolute; left: 503px`.

Breakpoints: desktop grid down to ~1040px, then the documented mobile stack at 760px. Tablet was never designed. Propose before inventing.

## Motion vocabulary

Four behaviours, and nothing else:

1. **Reveal.** Children start at `opacity 0, translateY(26px)`, animate on intersect, once only. `720ms` transform on `--ease-out`, `620ms` opacity.
2. **Ink inversion.** The top bar flips to white over dark sections. Driven by IntersectionObserver, never by hard-coded scroll bands.
3. **Logo chip.** Rotates 45° on light grounds; a conic ring fills with yellow in proportion to scroll progress. One intro animation on load, `1100ms` on `--ease-spring`.
4. **Projects cross-fade.** One parameter, eased, opacities summing to 1.

Everything skips under `prefers-reduced-motion`. Anything beyond these four needs a reason.

## Borders and radii

- Pills and buttons: `60px`. Circles: `999px`. **Cards are square.**
- Borders are `box-shadow: inset 0 0 0 Npx`, not `border`. This is how the design was drawn and it keeps ring colour animatable.
- Real shadows appear twice in the entire system: under the logo chip on light grounds, and as a 3px white ring on overlapping avatars. Do not add more.

## The one open question

`space.jpg` carries the art direction on every dark section and the footer. It came from the Astra template the structure was derived from, where cosmic imagery was that template's concept. It is not Roars'.

It is also the single easiest element on the site for another agency to reproduce.

Not a blocker for the build, and not a decision to make in code. Flagged here so it does not quietly become permanent by default.
