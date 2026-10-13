-- Migration 055: registra /metaninho (HQ do Metaninho, em Comunicação) no
-- controle de manutenção de páginas do painel.
--
-- Sem a linha, a rota já funciona — o GuardedRoute libera chaves que não
-- conhece —, mas o painel não teria como tirá-la do ar.
--
-- Num banco novo o runner adia este arquivo (42P01) até add_page_settings.sql
-- criar a tabela. Idempotente.

INSERT INTO page_settings (page_key, label, route_path) VALUES
  ('metaninho', 'HQ do Metaninho', '/metaninho')
ON CONFLICT (page_key) DO NOTHING;
