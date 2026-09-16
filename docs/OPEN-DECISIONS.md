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

---

## The eight red URLs — scheduled, not deferred indefinitely

**Status:** designed, agreed for the next working session. Recorded here so the
red gate is understood rather than rediscovered.

`assert-urls` fails on eight inventory URLs that have neither a page nor a
redirect. That failure is EXPECTED and should stay visible — do not silence it,
and do not build stubs to turn it green.

    /product-development-agency-in-london/
    /product-development-agency-in-manchester/
    /product-development-agency-in-birmingham/
    /ui-ux-design-services-london/
    /ui-ux-design-services-bristol/
    /ui-and-ux-design-agency-birmingham/
    /ui-and-ux-design-agency-manchester/
    /schedule-ux-ui-meeting/

The owner's decision: **all eight are already designed**, and they are to be
built once the UX/UI pass over the EXISTING pages is finished — the order is
deliberate, so the new pages inherit a settled system instead of being fixed
twice.

Two things to carry into that session:

  - The seven city pages use three different slug patterns
    (`product-development-agency-in-<city>`, `ui-ux-design-services-<city>`,
    `ui-and-ux-design-agency-<city>`). docs/URL-INVENTORY-FINDINGS.md §3 has
    the detail. They are live, indexed URLs, so the slugs are not ours to
    tidy.
  - `/schedule-ux-ui-meeting/` is a booking page. The site already sends
    booking traffic to site.booking (meet.roarsinc.com/sales), so the question
    is whether this URL becomes a real page or a 301 to that. Either resolves
    the gate; they are not the same for search.

## The UX/UI pass — what has been through it

