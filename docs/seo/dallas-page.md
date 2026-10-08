# Dallas-Fort Worth page: SEO brief

Owner's brief, 8 Oct 2026. This is the brief of record for
`/software-development-company-dallas/`. Part 2 of the original (the build
prompt) is not reproduced; it is in the commit that implements this.

## 1. Why this page

Search Console, 5 Jul to 4 Oct 2026.

- US is 11.3K of 15.5K impressions (73%) but only 3 clicks. India: 95 clicks
  from 1.9K.
- The homepage takes about 9.7K of the US impressions at average position 5.3,
  with 1 click. It is ranking for buyer-intent outsourcing queries it was never
  written for.
- The only US place names in 880 US queries are Texas / DFW, and Google already
  ranks Roars high for them:

| Query | Impr. | Pos. |
|---|---|---|
| tech companies in texas | 1 | 1.0 (the only US click) |
| web developer outsourcing texas | 22 | 2.0 |
| web developer frisco | 20 | 1.2 |
| desktop application development company in texas | 12 | 1.8 |
| web application development company in texas | 4 | 1.2 |
| software development company texas | 2 | 1.0 |
| frisco it companies | 3 | 11.7 |
| web developer plano | 7 | 11.0 |
| web design frisco | 8 | 26.0 |
| "software company" in dallas, texas | 5 | 175 |

- Volume sits in the national terms. These are what the page should also catch:

| Query | Impr. | Pos. |
|---|---|---|
| software development outsourcing company | 405 | 5.1 |
| web application development firm | 356 | 5.1 |
| software outsourcing company | 278 | 3.9 |
| retail software development company | 261 | 3.6 |
| real estate software development services | 233 | 6.3 |
| web development outsourcing company in usa | 200 | 8.8 |
| web app development company in usa | 127 | 3.5 |
| custom web application development services company in usa | 83 | 5.1 |
| crm software development company in usa | 50 | 2.5 |
| software development agency in usa | 46 | 2.4 |

Search Console has no city data. The Texas signal comes from query text, and
almost certainly from the Frisco address in the Organization JSON-LD on every
page.

## 2. The decision that gates everything: is the Frisco office real?

On 18 Sep the owner told Claude Code "we're not in Texas". The live site still
publishes `9300 John Hickman Parkway, Frisco TX 75035` in `site.ts`, the
Organization JSON-LD, the footer and `/contact-us/`.

- **A. Real office, registered or virtual address actually in use:** build the
  page as specced below. Frisco is the strongest local proof on it.
- **B. Not real:** do not build a Dallas page. A city page on top of a fake
  office is what Google's site-reputation and scaled-content rules target, and
  it is a legal exposure. Instead, remove Frisco from `site.ts` and build
  `/software-development-company-usa/` aimed at the "in USA" terms above.

Nothing ships until this is answered.

## 3. What the SERP shows

- "software development company dallas" is listicles (Purrweb, Intellectsoft),
  directories (UpCity, DesignRush) and city-swap pages from offshore firms
  (MindInventory, PerfectionGeeks). The bar is low. Most repeat "in Dallas" in
  every heading and say nothing about Dallas.
- "web app development frisco" is the same: Hexxen, VarenyaZ, Binary Studio,
  all templated.
- "product development agency dallas" is physical product design (LA NPDT,
  SEI). Same trap as London. **Do not use "product development agency" in the
  title, H1 or slug.** This is the one deliberate break from the
  Birmingham/Manchester slug pattern.
- The one competitor page worth copying the stance of is LA NPDT: it says
  plainly that it serves DFW from Louisiana, same time zone, four hours away.
  Honest framing about where the team sits beats pretending.

## 4. Page spec

| Field | Value |
|---|---|
| URL | `/software-development-company-dallas/` |
| Title (59) | `Software Development Company in Dallas \| Roars Technologies` |
| Meta (141) | `Software and web app development for Dallas-Fort Worth teams, from Frisco to Fort Worth. Strategy, UX and engineering in one team since 2005.` |
| H1 | `Software Development Company in Dallas-Fort Worth` |
| Eyebrow | `SOFTWARE DEVELOPMENT / DALLAS-FORT WORTH` |
| Primary keyword | software development company dallas |
| Secondary | web application development company texas, custom software development dallas, web app development frisco, software development company texas |
| National catch | web app development company in usa, software development outsourcing company |
| Canonical | self, trailing slash |
| Schema | `Service` (provider = Organization `@id`, areaServed = Dallas, Fort Worth, Frisco, Plano as `City`) + `BreadcrumbList`. **No `LocalBusiness`**, unless option A and the address takes walk-in visits. |

