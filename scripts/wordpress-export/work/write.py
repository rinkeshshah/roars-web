"""Turn extract.py's JSON into the projects content collection.

    python3 write.py [in-dir]        # default ./out/

Front matter and a short body. The words are the case study's own; nothing
here paraphrases or invents.

projects.txt is the authority, not the contents of out/, for the same reason
the journal writer works that way: dropping a slug from the list should drop
the page, not leave a stale one behind.

warehouse-compliance-checklist-app IS NOT WRITTEN HERE. It was authored by
hand against the Project Detail export, with real copy and a proper narrative,
and the machine extraction below is a worse page than the one already in the
repo. It stays where it is.

INDUSTRY is the one field the export does not carry, and the one the repo has
always refused to guess at. src/lib/projects.ts says so directly: "guessing
would put a real client in the wrong sector on a public page." So every entry
in INDUSTRY below is sourced, and the source is written next to it. Three
kinds:

  APPROVED     already shipped in src/content/industries/<sector>.md as that
               sector's featured project, or on the /industries/ hub as its
               proof. Those were reviewed by the client.
  SELF         the case study says what sector it is in, in its own words, on
               the page. Quoted in the comment.
  NO SECTOR    the project does not belong to any of the nine. 'legal',
               'finance' and 'entertainment' have no industry page, which the
               schema already allows for the first two.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
IN_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
OUT = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'src/content/projects'))
os.makedirs(OUT, exist_ok=True)
SLUGS = open(os.path.join(HERE, 'projects.txt')).read().split()

# Hand-authored, better than anything extracted. Never overwritten.
KEEP = {'warehouse-compliance-checklist-app'}

INDUSTRY = {
    # APPROVED — featured on that sector's page already.
    'concierge-loyalty-program': ['concierge-app-development'],
    'gisaid-health-tech': ['healthcare-app-development-company'],
    'gymbait': ['on-demand-fitness-app-development'],
    'club-social': ['saas-application-development-services'],
    'onus': ['travel-and-hospitality-app-development'],
    # APPROVED — named as proof on the /industries/ hub.
    'les-concierges': ['concierge-app-development'],
    'friendo-healthcare-mobile-app-development': ['healthcare-app-development-company'],
    'flowrow-fitness-app': ['on-demand-fitness-app-development'],

    # SELF — the page says it.
    # "transforming how drivers and parking owners navigate ... city parking"
    'parqly-parking-solution': ['logistics-transportation-app-development'],
    # "a trusted platform for mutual fund investments"
    'advisee': ['finance'],
    # "Seamless, Remote Company Registration"
    'companyguru': ['legal'],
    # "A leader in car accident cases in Connecticut & Tri-State Area"
    'ventura-law-firm': ['legal'],
    # "On-Demand Car Loan App ... purchasing a vehicle"
    '411drives-on-demand-car-loan-app': ['finance'],
    # "A location based photo sharing app! Travel and share your stories"
    'gypsy': ['travel-and-hospitality-app-development'],
    # "getting the best quality products and services ... beauty providers"
    'blelp': ['retail-ecommerce-development'],
    # "Create a professional and attractive micro-webpage ... generator"
    'super-social': ['saas-application-development-services'],
    # "gated communities ... manage the resources housed therein"
    'community-social-residential-community-app': ['concierge-app-development'],
    # Tanishq is a jewellery retailer; the brief is "data analytics ... as per
    # demographics, profession, preferences, and purchase"
    'tanishq-data-analytics': ['retail-ecommerce-development'],
    # "rewards for targets that are met ... employee motivation"
    'reward-butler': ['concierge-app-development'],
    # "honor its loyal partners and distributors ... customer loyalty program"
    'the-presidents-club': ['retail-ecommerce-development'],
    # "Steps Tracking App ... employee health and fitness levels"
    'go-champions-go': ['on-demand-fitness-app-development'],

    # NO SECTOR. "a game that allows users to select members of their dream
    # presidential cabinet". None of the nine fits and pretending otherwise
    # would put a real client in the wrong one.
    'counter-cabinet': ['entertainment'],
}

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# THE HEADER PHOTOGRAPH IS OWNED BY src/lib/media.ts, not by this script.
#
# The work page header and every featured band that credits the project must
# draw the same file; src/pages/work/[slug].astro fails the build when they
# disagree, which is how this was caught. Nine projects have a curated header
# there, taken from the live page. Those win. The rest take the first content
# image from their own page, which is still an image from the reference page.
LIB = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'src/lib'))
_media = open(os.path.join(LIB, 'media.ts')).read()
_projects = open(os.path.join(LIB, 'projects.ts')).read()
# NOT `.split('}')[0]`: the values are template literals containing ${U}, so
# splitting on the first brace cut the block off before the first entry and
# the map came back empty.
_block = re.search(r'export const WORK = \{(.*?)\n\} as const', _media, re.S).group(1)
_work = dict(re.findall(r'(\w+):\s*`\$\{U\}([^`]+)`', _block))
_key = dict(re.findall(r"slug: '([^']+)'.*?image: '([^']+)'", _projects))
CURATED = {
    slug: '/wp-content/uploads' + _work[k]
    for slug, k in _key.items() if k in _work
}
if len(CURATED) != len(_work):
    sys.exit(f'media.ts has {len(_work)} headers but only {len(CURATED)} map to a slug. '
             'A WORK key with no project, or a parse change. Fix before writing.')

# Read the featured flag from projects.ts rather than repeating it here. It is
# an editorial choice that lives in one place.
FEATURED = set(re.findall(r"slug: '([^']+)'[^\n]*featured: true", _projects))


def yq(v):
    """Double-quoted YAML scalar. Escapes only what YAML requires."""
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'


def clip(s, n):
    """Trim to n characters, at a SENTENCE boundary where there is one.

    Cutting mid-sentence and appending an ellipsis reads as broken copy on a
    client's case study ("...feel less like a chore and more like a…"). A
    whole sentence that stops early reads as an excerpt, which is what it is.
    Falls back to a word boundary only when the first sentence is itself over
    the limit.
    """
    s = ' '.join((s or '').split())
    if len(s) <= n:
        return s
    cut = ''
    for sentence in re.findall(r'[^.!?]*[.!?]', s):
        if len(cut) + len(sentence) > n:
            break
        cut += sentence
    cut = cut.strip()
    if len(cut) >= n * 0.55:
        return cut
    return s[:n - 1].rsplit(' ', 1)[0].rstrip(',.;:') + '…'


written, skipped, notes = 0, [], []
for slug in SLUGS:
    if slug in KEEP:
        skipped.append(slug)
        continue
    f = os.path.join(IN_DIR, slug + '.json')
    if not os.path.exists(f):
        sys.exit(f'missing {f} — run extract.py first')
    d = json.load(open(f))
    assert d['slug'] == slug, f'{f} holds {d["slug"]}'

    ind = INDUSTRY.get(slug)
    if not ind:
        sys.exit(f'{slug}: no industry mapping. Add one with its source, do not guess.')

    client = d['title']
    # The masthead is set at 124px, so the long names wrap onto the date. The
    # export's own first heading is the short form where there is one.
    headline = clip(d['headline'] or client, 20)

    about = clip(d['about'], 300)
    desc = d['seo_desc'] or about
    desc = clip(desc, 300)
    if len(desc) < 50:
        notes.append(f'{slug}: description is only {len(desc)} characters')

    date = d['date'] or ''
    label = ''
    if re.match(r'^\d{4}-\d{2}-\d{2}$', date):
        y, m, dd = date.split('-')
        label = f'{MONTHS[int(m) - 1]} {int(dd)}, {y}'

    fm = [
        '---',
        f'title: {yq(client)}',
        f'client: {yq(client)}',
        'industry: [' + ', '.join(yq(i) for i in ind) + ']',
        # Came from the export, not written here. Relaxes the seo length
        # bounds to warnings so a client's own meta description ships at
        # whatever length they wrote it, and the overage stays reported.
        'migrated: true',
        f'publishedAt: {date}',
    ]
    if slug in FEATURED:
        fm.append('featured: true')
    if label:
        fm.append(f'dateLabel: {yq(label)}')
    fm.append(f'headline: {yq(headline)}')
    hero = CURATED.get(slug) or d['hero']
    if hero:
        fm.append(f'heroImage: {yq(hero)}')
        if d['hero_alt']:
            fm.append(f'heroAlt: {yq(d["hero_alt"])}')
    if about:
        fm.append(f'about: {yq(about)}')
    if d['links']:
        fm.append(f'liveUrl: {yq(d["links"][0])}')

    if d['facts']:
        fm.append('facts:')
        for x in d['facts']:
            fm.append(f'  - k: {yq(clip(x["k"], 20))}')
            fm.append(f'    v: {yq(clip(x["v"], 80))}')
    if d['blocks']:
        fm.append('blocks:')
        for b in d['blocks']:
            fm.append(f'  - heading: {yq(clip(b["heading"], 40))}')
            fm.append(f'    lead: {yq(clip(b["lead"], 300))}')
            if b['body']:
                fm.append(f'    body: {yq(clip(b["body"], 300))}')

    # Whichever image became the hero must not also appear in a strip below it.
    for key in ('gallery', 'showcase', 'screens'):
        d[key] = [g for g in d[key] if g['src'] != hero]
    for key in ('gallery', 'showcase', 'screens'):
        if d[key]:
            fm.append(f'{key}:')
            for g in d[key]:
                fm.append(f'  - src: {yq(g["src"])}')
                fm.append(f'    alt: {yq(clip(g["alt"], 120))}')

    # Count what the page will actually render, the same fields
    # validate-content counts, and flag the ones the original does not fill.
    # No padding: if the live case study is 260 words, it is 260 words, and
    # inventing the rest would be writing claims about somebody's project.
    # Counted the way validate-content counts it, including its rule that a
    # front-matter string only counts as copy when it contains a space: a
    # one-word fact value is a token, not prose. Guessing at the total instead
    # of matching that rule left one page 295 words and unflagged.
    # The CLIPPED values, which is what lands in the file. Counting the
    # unclipped source over-counted by thirty words and let a 295 word page
    # through unflagged.
    parts = [about, d['body']]
    for x in d['facts']:
        parts += [clip(x['k'], 20), clip(x['v'], 80)]
    for b in d['blocks']:
        parts += [clip(b['heading'], 40), clip(b['lead'], 300), clip(b['body'], 300)]
    counted = ' '.join(x for x in parts if x and ' ' in x)
    if len(re.findall(r"[a-z0-9']+", counted.lower())) < 300:
        fm.append('needsRewrite: true')
        notes.append(f'{slug}: under the 300 word floor, flagged needsRewrite')

    fm += [
        'seo:',
        f'  title: {yq(clip(d["seo_title"] or f"{client}: Case Study", 110))}',
        f'  description: {yq(desc)}',
        f'  primaryIntent: {yq(slug.replace("-", " "))}',
        '  schemaType: "CreativeWork"',
        # The body is the case study's own copy, machine-extracted from the
        # export and read by nobody here. Held out of the index until it is.
        'needsReview: true',
        '---',
        '',
    ]

    # The rest of the case study, which the template renders under "the long
    # version". Blocks hold the first four headed sections because that is
    # what the design draws; everything else on the original page lands here
    # rather than being dropped.
    body = (d['body'] + '\n') if d['body'] else ''
    open(os.path.join(OUT, slug + '.md'), 'w').write('\n'.join(fm) + body)
    written += 1

print(f'wrote {written} case studies to {OUT}')
if skipped:
    print(f'kept hand-authored, not overwritten: {", ".join(skipped)}')
for n in notes:
    print(f'  NOTE {n}')

stale = sorted(
    n[:-3] for n in os.listdir(OUT)
    if n.endswith('.md') and n[:-3] not in set(SLUGS)
)
if stale:
    print('\nSTALE — in src/content/projects/ but not in projects.txt:')
    for s in stale:
        print(f'    {s}.md')
    sys.exit(1)
