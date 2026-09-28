"""Elementor page exports -> src/content/industries/*.md

    python3 extract.py path/to/industries-dir [--write]

The nine industry pages were built in Elementor, so they are not in the WXR
export at all — that file carries posts and attachments only. What we have
instead is Elementor's own per-page JSON: a widget tree plus the page's
metadata, which is where the SEO title, the SEO description, the hero
statement and the footer CTA live.

WHAT COMES ACROSS, AND WHAT DOES NOT

Everything below is lifted from the export. Nothing is written here:

    seo.title, seo.description   rank_math_title / rank_math_description
    hero.statement, hero.sub     n_description_header, split on its <strong>
    cta.footerTitle / blurb      get_the_file_title / get_sub_title
    proof.featured               the "View Project" button and the heading
                                 and paragraph beside it
    the body                     every heading and paragraph in the widget
                                 tree, in document order, images included

THE JOURNEY AND SURFACES BLOCKS ARE COMPOSED, not copied. Both are design
devices with slots the Elementor pages have no equivalent for, and the brief
is to match the restaurant page, so they are filled from the page's own
capability blocks:

    moment.name     the capability heading, shortened to the 24-char cap
    moment.lead     that capability's FIRST SENTENCE, verbatim
    moment.body     the rest of that paragraph, verbatim, trimmed to 260
    moment.tags     two labels derived from the heading's own nouns
    tab.heading     the capability heading, verbatim
    tab.points      that paragraph's sentences, verbatim, trimmed to 60

So every sentence on the page is theirs. What is mine is the ARRANGEMENT —
which capability lands in which slot, and the short names and tags, which are
labels rather than prose. Anything that would have meant writing a new
sentence was left out instead.

THE RECEIPT IS OMITTED ON EVERY PAGE. It is the restaurant hero's prop: a
table number, an order number, six line items and their prices, a total, a
payment method. None of that exists in the export, and the healthcare or
logistics equivalent would be invented patient records or invented
consignments. The template renders the hero without it.

Images keep their original /wp-content/uploads/ path, root-relative, because
the files are already on the webspace at exactly that path.
"""
import json, re, html, os, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'src', 'content', 'industries')

# Elementor file id -> the live slug, matched on short_title + rank_math_title.
SLUG = {
    '5199': 'food-restaurant-app-development',
    '5214': 'saas-application-development-services',
    '5217': 'on-demand-fitness-app-development',
    '5221': 'retail-ecommerce-development',
    '5224': 'travel-and-hospitality-app-development',
    '5227': 'concierge-app-development',
    '5230': 'logistics-transportation-app-development',
    '5233': 'education-mobile-app-development',
    '5240': 'healthcare-app-development-company',
}

# The eight sectors as the design lists them, plus the blurb each card carries.
# Fixed navigation, identical on every page; already in the restaurant file.
SECTORS = [
    ('01', 'Restaurant', 'One order, six moments, four surfaces that have to agree.', 'food-restaurant-app-development'),
    ('02', 'Fitness', 'Booking, streaks and coaching that survives week three.', 'on-demand-fitness-app-development'),
    ('03', 'eCommerce', 'Catalogue, checkout and the drop-off between them.', 'retail-ecommerce-development'),
    ('04', 'Concierge', 'Requests, members and loyalty that feels personal.', 'concierge-app-development'),
    ('05', 'Travel', 'Search, itinerary and the day the plan changes.', 'travel-and-hospitality-app-development'),
    ('06', 'Logistics', 'Compliance on the warehouse floor, not in a binder.', 'logistics-transportation-app-development'),
    ('07', 'Saas', 'Onboarding, activation and the metric behind both.', 'saas-application-development-services'),
    ('08', 'Healthcare', 'Records, appointments and rules that cannot bend.', 'healthcare-app-development-company'),
    # Nine, not eight. The design's sector list stops at Healthcare, but there
    # are nine industry pages and the nav panel says "9 SECTORS". A list that
    # cannot reach one of its own pages is a worse error than a wider grid.
    ('09', 'Education', 'Courses, cohorts and the week attention drops off.', 'education-mobile-app-development'),
]

