#!/usr/bin/env node
/**
 * The I1-I8 copy for the nine industry pages.
 *
 *   node scripts/industry-copy.mjs
 *
 * A service page answers "can you do this". This one answers "do you
 * understand my world", so I2 is the section it exists for: constraints an
 * insider would nod at, at the altitude of "cold chain apps fail on
 * connectivity, not on UI" rather than "logistics moves fast".
 *
 * WHAT IS REAL: the client names and the case study links, from
 * src/lib/projects.ts and the Elementor export. The service links in I5 are
 * real routes.
 *
 * WRITTEN TO BE CORRECTED: the constraints, the failure patterns, the way
 * each service is described for the sector, and the closes. These are claims
 * about the sector, not about Roars' record, and somebody who has worked in
 * the sector should read them before they go out.
 *
 * NOT WRITTEN, TWICE OVER:
 *
 *   I4 outcomes. A number against a named client is theirs to supply, so
 *   those read "[ NEEDS THE REAL FIGURE: ... ]".
 *
 *   I6 domain proof, the compliance regimes, integrations and standards. The
 *   brief is explicit that one invented item poisons the whole block, and the
 *   block's entire value is that a procurement reviewer can check it. There
 *   is nothing in the export that says which regimes Roars has actually
 *   worked under, so the block is ABSENT rather than drafted. It renders only
 *   when somebody fills it in.
 *
 * Every page keeps needsReview, so none of this is offered to search yet.
 *
 * House style: no em dashes, no en dashes as punctuation.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src/content/industries')
const NEED = (what) => `[ NEEDS THE REAL FIGURE: ${what} ]`

const COPY = {
  'food-restaurant-app-development': {
    frame: {
      h1: 'Six moments, four screens, and a kitchen that cannot wait for a sync.',
      does: 'We build the surfaces a restaurant actually runs on, and the plumbing that keeps them agreeing with each other.',
    },
    constraints: {
      heading: 'What makes restaurant software different',
      items: [
        { name: 'The clock is the spec', body: 'A ticket that lands ninety seconds late is a cold plate. Sync latency is not a performance metric here, it is the product working or not working.' },
        { name: 'Four surfaces, one truth', body: 'Diner, waiter, kitchen and owner all read the same order. When the 86 list updates, it has to update everywhere before the next person taps add.' },
        { name: 'The interface is used at arm’s length', body: 'A kitchen display is read across a pass, in steam, by someone holding a pan. Tap targets and type sizes that are fine on a desk are unusable there.' },
        { name: 'Margins do not absorb mistakes', body: 'A sector working on single-digit margins cannot carry a system that occasionally sells what the kitchen has run out of.' },
      ],
    },
    failures: {
      heading: 'Where restaurant builds usually come apart',
      items: [
        { name: 'Five systems that disagree about the price of a side', body: 'Each moment gets bought as its own product, and nobody owns the agreement between them. The work that matters is one source of truth for the menu, one for availability, one for the order.' },
        { name: 'Designed for the launch photo, not the Friday', body: 'Interfaces that look right in a screenshot and fall apart at eighty covers. The test is a full floor, not a demo.' },
        { name: 'Offline treated as an error', body: 'Venues have dead spots. A system that shows a spinner when the till loses signal has made the staff the fallback.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'The Club Social',
          situation: 'A club running amenities, restaurant ordering and membership through separate tools, with staff reconciling between them.',
          did: 'Built one app for members and for the club, so an order, a booking and a member are the same records on both sides.',
          outcome: NEED('what changed for the club or its staff, with a number and a timeframe'),
          href: '/work/club-social/',
        },
      ],
    },
    applies: {
      heading: 'What we do for restaurant and hospitality clients',
      items: [
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'The diner and waiter apps, built for a full floor rather than a demo, with offline capture that assumes the dead spot.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'Kitchen displays read across a pass, and ordering flows that survive a modifier list forty items long.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'The layer underneath: one menu, one availability, one order, shared by every surface.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'When a single venue wants to test an ordering model before rolling it across a group.' },
      ],
    },
    close: {
      heading: 'Tell us which of the six moments is costing you most.',
      body: 'Discovery, ordering, payment, the pass, delivery, or the second visit. We will come back in two working days with where we think the money is going and what we would fix first.',
    },
  },

  'on-demand-fitness-app-development': {
    frame: {
      h1: 'Signups are not the problem. Week three is.',
      does: 'We build fitness products designed around the session somebody actually does, not the plan they meant to follow.',
    },
    constraints: {
      heading: 'What makes fitness products different',
      items: [
        { name: 'Motivation decays on a schedule', body: 'Almost every fitness app loses its cohort in the same window. Design that ignores week three is designing for the download, not for the member.' },
        { name: 'The first session decides the rest', body: 'People who complete one worthwhile session stay. People who complete a profile, a goal and a plan usually do not. The opening flow is the retention feature.' },
        { name: 'Wearables are a data source, not a feature', body: 'Rings, watches and machines all report differently and none of them report reliably. Anything built on that has to be right when the data is wrong.' },
        { name: 'Coaching does not scale by copying it', body: 'A message that helps one member at the right moment is noise sent to everyone. The moment matters more than the message.' },
      ],
    },
    failures: {
      heading: 'Where fitness builds usually come apart',
      items: [
        { name: 'Onboarding that asks before it gives', body: 'Five screens of goals and measurements before anybody has done anything. Every question is a chance to leave, and they are all asked before there is a reason to stay.' },
        { name: 'Streaks that punish a missed day', body: 'A mechanic that resets to zero teaches people to stop rather than to return. The interesting design problem is the day after the one they missed.' },
        { name: 'Content libraries with no path through them', body: 'Four hundred videos and no answer to what to do today. Volume reads as value on a feature list and as paralysis in the app.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'GymBait.AI',
          situation: 'A fitness business asking whether coaching could reach a member at the moment it mattered rather than at their next session.',
          did: 'Built a nudge that learns from how a member actually trains, with a coach reviewing what goes out rather than a model sending it unattended.',
          outcome: NEED('engagement or retention change, with a number and a timeframe'),
          href: '/work/gymbait/',
        },
        {
          client: 'FlowRow',
          situation: 'People signed up in good numbers and stopped opening the app somewhere in the first fortnight.',
          did: 'Rebuilt the opening around one session worth doing rather than around a profile, a plan and a goal.',
          outcome: NEED('activation or week-three retention change, with a number and a timeframe'),
          href: '/work/flowrow-fitness-app/',
        },
      ],
    },
    applies: {
      heading: 'What we do for fitness clients',
      items: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'The opening flow, which is where fitness apps win or lose the member, and the day after a missed session.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'Native where the wearable integration needs it, built to be right when the sensor data is not.' },
        { name: 'AI automation', href: '/s/ai-automation-services/', why: 'Coaching that arrives at the moment it helps, with a human reviewing what goes out.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'Testing a coaching model on one cohort before building the product around it.' },
      ],
    },
    close: {
      heading: 'Send us your retention curve for the first thirty days.',
      body: 'Just the shape of it. We will come back in two working days with where we think people are going and which part of the first session we would change.',
    },
  },

  'retail-ecommerce-development': {
    frame: {
      h1: 'Every visit is paid for twice before it reaches the basket.',
      does: 'We work on the part of retail where the money is measurable: the distance between a catalogue and a completed order.',
    },
    constraints: {
      heading: 'What makes retail software different',
      items: [
        { name: 'Peak is a deadline, not a forecast', body: 'The trading period does not move. A build that is two weeks late in October is a build that missed the year, and no amount of quality argues with that.' },
        { name: 'Stock is the hardest integration in the business', body: 'Catalogue, warehouse and storefront each believe something slightly different about what is available. Overselling is a reputational cost, not a technical one.' },
        { name: 'Conversion is measured to the decimal', body: 'A tenth of a point is a real number in this sector. That makes it the one place where design decisions get argued with data rather than with taste.' },
        { name: 'Every visit is already expensive', body: 'Acquisition is paid before anybody sees a product page. A checkout that loses people is not losing sales, it is losing sales you have already bought.' },
      ],
    },
    failures: {
      heading: 'Where retail builds usually come apart',
      items: [
        { name: 'Replatforming to fix a checkout problem', body: 'A migration is the expensive answer to a question that was usually about three screens. Most platform pain is checkout pain wearing a bigger label.' },
        { name: 'Launching into the peak', body: 'The date gets chosen for commercial reasons and the first real load test happens on the busiest day of the year, with nobody available to fix it.' },
        { name: 'Designing the catalogue, forgetting the basket', body: 'Enormous care goes into product pages and none into the five steps after add to basket, which is where the measurable loss actually is.' },
      ],
    },
    applies: {
      heading: 'What we do for retail clients',
      items: [
        { name: 'eCommerce development', href: '/s/ecommerce-development-company/', why: 'Storefront, checkout and the stock integration, built and load tested before the trading period rather than during it.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'The five steps after add to basket, where a tenth of a point is a real number.' },
        { name: 'Growth hacking', href: '/s/growth-hacking-agency/', why: 'Once conversion holds, finding which channel is worth the spend rather than renewing last year’s budget.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'The operations behind the shop, where the spreadsheet usually still is.' },
      ],
    },
    close: {
      heading: 'Send us your checkout funnel for the last month.',
      body: 'A screenshot of the drop-off is enough. We will come back in two working days with where we think it is going and whether it is a rebuild or a fortnight of fixes.',
    },
  },

  'concierge-app-development': {
    frame: {
      h1: 'The service is the product, and software usually gets in its way.',
      does: 'We build member products where the technology stays out of the way of the person delivering the service.',
    },
    constraints: {
      heading: 'What makes concierge products different',
      items: [
        { name: 'Requests do not fit a form', body: 'The valuable ones never do. A product that only accepts structured input has quietly narrowed the service it was meant to deliver.' },
        { name: 'The member expects to be known', body: 'Asking for the same preference twice is worse than not having the feature. Memory is the service, and it has to work across channels.' },
        { name: 'Two sides, very different speeds', body: 'The member app can be leisurely. The staff side is a queue under time pressure and it is the one that decides whether the service holds up.' },
        { name: 'Discretion is a design constraint', body: 'Who can see which request, and for how long, is not an admin setting bolted on later. It shapes the data model.' },
      ],
    },
    failures: {
      heading: 'Where concierge builds usually come apart',
      items: [
        { name: 'A chat box with nothing behind it', body: 'Requests arrive and then live in somebody’s inbox. The interface was the easy half; the routing, the state and the record are the product.' },
        { name: 'Building the member app first', body: 'The side that fails is always the staff side. It gets designed last, on a smaller budget, by which point the workflow has been decided by the member screens.' },
        { name: 'Loyalty bolted on at the end', body: 'Points added after launch sit outside the request model, so the thing that should reward good service cannot see it happening.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'Concierge Loyalty',
          situation: 'A concierge operation where recognising a returning member depended on whoever happened to take the request.',
          did: 'Put requests, members and rewards behind one model so the service could remember a member without the staff having to.',
          outcome: NEED('what changed for members or staff, with a number and a timeframe'),
          href: '/work/concierge-loyalty-program/',
        },
        {
          client: 'Les Concierges',
          situation: 'A concierge business whose request handling ran across tools that did not share a view of the member.',
          did: 'Built the staff side first, so the workflow decided the product rather than the other way round.',
          outcome: NEED('what changed in request handling, with a number and a timeframe'),
          href: '/work/les-concierges/',
        },
      ],
    },
    applies: {
      heading: 'What we do for concierge and member businesses',
      items: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'Requests, members and rewards in one model, so the service can remember without the staff having to.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'The staff queue, designed for time pressure, which is the side that decides whether the service holds.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'The member app, where the request has to be as easy as sending a message.' },
        { name: 'AI automation', href: '/s/ai-automation-services/', why: 'Triage and routing on the staff side, with a person still deciding what the member is told.' },
      ],
    },
    close: {
      heading: 'Tell us what a request looks like when it goes wrong.',
      body: 'That is usually where the model is thin. We will come back in two working days with where we think it breaks and what we would change first.',
    },
  },

  'travel-and-hospitality-app-development': {
    frame: {
      h1: 'The plan is fine until the day it changes, and then the product is the whole service.',
      does: 'We build travel products for the moment the itinerary stops being a document and starts being a problem.',
    },
    constraints: {
      heading: 'What makes travel software different',
      items: [
        { name: 'The value is in the disruption', body: 'Search and booking are solved. What decides whether a traveller trusts a product is what it does at the gate when the flight moves.' },
        { name: 'Inventory belongs to somebody else', body: 'Availability, price and cancellation rules live in systems you do not control and do not agree with each other. The product has to be honest about that.' },
        { name: 'Connectivity is the worst you design for', body: 'Airports, foreign networks, roaming turned off. Anything that only works with a good connection does not work when it matters.' },
        { name: 'Time zones are a correctness problem', body: 'Not a formatting one. Most travel bugs that reach a customer are a date that was right in one place and wrong in another.' },
      ],
    },
    failures: {
      heading: 'Where travel builds usually come apart',
      items: [
        { name: 'A beautiful search and nothing after booking', body: 'Everything goes into the funnel and nothing into the trip. The traveller’s hardest moments all happen after payment.' },
        { name: 'Treating supplier data as reliable', body: 'Prices and availability get cached optimistically, and the failure shows up as a booking that cannot be honoured.' },
        { name: 'Notifications that arrive too late to help', body: 'A gate change alert that lands after the gate change is worse than none. The timing is the feature.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'ONUS',
          situation: 'A travel and hospitality operation that needed its product to hold up away from a desk and away from a good connection.',
          did: 'Designed for the disruption rather than the booking, so the product is most useful at the point the plan stops working.',
          outcome: NEED('what changed for travellers or staff, with a number and a timeframe'),
          href: '/work/onus/',
        },
      ],
    },
    applies: {
      heading: 'What we do for travel and hospitality clients',
      items: [
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'The app a traveller opens at the gate, built for the worst connection rather than the office wifi.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'The itinerary model underneath, which is where supplier data and time zones become correctness problems.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'The disruption flows, which are the ones that decide whether the traveller trusts the product again.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'The operations side, where the staff resolving the disruption actually work.' },
      ],
    },
    close: {
      heading: 'Tell us what your product does when a booking changes.',
      body: 'That answer usually explains the rest of the product. We will come back in two working days with what we would fix first.',
    },
  },

  'logistics-transportation-app-development': {
    frame: {
      h1: 'The app has to work in gloves, in the cold, with no signal, or it is paperwork.',
      does: 'We build logistics software for the conditions the work actually happens in, not for the conditions it is specified in.',
    },
    constraints: {
      heading: 'What makes logistics software different',
      items: [
        { name: 'Connectivity is the design problem', body: 'Cold stores, loading bays, basements and long stretches of road. Offline is the normal state, and anything that treats it as an error has made the driver the fallback.' },
        { name: 'The hands are not free', body: 'Gloves, a clipboard, a pallet truck, poor light. Large targets, no typing where a tap will do, and nothing that needs two hands.' },
        { name: 'The record is a legal document', body: 'A compliance check is evidence. Timestamps, signatures and an audit trail are not features, they are the reason the software is allowed to replace paper.' },
        { name: 'Sync conflicts are an operations decision', body: 'Two people recording the same pallet from two devices is a Tuesday. The resolution rule is a business decision and it has to be made explicitly.' },
      ],
    },
    failures: {
      heading: 'Where logistics builds usually come apart',
      items: [
        { name: 'Designed at a desk, used on a forklift', body: 'The interface is specified by people who will never use it in the conditions it runs in, and the first real feedback arrives after rollout.' },
        { name: 'Offline added later', body: 'Retro-fitting offline to an online-first product means rebuilding the data layer. It is the single most expensive thing to postpone in this sector.' },
        { name: 'Paper kept running alongside', body: 'When the app is harder than the clipboard, staff keep the clipboard. Then you have two records and neither is trusted.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'Snowman Logistics',
          situation: 'Warehouse staff in cold storage completing compliance checks on paper, in gloves, with no signal.',
          did: 'Designed for the actual conditions: large targets, offline capture, no typing where a tap would do, and sync that assumes the network is absent rather than broken.',
          outcome: NEED('what changed on the warehouse floor, with a number and a timeframe'),
          href: '/work/warehouse-compliance-checklist-app/',
        },
      ],
    },
    applies: {
      heading: 'What we do for logistics clients',
      items: [
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'The app on the floor, built offline first because retro-fitting it means rebuilding the data layer.' },
        { name: 'Web app development', href: '/s/web-app-development/', why: 'The operations side, which is usually the spreadsheet that holds the compliance record today.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'The sync and conflict rules, which are business decisions rather than technical ones.' },
        { name: 'Digital transformation', href: '/s/digital-business-transformation-services/', why: 'When the problem is four systems disagreeing about where a consignment is.' },
      ],
    },
    close: {
      heading: 'Tell us what your team still records on paper.',
      body: 'And why the last attempt to change that did not stick. We will come back in two working days with what we think would survive contact with the floor.',
    },
  },

  'saas-application-development-services': {
    frame: {
      h1: 'You do not have an acquisition problem. You have a first-week problem.',
      does: 'We build and fix the part of a SaaS product between signing up and the moment it is worth paying for.',
    },
    constraints: {
      heading: 'What makes SaaS different',
      items: [
        { name: 'Activation decides everything downstream', body: 'Churn, expansion and support load are all mostly set in the first week. Work spent further down the funnel is usually work spent on a symptom.' },
        { name: 'Multi-tenancy is an early decision', body: 'How tenants are isolated shapes the schema, the permissions and the cost of every enterprise conversation you will have later. It is hard to revisit.' },
        { name: 'Every release reaches everyone at once', body: 'There is no staged rollout to a physical population. Feature flags and a tested rollback are what make shipping frequently survivable.' },
        { name: 'The buyer and the user are different people', body: 'One signs, the other decides whether it gets used. A product that only serves the buyer renews once.' },
      ],
    },
    failures: {
      heading: 'Where SaaS builds usually come apart',
      items: [
        { name: 'An empty state that explains nothing', body: 'The new account opens on a dashboard with no data in it. The most important screen in the product is the one that gets the least design attention.' },
        { name: 'Features added to close deals', body: 'Each one was reasonable in the room. Together they are a product with no shape, and a roadmap owned by whoever was last on a call.' },
        { name: 'Onboarding treated as a marketing job', body: 'A tour and an email sequence bolted onto a product that has not changed. Activation is a product problem, and tours are what people do instead of fixing it.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'The Club Social',
          situation: 'A membership operation running amenities, ordering and members across tools that each held part of the truth.',
          did: 'Built one product where a member is one record, so the operations team could change what members see without waiting on an engineer.',
          outcome: NEED('what changed for their team, with a number and a timeframe'),
          href: '/work/club-social/',
        },
      ],
    },
    applies: {
      heading: 'What we do for SaaS clients',
      items: [
        { name: 'Product development', href: '/s/product-development-company/', why: 'The multi-tenancy and permissions decisions that are expensive to revisit once there are customers on them.' },
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'Activation in the first week, including the empty state that gets the least design and decides the most.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'Feature flags and a tested rollback, which are what make shipping to everyone at once survivable.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'Proving a model on one segment before building the platform that serves all of them.' },
      ],
    },
    close: {
      heading: 'Tell us what percentage of signups reach your activation moment.',
      body: 'And what you count as that moment. If the second answer is hard, that is the thing worth working on. We will come back in two working days.',
    },
  },

  'healthcare-app-development-company': {
    frame: {
      h1: 'The people using it are stressed, rushed, or unwell, and the rules do not bend.',
      does: 'We build healthcare products for the conditions clinicians and patients actually use them in, inside the constraints that are not negotiable.',
    },
    constraints: {
      heading: 'What makes healthcare software different',
      items: [
        { name: 'The user is not at their best', body: 'A patient is anxious and a clinician is between appointments. Anything that needs full attention to use correctly will be used incorrectly.' },
        { name: 'The rules are not a preference', body: 'Data handling, consent and retention are set externally and change on somebody else’s schedule. They shape the architecture, not the settings screen.' },
        { name: 'Integration with systems older than you', body: 'Records live in platforms that were not designed to be integrated with. What is possible is decided by their interfaces, not by yours.' },
        { name: 'Wrong is worse than slow', body: 'Most software optimises for speed. Here the cost of a confident wrong answer is high enough that the design has to prefer asking.' },
      ],
    },
    failures: {
      heading: 'Where healthcare builds usually come apart',
      items: [
        { name: 'Compliance treated as a final phase', body: 'Built first and reviewed at the end, which is when the data model turns out to be the thing that has to change.' },
        { name: 'Designed for the clinician, given to the patient', body: 'Or the reverse. The two use it in completely different states and a single interface serving both usually serves neither.' },
        { name: 'A portal nobody opens twice', body: 'Access is granted, the login is awkward, and the phone call it was meant to replace keeps happening.' },
      ],
    },
    cases: {
      items: [
        {
          client: 'GISAID',
          situation: 'A platform holding one of the largest COVID data sets in the world, where availability was not negotiable.',
          did: 'Built the tooling for a scale where a bad release is a public problem rather than an internal one.',
          outcome: NEED('availability or throughput change, with a number and a timeframe'),
          href: '/work/gisaid-health-tech/',
        },
        {
          client: 'Friendo',
          situation: 'A healthcare product that had to work for people who are not at their best when they open it.',
          did: 'Designed the flows for the state the user is actually in rather than for an attentive reader.',
          outcome: NEED('what changed for patients or clinicians, with a number and a timeframe'),
          href: '/work/friendo-healthcare-mobile-app-development/',
        },
      ],
    },
    applies: {
      heading: 'What we do for healthcare clients',
      items: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'Flows designed for a user who is anxious or between appointments, not for an attentive reader.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'The data model, which is what compliance actually constrains and what is most expensive to change late.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'Patient-facing apps, where a difficult login means the phone call you meant to replace keeps happening.' },
        { name: 'DevOps', href: '/s/result-oriented-devops-services/', why: 'A tested rollback, which in this sector is closer to a requirement than a nicety.' },
      ],
    },
    /* The only domain block on the site, and every entry is quoted from
       Roars' own live healthcare page rather than written here. Their words,
       moved across, which is a different thing from a drafted claim. It still
       wants confirming before it goes in front of a procurement reviewer,
       which is why the note says so and the page stays under review. */
    domain: {
      heading: 'What we have worked with in healthcare',
      note: 'Taken from what the live site already states. Confirm each entry before this page is published, because the value of this block is that it can be checked.',
      groups: [
        { k: 'Compliance', items: ['HIPAA'] },
        { k: 'Platform', items: ['AWS Managed Services', 'AWS Professional Services'] },
        { k: 'Practice', items: ['DevOps Services'] },
      ],
    },
    close: {
      heading: 'Tell us which regime you have to satisfy, and who the user is.',
      body: 'Those two answers decide most of the architecture. We will come back in two working days with what we think that means for the build.',
    },
  },

  'education-mobile-app-development': {
    frame: {
      h1: 'Attention is the scarce resource, and the buyer is never the learner.',
      does: 'We build education products around the session a learner will actually finish.',
    },
    constraints: {
      heading: 'What makes education software different',
      items: [
        { name: 'Three users, one product', body: 'Learner, teacher and administrator want different things from the same screens. Designing for one of them is how the other two end up working around it.' },
        { name: 'The year has a shape', body: 'Terms, admissions and exam periods are fixed. A rollout in week two of term is a rollout nobody has time to adopt.' },
        { name: 'Completion is the only honest metric', body: 'Enrolments and logins measure intent. What a product is for is a learner finishing something, and that number is usually much smaller.' },
        { name: 'Procurement is slower than the product', body: 'The person who wants it cannot buy it, and the person who buys it will not use it. The evidence a product needs is evidence for a committee.' },
      ],
    },
    failures: {
      heading: 'Where education builds usually come apart',
      items: [
        { name: 'A content library with no path through it', body: 'Volume gets treated as value. The learner opens it, cannot tell what to do today, and does not come back.' },
        { name: 'Built for the buyer', body: 'Dashboards, reporting and controls, because that is what the demo has to show. The learner experience gets whatever budget is left.' },
        { name: 'Ignoring the teacher’s workload', body: 'A product that needs an hour of setup per class does not get set up. The adoption blocker is almost never the learner.' },
      ],
    },
    applies: {
      heading: 'What we do for education clients',
      items: [
        { name: 'UX design', href: '/s/user-experience-design-agency/', why: 'Three users on one product, and the path through the library that decides whether anybody finishes anything.' },
        { name: 'Mobile app development', href: '/s/mobile-app-development/', why: 'The learner app, where a session has to survive a commute and a bad connection.' },
        { name: 'Product development', href: '/s/product-development-company/', why: 'The reporting the buyer needs, built without letting it decide the learner experience.' },
        { name: 'MVP development', href: '/s/mvp-development/', why: 'Proving completion with one cohort before a committee is asked to buy it for everyone.' },
      ],
    },
    close: {
      heading: 'Tell us your completion rate, not your enrolment number.',
      body: 'That gap is usually the whole brief. We will come back in two working days with where we think learners are stopping and what we would change first.',
    },
  },
}

