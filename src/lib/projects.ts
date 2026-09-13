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
}

export const PROJECTS: Project[] = [
  { slug: 'warehouse-compliance-checklist-app', client: 'Snowman Logistics' },
  { slug: 'parqly-parking-solution', client: 'Parqly' },
  { slug: 'concierge-loyalty-program', client: 'Concierge Loyalty' },
  { slug: 'advisee', client: 'Advisee' },
  { slug: 'companyguru', client: 'Company Guru' },
  { slug: 'gymbait', client: 'GymBait.AI' },
  { slug: 'ventura-law-firm', client: 'Ventura Law Firm' },
  { slug: 'gisaid-health-tech', client: 'GISAID' },
  { slug: 'the-presidents-club', client: 'The President’s Club' },
  { slug: '411drives-on-demand-car-loan-app', client: '411Drives' },
  { slug: 'gypsy', client: 'Gypsy' },
  { slug: 'blelp', client: 'Blelp' },
  { slug: 'flowrow-fitness-app', client: 'Flowrow' },
  { slug: 'super-social', client: 'Super Social' },
  { slug: 'community-social-residential-community-app', client: 'Community Social' },
  { slug: 'club-social', client: 'Club Social' },
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
