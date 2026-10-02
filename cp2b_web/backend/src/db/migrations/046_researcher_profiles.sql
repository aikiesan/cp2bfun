-- Migration 046: biografias e áreas de atuação dos pesquisadores.
--
-- A migração 041 trouxe os identificadores (Lattes, ORCID, Scholar) e deixou
-- bio_pt/bio_en vazias de propósito: o texto não estava neste repositório.
-- Ele chegou agora, nas "Fichas de referência da equipe" (set/2026), e é o que
-- preenche o modal de perfil aberto ao clicar numa pessoa em /equipe.
--
-- São 15 das 18 fichas. As outras três — Antonio Eduardo Colins Sena, Fabiane
-- Moreira Vieira e Leonardo Ariel Benavidez Mamani — foram retidas na origem
-- por dados insuficientes ou inconsistência a resolver, e ficam de fora até
-- que sejam completadas. Publicar meia ficha sobre uma pessoa real é pior do
-- que não publicar nenhuma.
--
-- `research_areas_pt/en` são arrays e não texto corrido para que as três áreas
-- de cada pesquisador possam ser listadas, filtradas e editadas uma a uma no
-- admin — o pedido era um banco de perfis, não um parágrafo.
--
-- As seções "Confiança" e "Pendências" das fichas são de uso interno e não
-- entram aqui.
--
-- Os identificadores usam COALESCE: a ficha só preenche o que estiver vazio e
-- nunca sobrescreve o que a planilha da 041 já trouxe.

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS research_areas_pt TEXT[];
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS research_areas_en TEXT[];

-- Correções de cadastro confirmadas pelo CP2b junto com as fichas.
-- Simone constava como doutoranda; é mestranda (PPG Planejamento de Sistemas
-- Energéticos, UNICAMP). Amanda constava como mestre; concluiu o mestrado e
-- hoje é doutoranda no PPGCA/UNIFAL-MG.
UPDATE team_members SET role_pt = 'Mestranda', role_en = 'Master''s Student'
WHERE name ILIKE '%Simone Aparecida dos Santos%';

UPDATE team_members SET role_pt = 'Doutoranda', role_en = 'PhD Student'
WHERE name ILIKE '%Amanda Pietra Santerio Cavini%';

-- Alexandre da Silva Souza
UPDATE team_members SET
  bio_pt            = 'Doutorando do Programa de Pós-Graduação em Ciências Ambientais da UNIFAL-MG. Concluiu o mestrado em Ciência e Engenharia Ambiental pela mesma universidade, com dissertação sobre desenvolvimento de inóculo para o tratamento integrado de resíduos da indústria sucroalcooleira e da pecuária visando à produção de biogás. Sua pesquisa mantém foco em digestão anaeróbia, adaptação de inóculos e recuperação energética de resíduos agroindustriais. É autor correspondente de artigo publicado na Engenharia Sanitária e Ambiental sobre potencial bioquímico de metano de vinhaça e dejetos bovinos em estratégias de codigestão.',
  bio_en            = 'PhD candidate in the Graduate Programme in Environmental Sciences at UNIFAL-MG. He completed a master''s degree in Environmental Science and Engineering at the same university, with a dissertation on developing an inoculum for the integrated treatment of sugarcane-industry and livestock waste for biogas production. His research remains focused on anaerobic digestion, inoculum adaptation and energy recovery from agro-industrial waste. He is the corresponding author of a paper in Engenharia Sanitária e Ambiental on the biochemical methane potential of vinasse and cattle manure in co-digestion strategies.',
  research_areas_pt = ARRAY['Digestão anaeróbia e codigestão de vinhaça, dejetos bovinos e resíduos agroindustriais', 'Desenvolvimento e adaptação de inóculos para produção de biogás e metano', 'Recuperação energética de resíduos sucroalcooleiros e pecuários, com avaliação do potencial bioquímico de metano'],
  research_areas_en = ARRAY['Anaerobic digestion and co-digestion of vinasse, cattle manure and agro-industrial waste', 'Development and adaptation of inocula for biogas and methane production', 'Energy recovery from sugar-industry and livestock waste, with assessment of biochemical methane potential'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/1554178998903627'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0009-0003-7532-0236'),
  institutional_url = COALESCE(institutional_url, 'https://www.unifal-mg.edu.br/ppgca/discentes-doutorado/')
