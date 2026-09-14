<?php
/**
 * The only server-side code in this project. Keep it this size.
 *
 * Config lives OUTSIDE the document root. Its DB user holds INSERT on one
 * table and nothing else, so a leaked credential buys junk rows, not data.
 * See docs/DEPLOYMENT.md for the CREATE TABLE and GRANT.
 */
declare(strict_types=1);

header('Content-Type: application/json');
$fail = function (int $code, string $msg): never {
    http_response_code($code);
    // Fixed strings only. User input is never echoed back.
    exit(json_encode(['ok' => false, 'error' => $msg]));
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { $fail(405, 'Method not allowed.'); }

$cfg = require '/var/www/vhosts/roarsinc.com/private/contact-config.php';

// Honeypot: a field real people never see and never fill.
if (($_POST['company_website'] ?? '') !== '') { exit(json_encode(['ok' => true])); }

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Rate limit: one file per IP hash, N posts per window. Cheap, no extra service.
$bucket = sys_get_temp_dir() . '/rl_' . hash('sha256', $ip . $cfg['rate_salt']);
$hits = is_file($bucket) && filemtime($bucket) > time() - $cfg['rate_window']
    ? (int) file_get_contents($bucket) : 0;
if ($hits >= $cfg['rate_max']) { $fail(429, 'Too many submissions. Try again shortly.'); }
file_put_contents($bucket, (string) ($hits + 1), LOCK_EX);

// Turnstile, verified server-side. A token the browser never checks is theatre.
$verify = @file_get_contents(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    false,
    stream_context_create(['http' => [
        'method' => 'POST', 'timeout' => 10, 'ignore_errors' => true,
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'secret' => $cfg['turnstile_secret'],
            'response' => (string) ($_POST['cf-turnstile-response'] ?? ''),
            'remoteip' => $ip,
        ]),
    ]]),
);
if (!$verify || !(json_decode($verify, true)['success'] ?? false)) { $fail(403, 'Verification failed.'); }

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
 * The browser posts a SLUG, never a path, and a slug that is not on this list
 * is refused before it touches the filesystem. That is the whole defence
 * against path traversal: there is no string from the request in the filename.
 *
 * Kept in step with docs/URL-INVENTORY.csv by scripts/validate-content.mjs,
 * which fails the build if the two disagree. Do not edit one without the
 * other.
 */
const GUIDE_SLUGS = [
    'problem-definition', 'pitching-checklist', 'evidence-planning', 'swot-analysis',
    'innovation-flowchart', 'business-model-canvas', 'learning-loop', 'building-partnerships',
    'website-redesign-roi-calculator', 'product-solution-benefit', 'value-proposition',
    'business-plan', 'target-group', 'prototype-testing-plan', 'people-connection-map',
];

$guide = null;
if ($form === 'guide') {
    $slug = (string) ($_POST['guide'] ?? '');
    if (!in_array($slug, GUIDE_SLUGS, true)) { $fail(422, 'Unknown guide.'); }
    $path = rtrim($cfg['tools_dir'], '/') . '/' . $slug . '.pdf';
    // Belt and braces. The slug is already allowlisted, so realpath can only
    // fail here if the file is missing or someone has moved the directory.
    $real = realpath($path);
    $root = realpath($cfg['tools_dir']);
    if ($real !== false && $root !== false && str_starts_with($real, $root . '/')
        && is_file($real) && filesize($real) <= $cfg['max_attach']) {
        $guide = ['path' => $real, 'name' => $slug . '.pdf'];
    }
    // A missing file is NOT an error to the visitor. The row is still saved
    // and sales still gets the notification, so the lead is not lost; the
    // reply just points at the page instead of carrying the file.
}

// Prepared statement. No value is ever concatenated into SQL.
$pdo = new PDO($cfg['dsn'], $cfg['db_user'], $cfg['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
$pdo->prepare(
    'INSERT INTO submissions (form, name, email, phone, message, page_url, referrer, ip, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
)->execute([
    $form, mb_substr($name, 0, 190), $email,
    mb_substr(trim((string) ($_POST['phone'] ?? '')), 0, 40),
    mb_substr(trim((string) ($_POST['message'] ?? '')), 0, 5000),
    mb_substr((string) ($_POST['page_url'] ?? ''), 0, 500),
    mb_substr((string) ($_SERVER['HTTP_REFERER'] ?? ''), 0, 500),
    $ip, mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
]);

// Both emails. Headers carry only the validated address — $email has been
// through FILTER_VALIDATE_EMAIL, so it cannot carry a CRLF and cannot inject a
// header. $name never goes in a header at all, only in a body.
$to = $cfg['notify_to'];
$who = $name !== '' ? $name : 'there';
@mail($to, "Roars enquiry: {$form}", "From: {$name} <{$email}>", "From: {$cfg['from']}\r\nReply-To: {$email}");

if ($guide !== null) {
    /**
     * The guide, attached. multipart/mixed built by hand because this project
     * ships no mail library and is not about to add one for two parts.
     *
     * The boundary is random per message, so nothing in the body can close the
     * part early. The filename comes from the allowlisted slug, never from the
     * request. Base64 in 76-character lines, which is what RFC 2045 wants and
     * what every client expects.
     */
    $b = '=_' . bin2hex(random_bytes(16));
    $headers = "From: {$cfg['from']}\r\nMIME-Version: 1.0\r\n"
        . "Content-Type: multipart/mixed; boundary=\"{$b}\"";
    $body = "--{$b}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . "Hi {$who},\r\n\r\nYour guide is attached. It is one page — print it, "
        . "fill it in, take it into the room.\r\n\r\nIf it turns out the problem is "
        . "bigger than a page, reply to this email and we will take a look.\r\n\r\n"
        . "— Roars Technologies\r\n\r\n"
        . "--{$b}\r\n"
        . "Content-Type: application/pdf; name=\"{$guide['name']}\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . "Content-Disposition: attachment; filename=\"{$guide['name']}\"\r\n\r\n"
        . chunk_split(base64_encode((string) file_get_contents($guide['path'])), 76, "\r\n")
        . "--{$b}--";
    @mail($email, 'Your guide from Roars', $body, $headers);
} else {
    @mail($email, 'We have your message', "Thanks {$who}, we reply within 24 hours.", "From: {$cfg['from']}");
}

// generate_lead fires from THIS response, never from the submit handler.
// Clicking is not converting.
exit(json_encode(['ok' => true, 'event' => 'generate_lead', 'form' => $form]));
