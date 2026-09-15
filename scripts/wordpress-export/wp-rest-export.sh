#!/usr/bin/env bash
#
# Pull the WordPress REST export for the v2 migration.
#
#   ./wp-rest-export.sh                       # against production
#   BASE=https://dev.roarsinc.com \
#   BASIC_USER=... BASIC_PASS=... ./wp-rest-export.sh
#
# Writes to exports/wp-export/ and prints a report of
# which post types are REST-exposed and which are not. The ones that are not
# are the only ones needing a database route.
#
# Run this from a machine that can reach the site. The build container's
# egress policy denies roarsinc.com, dev.roarsinc.com and the apex, so it
# cannot run there.

set -euo pipefail

BASE="${BASE:-https://www.roarsinc.com}"
OUT="${OUT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/exports/wp-export}"
API="$BASE/wp-json/wp/v2"
PER=100

CURL=(curl -sS --fail-with-body -m 60)
if [[ -n "${BASIC_USER:-}" ]]; then
  CURL+=(-u "${BASIC_USER}:${BASIC_PASS:-}")
fi

mkdir -p "$OUT"
echo "base : $BASE"
echo "out  : $OUT"
echo

# ---------------------------------------------------------------- types

echo "==> types.json"
"${CURL[@]}" "$API/types" -o "$OUT/types.json"

# Every type the REST API advertises, with its rest_base.
mapfile -t EXPOSED < <(
  python3 - "$OUT/types.json" <<'PY'
import json, sys
types = json.load(open(sys.argv[1]))
for slug, t in types.items():
    print(f"{slug}\t{t.get('rest_base') or slug}")
PY
)

echo "REST-exposed types:"
printf '  %s\n' "${EXPOSED[@]}"
echo

# The types the migration needs, per docs/URL-INVENTORY.csv.
# wp_type in the CSV -> the WordPress post type name.
NEEDED=(post page service industries free_stuff work)

# ------------------------------------------------------- paged collection

fetch_all() {
  local rest_base="$1" name="$2" page=1 total
  local first="$OUT/.probe-$name.json"

  # X-WP-TotalPages tells us how many requests are needed.
  total=$("${CURL[@]}" -D - -o "$first" \
      "$API/$rest_base?per_page=$PER&page=1&_embed=1" \
    | tr -d '\r' | awk 'tolower($1)=="x-wp-totalpages:"{print $2}')
  total="${total:-1}"

  echo "==> $name  ($rest_base, $total page(s))"
  mkdir -p "$OUT/$name"
  mv "$first" "$OUT/$name/page-001.json"

  while (( page < total )); do
    page=$(( page + 1 ))
    "${CURL[@]}" "$API/$rest_base?per_page=$PER&page=$page&_embed=1" \
      -o "$(printf '%s/%s/page-%03d.json' "$OUT" "$name" "$page")"
  done
}

MISSING=()

for want in "${NEEDED[@]}"; do
  base=""
  for row in "${EXPOSED[@]}"; do
    slug="${row%%$'\t'*}"
    if [[ "$slug" == "$want" ]]; then base="${row##*$'\t'}"; fi
  done

  if [[ -z "$base" ]]; then
    MISSING+=("$want")
    echo "==> $want  NOT REST-EXPOSED — needs a database route"
    continue
  fi
  fetch_all "$base" "$want"
done

# ------------------------------------------------------------- taxonomies
#
# EVERY registered taxonomy, not just the core three.
#
# The core three miss the one that matters. /resource/staff-picks/ and
# /resource/tools/ are CATEGORY ARCHIVES over the free_stuff type, each with
# its own child items, and that taxonomy is a custom one. It is not
# `categories`, so an export that pulls only core terms cannot see either the
# archives or what is filed under them.
#
# This is also why both are missing from docs/URL-INVENTORY.csv. That came
# from the six Squirrly sitemaps, and those carry the fifteen
# /resources/<slug>/ items and no taxonomy archives at all.

echo "==> taxonomies.json"
"${CURL[@]}" "$API/taxonomies" -o "$OUT/taxonomies.json"

