-- Migration: add_page_settings
-- Creates the page_settings table for admin page maintenance toggle

CREATE TABLE IF NOT EXISTS page_settings (
  page_key    VARCHAR(60) PRIMARY KEY,
  label       VARCHAR(100) NOT NULL,
  route_path  VARCHAR(120) NOT NULL,
  is_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed: all public pages
INSERT INTO page_settings (page_key, label, route_path) VALUES
  ('home',           'Home',            '/'),
  ('sobre',          'Sobre',           '/sobre'),
  ('governanca',     'Governança',      '/sobre/governanca'),
  ('transparencia',  'Transparência',   '/sobre/transparencia'),
  ('parceiros',      'Parceiros',       '/sobre/parceiros'),
  ('eixos',          'Eixos',           '/eixos'),
  ('equipe',         'Equipe',          '/equipe'),
  ('noticias',       'Notícias',        '/noticias'),
  ('publicacoes',    'Publicações',     '/publicacoes'),
  ('microscopio',    'Microscópio',     '/microscopio'),
  ('entrevistas',    'Entrevistas',     '/entrevistas'),
  ('oportunidades',  'Oportunidades',   '/oportunidades'),
  ('galeria',        'Galeria',         '/galeria'),
  ('eventos',        'Eventos',         '/eventos'),
  ('na-midia',       'Na Mídia',        '/na-midia'),
  ('press-kit',      'Press Kit',       '/press-kit'),
  ('podcast',        'Podcast',         '/podcast'),
  ('forum-paulista', 'Fórum Paulista',  '/forum-paulista')
ON CONFLICT (page_key) DO NOTHING;
