#!/usr/bin/env bash
# Publish dist/ to the `deploy` branch, as a CONTINUOUS history.
#
#   npm run build && ./scripts/deploy.sh "Build: what changed"
#
# WHY THIS SCRIPT EXISTS.
#
# docs/DEPLOYMENT.md: "Plesk pulls; Actions does not push to the server." The
# webspace runs `git pull` against this branch. That only works if the branch
# can FAST-FORWARD.
#
# Earlier deploys were built by copying dist/ into a fresh `git init`, making
# one commit and force-pushing. Every one of those was an ORPHAN: no parent, no
# shared ancestry with what the server already had. A pull against a rewritten
# history is a non-fast-forward, so the server refuses it and quietly stays on
# the old build. The branch on GitHub looked correct the whole time, which is
# what made it hard to see.
#
# So: start from origin/deploy, replace the tree, commit ON TOP, push WITHOUT
# --force. If that push is ever rejected, something else moved the branch and
# that is worth looking at rather than forcing past.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
MSG="${1:-Build: $(git log --oneline -1 --format=%s)}"
WT="$(mktemp -d)/deploy"

[ -d dist ] || { echo "no dist/. Run npm run build first."; exit 1; }
[ -f dist/index.html ] || { echo "dist/ has no index.html. Refusing."; exit 1; }

cleanup() { git worktree remove --force "$WT" 2>/dev/null || true; }
trap cleanup EXIT

echo "--- fetching origin/deploy ---"
for i in 1 2 3 4; do
  git fetch origin deploy && break || { echo "retry $i"; sleep $((2 ** i)); }
done

# Resolve to a SHA. FETCH_HEAD is a file in the main checkout, not a ref a
# worktree can branch from.
BASE="$(git rev-parse FETCH_HEAD)"

# A worktree on the real branch, so the new commit has origin/deploy as parent.
git worktree add --detach "$WT" "$BASE"
cd "$WT"
git checkout -qB deploy "$BASE"

# Replace the tree wholesale. `git rm -r` first so DELETED files are deletions
# in the commit rather than stale files the server keeps serving forever.
git rm -rq --ignore-unmatch . >/dev/null
cp -a "$ROOT/dist/." .

git add -A
if git diff --cached --quiet; then
  echo "dist/ is identical to origin/deploy. Nothing to deploy."
  exit 0
fi

git -c user.email=rinkesh.shah@roarsinc.com -c user.name="Rinkesh Shah" \
  commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"

echo "--- pushing (fast-forward, no force) ---"
for i in 1 2 3 4; do
  git push origin deploy && break || { echo "retry $i"; sleep $((2 ** i)); }
done

echo
echo "deployed $(git rev-parse --short HEAD), parent $(git rev-parse --short HEAD^)"
echo "Plesk pulls this. If the site does not change within a minute or two,"
echo "check Websites & Domains > Git in Plesk: automatic deployment must be on,"
echo "and a branch that was force-pushed in the past needs one manual Pull to"
echo "get back onto this history."
