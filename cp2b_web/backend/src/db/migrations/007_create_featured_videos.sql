-- Migration: Create featured_videos table for YouTube video management
-- Description: Stores YouTube videos with bilingual content and position management (A/B/C layout)
-- Author: Claude
-- Date: 2026-02-11

CREATE TABLE IF NOT EXISTS featured_videos (
  id SERIAL PRIMARY KEY,
  youtube_url VARCHAR(500) NOT NULL,
  youtube_id VARCHAR(50) NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description_pt TEXT,
  description_en TEXT,
  thumbnail_url VARCHAR(500),
  date_display VARCHAR(50),
  position VARCHAR(1) CHECK (position IN ('A', 'B', 'C')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient position queries
CREATE INDEX idx_featured_videos_position ON featured_videos(position) WHERE active = TRUE;

-- Index for active videos
CREATE INDEX idx_featured_videos_active ON featured_videos(active);

-- Comments for documentation
COMMENT ON TABLE featured_videos IS 'Stores YouTube videos for featured display on homepage';
COMMENT ON COLUMN featured_videos.youtube_url IS 'Full YouTube URL (youtube.com/watch, youtu.be, shorts)';
COMMENT ON COLUMN featured_videos.youtube_id IS 'Extracted YouTube video ID for embedding';
COMMENT ON COLUMN featured_videos.position IS 'Display position: A (large left), B (top right), C (bottom right)';
COMMENT ON COLUMN featured_videos.date_display IS 'Human-readable date for display (e.g., "Janeiro 2025")';
COMMENT ON COLUMN featured_videos.active IS 'Whether the video is active and should be displayed';
