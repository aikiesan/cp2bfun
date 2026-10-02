-- Migration 049: perfis da equipe — segundo lote de fichas de referência.
--
-- A migração 046 publicou 15 das 18 primeiras fichas (bio bilíngue, três áreas
-- de atuação e identificadores), que é o que preenche o modal aberto ao clicar
-- numa pessoa em /equipe. Chegou agora um segundo lote, de 13 fichas.
--
-- Três delas já estavam publicadas na 046 — Eder Kevin Arango Escalante,
-- Jessica Cristina Franco Nogueira e Luiza Arones Gaspar — e o texto novo é
-- equivalente ao que já está no banco; não são retocadas aqui.
--
-- Uma quarta, Antonio Eduardo Colins Sena, continua retida na origem pelos
-- mesmos motivos que a mantiveram fora da 046: curso, unidade acadêmica e
-- projeto de iniciação científica não confirmados. Vale o mesmo critério de lá
-- — publicar meia ficha sobre uma pessoa real é pior do que não publicar
-- nenhuma. O Lattes dele já está no banco desde a 041.
--
-- Restam as nove pessoas abaixo. Todas já existem como linha em team_members
-- (inseridas na 032), então aqui só há UPDATE.
--
-- Como na 046: bio_pt/en e research_areas_* são atribuídos direto, porque são
-- o conteúdo autoritativo que chega agora; os identificadores usam COALESCE
-- para nunca sobrescrever o que a planilha da 041 já trouxe. A única exceção é
-- o institutional_url do Sergio Valdir Bajay, comentada no bloco dele.
--
-- As seções "Confiança" e "A confirmar" das fichas são de uso interno e não
-- entram no banco. As divergências de cadastro que elas levantam ficam
-- registradas como comentário no bloco de cada pessoa: nenhuma coluna de
-- cadastro (axes, role_pt/en, institution, membership) é alterada aqui, porque
-- todas essas pendências estão marcadas "a confirmar" na origem.

