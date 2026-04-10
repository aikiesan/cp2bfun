-- Migration: Create press_kit_items table for downloadable press materials
CREATE TABLE IF NOT EXISTS press_kit_items (
  id           SERIAL PRIMARY KEY,
  title_pt     TEXT NOT NULL,
  title_en     TEXT,
  file_url     TEXT NOT NULL,
  file_type    VARCHAR(20) DEFAULT 'pdf',
  icon         VARCHAR(50) DEFAULT 'bi-file-earmark-pdf',
  sort_order   INT DEFAULT 0,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_press_kit_sort ON press_kit_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_press_kit_active ON press_kit_items(active);
