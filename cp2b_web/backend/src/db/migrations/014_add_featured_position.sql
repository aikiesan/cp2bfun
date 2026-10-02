-- Migration: Add featured_position to news table
-- Date: 2026-02-09

BEGIN;

-- Add column
ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);

-- Add check constraint
ALTER TABLE news DROP CONSTRAINT IF EXISTS check_featured_position;
ALTER TABLE news ADD CONSTRAINT check_featured_position
  CHECK (featured_position IN ('A', 'B', 'C'));

-- Add index
CREATE INDEX IF NOT EXISTS idx_news_featured
  ON news(featured_position)
  WHERE featured_position IS NOT NULL;

COMMIT;
