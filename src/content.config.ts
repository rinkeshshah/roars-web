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
      /* 80, up from 64. The industry pages' real CTA titles run to 75 — "Bring
         unique food & restaurant app ideas to life with our unique solutions!"
         — and the choice was between raising the cap and cutting somebody's
         sentence in half to satisfy a number I picked. */
      .max(80, 'cta.footerTitle over 80 characters stops reading as a title.')
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

/**
 * Migrated posts keep the metadata WordPress actually served.
 *
 * The shared `seo` object bounds titles to 65 and descriptions to 165 because
 * anything longer is truncated in the SERP — that is a bug, not a preference,
 * and it stays a hard error for anything written from here on.
 *
 * Nine of the twenty migrated titles and eleven of the descriptions are over
 * those limits TODAY, on live URLs with search history. Rewriting them would
 * be inventing content, which the migration brief forbids outright. So a
 * migrated entry is bounded only by what is technically sane, and
 * validate-content.mjs prints every one that exceeds the ideal range, by how
 * much, on every run. The debt is recorded rather than erased.
 */
const seoMigrated = seo.extend({
  title: z.string().min(10).max(120),
  description: z.string().min(50).max(500),
})

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    seo: z.union([seo, seoMigrated]),
    excerpt: z.string().optional(),
    /** Posts carry up to four. The first is the primary for articleSection. */
    categories: z.array(z.string()).min(1).max(4),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    /**
     * Came from the WordPress export rather than being written here. Relaxes
     * the seo length bounds to technical maxima and makes validate-content
     * report the overage instead of failing on it.
     */
    migrated: z.boolean().default(false),
    /**
     * High impressions, near-zero clicks: the copy needs work. Emits a
     * <!-- NEEDS-REWRITE --> comment into the page so it is greppable in the
     * built output, and exempts the entry from the 300-word floor, which it
     * is already known to fail.
     */
    needsRewrite: z.boolean().default(false),
  }),
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    /**
     * Twenty-two of the twenty-three came across from WordPress, so the same
     * arrangement as the journal applies: the relaxed bounds accept the
     * client's own meta description at whatever length it was written, and
     * validate-content reports the overage rather than the build refusing it.
     * Writing new descriptions for twenty-two live case studies is a content
     * job, not something to do by hand at migration time.
     */
    seo: z.union([seo, seoMigrated]),
    client: z.string(),
    /** Must match an industries slug, or 'legal'/'finance'/'entertainment',
     *  which have no industry page of their own. Every value is sourced in
     *  scripts/wordpress-export/work/write.py, never guessed. */
    industry: z.array(z.string()).min(1),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    /** Editorial, set here, not "most recent". Drives the /work/ index tiers. */
    featured: z.boolean().default(false),
    team: z.array(z.string()).default([]),
    /**
     * Machine-extracted from the WordPress export and not yet read by anybody
     * here. The words are the client's own, but which paragraph landed in
     * which slot is the extractor's decision, so the page stays out of the
     * index until somebody has looked at it.
     */
    needsReview: z.boolean().default(false),
    /**
     * The live case study is under the 300 word floor and there is no more
     * copy to find. Four of the twenty-three are: the originals are short,
     * and padding them would be writing claims about a client's project that
     * nobody here can stand behind. Tracked rather than hidden, exactly as on
     * the journal: validate-content prints every one on every run.
     */
    needsRewrite: z.boolean().default(false),

    /**
     * The case study's own layout, from `Roars v2 - Project Detail`.
     * Everything optional: a project with nothing but a name still gets the
     * pending state, which is what twenty-two of the twenty-three need today.
     */
    /** Display date under the client name, e.g. "Feb 18, 2026". */
    dateLabel: z.string().max(24).optional(),
    /**
     * The masthead word. The export sets "Snowman" at 124px, not "Snowman
     * Logistics" — at that size the full name wraps onto the date. Defaults to
     * the client name for the short ones.
     */
    headline: z.string().max(20).optional(),
    /**
     * The four-slot showcase the export draws between Goals and Outcome:
     * 1358x737, then two 662x700, then 1358x754. Fewer than four is fine; the
     * slots that have no image still draw, because the block is part of the
     * layout rather than a gallery that appears when it is full.
     */
    showcase: z.array(z.object({ src: z.string(), alt: z.string().max(120).default('') })).max(4).default([]),
    /** The one-sentence what-this-is, set 26/37 across 689px. */
    about: z.string().max(320).optional(),
    /** The four-row fact table. Label left, value right. */
    facts: z.array(z.object({ k: z.string().max(20), v: z.string().max(80) })).max(6).default([]),
    liveUrl: z.string().optional(),
    liveLabel: z.string().max(24).default('Live Version'),
    /**
     * The two headed blocks — "Goals of the Project:" and "Outcome:". Each is
     * a heading, a lead set at 26/37 and a second paragraph at 18/28.
     */
    blocks: z
      .array(
        z.object({
          heading: z.string().max(40),
          lead: z.string().max(320),
          body: z.string().max(320).optional(),
        }),
      )
      .max(4)
      .default([]),
    /** Paths under /wp-content/uploads/, served from the webspace. */
    gallery: z.array(z.object({ src: z.string(), alt: z.string().max(120).default('') })).max(4).default([]),
    /**
     * Everything else the original case study showed.
     *
     * `gallery` is a pair and `showcase` is four fixed slots, six images in
     * all, which is what the export drew. The real pages carry far more than
     * six: GymBait alone ships seventeen, mostly app screens. Those are the
     * case study. They render as a grid after the showcase rather than being
     * dropped because the designed slots were already full.
     */
    screens: z.array(z.object({ src: z.string(), alt: z.string().max(120).default('') })).max(24).default([]),
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
/**
 * The S1-S9 service page.
 *
 * Every field is optional and every section renders only when it has data, so
 * a page that has half of it is a shorter page rather than a broken one. That
 * matters here: the sections that make a claim about the business (S4's
 * outcome, S5's exclusions, S6's pricing, S7's answers) are drafted and under
 * review, and a page must be able to ship without them.
 *
 * The rule the structure exists to enforce: a page must carry at least one
 * asset that cannot appear on any other page. A named client and what changed
 * for them, a real number with its unit and timeframe, a constraint only this
 * service has, or a real artefact. scripts/validate-content.mjs checks for
 * one and refuses to let a page without one call itself indexable.
 */
