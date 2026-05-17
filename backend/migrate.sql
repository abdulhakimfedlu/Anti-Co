-- Woreda 05 Anti-Corruption Portal — Full Schema Migration
-- Run this against the Anticorruption database

-- ─── Enums ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('Super Admin', 'Admin', 'Viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE message_status AS ENUM ('new', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE message_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE service_status AS ENUM ('active', 'hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Tables ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    TEXT UNIQUE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        admin_role NOT NULL DEFAULT 'Admin',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name   TEXT,
  sender_email  TEXT,
  is_anonymous  BOOLEAN NOT NULL DEFAULT FALSE,
  subject       TEXT NOT NULL,
  body          TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  priority      message_priority NOT NULL DEFAULT 'Medium',
  status        message_status NOT NULL DEFAULT 'new',
  resolved_at   TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  title_am        TEXT,
  description     TEXT,
  description_am  TEXT,
  category        TEXT NOT NULL,
  status          service_status NOT NULL DEFAULT 'active',
  is_popular      BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Add sort_order if table already existed without it ────────
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

SELECT 'Migration complete! Tables created: admins, messages, services' AS result;
