-- Migration 044: boletins do CP2b.
--
-- Os boletins são uma série periódica publicada para download: uma capa, um
-- título e o PDF. Não têm corpo de artigo no site — o conteúdo vive dentro do
-- arquivo — então não seguem o modelo de `news`/`microscopio` (slug + HTML) e
-- sim o de `podcast_episodes`: uma lista ordenada de edições com um link.
--
-- `edition_number` e `published_at` existem para que a série se ordene sozinha
-- e possa se apresentar como "Edição 12 — março de 2026". Ambos são opcionais:
-- um boletim avulso, sem numeração, ainda aparece (cai para created_at na
-- ordenação).
--
-- `cover_image` e `pdf_url` guardam caminhos servidos por /uploads, iguais aos
-- das demais mídias do site — o admin envia os arquivos por /api/upload.

CREATE TABLE IF NOT EXISTS boletins (
    id             SERIAL PRIMARY KEY,
    title_pt       TEXT NOT NULL,
    title_en       TEXT,
    -- Resumo de uma ou duas linhas, exibido no card sob o título: diz ao leitor
    -- o que tem na edição antes de ele baixar o PDF.
    description_pt TEXT,
    description_en TEXT,
    edition_number INTEGER,
    published_at   DATE,
    cover_image    TEXT,
    pdf_url        TEXT NOT NULL,
    active         BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A página pública lista só os ativos, na mesma ordem em que são exibidos.
CREATE INDEX IF NOT EXISTS idx_boletins_listing
    ON boletins (active, published_at DESC NULLS LAST, created_at DESC);

-- Duas edições não podem carregar o mesmo número. O índice é parcial porque
-- edition_number é opcional: vários boletins sem numeração convivem sem
-- colidir (NULL não conflita com NULL em UNIQUE, mas o WHERE deixa a intenção
-- explícita e mantém o índice pequeno).
CREATE UNIQUE INDEX IF NOT EXISTS idx_boletins_edition_unique
    ON boletins (edition_number)
    WHERE edition_number IS NOT NULL;
