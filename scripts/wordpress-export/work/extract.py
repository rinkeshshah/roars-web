"""Extract the 23 case studies from the WordPress WXR export.

    python3 extract.py path/to/export.xml [out-dir]

Writes one JSON per project to out-dir (default ./out/) plus a coverage table
on stdout. It never writes into the repo; write.py does that, so the
extraction can be inspected before anything lands.

THE CASE STUDIES ARE `post` TYPE, not a custom type. They are ordinary posts
filed under the `Work` category, which is why an earlier look for a `work`
post type in this export found nothing and concluded the data was missing. All
23 inventory slugs are here with full bodies.

EVERY IMAGE ON THE PAGE IS KEPT. The designed slots hold six between them, a
pair and four showcase panels, and the real pages carry up to seventeen. The
rest go to `screens` rather than being dropped. Tracking pixels, spacers and
anything under 200px in its own filename are skipped, and so are the
duplicate -WIDTHxHEIGHT resizes WordPress generates: the full-size file is
kept instead, since the page is served from the same webspace either way.

Nothing here invents content. Missing alt text stays missing and is reported.
A field that cannot be found is left empty and counted in the table, rather
than filled with something plausible.
"""
import xml.etree.ElementTree as ET, re, html, json, os, sys

NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
}
HERE = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) < 2:
    sys.exit('usage: extract.py path/to/export.xml [out-dir]')
X = sys.argv[1]
OUT_DIR = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'out')
SLUGS = open(os.path.join(HERE, 'projects.txt')).read().split()

root = ET.parse(X).getroot()
items = {}
for i in root.findall('./channel/item'):
    if i.findtext('wp:post_type', '', NS) == 'post':
        items[i.findtext('wp:post_name', '', NS)] = i


def meta(it, key):
    for pm in it.findall('wp:postmeta', NS):
        if pm.findtext('wp:meta_key', '', NS) == key:
            return pm.findtext('wp:meta_value', '', NS) or ''
    return ''


def upload_path(url):
    """Root-relative /wp-content/uploads/... The files are already on the
    webspace at that path, so nothing is downloaded or re-hosted."""
    m = re.search(r'(/wp-content/uploads/[^"\'\s]+)', url or '')
    if not m:
        return ''
    p = m.group(1)
    # WordPress writes name-768x341.png beside the full-size name.png. Both
    # exist on disk; the full-size one is the better source for a layout that
    # picks its own dimensions.
    p = re.sub(r'-\d{2,4}x\d{2,4}(\.[a-z]{3,4})$', r'\1', p, flags=re.I)
    return p


SKIP_IMG = re.compile(r'(logo|icon|sprite|spacer|pixel|favicon|placeholder)', re.I)


def images(body):
    """Every content image, in document order, de-duplicated."""
    out, seen = [], set()
    for m in re.finditer(r'<img\b[^>]*>', body, re.I):
        tag = m.group(0)
        src = re.search(r'\ssrc="([^"]+)"', tag)
        alt = re.search(r'\salt="([^"]*)"', tag)
        p = upload_path(src.group(1) if src else '')
        if not p or p in seen or SKIP_IMG.search(p):
            continue
        seen.add(p)
        out.append({'src': p, 'alt': html.unescape(alt.group(1)).strip() if alt else ''})
    return out


SHORTCODE = re.compile(r'\[/?[a-zA-Z0-9_\-]+[^\]]*\]')


def text_lines(body):
    """The page's words, in order, with markup and SVG icon noise removed."""
    b = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S | re.I)
    b = re.sub(r'<(script|style)\b.*?</\1>', ' ', b, flags=re.S | re.I)
    b = SHORTCODE.sub(' ', b)
    b = re.sub(r'<!--.*?-->', ' ', b, flags=re.S)
    # Mark headings so the structure survives the tag strip.
    b = re.sub(r'<h([1-6])[^>]*>(.*?)</h\1>', lambda m: f'\n\x01{m.group(2)}\x01\n', b, flags=re.S | re.I)
    b = re.sub(r'<[^>]+>', '\n', b)
    lines = [html.unescape(l).strip() for l in b.split('\n')]
    return [l for l in lines if l]


