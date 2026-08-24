-- Migration 033: Update page_content (about) with Missão, Visão e Valores,
-- sync co-coordinators in research_axes, and ensure Eixo 0 researchers in team_members.

BEGIN;

-- 1. Update about page_content with missao, visao, and valores
UPDATE page_content
SET
  content_pt = content_pt || '{
    "missao": "“Desenvolver pesquisas, tecnologias e soluções inovadoras de biogás com motivação industrial, ambiental e social que promovam o aproveitamento inteligente de resíduos para o desenvolvimento sustentável”.",
    "visao": "“ser referência nacional e internacional na gestão eficiente e sustentável de resíduos urbanos e agropecuários, transformando o estado de SP em vitrine de soluções inteligentes em biogás. Para isso, o CP2B busca criar novos conhecimentos e competências, com base em ciência de ponta, que possam apoiar o desenvolvimento de soluções aplicáveis de biogás no estado de SP (ESP), articulando ações conjuntas e complementares nas esferas industrial, política, social e ambiental”.",
    "valores": "Valores CP2b estão refletidos nas competências e princípios norteadores:"
  }'::jsonb,
  content_en = content_en || '{
    "missao": "“Develop research, technologies, and innovative biogas solutions with industrial, environmental, and social motivation that promote the smart use of waste for sustainable development.”",
    "visao": "“To be a national and international reference in the efficient and sustainable management of urban and agricultural waste, transforming the State of São Paulo into a showcase of smart biogas solutions. To achieve this, CP2B seeks to create new knowledge and competencies, based on cutting-edge science, that can support the development of applicable biogas solutions in the State of São Paulo (ESP), coordinating joint and complementary actions across industrial, political, social, and environmental spheres.”",
    "valores": "CP2b values are reflected in our core competencies and guiding principles:"
  }'::jsonb
WHERE page_key = 'about';

-- 2. Update research axes coordinators
UPDATE research_axes
SET coordinator = 'Profº Drº Marcelo Pereira Cunha (Coord.), Profº Drº Luiz Gustavo Antônio de Souza (Adj.)'
WHERE axis_number = 4;

UPDATE research_axes
SET coordinator = 'Profº Drº Luis Alberto Follegatti Romero (Coord.), Profª Drª Rachel Biancalana Costa (Adj.)'
WHERE axis_number = 5;

UPDATE research_axes
SET coordinator = 'Profº Drº Rafael de Brito Dias (Coord.), Profª Drª Natalia Molina Cetrulo (Adj.), Profª Drª Thais Aparecida Dibbern (Adj.)'
WHERE axis_number = 8;

-- 3. Ensure Eixo 0 researchers in team_members
UPDATE team_members
SET is_director = TRUE, axes = COALESCE(axes, '')
WHERE name IN ('Ana Beatriz Soares Aguiar', 'Luciana Cristina Lenhari da Silva');

COMMIT;
