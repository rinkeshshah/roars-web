# Roars 2.0: Keyword Intent Map and Comparison Page Plan

Two jobs in one document.

**Part 1** is the intent map. It unblocks the build, because the SEO spec makes `primaryIntent` a required, publish-blocking field on every page and you cannot write title patterns without it.

**Part 2** is the comparison and roundup page programme. That is a content workstream for after launch, not a launch blocker. Do not let it slow the build down.

---

## 0. What this document is and is not

**What I could determine from live research:** SERP composition for your core categories, which page formats currently win, who occupies them, the freshness cadence required to hold position, and a cannibalisation audit of your existing URL set.

**What I could not determine and did not invent:** search volume, keyword difficulty, CPC, or your current rankings. I have no access to Ahrefs, Semrush or your Search Console. Every number in a keyword tool is an estimate anyway. There are no fabricated volume figures in this document, and you should be suspicious of any keyword plan that hands you three-decimal-place volumes without naming its source.

**The gap is easy to close, and you already own the best data source.**

### Step zero: export your own Search Console data

You have owner access. This is worth more than any third-party tool, because it is your actual performance on your actual URLs.

1. Search Console, `roarsinc.com` Domain property, Performance report
2. Date range: last 16 months, the maximum
3. Export the Queries tab, all rows, to CSV
4. Export the Pages tab, all rows, to CSV
5. Repeat with the Queries tab filtered to positions 5 to 20

That last one is the money file. Queries where you already sit on page one or two, with impressions but weak clicks, are the cheapest wins on the entire site. They need a better title, a better intro and a stronger internal link, not a new page.

Bring those three CSVs back and the intent map below becomes evidence-backed rather than structural.

---

## Part 1: Intent map

### 1.1 The cannibalisation problem

Reading your live nav, you have a structural issue that predates any redesign. Multiple URLs are competing for the same query.

| Cluster | Competing URLs | Problem |
|---|---|---|
| Mobile app development | `/s/mobile-app-development/` plus eight `/industries/*-app-development/` pages | Eight industry pages all carry "app development" in the slug. They compete with each other and with the generic service page. |
| Product build | `/s/product-development-company/`, `/s/mvp-development/`, `/startup-consultant-services/` | Three pages, one buyer, near-identical intent |
| Design | `/s/user-experience-design-agency/`, `/s/innovation-design-company/` | "UX agency" and "innovation design" overlap heavily in practice |
| SaaS | `/industries/saas-application-development-services/` vs `/s/product-development-company/` | SaaS is not really an industry, it is a product type |
| Staffing | `/s/hire-dedicated-developers/`, `/s/result-oriented-devops-services/` | Different offer to the rest of the site, different buyer |

**Why this matters more than usual for you:** Google picks one URL per intent. When three of your pages compete, they split link equity and Google often picks the weakest one. You may already be seeing this as "we rank position 14 for everything and position 3 for nothing."

**The fix, in order:**

1. Pull the GSC Pages export. For each cluster, find which URL actually earns impressions for the shared query.
2. That URL becomes canonical for the intent. It gets the depth, the case studies, the internal links.
3. The others either narrow to a genuinely different intent, or 301 into the winner.
4. Do this **before** the migration, not after. Consolidating during a redesign costs you one redirect. Consolidating later costs you two.

Do not resolve this from intuition. The GSC data decides it.

### 1.2 The intent taxonomy for your vertical

Four intent layers. Every page on the site belongs to exactly one.

| Layer | Query shape | Buyer state | Page type | Conversion |
|---|---|---|---|---|
| **Hire** | `[service] company`, `[service] agency`, `hire [role]` | Has budget, comparing vendors | Service page | High |
| **Choose** | `best [category] agencies`, `how to choose a [category] partner`, `[A] vs [B]` | Has budget, does not know who | Roundup or comparison | High, and underbuilt |
| **Scope** | `[thing] cost`, `how long does [thing] take`, `[tech A] vs [tech B]` | Planning, pre-budget | Guide or journal | Medium |
| **Learn** | `what is [concept]`, `[concept] principles`, `[concept] stages` | Researching, may not be a buyer | Journal | Low, but builds authority |

