<?php
/**
 * TEMPLATE ONLY. Copy this OUTSIDE the document root, fill it in, and never
 * commit the filled copy. One file PER ENVIRONMENT, so a test submission on
 * dev can never reach a live Sendy list or the production n8n workflow:
 *
 *   /var/www/vhosts/roarsinc.com/private/roars-secrets.php         chmod 600
 *   /var/www/vhosts/dev.roarsinc.com/private/roars-secrets.php     chmod 600
 *
 * Then point each domain at its own copy. Plesk > Websites & Domains >
 * <domain> > PHP Settings > Additional directives:
 *
 *   env[ROARS_SECRETS_FILE] = /var/www/vhosts/roarsinc.com/private/roars-secrets.php
 *
 * roars_cfg() in roars-integrations.php reads ROARS_SECRETS_FILE, falls back
 * to /var/www/vhosts/roarsinc.com/roars-secrets.php, and falls back again to
 * a plain environment variable of the same name. Setting it per domain is what
 * keeps the two environments apart, so do not rely on the default path.
 *
 * NOTHING BREAKS IF THIS FILE IS MISSING. Every integration logs a line
 * prefixed [roars] to the PHP error log and returns false; the visitor still
 * sees success and still gets their email. That is deliberate: a Sendy outage
 * is not a reason to lose a lead.
 */
return [
    // Sendy install root, no trailing slash. The helper posts to <SENDY_URL>/subscribe.
    'SENDY_URL'     => 'https://REPLACE-ME.example.com',
    // Sendy > Settings > Your API key.
    'SENDY_API_KEY' => 'REPLACE_ME',

    // The n8n lead flow. Production and dev are DIFFERENT webhooks:
    //   prod https://n8n-wpvi.srv1477810.hstgr.cloud/webhook/roars-contact
    //   dev  https://n8n-wpvi.srv1477810.hstgr.cloud/webhook-test/roars-contact
    // The dev one only answers while the workflow is listening in the n8n
    // editor. When it is not, roars_forward_lead() returns false and
    // contact.php sends the internal notification instead, which is the
    // fallback working as intended rather than a failure.
    'N8N_CONTACT_WEBHOOK' => 'https://n8n-wpvi.srv1477810.hstgr.cloud/webhook-test/roars-contact',

    // Sent as the X-Roars-Secret header on every forward. Must match
    // FORM_SECRET in the n8n workflow exactly, or n8n rejects the post.
    'N8N_FORM_SECRET'     => 'REPLACE_ME',
];
