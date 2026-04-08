-- Add image_position column to news, opportunities, and events tables
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
