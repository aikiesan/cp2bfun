-- Migration 010: Add editorial metadata fields to news and projects
-- Adds: author, image_caption_pt, image_caption_en, tags
-- Date: 2026-02-27

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS author VARCHAR(255),
  ADD COLUMN IF NOT EXISTS image_caption_pt TEXT,
  ADD COLUMN IF NOT EXISTS image_caption_en TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS author VARCHAR(255),
  ADD COLUMN IF NOT EXISTS image_caption_pt TEXT,
  ADD COLUMN IF NOT EXISTS image_caption_en TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT;
