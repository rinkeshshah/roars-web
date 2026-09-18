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
