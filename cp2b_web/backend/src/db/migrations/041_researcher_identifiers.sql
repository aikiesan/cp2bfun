-- Migration 041: identificadores de pesquisador, biografia e vínculo.
--
-- Três coisas que /equipe não conseguia dizer:
--
--  1. Quem a pessoa é. Os cards eram becos sem saída — não havia como chegar
--     ao currículo de ninguém. As colunas de identificador abaixo vêm da
--     planilha "CP2B_Equipe_2026_identificadores_final.xlsx" (set/2026),
--     cruzada com os nomes do site por primeiro+último nome. São as mesmas
--     URLs de src/data/generated/researcherProfiles.js, o fallback estático de
--     quando a API não responde: as duas fontes mudam juntas.
--
--  2. Que vínculo a pessoa tem com o centro. "Colaboradores e Parceiros"
--     misturava pesquisadores e estudantes do próprio CP2b sem eixo atribuído
--     com pesquisadores responsáveis em instituições parceiras — colaboração
--     externa formalizada por carta de apoio à FAPESP. `membership` separa os
--     dois: 'direcao', 'nucleo' (atua em ao menos um eixo), 'associado',
--     'parceira' e 'apoio'. A página prefere esta coluna e só cai para a
--     heurística de cargo quando ela é nula.
--
--  3. Prof. Joaquim Eugênio Abel Seabra estava classificado como Apoio
--     Técnico. É professor da FEM/UNICAMP.
--
-- `bio_pt`/`bio_en` ficam vazias: as descrições de formação do ANEXO 11 não
-- estão neste repositório. São editáveis em /admin/equipe, e o modal de perfil
-- funciona sem elas — mostra cargo, instituição, eixos e os links.
--
-- Idempotente: colunas com IF NOT EXISTS e UPDATEs naturalmente reexecutáveis.

BEGIN;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS orcid VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS lattes VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS scholar VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS scopus VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS wos VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bv_fapesp VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS institutional_url VARCHAR(500);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio_pt TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio_en TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS membership VARCHAR(16);

-- 1. Prof. Seabra: professor da FEM/UNICAMP, não apoio técnico.
UPDATE team_members SET
  role_pt  = 'Pesquisador Associado',
  role_en  = 'Associate Researcher',
  category = 'associates'
WHERE name ILIKE '%Joaquim Eug%nio Abel Seabra%';

-- 2. Vínculo de cada pessoa.
-- Direção do CP2b (2).
UPDATE team_members SET membership = 'direcao' WHERE name ILIKE '%Bruna de Souza Moraes%';
UPDATE team_members SET membership = 'direcao' WHERE name ILIKE '%Renata Piacentini Rodriguez%';

-- Atuam em ao menos um eixo (51).
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Alexandre Da Silva Souza%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Amanda Pietra Santerio Cavini%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Antonio Eduardo Colins Sena%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Antonio Parice Bufalo%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Carlos Eduardo Driemeier%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Dante Chiavareto Pezzin%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Dave Ronel%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Denis da Silva Miranda%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Eder Kevin Arango Escalante%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Enelton Fagnani%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Fabiane Moreira Vieira%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Gabriel de Oliveira Rodrigues%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Henrique de Souza Dornelles%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Isabela Minucio Pontes%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Ivo Leandro Dorileo%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Jessica Cristina Franco Nogueira%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Jessica Jacinta Silva%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%José Maria Ferreira Jardim da Silveira%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Leonardo Ariel Benavidez Mamani%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Luana Mattos de Oliveira Cruz%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Lucas Boaro%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Lucas Nakamura Cerejo%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Lucas Tadeu Fuess%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Luciana Cristina Lenhari da Silva%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Luis Alberto Follegatti Romero%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Luiz Gustavo Antonio de Souza%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Luiza Arones Gaspar%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Marcelo Marques de Magalhães%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Marcelo Pereira da Cunha%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Marcelo Zaiat%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Marcus Lívio Carlin%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Maria Paula Cardeal Volpi%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Mariana Conceição da Costa%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Mauro Donizeti Berni%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Mayara Régia Sousa de Melo%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Natalia Molina Cetrulo%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Patricia Prediger%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Paulo Sergio Graziano Magalhães%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Priscila Rosseto Camiloti%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Rachel Biancalana Costa%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Rafael de Brito Dias%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Raphael Guarda Cavalcante%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Rubens Augusto Camargo Lamparelli%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Sergio Valdir Bajay%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Simone Aparecida dos Santos%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Sofia Silva%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Sonia Regina da Cal Seixas%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Stella Stopa Assis Palma%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Thais Aparecida Dibbern%';
UPDATE team_members SET membership = 'nucleo' WHERE name ILIKE '%Waldyr Luiz Ribeiro Gallo%';

