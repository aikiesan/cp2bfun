-- Migration 034: atualiza fotos e novos pesquisadores na tabela team_members
BEGIN;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS axes VARCHAR(32);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_director BOOLEAN NOT NULL DEFAULT FALSE;

-- Inserir membros faltantes
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Lucas Boaro', 'Iniciação Científica', 'Undergraduate Researcher', 'UNICAMP', 'students', '1', FALSE, 250
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Lucas Boaro');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Fabiane Moreira Vieira', 'Pós-Doutorando(a)', 'Postdoctoral Researcher', 'FEAGRI/UNICAMP', 'associates', '3', FALSE, 251
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Fabiane Moreira Vieira');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Leonardo Ariel Benavidez Mamani', 'Doutorando(a)', 'PhD Candidate', 'UNICAMP', 'students', '3', FALSE, 252
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Leonardo Ariel Benavidez Mamani');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Isabela Minucio Pontes', 'Doutoranda', 'PhD Candidate', 'UNICAMP', 'students', '4', FALSE, 253
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Isabela Minucio Pontes');

-- Atualizar eixos solicitados
UPDATE team_members SET axes = '3' WHERE name = 'Leonardo Ariel Benavidez Mamani';
UPDATE team_members SET axes = '1' WHERE name = 'Lucas Boaro';
UPDATE team_members SET axes = '4' WHERE name = 'Isabela Minucio Pontes';
UPDATE team_members SET axes = '2' WHERE name = 'Ana Beatriz Soares Aguiar';
UPDATE team_members SET axes = '3' WHERE name = 'Fabiane Moreira Vieira';
UPDATE team_members SET axes = '8' WHERE name = 'Luciana Cristina Lenhari da Silva';

