# Deployment: Plesk, static

The server runs no application code except one PHP form endpoint. No Node,
no database for content, no CMS, no admin panel. That is deliberate and it
is the main reason this stack was chosen.

## Shape

```
GitHub push (main)
   -> Actions: npm ci, validate, build, assert URLs, browser tests
   -> scripts/deploy.sh fast-forwards dist/ onto the `deploy` branch
   -> scripts/deploy-production.sh does the same for `production`
   -> Plesk pulls `deploy` from GitHub
   -> nginx serves static files
```

The build never runs on the server. No `node_modules`, no toolchain, no build
memory spike on a box serving 15 customer subscriptions.

**Plesk pulls; Actions does not push to the server.** GitHub therefore holds no
credential for the box: no SSH key, no `PLESK_*` secrets. If the repository or
an Action were ever compromised, the blast radius stops at the repository.
Deployment is a pull the server chooses to make.

`deploy` and `production` are **continuous** branches. Each publish commits
the new `dist/` on top of what is already there and pushes without `--force`.

It used to be an orphan branch, rebuilt and force-pushed every run, and that
was a bug rather than a design: a force-push is a non-fast-forward, Plesk's
`git pull` refuses it, and the branch on GitHub goes on looking correct while
the server keeps serving the build from before the rewrite. Nothing errors.
If a publish is ever rejected now, something else moved the branch, and that
is worth looking at rather than forcing past.

## One-time Plesk setup

1. **Subscription.** Give the site its own subscription, or reuse
   `roarsinc.com` once WordPress is removed. Do not run both from the same
   document root during cutover; they will fight over `index.php` versus
   `index.html`.

2. **Document root.** Point at the directory Plesk pulls into. There is no
   `/public` indirection as there would be with Laravel.

3. **Git pull, not SSH push.** In Plesk, Websites & Domains > Git, add
   `https://github.com/rinkeshshah/roars-web` and select the **`deploy`**
   branch. The branch only appears in the dropdown once it exists on the
   remote, which it now does. Set the deployment path to the document root
   and choose automatic deployment; Plesk registers a webhook so a push to
   `deploy` triggers the pull. For a private repository, add Plesk's
   generated deploy key to the repository under Settings > Deploy keys,
   read-only.

   No key travels in the other direction. Actions never touches the server,
   and there are no `PLESK_*` secrets to create or rotate.

4. **PHP.** Needed only for the form endpoint. Keep 8.4. If the form moves
   to a Cloudflare Worker later, disable PHP for the domain entirely.