-- Pesquisadores e estudantes do CP2b sem eixo atribuído (27).
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Aline Veronese da Silva%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Barbara Janet Teruel Mederos%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Caio Henrique Rufino%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Carla Kazue Nakao Cavaliero%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Daniel Francisco Nagao Menezes%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Daniel Henrique Dario Capitani%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Danúsia Arantes Ferreira%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Flávia Luciane Consoni%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Hildo Guillardi Júnior%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Joaquim Eug%nio Abel Seabra%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Joni de Almeida Amorim%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%João Guilherme Ito Cypriano%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Karla Adriana Martins Bessa%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Leandro Wang Hantao%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Lira Luz Benites Lazaro%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Luiz Carlos Pereira da Silva%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Luiz Carlos Roma Júnior%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Marcelo Antunes Nolasco%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Marcelo de Carvalho Pereira%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Patricia Jacqueline Thyssen%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Patricia Nunes da Silva Mariuzzo%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Paulo Cesar Souza Manduca%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Raquel Teixeira Gomes Magri%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Sarita Cândida Rabelo%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Solange Teles da Silva%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Thalita dos Santos Dalbelo%';
UPDATE team_members SET membership = 'associado' WHERE name ILIKE '%Valeria Maia Merzel%';

-- Pesquisadores responsáveis em instituições parceiras (14).
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Alessandro Sanches Pereira%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Anderson Targino da Silva Ferreira%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Bruno Sidnei da Silva%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Daniel de Oliveira Silva%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Gabriel Dias Mangolini Neves%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Jens Bo Holm-Nielsen%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%José Octavio Armani Paschoal%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Juliana Paula da Silva Ulian%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Leidiane Mariani%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Leonardo Vasconcelos Fregolente%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Marcelo Kenji Miki%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Paola Mercadante Petry%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Rubens Maciel Filho%';
UPDATE team_members SET membership = 'parceira' WHERE name ILIKE '%Ângela Cruz Guirao%';

-- Apoio técnico e administrativo (5).
UPDATE team_members SET membership = 'apoio' WHERE name ILIKE '%Bruno Felipe Veloso%';
UPDATE team_members SET membership = 'apoio' WHERE name ILIKE '%Magali Luzia Maróstica%';
UPDATE team_members SET membership = 'apoio' WHERE name ILIKE '%Paulo César de Almeida Pinheiro%';
UPDATE team_members SET membership = 'apoio' WHERE name ILIKE '%Raffaella Rossetto%';
UPDATE team_members SET membership = 'apoio' WHERE name ILIKE '%Rosângela Pedroz%';

-- 3. Identificadores públicos. Quem não aparece aqui não tem nenhum
--    identificador localizado, o que vale para 26 das 98 pessoas.
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/677092/alessandro-sanches-pereira/',
  institutional_url = 'https://staffportal.curtin.edu.au/staff/profile/view/alessandro-sanches-pereira-ea0046a8/'
WHERE name ILIKE '%Alessandro Sanches Pereira%';
UPDATE team_members SET
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=331133',
  orcid = 'https://orcid.org/0000-0003-4335-5963',
  scholar = 'https://scholar.google.com/citations?user=DjrSd9EAAAAJ'
WHERE name ILIKE '%Aline Veronese da Silva%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/7272812902289704',
  orcid = 'https://orcid.org/0000-0001-9615-1484',
  scholar = 'https://scholar.google.com/citations?user=T02QnW8AAAAJ'
WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/718294/anderson-targino-da-silva-ferreira/',
  institutional_url = 'https://www.ige.unicamp.br/neal/integrantes/',
  orcid = 'https://orcid.org/0000-0002-0440-6273',
  scholar = 'https://scholar.google.com/citations?user=Rvkas6UAAAAJ'
WHERE name ILIKE '%Anderson Targino da Silva Ferreira%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/9179659362790658'
WHERE name ILIKE '%Antonio Eduardo Colins Sena%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/8869/barbara-janet-teruel-mederos/',
  institutional_url = 'https://nipe.unicamp.br/profissional/barbara-janet-teruel-mederos/',
  lattes = 'http://lattes.cnpq.br/8216159372617370',
  orcid = 'https://orcid.org/0000-0002-5102-6716',
  scholar = 'https://scholar.google.com/citations?user=Crkf7EcAAAAJ'
WHERE name ILIKE '%Barbara Janet Teruel Mederos%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/32170/bruna-de-souza-moraes/',
  institutional_url = 'https://www.nipe.unicamp.br/profissional/bruna-de-souza-moraes/',
  orcid = 'https://orcid.org/0000-0003-4305-7608',
  scholar = 'https://scholar.google.com/citations?user=5mpHdngAAAAJ',
  wos = 'https://www.webofscience.com/wos/author/rid/ABC-3515-2020'
WHERE name ILIKE '%Bruna de Souza Moraes%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/687728/caio-henrique-rufino/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=321269',
  lattes = 'http://lattes.cnpq.br/8526204483675376',
  orcid = 'https://orcid.org/0000-0002-4564-5377',
  scholar = 'https://scholar.google.com/citations?user=SxmmTSEAAAAJ'
WHERE name ILIKE '%Caio Henrique Rufino%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/46452/carla-kazue-nakao-cavaliero/',
  institutional_url = 'http://www.somos.unicamp.br/professores/view/4295',
  lattes = 'http://lattes.cnpq.br/2699196515879292',
  orcid = 'https://orcid.org/0000-0002-5016-0091'
WHERE name ILIKE '%Carla Kazue Nakao Cavaliero%';
UPDATE team_members SET
  orcid = 'https://orcid.org/0000-0002-7755-3063',
  scholar = 'https://scholar.google.com/citations?user=EZtHeAoAAAAJ'
WHERE name ILIKE '%Daniel Francisco Nagao Menezes%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/685636/daniel-henrique-dario-capitani/',
  institutional_url = 'https://www2.fca.unicamp.br/profissional/daniel-henrique-dario-capitani/',
  orcid = 'https://orcid.org/0000-0002-8025-4152',
  scholar = 'https://scholar.google.com/citations?user=24X_OkwAAAAJ'
WHERE name ILIKE '%Daniel Henrique Dario Capitani%';
UPDATE team_members SET
  orcid = 'https://orcid.org/0000-0001-6738-7383'
WHERE name ILIKE '%Dante Chiavareto Pezzin%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/719976/danusia-arantes-ferreira/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=317198'
WHERE name ILIKE '%Danúsia Arantes Ferreira%';
UPDATE team_members SET
  scholar = 'https://scholar.google.com/citations?user=i2dIFRYAAAAJ'
WHERE name ILIKE '%Dave Ronel%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/6560120596598893',
  orcid = 'https://orcid.org/0000-0001-7415-0624',
  scholar = 'https://scholar.google.com/citations?user=QcG_7gcAAAAJ'
WHERE name ILIKE '%Denis da Silva Miranda%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/4765849234619347'
WHERE name ILIKE '%Eder Kevin Arango Escalante%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/681435/enelton-fagnani/',
  institutional_url = 'https://www.ft.unicamp.br/pt-br/pessoas/docentes/enelton',
  lattes = 'http://lattes.cnpq.br/2493281934291188',
  scholar = 'https://scholar.google.com/citations?user=fO-yZacAAAAJ'
WHERE name ILIKE '%Enelton Fagnani%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/692648/flavia-luciane-consoni/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=303549',
  lattes = 'http://lattes.cnpq.br/3178864999293864',
  orcid = 'https://orcid.org/0000-0002-2096-1357',
  scholar = 'https://scholar.google.com/citations?user=5qlGRSIAAAAJ'
