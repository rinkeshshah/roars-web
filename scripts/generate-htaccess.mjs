#!/usr/bin/env node
/**
 * THE WHOLE SERVER CONFIGURATION, AS ONE .htaccess.
 *
 * This host's Plesk hides both "Additional nginx directives" and "Additional
 * Apache directives", so there is nowhere to paste dist/nginx-redirects.conf
 * or the directives block in docs/DEPLOYMENT.md. Proxy mode is on and Apache
 * serves the requests, which leaves exactly one place rules can live: a
 * .htaccess in the document root, shipped with the build.
 *
 * Everything that was going to be pasted into the panel is generated here, in
 * the order it has to run, from the same sources as before:
 *
 *   src/lib/redirects.mjs            18 exact + 2 pattern 301s
 *   docs/migration/…-redirects.conf  54 journal 301s (via the journal script)
 *   docs/DEPLOYMENT.md               trailing slash, 410s, headers, caching
 *
 * ── EVERY REDIRECT IS mod_rewrite. NOT `Redirect`. ─────────────────────────
 *
 * The journal rules used to be mod_alias `Redirect 301` lines and the rest
 * were going to be nginx `location` blocks. Mixing mod_alias and mod_rewrite
 * in one file means two modules deciding the same request in an order neither
 * file states — mod_alias and mod_rewrite run in different hooks, and which
 * one answers first is a property of Apache's internals rather than of the
 * line order you are looking at.
 *
 * Since the ordering here is load-bearing — the redirect map MUST beat the
 * trailing-slash rule or a legacy URL without a slash takes two hops — the
 * whole file is one engine. mod_rewrite, top to bottom, [L] on everything.
 * What you read is what runs.
 *
 * ── WHY THE ORDER IS WHAT IT IS ────────────────────────────────────────────
 *
 *   1. .well-known      untouched, first, before any rule can claim it.
 *   2. canonical host   one hop from the wrong host, before path rules, so a
 *                       legacy URL on the apex is host+path in a single 301.
 *   3. exact 301s       every source already ends in a slash.
 *   4. pattern 301s     after the exact ones: /industry/<slug>/ is named
 *                       individually for nine slugs and the pattern is the
 *                       fallback for everything else.
 *   5. legacy uploads   BEFORE the 410 block, or the 410 eats the images.
 *   6. WordPress 410    gone, deliberately, not "maybe later".
 *   7. trailing slash   last of the URL rules, and only for things that are
 *                       not real files — which is what keeps /api/contact.php
 *                       and /_astro/*.js and /robots.txt executing and served.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ──────────────────────────────────────────
 *
 * HTTP -> HTTPS. Apache is behind Plesk's nginx proxy, so %{HTTPS} reads the
 * BACK-END connection and is "off" for a request that arrived over TLS. A
 * naive `RewriteCond %{HTTPS} off` redirect loops forever: every hop arrives
 * at Apache looking exactly like the last one. Plesk's own "Permanent
 * SEO-safe 301 redirect from HTTP to HTTPS" checkbox does this at the nginx
 * layer, where the answer is known. Use that.
 *
 * The canonical-host rule below has the same exposure and dodges it by never
 * testing the scheme: it fires on the HOST being wrong, and sends you to the
 * right host over https. Arriving at the right host, it does not fire at all,
 * so it cannot loop whatever the proxy reports.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { redirectList, patternRedirects } from '../src/lib/redirects.mjs'
import { journalRules } from './generate-journal-htaccess.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'dist/.htaccess')
const HOST = 'www.roarsinc.com'

if (!existsSync(join(ROOT, 'dist'))) {
  console.error('generate-htaccess: no dist/. Run the build first.')
  process.exit(1)
}

/**
 * A literal path, as a RewriteRule pattern.
 *
 * RewriteRule matches a REGEX against the path with its leading slash already
 * removed, so a source is anchored ^…$ and every regex metacharacter in it is
 * escaped. The slugs here are the ones WordPress generated and they contain
 * dots and plus signs; an unescaped dot matches any character, which is how a
 * redirect map quietly acquires rules that fire on URLs nobody wrote down.
 */
