// Nuvem de palavras do CP2b — de "Nuvem de palavras.docx", que analisou as
// oito abas da planilha estratégica (publicações e competências dos eixos).
// Segundo o documento: foram removidos números, datas, URLs, DOI, palavras
// funcionais, cabeçalhos, nomes próprios e siglas; gênero e número foram
// agrupados; expressões sobrepostas contam separadamente.
//
// `n` é o número de ocorrências no documento (em português). O `en` é só a
// tradução do termo para a versão em inglês do site; a contagem é a do corpus
// original.
export const wordCloudSource = {
  pt: 'Termos mais frequentes nas publicações e nas competências dos eixos do CP2b.',
  en: 'Most frequent terms in CP2b publications and axis competencies (counted in the Portuguese source).',
};

export const topWords = [
  { pt: 'biogás', en: 'biogas', n: 191 },
  { pt: 'desenvolvimento', en: 'development', n: 187 },
  { pt: 'científico', en: 'scientific', n: 168 },
  { pt: 'resíduo', en: 'waste', n: 165 },
  { pt: 'ambiental', en: 'environmental', n: 155 },
  { pt: 'pesquisa', en: 'research', n: 153 },
  { pt: 'produção', en: 'production', n: 149 },
  { pt: 'processo', en: 'process', n: 143 },
  { pt: 'engenharia', en: 'engineering', n: 136 },
  { pt: 'gestão', en: 'management', n: 128 },
  { pt: 'tecnologia', en: 'technology', n: 122 },
  { pt: 'sistema', en: 'system', n: 118 },
  { pt: 'energético', en: 'energy (adj.)', n: 117 },
  { pt: 'ciência', en: 'science', n: 114 },
  { pt: 'política', en: 'policy', n: 106 },
  { pt: 'público', en: 'public', n: 106 },
  { pt: 'sustentável', en: 'sustainable', n: 95 },
  { pt: 'energia', en: 'energy', n: 95 },
  { pt: 'setor', en: 'sector', n: 93 },
  { pt: 'solução', en: 'solution', n: 87 },
  { pt: 'capacidade', en: 'capacity', n: 86 },
  { pt: 'planejamento', en: 'planning', n: 85 },
  { pt: 'social', en: 'social', n: 80 },
  { pt: 'industrial', en: 'industrial', n: 79 },
  { pt: 'inovação', en: 'innovation', n: 76 },
  { pt: 'formação', en: 'training', n: 71 },
  { pt: 'tecnológico', en: 'technological', n: 67 },
  { pt: 'conhecimento', en: 'knowledge', n: 67 },
  { pt: 'sustentabilidade', en: 'sustainability', n: 67 },
  { pt: 'tratamento', en: 'treatment', n: 65 },
  { pt: 'potencial', en: 'potential', n: 64 },
  { pt: 'bioproduto', en: 'bioproduct', n: 62 },
  { pt: 'bioenergia', en: 'bioenergy', n: 58 },
  { pt: 'biológico', en: 'biological', n: 58 },
  { pt: 'recurso', en: 'resource', n: 56 },
];

// As 12 expressões compostas mais frequentes (o documento lista 40).
export const topExpressions = [
  { pt: 'produção de biogás', en: 'biogas production', n: 41 },
  { pt: 'desenvolvimento sustentável', en: 'sustainable development', n: 38 },
  { pt: 'políticas públicas', en: 'public policy', n: 38 },
  { pt: 'transição energética', en: 'energy transition', n: 27 },
  { pt: 'biogás e bioprodutos', en: 'biogas and bioproducts', n: 27 },
  { pt: 'meio ambiente', en: 'environment', n: 24 },
  { pt: 'capacidade técnica', en: 'technical capacity', n: 23 },
  { pt: 'engenharia ambiental', en: 'environmental engineering', n: 21 },
  { pt: 'digestão anaeróbia', en: 'anaerobic digestion', n: 20 },
  { pt: 'pesquisa científica', en: 'scientific research', n: 19 },
  { pt: 'resíduos sólidos', en: 'solid waste', n: 19 },
  { pt: 'ensino superior', en: 'higher education', n: 18 },
];
