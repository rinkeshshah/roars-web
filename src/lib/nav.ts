/**
 * Navigation. Labels are the design's; hrefs are the inventory's.
 *
 * CLAUDE.md rule 1: when a design spec and docs/URL-INVENTORY.csv disagree,
 * the CSV wins. "Projects" therefore serves /work/ and "Insights" serves
 * /our-journal/. Nav labels do not have to match URLs and these do not.
 */
import { LISTED_PROJECTS } from './projects'

export interface NavItem { label: string; href: string }

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Agency', href: '/about-us/' },
  { label: 'Approach', href: '/approach/' },
  { label: 'Projects', href: '/work/' },
  { label: 'Insights', href: '/our-journal/' },
  { label: 'Contact', href: '/contact-us/' },
]

/**
 * Footer navigation. Five items, not six: the approved Main prototype's footer
 * omits Approach, and the prototype is the visual target. The Approach spec's
 * own footer lists six, which is the disagreement; this resolves it in the
 * prototype's favour by decision, and the page itself stays in NAV above so it
 * is still reachable from the nav overlay and the sitemap.
 */
export const FOOTER_NAV: NavItem[] = NAV.filter((i) => i.label !== 'Approach')

export const SOCIAL: NavItem[] = [
  { label: 'Twitter', href: 'https://www.twitter.com/roarstech' },
  { label: 'Instagram', href: 'https://www.instagram.com/roarstech' },
  { label: 'LinkedIn', href: 'https://in.linkedin.com/company/roars-technologies-pvt.-ltd./' },
]

export const LEGAL: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Service', href: '/terms-of-service/' },
  { label: 'Company Profile', href: 'https://link.roars.in/F39Mv' },
]

/**
 * The full-screen menu. Nine rows, each revealing its own panel.
 *
 * `href` is null where no index route exists. The design implies /industries/
 * and /services/ index pages; neither is in docs/URL-INVENTORY.csv and
 * CLAUDE.md rule 1 is never invent a URL. Those two rows render as buttons
 * that reveal their panel, and the panel carries the real destinations. If
 * those index pages are wanted, they are a decision, not an implementation
 * detail — docs/OPEN-DECISIONS.md records it.
 *
 * Copy is verbatim from design/prototypes/Roars v2 - Menu.dc.html, except the
 * founder's name, which the export still ships scrambled.
 */
export interface MenuLink { label: string; href: string | null; meta?: string; note?: string }
export interface MenuItem {
  n: string
  label: string
  href: string | null
  meta?: string
  eyebrow: string
  title: string
  body?: string
  /** Panel sub-content. `kind` picks the layout the prototype draws. */
  kind: 'links' | 'cards' | 'sectors' | 'services' | 'kits' | 'posts' | 'contact'
  items?: MenuLink[]
  /** Work panel only: the pill under the six project cards. */
  all?: MenuLink
  /** About panel only: the right-hand "our own ventures" block, two lines. */
  ventures?: string[]
  /** Industries panel only: the closing line under the eight sectors. */
  footnote?: string
}

/**
 * The resting panel — what the right-hand side shows before the cursor has
 * touched a row. Verbatim from the export.
 */
export const MENU_REST = {
  eyebrow: 'ROARS / SINCE 2005',
  title: 'We create delightful experiences that matters.',
  statLabel: '20 YEARS OF EXCELLENCE IN PRODUCT CONSULTING',
  stats: [
    { value: '20+', label: 'YEARS OF EXCELLENCE' },
    { value: '4,000+', label: 'PROJECTS DELIVERED' },
    { value: '63%', label: 'AI-DRIVEN SOLUTIONS' },
  ],
  hint: 'HOVER A SECTION TO EXPLORE',
}

/** The contact bar along the bottom of the overlay. */
export const MENU_BAND = {
  offices: [
    { label: 'USA', value: '+1 (302) 505-1200', href: 'tel:+13025051200' },
    { label: 'UK', value: '+44 (7537) 183399', href: 'tel:+447537183399' },
  ],
  email: { label: 'EMAIL', value: 'sales@roarsinc.com', href: 'mailto:sales@roarsinc.com' },
  cta: { label: 'Book a discovery call', href: '/contact-us/' },
}

