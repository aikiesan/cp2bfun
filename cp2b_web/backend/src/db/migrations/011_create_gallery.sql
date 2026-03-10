-- Extensão para UUID (opcional, mas boa prática conhecer)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 
-- Cria a tabela somente se ela ainda não existir
CREATE TABLE IF NOT EXISTS gallery (
  id          SERIAL         PRIMARY KEY,
  url         VARCHAR(500)  NOT NULL,
  filename    VARCHAR(255)  NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  date        DATE           NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
 
-- Índice para acelerar buscas por data
CREATE INDEX IF NOT EXISTS idx_gallery_date ON gallery (date DESC);
 
-- Índice para buscas por título (LIKE)
CREATE INDEX IF NOT EXISTS idx_gallery_title ON gallery (title);