5. **MySQL.** One database, one user, `INSERT` only on the submissions table.
   No `SELECT`, no `DROP`. If the credentials leak, the worst case is junk
   rows, not a data breach.

   The scripts are in `docs/sql/`, which is the copy to paste rather than
   the one below:

   | file | when |
   |---|---|
   | `001-submissions-create.sql` | new install, run as the Plesk **admin** user |
   | `001b-submissions-create-as-db-user.sql` | the same table when you only have a Plesk database user |
   | `002-dev-reset-numbering.sql` | dev only, to clear test rows and reset the numbering |
   | `003-retention-purge.sql` | monthly, as a Plesk scheduled task |

   Run them in Plesk's Databases > phpMyAdmin, or over SSH with `mysql -u
   admin -p`, as the ADMIN user -- `roars_forms_insert` holds INSERT on one
   table and cannot create or alter anything, which is the point of it.
   Set a real password first; do not use the literal below.

   **If phpMyAdmin answers `#1044 - Access denied ... to database
   'information_schema'`,** you are signed in as a Plesk database user, not
   as admin. That account cannot create databases or users, grant, or read
   information_schema. Run `001b` instead: it makes the same table and
   checks itself with `SHOW TABLE STATUS`, which needs no extra right.
   Whatever database and user Plesk gave you is then what `contact-config.php`
   must name in `dsn`, `db_user` and `db_pass`.

   THERE IS ONLY ONE TABLE. The rate limiter is a file per IP hash under
   the system temp directory, not a row, so nothing else needs creating.

   ```sql
   CREATE DATABASE IF NOT EXISTS roars_forms
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   USE roars_forms;

   CREATE TABLE IF NOT EXISTS submissions (
     id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
     form        ENUM('contact','newsletter','guide','callback') NOT NULL,
     name        VARCHAR(190)  NOT NULL,
     email       VARCHAR(254)  NOT NULL,
     phone       VARCHAR(40)       NULL,
     message     TEXT              NULL,
     page_url    VARCHAR(500)      NULL,
     referrer    VARCHAR(500)      NULL,
     -- Retention-limited. Purge both after 90 days; see below.
     ip          VARCHAR(45)       NULL,
     user_agent  VARCHAR(255)      NULL,
     status      ENUM('new','contacted','qualified','spam')
                 NOT NULL DEFAULT 'new',
     created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (id),
     KEY idx_form_created (form, created_at),
     KEY idx_created (created_at)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

   -- THE ENQUIRY NUMBER IS THIS ID. It is printed to the visitor as #1008,
   -- carried in the acknowledgement's subject, and filed against the lead in
   -- n8n, so it starts somewhere that does not announce itself as the first
   -- enquiry the company has ever taken.
   ALTER TABLE submissions AUTO_INCREMENT = 1008;
   ```

   **On dev, delete the test rows before the ALTER.** MySQL ignores an
   AUTO_INCREMENT lower than the highest id already in the table, and it fails
   silently -- the statement succeeds and the counter does not move. `DELETE`
   alone does not reset it either, so both are needed and in this order:

   ```sql
   DELETE FROM submissions;
   ALTER TABLE submissions AUTO_INCREMENT = 1008;
   -- Confirm before submitting anything: expect 1008.
   SELECT AUTO_INCREMENT FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = 'roars_forms' AND TABLE_NAME = 'submissions';
   ```

   Dev and production number independently and both start at 1008, so the same
   number exists in both. n8n is what keeps them apart: the helper prefixes
   `DEV-` on anything forwarded from dev.roarsinc.com, decided from the path
   the code runs in, so a dev lead lands as `DEV-1008` in the shared sheet.

   The grant. `INSERT` and nothing else, on one table, from localhost only:

   ```sql
   CREATE USER 'roars_forms_insert'@'localhost'
     IDENTIFIED BY 'PUT-A-REAL-PASSWORD-HERE';

   GRANT INSERT ON roars_forms.submissions TO 'roars_forms_insert'@'localhost';

   FLUSH PRIVILEGES;
   ```

   No `SELECT`, so the endpoint cannot read back what it wrote. No `UPDATE`
   or `DELETE`, so it cannot alter history. No `DROP`. Read submissions as
   the Plesk admin user, through phpMyAdmin.

   Confirm the grant is exactly what you meant:

   ```sql
   SHOW GRANTS FOR 'roars_forms_insert'@'localhost';
   -- expect only:
   --   GRANT USAGE ON *.* TO ...
   --   GRANT INSERT ON `roars_forms`.`submissions` TO ...
   ```

   Then copy `public/api/contact-config.example.php` to
   `/var/www/vhosts/roarsinc.com/private/contact-config.php`, fill it in, and
   `chmod 600` it. Above the document root, so no browser can fetch it. The
   filled file is gitignored and must never be committed.

   **Retention.** `ip` and `user_agent` exist for abuse handling, not
   analytics. Purge them at 90 days with a Plesk scheduled task:

   ```sql
   UPDATE submissions
      SET ip = NULL, user_agent = NULL
    WHERE created_at < NOW() - INTERVAL 90 DAY
      AND (ip IS NOT NULL OR user_agent IS NOT NULL);
   ```

   That runs as the admin user, not the insert-only one.

6. **Sendy and n8n secrets.** Separate from `contact-config.php`, and
   deliberately so: that file is one environment's database and Turnstile
   credentials, and this one is the keys to two outside services with live
   lists behind them. A dev submission reaching the production Sendy list is
   not recoverable, so each environment gets its own file.

   Copy `public/api/roars-secrets.example.php` twice, into the **subscription
   root** — one level above `httpdocs`, beside the `dev.roarsinc.com` folder:

   ```
   /var/www/vhosts/roarsinc.com/roars-secrets.php       # production
   /var/www/vhosts/roarsinc.com/roars-secrets-dev.php   # dev.roarsinc.com
   ```

   `chmod 600` both. Fill in `SENDY_URL`, `SENDY_API_KEY`,
   `N8N_CONTACT_WEBHOOK` and `N8N_FORM_SECRET`. The form secret has to match
   `FORM_SECRET` in the n8n workflow character for character, or n8n rejects
   every forward. The two files are identical except the webhook:

   | | webhook |
   |---|---|
   | production | `https://n8n-wpvi.srv1477810.hstgr.cloud/webhook/roars-contact` |
   | dev | `https://n8n-wpvi.srv1477810.hstgr.cloud/webhook-test/roars-contact` |

   **Nothing is set on the server, and nothing needs to be.** `roars_cfg()`
   picks which file to read from its own path on disk: dev.roarsinc.com is
   deployed under `/var/www/vhosts/roarsinc.com/dev.roarsinc.com/`, so a copy
   of the helper running from inside that folder reads the `-dev` file and a
   copy running from `httpdocs` reads the other. This is a property of where
   the code sits, not of the request, so there is no Host header or path a
   visitor can send to make production read dev's file or the reverse.

   This replaced an `env[ROARS_SECRETS_FILE]` directive per domain. The hosting
   plan has no "Additional Apache directives" box to put one in. The variable
   is still honoured if it is ever set, but nothing sets it.

   **Confirm the split once, before the first real submission.** The failure
   mode is silent and it is the expensive direction — dev quietly reading
   production's file and posting a test lead to the live list. Drop a file at
   `dev.roarsinc.com/httpdocs/whoami.php` containing

   ```php
   <?php require __DIR__ . '/api/roars-integrations.php';
   echo str_contains(roars_cfg('N8N_CONTACT_WEBHOOK'), '/webhook-test/') ? 'DEV OK' : 'WRONG FILE';
   ```

   load it once, and **delete it**. Anything but `DEV OK` means the dev
   document root is not under a folder named `dev.roarsinc.com` and the path
   test cannot see it.

   **Nothing here is required for a form to work.** Every integration logs a
   `[roars]` line to the PHP error log and returns false on any failure; the
   visitor still gets their acknowledgement and sales@ still gets the lead.

7. **Let's Encrypt.** Standard Plesk issuance, auto-renew on.

8. **Redirects.** Nothing to paste on the production host — see the next
   section. `dist/nginx-redirects.conf` is still generated for a host that
   exposes the directives box.

## Where the rules actually live: dist/.htaccess

**On the production host, none of the nginx directives below are used.** That
Plesk hides both "Additional nginx directives" and "Additional Apache
directives", so there is nowhere to paste them. Proxy mode is on and Apache
serves the requests, so everything in this section is generated into
`dist/.htaccess` by `scripts/generate-htaccess.mjs` and ships with the build.

That file carries, in this order and for these reasons:

1. `.well-known` passed through untouched, before any rule can claim it —
   Let's Encrypt renewal fetches a file under there with no trailing slash.
2. The canonical host, testing the **host only**. Apache is behind the proxy,
   so `%{HTTPS}` reads the back-end connection and is `off` even for a request
   that arrived over TLS; a `RewriteCond %{HTTPS} off` redirect loops forever.
   HTTP→HTTPS belongs to Plesk's own checkbox, at the nginx layer.
3. The 72 exact 301s — 18 from `src/lib/redirects.mjs`, 54 from the journal
   migration map — then the 2 pattern rules they are the fallback for.
4. `/wp-content/uploads/` rewritten to `/assets/legacy/`, **before** the 410
   block, which would otherwise match `/wp-content/` and return 410 for every
   indexed image on the old site.
5. The WordPress surface, 410.
6. The trailing slash, last, so a redirect is one hop and not two.

Every redirect is `mod_rewrite`. Mixing `mod_alias`'s `Redirect` with
`RewriteRule` puts two modules in charge of one request in an order neither
file states, and the ordering here is load-bearing.

Two things the Apache version had to do differently, both found by running it
rather than by reading it:

- The trailing-slash rule names `https://www.roarsinc.com/$1/` in full. A
  relative `/$1/` makes Apache build the URL from the connection it can see,
  which behind the proxy is `http`.
- `DirectorySlash Off`, and no `!-d` condition on that rule. Astro builds
  directory-format output, so `/about-us` **is** a directory: with `!-d` the
  rewrite skipped every page on the site and `mod_dir` answered instead, with
  the same http:// problem.

Verified against a real Apache 2.4 serving the build with this `.htaccess`:
35 assertions covering the redirect map, ordering, `/api/*.php`, the denied
includes, the 410 block, legacy images, `.well-known`, headers and caching.

**It needs `AllowOverride All`** (Plesk's default for a domain). If the site
returns 500 right after deploy, that is the first thing to check.

The nginx section below is kept for a host that does expose the box.

## Required nginx directives

```nginx
# Canonical host. The Search Console property is www.
if ($host != 'www.roarsinc.com') {
  return 301 https://www.roarsinc.com$request_uri;
}

# Trailing slash, to match all 194 live URLs.
# Astro builds directory-format output, so /about-us/index.html exists.
#
# ORDER MATTERS. The 301 map from dist/nginx-redirects.conf goes ABOVE this
# rewrite: every source path in it already ends in a slash, so a legacy URL
# arriving without one would be slash-rewritten first and reach the map as a
# second hop. One redirect, not two.
rewrite ^/(.*[^/])$ /$1/ permanent;

# The WordPress surface is gone. Say so, rather than 404.
#
# 410 and not 404, and not a 301 to the homepage. A 404 means "maybe later",
# and Google recrawls it for months; a 410 means "deliberately gone" and it
# drops out much faster. Redirecting to the homepage would be a soft 404 and
# would also hand a bot scanning for logins a 200.
#
# These paths get scanned constantly whether or not WordPress was ever here,
# so this also stops the scan traffic reaching PHP at all.
location ~ ^/(wp-admin|wp-login\.php|xmlrpc\.php|wp-json|wp-includes|wp-cron\.php) {
  return 410;
}

# Indexed legacy image paths must keep resolving 200.
#
# `^~`, not a plain prefix. In nginx a regex location beats a prefix location
# regardless of which is written first, so if the 410 block above ever grows a
# broader pattern this would silently start returning 410 for every migrated
# image on the site. `^~` stops the regex matching being considered at all,
# which turns "do not break the images" from a thing to remember into a thing
# the config enforces.
location ^~ /wp-content/uploads/ {
  alias /var/www/vhosts/roarsinc.com/httpdocs/assets/legacy/;
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Security headers. HSTS only after you are certain about HTTPS everywhere.
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;

# Immutable hashed assets.
location /_astro/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML revalidates.
location ~* \.html$ {
  add_header Cache-Control "public, max-age=0, must-revalidate";
}

# Real 404 status, not a 200 with a 404 page.
error_page 404 /404.html;
```

## Security posture

What an attacker can reach: static files and one PHP endpoint.

- No deploy credential in GitHub. The server pulls; CI cannot reach it.

- No CMS login, so no brute force target
- No database queries on page render, so no injection surface on content
- No plugin ecosystem, so no supply chain to patch
- Form endpoint is ~40 lines, prepared statements only, one INSERT-only DB user
- ModSecurity and fail2ban still apply to that endpoint
- Plesk's backup covers the whole webspace, which is the entire application

Compare with what is being removed: WordPress, Elementor and 26 plugins,
each a patch surface, with an admin login exposed to the internet.

## Rollback

`git revert` on `main` and push. Actions rebuilds and fast-forwards `deploy`
and `production`, Plesk pulls them. Under two minutes, and no database state to unwind.

For an immediate rollback without waiting for a build, Plesk can pull an
earlier `deploy` commit directly from the Git panel. Plesk's own backup is the
third line.

## Post-cutover cleanup

Once the static site is stable for two weeks: archive the WordPress
database dump and `wp-content` off-server, then delete both from the
subscription. This is what brings 50 GB back under the 25 GB quota.
