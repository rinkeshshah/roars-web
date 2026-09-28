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
if ($name === '' || $email === false) { $fail(422, 'Name and a valid email are required.'); }

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

// Both emails. Headers carry only the validated address.
$to = $cfg['notify_to'];
@mail($to, "Roars enquiry: {$form}", "From: {$name} <{$email}>", "From: {$cfg['from']}\r\nReply-To: {$email}");
@mail($email, 'We have your message', "Thanks {$name}, we reply within 24 hours.", "From: {$cfg['from']}");

// generate_lead fires from THIS response, never from the submit handler.
// Clicking is not converting.
exit(json_encode(['ok' => true, 'event' => 'generate_lead', 'form' => $form]));
