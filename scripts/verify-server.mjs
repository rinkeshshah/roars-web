#!/usr/bin/env node
/**
 * The checks that only a server can answer.
 *
 *   node scripts/verify-server.mjs https://dev.roarsinc.com
 *   node scripts/verify-server.mjs https://www.roarsinc.com --live
 *
 * WHY THIS IS A SCRIPT AND NOT A CHECKLIST.
 *
 * Everything else in scripts/ reads dist/ and can run anywhere. These cannot:
 * a status code, a header and a redirect chain are properties of the nginx
 * config, not of the build, and the build agent's network cannot reach either
 * host. So the checks were being done by hand, from a terminal, by whoever
 * remembered, which is the same as not being done.
 *
 * Run it from any machine that can reach the host. It prints a line per check
 * and exits non-zero if any FAIL, so it also works as a post-deploy step.
 *
 * WHAT `--live` CHANGES. Without it the host is assumed to be pre-launch or
 * staging: X-Robots-Tag MUST be noindex. With it the host is the production
 * one at cutover: X-Robots-Tag must be ABSENT and robots.txt must carry a
 * Sitemap line. Getting this backwards is the failure the flag exists to
 * make loud, so there is no default that covers both.
 */
import { redirectList } from '../src/lib/redirects.mjs'

const args = process.argv.slice(2)
const LIVE = args.includes('--live')
const BASE = (args.find((a) => !a.startsWith('--')) ?? '').replace(/\/$/, '')

if (!BASE) {
  console.error('usage: node scripts/verify-server.mjs <https://host> [--live]')
  process.exit(2)
}

let failures = 0
const results = []

const record = (ok, name, detail) => {
  results.push({ ok, name, detail })
  if (!ok) failures++
}

/** One request, no redirect following. The chain length is a thing we are
 *  measuring, so letting fetch collapse it would hide the answer. */
async function head(path, method = 'GET') {
  const res = await fetch(BASE + path, { method, redirect: 'manual' })
  return { status: res.status, headers: res.headers, res }
}

/** Walk a redirect chain by hand, capped so a loop ends the run rather than
 *  the process. Returns every hop, so "one hop" is checkable rather than
 *  assumed. */
async function chain(path, max = 5) {
  const hops = []
  let url = BASE + path
  for (let i = 0; i < max; i++) {
    const res = await fetch(url, { method: 'GET', redirect: 'manual' })
    hops.push({ url, status: res.status, location: res.headers.get('location') })
    if (res.status < 300 || res.status >= 400) break
    const loc = res.headers.get('location')
    if (!loc) break
    url = new URL(loc, url).href
  }
  return hops
}

/* ------------------------------------------------------------ 1. robots */

{
  const { status, res } = await head('/robots.txt')
  const body = status === 200 ? await res.text() : ''
  record(status === 200, 'robots.txt returns 200', `got ${status}`)

  const agents = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot']
  const blocked = ['CCBot', 'Bytespider']

  if (LIVE) {
    for (const a of agents) {
      const re = new RegExp(`User-agent:\\s*${a}\\s*\\n\\s*Allow:\\s*/`, 'i')
      record(re.test(body), `robots.txt allows ${a}`, 'rule not found')
    }
    for (const a of blocked) {
      const re = new RegExp(`User-agent:\\s*${a}\\s*\\n\\s*Disallow:\\s*/`, 'i')
      record(re.test(body), `robots.txt blocks ${a}`, 'rule not found')
    }
    record(/^Sitemap:\s*http/im.test(body), 'robots.txt names a sitemap', 'no Sitemap line')
  } else {
    record(!/^Sitemap:/im.test(body), 'robots.txt names no sitemap (pre-launch)', 'a Sitemap line is present')
  }
}

/* -------------------------------------------------------- 2. llms.txt */

