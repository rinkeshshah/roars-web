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

/* Sendy list subscribes and the n8n forward. Shared, so there is one
   integration rather than one per form.
   NOT a bare require_once. A hard require of a file that is not there is a
   fatal error, and a fatal error here is an empty 500 with no body and no
   clue -- which is exactly what a visitor got, on every form, when this ran
   before the file reached the server. The integrations are optional by
   design; their absence is a log line, not an outage. */
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
        $form = isset($payload['form']) ? '?form=' . rawurlencode((string) $payload['form']) : '';
        header('Location: /thankyou/' . $form, true, 303);
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

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { $fail(405, 'Method not allowed.'); }

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

/* Honeypot: fields real people never see and never fill. Answered exactly like
   a success so a bot learns nothing from the difference — no row, no mail, no
   n8n, no Sendy.
   TWO NAMES. `company_website` is this site's own and is on every form;
   `website` is the one the n8n flow expects and is what the bot-scoring step
   downstream reads. Filling either is disqualifying. */
if (($_POST['company_website'] ?? '') !== '' || ($_POST['website'] ?? '') !== '') {
    $done(['ok' => true]);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Rate limit: one file per IP hash, N posts per window. Cheap, no extra service.
$bucket = sys_get_temp_dir() . '/rl_' . hash('sha256', $ip . $cfg['rate_salt']);
$hits = is_file($bucket) && filemtime($bucket) > time() - $cfg['rate_window']
    ? (int) file_get_contents($bucket) : 0;
if ($hits >= $cfg['rate_max']) { $fail(429, 'Too many submissions. Try again shortly.'); }
file_put_contents($bucket, (string) ($hits + 1), LOCK_EX);

/**
 * Turnstile, verified server-side. A token the browser never checks is theatre.
 *
 * THREE OUTCOMES, NOT TWO, and the difference matters to whoever is filling in
 * the form. Cloudflare saying "this token is not valid" is the check working,
 * and that person is told. Cloudflare not answering at all is our problem, and
 * blocking every enquiry for the length of an outage is a worse failure than
 * letting a few through unverified -- the rate limit above and the honeypots
 * are still in force either way. No secret configured is the same case.
 */
$secret = (string) ($cfg['turnstile_secret'] ?? '');
if ($secret === '') {
    error_log('[roars] no turnstile secret configured; submission accepted unverified');
} else {
    $verify = @file_get_contents(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        false,
        stream_context_create(['http' => [
            'method' => 'POST', 'timeout' => 10, 'ignore_errors' => true,
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query([
                'secret' => $secret,
                'response' => (string) ($_POST['cf-turnstile-response'] ?? ''),
                'remoteip' => $ip,
            ]),
        ]]),
    );
    if ($verify === false) {
        error_log('[roars] turnstile siteverify unreachable; submission accepted unverified');
    } elseif (!(json_decode($verify, true)['success'] ?? false)) {
        $fail(403, 'Verification failed.');
    }
}

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
$saved = false;
$refId = 'RS-' . strtoupper(substr(base_convert((string) time(), 10, 36) . bin2hex(random_bytes(3)), 0, 8));

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
        $refId = 'RS-' . str_pad((string) $pdo->lastInsertId(), 6, '0', STR_PAD_LEFT);
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
$send = function (string $to, string $subject, string $html, string $text, ?array $attach = null, string $replyTo = '') use ($cfg): void {
    $alt = '=_a' . bin2hex(random_bytes(12));
    $inner = "--{$alt}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text), 76, "\r\n")
        . "--{$alt}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html), 76, "\r\n")
        . "--{$alt}--\r\n";

    /* From is noreply@, because these are machine-sent and nobody watches that
       mailbox. Reply-To is sales@, because a visitor who hits reply must reach
       a person — and because the n8n flow answers from that address, so the
       reply lands in the same thread as everything that follows. */
    $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $head = "From: {$cfg['from']}\r\n"
        . ($replyTo !== '' ? "Reply-To: {$replyTo}\r\n" : '')
        . "MIME-Version: 1.0\r\n";

    if ($attach === null) {
        @mail($to, $subj, $inner, $head . "Content-Type: multipart/alternative; boundary=\"{$alt}\"");
        return;
    }
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
    @mail($to, $subj, $body, $head . "Content-Type: multipart/mixed; boundary=\"{$mix}\"");
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
    . "Head Office: Roars Technologies Pvt. Ltd., Jaynagar, Bengaluru, Karnataka, 560041\r\n";

/* The internal work notification. Plain text: it is a work notification, not a
   brand piece. Reply-To is the visitor so a reply from sales@ reaches them.
   It is a CLOSURE now rather than a statement, because on the contact form it
   is conditional — see the dispatch at the foot of this file. */
$notifySales = function () use ($cfg, $refId, $form, $name, $email, $phone, $company, $country, $message, $saved): void {
    $lines = ($saved ? '' : "NOT SAVED TO THE DATABASE. This email is the only record.\r\n\r\n")
        . "From: {$name} <{$email}>\r\n"
        . ($company !== '' ? "Company: {$company}\r\n" : '')
        . ($phone   !== '' ? "Phone: {$phone}\r\n"   : '')
        . ($country !== '' ? "Country: {$country}\r\n" : '')
        . "\r\n{$message}";
    @mail(
        $cfg['notify_to'],
        "Roars enquiry {$refId}: {$form}",
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
    ]);
    $text = "Hi {$first},\r\n\r\nYour copy of {$guide['title']} is "
        . ($guide['path'] !== null ? "attached, and also here:\r\n{$url}" : "here:\r\n{$url}")
        . "\r\n\r\nIt is one page — print it, fill it in, take it into the room. "
        . "If the problem turns out to be bigger than a page, reply to this email "
        . "and we will take a look.\r\n\r\n— Roars Technologies\r\n{$postal}\r\n";
    $attach = $guide['path'] !== null ? ['path' => $guide['path'], 'name' => $guide['name']] : null;
    $visitorMail = function () use ($send, $email, $guide, $html, $text, $attach, $cfg): void {
        $send($email, "Your copy of {$guide['title']}", $html, $text, $attach, $cfg['notify_to']);
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
        'ref_id'         => $refId,
        'submitted_at'   => gmdate('j M Y, H:i') . ' UTC',
        'postal_address' => $postal,
        'booking_url'    => $booking,
    ]);
    /* The plain-text alternative says the same thing as the HTML, in the same
       voice, with no em dashes in it. Some clients show this and nothing else. */
    $text = "Hi {$first},\r\n\r\nThanks for saying hello.\r\n\r\n"
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
    $visitorMail = function () use ($send, $email, $html, $text, $cfg): void {
        $send($email, "Got it! We're on it.", $html, $text, null, $cfg['notify_to']);
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
    ['ok' => true, 'event' => 'generate_lead', 'form' => $form],
    function () use (
        $form, $visitorMail, $notifySales, $email, $name, $company, $country,
        $phone, $message, $elapsed, $pagePath, $wantsNews
    ): void {
        if ($visitorMail !== null) { $visitorMail(); }

        if ($form === 'contact') {
            $forwarded = function_exists('roars_forward_lead') && roars_forward_lead([
                'name'       => $name,
                'email'      => $email,
                'company'    => $company,
                'phone'      => $phone,
                'country'    => $country,
                'message'    => $message,
                'website'    => '', // the honeypot; a filled one never reaches here
                'elapsed_ms' => $elapsed,
                'page'       => $pagePath,
            ]);
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
