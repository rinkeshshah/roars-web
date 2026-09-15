"""Turn extract.py's JSON into the content collection.

    python3 write.py [in-dir]        # default ./out/

Front matter only. The body is written exactly as extract.py produced it, so
if a post reads badly that is the original copy, not a paraphrase.

posts.txt is the authority, not the contents of out/. Globbing the directory
meant that dropping a slug from posts.txt left its JSON behind and this script
wrote the post back, which is how healthcare-app-development-company came back
from the dead after being cut from the migration.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
IN_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
OUT = os.path.join(HERE, '..', '..', '..', 'src/content/posts')
os.makedirs(OUT, exist_ok=True)
SLUGS = open(os.path.join(HERE, 'posts.txt')).read().split()
REWRITE = set(SLUGS[8:])

def yq(v):
    """Double-quoted YAML scalar. Escapes only what YAML requires."""
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'

written, report = 0, []
for slug in SLUGS:
    f = os.path.join(IN_DIR, slug + '.json')
    if not os.path.exists(f):
        sys.exit(f'missing {f} — run extract.py first')
    d = json.load(open(f))
    assert d['slug'] == slug, f'{f} holds {d["slug"]}'
    cats = [c for c in (d['cats'] or []) if c] or ['Our Journal']
    cats = cats[:4]
    fm = [
        '---',
        f'title: {yq(d["title"])}',
        f'publishedAt: {d["date"]}',
        'author: "Roars Technologies"',
        'categories: [' + ', '.join(yq(c) for c in cats) + ']',
        'migrated: true',
    ]
    if slug in REWRITE:
        fm.append('needsRewrite: true')
    if d['hero']:
        fm.append(f'heroImage: {yq(d["hero"])}')
        if d['hero_alt']:
            fm.append(f'heroAlt: {yq(d["hero_alt"])}')
    # A DESCRIPTION IS REQUIRED BY THE SCHEMA, so a post the export left blank
    # cannot ship an empty one. The fallback is the post's OWN OPENING PROSE,
    # trimmed at a sentence boundary: their words, selected rather than
    # written. Nothing is invented, and validate-content still reports the
    # length so the debt stays visible.
    desc = (d['desc'] or '').strip()
    desc_src = d['desc_src']
    if not desc:
        # Take prose lines in order until there is enough to work with. One
        # line is often a bare sub-heading of five words, which is under the
        # schema's 50 character floor, so this does not stop at the first.
        prose = [
            re.sub(r'[*_`]', '', ln.strip())
            for ln in d['body'].split('\n')
            if ln.strip() and not ln.lstrip().startswith(('#', '-', '!', '[', '>'))
        ]
        pool = ''
        for ln in prose:
            pool = f'{pool} {ln}'.strip()
            if len(pool) >= 200:
                break
        out = ''
        for sentence in re.findall(r'[^.!?]*[.!?]', pool):
            if len(out) + len(sentence) > 158 and len(out) >= 50:
                break
            out += sentence
        desc = (out or pool[:155]).strip()
        desc_src = 'opening prose (export had none)'
        if len(desc) < 50:
            sys.exit(
                f'{slug}: no description in the export and its opening prose is '
                f'only {len(desc)} characters. Write one by hand rather than '
                f'shipping a description that fails the schema.'
            )

    fm += [
        'seo:',
        f'  title: {yq(d["title"] + " | Roars")}',
        f'  description: {yq(desc)}',
        f'  primaryIntent: {yq(slug.replace("-", " "))}',
        '  schemaType: "BlogPosting"',
        '---',
        '',
    ]
    body = d['body'].strip() + '\n'
    open(os.path.join(OUT, slug + '.md'), 'w').write('\n'.join(fm) + body)
    written += 1
    report.append((slug, slug in REWRITE, desc_src))
print(f'wrote {written} posts to {OUT}')

# Anything in the collection that posts.txt no longer names is stale.
stale = sorted(
    n[:-3] for n in os.listdir(OUT)
    if n.endswith('.md') and n[:-3] not in set(SLUGS)
)
if stale:
    print('\nSTALE — in src/content/posts/ but not in posts.txt:')
    for s2 in stale:
        print(f'    {s2}.md')
    print('    Delete them, or add the slug back to posts.txt.')
    sys.exit(1)
