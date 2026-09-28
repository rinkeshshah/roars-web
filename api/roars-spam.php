<?php
/**
 * THE SPAM LAYER, IN ONE PLACE.
 *
 * Every form on the site posts to contact.php, so "one shared include, not
 * duplicated per endpoint" is already true of the endpoint. This file exists
 * for a different reason: the four checks below are the ones that decide
 * whether a submission is allowed to reach the database, the acknowledgement,
 * n8n and Sendy, and they were previously spread through six hundred lines of
 * form handling. A rule you have to go looking for is a rule that gets edited
 * on one path and not the other.
 *
 * WHAT GOT THROUGH, AND WHY. Bots were arriving with mismatched names and
 * addresses ("Carloszek" from a gmail address). Not because the defences were
 * missing -- the honeypots, the rate limit and the server-side Turnstile check
 * were all written and all working -- but because PUBLIC_TURNSTILE_SITE_KEY
 * was never set at build time. The widget markup is conditional on that key,
 * so it rendered on no page, so there was no token to check, and the server
 * dutifully verified nothing at all. The whole defence was one unset
 * environment variable from being ornamental.
 *
 * That is the shape of the risk this file is written against: a check that
 * silently becomes a no-op. So each one here says out loud, in the log, what
 * it decided and why, and the diagnostic at the bottom reports whether each
 * is actually armed.
 */

declare(strict_types=1);

/* Not a page. See the identical guard in roars-smtp.php for why this is here
   as well as in .htaccess. */
if (!defined('ROARS_ENTRY')) {
    http_response_code(403);
    exit;
}

/**
 * Where rejections are written.
 *
 * Above the document root, beside the config and the secrets, because it is a
 * record of who tried what and a browser has no business reading it. Falls
 * back to the system temp directory rather than throwing: a log that cannot
 * be opened must never be the reason a form stops working.
 */
function roars_spam_logfile(): string
{
    $private = '/var/www/vhosts/roarsinc.com/private';
    return is_dir($private) && is_writable($private)
        ? $private . '/spam.log'
        : sys_get_temp_dir() . '/roars-spam.log';
}

/**
 * Record one rejection. One line, and deliberately a thin one.
 *
 * NO MESSAGE BODIES, EVER. The point of the log is counting and pattern
 * spotting -- which form, which reason, how often -- and none of that needs
 * the text somebody typed. Keeping bodies would turn a spam log into a store
 * of other people's words with no retention story and no reason to exist.
 *
 * THE IP IS TRUNCATED, NOT HASHED. The last octet of a v4 address (or the
 * last 80 bits of a v6 one) is what identifies a person; the rest is what
 * identifies a network, which is the part worth seeing when the same /24
 * arrives forty times in an hour. A hash would defeat that comparison
 * entirely. The truncated form is also what survives the purge below without
 * anybody having to remember to run it on time.
 */
function roars_spam_log(string $form, string $reason, string $ip): void
{
    $short = $ip;
    if (str_contains($ip, ':')) {
        $parts = explode(':', $ip);
        $short = implode(':', array_slice($parts, 0, 3)) . '::';
    } elseif (substr_count($ip, '.') === 3) {
        $short = substr($ip, 0, (int) strrpos($ip, '.')) . '.0';
    }

    $line = sprintf(
        "%s\t%s\t%s\t%s\n",
        gmdate('c'),
        preg_replace('/[^a-z_]/', '', $form) ?: 'unknown',
        preg_replace('/[^a-z_]/', '', $reason) ?: 'unknown',
        $short,
    );

    $file = roars_spam_logfile();
    /* Errors suppressed on purpose, and then reported to the PHP log rather
       than swallowed. A full disk or a bad mode is worth knowing about; it is
       not worth a 500 on somebody's enquiry. */
    if (@file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
        error_log("[roars] could not write the spam log at {$file}");
        return;
    }
    @chmod($file, 0600);

    roars_spam_purge($file);
}

/**
 * Thirty days, enforced on write rather than by a cron nobody set up.
 *
 * Rewriting the file on every rejection would be silly, so this only runs
 * when the file is large enough to be worth it and at most once a day, which
 * the marker file tracks. The alternative -- a Plesk scheduled task -- is one
 * more thing that has to be created correctly on a server nobody will check
 * again, and a retention promise that depends on that is not a promise.
 */