export const MENU: MenuItem[] = [
  {
    n: '01', label: 'home', href: '/',
    eyebrow: '01 / HOME',
    title: 'Space of Product Solutions',
    body: 'Product development for startups and SMEs. Strategy, design and engineering under one roof, run by the same team since 2005.',
    kind: 'links',
    items: [
      { label: 'Overview', href: '/' },
      { label: 'How we work', href: '/approach/' },
      { label: 'Selected work', href: '/work/' },
    ],
  },
  {
    n: '02', label: 'about us', href: '/about-us/',
    eyebrow: '02 / ABOUT US',
    title: 'The team behind 4,000+ products',
    body: 'Founded in 2005 by Rinkesh A Shah. Eight senior people, five ventures of our own, and clients who come back for the next build.',
    kind: 'links',
    items: [
      /* Same as Approach above: two rows, one destination. */
      { label: 'The agency', href: '/about-us/#agency' },
      { label: 'Leadership & team', href: '/about-us/#team' },
      /* 'Brand guidelines' used to sit here with href: null, so it rendered as
         a span dressed like the two links above it, with the same rule and the
         same arrow, and went nowhere when clicked. It is the internal design
         page, the same one already taken out of the Resources panel below for
         this reason. A menu that lists something you cannot open is worse than
         a shorter menu. */
    ],
    ventures: ['Produit · Hostwala · UX Audit Pro', 'Microkopy · GetAutomation'],
  },
  {
    n: '03', label: 'approach', href: '/approach/',
    eyebrow: '03 / APPROACH',
    title: 'How an engagement runs',
    body: 'Four stages, a named project manager, and a monthly cadence you can scale up or down.',
    kind: 'services',
    items: [
      /* Four rows that all went to the same URL, so picking Build and picking
         Discovery did the same thing: land at the top of /approach/ and scroll.
         The stages now carry anchors on the page itself. */
      { label: 'Discovery', href: '/approach/#discovery', note: 'Workshops, market review, product definition' },
      { label: 'Design', href: '/approach/#design', note: 'Flows, prototypes, a tested interface' },
      { label: 'Build', href: '/approach/#build', note: 'Two-week sprints, demo every Friday' },
      { label: 'Launch & scale', href: '/approach/#launch-and-scale', note: 'Release, measure, iterate on real usage' },
    ],
  },
  {
    /* The count was typed here as '11 PROJECTS' and again as 'All 11 projects'
       below, against a grid built from LISTED_PROJECTS. Three numbers, one
       fact, and nothing keeping them equal — the menu said eleven while the
       page's own meta description said twelve. Both read the list now. */
    n: '04', label: 'work', href: '/work/', meta: `${LISTED_PROJECTS.length} PROJECTS`,
    eyebrow: '04 / WORK',
    title: 'Selected projects',
    kind: 'cards',
    items: [
      { label: 'Snowman Logistics', href: '/work/warehouse-compliance-checklist-app/', meta: 'LOGISTICS' },
      /* The href was /work/flowrow-fitness-app/ under this label. They are two
         different projects: GymBait.AI is an AI gym and fitness app, FlowRow
         is a rowing workout app, and both have their own live URL. This card
         is the GymBait one — it is in FEATURED_ORDER in src/lib/projects.ts
         under that slug — so the href moves, not the label. */
      { label: 'GymBait.AI', href: '/work/gymbait/', meta: 'FITNESS' },
      { label: 'Parqly', href: '/work/parqly-parking-solution/', meta: 'MOBILITY' },
      { label: 'Concierge Loyalty', href: '/work/concierge-loyalty-program/', meta: 'CONCIERGE' },
      { label: 'GISAID', href: '/work/gisaid-health-tech/', meta: 'HEALTHCARE' },
      { label: 'Advisee', href: '/work/advisee/', meta: 'SAAS' },
    ],
    all: { label: `All ${LISTED_PROJECTS.length} projects`, href: '/work/' },
  },
  {
    n: '05', label: 'industries', href: null, meta: '9 SECTORS',
    eyebrow: '05 / INDUSTRIES',
    title: 'Sectors we already understand',
    kind: 'sectors',
    items: [
      { label: 'Restaurant', href: '/industries/food-restaurant-app-development/', meta: 'VIEW SECTOR' },
      { label: 'Fitness', href: '/industries/on-demand-fitness-app-development/', meta: 'VIEW SECTOR' },
      { label: 'eCommerce', href: '/industries/retail-ecommerce-development/', meta: 'VIEW SECTOR' },
      { label: 'Travel', href: '/industries/travel-and-hospitality-app-development/', meta: 'VIEW SECTOR' },
      { label: 'Logistics', href: '/industries/logistics-transportation-app-development/', meta: 'VIEW SECTOR' },
      { label: 'SaaS', href: '/industries/saas-application-development-services/', meta: 'VIEW SECTOR' },
      { label: 'Healthcare', href: '/industries/healthcare-app-development-company/', meta: 'VIEW SECTOR' },
      { label: 'Concierge', href: '/industries/concierge-app-development/', meta: 'VIEW SECTOR' },
      /* The ninth. This panel's own meta has said '9 SECTORS' since it was
         built and it listed eight: /industries/education-mobile-app-development/
         was reachable from the sector grid at the foot of the other eight pages
         and from nowhere in the navigation. */
      { label: 'Education', href: '/industries/education-mobile-app-development/', meta: 'VIEW SECTOR' },
    ],
    footnote: 'We build in sectors we already know, so discovery starts from something, not nothing.',
  },
  {
    n: '06', label: 'services', href: null, meta: '12 SERVICES',
    eyebrow: '06 / SERVICES',
    title: 'What we do',
    kind: 'services',
    /* ALL TWELVE. The panel's own meta says "12 SERVICES" and it listed five,
       so seven services had no route through the menu at all — including
       eCommerce, DevOps and Hire Dedicated Developers, which people arrive
       looking for by name. Order follows /s/, which groups them by the
       question that sends you there. */
    items: [
      { label: 'MVP Development', href: '/s/mvp-development/', note: 'Eight to sixteen weeks to launch' },
      { label: 'Innovation Design', href: '/s/innovation-design-company/', note: 'Make an ambition specific enough to test' },
      { label: 'Product Development', href: '/s/product-development-company/', note: 'Strategy through engineering' },
      { label: 'Mobile App Development', href: '/s/mobile-app-development/', note: 'iOS, Android, cross-platform' },
      { label: 'Web App Development', href: '/s/web-app-development/', note: 'The system that replaces the spreadsheet' },
      { label: 'eCommerce Development', href: '/s/ecommerce-development-company/', note: 'Storefront, checkout, stock integration' },
      { label: 'User Experience Design', href: '/s/user-experience-design-agency/', note: 'Research, flows, interface' },
      { label: 'Growth Hacking', href: '/s/growth-hacking-agency/', note: 'Small bets with a read on each' },
      { label: 'AI Automation', href: '/s/ai-automation-services/', note: 'Agents and workflow automation' },
      { label: 'DevOps', href: '/s/result-oriented-devops-services/', note: 'A release routine your own team runs' },
      { label: 'Hire Dedicated Developers', href: '/s/hire-dedicated-developers/', note: 'Named people, without the recruiting' },
      { label: 'Digital Transformation', href: '/s/digital-business-transformation-services/', note: 'When four systems disagree' },
    ],
  },
  {
    n: '07', label: 'resources', href: '/resources/', meta: '15 KITS',
    eyebrow: '07 / RESOURCES',
    title: 'Tools, guides and templates',
    body: 'Free downloads we use in our own discovery work.',
    kind: 'kits',
    /* The three shelves /resources/ actually has, in its own order, with the
       export's own numbering.

       It listed Insights and Brand guidelines before, neither of which is a
       resource: Insights is the journal, which is already item 08 below, and
       Brand guidelines is an internal design page with no URL at all. Both
       sent people out of the section this panel exists to open up. Staff Picks
       and Tools were missing because their URLs were missing from the
       inventory; they are real pages now. */
    items: [
      { label: 'Guides', href: '/resources/guides/', meta: '01 / PDF', note: 'Canvases and one-pagers, free as PDF' },
      { label: 'Staff Picks', href: '/resource/staff-picks/', meta: '02 / MIXED', note: 'The few we hand over most often' },
      { label: 'Tools', href: '/resource/tools/', meta: '03 / PDF', note: 'Hands-on, by the job you are doing' },
    ],
  },
  {
    n: '08', label: 'our journal', href: '/our-journal/',
    eyebrow: '08 / OUR JOURNAL',
    title: 'Notes from the studio',
    kind: 'posts',
    items: [
      { label: 'AI App Development vs Traditional App Development', meta: '15 MAY', href: '/our-journal/ai-app-development-vs-traditional-app-development-which-is-better-for-customer-engagement/' },
      { label: '20 Years of Roars: Built on Purpose, Driven by Impact', meta: '04 MAY', href: '/our-journal/20-years-of-roars-built-on-purpose-driven-by-impact/' },
      { label: 'The Unexpected Insight: we built a meal planning app', meta: '11 DEC', href: '/our-journal/the-unexpected-insight-we-built-a-meal-planning-app/' },
    ],
  },
  {
    n: '09', label: 'contact us', href: '/contact-us/',
    eyebrow: '09 / CONTACT US',
    title: 'Tell us what you are building',
    body: 'A 30 minute call with Rinkesh, no pitch deck. We will tell you what the build takes and what it costs.',
    kind: 'contact',
  },
]