WHERE name ILIKE '%Flávia Luciane Consoni%';
UPDATE team_members SET
  orcid = 'https://orcid.org/0000-0001-8202-269X'
WHERE name ILIKE '%Gabriel Dias Mangolini Neves%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/697810/henrique-de-souza-dornelles/',
  scholar = 'https://scholar.google.com/citations?user=2LDukRAAAAAJ'
WHERE name ILIKE '%Henrique de Souza Dornelles%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/74695/hildo-guillardi-junior/',
  institutional_url = 'https://www2.unesp.br/portaldocentes/docentes/19594',
  lattes = 'http://lattes.cnpq.br/2763526214348012',
  orcid = 'https://orcid.org/0000-0002-2029-7070',
  scholar = 'https://scholar.google.com/citations?user=J0v81u0AAAAJ'
WHERE name ILIKE '%Hildo Guillardi Júnior%';
UPDATE team_members SET
  scholar = 'https://scholar.google.com/citations?user=9Bvj0SgAAAAJ'
WHERE name ILIKE '%Isabela Minucio Pontes%';
UPDATE team_members SET
  scholar = 'https://scholar.google.com/citations?user=oSsLCoMAAAAJ'
WHERE name ILIKE '%Ivo Leandro Dorileo%';
UPDATE team_members SET
  institutional_url = 'https://vbn.aau.dk/en/persons/jhn/',
  orcid = 'https://orcid.org/0000-0002-0797-9691'
WHERE name ILIKE '%Jens Bo Holm-Nielsen%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/1265221206960284'
WHERE name ILIKE '%Jessica Cristina Franco Nogueira%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/105790/joaquim-eugenio-abel-seabra/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=297843'
WHERE name ILIKE '%Joaquim Eug%nio Abel Seabra%';
UPDATE team_members SET
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=327841',
  lattes = 'http://lattes.cnpq.br/3278489088705449',
  orcid = 'https://orcid.org/0000-0002-9837-9519',
  scholar = 'https://scholar.google.com/citations?user=KTndlCAAAAAJ'
WHERE name ILIKE '%Joni de Almeida Amorim%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/992/jose-maria-ferreira-jardim-da-silveira/',
  institutional_url = 'https://nipe.unicamp.br/profissional/jose-maria-ferreira-jardim-da-silveira/',
  lattes = 'http://lattes.cnpq.br/4984859173592703',
  orcid = 'https://orcid.org/0000-0003-3680-875X',
  scholar = 'https://scholar.google.com/citations?user=iJUYLdkAAAAJ'
WHERE name ILIKE '%José Maria Ferreira Jardim da Silveira%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/733770/joao-guilherme-ito-cypriano/',
  orcid = 'https://orcid.org/0000-0001-5318-2272',
  scholar = 'https://scholar.google.com/citations?user=FzEJTvEAAAAJ'
WHERE name ILIKE '%João Guilherme Ito Cypriano%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/87513/karla-adriana-martins-bessa/',
  institutional_url = 'https://www.ifch.unicamp.br/pessoas/karla-adriana-martins-bessa',
  orcid = 'https://orcid.org/0000-0002-5867-5372',
  scholar = 'https://scholar.google.com/citations?user=I2FUe2sAAAAJ'
WHERE name ILIKE '%Karla Adriana Martins Bessa%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/102845/leandro-wang-hantao/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=312196'
WHERE name ILIKE '%Leandro Wang Hantao%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/693300/leonardo-vasconcelos-fregolente/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=311496'
WHERE name ILIKE '%Leonardo Vasconcelos Fregolente%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/700064/lira-luz-benites-lazaro/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=327409',
  lattes = 'http://lattes.cnpq.br/4648134943131346',
  orcid = 'https://orcid.org/0000-0001-6587-1497',
  scholar = 'https://scholar.google.com/citations?user=EWlxI-YAAAAJ'
WHERE name ILIKE '%Lira Luz Benites Lazaro%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/693297/luana-mattos-de-oliveira-cruz/',
  lattes = 'http://lattes.cnpq.br/8177360178972866',
  orcid = 'https://orcid.org/0000-0003-3795-9111'
