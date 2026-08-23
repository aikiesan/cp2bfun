-- Migration 030: repair the drift left by two earlier bugs.
--
-- (1) image_position was never added to news / opportunities / events.
--     015_add_image_position.sql alters three tables in one file, but
--     `opportunities` is only created by 017 — so on a fresh database the
--     second statement failed with 42P01, Postgres rolled back the whole
--     file, and init.js tolerated the error. Every statement in 015 was
--     discarded, silently, including the one for `news`. The API has been
--     returning 500 on /api/news ever since.
--
-- (2) partners was seeded twice. 004_seed_partners_data.sql used plain
--     INSERT ... VALUES with no UNIQUE constraint to protect it, so every
--     re-run of db:init appended another full copy of the 15 rows.
--
-- Both source files are now fixed (004 is guarded, init.js records what it
-- applied and no longer discards a file quietly). This migration repairs
-- databases that already drifted. It is idempotent and safe to re-run.

BEGIN;

-- (1) Backfill image_position wherever the target table exists. The guards
--     matter because `events` is renamed to `microscopio` by 018, so which
--     of the two is present depends on how far a given database got.
DO $$
BEGIN
  IF to_regclass('public.news') IS NOT NULL THEN
    ALTER TABLE news ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
  END IF;

  IF to_regclass('public.opportunities') IS NOT NULL THEN
    ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
  END IF;

  IF to_regclass('public.microscopio') IS NOT NULL THEN
    ALTER TABLE microscopio ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
  END IF;

  IF to_regclass('public.events') IS NOT NULL THEN
    ALTER TABLE events ADD COLUMN IF NOT EXISTS image_position VARCHAR(50) DEFAULT 'center center';
  END IF;
END $$;

-- (2) Collapse duplicate partners down to one row per name_pt.
--     Keep the row a curator is most likely to have touched: one with a
--     logo first, then the lowest id. On a database that never duplicated,
--     this deletes nothing.
DELETE FROM partners p
USING (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY name_pt
           ORDER BY (logo IS NULL), id
         ) AS rn
  FROM partners
) ranked
WHERE p.id = ranked.id
  AND ranked.rn > 1;

COMMIT;
