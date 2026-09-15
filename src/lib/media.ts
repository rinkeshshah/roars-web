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
import { PROJECTS } from './projects'

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
 * THE PHOTOGRAPH AT THE TOP OF A /work/[slug]/ PAGE, by slug.
 *
 * One value, two readers: the work page draws it as its own header, and any
 * band that credits that project draws the same file. That is the point — a
 * featured band is meant to show the project's header, so it must not be able
 * to show anything else.
 *
 * Read off PROJECTS rather than kept as a second list. A separate map beside
 * it went stale the moment a band credited a project it had never heard of:
 * it had exactly one entry, club-social, so the featured block on eight
 * industry pages drew nothing at all.
 *
 * Where a project has a content file with its own heroImage, that wins and
 * this is the fallback. scripts/validate-content.mjs fails the build if the
 * two ever disagree, so the work page and the bands cannot drift apart.
 *
 * A project with no art returns undefined and the caller draws no image. That
 * is deliberate: the live paths are not derivable (the /YYYY/MM/ segment is
 * whatever month the file was uploaded), and a guessed one is a 404 that
 * looks like a bug rather than a gap.
 */
export const workHeroFor = (href: string): string | undefined => {
  const slug = href.replace(/^\/work\//, '').replace(/\/$/, '')
  const key = PROJECTS.find((p) => p.slug === slug)?.image
  return key ? WORK[key as keyof typeof WORK] : undefined
}

/**
 * Guide cover art, by /resources/ slug.
 *
 * THE FILE CALLED "PLACEHOLDER" IS NOT A PLACEHOLDER. Five of these were held
 * out of this map because the live filename says placeholder, on the reasoning
 * that shipping a file called placeholder.png to a download page is not
 * honest. That reasoning was about the NAME. The live pages show finished
 * illustrated covers on every one of those cards: Business Plan and Prototype
 * Testing Plan both have real art on /resource/staff-picks/ today. The name is
 * a leftover from whoever uploaded them, not a description of the file.
 *
 * So they are all here now. Drawing an empty grey plate instead of the
 * client's own artwork was the worse of the two outcomes.
 *
 * Filenames are the live ones, typos included — "Srartup", "plannig",
 * "building-partnership" singular. They are what the server has, and renaming
 * them would 404.
 *
 * STILL MISSING: the five that only ever appeared on /resource/tools/. Their
 * covers are recorded nowhere in this repository, and not in the WordPress
 * export either — that carries posts and the attachments those posts use, and
 * the guides are a `free_stuff` type it does not include. Those cards keep
 * the drawn plate until somebody supplies the paths.
 */
export const GUIDE_COVER: Record<string, string> = {
  'business-model-canvas': `${U}/2022/08/business-model-canvas.png`,
  'swot-analysis': `${U}/2022/08/Startup-Swot-analysis.png`,
  'learning-loop': `${U}/2022/08/Srartup-learning-loop.png`,
  'value-proposition': `${U}/2022/08/startup-value-proposition.png`,
  'evidence-planning': `${U}/2022/08/startup-evidence-plannig.png`,
  /* The five whose live filename reads "placeholder". Same upload batch as
     the five above, so the same /2022/08/ folder. */
  'building-partnerships': `${U}/2022/08/building-partnership-placeholder.png`,
  'business-plan': `${U}/2022/08/business-plan-placeholder.png`,
  'product-solution-benefit': `${U}/2022/08/placeholder.png`,
  'target-group': `${U}/2022/08/target-group-placeholder.png`,
  'prototype-testing-plan': `${U}/2022/08/prototyping-placeholder.png`,
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

/**
 * Post imagery, by /our-journal/ slug.
 *
 * THREE OF 115. These are the ones the exports actually name — the homepage
 * insight row and the Insights featured card. The other 112 are on the
 * webspace but nothing in this repo records their filenames, and a guessed
 * /wp-content/uploads/YYYY/MM/<slug>.jpg is a 404 that looks like a bug
 * rather than a gap. An unlisted slug draws the flat tinted circle.
 */
export const JOURNAL_IMG: Record<string, string> = {
  'ai-app-development-vs-traditional-app-development-which-is-better-for-customer-engagement':
    JOURNAL.aiVsTraditional,
  '20-years-of-roars-built-on-purpose-driven-by-impact': JOURNAL.twentyYears,
  'the-unexpected-insight-we-built-a-meal-planning-app': JOURNAL.mealPlanning,
}

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
