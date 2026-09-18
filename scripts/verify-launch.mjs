#!/usr/bin/env node
/**
 * The cutover checklist, as a command.
 *
 *   node scripts/verify-launch.mjs https://www.roarsinc.com
 *   node scripts/verify-launch.mjs https://www.roarsinc.com --forms
 *
 * RUN IT FROM A MACHINE THAT CAN REACH THE HOST. The build agent cannot:
 * its egress proxy refuses everything except package registries, so every
 * check in here is one it is structurally unable to perform. That is the
 * whole reason this is a script you run rather than a result you were given.
 *
 * It complements scripts/verify-server.mjs rather than replacing it. That one
 * owns status codes, headers, the 410 block and the redirect chains. This one
 * owns the questions asked at cutover: are the pages up, is the canonical host
 * right everywhere it is written down, did the email artwork survive the
 * deploy, and does the form endpoint answer.
 *
 * --forms IS OFF BY DEFAULT AND SHOULD BE. It posts a real submission to
 * /api/contact.php, which means a row in the database, an enquiry number
 * consumed, an acknowledgement sent and a lead forwarded to n8n. That is a
 * fine thing to do once, deliberately, and a bad thing to do from a script
 * somebody re-runs to see if it still passes.
 */

const args = process.argv.slice(2)
const FORMS = args.includes('--forms')
const BASE = (args.find((a) => !a.startsWith('--')) ?? '').replace(/\/$/, '')

if (!BASE) {
  console.error('usage: node scripts/verify-launch.mjs <https://host> [--forms]')
  process.exit(2)
}

const HOST = new URL(BASE).host
let failures = 0
const line = (ok, name, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

const get = async (path, init) => {
  try {
    const res = await fetch(BASE + path, { redirect: 'manual', ...init })
    return { status: res.status, body: await res.text(), headers: res.headers }
  } catch (e) {
    return { status: 0, body: '', headers: new Headers(), error: e.message }
  }
}

console.log(`--- verify-launch: ${BASE} ---\n`)

/* 1. The pages a visitor actually lands on. */
console.log('1. main pages return 200')
const PAGES = [
  '/', '/about-us/', '/work/', '/contact-us/', '/approach/', '/clients/',
  '/our-journal/', '/resources/', '/privacy-policy/', '/terms-of-service/',
  '/s/mvp-development/', '/industries/healthcare-app-development-company/',
]
for (const p of PAGES) {
  const r = await get(p)
  line(r.status === 200, `  ${p}`, r.error ?? `${r.status}`)
}

/* 2. The canonical host, everywhere it is written down. A page served from
      the right host can still name the wrong one in its own head. */
console.log('\n2. canonical host')
{
  const home = await get('/')
  const canonical = (home.body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]
  const og = (home.body.match(/<meta property="og:url" content="([^"]+)"/) || [])[1]
  line(canonical === `https://${HOST}/`, '  homepage canonical', canonical ?? 'not found')
  line(og === `https://${HOST}/`, '  homepage og:url', og ?? 'not found')
  line(!home.body.includes('dev.roarsinc.com'), '  homepage names no dev host')
  line(
    /content="index,follow/.test(home.body),
    '  homepage is index,follow',
    (home.body.match(/<meta name="robots" content="([^"]*)"/) || [])[1] ?? 'no robots tag',
  )
}

console.log('\n3. robots.txt and sitemap point at this host')
{
  const robots = await get('/robots.txt')
  line(robots.status === 200, '  /robots.txt 200', `${robots.status}`)
  line(
    robots.body.includes(`Sitemap: https://${HOST}/sitemap-index.xml`),
    '  robots.txt Sitemap line',
    (robots.body.match(/^Sitemap:.*$/m) || ['absent'])[0],
  )
  line(!robots.body.includes('dev.roarsinc.com'), '  robots.txt names no dev host')

  const idx = await get('/sitemap-index.xml')
  line(idx.status === 200, '  /sitemap-index.xml 200', `${idx.status}`)
  line(idx.body.includes(`https://${HOST}/sitemap-0.xml`), '  index points at this host')

  const sm = await get('/sitemap-0.xml')
  line(sm.status === 200, '  /sitemap-0.xml 200', `${sm.status}`)
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const foreign = locs.filter((u) => !u.startsWith(`https://${HOST}/`))
  line(locs.length > 0, '  sitemap has URLs', `${locs.length}`)
  line(foreign.length === 0, '  every sitemap URL is on this host', foreign.slice(0, 3).join(' '))

  /* A sitemap that lists a noindex page spends the file's credibility. Checked
     against what the server actually serves, because that is the only copy
     that matters once it is deployed. Sampled: twelve requests, not a hundred. */
  const sample = locs.slice(0, 12)
  const contradictions = []
  for (const u of sample) {
    const r = await get(new URL(u).pathname)
    if (/content="noindex/.test(r.body)) contradictions.push(u)
  }
  line(contradictions.length === 0, `  sampled ${sample.length} sitemap URLs, none noindex`, contradictions.join(' '))
}

console.log('\n4. the email artwork')
{
  const png = await get('/email/roars-lockup.png')
  line(png.status === 200, '  /email/roars-lockup.png 200', `${png.status}`)
  line(
    (png.headers.get('content-type') ?? '').includes('image/png'),
    '  served as image/png',
    png.headers.get('content-type') ?? 'no content-type',
  )
}

console.log('\n5. the diagnostics are not reachable in production')
for (const q of ['diag=1', 'diag=smtp']) {
  const r = await get(`/api/contact.php?${q}`)
  line(r.status === 404, `  /api/contact.php?${q} is 404`, `${r.status}`)
}
for (const f of ['roars-smtp.php', 'roars-integrations.php']) {
  const r = await get(`/api/${f}`)
  line(r.status === 403 || r.status === 404, `  /api/${f} is not served`, `${r.status}`)
}

console.log('\n6. the form endpoint')
{
  /* A GET with no diag should not be an error page. The endpoint answers
     POSTs; what matters here is that PHP is running it at all rather than
     nginx serving the source or 500ing. */
  const r = await get('/api/contact.php')
  line(r.status !== 0, '  /api/contact.php responds', r.error ?? `${r.status}`)
  line(!r.body.includes('<?php'), '  source is not served as text')
}

if (FORMS) {
  console.log('\n7. live form submissions (REAL: rows, emails, enquiry numbers)')
  const forms = [
    { form: 'contact', name: 'Launch Check', email: 'sales@roarsinc.com', message: 'Automated cutover check. Please ignore.' },
    { form: 'newsletter', name: 'Launch Check', email: 'sales@roarsinc.com' },
  ]
  for (const f of forms) {
    const body = new URLSearchParams({ ...f, website: '', elapsed_ms: '9000', page: `${BASE}/contact-us/` })
    const r = await get('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    let parsed = null
    try { parsed = JSON.parse(r.body) } catch { /* not JSON */ }
    line(r.status === 200, `  POST ${f.form} -> 200`, `${r.status}`)
    line(parsed?.ok === true, `  POST ${f.form} -> ok:true`, r.body.slice(0, 180))
    if (parsed?.ref) console.log(`        enquiry number issued: ${parsed.ref}`)
  }
} else {
  console.log('\n7. live form submissions — SKIPPED (pass --forms to run; it creates real enquiries)')
}

console.log(`\n--- ${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} ---`)
process.exit(failures === 0 ? 0 : 1)