const servicePage = {
  /** S1. The failure state in the reader's words, not the service name. */
  frame: z
    .object({
      h1: z.string().min(20).max(120),
      /** Who it is for and who it is not. Exclusion earns more trust. */
      qualifier: z.string().max(220),
      /** One named client or one number, above the fold. */
      proof: z.object({ value: z.string().max(24), label: z.string().max(80) }).optional(),
    })
    .optional(),
  /** S2. What continuing as-is costs. Under 60 words, or it reads as a funnel. */
  cost: z
    .object({
      label: z.string().max(32).default('THE COST OF WAITING'),
      heading: z.string().max(80),
      body: z.string().max(400),
    })
    .optional(),
  /** S3. Phases named by what the client HAS at the end, not what we do. */
  engagement: z
    .object({
      label: z.string().max(32).default('HOW IT RUNS'),
      heading: z.string().max(80),
      phases: z
        .array(
          z.object({
            n: z.string().max(4),
            name: z.string().max(40),
            /** Vagueness about time reads as vagueness about competence. */
            duration: z.string().max(24),
            delivers: z.string().max(320),
          }),
        )
        .min(3)
        .max(5),
    })
    .optional(),
  /** S4. One case, in full. Not a carousel, and no logo grid on this page. */
  anchor: z
    .object({
      label: z.string().max(32).default('WHAT THIS LOOKS LIKE'),
      client: z.string().max(40),
      situation: z.string().max(200),
      did: z.array(z.string().max(220)).min(1).max(3),
      /** The number and the timeframe. Absent until the real one is supplied. */
      outcome: z.string().max(220).optional(),
      href: z.string(),
      ctaLabel: z.string().max(24).default('Read the case study'),
    })
    .optional(),
  /** S5. In and out. The highest-trust block on the page. */
  scope: z
    .object({
      label: z.string().max(32).default('SCOPE'),
      heading: z.string().max(80),
      includes: z.array(z.string().max(120)).min(2).max(8),
      excludes: z.array(z.string().max(120)).min(2).max(8),
    })
    .optional(),
  /** S6. Duration, team, what we need from you, and how pricing works. */
  shape: z
    .object({
      label: z.string().max(32).default('THE SHAPE OF IT'),
      heading: z.string().max(80),
      duration: z.string().max(120),
      team: z.array(z.object({ role: z.string().max(40), does: z.string().max(140) })).min(1).max(5),
      /** Named as commitments: a weekly hour, access to two customers. */
      needs: z.array(z.string().max(140)).min(1).max(5),
      pricing: z.string().max(320),
    })
    .optional(),
  /** S8. Internal links with a REASON, which is what makes them useful. */
  next: z
    .object({
      label: z.string().max(32).default('WHERE TO GO NEXT'),
      heading: z.string().max(80),
      services: z.array(z.object({ name: z.string().max(40), href: z.string(), why: z.string().max(160) })).max(3).default([]),
      industries: z.array(z.object({ name: z.string().max(40), href: z.string(), why: z.string().max(160) })).max(3).default([]),
    })
    .optional(),
  /**
   * Drafted sections are on the page but not offered to search.
   *
   * S4's outcome, S5, S6 and S7's answers are claims about the business. They
   * were written to be corrected, not to be published, so a page still
   * carrying them is noindex until somebody says otherwise.
   */
  needsReview: z.boolean().default(false),
}

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
            /* Optional, like the journey's lead. A migrated page describes
               its process without putting a week number on each step, and
               inventing one would be inventing a delivery commitment. */
            when: z.string().max(16).optional(),
            phase: z.string().max(20).optional(),
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
    ...servicePage,
    /* Migrated pages keep the live site's own rank_math metadata, which runs
       long. Same arrangement as the journal and the industries. */
    seo: z.union([seo, seoMigrated]),
    migrated: z.boolean().default(false),
    /** Service.serviceType in the JSON-LD. */
    serviceType: z.string(),
    subServices: z.array(z.string()).default([]),
    relatedIndustries: z.array(z.string()).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
})

