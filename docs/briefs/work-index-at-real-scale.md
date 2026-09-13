# Claude Design brief: Work index at real scale

Status: **written, not yet submitted.** Claude Design needs an interactive
`/design-login`, which this session cannot run. Paste Part A from
`../docs/CLAUDE-DESIGN-PROMPT.md` into the project instructions first if it is
not already there, then everything inside the fence below.

Filed here so the brief is not lost with the session, and so the eventual
answer can be diffed against what was asked.

---

```
NEW PAGE: Work index (revision of the existing Projects index)
ROUTE:    /work/
TYPE:     template for a collection

WHO IS ON THIS PAGE

An enterprise product leader or a funded founder who has decided we might
be credible and is now checking whether we have shipped anything like
their thing. They arrive believing we are plausible. They need to leave
believing we are proven, specifically in their sector.

They are scanning, not reading. The question in their head is "have they
done logistics", not "tell me about your work".

WHAT IT HAS TO DO

Let someone find the one case study that resembles their problem, in
under thirty seconds, out of twenty-three.

CONTENT I HAVE

23 live case studies, not 5. The existing spec was drawn against 5.

  Snowman Logistics · Parqly · Concierge Loyalty · Advisee · Company Guru
  GymBait.AI · Ventura Law Firm · GISAID · The President's Club · 411Drives
  Gypsy · Blelp · Flowrow · Super Social · Community Social · Club Social
  Tanishq · Les Concierges · Reward Butler · Friendo · Onus
  Counter Cabinet · Go Champions Go

Each has: client name, date, hero image, and 1-2 team members.

They span the eight industries already in the site's taxonomy:
restaurant, fitness, eCommerce, concierge, travel, logistics, SaaS,
healthcare. Plus legal and finance, which have no industry page.

Thirteen of the twenty-three are currently unreachable from navigation.
This page is how they get reclaimed.

THE PROBLEM TO SOLVE

The existing spec sets each project row at 707px, at y = 300 + i × 707.
At 23 records that is a 16,261px page. Roughly twenty screens.

I do not think pagination is the answer, and I want you to tell me if I
am wrong.

  - 23 is not enough records to justify it
  - /work/page/2/ has to be noindex per our SEO rules, so eighteen case
    studies would lose their crawl path
  - Load-more has the same problem unless server-rendered

My hypothesis, which you should push back on if it is weak:

A two-tier index. The first four or five keep the full 707px treatment
as featured work. The remaining eighteen compress into a denser row,
around 320px, that still carries an image but reads as an index rather
than a showcase. Total lands near 7,400px, comfortably under the
homepage at 10,022px.

That gives a real editorial hierarchy rather than a compromise, and it
matches how the site already thinks: the homepage gives featured work
the cross-fade, the index is a different thing.

What I need from you is the denser row. It is the piece that does not
exist in the system yet, and it has to sit next to the 707px row without
looking like a different site.

CONSTRAINTS

- Filter chips already exist in the system (pill, 1px ring, active is
  #FFD400 fill, with an n / total readout). Use them. Do not redesign
  them. They filter by industry, eight values plus All.
- Filtering is client-side state only. No crawlable query URLs. The
  filtered view must not produce its own URL.
- When a filter cuts 23 down to 2, the page must not look broken or
  empty. Design that state.
- Design the zero-results state too.
- Must sit alongside /our-journal/ and /industries/[slug]/ without
  looking like a different site.
- Reveal-on-intersect is already the system's scroll behaviour. Do not
  invent a second one for this page.
- Featured selection is editorial, set in the CMS, not "most recent".
- SEO: primary intent is "product development case studies". H1 carries
  it. CollectionPage + ItemList schema, capped at what renders.

DELIVER

Full page spec in the standard format, plus the block list.

Specifically:
  - Section table with the revised heights at 23 records
  - The dense row block, at full element-level detail, desktop and mobile
  - How featured and dense rows transition visually, so the join does
    not read as two pages stitched together
  - Filtered, sparse and empty states
  - Mobile flow layout throughout

And tell me directly whether the two-tier idea is right. If a single
consistent row at a middle height is the stronger answer, say so and
show me that instead. I would rather be corrected now than after it is
built.
```

---

## Two notes for whoever submits this

**The industry taxonomy in the brief does not match the site's.** The brief
lists eight industries as "already in the site's taxonomy": restaurant,
fitness, eCommerce, concierge, travel, logistics, SaaS, healthcare. The
inventory has **nine** industry pages — the same eight plus
`education-mobile-app-development`, which
`docs/URL-INVENTORY-FINDINGS.md` §1 flags as missing from the nav. So the
filter is nine values plus All, plus legal and finance, which have case
studies but no industry page. Decide whether those last two appear as filter
values with no matching page behind them.

**The 23 names are worth checking against the CSV before this is built.** The
inventory's 23 `/work/` slugs include `warehouse-compliance-checklist-app`
(Snowman Logistics) and `friendo-healthcare-mobile-app-development`, and the
brief's plain-language names will need mapping to those slugs. The count
matches at 23.