# The headline lockup: the design sets a small word over a large one.
HEADLINE = {
    'food-restaurant-app-development': ('food &', 'restaurant'),
    'saas-application-development-services': ('cloud &', 'saas'),
    'on-demand-fitness-app-development': ('health &', 'fitness'),
    'retail-ecommerce-development': ('retail &', 'ecommerce'),
    'travel-and-hospitality-app-development': ('travel &', 'hospitality'),
    'concierge-app-development': ('members &', 'concierge'),
    'logistics-transportation-app-development': ('transport &', 'logistics'),
    'education-mobile-app-development': ('learning &', 'education'),
    'healthcare-app-development-company': ('clinics &', 'healthcare'),
    'education-mobile-app-development': ('learning &', 'education'),
}

ORDER = [s for _, _, _, s in SECTORS]


def text(v):
    """Tags out, entities decoded, whitespace collapsed. Words untouched."""
    s = re.sub(r'<br\s*/?>', ' ', v or '')
    s = re.sub(r'<[^>]+>', ' ', s)
    return dedash(re.sub(r'\s+', ' ', html.unescape(s)).strip())


DASH_RANGE = re.compile(r'(\d)\s*[\u2013\u2014]\s*(\d)')
DASH_SPACED = re.compile(r'\s*[\u2013\u2014]\s*')


def dedash(s):
    """House style: no em dashes, no en dashes used as punctuation.

    They are the surest tell that a sentence was assembled rather than
    written, and the brief for these pages asks for copy that sounds like a
    person. A number range becomes "to"; anything else becomes a comma, which
    is what the dash was standing in for. Hyphens inside words are untouched.
    """
    s = s or ''
    s = DASH_RANGE.sub(r'\1 to \2', s)
    s = DASH_SPACED.sub(', ', s)
    # A dash that opened a clause leaves a comma with nothing before it.
    s = re.sub(r'(^|[\s(])\s*,\s*', lambda m: m.group(1), s)
    return re.sub(r'\s+([,.;:!?])', r'\1', s).strip()


def upload(url):
    m = re.search(r'(/wp-content/uploads/.*)$', url or '')
    return m.group(1) if m else ''


def walk(node, out):
    """Headings, paragraphs, images and project buttons, in document order."""
    if isinstance(node, list):
        for c in node:
            walk(c, out)
        return
    if not isinstance(node, dict):
        return
    wt = node.get('widgetType') or node.get('elType')
    s = node.get('settings') or {}
    if wt == 'heading' and s.get('title'):
        out.append(('H', text(s['title'])))
    elif wt == 'text-editor' and s.get('editor'):
        out.append(('P', text(s['editor'])))
    elif wt == 'button' and s.get('text'):
        url = (s.get('link') or {}).get('url', '') or ''
        if '/work/' in url:
            out.append(('WORK', re.sub(r'^https?://[^/]+', '', url)))
    elif wt == 'image':
        u = upload((s.get('image') or {}).get('url', ''))
        if u:
            out.append(('IMG', u))
    for c in node.get('elements', []) or []:
        walk(c, out)


STOP = {'and', 'the', 'for', 'with', 'our', 'your', 'a', 'an', 'of', 'in', 'to',
        'we', 'us', 'solutions', 'solution', 'services', 'service', 'system',
        'systems', 'software', 'app', 'apps', 'development', 'based', 'management'}


def sentences(para):
    """Split on sentence ends. Abbreviations are rare in this copy."""
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+', para or '') if x.strip()]


