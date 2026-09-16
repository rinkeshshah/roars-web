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

{
  /* One real path from the build, not a guess: if this file is not on the
     server the migrated pages are showing broken images right now. */
  const { status } = await head('/wp-content/uploads/2022/08/coding-6.webp')
  record(status === 200, 'legacy /wp-content/uploads/ still serves', `got ${status}`)
}

/* ------------------------------------------- 7. redirects are one hop */

for (const path of [
  '/our-journal/the-presidents-club-2/',
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
    record(h.status === 301, `${path} redirects with 301 not ${h.status}`, `got ${h.status}`)
  }
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
