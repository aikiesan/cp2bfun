-- Migration 050: perfis da equipe — terceiro lote de fichas de referência.
--
-- A 046 publicou 15 fichas e a 049 outras nove. Chegou um terceiro lote, de 15
-- fichas. Treze entram aqui.
--
-- Duas ficam de fora, pelo mesmo critério das anteriores — publicar meia ficha
-- sobre uma pessoa real é pior do que não publicar nenhuma:
--
--   Antonio Eduardo Colins Sena continua retido pelo terceiro lote seguido. A
--   ficha nova confirma a bolsa DEAPE, a área de Exatas e a orientação de Bruna
--   de Souza Moraes pela chamada oficial da PRP/UNICAMP, mas curso, unidade
--   acadêmica e tema do projeto seguem não localizados — exatamente o que o
--   manteve fora da 046 e da 049. O Lattes dele já está no banco desde a 041.
--
--   Lucas Mantovani Boaro entra na mesma situação. A própria ficha se declara
--   "Provisória — dados insuficientes", com confiança baixa para formação,
--   curso, unidade, projeto e áreas; o Lattes informado exige código de
--   segurança e a única outra fonte é uma relação nominal de aprovados. Não há
--   o que publicar além do nome, que a página já mostra.
--
-- As treze pessoas abaixo já existem como linha em team_members, então aqui só
-- há UPDATE. bio_pt/en e research_areas_* são atribuídos direto, porque são o
-- conteúdo autoritativo que chega agora; os identificadores usam COALESCE para
-- nunca sobrescrever o que a planilha da 041 já trouxe.
--
-- As seções "Confiança" e "A confirmar" das fichas são de uso interno e não
-- entram no banco. As divergências de cadastro que elas levantam ficam como
-- comentário no bloco de cada pessoa: nenhuma coluna de cadastro (axes,
-- role_pt/en, institution, membership) é alterada aqui, porque todas essas
-- pendências estão marcadas "a confirmar" na origem.
--
-- Dois perfis do Google Scholar informados nas fichas não são gravados: os de
-- Marcelo Zaiat e Paulo Sergio Graziano Magalhães retornam 404 hoje. Vale para
-- eles a mesma regra que a 041 aplica ao "NÃO LOCALIZADO" da planilha — um
-- href quebrado na página é pior do que a ausência do link, para a qual o modal
-- de perfil já é desenhado.

-- ---------------------------------------------------------------- Eixo 2 ----

-- Marcelo Zaiat
-- A confirmar com o CP2b: o cadastro traz "Pesquisador Associado", enquanto a
-- EESC/USP o registra como Professor Titular. Cargo não alterado aqui.
-- O Google Scholar informado (user=zgYWu00AAAAJ) retorna 404 e não é gravado.
UPDATE team_members SET
  bio_pt            = 'Graduado e mestre em Engenharia Química pela Universidade Federal de São Carlos, doutor em Engenharia Hidráulica e Saneamento pela Escola de Engenharia de São Carlos da USP e livre-docente em Tratamento Biológico de Águas Residuárias pela USP. É Professor Titular do Departamento de Hidráulica e Saneamento da EESC/USP, onde atua na graduação em Engenharia Ambiental e orienta pesquisas em Ciências da Engenharia Ambiental. Sua pesquisa concentra-se em tratamento biológico de águas residuárias, reatores anaeróbios, biogás, bioenergia e na aplicação do conceito de biorrefinaria a estações de tratamento.',
  bio_en            = 'Holds a bachelor''s and a master''s degree in Chemical Engineering from the Federal University of São Carlos, a doctorate in Hydraulics and Sanitation from USP''s São Carlos School of Engineering and a habilitation in Biological Wastewater Treatment from USP. He is a Full Professor in the Department of Hydraulics and Sanitation at EESC/USP, teaching in the Environmental Engineering degree and supervising research in Environmental Engineering Sciences. His research centres on the biological treatment of wastewater, anaerobic reactors, biogas, bioenergy and the application of the biorefinery concept to treatment plants.',
  research_areas_pt = ARRAY['Desenvolvimento e modelagem de reatores anaeróbios para tratamento de águas residuárias', 'Biotecnologia ambiental, digestão anaeróbia e produção de biogás, metano e biohidrogênio', 'Biorrefinarias aplicadas ao tratamento de águas residuárias e resíduos, com recuperação de matéria e energia'],
  research_areas_en = ARRAY['Development and modelling of anaerobic reactors for wastewater treatment', 'Environmental biotechnology, anaerobic digestion and the production of biogas, methane and biohydrogen', 'Biorefineries applied to wastewater and waste treatment, recovering both materials and energy'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/7593950695805418'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0001-7336-9093'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/3234/marcelo-zaiat/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=7004252408'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/C-4752-2012'),
  institutional_url = COALESCE(institutional_url, 'https://shs.eesc.usp.br/administracao/docente/?d=marcelo-zaiat')
