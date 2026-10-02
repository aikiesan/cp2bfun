-- Migration: rename the `events` table to `microscopio`.
--
-- Only the rename and the old indexes live here. The two microscopio
-- indexes were created in this file, but they reference `published_at`,
-- a column 013_fix_microscopio_schema.sql adds — and 013 sorts before
-- this rename, so on a fresh database the index creation failed and
-- rolled the rename back with it. 013 already creates both indexes
-- idempotently, so this file leaves them to it.
ALTER TABLE events RENAME TO microscopio;
DROP INDEX IF EXISTS idx_events_slug;
DROP INDEX IF EXISTS idx_events_published_at;
