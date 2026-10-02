-- Migration 032: liga cada pessoa da equipe ao(s) seu(s) eixo(s) e traz
-- para /equipe quem so existia na planilha estrategica.
--
-- GERADO a partir de src/data/generated/teamByAxis.js (abas 'Coord Eixos' e
-- 'Pesquisadores' da planilha da Luciana) cruzado com os nomes ja gravados em
-- team_members. O cruzamento ignora acento, titulo academico e nomes do meio
-- -- a planilha traz 'Dante Pezzin' onde o site traz 'Dante Chiavareto
-- Pezzin' -- por isso os UPDATEs abaixo usam a grafia que esta no banco.
--
-- 'axes' e uma lista separada por virgula porque uma pessoa pode atuar em
-- mais de um eixo. 'is_director' e separado de proposito: na planilha a
-- direcao do centro aparece como eixo '0', que nao e um eixo tematico --
-- Bruna e Renata dirigem o CP2b inteiro E atuam nos eixos 6 e 7, e a pagina
-- precisa mostrar as duas coisas.
--
-- Idempotente: colunas com IF NOT EXISTS, UPDATEs sao naturalmente
-- reexecutaveis, e cada INSERT so roda se a pessoa ainda nao existir.

BEGIN;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS axes VARCHAR(32);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_director BOOLEAN NOT NULL DEFAULT FALSE;

-- Pessoas ja no site para as quais a planilha informa o eixo (27).
UPDATE team_members SET axes = '6,7', is_director = TRUE WHERE name = 'Bruna de Souza Moraes';
UPDATE team_members SET axes = '6,7', is_director = TRUE WHERE name = 'Renata Piacentini Rodriguez';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'José Maria Ferreira Jardim da Silveira';
UPDATE team_members SET axes = '5', is_director = FALSE WHERE name = 'Luis Alberto Follegatti Romero';
UPDATE team_members SET axes = '8', is_director = FALSE WHERE name = 'Rafael de Brito Dias';
UPDATE team_members SET axes = '1', is_director = FALSE WHERE name = 'Rubens Augusto Camargo Lamparelli';
UPDATE team_members SET axes = '6', is_director = FALSE WHERE name = 'Dante Chiavareto Pezzin';
UPDATE team_members SET axes = '3', is_director = FALSE WHERE name = 'Enelton Fagnani';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Ivo Leandro Dorileo';
UPDATE team_members SET axes = '3', is_director = FALSE WHERE name = 'Luana Mattos de Oliveira Cruz';
UPDATE team_members SET axes = '2', is_director = FALSE WHERE name = 'Lucas Tadeu Fuess';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Luiz Gustavo Antonio de Souza';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Marcelo Marques de Magalhães';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Marcelo Pereira da Cunha';
UPDATE team_members SET axes = '2', is_director = FALSE WHERE name = 'Marcelo Zaiat';
UPDATE team_members SET axes = '7', is_director = FALSE WHERE name = 'Maria Paula Cardeal Volpi';
UPDATE team_members SET axes = '5', is_director = FALSE WHERE name = 'Mariana Conceição da Costa';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Mauro Donizeti Berni';
UPDATE team_members SET axes = '8', is_director = FALSE WHERE name = 'Natalia Molina Cetrulo';
UPDATE team_members SET axes = '3', is_director = FALSE WHERE name = 'Paulo Sergio Graziano Magalhães';
UPDATE team_members SET axes = '2', is_director = FALSE WHERE name = 'Priscila Rosseto Camiloti';
UPDATE team_members SET axes = '8', is_director = FALSE WHERE name = 'Sergio Valdir Bajay';
UPDATE team_members SET axes = '4', is_director = FALSE WHERE name = 'Sonia Regina da Cal Seixas';
UPDATE team_members SET axes = '8', is_director = FALSE WHERE name = 'Thais Aparecida Dibbern';
UPDATE team_members SET axes = '5', is_director = FALSE WHERE name = 'Waldyr Luiz Ribeiro Gallo';
UPDATE team_members SET axes = '2', is_director = FALSE WHERE name = 'Denis da Silva Miranda';
UPDATE team_members SET axes = '5', is_director = FALSE WHERE name = 'Rachel Biancalana Costa';

