"""Extract the 20 migrate-as-is journal posts from the WordPress WXR export.

    python3 extract.py path/to/export.xml [out-dir]

Writes one JSON per post to out-dir (default ./out/) plus a coverage table on
stdout. It never writes into the repo; write.py does that, so the extraction
can be inspected before anything lands.

The slug list is posts.txt: the first eight migrate as-is, the remaining twelve
are flagged needsRewrite. Order matters, do not sort it.

Nothing here invents content. Missing alt text stays missing and is reported;
a missing description is reported rather than filled in.
"""
import xml.etree.ElementTree as ET, re, csv, html, json, os, sys
NS = {'wp':'http://wordpress.org/export/1.2/','content':'http://purl.org/rss/1.0/modules/content/','excerpt':'http://wordpress.org/export/1.2/excerpt/','dc':'http://purl.org/dc/elements/1.1/'}
HERE = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) < 2:
    sys.exit('usage: extract.py path/to/export.xml [out-dir]')
X = sys.argv[1]
OUT_DIR = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'out')
SLUGS = open(os.path.join(HERE, 'posts.txt')).read().split()
WANT_ASIS, WANT_REWRITE = SLUGS[:8], SLUGS[8:]
WANT = WANT_ASIS + WANT_REWRITE

root = ET.parse(X).getroot()
posts, atts = {}, {}
for i in root.findall('./channel/item'):
    t = i.findtext('wp:post_type','',NS)
    if t == 'post': posts[i.findtext('wp:post_name','',NS)] = i
    elif t == 'attachment': atts[i.findtext('wp:post_id','',NS)] = i

sq = {}
SQ_CSV = os.path.join(HERE, '..', '..', '..', 'docs/migration/squirrly-meta.csv')
for r in csv.DictReader(open(SQ_CSV)):
    sq[r['url'].rstrip('/').split('/')[-1]] = r

def meta(it, key):
    for pm in it.findall('wp:postmeta', NS):
        if pm.findtext('wp:meta_key','',NS) == key:
            return pm.findtext('wp:meta_value','',NS) or ''
    return ''

def upload_path(url):
    """Root-relative /wp-content/uploads/... — the files are already on the
    webspace at that path, so nothing is downloaded or re-hosted."""
    m = re.search(r'(/wp-content/uploads/.*)$', url or '')
    return m.group(1) if m else ''

SHORTCODE = re.compile(r'\[/?[a-zA-Z0-9_\-]+[^\]]*\]')
def clean(body):
    """Strip Elementor/ElementsKit wrappers, shortcodes, inline styles,
    wp-block classes and data-* attributes. Keeps headings, paragraphs,
    lists, images, links. Never rewrites words."""
    notes = []
    if not body.strip(): return '', ['empty in export']
    if SHORTCODE.search(body):
        notes.append(f'{len(SHORTCODE.findall(body))} shortcode(s) stripped')
        body = SHORTCODE.sub('', body)
    # Elementor/ElementsKit containers: unwrap, never delete their text.
    before = body
    body = re.sub(r'</?(div|section|span|figure|figcaption)\b[^>]*>', '\n', body, flags=re.I)
    if before != body: notes.append('wrappers unwrapped')
    body = re.sub(r'\s(style|class|id|data-[\w-]+|srcset|sizes|loading|decoding|width|height)="[^"]*"', '', body, flags=re.I)
    body = re.sub(r"\s(style|class|id|data-[\w-]+)='[^']*'", '', body, flags=re.I)
    body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
    return body, notes