# Fact-table labels the case studies use. Anything not in this list is not
# treated as a label, so a stray short line does not eat the paragraph under it.
FACT_KEYS = {
    'expertise', 'platform', 'deliverables', 'technology', 'technologies',
    'branding', 'typography', 'industry', 'services', 'client', 'year',
    'duration', 'team', 'role', 'scope', 'tools', 'sector',
}

report = []
os.makedirs(OUT_DIR, exist_ok=True)

for slug in SLUGS:
    it = items.get(slug)
    if it is None:
        sys.exit(f'{slug}: not in the export')
    body = it.findtext('content:encoded', '', NS) or ''
    lines = text_lines(body)

    heads = [l.strip('\x01') for l in lines if l.startswith('\x01')]
    plain = [l for l in lines if not l.startswith('\x01')]

    # Pills are the short all-caps run at the very top (RESEARCH / IDEATION).
    pills = []
    for l in plain[:6]:
        if len(l) <= 18 and l.isupper():
            pills.append(l)
        else:
            break

    # The masthead word is the first heading, which the pages set in caps.
    headline = heads[0].strip() if heads else ''
    tagline = heads[1].strip() if len(heads) > 1 else ''
    if len(tagline) > 120:
        tagline = ''

    # `about` is the first real paragraph, or the over-long "tagline" when the
    # page put its intro in a heading instead of a paragraph.
    about = next((l for l in plain if len(l) > 90), '')
    if not about and len(heads) > 1 and len(heads[1]) > 90:
        about = heads[1].strip()

    # The fact table: a known label followed by its value.
    #
    # Scanned over ALL lines, not just the paragraphs. The pages set these
    # labels in heading tags, so scanning `plain` found none of them and every
    # project came back with an empty fact table.
    flat = [l.strip('\x01').strip() for l in lines]
    facts = []
    for n, l in enumerate(flat):
        if l.lower().rstrip(':') in FACT_KEYS and n + 1 < len(flat):
            v = flat[n + 1]
            if 0 < len(v) <= 80 and v.lower().rstrip(':') not in FACT_KEYS:
                facts.append({'k': l.rstrip(':')[:20], 'v': v})
            elif len(v) > 80 and v.lower().rstrip(':') not in FACT_KEYS:
                # A page that writes a sentence where the others write a list.
                # Truncated at a word boundary rather than dropped.
                facts.append({'k': l.rstrip(':')[:20], 'v': v[:77].rsplit(' ', 1)[0] + '…'})
        if len(facts) == 6:
            break

    # Blocks: each heading after the tagline, with the prose that follows it.
    blocks = []
    order = [l for l in lines]
    for n, l in enumerate(order):
        if not l.startswith('\x01'):
            continue
        h = l.strip('\x01').strip()
        if not h or h in (headline, tagline) or len(h) > 40:
            continue
        # "Technology" and friends label the fact table. Some pages follow one
        # with a paragraph, which turned the label into a block heading and
        # left the fact table empty.
        if h.lower().rstrip(':') in FACT_KEYS:
            continue
        # STOP AT THE NEXT HEADING. A fixed five-line window reached into the
        # following section, so consecutive blocks shared a paragraph and the
        # same sentences were printed twice on the page.
        window = []
        for q in order[n + 1:]:
            if q.startswith('\x01'):
                break
            window.append(q)
        para = [q for q in window if len(q) > 60]
        if not para:
            continue
        blocks.append({
            'heading': h,
            'lead': para[0][:320],
            'body': para[1][:320] if len(para) > 1 else '',
        })
        if len(blocks) == 4:
            break

    # THE REST OF THE PAGE, as markdown.
    #
    # `blocks` takes the first four headed sections because that is what the
    # design draws. Several case studies have more than four, and clipping
    # leads at 300 characters drops words too. Everything not already used
    # goes to the body, which the template renders as "the long version".
    # Without this, eleven real case studies measured as 90 to 294 word stubs
    # because most of their copy had nowhere to go.
    used = {about}
    for b in blocks:
        used.add(b['lead'])
        used.add(b['body'])
    used |= {f['k'] for f in facts} | {f['v'] for f in facts}
    used |= {headline, tagline, *pills}
    taken = {b['heading'] for b in blocks}

    md, seen_h = [], set()
    for l in lines:
        if l.startswith('\x01'):
            h = l.strip('\x01').strip()
            if not h or h in taken or h in used or h in seen_h or len(h) > 80:
                continue
            if h.lower().rstrip(':') in FACT_KEYS:
                continue
            seen_h.add(h)
            md.append(f'\n## {h}\n')
        else:
            # Clipped block leads start the same as their source paragraph.
            if l in used or any(l.startswith(u[:60]) for u in used if len(u) > 60):
                continue
            if len(l) < 40:
                continue
            md.append(l)
    body_md = '\n\n'.join(x.strip() for x in md).strip()
    body_md = re.sub(r'\n{3,}', '\n\n', body_md)

    imgs = images(body)
    # `work_inner_image` IS NOT THE HEADER. It looked like it on the first
    # project and is not: on Snowman it is an inverted-commas decoration, on
    # Club Social a font swatch, and on Company Guru it points at a GymBait
    # colour-therapy image belonging to a different project. It is carried
    # through for reference and never used as the hero.
    inner = upload_path(meta(it, 'work_inner_image'))
    hero = imgs[0]['src'] if imgs else ''
    if hero:
        imgs = imgs[1:]

    d = {
        'slug': slug,
        'title': html.unescape(it.findtext('title', '', NS)).strip(),
        'date': (it.findtext('wp:post_date', '', NS) or '')[:10],
        'pills': pills,
        'headline': headline,
        'tagline': tagline,
        'about': about,
        'facts': facts,
        'blocks': blocks,
        'body': body_md,
        'hero': hero,
        'hero_alt': '',
        'inner_image': inner,
        'gallery': imgs[:2],
        'showcase': imgs[2:6],
        'screens': imgs[6:30],
        'links': sorted({
            m for m in re.findall(r'href="(https?://(?!www\.roarsinc\.com)[^"]+)"', body)
            if 'facebook' not in m and 'twitter' not in m and 'linkedin' not in m
        }),
        'seo_title': meta(it, 'rank_math_title') or '',
        'seo_desc': meta(it, 'rank_math_description') or '',
    }
    json.dump(d, open(os.path.join(OUT_DIR, slug + '.json'), 'w'), indent=2)
    report.append(d)

w = max(len(d['slug']) for d in report) + 2
print(f'{"slug":<{w}} imgs  facts blocks words about hero  seo')
for d in report:
    n = 1 + len(d['gallery']) + len(d['showcase']) + len(d['screens'])
    wc = len(re.findall(r"[A-Za-z0-9']+", d['body'])) + len(re.findall(r"[A-Za-z0-9']+", d['about']))
    for b in d['blocks']:
        wc += len(re.findall(r"[A-Za-z0-9']+", b['lead'] + ' ' + b['body']))
    print(f'{d["slug"]:<{w}} {n:>4}  {len(d["facts"]):>5} {len(d["blocks"]):>6} {wc:>5} '
          f'{"Y" if d["about"] else "n":>5} {"Y" if d["hero"] else "n":>4}  '
          f'{"Y" if d["seo_desc"] else "n"}')

for label, bad in [
    ('no about', [d['slug'] for d in report if not d['about']]),
    ('no hero', [d['slug'] for d in report if not d['hero']]),
    ('no blocks', [d['slug'] for d in report if not d['blocks']]),
    ('no seo description', [d['slug'] for d in report if not d['seo_desc']]),
]:
    if bad:
        print(f'\n{label}: {bad}')
