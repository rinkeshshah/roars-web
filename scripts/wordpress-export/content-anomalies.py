#!/usr/bin/env python3
"""
Title-versus-body vocabulary check over the WordPress REST export.

    python3 content-anomalies.py ../wp-export ../content-anomalies.md

Post 15170 is the known case: its title, excerpt and body are three different
articles. The check that would have caught it is vocabulary overlap. If the
meaningful words in a title barely appear in its body, the two are probably
not the same article.

Flags a post when title-in-body coverage is under 20 percent. Also reports,
separately and without flagging:

  - title vs excerpt, and excerpt vs body, since 15170 diverges on all three
  - posts under 300 words, which the handoff wants for the Phase 7
    consolidation list
  - duplicate and near-duplicate titles

Reports only. Changes nothing.
"""

from __future__ import annotations

import html
import json
import pathlib
import re
import sys
from collections import defaultdict

THRESHOLD = 0.20
MIN_WORDS = 300

# Words carried by almost every title and body, so their overlap says nothing.
STOP = set("""
a an and are as at be but by for from has have how i if in into is it its of
on or that the their they this to was were what when where which who why will
with you your our we us can do does not no more most other some such than then
these those about after before over under between during above below out up
down off again further once here there all any both each few nor only own same
so too very s t just don should now
""".split())

WORD = re.compile(r"[a-z0-9']+")
TAG = re.compile(r"<[^>]+>")
SCRIPT_STYLE = re.compile(r"<(script|style)\b.*?</\1>", re.S | re.I)


def strip_html(raw: str) -> str:
    """Rendered REST HTML to plain text. Elementor markup is div soup, so the
    tags carry no meaning and are simply removed."""
    if not raw:
        return ""
    raw = SCRIPT_STYLE.sub(" ", raw)
    raw = TAG.sub(" ", raw)
    return html.unescape(raw)


def tokens(text: str) -> list[str]:
    return [w for w in WORD.findall(text.lower()) if w not in STOP and len(w) > 2]


def coverage(a: str, b: str) -> float:
    """Share of a's distinct meaningful words that also occur in b.

    Directional on purpose. A short title inside a long body should score
    high; the reverse is meaningless."""
    av, bv = set(tokens(a)), set(tokens(b))
    if not av:
        return 1.0  # nothing to check, do not flag
    return len(av & bv) / len(av)


