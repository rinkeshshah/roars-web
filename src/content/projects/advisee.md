---
title: "Advisee"
client: "Advisee"
industry: ["finance"]
migrated: true
publishedAt: 2025-03-27
dateLabel: "Mar 27, 2025"
headline: "Advisee"
heroImage: "/work/advisee.jpg"
about: "Advisee, a trusted platform for mutual fund investments, partnered with Roars Technologies to revamp its digital presence. The goal was to create a seamless, engaging, and high-performing website that reflects the company’s credibility, enhances user experience, and simplifies investment decisions for users."
facts:
  - k: "Expertise"
    v: "Branding, Design, Interaction and Development"
  - k: "Deliverables"
    v: "Branding, UX, UI, Strategy, Web Development"
  - k: "Technology"
    v: "Wordpress"
  - k: "Branding"
    v: "Color Therapy"
  - k: "Typography"
    v: "Icongraphy"
blocks:
  - heading: "Rebrand Advisee for Market Leadership"
    lead: "Create a strong, trustworthy brand identity aligned with the finance and investment sector."
  - heading: "Enhance User Experience & Engagement"
    lead: "Design a sleek, intuitive interface that simplifies the investment journey and ensures seamless navigation."
  - heading: "Build Trust Through Design & Content"
    lead: "Use modern UI elements, clear typography, and a structured layout to establish authority in the financial sector."
  - heading: "Strategic Branding & Visual Identity"
    lead: "Designed a cohesive color palette, typography, and visual elements that establish trust and reliability."
# EVERY PICTURE CARRIES ITS SIZE, and that is what unsticks this page.
#
# The web captures are 1.05 to 1.59 tall, and one full blog page is 0.70. The
# web grid was cropping all of them into a 16/10 box, so every screenshot lost
# its bottom half and you were looking at a strip of a header. They take the
# column at their own shape now.
#
# Three assets from the client's folder were on no page at all: the brand
# logo, the icon set, and the legacy persona page. They are here.
gallery:
  # Not in the WordPress export, so there is no upload path to point at.
  # Served from this repo.
  - src: "/work/advisee/logo.png"
    kind: "study"
    w: 1008
    h: 436
    alt: "The Advisee mark and wordmark in blue and lime, on light and dark grounds"
    caption: "The mark"
  - src: "/wp-content/uploads/2025/03/advisee-colors.png"
    kind: "study"
    w: 937
    h: 358
    alt: "The Advisee palette: lime green and two blues with their tints"
    caption: "Colour"
  - src: "/wp-content/uploads/2025/03/Typography-e1743077765250.png"
    kind: "study"
    w: 667
    h: 461
    alt: "The Advisee type scale, a heading weight over a paragraph of body copy"
    caption: "Type"
  - src: "/work/advisee/icons.png"  # not in the export either
    kind: "study"
    w: 768
    h: 253
    alt: "The Advisee icon set, thin line icons for wealth, planning and advice"
    caption: "Iconography"
showcase:
  - src: "/wp-content/uploads/2025/03/advsiee-1.png"
    kind: "web"
    w: 1536
    h: 965
    alt: "The Advisee home page: Make your wealth work for you, over a portrait"
    caption: "Home"
  - src: "/wp-content/uploads/2025/03/advisee-stats.png"
    kind: "web"
    w: 1536
    h: 1226
    alt: "The Advisee figures band: 1000 plus clients, 25 percent, one billion, 40 plus"
    caption: "The figures, and what they are for"
  - src: "/wp-content/uploads/2025/03/advisee-services.png"
    kind: "web"
    w: 1536
    h: 1363
    alt: "The Advisee services section: complete and exclusive financial solutions"
    caption: "Services"
  - src: "/wp-content/uploads/2025/03/legacy-1.png"
    kind: "web"
    w: 1536
    h: 1460
    alt: "The Legacy Creators persona page: Preserving Wealth with a Balanced Approach"
    caption: "One persona, one page"
  - src: "/wp-content/uploads/2025/03/advisee-5.png"
    kind: "web"
    w: 1536
    h: 1090
    alt: "The Advisee insight band: what is new on Advisee, over a blue panel"
    caption: "Unlock your financial potential"
  - src: "/wp-content/uploads/2025/03/foooter.png"
    kind: "web"
    w: 1536
    h: 1238
    alt: "The Advisee footer with the newsletter sign-up and the site map"
    caption: "The footer, which is where the enquiry starts"
