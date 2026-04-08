CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id               SERIAL PRIMARY KEY,
  email            VARCHAR(255) UNIQUE NOT NULL,
  name             VARCHAR(255),
  subscribed_at    TIMESTAMPTZ DEFAULT NOW(),
  unsubscribe_token UUID DEFAULT gen_random_uuid(),
  active           BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(active);
