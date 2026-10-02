-- Migration 031: repair the axis descriptions shown on /eixos.
--
-- Two separate problems, both visible to visitors:
--
-- (1) Literal "\n". All 8 rows of research_axes carry the two characters
--     backslash-n where a line break was meant. They were written as an
--     escaped string and inserted without the escape ever being resolved, so
--     the mind map — which renders the text with `white-space: pre-line` —
--     printed "\n" on screen instead of breaking the line. Confirmed before
--     writing this: 8 of 8 rows contain backslash-n, 0 contain a real newline.
--
-- (2) Eixo 1 was never shortened in the database. The concise description
--     landed in src/data/content.js during the Rodada 2 work, but the DB kept
--     the original 728-character version, and the DB is what the page
--     actually renders. This brings the two back into agreement.
--
-- Idempotent: the replace is a no-op once there is no backslash-n left, and
-- the Eixo 1 update is guarded on the old text still being there.

BEGIN;

-- (1) Turn the literal two-character sequence into a real newline.
UPDATE research_axes
SET content_pt = replace(content_pt, chr(92) || 'n', chr(10))
WHERE content_pt IS NOT NULL
  AND strpos(content_pt, chr(92) || 'n') > 0;

UPDATE research_axes
SET content_en = replace(content_en, chr(92) || 'n', chr(10))
WHERE content_en IS NOT NULL
  AND strpos(content_en, chr(92) || 'n') > 0;

-- (2) Bring Eixo 1 down to the short description, matching content.js.
UPDATE research_axes
SET content_pt = 'O Eixo 1 mapeia cadeias agroindustriais e resíduos com georreferenciamento de alta precisão para identificar oportunidades de aproveitamento e integrar geradores em uma plataforma digital acessível.'
  || chr(10) || 'ODS: 7, 11, 13 e 15.'
WHERE axis_number = 1
  AND length(content_pt) > 400;

UPDATE research_axes
SET content_en = 'Axis 1 maps agro-industrial chains and waste streams using high-precision georeferencing to identify recovery opportunities and connect generators through an accessible digital platform.'
  || chr(10) || 'SDGs: 7, 11, 13, and 15.'
WHERE axis_number = 1
  AND length(content_en) > 400;

COMMIT;