Recorded so the next session starts where this one stopped rather than
re-reviewing settled pages.

  Done:      /about-us/, /approach/, /work/ (index), /s/* (all twelve),
             /our-journal/ (index and post), /resources/*, /resource/*,
             /thankyou/, /404
  Not yet:   /, /contact-us/, /industries/*, /work/[slug] (the 23 detail
             pages)

## The transactional emails — what the design asked for and the site cannot fill

The two templates came from Claude Design ("Roars v2 — Email Templates") and
are wired up in `public/api/contact.php`. Most fields resolve to real values.
These did not, and were removed rather than filled with placeholders, invented
values, or a plausible guess:

  - **`{{company}}`** — no form on the site collects a company name. The row
    now carries the **phone number**, which `/contact-us/` does collect, and it
    disappears when that is empty.
  - **`{{service}}`** — no form collects a service interest either. The row now
    carries **which form was submitted** (Contact form / Newsletter / Callback
    request), which is real and is the nearest true thing.
  - **"our team in Birmingham"** — there is no Birmingham office. `src/lib/
    site.ts` lists Bengaluru, Frisco, London, Heist op den Berg and München,
    and nothing in the system says which one answers a given enquiry. The
    sentence now names no city. Worth noting: Birmingham IS a target city —
    two of the seven deferred UK landing pages are Birmingham ones — so the
    design may have been reaching for a real presence the repo does not
    record. If there is a Birmingham office, add it to `site.ts` and the city
    can go back into the sentence.
  - **`{{unsubscribe_url}}`** — these are transactional replies to a form the
    person just submitted. There is no list to leave and no endpoint behind the
    link. A dead Unsubscribe is worse than none, so the link is gone; the
    sentence saying why they received it stays.
  - **`{{resource_no}}`** — there is no catalogue number for the fifteen
    guides. The line now reads LIBRARY + the **shelf** the guide sits on
    (STRATEGY, PITCHING, …), which comes from its own `pills`.

Two links in the exported footers pointed at URLs that do not exist:
`roarsinc.com/projects` (the index is `/work/`) and a bare `roarsinc.com`
(canonical is `https://www.roarsinc.com`). Both corrected.

**Still to confirm with the owner:**

  - `postal_address` defaults to the Bengaluru office. If the emails should
    carry a different one, set `postal_address` in the private config; no code
    change needed.
  - `sales@roarsinc.com` is printed in both footers. It came from the design
    and matches `notify_to` in the config example, but every office in
    `site.ts` publishes `contact@roarsinc.com`. Worth deciding which address
    the emails should show.
  - Nothing has been sent through a real mail server yet. The templates render
    and the MIME is built correctly, but **deliverability is untested** — SPF,
    DKIM and DMARC for `noreply@roarsinc.com` need checking on the webspace
    before these go live.

## The homepage service figures have no source in the content

The Services band carries a figure per row: 250 shipped, 40 projects, 35
projects, 12 weeks, 17 projects. They came from the Claude Design mockup.

Checked before building it: no service record carries a project count, and
`frame.proof` on the twelve service pages holds a named flagship project
("GISAID", "FlowRow", "The President's Club") rather than a number. The only
real figure among the five is **250+**, which is `site.stats.projectsDelivered`
— the company-wide total since 2005, shown here against Product Development
alone.

Raised with the owner, who asked for the design's numbers as drawn. Recorded
here so the next person does not rediscover it and quietly pull them again:
these were removed once already on the same grounds as the
"[ NEEDS THE REAL FIGURE ]" placeholders, then reinstated by decision.

To replace them with real figures, edit the `services` array in
`src/pages/index.astro` — `stat` and `unit` per row.

## The homepage testimonials are real, and there are no portraits

Replaced from the owner's SocialJuice export (14 testimonials, 13 rated five
stars). The four on the homepage are Bhushan Paralkar (Snowman Logistics),
Dipali Sikand (Club Concierge), Nillaesh Sonill (Pimlico Health Centre) and
Sandro Ore (Ventura Law). Quotes are verbatim contiguous sentences from the
export, trimmed to length but not reworded.

**The faces are monograms, not photographs.** The four that used to sit here
were Roars staff portraits standing in for invented client names, which is a
worse thing to ship than a monogram. If real client headshots arrive with
permission to publish, the `initials` field in the `testimonials` array is
where the photograph goes back.

Still to confirm: the band's footer claims "37 reviews / 4.9 average" and the
heading reads "4.9/5". The export holds 14, so those two figures come from
somewhere else (Clutch or Google, most likely). Left alone — they were not
part of this change — but they should be traced to a source or updated.

## The eleven listed case studies are out of noindex — what the review covered

`needsReview: true` meant "machine-extracted from the WordPress export and not
yet read by anybody here; which paragraph landed in which slot is the
extractor's decision." That read has now happened for the eleven projects
listed on /work/, and the flag is cleared on those eleven. The twelve held-back
ones keep it.

**What the pass checked, page by page:** that the client named in `client`,
`headline`, `about` and the SEO block is the same company throughout; that each
`blocks` entry's lead actually belongs under its heading; that no block is
duplicated; and that the SEO title and description describe this project.

**Four real errors it found:**

  - **GymBait.AI carried another company's metadata entirely.** Its SEO title
    was "Tuma- Send money to your loved ones via Mobile Wallet or Bank" and its
    description was Tuma's, a money-transfer service for immigrants in Canada.
    Both rewritten from this project's own content. This is exactly what the
    flag existed to catch.
  - **"President''s Club"** — a doubled apostrophe from SQL escaping, which was
    rendering in the live `<title>`. Four journal descriptions carried the same
    artifact and were fixed with it.
  - **The Concierges case study had a duplicated block**: "Loyalty &
    Personalization Engine" appeared as blocks 1 and 4 with identical copy.
  - **Two service pages linked to `/work/addictlab-collabration-tool/`, which
    does not exist** — not in the inventory, never built, so "View Project" was
    a 404 on both. Repointed to the project each page already names in its own
    `frame.proof`: Innovation Design to GymBait.AI, DevOps to GISAID. Both of
    those have photography, so two of the four picture-less bands are fixed too.

**What the pass did NOT check**, and cannot: whether the claims the copy makes
about each client's outcome are accurate. Those words are the client's own,
migrated from pages that are live on roarsinc.com today, so publishing them on
the new site is not a new claim — but nobody here has verified them against the
projects.

**Five of the eleven also carry `needsRewrite: true`** — GymBait, Advisee,
GISAID, Tanishq and Onus. That flag is a Search Console signal (high
impressions, near-zero clicks), not a migration problem. They are indexable now
and their copy still wants work.

## The launch switch

The whole site is noindex until `PUBLIC_ALLOW_INDEXING=true` is set at build
time. `scripts/deploy.sh` ships whatever is in `dist/`, so the flag is a
property of the build, not the deploy — which is what keeps dev.roarsinc.com
out of the index while the real domain goes live.

Verified with a test build: with the flag on, the eleven listed projects and
the homepage return `index,follow`, the twelve held-back projects stay
`noindex,nofollow`, and `sitemap-0.xml` is written with 125 URLs, of which 12
are under /work/ (the index plus the eleven).

**To launch:** `PUBLIC_ALLOW_INDEXING=true npm run build` then deploy.
