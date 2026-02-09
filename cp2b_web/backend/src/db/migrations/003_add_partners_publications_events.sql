-- Migration: Add partners, publications, and events tables
-- Date: 2026-02-09
-- Description: Creates tables for managing partners, publications, and events with full bilingual support

BEGIN;

-- ============================================================
-- PARTNERS TABLE
-- ============================================================
-- Stores partner organizations (host institutions, public entities, research institutions, companies)
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name_pt VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  category VARCHAR(50) NOT NULL CHECK (category IN ('host', 'public', 'research', 'companies')),
  location VARCHAR(255),
  logo VARCHAR(500),              -- URL to logo image
  website VARCHAR(500),
  description_pt TEXT,
  description_en TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for partners
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(active);

-- ============================================================
-- PUBLICATIONS TABLE
-- ============================================================
-- Stores research publications, papers, and academic outputs
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  authors TEXT NOT NULL,           -- Comma-separated list of authors
  journal VARCHAR(255),            -- Journal or publisher name
  year INT NOT NULL,
  doi VARCHAR(255),                -- Digital Object Identifier
  url VARCHAR(500),                -- External URL
  pdf_url VARCHAR(500),            -- Direct link to PDF
  abstract_pt TEXT,
  abstract_en TEXT,
  keywords_pt TEXT[],              -- Array of keywords in Portuguese
  keywords_en TEXT[],              -- Array of keywords in English
  publication_type VARCHAR(50) DEFAULT 'article' CHECK (publication_type IN ('article', 'book', 'chapter', 'thesis', 'conference')),
  research_axis_id INT REFERENCES research_axes(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  published_at DATE,               -- Publication date
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for publications
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year DESC);
CREATE INDEX IF NOT EXISTS idx_publications_type ON publications(publication_type);
CREATE INDEX IF NOT EXISTS idx_publications_axis ON publications(research_axis_id);
CREATE INDEX IF NOT EXISTS idx_publications_featured ON publications(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_publications_doi ON publications(doi) WHERE doi IS NOT NULL;

-- ============================================================
-- EVENTS TABLE
-- ============================================================
-- Stores events, workshops, conferences, forums, webinars, courses
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title_pt VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_pt TEXT,
  description_en TEXT,
  event_type VARCHAR(50) DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'forum', 'conference', 'meeting', 'webinar', 'course')),
  location VARCHAR(255),           -- Physical location or online platform name
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

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_location_type ON events(location_type);

COMMIT;
