<?php
/**
 * TEMPLATE ONLY. Copy this OUTSIDE every web root, fill it in, and never commit
 * the filled copy. TWO FILES, both in the same folder:
 *
 *   /var/www/vhosts/roarsinc.com/roars-secrets.php       production
 *   /var/www/vhosts/roarsinc.com/roars-secrets-dev.php   dev.roarsinc.com
 *
 * `chmod 600` both. That folder is the subscription root, one level above
 * httpdocs and beside the dev.roarsinc.com folder, so nothing under either
 * document root can serve them.
 *
 * NOTHING HAS TO BE SET ON THE SERVER. roars_cfg() decides which of the two to
 * read from ITS OWN PATH ON DISK: dev.roarsinc.com is deployed under
 * /var/www/vhosts/roarsinc.com/dev.roarsinc.com/, so a helper running from
 * inside that folder reads the -dev file and one running from httpdocs reads
 * the other. That is a property of where the code sits, not of anything in the
 * request, so there is no header, host or path a visitor can send to make
 * production read dev's file or the reverse.
 *
 * (A ROARS_SECRETS_FILE environment variable still overrides both if one is
 * ever set. Nothing sets it: the Plesk plan has no "Additional Apache
 * directives" box to set it in, which is why the path test exists.)
 *
 * THE TWO FILES DIFFER IN ONE LINE. Production posts to the live n8n webhook,
 * dev posts to the test one:
 *
 *   production  https://n8n-wpvi.srv1477810.hstgr.cloud/webhook/roars-contact
 *   dev         https://n8n-wpvi.srv1477810.hstgr.cloud/webhook-test/roars-contact
 *
 * The dev webhook only answers while the workflow is open and listening in the
 * n8n editor. When it is not, roars_forward_lead() returns false and
 * contact.php emails sales@ instead. That is the fallback working, not a fault.
 *
 * NOTHING BREAKS IF EITHER FILE IS MISSING. Every integration logs a line
 * prefixed [roars] to the PHP error log and returns false; the visitor still
 * sees success and still gets their acknowledgement. A Sendy outage is not a
 * reason to lose a lead.
 */
return [
    // Sendy install root, no trailing slash. The helper posts to <SENDY_URL>/subscribe.
    'SENDY_URL'     => 'https://REPLACE-ME.example.com',
    // Sendy > Settings > Your API key.
    'SENDY_API_KEY' => 'REPLACE_ME',

    // See above: the two files differ here.
    'N8N_CONTACT_WEBHOOK' => 'https://n8n-wpvi.srv1477810.hstgr.cloud/webhook/roars-contact',

    // Sent as the X-Roars-Secret header on every forward. Must match
    // FORM_SECRET in the n8n workflow character for character, or n8n rejects
    // the post. Same value in both files.
    'N8N_FORM_SECRET'     => 'REPLACE_ME',
];
