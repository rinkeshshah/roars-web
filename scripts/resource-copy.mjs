#!/usr/bin/env node
/**
 * Bodies for the nine guide pages that had a card but no page.
 *
 *   node scripts/resource-copy.mjs
 *
 * Each of these already carried a real summary from the export and sat on
 * draft: true, so the card appeared on the shelf and the detail page showed
 * the pending state. What was missing is the long read: what the tool is for,
 * how to fill one in, and where it goes wrong.
 *
 * WHY THIS IS SAFE TO WRITE, unlike the service outcomes.
 *
 * These describe PUBLIC FRAMEWORKS. A SWOT, a value proposition canvas, a
 * stakeholder map: what they are for and how they are filled in is documented
 * everywhere and is not a claim about Roars. Nothing here says what Roars did
 * for anybody or what it costs. The summary at the top of each page is still
 * their own migrated copy, untouched, and each section is written to sit under
 * the summary that is already there.
 *
 * THE COPY GOES IN `sections`, NOT IN THE MARKDOWN BODY.
 *
 * src/pages/resources/[slug].astro renders `summary` in the hero and
 * `sections` in the long read, and never mounts <Content /> on the designed
 * branch. Prose written into the markdown body of a designed guide is on
 * nobody's screen. An earlier pass of this script wrote both, which padded
 * the word count with text that does not exist on the page. The body is left
 * exactly as it migrated.
 *
 * WHAT IS STILL NOT WRITTEN: the five guides with no content file at all
 * (innovation-flowchart, people-connection-map, pitching-checklist,
 * problem-definition, website-redesign-roi-calculator). Those have no
 * migrated summary to anchor to, and the ROI calculator is not a canvas at
 * all, so describing what is inside somebody's PDF would be guessing at their
 * artefact. They stay on the holding template.
 *
 * House style: no em dashes.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/content/resources')

const LABELS = ['01 / PURPOSE', '02 / METHOD', '03 / PITFALLS']

const COPY = {
  'swot-analysis': [
    {
      heading: 'What is this for?',
      lead: 'A SWOT is the fastest way to get a group to say out loud what it already half knows. Strengths and weaknesses are about you and are inside your control. Opportunities and threats are about the world around you and are not.',
      body: 'It earns its place when a team is about to commit to something and the reasons for and against are still scattered across different people. Putting all four quadrants on one page forces the comparison that a discussion keeps avoiding, which is whether the opportunity is worth the weakness it exposes.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Fill weaknesses first. Groups warm up on strengths and then run out of candour by the time they reach the awkward quadrant, so start where the honesty is hardest and the rest gets easier.',
      body: 'Work alone for five minutes before sharing, so the loudest voice does not set the list. Then cluster, and cross out anything that could be written about any organisation in your sector. What is left is the useful part. Finish by pairing quadrants: which strength answers which threat, and which weakness blocks which opportunity. The pairs are where the decisions are.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'The common failure is a page of statements that no reasonable person would dispute. "Experienced team" is in the strengths column of almost every SWOT ever drawn, which means it settles nothing and costs an afternoon.',
      body: 'The second failure is treating the four boxes as an inventory rather than a decision. A SWOT that ends when the boxes are full has skipped the part that mattered. The third is filing it. Threats move, and a SWOT from eighteen months ago is a record of what a previous team was worried about, not a description of where you are now.',
    },
  ],
  'value-proposition': [
    {
      heading: 'What is this for?',
      lead: 'To force the sentence that says what somebody gets, in their words, rather than what you built, in yours. Most products can describe themselves. Far fewer can describe the change they make to somebody’s day.',
      body: 'It is most useful just before you write anything public. A team that cannot fill this in will produce a home page, a pitch deck and a sales script that each say something slightly different, and nobody outside the room will be able to tell what the product is for.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Start on the customer side, not the product side. Write the job they are trying to do, then what makes it annoying today, then what a good day looks like. Only then move to what you offer.',
      body: 'The test is the join. Each thing you offer should point at a specific annoyance you wrote down, and anything that does not point at one is a feature looking for a reason. If several offerings point at the same annoyance, you have found what the product is actually for.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'Teams fill the customer side with the product side in disguise. "Wants a unified dashboard" is not a job somebody is trying to do, it is your roadmap wearing their clothes. The job underneath is usually duller and more useful.',
      body: 'The other failure is filling it in from memory. The room genuinely believes it knows what customers find painful, and it is right about roughly half of it. Six conversations will move more lines on this canvas than six hours of discussion. If a pain cannot be traced back to somebody who said it, mark it as a guess and leave the mark visible.',
    },
  ],
  'target-group': [
    {
      heading: 'What is this for?',
      lead: 'To replace "our users" with a group small enough to disagree about. A target group that nobody could object to is a target group that will not change any decision you make.',
      body: 'Teams reach for this when a roadmap has started serving everybody. The value is not the description, it is the exclusion: naming who this is not for is what makes the remaining decisions obvious.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Describe behaviour before demographics. What they are trying to do, how often, what they use today and what they would have to give up to switch. Age and job title come last and often do not come at all.',
      body: 'Then write the people you are deliberately not serving, and why. If that list is empty, the group is too wide. Finish by naming two real people who fit, ideally ones you could call. A group you cannot find an example of is a guess with a nice layout.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'The classic is a persona with a name, a stock photograph and a paragraph of invented hobbies. It reads as research, it was produced in a workshop, and it will be quoted in decisions for two years without anybody asking where it came from.',
      body: 'The quieter failure is a group defined by who is willing to pay rather than by who has the problem. Those overlap early and separate later, usually at the point where you are building for one buyer and calling it a market. Write the behaviour that defines the group, then check whether your last five customers actually share it.',
    },
  ],
  'business-plan': [
    {
      heading: 'What is this for?',
      lead: 'To get the whole business on one page before anybody writes forty. The long document is for raising money. This is for finding out whether the parts fit together.',
      body: 'It is most useful early, when the model is still moving, and again whenever something material changes. The point is not completeness. It is that an inconsistency between how you make money and who you are selling to becomes visible when both are in view at once.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Fill in the money first. How the business earns, what it costs to deliver, and what has to be true for the gap between those to work. Everything else on the page is in service of that gap.',
      body: 'Then add the customer, the offer and the route to market, and check each one against the money. A route to market that cannot be afforded at your margin is the most common thing this catches. Leave the blanks blank rather than filling them with something plausible: the empty boxes are the agenda for the next conversation.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'Every box gets filled. A one page plan with no gaps in it is usually a plan where the difficult questions were answered with something that sounded reasonable, and a reasonable-sounding answer is harder to spot later than a blank.',
      body: 'The other failure is arithmetic that only works at the far right of the spreadsheet. If the model needs a conversion rate nobody in your sector achieves, that is the finding, and it belongs on the page rather than in a footnote. Revisit the whole thing when something real changes, and treat the version you are holding as the current draft rather than the decision.',
    },
  ],
  'learning-loop': [
    {
      heading: 'What is this for?',
      lead: 'To make sure the thing you are about to build is answering a question somebody wrote down. A loop is one turn of assumption, test, result and decision, and teams that skip the first and last steps tend to build continuously and learn nothing.',
      body: 'Use it when a team is busy but cannot say what it has learned this quarter. Writing the assumption before the work turns a feature release into an experiment, and it makes the result usable whichever way it goes.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Write the assumption as a sentence that could be wrong. "Users will pay for this" cannot be tested. "Ten of the next fifty trial accounts will upgrade without being contacted" can.',
      body: 'Then choose the smallest test that could change your mind, and decide in advance what result would make you stop. That last part is the one teams skip, and it is the one that stops a disproved assumption turning into another round of tweaks. Close the loop by writing what you decided, not just what happened.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'The assumption gets written after the result. It is rarely deliberate: the test runs, the number is ambiguous, and the question quietly reshapes itself into one the number answers. Writing it down first, dated, is the whole defence.',
      body: 'The second failure is a loop with no stopping condition, which turns a disproved idea into an indefinite series of adjustments. The third is confusing shipping with learning. A release that nobody measured is not a turn of the loop, it is work. Close each loop with a written decision, even when the decision is to carry on unchanged.',
    },
  ],
  'evidence-planning': [
    {
      heading: 'What is this for?',
      lead: 'To work out what you would need to see in order to believe something, before you go looking. Most evidence gathering starts with a method and works backwards, which is how teams end up with a lot of data and no decision.',
      body: 'It is worth an hour whenever a decision is expensive and the argument has become a matter of opinion. Naming the evidence in advance also names the evidence that would change your own mind, which is usually the more difficult half.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Start from the claim, not the research. Write what you are asserting, then what a reasonable sceptic would want to see, then what you would accept as enough.',
      body: 'Then choose the cheapest source that clears that bar. Often it is five conversations rather than a survey, or a number you already have and have not looked at. Write down what you will do for each possible result before you gather anything, because a plan written afterwards is a rationalisation with a timestamp.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'The bar moves after the data arrives. You said forty per cent would be convincing, you got thirty-one, and the conversation becomes a discussion of sample quality. Sometimes that is a fair objection. It is only fair if you would have raised it at forty-nine.',
      body: 'The other failure is asking people to predict themselves. What somebody says they would pay, or would use weekly, is a poor guide to what they do, and a survey full of those answers is expensive confidence. Ask about what they did last time instead, and prefer a small piece of behaviour to a large pile of intentions.',
    },
  ],
  'building-partnerships': [
    {
      heading: 'What is this for?',
      lead: 'To be honest about what each side is getting before anybody signs anything. Most partnerships that fail did not fail on execution. They failed because the two parties wanted different things and neither said so.',
      body: 'Use it before the first serious conversation and again before any agreement. Filling in the other side’s column is the part that does the work, and being unable to fill it in is itself the finding.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Write what you want from this, plainly, including the thing you would not say in the meeting. Then write what you think they want, and mark how confident you are in each line.',
      body: 'Anything you marked as a guess is a question for the next conversation rather than an assumption to build on. Then write what each side is putting in, and what happens if one side stops. A partnership with no answer to that last question is a favour with paperwork.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'Enthusiasm from one person is mistaken for commitment from their organisation. They are genuinely keen, they have no budget line, and the partnership is real until the quarter they are measured on arrives.',
      body: 'The other failure is leaving the money and the work vague because the conversation is going well. Who pays for what, who does the first version, and who owns what comes out of it are easier to settle while everyone is optimistic than six months in. Write the unwinding too. Knowing how this ends is what makes it safe to start.',
    },
  ],
  'product-solution-benefit': [
    {
      heading: 'What is this for?',
      lead: 'To separate three things that get said as one. The product is what it is, the solution is what it does about a problem, and the benefit is what changes for the person afterwards. Most descriptions collapse all three into a feature list.',
      body: 'It is most useful when a team is close to the build and has lost the thread back to why. If the benefit column is thin while the product column is full, that is usually visible in the roadmap too.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Fill the product column fast, it is the easy one. Then for each row, ask what problem it solves and write that in the middle column. Rows with no answer are the interesting ones.',
      body: 'Then write the benefit as a change in somebody’s day rather than as an adjective. "Faster" is not a benefit; "they stop checking the spreadsheet on a Sunday" is. Finish by reading the benefit column on its own. If it does not describe a product worth paying for, the problem is upstream of the build.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'All three columns end up saying the same thing in different fonts. Product: real time sync. Solution: syncs in real time. Benefit: real time syncing. The exercise has been completed and nothing has been learned.',
      body: 'The fix is to make each column change register. The solution column should name a problem that exists whether or not you build anything. The benefit column should be readable by somebody who has never heard of your product, and should describe their week rather than your feature. If a row cannot survive that, it is a row worth arguing about before it becomes a sprint.',
    },
  ],
  'prototype-testing-plan': [
    {
      heading: 'What is this for?',
      lead: 'To decide what a test is for before somebody sits down in front of the prototype. Sessions run without this produce a lot of observations and no agreement about what they meant.',
      body: 'Use it for every round, including the informal ones. The plan takes twenty minutes and it is what makes five sessions conclusive rather than five sessions interesting.',
    },
    {
      heading: 'Step-by-step guide.',
      lead: 'Write the question first, then the task that would answer it. A task is something the person tries to do, not a screen you show them. "Book a table for four on Friday" rather than "have a look at the booking screen".',
      body: 'Decide who you need, how many, and what counts as a pass, before the first session. Then write down what you will change if they fail and what you will change if they succeed. Sessions where both answers are the same are sessions you did not need to run.',
    },
    {
      heading: 'Where it goes wrong.',
      lead: 'The task leads. "Use the filter to narrow the results" tells them the filter exists and where it is, and the session then proves only that a person can follow an instruction. Say what they are trying to achieve and stop talking.',
      body: 'The second failure is testing with people who already know the product, which measures familiarity rather than design. The third is the debrief in the corridor, where the loudest observation wins and the quiet one is never written down. Agree the read-out format before the first session and fill it in after each one, while it is still specific.',
    },
  ],
}

let n = 0
for (const [slug, sections] of Object.entries(COPY)) {
  const file = join(DIR, `${slug}.md`)
  const raw = readFileSync(file, 'utf8')
  const end = raw.indexOf('\n---', 4)
  let fm = raw.slice(4, end)

  if (/^sections:/m.test(fm)) {
    console.error(`${slug}: already has sections. Revert the file before re-running.`)
    process.exit(1)
  }

  /* Lift the hold, and drop the comments that explained why the page was
     pending. It is not pending any more. */
  fm = fm
    .split('\n')
    .filter((l) => !/^draft: true$/.test(l))
    .filter((l) => !/^#/.test(l.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')

  const yq = (v) => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
  const out = [
    '# The long read below was drafted, not migrated. Framework description,',
    '# not a claim about Roars, but still ours to correct before it is indexed.',
    'needsReview: true',
    'sections:',
  ]
  sections.forEach((s, i) => {
    out.push(`  - label: ${yq(LABELS[i])}`)
    out.push(`    heading: ${yq(s.heading)}`)
    out.push(`    lead: ${yq(s.lead)}`)
    out.push(`    body: ${yq(s.body)}`)
  })

  /* The markdown body is left alone. It is not rendered on the designed page. */
  const oldBody = raw.slice(end + 4).trim()
  writeFileSync(file, `---\n${fm.trim()}\n${out.join('\n')}\n---\n\n${oldBody}\n`)
  n += 1
  console.log(`  ${slug}`)
}
console.log(`\nwrote ${LABELS.length} sections into ${n} guide page(s)`)
console.log('Still on the holding template, no migrated summary to anchor to:')
console.log('  innovation-flowchart, people-connection-map, pitching-checklist,')
console.log('  problem-definition, website-redesign-roi-calculator')
