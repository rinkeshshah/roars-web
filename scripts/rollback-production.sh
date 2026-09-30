#!/usr/bin/env bash
# Put production back on an earlier build, without rewriting its history.
#
#   ./scripts/rollback-production.sh <sha-to-restore>
#   ./scripts/rollback-production.sh 77061408          # the footer build
#
# WHY NOT JUST FORCE-PUSH BACK.
#
# docs/DEPLOYMENT.md: Plesk PULLS this branch. A pull only succeeds if the
# branch can fast-forward, so resetting `production` to an older commit and
# forcing it leaves the server refusing the pull and silently sitting on the
# build you were trying to get rid of — with GitHub showing the rollback as
# done. That failure mode has already cost this project a day once, on the
# `deploy` branch, and it is invisible from the outside.
#
# So a rollback here moves FORWARD to an older TREE. The new commit's content
# is byte-for-byte the build you name; only the history grows. The server
# fast-forwards onto it like any other deploy, and the rollback is itself
# revertible by running this again with the SHA you came from.
#
# It does not touch main, deploy, or your working tree.
set -euo pipefail

TARGET="${1:?usage: rollback-production.sh <sha-to-restore>}"

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
WT="$(mktemp -d)/rollback"
cleanup() { git worktree remove --force "$WT" 2>/dev/null || true; }
trap cleanup EXIT

echo "--- fetching origin/production ---"
for i in 1 2 3 4; do
  git fetch origin production && break || { echo "retry $i"; sleep $((2 ** i)); }
done
HEAD_SHA="$(git rev-parse FETCH_HEAD)"

# Resolve and sanity-check the target BEFORE touching anything. A typo here
# would otherwise publish an empty or unrelated tree to the live site.
TARGET_SHA="$(git rev-parse --verify "${TARGET}^{commit}")"
git merge-base --is-ancestor "$TARGET_SHA" "$HEAD_SHA" || {
  echo "REFUSING: $TARGET is not an ancestor of the current production head."
  echo "  production head : $HEAD_SHA"
  echo "  target          : $TARGET_SHA"
  echo "That is not a rollback. Check the SHA."
  exit 1
}
git cat-file -e "$TARGET_SHA:index.html" 2>/dev/null || {
  echo "REFUSING: $TARGET has no index.html. That is not a built site."
  exit 1
}

echo "--- production $HEAD_SHA  ->  tree of $TARGET_SHA ---"
git log --oneline -1 "$TARGET_SHA"

git worktree add --detach "$WT" "$HEAD_SHA"
cd "$WT"
git checkout -qB production "$HEAD_SHA"

# Replace the tree wholesale: `git rm` first so files ADDED since the target
# become deletions in the commit rather than surviving as stale files the
# server keeps serving.
git rm -rq --ignore-unmatch . >/dev/null
git checkout "$TARGET_SHA" -- .
git add -A

if git diff --cached --quiet; then
  echo "production already matches $TARGET_SHA. Nothing to roll back."
  exit 0
fi

git -c user.email=rinkesh.shah@roarsinc.com -c user.name="Rinkesh Shah" \
  commit -qm "Roll back production to the build at $TARGET_SHA

Content restored byte-for-byte from that commit. History moves forward
rather than backward, because Plesk pulls this branch and a pull only
succeeds on a fast-forward. Re-run this script with $HEAD_SHA to undo."

echo "--- pushing (fast-forward, no force) ---"
for i in 1 2 3 4; do
  git push origin production && break || { echo "retry $i"; sleep $((2 ** i)); }
done

NEW="$(git rev-parse HEAD)"
echo
echo "rolled back: production is now $NEW, serving the tree of $TARGET_SHA"
echo "Pull it in Plesk. To undo this rollback:"
echo "  ./scripts/rollback-production.sh $HEAD_SHA"
