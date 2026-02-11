-- Migration 008: Create page_content table for dynamic page content
-- This table stores editable content for various pages (home, about, governance, transparency, etc.)

CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'home', 'about', 'governance', 'transparency'
  content_pt JSONB,                      -- Portuguese content (flexible JSON structure)
  content_en JSONB,                      -- English content (flexible JSON structure)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster page_key lookups
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(page_key);

-- Insert default empty content for common pages
-- Frontend will fall back to static content if these are empty
INSERT INTO page_content (page_key, content_pt, content_en) VALUES
  ('home', '{}'::jsonb, '{}'::jsonb),
  ('about', '{}'::jsonb, '{}'::jsonb),
  ('governance', '{}'::jsonb, '{}'::jsonb),
  ('transparency', '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (page_key) DO NOTHING;

-- Add comment
COMMENT ON TABLE page_content IS 'Stores editable content for various pages in the application';
