"""Elementor page exports -> src/content/services/*.md

    python3 extract.py path/to/service-dir [--write]

Same situation as the industry pages: the service pages were built in
Elementor and are not in the WXR export at all, so the source is Elementor's
own per-page JSON — a widget tree plus the page metadata.

WHAT COMES ACROSS, VERBATIM

    seo.title, seo.description   rank_math_title / rank_math_description
    hero.statement, hero.sub     n_description_header, split at its first
                                 sentence end
    process.steps                the run of capability blocks BEFORE the
                                 featured project, which on these pages is
                                 always the "how we work" sequence
    bands[0].items               the run AFTER it, which is the what-we-offer
                                 list
    featured                     the "View Project" button with the heading
                                 and line above it
    cta / close                  get_the_file_title and get_sub_title
    the body                     everything not already shown above

WHAT IS COMPOSED: only the arrangement — which block lands in which slot, and
the short tags, which are labels cut from the blocks' own headings.

WHAT IS OMITTED: hero.pills and hero.console, and the receipts band. The
console is the AI page's prop (a fake terminal with invented run output); the
pills are four claims; receipts wants a one-line gloss per statistic. All
three would mean writing copy rather than moving it, and the template renders
only the sections it is given.
"""
import json, re, html, os, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'src', 'content', 'services')

SLUG = {
    '15181': 'ai-automation-services',
    '5462': 'digital-business-transformation-services',
    '5680': 'ecommerce-development-company',
    '5686': 'growth-hacking-agency',
    '5692': 'hire-dedicated-developers',
    '5698': 'innovation-design-company',
    '5705': 'mobile-app-development',
    '5720': 'mvp-development',
    '5756': 'product-development-company',
    '5770': 'result-oriented-devops-services',
    '5784': 'user-experience-design-agency',
    '5791': 'web-app-development',
}

# The masthead lockup: a small word over a large one, both capped at 24.
HEADLINE = {
    'ai-automation-services': ('AI', 'automation'),
    'digital-business-transformation-services': ('digital', 'transformation'),
    'ecommerce-development-company': ('ecommerce', 'development'),
    'growth-hacking-agency': ('growth', 'hacking'),
    'hire-dedicated-developers': ('dedicated', 'developers'),
    'innovation-design-company': ('innovation', 'design'),
    'mobile-app-development': ('mobile app', 'development'),
    'mvp-development': ('mvp', 'development'),
    'product-development-company': ('product', 'development'),
    'result-oriented-devops-services': ('devops', 'services'),
    'user-experience-design-agency': ('user', 'experience'),
    'web-app-development': ('web app', 'development'),
}

# Pages already built by hand against the design spec. Regenerating one would
# replace it with the machine translation, which is a downgrade.
KEEP = {'ai-automation-services'}

STOP = {'and', 'the', 'for', 'with', 'our', 'your', 'a', 'an', 'of', 'in', 'to',
        'we', 'us', 'services', 'service', 'solutions', 'solution'}


def text(v):
    s = re.sub(r'<br\s*/?>', ' ', v or '')
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


def sentences(p):
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+', p or '') if x.strip()]


def clip(s, n):
    """Whole sentences up to n, else whole words, else a hard cut."""
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
    return s[:n].rsplit(' ', 1)[0].rstrip(' ,;:') + '…'


def tags_for(heading):
    """One short label from the heading's own words."""
    for w in re.split(r'[\s/]+', heading):
        w = w.strip('&,.').upper()
        if len(w) > 2 and w.lower() not in STOP:
            return w[:28]
    return 'SERVICE'


def walk(node, out):
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
        u = (s.get('link') or {}).get('url', '') or ''
        if '/work/' in u:
            out.append(('WORK', re.sub(r'^https?://[^/]+', '', u)))
    elif wt == 'image':
        m = re.search(r'(/wp-content/uploads/.*)$', (s.get('image') or {}).get('url', '') or '')
        if m:
            out.append(('IMG', m.group(1)))
    for c in node.get('elements', []) or []:
        walk(c, out)


def pairs_of(blocks):
    """Heading then paragraph. A heading with nothing under it is a label on
    an image; a paragraph under 60 characters is a caption."""
    out = []
    for i, (k, v) in enumerate(blocks):
        if k != 'H' or len(v) < 6:
            continue
        for k2, v2 in blocks[i + 1:i + 3]:
            if k2 == 'P' and len(v2) >= 60:
                out.append((i, v, v2))
                break
            if k2 == 'H':
                break
    return out


def yq(v):
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'


