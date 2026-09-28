#!/usr/bin/env node
/**
 * Re-runnable verification of the /our-journal/ migration's URL surface.
 *
 * Two halves, and they are kept apart on purpose:
 *
 *   STATIC  — reads dist/.htaccess, dist/nginx-redirects.conf, src/lib/
 *             redirects.mjs and the built pages in dist/. Every one of these
 *             checks really executes wherever the repo is checked out, so its
 *             result is trustworthy.
 *
 *   LIVE    — the four things the brief actually asks about: 301 not 302, one
 *             hop and no chains, the target answers 200, and each of the
 *             migrated URLs answers 200 at its trailing-slash form without
 *             redirecting. Those are HTTP facts. They cannot be inferred from
 *             a config file, so this half only counts when it has really
 *             talked to the server.
 *
 * LIVE DOES NOT RUN IN THE BUILD AGENT. Outbound access to roarsinc.com is
 * blocked at the proxy (403 on CONNECT), so there is no way to observe a real
 * response code from here. The script therefore refuses to report an overall
 * pass unless the live half ran: without --live it exits 2 (INCOMPLETE), and
 * with --live it exits 1 if the host is unreachable. A green exit 0 means all
 * of it ran and all of it passed, and nothing else.
 *
 * Usage
 *   node scripts/verify-journal-redirects.mjs                 static only -> exit 2
 *   node scripts/verify-journal-redirects.mjs --live          live against www.roarsinc.com
 *   node scripts/verify-journal-redirects.mjs --live --base=https://dev.roarsinc.com
 *   node scripts/verify-journal-redirects.mjs --static-only   static only -> exit 0/1
 *
 * --static-only exists so CI can gate on the half that is real here. It says
 * plainly in its output that the live half was skipped; it never claims the
 * redirects were observed working.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const HTACCESS = join(ROOT, 'dist/.htaccess')
const NGINX = join(ROOT, 'dist/nginx-redirects.conf')
const POSTS = join(ROOT, 'src/content/posts')
const DIST = join(ROOT, 'dist')

const argv = process.argv.slice(2)
const LIVE = argv.includes('--live')
const STATIC_ONLY = argv.includes('--static-only')
const BASE = (argv.find((a) => a.startsWith('--base=')) || '--base=https://www.roarsinc.com')
  .slice('--base='.length)
  .replace(/\/$/, '')

const failures = []
const notes = []
const fail = (what, why) => failures.push(`${what}\n        ${why}`)

/* ------------------------------------------------------------------ inputs */

if (!existsSync(HTACCESS)) {
  console.error('FAIL: dist/.htaccess is missing. Run `npm run build` first.')
  process.exit(1)
}

const migrated = readdirSync(POSTS)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))

const htaccess = readFileSync(HTACCESS, 'utf8').split('\n')

/** Shipped rules only. Held-back rules live in the file as comments and are
 *  read separately so they can be reported, never verified as live. */
