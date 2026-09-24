# Production cutover

Everything below is run by a human. Nothing here deploys itself.

## Before you start

1. Confirm the GA4 id in `src/components/ThirdParty.astro` is the property you
   want: **G-QX2LK1FZEG**. Nothing in this repo can check that against your
   Analytics account.
2. Take the backup (see Rollback). Do not skip this because the WordPress site
   is "still there" — the deploy replaces what is in httpdocs.

## The deploy

    # 1. Build with indexing ON. This is the only difference between the two
    #    builds, it is invisible in dist/, and forgetting it publishes a site
    #    that asks Google to forget the company.
    PUBLIC_ALLOW_INDEXING=true npm run build

    # 2. Publish. The script refuses to push unless the build in dist/ is
    #    demonstrably the indexed one: real sitemap, homepage index,follow,
    #    Turnstile widget present, no dev host, no dev password wall.
    ./scripts/deploy-production.sh "Cutover"

That pushes `dist/` to the **`production`** branch as a fast-forward commit.

    # 3. In Plesk: Websites & Domains > roarsinc.com > Git
    #    The repository tracks `production`. Click **Pull** if automatic
    #    deployment is off. Plesk copies the branch into httpdocs.

Order matters: build, publish, pull. Publishing without step 1 is the one
mistake the script exists to stop.

## Rollback

The previous production build is the parent commit on `production`, so the
fastest rollback is one commit back:

    git fetch origin production
    git log --oneline -3 origin/production     # find the commit before this one
    git push origin <previous-sha>:production --force-with-lease

Then Pull again in Plesk. That returns the Astro site to its last good state
in under a minute, and is the right move for anything short of a disaster.

**Back to WordPress** is a different and much slower thing. The Astro site
replaced the WordPress install in httpdocs; going back needs the pre-cutover
backup restored:

  - Plesk > Websites & Domains > Backup & Restore, restore the snapshot taken
    before the cutover (files AND database — WordPress needs both).
  - Point the Git repository away from `production` first, or the next pull
    overwrites the restore.

Take that backup before step 1, not after.

## If something looks wrong but the site is up

Do not roll back for a redirect or a wrong page. Fix it in the repo, rebuild,
republish. A rollback loses every other correct thing in the same build.
