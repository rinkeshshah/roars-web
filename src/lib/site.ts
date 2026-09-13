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

  email: {
    sales: 'sales@roarsinc.com',
    contact: 'contact@roarsinc.com',
  },

  phones: {
    US: { display: '+1 (302) 505-1200', tel: '+13025051200' },
    UK: { display: '+44 (7537) 183399', tel: '+447537183399' },
  },

  booking: 'https://meet.roarsinc.com/sales',
  companyProfile: 'https://link.roars.in/F39Mv',

  /** Used as Organization.sameAs. Order is deliberate: strongest first. */
  sameAs: [
    'https://www.linkedin.com/company/roars-technologies-pvt.-ltd.',
    'https://twitter.com/roarstech',
    'https://www.instagram.com/roarstech',
    'https://www.facebook.com/roarstech/',
  ],

  offices: [
    { code: 'IN', city: 'Bengaluru',           region: 'Karnataka', country: 'IN' },
    { code: 'US', city: 'Frisco',              region: 'TX',        country: 'US' },
    { code: 'UK', city: 'London',              region: '',          country: 'GB' },
    { code: 'BE', city: 'Heist op den Berg',   region: '',          country: 'BE' },
    { code: 'DE', city: 'München',             region: '',          country: 'DE' },
  ],

  stats: {
    yearsInBusiness: '20+',
    projectsDelivered: '250+',
    returningCustomers: '96%',
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

/** Resolve the robots value for one page. */
export const robotsFor = (pageNoindex = false): string =>
  !ALLOW_INDEXING || pageNoindex ? ROBOTS_NOINDEX : ROBOTS_INDEX
