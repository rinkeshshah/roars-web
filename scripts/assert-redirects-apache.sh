#!/usr/bin/env bash
# Every redirect rule, exercised against a real Apache.
#
#   ./scripts/assert-redirects-apache.sh <docroot-with-.htaccess> <port>
#
# WHY A REAL SERVER. mod_rewrite ordering, [L] semantics, SetEnvIf timing and
# what %{HTTP_HOST} resolves to are properties of Apache, not of the text in
# the file. Three defects in this config were found only by asking a server:
# a missing-file PDF growing a trailing slash, an [NC] host match that would
# have looped, and rule 7 hardcoding www so that every host — dev included —
# was dragged to production.
set -uo pipefail
ROOT="${1:?docroot}"; PORT="${2:?port}"
pass=0; fail=0

# A dev build is behind HTTP Basic auth. mod_rewrite runs in the translate
# phase, before auth, so redirects answer without credentials — but anything
# expected to return a BODY (200) needs them. Pass them in when testing a dev
# docroot: AUTH=user:pass ./scripts/assert-redirects-apache.sh …
AUTHARG=()
[ -n "${AUTH:-}" ] && AUTHARG=(-u "$AUTH")
P() { curl -s -o /dev/null "${AUTHARG[@]}" -H "Host: ${2:-www.roarsinc.com}" -w "%{http_code}|%{redirect_url}" "http://127.0.0.1:$PORT$1"; }
chk() { # path expected-code [expected-location] [host]
  local g; g=$(P "$1" "${4:-}")
  local c=${g%%|*} d=${g#*|}
  if [ "$c" = "$2" ] && { [ -z "${3:-}" ] || [ "$d" = "$3" ]; }; then
    pass=$((pass+1))
  else
    fail=$((fail+1)); echo "  FAIL  $1  host=${4:-www.roarsinc.com}"
    echo "        got    $c $d"
    echo "        wanted $2 ${3:-}"
  fi
}
# No redirect may name $2. Requires a real response first: an earlier version
# of this counted a dead server as a pass, because "no response" contains no
# hostname either. A check that goes green when nothing is listening is worse
# than no check.
chk_no_host() { local g; g=$(P "$1" "$3"); local c=${g%%|*} d=${g#*|}
  if [ "$c" = "000" ] || [ -z "$c" ]; then
    fail=$((fail+1)); echo "  FAIL  $1 host=$3 — no response from the server"
    return
  fi
  case "$d" in
    *"$2"*) fail=$((fail+1)); echo "  FAIL  $1 host=$3 leaked -> $d";;
    *) pass=$((pass+1));;
  esac
}

# The server has to actually be up, or every assertion below is meaningless.
probe=$(curl -s -o /dev/null -H "Host: www.roarsinc.com" -w "%{http_code}" "http://127.0.0.1:$PORT/" || true)
# 401 means alive and password-protected, which is a dev build behaving.
if [ "$probe" = "000" ] || [ -z "$probe" ]; then
  echo "FAIL: nothing answering on 127.0.0.1:$PORT. Start Apache against $ROOT first."
  exit 1
fi

# Which build is this?
#
# Read it off the INDEXING switch, which is the thing that actually separates
# the two: PUBLIC_ALLOW_INDEXING on means a real sitemap and pages that say
# index,follow. An earlier version keyed off the dev password wall instead,
# and that was wrong twice over — the wall is a separate feature that can be
# absent from a perfectly good dev build, and when it was, every production
# assertion ran against dev and four of them failed for no reason.
if grep -q 'name="robots" content="index,follow' "$ROOT/index.html" 2>/dev/null; then
  MODE=production
else
  MODE=dev
fi
echo "=== $MODE build, docroot $ROOT ==="

H=https://www.roarsinc.com
# On dev a legacy rule keeps the requesting host; on production it names www.
if [ "$MODE" = dev ]; then LEG=https://dev.roarsinc.com; LH=dev.roarsinc.com
else LEG=$H; LH=www.roarsinc.com; fi

# --- 1. slashless -> slashed, one hop, on the site's own host --------------
for p in /about-us /work /s/mvp-development /resources/innovation-flowchart \
         /industries/retail-ecommerce-development /our-journal/loyalty-reward-program-app; do
  chk "$p" 301 "$LEG$p/" "$LH"
done

# --- 2. a sample of each legacy group, BOTH builds -------------------------
# journal
chk /our-journal/the-presidents-club-2/ 301 "$LEG/work/the-presidents-club/" "$LH"
chk /our-journal/healthcare-app-development-company/ 301 "$LEG/industries/healthcare-app-development-company/" "$LH"
# guide PDF
chk /tools/business-plan.pdf 301 "$LEG/tools/Business-plans.pdf" "$LH"
chk /tools/swot-analysis.pdf 301 "$LEG/tools/SWOT-analysis.pdf" "$LH"
# /industry/
chk /industry/on-demand-fitness-app/ 301 "$LEG/industries/on-demand-fitness-app-development/" "$LH"
chk /industry/retail-ecommerce-development/ 301 "$LEG/industries/retail-ecommerce-development/" "$LH"

# --- 3. real files must never gain a slash or move -------------------------
chk /robots.txt 200 "" "$LH"
# A dev build emits no sitemap at all — PUBLIC_ALLOW_INDEXING is what decides,
# and unset means "nothing here asks to be indexed, so there is nothing to
# list". 404 there is the build working, not a missing file.
[ "$MODE" = production ] && chk /sitemap-index.xml 200 "" "$LH"
[ "$MODE" = dev ] && chk /sitemap-index.xml 404 "" "$LH"

# --- 4. the open-redirect allowlist ---------------------------------------
# An unknown Host gets no redirect at all, and nothing may echo it back.
for h in evil.example attacker.test roarsinc.com.evil.example 10.0.0.1; do
  chk_no_host /s/mvp-development "$h" "$h"
  chk_no_host /our-journal/the-presidents-club-2/ "$h" "$h"
  chk_no_host /tools/business-plan.pdf "$h" "$h"
done
# and the allowlisted hosts still work
chk_no_host /s/mvp-development "evil" roarsinc.com.abc123.plesk.page
chk /s/mvp-development 301 "https://roarsinc.com.abc123.plesk.page/s/mvp-development/" roarsinc.com.abc123.plesk.page

# --- 5. production-only: the apex is single-hop ----------------------------
if [ "$MODE" = production ]; then
  chk / 301 "$H/" roarsinc.com
  chk /s/mvp-development 301 "$H/s/mvp-development/" roarsinc.com
  chk /industry/on-demand-fitness-app 301 "$H/industries/on-demand-fitness-app-development/" roarsinc.com
  chk /wp-admin/ 410 "" www.roarsinc.com
  chk /feed/ 200 "" www.roarsinc.com
fi

# --- 6. dev-only: nothing may leave dev ------------------------------------
if [ "$MODE" = dev ]; then
  for p in / /work/ /s/mvp-development /our-journal/the-presidents-club-2/ /industry/on-demand-fitness-app/ /tools/business-plan.pdf; do
    chk_no_host "$p" www.roarsinc.com dev.roarsinc.com
  done
fi

echo "  ---"
echo "  $pass passed, $fail failed"
[ "$fail" -eq 0 ]