WHERE name ILIKE '%Luana Mattos de Oliveira Cruz%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/5624524360987171'
WHERE name ILIKE '%Lucas Boaro%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/741698/lucas-nakamura-cerejo/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?origem=&docente=330455',
  lattes = 'http://lattes.cnpq.br/9131453561416650',
  orcid = 'https://orcid.org/0000-0002-9292-2752',
  scholar = 'https://scholar.google.com/citations?user=AhFVjwkAAAAJ'
WHERE name ILIKE '%Lucas Nakamura Cerejo%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/82238/lucas-tadeu-fuess/',
  institutional_url = 'https://nipe.unicamp.br/profissional/lucas-tadeu-fuess/',
  lattes = 'http://lattes.cnpq.br/2310904305639447',
  orcid = 'https://orcid.org/0000-0001-8520-1124',
  scholar = 'https://scholar.google.com/citations?user=ty_F2JYAAAAJ',
  wos = 'https://www.webofscience.com/wos/author/rid/L-1500-2015'
WHERE name ILIKE '%Lucas Tadeu Fuess%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/176272/luis-alberto-follegatti-romero/',
  institutional_url = 'https://sites.usp.br/peq_epusp/orientadores/',
  orcid = 'https://orcid.org/0000-0002-5596-833X',
  scholar = 'https://scholar.google.com/citations?user=CyTTGMgAAAAJ'
WHERE name ILIKE '%Luis Alberto Follegatti Romero%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/57198/luiz-carlos-pereira-da-silva/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=283630',
  orcid = 'https://orcid.org/0000-0002-0651-7292',
  scholar = 'https://scholar.google.com/citations?user=38eIBxsAAAAJ'
WHERE name ILIKE '%Luiz Carlos Pereira da Silva%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/10019/luiz-carlos-roma-junior/',
  orcid = 'https://orcid.org/0000-0002-0019-2538',
  scholar = 'https://scholar.google.com/citations?user=yAk8IFEAAAAJ'
WHERE name ILIKE '%Luiz Carlos Roma Júnior%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/669969/luiz-gustavo-antonio-de-souza/',
  institutional_url = 'https://www.nipe.unicamp.br/profissional/luiz-gustavo-antonio-de-souza/',
  orcid = 'https://orcid.org/0000-0002-6937-8576',
  scholar = 'https://scholar.google.com/citations?user=5I16lAcAAAAJ'
WHERE name ILIKE '%Luiz Gustavo Antonio de Souza%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/0876530986125053'
WHERE name ILIKE '%Luiza Arones Gaspar%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/34599/marcelo-antunes-nolasco/',
  orcid = 'https://orcid.org/0000-0002-1408-2954',
  scholar = 'https://scholar.google.com/citations?user=gl1pcFsAAAAJ'
WHERE name ILIKE '%Marcelo Antunes Nolasco%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/673021/marcelo-marques-de-magalhaes/',
  institutional_url = 'https://unesp.br/portaldocentes/docentes/29396',
  lattes = 'http://lattes.cnpq.br/4117906942336504',
  orcid = 'https://orcid.org/0000-0001-6334-5493',
  scholar = 'https://scholar.google.com/citations?user=n3jbke0AAAAJ'
WHERE name ILIKE '%Marcelo Marques de Magalhães%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/685638/marcelo-pereira-da-cunha/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=302214',
  orcid = 'https://orcid.org/0000-0002-1027-1694',
  scholar = 'https://scholar.google.com/citations?user=AYNGYrgAAAAJ'
WHERE name ILIKE '%Marcelo Pereira da Cunha%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/3234/marcelo-zaiat/',
  institutional_url = 'https://shs.eesc.usp.br/administracao/docente/?d=marcelo-zaiat',
  lattes = 'http://lattes.cnpq.br/7593950695805418',
  orcid = 'https://orcid.org/0000-0001-7336-9093',
  scholar = 'https://scholar.google.com/citations?user=zgYWu00AAAAJ'
