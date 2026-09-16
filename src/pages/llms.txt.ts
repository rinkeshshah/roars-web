/**
 * llms.txt, generated. Nothing in it is typed by hand.
 *
 * WHAT IT IS FOR. An assistant answering "who builds fintech MVPs in
 * Bengaluru" reads whatever it can fetch cheaply. If that is our rendered
 * HTML it gets the nav, the grain fields and the cross-fade markup along with
 * the three sentences that matter. llms.txt is the plain-text version of the
 * same site: what we do, where we are, and the URL for each page worth
 * reading in full.
 *
 * WHY GENERATED, AND WHY THIS MATTERS MORE HERE THAN ELSEWHERE.
 *
 * A hand-kept llms.txt is a second copy of the site's facts, and the whole
 * failure mode of a second copy is that nobody remembers it exists. The one
 * on the old site would have said 250+ projects forever. So:
 *
 *   every number      src/lib/site.ts
 *   every URL         the content collections, which are what build the pages
 *   every title       the page's own seo.title or title
 *
 * There is no literal in this file that a reader could check against a page
 * and find wrong, because there is no literal in this file. If a service is
 * renamed, this changes on the next build. If one is deleted, it leaves.
 *
 * DRAFTS ARE EXCLUDED, same as the sitemap. A draft is not published, and an
 * assistant citing a URL that returns a pending state is worse than one that
 * never heard of it.
 */
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { site, ALLOW_INDEXING } from '../lib/site'

/** One "- [Title](url): note" line. Note is dropped when there is nothing
 *  useful to say, rather than padded with the title again. */
const row = (title: string, path: string, note?: string) =>
  `- [${title}](${site.url}${path})${note ? `: ${note}` : ''}`

/** First sentence, trimmed. Descriptions run long on the migrated pages and a
 *  list is easier to read than a wall. Never rewritten, only cut at a full
 *  stop that is already there. */
const first = (s: string | undefined, cap = 160) => {
  const t = (s ?? '').trim()
  if (!t) return undefined
  const stop = t.search(/\.\s/)
  const one = stop > 40 ? t.slice(0, stop + 1) : t
  return one.length <= cap ? one : undefined
}

const live = (e: { data: { draft?: boolean } }) => !e.data.draft

export const GET: APIRoute = async () => {
  const [services, industries, projects, resources, posts] = await Promise.all([
    getCollection('services', live),
    getCollection('industries', live),
    getCollection('projects', live),
    getCollection('resources', live),
    getCollection('posts', live),
  ])

  const by = <T extends { data: { title: string } }>(a: T, b: T) =>
    a.data.title.localeCompare(b.data.title)

  const offices = site.offices
    .map((o) => `${o.city}, ${o.label}`)
    .join('; ')

  const s = site.stats

  const out = `# ${site.legalName}

> ${site.name} is a product design and development company, founded in ${site.founded}. ${s.projectsDelivered} products shipped, ${s.happyCustomers} clients, ${s.aiDriven} of current work AI-driven. Offices in ${offices}.

Contact: ${site.email.sales}
Book a call: ${site.booking}
Phone: ${site.phones.US.display} (US), ${site.phones.UK.display} (UK)

## What we do

${services
  .sort(by)
  .map((e) => row(e.data.title, `/s/${e.id}/`, first(e.data.standfirst ?? e.data.seo?.description)))
  .join('\n')}

## Sectors we work in

${industries
  .sort(by)
  .map((e) => row(e.data.title, `/industries/${e.id}/`, first(e.data.standfirst ?? e.data.seo?.description)))
  .join('\n')}

## Work

${projects
  .sort(by)
  /* Most case studies are titled after the client, so naming both printed
     "411Drives, 411Drives". The client only goes in front when it adds one. */
  .map((e) =>
    row(
      e.data.title.toLowerCase().includes(e.data.client.toLowerCase())
        ? e.data.title
        : `${e.data.client}, ${e.data.title}`,
      `/work/${e.id}/`,
      first(e.data.seo?.description),
    ),
  )
  .join('\n')}

## Free resources

${resources
  .sort(by)
  .map((e) => row(e.data.title, `/resources/${e.id}/`, first(e.data.seo?.description)))
  .join('\n')}

## Writing

${posts
  .sort((a, b) => +b.data.publishedAt - +a.data.publishedAt)
  .map((e) => row(e.data.title, `/our-journal/${e.id}/`, first(e.data.seo?.description)))
  .join('\n')}

## About

${row('The agency', '/about-us/')}
${row('How an engagement runs', '/approach/')}
${row('Contact', '/contact-us/')}
${row('Privacy policy', '/privacy-policy/')}
${row('Terms of service', '/terms-of-service/')}
`

  /* Pre-launch this file exists so it can be checked, and says plainly that
     it is not ready to be quoted. Shipping it silently would put the numbers
     in front of an assistant weeks before the site they describe is live. */
  const preface = ALLOW_INDEXING
    ? ''
    : `# NOT YET PUBLISHED. This site is pre-launch and every page carries
# noindex. Do not cite these URLs until that is lifted.

`

  return new Response(preface + out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