Your existing site is heavily weighted to Hire and Learn. **The Choose layer is almost empty, and that is where the money is.** More on that in Part 2.

### 1.3 Modifier taxonomy

When you build out service and industry pages, these are the modifier axes that create genuinely distinct intent rather than a noun swap.

| Axis | Modifiers | Creates a real page? |
|---|---|---|
| Role | company, agency, firm, partner, services, consultant | Yes, but pick one per intent. Do not build both "company" and "agency" variants. |
| Stage | for startups, for enterprise, for SMEs, pre-seed, Series A | Yes, if the content genuinely differs |
| Geography | in USA, in UK, in India, offshore, nearshore | Only with a real office and real local proof |
| Technology | React Native, Flutter, Next.js, n8n | Yes, strong intent, low competition |
| Outcome | MVP, redesign, migration, audit, rescue | Yes, this is the strongest axis you have |
| Industry | restaurant, fitness, logistics, healthcare, SaaS | Yes, but only with a case study in that industry |

**The hard rule from the programmatic spec:** an industry page with no case study, no named client and no sector-specific detail is a noun swap. It fails the standalone test and it is exactly what Google's scaled content abuse enforcement targets. You have ten case studies. That is roughly how many industry pages you can honestly support.

### 1.4 Assigning `primaryIntent`

For each page in the corrected URL map, fill this in `docs/INTENT-MAP.csv`:

```
url, layer, primary_intent, supporting_intents, gsc_impressions_16mo,
gsc_clicks_16mo, avg_position, canonical_for_cluster, action
```

`action` is one of: `keep`, `deepen`, `merge_into:<url>`, `narrow_to:<intent>`, `retire`.

Nothing gets built until this file exists. It is thirty rows of work and it prevents every cannibalisation mistake downstream.

---

## Part 2: Comparison and roundup pages

### 2.1 The finding that changes the plan

I expected the "best [category] agency" SERP to be owned by directories like Clutch, DesignRush and GoodFirms, with agency-written roundups nowhere.

That is not what is happening. Agency-owned blogs are ranking with these pages, at volume, right now:

| Page | Owner | Format |
|---|---|---|
| awesomic.com/blog/product-design-agencies | Awesomic, an agency | Roundup including competitors |
| awesomic.com/blog/product-design-agencies-for-startups | Awesomic | Roundup, stage-qualified |
| boldare.com/blog/top-10-product-development-agencies-in-2026 | Boldare, an agency | Roundup with HQ, team size, Clutch handle per entry |
| classicinformatics.com/blog/top-product-development-companies | Classic Informatics, an agency | Roundup |
| elsner.com/top-product-development-companies | Elsner, an agency | Roundup, root-level URL |
| orbix.studio/blogs/top-product-design-agencies | Orbix, a studio | Roundup with pricing and rating per entry |
| ayautomate.com/blog/best-ai-automation-agencies | AY Automate, an agency | Roundup, nine competitors, ranked |
| ayautomate.com/blog/best-ai-automation-consultants-2026 | AY Automate | Second roundup, adjacent category |
| layer3labs.io/comparisons/ai-consulting-vs-ai-automation-agency | Layer3 Labs | Dedicated `/comparisons/` directory |

**So the Choose layer is winnable by an agency, and you have almost nothing in it.**

Two more things the research showed:

**These pages win by being honest.** AY Automate's roundup explicitly tells readers to go to McKinsey QuantumBlack or BCG X for enterprise-wide AI operating model redesign, and has a "skip us if" section naming what they cannot do. Boldare's entries list each competitor's HQ, founding year, team size and Clutch handle, and name the constraints (one entry is described as limited in design and strategy depth because of team size). That specificity is what makes the page rank and what makes it convert. A roundup where you are obviously number one is a page nobody links to and nobody believes.