WHERE name ILIKE '%Marcelo Zaiat%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/680204/marcelo-de-carvalho-pereira/',
  orcid = 'https://orcid.org/0000-0002-8069-2734',
  scholar = 'https://scholar.google.com/citations?user=9P41WkAAAAAJ'
WHERE name ILIKE '%Marcelo de Carvalho Pereira%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/0948460064235731'
WHERE name ILIKE '%Marcus Lívio Carlin%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/33191/mariana-conceicao-da-costa/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=300237',
  orcid = 'https://orcid.org/0000-0003-1710-7202',
  scholar = 'https://scholar.google.com/citations?user=_3vvHqwAAAAJ'
WHERE name ILIKE '%Mariana Conceição da Costa%';
UPDATE team_members SET
  institutional_url = 'https://www.nipe.unicamp.br/profissional/mauro-donizeti-berni/',
  lattes = 'http://lattes.cnpq.br/1602054738205274',
  orcid = 'https://orcid.org/0000-0002-0027-2458',
  scholar = 'https://scholar.google.com/citations?user=vLFuoVEAAAAJ'
WHERE name ILIKE '%Mauro Donizeti Berni%';
UPDATE team_members SET
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=324557'
WHERE name ILIKE '%Natalia Molina Cetrulo%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/41576/patricia-jacqueline-thyssen/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=306923',
  orcid = 'https://orcid.org/0000-0001-7343-2419',
  scholar = 'https://scholar.google.com/citations?user=yg9SakMAAAAJ'
WHERE name ILIKE '%Patricia Jacqueline Thyssen%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/97114/patricia-nunes-da-silva-mariuzzo/'
WHERE name ILIKE '%Patricia Nunes da Silva Mariuzzo%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/66219/patricia-prediger/',
  institutional_url = 'https://www.ft.unicamp.br/pt-br/pessoas/docentes/patriciap',
  scholar = 'https://scholar.google.com/citations?user=TSSr5c0AAAAJ'
WHERE name ILIKE '%Patricia Prediger%';
UPDATE team_members SET
  institutional_url = 'https://www.nipe.unicamp.br/profissional/paulo-cesar-manduca/',
  scholar = 'https://scholar.google.com/citations?user=HZLN6rIAAAAJ'
WHERE name ILIKE '%Paulo Cesar Souza Manduca%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/3321/paulo-sergio-graziano-magalhaes/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=318552',
  lattes = 'http://lattes.cnpq.br/1198843146263387',
  orcid = 'https://orcid.org/0000-0002-5374-3591',
  scholar = 'https://scholar.google.com/citations?user=dQJj6oEAAAAJ'
WHERE name ILIKE '%Paulo Sergio Graziano Magalhães%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/170330/priscila-rosseto-camiloti/',
  institutional_url = 'https://www.iee.usp.br/priscila-camiloti/',
  lattes = 'http://lattes.cnpq.br/8086315340339526',
  orcid = 'https://orcid.org/0000-0001-6642-0399',
  scholar = 'https://scholar.google.com/citations?user=UpVuOxAAAAAJ'
WHERE name ILIKE '%Priscila Rosseto Camiloti%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/74680/rachel-biancalana-costa/',
  scholar = 'https://scholar.google.com/citations?user=skVJWxgAAAAJ'
WHERE name ILIKE '%Rachel Biancalana Costa%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/177742/rafael-de-brito-dias/',
  institutional_url = 'https://www2.fca.unicamp.br/pessoas/docentes/',
  lattes = 'http://lattes.cnpq.br/6070019241046907',
  orcid = 'https://orcid.org/0000-0002-9702-2323',
  scholar = 'https://scholar.google.com/citations?user=zOeU8_4AAAAJ'
WHERE name ILIKE '%Rafael de Brito Dias%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/34647/raffaella-rossetto/',
  institutional_url = 'https://www.iac.sp.gov.br/scriptlattes/2023/membro-5276354621668931.html',
  lattes = 'http://lattes.cnpq.br/5276354621668931',
  orcid = 'https://orcid.org/0000-0003-1238-2213'
