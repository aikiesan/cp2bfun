// Síntese das publicações do Ano 1 do CP2b (2025), para o topo de /publicacoes.
//
// Fonte: "Publicações_ANO_1_complementado_linhas_13_a_25.xlsx" e "Análise das
// Publicações CP2b 2025.docx" (pasta "análise das publicações" no Google
// Drive). Cada `count` foi recontado na planilha, artigo por artigo:
//   Q1                 → coluna "Impacto da revista" = Q1           (16 de 25)
//   Formação de RH     → "%Formação de RH" > 0                      (21 de 25)
//   Interinstitucional → "Coautoria interinstitucional" = sim       (19 de 25)
//   Internacional      → "Coautoria internacional" = sim            (7 de 25)
//   Interdisciplinar   → coluna "Eixos" com mais de um eixo         (10 de 25)
// Nenhuma das 25 tem o Marlon entre os autores (ele foi desligado do grupo e
// não deve aparecer no site); o nome só consta numa tabela de pesquisadores
// à parte, na mesma planilha, que não é usada aqui.
export const publicationsYear1 = {
  year: 2025,
  total: 25,
  metrics: [
    {
      id: 'q1', count: 16, icon: 'bi-award', color: '#00573A',
      pt: { title: 'Excelência científica', desc: 'Artigos em periódicos Q1', insight: 'Reputação em periódicos de alto impacto' },
      en: { title: 'Scientific excellence', desc: 'Articles in Q1 journals', insight: 'Reputation in high-impact journals' },
    },
    {
      id: 'rh', count: 21, icon: 'bi-mortarboard', color: '#1E3E4C', goal: 80,
      pt: { title: 'Formação de capital humano', desc: 'Autoria de mestrandos, doutorandos ou pós-doutorandos', insight: 'A nova geração assina a produção', goal: 'Meta ≥ 80% superada' },
      en: { title: 'Human capital training', desc: "Authored by master's, PhD or postdoctoral researchers", insight: 'The next generation co-authors the output', goal: 'Target ≥ 80% exceeded' },
    },
    {
      id: 'redes', count: 19, icon: 'bi-people', color: '#1F7A6D',
      pt: { title: 'Redes de parceria', desc: 'Coautoria interinstitucional', insight: 'Universidades e centros de pesquisa em rede' },
      en: { title: 'Partnership networks', desc: 'Inter-institutional co-authorship', insight: 'Universities and research centres in network' },
    },
    {
      id: 'intl', count: 7, icon: 'bi-globe-americas', color: '#3B5876',
      pt: { title: 'Inserção internacional', desc: 'Coautoria com redes globais', insight: 'Biohidrogênio, metagenômica e sustentabilidade' },
      en: { title: 'International reach', desc: 'Co-authorship with global networks', insight: 'Biohydrogen, metagenomics and sustainability' },
    },
    {
      id: 'eixos', count: 10, icon: 'bi-diagram-3', color: '#A95C00',
      pt: { title: 'Integração interdisciplinar', desc: 'Artigos que conectam múltiplos eixos do CP2b', insight: 'Conhecimento que cruza os eixos' },
      en: { title: 'Interdisciplinary integration', desc: 'Articles connecting multiple CP2b axes', insight: 'Knowledge that crosses the axes' },
    },
  ],
  // ODS em destaque na análise (foco temático, não ranking de frequência).
  sdgs: [
    { id: 7, pt: 'Energia Limpa e Acessível', en: 'Affordable and Clean Energy' },
    { id: 12, pt: 'Consumo e Produção Responsáveis', en: 'Responsible Consumption and Production' },
    { id: 13, pt: 'Ação Contra a Mudança Global do Clima', en: 'Climate Action' },
  ],
  pillars: {
    pt: ['Ciência de excelência', 'Formação', 'Colaboração', 'Internacionalização', 'Interdisciplinaridade', 'Impacto socioambiental'],
    en: ['Scientific excellence', 'Training', 'Collaboration', 'Internationalization', 'Interdisciplinarity', 'Socio-environmental impact'],
  },
};

// Análise, do .docx, condensada: uma frase de base teórica e uma linha por
// tópico — os números completos já estão no infográfico. Ajustes em relação ao
// original, conferidos na planilha:
//  - Q1: o original cita "Renewable and Sustainable Energy Reviews" e
//    "Desalination". Nenhum artigo saiu na primeira (os artigos 22 e 23 são da
//    Renewable Energy) e o artigo 2 é da "Desalination and Water Treatment",
//    Q3. Ficam os periódicos Q1 que constam na planilha.
//  - Redes e inserção internacional: os exemplos de instituições (UFF, ITA,
//    SPRU/Sussex, DTU, Aveiro) não podem ser confirmados — a planilha não
//    registra afiliações — e ficaram de fora até a equipe confirmá-los.
//  - Interdisciplinaridade: o exemplo usava áreas ("Microbiologia e
//    Biotecnologia") como se fossem eixos; o texto não cita mais exemplos.
export const publicationsAnalysis = {
  pt: {
    toggle: 'Ler a análise completa',
    intro: 'Leitura à luz das Competências Essenciais (Prahalad & Hamel), das Capacidades Dinâmicas (Teece, Pisano & Shuen) e da Visão Baseada em Recursos (Barney).',
    topics: [
      { title: 'Excelência científica', text: '16 de 25 artigos em periódicos Q1 — como Fuel, Renewable Energy, Water Research e Bioresource Technology — e 3 em Q2: reputação e autoridade acadêmica.' },
      { title: 'Formação de capital humano', text: '21 de 25 publicações com mestrandos, doutorandos ou pós-doutorandos: a meta de 80% foi superada já no primeiro ano.' },
      { title: 'Redes de parceria', text: '19 de 25 artigos em coautoria com outras universidades e centros de pesquisa.' },
      { title: 'Inserção internacional', text: '7 de 25 artigos com coautoria internacional, em biohidrogênio, metagenômica e sustentabilidade.' },
      { title: 'Integração entre eixos', text: '10 de 25 artigos conectam mais de um eixo do CP2b — a competência essencial em consolidação no Centro.' },
      { title: 'ODS', text: 'Produção concentrada nos ODS 7, 12 e 13, reforçando o papel do CP2b como laboratório vivo de impacto socioambiental.' },
    ],
  },
  en: {
    toggle: 'Read the full analysis',
    intro: 'Read in the light of Core Competencies (Prahalad & Hamel), Dynamic Capabilities (Teece, Pisano & Shuen) and the Resource-Based View (Barney).',
    topics: [
      { title: 'Scientific excellence', text: '16 of 25 articles in Q1 journals — such as Fuel, Renewable Energy, Water Research and Bioresource Technology — and 3 in Q2: academic reputation and authority.' },
      { title: 'Human capital training', text: "21 of 25 publications with master's, PhD or postdoctoral authors: the 80% target was exceeded in the first year." },
      { title: 'Partnership networks', text: '19 of 25 articles co-authored with other universities and research centres.' },
      { title: 'International reach', text: '7 of 25 articles with international co-authors, on biohydrogen, metagenomics and sustainability.' },
      { title: 'Cross-axis integration', text: '10 of 25 articles connect more than one CP2b axis — the core competency being consolidated at the Centre.' },
      { title: 'SDGs', text: "Output concentrated on SDGs 7, 12 and 13, reinforcing CP2b's role as a living lab for socio-environmental impact." },
    ],
  },
};
