-- Migration 054: legenda opcional por foto da galeria.
--
-- Até aqui cada foto só tinha o título do álbum. A legenda é editada em
-- Admin → Galeria e aparece sob a foto no álbum e na visualização ampliada.
-- Idempotente.

ALTER TABLE gallery ADD COLUMN IF NOT EXISTS caption VARCHAR(300);
