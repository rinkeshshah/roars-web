#!/usr/bin/env node
/**
 * Every quote attributed to a named human must be verified against a source.
 *
 *   node scripts/assert-attribution.mjs
 *
 * WHY
 * ---
 * The approved prototypes carry scrambled attributions. Two are provably
 * wrong rather than merely suspicious:
 *
 *   - The founder shipped as "Riinkesh A Sshah" in five places while this
 *     repo's own Organization schema said "Rinkesh Shah". Doubled letters,
 *     the same corruption in "Ankush A Sshah".
 *   - The prototype's own image alt text contradicts its captions.
 *     suzanne.webp is captioned "Jayeis Sonill". Nitin.webp is alt-tagged
 *     "Avinash Kumar". Atul.webp is alt-tagged "Shiva Kumar".
 *
 * A wrong name on a real client's testimonial is a worse defect than any
 * layout delta, and it is not the kind of thing a visual diff can see. The
 * rule everywhere else in this project is never invent content; the
 * corollary is never ship content you cannot source.
 *
 * So each attribution carries `source`. Anything unverified is listed on
 * every run and fails the build from phase 6, exactly like the deferred URLs
 * in assert-urls.mjs. Guessing "Simthing New" is "Something New" is still
 * guessing at a real company's name.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const PHASE = Number(process.env.BUILD_PHASE || 0)

/**
 * The register. `source` is where the string was verified; null means it has
 * not been, and says what is wrong with it.
 */
export const ATTRIBUTIONS = [
  {
    name: 'Rinkesh A Shah',
    where: 'homepage About / Insights / FAQ, footer, about-us',
    source: "owner-confirmed; matches this repo's Organization schema and the roarsinc.com domain owner",
  },
  {
    name: 'Ankush A Shah',
    where: 'about-us team list',
    source: 'same corruption as above, corrected the same way',
  },
  {
    name: 'Jayeis Sonill',
    company: 'Aum Investment',
    where: 'homepage testimonial 1',
    source: null,
    problem:
      'reads as scrambled, and the prototype pairs this quote with suzanne.webp, whose own alt text says "Suzanne Martin". Name and portrait disagree.',
  },
  {
    name: 'James Hadley',
    company: 'Simthing New, LLC',
    where: 'homepage testimonial 2',
    source: null,
    problem:
      '"Simthing New" is almost certainly "Something New", but almost certainly is not a source for a real company name.',
  },
  {
    name: 'Avinash Kumar',
    company: 'Roars',
    where: 'homepage testimonial 3',
    source: null,
    problem:
      'appears on the about-us TEAM list. A staff member in a testimonial slot is either deliberate or a placeholder, and only you know which.',
  },
  {
    name: 'Khusboo Panchal',
    company: 'Roars',
    where: 'homepage testimonial 4',
    source: null,
    problem:
      'also on the about-us team list; same question. Spelling may also be "Khushboo".',
  },
  {
    name: 'Bhushan Paralkar',
    company: 'Snowman Logistics',
    where: 'work/warehouse-compliance-checklist-app testimonial',
    source:
      'the quote is the client\'s own, carried across with the case study. The ' +
      'designation was owner-confirmed on 17 Sep against the Work Presentation ' +
      'handoff: AVP, not VP.',
    /* The handoff also opens the quote with a sentence production does not have
       and says "Roars showed" where production says "You showed". Only the
       designation was confirmed, so the production wording stands. */
    note: 'handoff quote text differs from production; not adopted, owner asked',
  },
  {
    name: 'Dipali Sikand',
    company: 'Mindescapes / Club Concierges',
    where: 'work/the-presidents-club testimonial',
    source:
      'the words are production\'s, verbatim in scripts/wordpress-export/work/out/' +
      'the-presidents-club.json. The name and role came from the owner via the ' +
      'Work Presentation handoff and were confirmed on 17 Sep. Until then this ' +
      'quote sat unattributed in the page body, printed in the same type as the ' +
      'copy around it, so the page read as though Roars said it about itself.',
  },
  {
    name: 'Elena Elraie',
    company: 'Lametus',
    where: 'work/parqly-parking-solution testimonial',
    source:
      'two independent records. The quote is on the live Parqly page, verbatim, in ' +
      'scripts/wordpress-export/work/out/parqly-parking-solution.json. The person, role and ' +
      "company come from the owner's own testimonials export (SocialJuice, five stars, Cyprus).",
    /* Recorded rather than resolved. The company on the record is Lametus and
       the page is Parqly. Parqly is Cyprus-based and its mockups use "Elena's
       Car", so they are very likely the same engagement — but the role prints
       what the record says, not what would look tidier, and the owner has been
       asked to confirm the relationship. */
    note: 'role prints as "Digital Consultant, Lametus"; Parqly link not yet owner-confirmed',
  },
]

const unverified = ATTRIBUTIONS.filter((a) => !a.source)
const verified = ATTRIBUTIONS.filter((a) => a.source)

console.log('--- assert-attribution ---')
console.log(`verified   : ${verified.length}`)
console.log(`unverified : ${unverified.length}`)
console.log('')

for (const a of unverified) {
  console.log(`  ${a.name}${a.company ? ` — ${a.company}` : ''}`)
  console.log(`      ${a.where}`)
  console.log(`      ${a.problem}`)
}

if (unverified.length) {
  console.log('')
  console.log('  These are real people and real companies. Getting a name wrong on')
  console.log('  a testimonial is not a rounding error. Source each one from the')
  console.log('  live site, the CRM, or the person, then fill in `source` here.')
}

if (PHASE >= 6 && unverified.length) {
  console.error('')
  console.error('FAILED: phase 6 is cutover. No unverified attribution ships.')
  process.exit(1)
}
