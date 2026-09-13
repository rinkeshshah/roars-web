#!/usr/bin/env node
/**
 * Wraps validateRedirects() from src/lib/redirects.mjs. Catches chains,
 * self-redirects, duplicate sources and missing trailing slashes.
 *
 * A chain leaks equity at every hop and is invisible until someone crawls
 * the site, which is why this runs before the build rather than after.
 */
import { redirectList, validateRedirects } from '../src/lib/redirects.mjs'

const errors = validateRedirects()

console.log('--- validate-redirects ---')
console.log(`entries: ${redirectList.length}`)

if (errors.length) {
  console.error(`\nFAIL: ${errors.length} problem(s):`)
  for (const e of errors) console.error(`    ${e}`)
  process.exit(1)
}

console.log('PASS: no chains, self-redirects, duplicates or missing slashes.')
