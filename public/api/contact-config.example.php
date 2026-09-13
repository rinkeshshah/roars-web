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

    // Rate limit: rate_max posts per rate_window seconds, per IP.
    'rate_window' => 3600,
    'rate_max'    => 5,
    // Salts the IP before it becomes a filename, so /tmp does not leak a
    // visitor list to anything else on the box.
    'rate_salt'   => '',
];
