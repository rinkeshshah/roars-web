#!/usr/bin/env bash
# Publish dist/ to the `production` branch, as a CONTINUOUS history.
#
#   PUBLIC_ALLOW_INDEXING=true npm run build && ./scripts/deploy-production.sh "Launch"
#
# THIS IS scripts/deploy.sh WITH A DIFFERENT BRANCH AND ONE EXTRA REFUSAL.
#
# WHY A SECOND BRANCH AT ALL. dev and production are not the same build. The
# canonical host is hardcoded (astro.config.mjs: site), so that part is
# identical either way -- but PUBLIC_ALLOW_INDEXING is not. Unset, every page
# ships `noindex, nofollow`, robots.txt says "no sitemap while noindexed" and
# no sitemap is emitted at all. That is the correct posture for dev and it is
# the wrong one for a live site, so the two cannot share a branch. dev keeps
# `deploy`, built with the switch off; production gets this one, built with it
# on.
#
# THE REFUSAL BELOW IS THE POINT OF THIS FILE. The difference between the two
# builds is one environment variable, it is invisible in dist/ unless you go
# looking, and forgetting it does not fail anything -- it publishes a site that
# asks Google to forget the company. So this refuses to push unless the build
# in dist/ is demonstrably the indexed one: a real sitemap, and a homepage that
# says index,follow. Checked here rather than trusted from the shell that ran
# the build, because the whole failure mode is a human being sure they set it.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
BRANCH=production
MSG="${1:-Production build: $(git log --oneline -1 --format=%s)}"
WT="$(mktemp -d)/production"

[ -d dist ] || { echo "no dist/. Run PUBLIC_ALLOW_INDEXING=true npm run build first."; exit 1; }
[ -f dist/index.html ] || { echo "dist/ has no index.html. Refusing."; exit 1; }

# --- the indexed-build assertions ------------------------------------------
fail() { echo "REFUSING: $1"; echo; echo "This looks like a DEV build. Rebuild with:"; echo "  PUBLIC_ALLOW_INDEXING=true npm run build"; exit 1; }

# --- the Turnstile widget -----------------------------------------------
# Its own message. The indexed-build fail() above tells you to set
# PUBLIC_ALLOW_INDEXING, which is the wrong advice for this failure and is
# the sort of misdirection that costs an hour.
failTs() {
  echo "REFUSING: $1"
  echo
  echo "The Turnstile widget is missing from the build. Set the SITE key in"
  echo ".env.production (gitignored) and rebuild:"
  echo "  PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...   # public, ships in the HTML"
  echo "  PUBLIC_ALLOW_INDEXING=true npm run build"
  echo
  echo "The SECRET key never goes in the repo. It belongs in"
  echo "/var/www/vhosts/roarsinc.com/private/contact-config.php on the server."
  exit 1
}
# A production build without the widget is the bug that let the bots in: the
# markup is conditional on PUBLIC_TURNSTILE_SITE_KEY, so an unset variable
# does not weaken the check, it deletes it, and nothing anywhere says so. The
# site went out that way once and nobody could have seen it from the outside.
#
# TWO CHECKS, AND THE SECOND IS THE REAL ONE. The first tells the operator
# what to fix; the second reads what is actually in dist/, because the
# variable being present in a file proves nothing about the build that
# happened. Same reasoning as the indexed-build assertions above.
#
# astro build runs in production mode, so it loads .env.production by itself.
# That file is gitignored and holds the SITE key only -- it is public, it
# ships in the HTML. The secret is never here; it lives in
# contact-config.php on the server.
if [ ! -f .env.production ]; then
  echo "REFUSING: .env.production is missing."
  echo
  echo "It must carry the Turnstile SITE key (public, ships in the HTML):"
  echo "  PUBLIC_TURNSTILE_SITE_KEY=0x4AAA..."
  echo "The SECRET key does NOT go here. It goes in contact-config.php on the server."
  exit 1
fi
grep -q '^PUBLIC_TURNSTILE_SITE_KEY=..*' .env.production \
  || failTs ".env.production has no PUBLIC_TURNSTILE_SITE_KEY (or it is empty)."

