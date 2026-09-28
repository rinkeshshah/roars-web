<?php
/**
 * A MINIMAL SMTP CLIENT, for the Google Workspace relay.
 *
 * WHY NOT PHPMailer. This project ships no dependencies and no build step on
 * the server; the whole endpoint is three files Plesk pulls as-is. Vendoring a
 * mail library to open a socket, say EHLO, STARTTLS and DATA is a lot of
 * surface for one conversation we make no use of ninety per cent of. There is
 * no authentication to get wrong, no OAuth, no pooling, no queue. This is that
 * conversation and nothing else.
 *
 * WHY NOT mail(). The Plesk host's own MTA is not in the domain's SPF record
 * and its DKIM key is currently unparseable, so every acknowledgement it sent
 * was arriving unauthenticated. The relay is already authorised to send as
 * roarsinc.com, so mail that goes through it is aligned on both counts without
 * anything changing in DNS.
 *
 * NO AUTH, BY DESIGN. smtp-relay.gmail.com authorises by sending IP; the
 * server's address is on the allow list in the Workspace admin console. That
 * is also the failure mode to recognise first: a 550 naming the IP means the
 * allow list, not the code.
 *
 * IPv4 ONLY. The relay's allow list holds an IPv4 address. If this host has a
 * AAAA route to Google it will use it by default, arrive from an address
 * nobody allowed, and be refused with a message about relaying -- which reads
 * like a configuration error and is really a routing one. So the A record is
 * resolved here and the socket is opened on the address, with the hostname
 * carried into TLS separately for SNI and certificate verification.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: queue, retry, pool connections, or fall
 * back to mail(). One attempt, one connection, one message. A failure is a
 * [roars] line in the error log and nothing else -- never an error a visitor
 * sees, because this is only ever called after the response has gone back.
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


const ROARS_SMTP_HOST = 'smtp-relay.gmail.com';
const ROARS_SMTP_PORT = 587;

/**
 * Deliver one already-assembled message.
 *
 * @param string   $from    envelope sender, e.g. noreply@roarsinc.com
 * @param string[] $rcpt    every envelope recipient, INCLUDING Bcc. The
 *                          envelope is what decides delivery; the headers only
 *                          decide what is displayed, which is exactly why a
 *                          Bcc belongs here and not up there.
 * @param string   $message full RFC 5322 message: headers, blank line, body.
 * @param array    $opt     host, port
 */
