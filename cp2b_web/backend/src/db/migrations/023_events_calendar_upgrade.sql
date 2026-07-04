-- The /api/events route previously pointed at the microscopio table, leaving
-- the real events calendar table unused. This migration equips events for
-- per-event public pages (/eventos/:slug) with rich content, a run-of-show
-- schedule and linked gallery albums.

ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS content_pt TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb;
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_album_ids JSONB DEFAULT '[]'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug) WHERE slug IS NOT NULL;
