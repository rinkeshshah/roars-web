<?php
/**
 * Roars form integrations: Sendy list subscribes + forwarding contact leads to n8n.
 *
 * Secrets live OUTSIDE the web root in a file that returns an array, e.g.
 * /var/www/vhosts/roarsinc.com/roars-secrets.php:
 *
 *   <?php return [
 *     'SENDY_URL'           => 'https://your-sendy-install.example.com',
 *     'SENDY_API_KEY'       => '...',
 *     'N8N_CONTACT_WEBHOOK' => 'https://your-n8n-domain/webhook/roars-contact',
 *     'N8N_FORM_SECRET'     => '...long random string, same as FORM_SECRET in n8n...',
 *   ];
 *
 * Files (both outside every web root):
 *   /var/www/vhosts/roarsinc.com/roars-secrets.php      used by roarsinc.com
 *   /var/www/vhosts/roarsinc.com/roars-secrets-dev.php  used by dev.roarsinc.com (picked automatically from this file's path)
 * ROARS_SECRETS_FILE, if set in the environment, overrides both.
 */

declare(strict_types=1);

/**
 * NOT A PAGE. This file is an include, and it is inside the document root
 * because that is where Plesk's git deploy puts everything -- so it has a URL
 * whether it wants one or not.
 *
 * A direct GET currently returns 200 and an empty body, because the file only
 * declares things. That is harmless today and one PHP misconfiguration away
 * from not being: a handler that stops executing .php serves the source
 * instead, and the source of an include that reads a secrets file is a map to
 * it. .htaccess says no as well; this is the half that does not depend on the
 * web server being configured the way we expect.
 */
if (!defined('ROARS_ENTRY')) {
    http_response_code(403);
    exit;
}


const ROARS_SENDY_LISTS = [
    'contact'    => 'r4CwewqWvdt55FmszpYDSw',
    'newsletter' => 'PXNOyzX5l0XMufbBWBjnQw',
    'resources'  => '00TRm4sPdhw38HROORoOug',
];

/** True when this code runs under dev.roarsinc.com (decided by file path, not the Host header). */
function roars_is_dev(): bool
{
    return str_contains(__DIR__, '/dev.roarsinc.com/') || str_ends_with(__DIR__, '/dev.roarsinc.com');
}

function roars_cfg(string $key): string
{
    static $cfg = null;
    if ($cfg === null) {
        // Dev and production share one subscription; pick the file by where this code lives.
        $default = '/var/www/vhosts/roarsinc.com/' . (roars_is_dev() ? 'roars-secrets-dev.php' : 'roars-secrets.php');
        $file = getenv('ROARS_SECRETS_FILE') ?: $default;
        $cfg = is_file($file) ? (array) require $file : [];
    }
    $value = $cfg[$key] ?? getenv($key);
    return is_string($value) ? $value : '';
}

function roars_http_post(string $url, array $fields, array $headers = [], int $timeout = 6): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($fields),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_HTTPHEADER     => array_merge(['Content-Type: application/x-www-form-urlencoded'], $headers),
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    return [
        'ok'    => $body !== false && $code >= 200 && $code < 300,
        'code'  => $code,
        'body'  => is_string($body) ? $body : '',
        'error' => $error,
    ];
}

/**
 * Subscribe someone to a Sendy list.
 * $listKey: 'newsletter' | 'resources' | 'contact'
 * $extra:   optional Sendy params, e.g. ['gdpr' => 'true'] or custom fields by their Sendy name.
 * Returns true on success or if they were already subscribed.
 */
function roars_sendy_subscribe(string $listKey, string $email, string $name = '', array $extra = []): bool
{
    $url  = rtrim(roars_cfg('SENDY_URL'), '/');
    $key  = roars_cfg('SENDY_API_KEY');
    $list = ROARS_SENDY_LISTS[$listKey] ?? '';

    if ($url === '' || $key === '' || $list === '' || str_starts_with($list, 'REPLACE_')) {
        error_log("[roars] Sendy not configured for list '$listKey'");
        return false;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $fields = array_merge([
        'api_key'   => $key,
        'list'      => $list,
        'email'     => $email,
        'name'      => mb_substr(trim($name), 0, 120),
        'ipaddress' => $_SERVER['REMOTE_ADDR'] ?? '',
        'referrer'  => $_SERVER['HTTP_REFERER'] ?? '',
        'boolean'   => 'true',
    ], $extra);

    $r = roars_http_post($url . '/subscribe', $fields);
    $reply = trim($r['body']);
    $ok = $r['ok'] && ($reply === '1' || stripos($reply, 'already subscribed') !== false);

    if (!$ok) {
        error_log("[roars] Sendy subscribe failed ($listKey): HTTP {$r['code']} {$reply} {$r['error']}");
    }
    return $ok;
}

/**
 * Forward a contact form submission to the n8n lead flow.
 * Pass the enquiry number from the database as $form['enquiry_no'] (e.g. 1008).
 * Dev numbers are sent as DEV-1008 so they never collide with production in the shared lead sheet.
 * n8n sends the acknowledgement, so the site should NOT send its own auto-reply for contact.
 * Returns false if n8n could not be reached, so the caller can fall back to its old notification email.
 */
function roars_forward_lead(array $form): bool
{
    $url = roars_cfg('N8N_CONTACT_WEBHOOK');
    if ($url === '') {
        error_log('[roars] N8N_CONTACT_WEBHOOK not configured');
        return false;
    }

    $allowed = ['name', 'email', 'company', 'phone', 'country', 'message', 'website', 'elapsed_ms', 'page'];
    $fields = [];
    foreach ($allowed as $k) {
        $v = $form[$k] ?? '';
        $fields[$k] = is_scalar($v) ? (string) $v : '';
    }
    $fields['ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
    $no = $form['enquiry_no'] ?? '';
    if (is_scalar($no) && (string) $no !== '') {
        $fields['enquiry_no'] = (roars_is_dev() ? 'DEV-' : '') . preg_replace('/[^A-Za-z0-9-]/', '', (string) $no);
    }

    $secret = roars_cfg('N8N_FORM_SECRET');
    $r = roars_http_post($url, $fields, $secret !== '' ? ['X-Roars-Secret: ' . $secret] : []);

    if (!$r['ok']) {
        error_log("[roars] n8n forward failed: HTTP {$r['code']} {$r['error']}");
    }
    return $r['ok'];
}

/**
 * Send the response to the visitor first, then run slow integrations.
 * Call this AFTER you've echoed/redirected. Works on PHP-FPM (Plesk default).
 */
function roars_after_response(callable $work): void
{
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        ignore_user_abort(true);
        @ob_end_flush();
        flush();
    }
    $work();
}
