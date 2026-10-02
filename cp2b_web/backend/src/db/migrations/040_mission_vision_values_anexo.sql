-- Migration 040: Missão e Visão revisadas e novo valor institucional.
--
-- Fonte: apresentação "Missão, Visão, Valores e Objetivos do CP2b" — a Missão
-- e a Visão passam a nomear explicitamente um desenvolvimento "inclusivo e
-- equitativo", e a diversidade e a equidade de gênero entram como valor.
-- Idempotente — o `||` sobrescreve as chaves existentes no JSONB.

BEGIN;

UPDATE page_content
SET
  content_pt = content_pt || '{
    "missao": "“Desenvolver pesquisas, tecnologias e soluções inovadoras em biogás, com motivação industrial, ambiental e social, promovendo o aproveitamento inteligente de resíduos e contribuindo para um desenvolvimento sustentável, inclusivo e equitativo”.",
    "visao": "“Ser referência nacional e internacional na gestão eficiente e sustentável de resíduos urbanos e agropecuários, transformando o estado de São Paulo em vitrine de soluções inteligentes em biogás e de desenvolvimento sustentável, inclusivo e equitativo. Para isso, o CP2B busca criar novos conhecimentos e competências, com base em ciência de ponta, que possam apoiar o desenvolvimento de soluções aplicáveis de biogás no estado de SP (ESP), articulando ações conjuntas e complementares nas esferas industrial, política, social e ambiental”."
  }'::jsonb,
  content_en = content_en || '{
    "missao": "“Develop research, technologies, and innovative biogas solutions with industrial, environmental, and social motivation, promoting the smart use of waste and contributing to sustainable, inclusive and equitable development.”",
    "visao": "“To be a national and international reference in the efficient and sustainable management of urban and agricultural waste, transforming the State of São Paulo into a showcase of smart biogas solutions and of sustainable, inclusive and equitable development. To achieve this, CP2B seeks to create new knowledge and competencies, based on cutting-edge science, that can support the development of applicable biogas solutions in the State of São Paulo (ESP), coordinating joint and complementary actions across industrial, political, social, and environmental spheres.”"
  }'::jsonb
WHERE page_key = 'about';

COMMIT;
