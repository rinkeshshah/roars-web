-- ---------------------------------------------------------------------------
-- 001b  submissions, created by a PLESK DATABASE USER rather than by admin.
--
-- USE THIS ONE if phpMyAdmin answered 001 with:
--
--   #1044 - Access denied for user 'roars2019'@'%' to database 'information_schema'
--
-- That is not a fault in the SQL. A Plesk database user holds rights on its own
-- database and nothing else: it cannot CREATE DATABASE, cannot CREATE USER,
-- cannot GRANT, and cannot read information_schema. 001 does all four, because
-- it is written for the admin account.
--
-- This file does only what a database user is allowed to do, which is
-- everything that actually matters: the table, the charset, the starting
-- enquiry number, and a check that needs no special privilege.
--
-- BEFORE YOU RUN IT: pick the database in the phpMyAdmin sidebar first, so the
-- table is created in the right one. There is no USE statement here on purpose
-- -- naming the wrong database is the one mistake this script cannot undo.
--
-- WHAT PLESK ALREADY GAVE YOU: the database and the user on it. Whatever that
-- pair is called, contact-config.php has to name the same two:
--
--   'dsn'     => 'mysql:host=127.0.0.1;dbname=<this database>;charset=utf8mb4',
--   'db_user' => '<this user>',
--   'db_pass' => '<its password>',
--
-- The insert-only account in 001 is the safer arrangement and needs admin to
-- create. Until then this user works; it simply holds more rights than the
-- endpoint uses.
-- ---------------------------------------------------------------------------

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

-- THE ENQUIRY NUMBER IS THIS ID. contact.php prints it as #1008, carries it in
-- the acknowledgement's subject, and files the lead under it in n8n.
--
-- On a table that already holds rows this line does nothing and says nothing:
-- MySQL ignores an AUTO_INCREMENT at or below the highest id present and
-- raises no warning. Clear the rows first if that is the case -- see 002.
ALTER TABLE submissions AUTO_INCREMENT = 1008;

-- The check, without information_schema. Read Auto_increment in the result:
-- expect 1008.
SHOW TABLE STATUS LIKE 'submissions';
