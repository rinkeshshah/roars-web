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
 * Point ROARS_SECRETS_FILE at it (Plesk > PHP Settings or .user.ini), or edit the default below.
 * Use a separate secrets file for dev.roarsinc.com so test submissions never hit the live lists.
 */

declare(strict_types=1);

const ROARS_SENDY_LISTS = [
    'contact'    => 'r4CwewqWvdt55FmszpYDSw',
    'newsletter' => 'PXNOyzX5l0XMufbBWBjnQw',
    'resources'  => '00TRm4sPdhw38HROORoOug',
];

function roars_cfg(string $key): string
{
    static $cfg = null;
    if ($cfg === null) {
        $file = getenv('ROARS_SECRETS_FILE') ?: '/var/www/vhosts/roarsinc.com/roars-secrets.php';
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
