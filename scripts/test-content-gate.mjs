#!/usr/bin/env node
/**
 * Phase 2 exit test: a deliberately thin entry fails the build with a readable
 * error naming the rule it broke.
 *
 *   node scripts/test-content-gate.mjs
 *
 * Fixtures are written to a temp directory and deleted afterwards. They never
 * enter src/content/, so no invented Roars copy can leak into the site. Their
 * prose is about the gate itself, which keeps them obviously synthetic.
 */

import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = mkdtempSync(join(tmpdir(), 'roars-gate-'))

const results = []
const ok = (n, c, d = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`)

/** ~340 words of filler about the validator, so the valid fixture clears 300. */
const longBody = `
This fixture exists to exercise the content gate and nothing else. It is written
to a temporary directory, validated, and deleted. It never reaches the content
collections and it never reaches the site.

## Why the gate exists

The build has no content management system behind it. There is one editor and
no admin panel, which means there is no reviewer sitting between a draft and a
published page. Everything a publishing workflow would normally catch has to be
caught here instead, at build time, where a failure costs a red pipeline run
rather than a live page nobody notices is broken.

## What it checks

The schema in the content config handles anything measurable on a single entry:
title length, description length, the presence of a primary intent, the shape
of the frontmatter. Those checks run first because they are cheap and because a
missing field makes every later check meaningless.

This validator handles the rules that need more than one entry to evaluate. A
duplicate title cannot be spotted from inside the entry that carries it. Neither
can content that repeats a sibling almost word for word, which is the failure
mode that matters most when pages are generated from a template and differ only
by a noun. The uniqueness measure compares overlapping word triples against
every other entry in the same collection, and template boilerplate counts
towards the overlap deliberately, because boilerplate is exactly what makes two
pages look identical to a search engine.

## What it refuses to guess

Broken internal links are reported rather than repaired. Heading levels are
warned about rather than renumbered. The validator has no opinion about whether
a page is good; it only refuses the failures that are objectively checkable and
expensive to find later. Anything requiring judgement stays with a person.

## The threshold

Three hundred words is the floor. It is arbitrary in the way all such floors
are, but it is close to the point below which a page has nothing to rank for
and would be better merged into a stronger one.
`.trim()

const seoBlock = (title, description, intent) => `seo:
  title: "${title}"
  description: "${description}"
  primaryIntent: "${intent}"`

const write = (collection, slug, front, body) => {
  mkdirSync(join(dir, collection), { recursive: true })
  writeFileSync(join(dir, collection, `${slug}.md`), `---\n${front}\n---\n\n${body}\n`)
}

// A valid entry, so the run proves the gate is not simply failing everything.
write(
  'posts',
  'valid-entry',
  `title: "A valid fixture"
publishedAt: 2026-01-15
author: "Fixture"
categories: ["testing"]
${seoBlock(
  'How the Roars build-time content gate works',
  'A walkthrough of the build-time checks that replace a CMS publish gate, covering thin content, duplicate metadata and sibling uniqueness.',
  'content validation',
)}`,
  longBody,
)

// The deliberately thin one the exit test asks for.
write(
  'posts',
  'thin-entry',
  `title: "A thin fixture"
publishedAt: 2026-01-16
author: "Fixture"
categories: ["testing"]
${seoBlock(
  'A deliberately thin fixture that should be refused',
  'This entry carries valid metadata but almost no body, so the word-count rule should refuse it and say so by name in the output.',
  'thin content',
)}`,
  'Twelve words is nowhere near enough body copy to justify a page.',
)

let output = ''
let exitCode = 0
try {
  output = execFileSync('node', [join(ROOT, 'scripts/validate-content.mjs'), '--dir', dir], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
} catch (err) {
  exitCode = err.status ?? 1
  output = `${err.stdout || ''}${err.stderr || ''}`
}

ok('gate exits non-zero on a thin entry', exitCode === 1, `exit ${exitCode}`)
ok('error names the offending file', /thin-entry\.md/.test(output))
ok('error names the rule', /thin content/.test(output))
ok('error states the measurement and the threshold', /\d+ words, needs at least 300/.test(output))
ok('valid entry is not flagged', !/valid-entry\.md/.test(output))

// Duplicate metadata, as a second rule with a readable message.
write(
  'posts',
  'duplicate-entry',
  `title: "A duplicate fixture"
publishedAt: 2026-01-17
author: "Fixture"
categories: ["testing"]
${seoBlock(
  'How the Roars build-time content gate works',
  'A different description of the same length band, so that only the title collides and the duplicate-title rule is what fires here.',
  'content validation',
)}`,
  longBody.replace('This fixture exists', 'This second fixture exists'),
)

let dupOutput = ''
try {
  execFileSync('node', [join(ROOT, 'scripts/validate-content.mjs'), '--dir', dir], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
} catch (err) {
  dupOutput = `${err.stdout || ''}${err.stderr || ''}`
}

ok('duplicate seo.title is caught', /duplicate title/.test(dupOutput))
ok('duplicate error names the other file', /valid-entry\.md/.test(dupOutput))
ok('near-identical siblings are caught', /not unique enough|thin uniqueness/.test(dupOutput))

rmSync(dir, { recursive: true, force: true })

console.log(results.join('\n'))
const failed = results.some((r) => r.startsWith('FAIL'))
console.log(failed ? '\nRESULT: FAIL' : '\nRESULT: PASS')
if (failed) {
  console.log('\n--- validator output ---\n' + output)
}
process.exit(failed ? 1 : 0)
