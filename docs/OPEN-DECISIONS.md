# Open decisions

Things that are deliberately not decided, with enough context to decide them
later without re-deriving the problem. Nothing here blocks launch.

---

## Signature System — asterisk starfield

**Status:** proposal, not approved. Do not build from it.

`design/prototypes/Roars v2 - Signature Element.dc.html` and
`Roars v2 - Signature System.dc.html` are pitch documents addressed to the
owner, not page prototypes. The manifest lists both as exploration.

**Signature Element** proposes three candidate brand devices, one to be
repeated everywhere, and shows each applied across the same surfaces:

| Candidate | Applied as |
|---|---|
| The Roar Ring | section marker, stat dial, button, divider, image crop, loading cursor |
| The Level | stat bar, nav hover, page edge; 4px ticks, 7px gap, every 4th tick yellow |
| The Asterisk | footnoted claim, list bullet, image corner; 5 strokes, 36° apart, open centre ø22 |

It closes with "Where it pays off" and "What I'd need from you". It is asking
a question, not specifying a build.

**Signature System** assumes the Asterisk won and takes it further: the
element becomes the background, an "asterisk starfield" drawn with the
brand's own mark, replacing stock cosmic photography. It adds a scale ladder
(9 bullet · 22 button · 56 section · 1400 sky) and full hero and footer
mockups.

**Why this is worth keeping:** it is the reasoning behind `space.jpg` being
deleted. The photography came from the Astra template the structure was
derived from, and was never Roars'. Export 2 removed it; the starfield is one
proposed replacement.

**Why it is NOT an alternative to the current hero:** its hero mockup still
shows the old `roars` wordmark and "Space of Product Solutions". It predates
or competes with the yellow hero, rather than following it.

**Decision:** the yellow hero is FINAL. Revisit the starfield post-launch, as
a treatment for dark sections, not as a replacement for the hero.

---

## Gated resource PDFs at `/tools/*`

15 PDFs served from the root-level `/tools/` path, outside the wp-content
rewrite. Currently public with the form as a soft gate.

**Open:** whether to move them behind PHP. Not yet, because they may be
earning direct search traffic and there is no Search Console data on them.
Revisit once that data is in.

---

## Meta length — do NOT resolve by relaxing the gate

Search Console shows **96 descriptions over 165 characters and 54 titles over
65**, against pages sitting at position 6-10 on commercial queries with zero
clicks. A truncated title on a ranking page is a rendered ellipsis where the
reason to click should be.

`src/content.config.ts` enforces the limits at build time, so the content
migration fixes this by construction: an over-length value fails the build
rather than shipping.

**The gate is the fix. Do not widen it to make the build pass.** If a title
will not fit, the title is wrong, not the limit. `scripts/migrate-wordpress.mjs`
ports every value verbatim and reports over-length rows precisely so that this
surfaces as work rather than being quietly truncated on import.
