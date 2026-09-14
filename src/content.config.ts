import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * Content collections and their schemas.
 *
 * There is no CMS, so Zod is the publish gate. A value out of range fails the
 * build rather than shipping, which is the whole point: with one editor and no
 * admin panel, nothing else is going to catch it.
 *
 * Zod covers what is checkable on a single entry. Rules that need the whole
 * set (duplicate titles, uniqueness against siblings, broken internal links,
 * inventory coverage) live in scripts/validate-content.mjs.
 */

/* ------------------------------------------------------------------ seo */

/**
 * Shared SEO object. Every collection includes it.
 *
 * Lengths come from docs/SEO-SPEC.md section 3.4. They are deliberately hard
 * limits: a 72-character title is silently truncated in the SERP, and a
 * 90-character description gets rewritten by Google, so both are bugs rather
 * than preferences.
 */
const seo = z.object({
  title: z
    .string()
    .min(30, 'seo.title is too short to be useful. Aim for 50-60 characters including the " | Roars Technologies" suffix.')
    .max(65, 'seo.title over 65 characters is truncated in search results. Aim for 50-60.'),

  description: z
    .string()
    .min(120, 'seo.description under 120 characters wastes the snippet. Aim for 140-160.')
    .max(165, 'seo.description over 165 characters is truncated. Aim for 140-160.'),

  /**
   * The query this page is meant to answer. One page owns one intent; if
   * another page already claims it, that is cannibalisation and the fix is to
   * edit that page rather than add this one. See docs/URL-INVENTORY-FINDINGS.md.
   */
  primaryIntent: z.string().min(3, 'seo.primaryIntent is required. One page, one intent.'),

  ogImage: z.string().optional(),

  /** Rarely needed. Empty means the self-referencing default. */
  canonicalOverride: z.string().optional(),

  /** Also excludes the entry from the sitemap. For utility pages. */
  noindex: z.boolean().default(false),

  schemaType: z
    .enum(['WebPage', 'Article', 'BlogPosting', 'Service', 'CreativeWork', 'FAQPage', 'CollectionPage'])
    .default('WebPage'),
})

/**
 * The closing CTA band's copy, per entry.
 *
 * Optional, because the band ships a real default rather than a placeholder —
 * but a service or industry page that ends on the same sentence as thirteen
 * others is a weaker page, and the export writes a distinct close for each.
 *
 * Lengths are bounded for the same reason the seo fields are: a 42px headline
 * that runs to three lines stops being a headline, and the band is drawn 540
 * tall. Too long fails the build instead of overflowing the band in
 * production.
 */
const cta = z
  .object({
    label: z.string().min(2).max(28).optional(),
    heading: z
      .string()
      .min(12, 'cta.heading is too short to be an offer.')
      .max(90, 'cta.heading over 90 characters wraps past the band it is drawn in.'),
    body: z
      .string()
      .min(40, 'cta.body is too short to say anything.')
      .max(260, 'cta.body over 260 characters overruns the right column.')
      .optional(),
    ctaLabel: z.string().min(2).max(32).optional(),
    ctaHref: z.string().min(1).optional(),
    /** The footer's closing line for this entry. One sentence: the block is
     *  drawn 384 wide at 22/30, so roughly four lines is the ceiling. */
    footerBlurb: z
      .string()
      .min(12, 'cta.footerBlurb is too short to be a closing line.')
      .max(190, 'cta.footerBlurb over 190 characters overruns the 384px footer block.')
      .optional(),
  })
  .optional()

/** Fields every collection shares beyond seo. */
const base = {
  title: z.string().min(1),
  cta,
  /** Real publish date. Never a bulk-edit `modified` value from WordPress. */
  publishedAt: z.coerce.date(),
  /**
   * Only set this when the content genuinely changed. 37 WordPress posts share
   * one bulk-edit date; carrying those forward would be manufactured freshness,
   * which is a spam signal. See CLAUDE.md, known landmines.
   */
  updatedAt: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  seo,
}

/* ---------------------------------------------------------- collections */

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    excerpt: z.string().optional(),
    /** Posts carry up to four. The first is the primary for articleSection. */
    categories: z.array(z.string()).min(1).max(4),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    client: z.string(),
    /** Must match an industries slug, or 'legal'/'finance', which have no
     *  industry page of their own. Checked in validate-content.mjs. */
    industry: z.array(z.string()).min(1),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    /** Editorial, set here, not "most recent". Drives the /work/ index tiers. */
    featured: z.boolean().default(false),
    team: z.array(z.string()).default([]),
  }),
})

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    /** Service.serviceType in the JSON-LD. */
    serviceType: z.string(),
    subServices: z.array(z.string()).default([]),
    relatedIndustries: z.array(z.string()).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
})

const industries = defineCollection({
  loader: glob({ base: './src/content/industries', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    serviceType: z.string(),
    /**
     * An industry page with no case study is a noun swap, which is exactly the
     * scaled-content pattern the SEO spec warns about. Enforced as a warning in
     * validate-content.mjs rather than here, so migration can land first.
     */
    caseStudies: z.array(z.string()).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
})

const resources = defineCollection({
  loader: glob({ base: './src/content/resources', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    /** Gated download. Six of the live fifteen ship images named
     *  "placeholder"; those must be replaced, not shipped. */
    downloadFile: z.string().optional(),
    previewImage: z.string().optional(),
    previewAlt: z.string().optional(),
  }),
})

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    /** Route path, with leading and trailing slash. Must exist in
     *  docs/URL-INVENTORY.csv; assert-urls.mjs is the backstop. */
    path: z.string().regex(/^\/.*\/$/, 'path must start and end with a slash, e.g. "/about-us/"'),
  }),
})

export const collections = { posts, projects, services, industries, resources, pages }