-- Pessoas que so existiam na planilha (23).
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Alexandre Da Silva Souza', 'Doutorando(a)', 'PhD Candidate', 'UNIFAL', 'students', '2', FALSE, 201
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Alexandre Da Silva Souza');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Amanda Pietra Santerio Cavini', 'Mestre', 'MSc', 'UNIFAL', 'associates', '3', FALSE, 202
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Amanda Pietra Santerio Cavini');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Amasa Ferreira Carvalho', 'Doutor(a)', 'PhD', 'NIPE/UNICAMP', 'associates', '6', FALSE, 203
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Amasa Ferreira Carvalho');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Antonio Parice Bufalo', 'Graduando(a)', 'Undergraduate Student', 'CP2b/UNICAMP', 'students', '7', FALSE, 204
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Antonio Parice Bufalo');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Antonio Eduardo Colins Sena', 'Graduando(a)', 'Undergraduate Student', NULL, 'students', '2', FALSE, 205
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Antonio Eduardo Colins Sena');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Dave Ronel  (Hilman Ibnu Mahdi)', 'Doutorando(a)', 'PhD Candidate', 'USP', 'students', '5', FALSE, 206
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Dave Ronel  (Hilman Ibnu Mahdi)');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Eder Kevin Arango Escalante', 'Mestrando(a)', 'MSc Candidate', 'UNICAMP', 'students', '2', FALSE, 207
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Eder Kevin Arango Escalante');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Gabriel de Oliveira Rodrigues', 'Doutorando(a)', 'PhD Candidate', 'USP', 'students', '3', FALSE, 208
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Gabriel de Oliveira Rodrigues');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Henrique de Souza Dornelles', 'Pós-Doutorando(a)', 'Postdoctoral Researcher', 'UNICAMP', 'associates', '3', FALSE, 209
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Henrique de Souza Dornelles');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Isabela Minucio Pontes', 'Doutorando(a)', 'PhD Candidate', 'UNICAMP', 'students', '5', FALSE, 210
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Isabela Minucio Pontes');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Jessica Cristina Franco Nogueira', 'Doutorando(a)', 'PhD Candidate', 'UNIFAL', 'students', '2', FALSE, 211
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Jessica Cristina Franco Nogueira');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Jessica Jacinta Silva', 'Doutorando(a)', 'PhD Candidate', 'UNIFAL', 'students', '3', FALSE, 212
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Jessica Jacinta Silva');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Leonardo Ariel Benavidez Mamani', 'Doutorando(a)', 'PhD Candidate', 'UNICAMP', 'students', '1', FALSE, 213
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Leonardo Ariel Benavidez Mamani');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Lucas Nakamura Cerejo', 'Pós-Doutorando(a)', 'Postdoctoral Researcher', 'NIPE/UNICAMP', 'associates', '1', FALSE, 214
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Lucas Nakamura Cerejo');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Luiza Arones Gaspar', 'Graduando(a)', 'Undergraduate Student', NULL, 'students', '2', FALSE, 215
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Luiza Arones Gaspar');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Marcus Lívio Carlin', 'Mestre', 'MSc', 'UNIFAL', 'associates', '2', FALSE, 216
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Marcus Lívio Carlin');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Mayara Régia Sousa de Melo', 'Doutorando(a)', 'PhD Candidate', 'UNICAMP', 'students', '6', FALSE, 217
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Mayara Régia Sousa de Melo');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Patricia Prediger', 'Professor(a)', 'Professor', 'FT UNICAMP', 'associates', '3', FALSE, 218
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Patricia Prediger');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Raphael Guarda Cavalcante', 'Mestrando(a)', 'MSc Candidate', 'UNIFAL', 'students', '4', FALSE, 219
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Raphael Guarda Cavalcante');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Simone Aparecida dos Santos', 'Doutorando(a)', 'PhD Candidate', 'NIPE/UNICAMP', 'students', '2', FALSE, 220
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Simone Aparecida dos Santos');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Sofia Silva', 'Bolsista de Jornalismo Científico', 'Science Communication Fellow', 'UNICAMP', 'students', '7', FALSE, 221
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Sofia Silva');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Stella Stopa Assis Palma', 'Pós-Doutorando(a)', 'Postdoctoral Researcher', 'NIPE/UNICAMP', 'associates', '2', FALSE, 222
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Stella Stopa Assis Palma');
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Stephani Cetimia Mariotti Ruiz', 'Pós-Doutorando(a)', 'Postdoctoral Researcher', 'IE/UNICAMP', 'associates', '4', FALSE, 223
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Stephani Cetimia Mariotti Ruiz');

COMMIT;
