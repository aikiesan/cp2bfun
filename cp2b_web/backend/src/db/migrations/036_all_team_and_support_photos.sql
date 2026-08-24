-- Migration 036: fotos para todos os pesquisadores e apoio administrativo
BEGIN;

-- Inserir equipe de apoio caso nao existam
INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Magali Luzia Maróstica', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', '', FALSE, 301
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Magali Luzia Maróstica%');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Paulo César de Almeida Pinheiro', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', '', FALSE, 302
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Paulo César de Almeida Pinheiro%');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Rosângela Pedroz', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', '', FALSE, 303
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Rosângela Pedroz%');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Bruno Felipe Veloso', 'Apoio Técnico', 'Technical Support', 'CCUEC/UNICAMP', 'support', '', FALSE, 304
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Bruno Felipe Veloso%');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Joaquim Eugênio Abel Seabra', 'Apoio Técnico', 'Technical Support', 'FEM/UNICAMP', 'support', '', FALSE, 305
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Joaquim Eugênio Abel Seabra%');

INSERT INTO team_members (name, role_pt, role_en, institution, category, axes, is_director, sort_order)
SELECT 'Raffaella Rossetto', 'Apoio Técnico', 'Technical Support', 'APTA/SAASP', 'support', '', FALSE, 306
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name ILIKE '%Raffaella Rossetto%');

