-- Migration 045: publica a Edição 1 do Boletim Informativo do CP2b.
--
-- A edição de estreia (setembro/2026) é semeada aqui, e não enviada pelo
-- /admin/boletins, para que ela suba junto com o deploy: o PDF e a capa vivem
-- em public/assets/boletins/, então chegam pelo mesmo `git pull` que traz esta
-- migração. As edições seguintes seguem pelo admin, como previsto — este é o
-- conteúdo inicial, não um segundo caminho de publicação.
--
-- A capa foi rasterizada da primeira página do próprio PDF, para que seja
-- exatamente a capa impressa e não uma arte recriada.
--
-- ON CONFLICT no número da edição torna a migração idempotente: rodar de novo
-- (ou rodar depois de alguém já ter cadastrado a Edição 1 pelo admin) atualiza
-- em vez de estourar no índice único parcial de edition_number.

INSERT INTO boletins (
    title_pt, title_en,
    description_pt, description_en,
    edition_number, published_at,
    cover_image, pdf_url, active
) VALUES (
    'Boletim Informativo CP2b — Edição 1',
    'CP2b Newsletter — Issue 1',
    'Edição de estreia: um balanço dos 18 primeiros meses do Centro, por Bruna Moraes e Renata Rodriguez, além das seções Quem Somos, Aconteceu no CP2b, Ciência em Circulação e CP2b Indica.',
    'Inaugural issue: a review of the Centre''s first 18 months by Bruna Moraes and Renata Rodriguez, plus the sections Who We Are, What Happened at CP2b, Science in Circulation and CP2b Recommends.',
    1,
    DATE '2026-09-01',
    '/assets/boletins/boletim-cp2b-edicao-1-capa.jpg',
    '/assets/boletins/boletim-cp2b-edicao-1-setembro-2026.pdf',
    true
)
ON CONFLICT (edition_number) WHERE edition_number IS NOT NULL
DO UPDATE SET
    title_pt       = EXCLUDED.title_pt,
    title_en       = EXCLUDED.title_en,
    description_pt = EXCLUDED.description_pt,
    description_en = EXCLUDED.description_en,
    published_at   = EXCLUDED.published_at,
    cover_image    = EXCLUDED.cover_image,
    pdf_url        = EXCLUDED.pdf_url,
    active         = EXCLUDED.active,
    updated_at     = now();