WHERE name ILIKE '%Marcelo Zaiat%';

-- Stella Stopa Assis Palma
-- A confirmar com o CP2b: o cadastro indica NIPE/UNICAMP, enquanto as fontes
-- institucionais a registram como pós-doutoranda da FEAGRI/UNICAMP, no Grupo de
-- Ensaios Não Destrutivos. Instituição não alterada aqui.
UPDATE team_members SET
  bio_pt            = 'Licenciada em Ciências Biológicas pelas Faculdades Integradas de Ourinhos, graduada e mestre em Engenharia Agrícola pela UNICAMP e doutora em Engenharia Agrícola pela mesma universidade. Sua trajetória reúne pesquisas em tomografia ultrassônica, inspeção não destrutiva e avaliação da deterioração de árvores. Realiza pós-doutorado na UNICAMP, no Grupo de Ensaios Não Destrutivos da FEAGRI, e conduz projeto apoiado pela FAPESP sobre produção de biogás e compostos orgânicos a partir de resíduos orgânicos urbanos.',
  bio_en            = 'Holds a teaching degree in Biological Sciences from Faculdades Integradas de Ourinhos, a bachelor''s and a master''s degree in Agricultural Engineering from UNICAMP and a doctorate in Agricultural Engineering from the same university. Her career brings together research on ultrasonic tomography, non-destructive testing and the assessment of tree decay. She is carrying out postdoctoral research at UNICAMP, in FEAGRI''s Non-Destructive Testing Group, and leads a FAPESP-funded project on producing biogas and organic compounds from urban organic waste.',
  research_areas_pt = ARRAY['Tomografia ultrassônica e ensaios não destrutivos aplicados à avaliação de madeira e árvores', 'Processamento de imagens, algoritmos de interpolação e reconhecimento de padrões em tomografia', 'Digestão anaeróbia de resíduos orgânicos urbanos, produção de biogás e recuperação de compostos orgânicos'],
  research_areas_en = ARRAY['Ultrasonic tomography and non-destructive testing applied to the assessment of timber and trees', 'Image processing, interpolation algorithms and pattern recognition in tomography', 'Anaerobic digestion of urban organic waste, biogas production and the recovery of organic compounds'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/4566576044661389'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0001-8821-2048'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=DiMHciYAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/en/pesquisador/726975/stella-stopa-assis-palma/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=57653020100')
WHERE name ILIKE '%Stella Stopa%Palma%';

-- Denis da Silva Miranda
UPDATE team_members SET
  bio_pt            = 'Bacharel em Engenharia Química pela Universidade Federal do Pará e mestre em Engenharia Química pela USP, com pesquisa sobre a viabilidade ambiental e social da geração de eletricidade a partir de biogás em sistemas isolados da Amazônia. É doutorando do Programa de Doutorado em Bioenergia da UNICAMP, com pesquisa voltada ao aproveitamento energético de resíduos sólidos urbanos e à produção de biogás. Sua atuação envolve avaliação do ciclo de vida, bioenergia, digestão anaeróbia e planejamento de sistemas de geração renovável.',
  bio_en            = 'Holds a bachelor''s degree in Chemical Engineering from the Federal University of Pará and a master''s in Chemical Engineering from USP, with research on the environmental and social viability of generating electricity from biogas in isolated Amazonian systems. He is a doctoral candidate in UNICAMP''s Bioenergy programme, researching the energy recovery of municipal solid waste and the production of biogas. His work spans life-cycle assessment, bioenergy, anaerobic digestion and the planning of renewable generation systems.',
  research_areas_pt = ARRAY['Avaliação do ciclo de vida aplicada a sistemas de bioenergia e geração elétrica', 'Digestão anaeróbia e produção de biogás a partir de resíduos sólidos urbanos e agropecuários', 'Planejamento e avaliação ambiental e social de sistemas descentralizados de energia renovável'],
  research_areas_en = ARRAY['Life-cycle assessment applied to bioenergy and electricity generation systems', 'Anaerobic digestion and biogas production from municipal solid and agricultural waste', 'Planning and environmental and social assessment of decentralised renewable energy systems'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/6560120596598893'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0001-7415-0624'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=QcG_7gcAAAAJ'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/IYS-3961-2023')
WHERE name ILIKE '%Denis da Silva Miranda%';

-- Marcus Lívio Carlin
UPDATE team_members SET
  bio_pt            = 'Engenheiro agrônomo e mestre em Ciência e Engenharia Ambiental pela Universidade Federal de Alfenas, na área de concentração Tratamento de Efluentes. Sua dissertação avaliou a influência da sazonalidade climática e da variação da dieta de bovinos leiteiros sobre o potencial bioquímico de metano produzido a partir de dejetos. É doutorando do Programa de Pós-Graduação em Ciência e Engenharia Ambiental da UNIFAL-MG, com atuação concentrada em digestão anaeróbia, produção de biogás e aproveitamento energético de resíduos agropecuários.',
  bio_en            = 'Agronomist and holder of a master''s degree in Environmental Science and Engineering from the Federal University of Alfenas, in the Effluent Treatment concentration area. His dissertation assessed how climatic seasonality and variation in dairy cattle diet affect the biochemical methane potential of manure. He is a doctoral candidate in UNIFAL-MG''s graduate programme in Environmental Science and Engineering, working on anaerobic digestion, biogas production and the energy recovery of agricultural waste.',
  research_areas_pt = ARRAY['Potencial bioquímico de metano e digestão anaeróbia de dejetos bovinos', 'Produção de biogás e biometano a partir de resíduos agropecuários', 'Influência da sazonalidade climática, do manejo e da composição de substratos no rendimento de metano'],
  research_areas_en = ARRAY['Biochemical methane potential and anaerobic digestion of cattle manure', 'Production of biogas and biomethane from agricultural waste', 'How climatic seasonality, husbandry and substrate composition affect methane yield'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/0948460064235731'),
  institutional_url = COALESCE(institutional_url, 'https://www.unifal-mg.edu.br/ppgca/discentes-doutorado/')
WHERE name ILIKE '%Marcus L%vio Carlin%';

-- ---------------------------------------------------------------- Eixo 3 ----

-- Paulo Sergio Graziano Magalhães
-- A confirmar com o CP2b: a ficha indica vínculo profissional com a UPP,
-- enquanto o portal da UNICAMP o registra como Pesquisador Visitante Convidado
-- do NIPE. Cargo e instituição não alterados aqui.
-- O Google Scholar informado (user=dQJj6oEAAAAJ) retorna 404 e não é gravado.
UPDATE team_members SET
  bio_pt            = 'Engenheiro agrícola pela UNICAMP e doutor em Engenharia Agrícola pelo Silsoe College, da Cranfield University, no Reino Unido. Foi professor titular da UNICAMP e é pesquisador colaborador do NIPE, com passagem pelo CTBE/CNPEM e atuação como professor visitante da UTFPR. Sua pesquisa concentra-se em projeto e desenvolvimento de máquinas agrícolas, agricultura de precisão, mecanização da produção de cana-de-açúcar e sustentabilidade agrícola, com trabalhos recentes sobre equipamentos e processos para compostagem e aproveitamento de resíduos.',
  bio_en            = 'Agricultural engineer trained at UNICAMP, with a doctorate in Agricultural Engineering from Silsoe College, Cranfield University, in the United Kingdom. He was a full professor at UNICAMP and is a collaborating researcher at NIPE, having also worked at CTBE/CNPEM and as a visiting professor at UTFPR. His research centres on the design and development of agricultural machinery, precision agriculture, the mechanisation of sugarcane production and agricultural sustainability, with recent work on equipment and processes for composting and waste recovery.',
  research_areas_pt = ARRAY['Projeto e desenvolvimento de máquinas e equipamentos agrícolas', 'Agricultura de precisão, sensoriamento e monitoramento de sistemas agrícolas', 'Aproveitamento e compostagem de resíduos agroindustriais e produção agrícola sustentável'],
  research_areas_en = ARRAY['Design and development of agricultural machinery and equipment', 'Precision agriculture, sensing and the monitoring of agricultural systems', 'Recovery and composting of agro-industrial waste and sustainable agricultural production'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/1198843146263387'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-5374-3591'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/3321/paulo-sergio-graziano-magalhaes/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=7003731076'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/B-7641-2012'),
  institutional_url = COALESCE(institutional_url, 'https://portal.dados.unicamp.br/perfil?docente=318552')
WHERE name ILIKE '%Paulo Sergio Graziano%';

-- Jessica Jacinta Silva
-- A confirmar com o CP2b: o cadastro indica UNIFAL, mas as fontes oficiais mais
-- recentes mostram ingresso no doutorado da EESC/USP em 2026, na linha de
-- Biotecnologia Ambiental, sob orientação de Marcelo Zaiat. A página de
-- discentes da UNIFAL ainda a lista, provavelmente por defasagem cadastral.
-- Instituição não alterada aqui.
UPDATE team_members SET
  bio_pt            = 'Licenciada em Química pela UNIFAL-MG, bacharel em Ciência e Tecnologia pela mesma universidade, mestra em Ciência e Engenharia Ambiental pela UNIFAL-MG e doutoranda em Ciências da Engenharia Ambiental na Escola de Engenharia de São Carlos da USP, na linha de Biotecnologia Ambiental. Sua pesquisa de mestrado avaliou a produção de biogás e metano a partir de subprodutos da indústria sucroalcooleira, incluindo codigestão anaeróbia e pré-tratamento fúngico do bagaço de cana-de-açúcar.',
  bio_en            = 'Holds a teaching degree in Chemistry from UNIFAL-MG, a bachelor''s degree in Science and Technology from the same university, a master''s in Environmental Science and Engineering from UNIFAL-MG, and is a doctoral candidate in Environmental Engineering Sciences at USP''s São Carlos School of Engineering, in the Environmental Biotechnology line. Her master''s research assessed the production of biogas and methane from sugarcane industry by-products, including anaerobic co-digestion and fungal pre-treatment of sugarcane bagasse.',
  research_areas_pt = ARRAY['Digestão anaeróbia e produção de biogás e metano a partir de resíduos agroindustriais', 'Codigestão de vinhaça, torta de filtro, esterco de aves e outros subprodutos sucroalcooleiros', 'Pré-tratamento biológico de biomassa lignocelulósica e valorização energética do bagaço de cana'],
  research_areas_en = ARRAY['Anaerobic digestion and the production of biogas and methane from agro-industrial waste', 'Co-digestion of vinasse, filter cake, poultry manure and other sugarcane industry by-products', 'Biological pre-treatment of lignocellulosic biomass and the energy valorisation of sugarcane bagasse'],
  orcid             = COALESCE(orcid, 'https://orcid.org/0009-0007-2287-9625'),
  institutional_url = COALESCE(institutional_url, 'https://ppg-sea.eesc.usp.br/corpo-discente-doutorado/')
WHERE name ILIKE '%Jessica Jacinta%';

-- Leonardo Ariel Benavidez Mamani
-- Sem identificadores públicos localizados: não há Lattes, ORCID, Scholar nem
-- BV FAPESP a gravar. O perfil institucional localizado é a página do programa
-- de pós-graduação, não uma página pessoal, e por isso também não é gravado.
UPDATE team_members SET
  bio_pt            = 'Engenheiro industrial pela Universidad Mayor de San Andrés, na Bolívia, com mestrado em Engenharia Industrial na ênfase de Desenvolvimento Sustentável de Processos e Produtos. Foi selecionado pelo programa de cooperação internacional GCUB/OEA para o doutorado em Planejamento de Sistemas Energéticos da UNICAMP, iniciado em 2025 sob orientação de Bruna de Souza Moraes, com pesquisa sobre produção de biogás a partir de resíduos sólidos urbanos. Também desenvolve trabalhos sobre bioenergia a partir de microalgas e sobre integração de biomassa em biorrefinarias.',
  bio_en            = 'Industrial engineer trained at Universidad Mayor de San Andrés, in Bolivia, with a master''s degree in Industrial Engineering in the Sustainable Development of Processes and Products concentration. He was selected by the GCUB/OAS international cooperation programme for the doctorate in Energy Systems Planning at UNICAMP, begun in 2025 under the supervision of Bruna de Souza Moraes, researching biogas production from municipal solid waste. He also works on bioenergy from microalgae and on integrating biomass into biorefineries.',
  research_areas_pt = ARRAY['Produção de biogás a partir de resíduos sólidos urbanos', 'Bioenergia e aproveitamento de biomassa de microalgas', 'Biorrefinarias, desenvolvimento sustentável de processos e integração de rotas energéticas'],
  research_areas_en = ARRAY['Biogas production from municipal solid waste', 'Bioenergy and the use of microalgae biomass', 'Biorefineries, sustainable process development and the integration of energy routes']
WHERE name ILIKE '%Leonardo Ariel%Mamani%';

-- ---------------------------------------------------------------- Eixo 4 ----

-- Carlos Eduardo Driemeier
-- Incluído à mão no teamByAxis pelo ANEXO 11, como coordenador do Eixo 4, mas
-- sem nenhum identificador no banco até aqui. A ficha traz sete.
-- A confirmar com o CP2b: as fontes públicas o descrevem como pesquisador do
-- CNPEM/CTBE e, simultaneamente, Pesquisador Visitante Convidado do NIPE.
UPDATE team_members SET
  bio_pt            = 'Bacharel e doutor em Física pela Universidade Federal do Rio Grande do Sul, com estágio de doutorado na University of Texas e pós-doutorado em sistemas de energia fotovoltaica pelo Instituto de Energia e Ambiente da USP. Atuou por mais de dezesseis anos como pesquisador do CTBE/CNPEM, onde foi Jovem Pesquisador FAPESP e pesquisador principal do INCT Bioetanol. É pesquisador do CNPEM e Pesquisador Visitante Convidado do NIPE/UNICAMP, com pesquisas sobre conversão de biomassa, biorrefinarias, combustíveis sustentáveis e tecnologias de baixa emissão de carbono.',
  bio_en            = 'Holds a bachelor''s degree and a doctorate in Physics from the Federal University of Rio Grande do Sul, with a doctoral placement at the University of Texas and postdoctoral research on photovoltaic energy systems at USP''s Institute of Energy and Environment. He spent more than sixteen years as a researcher at CTBE/CNPEM, where he was a FAPESP Young Investigator and principal researcher of the INCT Bioethanol. He is a researcher at CNPEM and an Invited Visiting Researcher at NIPE/UNICAMP, working on biomass conversion, biorefineries, sustainable fuels and low-carbon technologies.',
  research_areas_pt = ARRAY['Conversão e processamento de biomassa lignocelulósica para biocombustíveis e bioprodutos', 'Biorrefinarias de cana-de-açúcar, etanol celulósico, pré-tratamento e valorização de lignina', 'Avaliação de sistemas energéticos e desenvolvimento de combustíveis sustentáveis de baixa emissão'],
  research_areas_en = ARRAY['Conversion and processing of lignocellulosic biomass into biofuels and bioproducts', 'Sugarcane biorefineries, cellulosic ethanol, pre-treatment and lignin valorisation', 'Assessment of energy systems and the development of sustainable low-emission fuels'],
  lattes            = COALESCE(lattes, 'https://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4705142Y8'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-4794-3714'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=cKmTHq4AAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/33309/carlos-eduardo-driemeier/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=7003439118'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/R-2399-2019'),
  institutional_url = COALESCE(institutional_url, 'http://portal.edat.unicamp.br/perfil?docente=332553')
WHERE name ILIKE '%Driemeier%';

-- Mauro Donizetti Berni
-- Divergência de Lattes NÃO resolvida aqui: o banco tem
-- lattes.cnpq.br/1602054738205274 (vindo da 041) e o NIPE aponta o currículo
-- K4705031Z8. O COALESCE preserva o que já está gravado; qual dos dois é o
-- registro correto é decisão do CP2b, não desta migração.
UPDATE team_members SET
  bio_pt            = 'Engenheiro de produção e químico, doutor em Sistemas Energéticos pela UNICAMP e bacharel em Ciências Jurídicas. É pesquisador permanente do Núcleo Interdisciplinar de Planejamento Energético, onde integra o Conselho Superior como suplente. Sua atuação concentra-se em planejamento energético, eficiência energética, sustentabilidade, regulação e avaliação técnico-econômica e ambiental de sistemas de bioenergia, com estudos sobre digestão anaeróbia, biogás, biomassa e resíduos agroindustriais.',
  bio_en            = 'Production and chemical engineer, with a doctorate in Energy Systems from UNICAMP and a bachelor''s degree in Law. He is a permanent researcher at the Interdisciplinary Centre for Energy Planning, where he sits on the Higher Council as an alternate member. His work centres on energy planning, energy efficiency, sustainability, regulation and the techno-economic and environmental assessment of bioenergy systems, with studies on anaerobic digestion, biogas, biomass and agro-industrial waste.',
  research_areas_pt = ARRAY['Planejamento energético, eficiência energética e regulação de sistemas de energia', 'Avaliação técnico-econômica, ambiental e territorial de biomassa, biogás e biometano', 'Digestão anaeróbia, aproveitamento energético de resíduos agroindustriais e integração em biorrefinarias'],
  research_areas_en = ARRAY['Energy planning, energy efficiency and the regulation of energy systems', 'Techno-economic, environmental and territorial assessment of biomass, biogas and biomethane', 'Anaerobic digestion, energy recovery from agro-industrial waste and integration into biorefineries'],
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-0027-2458'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=vLFuoVEAAAAJ'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/C-9194-2012'),
  institutional_url = COALESCE(institutional_url, 'https://www.nipe.unicamp.br/profissional/mauro-donizeti-berni/')
WHERE name ILIKE '%Mauro Donize%Berni%';

-- Jose Maria Ferreira Jardim da Silveira
-- Divergência de Lattes NÃO resolvida aqui: o banco tem
-- lattes.cnpq.br/4984859173592703 (vindo da 041) e o NIPE e a BV FAPESP apontam
-- o currículo K4788050J6. O COALESCE preserva o que está gravado.
-- A confirmar com o CP2b: o cadastro traz "Pesquisador Principal", enquanto a
-- página do NIPE registra o cargo de Coordenador Associado.
UPDATE team_members SET
  bio_pt            = 'Graduado em Engenharia Agronômica pela Escola Superior de Agricultura Luiz de Queiroz, mestre e doutor em Ciência Econômica pela UNICAMP. É Professor Titular do Instituto de Economia da UNICAMP e pesquisador do Centro de Economia Aplicada, Agrícola e Ambiental, além de Coordenador Associado do NIPE. Sua atuação reúne economia da inovação tecnológica, economia de redes, modelos baseados em agentes, organização industrial, transição energética e inovação tecnológica na agricultura.',
  bio_en            = 'Holds a degree in Agronomic Engineering from the Luiz de Queiroz College of Agriculture and a master''s and doctorate in Economics from UNICAMP. He is a Full Professor at UNICAMP''s Institute of Economics and a researcher at its Centre for Applied, Agricultural and Environmental Economics, as well as Associate Coordinator of NIPE. His work brings together the economics of technological innovation, network economics, agent-based models, industrial organisation, the energy transition and technological innovation in agriculture.',
  research_areas_pt = ARRAY['Economia da inovação tecnológica, redes de conhecimento e modelos baseados em agentes', 'Transição energética, bioenergia e avaliação de sistemas tecnológicos de biocombustíveis', 'Organização industrial, inovação na agricultura e análise econômica de cadeias de biomassa'],
  research_areas_en = ARRAY['Economics of technological innovation, knowledge networks and agent-based models', 'Energy transition, bioenergy and the assessment of biofuel technology systems', 'Industrial organisation, innovation in agriculture and economic analysis of biomass chains'],
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-3680-875X'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=iJUYLdkAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/992/jose-maria-ferreira-jardim-da-silveira/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=48360967300'),
  institutional_url = COALESCE(institutional_url, 'https://nipe.unicamp.br/profissional/jose-maria-ferreira-jardim-da-silveira/')
WHERE name ILIKE '%Jos%Maria Ferreira Jardim%';

-- Marcelo Marques de Magalhães
-- A confirmar com o CP2b: o cadastro traz "Pesquisador Associado — CET/UNESP",
-- enquanto o portal da UNESP o registra como professor assistente doutor, em
-- RDIDP, na Faculdade de Ciências e Engenharia do Câmpus de Tupã.
UPDATE team_members SET
  bio_pt            = 'Engenheiro agrônomo pela UNESP, mestre em Engenharia Agrícola pela UNICAMP e doutor em Engenharia Agronômica pela UNESP. É professor assistente doutor da Faculdade de Ciências e Engenharia da UNESP, no Câmpus de Tupã, e pesquisador colaborador do Instituto de Economia da UNICAMP. Sua atuação reúne economia agrária, eficiência produtiva, análise de fronteira estocástica e avaliação de impactos, com trabalhos recentes sobre mercados de resíduos agrícolas, bioenergia e produção sustentável.',
  bio_en            = 'Agronomist trained at UNESP, with a master''s degree in Agricultural Engineering from UNICAMP and a doctorate in Agronomic Engineering from UNESP. He is an assistant professor at UNESP''s School of Sciences and Engineering on the Tupã campus and a collaborating researcher at UNICAMP''s Institute of Economics. His work brings together agricultural economics, productive efficiency, stochastic frontier analysis and impact assessment, with recent studies on markets for agricultural residues, bioenergy and sustainable production.',
  research_areas_pt = ARRAY['Economia agrária, produtividade agrícola e análise de eficiência por fronteira estocástica', 'Avaliação econômica e de impactos de políticas, tecnologias e sistemas de produção agropecuária', 'Mercados de resíduos agrícolas, cadeias de biomassa e inserção da bioenergia na agricultura'],
  research_areas_en = ARRAY['Agricultural economics, farm productivity and efficiency analysis through stochastic frontiers', 'Economic and impact assessment of policies, technologies and agricultural production systems', 'Markets for agricultural residues, biomass chains and the uptake of bioenergy in agriculture'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/4117906942336504'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0001-6334-5493'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=n3jbke0AAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/673021/marcelo-marques-de-magalhaes/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=55899803800'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/O-9957-2017'),
  institutional_url = COALESCE(institutional_url, 'https://unesp.br/portaldocentes/docentes/29396')
WHERE name ILIKE '%Marcelo Marques de Magalh%';

-- ---------------------------------------------------------------- Eixo 5 ----

-- Mariana Conceição da Costa
UPDATE team_members SET
  bio_pt            = 'Engenheira química pela Escola de Engenharia de Lorena da USP, mestre e doutora em Engenharia Química pela FEQ/UNICAMP, esta última em colaboração com a Universidade de Aveiro. Após atuar como pesquisadora colaboradora da Faculdade de Engenharia de Alimentos e como docente da FCA/UNICAMP, integrou-se à Faculdade de Engenharia Química, onde é Professora Associada I e bolsista de produtividade do CNPq. Sua pesquisa concentra-se em termodinâmica, equilíbrio de fases, líquidos iônicos, solventes eutéticos e processamento de biomassa lignocelulósica.',
  bio_en            = 'Chemical engineer trained at USP''s Lorena School of Engineering, with a master''s and a doctorate in Chemical Engineering from FEQ/UNICAMP, the latter in collaboration with the University of Aveiro. After working as a collaborating researcher at the School of Food Engineering and as a lecturer at FCA/UNICAMP, she joined the School of Chemical Engineering, where she is an Associate Professor I and a CNPq research productivity fellow. Her research centres on thermodynamics, phase equilibrium, ionic liquids, eutectic solvents and the processing of lignocellulosic biomass.',
  research_areas_pt = ARRAY['Termodinâmica aplicada e equilíbrio sólido-líquido, líquido-líquido e líquido-vapor', 'Líquidos iônicos, solventes eutéticos profundos e separação de componentes de biomassa', 'Fracionamento e valorização de lignina para bioprodutos, materiais avançados e biocombustíveis'],
  research_areas_en = ARRAY['Applied thermodynamics and solid-liquid, liquid-liquid and liquid-vapour equilibrium', 'Ionic liquids, deep eutectic solvents and the separation of biomass components', 'Fractionation and valorisation of lignin for bioproducts, advanced materials and biofuels'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/6460520627911836'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-1710-7202'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=_3vvHqwAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/33191/mariana-conceicao-da-costa/'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/B-7232-2012'),
  institutional_url = COALESCE(institutional_url, 'https://portal.dados.unicamp.br/perfil?docente=300237')
WHERE name ILIKE '%Mariana Concei%o da Costa%';

-- Waldyr Luiz Ribeiro Gallo
UPDATE team_members SET
  bio_pt            = 'Bacharel em Física pela UNICAMP, mestre e doutor em Engenharia Mecânica pela mesma universidade, com pós-doutorado pela Università degli Studi di Firenze. É Professor Titular do Departamento de Energia da Faculdade de Engenharia Mecânica da UNICAMP e foi assessor da Diretoria da Agência Nacional do Petróleo, Gás Natural e Biocombustíveis. Sua atuação concentra-se em termodinâmica aplicada, desempenho de motores, eficiência energética, análise exergética, cogeração e qualidade de combustíveis, incluindo o uso de biocombustíveis em motores.',
  bio_en            = 'Holds a bachelor''s degree in Physics from UNICAMP and a master''s and doctorate in Mechanical Engineering from the same university, with postdoctoral research at the Università degli Studi di Firenze. He is a Full Professor in the Energy Department of UNICAMP''s School of Mechanical Engineering and served as an adviser to the board of the Brazilian National Agency for Petroleum, Natural Gas and Biofuels. His work centres on applied thermodynamics, engine performance, energy efficiency, exergy analysis, cogeneration and fuel quality, including the use of biofuels in engines.',
  research_areas_pt = ARRAY['Termodinâmica aplicada, análise exergética e avaliação de eficiência energética', 'Desempenho de motores de combustão interna, cogeração e ciclos avançados de turbinas a gás', 'Uso energético de biocombustíveis, biogás e biometano, com avaliação de balanço energético e emissões'],
  research_areas_en = ARRAY['Applied thermodynamics, exergy analysis and the assessment of energy efficiency', 'Internal combustion engine performance, cogeneration and advanced gas turbine cycles', 'Energy use of biofuels, biogas and biomethane, with energy balance and emissions assessment'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/6535849579850035'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-1284-1096'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=FK4RMkkAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/87261/waldyr-luiz-ribeiro-gallo/'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=7004297662'),
  institutional_url = COALESCE(institutional_url, 'https://portal.dados.unicamp.br/perfil?docente=60917')
WHERE name ILIKE '%Waldyr Luiz Ribeiro Gallo%';
