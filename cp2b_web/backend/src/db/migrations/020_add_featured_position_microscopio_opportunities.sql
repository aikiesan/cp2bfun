-- Migration: Add featured_position to microscopio and opportunities tables

ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);
ALTER TABLE microscopio DROP CONSTRAINT IF EXISTS check_microscopio_featured_position;
ALTER TABLE microscopio ADD CONSTRAINT check_microscopio_featured_position
  CHECK (featured_position IN ('A', 'B', 'C'));
CREATE INDEX IF NOT EXISTS idx_microscopio_featured ON microscopio(featured_position)
  WHERE featured_position IS NOT NULL;

ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS check_opportunities_featured_position;
ALTER TABLE opportunities ADD CONSTRAINT check_opportunities_featured_position
  CHECK (featured_position IN ('A', 'B', 'C'));
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured_position)
  WHERE featured_position IS NOT NULL;
