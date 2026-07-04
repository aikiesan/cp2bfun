-- Key-value store for site-wide settings editable from the admin dashboard
-- (contact info, social links, footer credits). Values are JSONB documents.

CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
