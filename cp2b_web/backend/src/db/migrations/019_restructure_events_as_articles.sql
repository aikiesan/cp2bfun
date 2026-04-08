-- Migration: Restructure events table as article/editorial system (microscopio)
-- NOTE: The original version of this file incorrectly targeted the 'events' table,
-- creating a duplicate article-schema table while leaving 'microscopio' with the old
-- calendar schema. The actual restructuring is now handled idempotently by
-- 013_fix_microscopio_schema.sql. This file is retained for history but is a no-op.
SELECT 1;
