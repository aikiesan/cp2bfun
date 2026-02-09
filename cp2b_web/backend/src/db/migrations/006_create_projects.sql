-- Create projects table (identical to news structure)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description_pt TEXT,
  description_en TEXT,
  content_pt TEXT,
  content_en TEXT,
  image VARCHAR(500),
  badge VARCHAR(50),
  badge_color VARCHAR(20) DEFAULT 'primary',
  date_display VARCHAR(50),
  published_at TIMESTAMP,
  featured_position VARCHAR(1) CHECK (featured_position IN ('A', 'B', 'C')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured_position) WHERE featured_position IS NOT NULL;

-- Index for published date ordering
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published_at DESC NULLS LAST);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