**They require maintenance.** Several of the top results were published within the last three weeks. This SERP resets constantly. A roundup you publish and abandon falls out within two quarters. Budget a quarterly review per page or do not publish it.

### 2.2 What to build, in priority order

Start with AI Automation. It is your newest service, the category is least entrenched, and `/s/ai-automation-services/` currently has the least accumulated equity to protect.

**Tier 1: build first, four pages**

| Page | Intent | Route |
|---|---|---|
| Best AI Automation Agencies, ranked and compared | `best ai automation agencies` | `/compare/best-ai-automation-agencies/` |
| AI Consulting vs AI Automation Agency | `ai consulting vs ai automation agency` | `/compare/ai-consulting-vs-ai-automation-agency/` |
| Build In-House vs Hire an Agency for AI Automation | `build in house vs hire agency ai` | `/compare/in-house-vs-agency-ai-automation/` |
| How to Choose an AI Automation Partner | `how to choose ai automation agency` | `/compare/how-to-choose-ai-automation-agency/` |

**Tier 2: after Tier 1 shows indexing and movement, roughly 6 to 8 weeks later**

| Page | Intent |
|---|---|
| Best Product Development Agencies for Startups | `best product development agency startups` |
| Agency vs In-House Product Team | `agency vs in house product team` |
| Toptal Alternatives for Building a Product Team | `toptal alternatives` |
| Upwork vs a Product Agency | `upwork vs agency software development` |
| MVP vs Full Build: Which Should You Start With | `mvp vs full product build` |

The Toptal and Upwork pages are worth calling out. That buyer is precisely your ICP, the query has real commercial intent, and you carry zero reputational risk comparing yourself to a marketplace rather than to a peer agency.

**Tier 3: technology decision pages, later**

`react native vs flutter for [use case]`, `next js vs wordpress for [use case]`, `n8n vs zapier vs custom`. Lower commercial intent, but they are cheap to write from real project experience, they earn links, and they feed the Scope layer.

### 2.3 What NOT to build

**Do not build "Roars vs [named agency]" pages.** They look defensive, the query volume is negligible unless the competitor is a household name, you cannot verify a private agency's pricing or team composition, and comparative claims about a named competitor carry real legal exposure in India, the UK and the US. Category roundups get you the same traffic with none of that.

**Do not build a comparison page per industry per service.** Eight industries times eleven services is eighty-eight pages of noun-swapped filler, and it is the textbook scaled content abuse pattern. If you cannot name the client and the outcome, the page does not exist.

**Do not use `aggregateRating` schema on these pages.** The skill template offers it. Ignore that. Self-serving review markup on a page you control, with no verifiable on-page reviews, is a manual action risk. This is consistent with the rule in the SEO spec. Use `ItemList` for roundups and `Article` for comparisons.

### 2.4 Page template: category roundup

Target 1,800 to 2,500 words. Nine to twelve entries.

```
1  H1: Best [Category] Agencies in [Year]: Ranked and Compared
2  Above fold
   - Two-sentence answer to the query, before anything else
   - "Last reviewed: [date]" and "How we assessed these" link
   - Affiliation disclosure, plainly: Roars is one of the agencies listed
3  Methodology
   - Named criteria. What was assessed, from which public sources.
   - What was not assessed and why
4  Comparison table
   - Agency | HQ | Founded | Team size | Best for | Typical engagement | Source
   - No feature ticks. Agencies do not have feature matrices. Buyers
     compare fit, depth and stage.
5  Entries, one per agency (~150 words each)
   - What they do well, specifically
   - Their real constraint, stated honestly
   - Best for: [named buyer profile]
   - Link out to their site, and to their Clutch or G2 profile
6  Roars entry
   - Same length and format as every other. No special treatment.
   - Choose Roars if: [three specific situations]
   - Skip Roars if: [two specific situations, honestly]
7  How to choose
   - Decision framework, not a pitch. Stage, complexity, budget,
     how much strategic help is needed before development starts.
8  FAQ, five to seven questions, matching real long-tail queries
9  Single CTA, at the bottom only
10 Related comparisons, three links
```

