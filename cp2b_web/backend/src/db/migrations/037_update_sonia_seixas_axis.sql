-- Migration 037: Update Sonia Regina da Cal Seixas to Eixo 6 (Educação e Capacitação)
-- Safe to re-run

UPDATE team_members
SET axes = '6'
WHERE name ILIKE '%Sonia Regina da Cal Seixas%';