-- Atualizar fotos (photo_url e photo)
UPDATE team_members SET photo_url = '/assets/team/amanda-pietra-santerio-cavini.webp', photo = '/assets/team/amanda-pietra-santerio-cavini.webp' WHERE name = 'Amanda Pietra Santerio Cavini';
UPDATE team_members SET photo_url = '/assets/team/amasa-ferreira-carvalho.webp', photo = '/assets/team/amasa-ferreira-carvalho.webp' WHERE name = 'Amasa Ferreira Carvalho';
UPDATE team_members SET photo_url = '/assets/team/ana-beatriz-soares-aguiar.webp', photo = '/assets/team/ana-beatriz-soares-aguiar.webp' WHERE name = 'Ana Beatriz Soares Aguiar';
UPDATE team_members SET photo_url = '/assets/team/antonio-eduardo-colins-sena.webp', photo = '/assets/team/antonio-eduardo-colins-sena.webp' WHERE name = 'Antonio Eduardo Colins Sena';
UPDATE team_members SET photo_url = '/assets/team/bruna-de-souza-moraes.webp', photo = '/assets/team/bruna-de-souza-moraes.webp' WHERE name = 'Bruna de Souza Moraes';
UPDATE team_members SET photo_url = '/assets/team/denis-da-silva-miranda.webp', photo = '/assets/team/denis-da-silva-miranda.webp' WHERE name = 'Denis da Silva Miranda';
UPDATE team_members SET photo_url = '/assets/team/enelton-fagnani.webp', photo = '/assets/team/enelton-fagnani.webp' WHERE name = 'Enelton Fagnani';
UPDATE team_members SET photo_url = '/assets/team/fabiane-moreira-vieira.webp', photo = '/assets/team/fabiane-moreira-vieira.webp' WHERE name = 'Fabiane Moreira Vieira';
UPDATE team_members SET photo_url = '/assets/team/gabriel-de-oliveira-rodrigues.webp', photo = '/assets/team/gabriel-de-oliveira-rodrigues.webp' WHERE name = 'Gabriel de Oliveira Rodrigues';
UPDATE team_members SET photo_url = '/assets/team/isabela-minucio-pontes.webp', photo = '/assets/team/isabela-minucio-pontes.webp' WHERE name = 'Isabela Minucio Pontes';
UPDATE team_members SET photo_url = '/assets/team/ivo-leandro-dorileo.webp', photo = '/assets/team/ivo-leandro-dorileo.webp' WHERE name = 'Ivo Leandro Dorileo';
UPDATE team_members SET photo_url = '/assets/team/jessica-cristina-franco-nogueira.webp', photo = '/assets/team/jessica-cristina-franco-nogueira.webp' WHERE name = 'Jessica Cristina Franco Nogueira';
UPDATE team_members SET photo_url = '/assets/team/jessica-jacinta-silva.webp', photo = '/assets/team/jessica-jacinta-silva.webp' WHERE name = 'Jessica Jacinta Silva';
UPDATE team_members SET photo_url = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp', photo = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp' WHERE name = 'Jose Maria Ferreira Jardim da Silveira';
UPDATE team_members SET photo_url = '/assets/team/leonardo-ariel-benavidez-mamani.webp', photo = '/assets/team/leonardo-ariel-benavidez-mamani.webp' WHERE name = 'Leonardo Ariel Benavidez Mamani';
UPDATE team_members SET photo_url = '/assets/team/luana-mattos-de-oliveira-cruz.webp', photo = '/assets/team/luana-mattos-de-oliveira-cruz.webp' WHERE name = 'Luana Mattos de Oliveira Cruz';
UPDATE team_members SET photo_url = '/assets/team/lucas-nakamura-cerejo.webp', photo = '/assets/team/lucas-nakamura-cerejo.webp' WHERE name = 'Lucas Nakamura Cerejo';
UPDATE team_members SET photo_url = '/assets/team/lucas-tadeu-fuess.webp', photo = '/assets/team/lucas-tadeu-fuess.webp' WHERE name = 'Lucas Tadeu Fuess';
UPDATE team_members SET photo_url = '/assets/team/luciana-cristina-lenhari-da-silva.webp', photo = '/assets/team/luciana-cristina-lenhari-da-silva.webp' WHERE name = 'Luciana Cristina Lenhari da Silva';
UPDATE team_members SET photo_url = '/assets/team/luis-alberto-follegatti-romero.webp', photo = '/assets/team/luis-alberto-follegatti-romero.webp' WHERE name = 'Luis Alberto Follegatti Romero';
UPDATE team_members SET photo_url = '/assets/team/luiza-arones-gaspar.webp', photo = '/assets/team/luiza-arones-gaspar.webp' WHERE name = 'Luiza Arones Gaspar';
UPDATE team_members SET photo_url = '/assets/team/luiz-gustavo-antonio-de-souza.webp', photo = '/assets/team/luiz-gustavo-antonio-de-souza.webp' WHERE name = 'Luiz Gustavo Antônio de Souza';
UPDATE team_members SET photo_url = '/assets/team/marcelo-marques-de-magalhaes.webp', photo = '/assets/team/marcelo-marques-de-magalhaes.webp' WHERE name = 'Marcelo Marques de Magalhães';
UPDATE team_members SET photo_url = '/assets/team/marcelo-zaiat.webp', photo = '/assets/team/marcelo-zaiat.webp' WHERE name = 'Marcelo Zaiat';
UPDATE team_members SET photo_url = '/assets/team/marcus-livio-carlin.webp', photo = '/assets/team/marcus-livio-carlin.webp' WHERE name = 'Marcus Lívio Carlin';
UPDATE team_members SET photo_url = '/assets/team/mariana-conceicao-da-costa.webp', photo = '/assets/team/mariana-conceicao-da-costa.webp' WHERE name = 'Mariana Conceição da Costa';
UPDATE team_members SET photo_url = '/assets/team/maria-paula-cardeal-volpi.webp', photo = '/assets/team/maria-paula-cardeal-volpi.webp' WHERE name = 'Maria Paula Cardeal Volpi';
UPDATE team_members SET photo_url = '/assets/team/mauro-donizetti-berni.webp', photo = '/assets/team/mauro-donizetti-berni.webp' WHERE name = 'Mauro Donizetti Berni';
UPDATE team_members SET photo_url = '/assets/team/mayara-regia-sousa-de-melo.webp', photo = '/assets/team/mayara-regia-sousa-de-melo.webp' WHERE name = 'Mayara Régia Sousa de Melo';
UPDATE team_members SET photo_url = '/assets/team/natalia-molina-cetrulo.webp', photo = '/assets/team/natalia-molina-cetrulo.webp' WHERE name = 'Natalia Molina Cetrulo';
UPDATE team_members SET photo_url = '/assets/team/patricia-prediger.webp', photo = '/assets/team/patricia-prediger.webp' WHERE name = 'Patricia Prediger';
UPDATE team_members SET photo_url = '/assets/team/paulo-sergio-graziano-magalhaes.webp', photo = '/assets/team/paulo-sergio-graziano-magalhaes.webp' WHERE name = 'Paulo Sergio Graziano Magalhães';
UPDATE team_members SET photo_url = '/assets/team/priscila-rosseto-camiloti.webp', photo = '/assets/team/priscila-rosseto-camiloti.webp' WHERE name = 'Priscila Rosseto Camiloti';
UPDATE team_members SET photo_url = '/assets/team/rachel-biancalana-costa.webp', photo = '/assets/team/rachel-biancalana-costa.webp' WHERE name = 'Rachel Biancalana Costa';
UPDATE team_members SET photo_url = '/assets/team/rafael-de-brito-dias.webp', photo = '/assets/team/rafael-de-brito-dias.webp' WHERE name = 'Rafael de Brito Dias';
UPDATE team_members SET photo_url = '/assets/team/raphael-guarda-cavalcante.webp', photo = '/assets/team/raphael-guarda-cavalcante.webp' WHERE name = 'Raphael Guarda Cavalcante';
UPDATE team_members SET photo_url = '/assets/team/renata-piacentini-rodriguez.webp', photo = '/assets/team/renata-piacentini-rodriguez.webp' WHERE name = 'Renata Piacentini Rodriguez';
UPDATE team_members SET photo_url = '/assets/team/rubens-augusto-camargo-lamparelli.webp', photo = '/assets/team/rubens-augusto-camargo-lamparelli.webp' WHERE name = 'Rubens Augusto Camargo Lamparelli';
UPDATE team_members SET photo_url = '/assets/team/sergio-valdir-bajay.webp', photo = '/assets/team/sergio-valdir-bajay.webp' WHERE name = 'Sergio Valdir Bajay';
UPDATE team_members SET photo_url = '/assets/team/simone-aparecida-dos-santos.webp', photo = '/assets/team/simone-aparecida-dos-santos.webp' WHERE name = 'Simone Aparecida dos Santos';
UPDATE team_members SET photo_url = '/assets/team/sofia-silva.webp', photo = '/assets/team/sofia-silva.webp' WHERE name = 'Sofia Silva';
UPDATE team_members SET photo_url = '/assets/team/sonia-regina-da-cal-seixas.webp', photo = '/assets/team/sonia-regina-da-cal-seixas.webp' WHERE name = 'Sonia Regina da Cal Seixas';
UPDATE team_members SET photo_url = '/assets/team/stella-stopa-assis-palma.webp', photo = '/assets/team/stella-stopa-assis-palma.webp' WHERE name = 'Stella Stopa Assis Palma';
UPDATE team_members SET photo_url = '/assets/team/stephani-cetimia-mariotti-ruiz.webp', photo = '/assets/team/stephani-cetimia-mariotti-ruiz.webp' WHERE name = 'Stephani Cetimia Mariotti Ruiz';
UPDATE team_members SET photo_url = '/assets/team/thais-aparecida-dibbern.webp', photo = '/assets/team/thais-aparecida-dibbern.webp' WHERE name = 'Thais Aparecida Dibbern';
UPDATE team_members SET photo_url = '/assets/team/waldyr-luiz-ribeiro-gallo.webp', photo = '/assets/team/waldyr-luiz-ribeiro-gallo.webp' WHERE name = 'Waldyr Luiz Ribeiro Gallo';
UPDATE team_members SET photo_url = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp', photo = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp' WHERE name IN ('Jose Maria Ferreira Jardim da Silveira', 'José Maria Ferreira Jardim da Silveira');
UPDATE team_members SET photo_url = '/assets/team/mauro-donizetti-berni.webp', photo = '/assets/team/mauro-donizetti-berni.webp' WHERE name IN ('Mauro Donizeti Berni', 'Mauro Donizetti Berni');
UPDATE team_members SET photo_url = '/assets/team/luiz-gustavo-antonio-de-souza.webp', photo = '/assets/team/luiz-gustavo-antonio-de-souza.webp' WHERE name IN ('Luiz Gustavo Antonio de Souza', 'Luiz Gustavo Antônio de Souza');
UPDATE team_members SET photo_url = '/assets/team/mariana-conceicao-da-costa.webp', photo = '/assets/team/mariana-conceicao-da-costa.webp' WHERE name IN ('Mariana Conceição da Costa', 'Mariana Conceicao da Costa');
UPDATE team_members SET photo_url = '/assets/team/marcelo-pereira-da-cunha.webp', photo = '/assets/team/marcelo-pereira-da-cunha.webp' WHERE name IN ('Marcelo Pereira da Cunha', 'Marcelo Pereira Cunha');
UPDATE team_members SET photo_url = '/assets/team/dante-chiavareto-pezzin.webp', photo = '/assets/team/dante-chiavareto-pezzin.webp' WHERE name IN ('Dante Chiavareto Pezzin', 'Dante Pezzin');

COMMIT;