WHERE name ILIKE '%Alexandre da Silva Souza%';

-- Eder Kevin Arango Escalante
UPDATE team_members SET
  bio_pt            = 'Mestrando do Programa de Pós-Graduação em Tecnologia da Faculdade de Tecnologia da UNICAMP, em Limeira. Em maio de 2026 realizou o exame de qualificação de mestrado com pesquisa sobre concepção, caracterização e aplicação de um fotorreator LED UVC para degradação de compostos orgânicos por processos oxidativos avançados. O trabalho se relaciona ao tratamento avançado de efluentes e a tecnologias fotoquímicas de remediação ambiental.',
  bio_en            = 'Master''s candidate in the Graduate Programme in Technology at UNICAMP''s School of Technology in Limeira. In May 2026 he sat his master''s qualifying examination with research on the design, characterisation and application of a UVC LED photoreactor for degrading organic compounds through advanced oxidation processes. The work relates to advanced effluent treatment and photochemical environmental remediation technologies.',
  research_areas_pt = ARRAY['Processos oxidativos avançados para degradação de compostos orgânicos', 'Fotorreatores LED UVC aplicados ao tratamento de efluentes', 'Tecnologias de remediação ambiental e controle de contaminantes em sistemas aquáticos'],
  research_areas_en = ARRAY['Advanced oxidation processes for the degradation of organic compounds', 'UVC LED photoreactors applied to effluent treatment', 'Environmental remediation technologies and contaminant control in aquatic systems'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/4765849234619347')
WHERE name ILIKE '%Eder Kevin Arango Escalante%';

-- Jessica Cristina Franco Nogueira
UPDATE team_members SET
  bio_pt            = 'Engenheira ambiental, concluiu o mestrado em Ciências Ambientais pela Universidade Federal de Alfenas com bolsa CAPES (março de 2024 a fevereiro de 2026). Sua dissertação, defendida em 2026 sob orientação de Renata Piacentini Rodriguez, vice-diretora do CP2B, avaliou a co-digestão anaeróbia de vinhaça, torta de filtro, dejetos bovinos e resíduos de curtume em reator CSTR, visando à produção de biogás e biofertilizantes. Registros públicos recentes a identificam como doutoranda no Programa de Pós-Graduação em Planejamento de Sistemas Energéticos da UNICAMP.',
  bio_en            = 'Environmental engineer who completed a master''s degree in Environmental Sciences at the Federal University of Alfenas with a CAPES scholarship (March 2024 to February 2026). Her dissertation, defended in 2026 under the supervision of Renata Piacentini Rodriguez, deputy director of CP2b, assessed the anaerobic co-digestion of vinasse, filter cake, cattle manure and tannery waste in a CSTR reactor for the production of biogas and biofertilisers. Recent public records identify her as a doctoral candidate in the Graduate Programme in Energy Systems Planning at UNICAMP.',
  research_areas_pt = ARRAY['Digestão anaeróbia e co-digestão de resíduos agroindustriais e pecuários', 'Produção e recuperação energética de biogás em reatores CSTR', 'Aproveitamento do digestato para biofertilizantes e integração entre as cadeias sucroenergética e pecuária'],
  research_areas_en = ARRAY['Anaerobic digestion and co-digestion of agro-industrial and livestock waste', 'Biogas production and energy recovery in CSTR reactors', 'Use of digestate for biofertilisers and integration between the sugar-energy and livestock chains'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/1265221206960284')
WHERE name ILIKE '%Jessica Cristina Franco Nogueira%';

-- Luiza Arones Gaspar
UPDATE team_members SET
  bio_pt            = 'Graduanda da Universidade Federal de Alfenas, integra equipe de pesquisa voltada ao aproveitamento energético de resíduos da cadeia sucroenergética e da pecuária. Participou de estudo sobre o potencial bioquímico de metano da co-digestão de palha, bagaço, vinhaça e torta de filtro com dejetos bovinos, apresentado no XV Workshop e Simpósio Latino-Americano de Digestão Anaeróbia. A pesquisa emprega ensaios de Potencial Bioquímico de Metano (BMP), caracterização físico-química, modelagem cinética e avaliação da estabilidade do processo anaeróbio.',
  bio_en            = 'Undergraduate student at the Federal University of Alfenas, working in a research team dedicated to the energy recovery of waste from the sugar-energy and livestock chains. She took part in a study on the biochemical methane potential of the co-digestion of straw, bagasse, vinasse and filter cake with cattle manure, presented at the 15th Latin American Workshop and Symposium on Anaerobic Digestion. The research uses Biochemical Methane Potential (BMP) assays, physicochemical characterisation, kinetic modelling and assessment of anaerobic process stability.',
  research_areas_pt = ARRAY['Potencial bioquímico de metano (BMP) e digestão anaeróbia de resíduos agroindustriais', 'Co-digestão de resíduos sucroenergéticos e dejetos bovinos para produção de biogás', 'Caracterização físico-química, modelagem cinética e avaliação da estabilidade de processos anaeróbios'],
  research_areas_en = ARRAY['Biochemical methane potential (BMP) and anaerobic digestion of agro-industrial waste', 'Co-digestion of sugar-energy waste and cattle manure for biogas production', 'Physicochemical characterisation, kinetic modelling and stability assessment of anaerobic processes'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/0876530986125053')
WHERE name ILIKE '%Luiza Arones Gaspar%';

-- Simone Aparecida dos Santos
UPDATE team_members SET
  bio_pt            = 'Graduada no Bacharelado Interdisciplinar em Ciência e Tecnologia pela Universidade Federal de Alfenas (2016–2022) e cursa a segunda graduação, em Engenharia Ambiental e Urbana, na mesma instituição desde 2022. Desde 2025 é mestranda no Programa de Pós-Graduação em Planejamento de Sistemas Energéticos da UNICAMP, com bolsa CAPES, sob orientação de Bruna de Souza Moraes, diretora do CP2B. Sua dissertação em andamento intitula-se “Efeito das Condições Operacionais na Otimização do Biogás em Reator de Escala de Bancada”. Nome em citações bibliográficas: SANTOS, S. A.',
  bio_en            = 'Holds an interdisciplinary bachelor''s degree in Science and Technology from the Federal University of Alfenas (2016-2022) and has been taking a second degree, in Environmental and Urban Engineering, at the same institution since 2022. Since 2025 she has been a master''s candidate in the Graduate Programme in Energy Systems Planning at UNICAMP, with a CAPES scholarship, supervised by Bruna de Souza Moraes, director of CP2b. Her dissertation in progress is titled "The effect of operating conditions on biogas optimisation in a bench-scale reactor".',
  research_areas_pt = ARRAY['Otimização da produção de biogás e efeito de condições operacionais em reatores de escala de bancada', 'Digestão anaeróbia e tratamento de resíduos líquidos agroindustriais', 'Planejamento de sistemas energéticos e conversão energética de resíduos sucroenergéticos'],
  research_areas_en = ARRAY['Optimisation of biogas production and the effect of operating conditions in bench-scale reactors', 'Anaerobic digestion and treatment of agro-industrial liquid waste', 'Energy systems planning and energy conversion of sugar-energy waste'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/7037447328623857')
WHERE name ILIKE '%Simone Aparecida dos Santos%';

-- Amanda Pietra Santerio Cavini
UPDATE team_members SET
  bio_pt            = 'Concluiu o mestrado no Programa de Pós-Graduação em Engenharia Química da UNIFAL-MG, com título homologado em dezembro de 2024. Sua dissertação intitula-se “Avaliação de diferentes fontes de carbono e nitrogênio na produção de frutosiltransferase por Aspergillus oryzae IPT-301”, situada na área de bioprocessos e produção de enzimas por cultivo microbiano. É doutoranda no Programa de Pós-Graduação em Ciências Ambientais da UNIFAL-MG.',
  bio_en            = 'Completed a master''s degree in the Graduate Programme in Chemical Engineering at UNIFAL-MG, ratified in December 2024. Her dissertation, "Assessment of different carbon and nitrogen sources in the production of fructosyltransferase by Aspergillus oryzae IPT-301", sits in the field of bioprocesses and enzyme production through microbial cultivation. She is a doctoral candidate in the Graduate Programme in Environmental Sciences at UNIFAL-MG.',
  research_areas_pt = ARRAY['Produção de frutosiltransferase por cultivo de Aspergillus oryzae', 'Otimização de fontes de carbono e nitrogênio em bioprocessos', 'Biotecnologia industrial e produção microbiana de enzimas'],
  research_areas_en = ARRAY['Production of fructosyltransferase through Aspergillus oryzae cultivation', 'Optimisation of carbon and nitrogen sources in bioprocesses', 'Industrial biotechnology and microbial enzyme production'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/0694951253818238'),
  institutional_url = COALESCE(institutional_url, 'https://www.unifal-mg.edu.br/ppgeq/')
WHERE name ILIKE '%Amanda Pietra Santerio Cavini%';

-- Enelton Fagnani
UPDATE team_members SET
  bio_pt            = 'Bacharel em Química pelo Instituto de Química da UNESP, mestre em Química com concentração em Química Analítica pela mesma instituição e doutor em Engenharia Civil, área de Saneamento e Ambiente, pela UNICAMP. Realizou pós-doutorado no Instituto de Diagnóstico Ambiental y Estudios del Agua (IDAEA/CSIC), em Barcelona. É Professor Associado I da Faculdade de Tecnologia da UNICAMP e atua em Química Sanitária e Ambiental, processos oxidativos e redutivos avançados, tratamento de efluentes e detecção de contaminantes emergentes. No CP2B, é coordenador adjunto do Eixo 3.',
  bio_en            = 'Holds a bachelor''s degree in Chemistry from the UNESP Institute of Chemistry, a master''s in Chemistry with a concentration in Analytical Chemistry from the same institution, and a doctorate in Civil Engineering, in the field of Sanitation and Environment, from UNICAMP. He carried out postdoctoral research at the Institute of Environmental Assessment and Water Research (IDAEA/CSIC) in Barcelona. He is Associate Professor I at UNICAMP''s School of Technology and works in sanitary and environmental chemistry, advanced oxidation and reduction processes, effluent treatment and the detection of emerging contaminants. At CP2b he is deputy coordinator of Axis 3.',
  research_areas_pt = ARRAY['Processos oxidativos e redutivos avançados aplicados ao tratamento de águas residuárias e à degradação de contaminantes', 'Química analítica ambiental, análise de metais-traço e detecção de contaminantes emergentes e produtos de transformação', 'Tecnologias sanitárias e ambientais, gerenciamento de resíduos institucionais e avaliação da poluição em águas e sedimentos'],
  research_areas_en = ARRAY['Advanced oxidation and reduction processes applied to wastewater treatment and contaminant degradation', 'Environmental analytical chemistry, trace-metal analysis and detection of emerging contaminants and transformation products', 'Sanitary and environmental technologies, institutional waste management and pollution assessment in water and sediments'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/2493281934291188'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-2409-5070'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=fO-yZacAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/681435/enelton-fagnani/'),
  institutional_url = COALESCE(institutional_url, 'https://www.ft.unicamp.br/pt-br/pessoas/docentes/enelton')
WHERE name ILIKE '%Enelton Fagnani%';

-- Gabriel de Oliveira Rodrigues
UPDATE team_members SET
  bio_pt            = 'Bacharel em Engenharia Química pela Universidade do Estado do Amazonas e mestre em Engenharia Química pela Escola Politécnica da USP, com dissertação sobre rota hidrometalúrgica para obtenção de concentrado de zircônio e háfnio. É doutorando em Engenharia Química na USP e pesquisador visitante convidado do NIPE/UNICAMP, com pesquisa desenvolvida no Centro Paulista de Estudos em Biogás e Bioprodutos. Sua atuação atual envolve a produção de biochar a partir de resíduos de cervejaria e outros resíduos agroindustriais, com modificação por líquidos iônicos e aplicação na purificação de biogás para remoção de CO₂ e H₂S.',
  bio_en            = 'Holds a bachelor''s degree in Chemical Engineering from the State University of Amazonas and a master''s in Chemical Engineering from the Polytechnic School of USP, with a dissertation on a hydrometallurgical route for obtaining zirconium and hafnium concentrate. He is a doctoral candidate in Chemical Engineering at USP and an invited visiting researcher at NIPE/UNICAMP, carrying out research at the São Paulo Centre for Biogas and Bioproducts Studies. His current work involves producing biochar from brewery and other agro-industrial waste, modified with ionic liquids and applied to biogas purification for the removal of CO2 and H2S.',
  research_areas_pt = ARRAY['Purificação de biogás por adsorção e remoção de dióxido de carbono e sulfeto de hidrogênio', 'Produção e modificação de biochar a partir de resíduos de cervejaria e resíduos agroindustriais', 'Valorização de resíduos, pirólise e processos térmicos'],
  research_areas_en = ARRAY['Biogas purification by adsorption and removal of carbon dioxide and hydrogen sulphide', 'Production and modification of biochar from brewery and agro-industrial waste', 'Waste valorisation, pyrolysis and thermal processes'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/7160395707834660'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0009-0003-3564-9854'),
  institutional_url = COALESCE(institutional_url, 'https://portal.edat.unicamp.br/perfil?origem=&docente=333632&sigla_unidade=NIPE')
WHERE name ILIKE '%Gabriel de Oliveira Rodrigues%';

-- Henrique de Souza Dornelles
UPDATE team_members SET
  bio_pt            = 'Engenheiro sanitarista e ambiental pela Universidade Federal de Santa Maria, mestre e doutor em Engenharia Hidráulica e Saneamento pela Universidade de São Paulo, com período de doutorado-sanduíche no Imperial College London. Desenvolve estágio de pós-doutorado no Centro Pluridisciplinar de Pesquisas Químicas, Biológicas e Agrícolas da UNICAMP, com pesquisa na interface entre engenharia e microbiologia: digestão anaeróbia, produção de biogás, ecologia microbiana e ferramentas meta-ômicas aplicadas a reatores anaeróbios.',
  bio_en            = 'Sanitary and environmental engineer from the Federal University of Santa Maria, with a master''s and a doctorate in Hydraulic Engineering and Sanitation from the University of São Paulo, including a sandwich doctorate period at Imperial College London. He is a postdoctoral researcher at UNICAMP''s Multidisciplinary Centre for Chemical, Biological and Agricultural Research, working at the interface between engineering and microbiology: anaerobic digestion, biogas production, microbial ecology and meta-omics tools applied to anaerobic reactors.',
  research_areas_pt = ARRAY['Digestão anaeróbia e produção de biogás em reatores biológicos', 'Ecologia microbiana, sintrofismo e caracterização meta-ômica de comunidades anaeróbias', 'Tratamento de águas residuárias e biodegradação de surfactantes e poluentes emergentes'],
  research_areas_en = ARRAY['Anaerobic digestion and biogas production in biological reactors', 'Microbial ecology, syntrophy and meta-omic characterisation of anaerobic communities', 'Wastewater treatment and biodegradation of surfactants and emerging pollutants'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/0946727619950849'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-3840-7730'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=2LDukRAAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/697810/henrique-de-souza-dornelles/'),
  institutional_url = COALESCE(institutional_url, 'https://portal.dados.unicamp.br/perfil?origem=&docente=331167&sigla_unidade=CPQBA')
WHERE name ILIKE '%Henrique de Souza Dornelles%';

-- Patrícia Prediger
UPDATE team_members SET
  bio_pt            = 'Graduada em Química Industrial e mestre em Química Orgânica pela Universidade Federal de Santa Maria. Doutora em Química pela UNICAMP, com doutorado-sanduíche na Université de Toulouse III — Paul Sabatier, e pós-doutorado em Química Orgânica no Instituto de Química da UNICAMP. É Professora Associada I da Faculdade de Tecnologia da UNICAMP. Sua pesquisa concentra-se em química ambiental, síntese e caracterização de nanomateriais, adsorção, processos oxidativos e tratamento de águas e efluentes.',
  bio_en            = 'Holds a degree in Industrial Chemistry and a master''s in Organic Chemistry from the Federal University of Santa Maria. She holds a doctorate in Chemistry from UNICAMP, with a sandwich doctorate at Université de Toulouse III - Paul Sabatier, and postdoctoral research in Organic Chemistry at UNICAMP''s Institute of Chemistry. She is Associate Professor I at UNICAMP''s School of Technology. Her research focuses on environmental chemistry, the synthesis and characterisation of nanomaterials, adsorption, oxidation processes and the treatment of water and effluents.',
  research_areas_pt = ARRAY['Síntese de nanomateriais e compósitos à base de grafeno, quitosana, nanocelulose e carbonos mesoporosos', 'Adsorção, ozonização catalítica e remoção de contaminantes emergentes, corantes, fármacos e metais de águas residuárias', 'Química ambiental, toxicidade de efluentes e processos de tratamento e purificação de águas'],
  research_areas_en = ARRAY['Synthesis of nanomaterials and composites based on graphene, chitosan, nanocellulose and mesoporous carbons', 'Adsorption, catalytic ozonation and removal of emerging contaminants, dyes, pharmaceuticals and metals from wastewater', 'Environmental chemistry, effluent toxicity and water treatment and purification processes'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/3069249114434330'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-0094-6870'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=TSSr5c0AAAAJ'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=13408242300'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/66219/patricia-prediger/'),
  institutional_url = COALESCE(institutional_url, 'https://portal.edat.unicamp.br/perfil?origem=&docente=306309')
WHERE name ILIKE '%Patr%cia Prediger%';

-- Isabela Minucio Pontes
UPDATE team_members SET
  bio_pt            = 'Graduada em Arquitetura e Urbanismo pela Pontifícia Universidade Católica de Campinas, com mestrado em Urbanismo pela mesma instituição. É doutoranda no Núcleo Interdisciplinar de Planejamento Energético da UNICAMP, com pesquisa vinculada a arranjos de plataforma tecnológica e planejamento integrado de recursos (PIR) em biorrefinarias. Sua atuação articula planejamento urbano, sustentabilidade, bioenergia, bioprodutos e avaliação ambiental e econômica de sistemas baseados em resíduos.',
  bio_en            = 'Holds a degree in Architecture and Urbanism from the Pontifical Catholic University of Campinas, with a master''s in Urbanism from the same institution. She is a doctoral candidate at UNICAMP''s Interdisciplinary Centre for Energy Planning, with research linked to technology platform arrangements and integrated resource planning (IRP) in biorefineries. Her work connects urban planning, sustainability, bioenergy, bioproducts and the environmental and economic assessment of waste-based systems.',
  research_areas_pt = ARRAY['Avaliação ambiental e econômica de biorrefinarias e sistemas de bioenergia', 'Planejamento integrado de recursos (PIR) aplicado à produção de bioprodutos e bioenergia a partir de resíduos sólidos e líquidos', 'Planejamento urbano sustentável, desenho urbano sensível à água e infraestrutura urbana'],
  research_areas_en = ARRAY['Environmental and economic assessment of biorefineries and bioenergy systems', 'Integrated resource planning (IRP) applied to the production of bioproducts and bioenergy from solid and liquid waste', 'Sustainable urban planning, water-sensitive urban design and urban infrastructure'],
  lattes            = COALESCE(lattes, 'http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K2194737T5'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0009-0005-7324-3796'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=9Bvj0SgAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/751168/isabela-minucio-pontes/')
WHERE name ILIKE '%Isabela Minucio Pontes%';

-- Ivo Leandro Dorileo
UPDATE team_members SET
  bio_pt            = 'Graduado em Engenharia Elétrica pela Universidade Federal de Mato Grosso, com formação nas áreas de potência e telecomunicações. Mestrado (2006) e doutorado (2009) em Planejamento de Sistemas Energéticos pela UNICAMP. Atua no Núcleo Interdisciplinar de Planejamento Energético da UNICAMP e mantém vínculo acadêmico com a UFMT. Sua atuação concentra-se no planejamento integrado de recursos energéticos e hídricos, eficiência energética, fontes renováveis e análise socioambiental de sistemas de energia.',
  bio_en            = 'Holds a degree in Electrical Engineering from the Federal University of Mato Grosso, with training in power systems and telecommunications. He completed a master''s (2006) and a doctorate (2009) in Energy Systems Planning at UNICAMP. He works at UNICAMP''s Interdisciplinary Centre for Energy Planning and maintains an academic affiliation with UFMT. His work centres on the integrated planning of energy and water resources, energy efficiency, renewable sources and the socio-environmental analysis of energy systems.',
  research_areas_pt = ARRAY['Planejamento integrado de recursos energéticos e hídricos em bacias hidrográficas', 'Avaliação técnico-econômica, ambiental e energética de fontes renováveis, incluindo biomassa, biocombustíveis, biogás e biometano', 'Eficiência energética, projeção de demanda, balanços e matrizes energéticas e impactos ambientais de sistemas de geração, transmissão e distribuição'],
  research_areas_en = ARRAY['Integrated planning of energy and water resources in river basins', 'Technical, economic, environmental and energy assessment of renewable sources, including biomass, biofuels, biogas and biomethane', 'Energy efficiency, demand forecasting, energy balances and matrices, and environmental impacts of generation, transmission and distribution systems'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/9236103902422225'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0001-5593-5514'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=oSsLCoMAAAAJ'),
  institutional_url = COALESCE(institutional_url, 'http://portal.edat.unicamp.br/perfil?origem=&docente=324233')
WHERE name ILIKE '%Ivo Leandro Dorileo%';

-- Raphael Guarda Cavalcante
UPDATE team_members SET
  bio_pt            = 'Mestrando do Programa de Pós-Graduação em Ciências Ambientais da Universidade Federal de Alfenas, com bolsa CAPES. Graduado em Biotecnologia pela UNIFAL-MG. Sua trajetória inclui iniciação científica em Biotecnologia Vegetal, com estudos sobre respostas de plantas ao estresse hídrico e ao alagamento, além do uso de vermicomposto na produção vegetal. Participa de atividades de monitoramento ambiental e análise de recursos hídricos no âmbito do PPGCA.',
  bio_en            = 'Master''s candidate in the Graduate Programme in Environmental Sciences at the Federal University of Alfenas, with a CAPES scholarship. He holds a degree in Biotechnology from UNIFAL-MG. His background includes undergraduate research in plant biotechnology, with studies on plant responses to water stress and flooding, as well as the use of vermicompost in plant production. He takes part in environmental monitoring and water resources analysis within the PPGCA.',
  research_areas_pt = ARRAY['Monitoramento e avaliação da qualidade ambiental de recursos hídricos', 'Biotecnologia vegetal aplicada à tolerância de plantas ao estresse hídrico e ao alagamento', 'Uso de vermicomposto e resíduos orgânicos como insumos para produção vegetal e mitigação de impactos ambientais'],
  research_areas_en = ARRAY['Monitoring and assessment of the environmental quality of water resources', 'Plant biotechnology applied to plant tolerance of water stress and flooding', 'Use of vermicompost and organic waste as inputs for plant production and impact mitigation'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/4892795495896665'),
  institutional_url = COALESCE(institutional_url, 'https://www.unifal-mg.edu.br/ppgca/discentes-mestrado/')
WHERE name ILIKE '%Raphael Guarda Cavalcante%';

-- Hilman Ibnu Mahdi
UPDATE team_members SET
  bio_pt            = 'Doutorando do Programa de Pós-Graduação em Engenharia Química da Escola Politécnica da USP, atuando no grupo de Luis Alberto Follegatti-Romero. Sua produção concentra-se em engenharia química, catálise e conversão de matérias-primas renováveis, com publicações sobre biodiesel, líquidos iônicos, degradação e fracionamento de biomassa, lignina para combustíveis sustentáveis e desenvolvimento de biocatalisadores. Publica desde pelo menos 2016, inicialmente com afiliação à Universitas Gadjah Mada (Indonésia).',
  bio_en            = 'Doctoral candidate in the Graduate Programme in Chemical Engineering at the Polytechnic School of USP, working in the group of Luis Alberto Follegatti-Romero. His output concentrates on chemical engineering, catalysis and the conversion of renewable feedstocks, with publications on biodiesel, ionic liquids, biomass degradation and fractionation, lignin for sustainable fuels and the development of biocatalysts. He has published since at least 2016, initially affiliated with Universitas Gadjah Mada (Indonesia).',
  research_areas_pt = ARRAY['Catálise heterogênea e líquidos iônicos aplicados à produção de biodiesel e biocombustíveis', 'Conversão, degradação e fracionamento de biomassa lignocelulósica', 'Desenvolvimento de bioprodutos e combustíveis renováveis, incluindo derivados de lignina, biojet fuel e bioconversão'],
  research_areas_en = ARRAY['Heterogeneous catalysis and ionic liquids applied to biodiesel and biofuel production', 'Conversion, degradation and fractionation of lignocellulosic biomass', 'Development of bioproducts and renewable fuels, including lignin derivatives, biojet fuel and bioconversion'],
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=i2dIFRYAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/en/pesquisador/739335/hilman-ibnu-mahdi-dave-ronel/'),
  institutional_url = COALESCE(institutional_url, 'https://sites.usp.br/peq_epusp/')
WHERE name ILIKE '%Dave Ronel%';

-- Rachel Biancalana Costa
UPDATE team_members SET
  bio_pt            = 'Graduada em Engenharia Ambiental pela Escola de Engenharia de São Carlos (EESC/USP) e doutora em Engenharia Hidráulica e Saneamento pela USP. Realizou pós-doutorado na UNESP e na National University of Ireland Galway. É professora do Departamento de Engenharia Hidráulica e Ambiental da Escola Politécnica da USP, onde desenvolve pesquisas sobre processos anaeróbios, valorização de águas residuárias e recuperação de compostos de alto valor agregado. Sua atuação recente inclui biometano, biorrefinarias, produção de polihidroxialcanoatos e produção de ácidos orgânicos e butanol.',
  bio_en            = 'Holds a degree in Environmental Engineering from the São Carlos School of Engineering (EESC/USP) and a doctorate in Hydraulic Engineering and Sanitation from USP. She carried out postdoctoral research at UNESP and at the National University of Ireland Galway. She is a professor in the Department of Hydraulic and Environmental Engineering at the Polytechnic School of USP, where she researches anaerobic processes, wastewater valorisation and the recovery of high-value compounds. Her recent work includes biomethane, biorefineries, polyhydroxyalkanoate production and the production of organic acids and butanol.',
  research_areas_pt = ARRAY['Processos anaeróbios para tratamento e valorização de águas residuárias industriais', 'Produção de biometano e integração de resíduos agropecuários em biorrefinarias', 'Recuperação biológica de compostos de alto valor agregado, incluindo polihidroxialcanoatos, ácidos orgânicos e butanol'],
  research_areas_en = ARRAY['Anaerobic processes and wastewater valorisation', 'Biomethane, biorefineries and recovery of high-value compounds', 'Production of polyhydroxyalkanoates, organic acids and butanol'],
  lattes            = COALESCE(lattes, 'https://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K4353800T3&idiomaExibicao=2'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-9914-7330'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=skVJWxgAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/74680/rachel-biancalana-costa/'),
  institutional_url = COALESCE(institutional_url, 'https://www.poli.usp.br/en/ppgec/institucional-ppgec/')
WHERE name ILIKE '%Rachel Biancalana Costa%';
