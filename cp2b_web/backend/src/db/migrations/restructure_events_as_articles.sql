-- Restructure events table from calendar system to article/editorial system
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id             SERIAL PRIMARY KEY,
  slug           VARCHAR(255) UNIQUE NOT NULL,
  title_pt       TEXT NOT NULL,
  title_en       TEXT,
  description_pt TEXT,
  description_en TEXT,
  content_pt     TEXT,
  content_en     TEXT,
  image          TEXT,
  image_position VARCHAR(50) DEFAULT 'center center',
  badge          VARCHAR(100),
  badge_color    VARCHAR(50) DEFAULT 'primary',
  date_display   VARCHAR(50),
  author         VARCHAR(255),
  image_caption_pt TEXT,
  image_caption_en TEXT,
  tags           TEXT[],
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_published_at ON events(published_at DESC NULLS LAST);
