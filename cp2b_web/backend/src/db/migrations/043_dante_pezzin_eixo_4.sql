-- Migration 043: Dante Chiavareto Pezzin atua no Eixo 4, não no Eixo 6.
--
-- A migration 032 o gravou no Eixo 6, a partir da planilha estratégica.
-- Correção informada pela direção do centro em 08/09/2026.
--
-- Efeito colateral no perfil da equipe: o Eixo 6 fica com 4 pessoas e nenhum
-- homem, e o Eixo 4 passa a 10 pessoas com 1 mulher em 10 — o desequilíbrio
-- do Eixo 4, que já era o mais acentuado, fica um ponto mais acentuado ainda.
--
-- O nome aparece nas duas grafias que as fontes usam ("Dante Pezzin" na
-- planilha, "Dante Chiavareto Pezzin" no site), por isso o ILIKE frouxo no
-- meio do nome.
--
-- Par estático: src/data/generated/teamByAxis.js, corrigido no mesmo commit.
--
-- `research_axes.details` também lista o Dante no bloco "equipe" do Eixo 6,
-- mas esse bloco está em HIDDEN_BRANCHES desde a despersonalização de /eixos
-- e não é exibido. Movê-lo ali seria remexer um array JSONB sem efeito visível,
-- então fica como está — registrado aqui para quem for gerar de novo.
--
-- Idempotente: o UPDATE é naturalmente reexecutável.

BEGIN;

UPDATE team_members
SET axes = '4'
WHERE name ILIKE '%Dante%Pezzin%';

COMMIT;
