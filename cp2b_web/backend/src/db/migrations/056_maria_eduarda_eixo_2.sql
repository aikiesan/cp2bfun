-- Migration 056: Maria Eduarda Simões Dias, pós-doutoranda no Eixo 2.
--
-- Pós-doc com o Prof. Lucas Tadeu Fuess (coordenação do Eixo 2), incluída a
-- pedido da direção em 27/11/2026. Na lista de contatos do CP2b ela aparecia
-- só pela agenda ("Mariê", USP), fora da Equipe 2026.
--
-- membership 'nucleo': atua num eixo, então entra na contagem "na equipe do
-- CP2b" de /equipe e no número da home.
--
-- Par estático: src/data/generated/teamByAxis.js, no mesmo commit.
--
-- Idempotente: o INSERT só roda se o nome ainda não existir.

BEGIN;

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, membership, sort_order)
SELECT 'Maria Eduarda Simões Dias', 'Pós-Doutoranda', 'Postdoctoral Researcher', 'USP', 'associates', '2', FALSE, 'nucleo', 260
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE 'Maria Eduarda Sim%es Dias');

COMMIT;