{
  const { status, res } = await head('/llms.txt')
  const body = status === 200 ? await res.text() : ''
  record(status === 200, 'llms.txt returns 200', `got ${status}`)
  record(/^# /m.test(body), 'llms.txt has a heading', 'no markdown heading found')
  record(
    !/\b250\+|\b96\s*%\s*returning/i.test(body),
    'llms.txt carries no retired figure',
    'a retired stat is present',
  )
}

/* --------------------------------------------------- 3. X-Robots-Tag */

{
  const { headers } = await head('/')
  const xr = headers.get('x-robots-tag')
  if (LIVE) {
    record(!xr, 'no X-Robots-Tag on the live host', `got "${xr}"`)
  } else {
    record(
      !!xr && /noindex/i.test(xr),
      'X-Robots-Tag: noindex on the non-live host',
      xr ? `got "${xr}"` : 'header absent, this host is indexable',
    )
  }
}

/* ------------------------------------------------------- 4. real 404 */

{
  const { status, res } = await head('/this-page-does-not-exist-' + Date.now() + '/')
  record(status === 404, 'unknown URL returns a real 404', `got ${status}`)
  if (status === 404) {
    const body = await res.text()
    record(/404/.test(body), '404 body is the designed page', 'body does not mention 404')
  }
}

/* --------------------------------------------- 5. 410 on the WP surface */

for (const path of ['/wp-admin/', '/wp-login.php', '/xmlrpc.php']) {
  const { status } = await head(path)
  record(status === 410, `${path} returns 410`, `got ${status}`)
}

/* ------------------------------------- 6. legacy uploads still resolve */

/**
 * EVERY legacy image the build references, not a sample.
 *
 * These are the one class of asset scripts/assert-assets.mjs cannot check.
 * They are deliberately not in dist/ — nginx aliases /wp-content/uploads/ to
 * the WordPress uploads directory, so the only place the question "is this
 * file actually there" can be answered is against a running server.
 *
 * It matters more than it sounds. The team portraits on /about-us/, the case
 * study galleries and the industry page art are all in here. A missing one is
 * a broken image on a live page that nothing in the repository can see.
 *
 * Requires a built dist/ next to this script, which a machine running this
 * from a checkout will have. Without one it says so rather than passing.
 */
{
  const { readFileSync, existsSync, readdirSync, statSync } = await import('node:fs')
  const { join, dirname } = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

  if (!existsSync(DIST)) {
    console.log('  SKIP  legacy uploads: no dist/ next to this script. Run npm run build first.\n')
  } else {
    const paths = new Set()
    const walk = (dir) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n)
        if (statSync(p).isDirectory()) walk(p)
        else if (n.endsWith('.html')) {
          const h = readFileSync(p, 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, ' ')
          for (const m of h.matchAll(
            /(?:src|href|content)="(?:https:\/\/www\.roarsinc\.com)?(\/wp-content\/uploads\/[^"]+)"/g,
          )) {
            paths.add(m[1])
          }
        }
      }
    }
    walk(DIST)

    /* Sequential on purpose. Firing 244 requests at once is how a check gets
       rate limited and reports failures that are the check's own fault. */
    const broken = []
    for (const p of paths) {
      const { status } = await head(p, 'HEAD')
      if (status !== 200) broken.push(`${status} ${p}`)
    }
    record(
      broken.length === 0,
      `all ${paths.size} legacy /wp-content/uploads/ files serve 200`,
      `${broken.length} missing:\n            ${broken.slice(0, 15).join('\n            ')}`,
    )
  }
}

/* ------------------------------------------- 7. redirects are one hop */

/**
 * Every exact source in the map, plus three probes for the pattern rules, plus
 * the two paths that test nginx's own trailing-slash handling.
 *
 * The map's sources used to be spot-checked with one entry. That is how the
 * retired `/industry/` prefix went unnoticed for so long: nothing asked the
 * server what it did with URLs Clutch has been linking for years. Checking all
 * of them costs one request each, and it is the only way to know the rules
 * actually shipped — they are pasted into Plesk by hand, so a rule existing in
 * this repo says nothing about a rule existing on the server.
 *
 * Two pattern probes are deliberate. `/industry/<a real slug>/` has to be caught
 * by its own exact rule rather than by the catch-all, because the catch-all
 * would send the three renamed slugs into a 404 — this probe uses healthcare,
 * one of the three. The other is an attachment page, the second pattern rule.
 */
const PATTERN_PROBES = [
  '/industry/healthcare-app-development/',
  '/work/gypsy/attachment/concierge-app-development-3/',
]

for (const path of [
  ...redirectList.map((r) => r.source),
  ...PATTERN_PROBES,
  '/about-us',
  '/work',
]) {
  const hops = await chain(path)
  const redirects = hops.filter((h) => h.status >= 300 && h.status < 400)
  const final = hops[hops.length - 1]
  record(
    redirects.length <= 1 && final.status === 200,
    `${path} reaches 200 in one hop`,
    hops.map((h) => `${h.status} ${h.url}`).join(' -> '),
  )
  for (const h of redirects) {
    /* 301, not 302. A 302 says "this moved back later", and search engines
       treat the equity accordingly. Every redirect in src/lib/redirects.mjs
       is permanent by definition, so a 302 here means nginx, not us. */
    record(h.status === 301, `${path} redirects permanently (301)`, `got ${h.status}, not 301`)
  }
}

/* The catch-all under the retired prefix, checked on its own because it is the
   one rule whose correct behaviour is NOT a 200. A slug that never existed is
   still a 404 at the end; what is being checked is that nginx has the regex
   location at all, and that a real slug never reaches it. */
{
  const path = '/industry/a-slug-that-never-existed/'
  const hops = await chain(path)
  const first = hops.find((h) => h.status >= 300 && h.status < 400)
  record(
    first?.status === 301 && /\/industries\/a-slug-that-never-existed\/$/.test(first.location ?? ''),
    `${path} is caught by the /industry/ catch-all`,
    hops.map((h) => `${h.status} ${h.url}`).join(' -> '),
  )
}

/* ------------------------------------------------------------ report */

console.log(`--- verify-server ${BASE}${LIVE ? ' (live)' : ' (pre-launch/staging)'} ---`)
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n            ${r.detail}`}`)
}
console.log('')
if (failures) {
  console.error(`FAIL: ${failures} of ${results.length} checks failed.`)
  process.exit(1)
}
console.log(`PASS: all ${results.length} checks.`)
