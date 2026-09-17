-- ---------------------------------------------------------------------------
-- 002  DEV ONLY. Clear the test rows and start the enquiry numbers at 1008.
--
-- NEVER RUN THIS ON PRODUCTION. The first statement deletes every row in the
-- table, and on production those rows are the enquiries.
--
-- THE ORDER MATTERS AND THE FAILURE IS SILENT. MySQL ignores an AUTO_INCREMENT
-- set at or below the highest id already present -- the statement succeeds,
-- returns no warning, and the counter does not move. DELETE on its own does
-- not reset it either. So both, in this order, or neither works.
-- ---------------------------------------------------------------------------

USE roars_forms;

-- What is about to go. Look before you run the rest.
SELECT id, form, email, created_at FROM submissions ORDER BY id;

DELETE FROM submissions;

ALTER TABLE submissions AUTO_INCREMENT = 1008;

-- Expect 1008. Anything else means rows survived the DELETE.
SELECT AUTO_INCREMENT AS next_enquiry_no
  FROM information_schema.TABLES
 WHERE TABLE_SCHEMA = 'roars_forms' AND TABLE_NAME = 'submissions';