const rx = (path) => {
  const body = path.replace(/^\//, '').replace(/\/$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  /* THE TRAILING SLASH IS OPTIONAL IN THE MATCH, and that saves a hop.
     Every source in both maps ends in a slash, so a legacy URL arriving
     WITHOUT one missed all of them, fell through to the trailing-slash rule,
     and came back for a second round trip to be redirected properly — two
     301s where one would do. `/?$` matches both spellings and answers with
     the real destination the first time. The destination is unaffected: it is
     always the full slashed URL. */
  return '^' + body + '/?$'
}

/** A destination, always absolute, always on the canonical host. */
const abs = (dest) => (dest.startsWith('http') ? dest : `https://${HOST}${dest}`)

const L = []
const say = (...lines) => L.push(...lines)

say(
  '# THE SERVER CONFIGURATION. Generated by scripts/generate-htaccess.mjs.',
  '# Do not edit by hand: the next build overwrites it.',
  `# Generated: ${new Date().toISOString()}`,
  '#',
  '# This Plesk hides both directives boxes, so what would have been pasted',
  '# into the panel lives here instead. Apache serves the requests (proxy',
  '# mode), so these rules are the ones that actually run.',
  '#',
  '# ORDER IS LOAD-BEARING. The 301 map runs before the trailing-slash rule,',
  '# because every source in it already ends in a slash and a slash-rewrite',
  '# first would turn one redirect into two.',
  '',
  'Options -Indexes',
  '',
  '# index.html, and index.php nowhere in the list. If a WordPress index.php',
  '# ever survives a deploy it must not be what a visitor gets served.',
  'DirectoryIndex index.html',
  '',
  '# mod_dir must not answer the missing trailing slash: it builds its',
  '# redirect from the scheme Apache can see, which behind the proxy is http.',
  '# The rewrite below does the same job and names https explicitly. Safe to',
  '# turn off only because that rule redirects first and Options -Indexes',
  '# above means a directory can never be listed.',
  'DirectorySlash Off',
  '',
  '# The branded 404. Apache serves /404.html as the BODY and keeps the',
  '# status at 404 — a LOCAL path does that; an absolute http:// URL would',
  '# turn it into a redirect and answer 200, which is a soft 404 and the one',
  '# thing this must not do.',
  'ErrorDocument 404 /404.html',
  '',
  '# 403 and 500 point at the same page, deliberately, and it is not a',
  '# cop-out: there is no 403 or 500 design, and inventing two more pages to',
  '# ship on launch day is work for a case a visitor should never reach.',
  '# What matters is that neither falls through to Plesk\'s default, which',
  '# names the panel and the server software. The status code is still the',
  '# real one; only the body is shared.',
  '#',
  '# 500 is listed for the form endpoint\'s sake. Everything else here is a',
  '# static file and cannot 500.',
  'ErrorDocument 403 /404.html',
  'ErrorDocument 500 /404.html',
  '',
)

say(...journalRules.guardedIncludes)

say(
  '<IfModule mod_rewrite.c>',
  'RewriteEngine On',
  '',
  '# 1. ACME first. Let\'s Encrypt renewal writes a file with no trailing',
  '#    slash under here and fetches it over plain HTTP; any rule below that',
  '#    touched it would break certificate renewal a month from now, which is',
  '#    the kind of breakage that arrives with no deploy to blame.',
  'RewriteRule ^\\.well-known/ - [L]',
  '',
  '# 2. One canonical host. Tests the HOST only, never the scheme: Apache is',
  '#    behind the proxy and %{HTTPS} is "off" here even for a TLS request,',
  '#    so a scheme test would loop. Arriving on the right host, this does',
  '#    not match, so there is nothing to loop on.',
  `RewriteCond %{HTTP_HOST} !^${HOST.replace(/\./g, '\\.')}$ [NC]`,
  `RewriteRule ^(.*)$ https://${HOST}/$1 [R=301,L]`,
  '',
)

/* 3. The exact map: src/lib/redirects.mjs, then the journal file. Both are
      one-to-one and both are already validated for chains and self-redirects
      by npm run validate:redirects and by the journal script's own checks. */
say(
  `# 3. Exact 301s — ${redirectList.length} from src/lib/redirects.mjs,`,
  `#    ${journalRules.safe.length} from the journal migration map.`,
)
for (const r of redirectList) {
  say(`RewriteRule ${rx(r.source)} ${abs(r.destination)} [R=301,L]`)
}
for (const r of journalRules.safe) {
  say(`RewriteRule ${rx(r.from)} ${abs(r.toPath)} [R=301,L]`)
}
say('')

if (journalRules.held.length) {
  say(
    '# HELD BACK from the journal map. Each would break a live URL.',
    ...journalRules.held.map((r) => `#   ${r.why}\n#   RewriteRule ${rx(r.from)} ${abs(r.toPath)} [R=301,L]`),
    '',
  )
}

/**
 * 4. The patterns, after the exact rules they are the fallback for.
 *
 * TRANSLATED BY HAND, AND CHECKED. These cannot be transformed blindly,
 * because RewriteRule matches the path with its LEADING SLASH ALREADY
 * STRIPPED and the nginx forms are written with it. Stripping `^/` off the
 * front of the string is right for the first pattern and silently wrong for
 * the second, whose slash is inside a capture group: `^(/.*)/attachment/…`
 * would still compile, would never match anything, and would look correct in
 * the file forever.
 *
 * So each is written out, and the list is checked against the source below.
 * A pattern added to src/lib/redirects.mjs that nobody translated fails the
 * build rather than going missing from the server.
 */
const APACHE_PATTERNS = {
  '^/industry/(.*)$': { pattern: '^industry/(.*)$', destination: '/industries/$1' },
  '^(/.*)/attachment/[^/]+/?$': { pattern: '^(.*)/attachment/[^/]+/?$', destination: '/$1/' },
}

const untranslated = patternRedirects.filter((p) => !APACHE_PATTERNS[p.pattern])
if (untranslated.length) {
  console.error('FAIL: pattern redirect(s) with no Apache translation:')
  for (const p of untranslated) console.error(`    ${p.pattern} -> ${p.destination}`)
  console.error('    Add them to APACHE_PATTERNS in scripts/generate-htaccess.mjs.')
  console.error('    RewriteRule matches the path WITHOUT its leading slash; translate accordingly.')
  process.exit(1)
}

say('# 4. Pattern 301s. After the exact map, which names the real slugs.')
for (const p of patternRedirects) {
  const a = APACHE_PATTERNS[p.pattern]
  say(`RewriteRule ${a.pattern} ${abs(a.destination)} [R=301,L]`)
}
say('')

/*
 * 4b. THE GUIDE PDFs, whose real filenames on the server are not the names
 * the emails were sent with.
 *
 * The files were never lost at the cutover — they are in httpdocs/tools/ under
 * WordPress-era names, and Linux is case-sensitive, so every download 404d.
 *
 * "IT IS A CASE MISMATCH" IS TRUE FOR NINE OF THEM AND A TRAP FOR TWO.
 * Two are differently WORDED, not differently cased:
 *
 *     business-plan.pdf          ->  Business-plans.pdf        (plural)
 *     people-connection-map.pdf  ->  People-connection.pdf     (word dropped)
 *
 * So a rule that lowercases and compares — or a single [NC] pattern — fixes
 * nine and leaves two broken, and they are the two nobody would re-test.
 *
 * TWO SOURCES PER GUIDE, and that is the point of generating this:
 *
 *   <slug>.pdf            what the emails actually contain. Every guide email
 *                         sent since launch carries this, because the old
 *                         manifest derived the filename from the slug. This is
 *                         the one that repairs mail already in people's
 *                         inboxes.
 *   lower(<real name>)    the plausible hand-typed or hand-linked form. For
 *                         the nine case-only guides this is the same string as
 *                         above and collapses away; for the two odd ones it is
 *                         a second, different rule.
 *
 * NO [NC], deliberately. A case-insensitive match would also match the
 * DESTINATION — /tools/Business-Model-canvas.pdf lowercases to the very
 * pattern that just fired — and Apache would redirect it to itself forever.
 * Matching case-sensitively means the target cannot re-enter the rule.
 *
 * BEFORE RULE 7. The trailing-slash rule only skips paths that are real files
 * (!-f), and these source names are NOT real files — that is the whole
 * problem. Left to rule 7, /tools/business-plan.pdf would 301 to
 * /tools/business-plan.pdf/ and the visitor would land on a 404 with a slash
 * on the end.
 *
 * DERIVED FROM guides.php, the same manifest contact.php reads, so this can
 * never drift from what the emails are being sent with. When the PDFs move
 * into public/tools/ under the clean slug names, the two sides agree again
 * and every rule here disappears on its own.
 */
const guidesPhp = readFileSync(join(ROOT, 'public/api/guides.php'), 'utf8')
const guideRows = [...guidesPhp.matchAll(/'([a-z0-9-]+)'\s*=>\s*\[[^\]]*?'file'\s*=>\s*'([^']+)'/gs)]
  .map((m) => ({ slug: m[1], file: m[2] }))

if (guideRows.length === 0) {
  console.error('FAIL: read no guides out of public/api/guides.php.')
  console.error('      The manifest format changed and the /tools/ redirects are now silently empty.')
  process.exit(1)
}

const toolRules = []
for (const g of guideRows) {
  const sources = new Set([`${g.slug}.pdf`, g.file.toLowerCase()])
  sources.delete(g.file) // a source identical to the target would loop
  for (const src of [...sources].sort()) {
    toolRules.push(
      `RewriteRule ^tools/${src.replace(/\./g, '\\.')}$ ${abs(`/tools/${g.file}`)} [R=301,L]`,
    )
  }
}

if (toolRules.length) {
  say(
    '# 4b. Guide PDFs: the names the emails went out with -> the names the',
    '#     files actually have. Case-sensitive on purpose (an [NC] match would',
    '#     also match the destination and loop). Two of these are word',
    '#     differences, not case: business-plan -> Business-plans, and',
    '#     people-connection-map -> People-connection.',
    ...toolRules,
    '',
  )
}

say(
  '# 5. Indexed legacy image paths, BEFORE the 410 block below — which would',
  '#    otherwise match /wp-content/ and return 410 for every migrated image',
  '#    on the site. Internal rewrite, not a redirect: the old URL keeps',
  '#    answering 200 at its own address, which is what the index expects.',
  'RewriteRule ^wp-content/uploads/(.*)$ /assets/legacy/$1 [L]',
  '',
  '# 6. The WordPress surface is gone. 410, not 404: a 404 means "maybe',
  '#    later" and gets recrawled for months; 410 means deliberately gone and',
  '#    drops out fast. Also stops the constant login-scanning traffic before',
  '#    it reaches PHP at all.',
  '#    [G] is the flag for this; it is 410 and stops the round.',
  'RewriteRule ^(wp-admin|wp-login\\.php|xmlrpc\\.php|wp-json|wp-includes|wp-cron\\.php|wp-content/(?!uploads/))(.*)$ - [G,L]',
  '',
  '# 7. Trailing slash, LAST. All 194 live URLs have one.',
  '#',
  '#    The two conditions are what keep the rest of the site working:',
  '#    !-f means a real file is served as itself, so /api/contact.php still',
  '#    executes, /robots.txt and /sitemap-0.xml are still served, and',
  '#    /_astro/*.js is not redirected into a directory that does not exist.',
  '#    !-d means an existing directory is not redirected twice.',
  '#',
  '#',
  '#    The destination is spelled out in full, and that is not tidiness.',
  '#    A relative target makes Apache build the absolute URL from the',
  '#    connection it can see, and behind the proxy that connection is plain',
  '#    HTTP — so `/$1/` answers http://, adding a hop through Plesk\'s HTTPS',
  '#    redirect, or landing the visitor on http if that is switched off.',
  '#',
  '#    AND THERE IS NO !-d CONDITION, WHICH IS THE WHOLE POINT.',
  '#    Astro builds directory-format output, so /about-us IS a directory.',
  '#    With !-d here this rule skipped every page on the site and mod_dir\'s',
  '#    DirectorySlash answered instead — which builds its Location from that',
  '#    same proxy-visible scheme. Measured: `Location: http://www.roarsinc.com/about-us/`',
  '#    with this rule sitting right there saying https. Dropping !-d hands',
  '#    the case back to this rule; DirectorySlash Off below stops mod_dir',
  '#    racing it. No loop: a path already ending in / cannot match ^(.*[^/])$.',
  '#',
  '#    AND NOTHING THAT LOOKS LIKE A FILE, which !-f does not cover.',
  '#    !-f exempts a file that EXISTS. A file that does not is the case that',
  '#    matters: /tools/business-plan.pdf, before the rules above existed,',
  '#    301d to /tools/business-plan.pdf/ — a slash welded onto a PDF, which',
  '#    then 404s. So a dead link answered with a redirect to a nonsense URL',
  '#    instead of a clean 404, and a crawler was told the nonsense URL is',
  '#    canonical. Found by putting the generated file under a real Apache and',
  '#    asking for a PDF that is not there.',
  '#    Safe to exclude: no URL in the inventory and no redirect source has a',
  '#    dot in its last path segment — checked, not assumed. Real files with',
  '#    extensions (/robots.txt, /api/contact.php, /_astro/*.js) were already',
  '#    served by the !-f line above; this only changes what happens to the',
  '#    ones that are missing.',
  'RewriteCond %{REQUEST_FILENAME} !-f',
  'RewriteCond $1 !\\.[A-Za-z0-9]{2,5}$',
  `RewriteRule ^(.*[^/])$ https://${HOST}/$1/ [R=301,L]`,
  '</IfModule>',
  '',
)

say(
  '<IfModule mod_headers.c>',
  '  # HSTS. One year, subdomains included, as asked.',
  '  #',
  '  # NO `preload` TOKEN, and that is not an oversight. Adding it is a',
  '  # submission to a list baked into browser binaries, it covers every',
  '  # subdomain of roarsinc.com forever — the dev host included — and',
  '  # removal takes months to reach users. includeSubDomains is already the',
  '  # aggressive part: from the first visit, any subdomain that is not on',
  '  # HTTPS becomes unreachable for a year rather than merely insecure.',
  '  # Worth confirming dev, mail and anything else on the domain are all',
  '  # HTTPS before this ships.',
  '  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"',
  '  Header always set X-Content-Type-Options "nosniff"',
  '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
  '  Header always set X-Frame-Options "SAMEORIGIN"',
  '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"',
  '',
  '  # The hashed asset names change when the bytes do, so a year is safe.',
  '  <FilesMatch "\\.(js|css|woff2|avif|webp|jpg|jpeg|png|svg|ico)$">',
  '    Header set Cache-Control "public, max-age=31536000, immutable"',
  '  </FilesMatch>',
  '',
  '  # HTML revalidates every time, or a deploy takes a week to be seen.',
  '  <FilesMatch "\\.html$">',
  '    Header set Cache-Control "public, max-age=0, must-revalidate"',
  '  </FilesMatch>',
  '',
  '  # Neither of these is a page, and both change without their name changing.',
  '  <FilesMatch "^(robots\\.txt|sitemap.*\\.xml|llms\\.txt)$">',
  '    Header set Cache-Control "public, max-age=3600"',
  '  </FilesMatch>',
  '</IfModule>',
  '',
  '<IfModule mod_expires.c>',
  '  ExpiresActive On',
  '  ExpiresByType text/html "access plus 0 seconds"',
  '  ExpiresByType text/css "access plus 1 year"',
  '  ExpiresByType application/javascript "access plus 1 year"',
  '  ExpiresByType font/woff2 "access plus 1 year"',
  '  ExpiresByType image/avif "access plus 1 year"',
  '  ExpiresByType image/webp "access plus 1 year"',
  '</IfModule>',
  '',
)

writeFileSync(OUT, L.join('\n'))

const rules = L.filter((l) => l.startsWith('RewriteRule')).length
console.log('--- generate-htaccess ---')
console.log(`exact 301s     : ${redirectList.length + journalRules.safe.length}`)
console.log(`pattern 301s   : ${patternRedirects.length}`)
console.log(`rewrite rules  : ${rules}`)
console.log(`held back      : ${journalRules.held.length} (commented)`)
console.log(`wrote          : dist/.htaccess (${L.join('\n').length} bytes)`)