def short_name(heading, cap=18):
    """The heading, cut to the design's cap at a word boundary.

    The design's moment names are single words — Discover, Order, Pay. These
    headings are phrases: "Medical Practice Management Solutions". Dropping
    filler words gets most of them under the cap without rewriting any of
    them; anything still over is cut at the last whole word.
    """
    words = [w for w in re.split(r'\s+', heading) if w]

    def fit(ws):
        out = ''
        for w in ws:
            nxt = (out + ' ' + w).strip()
            if len(nxt) > cap:
                break
            out = nxt
        return out

    # Whole words from the front first: "Patient Management System" keeps
    # "Patient Management", which reads like a name. Dropping filler words
    # instead gave "Patient", which reads like a truncation.
    out = fit(words)
    tail = out.split()[-1].lower().strip('&,') if out else ''
    # "Our Expertise in Healthcare Mobile App Services" cut from the front is
    # "Our Expertise in", which is a dangling preposition, not a name. When the
    # cut lands on a filler word, drop the filler and keep the real nouns.
    if out and len(out.split()) >= 2 and tail not in STOP:
        return out
    if len(words) == 1:
        return words[0][:cap]
    kept = [w for w in words if w.lower().strip('&,') not in STOP] or words
    return fit(kept) or out or words[0][:cap]


def cap1(s):
    """Upper-case the first letter only. Some headings start lowercase."""
    return s[:1].upper() + s[1:] if s else s


def tags_for(heading):
    """Two labels from the heading's own nouns. Labels, not prose."""
    words = [w.strip('&,.').upper() for w in re.split(r'\s+', heading) if len(w.strip('&,.')) > 2]
    seen, out = set(), []
    for w in words:
        if w in seen:
            continue
        seen.add(w)
        out.append(w)
        if len(out) == 2:
            break
    return out


def pairs_of(blocks):
    """Heading followed by paragraph, in order. Both must be substantial:
    a heading with no paragraph under it is a label on an image, and a
    paragraph under 60 characters is a caption."""
    out = []
    for i, (k, v) in enumerate(blocks):
        if k != 'H' or len(v) < 6:
            continue
        for k2, v2 in blocks[i + 1:i + 3]:
            if k2 == 'P' and len(v2) >= 60:
                out.append((v, v2))
                break
            if k2 == 'H':
                break
    return out


def clip(s, n):
    """Trim to a whole sentence, or failing that a whole word.

    A hard slice at n lands mid-word — "and a lot mor" — which reads as a
    bug in the page rather than a sentence that ran long.
    """
    s = (s or '').strip()
    if len(s) <= n:
        return s
    kept = ''
    for sn in sentences(s):
        if len(kept) + len(sn) + 1 > n:
            break
        kept = (kept + ' ' + sn).strip()
    if kept:
        return kept
    cut = s[:n].rsplit(' ', 1)[0].rstrip(' ,;:')
    return cut + '\u2026'


def yq(v):
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'


