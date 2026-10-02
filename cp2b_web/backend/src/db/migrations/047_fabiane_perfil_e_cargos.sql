-- Migration 047: ficha da Fabiane Moreira Vieira e correção de cargos.
--
-- 1. FABIANE MOREIRA VIEIRA
--
-- A ficha dela veio marcada "NÃO PUBLICAR AINDA" e por isso ficou de fora da
-- migração 046. A pendência era uma inconsistência de cronologia de formação:
-- um resumo de Iniciação Científica de 2021 assinado com o mesmo nome não
-- fecha com mestrado e doutorado concluídos antes do pós-doutorado.
--
-- O texto publicado abaixo não afirma nada dessa cadeia — diz o vínculo atual,
-- a pesquisa e a spin-off, e é justamente sobre o vínculo atual que a ficha
-- registrava "Confiança: Alta" (perfil oficial da UNICAMP, e-mail
-- institucional, Lattes e NIPE, corroborados pela Inova UNICAMP). O CP2b
-- confirmou o conteúdo, então ele entra; a cronologia de formação segue fora.
--
-- A afiliação diz NIPE, não FEAGRI, por definição do próprio centro — o mesmo
-- ajuste que o commit f9eabb5 já fizera na coluna `institution`. A bio agora
-- acompanha, em vez de contradizê-la.
--
-- O cargo não muda: ela já consta como Coordenadora do Eixo 2, e o eixo tem
-- dois coordenadores (com Lucas Tadeu Fuess, EESC/USP), como nos eixos 1, 3,
-- 4 e 8.

UPDATE team_members SET
  bio_pt = 'Pós-doutoranda no Núcleo Interdisciplinar de Planejamento Energético da UNICAMP e coordenadora do Eixo 2 do CP2b. Sua pesquisa envolve fermentação, digestão anaeróbia, microbiologia industrial e produção de biogás, com ênfase no escalonamento da produção de hidrogênio e metano a partir de subprodutos do setor sucroalcooleiro. Participa da spin-off acadêmica Arrakis Bioenergia.',
  bio_en = 'Postdoctoral researcher at UNICAMP''s Interdisciplinary Centre for Energy Planning and coordinator of Axis 2 at CP2b. Her research involves fermentation, anaerobic digestion, industrial microbiology and biogas production, with an emphasis on scaling up hydrogen and methane production from by-products of the sugar and ethanol sector. She takes part in the academic spin-off Arrakis Bioenergia.',
  research_areas_pt = ARRAY[
    'Fermentação e digestão anaeróbia para produção de biogás, hidrogênio e metano',
    'Escalonamento de bioprocessos e operação de reatores biológicos',
    'Valorização de subprodutos agroindustriais e plataformas de biorrefinaria para bioenergia'
  ],
  research_areas_en = ARRAY[
    'Fermentation and anaerobic digestion for the production of biogas, hydrogen and methane',
    'Scale-up of bioprocesses and operation of biological reactors',
    'Valorisation of agro-industrial by-products and biorefinery platforms for bioenergy'
  ],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/6636509165662371'),
  institutional_url = COALESCE(institutional_url, 'https://portal.edat.unicamp.br/perfil?origem=&docente=330146')
WHERE name ILIKE '%Fabiane Moreira Vieira%';

-- 2. "ESTUDANTE SEM BOLSA" NÃO É CARGO
--
-- Duas pessoas apareciam na página com o rótulo "Estudante sem Bolsa" /
-- "Student without Scholarship". Isso descreve a situação de financiamento,
-- não o que a pessoa é nem o que faz, e expõe publicamente um dado que não
-- diz respeito a quem lê a página. O campo passa a trazer o nível acadêmico,
-- como no resto da equipe.
--
-- Denis da Silva Miranda é doutorando, confirmado pelo CP2b.
UPDATE team_members SET
  role_pt = 'Doutorando',
  role_en = 'PhD Student'
WHERE name ILIKE '%Denis da Silva Miranda%';

-- Raquel Teixeira Gomes Magri (FEEC/UNICAMP) continua com o rótulo até que o
-- nível dela seja confirmado: trocar por um palpite seria inventar a formação
-- de uma pessoa real. Assim que vier a confirmação, é um UPDATE de uma linha
-- no mesmo formato do acima.
