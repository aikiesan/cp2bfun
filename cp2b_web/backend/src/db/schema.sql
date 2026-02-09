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
  featured_position VARCHAR(1) CHECK (featured_position IN ('A', 'B', 'C')),
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

-- Partners (institutions, companies, public entities)
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name_pt VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  category VARCHAR(50) NOT NULL CHECK (category IN ('host', 'public', 'research', 'companies')),
  location VARCHAR(255),
  logo VARCHAR(500),
  website VARCHAR(500),
  description_pt TEXT,
  description_en TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Publications (research papers, articles, books)
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  authors TEXT NOT NULL,
  journal VARCHAR(255),
  year INT NOT NULL,
  doi VARCHAR(255),
  url VARCHAR(500),
  pdf_url VARCHAR(500),
  abstract_pt TEXT,
  abstract_en TEXT,
  keywords_pt TEXT[],
  keywords_en TEXT[],
  publication_type VARCHAR(50) DEFAULT 'article' CHECK (publication_type IN ('article', 'book', 'chapter', 'thesis', 'conference')),
  research_axis_id INT REFERENCES research_axes(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  published_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events (workshops, forums, conferences, webinars)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title_pt VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_pt TEXT,
  description_en TEXT,
  event_type VARCHAR(50) DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'forum', 'conference', 'meeting', 'webinar', 'course')),
  location VARCHAR(255),
  location_type VARCHAR(20) DEFAULT 'in-person' CHECK (location_type IN ('in-person', 'online', 'hybrid')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  registration_url VARCHAR(500),
  image VARCHAR(500),
  organizer VARCHAR(255),
  max_participants INT,
  current_participants INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured_position) WHERE featured_position IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_team_category ON team_members(category);
CREATE INDEX IF NOT EXISTS idx_team_sort ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_axes_number ON research_axes(axis_number);
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(active);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year DESC);
CREATE INDEX IF NOT EXISTS idx_publications_type ON publications(publication_type);
CREATE INDEX IF NOT EXISTS idx_publications_axis ON publications(research_axis_id);
CREATE INDEX IF NOT EXISTS idx_publications_featured ON publications(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_publications_doi ON publications(doi) WHERE doi IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_location_type ON events(location_type);
