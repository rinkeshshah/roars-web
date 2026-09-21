<?php
/**
 * The only server-side code in this project. Keep it this size.
 *
 * Config lives OUTSIDE the document root. Its DB user holds INSERT on one
 * table and nothing else, so a leaked credential buys junk rows, not data.
 * See docs/DEPLOYMENT.md for the CREATE TABLE and GRANT.
 *
 * WHAT HAPPENS AFTER A SUBMIT, and in what order. The order is the point.
 *
 *   1. Validate, rate-limit, Turnstile, write the row. Anything that can
 *      legitimately refuse the submission happens here, while the visitor is
 *      still waiting, because a refusal has to reach them.
 *   2. Answer the browser. JSON to the island, 303 to /thankyou/ to a native
 *      post. This is the last thing the visitor's connection waits for.
 *   3. THEN the slow work, behind roars_after_response(): the acknowledgement
 *      email, the n8n forward, the Sendy subscribe. None of it can fail in a
 *      way the visitor sees, because by then there is no visitor to show it
 *      to. Every failure goes to the PHP error log with a [roars] prefix.
 *
 * That split is why roars_forward_lead() and roars_sendy_subscribe() can be
 * allowed to be slow or down. A Sendy outage must not cost a lead, and an n8n
 * workflow that is not listening must not turn a contact form into a 500.
 *
 * WHO SENDS WHAT, once n8n is in the picture. The site sends the instant
 * acknowledgement and nothing else. Every follow-up after that comes from the
 * n8n flow as sales@roarsinc.com. The internal "Roars enquiry" notification to
 * sales@ is now a FALLBACK on the contact form: it goes out only when the
 * forward to n8n failed, because then nobody downstream knows the lead exists.
 */
declare(strict_types=1);

/* The key the two includes check for. They are in the document root because
   the deploy puts them there, so each has a URL; this is what tells them the
   difference between being required by this file and being fetched. */
define('ROARS_ENTRY', true);

/* Sendy list subscribes and the n8n forward. Shared, so there is one
   integration rather than one per form.
   NOT a bare require_once. A hard require of a file that is not there is a
   fatal error, and a fatal error here is an empty 500 with no body and no
   clue -- which is exactly what a visitor got, on every form, when this ran
   before the file reached the server. The integrations are optional by
   design; their absence is a log line, not an outage. */
/* SMTP, in place of mail(). Same guard, same reason: a missing file is a log
   line, not a 500. Without it $send falls back to mail(), which is worse mail
   but still mail. */
$smtp = __DIR__ . '/roars-smtp.php';
if (is_file($smtp)) {
    require_once $smtp;
} else {
    error_log('[roars] roars-smtp.php is missing from ' . __DIR__ . '; falling back to mail()');
}

/* DEFINED HERE, above everything that reads them. They were declared beside
   the config fallbacks two hundred lines down, which is where they are used --
   and ?diag=smtp reads them a hundred lines EARLIER than that. An undefined
   constant is an Error, an Error is a fatal, and a fatal with display_errors
   off is an empty 500 that says nothing. The diagnostic built to explain a
   silent failure failed silently. */
if (!defined('ROARS_SMTP_HOST_DEFAULT')) { define('ROARS_SMTP_HOST_DEFAULT', 'smtp-relay.gmail.com'); }
if (!defined('ROARS_SMTP_PORT_DEFAULT')) { define('ROARS_SMTP_PORT_DEFAULT', 587); }

/* The spam layer. Same guard as the other two: if the file is gone the form
   still takes the enquiry, it just takes it with the honeypot and the rate
   limit alone -- which is where this site was before, and is a log line
   rather than an outage. */
$spam = __DIR__ . '/roars-spam.php';
if (is_file($spam)) {
    require_once $spam;
} else {
    error_log('[roars] roars-spam.php is missing from ' . __DIR__ . '; stamp, logging and turnstile helper are off');
}

$integrations = __DIR__ . '/roars-integrations.php';
if (is_file($integrations)) {
    require_once $integrations;
} else {
    error_log('[roars] roars-integrations.php is missing from ' . __DIR__ . '; forms run without Sendy or n8n');
}

/**
 * TWO CALLERS, TWO REPLIES.
 *
 * src/scripts/form.ts posts with `Accept: application/json`, reads the result,
 * fires generate_lead off it and then navigates to /thankyou/. It needs JSON.
 *
 * A NATIVE FORM POST DOES NOT SEND THAT HEADER, and it happens more often than
 * it looks: JavaScript disabled, the island failing to load, a bot, or a
 * browser that submitted before the bundle arrived. Those callers used to be
 * shown a page of raw JSON. They now get a 303 to /thankyou/ — the same
 * destination the island uses, so the conversion lands in the same place and
 * the goal counts both.
 */
$wantsJson = str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');

/**
 * Success, in whichever form the caller asked for.
 *
 * $after is the slow work: mail, n8n, Sendy. It runs AFTER the response has
 * been handed back, via roars_after_response(), which closes the FastCGI
 * request first. Content-Length is set on the JSON branch for the same reason
 * — without it a client can sit waiting on a connection the server has already
 * finished with.
 */
$done = function (array $payload, ?callable $after = null) use ($wantsJson): never {
    if ($wantsJson) {
        $body = (string) json_encode($payload);
        header('Content-Type: application/json');
        header('Content-Length: ' . strlen($body));
        echo $body;
    } else {
        /* 303, not 302: the browser must re-issue as GET, so a refresh on
           /thankyou/ cannot repost the form. */
        $q = [];
        if (isset($payload['form'])) { $q['form'] = (string) $payload['form']; }
        /* '#' would be read as a fragment delimiter, so it is encoded here and
           decoded by the browser before the page ever sees it. */
        if (isset($payload['ref'])) { $q['ref'] = (string) $payload['ref']; }
        header('Location: /thankyou/' . ($q ? '?' . http_build_query($q) : ''), true, 303);
    }
    /* THE WORK AFTER THE RESPONSE MUST NEVER BECOME THE RESPONSE.
       roars_after_response() closes the FastCGI request first, so on PHP-FPM
       anything that goes wrong in here is already invisible. That is not true
       on every SAPI: where fastcgi_finish_request() does not exist the helper
       falls back to a flush, the connection is still open, and a fatal in the
       work lands on the visitor as an empty 500 after they have already been
       told it worked.
       So the work is wrapped rather than trusted. \Throwable catches Error as
       well as Exception, which is what makes an undefined curl_init() -- the
       shape this takes when the curl extension is not loaded -- a logged line
       instead of a dead form. And if the helper never loaded at all, the work
       still runs; it just runs before the response instead of after. */
    if ($after !== null) {
        $guarded = static function () use ($after): void {
            try {
                $after();
            } catch (\Throwable $e) {
                error_log('[roars] after-response work failed: ' . $e::class . ': ' . $e->getMessage());
            }
        };
        if (function_exists('roars_after_response')) {
            roars_after_response($guarded);
        } else {
            $guarded();
        }
    }
    exit;
};

