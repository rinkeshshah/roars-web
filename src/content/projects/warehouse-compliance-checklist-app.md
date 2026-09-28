---
title: "Snowman Logistics"
client: "Snowman Logistics"
industry: ["logistics-transportation-app-development"]
publishedAt: 2026-02-18
featured: true
dateLabel: "Feb 18, 2026"
headline: "Snowman"
heroImage: "/work/warehouse-compliance-checklist-app.jpg"
heroAlt: "Snowman Logistics warehouse platform"
team: ["founder", "abhishek", "chetna", "nitin", "suzanne"]
about: "A centralised warehouse operations system for Snowman Logistics, replacing manual checklists and fragmented reporting with real-time visibility, structured compliance and scalable control across every site."
facts:
  - k: "Industry"
    v: "Logistics & Cold Chain"
  - k: "Services"
    v: "Product Strategy, UX, Mobile, Web"
  - k: "Client"
    v: "Snowman Logistics"
  - k: "Year"
    v: "2026"
blocks:
  - heading: "Goals of the Project:"
    lead: "To give every site one source of truth, checklists on the floor, photo evidence attached, timestamped sign-off, and reporting that rolls up to regional and national views."
    body: "To make compliance simple, fast and visually clear for the people doing it, so a problem surfaces while it can still be fixed."
  - heading: "Outcome:"
    lead: "Intuitive control at every level, an app built for gloves and cold storage, with large targets, offline capture and no typing where a tap will do."
    body: "A streamlined system that highlights what matters and drives stronger engagement, with clear navigation and exception-first reporting for managers."
# SERVED FROM THIS REPO, NOT FROM /wp-content/uploads/.
#
# The two pictures that were here — aboutus-strategy.jpg and
# beautiful-experience.jpg — are generic stock from elsewhere on the old site.
# Neither is Snowman. One was tagged `wireframe` and showed a strategy
# meeting; the other was tagged `photo` and showed nobody's checklist.
#
# The real ones arrived from the client's own folder and are NOT in the
# WordPress export, so there is no upload path to point at and guessing one
# would be inventing a URL. They go in public/work/snowman/ for the same
# reason the client logos do: a file in this repo resolves in every build,
# including this one, which an uploads path does not.
gallery:
  - src: "/work/snowman/study.jpg"
    # The client's file is 824 x 521, which is under the 1200 a picture needs
    # to take the full column, so it was landing at half width with a gap
    # beside it. Resampled once to 1400 with Lanczos and a light sharpen, so
    # it lines up with every other picture on the page. That adds no detail
    # the original did not have — a larger export would be better and has
    # been asked for.
    kind: "study"
    w: 1400
    h: 885
    alt: "Angled tiles of the Snowman interface: compliance score, quick actions, checklist picker"
    caption: "Working through the surfaces before the colour went on"
showcase:
  - src: "/work/snowman/fleet.jpg"
    kind: "photo"
    w: 1800
    h: 1013
    alt: "A hand holding the Snowman app in front of a line of Snowman cold chain trucks"
    caption: "Warehouse selection, at the depot it belongs to"
  - src: "/work/snowman/warehouse.jpg"
    kind: "photo"
    w: 1800
    h: 1013
    alt: "The Snowman dashboard and checklist picker over racking in a cold store"
    caption: "Pending tasks, open non-conformances, compliance at 87%"
  - src: "/work/snowman/rails.jpg"
    kind: "photo"
    w: 1500
    h: 807
    alt: "The Snowman warehouse selection screen showing distribution centres and geofence range"
    caption: "Inside the geofence, or out of range and told so"
  - src: "/work/snowman/screens.jpg"
    kind: "app"
    w: 2000
    h: 1066
    alt: "Four Snowman screens: safety audit item, task calendar, non-conformance list and scoring"
    caption: "Audit item, task calendar, non-conformances, scoring"
testimonial:
  quote: "You showed a strong understanding of our business needs and prepared well-structured documentation. The user-friendly UI/UX design you created makes the system easy to use, and your guidance in improving business processes has been very valuable."
  name: "Bhushan Paralkar"
  # AVP, not VP. Owner-confirmed 17 Sep against the Work Presentation handoff.
  # The quote itself is unchanged: the handoff opens it with an extra sentence
  # and says "Roars showed" where production says "You showed", and only the
  # designation was confirmed. The production wording stands until it is.
  role: "AVP — IT & Business Excellence, Snowman Logistics"
  portrait: "/wp-content/uploads/2026/02/vt6oz.Bhushan1.jpg"

