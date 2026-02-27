-- Migration: Add sort_order to news table for manual drag-and-drop ordering
-- Date: 2026-02-27

BEGIN;

ALTER TABLE news ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Initialize sort_order based on existing publication order
UPDATE news SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY published_at DESC NULLS LAST, created_at DESC) AS rn
  FROM news
) sub
WHERE news.id = sub.id AND news.sort_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_news_sort_order ON news(sort_order);

COMMIT;