/**
 * GET /api/contact.php?diag=1 -- THE DEV-ONLY CONFIG REPORT.
 *
 * Why this exists: "the form is not configured" is true but useless. There are
 * two config files, in two different places, and six ways for this process not
 * to be able to read one -- it is absent, it is owned by someone else, its mode
 * is 600 and the pool runs as another user, open_basedir does not include the
 * directory, the path is right for production and wrong for dev, or it is there
 * and does not return an array. From outside they are one message.
 *
 * IT EMITS NO VALUES. Paths, booleans, ownership and the names of keys that are
 * present. Never a key's contents, never a fragment of one. Read it once, fix
 * what it names, and it has nothing left to tell you.
 *
 * DEV ONLY, decided from where this file sits on disk rather than from the
 * request. A Host header is whatever the client typed; the directory this code
 * is executing in is not, so production cannot be talked into answering by
 * spoofing a hostname.
 */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && isset($_GET['diag'])) {
    $onDevEarly = str_contains(__DIR__, '/dev.roarsinc.com');

    /**
     * ?diag=smtp -- THE RELAY, END TO END, WITHOUT DELIVERING ANYTHING.
     *
     * It runs roars_smtp_send() itself in probe mode, not a reimplementation of
     * it, so what passes here is what the acknowledgement will do. The
     * transaction stops after RCPT and is thrown away with RSET; DATA is never
     * sent, so nothing lands in anybody's inbox and nothing appears in the
     * Email Log Search as a delivery.
     *
     * THE OUTBOUND IP IS THE FIRST THING TO READ. The relay authorises by
     * address, so if ipify reports something other than the allowlisted one --
     * a NAT pool, a second interface, an IPv6 route -- every other line below
     * can be perfect and Google will still refuse. That is also why it is
     * fetched over IPv4 explicitly: asking over v6 answers with the v6 address
     * and tells you nothing about the connection the relay will see.
     */
    if ($onDevEarly && $_GET['diag'] === 'smtp') {
        header('Content-Type: application/json');
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow');

        $out = ['diag' => 'smtp relay'];

        /* 1. what address the relay will see us arrive from */
        $out['outboundIPv4'] = ['ok' => false, 'ip' => null, 'error' => 'curl not loaded'];
        if (function_exists('curl_init')) {
            $ch = curl_init('https://api.ipify.org');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_TIMEOUT        => 8,
            ]);
            $ip = curl_exec($ch);
            $out['outboundIPv4'] = [
                'ok'       => is_string($ip) && $ip !== '',
                'ip'       => is_string($ip) ? trim($ip) : null,
                'error'    => curl_error($ch) ?: null,
                'expected' => '195.201.86.11',
                'matches'  => is_string($ip) && trim($ip) === '195.201.86.11',
            ];
            curl_close($ch);
        }

        /* 2. the conversation, through the real client */
        $host = ROARS_SMTP_HOST_DEFAULT;
        $port = ROARS_SMTP_PORT_DEFAULT;
        $cfgPath = '/var/www/vhosts/roarsinc.com/private/contact-config.php';
        if (is_file($cfgPath) && is_readable($cfgPath)) {
            $c = @require $cfgPath;
            if (is_array($c)) {
                $host = (string) ($c['SMTP_HOST'] ?? $host);
                $port = (int) ($c['SMTP_PORT'] ?? $port);
            }
        }
        $out['smtp'] = ['host' => $host, 'port' => $port, 'clientLoaded' => function_exists('roars_smtp_send')];
        if (function_exists('roars_smtp_send')) {
            $trace = null;
            $ok = roars_smtp_send(
                'noreply@roarsinc.com',
                ['sales@roarsinc.com'],
                '',
                ['host' => $host, 'port' => $port, 'probe' => true],
                $trace,
            );
            $out['smtp']['accepted'] = $ok;
            $out['smtp']['transcript'] = $trace;
        }

        /* 3. what the log has been saying */
        $logPath = (string) ini_get('error_log');
        $log = ['path' => $logPath ?: '(not set; php logs to the SAPI)', 'readable' => false, 'lines' => []];
        if ($logPath !== '' && is_file($logPath) && is_readable($logPath)) {
            $log['readable'] = true;
            /* The tail only. These files run to hundreds of megabytes and the
               interesting part is always the end. */
            $fh = fopen($logPath, 'rb');
            if ($fh) {
                fseek($fh, 0, SEEK_END);
                $size = ftell($fh);
                $want = min($size, 256 * 1024);
                fseek($fh, -$want, SEEK_END);
                $tail = (string) fread($fh, $want);
                fclose($fh);
                $hits = array_values(array_filter(
                    explode("\n", $tail),
                    static fn($l) => str_contains($l, '[roars]'),
                ));
                $log['lines'] = array_slice($hits, -20);
            }
        }
        $out['errorLog'] = $log;

        exit(json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    $onDev = str_contains(__DIR__, '/dev.roarsinc.com/') || str_contains(__DIR__, '/dev.roarsinc.com');
    if (!$onDev) {
        http_response_code(404);
        exit;
    }

    /** Ownership and mode, which is what a 600 file and the wrong pool user look like. */
    $who = static function (int|false $uid): string {
        if ($uid === false) { return 'unknown'; }
        if (function_exists('posix_getpwuid')) {
            $e = posix_getpwuid($uid);
            if (is_array($e) && isset($e['name'])) { return $e['name'] . " (uid {$uid})"; }
        }
        return "uid {$uid}";
    };

    /** Presence of the keys a file is supposed to carry. Names only, never values. */
    $keysPresent = static function (string $file, array $expect): array {
        $out = [];
        foreach ($expect as $k) { $out[$k] = false; }
        if (!is_file($file) || !is_readable($file)) { return $out; }
        try {
            $a = require $file;
        } catch (\Throwable) {
            return $out;
        }
        if (!is_array($a)) { return $out; }
        foreach ($expect as $k) {
            $out[$k] = array_key_exists($k, $a) && is_scalar($a[$k]) && (string) $a[$k] !== '';
        }
        return $out;
    };

    $report = static function (string $path, array $expect) use ($who, $keysPresent): array {
        $exists = is_file($path);
        return [
            'path'        => $path,
            'exists'      => $exists,
            'readable'    => $exists && is_readable($path),
            'owner'       => $exists ? $who(fileowner($path)) : null,
            'mode'        => $exists ? substr(sprintf('%o', fileperms($path)), -4) : null,
            'returnsArray'=> $exists && is_readable($path) ? is_array(@require $path) : false,
            'keysSet'     => $keysPresent($path, $expect),
        ];
    };

    /* The secrets file this vhost resolves to, by the same path test the
       helper uses -- so the report names the file that is actually read, not
       the one somebody meant to create. */
    $secrets = '/var/www/vhosts/roarsinc.com/'
        . (str_contains(__DIR__, '/dev.roarsinc.com') ? 'roars-secrets-dev.php' : 'roars-secrets.php');

    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    exit(json_encode([
        'diag' => 'roars form config',
        'process' => [
            'user'          => $who(function_exists('posix_geteuid') ? posix_geteuid() : false),
            'php'           => PHP_VERSION,
            'sapi'          => PHP_SAPI,
            'open_basedir'  => ini_get('open_basedir') ?: '(not set)',
            'docroot'       => $_SERVER['DOCUMENT_ROOT'] ?? '(unknown)',
            'thisDir'       => __DIR__,
        ],
        'extensions' => [
            'curl'     => extension_loaded('curl'),
            'pdo_mysql'=> extension_loaded('pdo_mysql'),
            'mbstring' => extension_loaded('mbstring'),
        ],
        'helper' => [
            'path'                 => __DIR__ . '/roars-integrations.php',
            'exists'               => is_file(__DIR__ . '/roars-integrations.php'),
            'roars_after_response' => function_exists('roars_after_response'),
            'roars_forward_lead'   => function_exists('roars_forward_lead'),
            'roars_sendy_subscribe'=> function_exists('roars_sendy_subscribe'),
        ],
        'files' => [
            'contactConfig' => $report(
                '/var/www/vhosts/roarsinc.com/private/contact-config.php',
                ['dsn', 'db_user', 'db_pass', 'turnstile_secret', 'notify_to', 'from', 'tools_dir', 'rate_salt'],
            ),
            'secrets' => $report(
                $secrets,
                ['SENDY_URL', 'SENDY_API_KEY', 'N8N_CONTACT_WEBHOOK', 'N8N_FORM_SECRET'],
            ),
        ],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$fail = function (int $code, string $msg) use ($wantsJson): never {
    http_response_code($code);
    // Fixed strings only. User input is never echoed back.
    if ($wantsJson) {
        header('Content-Type: application/json');
        exit(json_encode(['ok' => false, 'error' => $msg]));
    }
    /* Deliberately NOT a redirect to /thankyou/: a failure that lands on the
       thank-you page would tell the visitor their message was sent when it was
       not, and would count a conversion that never happened. */
    header('Content-Type: text/plain; charset=utf-8');
    exit($msg);
};


/**
 * THE CONFIG, AND WHAT HAPPENS WITHOUT IT.
 *
 * This file holds the database credentials, the Turnstile secret and the
 * addresses the mail goes between. It can be absent in two ways that look
 * identical from outside -- it is not there, or it is there and open_basedir
 * will not let this vhost read a path above its own webspace root -- and
 * neither is the visitor's fault or the visitor's business.
 *
 * NOTHING ABOUT A SERVER MISCONFIGURATION REACHES THE PERSON FILLING IN THE
 * FORM. They filled it in correctly; they get the normal success response,
 * their acknowledgement, and their lead reaches sales@ by email even when the
 * row cannot be written. What they must never get is "the form is not
 * configured on this server", which tells them nothing they can act on and
 * loses the enquiry.
 *
 * The fallbacks below are the two addresses and the three strings this file
 * cannot run without, and they are the same values contact-config.example.php
 * ships. They are a floor, not a config: a real file wins every key it sets,
 * because `+` on arrays keeps the left-hand side.
 */
$cfgFallback = [
    'notify_to'      => 'sales@roarsinc.com',
    'from'           => 'noreply@roarsinc.com',
    'site_url'       => 'https://www.roarsinc.com',
    'postal_address' => '4th Block, Jayanagar, Bengaluru, India 560041',
    'booking_url'    => 'https://meet.roarsinc.com/sales',
    /* No tools_dir means no attachment; the guide email links the PDF
       instead, which is the path a missing file already took. */
    'tools_dir'      => '',
    'max_attach'     => 8 * 1024 * 1024,
    'rate_window'    => 3600,
    'rate_max'       => 5,
    'rate_salt'      => 'roars-no-config',
    /* The Google Workspace relay. It authorises by sending IP -- the server's
       address is on the allow list in the admin console -- so there is no user
       and no password here to leak or rotate. Overridable from config for a
       different relay or a local catcher. */
    'SMTP_HOST'      => ROARS_SMTP_HOST_DEFAULT,
    'SMTP_PORT'      => ROARS_SMTP_PORT_DEFAULT,
];

$cfgFile = '/var/www/vhosts/roarsinc.com/private/contact-config.php';
$loaded = null;
if (!is_file($cfgFile) || !is_readable($cfgFile)) {
    error_log("[roars] contact-config.php missing or unreadable at {$cfgFile} (check it exists, and that open_basedir for this vhost includes it); running on fallbacks");
} else {
    $loaded = require $cfgFile;
    if (!is_array($loaded)) {
        error_log("[roars] contact-config.php at {$cfgFile} did not return an array; running on fallbacks");
        $loaded = null;
    }
}
$cfg = ($loaded ?? []) + $cfgFallback;

/**
 * GET /api/contact.php?stamp=1 -- MINT A SIGNED TIMESTAMP.
 *
 * Why this exists at all: the site is a static build. "A signed timestamp of
 * when the form rendered" is one line on a server-rendered page and is
 * impossible here -- the HTML is generated once on a build machine and served
 * to everybody, so a baked-in timestamp would be identical for every visitor
 * and hours old before anyone saw it. Useless as a minimum-age test.
 *
 * So the page asks for one when somebody first touches a form. What gets
 * measured is time since this person started filling it in, read off the
 * server's clock at both ends, which is the thing the rule is actually about
 * and is not something a client can drift or fake.
 *
 * IT GIVES AWAY NOTHING. The response is a timestamp anybody could have read
 * off a Date header and an HMAC of it. The secret stays here. A bot is
 * welcome to ask for a stamp -- it then has to wait three seconds before the
 * stamp is usable, which is the entire cost being imposed, and it is free to
 * a human who is typing.
 *
 * NOT DEV-ONLY, unlike the diagnostics below: production needs this to work.
 */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && isset($_GET['stamp'])) {
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    if (!function_exists('roars_stamp_make')) {
        /* The helper is missing from this deploy. Answer with an empty stamp
           rather than an error: the form then posts without one, which the
           POST path treats as a logged signal and not as spam. */
        error_log('[roars] ?stamp requested but roars-spam.php is not loaded');
        exit(json_encode(['t' => '', 'sig' => '']));
    }
    exit(json_encode(roars_stamp_make($cfg)));
}

/* EVERYTHING BELOW IS THE POST PATH. The guard sits here rather than higher up
   because ?stamp=1 above is a GET and needs $cfg, which is assembled between
   the two. Nothing between the old position and this one depends on the
   method: it is the config fallback table and the config load. */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { $fail(405, 'Method not allowed.'); }


/* Honeypot: fields real people never see and never fill. Answered exactly like
   a success so a bot learns nothing from the difference — no row, no mail, no
   n8n, no Sendy.
   TWO NAMES. `company_website` is this site's own and is on every form;
   `website` is the one the n8n flow expects and is what the bot-scoring step
   downstream reads. Filling either is disqualifying. */
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$formName = (string) ($_POST['form'] ?? 'unknown');

/* Rejections are logged where a person can count them. `roars_spam_log` is
   guarded by function_exists for the same reason every other helper is: the
   file it lives in can be absent from a deploy, and a missing log must not
   be the thing that stops a form working. */
$logSpam = static function (string $reason) use ($formName, $ip): void {
    if (function_exists('roars_spam_log')) { roars_spam_log($formName, $reason, $ip); }
};

if (($_POST['company_website'] ?? '') !== '' || ($_POST['website'] ?? '') !== '') {
    $logSpam('honeypot');
    $done(['ok' => true]);
}

/* THE MINIMUM FILL TIME, AND IT IS NOW ENFORCED.
   `elapsed_ms` has been posted by the form for months and read by nobody: it
   went into the n8n payload as a scoring signal and nothing on this side ever
   looked at it. It also could not be trusted if it had been -- it is a number
   the browser writes, so anything posting directly just writes a bigger one.
   The stamp replaces that. It is minted by ?stamp=1 below, signed with a
   server secret, and the age is measured between two readings of the server's
   own clock. A bot can still ask for one; it then has to wait three seconds
   before using it, which is free to a person typing and expensive to a script
   doing this ten thousand times.
   ANSWERED AS SUCCESS, like the honeypot: a bot that learns which of its
   submissions were rejected learns how to stop being rejected. */
if (function_exists('roars_stamp_check')) {
    $stampReason = roars_stamp_check(
        $cfg,
        (string) ($_POST['ts'] ?? ''),
        (string) ($_POST['ts_sig'] ?? ''),
    );
    /* AN ABSENT STAMP IS NOT A REJECTION, and getting this wrong would have
       been expensive. When fetch() fails -- an extension, a WAF, a dropped
       connection -- form.ts falls back to a native form post, and a native
       post carries whatever is in the markup, which is an empty stamp because
       only JavaScript ever fills it in. Treating that as spam would silently
       bin exactly the enquiries from the people already having the worst time
       reaching us. It is logged, because a lot of it means our own script is
       broken, and the honeypot and Turnstile still stand on that path.
       A stamp that is present and WRONG is a different matter: nothing
       legitimate forges a signature. */
    if ($stampReason === 'no_stamp') {
        $logSpam('no_stamp');
    } elseif ($stampReason !== '') {
        $logSpam($stampReason);
        $done(['ok' => true]);
    }
}

// Rate limit: one file per IP hash, N posts per window. Cheap, no extra service.
$bucket = sys_get_temp_dir() . '/rl_' . hash('sha256', $ip . $cfg['rate_salt']);
$hits = is_file($bucket) && filemtime($bucket) > time() - $cfg['rate_window']
    ? (int) file_get_contents($bucket) : 0;
if ($hits >= $cfg['rate_max']) { $fail(429, 'Too many submissions. Try again shortly.'); }
file_put_contents($bucket, (string) ($hits + 1), LOCK_EX);

/**
 * Turnstile, through the shared helper in roars-spam.php.
 *
 * FOUR OUTCOMES, AND THE MIDDLE TWO ARE NOT THE VISITOR'S FAULT.
 *
 *   ok            verified. Normal service.
 *   rejected      Cloudflare answered and said no. Refused, and told.
 *   unreachable   Cloudflare did not answer. ACCEPTED, but marked unverified:
 *                 the lead is kept and sales is told, and the visitor-facing
 *                 acknowledgement is NOT sent, because an automatic email is
 *                 the one thing a spammer actually wants out of a form and
 *                 the only step here that can be aimed at a third party. A
 *                 human reads the flagged lead and replies if it is real.
 *   unconfigured  no secret on this server. Logged loudly, otherwise normal.
 *
 * UNCONFIGURED IS DELIBERATELY NOT TREATED AS UNREACHABLE, and that is a
 * decision worth stating: production is sitting at an empty turnstile_secret
 * on purpose right now, while the widget is being proved out. Folding it into
 * the unverified path would silently stop every acknowledgement the business
 * sends, today, as the price of a setting that is temporary by arrangement.
 * It is a loud log line instead.
 */
$verdict = function_exists('roars_turnstile_check')
    ? roars_turnstile_check(
        (string) ($cfg['turnstile_secret'] ?? ''),
        (string) ($_POST['cf-turnstile-response'] ?? ''),
        $ip,
    )
    : 'unconfigured';

if ($verdict === 'rejected') {
    $logSpam('turnstile');
    $fail(403, 'Verification failed.');
}
/* Carried the whole way down the file. Everything downstream asks this rather
   than re-deriving it. */
$unverified = ($verdict === 'unreachable');

$form  = in_array($_POST['form'] ?? '', ['contact', 'newsletter', 'guide', 'callback'], true)
    ? $_POST['form'] : $fail(422, 'Unknown form.');
$name  = trim((string) ($_POST['name'] ?? ''));
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if ($email === false) { $fail(422, 'A valid email is required.'); }
// The guide form asks for a first name but does not insist on one: the export
// stars only the email, and a template is not worth losing a lead over.
if ($form !== 'guide' && $name === '') { $fail(422, 'Name and a valid email are required.'); }

/**
 * THE GUIDE ALLOWLIST.
 *
 * The browser posts a SLUG, never a path, and a slug that is not a key in this
 * file is refused before it touches the filesystem. That is the whole defence
 * against path traversal: there is no string from the request in the filename.
 *
 * guides.php is GENERATED by scripts/build-email-manifest.mjs from
 * src/content/resources/*.md, which is also where the guide pages come from, so
 * the allowlist cannot drift from the pages the way a second hand-kept list
 * did. It carries the title, shelf, page count, summary and section headings
 * the download email prints.
 */
$GUIDES = require __DIR__ . '/guides.php';

$guide = null;
if ($form === 'guide') {
    $slug = (string) ($_POST['guide'] ?? '');
    if (!isset($GUIDES[$slug])) { $fail(422, 'Unknown guide.'); }
    $meta = $GUIDES[$slug];
    $path = rtrim($cfg['tools_dir'], '/') . '/' . $meta['file'];
    // Belt and braces. The filename came from the manifest, not the request, so
    // realpath can only fail here if the file is missing or the directory moved.
    $real = realpath($path);
    $root = realpath($cfg['tools_dir']);
    if ($real !== false && $root !== false && str_starts_with($real, $root . '/')
        && is_file($real) && filesize($real) <= $cfg['max_attach']) {
        $guide = ['path' => $real, 'name' => $meta['file'], 'size' => filesize($real)] + $meta;
    } else {
        // A missing file is NOT an error to the visitor. The row is still saved
        // and sales still gets the notification, so the lead is not lost; the
        // email links the PDF instead of carrying it.
        $guide = ['path' => null, 'name' => $meta['file'], 'size' => 0] + $meta;
    }
}

$phone   = mb_substr(trim((string) ($_POST['phone'] ?? '')), 0, 40);
$message = mb_substr(trim((string) ($_POST['message'] ?? '')), 0, 5000);
/* The rest of what the n8n flow reads. They are not validated beyond a length
   cap and they are not required: a lead that will not name its country is
   still a lead, and the flow scores on what it has. `elapsed_ms` is written by
   the submit island — milliseconds between page load and submit, which is the
   cheapest bot signal there is — and `page` is the path the form was on. Both
   are empty on a native post with no JavaScript, which n8n treats as unknown
   rather than as suspicious. */
$company  = mb_substr(trim((string) ($_POST['company'] ?? '')), 0, 190);
$country  = mb_substr(trim((string) ($_POST['country'] ?? '')), 0, 90);
$elapsed  = mb_substr(trim((string) ($_POST['elapsed_ms'] ?? '')), 0, 12);
$pagePath = mb_substr(trim((string) ($_POST['page'] ?? '')), 0, 190);
/* An unticked checkbox posts nothing at all, so presence is the whole test. */
$wantsNews = ($_POST['newsletter'] ?? '') !== '';
/**
 * THE ROW, AND WHAT HAPPENS WITHOUT ONE.
 *
 * Prepared statement, no value ever concatenated into SQL. What is new is that
 * the write is allowed to fail. A database that is down, or credentials this
 * config does not carry, used to throw out of `new PDO` and take the whole
 * request with it -- which is a database outage rendered as a broken form on
 * every page of the site.
 *
 * It is a wrapped attempt instead. The lead is not lost when it fails: the
 * acknowledgement still goes to the visitor, the forward still reaches n8n,
 * and the notification still reaches sales@ carrying the whole message. The
 * row is the record, not the delivery.
 *
 * THE REFERENCE. Normally the row's own id, printed as INQUIRY RS-000123 and
 * put in the notification's subject -- a real handle both sides can quote.
 * With no row there is nothing to quote, so it falls back to a time-based
 * code of the same shape. The visitor sees a reference either way; the
 * notification to sales@ says in its own body when there is no row behind it,
 * because that is the reader who would otherwise go looking in the table.
 */
/**
 * THE ENQUIRY NUMBER IS THE ROW'S OWN ID, and the table starts at 1008 so the
 * first one does not read as a company's first ever enquiry. It is the number
 * the visitor quotes, the number in the acknowledgement's subject, and the
 * number n8n files the lead under, so all three are the same thing and there
 * is nothing to reconcile later.
 *
 * $enquiryNo is the id or null. $ref is what a person reads: "#1008" when
 * there is a row, and the time-based code when there is not -- because with no
 * row there is no number, and printing one would be inventing a handle that
 * matches nothing in the table. n8n is sent the id only, never the fallback:
 * a lead sheet keyed on "RS-K3M9QX01" is worse than one with a gap.
 */
$saved = false;
$enquiryNo = null;
$ref = 'RS-' . strtoupper(substr(base_convert((string) time(), 10, 36) . bin2hex(random_bytes(3)), 0, 8));

if ((string) ($cfg['dsn'] ?? '') === '') {
    error_log('[roars] no database configured; submission not saved, delivery unaffected');
} else {
    try {
        $pdo = new PDO($cfg['dsn'], $cfg['db_user'] ?? null, $cfg['db_pass'] ?? null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->prepare(
            'INSERT INTO submissions (form, name, email, phone, message, page_url, referrer, ip, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $form, mb_substr($name, 0, 190), $email, $phone, $message,
            mb_substr((string) ($_POST['page_url'] ?? ''), 0, 500),
            mb_substr((string) ($_SERVER['HTTP_REFERER'] ?? ''), 0, 500),
            $ip, mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
        ]);
        $enquiryNo = (int) $pdo->lastInsertId();
        $ref = '#' . $enquiryNo;
        $saved = true;
    } catch (\Throwable $e) {
        error_log('[roars] submission not saved: ' . $e::class . ': ' . $e->getMessage());
    }
}

/**
 * THE TEMPLATE RENDERER. Two forms, and deliberately no more than two:
 *
 *   {{key}}                a value. ESCAPED HERE, at substitution, so there is
 *                          no path by which a visitor's name or message can
 *                          put markup into an email that someone else opens.
 *   {{#key}}...{{/key}}    kept when the value is non-empty, dropped when it
 *                          is not. That is what stops a blank Phone row or an
 *                          empty Brief row printing as a labelled void.
 *
 * Sections run first so an empty one takes its own {{placeholders}} with it.
 */
$render = function (string $file, array $vars): string {
    $tpl = (string) @file_get_contents(__DIR__ . '/' . $file);
    if ($tpl === '') { return ''; }
    /* COMMENTS ARE FOR WHOEVER EDITS THE TEMPLATE, not for the recipient, and
       every byte of them was being posted to Gmail. Stripped here rather than
       deleted from the file, so the explanations stay where they are useful.
       `[if` is excluded: those are Outlook's conditional comments and they are
       markup, not documentation -- removing them breaks the layout in the one
       client least able to recover. */
    $tpl = preg_replace('/<!--(?!\[if)(?:(?!<!--).)*?-->/s', '', $tpl) ?? $tpl;
    $tpl = preg_replace_callback(
        '/\{\{#([a-z0-9_]+)\}\}(.*?)\{\{\/\1\}\}/s',
        static fn(array $m): string => ($vars[$m[1]] ?? '') === '' ? '' : $m[2],
        $tpl,
    ) ?? $tpl;
    return preg_replace_callback(
        '/\{\{([a-z0-9_]+)\}\}/',
        static fn(array $m): string => htmlspecialchars((string) ($vars[$m[1]] ?? ''), ENT_QUOTES, 'UTF-8'),
        $tpl,
    ) ?? $tpl;
};

/**
 * One HTML email, with a plain-text alternative and an optional attachment.
 *
 * multipart/alternative inside multipart/mixed is the nesting every client
 * expects: the text and HTML are two versions of the same message, and the PDF
 * is a third thing alongside both. Flattening it makes Outlook show the plain
 * text as a second attachment.
 *
 * Built by hand because this project ships no mail library and is not adding
 * one for three parts. Each boundary is random per message, so nothing in a
 * body can close its own part early. Base64 in 76-character lines, which is
 * what RFC 2045 asks for. The subject is encoded because these carry em dashes.
 */
$send = function (string $to, string $subject, string $html, string $text, ?array $attach = null, string $replyTo = '', string $bcc = '') use ($cfg): void {
    $alt = '=_a' . bin2hex(random_bytes(12));
    /* QUOTED-PRINTABLE, NOT BASE64, for both parts.
       base64 inflates by a third no matter what it is given, and HTML is
       almost entirely printable ASCII -- so a 16KB template went over the wire
       as 22KB for no benefit. quoted_printable_encode leaves the ASCII alone
       and escapes the handful of bytes that need it, which is about 3% on this
       content and also leaves the message readable in a raw dump when
       something needs debugging. */
    $inner = "--{$alt}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode($text) . "\r\n"
        . "--{$alt}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode($html) . "\r\n"
        . "--{$alt}--\r\n";

    /* From is noreply@, because these are machine-sent and nobody watches that
       mailbox. Reply-To is sales@, because a visitor who hits reply must reach
       a person — and because the n8n flow answers from that address, so the
       reply lands in the same thread as everything that follows. */
    if ($attach === null) {
        $body = $inner;
        $ctype = "multipart/alternative; boundary=\"{$alt}\"";
    } else {
        $mix = '=_m' . bin2hex(random_bytes(12));
        $body = "--{$mix}\r\n"
            . "Content-Type: multipart/alternative; boundary=\"{$alt}\"\r\n\r\n"
            . $inner
            . "--{$mix}\r\n"
            . "Content-Type: application/pdf; name=\"{$attach['name']}\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"{$attach['name']}\"\r\n\r\n"
            . chunk_split(base64_encode((string) file_get_contents($attach['path'])), 76, "\r\n")
            . "--{$mix}--";
        $ctype = "multipart/mixed; boundary=\"{$mix}\"";
    }

    /* THE RELAY, NOT THE LOCAL MTA. mail() hands the message to whatever this
       box runs, which is not in the domain's SPF record and whose DKIM key is
       currently unparseable -- so everything it sent arrived unauthenticated.
       The relay is already authorised to send as roarsinc.com.
       Bcc goes to the envelope and never into a header: see roars_smtp_mail.
       A failure here is logged and nothing else. This runs after the response
       has gone back, so there is no visitor left to show it to. */
    if (function_exists('roars_smtp_mail')) {
        $ok = roars_smtp_mail(
            $cfg['from'],
            $to,
            $subject,
            $body,
            ['Reply-To' => $replyTo, 'Content-Type' => $ctype],
            $bcc,
            ['host' => (string) $cfg['SMTP_HOST'], 'port' => (int) $cfg['SMTP_PORT']],
        );
        if (!$ok) {
            error_log("[roars] smtp: giving up on \"{$subject}\" to {$to}; not sent");
        }
        return;
    }

    /* No SMTP client on disk. Worse mail is better than none. */
    $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $head = "From: {$cfg['from']}\r\n"
        . ($replyTo !== '' ? "Reply-To: {$replyTo}\r\n" : '')
        . ($bcc !== '' ? "Bcc: {$bcc}\r\n" : '')
        . "MIME-Version: 1.0\r\n";
    @mail($to, $subj, $body, $head . "Content-Type: {$ctype}");
};

// Headers carry only the validated address — $email has been through
// FILTER_VALIDATE_EMAIL, so it cannot carry a CRLF and cannot inject a header.
// $name never goes in a header at all, only in a body.
$who   = $name !== '' ? $name : 'there';
$first = $name !== '' ? explode(' ', $name)[0] : 'there';
$site  = rtrim((string) ($cfg['site_url'] ?? 'https://www.roarsinc.com'), '/');
// The registered office, from src/lib/site.ts. One line, because the email
// footer is one line; the other four offices are on /contact-us/.
$postal = (string) ($cfg['postal_address'] ?? '4th Block, Jayanagar, Bengaluru, India 560041');
/* One booking link for the whole site, and the same one n8n uses in its
   follow-ups. Overridable from config so it can be changed without a deploy. */
$booking = rtrim((string) ($cfg['booking_url'] ?? 'https://meet.roarsinc.com/sales'), '/');

/* WHERE THE EMAIL'S IMAGES LIVE. The Roars lockup used to be a 53KB base64
   data URI inside both templates -- 76% of the acknowledgement's bytes, for a
   180x47 logo, in every message. Gmail clips anything over about 102KB and
   hides the rest behind "[Message clipped]", which is how a signature stops
   arriving. It is a hosted 4.4KB file now, at 2x the display size.
   site_url, so a dev message loads it from dev and nothing has to be
   remembered at cutover. */
$assetBase = rtrim($site, '/');

/**
 * SUZANNE'S SIGNATURE, plain-text half. The exact bytes of the signature file
 * that sales@ uses, and the exact string the n8n flow pastes into its own
 * follow-ups. It opens with its own "Cheers," so nothing above it signs off.
 *
 * Kept here rather than in the HTML template because the template is the HTML
 * half only; this is the multipart/alternative's other part, and some clients
 * show nothing else. Change both or neither.
 */
$signatureText = ''
    . "Cheers,\r\n"
    . "--\r\n"
    . "Suzanne Martin\r\n"
    . "Global Sales\r\n"
    . "roarsinc.com\r\n"
    . "UK: +44 753 718 3399 | USA: +1 302 505 1200\r\n"
    . "User Experience Matters*\r\n"
    . "\r\n"
    . "Property of ROARS Technologies Pvt. Ltd. This message is intended only for the use of the Addressee and may contain information that is PRIVILEGED and CONFIDENTIAL. If you are not the intended recipient, dissemination of this communication is prohibited. If you have received this communication in error, please erase all copies of the message and its attachments and notify us immediately at notify@roarsinc.com\r\n"
    . "Head Office: Roars Technologies Pvt. Ltd., Jayanagar, Bengaluru, Karnataka, 560041\r\n";

/* The internal work notification. Plain text: it is a work notification, not a
   brand piece. Reply-To is the visitor so a reply from sales@ reaches them.
   It is a CLOSURE now rather than a statement, because on the contact form it
   is conditional — see the dispatch at the foot of this file. */
$notifySales = function () use ($cfg, $ref, $form, $name, $email, $phone, $company, $country, $message, $saved, $unverified): void {
    $lines = ($unverified ? "UNVERIFIED: Cloudflare could not be reached, so this submission was not\r\nchecked. No acknowledgement was sent to the address below. Treat with care.\r\n\r\n" : '')
        . ($saved ? '' : "NOT SAVED TO THE DATABASE. This email is the only record.\r\n\r\n")
        . "From: {$name} <{$email}>\r\n"
        . ($company !== '' ? "Company: {$company}\r\n" : '')
        . ($phone   !== '' ? "Phone: {$phone}\r\n"   : '')
        . ($country !== '' ? "Country: {$country}\r\n" : '')
        . "\r\n{$message}";
    if (function_exists('roars_smtp_mail')) {
        roars_smtp_mail(
            $cfg['from'],
            $cfg['notify_to'],
            "Roars enquiry {$ref}: {$form}",
            $lines,
            ['Reply-To' => $email, 'Content-Type' => 'text/plain; charset=UTF-8'],
            '', // no Bcc: this IS the copy to sales@
            ['host' => (string) $cfg['SMTP_HOST'], 'port' => (int) $cfg['SMTP_PORT']],
        );
        return;
    }
    @mail(
        $cfg['notify_to'],
        "Roars enquiry {$ref}: {$form}",
        $lines,
        "From: {$cfg['from']}\r\nReply-To: {$email}",
    );
};

/* Each branch builds its visitor email and leaves it in $visitorMail as a
   closure, so nothing is actually SENT until after the response has gone back.
   Null means this form sends the visitor nothing — which is the case for the
   footer newsletter, where the confirmation is Sendy's job and its own
   double opt-in setting decides whether there is one at all. */
$visitorMail = null;

if ($guide !== null) {
    $url = "{$site}/tools/" . rawurlencode($guide['name']);
    $html = $render('email-guide.html', [
        'first_name'        => $first,
        'resource_title'    => $guide['title'],
        'resource_category' => $guide['category'],
        'issued_at'         => gmdate('j M Y'),
        'page_count'        => $guide['pages'],
        // Only when the file was actually found and is under max_attach.
        'file_size'         => $guide['size'] > 0 ? round($guide['size'] / 1024) . ' KB' : '',
        'download_url'      => $url,
        'chapter_1'         => $guide['chapters'][0] ?? '',
        'chapter_2'         => $guide['chapters'][1] ?? '',
        'chapter_3'         => $guide['chapters'][2] ?? '',
        'postal_address'    => $postal,
        'asset_base'     => $assetBase,
    ]);
    $text = "Hi {$first},\r\n\r\nYour copy of {$guide['title']} is "
        . ($guide['path'] !== null ? "attached, and also here:\r\n{$url}" : "here:\r\n{$url}")
        . "\r\n\r\nIt is one page. Print it, fill it in, take it into the room. "
        . "If the problem turns out to be bigger than a page, reply to this email "
        . "and we will take a look.\r\n\r\nRoars Technologies\r\n{$postal}\r\n";
    $attach = $guide['path'] !== null ? ['path' => $guide['path'], 'name' => $guide['name']] : null;
    $visitorMail = function () use ($send, $email, $guide, $html, $text, $attach, $cfg): void {
        $send($email, "Your copy of {$guide['title']}", $html, $text, $attach, $cfg['notify_to'], $cfg['notify_to']);
    };
} elseif ($form === 'newsletter') {
    /* Nothing from us. The footer form is a list subscribe and nothing else;
       Sendy owns the confirmation, and sending our own on top of a double
       opt-in would be two emails for one action. */
} else {
    $labels = ['contact' => 'Contact form', 'newsletter' => 'Newsletter', 'callback' => 'Callback request'];
    $html = $render('email-inquiry.html', [
        'first_name'     => $first,
        'full_name'      => $who,
        'email'          => $email,
        'phone'          => $phone,
        'company'        => $company,
        'country'        => $country,
        'form_label'     => $labels[$form] ?? $form,
        'message'        => $message,
        'ref_id'         => $ref,
        'submitted_at'   => gmdate('j M Y, H:i') . ' UTC',
        'postal_address' => $postal,
        'asset_base'     => $assetBase,
        'booking_url'    => $booking,
    ]);
    /* The plain-text alternative says the same thing as the HTML, in the same
       voice, with no em dashes in it. Some clients show this and nothing else. */
    $text = "Hi {$first},\r\n\r\nThanks for saying hello.\r\n\r\n"
        . "Your enquiry number is {$ref}.\r\n\r\n"
        . "Your message just landed with our team. I'll personally get back to you "
        . "within one business day.\r\n\r\n"
        . "Can't wait? Grab a time that suits you:\r\n{$booking}\r\n\r\n"
        . "On record:\r\n  Name: {$who}\r\n"
        . ($company !== '' ? "  Company: {$company}\r\n" : '')
        . ($phone !== '' ? "  Phone: {$phone}\r\n" : '')
        . ($country !== '' ? "  Country: {$country}\r\n" : '')
        . "  Reply to: {$email}\r\n" . ($message !== '' ? "  Brief: {$message}\r\n" : '')
        . "\r\nSomething wrong above? Just reply to this email and correct it. "
        . "It reaches the same person.\r\n\r\n"
        . $signatureText;
    $visitorMail = function () use ($send, $email, $html, $text, $cfg, $ref): void {
        /* Bcc sales@: one copy of everything a visitor is sent, in the
           mailbox that answers them. Envelope only -- see roars_smtp_mail --
           so the visitor never sees who else was copied. */
        $send($email, "Got it! We're on it. ({$ref})", $html, $text, null, $cfg['notify_to'], $cfg['notify_to']);
    };
}

/**
 * THE DISPATCH. Everything below runs after the visitor has their answer.
 *
 * Order inside it matters once: the acknowledgement goes first, because it is
 * the only piece the visitor is waiting to see land in their inbox. The
 * forward and the subscribes are machine-to-machine and can take as long as
 * they take.
 *
 * On the contact form the n8n forward is what puts the lead in front of a
 * human, so the internal notification fires only when the forward failed. On
 * every other form nothing is forwarded, so the notification is unconditional
 * and sales@ still hears about it.
 */
$done(
    ['ok' => true, 'event' => 'generate_lead', 'form' => $form, 'ref' => $ref],
    function () use (
        $form, $visitorMail, $notifySales, $email, $name, $company, $country,
        $phone, $message, $elapsed, $pagePath, $wantsNews, $enquiryNo, $unverified
    ): void {
        /* NO ACKNOWLEDGEMENT ON AN UNVERIFIED LEAD. Cloudflare was unreachable,
           so nothing has established that a person filled this in. The
           acknowledgement is the only step on this page that sends mail to an
           address somebody else typed, which makes it the only one that can be
           pointed at a third party. Sales still hears about the lead below and
           a human can reply by hand, so nothing is lost except the automatic
           part -- which is the part worth losing while we cannot tell. */
        if ($visitorMail !== null && !$unverified) { $visitorMail(); }

        if ($form === 'contact') {
            /* enquiry_no only when the row exists. The helper prefixes DEV-
               on dev so the two environments cannot collide in one sheet. */
            $lead = [
                'name'       => $name,
                'email'      => $email,
                'company'    => $company,
                'phone'      => $phone,
                'country'    => $country,
                'message'    => $message,
                'website'    => '', // the honeypot; a filled one never reaches here
                'elapsed_ms' => $elapsed,
                'page'       => $pagePath,
                /* n8n reads this. An unverified lead is still a lead; it just
                   arrives labelled, so the flow can hold it for a human
                   instead of treating it like any other. */
                'verified'   => $unverified ? 'unverified' : 'verified',
            ];
            if ($enquiryNo !== null) { $lead['enquiry_no'] = $enquiryNo; }
            $forwarded = function_exists('roars_forward_lead') && roars_forward_lead($lead);
            /* Fallback only. n8n subscribes contact leads to the Sendy Contact
               list itself, after it has filtered out the spam and the vendors,
               so this file must not do it — a contact form is not a consent to
               be mailed and the filtering is the thing that makes it one. */
            if (!$forwarded) { $notifySales(); }
        } else {
            $notifySales();
        }

        /* The resource download is its own consent: someone asked for a guide,
           the guide list is what that subscribes them to. */
        if ($form === 'guide' && function_exists('roars_sendy_subscribe')) {
            roars_sendy_subscribe('resources', $email, $name);
        }

        /* The ticked box, wherever it was ticked. gdpr=true because the box is
           unticked by default and the words beside it say what it is for,
           which is the consent Sendy is recording. */
        if (($wantsNews || $form === 'newsletter') && function_exists('roars_sendy_subscribe')) {
            roars_sendy_subscribe('newsletter', $email, $name, ['gdpr' => 'true']);
        }
    },
);
