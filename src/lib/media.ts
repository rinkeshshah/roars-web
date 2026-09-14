/**
 * Images served from the live server, at the live paths.
 *
 * These files are NOT in this repo. They are uploaded to the Plesk webspace at
 * exactly the paths below, which is deliberate: /wp-content/uploads/* URLs are
 * indexed in Google Images, and keeping them identical means that traffic
 * survives the WordPress removal. docs/DEPLOYMENT.md carries the nginx rule
 * that serves the directory once WordPress itself is gone.
 *
 * Consequences, both accepted:
 *   - Astro cannot generate AVIF/WebP for them, because they are not build
 *     inputs. They ship as authored, so every usage sets explicit width and
 *     height and the CLS budget is held by reservation rather than by
 *     conversion.
 *   - Nothing here hot-links roarsinc.com. Paths are root-relative, so they
 *     resolve against whatever host serves the site.
 *
 * Every path below is taken verbatim from the Claude Design export. If a file
 * is missing on the server the slot renders empty rather than broken; nothing
 * invented, nothing substituted.
 */
const U = '/wp-content/uploads'

/** People. Filenames are the live ones; the captions they carry are not. */
export const PORTRAIT = {
  founder: `${U}/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp`,
  suzanne: `${U}/2022/07/suzanne.webp`,
  abhishek: `${U}/2022/07/Abhishek.webp`,
  chetna: `${U}/2022/07/Chetna.webp`,
  khusboo: `${U}/2022/07/Khusboo.webp`,
  nitin: `${U}/2022/07/Nitin.webp`,
  atul: `${U}/2022/07/Atul.webp`,
  ankush: `${U}/2022/07/Ankush.webp`,
} as const

/** Client marks in the About strip, in the export's order. */
export const CLIENT_LOGOS = [
  { src: `${U}/2022/07/home-brand01.png`, alt: 'Samsung', h: 22 },
  { src: `${U}/2022/07/home-brand02.png`, alt: 'TATA', h: 27 },
  { src: `${U}/2022/07/home-brand03.png`, alt: 'GISAID', h: 24 },
  { src: `${U}/2022/07/home-brand04.png`, alt: 'Forbes', h: 22 },
  { src: `${U}/2022/07/home-brand05.png`, alt: 'Reliance', h: 27 },
  { src: `${U}/2022/07/home-brand06.png`, alt: 'DDB', h: 22 },
] as const

/**
 * Case-study imagery.
 *
 * The five the /work/ index draws are taken from design/specs/Projects.md, in
 * its row order, because that export is the authority for that page. Three of
 * them pointed at different live files carried over from an earlier session —
 * also real, also on the server, but not the ones the design uses. Where a
 * future page needs a different shot of the same client it gets its own key
 * rather than editing one of these.
 */
export const WORK = {
  parqly: `${U}/2025/07/parqly-parking-mobile-app.jpg`,
  snowman: `${U}/2026/02/Snowman-Logistics-app-solution.jpg`,
  gymbait: `${U}/2025/07/ai-fitness-home.jpg`,
  gisaid: `${U}/2025/07/health-tech-covid.jpg`,
  advisee: `${U}/2025/03/advisee-finance-featured.jpg`,
  companyguru: `${U}/2025/03/companyguru.jpg`,
  concierge: `${U}/2025/07/concierge-ai-home.jpg`,
  ventura: `${U}/2023/02/ventura-law-header-12.jpg`,
  clubSocial: `${U}/2022/08/club-social.jpg`,
} as const

/**
 * The photograph at the top of a /work/[slug]/ page, by slug.
 *
 * Keyed by the inventory slug so a band that credits a project can find that
 * project's own header without a second field in the content to keep in step
 * with the link. Only slugs whose live path is KNOWN belong here — the paths
 * are not derivable (the /YYYY/MM/ segment is whatever month the file was
 * uploaded), and a guessed one is a 404 that looks like a bug rather than a
 * gap. An unlisted slug returns undefined and the caller draws no image.
 */
export const WORK_HERO: Record<string, string> = {
  'club-social': WORK.clubSocial,
}

/** `href` is the route as written in content, e.g. "/work/club-social/". */
export const workHeroFor = (href: string): string | undefined =>
  WORK_HERO[href.replace(/^\/work\//, '').replace(/\/$/, '')]

/**
 * Guide cover art, by /resources/ slug.
 *
 * FIVE OF THE TEN ARE MISSING ON PURPOSE. The live site serves
 * building-partnership-placeholder.png, business-plan-placeholder.png,
 * placeholder.png, target-group-placeholder.png and
 * prototyping-placeholder.png for the other five — files named placeholder
 * because that is what they are. CLAUDE.md's known landmines say that art is
 * replaced during migration, not carried across, so those slugs are absent
 * here and their cards draw the empty slot instead. An empty slot is honest;
 * shipping a file called placeholder.png to a download page is not.
 *
 * Filenames are the live ones, typos included — "Srartup", "plannig". They are
 * what the server has, and renaming them would 404.
 */
export const GUIDE_COVER: Record<string, string> = {
  'business-model-canvas': `${U}/2022/08/business-model-canvas.png`,
  'swot-analysis': `${U}/2022/08/Startup-Swot-analysis.png`,
  'learning-loop': `${U}/2022/08/Srartup-learning-loop.png`,
  'value-proposition': `${U}/2022/08/startup-value-proposition.png`,
  'evidence-planning': `${U}/2022/08/startup-evidence-plannig.png`,
}

/** The stack on the Guides hero. One image for the set, not per guide. */
export const GUIDE_SET = `${U}/2022/08/startup-guides-books.png`

/** Service row imagery on the homepage accordion. */
export const SERVICE_IMG = {
  productConsultant: `${U}/2023/06/produc-consultant.jpg`,
  beautifulExperience: `${U}/2025/04/beautiful-experience.jpg`,
} as const

/** Journal imagery. */
export const JOURNAL = {
  aiVsTraditional: `${U}/2025/07/ai-fitness-home.jpg`,
  twentyYears: `${U}/2024/11/roars-office-upscale-768x768.jpg`,
  mealPlanning: `${U}/2025/07/concierge-ai-home.jpg`,
} as const

/** The three photographs on /about-us/, in the export's order. The office
 *  shot and beautiful-experience are shared with JOURNAL and SERVICE_IMG
 *  above; the same file on two pages is the export's own choice, not a
 *  placeholder standing in for something missing. */
export const AGENCY_IMG = {
  office: `${U}/2024/11/roars-office-upscale-768x768.jpg`,
  strategy: `${U}/2026/04/aboutus-strategy.jpg`,
  experience: `${U}/2025/04/beautiful-experience.jpg`,
} as const

/** Gated PDFs. Root-level /tools/, NOT under the wp-content rewrite. */
export const TOOLS = '/tools'
