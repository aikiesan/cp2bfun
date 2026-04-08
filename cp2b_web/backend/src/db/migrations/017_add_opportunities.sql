-- Migration: add_opportunities
-- Creates the opportunities table mirroring the news table structure

CREATE TABLE IF NOT EXISTS opportunities (
  id           SERIAL PRIMARY KEY,
  slug         VARCHAR(255) UNIQUE NOT NULL,
  title_pt     TEXT NOT NULL,
  title_en     TEXT,
  description_pt TEXT,
  description_en TEXT,
  content_pt   TEXT,
  content_en   TEXT,
  image        TEXT,
  badge        VARCHAR(100),
  badge_color  VARCHAR(50) DEFAULT 'primary',
  date_display VARCHAR(50),
  featured     BOOLEAN DEFAULT FALSE,
  active       BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_slug ON opportunities(slug);
CREATE INDEX IF NOT EXISTS idx_opportunities_published_at ON opportunities(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(active);
