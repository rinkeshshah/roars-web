#!/usr/bin/env python3
"""
Is the source we exported from actually current?

    python3 compare-freshness.py ../../exports/wp-export ../../docs/URL-INVENTORY.csv

URL-INVENTORY.csv was built by crawling the six live Squirrly sitemaps on
production on 13 Sep 2026, and 116 of its 194 rows carry a real `lastmod`.
That makes it a production reference point we can diff any export against.

Reports:

  - URLs in the inventory but missing from the export (content the source
    does not have)
  - URLs in the export but not in the inventory (drafts, new content, or
    URLs production does not publish)
  - Per-URL date drift, where the export's `modified` predates production's
    `lastmod`

If the drift is widespread, the export is behind production and anything
derived from it, including the Squirrly meta, is indicative rather than
authoritative.
"""

from __future__ import annotations

import csv
import json
import pathlib
import sys
from datetime import date, datetime


def norm(url: str) -> str:
    """Compare on path alone, so host and scheme differences do not matter."""
    if not url:
        return ""
    for sep in ("://",):
        if sep in url:
            url = url.split(sep, 1)[1]
            url = url[url.find("/"):] if "/" in url else "/"
    return "/" + url.strip("/") + "/" if url.strip("/") else "/"


def as_date(v: str) -> date | None:
    if not v:
        return None
    v = v.strip().replace("Z", "").split("+")[0]
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(v, fmt).date()
        except ValueError:
            continue
    return None


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    export_dir = pathlib.Path(sys.argv[1])
    inventory = pathlib.Path(sys.argv[2])

    if not export_dir.is_dir():
        print(f"No export at {export_dir}. Run wp-rest-export.sh first.", file=sys.stderr)
        return 1

    exported: dict[str, dict] = {}
    for coll in sorted(p for p in export_dir.iterdir() if p.is_dir()):
        if coll.name in {"categories", "tags", "users"}:
            continue
        for page in sorted(coll.glob("page-*.json")):
            try:
                items = json.load(open(page))
            except (json.JSONDecodeError, OSError):
                continue
            if not isinstance(items, list):
                continue
            for it in items:
                key = norm(it.get("link", ""))
                if key:
                    exported[key] = {
                        "id": it.get("id"),
                        "collection": coll.name,
                        "modified": as_date(it.get("modified", "")),
                    }

    live: dict[str, dict] = {}
    with open(inventory, newline="") as fh:
        for row in csv.DictReader(fh):
            key = norm(row.get("url", ""))
            if key:
                live[key] = {
                    "lastmod": as_date(row.get("lastmod", "")),
                    "wp_type": row.get("wp_type", ""),
                }

    missing = sorted(k for k in live if k not in exported)
    extra = sorted(k for k in exported if k not in live)

    behind = []
    for k in sorted(set(live) & set(exported)):
        lm, mod = live[k]["lastmod"], exported[k]["modified"]
        if lm and mod and mod < lm:
            behind.append((k, mod, lm, (lm - mod).days))
    behind.sort(key=lambda r: -r[3])

    comparable = sum(1 for k in set(live) & set(exported)
                     if live[k]["lastmod"] and exported[k]["modified"])

    print("--- freshness vs production (URL-INVENTORY.csv, crawled 13 Sep 2026) ---")
    print(f"inventory URLs        : {len(live)}")
    print(f"exported URLs         : {len(exported)}")
    print(f"comparable on dates   : {comparable}")
    print()
    print(f"missing from export   : {len(missing)}")
    for k in missing[:25]:
        print(f"    {k}  ({live[k]['wp_type']})")
    if len(missing) > 25:
        print(f"    … and {len(missing) - 25} more")
    print()
    print(f"not in the inventory  : {len(extra)}")
    for k in extra[:25]:
        print(f"    {k}  ({exported[k]['collection']})")
    if len(extra) > 25:
        print(f"    … and {len(extra) - 25} more")
    print()
    print(f"export behind prod    : {len(behind)}")
    for k, mod, lm, days in behind[:25]:
        print(f"    {k}\n        export {mod}  <  prod {lm}   ({days} days behind)")
    if len(behind) > 25:
        print(f"    … and {len(behind) - 25} more")
    print()

    if not missing and not behind:
        print("VERDICT: the export matches production on everything comparable. Trust it.")
    elif comparable and len(behind) / comparable > 0.1:
        print("VERDICT: widespread drift. This source is BEHIND production. Treat the")
        print("         Squirrly meta and content export as indicative, and re-pull from")
        print("         production before porting anything into Payload.")
    else:
        print("VERDICT: mostly current, with the exceptions listed above. Check those")
        print("         individually before relying on their meta.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