function roars_smtp_send(string $from, array $rcpt, string $message, array $opt = [], ?array &$trace = null): bool
{
    /* $trace, when passed, collects every step as ['step' => ..., 'code' =>
       ..., 'reply' => ...]. $opt['probe'] stops the conversation after RCPT
       and sends RSET instead of DATA, so the diagnostic exercises THIS
       function rather than a second copy of it that could drift. A probe that
       does not share the code path is a probe that can pass while the real
       path fails. */
    $probe = (bool) ($opt['probe'] ?? false);
    $trace = [];
    $note = static function (string $step, int $code, string $reply) use (&$trace): void {
        $trace[] = ['step' => $step, 'code' => $code, 'reply' => $reply];
    };

    $host = (string) ($opt['host'] ?? ROARS_SMTP_HOST);
    $port = (int) ($opt['port'] ?? ROARS_SMTP_PORT);
    $rcpt = array_values(array_unique(array_filter($rcpt, static fn($r) => is_string($r) && $r !== '')));

    if ($rcpt === []) {
        error_log('[roars] smtp: nothing to send, no recipients');
        $note('recipients', 0, 'none given');
        return false;
    }

    /* A records only. gethostbynamel returns IPv4 and nothing else, which is
       the whole point; a null means DNS failed, not that the host is v6-only. */
    $ips = gethostbynamel($host);
    if ($ips === false || $ips === []) {
        error_log("[roars] smtp: cannot resolve {$host} to an IPv4 address");
        $note('resolve', 0, "no A record for {$host}");
        return false;
    }

    /* The certificate is issued for the NAME; we are connecting to the
       ADDRESS. peer_name carries the name across so verification still means
       something, rather than being switched off to make it pass.
       $opt['ssl'] overlays this -- for a relay behind a private CA, and for
       the local harness that proves this client's command sequence against a
       throwaway certificate. It can only ever be set by the caller in code;
       nothing from a request reaches it. */
    $ctx = stream_context_create(['ssl' => ((array) ($opt['ssl'] ?? [])) + [
        'peer_name'         => $host,
        'SNI_enabled'       => true,
        'verify_peer'       => true,
        'verify_peer_name'  => true,
        'allow_self_signed' => false,
    ]]);

    $ip = $ips[0];
    $fp = @stream_socket_client(
        "tcp://{$ip}:{$port}",
        $errno,
        $errstr,
        5,
        STREAM_CLIENT_CONNECT,
        $ctx,
    );
    if ($fp === false) {
        error_log("[roars] smtp: cannot connect to {$host} [{$ip}]:{$port} - {$errstr} ({$errno})");
        $note('connect', 0, "{$host} [{$ip}]:{$port} - {$errstr} ({$errno})");
        return false;
    }
    stream_set_timeout($fp, 10);
    $note('connect', 0, "tcp://{$ip}:{$port} open (ipv4, resolved from {$host})");

    /** Read one reply, following any continuation lines ("250-" before "250 "). */
    $read = static function () use ($fp): array {
        $lines = [];
        do {
            $line = fgets($fp, 1024);
            if ($line === false) { return [0, 'no reply (timeout or closed)']; }
            $lines[] = rtrim($line, "\r\n");
            $more = strlen($line) >= 4 && $line[3] === '-';
        } while ($more);
        $last = end($lines);
        return [(int) substr($last, 0, 3), implode(' | ', $lines)];
    };

    $ok = true;
    /** Send one command and insist on the code it is supposed to get back. */
    $say = static function (string $cmd, int $expect) use ($fp, $read, &$ok, $note): bool {
        if (!$ok) { return false; }
        if ($cmd !== '') { fwrite($fp, $cmd . "\r\n"); }
        [$code, $text] = $read();
        $note($cmd === '' ? '(greeting)' : $cmd, $code, $text);
        if ($code !== $expect) {
            $shown = $cmd === '' ? '(greeting)' : explode(' ', $cmd)[0];
            error_log("[roars] smtp: {$shown} expected {$expect}, got {$code}: {$text}");
            $ok = false;
            return false;
        }
        return true;
    };

    /* The EHLO name should be a name this host answers to. The configured
       server name is right when there is one; the sender's domain is a better
       guess than "localhost" when there is not. */
    $ehlo = (string) ($_SERVER['SERVER_NAME'] ?? '');
    if ($ehlo === '' || $ehlo === 'localhost') {
        $ehlo = substr((string) strrchr($from, '@'), 1) ?: 'roarsinc.com';
    }

    $say('', 220);
    $say("EHLO {$ehlo}", 250);
    $say('STARTTLS', 220);

    if ($ok) {
        /* TLS_CLIENT means "the best TLS both ends know", which keeps this
           working as 1.2 goes the way of 1.0 rather than pinning a version
           that will one day be refused. */
        $up = @stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        if ($up !== true) {
            error_log("[roars] smtp: STARTTLS handshake failed against {$host} [{$ip}]");
            $note('(tls handshake)', 0, 'failed');
            $ok = false;
        } else {
            $meta = stream_get_meta_data($fp);
            $note('(tls handshake)', 0, 'up' . (isset($meta['crypto']['protocol']) ? ' - ' . $meta['crypto']['protocol'] : ''));
        }
    }

    /* EHLO again: everything the server said before STARTTLS is discarded on
       purpose, because it was said in the clear. */
    $say("EHLO {$ehlo}", 250);
    $say("MAIL FROM:<{$from}>", 250);
    foreach ($rcpt as $to) {
        $say("RCPT TO:<{$to}>", 250);
    }
    if ($probe) {
        /* A probe proves the relay will accept a message from this address to
           that recipient, and then throws the transaction away. RSET, never
           DATA: nothing is delivered and nothing lands in anybody's inbox. */
        $say('RSET', 250);
        if ($ok) { fwrite($fp, "QUIT\r\n"); }
        fclose($fp);
        return $ok;
    }

    $say('DATA', 354);

    if ($ok) {
        /* Dot-stuffing. A line that is a single "." ends the message, so any
           line starting with one gets a second: the receiver strips it back.
           Skipping this lets a message body truncate itself. */
        $body = preg_replace('/^\./m', '..', str_replace("\n", "\r\n", str_replace("\r\n", "\n", $message)));
        fwrite($fp, $body . "\r\n.\r\n");
        $say('', 250);
    }

    if ($ok) {
        fwrite($fp, "QUIT\r\n");
    }
    fclose($fp);

    return $ok;
}

/**
 * Assemble and deliver. The caller owns the MIME body; this owns the envelope
 * and the headers every message needs and none of them carried, because mail()
 * used to add them: Date, Message-ID, To and Subject.
 *
 * @param array $h extra headers as name => value, in the order they should appear
 */
function roars_smtp_mail(
    string $from,
    string $to,
    string $subject,
    string $body,
    array $h = [],
    string $bcc = '',
    array $opt = [],
): bool {
    $domain = substr((string) strrchr($from, '@'), 1) ?: 'roarsinc.com';

    $headers = [
        'Date'        => date('r'),
        'Message-ID'  => '<' . bin2hex(random_bytes(12)) . '.' . time() . '@' . $domain . '>',
        'From'        => $from,
        'To'          => $to,
        /* Encoded because these carry apostrophes and, historically, dashes
           that are not ASCII. A raw 8-bit subject is the one header clients
           disagree about most. */
        'Subject'     => '=?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version' => '1.0',
    ] + $h;

    $raw = '';
    foreach ($headers as $k => $v) {
        if ($v === '' || $v === null) { continue; }
        $raw .= "{$k}: {$v}\r\n";
    }
    /* Bcc is NOT written into the headers. It goes in the envelope below,
       which is what actually decides who receives it -- writing it here would
       show every visitor who else was copied. */
    $raw .= "\r\n" . $body;

    return roars_smtp_send($from, $bcc === '' ? [$to] : [$to, $bcc], $raw, $opt);
}
