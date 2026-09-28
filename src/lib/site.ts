/**
 * Global site constants. Single source for anything that appears
 * in metadata, structured data or contact blocks.
 */

export const site = {
  name: 'Roars Technologies',
  shortName: 'Roars',
  legalName: 'Roars Technologies Pvt. Ltd.',

  /** Canonical host. No trailing slash. Every canonical builds from this. */
  url: 'https://www.roarsinc.com',

  locale: 'en_US',
  language: 'en',
  titleSuffix: ' | Roars Technologies',
  defaultOgImage: '/og/roars-default-1200x630.jpg',

  twitter: '@roarstech',
  founded: '2005',

  /**
   * ONE PUBLIC ADDRESS. There used to be a `contact` key here as well, and the
   * site printed both: the footer, the menu band, the forms, the thank-you
   * page and the transactional email templates all said sales@, while the five
   * office records and one envelope link on /contact-us/ said contact@. Two
   * addresses on one page is a question the reader should not have to answer,
   * and nothing on the site explained the difference. Settled on sales@,
   * which was already the one on every call to action.
   *
   * Belgium keeps be@roarsinc.com below. That is a different desk, not a
   * second spelling of this one.
   */
  email: {
    sales: 'sales@roarsinc.com',
  },

  phones: {
    US: { display: '+1 (302) 505-1200', tel: '+13025051200' },
    UK: { display: '+44 (7537) 183399', tel: '+447537183399' },
  },

  booking: 'https://meet.roarsinc.com/suzanne/sales',
  companyProfile: 'https://link.roars.in/F39Mv',

  /** Used as Organization.sameAs. Order is deliberate: strongest first. */
  sameAs: [
    'https://www.linkedin.com/company/roars-technologies-pvt.-ltd.',
    /* Clutch, added 16 Sep. It sits second because it is the profile that
       carries the client reviews — the strongest third-party corroboration
       the business has, and the one that links back here. */
    'https://clutch.co/profile/roars-technologies',
    'https://x.com/roarstech',
    'https://www.instagram.com/roarstech',
    'https://www.facebook.com/roarstech/',
  ],

  /**
   * `city` feeds the Organization schema's PostalAddress, which wants the real
   * locality. `label` is what the footer prints: the prototype's Offices slot
   * is 234px of 12px type before it collides with the Built by column, and the
   * five city names measure 234.05px — exactly the budget, which is why they
   * ran into it. The five country names measure 185px and fit with room.
   */
  offices: [
    { code: 'IN', label: 'India',   city: 'Bengaluru',         region: 'Karnataka', country: 'IN',
      street: '4th Block, Jayanagar, Bengaluru', postal: 'India, 560041',
      email: 'sales@roarsinc.com', phone: '+91 7990050464' },
    { code: 'US', label: 'USA',     city: 'Frisco',            region: 'TX',        country: 'US',
      street: '9300 John Hickman Parkway,', postal: 'Frisco TX 75035',
      email: 'sales@roarsinc.com', phone: '+1 (302) 505-1200' },
    { code: 'UK', label: 'UK',      city: 'London',            region: '',          country: 'GB',
      street: '11 Tennyson Court, Marylebone,', postal: 'London, NW1 6QB, UK',
      email: 'sales@roarsinc.com', phone: '+44 (7537) 183399' },
    { code: 'BE', label: 'Belgium', city: 'Heist op den Berg', region: '',          country: 'BE',
      street: 'Kleine Steenweg 1.88', postal: '2221 Heist op den Berg, België',
      email: 'be@roarsinc.com', phone: '+32 495/483948' },
    /* The export prints no number for Germany. It is not invented here. */
    { code: 'DE', label: 'Germany', city: 'München',           region: '',          country: 'DE',
      street: 'Herzog-Wilhelm-Straße 17', postal: 'München, Germany',
      email: 'sales@roarsinc.com', phone: '' },
  ],

  /**
   * THE HEADLINE FIGURES, IN ONE PLACE.
   *
   * Supplied by the owner. They replace the set the build had been carrying
   * since the migration (250+ projects, 96% returning customers), which came
   * from the old site.
   *
   * TWO TRIOS, NOT ONE. A page that shows three figures uses `primary` unless
   * it already sits next to a page that does, in which case it takes `alt` —
   * the same three numbers on every section reads as a template, and the
   * owner supplied a second set for exactly that reason.
   *
   * Individual values are also exported so prose can use one on its own
   * ("1,500+ products shipped since 2005") without a second copy of the
   * number going stale next to the trio.
   */
  stats: {
    yearsInBusiness: '20+',
    projectsDelivered: '1,500+',
    aiDriven: '63%',
    happyCustomers: '1,000+',
    globalAwards: '7+',
    /* THE TEAM, IN ONE PLACE, for the same reason happyCustomers is in one
       place. Three figures claimed to be the team and all three were typed by
       hand: the homepage said 25, the about page's counter said 25 on top of
       five named portraits (so the page totalled thirty), and the about hero
       said 37. A reader who visited two of those pages was told two different
       things about the same company. Every one of them now derives from here,
       so moving this moves all of them. */
    teamSize: 25,
  },

  statSets: {
    primary: [
      { value: '20+', label: 'Years of Excellence' },
      { value: '1,500+', label: 'Projects Delivered' },
      { value: '63%', label: 'AI-Driven Solutions' },
    ],
    alt: [
      { value: '20+', label: 'Years of Excellence' },
      { value: '1,000+', label: 'Happy Customers' },
      { value: '7+', label: 'Global Awards' },
    ],
  },
} as const

