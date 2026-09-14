#!/usr/bin/env node
/**
 * Fail the build on a scoped style that matches nothing.
 *
 *   node scripts/assert-styles.mjs [dist]
 *
 * WHY THIS EXISTS
 * ---------------
 * An Astro scope hash does not cross a component boundary. A class handed to
 * a component — <Reveal class="about__stats">, <Section class="hero"> — lands
 * on an element the parent never scoped, so the parent's rule compiles to
 *
 *     .about__stats[data-astro-cid-lcdefpme] { ... }
 *
 * against a rendered
 *
 *     <div class="reveal about__stats">
 *
 * and does nothing. Nothing errors. The CSS is present, correct, and inert.
 * That is how the homepage's About grid collapsed to the left gutter and the
 * hero lost its 900px min-height while every file looked right in review.
 *
 * This reads the BUILT output, not the source, so it catches the failure the
 * browser would actually have: for every scoped selector in dist/_astro/*.css,
 * does at least one element in at least one built page match it?
 *
 * Source-level lint rules were considered and rejected: they would have to
 * model Astro's scoping, and the thing worth asserting is the rendered fact.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const DIST = join(ROOT, process.argv[2] || 'dist')

/* Pseudo-classes and -elements that cannot match in a static document but do
   not indicate a broken selector. A :hover rule matching nothing at rest is
   correct; a plain class matching nothing is not. */
/* `.is-*` is this repo's convention for a class a script adds at runtime
   (.is-open, .is-scrolled, .is-missing). It is absent from the built HTML by
   definition, so matching nothing at rest is correct, not dead. Anything
   else that matches nothing is still a bug. */
const RUNTIME = /\.is-[a-z-]+/
const STATEFUL = /:(hover|focus|focus-visible|focus-within|active|target|visited|any-link|placeholder|disabled|checked|indeterminate|autofill|user-invalid|before|after|first-line|first-letter|selection|backdrop|marker|placeholder-shown)\b|::/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const files = walk(DIST)
const cssFiles = files.filter((f) => f.endsWith('.css'))
const htmlFiles = files.filter((f) => f.endsWith('.html'))

if (!cssFiles.length || !htmlFiles.length) {
  console.error(`assert-styles: nothing to check in ${DIST}. Run the build first.`)
  process.exit(1)
}

/**
 * Every scope hash present on a real element, and every class that appears
 * alongside it. `.x[data-astro-cid-y]` matches only if some element carries
 * both, so this is the exact question the selector asks.
 */
const classesByScope = new Map()   // scope -> Set(class)
const allScopes = new Set()

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8')
  for (const m of html.matchAll(/<[a-zA-Z][^>]*>/g)) {
    const tag = m[0]
    const scopes = [...tag.matchAll(/data-astro-cid-([a-z0-9]+)/g)].map((x) => x[1])
    if (!scopes.length) continue
    const cls = (tag.match(/\sclass="([^"]*)"/) || [, ''])[1].split(/\s+/).filter(Boolean)
    for (const s of scopes) {
      allScopes.add(s)
      if (!classesByScope.has(s)) classesByScope.set(s, new Set())
      const set = classesByScope.get(s)
      for (const c of cls) set.add(c)
    }
  }
}

/** Strip strings, then split a stylesheet into top-level selector texts. */
function selectors(css) {
  const out = []
  let depth = 0
  let buf = ''
  let inAt = false
  for (let i = 0; i < css.length; i++) {
    const c = css[i]
    if (c === '{') {
      depth++
      if (depth === 1) {
        const sel = buf.trim()
        buf = ''
        inAt = sel.startsWith('@')
        if (!inAt && sel) out.push(sel)
        continue
      }
    } else if (c === '}') {
      depth--
      if (depth <= 1) buf = ''
      if (depth === 0) inAt = false
      continue
    }
    // Inside an at-rule's block, nested rules are still selectors worth checking.
    if (depth === 1 && inAt && c === '{') continue
    if (depth === 0 || (depth === 1 && inAt)) buf += c
    if (depth === 1 && inAt && c === '{') buf = ''
  }
  return out
}

const dead = []
for (const f of cssFiles) {
  const css = readFileSync(f, 'utf8')
  for (const selText of selectors(css)) {
    for (const one of selText.split(',')) {
      const sel = one.trim()
      if (!sel || STATEFUL.test(sel) || RUNTIME.test(sel)) continue

      // Only scoped selectors are checkable this way: a global selector may
      // legitimately target markup this build does not contain.
      const scoped = [...sel.matchAll(/\[data-astro-cid-([a-z0-9]+)\]/g)].map((m) => m[1])
      if (!scoped.length) continue

      // The rightmost compound is what must match an element.
      const last = sel.split(/[\s>+~]+/).filter(Boolean).pop() || ''
      const scope = (last.match(/\[data-astro-cid-([a-z0-9]+)\]/) || [])[1]
      if (!scope) continue

      const needed = [...last.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1])
      if (!needed.length) continue

      const have = classesByScope.get(scope)
      if (!have) { dead.push({ file: f, sel, why: `scope ${scope} is on no element` }); continue }
      const missing = needed.filter((c) => !have.has(c))
      if (missing.length) {
        dead.push({ file: f, sel, why: `no element in scope ${scope} carries .${missing.join(', .')}` })
      }
    }
  }
}

const label = 'assert-styles'
console.log(`${label}: ${cssFiles.length} stylesheet(s), ${htmlFiles.length} page(s), ${allScopes.size} scope(s)`)

if (dead.length) {
  console.error('')
  console.error(`${label}: ${dead.length} scoped rule(s) match nothing in the built output.`)
  console.error('')
  console.error('This is the failure mode that has no error message: the CSS is')
  console.error('present and correct and does nothing. It is almost always a class')
  console.error('handed to a component, whose root element the parent cannot scope.')
  console.error('Style an element the page itself owns instead.')
  console.error('')
  for (const d of dead) {
    console.error(`  ${relative(ROOT, d.file)}`)
    console.error(`    ${d.sel}`)
    console.error(`    ${d.why}`)
  }
  process.exit(1)
}

console.log(`${label}: OK, every scoped rule matches something.`)