/**
 * The industry page's sections, as data.
 *
 * /industries/[slug]/ is ONE template for nine routes, same arrangement as
 * /s/[slug]/: the layout lives in the page, the words live here, every field
 * is optional and every section renders only when its data is present. An
 * industry with nothing but prose still gets the header, the body and the
 * close.
 *
 * Shapes are taken from the Industries v2 export, shown as food & restaurant.
 */
const industryLayout = {
  eyebrow: z.string().max(48).optional(),
  headline: z.object({ small: z.string().max(24), large: z.string().max(24) }).optional(),
  standfirst: z.string().max(90).optional(),
  hero: z
    .object({
      statement: z.string().max(160),
      sub: z.string().max(120).optional(),
      ctaLabel: z.string().max(24).optional(),
      ctaHref: z.string().optional(),
      /** The panel beside the masthead. On food & restaurant it is a printed
       *  order; another sector puts its own artefact here. */
      receipt: z
        .object({
          title: z.string().max(20),
          time: z.string().max(12).optional(),
          meta: z.array(z.string().max(32)).max(2).default([]),
          lines: z.array(z.object({ k: z.string().max(28), v: z.string().max(10) })).min(1).max(6),
          note: z.string().max(40).optional(),
          totalLabel: z.string().max(12).default('TOTAL'),
          total: z.string().max(12),
          paid: z.string().max(20).optional(),
          statusLabel: z.string().max(12).default('STATUS'),
          /**
           * The order's states, in order. The ticket cycles them in the
           * browser and one tick lights per state, so the list is content and
           * the strip length follows from it — there is no separate count to
           * keep in step.
           */
          statuses: z.array(z.string().max(20)).min(2).max(6),
          /** Which state is server-rendered, 0-based. Where a crawler lands. */
          statusIndex: z.number().int().min(0).default(0),
          footnote: z.string().max(32).optional(),
        })
        .optional(),
    })
    .optional(),
  /** The numbered sequence down the spine. */
  journey: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(80),
      intro: z.string().max(220).optional(),
      note: z.string().max(220).optional(),
      moments: z
        .array(
          z.object({
            n: z.string().max(4),
            name: z.string().max(24),
            /* Optional, like every other slot on this page. A migrated
               capability is often one sentence: forcing a lead line out of it
               meant printing the same sentence twice, once trimmed. */
            lead: z.string().max(90).optional(),
            body: z.string().max(260),
            tags: z.array(z.string().max(24)).max(3).default([]),
          }),
        )
        .min(1),
    })
    .optional(),
  /** The tabbed surfaces block. */
  surfaces: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(40),
      sub: z.string().max(60).optional(),
      tabs: z
        .array(
          z.object({
            n: z.string().max(4),
            name: z.string().max(20),
            heading: z.string().max(80),
            points: z.array(z.string().max(60)).min(1).max(5),
            note: z.string().max(40).optional(),
          }),
        )
        .min(2)
        .max(4),
    })
    .optional(),
  proof: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(60),
      stats: z
        .array(
          z.object({
            n: z.string().max(6),
            suffix: z.string().max(4).optional(),
            pct: z.boolean().default(false),
            label: z.string().max(40),
          }),
        )
        .max(3)
        .default([]),
      featured: z
        .object({
          label: z.string().max(24).default('FEATURED WORK'),
          client: z.string().max(40),
          body: z.string().max(220),
          meta: z.array(z.object({ k: z.string().max(20), v: z.string().max(56) })).max(2).default([]),
          href: z.string(),
          ctaLabel: z.string().max(24).default('View Project'),
        })
        .optional(),
    })
    .optional(),
  /** The other sectors. Hrefs must be real /industries/ routes. */
  sectors: z
    .object({
      label: z.string().max(32),
      heading: z.string().max(40),
      intro: z.string().max(160).optional(),
      items: z
        .array(
          z.object({
            n: z.string().max(4),
            name: z.string().max(24),
            blurb: z.string().max(90),
            href: z.string(),
          }),
        )
        .min(1),
    })
    .optional(),
}

