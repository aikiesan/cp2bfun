-- Migration 048: boletins, podcast e eventos podem ir para os destaques da home.
--
-- O painel /admin/featured cobria quatro tipos (notícia, entrevista,
-- microscópio, oportunidade). A comunicação precisa destacar também boletim,
-- podcast e evento.
--
-- Só `featured_position` vira coluna de verdade, porque é estado: é ela que
-- diz qual conteúdo ocupa A, B ou C. Os campos de apresentação que o destaque
-- usa (badge, badge_color, date_display) NÃO são replicados nestas tabelas —
-- a rota os sintetiza por tipo. Copiar seis colunas para cada tabela nova
-- espalharia a mesma decisão por todo o schema e faria a próxima seção
-- destacável repetir tudo de novo.
--
-- `podcast_episodes` ganha `image` porque o card de destaque é visual e o
-- episódio não tinha imagem alguma — só o embed do Spotify, que não serve de
-- capa na home.
--
-- Boletins e podcast não têm página de detalhe: o conteúdo vive no PDF e no
-- Spotify. O destaque deles aponta para /boletins e /podcast, e é por isso
-- que nenhuma das duas tabelas precisa de `slug`.

ALTER TABLE boletins          ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);
ALTER TABLE podcast_episodes  ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);
ALTER TABLE events            ADD COLUMN IF NOT EXISTS featured_position VARCHAR(1);

ALTER TABLE podcast_episodes  ADD COLUMN IF NOT EXISTS image VARCHAR(500);

-- Uma posição (A, B, C) é ocupada por um único conteúdo em cada tabela. O
-- índice é parcial porque a esmagadora maioria das linhas tem NULL aqui, e
-- NULL não conflita com NULL — vários não-destacados convivem sem colidir.
CREATE UNIQUE INDEX IF NOT EXISTS idx_boletins_featured_position
    ON boletins (featured_position) WHERE featured_position IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_podcast_featured_position
    ON podcast_episodes (featured_position) WHERE featured_position IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_featured_position
    ON events (featured_position) WHERE featured_position IS NOT NULL;
