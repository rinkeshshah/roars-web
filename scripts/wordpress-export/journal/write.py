"""Turn extract.py's JSON into the content collection.

    python3 write.py [in-dir]        # default ./out/

Front matter only. The body is written exactly as extract.py produced it, so
if a post reads badly that is the original copy, not a paraphrase.
"""
import json, glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
IN_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
OUT = os.path.join(HERE, '..', '..', '..', 'src/content/posts')
os.makedirs(OUT, exist_ok=True)
REWRITE = set(open(os.path.join(HERE, 'posts.txt')).read().split()[8:])

def yq(v):
    """Double-quoted YAML scalar. Escapes only what YAML requires."""
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'

written, report = 0, []
for f in sorted(glob.glob(os.path.join(IN_DIR, '*.json'))):
    d = json.load(open(f))
    slug = d['slug']
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
    fm += [
        'seo:',
        f'  title: {yq(d["title"] + " | Roars")}',
        f'  description: {yq(d["desc"])}',
        f'  primaryIntent: {yq(slug.replace("-", " "))}',
        '  schemaType: "BlogPosting"',
        '---',
        '',
    ]
    body = d['body'].strip() + '\n'
    open(os.path.join(OUT, slug + '.md'), 'w').write('\n'.join(fm) + body)
    written += 1
    report.append((slug, slug in REWRITE, d['desc_src']))
print(f'wrote {written} posts to {OUT}')