**CTA placement matters here.** One CTA, at the end. No CTA inside or next to a competitor's entry. That is the fastest way to make a roundup read as an advert and lose the trust the format depends on.

### 2.5 Page template: "A vs B" comparison

Target 1,500 to 2,000 words.

```
1  H1: [A] vs [B]: [The actual decision] ([Year])
2  The short answer, two to three sentences, before the argument
3  Side-by-side table: scope, deliverables, cost shape, timeline,
   who owns the output, what happens after launch
4  [A] explained: what it is, when it is right, honest limitations
5  [B] explained: same structure, same length
6  Decision framework: "choose A if" and "choose B if", three each
7  Where Roars sits, disclosed, brief, no more than 150 words
8  FAQ
9  Links to the relevant service page and two related comparisons
```

The "short answer first" structure is not just good writing. It is what gets the passage pulled into AI Overviews and cited by ChatGPT and Perplexity, which is why you are allowing those crawlers in the robots.txt.

### 2.6 Where these pages live

Use `/compare/` as a real directory, the way Layer3 Labs uses `/comparisons/`. Not `/blog/`, not `/our-journal/`.

Reasons: it keeps commercial-intent content structurally separate from editorial, it gives you a clean hub page at `/compare/`, and it produces sensible breadcrumbs. `/our-journal/` stays what it is, which is editorial.

New route, no legacy URLs, so no migration risk. Add `/sitemap-compare.xml`.

### 2.7 Schema for these pages

**Roundup:**

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best AI Automation Agencies in 2026",
  "itemListOrder": "https://schema.org/ItemListUnordered",
  "numberOfItems": 9,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "[Agency]", "url": "[their site]" }
  ]
}
```

Plus `Article` with `author`, `datePublished`, `dateModified`, `publisher` pointing at the `#organization` node, and `BreadcrumbList`. `itemListOrder` stays unordered unless you are genuinely ranking them, in which case say so in the methodology.

**Comparison:** `Article` plus `BreadcrumbList` plus `FAQPage` if the FAQ is rendered in the DOM. Nothing else.

### 2.8 Accuracy rules, non-negotiable

- Every claim about a named competitor traces to a public source, linked inline
- Anything that changes (team size, pricing, positioning) carries "as of [date]"
- Never state a competitor's weakness as fact unless it is publicly verifiable. "Publishes no office address" is a fact. "Slow to deliver" is an opinion and a liability.
- Affiliation disclosed above the fold, not in a footnote
- Quarterly review, and the `dateModified` only moves when you actually change something
- Named author with real credentials. These pages live or die on E-E-A-T.

### 2.9 Rollout

Sequenced against the build phases in the build spec.

| When | Action |
|---|---|
| Before build | GSC export, intent map, cannibalisation decisions |
| During build | `/compare/` route, hub page, `Article` and `ItemList` schema components. No content yet. |
| Launch + 2 weeks | Confirm the migration held. Rankings stable, indexing clean. Publish nothing new in this window. |
| Launch + 4 weeks | Tier 1, four pages, published together |
| Launch + 10 weeks | Assess. Indexed? Impressions? Position trend? Then Tier 2. |
| Quarterly | Review every published page. Update or unpublish. |

Publishing comparison pages during the migration is a bad idea. You will not be able to tell whether a ranking change came from the redesign or the new content, and you will need to know.

---

## What I need from you to finish this

The three GSC exports from section 0. With those I can turn the structural intent map into a ranked, evidence-backed one: which queries you already have a foothold on, which of your competing URLs is actually winning its cluster, and which page-one-position-eight queries would move with a title rewrite alone.

That last group is usually the fastest traffic gain available on a twenty-year-old site, and it costs nothing to build.