## 5. Section plan

Same template as Manchester and Birmingham, Dallas-specific content. What makes
those two not clones is their own economy paragraph, service mix, case studies
and process emphasis. Dallas gets the same.

1. **Hero.** Eyebrow, H1, subline: *Custom software for the companies moving
   their headquarters here, and the ones already running on spreadsheets.*
   Fact strip swaps the UK line for: `US LINE +1 (302) 505-1200`,
   `HOURS 08:00 to 17:00 CT [CONFIRM]`, `FIRST REPLY Within 24 hours`,
   `KICK-OFF On site in Frisco or remote [CONFIRM]`.
2. **By the numbers, Dallas paragraph** (the unique block, 347 chars, trimmed
   by the owner to fit the schema's 420 cap):

   > DFW is home to 24 Fortune 500 headquarters, and much of its growth is
   > companies moving in. A relocated headquarters brings a hiring plan, a
   > migration and systems built for a different office. The work that follows
   > is rarely a new idea. It is making four inherited systems agree, and
   > building the internal tools nobody had time for during the move.

   Sources: Dallas Regional Chamber 2026 Fortune 1000 guide; Dallas Innovates,
   Jun 2026.
3. **Services, Dallas mix** (six, in this order, each linking its `/s/` page):
   Web App Development, Custom Software / Product Development, Digital
   Transformation, Hire Dedicated Developers, AI Automation, Mobile App
   Development. Write each blurb for the relocation / operations angle. Do not
   reuse Birmingham's or Manchester's sentences.
4. **How an engagement runs**, Dallas emphasis is time zones: Discovery (map
   what came with the move), Design (prototype with the people who run it),
   Build (two-week sprints; standups inside Central business hours, with the
   overnight India shift handing off a reviewed build each morning [CONFIRM the
   overlap actually run]), Launch (cutover without downtime).
5. **Selected work**, matched to DFW's sectors and to queries already ranking
   (retail 261 impr., real estate 233, logistics): Snowman Logistics, Tanishq,
   The President's Club. Not FlowRow, GymBait or Parqly; those are Manchester's
   set.
6. **Why teams in Dallas-Fort Worth bring the build to us**, six points,
   unique to this page:
   - *A US number and a Frisco address* [option A only].
   - *Central Time overlap* with the honest split of who is where.
   - *US contracts and billing* [CONFIRM: USD invoicing, US entity or Delaware?].
   - Plus three from the shared pool, reworded.
7. **FAQ**, all answers rendered in HTML, no `FAQPage` schema, as agreed in the
   launch brief:
   - Do you have an office in Dallas? (Frisco answer, or the honest remote one)
   - Which time zone does the team work in?
   - How much does custom software development cost for a Dallas company?
     (real ranges or engagement models) [CONFIRM]
   - Do you sign US contracts and NDAs?
   - Can you take over software another agency built?
8. **Testimonials.** US clients only if they exist [CONFIRM]. If none, the
   shared block is fine.
9. **CTA**, US number first.

Target 900+ words, at least 60% not shared with any other city page.

## 6. Internal links

- `/contact-us/`: link the city name in the Frisco office block.
- `/s/web-app-development/`, `/s/product-development-company/` and
  `/s/hire-dedicated-developers/`: one contextual sentence each.
- Homepage: only if a locations strip already exists. Do not add one.

## 7. Homepage title and meta

Separate commit, so Search Console can attribute each change. The homepage
takes 9.7K US impressions and converts none; its title never says software
development, web app development, outsourcing or USA.

- Frisco confirmed: `Web & Software Development Company in USA | Roars`
- No Frisco: `Software Development Outsourcing Company | Roars` — "in USA"
  would imply a US base that does not exist.

## 8. What success looks like, at 28 and 60 days

- The page indexed and in `sitemap-0.xml`.
- It, not the homepage, is the ranking URL for the Texas / DFW queries above.
- US clicks above 3 per quarter.
- Homepage US CTR above 0.5% after the title change.