def to_markdown(h):
    """WXR bodies are mostly bare text separated by blank lines, with some
    HTML. Convert the HTML we keep; leave the rest as paragraphs.

    HEADING DEPTH IS NORMALISED, not preserved verbatim. WordPress bodies open
    at h3 or h4 with no h2 above them, which is a skipped level the moment the
    page title becomes the h1. The distinct levels a post actually uses are
    mapped onto consecutive levels starting at h2, so relative depth survives
    and the sequence never gaps. No word changes.
    """
    stack = []  # (original level, emitted level)
    def hx(m):
        lvl = int(m.group(1))
        while stack and stack[-1][0] >= lvl:
            stack.pop()
        out = min(6, stack[-1][1] + 1) if stack else 2
        stack.append((lvl, out))
        return '\n\n' + '#' * out + ' ' + m.group(2).strip() + '\n\n'
    h = re.sub(r'<h([1-6])[^>]*>(.*?)</h\1>', hx, h, flags=re.S|re.I)
    h = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: '- ' + m.group(1).strip() + '\n', h, flags=re.S|re.I)
    h = re.sub(r'</?(ul|ol)[^>]*>', '\n', h, flags=re.I)
    h = re.sub(r'<(strong|b)[^>]*>(.*?)</\1>', r'**\2**', h, flags=re.S|re.I)
    h = re.sub(r'<(em|i)[^>]*>(.*?)</\1>', r'*\2*', h, flags=re.S|re.I)
    h = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', h, flags=re.S|re.I)
    def img(m):
        tag = m.group(0)
        src = (re.search(r'src="([^"]*)"', tag) or [None,''])[1]
        alt = (re.search(r'alt="([^"]*)"', tag) or [None,''])[1]
        p = upload_path(src)
        return f'\n\n![{alt}]({p or src})\n\n'
    h = re.sub(r'<img[^>]*>', img, h, flags=re.I)
    h = re.sub(r'</?p[^>]*>', '\n\n', h, flags=re.I)
    h = re.sub(r'<br\s*/?>', '\n', h, flags=re.I)
    h = re.sub(r'<[^>]+>', '', h)
    h = html.unescape(h)
    h = re.sub(r'[ \t]+\n', '\n', h)
    # Strip leading horizontal whitespace from every line.
    #
    # WXR bodies indent their <li> elements, and that indentation survives the
    # tag stripping, so a list item came out as "\t- text". Four columns of
    # indent is a Markdown code block, which is how ten paragraphs of prose in
    # one post rendered as syntax-highlighted code. Nothing this extractor
    # produces relies on indentation: lists are flattened to one level and
    # there is no code, so removing it cannot lose meaning.
    h = re.sub(r'^[ \t]+', '', h, flags=re.M)
    h = re.sub(r'\n{3,}', '\n\n', h)
    return h.strip()

report = []
os.makedirs(OUT_DIR, exist_ok=True)
for slug in WANT:
    it = posts[slug]
    title = html.unescape(it.findtext('title','') or '')
    date = it.findtext('wp:post_date','',NS)[:10]
    mod = meta(it, '_edit_last') and ''
    raw = it.findtext('content:encoded','',NS) or ''
    cleaned, notes = clean(raw)
    md = to_markdown(cleaned)
    words = len(re.findall(r"[A-Za-z0-9'’-]+", md))

    desc = (meta(it,'rank_math_description') or '').strip()
    desc_src = 'rank_math'
    if not desc:
        desc = (sq.get(slug,{}).get('description') or '').strip(); desc_src = 'squirrly'
    if not desc:
        exc = re.sub(r'<[^>]+>','', it.findtext('excerpt:encoded','',NS) or '').strip()
        desc = exc; desc_src = 'excerpt' if exc else 'MISSING'

    tid = meta(it, '_thumbnail_id')
    hero_url = atts[tid].findtext('wp:attachment_url','',NS) if tid in atts else ''
    hero = upload_path(hero_url)
    hero_alt = ''
    if tid in atts:
        hero_alt = (meta(atts[tid], '_wp_attachment_image_alt') or '').strip()

    imgs = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', md)
    noalt = [u for a,u in imgs if not a.strip()]
    cats = [c.text for c in it.findall('category') if c.get('domain')=='category']

    report.append(dict(slug=slug, title=title, date=date, words=words, desc_src=desc_src,
                       desc_len=len(desc), hero=bool(hero), hero_alt=bool(hero_alt),
                       imgs=len(imgs), noalt=len(noalt), notes='; '.join(notes),
                       rewrite=slug in WANT_REWRITE))
    json.dump(dict(slug=slug, title=title, date=date, desc=desc, desc_src=desc_src,
                   hero=hero, hero_alt=hero_alt, cats=cats, body=md),
              open(os.path.join(OUT_DIR, slug + '.json'),'w'), indent=1)

print(f"{'slug':52} {'words':>6} {'desc':>10} {'hero':>5} {'halt':>5} {'img':>4} {'noalt':>6}  notes")
for r in report:
    print(f"{r['slug'][:52]:52} {r['words']:>6} {r['desc_src']:>10} {'Y' if r['hero'] else 'N':>5} {'Y' if r['hero_alt'] else 'N':>5} {r['imgs']:>4} {r['noalt']:>6}  {r['notes']}")
print()
print("empty/thin (<300 words):", [r['slug'] for r in report if r['words'] < 300])
print("no description:", [r['slug'] for r in report if r['desc_src']=='MISSING'])
print("no hero:", [r['slug'] for r in report if not r['hero']])
print("hero missing alt:", [r['slug'] for r in report if r['hero'] and not r['hero_alt']])