def build(path):
    d = json.load(open(path))
    m = d['metadata']
    fid = os.path.basename(path).split('.')[0]
    slug = SLUG[fid]
    blocks = []
    walk(d['content'], blocks)

    service = re.split(r'\s*[|]\s*', text(m.get('rank_math_title', '')))[0].strip()

    # Hero: the opener, then the rest.
    raw = text(m.get('n_description_header', ''))
    sent = sentences(raw)
    statement = clip(sent[0] if sent else raw, 160)
    sub = clip(' '.join(sent[1:]), 120) if len(sent) > 1 else ''

    # The featured project splits the page: what comes before it is the
    # process, what comes after is the offer list. Every one of these pages is
    # laid out that way.
    work_at = next((i for i, (k, _) in enumerate(blocks) if k == 'WORK'), len(blocks))
    featured = None
    if work_at < len(blocks):
        before = [v for k, v in blocks[max(0, work_at - 3):work_at] if k in ('H', 'P')]
        if before:
            # Shorter of the two is the client name; the order varies by page.
            pair = sorted(before[:2], key=len)
            featured = (pair[0], pair[1] if len(pair) > 1 else '', blocks[work_at][1])

    pairs = pairs_of(blocks)
    proc = [(h, p) for i, h, p in pairs if i < work_at][:5]
    offer = [(h, p) for i, h, p in pairs if i > work_at][:6]
    used = {h for h, _ in proc} | {h for h, _ in offer}

    small, large = HEADLINE[slug]
    fm = [
        '---',
        f'title: {yq(text(m.get("short_title", "")).strip()[:60])}',
        'publishedAt: 2026-09-14',
        f'serviceType: {yq(service)}',
        f'eyebrow: {yq("SERVICES / " + large.upper())}',
        'headline:',
        f'  small: {yq(small)}',
        f'  large: {yq(large)}',
        f'standfirst: {yq(clip(service, 90))}',
        'hero:',
        f'  statement: {yq(statement)}',
    ]
    if sub:
        fm.append(f'  sub: {yq(sub)}')
    fm += ['  ctaLabel: "Shall we chat?"', '  ctaHref: "https://meet.roarsinc.com/sales"']

    if proc:
        fm += ['process:', '  label: "HOW WE WORK"',
               f'  heading: {yq(clip(proc[0][0], 80))}', '  steps:']
        # The first pair is usually the section's own heading and intro, so it
        # titles the block rather than becoming a step of it.
        steps = proc[1:] if len(proc) > 2 else proc
        for h, p in steps:
            fm += [f'    - name: {yq(clip(h, 48))}', f'      body: {yq(clip(p, 320))}']

    if offer:
        fm += ['bands:', '  - key: "capabilities"', '    label: "WHAT WE DO"',
               f'    heading: {yq(clip(offer[0][0], 80))}', '    items:']
        items = offer[1:] if len(offer) > 2 else offer
        for h, p in items:
            fm += [f'      - tag: {yq(tags_for(h))}',
                   f'        name: {yq(clip(h, 60))}',
                   f'        body: {yq(clip(p, 320))}']

    if featured:
        client, body, href = featured
        fm += ['featured:', '  label: "FEATURED WORK"',
               f'  client: {yq(clip(client, 40))}',
               f'  body: {yq(clip(body, 320))}',
               f'  href: {yq(href)}']

    foot_title = text(m.get('get_the_file_title', ''))
    foot_sub = text(m.get('get_sub_title', ''))
    # Two pages have these the wrong way round in WordPress: the "title" holds
    # the form instruction and the "sub" holds the actual headline.
    if foot_title.lower().startswith('fill up') and foot_sub:
        foot_title, foot_sub = foot_sub, foot_title
    # The DevOps page repeats one line in both fields, so the body would be a
    # copy of its own heading. Its footer_description is the real second line.
    if foot_sub.strip().lower() == foot_title.strip().lower():
        foot_sub = text(m.get('footer_description', ''))
    if len(foot_sub) < 30:
        foot_sub = text(m.get('footer_description', '')) or foot_sub
    # The DevOps page has nothing else: both CTA fields hold the same short
    # question and the footer pair is empty. Its own SEO description is the
    # only other sentence on the page that describes the service, so that is
    # what the closing block says. Still their copy, still from this page.
    if len(foot_sub) < 30:
        foot_sub = text(m.get('rank_math_description', ''))
    fm += ['cta:',
           '  label: "Start here"',
           f'  heading: {yq(clip(foot_title, 80))}',
           f'  body: {yq(clip(foot_sub or foot_title, 200))}',
           '  ctaLabel: "Shall we chat?"',
           '  ctaHref: "https://meet.roarsinc.com/sales"']

    fm += ['seo:',
           f'  title: {yq(text(m.get("rank_math_title", ""))[:120])}',
           f'  description: {yq(text(m.get("rank_math_description", ""))[:500])}',
           f'  primaryIntent: {yq(slug.replace("-", " "))}',
           '  schemaType: "Service"',
           'migrated: true',
           '---', '']

    body_lines = []
    skip = False
    for k, v in blocks:
        if k == 'H':
            if v in used:
                skip = True
                continue
            skip = False
            body_lines.append(f'\n## {v}\n')
        elif k == 'P':
            if skip:
                skip = False
                continue
            body_lines.append(v + '\n')
        elif k == 'IMG':
            body_lines.append(f'\n![]({v})\n')
        elif k == 'WORK':
            body_lines.append(f'\n[View the project]({v})\n')
    text_body = re.sub(r'\n{3,}', '\n\n', '\n'.join(body_lines)).strip() + '\n'
    return slug, '\n'.join(fm) + text_body


if __name__ == '__main__':
    src = sys.argv[1]
    write = '--write' in sys.argv
    for f in sorted(glob.glob(os.path.join(src, '*.json'))):
        fid = os.path.basename(f).split('.')[0]
        if fid not in SLUG:
            continue
        if SLUG[fid] in KEEP:
            print(f'skipped {SLUG[fid]}.md (hand-built)')
            continue
        slug, doc = build(f)
        if write:
            open(os.path.join(OUT, slug + '.md'), 'w').write(doc)
            print(f'wrote {slug}.md  ({len(doc)} bytes)')
        else:
            print(f'--- {slug}.md ({len(doc)} bytes)')
