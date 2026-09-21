<?php
/**
 * TEMPLATE ONLY. Copy this OUTSIDE the document root, fill it in, and never
 * commit the filled copy:
 *
 *   /var/www/vhosts/roarsinc.com/private/contact-config.php   chmod 600
 *
 * That path is what contact.php requires. Nothing under httpdocs/ can be
 * fetched by a browser if it sits above the document root, which is the
 * entire point of putting it there.
 */
return [
    // The DB user here has INSERT on `submissions` and nothing else.
    // See docs/DEPLOYMENT.md for the GRANT.
    'dsn'     => 'mysql:host=127.0.0.1;dbname=roars_forms;charset=utf8mb4',
    'db_user' => 'roars_forms_insert',
    'db_pass' => '',

    'turnstile_secret' => '',

    'notify_to' => 'sales@roarsinc.com',
    'from'      => 'noreply@roarsinc.com',

    // Used to build the guide's download link (<site_url>/tools/<file>) and
    // printed in both email footers. contact.php defaults to these two values,
    // so an existing config file keeps working; set them to change either.
    'site_url'       => 'https://www.roarsinc.com',
    'postal_address' => '4th Block, Jayanagar, Bengaluru, India 560041',

    // Where the gated PDFs live on the webspace. ABSOLUTE path, and the only
    // directory contact.php will ever read a file from. A guide is attached
    // only when <slug>.pdf exists here and is within max_attach.
    'tools_dir'   => '/var/www/vhosts/roarsinc.com/httpdocs/tools',
    // Bytes. Past roughly 10MB most mail servers start bouncing attachments,
    // so a file over this is skipped rather than sent and rejected.
    'max_attach'  => 8 * 1024 * 1024,

    // Rate limit: rate_max posts per rate_window seconds, per IP.
    'rate_window' => 3600,
    'rate_max'    => 5,
    // Salts the IP before it becomes a filename, so /tmp does not leak a
    // visitor list to anything else on the box.
    'rate_salt'   => '',

    // Signs the form's minimum-fill-time stamp. Any long random string; it
    // never leaves the server and nothing derives from it, so it can be
    // changed whenever you like -- the only effect is that stamps issued in
    // the previous few seconds stop validating.
    //
    // OPTIONAL. Left empty, the rate limiter's salt above is used instead, so
    // an existing config file keeps working untouched. Empty BOTH and the
    // minimum fill time is not enforced at all: every signature would
    // validate against '', which is a check that looks armed and is not, so
    // contact.php logs a line saying exactly that.
    'stamp_secret' => '',
];
