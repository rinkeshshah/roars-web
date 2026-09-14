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

/** Case-study imagery. */
export const WORK = {
  parqly: `${U}/2025/07/parqly-parking-mobile-app.jpg`,
  snowman: `${U}/2026/02/Snowman-Logistics-app-solution.jpg`,
  gymbait: `${U}/2024/07/gymbait-ai-fitness-1.png`,
  gisaid: `${U}/2022/08/GISAID-work-python.jpeg`,
  advisee: `${U}/2025/03/advisee-finance-featured.jpg`,
  companyguru: `${U}/2025/03/companyguru.jpg`,
  concierge: `${U}/2025/07/ai-concierges-mobile-app.jpg`,
  ventura: `${U}/2023/02/ventura-law-header-12.jpg`,
} as const

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

/** Gated PDFs. Root-level /tools/, NOT under the wp-content rewrite. */
export const TOOLS = '/tools'