def load(export_dir: pathlib.Path) -> list[dict]:
    docs = []
    for coll in sorted(p for p in export_dir.iterdir() if p.is_dir()):
        if coll.name in {"categories", "tags", "users"}:
            continue
        for page in sorted(coll.glob("page-*.json")):
            try:
                items = json.load(open(page))
            except (json.JSONDecodeError, OSError) as e:
                print(f"skip {page}: {e}", file=sys.stderr)
                continue
            if not isinstance(items, list):
                continue
            for it in items:
                docs.append({
                    "collection": coll.name,
                    "id": it.get("id"),
                    "slug": it.get("slug", ""),
                    "link": it.get("link", ""),
                    "title": strip_html((it.get("title") or {}).get("rendered", "")),
                    "excerpt": strip_html((it.get("excerpt") or {}).get("rendered", "")),
                    "body": strip_html((it.get("content") or {}).get("rendered", "")),
                    "date": it.get("date", ""),
                    "modified": it.get("modified", ""),
                })
    return docs


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    export_dir = pathlib.Path(sys.argv[1])
    out_path = pathlib.Path(sys.argv[2])

    if not export_dir.is_dir():
        print(f"No export at {export_dir}. Run wp-rest-export.sh first.", file=sys.stderr)
        return 1

    docs = load(export_dir)
    if not docs:
        print(f"No documents found under {export_dir}.", file=sys.stderr)
        return 1

    flagged, thin = [], []
    for d in docs:
        d["words"] = len(WORD.findall(d["body"].lower()))
        d["t_body"] = coverage(d["title"], d["body"])
        d["t_exc"] = coverage(d["title"], d["excerpt"]) if d["excerpt"] else None
        d["e_body"] = coverage(d["excerpt"], d["body"]) if d["excerpt"] else None

        if d["words"] and d["t_body"] < THRESHOLD:
            flagged.append(d)
        if d["words"] < MIN_WORDS:
            thin.append(d)

    flagged.sort(key=lambda d: d["t_body"])
    thin.sort(key=lambda d: d["words"])

    by_title = defaultdict(list)
    for d in docs:
        key = " ".join(sorted(set(tokens(d["title"]))))
        if key:
            by_title[key].append(d)
    dupes = [v for v in by_title.values() if len(v) > 1]

    pct = lambda v: "n/a" if v is None else f"{v * 100:.0f}%"

    L = []
    L.append("# Content anomalies")
    L.append("")
    L.append(f"Generated from `{export_dir}` over {len(docs)} documents. "
             "Report only, nothing was changed.")
    L.append("")
    L.append("## Method")
    L.append("")
    L.append("For each document, the share of distinct meaningful words in the title that "
             "also appear in the body. Stopwords and words of three characters or fewer are "
             "dropped, so the score reflects subject matter rather than grammar. Under "
             f"{THRESHOLD:.0%} is flagged: a title whose vocabulary is largely absent from its "
             "own body usually means the two are different articles.")
    L.append("")
    L.append("The excerpt columns are shown for context, not used for flagging. Post 15170 "
             "diverges on all three pairings, which is what makes it distinctive.")
    L.append("")

    L.append(f"## Flagged: title/body coverage under {THRESHOLD:.0%}")
    L.append("")
    if not flagged:
        L.append("None.")
    else:
        L.append(f"{len(flagged)} document(s).")
        L.append("")
        L.append("| ID | Collection | Title/body | Title/excerpt | Excerpt/body | Words | Slug |")
        L.append("|---|---|---|---|---|---|---|")
        for d in flagged:
            L.append(f"| {d['id']} | {d['collection']} | **{pct(d['t_body'])}** | "
                     f"{pct(d['t_exc'])} | {pct(d['e_body'])} | {d['words']} | `{d['slug']}` |")
        L.append("")
        L.append("### Detail")
        L.append("")
        for d in flagged:
            L.append(f"#### {d['id']} — `{d['slug']}`")
            L.append("")
            L.append(f"- Collection: {d['collection']}")
            L.append(f"- URL: {d['link']}")
            L.append(f"- Published {d['date']}, modified {d['modified']}")
            L.append(f"- Title: {d['title']!r}")
            if d["excerpt"]:
                ex = d["excerpt"].strip()
                L.append(f"- Excerpt: {(ex[:240] + '…') if len(ex) > 240 else ex!r}"
                         if len(ex) <= 240 else f"- Excerpt: {ex[:240]!r}…")
            body = " ".join(d["body"].split())
            L.append(f"- Body opens: {body!r}" if len(body) <= 240
                     else f"- Body opens: {body[:240]!r}…")
            L.append("")

    L.append(f"## Thin: under {MIN_WORDS} words")
    L.append("")
    L.append("Not an error. This is the Phase 7 consolidation shortlist, and the publish "
             f"gate in `src/fields/seo.ts` blocks anything under {MIN_WORDS} words, so these "
             "cannot be republished as they stand.")
    L.append("")
    if not thin:
        L.append("None.")
    else:
        L.append(f"{len(thin)} document(s).")
        L.append("")
        L.append("| ID | Collection | Words | Slug |")
        L.append("|---|---|---|---|")
        for d in thin:
            L.append(f"| {d['id']} | {d['collection']} | {d['words']} | `{d['slug']}` |")
    L.append("")

    L.append("## Duplicate or near-duplicate titles")
    L.append("")
    L.append("Same meaningful vocabulary in the title, ignoring word order. Cross-check "
             "against the cannibalisation clusters in `docs/URL-INVENTORY-FINDINGS.md`.")
    L.append("")
    if not dupes:
        L.append("None.")
    else:
        for group in dupes:
            L.append(f"- {group[0]['title']!r}")
            for d in group:
                L.append(f"  - `{d['id']}` {d['link']}")
    L.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(L) + "\n")

    print(f"{len(docs)} documents  ·  {len(flagged)} flagged  ·  {len(thin)} thin  "
          f"·  {len(dupes)} duplicate-title groups")
    print(f"-> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