/** Absolute URL builder. Always use this; never concatenate by hand. */
export const abs = (path: string): string =>
  `${site.url}${path.startsWith('/') ? path : `/${path}`}`

/* ------------------------------------------------------------------ */

/**
 * SITE-WIDE INDEXING SWITCH.
 *
 * Indexing is OFF by default and stays off until the whole site is built.
 * Every page emits `noindex, nofollow` while this is false, so a page cannot
 * reach the index just because a route went live early.
 *
 * The default is deliberately fail-safe: the switch must be turned ON to be
 * indexed, so forgetting it costs traffic you never had rather than leaking a
 * half-built site into search results.
 *
 * To go live, set the environment variable in the deploy workflow:
 *
 *     PUBLIC_ALLOW_INDEXING=true
 *
 * Turning it on is a launch-checklist item (docs/SEO-SPEC.md section 16), not
 * a code change. Read docs/NOINDEX.md before flipping it.
 */
export const ALLOW_INDEXING = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true'

/**
 * The robots directive for a normal, indexable page. From docs/SEO-SPEC.md
 * section 3.1. Per-page noindex (utility pages, paginated archives) overrides
 * this regardless of the switch.
 */
export const ROBOTS_INDEX =
  'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'

export const ROBOTS_NOINDEX = 'noindex,nofollow'

/**
 * Keep this page out of the index, but follow what it links to.
 *
 * For paginated archives. /our-journal/page/2..5/ are thin by nature — a list
 * of cards already shown elsewhere — so they should not be indexed. But pages
 * 2 to 5 are the ONLY internal path to posts 11 through 60, and `nofollow`
 * told a crawler to stop there, orphaning fifty posts behind a door marked do
 * not open. noindex keeps them out of results; follow keeps the posts reachable.
 */
export const ROBOTS_NOINDEX_FOLLOW = 'noindex,follow'

/**
 * Resolve the robots value for one page.
 *
 * `'follow'` asks for noindex,follow. Plain `true` still means nofollow, which
 * is right for a utility page or a held-back case study: those link nowhere we
 * want crawled from. The dev switch overrides both — an unindexed build says
 * nofollow everywhere, because on dev there is nothing worth following.
 */
export const robotsFor = (pageNoindex: boolean | 'follow' = false): string => {
  if (!ALLOW_INDEXING) return ROBOTS_NOINDEX
  if (pageNoindex === 'follow') return ROBOTS_NOINDEX_FOLLOW
  return pageNoindex ? ROBOTS_NOINDEX : ROBOTS_INDEX
}
