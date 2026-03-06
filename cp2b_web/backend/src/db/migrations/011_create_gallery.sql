-- Migration 011: Gallery photo storage
-- Run this against the database before starting the backend

CREATE TABLE IF NOT EXISTS gallery (
  id         SERIAL PRIMARY KEY,
  url        VARCHAR(500) NOT NULL,   -- caminho relativo do arquivo (ex: /uploads/gallery/...)
  title      TEXT        NOT NULL,
  date       VARCHAR(50),             -- data formatada para exibição (ex: "28/05/2026")
  filename   VARCHAR(255) NOT NULL,   -- nome do arquivo no disco (para deleção física)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
