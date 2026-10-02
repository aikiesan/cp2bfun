-- Migration: 029_team_missing_members.sql
-- Description: Inserir Rachel Biancalana Costa e Ana Beatriz Soares Aguiar em team_members.
--
-- Rachel Biancalana Costa: POLI/USP, Coordenadora Adjunta do Eixo 5
-- Ana Beatriz Soares Aguiar: UNICAMP, Pós-doutoranda atuante com Lucas Fuess e Bruna Moraes

BEGIN;

INSERT INTO team_members (name, role_pt, role_en, institution, category, sort_order)
SELECT 'Rachel Biancalana Costa', 'Pesquisador Associado', 'Associate Researcher', 'POLI/USP', 'associates', 100
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Rachel Biancalana Costa');

INSERT INTO team_members (name, role_pt, role_en, institution, category, sort_order)
SELECT 'Ana Beatriz Soares Aguiar', 'Pesquisador Associado', 'Associate Researcher', 'UNICAMP', 'associates', 101
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Ana Beatriz Soares Aguiar');

COMMIT;
