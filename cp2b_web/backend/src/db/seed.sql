-- CP2B CMS Seed Data
-- Initial data from content.js

-- News articles
INSERT INTO news (slug, title_pt, title_en, description_pt, description_en, image, badge, badge_color, date_display, published_at) VALUES
('metaninho-mascote',
 'Conheça o Metaninho: o novo mascote do CP2B!',
 'Meet Metaninho: the new CP2B mascot!',
 'Para celebrar o final de ano, apresentamos nosso mascote que representa a molécula de metano e a identidade visual do centro. Uma ferramenta lúdica para educação científica.',
 'To celebrate the end of the year, we present our mascot representing the methane molecule and the center''s visual identity. A playful tool for scientific education.',
 '/assets/CP2B-AVATAR-BR@8x.png',
 'Institucional',
 'success',
 '18 DEZ 2025',
 '2025-12-18'),

('workshop-anual-2025',
 'I Workshop Anual do CP2B marca avanços em 2025',
 'I CP2B Annual Workshop marks advances in 2025',
 'Evento reuniu pesquisadores para apresentar resultados dos oito eixos temáticos e assinar o Regimento Interno, consolidando a governança do centro.',
 'The event brought together researchers to present results from the eight thematic axes and sign the Internal Regulations, consolidating the center''s governance.',
 '/assets/DSC00339-500x333.jpg',
 'Eventos',
 'primary',
 '02 DEZ 2025',
 '2025-12-02'),

('biogas-cop30',
 'O papel estratégico do Biogás na COP30 em Belém',
 'The strategic role of Biogas at COP30 in Belém',
 'A COP na Amazônia destaca soluções baseadas na natureza. O biogás surge como tecnologia chave para a bioeconomia da floresta e descarbonização.',
 'COP in the Amazon highlights nature-based solutions. Biogas emerges as a key technology for the forest bioeconomy and decarbonization.',
 '/assets/biogas-2919235_1280.jpg',
 'Artigo',
 'info',
 'NOV 2025',
 '2025-11-15'),

('cau-2025',
 'Delegação da China Agricultural University visita o NIPE e CP2B',
 'China Agricultural University delegation visits NIPE and CP2B',
 'Visita da China Agricultural University (CAU) para fortalecer laços de pesquisa e cooperação internacional...',
 'Visit from China Agricultural University (CAU) to strengthen research ties and international cooperation...',
 '/assets/20250618_Cepid_LUC_6420_Capa-1.jpg',
 'Internacional',
 'success',
 '29 JUL 2025',
 '2025-07-29')
ON CONFLICT (slug) DO NOTHING;

