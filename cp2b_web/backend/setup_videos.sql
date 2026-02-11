-- Run the migration to create the table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_featured_videos_position ON featured_videos(position) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_featured_videos_active ON featured_videos(active);

-- Insert test videos
INSERT INTO featured_videos (youtube_url, youtube_id, title_pt, title_en, description_pt, description_en, thumbnail_url, date_display, position, active)
VALUES
  (
    'https://www.youtube.com/watch?v=ga1g2xZ_FEY',
    'ga1g2xZ_FEY',
    'Música Instrumental Relaxante 1',
    'Relaxing Instrumental Music 1',
    'Uma bela melodia instrumental para relaxar',
    'A beautiful instrumental melody to relax',
    'https://img.youtube.com/vi/ga1g2xZ_FEY/maxresdefault.jpg',
    'Fevereiro 2025',
    'A',
    true
  ),
  (
    'https://www.youtube.com/watch?v=cKxRFlXYquo',
    'cKxRFlXYquo',
    'Música Instrumental Relaxante 2',
    'Relaxing Instrumental Music 2',
    'Segunda melodia instrumental relaxante',
    'Second relaxing instrumental melody',
    'https://img.youtube.com/vi/cKxRFlXYquo/maxresdefault.jpg',
    'Fevereiro 2025',
    'B',
    true
  ),
  (
    'https://www.youtube.com/watch?v=HSOtku1j600',
    'HSOtku1j600',
    'Música Instrumental Relaxante 3',
    'Relaxing Instrumental Music 3',
    'Terceira melodia instrumental para relaxar',
    'Third instrumental melody to relax',
    'https://img.youtube.com/vi/HSOtku1j600/maxresdefault.jpg',
    'Fevereiro 2025',
    'C',
    true
  );

-- Verify
SELECT id, title_pt, position, active FROM featured_videos;
