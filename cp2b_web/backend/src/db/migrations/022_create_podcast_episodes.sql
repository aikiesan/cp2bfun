-- Migration: Create podcast_episodes table for Spotify-embedded podcast management
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id               SERIAL PRIMARY KEY,
  title_pt         TEXT NOT NULL,
  title_en         TEXT,
  description_pt   TEXT,
  description_en   TEXT,
  spotify_url      TEXT NOT NULL,
  episode_number   INT,
  duration         VARCHAR(20),
  published_at     TIMESTAMPTZ,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_podcast_published ON podcast_episodes(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_podcast_active ON podcast_episodes(active);