-- Page content
INSERT INTO page_content (page_key, content_pt, content_en) VALUES
('about',
 '{"resumo": "O Centro Paulista de Estudos em Biogás e Bioprodutos é dedicado ao tema \"Aproveitamento inteligente de resíduos para o desenvolvimento sustentável\" e visa criar competências com base em ciência que conduzam ao desenvolvimento e aplicações de soluções inovadoras de biogás. Os sistemas energéticos sociotécnicos que incluem soluções de biogás têm um desempenho de sustentabilidade bastante positivo uma vez que tratam resíduos, produzem combustível renovável e criam nutrientes renováveis para as plantas. No Estado de São Paulo (ESP) há muito substrato disponível - um potencial de mais de 4,5 bilhões de m3 ano de biogás - assim como uma grande demanda por seus bioprodutos, mas apenas uma fração deste potencial é aproveitada.\n\nO papel do CP2B é criar novos conhecimentos e competências que levem a soluções aplicáveis ao biogás no Estado, e articular ações conjuntas nas esferas industrial, política, social e ambiental. O CP2B tem por principal objetivo contribuir para a gestão de resíduos orgânicos e lignocelulósicos - urbanos e agroindustriais -, com prioridade para as ações voltadas à gestão pública de resíduos em setores estratégicos para a economia do estado.\n\nEm 2022, o setor sucroenergético injetou mais de R$50 bilhões na economia do estado, que responde por 50% da produção nacional de cana, por 44% do etanol e 60% de açúcar (safra 2023/24). O potencial de produção de biogás neste setor representa mais de 50% do potencial nacional, sendo que a integração com outros setores por meio de ecopólos ou ecoparques deve resultar em soluções sustentáveis e inovadoras.\n\nO centro irá atuar de forma transdisciplinar, organizado em oito eixos temáticos integrados, seguindo o conceito de laboratório vivo, com projetos que experimentam em campo novas soluções e tecnologias.", "objetivos": "O objetivo principal do CP2B é contribuir para a gestão de resíduos orgânicos e lignocelulósicos no ESP nos segmentos urbano e agroindustrial, com prioridade para as ações voltadas à gestão pública de resíduos e setores estratégicos para a economia do estado (como o sucroenergético).\n\nIsso será feito por meio da pesquisa científica e tecnológica visando o desenvolvimento de modelos inovadores de produção de biogás e bioprodutos, explorando e integrando os conceitos de biorrefinaria, bioenergia e bioeconomia.\n\nA concepção do CP2B e sua própria missão preveem a forte integração das pesquisas básica e aplicada como princípio para criação de soluções inteligentes na temática da gestão de resíduos urbanos e agropecuários com foco no desenvolvimento sustentável.", "resultados": "Entre os principais resultados esperados estão:\n(i) Arranjos tecnológicos para integração dos setores produtivos com foco na recuperação de bioenergia a partir de resíduos e/ou substratos;\n(ii) Capacitação técnica de profissionais do setor de biogás e/ou estudantes de graduação e pós-graduação;\n(iii) Redução das desigualdades sociais;\n(iv) Educação ambiental."}'::jsonb,
 '{"resumo": "The São Paulo Center for Biogas and Bioproducts Studies is dedicated to the theme \"Intelligent use of waste for sustainable development\" and aims to create science-based skills that lead to the development and applications of innovative biogas solutions. Sociotechnical energy systems that include biogas solutions have a very positive sustainability performance as they treat waste, produce renewable fuel and create renewable nutrients for plants. In the State of São Paulo (ESP) there is a lot of substrate available - a potential of more than 4.5 billion m3 of biogas per year - as well as a great demand for its bioproducts, but only a fraction of this potential is used.\n\nCP2B''s role is to create new knowledge and skills that lead to applicable solutions for biogas in the State, and to articulate joint actions in the industrial, political, social and environmental spheres. CP2B''s main objective is to contribute to the management of organic and lignocellulosic waste - urban and agro-industrial -, with priority given to actions aimed at public waste management in strategic sectors for the state''s economy.\n\nIn 2022, the sugar-energy sector injected more than R$50 billion into the state''s economy, which accounts for 50% of national sugarcane production, 44% of ethanol and 60% of sugar (2023/24 harvest). The potential for biogas production in this sector represents more than 50% of the national potential, and integration with other sectors through eco-poles or eco-parks should result in sustainable and innovative solutions.\n\nThe center will operate in a transdisciplinary way, organized into eight integrated thematic axes, following the concept of a living laboratory, with projects that experiment in the field with new solutions and technologies.", "objetivos": "The main objective of CP2B is to contribute to the management of organic and lignocellulosic waste in the ESP in the urban and agro-industrial segments, with priority for actions aimed at public waste management and strategic sectors for the state''s economy (such as the sugar-energy sector).\n\nThis will be done through scientific and technological research aiming at the development of innovative models for the production of biogas and bioproducts, exploring and integrating the concepts of biorefinery, bioenergy and bioeconomy.\n\nThe conception of CP2B and its own mission foresee the strong integration of basic and applied research as a principle for the creation of intelligent solutions in the field of urban and agricultural waste management with a focus on sustainable development.", "resultados": "Among the main expected results are:\n(i) Technological arrangements for the integration of productive sectors with a focus on bioenergy recovery from waste and/or substrates;\n(ii) Technical training of professionals in the biogas sector and/or undergraduate and graduate students;\n(iii) Reduction of social inequalities;\n(iv) Environmental education."}'::jsonb)
