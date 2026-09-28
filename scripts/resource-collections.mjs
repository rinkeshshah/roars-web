#!/usr/bin/env node
/**
 * Correct the five drafted guides against the live pages, and record which
 * archive each of the fifteen belongs to.
 *
 *   node scripts/resource-collections.mjs
 *
 * WHAT THIS FIXES.
 *
 * /resource/staff-picks/ and /resource/tools/ are not pages and they are not
 * new items. They are ARCHIVES over the same fifteen /resources/<slug>/ items,
 * and an item can sit in both: Innovation Flowchart and Web Redesign ROI
 * Calculator each appear on both pages. An earlier pass read the two shelf
 * cards as standalone pages and invented content for them. This replaces that
 * guess with what the live pages actually show.
 *
 * Membership below is read off the two live archives. Everything not named is
 * in neither, which is most of them.
 *
 * The five that had no content file also turn out to be exactly the five on
 * the Tools page, so their titles, summaries and categories are no longer
 * drafted: they are the live copy. Two titles were wrong in a way that
 * mattered, since the slug does not match the name:
 *
 *   website-redesign-roi-calculator  is "Web Redesign ROI Calculator"
 *   people-connection-map            is "People & Connection Map"
 *
 * And four of the five categories were wrong. The Tools page files them under
 * Pitching and Strategy, not under the Problem Discovery and Business Model I
 * had guessed at.
 *
 * House style: the live copy uses en dashes, which are converted to a comma or
 * a full stop here rather than carried across.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/content/resources')

/** Read off https://www.roarsinc.com/resource/tools/ and .../staff-picks/. */
const MEMBERSHIP = {
  'problem-definition': ['tools'],
  'pitching-checklist': ['tools'],
  'innovation-flowchart': ['tools', 'staff-picks'],
  'website-redesign-roi-calculator': ['tools', 'staff-picks'],
  'people-connection-map': ['tools'],
  'business-plan': ['staff-picks'],
  'prototype-testing-plan': ['staff-picks'],
}

/**
 * The live card copy for the five that had none. This is migrated text now,
 * not drafted text, so `needsReview` comes off the title and summary. The
 * long read in `sections` is still ours, which is why the flag stays.
 */
const LIVE = {
  'problem-definition': {
    title: 'Problem Definition',
    category: 'PITCHING',
    summary:
      'Problem Definition is a deceptively simple task. What at first seems to be the problem is often merely a symptom of a deeper problem. This tool works to both open a problem up, presenting it in a way that can be examined from a number of angles.',
  },
  'pitching-checklist': {
    title: 'Pitching Checklist',
    category: 'PITCHING',
    summary:
      'If you want to sell a killer business idea, your pitch needs to pack a punch. This 5-part checklist is the best way to make sure your pitch hits home.',
  },
  'innovation-flowchart': {
    title: 'Innovation Flowchart',
    category: 'STRATEGY',
    summary:
      'The Innovation Flowchart gives a detailed overview of the various stages in an innovation process, listing the activities, requirements and goals of each stage.',
  },
  'website-redesign-roi-calculator': {
    title: 'Web Redesign ROI Calculator',
    category: 'STRATEGY',
    seoTitle: 'Web Redesign ROI Calculator, Free One Page Download',
    summary:
      'ROI Calculator can be helpful in finding out how much a lean web design can be helpful for you.',
  },
  'people-connection-map': {
    title: 'People & Connection Map',
    category: 'STRATEGY',
    seoTitle: 'People and Connection Map Template, Free Download',
    summary:
      'The People and Connections Map is a quick and simple way to visualise exactly who you are trying to reach and how.',
  },
}

const yq = (v) => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'

/** Replace a top-level scalar key in the front matter, or add it before `seo:`. */
function setKey(fm, key, value) {
  const line = `${key}: ${value}`
  const re = new RegExp(`^${key}:.*$`, 'm')
  if (re.test(fm)) return fm.replace(re, line)
  return fm.replace(/^seo:$/m, `${line}\nseo:`)
}

let changed = 0
for (const slug of new Set([...Object.keys(LIVE), ...Object.keys(MEMBERSHIP)])) {
  const file = join(DIR, `${slug}.md`)
  const raw = readFileSync(file, 'utf8')
  const end = raw.indexOf('\n---', 4)
  let fm = raw.slice(4, end)
  const body = raw.slice(end + 4)
  const before = fm

  const live = LIVE[slug]
  if (live) {
    fm = setKey(fm, 'title', yq(live.title))
    fm = setKey(fm, 'category', yq(live.category))
    fm = setKey(fm, 'summary', yq(live.summary))
    fm = setKey(fm, 'pills', `["PDF", "ONE PAGE", ${yq(live.category)}]`)
    /* seo.title is nested, so it is replaced in place rather than through
       setKey, which only handles top-level keys. */
    if (live.seoTitle) {
      fm = fm.replace(/^(seo:\n  title: ).*$/m, `$1${yq(live.seoTitle)}`)
    }
    /* The note said the whole page was drafted. The card copy is migrated
       now; only the long read is still ours. */
    fm = fm.replace(
      /^# Nothing on this page was migrated\..*\n# five at all, so the title, the summary and the long read are all drafted\n# and all need checking against what is actually in the PDF\.$/m,
      '# Title, summary and category are the live card copy. The long read\n# below is still ours and still needs checking against the PDF.',
    )
  }

  const inCollections = MEMBERSHIP[slug]
  if (inCollections) {
    fm = setKey(fm, 'collections', `[${inCollections.map(yq).join(', ')}]`)
  }

  if (fm !== before) {
    writeFileSync(file, `---\n${fm}\n---${body}`)
    changed += 1
    console.log(`  ${slug}${live ? '  (live copy)' : ''}  ${inCollections?.join(' + ') ?? ''}`)
  }
}

console.log(`\nupdated ${changed} file(s)`)
console.log('tools: 5 items   staff-picks: 4 items   both: innovation-flowchart, website-redesign-roi-calculator')
