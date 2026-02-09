-- Add image fields for research axes coordinators
ALTER TABLE research_axes
ADD COLUMN coordinator_image VARCHAR(500),
ADD COLUMN sub_coordinator VARCHAR(255),
ADD COLUMN sub_coordinator_image VARCHAR(500);

-- Add comment for documentation
COMMENT ON COLUMN research_axes.coordinator_image IS 'URL to coordinator profile photo';
COMMENT ON COLUMN research_axes.sub_coordinator IS 'Name of sub-coordinator (optional)';
COMMENT ON COLUMN research_axes.sub_coordinator_image IS 'URL to sub-coordinator profile photo';
