ALTER TABLE events RENAME TO microscopio;
DROP INDEX IF EXISTS idx_events_slug;
DROP INDEX IF EXISTS idx_events_published_at;
CREATE INDEX idx_microscopio_slug ON microscopio(slug);
CREATE INDEX idx_microscopio_published_at ON microscopio(published_at DESC NULLS LAST);
