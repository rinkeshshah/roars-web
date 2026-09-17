-- ---------------------------------------------------------------------------
-- 003  Retention. Run monthly as a Plesk scheduled task, as the ADMIN user.
--
-- ip and user_agent exist for abuse handling, not analytics. Nothing else in
-- the row is personal beyond what the sender chose to type, so the row itself
-- stays and the two forensic columns are emptied.
-- ---------------------------------------------------------------------------

USE roars_forms;

UPDATE submissions
   SET ip = NULL, user_agent = NULL
 WHERE created_at < NOW() - INTERVAL 90 DAY
   AND (ip IS NOT NULL OR user_agent IS NOT NULL);