WHERE name ILIKE '%Raffaella Rossetto%';
UPDATE team_members SET
  institutional_url = 'https://sistemas.unifal-mg.edu.br/app/rh/gestaopessoas/paginas/unidadesdirigentes.php?unidade_id=124957',
  lattes = 'http://lattes.cnpq.br/3494982072959140',
  orcid = 'https://orcid.org/0000-0002-2837-3437',
  scholar = 'https://scholar.google.com/citations?user=5jTq2CUAAAAJ'
WHERE name ILIKE '%Renata Piacentini Rodriguez%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/33856/rubens-augusto-camargo-lamparelli/',
  institutional_url = 'https://www.nipe.unicamp.br/profissional/rubens-augusto-lamparelli/',
  lattes = 'http://lattes.cnpq.br/5130566170893828',
  orcid = 'https://orcid.org/0000-0003-4344-1263',
  scholar = 'https://scholar.google.com/citations?user=9EQkMZoAAAAJ',
  scopus = 'https://www.scopus.com/authid/detail.uri?authorId=6602713722'
WHERE name ILIKE '%Rubens Augusto Camargo Lamparelli%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/363/rubens-maciel-filho/',
  institutional_url = 'https://www.feq.unicamp.br/funcionario/rubens-maciel-filho/',
  orcid = 'https://orcid.org/0000-0001-6511-7283',
  scholar = 'https://scholar.google.com/citations?user=e15Za9wAAAAJ'
WHERE name ILIKE '%Rubens Maciel Filho%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/72820/sarita-candida-rabelo/',
  institutional_url = 'https://www.unesp.br/portaldocentes/docentes/319970?lang=pt_BR',
  lattes = 'http://lattes.cnpq.br/9184386547741809',
  orcid = 'https://orcid.org/0000-0002-3153-7674',
  scholar = 'https://scholar.google.com/citations?user=bKX4NIwAAAAJ'
WHERE name ILIKE '%Sarita Cândida Rabelo%';
UPDATE team_members SET
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=297738',
  orcid = 'https://orcid.org/0000-0003-4806-7872'
WHERE name ILIKE '%Sergio Valdir Bajay%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/91706/solange-teles-da-silva/',
  orcid = 'https://orcid.org/0000-0001-9770-9734'
WHERE name ILIKE '%Solange Teles da Silva%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/33854/sonia-regina-da-cal-seixas/',
  institutional_url = 'https://nipe.unicamp.br/profissional/sonia-regina-da-cal-seixas/',
  lattes = 'http://lattes.cnpq.br/4762940910820774',
  orcid = 'https://orcid.org/0000-0002-5117-7194'
WHERE name ILIKE '%Sonia Regina da Cal Seixas%';
UPDATE team_members SET
  lattes = 'http://lattes.cnpq.br/4566576044661389',
  orcid = 'https://orcid.org/0000-0001-8821-2048',
  scholar = 'https://scholar.google.com/citations?user=DiMHciYAAAAJ'
WHERE name ILIKE '%Stella Stopa Assis Palma%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/726686/thais-aparecida-dibbern/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=323867'
WHERE name ILIKE '%Thais Aparecida Dibbern%';
UPDATE team_members SET
  orcid = 'https://orcid.org/0000-0002-0835-0502',
  scholar = 'https://scholar.google.com/citations?user=hr4gr5QAAAAJ'
WHERE name ILIKE '%Thalita dos Santos Dalbelo%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/68088/valeria-maia-merzel/',
  institutional_url = 'https://site.cpqba.unicamp.br/en/valeriamaia/',
  lattes = 'http://lattes.cnpq.br/3886687872358496',
  orcid = 'https://orcid.org/0000-0001-8817-4758'
WHERE name ILIKE '%Valeria Maia Merzel%';
UPDATE team_members SET
  bv_fapesp = 'https://bv.fapesp.br/pt/pesquisador/87261/waldyr-luiz-ribeiro-gallo/',
  institutional_url = 'https://portal.dados.unicamp.br/perfil?docente=60917',
  scholar = 'https://scholar.google.com/citations?user=FK4RMkkAAAAJ'
WHERE name ILIKE '%Waldyr Luiz Ribeiro Gallo%';

COMMIT;
