/**
 * /feed/ — the WordPress address, still live.
 *
 * Every reader that ever subscribed to this site is polling this URL, and
 * since the cutover it has returned 404. It serves the same bytes as
 * /our-journal/rss.xml rather than redirecting to it: a 301 is correct for a
 * page and risky for a feed, because some readers treat a moved feed as a
 * dead one and drop the subscription rather than following it.
 */
import type { APIRoute } from 'astro'
import { buildFeed } from '../our-journal/rss.xml'

export const GET: APIRoute = async () =>
  new Response(await buildFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