-- Atualizar fotos para todos os membros
UPDATE team_members SET photo = '/assets/team/alessandro-sanches-pereira.webp', photo_url = '/assets/team/alessandro-sanches-pereira.webp' WHERE name ILIKE '%Alessandro Sanches Pereira%';
UPDATE team_members SET photo = '/assets/team/aline-veronese-da-silva.webp', photo_url = '/assets/team/aline-veronese-da-silva.webp' WHERE name ILIKE '%Aline Veronese da Silva%';
UPDATE team_members SET photo = '/assets/team/amanda-pietra-santerio-cavini.webp', photo_url = '/assets/team/amanda-pietra-santerio-cavini.webp' WHERE name ILIKE '%Amanda Pietra Santerio Cavini%';
UPDATE team_members SET photo = '/assets/team/ana-beatriz-soares-aguiar.webp', photo_url = '/assets/team/ana-beatriz-soares-aguiar.webp' WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET photo = '/assets/team/antonio-eduardo-colins-sena.webp', photo_url = '/assets/team/antonio-eduardo-colins-sena.webp' WHERE name ILIKE '%Antonio Eduardo Colins Sena%';
UPDATE team_members SET photo = '/assets/team/barbara-janet-teruel-mederos.webp', photo_url = '/assets/team/barbara-janet-teruel-mederos.webp' WHERE name ILIKE '%Barbara Janet Teruel Mederos%';
UPDATE team_members SET photo = '/assets/team/bruna-de-souza-moraes.webp', photo_url = '/assets/team/bruna-de-souza-moraes.webp' WHERE name ILIKE '%Bruna de Souza Moraes%';
UPDATE team_members SET photo = '/assets/team/bruno-felipe-veloso.webp', photo_url = '/assets/team/bruno-felipe-veloso.webp' WHERE name ILIKE '%Bruno Felipe Veloso%';
UPDATE team_members SET photo = '/assets/team/bruno-sidnei-da-silva.webp', photo_url = '/assets/team/bruno-sidnei-da-silva.webp' WHERE name ILIKE '%Bruno Sidnei da Silva%';
UPDATE team_members SET photo = '/assets/team/caio-henrique-rufino.webp', photo_url = '/assets/team/caio-henrique-rufino.webp' WHERE name ILIKE '%Caio Henrique Rufino%';
UPDATE team_members SET photo = '/assets/team/carla-kazue-nakao-cavaliero.webp', photo_url = '/assets/team/carla-kazue-nakao-cavaliero.webp' WHERE name ILIKE '%Carla Kazue Nakao Cavaliero%';
UPDATE team_members SET photo = '/assets/team/daniel-francisco-nagao-menezes.webp', photo_url = '/assets/team/daniel-francisco-nagao-menezes.webp' WHERE name ILIKE '%Daniel Francisco Nagao Menezes%';
UPDATE team_members SET photo = '/assets/team/daniel-henrique-dario-capitani.webp', photo_url = '/assets/team/daniel-henrique-dario-capitani.webp' WHERE name ILIKE '%Daniel Henrique Dario Capitani%';
UPDATE team_members SET photo = '/assets/team/danusia-arantes-ferreira.webp', photo_url = '/assets/team/danusia-arantes-ferreira.webp' WHERE name ILIKE '%Danúsia Arantes Ferreira%';
UPDATE team_members SET photo = '/assets/team/danusia-arantes-ferreira.webp', photo_url = '/assets/team/danusia-arantes-ferreira.webp' WHERE name ILIKE '%Danusia Arantes Ferreira%';
UPDATE team_members SET photo = '/assets/team/denis-da-silva-miranda.webp', photo_url = '/assets/team/denis-da-silva-miranda.webp' WHERE name ILIKE '%Denis da Silva Miranda%';
UPDATE team_members SET photo = '/assets/team/enelton-fagnani.webp', photo_url = '/assets/team/enelton-fagnani.webp' WHERE name ILIKE '%Enelton Fagnani%';
UPDATE team_members SET photo = '/assets/team/fabiane-moreira-vieira.webp', photo_url = '/assets/team/fabiane-moreira-vieira.webp' WHERE name ILIKE '%Fabiane Moreira Vieira%';
UPDATE team_members SET photo = '/assets/team/flavia-luciane-consoni.webp', photo_url = '/assets/team/flavia-luciane-consoni.webp' WHERE name ILIKE '%Flávia Luciane Consoni%';
UPDATE team_members SET photo = '/assets/team/flavia-luciane-consoni.webp', photo_url = '/assets/team/flavia-luciane-consoni.webp' WHERE name ILIKE '%Flavia Luciane Consoni%';
UPDATE team_members SET photo = '/assets/team/gabriel-dias-mangolini-neves.webp', photo_url = '/assets/team/gabriel-dias-mangolini-neves.webp' WHERE name ILIKE '%Gabriel Dias Mangolini Neves%';
UPDATE team_members SET photo = '/assets/team/gabriel-de-oliveira-rodrigues.webp', photo_url = '/assets/team/gabriel-de-oliveira-rodrigues.webp' WHERE name ILIKE '%Gabriel de Oliveira Rodrigues%';
UPDATE team_members SET photo = '/assets/team/gustavo-mockaitis.webp', photo_url = '/assets/team/gustavo-mockaitis.webp' WHERE name ILIKE '%Gustavo Mockaitis%';
UPDATE team_members SET photo = '/assets/team/hildo-guillardi-junior.webp', photo_url = '/assets/team/hildo-guillardi-junior.webp' WHERE name ILIKE '%Hildo Guillardi Júnior%';
UPDATE team_members SET photo = '/assets/team/hildo-guillardi-junior.webp', photo_url = '/assets/team/hildo-guillardi-junior.webp' WHERE name ILIKE '%Hildo Guillardi Junior%';
UPDATE team_members SET photo = '/assets/team/isabela-minucio-pontes.webp', photo_url = '/assets/team/isabela-minucio-pontes.webp' WHERE name ILIKE '%Isabela Minucio Pontes%';
UPDATE team_members SET photo = '/assets/team/ivo-leandro-dorileo.webp', photo_url = '/assets/team/ivo-leandro-dorileo.webp' WHERE name ILIKE '%Ivo Leandro Dorileo%';
UPDATE team_members SET photo = '/assets/team/jens-bo-holm-nielsen.webp', photo_url = '/assets/team/jens-bo-holm-nielsen.webp' WHERE name ILIKE '%Jens Bo Holm-Nielsen%';
UPDATE team_members SET photo = '/assets/team/jens-bo-holm-nielsen.webp', photo_url = '/assets/team/jens-bo-holm-nielsen.webp' WHERE name ILIKE '%Jens Bo Holm Nielsen%';
UPDATE team_members SET photo = '/assets/team/jessica-cristina-franco-nogueira.webp', photo_url = '/assets/team/jessica-cristina-franco-nogueira.webp' WHERE name ILIKE '%Jessica Cristina Franco Nogueira%';
UPDATE team_members SET photo = '/assets/team/jessica-jacinta-silva.webp', photo_url = '/assets/team/jessica-jacinta-silva.webp' WHERE name ILIKE '%Jessica Jacinta Silva%';
UPDATE team_members SET photo = '/assets/team/joaquim-eugenio-abel-seabra.webp', photo_url = '/assets/team/joaquim-eugenio-abel-seabra.webp' WHERE name ILIKE '%Joaquim Eugênio Abel Seabra%';
UPDATE team_members SET photo = '/assets/team/joaquim-eugenio-abel-seabra.webp', photo_url = '/assets/team/joaquim-eugenio-abel-seabra.webp' WHERE name ILIKE '%Joaquim Eugenio Abel Seabra%';
UPDATE team_members SET photo = '/assets/team/joni-de-almeida-amorim.webp', photo_url = '/assets/team/joni-de-almeida-amorim.webp' WHERE name ILIKE '%Joni de Almeida Amorim%';
UPDATE team_members SET photo = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp', photo_url = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp' WHERE name ILIKE '%Jose Maria Ferreira Jardim da Silveira%';
UPDATE team_members SET photo = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp', photo_url = '/assets/team/jose-maria-ferreira-jardim-da-silveira.webp' WHERE name ILIKE '%José Maria Ferreira Jardim da Silveira%';
UPDATE team_members SET photo = '/assets/team/jose-octavio-armani-paschoal.webp', photo_url = '/assets/team/jose-octavio-armani-paschoal.webp' WHERE name ILIKE '%José Octavio Armani Paschoal%';
UPDATE team_members SET photo = '/assets/team/jose-octavio-armani-paschoal.webp', photo_url = '/assets/team/jose-octavio-armani-paschoal.webp' WHERE name ILIKE '%Jose Octavio Armani Paschoal%';
UPDATE team_members SET photo = '/assets/team/joao-guilherme-ito-cypriano.webp', photo_url = '/assets/team/joao-guilherme-ito-cypriano.webp' WHERE name ILIKE '%João Guilherme Ito Cypriano%';
UPDATE team_members SET photo = '/assets/team/joao-guilherme-ito-cypriano.webp', photo_url = '/assets/team/joao-guilherme-ito-cypriano.webp' WHERE name ILIKE '%Joao Guilherme Ito Cypriano%';
UPDATE team_members SET photo = '/assets/team/juliana-paula-da-silva-ulian.webp', photo_url = '/assets/team/juliana-paula-da-silva-ulian.webp' WHERE name ILIKE '%Juliana Paula da Silva Ulian%';
UPDATE team_members SET photo = '/assets/team/karla-adriana-martins-bessa.webp', photo_url = '/assets/team/karla-adriana-martins-bessa.webp' WHERE name ILIKE '%Karla Adriana Martins Bessa%';
UPDATE team_members SET photo = '/assets/team/leandro-wang-hantao.webp', photo_url = '/assets/team/leandro-wang-hantao.webp' WHERE name ILIKE '%Leandro Wang Hantao%';
UPDATE team_members SET photo = '/assets/team/leidiane-mariani.webp', photo_url = '/assets/team/leidiane-mariani.webp' WHERE name ILIKE '%Leidiane Mariani%';
UPDATE team_members SET photo = '/assets/team/leonardo-ariel-benavidez-mamani.webp', photo_url = '/assets/team/leonardo-ariel-benavidez-mamani.webp' WHERE name ILIKE '%Leonardo Ariel Benavidez Mamani%';
UPDATE team_members SET photo = '/assets/team/leonardo-vasconcelos-fregolente.webp', photo_url = '/assets/team/leonardo-vasconcelos-fregolente.webp' WHERE name ILIKE '%Leonardo Vasconcelos Fregolente%';
UPDATE team_members SET photo = '/assets/team/lira-luz-benites-lazaro.webp', photo_url = '/assets/team/lira-luz-benites-lazaro.webp' WHERE name ILIKE '%Lira Luz Benites Lazaro%';
UPDATE team_members SET photo = '/assets/team/luana-mattos-de-oliveira-cruz.webp', photo_url = '/assets/team/luana-mattos-de-oliveira-cruz.webp' WHERE name ILIKE '%Luana Mattos de Oliveira Cruz%';
UPDATE team_members SET photo = '/assets/team/lucas-boaro.webp', photo_url = '/assets/team/lucas-boaro.webp' WHERE name ILIKE '%Lucas Boaro%';
UPDATE team_members SET photo = '/assets/team/lucas-nakamura-cerejo.webp', photo_url = '/assets/team/lucas-nakamura-cerejo.webp' WHERE name ILIKE '%Lucas Nakamura Cerejo%';
UPDATE team_members SET photo = '/assets/team/lucas-tadeu-fuess.webp', photo_url = '/assets/team/lucas-tadeu-fuess.webp' WHERE name ILIKE '%Lucas Tadeu Fuess%';
UPDATE team_members SET photo = '/assets/team/luciana-cristina-lenhari-da-silva.webp', photo_url = '/assets/team/luciana-cristina-lenhari-da-silva.webp' WHERE name ILIKE '%Luciana Cristina Lenhari da Silva%';
UPDATE team_members SET photo = '/assets/team/luis-alberto-follegatti-romero.webp', photo_url = '/assets/team/luis-alberto-follegatti-romero.webp' WHERE name ILIKE '%Luis Alberto Follegatti Romero%';
UPDATE team_members SET photo = '/assets/team/luiz-carlos-pereira-da-silva.webp', photo_url = '/assets/team/luiz-carlos-pereira-da-silva.webp' WHERE name ILIKE '%Luiz Carlos Pereira da Silva%';
UPDATE team_members SET photo = '/assets/team/luiz-carlos-roma-junior.webp', photo_url = '/assets/team/luiz-carlos-roma-junior.webp' WHERE name ILIKE '%Luiz Carlos Roma Júnior%';
UPDATE team_members SET photo = '/assets/team/luiz-carlos-roma-junior.webp', photo_url = '/assets/team/luiz-carlos-roma-junior.webp' WHERE name ILIKE '%Luiz Carlos Roma Junior%';
UPDATE team_members SET photo = '/assets/team/luiza-arones-gaspar.webp', photo_url = '/assets/team/luiza-arones-gaspar.webp' WHERE name ILIKE '%Luiza Arones Gaspar%';
UPDATE team_members SET photo = '/assets/team/luiz-gustavo-antonio-de-souza.webp', photo_url = '/assets/team/luiz-gustavo-antonio-de-souza.webp' WHERE name ILIKE '%Luiz Gustavo Antonio de Souza%';
UPDATE team_members SET photo = '/assets/team/luiz-gustavo-antonio-de-souza.webp', photo_url = '/assets/team/luiz-gustavo-antonio-de-souza.webp' WHERE name ILIKE '%Luiz Gustavo Antônio de Souza%';
UPDATE team_members SET photo = '/assets/team/magali-luzia-marostica.webp', photo_url = '/assets/team/magali-luzia-marostica.webp' WHERE name ILIKE '%Magali Luzia Maróstica%';
UPDATE team_members SET photo = '/assets/team/magali-luzia-marostica.webp', photo_url = '/assets/team/magali-luzia-marostica.webp' WHERE name ILIKE '%Magali Luzia Marostica%';
UPDATE team_members SET photo = '/assets/team/marcelo-antunes-nolasco.webp', photo_url = '/assets/team/marcelo-antunes-nolasco.webp' WHERE name ILIKE '%Marcelo Antunes Nolasco%';
UPDATE team_members SET photo = '/assets/team/marcelo-de-carvalho-pereira.webp', photo_url = '/assets/team/marcelo-de-carvalho-pereira.webp' WHERE name ILIKE '%Marcelo de Carvalho Pereira%';
UPDATE team_members SET photo = '/assets/team/marcelo-kenji-miki.webp', photo_url = '/assets/team/marcelo-kenji-miki.webp' WHERE name ILIKE '%Marcelo Kenji Miki%';
UPDATE team_members SET photo = '/assets/team/marcelo-marques-de-magalhaes.webp', photo_url = '/assets/team/marcelo-marques-de-magalhaes.webp' WHERE name ILIKE '%Marcelo Marques de Magalhães%';
UPDATE team_members SET photo = '/assets/team/marcelo-marques-de-magalhaes.webp', photo_url = '/assets/team/marcelo-marques-de-magalhaes.webp' WHERE name ILIKE '%Marcelo Marques de Magalhaes%';
UPDATE team_members SET photo = '/assets/team/marcelo-pereira-da-cunha.webp', photo_url = '/assets/team/marcelo-pereira-da-cunha.webp' WHERE name ILIKE '%Marcelo Pereira da Cunha%';
UPDATE team_members SET photo = '/assets/team/marcelo-pereira-da-cunha.webp', photo_url = '/assets/team/marcelo-pereira-da-cunha.webp' WHERE name ILIKE '%Marcelo Pereira Cunha%';
UPDATE team_members SET photo = '/assets/team/marcelo-zaiat.webp', photo_url = '/assets/team/marcelo-zaiat.webp' WHERE name ILIKE '%Marcelo Zaiat%';
UPDATE team_members SET photo = '/assets/team/marcus-livio-carlin.webp', photo_url = '/assets/team/marcus-livio-carlin.webp' WHERE name ILIKE '%Marcus Lívio Carlin%';
UPDATE team_members SET photo = '/assets/team/marcus-livio-carlin.webp', photo_url = '/assets/team/marcus-livio-carlin.webp' WHERE name ILIKE '%Marcus Livio Carlin%';
UPDATE team_members SET photo = '/assets/team/mariana-conceicao-da-costa.webp', photo_url = '/assets/team/mariana-conceicao-da-costa.webp' WHERE name ILIKE '%Mariana Conceição da Costa%';
UPDATE team_members SET photo = '/assets/team/mariana-conceicao-da-costa.webp', photo_url = '/assets/team/mariana-conceicao-da-costa.webp' WHERE name ILIKE '%Mariana Conceicao da Costa%';
UPDATE team_members SET photo = '/assets/team/maria-paula-cardeal-volpi.webp', photo_url = '/assets/team/maria-paula-cardeal-volpi.webp' WHERE name ILIKE '%Maria Paula Cardeal Volpi%';
UPDATE team_members SET photo = '/assets/team/mauro-donizeti-berni.webp', photo_url = '/assets/team/mauro-donizeti-berni.webp' WHERE name ILIKE '%Mauro Donizeti Berni%';
UPDATE team_members SET photo = '/assets/team/mauro-donizeti-berni.webp', photo_url = '/assets/team/mauro-donizeti-berni.webp' WHERE name ILIKE '%Mauro Donizetti Berni%';
UPDATE team_members SET photo = '/assets/team/mayara-regia-sousa-de-melo.webp', photo_url = '/assets/team/mayara-regia-sousa-de-melo.webp' WHERE name ILIKE '%Mayara Régia Sousa de Melo%';
UPDATE team_members SET photo = '/assets/team/mayara-regia-sousa-de-melo.webp', photo_url = '/assets/team/mayara-regia-sousa-de-melo.webp' WHERE name ILIKE '%Mayara Regia Sousa de Melo%';
UPDATE team_members SET photo = '/assets/team/natalia-molina-cetrulo.webp', photo_url = '/assets/team/natalia-molina-cetrulo.webp' WHERE name ILIKE '%Natalia Molina Cetrulo%';
UPDATE team_members SET photo = '/assets/team/paola-mercadante-petry.webp', photo_url = '/assets/team/paola-mercadante-petry.webp' WHERE name ILIKE '%Paola Mercadante Petry%';
UPDATE team_members SET photo = '/assets/team/patricia-jacqueline-thyssen.webp', photo_url = '/assets/team/patricia-jacqueline-thyssen.webp' WHERE name ILIKE '%Patricia Jacqueline Thyssen%';
UPDATE team_members SET photo = '/assets/team/patricia-nunes-da-silva-mariuzzo.webp', photo_url = '/assets/team/patricia-nunes-da-silva-mariuzzo.webp' WHERE name ILIKE '%Patricia Nunes da Silva Mariuzzo%';
UPDATE team_members SET photo = '/assets/team/patricia-prediger.webp', photo_url = '/assets/team/patricia-prediger.webp' WHERE name ILIKE '%Patricia Prediger%';
UPDATE team_members SET photo = '/assets/team/paulo-cesar-souza-manduca.webp', photo_url = '/assets/team/paulo-cesar-souza-manduca.webp' WHERE name ILIKE '%Paulo Cesar Souza Manduca%';
UPDATE team_members SET photo = '/assets/team/paulo-cesar-de-almeida-pinheiro.webp', photo_url = '/assets/team/paulo-cesar-de-almeida-pinheiro.webp' WHERE name ILIKE '%Paulo César de Almeida Pinheiro%';
UPDATE team_members SET photo = '/assets/team/paulo-cesar-de-almeida-pinheiro.webp', photo_url = '/assets/team/paulo-cesar-de-almeida-pinheiro.webp' WHERE name ILIKE '%Paulo Cesar de Almeida Pinheiro%';
UPDATE team_members SET photo = '/assets/team/paulo-sergio-graziano-magalhaes.webp', photo_url = '/assets/team/paulo-sergio-graziano-magalhaes.webp' WHERE name ILIKE '%Paulo Sergio Graziano Magalhães%';
UPDATE team_members SET photo = '/assets/team/paulo-sergio-graziano-magalhaes.webp', photo_url = '/assets/team/paulo-sergio-graziano-magalhaes.webp' WHERE name ILIKE '%Paulo Sergio Graziano Magalhaes%';
UPDATE team_members SET photo = '/assets/team/priscila-rosseto-camiloti.webp', photo_url = '/assets/team/priscila-rosseto-camiloti.webp' WHERE name ILIKE '%Priscila Rosseto Camiloti%';
UPDATE team_members SET photo = '/assets/team/rachel-biancalana-costa.webp', photo_url = '/assets/team/rachel-biancalana-costa.webp' WHERE name ILIKE '%Rachel Biancalana Costa%';
UPDATE team_members SET photo = '/assets/team/rafael-de-brito-dias.webp', photo_url = '/assets/team/rafael-de-brito-dias.webp' WHERE name ILIKE '%Rafael de Brito Dias%';
UPDATE team_members SET photo = '/assets/team/raffaella-rossetto.webp', photo_url = '/assets/team/raffaella-rossetto.webp' WHERE name ILIKE '%Raffaella Rossetto%';
UPDATE team_members SET photo = '/assets/team/raphael-guarda-cavalcante.webp', photo_url = '/assets/team/raphael-guarda-cavalcante.webp' WHERE name ILIKE '%Raphael Guarda Cavalcante%';
UPDATE team_members SET photo = '/assets/team/raquel-teixeira-gomes-magri.webp', photo_url = '/assets/team/raquel-teixeira-gomes-magri.webp' WHERE name ILIKE '%Raquel Teixeira Gomes Magri%';
UPDATE team_members SET photo = '/assets/team/renata-piacentini-rodriguez.webp', photo_url = '/assets/team/renata-piacentini-rodriguez.webp' WHERE name ILIKE '%Renata Piacentini Rodriguez%';
UPDATE team_members SET photo = '/assets/team/rosangela-pedroz.webp', photo_url = '/assets/team/rosangela-pedroz.webp' WHERE name ILIKE '%Rosângela Pedroz%';
UPDATE team_members SET photo = '/assets/team/rosangela-pedroz.webp', photo_url = '/assets/team/rosangela-pedroz.webp' WHERE name ILIKE '%Rosangela Pedroz%';
UPDATE team_members SET photo = '/assets/team/rosangela-pedroz.webp', photo_url = '/assets/team/rosangela-pedroz.webp' WHERE name ILIKE '%Rosângela Pedroza%';
UPDATE team_members SET photo = '/assets/team/rosangela-pedroz.webp', photo_url = '/assets/team/rosangela-pedroz.webp' WHERE name ILIKE '%Rosangela Pedroza%';
UPDATE team_members SET photo = '/assets/team/rubens-augusto-camargo-lamparelli.webp', photo_url = '/assets/team/rubens-augusto-camargo-lamparelli.webp' WHERE name ILIKE '%Rubens Augusto Camargo Lamparelli%';
UPDATE team_members SET photo = '/assets/team/rubens-maciel-filho.webp', photo_url = '/assets/team/rubens-maciel-filho.webp' WHERE name ILIKE '%Rubens Maciel Filho%';
UPDATE team_members SET photo = '/assets/team/sarita-candida-rabelo.webp', photo_url = '/assets/team/sarita-candida-rabelo.webp' WHERE name ILIKE '%Sarita Cândida Rabelo%';
UPDATE team_members SET photo = '/assets/team/sarita-candida-rabelo.webp', photo_url = '/assets/team/sarita-candida-rabelo.webp' WHERE name ILIKE '%Sarita Candida Rabelo%';
UPDATE team_members SET photo = '/assets/team/sergio-valdir-bajay.webp', photo_url = '/assets/team/sergio-valdir-bajay.webp' WHERE name ILIKE '%Sergio Valdir Bajay%';
UPDATE team_members SET photo = '/assets/team/simone-aparecida-dos-santos.webp', photo_url = '/assets/team/simone-aparecida-dos-santos.webp' WHERE name ILIKE '%Simone Aparecida dos Santos%';
UPDATE team_members SET photo = '/assets/team/sofia-silva.webp', photo_url = '/assets/team/sofia-silva.webp' WHERE name ILIKE '%Sofia Silva%';
UPDATE team_members SET photo = '/assets/team/solange-teles-da-silva.webp', photo_url = '/assets/team/solange-teles-da-silva.webp' WHERE name ILIKE '%Solange Teles da Silva%';
UPDATE team_members SET photo = '/assets/team/sonia-regina-da-cal-seixas.webp', photo_url = '/assets/team/sonia-regina-da-cal-seixas.webp' WHERE name ILIKE '%Sonia Regina da Cal Seixas%';
UPDATE team_members SET photo = '/assets/team/stella-stopa-assis-palma.webp', photo_url = '/assets/team/stella-stopa-assis-palma.webp' WHERE name ILIKE '%Stella Stopa Assis Palma%';
UPDATE team_members SET photo = '/assets/team/thais-aparecida-dibbern.webp', photo_url = '/assets/team/thais-aparecida-dibbern.webp' WHERE name ILIKE '%Thais Aparecida Dibbern%';
UPDATE team_members SET photo = '/assets/team/thalita-dos-santos-dalbelo.webp', photo_url = '/assets/team/thalita-dos-santos-dalbelo.webp' WHERE name ILIKE '%Thalita dos Santos Dalbelo%';
UPDATE team_members SET photo = '/assets/team/valeria-maia-merzel.webp', photo_url = '/assets/team/valeria-maia-merzel.webp' WHERE name ILIKE '%Valeria Maia Merzel%';
UPDATE team_members SET photo = '/assets/team/waldyr-luiz-ribeiro-gallo.webp', photo_url = '/assets/team/waldyr-luiz-ribeiro-gallo.webp' WHERE name ILIKE '%Waldyr Luiz Ribeiro Gallo%';
UPDATE team_members SET photo = '/assets/team/angela-cruz-guirao.webp', photo_url = '/assets/team/angela-cruz-guirao.webp' WHERE name ILIKE '%Ângela Cruz Guirao%';
UPDATE team_members SET photo = '/assets/team/angela-cruz-guirao.webp', photo_url = '/assets/team/angela-cruz-guirao.webp' WHERE name ILIKE '%Angela Cruz Guirao%';

COMMIT;
