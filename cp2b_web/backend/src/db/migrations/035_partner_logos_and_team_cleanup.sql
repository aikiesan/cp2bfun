-- Migration 035: parceiros logos e correcoes na equipe (remover Stephani/Amasa, tirar Luciana/Ana da direcao, mover Leonardo para Eixo 3)
BEGIN;

-- 1. Remover pesquisadores que nao fazem mais parte do CP2b
DELETE FROM team_members WHERE name ILIKE '%Stephani Cetimia%' OR name ILIKE '%Amasa Ferreira%';

-- 2. Corrigir eixos e retirar da direcao
UPDATE team_members SET axes = '3', is_director = FALSE WHERE name ILIKE '%Leonardo Ariel%';
UPDATE team_members SET axes = '8', is_director = FALSE WHERE name ILIKE '%Luciana Cristina Lenhari%';
UPDATE team_members SET axes = '2', is_director = FALSE WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET photo = '/assets/team/lucas-boaro.webp', photo_url = '/assets/team/lucas-boaro.webp' WHERE name = 'Lucas Boaro';

-- Garantir que APENAS Bruna e Renata sao diretoras
UPDATE team_members SET is_director = FALSE WHERE name NOT IN ('Bruna de Souza Moraes', 'Renata Piacentini Rodriguez');
UPDATE team_members SET is_director = TRUE WHERE name IN ('Bruna de Souza Moraes', 'Renata Piacentini Rodriguez');

-- 3. Atualizar logos dos parceiros
UPDATE partners SET logo = '/assets/partners/nucleo-interdisciplinar-de-planejamento-energetico-logo.png' WHERE name_pt ILIKE '%NIPE%';
UPDATE partners SET logo = '/assets/partners/secretaria-estadual-de-agricultura-e-abastecimento-de-sao-paulo-saasp.png' WHERE name_pt ILIKE '%Secretaria Estadual de Agricultura%';
UPDATE partners SET logo = '/assets/partners/secretaria-municipal-do-verde-meio-ambiente-e-desenvolvimento-sustentavel-de-campinas.jpg' WHERE name_pt ILIKE '%Secretaria Municipal do Verde%';
UPDATE partners SET logo = '/assets/partners/unifal-mg.jpg' WHERE name_pt ILIKE '%UNIFAL%';
UPDATE partners SET logo = '/assets/partners/instituto-agronomico-de-campinas.jpg' WHERE name_pt ILIKE '%Agronômico%';
UPDATE partners SET logo = '/assets/partners/associacao-brasileira-de-pesquisa-e-inovacao-industrial-embrapii.png' WHERE name_pt ILIKE '%EMBRAPII%';
UPDATE partners SET logo = '/assets/partners/instituto-de-zootecnia.jpg' WHERE name_pt ILIKE '%Zootecnia%';
UPDATE partners SET logo = '/assets/partners/escola-politecnica-epusp.jpg' WHERE name_pt ILIKE '%Escola Politécnica%' OR name_pt ILIKE '%EPUSP%';
UPDATE partners SET logo = '/assets/partners/universidad-de-cadiz-uca.jpg' WHERE name_pt ILIKE '%Cádiz%';
UPDATE partners SET logo = '/assets/partners/delft-university-of-technology.png' WHERE name_pt ILIKE '%Delft%';
UPDATE partners SET logo = '/assets/partners/laboratorio-nacional-de-energia-e-geologia-lneg.png' WHERE name_pt ILIKE '%LNEG%';
UPDATE partners SET logo = '/assets/partners/comgas.png' WHERE name_pt ILIKE '%COMGAS%';
UPDATE partners SET logo = '/assets/partners/amplum-biogas-e-energias-renovaveis.webp' WHERE name_pt ILIKE '%Amplum%';
UPDATE partners SET logo = '/assets/partners/sabesp.jpg' WHERE name_pt ILIKE '%SABESP%';
UPDATE partners SET logo = '/assets/partners/cooperativa-dos-plantadores-de-cana-do-oeste-do-estado-de-sao-paulo-copercana.jpg' WHERE name_pt ILIKE '%COPERCANA%';

COMMIT;