export { COPY, NEED }

/* ------------------------------------------------------------------ write */

const yq = (v) => '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'

function render(c) {
  const L = []
  const push = (n, t) => L.push(' '.repeat(n) + t)
  push(0, 'frame:')
  push(2, `h1: ${yq(c.frame.h1)}`)
  push(2, `does: ${yq(c.frame.does)}`)
  push(0, 'constraints:')
  push(2, 'label: "WHAT IS DIFFERENT HERE"')
  push(2, `heading: ${yq(c.constraints.heading)}`)
  push(2, 'items:')
  for (const it of c.constraints.items) {
    push(4, `- name: ${yq(it.name)}`)
    push(6, `body: ${yq(it.body)}`)
  }
  push(0, 'failures:')
  push(2, 'label: "WHERE THIS GOES WRONG"')
  push(2, `heading: ${yq(c.failures.heading)}`)
  push(2, 'items:')
  for (const it of c.failures.items) {
    push(4, `- name: ${yq(it.name)}`)
    push(6, `body: ${yq(it.body)}`)
  }
  if (c.cases) {
    push(0, 'cases:')
    push(2, 'label: "WHAT WE HAVE BUILT HERE"')
    push(2, 'items:')
    for (const x of c.cases.items) {
      push(4, `- client: ${yq(x.client)}`)
      push(6, `situation: ${yq(x.situation)}`)
      push(6, `did: ${yq(x.did)}`)
      if (x.outcome) push(6, `outcome: ${yq(x.outcome)}`)
      push(6, `href: ${yq(x.href)}`)
    }
  }
  push(0, 'applies:')
  push(2, 'label: "WHAT WE DO IN THIS SECTOR"')
  push(2, `heading: ${yq(c.applies.heading)}`)
  push(2, 'items:')
  for (const x of c.applies.items) {
    push(4, `- name: ${yq(x.name)}`)
    push(6, `href: ${yq(x.href)}`)
    push(6, `why: ${yq(x.why)}`)
  }
  /* I6 renders only where every entry can be checked. Eight of the nine have
     no such list yet, and a drafted domain block is worse than no block: its
     whole value is that a procurement reviewer can verify it. */
  if (c.domain) {
    push(0, 'domain:')
    push(2, 'label: "DOMAIN"')
    push(2, `heading: ${yq(c.domain.heading)}`)
    if (c.domain.note) push(2, `note: ${yq(c.domain.note)}`)
    push(2, 'groups:')
    for (const g of c.domain.groups) {
      push(4, `- k: ${yq(g.k)}`)
      push(6, 'items:')
      for (const x of g.items) push(8, `- ${yq(x)}`)
    }
  }
  push(0, 'close:')
  push(2, `heading: ${yq(c.close.heading)}`)
  push(2, `body: ${yq(c.close.body)}`)
  push(0, 'needsReview: true')
  return L.join('\n') + '\n'
}

const OWNED = /^(frame|constraints|failures|cases|applies|domain|close|needsReview):/
function stripOwned(fm) {
  const out = []
  let skipping = false
  for (const line of fm.split('\n')) {
    if (OWNED.test(line)) { skipping = true; continue }
    if (skipping && /^[\s#]/.test(line)) continue
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
  writeFileSync(file, `---\n${stripOwned(raw.slice(4, end))}\n${render(c)}---${raw.slice(end + 4)}`)
  n += 1
  console.log(`  ${slug}`)
}
const noCase = Object.entries(COPY).filter(([, c]) => !c.cases).map(([s]) => s)
console.log(`\nwrote I1-I8 copy into ${n} industry page(s)`)
console.log(`${noCase.length} have no case study in this sector: ${noCase.join(', ') || 'none'}`)
console.log('I6, the domain proof block, is absent on all of them and needs real entries.')
