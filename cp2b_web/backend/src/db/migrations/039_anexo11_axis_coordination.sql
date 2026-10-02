-- Migration 039: aplicar o ANEXO 11 — Composição da Coordenação dos Eixos do
-- CP2b (2026–2027), vigente a partir de 08/09/2026.
--
-- O ANEXO 11 substitui a composição original do Regimento Interno e extingue
-- o cargo de Coordenador Adjunto: cada eixo passa a ter coordenadores em pé
-- de igualdade. Idempotente — pode ser reexecutada.

BEGIN;

-- 1. Coordenação dos eixos. `sub_coordinator` deixa de significar "adjunto":
--    guarda o segundo coordenador, já que a tabela só tem dois campos.
UPDATE research_axes SET
  coordinator     = 'Profº Drº Rubens Augusto Camargo Lamparelli',
  sub_coordinator = 'Drº Lucas Nakamura Cerejo'
WHERE axis_number = 1;

UPDATE research_axes SET
  coordinator     = 'Profº Drº Lucas Tadeu Fuess',
  sub_coordinator = 'Drª Fabiane Moreira Vieira'
WHERE axis_number = 2;

UPDATE research_axes SET
  coordinator     = 'Profª Drª Priscila Rosseto Camiloti',
  sub_coordinator = 'Drª Ana Beatriz Soares Aguiar'
WHERE axis_number = 3;

UPDATE research_axes SET
  coordinator     = 'Profº Drº Marcelo Pereira Cunha',
  sub_coordinator = 'Drº Carlos Eduardo Driemeier'
WHERE axis_number = 4;

UPDATE research_axes SET
  coordinator     = 'Profª Drª Rachel Biancalana Costa',
  sub_coordinator = 'Vaga temporariamente em aberto'
WHERE axis_number = 5;

UPDATE research_axes SET
  coordinator     = 'Profª Drª Renata Piacentini Rodriguez',
  sub_coordinator = 'Profª Drª Bruna de Souza Moraes'
WHERE axis_number = 6;

UPDATE research_axes SET
  coordinator     = 'Profª Drª Maria Paula Cardeal Volpi',
  sub_coordinator = 'Profª Drª Renata Piacentini Rodriguez'
WHERE axis_number = 7;

UPDATE research_axes SET
  coordinator     = 'Profª Drª Natalia Molina Cetrulo',
  sub_coordinator = 'Drª Thais Aparecida Dibbern'
WHERE axis_number = 8;

-- 2. Trocas de eixo em /equipe determinadas pelo ANEXO 11.
UPDATE team_members SET axes = '3' WHERE name ILIKE '%Priscila Rosseto Camiloti%';
UPDATE team_members SET axes = '3' WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET axes = '2' WHERE name ILIKE '%Fabiane Moreira Vieira%';

-- 3. Novo integrante: coordenador do Eixo 4.
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Carlos Eduardo Driemeier', 'Coordenador do Eixo 4', 'Axis 4 Coordinator',
       'NIPE/UNICAMP', 'associates', '4', FALSE, 252
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Carlos Eduardo Driemeier');

-- 4. Rótulo de coordenação. A direção mantém o próprio cargo (Bruna e Renata),
--    que já expressa a posição institucional.
UPDATE team_members SET role_pt = 'Coordenador do Eixo 1',   role_en = 'Axis 1 Coordinator' WHERE name ILIKE '%Rubens Augusto Camargo Lamparelli%';
UPDATE team_members SET role_pt = 'Coordenador do Eixo 1',   role_en = 'Axis 1 Coordinator' WHERE name ILIKE '%Lucas Nakamura Cerejo%';
UPDATE team_members SET role_pt = 'Coordenador do Eixo 2',   role_en = 'Axis 2 Coordinator' WHERE name ILIKE '%Lucas Tadeu Fuess%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 2',  role_en = 'Axis 2 Coordinator' WHERE name ILIKE '%Fabiane Moreira Vieira%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 3',  role_en = 'Axis 3 Coordinator' WHERE name ILIKE '%Priscila Rosseto Camiloti%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 3',  role_en = 'Axis 3 Coordinator' WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET role_pt = 'Coordenador do Eixo 4',   role_en = 'Axis 4 Coordinator' WHERE name ILIKE '%Marcelo Pereira%Cunha%';
UPDATE team_members SET role_pt = 'Coordenador do Eixo 4',   role_en = 'Axis 4 Coordinator' WHERE name ILIKE '%Carlos Eduardo Driemeier%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 5',  role_en = 'Axis 5 Coordinator' WHERE name ILIKE '%Rachel Biancalana Costa%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 7',  role_en = 'Axis 7 Coordinator' WHERE name ILIKE '%Maria Paula Cardeal Volpi%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 8',  role_en = 'Axis 8 Coordinator' WHERE name ILIKE '%Natalia Molina Cetrulo%';
UPDATE team_members SET role_pt = 'Coordenadora do Eixo 8',  role_en = 'Axis 8 Coordinator' WHERE name ILIKE '%Thais Aparecida Dibbern%';

-- 5. Quem deixou a coordenação permanece como pesquisador(a) do mesmo eixo.
--    Só o rótulo de coordenação sai; ninguém é removido do site.
UPDATE team_members SET role_pt = 'Pesquisadora Associada', role_en = 'Associate Researcher'
WHERE name ILIKE '%Luana Mattos de Oliveira Cruz%' AND role_pt ILIKE '%Coordenad%';
UPDATE team_members SET role_pt = 'Pesquisador Associado', role_en = 'Associate Researcher'
WHERE name IN ('Enelton Fagnani', 'Luis Alberto Follegatti Romero', 'Rafael de Brito Dias')
  AND role_pt ILIKE '%Coordenad%';
UPDATE team_members SET role_pt = 'Pesquisador Associado', role_en = 'Associate Researcher'
WHERE name ILIKE '%Luiz Gustavo Ant%nio de Souza%' AND role_pt ILIKE '%Coordenad%';

-- 6. Correção da migration 033: Ana Beatriz e Luciana não integram a Diretoria.
--    Marcá-las como diretoras jogava as duas para a seção "Direção do CP2b"
--    em /equipe, ao lado da Diretora e da Vice-diretora.
UPDATE team_members SET is_director = FALSE
WHERE name IN ('Ana Beatriz Soares Aguiar', 'Luciana Cristina Lenhari da Silva');

COMMIT;
