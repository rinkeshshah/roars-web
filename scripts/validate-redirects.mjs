#!/usr/bin/env node
/**
 * The redirect gate.
 *
 * Two halves:
 *
 *  1. MAP HYGIENE, from validateRedirects() in src/lib/redirects.mjs. Chains,
 *     self-redirects, duplicate sources, missing trailing slashes. A chain
 *     leaks equity at every hop and is invisible until somebody crawls the
 *     site, which is why this runs before the build rather than after.
 *
 *  2. DESTINATIONS RESOLVE. A 301 into a 404 is worse than the 404 it
 *     replaced: it looks handled, it passes the hygiene check above, and it
 *     spends the crawl budget on the way to nothing. So every destination has
 *     to be a page that exists in dist/.
 *
 *     A source that is ALSO built is reported but does not fail. Three of them
 *     are, and all three are deliberate: the journal migration builds a noindex
 *     holding page for every post it did not bring across, including ones this
 *     map retires. nginx tries `location =` before it tries a file, so the 301
 *     wins and the holding page is never served. Worth printing, because the
 *     other reason a source would be built is that somebody redirected a page
 *     they still wanted.
 *
 *     This half needs dist/, and the script runs before the build in the
 *     `verify` chain, so it checks whatever dist/ is there from the previous
 *     run and says plainly when there is none. That is not a hole: the chain
 *     rebuilds and re-runs, and CI runs it against a warm tree.
 *
 * Pattern rules are checked for shape only. They are regexes, so "does the
 * destination exist" is not a question with one answer; the live probe in
 * scripts/verify-server.mjs is what tests those against the real server.
 */
import { existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { patternRedirects, redirectList, validateRedirects } from '../src/lib/redirects.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

const errors = validateRedirects()

/** A path like /industries/x/ is built when dist/industries/x/index.html is. */
const built = (path) => {
  const file = join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html')
  return existsSync(file) && statSync(file).isFile()
}

for (const r of patternRedirects) {
  if (!r.pattern.startsWith('^')) {
    errors.push(`Unanchored pattern: ${r.pattern} — it would match mid-path.`)
  }
  try {
    new RegExp(r.pattern)
  } catch (e) {
    errors.push(`Invalid pattern: ${r.pattern} (${e.message})`)
  }
  const captures = (r.pattern.match(/\((?!\?)/g) ?? []).length
  for (const ref of r.destination.match(/\$(\d+)/g) ?? []) {
    const n = Number(ref.slice(1))
    if (n > captures) {
      errors.push(
        `Pattern ${r.pattern} -> ${r.destination} uses ${ref} but only ` +
          `captures ${captures} group(s).`,
      )
    }
  }
}

console.log('--- validate-redirects ---')
console.log(`exact rules  : ${redirectList.length}`)
console.log(`pattern rules: ${patternRedirects.length}`)

let checkedDist = false
const shadowed = []
if (existsSync(DIST)) {
  checkedDist = true
  for (const r of redirectList) {
    if (!built(r.destination)) {
      errors.push(`Destination is not a built page: ${r.source} -> ${r.destination}`)
    }
    if (built(r.source)) shadowed.push(r.source)
  }
  console.log(`destinations : ${redirectList.length} checked against dist/`)
} else {
  console.log('destinations : NOT CHECKED, dist/ is absent. Build, then re-run.')
}

if (shadowed.length) {
  console.log(
    `\nNOTE: ${shadowed.length} source(s) are also built in dist/. nginx tries ` +
      'an exact\n      location before it tries a file, so the 301 wins and the ' +
      'built page is\n      never served. Check each is meant to be retired:',
  )
  for (const s of shadowed) console.log(`    ${s}`)
}

if (errors.length) {
  console.error(`\nFAIL: ${errors.length} problem(s):`)
  for (const e of errors) console.error(`    ${e}`)
  process.exit(1)
}

console.log(
  checkedDist
    ? 'PASS: no chains, self-redirects, duplicates or missing slashes, and\n' +
        '      every destination is a page that exists.'
    : 'PASS (hygiene only): no chains, self-redirects, duplicates or missing slashes.',
)