ON CONFLICT (page_key) DO NOTHING;

-- Research axes
INSERT INTO research_axes (axis_number, title_pt, title_en, coordinator, content_pt, content_en, sdgs) VALUES
(1, 'Eixo 1 – Inventário de Resíduos e Mapeamento Tecnológico', 'Axis 1 – Waste Inventory and Technology Mapping', 'Profº Drº Rubens Augusto Camargo Lamparelli',
 'O Eixo 1 busca ir além dos levantamentos tradicionais de potencial de biomassa. A proposta é trabalhar com dados mais detalhados e precisos, que permitam enxergar de perto quem produz resíduos, onde estão localizados e como se relacionam com as infraestruturas ao redor.\nUsando técnicas de georreferenciamento, o Eixo 1 pretende mapear as cadeias agroindustriais e identificar oportunidades de aproveitamento desses resíduos, seja dentro da própria cadeia produtiva ou conectando diferentes setores.\nA ideia é criar uma plataforma digital acessível que funcione como ponte entre quem gera resíduos e quem pode transformá-los em novos produtos.\nEste eixo se alinha aos Objetivos de Desenvolvimento Sustentável: 7, 11, 13 e 15.',
 'Axis 1 seeks to go beyond traditional biomass potential surveys. The proposal is to work with more detailed and precise data, allowing for a closer look at who produces waste, where they are located, and how they relate to the surrounding infrastructure.\nUsing georeferencing techniques, Axis 1 aims to map agro-industrial chains and identify opportunities for waste recovery, whether within the same production chain or by connecting different sectors.\nThe idea is to create an accessible digital platform that functions as a bridge between those who generate waste and those who can transform it into new products.\nThis axis aligns with Sustainable Development Goals: 7, 11, 13, and 15.',
 ARRAY[7, 11, 13, 15]),

(2, 'Eixo 2 – Ciência e Tecnologia de Base', 'Axis 2 – Basic Science and Technology', 'Profº Drº Lucas Tadeu Fuess (Coord.), Profª Drª Priscila Rosseto Camiloti (Adj.)',
 'O Eixo 2 se dedica à pesquisa científica fundamental que sustenta os avanços tecnológicos na cadeia do biogás. O principal desafio é a operação de reatores biológicos durante a entressafra da cana-de-açúcar.\nAs pesquisas serão organizadas em três etapas: upstream, midstream e downstream.\nEste eixo contribui para os Objetivos de Desenvolvimento Sustentável: 2, 6, 7 e 9.',
 'Axis 2 is dedicated to fundamental scientific research that supports technological advances in the biogas chain. The main challenge is the operation of biological reactors during the sugarcane off-season.\nResearch will be organized into three stages: upstream, midstream, and downstream.\nThis axis contributes to Sustainable Development Goals: 2, 6, 7, and 9.',
 ARRAY[2, 6, 7, 9]),

(3, 'Eixo 3 – Engenharia de Processos e Bioprocessos', 'Axis 3 – Process and Bioprocess Engineering', 'Profª Drª Luana Mattos de Oliveira Cruz (Coord.), Profº Drº Enelton Fagnani (Adj.)',
 'O Eixo 3 é o momento de tirar as ideias do papel e testar em escala maior. O objetivo é ajudar os parceiros a atravessar o famoso "vale da morte" tecnológico.\nAs pesquisas alcançarão níveis de maturidade tecnológica (TRL) 6 e 7. A parceria com empresas é o coração deste eixo (SABESP, COPERCANA, Embrapii).\nEste eixo materializa a ponte entre academia e mercado. ODS: 2, 6, 7, 9 e 17.',
 'Axis 3 is the moment to put ideas into practice and test them on a larger scale. The goal is to help partners cross the famous technological "valley of death."\nResearch will reach technological readiness levels (TRL) 6 and 7. Partnerships with companies are the heart of this axis (SABESP, COPERCANA, Embrapii).\nThis axis materializes the bridge between academia and the market. SDGs: 2, 6, 7, 9, and 17.',
 ARRAY[2, 6, 7, 9, 17]),

