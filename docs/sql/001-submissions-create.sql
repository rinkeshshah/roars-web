-- ---------------------------------------------------------------------------
-- 001  submissions: the table every form writes to, and the enquiry numbers.
--
-- RUN AS THE PLESK ADMIN USER, not as roars_forms_insert -- that account holds
-- INSERT on one table and nothing else, which is the point of it, so it cannot
-- create or alter anything.
--
--   mysql -u admin -p < 001-submissions-create.sql
--
-- or paste it into Plesk > Databases > phpMyAdmin > SQL.
--
-- Safe to run twice: every statement is IF NOT EXISTS, and the AUTO_INCREMENT
-- line cannot lower a counter that has already moved past it.
--
-- BEFORE YOU RUN IT set a real password on line 45. Do not ship the literal.
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS roars_forms
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE roars_forms;

CREATE TABLE IF NOT EXISTS submissions (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form        ENUM('contact','newsletter','guide','callback') NOT NULL,
  name        VARCHAR(190)  NOT NULL,
  email       VARCHAR(254)  NOT NULL,
  phone       VARCHAR(40)       NULL,
  message     TEXT              NULL,
  page_url    VARCHAR(500)      NULL,
  referrer    VARCHAR(500)      NULL,
  -- Retention-limited. Purged at 90 days by 003.
  ip          VARCHAR(45)       NULL,
  user_agent  VARCHAR(255)      NULL,
  status      ENUM('new','contacted','qualified','spam')
              NOT NULL DEFAULT 'new',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_form_created (form, created_at),
  KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- THE ENQUIRY NUMBER IS THIS ID. contact.php prints it to the visitor as
-- #1008, puts it in the acknowledgement's subject, and files the lead under it
-- in n8n. It starts here so the first one does not announce itself as the
-- first enquiry the company has ever taken.
--
-- On a table that already holds rows this line does nothing and says nothing:
-- MySQL ignores an AUTO_INCREMENT below the highest id present and does not
-- raise an error. That is what 002 is for.
ALTER TABLE submissions AUTO_INCREMENT = 1008;

-- ---------------------------------------------------------------------------
-- The endpoint's database user. INSERT, on one table, from localhost only.
--
-- No SELECT, so the endpoint cannot read back what it wrote. No UPDATE or
-- DELETE, so it cannot alter history. No DROP. A leaked credential buys junk
-- rows, not a data breach. Read submissions as the admin user.
-- ---------------------------------------------------------------------------

CREATE USER IF NOT EXISTS 'roars_forms_insert'@'localhost'
  IDENTIFIED BY 'PUT-A-REAL-PASSWORD-HERE';

GRANT INSERT ON roars_forms.submissions TO 'roars_forms_insert'@'localhost';

FLUSH PRIVILEGES;

-- Confirm the grant is exactly what you meant. Expect two lines and no more:
--   GRANT USAGE ON *.* TO ...
--   GRANT INSERT ON `roars_forms`.`submissions` TO ...
SHOW GRANTS FOR 'roars_forms_insert'@'localhost';

-- Confirm the next enquiry number. Expect 1008.
SELECT AUTO_INCREMENT AS next_enquiry_no
  FROM information_schema.TABLES
 WHERE TABLE_SCHEMA = 'roars_forms' AND TABLE_NAME = 'submissions';
