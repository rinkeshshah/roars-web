/**
 * robots.txt, generated so it can never disagree with the indexing switch.
 *
 * While ALLOW_INDEXING is false the site is still crawlable but every page
 * says noindex. That is deliberate and it is the correct pre-launch posture:
 * `Disallow: /` would stop crawlers fetching the pages at all, so they would
 * never read the noindex, and a URL that gets linked from anywhere could
 * still be indexed URL-only. Letting them in to read the noindex is what
 * actually keeps the site out of the index.
 *
 * The belt-and-braces layer is the `X-Robots-Tag: noindex` nginx header in
 * docs/NOINDEX.md, which covers non-HTML files too.
 */
import type { APIRoute } from 'astro'
import { site, ALLOW_INDEXING } from '../lib/site'

const preLaunch = `# Pre-launch. Every page carries "noindex, nofollow".
# Crawling is deliberately allowed so that directive can be read.
# See docs/NOINDEX.md.

User-agent: *
Allow: /

# No sitemap while the site is noindexed.
`

const live = `User-agent: *
Allow: /
Disallow: /thankyou/
Disallow: /search/
Disallow: /*?s=

# AI crawlers allowed on purpose. Citations are distribution.
#
# GPTBot trains, OAI-SearchBot builds the index ChatGPT search reads from, and
# ChatGPT-User is a live fetch someone asked for. They are three separate
# agents and blocking one does not imply the others: leaving OAI-SearchBot out
# is how a site stays out of ChatGPT search while still being trained on.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Scrapers with no upside.
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${site.url}/sitemap-index.xml
`

export const GET: APIRoute = () =>
  new Response(ALLOW_INDEXING ? live : preLaunch, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