/**
 * The I1-I8 industry page.
 *
 * A service page answers "can you do this". An industry page answers "do you
 * understand my world", and the whole product is domain fluency. That is why
 * I2 is the section the page exists for: four constraints an insider would
 * nod at. If four cannot be written without research, the page does not
 * exist yet and belongs on the holding template.
 *
 * Every field is optional, so a sector with two constraints and one case is a
 * shorter page rather than a broken one.
 */
const industryPage = {
  /** I1. The constraint that defines the sector, not the sector's name. */
  frame: z
    .object({
      h1: z.string().min(20).max(140),
      /** One line on what Roars does here. */
      does: z.string().max(220),
    })
    .optional(),
  /** I2. Three or four constraints, named and specific. The reason to exist. */
  constraints: z
    .object({
      label: z.string().max(32).default('WHAT IS DIFFERENT HERE'),
      heading: z.string().max(90),
      items: z
        .array(z.object({ name: z.string().max(48), body: z.string().max(320) }))
        .min(3)
        .max(4),
    })
    .optional(),
  /** I3. Failure patterns seen in this sector. Naming other people's mistakes
   *  accurately is the fastest way to show you have been here. */
  failures: z
    .object({
      label: z.string().max(32).default('WHERE THIS GOES WRONG'),
      heading: z.string().max(90),
      items: z
        .array(z.object({ name: z.string().max(60), body: z.string().max(320) }))
        .min(2)
        .max(3),
    })
    .optional(),
  /** I4. One or two cases, both from THIS sector. One is better than a
   *  borrowed second. */
  cases: z
    .object({
      label: z.string().max(32).default('WHAT WE HAVE BUILT HERE'),
      items: z
        .array(
          z.object({
            client: z.string().max(40),
            situation: z.string().max(200),
            did: z.string().max(240),
            outcome: z.string().max(220).optional(),
            href: z.string(),
          }),
        )
        .min(1)
        .max(2),
    })
    .optional(),
  /** I5. Services with a line on how each applies HERE. Not a service list. */
  applies: z
    .object({
      label: z.string().max(32).default('WHAT WE DO IN THIS SECTOR'),
      heading: z.string().max(90),
      items: z
        .array(z.object({ name: z.string().max(40), href: z.string(), why: z.string().max(180) }))
        .min(2)
        .max(6),
    })
    .optional(),
  /**
   * I6. The block that survives a procurement review.
   *
   * Compliance regimes, integrations, standards and platforms actually worked
   * with in this sector, named. ONLY WHAT IS TRUE: one invented item poisons
   * the whole block, and the block's entire value is that it can be checked.
   */
  domain: z
    .object({
      label: z.string().max(32).default('DOMAIN'),
      heading: z.string().max(90),
      note: z.string().max(220).optional(),
      groups: z
        .array(z.object({ k: z.string().max(40), items: z.array(z.string().max(48)).min(1).max(8) }))
        .min(1)
        .max(4),
    })
    .optional(),
  /** I8. Same shape as the service close, framed for the sector. */
  close: z
    .object({
      heading: z.string().max(120),
      body: z.string().max(400),
    })
    .optional(),
}

