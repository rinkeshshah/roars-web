/**
 * The journal feed.
 *
 * Hand-rolled rather than @astrojs/rss, for the same reason the sitemap,
 * the .htaccess and the client logos are: this repo generates its own
 * artefacts from its own data, and a feed is forty lines of XML. Adding a
 * dependency to emit them would be the larger change, not the smaller one.
 *
 * TWO URLS, ONE FEED. This is the canonical one. /feed/ is the WordPress-era
 * address — it is what every existing subscriber's reader is still polling,
 * and it currently 404s — and src/pages/feed.xml.ts serves the same bytes
 * there. Not a redirect: some older readers drop a subscription on a 301, and
 * the whole point is not to lose the people who already subscribed.
 *
 * WHAT IS IN IT. The published journal, newest first, capped at 20 — a feed is
 * a river, not an archive, and the archive is /our-journal/. Held-back and
 * draft entries are excluded on the same test the journal index uses, so a
 * post cannot be private on the site and public in the feed.
 */
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { site } from '../../lib/site'

const LIMIT = 20

/** XML has five of these and getting one wrong corrupts the whole document. */
const esc = (s: string): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const buildFeed = async (): Promise<string> => {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft && !p.data.noindex)
    .sort(
      (a, b) =>
        new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
    )
    .slice(0, LIMIT)

  const items = posts
    .map((p) => {
      const url = `${site.url}/our-journal/${p.id}/`
      /* RFC 822, which is what RSS 2.0 wants; an ISO date is accepted by most
         readers and silently mis-sorted by some. */
      const date = new Date(p.data.publishedAt).toUTCString()
      const summary = p.data.seo?.description ?? p.data.summary ?? ''
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(summary)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Our Journal</title>
    <link>${site.url}/our-journal/</link>
    <description>Notes from the studio: product work, how we approach it, and the nuances of building for founders.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/our-journal/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

export const GET: APIRoute = async () =>
  new Response(await buildFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
