-- Migration 057: quatro pós-doutorandos do CP2b registrados como tal.
--
-- Lucas Nakamura Cerejo, Ana Beatriz Soares Aguiar e Fabiane Moreira Vieira
-- estavam com a coordenação no lugar do cargo ("Coordenador(a) do Eixo N"),
-- e Luciana Cristina Lenhari da Silva como "Pesquisador Associado". Os quatro
-- são pós-doutorandos do CP2b (informado em 27/11/2026).
--
-- A coordenação não se perde: /equipe a lê da composição oficial dos eixos
-- (ANEXO 11, researchAxes) e mostra a pílula "Coordenação do Eixo N" acima do
-- cargo quando o cargo não diz coordenação. No perfil da equipe, os três
-- passam de "coordenação" a "pós-doutorado" no gráfico por cargo declarado;
-- a composição da coordenação continua vindo do ANEXO 11.
--
-- Par estático: src/data/generated/teamByAxis.js e src/data/content.js.
--
-- Idempotente: os UPDATEs são naturalmente reexecutáveis.

BEGIN;

UPDATE team_members
SET role_pt = 'Pós-Doutorando', role_en = 'Postdoctoral Researcher'
WHERE name = 'Lucas Nakamura Cerejo';

UPDATE team_members
SET role_pt = 'Pós-Doutoranda', role_en = 'Postdoctoral Researcher'
WHERE name IN ('Ana Beatriz Soares Aguiar', 'Fabiane Moreira Vieira', 'Luciana Cristina Lenhari da Silva');

COMMIT;
