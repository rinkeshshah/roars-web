/**
 * The 23 case studies: inventory slug to client name.
 *
 * Slugs are from docs/URL-INVENTORY.csv. Client names are from the design
 * brief's own list (docs/briefs/work-index-at-real-scale.md), which names them
 * in prose. This file is the mapping between the two, which nothing else had.
 *
 * Industry tagging is deliberately absent. The brief says the 23 span eight
 * sectors plus legal and finance, but does not say which project is which, and
 * guessing would put a real client in the wrong sector on a public page. It
 * comes from the content migration.
 */
export interface Project {
  slug: string
  client: string
  /**
   * Featured work gets the full-height row on /work/. FIVE, because that is
   * what `Roars v2 - Projects` draws and names — with their dates and their
   * images. The rest are real projects with no date written anywhere, and a
   * guessed date on a case study is a lie with a number in it.
   */
  featured?: true
  /** As the export prints it. Only the five it names have one. */
  date?: string
  /** Key into WORK in src/lib/media.ts. Nine of the 23 have art. */
  image?: string
}

export const PROJECTS: Project[] = [
  { slug: 'warehouse-compliance-checklist-app', client: 'Snowman Logistics', featured: true, date: '18 Feb 2026', image: 'snowman' },
  { slug: 'parqly-parking-solution', client: 'Parqly', featured: true, date: '15 Oct 2025', image: 'parqly' },
  { slug: 'concierge-loyalty-program', client: 'Concierge Loyalty', featured: true, date: '09 May 2025', image: 'concierge' },
  { slug: 'advisee', client: 'Advisee', image: 'advisee' },
  { slug: 'companyguru', client: 'Company Guru', image: 'companyguru' },
  { slug: 'gymbait', client: 'GymBait.AI', featured: true, date: '02 Jul 2025', image: 'gymbait' },
  { slug: 'ventura-law-firm', client: 'Ventura Law Firm', image: 'ventura' },
  { slug: 'gisaid-health-tech', client: 'GISAID', featured: true, date: '21 Mar 2024', image: 'gisaid' },
  { slug: 'the-presidents-club', client: 'The President’s Club' },
  { slug: '411drives-on-demand-car-loan-app', client: '411Drives' },
  { slug: 'gypsy', client: 'Gypsy' },
  { slug: 'blelp', client: 'Blelp' },
  { slug: 'flowrow-fitness-app', client: 'Flowrow' },
  { slug: 'super-social', client: 'Super Social' },
  { slug: 'community-social-residential-community-app', client: 'Community Social' },
  { slug: 'club-social', client: 'Club Social', image: 'clubSocial' },
  { slug: 'tanishq-data-analytics', client: 'Tanishq' },
  { slug: 'les-concierges', client: 'Les Concierges' },
  { slug: 'reward-butler', client: 'Reward Butler' },
  { slug: 'friendo-healthcare-mobile-app-development', client: 'Friendo' },
  { slug: 'onus', client: 'Onus' },
  { slug: 'counter-cabinet', client: 'Counter Cabinet' },
  { slug: 'go-champions-go', client: 'Go Champions Go' },
]

export const clientFor = (slug: string): string | undefined =>
  PROJECTS.find((p) => p.slug === slug)?.client

/**
 * The five the export names, in its order. Kept because the order is editorial
 * — Feb 2026, Jul 2025, Oct 2025, May 2025, Mar 2024 is not chronological —
 * and because those five are the ones with a date and an image.
 */
export const FEATURED_ORDER = [
  'warehouse-compliance-checklist-app',
  'gymbait',
  'parqly-parking-solution',
  'concierge-loyalty-program',
  'gisaid-health-tech',
]