mapfile -t TAXONOMIES < <(
  python3 - "$OUT/taxonomies.json" <<'PY'
import json, sys
tax = json.load(open(sys.argv[1]))
for slug, t in tax.items():
    types = ",".join(t.get("types") or [])
    print(f"{slug}\t{t.get('rest_base') or slug}\t{types}")
PY
)

echo "Registered taxonomies:"
printf '  %s\n' "${TAXONOMIES[@]}"
echo

for row in "${TAXONOMIES[@]}"; do
  slug="${row%%$'\t'*}"
  rest="$(printf '%s' "$row" | cut -f2)"
  fetch_all "$rest" "tax-$slug" || echo "==> $slug unavailable"
done

fetch_all users users || echo "==> users unavailable"

# --------------------------------------------- items filed under each term
#
# The child list for each archive, which is what the migration is actually
# missing. For every term of every taxonomy attached to free_stuff, pull the
# items carrying it, one file per term named for the term slug, so the
# mapping is readable without re-deriving it.

echo
echo "==> free_stuff items by term"
mkdir -p "$OUT/free_stuff-by-term"

python3 - "$OUT" "$API" "${BASIC_USER:-}" "${BASIC_PASS:-}" <<'PY'
import json, os, sys, glob, urllib.request, base64

out, api, user, pw = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

tax_file = os.path.join(out, "taxonomies.json")
if not os.path.exists(tax_file):
    print("  no taxonomies.json, skipping"); raise SystemExit(0)

taxes = json.load(open(tax_file))
# Only the taxonomies actually attached to the free_stuff type.
wanted = {s: t for s, t in taxes.items() if "free_stuff" in (t.get("types") or [])}
if not wanted:
    print("  NOTHING is attached to free_stuff. Either the type is named")
    print("  differently or its taxonomy is not REST-exposed; in that case")
    print("  the term list needs a database route, like any hidden type.")
    raise SystemExit(0)

def get(url):
    req = urllib.request.Request(url)
    if user:
        tok = base64.b64encode(f"{user}:{pw}".encode()).decode()
        req.add_header("Authorization", f"Basic {tok}")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)

for slug, t in wanted.items():
    rest = t.get("rest_base") or slug
    print(f"  taxonomy {slug} (rest_base {rest})")
    terms = []
    for f in sorted(glob.glob(os.path.join(out, f"tax-{slug}", "page-*.json"))):
        terms += json.load(open(f))
    for term in terms:
        try:
            items = get(f"{api}/free_stuff?per_page=100&{rest}={term['id']}&_embed=1")
        except Exception as e:
            print(f"    {term['slug']}: FAILED {e}")
            continue
        path = os.path.join(out, "free_stuff-by-term", f"{slug}--{term['slug']}.json")
        json.dump({"taxonomy": slug, "term": term, "items": items}, open(path, "w"), indent=2)
        print(f"    {term['slug']}: {len(items)} item(s) -> {os.path.basename(path)}")
        for it in items:
            print(f"      {it.get('link')}")
PY

# ---------------------------------------------------------------- report

{
  echo "# WordPress REST export"
  echo
  echo "Base: \`$BASE\`  ·  pulled $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "## Types the REST API exposes"
  echo
  printf '%s\n' "${EXPOSED[@]}" | awk -F'\t' '{printf "- `%s` (rest_base `%s`)\n", $1, $2}'
  echo
  echo "## Types needed by the migration but NOT exposed"
  echo
  if (( ${#MISSING[@]} == 0 )); then
    echo "None. Every type in URL-INVENTORY.csv is reachable over REST."
  else
    printf -- '- `%s` — needs a database route\n' "${MISSING[@]}"
  fi
  echo
  echo "## Record counts pulled"
  echo
  for d in "$OUT"/*/; do
    [[ -d "$d" ]] || continue
    cnt=$(python3 - "$d" <<'PY'
import json, sys, pathlib
tot = 0
for f in sorted(pathlib.Path(sys.argv[1]).glob('page-*.json')):
    try:
        tot += len(json.load(open(f)))
    except Exception:
        pass
print(tot)
PY
)
    echo "- \`$(basename "$d")\`: $cnt"
  done
} > "$OUT/EXPORT-REPORT.md"

rm -f "$OUT"/.probe-*.json
echo
echo "Report: $OUT/EXPORT-REPORT.md"
