#!/usr/bin/env node
/**
 * The Bayer threshold in every WebGL shader must be precision-safe.
 *
 * WHY THIS GATE EXISTS. `b2` is `fract(0.5*a.x + 0.75*a.y*a.y)`, evaluated on
 * raw fragment coordinates. On a 700px-tall canvas a.y reaches ~234, so the
 * square reaches ~41,000 — and a 32-bit float there has a spacing of about
 * 1/256, while a GPU that quietly drops to lower precision cannot represent it
 * at all. `fract` then stops being a fine dither threshold and collapses into
 * coarse blocks, painting a visible lattice at the tile period across the whole
 * canvas. It shipped, it was reported repeatedly, and it cost a day: software
 * rendering computes the expression at full precision, so every screenshot
 * taken here came back clean while the live site plainly was not.
 *
 * The fix is to wrap the coordinate before squaring. b2 is exactly periodic
 * with period 2 per axis, and b4/b8 sample it at half and quarter scale, so
 * modulo 8 returns the SAME value for every caller while keeping the square at
 * or under 49.
 *
 * So: any shader that defines b2 must wrap. This gate reads the sources rather
 * than a render, because the defect is invisible to the renderer we have.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'src/scripts'
const SAFE = /float\s+b2\s*\(\s*vec2\s+a\s*\)\s*\{\s*a\s*=\s*mod\s*\(\s*floor\s*\(\s*a\s*\)\s*,\s*8\.\s*\)\s*;/
const ANY = /float\s+b2\s*\(\s*vec2\s+a\s*\)\s*\{/g

let checked = 0
const bad = []
for (const f of readdirSync(DIR).filter((n) => n.endsWith('.ts'))) {
  const src = readFileSync(join(DIR, f), 'utf8')
  const defs = src.match(ANY)
  if (!defs) continue
  /* Count definitions and safe definitions separately: a file can hold more
     than one shader, and one wrapped copy must not vouch for an unwrapped one. */
  const safeCount = (src.match(new RegExp(SAFE.source, 'g')) ?? []).length
  checked += defs.length
  if (safeCount !== defs.length) bad.push(`${DIR}/${f}: ${defs.length} b2 definition(s), ${safeCount} wrapped`)
}

console.log('--- assert-dither-precision ---')
console.log(`b2 definitions checked : ${checked}`)
if (bad.length) {
  console.error('FAIL: a Bayer threshold squares an unwrapped coordinate.\n')
  for (const b of bad) console.error('  ' + b)
  console.error('\nUse: float b2(vec2 a){a=mod(floor(a),8.);return fract(dot(a,vec2(.5,a.y*.75)));}')
  console.error('It is the same value — b8 repeats every 8 cells — without the precision cliff.')
  process.exit(1)
}
if (!checked) {
  console.error('FAIL: no b2 definition found at all. Did the shaders move?')
  process.exit(1)
}
console.log('PASS: every Bayer threshold wraps before squaring.')
