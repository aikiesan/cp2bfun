-- Migration 042: instituição da Drª Fabiane Moreira Vieira.
--
-- A migration 034 a cadastrou como FEAGRI/UNICAMP. Ela é do NIPE/UNICAMP —
-- correção informada pela direção do centro em 08/09/2026.
--
-- Par estático: src/data/generated/teamByAxis.js, que alimenta /equipe quando
-- a API não responde, corrigido no mesmo commit. As duas fontes mudam juntas.
--
-- `axisDetails` / `research_axes.details` também guardam a instituição dela,
-- mas o bloco "equipe" está em HIDDEN_BRANCHES desde a despersonalização de
-- /eixos e não é exibido em lugar nenhum. Por isso não há UPDATE no JSONB
-- aqui — só o arquivo estático foi acertado, por consistência.
--
-- Idempotente: o UPDATE é naturalmente reexecutável.

BEGIN;

UPDATE team_members
SET institution = 'NIPE/UNICAMP'
WHERE name ILIKE '%Fabiane Moreira Vieira%';

COMMIT;