screens:
  - src: "/wp-content/uploads/2025/03/advisee-blog.png"
    kind: "web"
    w: 1431
    h: 2048
    alt: "The Advisee insights index: latest updates from the world of wealth management"
    caption: "Insights, end to end"
# High impressions, near-zero clicks, and a body that is 293 words. Tracked
# rather than hidden: every validate-content run prints it.
needsRewrite: true
# THE PRESENTATION LAYOUT, from `Roars v2 - Work Presentation.dc.html`.
# Content is the design's own, transcribed from the handoff of 17 Sep. Image
# paths are remapped: the design reads from a local `uploads/` folder, this
# site serves the client's own files from public/work/ and the migrated ones
# from the WordPress uploads directory, which scripts/validate-content.mjs
# checks against the export.
presentation:
  line: "A mutual fund investment platform, rebuilt around trust."
  constraints:
    - "Four distinct personas"
    - "Regulated sector"
    - "Trust before persuasion"
    - "Built to be extended"
  coverPlate:
    src: "/work/advisee/advsiee-1-1536x965.png"
    w: 1536
    h: 965
    alt: "Advisee"
  meta:
    - k: "CLIENT"
      v: "Advisee"
    - k: "SECTOR"
      v: "Wealth & Asset Management"
    - k: "SCOPE"
      v: "Brand system · UX/UI · Web build"
    - k: "SURFACES"
      v: "Marketing site · Personas · Newsroom"
  challengeLead: "Advisee had the credentials of an institution and the presence of a startup."
  challengeBody: "Family offices, NRIs and business owners all arrived at the same undifferentiated page. The work was to build one identity strong enough to carry four audiences, then design the surfaces that prove competence in the first five seconds — numbers, people, and a route to an advisor."
  artifacts:
    - img:
        src: "/work/advisee/Brand-Logo.png"
        w: 1008
        h: 436
        alt: "Logo system"
      label: "Logo system"
      note: "One mark, eight sanctioned lockups — so the brand survives a navy header, a white deck and a 32px favicon."
    - img:
        src: "/work/advisee/advisee-colors.png"
        w: 937
        h: 358
        alt: "Colour"
      label: "Colour"
      note: "Blue #1273CF carries authority; the green is reserved for growth moments. Nine steps each, so contrast never gets negotiated."
    - img:
        src: "/work/advisee/Typography-e1743077765250.png"
        w: 667
        h: 461
        alt: "Typography"
      label: "Typography"
      note: "Libre Baskerville for the claim, Montserrat for everything that has to be read. Serif appears only where we want a pause."
    - img:
        src: "/work/advisee/icons-768x253.png"
        w: 768
        h: 253
        alt: "Iconography"
      label: "Iconography"
      note: "A single stroke weight across the set, drawn to sit at 24px in dense advisory content."
  screens:
    - img:
        src: "/work/advisee/advsiee-1-1536x965.png"
        w: 1536
        h: 965
        alt: "A claim, a face, and a way in"
      kicker: "HOMEPAGE"
      title: "A claim, a face, and a way in"
      note: "The hero carries one promise and one advisor. The persona selector sits below the fold line so each audience self-sorts within a scroll."
    - img:
        src: "/work/advisee/advisee-stats-1536x1226.png"
        w: 1536
        h: 1226
        alt: "Four numbers, no charts"
      kicker: "PROOF BAND"
      title: "Four numbers, no charts"
      note: "1000+ families, 25% CAGR, $1B under management, 40+ partners. Stated once, large, then never repeated — repetition reads as insecurity."
    - img:
        src: "/work/advisee/advisee-services-1536x1363.png"
        w: 1536
        h: 1363
        alt: "Services shown as people, not tiles"
      kicker: "BUSINESSES"
      title: "Services shown as people, not tiles"
      note: "Three portrait plates instead of icon cards. Advisory is bought from humans, so the imagery does the reassurance and the caption does the detail."
    - img:
        src: "/work/advisee/legacy-1-1536x1460.png"
        w: 1536
        h: 1460
        alt: "A dedicated page per audience"
      kicker: "PERSONAS"
      title: "A dedicated page per audience"
      note: "Legacy creators get succession language and their own hero. Same components, different weighting — which is what makes four journeys affordable."
    - img:
        src: "/work/advisee/advisee-5-1536x1090.png"
        w: 1536
        h: 1090
        alt: "Insight as an expandable stack"
      kicker: "NEWSROOM"
      title: "Insight as an expandable stack"
      note: "Articles open in place against a tinted plate. Publishing cadence stays visible without a wall of cards."
    - img:
        src: "/work/advisee/foooter-1536x1238.png"
        w: 1536
        h: 1238
        alt: "One ask at the end"
      kicker: "CONVERSION"
      title: "One ask at the end"
      note: "Start a conversation, or take the newsletter. The two asks are separated by colour so neither competes."
  tall:
    src: "/work/advisee/advisee-blog-1431x2048.png"
    w: 1431
    h: 2048
    alt: "The newsroom index, end to end"
  tallTitle: "The newsroom index, end to end"
  tallNote: "Editorial layout that stays legible from three posts to three hundred: a staggered column rhythm, author and date before the headline, and image crops that break the grid just enough to keep the page moving. Scroll it."
  buildLead: "A component library the client can extend without a designer in the room."
  stack:
    - k: "Design"
      v: "Figma library — tokens for colour, type and spacing, components mapped 1:1 to build"
    - k: "Build"
      v: "WordPress with a component-driven page builder, so marketing ships pages unaided"
    - k: "Content model"
      v: "Personas, services and newsroom as separate types — each reuses the same blocks"
    - k: "Handoff"
      v: "Brand guidelines, logo pack, icon set and a page-assembly playbook"
  outcomeLead: "One system, four audiences, no redesign needed to add the fifth."
  outcomes:
    - big: "4"
      label: "Persona journeys running on one component set"
    - big: "8"
      label: "Sanctioned logo lockups replacing ad-hoc usage"
    - big: "1B"
      label: "Dollars under management, stated once and clearly"
    - big: "0"
      label: "Designer hours needed to publish a new page"
  nextNote: "Investor login, portfolio reporting and a regional language layer are already drawn against the same components."
