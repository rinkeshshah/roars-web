#!/usr/bin/env node
/**
 * The last five guide pages, written from scratch.
 *
 *   node scripts/resource-copy-rest.mjs
 *
 * These are the five that had NO content file at all. Unlike the other ten,
 * the export carries no summary for them, so there was nothing to anchor to
 * and they stayed on the holding template through the last pass.
 *
 * They are written now because they rank. From docs/search-console/pages.csv,
 * sixteen months: innovation-flowchart 139 impressions, problem-definition
 * 122, website-redesign-roi-calculator 35, people-connection-map and
 * pitching-checklist lower. A live URL with impressions and a holding page on
 * it is the worst of both.
 *
 * WHAT IS SAFE HERE, and what is not.
 *
 * Four of the five are canvases: a flowchart, a stakeholder map, a pitch
 * checklist, a problem statement. What those are for and how they are filled
 * in is public method, the same ground as the SWOT and the value proposition
 * canvas in scripts/resource-copy.mjs. Nothing below says what Roars did for
 * anybody or what anything costs.
 *
 * THE FIFTH IS DIFFERENT AND IS MARKED. website-redesign-roi-calculator is
 * not a canvas, it is a spreadsheet with somebody's assumptions in it. The
 * copy describes HOW A REDESIGN RETURN IS CALCULATED, which is public method,
 * and deliberately names no rate, multiplier or benchmark, because a number
 * in that position would be a claim about outcomes.
 *
 * Every page is needsReview: true. Titles and summaries are drafted, not
 * migrated, so the seo union takes the migrated shape rather than pretending
 * these came across.
 *
 * House style: no em dashes.
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/content/resources')

const LABELS = ['01 / PURPOSE', '02 / METHOD', '03 / PITFALLS']

const GUIDES = [
  {
    slug: 'problem-definition',
    title: 'Problem Definition',
    category: 'PROBLEM DISCOVERY',
    summary:
      'Write the problem down before anybody proposes a solution. One page that holds who has the problem, what it costs them today, and how you will know when it is gone.',
    seoTitle: 'Problem Definition Template, Free One Page Download',
    seoDesc:
      'Write the problem down before anybody proposes a solution. Who has it, what it costs them today, and how you will know when it is gone, on one page.',
    intent: 'problem definition template',
    sections: [
      {
        heading: 'What is this for?',
        lead: 'To stop a team solving the wrong thing quickly. Most projects that go wrong were not badly built, they were aimed at a problem nobody had written down, and the first written version appeared in the retrospective.',
        body: 'A problem statement is worth the hour when more than two people have to agree on what they are doing. It is the artefact that makes disagreement visible early, while disagreement is still cheap. If two people read the same statement and picture different work, you have found something before it cost you a quarter.',
      },
      {
        heading: 'Step-by-step guide.',
        lead: 'Write who has the problem, in the singular. Not "users", one describable person having a specific bad afternoon. Then what they are trying to do, what stops them, and what it costs when it stops them.',
        body: 'The cost is the part that gets skipped and the part that decides funding. Put a unit on it: hours, missed orders, calls to support, people who leave. Finish with the line that says how you will know the problem is gone, written as something you could measure next quarter. A statement with no such line cannot be closed, only abandoned.',
      },
      {
        heading: 'Where it goes wrong.',
        lead: 'The solution is smuggled in. "Users have no dashboard" is not a problem, it is a feature request with the serial numbers filed off. The problem underneath is that somebody cannot answer a question they are asked every Monday.',
        body: 'The other failure is a statement so broad it cannot be wrong. If it could be written about any company in your sector, it will not rule anything out, and ruling things out is the only work it does. Read it back and ask what it forbids. If the answer is nothing, keep writing.',
      },
    ],
  },
  {
    slug: 'pitching-checklist',
    title: 'Pitching Checklist',
    category: 'STRATEGY',
    summary:
      'What has to be in the room before you pitch, and what has to be out of it. A one page pass over the story, the evidence and the ask, for the day before rather than the morning of.',
    seoTitle: 'Pitching Checklist Template, Free One Page Download',
    seoDesc:
      'What has to be in the room before you pitch and what has to be out of it. A one page pass over the story, the evidence and the ask, for the day before.',
    intent: 'pitching checklist template',
    sections: [
      {
        heading: 'What is this for?',
        lead: 'To separate rehearsing from preparing. Most pitch practice is spent on delivery, which is the part that improves least, while the structural problems stay in the deck and get discovered by the audience.',
        body: 'Use it the day before, not the morning of, because everything it turns up takes an evening to fix. It is as useful for an internal budget request as for an investor meeting. The audience is different, the failure modes are not.',
      },
      {
        heading: 'Step-by-step guide.',
        lead: 'Start with the ask, written as one sentence with a number in it. If you cannot write it, the pitch has no shape yet, and no amount of narrative will give it one.',
        body: 'Then work backwards: what must the room believe for that ask to be reasonable, and what evidence do you have for each belief. Mark every claim as demonstrated, sourced, or asserted. Asserted is allowed, but you should know which ones they are before somebody else finds out. Last, write the three questions you least want to be asked, and answer them out loud.',
      },
      {
        heading: 'Where it goes wrong.',
        lead: 'The deck grows to cover every objection and the story disappears underneath it. A pitch is not a defence, it is an argument, and an argument that anticipates everything persuades nobody.',
        body: 'The second failure is a demo carrying the load the argument should carry. A good demo makes people want it to be true; it does not make it true. The third is finding out in the room that the person you are pitching cannot approve the ask. Check that first, because it changes what the whole meeting is for.',
      },
    ],
  },
  {
    slug: 'innovation-flowchart',
    title: 'Innovation Flowchart',
    category: 'STRATEGY',
    summary:
      'One page that shows how an idea travels from the day somebody has it to the day it is funded, shelved or killed, and who decides at each turn.',
    seoTitle: 'Innovation Flowchart Template, Free One Page Download',
    seoDesc:
      'How an idea travels from the day somebody has it to the day it is funded, shelved or killed, and who decides at each turn. One page, free to download.',
    intent: 'innovation flowchart template',
    sections: [
      {
        heading: 'What is this for?',
        lead: 'To draw the route an idea actually takes through your organisation, including the bits nobody designed. Most innovation processes exist on a slide. The real one is a series of conversations, and it is the real one that decides what gets built.',
        body: 'It earns its place when people say the organisation is bad at innovation. That is almost never a shortage of ideas. It is that nobody can say where an idea goes after it is had, so ideas go nowhere in particular and everybody concludes the culture is at fault.',
      },
      {
        heading: 'Step-by-step guide.',
        lead: 'Draw it from a real example, not from the ideal. Take one idea from the last year, one that made it and one that did not, and trace where each actually went, who saw it, and who stopped it.',
        body: 'Mark every point where a decision was made and write the name of whoever made it. Unowned gates are where ideas go to wait, and they will be the longest stretches on your chart. Then mark the exits. A route with no way to kill an idea is not a process, it is a queue, and it will fill up until nothing moves.',
      },
      {
        heading: 'Where it goes wrong.',
        lead: 'The chart gets drawn as it should be rather than as it is, which produces a diagram everyone nods at and nobody recognises. The useful version has the awkward loop in it where things go back for a third review.',
        body: 'The other failure is stages without criteria. A gate that says "review" tells you nothing about what would pass. Write what has to be true to move on, and what happens to an idea that does not clear it, because "we will revisit" is how a portfolio quietly turns into a graveyard.',
      },
    ],
  },
  {
    slug: 'people-connection-map',
    title: 'People Connection Map',
    category: 'PROBLEM DISCOVERY',
    summary:
      'Who has to say yes, who can say no, and who nobody has spoken to yet. One page that puts the people around a decision in view before the decision needs them.',
    seoTitle: 'People Connection Map Template, Free One Page Download',
    seoDesc:
      'Who has to say yes, who can say no, and who nobody has spoken to yet. One page that puts the people around a decision in view before it needs them.',
    intent: 'stakeholder map template',
    sections: [
      {
        heading: 'What is this for?',
        lead: 'To find out who is around a piece of work before they find you. Projects rarely stall on the thing being built. They stall on somebody who was not consulted, whose objection arrives late and is entirely reasonable.',
        body: 'Use it at the start of anything that crosses a team boundary, and again whenever something has gone quiet for a fortnight without an obvious reason. The map is usually not surprising. What surprises people is how many boxes have nobody in them.',
      },
      {
        heading: 'Step-by-step guide.',
        lead: 'List the people, then mark each one for how much the outcome affects them and how much say they have. Those are different axes, and the interesting names are the ones high on one and low on the other.',
        body: 'Somebody heavily affected with no say is where resistance comes from later. Somebody with say who is barely affected is where delay comes from, because the decision is never their priority. Write the last time you actually spoke to each person. Where the answer is never, that is the week you find out what you have been assuming.',
      },
      {
        heading: 'Where it goes wrong.',
        lead: 'The map becomes an org chart with colours. Reporting lines tell you who is senior, not who can stop this, and the person who can stop it is often three levels down and holds the system it depends on.',
        body: 'The other failure is treating it as a one-off. People move, priorities move, and a map from the start of a long project describes a room that no longer exists. Redraw it at each phase. It takes twenty minutes and it is the cheapest way to notice that your sponsor changed jobs.',
      },
    ],
  },
  {
    slug: 'website-redesign-roi-calculator',
    title: 'Website Redesign ROI Calculator',
    category: 'BUSINESS MODEL',
    summary:
      'Work out what a redesign would have to change in order to pay for itself, and decide whether that change is plausible, before the project is approved rather than after.',
    seoTitle: 'Website Redesign ROI Calculator, Free Download',
    seoDesc:
      'Work out what a redesign would have to change in order to pay for itself, and decide whether that change is plausible, before the project is approved.',
    intent: 'website redesign roi calculator',
    sections: [
      {
        heading: 'What is this for?',
        lead: 'To turn "the site looks dated" into a number somebody can approve or refuse. A redesign is usually argued on taste and paid for out of a budget that answers to arithmetic, which is why the argument goes badly.',
        body: 'The useful output is not a return figure. It is the break-even: how much the conversion rate, the order value or the support load would have to move for the project to wash its face. Once that is on the page, the conversation stops being about taste and starts being about whether that movement is realistic.',
      },
      {
        heading: 'Step-by-step guide.',
        lead: 'Start from your own numbers, not from a benchmark. Traffic, conversion rate, average order value, and the full cost of the project including the internal time nobody invoices for.',
        body: 'Then solve backwards for the break-even rather than forwards from a hoped-for uplift, because a forward estimate is just your optimism with a decimal point. Run it at three levels: the movement you expect, half of it, and none. The middle column is the one to plan against. Put a date on when the change would have to land, since a return that arrives two years late is a different decision.',
      },
      {
        heading: 'Where it goes wrong.',
        lead: 'An uplift percentage gets borrowed from a case study about somebody else. Those figures are real for the site they came from and tell you nothing about yours, and a borrowed number is the fastest way to a business case that cannot be defended in the room.',
        body: 'The second failure is counting the build and forgetting the rest: content, migration, training, the weeks after launch when things are worse before they are better. The third is having no plan to measure afterwards. If nobody agrees now how the result will be read, the project will be judged on whether people liked the look of it, which is where you came in.',
      },
    ],
  },
]

const yq = (v) => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
const TODAY = new Date().toISOString().slice(0, 10)

let n = 0
for (const g of GUIDES) {
  const file = join(DIR, `${g.slug}.md`)
  if (existsSync(file)) {
    console.error(`${g.slug}: file already exists. Delete it first if you mean to regenerate.`)
    process.exit(1)
  }

  const lines = [
    '---',
    `title: ${yq(g.title)}`,
    `publishedAt: ${TODAY}`,
    `category: ${yq(g.category)}`,
    `summary: ${yq(g.summary)}`,
    `pills: ["PDF", "ONE PAGE", ${yq(g.category)}]`,
    `file: ${yq(`${g.slug}.pdf`)}`,
    'seo:',
    `  title: ${yq(g.seoTitle)}`,
    `  description: ${yq(g.seoDesc)}`,
    `  primaryIntent: ${yq(g.intent)}`,
    '  schemaType: "WebPage"',
    '# Nothing on this page was migrated. The export carries no copy for these',
    '# five at all, so the title, the summary and the long read are all drafted',
    '# and all need checking against what is actually in the PDF.',
    'needsReview: true',
    'sections:',
  ]
  g.sections.forEach((s, i) => {
    lines.push(`  - label: ${yq(LABELS[i])}`)
    lines.push(`    heading: ${yq(s.heading)}`)
    lines.push(`    lead: ${yq(s.lead)}`)
    lines.push(`    body: ${yq(s.body)}`)
  })
  lines.push('---', '', g.summary, '')

  writeFileSync(file, lines.join('\n'))
  n += 1
  console.log(`  ${g.slug}`)
}
console.log(`\nwrote ${n} new guide page(s). All fifteen guides now have a body.`)
