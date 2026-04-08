-- Migration: Fix microscopio table schema
-- The microscopio table was left with old calendar-style columns because
-- migration ordering bugs (unnumbered files sorting after numbered ones)
-- caused the rename/restructure migrations to either abort or run in wrong order.
-- This migration is idempotent: safe to run on any existing microscopio state.

-- Drop old calendar-specific columns (some have NOT NULL constraints that block INSERT)
ALTER TABLE microscopio DROP COLUMN IF EXISTS event_type;
ALTER TABLE microscopio DROP COLUMN IF EXISTS location;
ALTER TABLE microscopio DROP COLUMN IF EXISTS location_type;
ALTER TABLE microscopio DROP COLUMN IF EXISTS start_date;
ALTER TABLE microscopio DROP COLUMN IF EXISTS end_date;
ALTER TABLE microscopio DROP COLUMN IF EXISTS registration_url;
ALTER TABLE microscopio DROP COLUMN IF EXISTS organizer;
ALTER TABLE microscopio DROP COLUMN IF EXISTS max_participants;
ALTER TABLE microscopio DROP COLUMN IF EXISTS current_participants;
ALTER TABLE microscopio DROP COLUMN IF EXISTS status;
ALTER TABLE microscopio DROP COLUMN IF EXISTS featured;

-- Add article-style columns (IF NOT EXISTS ensures idempotency)
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS content_pt TEXT;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS badge_color VARCHAR(50) DEFAULT 'primary';
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS date_display VARCHAR(50);
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS image_caption_pt TEXT;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS image_caption_en TEXT;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_microscopio_slug ON microscopio(slug);
CREATE INDEX IF NOT EXISTS idx_microscopio_published_at ON microscopio(published_at DESC NULLS LAST);