# THE PRESENTATION LAYOUT, from `Roars v2 - Work Presentation.dc.html`.
# Content is the design's own, transcribed from the handoff of 17 Sep. Image
# paths are remapped: the design reads from a local `uploads/` folder, this
# site serves the client's own files from public/work/ and the migrated ones
# from the WordPress uploads directory, which scripts/validate-content.mjs
# checks against the export.
presentation:
  line: "Warehouse compliance, turned into a system of record."
  constraints:
    - "Role-based accountability"
    - "Audit-grade logging"
    - "Offline-tolerant on the floor"
    - "Built for more sites"
  coverPlate:
    src: "/work/snowman/snowman-app-homepage.jpg"
    w: 1920
    h: 1080
    alt: "Snowman"
  coverIsPhoto: true
  meta:
    - k: "CLIENT"
      v: "Snowman Logistics"
    - k: "SECTOR"
      v: "Cold chain & warehousing"
    - k: "SCOPE"
      v: "Product consulting · Mobile UX/UI · Full stack"
    - k: "SURFACES"
      v: "Mobile app · Web dashboards"
  challengeLead: "Critical warehouse checklists were being run by hand, and leadership could only see them after the fact."
  challengeBody: "Compliance tracking had no audit trail, reporting depended on follow-ups rather than the system, and every new location multiplied the coordination. The work was a centralised operations platform that enforces role-based responsibility, standardises how a checklist is executed, and shows the state of every site in real time."
  screens:
    - img:
        src: "/work/snowman/snowman-app-homepage.jpg"
        w: 1920
        h: 1080
        alt: "The shift, in four numbers"
      kicker: "DASHBOARD"
      title: "The shift, in four numbers"
      note: "Pending tasks, open NCs, closed tasks, compliance percentage. A supervisor reads the state of the warehouse before choosing what to open."
    - img:
        src: "/work/snowman/snowman-app.jpg"
        w: 1500
        h: 807
        alt: "One question at a time, with proof"
      kicker: "EXECUTION"
      title: "One question at a time, with proof"
      note: "Score, remarks, photo, and a Mark as NC switch on the same card. Raising a non-conformance is part of answering, not a separate report written later."
    - img:
        src: "/work/snowman/snowman-wireframe.jpg"
        w: 824
        h: 521
        alt: "Checklists as controlled documents"
      kicker: "CHECKLIST LIBRARY"
      title: "Checklists as controlled documents"
      note: "Category, question count, duration and last use sit on every entry, so the right audit is chosen deliberately and the same one is run the same way each time."
    - img:
        src: "/work/snowman/Warehouse-solution-app1-scaled.png"
        w: 2560
        h: 1365
        alt: "Where you stand decides what you can do"
      kicker: "GEOFENCE"
      title: "Where you stand decides what you can do"
      note: "Warehouse selection is bounded by location: in range the button starts the shift, out of range it says so and stops. Accountability is enforced before data entry, not audited afterwards."
  mobile:
    - img:
        src: "/work/snowman/snowman-logistics-warehouse-amagement.jpg"
        w: 1920
        h: 1080
        alt: "Checked in at the depot, before the first pallet moves"
      label: "Checked in at the depot, before the first pallet moves"
    - img:
        src: "/work/snowman/Warehouse-solution-app1-scaled.png"
        w: 2560
        h: 1365
        alt: "Warehouse selection with the geofence state visible"
      label: "Warehouse selection with the geofence state visible"
  buildLead: "Business logic separated from the presentation layer, so the audit trail is the product."
  stack:
    - k: "Mobile"
      v: "Flutter — built for gloves, poor light and intermittent signal"
    - k: "Web"
      v: "React dashboards for supervisors and leadership"
    - k: "Services"
      v: "Node.js with Firebase, hosted on Azure"
    - k: "Controls"
      v: "Role-based access with audit-grade logging on every submission"
  outcomeLead: "Reactive firefighting became proactive operations control."
  outcomes:
    - big: "100%"
      label: "Checklist digitisation across warehouse operations"
    - big: "Live"
      label: "Visibility across locations without chasing updates"
    - big: "↓"
      label: "Manual reporting errors and compliance misses"
    - big: "1"
      label: "Structured architecture behind web and mobile"
  nextNote: "Predictive analytics, automation and AI-driven logistics insight sit on the same foundation, ready when the next set of sites comes online."
seo:
  title: "Snowman Logistics: Warehouse Compliance App"
  description: "Manual checklists and fragmented reporting replaced by one system: evidence on the floor, timestamped sign-off, and reporting that rolls up to national views."
  primaryIntent: "warehouse compliance app"
  schemaType: "CreativeWork"
---

## The problem with a clipboard

Compliance in a cold chain is not a paperwork exercise. It is a series of
checks that either happened or did not, at a time that either can or cannot be
proven, on a site that either reported it upward or did not. On paper, all
three are assumptions. A checklist gets filled in at the end of a shift rather
than during it, a photo lives on somebody's phone, and the regional picture is
assembled days later from documents that have already stopped being current.

Nothing about that is a failure of the people doing the work. It is a failure
of the instrument they were given.

## One source of truth

The system puts the checklist where the work happens. Each item is completed on
the floor, photo evidence is attached to the item it evidences rather than
filed separately, and sign-off carries a timestamp that nobody has to
reconstruct afterwards. The same record that a warehouse operator completes is
the record a regional manager reads, and the one that rolls up into the
national view. There is no re-keying between those three, because there is only
one record.

## Built for gloves and cold storage

The floor is the hard constraint. An interface designed at a desk does not
survive a freezer: targets are too small for gloved hands, typing is slow where
it is possible at all, and connectivity is not something to depend on. So the
app uses large targets, captures offline and syncs when it can, and avoids
typing anywhere a tap will do the same job.

## Reporting that starts with the exception

For managers the useful question is not "what was completed" but "what was
not". Reporting leads with the exceptions and the sites they came from, so a
problem surfaces while it can still be fixed rather than at the end of a
reporting cycle. Clear navigation, and a view that highlights what matters
instead of presenting everything at once.