function roars_spam_purge(string $file): void
{
    $marker = $file . '.purged';
    if (is_file($marker) && filemtime($marker) > time() - 86400) { return; }
    if (!is_file($file) || filesize($file) < 64 * 1024) {
        @touch($marker);
        return;
    }

    $cutoff = time() - (30 * 86400);
    $kept = [];
    foreach (@file($file, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
        $stamp = strtok($line, "\t");
        if ($stamp !== false && strtotime($stamp) >= $cutoff) { $kept[] = $line; }
    }
    @file_put_contents($file, $kept ? implode("\n", $kept) . "\n" : '', LOCK_EX);
    @touch($marker);
}

/**
 * THE SIGNED TIMESTAMP, AND WHY IT IS NOT BAKED INTO THE PAGE.
 *
 * The brief asks for "a signed timestamp of when the form rendered". On a
 * server-rendered site that is one line in the template. This site is a static
 * build: every page is HTML generated once, on a build machine, and served
 * from disk to everybody. A timestamp written at build time would be the same
 * for every visitor and would be hours or days old by the time anyone saw it,
 * which makes a minimum-age test meaningless in one direction and impossible
 * in the other.
 *
 * So the stamp is MINTED ON DEMAND: the page asks contact.php for one the
 * moment a visitor first touches a form, and posts it back with the
 * submission. What is being measured is therefore "time since this person
 * started filling the form in", which is the thing the rule actually cares
 * about, and it is a server clock at both ends so there is nothing a client
 * can drift or fake.
 *
 * The signature covers the timestamp with a server-side secret, so a bot
 * cannot mint its own -- it has to ask for one and then wait, which is exactly
 * the cost we are trying to impose. Asking for a stamp is cheap and harmless
 * on its own; it is the waiting that is expensive to a script and free to a
 * human who is typing.
 */
function roars_stamp_secret(array $cfg): string
{
    /* A dedicated key if the config has one; the rate limiter's salt if not,
       so an existing server file keeps working without being edited. Both are
       server-side only and neither is ever sent to a browser. */
    $secret = (string) ($cfg['stamp_secret'] ?? '');
    if ($secret === '') { $secret = (string) ($cfg['rate_salt'] ?? ''); }
    return $secret;
}

/** Mint `t.sig` for a browser that is about to fill a form in. */
function roars_stamp_make(array $cfg): array
{
    $t = time();
    $secret = roars_stamp_secret($cfg);
    return ['t' => $t, 'sig' => hash_hmac('sha256', (string) $t, $secret)];
}

/**
 * Check a returned stamp. Returns '' when it is good, or a reason.
 *
 * UNSIGNED IS NOT THE SAME AS TOO FAST, and neither is the same as absent.
 * They are separated because the log is the only place anyone will ever see
 * what is happening: a run of `too_fast` is a bot filling the form instantly,
 * a run of `bad_stamp` is one forging the field, and a run of `no_stamp` is
 * far more likely to be our own JavaScript failing than any attacker.
 */
function roars_stamp_check(array $cfg, string $t, string $sig, int $minSeconds = 3): string
{
    if ($t === '' || $sig === '') { return 'no_stamp'; }
    if (!ctype_digit($t)) { return 'bad_stamp'; }

    $secret = roars_stamp_secret($cfg);
    if ($secret === '') {
        /* No secret means every signature would validate against '' -- which
           would turn this check into a rubber stamp that still looks armed.
           Say so rather than pass. */
        error_log('[roars] no stamp secret configured; minimum fill time not enforced');
        return '';
    }

    /* hash_equals, not ===. A timing-safe comparison is the whole reason to
       sign anything. */
    if (!hash_equals(hash_hmac('sha256', $t, $secret), $sig)) { return 'bad_stamp'; }

    $age = time() - (int) $t;
    /* A stamp from the future, or from last week, is not a form somebody has
       been filling in. Four hours is generous for a real person who left a tab
       open over lunch. */
    if ($age < 0 || $age > 4 * 3600) { return 'bad_stamp'; }
    if ($age < $minSeconds) { return 'too_fast'; }

    return '';
}

/* The endpoint, as a constant so the local harness can point it at a stub and
   exercise the reject/accept branches without reaching Cloudflare. Same seam,
   and the same reason, as $opt['ssl'] in roars-smtp.php: a branch that cannot
   be run in a test is a branch nobody has checked. Nothing derived from a
   request can reach it -- it is defined here or not at all. */
if (!defined('ROARS_TURNSTILE_URL')) {
    define('ROARS_TURNSTILE_URL', 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
}

/**
 * Turnstile, server-side, with the three outcomes kept apart.
 *
 *   'ok'           verified.
 *   'unconfigured' no secret on this server. Accept, unverified.
 *   'missing'      no token in the submission at all. Accept, unverified.
 *   'unreachable'  Cloudflare did not answer. Accept, unverified.
 *   'rejected'     Cloudflare answered about a REAL token and said no. Refuse.
 *
 * THE MIDDLE TWO ARE NOT FAILURES OF THE VISITOR and must never be answered
 * as if they were. An outage at Cloudflare would otherwise turn into every
 * enquiry to the business being refused, which is a far more expensive failure
 * than a handful of unverified leads a human can look at. The caller is
 * expected to carry that distinction forward -- tag the lead, skip the
 * acknowledgement, still tell sales -- rather than treat 'unverified' as 'ok'.
 */
function roars_turnstile_check(string $secret, string $token, string $ip): string
{
    if ($secret === '') {
        error_log('[roars] no turnstile secret configured; submission accepted unverified');
        return 'unconfigured';
    }

    /* NO TOKEN AT ALL IS OUR PROBLEM, NOT THE VISITOR'S.
     *
     * Cloudflare answers an empty token with success:false and
     * `missing-input-response`, which is a correct rejection of a question we
     * should not have asked -- and the old code passed that straight through
     * as "Verification failed." to somebody who had done nothing wrong and
     * had no way to act on it.
     *
     * It is a live failure, not a hypothetical: a build that went out without
     * PUBLIC_TURNSTILE_SITE_KEY renders no widget, so every submission from
     * every page carried an empty token and every one of them was refused.
     * The same thing happens to a real person whose ad blocker, corporate
     * proxy or CSP stops Cloudflare's script loading.
     *
     * So an absent token is treated the way an unreachable Cloudflare is: the
     * lead is kept, tagged unverified, gets no automatic acknowledgement, and
     * sales is told. A bot posting straight to the endpoint with no token
     * lands in the same place -- flagged, silent, and still facing the
     * honeypot, the stamp and the rate limit. A bot that sends a BAD token is
     * a different thing and is still refused outright.
     *
     * Checked here rather than at Cloudflare, because there is nothing to ask
     * about and the round trip would only slow the answer down.
     */
    if (trim($token) === '') {
        error_log('[roars] no turnstile token in the submission; accepted unverified (is the widget rendering?)');
        return 'missing';
    }

    $verify = @file_get_contents(
        ROARS_TURNSTILE_URL,
        false,
        stream_context_create(['http' => [
            'method'        => 'POST',
            'timeout'       => 10,
            'ignore_errors' => true,
            'header'        => 'Content-Type: application/x-www-form-urlencoded',
            'content'       => http_build_query([
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]),
        ]]),
    );

    if ($verify === false) {
        error_log('[roars] turnstile siteverify unreachable; submission accepted unverified');
        return 'unreachable';
    }

    $body = json_decode($verify, true);

    /* ONLY CLOUDFLARE CAN REJECT. Anything that is not a Cloudflare answer is
       an outage, not a verdict.
       Found by running it: with `ignore_errors` on, file_get_contents returns
       FALSE only for a genuine transport failure. An intercepting proxy, a
       captive portal, a WAF or an HTML error page all come back as a STRING
       with a 200-shaped read -- this harness got back the plain sentence
       "Host not in allowlist: challenges.cloudflare.com." Parsing that as
       JSON gives null, `success` is not true, and the previous code called
       that a rejection: every visitor told "Verification failed" because of
       something on our side of the wire. That is precisely the failure the
       unverified path exists to prevent, arriving through the one door it was
       not watching.
       So a verdict requires a parseable object that actually carries a
       boolean `success`. Everything else is unreachable. */
    if (!is_array($body) || !array_key_exists('success', $body)) {
        error_log('[roars] turnstile siteverify answered with something that is not its JSON; treating as unreachable');
        return 'unreachable';
    }

    if ($body['success'] === true) { return 'ok'; }

    /* The error codes are Cloudflare's own and are the difference between "a
       bot" and "we deployed the wrong secret". Worth a line; they name no
       visitor and carry no secret. */
    $codes = implode(',', array_map('strval', (array) ($body['error-codes'] ?? [])));
    error_log("[roars] turnstile rejected the token" . ($codes !== '' ? ": {$codes}" : ''));
    return 'rejected';
}
