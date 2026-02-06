-- CP2B CMS Database Schema

-- News articles
CREATE TABLE IF NOT EXISTS news (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page content (about, research, etc.)
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(100) UNIQUE NOT NULL,
  content_pt JSONB,
  content_en JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role_pt VARCHAR(255),
  role_en VARCHAR(255),
  institution VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  category VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research axes
CREATE TABLE IF NOT EXISTS research_axes (
  id SERIAL PRIMARY KEY,
  axis_number INT UNIQUE NOT NULL,
  title_pt TEXT,
  title_en TEXT,
  coordinator VARCHAR(255),
  content_pt TEXT,
  content_en TEXT,
  sdgs INTEGER[],
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_category ON team_members(category);
CREATE INDEX IF NOT EXISTS idx_team_sort ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_axes_number ON research_axes(axis_number);
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);
