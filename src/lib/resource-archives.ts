/**
 * The two resource archives at /resource/staff-picks/ and /resource/tools/.
 *
 * WHY THE URLS ARE SINGULAR, and why they were missing.
 *
 * The guides live at /resources/<slug>/ (plural). These two archives live at
 * /resource/<name>/ (singular) on the live site. That is WordPress being
 * WordPress, and it is not ours to tidy: both are marked KEEP with "migrate at
 * the identical URL" in docs/migration/roars-url-decisions.csv, and
 * design/specs/Resources.md links these exact absolute URLs from the shelf
 * cards. Neither was in docs/URL-INVENTORY.csv, which is why both rendered
 * nothing; they are restored to the inventory with that provenance in the note
 * column rather than invented here.
 */

export interface ToolGroup {
  n: string
  /** The job somebody is doing when they reach for these. */
  name: string
  when: string
  slugs: string[]
}

/**
 * TOOLS IS THE SAME FIFTEEN PDFS, CUT BY THE JOB RATHER THAN BY CATEGORY.
 *
 * Nothing is invented and nothing new is claimed to exist. The export's own
 * copy for this shelf is "Explore our library of PDFs, free for you to
 * download", and the library of PDFs is the fifteen. /resources/guides/ sorts
 * them by category for somebody browsing; this sorts them by the week
 * somebody is having, which is how people actually arrive.
 *
 * Every slug below must be in the inventory. assert-urls is the backstop.
 */
export const TOOL_GROUPS: ToolGroup[] = [
  {
    n: '01',
    name: 'Work out what you are solving',
    when: 'Before anybody proposes anything. These are the ones that stop a team solving the wrong problem quickly.',
    slugs: ['problem-definition', 'target-group', 'people-connection-map', 'evidence-planning'],
  },
  {
    n: '02',
    name: 'Decide what to build',
    when: 'The problem is agreed. Now the argument is about what to do about it, and which parts you are guessing at.',
    slugs: ['value-proposition', 'product-solution-benefit', 'learning-loop', 'prototype-testing-plan'],
  },
  {
    n: '03',
    name: 'Make the business case',
    when: 'Somebody has to approve it. These turn an argument about taste into arithmetic that can be refused or agreed.',
    slugs: ['business-model-canvas', 'business-plan', 'swot-analysis', 'website-redesign-roi-calculator'],
  },
  {
    n: '04',
    name: 'Get it moving',
    when: 'The idea is sound and it is still not happening. Usually that is a route problem or a people problem.',
    slugs: ['innovation-flowchart', 'building-partnerships', 'pitching-checklist'],
  },
]

export interface Pick {
  kind: 'BOOK' | 'TOOL' | 'PODCAST'
  name: string
  by: string
  /** One line on why it is here, in the first person. */
  why: string
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  STAFF PICKS BELOW IS A DRAFT. EVERY ROW NEEDS REPLACING.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This is the one part of the resources section that cannot be sourced. The
 * export carries the shelf's intro copy and nothing else, there is no live
 * page body to migrate, and "our favourite books" is a claim about what
 * specific people at Roars actually rate. Nobody here can know that.
 *
 * So these are PLACEHOLDERS, chosen to be obvious ones in this field and easy
 * to swap. They are here because a page with the right shape and the wrong
 * titles is faster to correct than a blank one, which is the arrangement
 * agreed for the service outcomes. The page carries needsReview, so it is
 * noindex until somebody replaces these with the real list.
 *
 * TO FIX: replace the rows, keep the shape. `why` should sound like the
 * person who picked it, not like a blurb from the back cover.
 */
export const STAFF_PICKS_ARE_DRAFT = true

export const PICKS: Pick[] = [
  {
    kind: 'BOOK',
    name: 'The Design of Everyday Things',
    by: 'Don Norman',
    why: 'The one we hand to people who are not designers and need to understand why the door they pushed did not open.',
  },
  {
    kind: 'BOOK',
    name: 'Thinking, Fast and Slow',
    by: 'Daniel Kahneman',
    why: 'Most of what gets called user behaviour is in here, described twenty years before anybody put it in a product.',
  },
  {
    kind: 'BOOK',
    name: 'Shape Up',
    by: 'Ryan Singer',
    why: 'Short, opinionated, and the first thing that made a six week cycle sound like a decision rather than a fashion.',
  },
  {
    kind: 'BOOK',
    name: 'Continuous Discovery Habits',
    by: 'Teresa Torres',
    why: 'The book to read after a team agrees it should talk to users and then quietly does not.',
  },
  {
    kind: 'TOOL',
    name: 'Figma',
    by: 'Figma',
    why: 'Not because it is the best drawing tool, but because it is the only one the whole room can be in at once.',
  },
  {
    kind: 'TOOL',
    name: 'Maze',
    by: 'Maze',
    why: 'For the round of testing that would otherwise not happen because scheduling five people took a week.',
  },
  {
    kind: 'TOOL',
    name: 'Linear',
    by: 'Linear',
    why: 'It is fast enough that people actually keep it up to date, which is the only quality a tracker really has.',
  },
  {
    kind: 'PODCAST',
    name: '99% Invisible',
    by: 'Roman Mars',
    why: 'Design thinking without the phrase design thinking. Good for the walk between meetings.',
  },
  {
    kind: 'PODCAST',
    name: 'Lenny’s Podcast',
    by: 'Lenny Rachitsky',
    why: 'Long interviews where the guest is pushed past the anecdote into how the decision was actually made.',
  },
]