const industries = defineCollection({
  loader: glob({ base: './src/content/industries', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...base,
    ...industryLayout,
    ...industryPage,
    /* Migrated pages keep the live site's own rank_math title and
       description. They run long — the healthcare one is 205 characters —
       and the choice was between shipping the real metadata over target or
       writing new metadata for nine commercial pages. validate-content warns
       on each so the debt stays visible. Same arrangement as the journal. */
    seo: z.union([seo, seoMigrated]),
    migrated: z.boolean().default(false),
    /* Held out of the index until somebody has checked it. Used here for the
       two sectors that have no case study to point at, which is the rule
       about unique assets doing its job rather than a bug. */
    needsReview: z.boolean().default(false),
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

    /**
     * Drafted sections are on the page but not offered to search.
     *
     * Same arrangement as services and industries. The nine guides whose long
     * read was written here describe public frameworks rather than anything
     * about Roars, so the risk is lower than an invented outcome figure, but
     * the copy is still ours and not theirs. It stays out of the index until
     * somebody has read it.
     */
    needsReview: z.boolean().default(false),

    /**
     * The shelf card's own line, and the guide hero's. Drawn 420 wide at
     * 15/23 on the card, so roughly five lines is the ceiling.
     *
     * OPTIONAL ON PURPOSE. The export writes ten of the fifteen; the other
     * five have no copy anywhere, and a card with the real name and no blurb
     * is honest where an invented sentence is not. See CLAUDE.md, no
     * fabricated data.
     */
    summary: z.string().max(300).optional(),
    /**
     * The chip this guide filters under. Free text rather than an enum: the
     * ones the export uses are its own, and validate-content checks that the
     * set stays small rather than that it matches a list written here.
     */
    category: z.string().max(28).optional(),
    /**
     * Which of the live ARCHIVES this item appears on.
     *
     * /resource/staff-picks/ and /resource/tools/ are category archives over
     * these same fifteen items, not separate pages with their own content,
     * and an item can be on both: Innovation Flowchart and Web Redesign ROI
     * Calculator are. Most items are on neither and appear only in the guide
     * library.
     *
     * Read off the live pages. Enumerated, because a typo here would silently
     * empty an archive rather than fail.
     */
    collections: z.array(z.enum(['staff-picks', 'tools'])).default([]),
    /** Three at most; they sit on one 420px row in the hero. */
    pills: z.array(z.string().max(20)).max(3).default([]),
    /**
     * The PDF's basename under /tools/, e.g. "business-model-canvas.pdf".
     * The browser never sends this — public/api/contact.php resolves the file
     * from an allowlisted slug — but the card prints it, so it is content.
     */
    file: z.string().max(80).optional(),
    /**
     * The long read: "01 / PURPOSE — What is this for?" and so on. Each block
     * is a label, a heading, a lead paragraph and a second one under a rule.
     * Absent for the guides whose bodies have not been written.
     */
    sections: z
      .array(
        z.object({
          label: z.string().max(28),
          heading: z.string().max(60),
          lead: z.string().max(420),
          body: z.string().max(420).optional(),
        }),
      )
      .max(4)
      .default([]),
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