(4, 'Eixo 4 – Avaliação Integrada Socioeconômica, Ambiental e Energética', 'Axis 4 – Integrated Socioeconomic, Environmental, and Energy Assessment', 'Profº Drº Marcelo Pereira Cunha',
 'O Eixo 4 é o espaço da reflexão crítica. Sua missão é avaliar os impactos socioeconômicos, ambientais e energéticos.\nO eixo vai construir e avaliar cenários que subsidiem a formulação de políticas públicas.\nSerão utilizadas ferramentas como Análise de Ciclo de Vida (ACV) e Análise Insumo-Produto.\nODS: 8, 12 e 13.',
 'Axis 4 is the space for critical reflection. Its mission is to assess socioeconomic, environmental, and energy impacts.\nThe axis will build and evaluate scenarios that support the formulation of public policies.\nTools such as Life Cycle Assessment (LCA) and Input-Output Analysis will be used.\nSDGs: 8, 12, and 13.',
 ARRAY[8, 12, 13]),

(5, 'Eixo 5 – Inovação em Bioprodutos na Cadeia do Biogás', 'Axis 5 – Bioproduct Innovation in the Biogas Chain', 'Profº Drº Luis Alberto Follegatti Romero',
 'O Eixo 5 mergulha no conceito de biorrefinaria. A vinhaça é um bom exemplo de foco, contendo ácidos orgânicos de alto valor.\nA aposta é o biohitano (combinação de hidrogênio e metano).\nEste eixo contribui para os Objetivos de Desenvolvimento Sustentável: 7, 9 e 17.',
 'Axis 5 dives into the biorefinery concept. Vinasse is a prime focus, containing high-value organic acids.\nThe focus is on biohitane (a combination of hydrogen and methane).\nThis axis contributes to Sustainable Development Goals: 7, 9, and 17.',
 ARRAY[7, 9, 17]),

(6, 'Eixo 6 – Educação e Capacitação', 'Axis 6 – Education and Training', 'Profª Drª Renata Piacentini Rodriguez (Coord.), Profª Drª Bruna de Souza Moraes (Adj.)',
 'O Eixo 6 é dedicado à formação de pessoas. O CP2B vai atuar como centro de capacitação profissional oferecendo cursos.\nNo desenvolvimento social, atuará na educação socioambiental de comunidades periféricas (ex: Comunidade Capadócia).\nODS: 1, 4, 5, 10, 12, 13 e 16.',
 'Axis 6 is dedicated to human resources training. CP2B will act as a professional training center offering courses.\nIn social development, it will work on socio-environmental education for peripheral communities (e.g., Capadócia Community).\nSDGs: 1, 4, 5, 10, 12, 13, and 16.',
 ARRAY[1, 4, 5, 10, 12, 13, 16]),

(7, 'Eixo 7 – Difusão Científica e Comunicação', 'Axis 7 – Scientific Dissemination and Communication', 'Profª Drª Maria Paula Cardeal Volpi (Coord.), Profª Drª Renata Piacentini Rodriguez (Adj.)',
 'O conhecimento precisa ultrapassar os muros da universidade. O centro vai promover visitas científicas, palestras e projetos de estímulo à ciência.\nODS: 4, 7 e 17.',
 'Knowledge needs to go beyond the university walls. The center will promote scientific visits, lectures, and projects to stimulate science.\nSDGs: 4, 7, and 17.',
 ARRAY[4, 7, 17]),

