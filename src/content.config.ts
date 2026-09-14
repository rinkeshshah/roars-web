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
    /** The footer CTA's title for this entry. One short line. */
    footerTitle: z
      .string()
      .min(8, 'cta.footerTitle is too short to be a title.')
      .max(64, 'cta.footerTitle over 64 characters stops reading as a title.')
      .optional(),
    /** The footer's tagline slot, beside the closing CTA. Two or three words;
     *  the house line is the fallback. */
    footerTagline: z
      .string()
      .min(4, 'cta.footerTagline is too short.')
      .max(40, 'cta.footerTagline over 40 characters stops reading as a tagline.')
      .optional(),
    /** Its description. The block is drawn 384 wide at 22/30, so roughly four
     *  lines is the ceiling. */
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

/**
 * The service page's sections, as data.
 *
 * /s/[slug]/ is ONE template for twelve routes, so the layout lives in the
 * page and the words live here. Everything is optional and every section
 * renders only when its data is present: a service with nothing but prose
 * still gets the header, the body and the close, which is what the eleven
 * un-migrated services need today.
 *
 * Shapes are taken from the AI Automation export, which the handoff names as
 * the pattern for the rest. Where a length is bounded it is because the slot
 * is drawn at a size the copy has to live inside — the same reasoning as the
 * seo fields.
 */
const serviceLayout = {
  /** Small tracked line above the masthead, e.g. "SERVICES / AI AUTOMATION". */
  eyebrow: z.string().max(48).optional(),
  /** The masthead's two lines: a small word over a large one. */
  headline: z.object({ small: z.string().max(24), large: z.string().max(24) }).optional(),
  /** The line under the masthead. */
  standfirst: z.string().max(90).optional(),
  hero: z
    .object({
      statement: z.string().max(160),
      sub: z.string().max(120).optional(),
      /** Four short pills at most; they sit on one 400px column. */
      pills: z.array(z.string().max(28)).max(4).default([]),
      ctaLabel: z.string().max(24).optional(),
      ctaHref: z.string().optional(),
      /** The panel beside the masthead. On AI Automation it is an eval run;
       *  another service would put its own readout here. Decorative in the
       *  sense that nothing depends on it, but it is real copy, so it is
       *  content rather than markup. */
      console: z
        .object({
          label: z.string().max(20),
          ref: z.string().max(12).optional(),
          rows: z.array(z.object({ k: z.string().max(32), v: z.string().max(36) })).min(1).max(6),
          statusLabel: z.string().max(16).default('STATUS'),
          status: z.string().max(28),
          progress: z.number().min(0).max(100).default(20),
          note: z.string().max(140).optional(),
          footnote: z.string().max(40).optional(),
        })
        .optional(),
    })
    .optional(),
  /** A labelled band of numbered cards. Used twice: what we build, and where
   *  it earned its keep. */
  bands: z
    .array(
      z.object({
        key: z.enum(['capabilities', 'engagements']),
        label: z.string().max(32),
        heading: z.string().max(80),
        intro: z.string().max(320).optional(),
        items: z
          .array(
            z.object({
              tag: z.string().max(28),
              name: z.string().max(60),
              body: z.string().max(320),
            }),
          )
          .min(1),
      }),
    )
    .default([]),
  featured: z
    .object({
      label: z.string().max(32).default('Featured work'),
      client: z.string().max(40),
      body: z.string().max(320),
      href: z.string(),
      meta: z.array(z.object({ k: z.string().max(28), v: z.string().max(48) })).max(4).default([]),
    })
    .optional(),
  process: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(80),
      intro: z.string().max(320).optional(),
      steps: z
        .array(
          z.object({
            when: z.string().max(16),
            phase: z.string().max(20),
            name: z.string().max(48),
            body: z.string().max(320),
          }),
        )
        .min(1),
      closing: z.string().max(220).optional(),
    })
    .optional(),
  receipts: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(80),
      intro: z.string().max(320).optional(),
      note: z.string().max(90).optional(),
      stats: z
        .array(
          z.object({
            n: z.string().max(6),
            suffix: z.string().max(4).optional(),
            /** true puts the suffix before the figure, for "$0". */
            prefix: z.boolean().default(false),
            body: z.string().max(140),
          }),
        )
        .min(1)
        .max(3),
    })
    .optional(),
  faqLabel: z.string().max(32).optional(),
  faqHeading: z.string().max(80).optional(),
  faqIntro: z.string().max(320).optional(),
  /** The page's own closing band, which is richer than the shared CtaBand. */
  close: z
    .object({
      heading: z.string().max(90),
      body: z.string().max(300),
      aside: z.string().max(120).optional(),
      ctaLabel: z.string().max(32),
      ctaHref: z.string(),
      contact: z.string().max(72).optional(),
    })
    .optional(),
}

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    ...serviceLayout,
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