const rules = []
const heldBack = []
for (const raw of htaccess) {
  const line = raw.trim()
  const live = line.match(/^Redirect\s+(\d{3})\s+(\S+)\s+(\S+)$/)
  if (live) {
    rules.push({ code: Number(live[1]), from: live[2], to: live[3] })
    continue
  }
  const commented = line.match(/^#\s*Redirect\s+(\d{3})\s+(\S+)\s+(\S+)$/)
  if (commented) heldBack.push({ from: commented[2], to: commented[3] })
}

const pathOf = (u) => u.replace(/^https?:\/\/[^/]+/, '')
const slugOf = (p) => (p.match(/^\/our-journal\/([^/]+)\/$/) || [])[1]
const sources = new Set(rules.map((r) => r.from))
const migratedUrls = migrated.map((s) => `/our-journal/${s}/`)

/* ------------------------------------------------------------------ static */

console.log('--- verify-journal-redirects (static) ---')
console.log(`shipped rules: ${rules.length}   held back: ${heldBack.length}   migrated posts: ${migrated.length}`)

// 1. Status code is literally 301. A 302 in the file is a 302 on the server.
for (const r of rules) {
  if (r.code !== 301) fail(r.from, `declared ${r.code}, must be 301`)
}

// 2. Trailing slash on both ends, so no rule depends on a rewrite running first.
for (const r of rules) {
  if (!r.from.endsWith('/')) fail(r.from, 'source has no trailing slash')
  if (!pathOf(r.to).endsWith('/')) fail(r.from, `target ${r.to} has no trailing slash`)
}

// 3. No self-redirect, no chain. A target that is also a source is two hops.
for (const r of rules) {
  const to = pathOf(r.to)
  if (to === r.from) fail(r.from, 'redirects to itself: infinite loop')
  if (sources.has(to)) fail(r.from, `target ${to} is itself a redirect source: chain`)
}

// 4. One source, one rule. Apache takes the first; a duplicate is a coin toss.
const seen = new Map()
for (const r of rules) {
  if (seen.has(r.from)) fail(r.from, `declared twice: -> ${seen.get(r.from)} and -> ${r.to}`)
  else seen.set(r.from, r.to)
}

// 5. A migrated post must never be a redirect source. If it is, the post was
//    migrated and then hidden, which is the loyalty-reward-program-app defect.
for (const r of rules) {
  const s = slugOf(r.from)
  if (s && migrated.includes(s)) fail(r.from, 'source is a migrated post: the post would be unreachable')
}

// 6. Apache's `Redirect` is a PREFIX match, not an exact one. A source that
//    is a prefix of another URL catches that URL too and appends the
//    remainder, so `/our-journal/` as a source would swallow every post.
for (const r of rules) {
  for (const other of [...sources, ...migratedUrls]) {
    if (other !== r.from && other.startsWith(r.from)) {
      fail(r.from, `is a path prefix of ${other}; Apache Redirect would catch that URL too`)
    }
  }
}

// 7. The target exists in the build. This is what makes the live 200 possible;
//    it is not a substitute for observing it.
for (const r of rules) {
  const p = pathOf(r.to)
  const file = join(DIST, p, 'index.html')
  if (!existsSync(file)) fail(r.from, `target ${p} has no page in dist/ and would 404`)
}

// 8. Every migrated URL was built, at the trailing-slash form.
for (const url of migratedUrls) {
  if (!existsSync(join(DIST, url, 'index.html'))) fail(url, 'migrated post has no page in dist/')
}

// 9. The site has two redirect layers. A journal URL can be clean in one and
//    broken in the other, so the nginx map is held to the same standard and
//    the two are checked against each other.
if (existsSync(NGINX)) {
  const nginx = new Map(
    [...readFileSync(NGINX, 'utf8').matchAll(/^location = (\S+) \{\n\s*return 301 (\S+);/gm)].map((m) => [
      m[1],
      m[2].replace(/;$/, ''),
    ]),
  )

  for (const url of migratedUrls) {
    if (nginx.has(url)) fail(url, 'migrated post is a redirect source in dist/nginx-redirects.conf')
  }

  for (const [from, to] of nginx) {
    if (!from.startsWith('/our-journal/')) continue
    const p = pathOf(to)
    if (!existsSync(join(DIST, p, 'index.html'))) {
      fail(`${from} (nginx)`, `target ${p} has no page in dist/ and would 404`)
    }
    const htTo = seen.get(from)
    // Both layers claiming one source is survivable only while they agree.
    // Disagreeing means the answer depends on which layer runs first, which
    // is a server config detail nobody should have to remember.
    if (htTo !== undefined && pathOf(htTo) !== p) {
      fail(from, `.htaccess sends it to ${pathOf(htTo)} but nginx sends it to ${p}: the layers disagree`)
    } else if (htTo !== undefined) {
      notes.push(`${from} is a source in both layers, but both agree on ${p}`)
    }
  }
} else {
  notes.push('dist/nginx-redirects.conf not present: skipped the cross-layer check')
}

if (heldBack.length) {
  notes.push(
    `${heldBack.length} rule(s) are held back as comments in dist/.htaccess and are NOT verified here. ` +
      'Each would break a live URL; see the reasons written beside them in the file.',
  )
}

if (failures.length) {
  console.error(`\nSTATIC FAIL: ${failures.length} problem(s):`)
  for (const f of failures) console.error(`    ${f}`)
} else {
  console.log('STATIC PASS: 301 only, slashes on both ends, no self-redirects, no chains,')
  console.log('             no duplicate sources, no migrated post used as a source,')
  console.log(`             all ${rules.length} targets and all ${migrated.length} migrated URLs built in dist/.`)
}
for (const n of notes) console.log(`NOTE: ${n}`)

/* -------------------------------------------------------------------- live */

const liveFailures = []

async function head(url) {
  const res = await fetch(url, { redirect: 'manual' })
  return { status: res.status, location: res.headers.get('location') }
}

async function runLive() {
  console.log(`\n--- verify-journal-redirects (live: ${BASE}) ---`)

  // Reachability first, and it has to be a real answer from the site.
  //
  // A blocked egress proxy does not refuse the connection, it answers 403 to
  // everything. Without this probe that reads as "all 68 journal URLs are
  // returning 403", which is a frightening and completely false report. The
  // site root answers 200 (or a redirect to itself with a slash); anything
  // else means we are talking to something that is not the site, so the live
  // half did not run and must not be scored.
  let probe
  try {
    probe = await head(`${BASE}/`)
  } catch (err) {
    console.error(`LIVE DID NOT RUN: ${BASE} is unreachable from here.`)
    console.error(`    ${err.message}`)
    console.error('    Nothing about the live redirects has been verified. This is not a pass.')
    return false
  }
  if (![200, 301, 302, 308].includes(probe.status)) {
    console.error(`LIVE DID NOT RUN: ${BASE}/ answered ${probe.status}, not a page.`)
    console.error('    That is an egress block or an interception proxy, not the site.')
    console.error('    Every per-URL result would be that same status, so none were taken.')
    console.error('    Re-run from a network that can reach the site. This is not a pass.')
    return false
  }

  for (const r of rules) {
    const from = `${BASE}${r.from}`
    const want = pathOf(r.to)
    let hop
    try {
      hop = await head(from)
    } catch (err) {
      liveFailures.push(`${r.from}\n        request failed: ${err.message}`)
      continue
    }
    if (hop.status !== 301) {
      liveFailures.push(`${r.from}\n        returned ${hop.status}, expected 301`)
      continue
    }
    const got = pathOf(hop.location || '')
    if (got !== want) {
      liveFailures.push(`${r.from}\n        redirected to ${got || '(no Location)'}, expected ${want}`)
      continue
    }
    // One hop: the target itself must answer 200, not redirect again.
    let dest
    try {
      dest = await head(`${BASE}${want}`)
    } catch (err) {
      liveFailures.push(`${r.from}\n        target ${want} request failed: ${err.message}`)
      continue
    }
    if (dest.status !== 200) {
      liveFailures.push(`${r.from}\n        target ${want} returned ${dest.status}, expected 200 (chain or 404)`)
    }
  }

  for (const url of migratedUrls) {
    let res
    try {
      res = await head(`${BASE}${url}`)
    } catch (err) {
      liveFailures.push(`${url}\n        request failed: ${err.message}`)
      continue
    }
    if (res.status !== 200) {
      liveFailures.push(`${url}\n        returned ${res.status}, expected 200 (a migrated post must not redirect)`)
    }

    // And the no-slash form must reach it in one 301.
    //
    // Search Console treats /post and /post/ as two URLs and splits the stats
    // between them — loyalty-reward-program-app landed in the decisions CSV
    // twice, with opposite verdicts, for exactly that reason. The nginx config
    // in docs/DEPLOYMENT.md canonicalises with
    // `rewrite ^/(.*[^/])$ /$1/ permanent`, so this should already hold for
    // every post. It is checked rather than assumed, because a one-line config
    // change would take it away silently.
    const bare = url.replace(/\/$/, '')
    let slashless
    try {
      slashless = await head(`${BASE}${bare}`)
    } catch (err) {
      liveFailures.push(`${bare}\n        request failed: ${err.message}`)
      continue
    }
    if (slashless.status !== 301) {
      liveFailures.push(`${bare}\n        returned ${slashless.status}, expected 301 to ${url}`)
    } else if (pathOf(slashless.location || '') !== url) {
      liveFailures.push(
        `${bare}\n        redirected to ${pathOf(slashless.location || '') || '(no Location)'}, expected ${url}`,
      )
    }
  }

  if (liveFailures.length) {
    console.error(`\nLIVE FAIL: ${liveFailures.length} problem(s):`)
    for (const f of liveFailures) console.error(`    ${f}`)
    return false
  }
  console.log(`LIVE PASS: ${rules.length} redirect(s) answered 301 in one hop to a 200;`)
  console.log(`           ${migratedUrls.length} migrated URL(s) answered 200 without redirecting,`)
  console.log('           and each one 301s from its no-slash form.')
  return true
}

/* ------------------------------------------------------------------ verdict */

let liveOk = false
if (LIVE) liveOk = await runLive()

console.log('\n--- verdict ---')
if (failures.length) {
  console.error('FAIL: static checks found problems. Fix them before deploying.')
  process.exit(1)
}
if (LIVE) {
  if (!liveOk) {
    console.error('FAIL: the live checks did not pass. The redirects are not verified.')
    process.exit(1)
  }
  console.log('PASS: static and live checks both ran and both passed.')
  process.exit(0)
}
if (STATIC_ONLY) {
  console.log('PASS (static only): the four live assertions in the brief — 301 not 302,')
  console.log('one hop, target 200, migrated URLs 200 — were NOT observed. Re-run with')
  console.log('--live from somewhere that can reach the site to check them.')
  process.exit(0)
}
console.error('INCOMPLETE: static checks passed. The live checks did not run.')
console.error('Run with --live from a machine that can reach the site. Exit 2, not 0,')
console.error('because nothing here observed a real HTTP status code.')
process.exit(2)