(8, 'Eixo 8 – Políticas Públicas e Inovação Regulatória', 'Axis 8 – Public Policies and Regulatory Innovation', 'Profº Drº Rafael de Brito Dias (Coord.), Profª Drª Natalia Molina Cetrulo (Adj.)',
 'O Eixo 8 analisa políticas públicas e propõe arranjos que otimizem as agendas.\nPrevê a realização de uma "oficina de inovação regulatória" e criação de um conselho com poder público e sociedade civil.\nODS: 1, 10, 13, 16 e 17.',
 'Axis 8 analyzes public policies and proposes arrangements that optimize agendas.\nIt foresees the realization of a "regulatory innovation workshop" and the creation of a council with public authorities and civil society.\nSDGs: 1, 10, 13, 16, and 17.',
 ARRAY[1, 10, 13, 16, 17])
ON CONFLICT (axis_number) DO NOTHING;

-- Team members - Coordinators
INSERT INTO team_members (name, role_pt, role_en, institution, email, phone, category, sort_order) VALUES
('Bruna de Souza Moraes', 'Diretora / Pesquisadora Responsável', 'Director / Lead Researcher', 'NIPE/UNICAMP', 'bsmoraes@unicamp.br', '+55 (19) 3521-1241', 'coordinators', 1),
('Renata Piacentini Rodriguez', 'Vice-Diretora / Pesquisadora Responsável (Parceira)', 'Vice-Director / Lead Researcher (Partner)', 'ICT/UNIFAL', 'renata.rodriguez@unifal-mg.edu.br', NULL, 'coordinators', 2),
('Alessandro Sanches Pereira', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'Curtin University/CU', NULL, NULL, 'coordinators', 3),
('Anderson Targino da Silva Ferreira', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'Centro de Pós-Graduação e Pesquisa/CEPPE/UNG', NULL, NULL, 'coordinators', 4),
('Bruno Sidnei da Silva', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 5),
('Daniel de Oliveira Silva', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 6),
('Gabriel Dias Mangolini Neves', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 7),
('Jens Bo Holm-Nielsen', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'Aalborg University (AAU)', NULL, NULL, 'coordinators', 8),
('José Octavio Armani Paschoal', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 9),
('Juliana Paula da Silva Ulian', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'FEM/UNICAMP', NULL, NULL, 'coordinators', 10),
('Leidiane Mariani', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'Amplum Biogás', NULL, NULL, 'coordinators', 11),
('Leonardo Vasconcelos Fregolente', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'FEQ/UNICAMP', NULL, NULL, 'coordinators', 12),
('Marcelo Kenji Miki', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 13),
('Paola Mercadante Petry', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'COMGAS', NULL, NULL, 'coordinators', 14),
('Rubens Maciel Filho', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', 'FEQ/UNICAMP', NULL, NULL, 'coordinators', 15),
('Ângela Cruz Guirao', 'Pesquisador Responsável na Instituição Parceira', 'Lead Researcher at Partner Institution', NULL, NULL, NULL, 'coordinators', 16);

-- Team members - Principal Investigators
INSERT INTO team_members (name, role_pt, role_en, institution, email, category, sort_order) VALUES
('José Maria Ferreira Jardim da Silveira', 'Pesquisador Principal', 'Principal Investigator', 'IE/UNICAMP', NULL, 'principals', 1),
('Luis Alberto Follegatti Romero', 'Pesquisador Principal', 'Principal Investigator', 'EP/USP', NULL, 'principals', 2),
('Rafael de Brito Dias', 'Pesquisador Principal', 'Principal Investigator', 'FCA/UNICAMP', NULL, 'principals', 3),
('Rubens Augusto Camargo Lamparelli', 'Pesquisador Principal', 'Principal Investigator', 'NIPE/UNICAMP', 'lamparel@unicamp.br', 'principals', 4);

-- Team members - Associates (sample)
INSERT INTO team_members (name, role_pt, role_en, institution, category, sort_order) VALUES
('Aline Veronese da Silva', 'Pesquisador Associado', 'Associate Researcher', 'IE/UNICAMP', 'associates', 1),
('Barbara Janet Teruel Mederos', 'Pesquisador Associado', 'Associate Researcher', 'FEAGRI/UNICAMP', 'associates', 2),
('Caio Henrique Rufino', 'Pesquisador Associado', 'Associate Researcher', 'FEM/UNICAMP', 'associates', 3),
('Carla Kazue Nakao Cavaliero', 'Pesquisador Associado', 'Associate Researcher', 'FEM/UNICAMP', 'associates', 4),
('Daniel Francisco Nagao Menezes', 'Pesquisador Associado', 'Associate Researcher', 'FACAMP', 'associates', 5),
('Daniel Henrique Dario Capitani', 'Pesquisador Associado', 'Associate Researcher', 'FCA/UNICAMP', 'associates', 6),
('Dante Chiavareto Pezzin', 'Pesquisador Associado', 'Associate Researcher', 'NICS/UNICAMP', 'associates', 7),
('Danúsia Arantes Ferreira', 'Pesquisador Associado', 'Associate Researcher', 'FEEC/UNICAMP', 'associates', 8),
('Enelton Fagnani', 'Pesquisador Associado', 'Associate Researcher', 'FT/UNICAMP', 'associates', 9),
('Flávia Luciane Consoni', 'Pesquisador Associado', 'Associate Researcher', 'IG/UNICAMP', 'associates', 10),
('Gustavo Mockaitis', 'Pesquisador Associado', 'Associate Researcher', 'FEAGRI/UNICAMP', 'associates', 11),
('Hildo Guillardi Júnior', 'Pesquisador Associado', 'Associate Researcher', 'FESJBV/UNESP', 'associates', 12),
('Ivo Leandro Dorileo', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 13),
('Joni de Almeida Amorim', 'Pesquisador Associado', 'Associate Researcher', 'FEEC/UNICAMP', 'associates', 14),
('João Guilherme Ito Cypriano', 'Pesquisador Associado', 'Associate Researcher', 'FEEC/UNICAMP', 'associates', 15),
('Karla Adriana Martins Bessa', 'Pesquisador Associado', 'Associate Researcher', 'PAGU/UNICAMP', 'associates', 16),
('Leandro Wang Hantao', 'Pesquisador Associado', 'Associate Researcher', 'IQ/UNICAMP', 'associates', 17),
('Lira Luz Benites Lazaro', 'Pesquisador Associado', 'Associate Researcher', 'FEEC/UNICAMP', 'associates', 18),
('Luana Mattos de Oliveira Cruz', 'Pesquisador Associado', 'Associate Researcher', 'FEC/UNICAMP', 'associates', 19),
('Lucas Tadeu Fuess', 'Pesquisador Associado', 'Associate Researcher', 'EESC/USP', 'associates', 20),
('Luciana Cristina Lenhari da Silva', 'Pesquisador Associado', 'Associate Researcher', 'IG/UNICAMP', 'associates', 21),
('Luiz Carlos Pereira da Silva', 'Pesquisador Associado', 'Associate Researcher', 'FEEC/UNICAMP', 'associates', 22),
('Luiz Carlos Roma Júnior', 'Pesquisador Associado', 'Associate Researcher', 'IZ/SAASP', 'associates', 23),
('Luiz Gustavo Antonio de Souza', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 24),
('Marcelo Antunes Nolasco', 'Pesquisador Associado', 'Associate Researcher', 'EACH/USP', 'associates', 25),
('Marcelo de Carvalho Pereira', 'Pesquisador Associado', 'Associate Researcher', 'IE/UNICAMP', 'associates', 26),
('Marcelo Marques de Magalhães', 'Pesquisador Associado', 'Associate Researcher', 'CET/UNESP', 'associates', 27),
('Marcelo Pereira da Cunha', 'Pesquisador Associado', 'Associate Researcher', 'IE/UNICAMP', 'associates', 28),
('Marcelo Zaiat', 'Pesquisador Associado', 'Associate Researcher', 'EESC/USP', 'associates', 29),
('Maria Paula Cardeal Volpi', 'Pesquisador Associado', 'Associate Researcher', 'ESALQ/USP', 'associates', 30),
('Mariana Conceição da Costa', 'Pesquisador Associado', 'Associate Researcher', 'FEQ/UNICAMP', 'associates', 31),
('Marlon Fernandes de Souza', 'Pesquisador Associado', 'Associate Researcher', 'ESALQ/USP', 'associates', 32),
('Mauro Donizeti Berni', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 33),
('Natalia Molina Cetrulo', 'Pesquisador Associado', 'Associate Researcher', 'EACH/USP', 'associates', 34),
('Patricia Jacqueline Thyssen', 'Pesquisador Associado', 'Associate Researcher', 'IB/UNICAMP', 'associates', 35),
('Patricia Nunes da Silva Mariuzzo', 'Pesquisador Associado', 'Associate Researcher', 'IE/UNICAMP', 'associates', 36),
('Paulo Cesar Souza Manduca', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 37),
('Paulo Sergio Graziano Magalhães', 'Pesquisador Associado', 'Associate Researcher', 'UPP', 'associates', 38),
('Priscila Rosseto Camiloti', 'Pesquisador Associado', 'Associate Researcher', 'IEE/USP', 'associates', 39),
('Sarita Cândida Rabelo', 'Pesquisador Associado', 'Associate Researcher', 'FCA/UNESP', 'associates', 40),
('Sergio Valdir Bajay', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 41),
('Solange Teles da Silva', 'Pesquisador Associado', 'Associate Researcher', 'CPG/UPM', 'associates', 42),
('Sonia Regina da Cal Seixas', 'Pesquisador Associado', 'Associate Researcher', 'NIPE/UNICAMP', 'associates', 43),
('Thais Aparecida Dibbern', 'Pesquisador Associado', 'Associate Researcher', 'FCA/UNICAMP', 'associates', 44),
('Thalita dos Santos Dalbelo', 'Pesquisador Associado', 'Associate Researcher', 'FEC/UNICAMP', 'associates', 45),
('Valeria Maia Merzel', 'Pesquisador Associado', 'Associate Researcher', 'CPQBA/UNICAMP', 'associates', 46),
('Waldyr Luiz Ribeiro Gallo', 'Pesquisador Associado', 'Associate Researcher', 'FEM/UNICAMP', 'associates', 47);

-- Team members - Support
INSERT INTO team_members (name, role_pt, role_en, institution, category, sort_order) VALUES
('Bruno Felipe Veloso', 'Apoio Técnico', 'Technical Support', 'CCUEC/UNICAMP', 'support', 1),
('Joaquim Eugênio Abel Seabra', 'Apoio Técnico', 'Technical Support', 'FEM/UNICAMP', 'support', 2),
('Raffaella Rossetto', 'Apoio Técnico', 'Technical Support', 'APTA/SAASP', 'support', 3),
('Magali Luzia Maróstica', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', 4),
('Paulo César de Almeida Pinheiro', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', 5),
('Rosângela Pedroz', 'Apoio Administrativo', 'Administrative Support', 'NIPE/UNICAMP', 'support', 6);

-- Team members - Students
INSERT INTO team_members (name, role_pt, role_en, institution, category, sort_order) VALUES
('Denis da Silva Miranda', 'Estudante sem Bolsa', 'Student without Scholarship', NULL, 'students', 1),
('Raquel Teixeira Gomes Magri', 'Estudante sem Bolsa', 'Student without Scholarship', 'FEEC/UNICAMP', 'students', 2);
