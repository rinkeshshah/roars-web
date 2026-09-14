/**
 * Navigation. Labels are the design's; hrefs are the inventory's.
 *
 * CLAUDE.md rule 1: when a design spec and docs/URL-INVENTORY.csv disagree,
 * the CSV wins. "Projects" therefore serves /work/ and "Insights" serves
 * /our-journal/. Nav labels do not have to match URLs and these do not.
 */
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
