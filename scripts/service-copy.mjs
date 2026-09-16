#!/usr/bin/env node
/**
 * The S1-S9 copy for the eleven migrated service pages.
 *
 *   node scripts/service-copy.mjs        # writes into src/content/services/*.md
 *
 * WHY A SCRIPT AND NOT ELEVEN MARKDOWN FILES
 *
 * Because the point of the structure is that the pages are NOT interchangeable,
 * and the only way to be sure of that is to read them next to each other. In
 * one file you can see that the failure states are eleven different failures
 * and that no two "what we do not do" lists are the same. Spread across eleven
 * files that check is a chore nobody does. It writes the fields into the
 * content files, which stay the thing Astro reads.
 *
 * WHAT IS REAL AND WHAT IS A DRAFT
 *
 * Real, taken from the Elementor export and src/lib/projects.ts:
 *   the client names, the engagement phase names, the capability lists,
 *   the case study links, and every SEO value.
 *
 * Written here, and correctable: the failure states, the cost of waiting, the
 * phase descriptions, the scope lists, the team roles, the objection answers
 * and the closes. These describe the reader's situation and how Roars works.
 * They are opinions about the work, not claims about results.
 *
 * NOT written, and left as a bracketed placeholder: any number attached to a
 * named client. An invented outcome is a lie about somebody else's business,
 * and it stays a lie when it is labelled a draft. Those read
 * "[ NEEDS THE REAL FIGURE: ... ]" so nobody can mistake one for a result.
 *
 * Every page carries `needsReview: true` while the drafts are in it, which the
 * page template turns into noindex. Take the flag off a page when its copy has
 * been checked, and that page becomes indexable on the next build.
 *
 * House style: no em dashes, no en dashes used as punctuation. Commas, full
 * stops and colons. Short sentences. Nothing that reads like a press release.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/content/services')

/** The marker for a fact only Roars can supply. Greppable. */
const NEED = (what) => `[ NEEDS THE REAL FIGURE: ${what} ]`

