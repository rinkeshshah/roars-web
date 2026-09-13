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

for tax in categories tags users; do
  fetch_all "$tax" "$tax" || echo "==> $tax unavailable"
done

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