seo:
  title: "Advisee: a mutual fund investment platform, rebuilt"
  description: "Advisee, a trusted platform for mutual fund investments, partnered with Roars Technologies to revamp its digital presence. The goal was to create a seamless, engaging, and high-performing website that reflects the company’s credibility, enhances user experience, and simplifies investment decisions for users."
  primaryIntent: "advisee"
  schemaType: "CreativeWork"
# Reviewed 16 Sep 2026: slot assignment checked against the live page, client
# named consistently throughout, SEO block checked against this project.
# See docs/OPEN-DECISIONS.md for what the pass covered and what it did not.
needsReview: false
---
With strategic branding, intuitive UX/UI design, and a robust WordPress framework, we helped Advisee establish a modern, professional, and user-friendly platform tailored for investors.

## Objectives

## UX/UI Innovation

Our design team restructured the website’s layout for clarity, ease of navigation, and improved user engagement.

## User-Centric UX/UI Design

Designed an intuitive, step-by-step flow that simplifies mutual fund discovery and investment decisions.

## Strategic Revamp

From visual elements to content structuring, we ensured that Advisee’s platform effectively communicates trust, expertise, and reliability.

## Enhancing User Trust & Engagement

Focused on a professional yet approachable tone in content and design to build credibility.

## Project Outcome

## Revamped Brand Identity

A fresh, professional look that aligns with Advisee’s mission and target audience.

## Increased User Engagement

A streamlined UX/UI design that improves accessibility, trust, and conversion rates.

## Stronger Market Positioning

Advisee now stands out as a go-to platform for mutual fund investors, attracting more users and enhancing credibility.