def build(path):
    d = json.load(open(path))
    m = d['metadata']
    fid = os.path.basename(path)[:4]
    slug = SLUG[fid]
    blocks = []
    walk(d['content'], blocks)

    # Hero: the <strong> opener is the statement, the rest is the sub.
    raw = m.get('n_description_header', '') or ''
    strong = re.search(r'<strong>(.*?)</strong>', raw, re.S)
    statement = text(strong.group(1)) if strong else ''
    sub = text(re.sub(r'<strong>.*?</strong>', '', raw, count=1, flags=re.S))
    if not statement:
        statement, sub = sub, ''

    # Featured work: the first /work/ link, with the heading above it and the
    # heading or paragraph between them as the body.
    featured = None
    for i, (k, v) in enumerate(blocks):
        if k != 'WORK':
            continue
        before = [b[1] for b in blocks[max(0, i - 3):i] if b[0] in ('H', 'P')]
        if not before:
            break
        # Which of the two is the client and which is the blurb depends on the
        # page: healthcare puts "GISAID OSS" first, saas and travel put the
        # sentence first. A client name is short and a description is not, so
        # take the shorter as the name rather than trusting the order.
        pair = sorted(before[:2], key=len)
        client, body = pair[0], (pair[1] if len(pair) > 1 else '')
        featured = (client, body, v)
        break

    # Their SEO title without the brand suffix: "Healthcare App Development
    # Company | Healthcare App Developer" -> "Healthcare App Development
    # Company". Used for serviceType and for the line under the wordmark.
    service = re.split(r'\s*[|]\s*|\s+-\s+', text(m.get('rank_math_title', '')))[0].strip()
    n = ORDER.index(slug) + 1
    small, large = HEADLINE[slug]
    fm = [
        '---',
        f'title: {yq(m.get("short_title", "").strip())}',
        'publishedAt: 2026-09-14',
        f'serviceType: {yq(service)}',
        'caseStudies: []',
        f'eyebrow: {yq(f"INDUSTRIES / {n:02d} — 09")}',
        'headline:',
        f'  small: {yq(small)}',
        f'  large: {yq(large)}',
        # The line under the wordmark. Their own SEO title, minus the brand
        # suffix — "Healthcare App Development Company".
        f'  ' if False else f'standfirst: {yq(clip(service, 90))}',
        'hero:',
        f'  statement: {yq(statement)}',
    ]
    if sub:
        fm.append(f'  sub: {yq(clip(sub, 120))}')
    fm += [
        '  ctaLabel: "Shall we chat?"',
        '  ctaHref: "https://meet.roarsinc.com/sales"',
    ]

    # The capability blocks, split between the two designed devices. Six
    # moments then four tabs, in the order the page presents them; anything
    # left over stays in the prose body below.
    pairs = pairs_of(blocks)
    used = set()
    journey, surfaces = [], []
    for h, para in pairs:
        sent = sentences(para)
        if not sent:
            continue
        if len(journey) < 6:
            journey.append((h, sent))
            used.add(h)
        elif len(surfaces) < 4:
            surfaces.append((h, sent))
            used.add(h)

    if journey:
        fm += ['journey:', '  label: "WHAT WE BUILD"',
               f'  heading: {yq(large + ", end to end")}']
        if statement:
            fm.append(f'  intro: {yq(clip(statement, 220))}')
        fm.append('  moments:')
        for i, (h, sent) in enumerate(journey, 1):
            # A lead only where there is a sentence to spare. With one
            # sentence the lead and the body would be the same words twice.
            if len(sent) > 1:
                first = sent[0]
                lead = first if len(first) <= 90 else (
                    first.split(',')[0].strip() if 20 <= len(first.split(',')[0].strip()) <= 90
                    else clip(first, 90))
                body = clip(' '.join(sent[1:]), 260)
            else:
                lead, body = '', clip(sent[0], 260)
            fm += [f'    - n: {yq(f"{i:02d}")}', f'      name: {yq(cap1(short_name(h)))}']
            if lead:
                fm.append(f'      lead: {yq(lead)}')
            fm += [f'      body: {yq(body)}',
                   '      tags: [' + ', '.join(yq(t) for t in tags_for(h)) + ']']

    if len(surfaces) >= 2:
        fm += ['surfaces:', '  label: "CAPABILITIES"',
               f'  heading: {yq(str(len(surfaces)) + " more")}',
               '  sub: "what else we bring"', '  tabs:']
        for i, (h, sent) in enumerate(surfaces, 1):
            pts = [clip(x, 60) for x in sent[:4]] or [clip(h, 60)]
            fm += [f'    - n: {yq(f"{i:02d}")}',
                   f'      name: {yq(cap1(short_name(h, 20)))}',
                   f'      heading: {yq(h[:80])}',
                   '      points:']
            fm += [f'        - {yq(pt)}' for pt in pts]

    fm += ['proof:', '  label: "PROOF"', '  heading: "Practised since 2005"', '  stats:',
           '    - n: "20"', '      suffix: "+"', '      label: "YEARS IN PRODUCT DEVELOPMENT"',
           '    - n: "250"', '      suffix: "+"', '      label: "PROJECTS DELIVERED"',
           '    - n: "96"', '      suffix: "%"', '      pct: true', '      label: "RETURNING CUSTOMERS"']
    if featured:
        client, body, href = featured
        fm += ['  featured:', '    label: "FEATURED WORK"',
               f'    client: {yq(clip(client, 40))}',
               # 160, not the schema's 220. The block is absolutely placed:
               # the body opens at top 100 in a 440px column and the View
               # Project link sits at 270, so seven lines of text reach the
               # link. clip() drops whole sentences, so this shortens the
               # teaser rather than cutting one mid-clause.
               f'    body: {yq(clip(body, 160))}',
               f'    href: {yq(href)}', '    ctaLabel: "View Project"']

    fm += ['sectors:', '  label: "WHERE ELSE WE WORK"', '  heading: "nine sectors"',
           '  intro: "Same process, different floor. Hover a sector to see what we go after first."',
           '  items:']
    for sn, sname, blurb, s in SECTORS:
        fm += [f'    - n: {yq(sn)}', f'      name: {yq(sname)}', f'      blurb: {yq(blurb)}',
               f'      href: {yq("/industries/" + s + "/")}']

    foot_title = text(m.get('get_the_file_title', ''))
    foot_blurb = text(m.get('footer_description', '')) or text(m.get('get_sub_title', ''))
    # Whole sentences up to the cap. Cutting at exactly 190 characters lands
    # mid-word and reads like a truncation bug rather than a blurb.
    if len(foot_blurb) > 190:
        kept = ''
        for sn in sentences(foot_blurb):
            if len(kept) + len(sn) + 1 > 190:
                break
            kept = (kept + ' ' + sn).strip()
        foot_blurb = kept or foot_blurb[:190].rsplit(' ', 1)[0]
    fm += ['cta:',
           f'  footerTagline: {yq(large)}',
           f'  footerTitle: {yq(clip(foot_title, 80))}',
           f'  footerBlurb: {yq(foot_blurb)}',
           '  ctaLabel: "Shall we chat?"',
           '  ctaHref: "https://meet.roarsinc.com/sales"',
           f'  heading: {yq(clip(foot_title, 80))}']

    fm += ['seo:',
           f'  title: {yq(text(m.get("rank_math_title", ""))[:120])}',
           f'  description: {yq(text(m.get("rank_math_description", ""))[:500])}',
           f'  primaryIntent: {yq(slug.replace("-", " "))}',
           '  schemaType: "Service"',
           'migrated: true',
           '---', '']

    # Body: the widget tree in order. Project buttons become links.
    body_lines = []
    skip_next_p = False
    for k, v in blocks:
        if k == 'H':
            # A capability already shown as a moment or a tab does not need
            # printing a second time further down the same page.
            if v in used:
                skip_next_p = True
                continue
            skip_next_p = False
            body_lines.append(f'\n## {v}\n')
        elif k == 'P':
            if skip_next_p:
                skip_next_p = False
                continue
            body_lines.append(v + '\n')
        elif k == 'IMG':
            body_lines.append(f'\n![]({v})\n')
        elif k == 'WORK':
            body_lines.append(f'\n[View the project]({v})\n')
    body = re.sub(r'\n{3,}', '\n\n', '\n'.join(body_lines)).strip() + '\n'
    return slug, '\n'.join(fm) + body


if __name__ == '__main__':
    src = sys.argv[1]
    write = '--write' in sys.argv
    files = sorted(glob.glob(os.path.join(src, '*.json')))
    # The restaurant page is hand-built against the design spec and carries the
    # receipt and a hand-written six-moment journey. Regenerating it would
    # replace that with the machine translation, which is a downgrade.
    KEEP = {'food-restaurant-app-development'}
    for f in files:
        if os.path.basename(f)[:4] not in SLUG:
            continue
        if SLUG[os.path.basename(f)[:4]] in KEEP:
            print(f'skipped {SLUG[os.path.basename(f)[:4]]}.md (hand-built)')
            continue
        slug, doc = build(f)
        if write:
            open(os.path.join(OUT, slug + '.md'), 'w').write(doc)
            print(f'wrote {slug}.md  ({len(doc)} bytes)')
        else:
            print(f'--- {slug}.md ({len(doc)} bytes)')