# Cloudflare's TEST keys, which are public and documented: 1x... always passes,
# 2x... always blocks, 3x... always challenges. On dev they are exactly right.
# On production the first is WORSE THAN NO WIDGET -- the form would look
# protected, every visitor would sail through, and every bot would too, with
# nothing in any log to say so. The same file is used for both builds, so the
# only thing standing between dev's key and a production deploy is this check.
if grep -qE '^PUBLIC_TURNSTILE_SITE_KEY=[123]x0{20}A[AB]' .env.production; then
  failTs ".env.production still holds a Cloudflare TEST site key. Those are for dev."
fi
grep -q 'data-sitekey="[123]x0\{20\}A[AB]"' dist/contact-us/index.html \
  && failTs "the build carries a Cloudflare TEST site key. Rebuild with the real one."
true

for page in dist/contact-us/index.html dist/resources/swot-analysis/index.html; do
  [ -f "$page" ] || continue
  grep -q 'cf-turnstile' "$page" \
    || failTs "$page has no Turnstile widget. The build did not see the site key."
done
grep -rq 'challenges\.cloudflare\.com' dist/contact-us/index.html \
  || failTs "the contact page does not load the Turnstile script."
echo "--- turnstile widget present in the build ---"

[ -f dist/sitemap-index.xml ] || fail "dist/sitemap-index.xml is missing."
grep -q '^Sitemap: https://www\.roarsinc\.com/sitemap-index\.xml$' dist/robots.txt \
  || fail "robots.txt does not carry the live Sitemap line."
grep -q 'name="robots" content="index,follow' dist/index.html \
  || fail "the homepage does not say index,follow."
# The dev host must not appear in anything served as content. It IS expected in
# the PHP under api/, where `str_contains(__DIR__, '/dev.roarsinc.com')` is the
# switch that stops production reading dev's secrets -- so that directory is
# excluded rather than the check being dropped.
if grep -rIl 'dev\.roarsinc\.com' dist/ --exclude-dir=api | grep -q .; then
  echo "REFUSING: dev.roarsinc.com appears outside dist/api/:"
  grep -rIl 'dev\.roarsinc\.com' dist/ --exclude-dir=api
  exit 1
fi
echo "--- indexed build confirmed: sitemap present, homepage index,follow, no dev host in content ---"

cleanup() { git worktree remove --force "$WT" 2>/dev/null || true; }
trap cleanup EXIT

echo "--- fetching origin/$BRANCH ---"
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  for i in 1 2 3 4; do
    git fetch origin "$BRANCH" && break || { echo "retry $i"; sleep $((2 ** i)); }
  done
  BASE="$(git rev-parse FETCH_HEAD)"
  git worktree add --detach "$WT" "$BASE"
  cd "$WT"
  git checkout -qB "$BRANCH" "$BASE"
  git rm -rq --ignore-unmatch . >/dev/null
else
  # First run. An orphan is correct exactly once -- after this the branch has
  # a history and every later push fast-forwards, which is what lets Plesk pull.
  echo "(branch does not exist yet; creating it)"
  git worktree add --detach "$WT" HEAD
  cd "$WT"
  git checkout -q --orphan "$BRANCH"
  git rm -rq --cached . >/dev/null 2>&1 || true
  find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
fi

cp -a "$ROOT/dist/." .

git add -A
if git diff --cached --quiet; then
  echo "dist/ is identical to origin/$BRANCH. Nothing to deploy."
  exit 0
fi

git -c user.email=rinkesh.shah@roarsinc.com -c user.name="Rinkesh Shah" \
  commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"

echo "--- pushing (fast-forward, no force) ---"
for i in 1 2 3 4; do
  git push origin "$BRANCH" && break || { echo "retry $i"; sleep $((2 ** i)); }
done

echo
echo "published $(git rev-parse --short HEAD) to $BRANCH"
echo "Plesk pulls this into httpdocs. dev is unaffected: it tracks \`deploy\`."