const COPY = {
  'mvp-development': {
    frame: {
      h1: 'You have been building for nine months and still cannot tell whether anyone wants it.',
      qualifier:
        'For founders with an idea, a budget and no engineering team yet. Not for rebuilding something that already has paying users, that is product development.',
      proof: { value: 'Community Social', label: 'MVP THAT PUT 40 BUILDINGS ON ONE APP' },
    },
    cost: {
      heading: 'Every month of building blind costs twice.',
      body: 'Once in burn, and once in the features you will throw away because they answered a question nobody asked. The teams that run out of money rarely run out of ideas. They run out of time to find out which idea was right.',
    },
    engagement: {
      heading: 'From idea to something real users can break',
      phases: [
        { n: '01', name: 'Define the idea', duration: 'Week 1', delivers: 'You leave with the one thing the first version has to prove, written down, and the list of everything that is not in it. Most of that list is the useful part.' },
        { n: '02', name: 'Design the flow', duration: 'Weeks 2 to 3', delivers: 'A clickable prototype of the single path a user takes to the value. You can put it in front of people before a line of code exists.' },
        { n: '03', name: 'Build the MVP', duration: 'Weeks 4 to 10', delivers: 'A working product in an app store or on a domain, with analytics wired in, so the answer comes back as data rather than as opinion.' },
        { n: '04', name: 'Read the result', duration: 'Weeks 11 to 12', delivers: 'What real use told you, and a recommendation: keep going, change the model, or stop. We will say stop if that is what the numbers say.' },
      ],
    },
    anchor: {
      client: 'The Community Social',
      situation: 'Residents in forty buildings were ordering daily essentials through a mix of phone calls and building WhatsApp groups.',
      did: [
        'Scoped the first version down to one path: order, track, receive. Nothing else shipped.',
        'Built a single app for residents and building managers instead of two, which halved what had to be maintained while the model was still moving.',
      ],
      outcome: NEED('what changed for them, with a number and a timeframe'),
      href: '/work/community-social-residential-community-app/',
    },
    scope: {
      heading: 'What an MVP engagement includes, and what it does not',
      includes: [
        'Scoping the one thing the first version proves',
        'A clickable prototype before any code',
        'One platform built properly, web or mobile',
        'Analytics and event tracking wired in from day one',
        'Store submission and launch support',
        'A written read of what the first users did',
      ],
      excludes: [
        'A second platform in the same engagement',
        'Brand identity or a logo',
        'Content and copy for a marketing site',
        'Paid acquisition or growth campaigns',
        'Ongoing feature development after launch, that is a separate engagement',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Ten to twelve weeks from kickoff to a product real users can reach.',
      team: [
        { role: 'Product lead', does: 'Runs the scope, and is the person who tells you when something should be cut.' },
        { role: 'Designer', does: 'Owns the flow and the interface, from prototype to shipped screens.' },
        { role: 'Two engineers', does: 'Build it. One of them stays on after launch for the read.' },
      ],
      needs: [
        'One decision maker who can settle scope questions inside a day',
        'An hour a week, same slot, for the whole engagement',
        'Access to five people who have the problem you are solving',
      ],
      pricing: 'Fixed price for a fixed scope, agreed after the first week when the scope is real rather than guessed. If the scope changes we requote the change, not the project. [ NEEDS THE REAL BAND: typical MVP engagement range ]',
    },
    faq: [
      { question: 'We already have a developer. What changes?', answer: 'Usually the scope, not the code. Most stalled MVPs are stalled because the first version is trying to prove four things at once. If your developer is good and the scope is the problem, we will tell you that and you should keep your developer.' },
      { question: 'What if the MVP tells us the idea does not work?', answer: 'Then it did its job for a fraction of what finding out later would have cost. We would rather write that recommendation at week eleven than watch you spend another year on it.' },
      { question: 'Can we add features once it is live?', answer: 'Yes, but not in this engagement. The MVP has a fixed scope so it stays fixed. New features are a new piece of work, priced separately, and by then you have real usage to decide from.' },
      { question: 'Do we own the code?', answer: 'Yes. Repository, accounts and infrastructure are in your name from the first commit, not handed over at the end.' },
      { question: 'Why not just build the full product?', answer: 'Because the full product assumes you already know what users want. If you do, you do not need an MVP and you should talk to us about product development instead.' },
    ],
    next: {
      services: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'When the MVP has proved the model and the next question is how to build the real thing.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'If the idea is validated but people drop out of the flow before they reach the value.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'When the first version has to be native rather than web to be worth testing at all.' },
      ],
      industries: [
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where most first versions live, and where activation is the number that decides everything.' },
        { name: 'Fitness', href: '/industries/on-demand-fitness-app-development/', why: 'A sector where week three retention tells you more than any survey.' },
      ],
    },
    close: {
      heading: 'Send us the one sentence your product has to prove.',
      body: 'We will come back within two working days with what we would put in the first version and, more usefully, what we would leave out. No deck, no discovery fee.',
    },
  },

  'user-experience-design-agency': {
    frame: {
      h1: 'People sign up, look around, and never come back. Nothing is broken.',
      qualifier:
        'For teams with a live product and a drop-off they cannot explain. Not for a first design of something that does not exist yet, that is product design inside an MVP.',
      proof: { value: 'FlowRow', label: 'FITNESS APP WE DESIGNED END TO END' },
    },
    cost: {
      heading: 'A funnel that leaks quietly is the most expensive kind.',
      body: 'Nothing errors, nobody complains, and the number just sits lower than it should. Every month you spend acquiring users into a flow that loses them, you are paying full price for a fraction of the value.',
    },
    engagement: {
      heading: 'Find the drop, fix the drop, prove it moved',
      phases: [
        { n: '01', name: 'Research', duration: 'Weeks 1 to 2', delivers: 'You get the map of where people actually leave, from your own analytics and from watching real users, with the three places worth fixing ranked by what they cost you.' },
        { n: '02', name: 'Wireframe', duration: 'Weeks 3 to 4', delivers: 'The reworked flows as wireframes, with the reasoning for each change written next to it. You can argue with the reasoning before anyone designs a pixel.' },
        { n: '03', name: 'Interface', duration: 'Weeks 5 to 7', delivers: 'Finished screens and the components behind them, handed to your engineers in a form they can build from without asking what a state does.' },
        { n: '04', name: 'Measure', duration: 'Week 8 onward', delivers: 'The events needed to tell whether the change worked, and a read of the first weeks of data once it is live.' },
      ],
    },
    anchor: {
      client: 'FlowRow',
      situation: 'A fitness app where people signed up in good numbers and stopped opening it somewhere in the first fortnight.',
      did: [
        'Traced the drop to the gap between signing up and the first session that felt worth doing.',
        'Rebuilt the opening flow around one session rather than around a profile, a plan and a goal.',
      ],
      outcome: NEED('retention or activation change, with a number and a timeframe'),
      href: '/work/flowrow-fitness-app/',
    },
    scope: {
      heading: 'What a UX engagement includes, and what it does not',
      includes: [
        'Analytics review and user interviews',
        'A ranked list of where the product loses people',
        'Reworked flows as wireframes, with the reasoning',
        'Finished interface design and a component set',
        'Developer handoff with states and edge cases drawn',
        'The event tracking needed to prove it worked',
      ],
      excludes: [
        'Building the design, unless you also engage us to develop',
        'Brand identity, logos or a visual language from scratch',
        'Marketing site design',
        'Ongoing design support on a retainer',
        'Redesigning everything, we work on the parts that cost you money',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Seven to nine weeks, depending on how many flows are in scope.',
      team: [
        { role: 'UX lead', does: 'Runs the research and owns the argument for every change.' },
        { role: 'Interface designer', does: 'Takes the agreed flows to finished screens and a component set.' },
        { role: 'Researcher', does: 'Runs the interviews and the usability sessions, part time across the engagement.' },
      ],
      needs: [
        'Read access to your analytics, on day one rather than week three',
        'Introductions to five current users and, if you can, two who left',
        'One person who can approve a direction without a committee',
      ],
      pricing: 'Priced per engagement against the flows in scope, agreed before we start. Research and design are not billed separately, because splitting them is how you end up with pretty screens nobody validated. [ NEEDS THE REAL BAND: typical UX engagement range ]',
    },
    faq: [
      { question: 'We already have a designer. What changes?', answer: 'We are usually looking at a different question. An in-house designer owns the whole surface; we come in on one flow that is losing money and leave when it is not. If your designer has the time and the analytics access to do that, they should.' },
      { question: 'What if we do not like the first direction?', answer: 'You see the reasoning at wireframe stage, before anything is designed. That is the cheapest point to disagree, and it is the point where disagreeing is most useful.' },
      { question: 'Can you work with our existing dev team?', answer: 'Yes, and it is the common case. Handoff includes states, edge cases and the empty and error screens, which is usually where a handoff falls apart.' },
      { question: 'Do we need to rebuild the whole product?', answer: 'Almost never. Most of the loss is concentrated in one or two places. Finding those is most of the value of the first two weeks.' },
      { question: 'How do we know it worked?', answer: 'Because we agree the number before we start and wire the tracking to measure it. If it did not move, that is a finding too, and we would rather you heard it from us.' },
    ],
    next: {
      services: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'When the design is agreed and you want the same team to build it.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'If there is no product yet and the flow you want to fix does not exist.' },
        { name: 'Innovation design', href: '/s/innovation-design-company/', why: 'When the problem is not the flow but what the product is for.' },
      ],
      industries: [
        { name: 'eCommerce', href: '/industries/retail-ecommerce-development/', why: 'Where the gap between catalogue and checkout is measurable to the pound.' },
        { name: 'Healthcare', href: '/industries/healthcare-app-development-company/', why: 'Where the flow has to work for people who are stressed, rushed, or both.' },
      ],
    },
    close: {
      heading: 'Send us the screen people leave from.',
      body: 'We will come back in two working days with what we think is happening and what we would change first. It takes you about ten minutes to send, and you get a second opinion either way.',
    },
  },

  'mobile-app-development': {
    frame: {
      h1: 'Your app is in the store. Nobody opens it twice.',
      qualifier:
        'For teams that need a native app built properly, or an existing one rescued. Not for a first test of an idea, an MVP will answer that faster and for less.',
      // Was '250+', the retired migration figure. The number of record is
      // site.ts stats.projectsDelivered.
      proof: { value: '4,000+', label: 'PRODUCTS SHIPPED SINCE 2005' },
    },
    cost: {
      heading: 'A shipped app that nobody returns to is a running cost.',
      body: 'Store fees, certificates, SDK updates and an OS release twice a year that breaks something. An app with no second session is not an asset sitting idle. It is a subscription you pay to keep a disappointment available.',
    },
    engagement: {
      heading: 'Built to survive the second week, not just the review',
      phases: [
        { n: '01', name: 'Pre-design', duration: 'Weeks 1 to 2', delivers: 'You get the decisions written down: who it is for, which platform first, what the app does on a bad network, and what it does not do at all.' },
        { n: '02', name: 'Design', duration: 'Weeks 3 to 5', delivers: 'The flows and screens, including the states everyone forgets. Offline, empty, error, and the first run when there is no data yet.' },
        { n: '03', name: 'Development', duration: 'Weeks 6 to 14', delivers: 'A build in your hands every fortnight on a real device, not a video of one. You can use it while it is being made.' },
        { n: '04', name: 'Store and after', duration: 'Weeks 15 to 16', delivers: 'Submission, review responses and the first release. Crash reporting and analytics are live before launch, not after the first bad week.' },
      ],
    },
    anchor: {
      client: 'Snowman Logistics',
      situation: 'Warehouse staff in cold storage were completing compliance checks on paper, in gloves, with no signal.',
      did: [
        'Designed for the actual conditions: large targets, offline capture, and no typing anywhere a tap would do.',
        'Built sync that assumes the network is absent rather than treating it as an error state.',
      ],
      outcome: NEED('what changed on the warehouse floor, with a number and a timeframe'),
      href: '/work/warehouse-compliance-checklist-app/',
    },
    scope: {
      heading: 'What a build includes, and what it does not',
      includes: [
        'One platform built native, or both built cross platform',
        'Design of every state, including offline and error',
        'API work and the backend the app needs',
        'Crash reporting, analytics and release pipeline',
        'Store submission and review responses',
        'A fortnight of support after launch',
      ],
      excludes: [
        'Both native platforms in one engagement at one price',
        'App store optimisation or paid install campaigns',
        'Ongoing feature work, that is a separate agreement',
        'Backend for a business you have not defined yet',
        'Porting an existing app without looking at why it is not working',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Fourteen to eighteen weeks to a released app, depending on platform and backend.',
      team: [
        { role: 'Product lead', does: 'Holds the scope and runs the fortnightly build review with you.' },
        { role: 'Designer', does: 'Flows, screens and the state work that keeps the app usable when things go wrong.' },
        { role: 'Two to three engineers', does: 'Mobile and backend. The same people through to release.' },
      ],
      needs: [
        'Developer accounts in your company name, set up in week one',
        'One decision maker, and an hour a fortnight for the build review',
        'Access to two or three people who will actually use the app',
      ],
      pricing: 'Scoped and fixed after the pre-design phase, when there is enough detail to be honest about. Anything found later is quoted as a change, not absorbed and then argued about. [ NEEDS THE REAL BAND: typical mobile build range ]',
    },
    faq: [
      { question: 'Native or cross platform?', answer: 'Cross platform unless something in your product needs the device in a way it cannot reach. We will tell you which one you are in during pre-design, and the answer is cross platform more often than agencies admit.' },
      { question: 'Can you take over an app somebody else built?', answer: 'Sometimes. We read the code first and give you an honest view. If the answer is that rewriting is cheaper than inheriting, we will say so, including when that is the more expensive quote.' },
      { question: 'Can you work with our existing backend?', answer: 'Yes. If the API is doing something the app cannot live with, we will show you exactly what and let you decide whether to change it.' },
      { question: 'What happens after launch?', answer: 'Two weeks of support is in the price, for the things a real release surfaces. Beyond that it is a separate agreement, and plenty of clients do not need one.' },
      { question: 'Who owns the accounts?', answer: 'You do. Developer accounts, certificates and the repository are in your name from the start. We have seen what happens when they are not.' },
    ],
    next: {
      services: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'If the app is already built and the problem is that people stop using it.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'When the idea has not been tested and a full build is a large bet on a guess.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'When what you need reaches people faster in a browser than in a store.' },
      ],
      industries: [
        { name: 'Logistics', href: '/industries/logistics-transportation-app-development/', why: 'Where the app has to work in gloves, in the cold, with no signal.' },
        { name: 'Restaurant', href: '/industries/food-restaurant-app-development/', why: 'Four surfaces that have to agree with each other in real time.' },
      ],
    },
    close: {
      heading: 'Tell us what your app is for and where it loses people.',
      body: 'Two paragraphs is plenty. We will come back in two working days with whether we would build it, rebuild it, or leave it alone, and why.',
    },
  },

  'product-development-company': {
    frame: {
      h1: 'The product works, the team is busy, and the roadmap has not moved in a quarter.',
      qualifier:
        'For companies with a product in market and a delivery problem. Not for validating a new idea, that is MVP work, and not for a single flow, that is UX.',
      proof: { value: "The President's Club", label: 'MEMBER PRODUCT WE BUILT AND SHIPPED' },
    },
    cost: {
      heading: 'A stalled roadmap is not a delivery problem for long.',
      body: 'It becomes a hiring problem, then a retention problem, then a funding conversation you did not want to have. The cost is rarely the quarter you lost. It is what your competitors shipped during it.',
    },
    engagement: {
      heading: 'Strategy, design and engineering under one roof',
      phases: [
        { n: '01', name: 'Ideation and prototype', duration: 'Weeks 1 to 4', delivers: 'You get the architecture decisions written down and a prototype of the part everyone disagrees about, so the disagreement happens early and cheaply.' },
        { n: '02', name: 'Build and launch', duration: 'Weeks 5 to 20', delivers: 'Working software every fortnight, in an environment you can use. Not a demo, the actual thing, with the tests and the pipeline that keep it shippable.' },
        { n: '03', name: 'Support and hand back', duration: 'Ongoing or fixed', delivers: 'Either we keep running it, or we hand it to your team with the documentation and the pairing time to make that real rather than nominal.' },
      ],
    },
    anchor: {
      client: "The President's Club",
      situation: 'A members organisation running its community, events and benefits across separate tools that did not know about each other.',
      did: [
        'Put membership, events and benefits behind one model instead of three, so a member is one record everywhere.',
        'Built it so the operations team could change what members see without asking an engineer.',
      ],
      outcome: NEED('what changed for their team or their members, with a number and a timeframe'),
      href: '/work/the-presidents-club/',
    },
    scope: {
      heading: 'What a product engagement includes, and what it does not',
      includes: [
        'Product strategy and the architecture decisions behind it',
        'Design, from flows to a component set',
        'Engineering, front end, back end and infrastructure',
        'Test coverage and a release pipeline that your team can run',
        'Documentation written for the people who inherit it',
        'A defined handover, or an ongoing arrangement if you want one',
      ],
      excludes: [
        'Taking over a codebase without reading it first',
        'Brand, marketing or content production',
        'Staff augmentation, we work as a team or not at all',
        'Working to a roadmap we are not allowed to question',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Twenty weeks and up. Shorter than that is usually an MVP or a UX engagement in disguise.',
      team: [
        { role: 'Product lead', does: 'Owns delivery and is the person you escalate to. One name, not a rota.' },
        { role: 'Designer', does: 'Flows, interface and the component set the engineers build against.' },
        { role: 'Three to five engineers', does: 'Front end, back end and infrastructure, sized to the work rather than to the invoice.' },
      ],
      needs: [
        'One decision maker with authority over scope and budget',
        'A weekly hour, and a fortnightly review with whoever owns the roadmap',
        'Access to your production analytics and to your support queue',
      ],
      pricing: 'Monthly, against a team shape agreed up front, with a scope we revisit every quarter rather than pretending a year is knowable. [ NEEDS THE REAL MODEL: monthly band or day rate ]',
    },
    faq: [
      { question: 'Can you work alongside our engineers?', answer: 'Yes, and it works best when the split is by area rather than by ticket. Two teams sharing one backlog is how both end up slower.' },
      { question: 'What if we want to bring it in house later?', answer: 'That is the normal ending and we plan for it. Documentation and pairing time are in the engagement, not sold back to you at the end.' },
      { question: 'Do you take over an existing codebase?', answer: 'After we have read it. You get an honest assessment first, including the case for not doing it.' },
      { question: 'How do you handle scope changes?', answer: 'We requote the change and you decide. We do not absorb it quietly and then use it to explain a missed date.' },
      { question: 'What if the roadmap is the problem?', answer: 'Then we will say so in the first month. Building the wrong thing well is the most expensive outcome available, and it is not one we will be quiet about.' },
    ],
    next: {
      services: [
        { name: 'MVP development', href: '/s/mvp-development/', why: 'If the next thing on the roadmap has not been validated with anyone yet.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'When the delivery problem is the release process rather than the code.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'When the product ships fine and the usage numbers still do not move.' },
      ],
      industries: [
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where onboarding and activation decide whether the rest of the product matters.' },
        { name: 'Concierge', href: '/industries/concierge-app-development/', why: 'Requests, members and loyalty held in one model rather than three tools.' },
      ],
    },
    close: {
      heading: 'Tell us what has not shipped this quarter, and why.',
      body: 'One paragraph. We will come back in two working days with where we think the blockage is. Often it is not where people expect, and you keep that read whether or not you engage us.',
    },
  },

  'web-app-development': {
    frame: {
      h1: 'Your team runs the business out of a spreadsheet nobody is allowed to touch.',
      qualifier:
        'For companies whose operations have outgrown the tools holding them. Not for a marketing site, and not for a mobile-first product, both of those are somebody else on this list.',
      proof: { value: 'Blelp', label: 'WEB PLATFORM WE DESIGNED AND BUILT' },
    },
    cost: {
      heading: 'The spreadsheet is not free. It is just billed elsewhere.',
      body: 'It is billed in the hours spent reconciling versions, in the one person who understands the formulas, and in the decisions made on numbers that were right last Tuesday. Nobody puts that on a budget line, which is why it survives so long.',
    },
    engagement: {
      heading: 'From the workaround to the system',
      phases: [
        { n: '01', name: 'Product strategy', duration: 'Weeks 1 to 3', delivers: 'You get the workflow as it actually runs, including the parts people do not admit to, and the decision about what the system takes over first.' },
        { n: '02', name: 'Product design', duration: 'Weeks 4 to 7', delivers: 'Screens and flows for the people who will use this all day. Designed for the fiftieth time they do a task, not the first.' },
        { n: '03', name: 'Build', duration: 'Weeks 8 to 18', delivers: 'Working software in a staging environment every fortnight, with your data in it, so the feedback comes from use rather than from imagination.' },
        { n: '04', name: 'Quality and cutover', duration: 'Weeks 19 to 20', delivers: 'Test coverage, a migration of the real data, and a switchover plan that does not require a weekend nobody agreed to.' },
      ],
    },
    anchor: {
      client: 'Blelp',
      situation: 'A platform whose operations were spread across tools that each held part of the truth.',
      did: [
        'Modelled the workflow once, properly, instead of building screens on top of the existing split.',
        'Built the integrations so the surrounding tools feed one system rather than compete with it.',
      ],
      outcome: NEED('time saved or error rate change, with a number and a timeframe'),
      href: '/work/blelp/',
    },
    scope: {
      heading: 'What a web app engagement includes, and what it does not',
      includes: [
        'Mapping the workflow as it actually runs',
        'Interface design for daily, repeated use',
        'Front end, back end, database and hosting',
        'Third party integrations and API work',
        'Migration of your existing data',
        'Test coverage and a cutover plan',
      ],
      excludes: [
        'A marketing website or a landing page',
        'Native mobile apps in the same engagement',
        'Data cleaning, we migrate what you have as it is',
        'Licences and third party subscriptions, those stay yours',
        'Training your whole organisation, we train the people who train them',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Eighteen to twenty-two weeks from kickoff to cutover.',
      team: [
        { role: 'Product lead', does: 'Maps the workflow, holds the scope, runs the fortnightly review.' },
        { role: 'Designer', does: 'Interface for repeated daily use, and the states that come with real data.' },
        { role: 'Two to four engineers', does: 'Application, integrations and the migration.' },
      ],
      needs: [
        'Two hours with the people who do the work today, not only with their manager',
        'A copy of the real data early, however untidy it is',
        'One decision maker for scope, and one for the cutover date',
      ],
      pricing: 'Fixed against the scope agreed at the end of strategy, with integrations priced separately because their cost sits with the other system rather than with ours. [ NEEDS THE REAL BAND: typical web app engagement range ]',
    },
    faq: [
      { question: 'Can it talk to the systems we already have?', answer: 'Usually. What decides it is what their API allows, not what we are willing to build, and we will find that out in strategy rather than in month four.' },
      { question: 'What happens to our existing data?', answer: 'It comes across. We migrate what exists rather than asking you to tidy it first, because the tidying never happens and the project waits for it.' },
      { question: 'Can our team maintain it afterwards?', answer: 'Yes, and that is the intended ending. Standard framework, documented, with pairing time in the engagement rather than sold afterwards.' },
      { question: 'Do we have to switch everything at once?', answer: 'No, and you usually should not. The cutover plan normally runs the old and the new side by side until the new one has earned the trust.' },
      { question: 'Why not buy something off the shelf?', answer: 'Often you should, and we will say so. It is worth building when the workflow is the thing you are actually good at, and that is a smaller set of cases than software companies suggest.' },
    ],
    next: {
      services: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'When what you need is a product to sell rather than a system to run on.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'If the application is fine and getting it released is the slow part.' },
        { name: 'eCommerce development', href: '/s/ecommerce-development-company/', why: 'When the workflow you are replacing is selling rather than operating.' },
      ],
      industries: [
        { name: 'Logistics', href: '/industries/logistics-transportation-app-development/', why: 'Where the spreadsheet is usually a compliance record, and that raises the stakes.' },
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where the internal tool and the product tend to be the same codebase.' },
      ],
    },
    close: {
      heading: 'Send us the spreadsheet.',
      body: 'Genuinely. It tells us more in five minutes than a requirements document does in a week. We will come back in two working days with what we would build first and what we would leave in the spreadsheet.',
    },
  },

  'digital-business-transformation-services': {
    frame: {
      h1: 'Six tools hold the truth about one customer, and none of them agree.',
      qualifier:
        'For companies whose operations have outgrown the software running them. Not for teams looking to add a feature, that is product development.',
      proof: { value: 'Tanishq', label: 'DATA PLATFORM WE BUILT FOR ONE OF INDIA’S LARGEST RETAILERS' },
    },
    cost: {
      heading: 'Nobody budgets for the reconciliation.',
      body: 'It comes out of people instead. The hours spent working out which system is right, the reports built twice because two teams did not trust the same number, and the decisions taken late because somebody was still checking. That cost grows with you, quietly.',
    },
    engagement: {
      heading: 'Work out what is really happening, then change it',
      phases: [
        { n: '01', name: 'Analyse and conduct', duration: 'Weeks 1 to 3', delivers: 'You get a map of how work actually moves through your business, including the workarounds people have stopped mentioning. Most of the value is in that second part.' },
        { n: '02', name: 'Evaluate and understand', duration: 'Weeks 4 to 5', delivers: 'The short list of changes worth making, ranked by what they are costing you now rather than by how modern they sound.' },
        { n: '03', name: 'Roadmap and transition', duration: 'Weeks 6 to 8', delivers: 'A sequenced plan with the first change already underway, so you are looking at something running rather than at a document about running it.' },
      ],
    },
    anchor: {
      client: 'Tanishq',
      situation: 'A retailer with more data about its customers than any one team could see at once.',
      did: [
        'Brought the sources into one model so a customer is one customer, not one per system.',
        'Built the analytics for the people making the decisions rather than for the people maintaining the warehouse.',
      ],
      outcome: NEED('what changed for their decision making, with a number and a timeframe'),
      href: '/work/tanishq-data-analytics/',
    },
    scope: {
      heading: 'What a transformation engagement includes, and what it does not',
      includes: [
        'Mapping how work moves today, including the workarounds',
        'A ranked list of changes with what each one is costing now',
        'A sequenced roadmap with the first change started',
        'Integration work between the systems you keep',
        'Data modelling and migration',
        'Training for the people who will run it',
      ],
      excludes: [
        'Replacing every system in one programme',
        'Licence negotiation with your vendors',
        'Change management across the whole organisation',
        'A strategy document with no build attached',
        'Recommending a platform we resell, we do not resell any',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Eight weeks to the roadmap and the first change. Delivery after that depends on what the roadmap says.',
      team: [
        { role: 'Lead consultant', does: 'Runs the mapping and writes the recommendation. Not a salesperson with a template.' },
        { role: 'Data engineer', does: 'Models what you have and builds the integrations between the systems you keep.' },
        { role: 'Product lead', does: 'Turns the roadmap into something that ships rather than something that circulates.' },
      ],
      needs: [
        'Two hours with each team whose work is in scope',
        'Read access to the systems in question, early',
        'A sponsor senior enough to change a process, not only to approve a document',
      ],
      pricing: 'The eight week assessment is fixed price. Delivery afterwards is quoted against the roadmap, and you are free to take the roadmap elsewhere. [ NEEDS THE REAL BAND: assessment fee and delivery model ]',
    },
    faq: [
      { question: 'Do we have to replace everything?', answer: 'Almost never, and a proposal that says you do is usually selling a platform. Most of the gain comes from making four systems agree rather than from replacing all four.' },
      { question: 'What if the roadmap says do nothing?', answer: 'Then that is what it says. It has happened. You will have paid for eight weeks instead of eighteen months.' },
      { question: 'Can we take the roadmap and build it ourselves?', answer: 'Yes. It is written to be handed to a team, including one that is not us.' },
      { question: 'Who owns the data model?', answer: 'You do, along with the integrations and the documentation. Nothing is held back as leverage for the next phase.' },
      { question: 'How is this different from hiring a consultancy?', answer: 'We build. The people who write the recommendation are the people who deliver the first change, which tends to keep recommendations realistic.' },
    ],
    next: {
      services: [
        { name: 'Web app development', href: '/s/web-app-development/', why: 'When the answer is one system replacing the spreadsheets rather than a programme.' },
        { name: 'AI automation', href: '/s/ai-automation-services/', why: 'When the work being reconciled is routine enough for a system to own it.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'If the blockage is in releasing changes rather than in deciding them.' },
      ],
      industries: [
        { name: 'Logistics', href: '/industries/logistics-transportation-app-development/', why: 'Where the reconciliation is a compliance record and getting it wrong is expensive.' },
        { name: 'eCommerce', href: '/industries/retail-ecommerce-development/', why: 'Where catalogue, stock and orders each hold part of the same truth.' },
      ],
    },
    close: {
      heading: 'Name the number two teams argue about.',
      body: 'That argument is usually where the work is. Tell us what it is and we will come back in two working days with where we think the disagreement actually comes from.',
    },
  },

  'ecommerce-development-company': {
    frame: {
      h1: 'Traffic is up, the basket is full, and the order never arrives.',
      qualifier:
        'For retailers with real volume and a checkout that leaks. Not for a first shop on a hosted platform, you do not need an agency for that yet.',
      proof: { value: 'Since 2005', label: 'BUILDING COMMERCE BEFORE THE PLATFORMS EXISTED' },
    },
    cost: {
      heading: 'Checkout abandonment is the only metric that bills you twice.',
      body: 'You paid to bring them in and you paid to hold the stock. A shop that converts a point lower than it should is not losing sales in the abstract. It is losing them after every other cost has already been spent.',
    },
    engagement: {
      heading: 'Catalogue, checkout, and the gap between them',
      phases: [
        { n: '01', name: 'Planning', duration: 'Weeks 1 to 3', delivers: 'Where the drop-off actually is, from your own data, plus the decision about platform: keep it, extend it, or leave it. We will say keep it when keeping it is right.' },
        { n: '02', name: 'Implementation', duration: 'Weeks 4 to 14', delivers: 'The storefront, the integrations and the checkout, built and running on your real catalogue rather than on sample products.' },
        { n: '03', name: 'Support', duration: 'First eight weeks live', delivers: 'Someone watching the first peak with you, because the first peak is when you find out what the load test did not.' },
      ],
    },
    scope: {
      heading: 'What an eCommerce engagement includes, and what it does not',
      includes: [
        'Analytics review of where orders are lost',
        'Storefront design and build',
        'Payment, tax and shipping integration',
        'Catalogue, stock and order sync with your systems',
        'Performance work for peak traffic',
        'Eight weeks of support after going live',
      ],
      excludes: [
        'Product photography and catalogue copy',
        'Paid search, social or email marketing',
        'Warehouse and fulfilment operations',
        'Customer service tooling',
        'Marketplace listings on Amazon and the rest',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Fourteen to sixteen weeks to live, plus eight weeks of support.',
      team: [
        { role: 'Product lead', does: 'Owns the scope and the launch plan, including what happens if the date slips.' },
        { role: 'Designer', does: 'Catalogue, product page and checkout, designed against your real products.' },
        { role: 'Two to three engineers', does: 'Storefront, integrations and the performance work.' },
      ],
      needs: [
        'A real catalogue export in week one, not a sample',
        'Access to your payment and shipping accounts',
        'Whoever owns stock, so the integration is agreed rather than assumed',
      ],
      pricing: 'Fixed against the scope after planning. Integrations are priced separately, because their cost belongs to the other system rather than to ours. [ NEEDS THE REAL BAND: typical eCommerce build range ]',
    },
    faq: [
      { question: 'Do we have to leave our current platform?', answer: 'Usually not. Most of what looks like a platform problem is a checkout problem, and we will tell you which one you have in planning rather than after a migration.' },
      { question: 'Can you work with our existing stock system?', answer: 'Yes, and we would rather. Replacing a stock system during a storefront build is two risks stacked on one launch date.' },
      { question: 'What about the peak?', answer: 'It is in the plan. We do not launch a shop in the four weeks before its biggest trading period, and we will push back if that is the date on the table.' },
      { question: 'Who owns the storefront afterwards?', answer: 'You do. Standard stack, documented, and buildable by another team.' },
      { question: 'Can you improve what we have instead of rebuilding?', answer: 'Often, yes. It is the cheaper answer and it is the one we recommend more than half the time.' },
    ],
    next: {
      services: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'When the shop works and the checkout still loses people.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'For the operations behind the shop rather than the shop itself.' },
        { name: 'Growth hacking', href: '/s/growth-hacking-agency/', why: 'Once conversion is fixed and the question becomes how to bring more people in.' },
      ],
      industries: [
        { name: 'eCommerce', href: '/industries/retail-ecommerce-development/', why: 'The sector page, with the work and the constraints in one place.' },
        { name: 'Restaurant', href: '/industries/food-restaurant-app-development/', why: 'Where ordering is commerce with a kitchen attached and a much shorter clock.' },
      ],
    },
    close: {
      heading: 'Send us your checkout funnel for the last month.',
      body: 'A screenshot of the drop-off is enough. We will come back in two working days with where we think it is going and whether it is worth a rebuild or a fortnight of fixes.',
    },
  },

  'growth-hacking-agency': {
    frame: {
      h1: 'You are spending on acquisition and cannot say which pound worked.',
      qualifier:
        'For teams with a product people already buy and a growth number that will not move. Not for launching something with no users yet, growth tactics on an unvalidated product just burn the budget faster.',
      proof: { value: 'Test first', label: 'NOTHING SCALES UNTIL IT HAS BEATEN THE CONTROL' },
    },
    cost: {
      heading: 'Unattributed spend is not marketing. It is a subscription to hope.',
      body: 'Every month you cannot trace revenue back to a channel, you renew the same budget on the same guesses. The waste is not the campaign that failed. It is the one that worked and got cut because nobody could prove it.',
    },
    engagement: {
      heading: 'Small bets, measured, then scaled',
      phases: [
        { n: '01', name: 'Ideate and prioritise', duration: 'Weeks 1 to 2', delivers: 'A ranked backlog of experiments, scored on expected effect and how long each takes to read. You can see why the top one is the top one.' },
        { n: '02', name: 'Test and analyse', duration: 'Weeks 3 to 8', delivers: 'Experiments running on a fixed cadence, each with its result written down, including the ones that did nothing. Those are the ones agencies usually leave out.' },
        { n: '03', name: 'Implement the winners', duration: 'Weeks 9 to 12', delivers: 'The changes that beat the control, built properly rather than left as a hack, and the tracking that keeps proving they still work.' },
      ],
    },
    scope: {
      heading: 'What a growth engagement includes, and what it does not',
      includes: [
        'Analytics and attribution audit',
        'A prioritised experiment backlog',
        'Running the experiments and reading them honestly',
        'Landing pages and funnel changes needed to test',
        'Building the winners into the product properly',
        'A written record of everything that did not work',
      ],
      excludes: [
        'Managing your ad accounts on an ongoing retainer',
        'Brand campaigns and creative production',
        'Content marketing at volume',
        'Guaranteed rankings or guaranteed growth numbers',
        'Anything that only works until a platform notices',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Twelve weeks. Shorter than that and there is not enough time to read a result.',
      team: [
        { role: 'Growth lead', does: 'Owns the backlog and the read on every experiment, including the negative ones.' },
        { role: 'Designer', does: 'Landing pages and funnel changes, fast enough to keep the cadence.' },
        { role: 'Engineer', does: 'Tracking, experiment plumbing and building the winners into the product.' },
      ],
      needs: [
        'Admin access to analytics and ad accounts in week one',
        'Permission to change the funnel without a two week approval loop',
        'An hour a week to review results and kill the losers',
      ],
      pricing: 'Monthly for the engagement, with ad spend separate and paid by you directly. We do not take a percentage of media, because that pays us to spend more rather than to spend well. [ NEEDS THE REAL BAND: monthly engagement fee ]',
    },
    faq: [
      { question: 'Can you guarantee growth?', answer: 'No, and anyone who does is describing a sales process rather than a method. What we can promise is that you will know which things worked and which did not.' },
      { question: 'Do you manage our ad spend?', answer: 'During the engagement, for the experiments. We do not want to be your permanent media buyer, and we do not take a cut of spend.' },
      { question: 'What if none of the experiments work?', answer: 'Then the problem is upstream of marketing, usually in the product or the offer, and we will say so. That answer is worth more than another quarter of tactics.' },
      { question: 'How is this different from an SEO agency?', answer: 'Scope. SEO is one channel. This starts from which channel is worth your money at all, and sometimes the answer is the one you already have.' },
      { question: 'Who owns the accounts and data?', answer: 'You do, throughout. We work inside your accounts rather than behind our own dashboard.' },
    ],
    next: {
      services: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'When the experiments keep pointing at the same broken step in the product.' },
        { name: 'eCommerce development', href: '/s/ecommerce-development-company/', why: 'If the conversion problem is the checkout rather than the traffic.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'When growth is flat because the thing being sold has not been validated.' },
      ],
      industries: [
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where activation, not acquisition, is usually the number that is stuck.' },
        { name: 'eCommerce', href: '/industries/retail-ecommerce-development/', why: 'Where every experiment has a revenue figure attached to it within days.' },
      ],
    },
    close: {
      heading: 'Tell us the growth number that has not moved in two quarters.',
      body: 'And what you have already tried. We will come back in two working days with the three experiments we would run first and what each one would tell you.',
    },
  },

  'hire-dedicated-developers': {
    frame: {
      h1: 'You have the roadmap and the budget. You are four months from having the team.',
      qualifier:
        'For teams that know what to build and need capacity to build it. Not for teams that want someone to decide what to build, that is product development.',
      proof: { value: 'The Club Social', label: 'BUILT BY A DEDICATED TEAM, STILL RUNNING' },
    },
    cost: {
      heading: 'Four months of hiring is four months of not shipping.',
      body: 'Plus agency fees, the offers that fall through, and the ramp-up after they start. The roadmap does not pause while you recruit. It just gets longer, and the reason it slipped stops being visible to anyone above you.',
    },
    engagement: {
      heading: 'People who join your team, not a ticket queue',
      phases: [
        { n: '01', name: 'Enquiry and analysis', duration: 'Week 1', delivers: 'An honest read on what you actually need. Sometimes it is two people rather than five, and we will say so before you have signed anything.' },
        { n: '02', name: 'Wireframe and design', duration: 'Weeks 2 to 3', delivers: 'If the work needs design, it gets design. Handing engineers an undefined brief is how augmentation ends up slower than hiring.' },
        { n: '03', name: 'Development and delivery', duration: 'Ongoing', delivers: 'The same named people in your stand-ups, working your board, with code reviewed against your standards rather than ours.' },
      ],
    },
    anchor: {
      client: 'The Club Social',
      situation: 'A club that needed amenities, restaurant ordering and membership in one app for its members.',
      did: [
        'Put a dedicated team on it rather than passing it between whoever was free.',
        'Built one app for members and for the club, so the two sides could not drift apart.',
      ],
      outcome: NEED('what changed for the club or its members, with a number and a timeframe'),
      href: '/work/club-social/',
    },
    scope: {
      heading: 'What a dedicated team includes, and what it does not',
      includes: [
        'Named people, full time, on your board and in your stand-ups',
        'Code reviewed against your standards',
        'Design capacity when the work needs it',
        'A minimum three month commitment, both ways',
        'Direct contact with the engineers, not through an account manager',
        'Notice periods that are the same in both directions',
      ],
      excludes: [
        'Deciding your roadmap, that is your job or a different engagement',
        'Paying for someone to sit idle while you decide',
        'Swapping people out without telling you',
        'Hourly billing against a ticket queue',
        'Anyone who has not worked with the rest of the team before',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Three month minimum, monthly after that, thirty days notice either way.',
      team: [
        { role: 'Engineers', does: 'Two to six, sized to the work. Named people, and you meet them before you commit.' },
        { role: 'Designer', does: 'Part time or full time, only when the work needs one.' },
        { role: 'Delivery lead', does: 'Included, not billed. There so you have one person to talk to when something is wrong.' },
      ],
      needs: [
        'A backlog that is ready enough to start on in week one',
        'Someone on your side who can answer a question the same day',
        'Access to your repository, environments and standards documentation',
      ],
      pricing: 'Monthly per person, all in. No recruitment fee, no charge for the delivery lead, no markup on tools. [ NEEDS THE REAL BAND: monthly rate per engineer ]',
    },
    faq: [
      { question: 'Can we interview them first?', answer: 'Yes, and you should. If you would not hire the person, we should not be putting them on your team.' },
      { question: 'What if it is not working?', answer: 'Thirty days notice, both ways, from month three. A contract that traps you is a contract that stops us having to be good.' },
      { question: 'Do they work our hours?', answer: 'There is a four hour overlap with your working day as standard, and more if the work needs it. Say what you need before you sign, not after.' },
      { question: 'Who owns the code?', answer: 'You do, from the first commit, in your repository.' },
      { question: 'Can we hire them permanently?', answer: 'After twelve months, with no fee. Before that we will talk about it. People are not a lock-in mechanism.' },
    ],
    next: {
      services: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'When you want the team to own outcomes rather than tickets.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'If more engineers will not help because releasing is the bottleneck.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'When the capacity you are missing is specifically mobile.' },
      ],
      industries: [
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where roadmaps outgrow teams faster than anywhere else.' },
        { name: 'Concierge', href: '/industries/concierge-app-development/', why: 'Member products where the surface keeps growing after launch.' },
      ],
    },
    close: {
      heading: 'Send us your backlog, or the part of it you can share.',
      body: 'We will come back in two working days with what shape of team we think it needs, including when the answer is fewer people than you asked for.',
    },
  },

  'innovation-design-company': {
    frame: {
      h1: 'Everyone in the room agrees it is a good idea. Nobody can say who it is for.',
      qualifier:
        'For teams with an ambition and no shape for it yet. Not for teams who know exactly what to build and want it built, that is product development.',
      proof: { value: 'GymBait.AI', label: 'A PRODUCT THAT STARTED AS A QUESTION ABOUT COACHING' },
    },
    cost: {
      heading: 'An idea with no shape absorbs budget without ever being wrong.',
      body: 'It survives every review because there is nothing specific enough to argue with. Meanwhile the team builds around it, the roadmap bends to it, and the first real test happens after the money is spent.',
    },
    engagement: {
      heading: 'Make it specific enough to be wrong',
      phases: [
        { n: '01', name: 'Research', duration: 'Weeks 1 to 2', delivers: 'What the people you are building for actually do today, and where the friction is. Usually not where the room assumed.' },
        { n: '02', name: 'Ideation', duration: 'Weeks 3 to 4', delivers: 'Three directions, different enough to argue about, each with the reason it might fail written next to it.' },
        { n: '03', name: 'Prototyping', duration: 'Weeks 5 to 7', delivers: 'The chosen direction as something people can use and react to, plus what happened when they did.' },
      ],
    },
    anchor: {
      client: 'GymBait.AI',
      situation: 'A fitness business asking whether coaching could reach members at the moment it mattered rather than at their next session.',
      did: [
        'Turned the ambition into one testable thing: a nudge that learns from how a member actually trains.',
        'Built it as a product with a human in the loop rather than as a model with an interface on top.',
      ],
      outcome: NEED('what the prototype proved, with a number and a timeframe'),
      href: '/work/gymbait/',
    },
    scope: {
      heading: 'What an innovation engagement includes, and what it does not',
      includes: [
        'Research with the people you are designing for',
        'Three distinct directions, with the risks named',
        'A working prototype of the chosen one',
        'Testing it with real users and reporting what happened',
        'A recommendation, including the option to stop',
        'Everything documented so another team could pick it up',
      ],
      excludes: [
        'Building the production product, that is a separate engagement',
        'Brand identity or naming',
        'A workshop with no prototype at the end of it',
        'Market sizing and investment decks',
        'Telling you your idea is good, when it is not',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Seven weeks from kickoff to a tested prototype and a recommendation.',
      team: [
        { role: 'Design lead', does: 'Runs the research and owns the argument for each direction.' },
        { role: 'Product designer', does: 'Takes the chosen direction to something people can actually use.' },
        { role: 'Engineer', does: 'Part time, building the prototype so it survives contact with real users.' },
      ],
      needs: [
        'Access to eight people from the group you are designing for',
        'A decision maker in the room at the end of week four',
        'Willingness to hear that one of the three directions is the answer and it is not the one you brought',
      ],
      pricing: 'Fixed price for the seven weeks, agreed before we start. What happens afterwards is a separate conversation and a separate quote. [ NEEDS THE REAL BAND: innovation engagement fee ]',
    },
    faq: [
      { question: 'What if we already know what we want to build?', answer: 'Then this is the wrong engagement and product development is the right one. We will tell you that on the first call rather than sell you a discovery you do not need.' },
      { question: 'What if we do not like any of the three directions?', answer: 'That happens, and it is still a result. It usually means the research found a different problem than the one the brief described, which is worth knowing at week four.' },
      { question: 'Is this just a workshop?', answer: 'No. A workshop produces alignment; this produces a prototype that real users have used and a record of what they did with it.' },
      { question: 'Can you build it afterwards?', answer: 'Yes, and often we do. It is not a condition, and the documentation is written so somebody else could.' },
      { question: 'How do we know it worked?', answer: 'You have something specific enough to be rejected, and evidence about whether it was. That is a better position than a good idea everyone agrees with.' },
    ],
    next: {
      services: [
        { name: 'MVP development', href: '/s/mvp-development/', why: 'When the prototype worked and the next step is something real users can pay for.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'When the direction is settled and it needs building properly.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'If the product exists and the problem is the experience rather than the idea.' },
      ],
      industries: [
        { name: 'Fitness', href: '/industries/on-demand-fitness-app-development/', why: 'Where coaching, streaks and week three attention make or break a product.' },
        { name: 'Concierge', href: '/industries/concierge-app-development/', why: 'Where the idea is usually about service, and service is hard to prototype.' },
      ],
    },
    close: {
      heading: 'Tell us the idea in two sentences, and who it is for in one.',
      body: 'If the third sentence is hard to write, that is the thing worth working on. We will come back in two working days with what we would test first.',
    },
  },

  'result-oriented-devops-services': {
    frame: {
      h1: 'The code was finished on Tuesday. It goes live a week on Thursday, if nothing breaks.',
      qualifier:
        'For teams whose software is good and whose release process is not. Not for teams without a product in production yet, there is nothing to release.',
      proof: { value: 'GISAID', label: 'PLATFORM SERVING THE WORLD’S LARGEST COVID DATA SET' },
    },
    cost: {
      heading: 'A slow release is a tax on everything your team does.',
      body: 'It makes every change bigger, because batching is the only way to make the cost worth paying. Bigger changes fail more often, which makes people more careful, which makes releases slower. That loop tightens on its own.',
    },
    engagement: {
      heading: 'From a release event to a release routine',
      phases: [
        { n: '01', name: 'Assessment and strategy', duration: 'Weeks 1 to 2', delivers: 'How long a change actually takes to reach users today, measured rather than estimated, and the three things making it slow.' },
        { n: '02', name: 'Pilot framework', duration: 'Weeks 3 to 6', delivers: 'One service moved onto the new pipeline, all the way to production, so the approach is proven on something real before it is applied everywhere.' },
        { n: '03', name: 'End to end rollout', duration: 'Weeks 7 to 14', delivers: 'The rest brought across, with monitoring and rollback in place, and your engineers running it rather than watching us run it.' },
      ],
    },
    anchor: {
      client: 'GISAID',
      situation: 'A platform holding one of the largest COVID data sets in the world, where availability was not negotiable.',
      did: [
        'Built the tooling for a scale where a bad deploy is a public problem rather than an internal one.',
        'Automated the paths that had been manual, so releasing stopped depending on who was awake.',
      ],
      outcome: NEED('deploy frequency or downtime change, with a number and a timeframe'),
      href: '/work/gisaid-health-tech/',
    },
    scope: {
      heading: 'What a DevOps engagement includes, and what it does not',
      includes: [
        'Measuring how long a change takes to reach production today',
        'Build, test and deployment pipelines',
        'Infrastructure as code for the environments you keep',
        'Monitoring, alerting and a rollback that has been tested',
        'A pilot on one real service before anything is rolled out',
        'Handover so your team runs it without us',
      ],
      excludes: [
        'Running your infrastructure permanently as a managed service',
        'Rewriting your application to fit a platform',
        'Choosing a cloud provider for commercial reasons rather than technical ones',
        'On-call cover for your product',
        'Security certification and audit work',
      ],
    },
    shape: {
      heading: 'What you are signing up to',
      duration: 'Fourteen weeks, with the pilot proving the approach by week six.',
      team: [
        { role: 'DevOps lead', does: 'Measures what you have now and owns the plan for changing it.' },
        { role: 'Platform engineer', does: 'Builds the pipelines and the infrastructure code.' },
        { role: 'Your engineers', does: 'Involved from the pilot, because a pipeline nobody on your side understands is a new dependency rather than a fix.' },
      ],
      needs: [
        'Access to your cloud accounts and repositories in week one',
        'One engineer from your side who can spend half their week on it',
        'Permission to change the release process, not only to document it',
      ],
      pricing: 'Fixed for the assessment, then quoted against the rollout once the pilot has shown what it involves. [ NEEDS THE REAL BAND: assessment fee and rollout model ]',
    },
    faq: [
      { question: 'Do we have to change cloud provider?', answer: 'No. Most of the delay is in the pipeline and the process, not in whose data centre it runs in. We will say if that is genuinely the problem, and it rarely is.' },
      { question: 'Will our team be able to run this?', answer: 'That is the point, and it is why one of your engineers is on the pilot. If the answer at the end is that only we understand it, we have failed.' },
      { question: 'Do you take over our on-call?', answer: 'No. We build the monitoring and the runbooks so your on-call is survivable, but the rota stays yours.' },
      { question: 'What if the pilot does not work?', answer: 'Then you stop after six weeks having spent six weeks. That is the reason the pilot comes before the rollout.' },
      { question: 'How do you measure success?', answer: 'The time from a merged change to it being live, and how often a release has to be rolled back. Both measured before we start, so the comparison is real.' },
    ],
    next: {
      services: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'When shipping faster only helps if there is more being built.' },
        { name: 'Hire dedicated developers', href: '/s/hire-dedicated-developers/', why: 'If the pipeline is fine and the constraint is simply capacity.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'When the thing being released badly should probably be rebuilt.' },
      ],
      industries: [
        { name: 'SaaS', href: '/industries/saas-application-development-services/', why: 'Where release cadence is the difference between a roadmap and a backlog.' },
        { name: 'Healthcare', href: '/industries/healthcare-app-development-company/', why: 'Where a rollback plan is a compliance requirement rather than a nicety.' },
      ],
    },
    close: {
      heading: 'Tell us how long your last change took to reach users.',
      body: 'From merged to live, honestly. We will come back in two working days with where we think the time goes and which part we would fix first.',
    },
  },
}

export { COPY, NEED }

/* ------------------------------------------------------------------ write */

const yq = (v) => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
const lines = []
const push = (n, t) => lines.push(' '.repeat(n) + t)

function render(slug, c) {
  lines.length = 0
  push(0, 'frame:')
  push(2, `h1: ${yq(c.frame.h1)}`)
  push(2, `qualifier: ${yq(c.frame.qualifier)}`)
  if (c.frame.proof) {
    push(2, 'proof:')
    push(4, `value: ${yq(c.frame.proof.value)}`)
    push(4, `label: ${yq(c.frame.proof.label)}`)
  }
  push(0, 'cost:')
  push(2, 'label: "THE COST OF WAITING"')
  push(2, `heading: ${yq(c.cost.heading)}`)
  push(2, `body: ${yq(c.cost.body)}`)
  push(0, 'engagement:')
  push(2, 'label: "HOW IT RUNS"')
  push(2, `heading: ${yq(c.engagement.heading)}`)
  push(2, 'phases:')
  for (const ph of c.engagement.phases) {
    push(4, `- n: ${yq(ph.n)}`)
    push(6, `name: ${yq(ph.name)}`)
    push(6, `duration: ${yq(ph.duration)}`)
    push(6, `delivers: ${yq(ph.delivers)}`)
  }
  /* Two services have no case study on the live site to point at, so they
     carry no anchor rather than borrowing somebody else's project. They earn
     their place on the page by the constraint in S1 and S2 instead. */
  if (c.anchor) {
  push(0, 'anchor:')
  push(2, 'label: "WHAT THIS LOOKS LIKE"')
  push(2, `client: ${yq(c.anchor.client)}`)
  push(2, `situation: ${yq(c.anchor.situation)}`)
  push(2, 'did:')
  for (const x of c.anchor.did) push(4, `- ${yq(x)}`)
  if (c.anchor.outcome) push(2, `outcome: ${yq(c.anchor.outcome)}`)
  push(2, `href: ${yq(c.anchor.href)}`)
  }
  push(0, 'scope:')
  push(2, 'label: "SCOPE"')
  push(2, `heading: ${yq(c.scope.heading)}`)
  push(2, 'includes:')
  for (const x of c.scope.includes) push(4, `- ${yq(x)}`)
  push(2, 'excludes:')
  for (const x of c.scope.excludes) push(4, `- ${yq(x)}`)
  push(0, 'shape:')
  push(2, 'label: "THE SHAPE OF IT"')
  push(2, `heading: ${yq(c.shape.heading)}`)
  push(2, `duration: ${yq(c.shape.duration)}`)
  push(2, 'team:')
  for (const t of c.shape.team) {
    push(4, `- role: ${yq(t.role)}`)
    push(6, `does: ${yq(t.does)}`)
  }
  push(2, 'needs:')
  for (const x of c.shape.needs) push(4, `- ${yq(x)}`)
  push(2, `pricing: ${yq(c.shape.pricing)}`)
  push(0, 'faqLabel: "THE QUESTIONS WE GET"')
  push(0, 'faqHeading: "Asked on real calls."')
  push(0, 'faq:')
  for (const f of c.faq) {
    push(2, `- question: ${yq(f.question)}`)
    push(4, `answer: ${yq(f.answer)}`)
  }
  push(0, 'next:')
  push(2, 'label: "WHERE TO GO NEXT"')
  push(2, 'heading: "If this is not quite it"')
  push(2, 'services:')
  for (const x of c.next.services) {
    push(4, `- name: ${yq(x.name)}`)
    push(6, `href: ${yq(x.href)}`)
    push(6, `why: ${yq(x.why)}`)
  }
  push(2, 'industries:')
  for (const x of c.next.industries) {
    push(4, `- name: ${yq(x.name)}`)
    push(6, `href: ${yq(x.href)}`)
    push(6, `why: ${yq(x.why)}`)
  }
  push(0, 'close:')
  push(2, `heading: ${yq(c.close.heading)}`)
  push(2, `body: ${yq(c.close.body)}`)
  push(2, 'ctaLabel: "Shall we chat?"')
  push(2, 'ctaHref: "https://meet.roarsinc.com/sales"')
  push(2, 'contact: "USA +1 (302) 505-1200  /  SALES@ROARSINC.COM"')
  push(0, 'needsReview: true')
  return lines.join('\n') + '\n'
}

/** Strip the fields we are about to rewrite, so a re-run is idempotent. */
const OWNED = /^(frame|cost|engagement|anchor|scope|shape|faqLabel|faqHeading|faq|next|close|needsReview):/
function stripOwned(fm) {
  const out = []
  let skipping = false
  for (const line of fm.split('\n')) {
    if (OWNED.test(line)) { skipping = true; continue }
    if (skipping && /^\s/.test(line)) continue
    skipping = false
    out.push(line)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()
}

let n = 0
for (const [slug, c] of Object.entries(COPY)) {
  const file = join(DIR, `${slug}.md`)
  const raw = readFileSync(file, 'utf8')
  const end = raw.indexOf('\n---', 4)
  const fm = stripOwned(raw.slice(4, end))
  const body = raw.slice(end + 4)
  writeFileSync(file, `---\n${fm}\n${render(slug, c)}---${body}`)
  n += 1
  console.log(`  ${slug}`)
}
console.log(`\nwrote S1-S9 copy into ${n} service page(s)`)
const pending = Object.entries(COPY).filter(([, c]) =>
  JSON.stringify(c).includes('NEEDS THE REAL'),
)
console.log(`${pending.length} still carry a placeholder and stay noindex until it is filled in.`)