-- Sergio Valdir Bajay
-- Correção de link: a 041 gravou institutional_url com docente=297738 para o
-- Bajay, mas esse registro é do Mauro Donizeti Berni — a própria 041 usa o
-- mesmo docente=297738 no bloco do Berni. O registro certo é docente=329602.
-- É o único campo do arquivo atribuído sem COALESCE, porque o valor errado já
-- está no banco e precisa ser sobrescrito.
-- A confirmar com o CP2b: o cadastro traz "Pesquisador Associado", enquanto a
-- UNICAMP o registra como Pesquisador Visitante Convidado do NIPE. Cargo não
-- alterado aqui.
UPDATE team_members SET
  bio_pt            = 'Engenheiro mecânico pela UNICAMP, mestre em Engenharia Mecânica pela mesma universidade e doutor em Engenharia pela University of Newcastle upon Tyne, no Reino Unido. Foi professor da Faculdade de Engenharia Mecânica da UNICAMP e participou da criação do programa de pós-graduação em Planejamento de Sistemas Energéticos e do NIPE, onde hoje está registrado como pesquisador visitante convidado. Sua atuação concentra-se em formulação de políticas energéticas, planejamento energético, regulação de mercados de energia, eficiência energética, bioenergia e aproveitamento energético de resíduos.',
  bio_en            = 'Mechanical engineer trained at UNICAMP, with a master''s degree in Mechanical Engineering from the same university and a doctorate in Engineering from the University of Newcastle upon Tyne, in the United Kingdom. He was a professor at UNICAMP''s School of Mechanical Engineering and took part in creating both the graduate programme in Energy Systems Planning and NIPE, where he is currently registered as an invited visiting researcher. His work centres on energy policy design, energy planning, energy-market regulation, energy efficiency, bioenergy and the energy recovery of waste.',
  research_areas_pt = ARRAY['Formulação e avaliação de políticas energéticas e planejamento de sistemas energéticos', 'Regulação de mercados de energia, eficiência energética e governança do setor elétrico', 'Bioenergia, biomassa, biogás, aproveitamento energético de resíduos e integração energética de biorrefinarias'],
  research_areas_en = ARRAY['Design and assessment of energy policies and energy systems planning', 'Energy-market regulation, energy efficiency and governance of the electricity sector', 'Bioenergy, biomass, biogas, energy recovery from waste and the energy integration of biorefineries'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/9615242685505657'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=GdWk-qMAAAAJ'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=56549855500'),
  institutional_url = 'https://portal.edat.unicamp.br/perfil?docente=329602'
WHERE name ILIKE '%Sergio Valdir Bajay%';

-- Thais Aparecida Dibbern
UPDATE team_members SET
  bio_pt            = 'Graduada em Gestão de Políticas Públicas, mestre em Ciências Humanas e Sociais Aplicadas e doutora em Política Científica e Tecnológica, toda a formação pela UNICAMP. Realizou pós-doutorado na Embrapa Agricultura Digital, na área de inovação e prospecção tecnológica. É professora da Faculdade de Ciências Aplicadas da UNICAMP e coordenadora do Laboratório de Estudos do Setor Público. Sua atuação concentra-se em análise de políticas públicas e instituições, sustentabilidade, ensino superior, inovação e avaliação de políticas e tecnologias.',
  bio_en            = 'Holds a bachelor''s degree in Public Policy Management, a master''s in Applied Human and Social Sciences and a doctorate in Science and Technology Policy, all from UNICAMP. She carried out postdoctoral research at Embrapa Digital Agriculture, in innovation and technological foresight. She is a professor at UNICAMP''s School of Applied Sciences and coordinates its Public Sector Studies Laboratory. Her work centres on the analysis of public policy and institutions, sustainability, higher education, innovation and the assessment of policies and technologies.',
  research_areas_pt = ARRAY['Análise de políticas públicas, instituições e interação entre universidade e setor público', 'Políticas de ciência, tecnologia e inovação, com foco em indicadores, avaliação e prospecção tecnológica', 'Sustentabilidade, Objetivos de Desenvolvimento Sustentável e inovação em agricultura digital'],
  research_areas_en = ARRAY['Analysis of public policy, institutions and the interaction between universities and the public sector', 'Science, technology and innovation policy, focusing on indicators, assessment and technological foresight', 'Sustainability, the Sustainable Development Goals and innovation in digital agriculture'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/9471619073576625'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-4826-4614'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=u3LPPLIAAAAJ'),
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=57220165440'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/rid/A-8084-2019')
WHERE name ILIKE '%Thais Aparecida Dibbern%';

-- Natalia Molina Cetrulo
-- A ficha traz um link da BV FAPESP que não é dela — é o perfil da Luciana
-- Cristina Lenhari da Silva, usado no bloco correspondente mais abaixo. Perfil
-- individual da Natália na BV FAPESP não localizado; bv_fapesp fica nulo.
-- A confirmar com o CP2b: o cadastro associa a pesquisadora à EACH/USP, que é
-- onde ela fez o doutorado e o pós-doutorado (concluído em 2024); o registro
-- atual da UNICAMP a identifica como professora da FCA. Unidade não alterada.
UPDATE team_members SET
  bio_pt            = 'Graduada em Administração, mestre em Ciências da Engenharia Ambiental pela USP e doutora em Sustentabilidade pela mesma universidade, com período-sanduíche na Universidade Nova de Lisboa. É professora da Faculdade de Ciências Aplicadas da UNICAMP e integra o NIPE/UNICAMP; realizou pós-doutorado na EACH/USP entre 2022 e 2024. Sua pesquisa concentra-se em políticas públicas para o desenvolvimento sustentável, indicadores participativos, gestão de resíduos sólidos, monitoramento de políticas e avaliação da sustentabilidade local.',
  bio_en            = 'Holds a bachelor''s degree in Business Administration, a master''s in Environmental Engineering Sciences from USP and a doctorate in Sustainability from the same university, with a visiting period at Universidade Nova de Lisboa. She is a professor at UNICAMP''s School of Applied Sciences and a member of NIPE/UNICAMP, and carried out postdoctoral research at EACH/USP between 2022 and 2024. Her research centres on public policy for sustainable development, participatory indicators, solid waste management, policy monitoring and the assessment of local sustainability.',
  research_areas_pt = ARRAY['Políticas públicas e instrumentos de monitoramento e avaliação do desenvolvimento sustentável', 'Governança participativa e indicadores de sustentabilidade para gestão de resíduos sólidos', 'Avaliação de políticas ambientais, gestão pública e inovação institucional aplicada à transição sustentável'],
  research_areas_en = ARRAY['Public policy and instruments for monitoring and assessing sustainable development', 'Participatory governance and sustainability indicators for solid waste management', 'Assessment of environmental policy, public management and institutional innovation applied to the sustainable transition'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/3369372567951783'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-1247-7079'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=cSkm63YAAAAJ')
WHERE name ILIKE '%Nat%lia Molina Cetrulo%';

-- Antonio Parice Bufalo
-- A confirmar com o CP2b: agência, modalidade e vigência da bolsa; o expediente
-- do site registra apenas "estagiário". A bio não afirma modalidade de bolsa.
UPDATE team_members SET
  bio_pt            = 'Estudante do curso de Comunicação Social — Midialogia da UNICAMP, vinculado ao Departamento de Multimeios, Mídias e Comunicação, com graduação iniciada em 2024 e formação técnica em Mecânica pela ETEC Bento Quirino. No CP2b atua na comunicação do Centro e é creditado como fotógrafo em materiais de divulgação da UNICAMP. Sua atuação está relacionada à produção audiovisual, à fotografia e à comunicação científica.',
  bio_en            = 'Undergraduate student in Media Studies (Comunicação Social — Midialogia) at UNICAMP, linked to the Department of Multimedia, Media and Communication, having started the degree in 2024, with earlier technical training in Mechanics at ETEC Bento Quirino. At CP2b he works in the Centre''s communications and is credited as a photographer in UNICAMP outreach material. His work involves audiovisual production, photography and science communication.',
  research_areas_pt = ARRAY['Comunicação Social — Midialogia e produção de conteúdos multimídia', 'Fotografia e registro audiovisual de atividades institucionais e científicas', 'Comunicação e divulgação científica no contexto do CP2b/UNICAMP'],
  research_areas_en = ARRAY['Media studies and the production of multimedia content', 'Photography and audiovisual documentation of institutional and scientific activities', 'Science communication and outreach in the context of CP2b/UNICAMP'],
  orcid             = COALESCE(orcid, 'https://orcid.org/0009-0002-2913-6289'),
  institutional_url = COALESCE(institutional_url, 'https://cp2b.unicamp.br/')
WHERE name ILIKE '%Antonio Parice Bufalo%';

-- Luciana Cristina Lenhari da Silva
-- A confirmar com o CP2b: o cadastro traz "Pesquisador Associado — IG/UNICAMP",
-- enquanto o portal da UNICAMP a classifica como pós-doutoranda do NIPE.
-- Vínculo não alterado aqui.
UPDATE team_members SET
  bio_pt            = 'Economista pela PUC-Campinas, mestre e doutora em Política Científica e Tecnológica pelo Departamento de Política Científica e Tecnológica do Instituto de Geociências da UNICAMP. Realiza pós-doutorado no NIPE/UNICAMP, com atuação no CP2b, e é pesquisadora do Centro Paulista de Estudos da Transição Energética. Suas pesquisas abordam políticas públicas de ciência, tecnologia e inovação, governança e coerência de políticas para a transição energética, biogás, biometano, hidrogênio de baixo carbono e inovação regulatória.',
  bio_en            = 'Economist trained at PUC-Campinas, with a master''s degree and a doctorate in Science and Technology Policy from the Department of Science and Technology Policy at UNICAMP''s Institute of Geosciences. She is a postdoctoral researcher at NIPE/UNICAMP, working with CP2b, and a researcher at the São Paulo Centre for Energy Transition Studies. Her research addresses science, technology and innovation policy, governance and policy coherence for the energy transition, biogas, biomethane, low-carbon hydrogen and regulatory innovation.',
  research_areas_pt = ARRAY['Governança e coerência de políticas públicas para a transição energética', 'Políticas de ciência, tecnologia e inovação, avaliação de impacto e prospecção tecnológica', 'Políticas e regulação de biogás, biometano, hidrogênio de baixo carbono e mobilidade de baixo carbono'],
  research_areas_en = ARRAY['Governance and coherence of public policy for the energy transition', 'Science, technology and innovation policy, impact assessment and technological foresight', 'Policy and regulation of biogas, biomethane, low-carbon hydrogen and low-carbon mobility'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/1950320356042015'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0002-7244-6218'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=TZYO20EAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/727811/luciana-cristina-lenhari-da-silva/'),
  institutional_url = COALESCE(institutional_url, 'https://portal.edat.unicamp.br/perfil?docente=331109')
WHERE name ILIKE '%Luciana Cristina Lenhari da Silva%';

-- Maria Paula Cardeal Volpi
-- A confirmar com o CP2b: o cadastro a enquadra no Eixo 7 (Difusão Científica e
-- Comunicação), mas as fontes localizadas apontam atuação em bioenergia e
-- Engenharia de Biossistemas. A bio e as áreas são de confiança alta e entram
-- agora; o eixo fica como está até que o Centro confirme o enquadramento.
UPDATE team_members SET
  bio_pt            = 'Biotecnologista pela Universidade Federal de São Carlos, mestre em Engenharia Química pela UNICAMP e doutora em Bioenergia pela mesma universidade. É professora da Escola Superior de Agricultura Luiz de Queiroz da USP, na área de Engenharia de Biossistemas. Sua pesquisa concentra-se no uso energético de biomassas, na digestão anaeróbia para recuperação de biogás e biofertilizantes, na codigestão de resíduos agroindustriais e na pirólise para produção de gases e biochar.',
  bio_en            = 'Biotechnologist trained at the Federal University of São Carlos, with a master''s degree in Chemical Engineering from UNICAMP and a doctorate in Bioenergy from the same university. She is a professor at USP''s Luiz de Queiroz College of Agriculture, in the field of Biosystems Engineering. Her research centres on the energy use of biomass, anaerobic digestion for the recovery of biogas and biofertilisers, the co-digestion of agro-industrial waste and pyrolysis for the production of gases and biochar.',
  research_areas_pt = ARRAY['Uso energético de biomassas e produção de biocombustíveis', 'Digestão anaeróbia e codigestão de resíduos sucroenergéticos e agropecuários para recuperação de biogás e biofertilizantes', 'Pirólise de biomassas, produção de gases e biochar e integração de processos em biorrefinarias'],
  research_areas_en = ARRAY['Energy use of biomass and biofuel production', 'Anaerobic digestion and co-digestion of sugar-energy and agricultural waste for the recovery of biogas and biofertilisers', 'Biomass pyrolysis, production of gases and biochar, and process integration in biorefineries'],
  lattes            = COALESCE(lattes, 'http://lattes.cnpq.br/1765265992388858'),
  orcid             = COALESCE(orcid, 'https://orcid.org/0000-0003-0498-269X'),
  scholar           = COALESCE(scholar, 'https://scholar.google.com/citations?user=DmMS-IYAAAAJ'),
  bv_fapesp         = COALESCE(bv_fapesp, 'https://bv.fapesp.br/pt/pesquisador/700733/maria-paula-cardeal-volpi/'),
  wos               = COALESCE(wos, 'https://www.webofscience.com/wos/author/record/MBW-0584-2025'),
  institutional_url = COALESCE(institutional_url, 'https://www.leb.esalq.usp.br/en/staff')
WHERE name ILIKE '%Maria Paula Cardeal Volpi%';

-- Sofia Silva
-- A confirmar com o CP2b: agência, número, modalidade e vigência da bolsa de
-- jornalismo científico, além da formação acadêmica completa. A bio registra
-- apenas o que consta do expediente e das matérias assinadas.
UPDATE team_members SET
  bio_pt            = 'Jornalista responsável pela comunicação e pela divulgação científica do CP2b, com registro profissional MTb 0077363/SP. Assina textos institucionais e de divulgação publicados pelo Centro desde 2025 e tem experiência anterior como jornalista, redatora e pesquisadora de cinema brasileiro. Sua atuação abrange a produção e a edição de conteúdos sobre biogás, bioprodutos e transição energética e a aproximação entre a pesquisa, o poder público, o setor produtivo e a sociedade.',
  bio_en            = 'Journalist responsible for communications and science outreach at CP2b, with professional registration MTb 0077363/SP. She has signed institutional and outreach pieces published by the Centre since 2025, and has previous experience as a journalist, writer and researcher of Brazilian cinema. Her work covers the production and editing of content on biogas, bioproducts and the energy transition, and building bridges between research, government, industry and society.',
  research_areas_pt = ARRAY['Jornalismo científico e divulgação de pesquisas em biogás, bioprodutos e transição energética', 'Produção, edição e revisão de conteúdos institucionais e jornalísticos para o CP2b', 'Comunicação pública da ciência, cobertura de eventos e aproximação entre pesquisa, governo, setor produtivo e sociedade'],
  research_areas_en = ARRAY['Science journalism and outreach on research into biogas, bioproducts and the energy transition', 'Production, editing and revision of institutional and journalistic content for CP2b', 'Public communication of science, event coverage and connecting research, government, industry and society'],
  institutional_url = COALESCE(institutional_url, 'https://cp2b.unicamp.br/noticias/lancamento-do-centro-de-pesquisa-em')
WHERE name ILIKE '%Sofia Silva%';

-- Lucas Nakamura Cerejo
UPDATE team_members SET
  bio_pt            = 'Arquiteto e urbanista, mestre e doutor em Arquitetura e Urbanismo pela PUC-Campinas, com doutorado-sanduíche no Korea Research Institute for Human Settlements, na Coreia do Sul. É pós-doutorando no Núcleo Interdisciplinar de Planejamento Energético da UNICAMP, com bolsa FAPESP, e atua no CP2b no desenvolvimento da plataforma geoespacial PILAR-2b, que integra dados territoriais, sensoriamento remoto e geoprocessamento para mapear resíduos de biomassa e estimar potenciais de biogás e bioenergia.',
  bio_en            = 'Architect and urban planner, with a master''s degree and a doctorate in Architecture and Urbanism from PUC-Campinas and a visiting doctoral period at the Korea Research Institute for Human Settlements, in South Korea. He is a postdoctoral researcher at UNICAMP''s Interdisciplinary Centre for Energy Planning, with a FAPESP scholarship, and works at CP2b on the PILAR-2b geospatial platform, which combines territorial data, remote sensing and geoprocessing to map biomass waste and estimate biogas and bioenergy potential.',
  research_areas_pt = ARRAY['Mapeamento geoespacial de resíduos de biomassa e estimativa do potencial de biogás e bioenergia', 'Sistemas de informação geográfica, sensoriamento remoto e análise espacial aplicada a cadeias agroindustriais', 'Plataformas de dados territoriais, planejamento energético e apoio à localização de recursos para energias renováveis'],
  research_areas_en = ARRAY['Geospatial mapping of biomass waste and estimation of biogas and bioenergy potential', 'Geographic information systems, remote sensing and spatial analysis applied to agro-industrial chains', 'Territorial data platforms, energy planning and support for siting renewable energy resources'],
  institutional_url = COALESCE(institutional_url, 'https://portal.dados.unicamp.br/perfil?docente=330455')
WHERE name ILIKE '%Lucas Nakamura Cerejo%';

-- Ana Beatriz Soares Aguiar
-- A confirmar com o CP2b: a ficha a enquadra no Eixo 2, enquanto o cadastro do
-- Centro a registra no Eixo 3, do qual consta como coordenadora. Eixo não
-- alterado aqui.
UPDATE team_members SET
  bio_pt            = 'Graduada em Engenharia Química pela Universidade Federal de Alfenas, mestre em Ciência e Engenharia Ambiental pela mesma instituição e doutora em Ciências, na área de Bioenergia, pelo Programa Interinstitucional de Doutorado em Bioenergia USP/UNICAMP/UNESP. Realiza pós-doutorado em Gestão de Transferência de Tecnologia e Inovação no NIPE/UNICAMP, com atuação no CP2b, e é pesquisadora em biocombustíveis na FGV Energia. Sua pesquisa concentra-se em digestão anaeróbia, co-digestão de resíduos sucroenergéticos e pecuários, produção de biogás e biometano, além de prospecção tecnológica e análise de mercado no contexto da transição energética.',
  bio_en            = 'Holds a degree in Chemical Engineering from the Federal University of Alfenas, a master''s in Environmental Science and Engineering from the same institution and a doctorate in Sciences, in the field of Bioenergy, from the USP/UNICAMP/UNESP inter-institutional doctoral programme in Bioenergy. She is a postdoctoral researcher in Technology Transfer and Innovation Management at NIPE/UNICAMP, working with CP2b, and a biofuels researcher at FGV Energia. Her research centres on anaerobic digestion, the co-digestion of sugar-energy and livestock waste, biogas and biomethane production, as well as technological foresight and market analysis in the context of the energy transition.',
  research_areas_pt = ARRAY['Digestão anaeróbia e co-digestão de resíduos agroindustriais e pecuários', 'Produção de biogás e biometano a partir de vinhaça, resíduos de cana-de-açúcar e biomassa pecuária', 'Prospecção tecnológica, gestão de inovação e análise de mercado de biocombustíveis e gás natural'],
  research_areas_en = ARRAY['Anaerobic digestion and co-digestion of agro-industrial and livestock waste', 'Production of biogas and biomethane from vinasse, sugarcane residues and livestock biomass', 'Technological foresight, innovation management and market analysis of biofuels and natural gas'],
  scopus            = COALESCE(scopus, 'https://www.scopus.com/authid/detail.uri?authorId=57204181270'),
  institutional_url = COALESCE(institutional_url, 'https://portal.edat.unicamp.br/perfil?docente=329934')
WHERE name ILIKE '%Ana Beatriz Soares Aguiar%';
