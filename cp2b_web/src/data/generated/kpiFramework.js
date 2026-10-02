// Sistema de Indicadores e Pesos do CP2b — 7 dimensões, 35 indicadores.
// Fonte: "Planejamento e gestão integrada do CP2b.pptx" (slide "Sistema de
// Indicadores e Pesos — CP2b"), material da planilha estratégica v2 (Luciana,
// ago/2026). O slide é uma imagem sem camada de texto; os valores abaixo foram
// transcritos manualmente a partir dela e devem ser conferidos contra a
// próxima versão do material antes de qualquer atualização.
//
// Este arquivo é o arcabouço de MONITORAMENTO (dimensões, indicadores, pesos
// e o que cada indicador mede) — não contém valores realizados/apurados.
//
// NOTA: o cabeçalho do slide de origem anuncia "35 indicadores", mas a lista
// detalhada soma 38 itens (7+6+5+5+5+5+5), com os pesos batendo exatamente
// 100% em cada dimensão. Tratado como um erro de rótulo no material de
// origem, não como erro de transcrição — ver kpiFramework.test.js.

export const kpiVision2035 = {
  pt: [
    'Referência latino-americana em biogás, biometano, bioprodutos e bioeconomia circular.',
    'Liderança científica e tecnológica reconhecida internacionalmente.',
    'Tecnologias competitivas e amplamente adotadas.',
    'Impacto positivo mensurável na transição energética e na sociedade.',
  ],
  en: [
    'Latin American reference in biogas, biomethane, bioproducts and circular bioeconomy.',
    'Internationally recognized scientific and technological leadership.',
    'Competitive and widely adopted technologies.',
    'Measurable positive impact on energy transition and society.',
  ],
};

export const kpiPrinciples = {
  pt: ['Excelência', 'Impacto', 'Sustentabilidade', 'Inovação', 'Ética e Transparência', 'Colaboração'],
  en: ['Excellence', 'Impact', 'Sustainability', 'Innovation', 'Ethics and Transparency', 'Collaboration'],
};

// 7 dimensões — a soma dos pesos deve ser sempre 100.
export const kpiDimensions = [
  {
    id: 'cientifica',
    weight: 20,
    color: '#2f6fd6', // azul
    pt: { title: 'Dimensão Científica' },
    en: { title: 'Scientific Dimension' },
    indicators: [
      { code: '1.1', weight: 5, pt: { name: 'Artigos em periódicos Q1', measures: 'Produção científica de alto impacto' }, en: { name: 'Q1 journal articles', measures: 'High-impact scientific output' } },
      { code: '1.2', weight: 3, pt: { name: 'Fator de Impacto Normalizado (FWCI)', measures: 'Impacto relativo das publicações' }, en: { name: 'Field-Weighted Citation Impact (FWCI)', measures: 'Relative impact of publications' } },
      { code: '1.3', weight: 3, pt: { name: 'Citações por documento', measures: 'Relevância do conhecimento gerado' }, en: { name: 'Citations per document', measures: 'Relevance of the knowledge generated' } },
      { code: '1.4', weight: 3, pt: { name: 'Índice h do centro', measures: 'Produtividade e impacto acumulado' }, en: { name: 'Center h-index', measures: 'Cumulative productivity and impact' } },
      { code: '1.5', weight: 2, pt: { name: 'Publicações internacionais (%)', measures: 'Colaboração e visibilidade global' }, en: { name: 'International publications (%)', measures: 'Global collaboration and visibility' } },
      { code: '1.6', weight: 2, pt: { name: 'Projetos de pesquisa ativos', measures: 'Vitalidade da pesquisa' }, en: { name: 'Active research projects', measures: 'Research vitality' } },
      { code: '1.7', weight: 2, pt: { name: 'Dados e bases científicas geradas', measures: 'Geração de ativos de conhecimento' }, en: { name: 'Scientific data and databases generated', measures: 'Generation of knowledge assets' } },
    ],
  },
  {
    id: 'tecnologica',
    weight: 20,
    color: '#3fa34d', // verde
    pt: { title: 'Dimensão Tecnológica e Inovação' },
    en: { title: 'Technological and Innovation Dimension' },
    indicators: [
      { code: '2.1', weight: 4, pt: { name: 'Patentes depositadas', measures: 'Capacidade de proteção' }, en: { name: 'Patents filed', measures: 'Protection capacity' } },
      { code: '2.2', weight: 3, pt: { name: 'Patentes concedidas', measures: 'Qualidade da proteção' }, en: { name: 'Patents granted', measures: 'Protection quality' } },
      { code: '2.3', weight: 2, pt: { name: 'Softwares registrados', measures: 'Inovação em TIC e digital' }, en: { name: 'Registered software', measures: 'ICT and digital innovation' } },
      { code: '2.4', weight: 3, pt: { name: 'Protótipos desenvolvidos', measures: 'Geração de soluções' }, en: { name: 'Prototypes developed', measures: 'Solution generation' } },
      { code: '2.5', weight: 4, pt: { name: 'Tecnologias em desenvolvimento (TRL 3–6)', measures: 'Pipeline tecnológico' }, en: { name: 'Technologies in development (TRL 3–6)', measures: 'Technology pipeline' } },
      { code: '2.6', weight: 4, pt: { name: 'Tecnologias validadas (TRL ≥ 7)', measures: 'Maturidade tecnológica' }, en: { name: 'Validated technologies (TRL ≥ 7)', measures: 'Technology maturity' } },
    ],
  },
  {
    id: 'transferencia',
    weight: 15,
    color: '#7b4fc9', // roxo
    pt: { title: 'Dimensão Transferência e Mercado' },
    en: { title: 'Technology Transfer and Market Dimension' },
    indicators: [
      { code: '3.1', weight: 4, pt: { name: 'Licenças e contratos de tecnologia', measures: 'Transferência de tecnologia' }, en: { name: 'Technology licenses and contracts', measures: 'Technology transfer' } },
      { code: '3.2', weight: 3, pt: { name: 'Parcerias com empresas', measures: 'Engajamento do setor produtivo' }, en: { name: 'Partnerships with companies', measures: 'Industry engagement' } },
      { code: '3.3', weight: 3, pt: { name: 'Startups / spin-offs apoiadas', measures: 'Empreendedorismo e inovação' }, en: { name: 'Startups / spin-offs supported', measures: 'Entrepreneurship and innovation' } },
      { code: '3.4', weight: 3, pt: { name: 'Receitas com tecnologia (R$)', measures: 'Retorno econômico gerado' }, en: { name: 'Technology revenue (R$)', measures: 'Economic return generated' } },
      { code: '3.5', weight: 2, pt: { name: 'Propriedade intelectual licenciada (%)', measures: 'Taxa de aproveitamento' }, en: { name: 'Licensed intellectual property (%)', measures: 'Utilization rate' } },
    ],
  },
  {
    id: 'ambiental',
    weight: 15,
    color: '#2f9e6b', // verde-escuro
    pt: { title: 'Dimensão Impacto Ambiental' },
    en: { title: 'Environmental Impact Dimension' },
    indicators: [
      { code: '4.1', weight: 4, pt: { name: 'tCO₂eq evitadas/ano', measures: 'Redução de emissões' }, en: { name: 'tCO₂eq avoided/year', measures: 'Emissions reduction' } },
      { code: '4.2', weight: 3, pt: { name: 'Volume de resíduos valorizados (t/ano)', measures: 'Aproveitamento sustentável' }, en: { name: 'Waste volume valorized (t/year)', measures: 'Sustainable use' } },
      { code: '4.3', weight: 3, pt: { name: 'Energia renovável gerada (GWh/ano)', measures: 'Contribuição energética' }, en: { name: 'Renewable energy generated (GWh/year)', measures: 'Energy contribution' } },
      { code: '4.4', weight: 3, pt: { name: 'Consumo específico de energia (kWh/unidade)', measures: 'Eficiência energética' }, en: { name: 'Specific energy consumption (kWh/unit)', measures: 'Energy efficiency' } },
      { code: '4.5', weight: 2, pt: { name: 'Uso de água (m³/unidade)', measures: 'Eficiência no uso de recursos' }, en: { name: 'Water use (m³/unit)', measures: 'Resource-use efficiency' } },
    ],
  },
  {
    id: 'social',
    weight: 10,
    color: '#e07a2c', // laranja
    pt: { title: 'Dimensão Impacto Social' },
    en: { title: 'Social Impact Dimension' },
    indicators: [
      { code: '5.1', weight: 2, pt: { name: 'Empregos verdes gerados', measures: 'Geração de trabalho e renda' }, en: { name: 'Green jobs generated', measures: 'Job and income generation' } },
      { code: '5.2', weight: 2, pt: { name: 'Comunidades e territórios beneficiados', measures: 'Impacto territorial' }, en: { name: 'Communities and territories benefited', measures: 'Territorial impact' } },
      { code: '5.3', weight: 2, pt: { name: 'Inclusão social em projetos (%)', measures: 'Equidade e inclusão' }, en: { name: 'Social inclusion in projects (%)', measures: 'Equity and inclusion' } },
      { code: '5.4', weight: 2, pt: { name: 'Participação em políticas públicas', measures: 'Influência e contribuição social' }, en: { name: 'Participation in public policy', measures: 'Social influence and contribution' } },
      { code: '5.5', weight: 2, pt: { name: 'Divulgação científica e educação', measures: 'Disseminação do conhecimento' }, en: { name: 'Science outreach and education', measures: 'Knowledge dissemination' } },
    ],
  },
  {
    id: 'formacao',
    weight: 10,
    color: '#c9a635', // amarelo/dourado
    pt: { title: 'Dimensão Formação de Recursos Humanos' },
    en: { title: 'Human Resources Training Dimension' },
    indicators: [
      { code: '6.1', weight: 2, pt: { name: 'Mestrados concluídos/ano', measures: 'Formação em nível de mestrado' }, en: { name: "Master's degrees completed/year", measures: "Master's-level training" } },
      { code: '6.2', weight: 2, pt: { name: 'Doutorados concluídos/ano', measures: 'Formação em nível de doutorado' }, en: { name: 'PhDs completed/year', measures: 'Doctoral-level training' } },
      { code: '6.3', weight: 2, pt: { name: 'Pós-doutorados/ano', measures: 'Formação avançada' }, en: { name: 'Postdocs/year', measures: 'Advanced training' } },
      { code: '6.4', weight: 2, pt: { name: 'Estudantes envolvidos (IC, mestr., dout.)', measures: 'Engajamento discente' }, en: { name: 'Students involved (undergrad, MSc, PhD)', measures: 'Student engagement' } },
      { code: '6.5', weight: 2, pt: { name: 'Bolsas concedidas', measures: 'Apoio à formação' }, en: { name: 'Scholarships awarded', measures: 'Training support' } },
    ],
  },
  {
    id: 'governanca',
    weight: 10,
    color: '#4a8fc4', // azul-claro
    pt: { title: 'Dimensão Governança e Sustentabilidade' },
    en: { title: 'Governance and Sustainability Dimension' },
    indicators: [
      { code: '7.1', weight: 3, pt: { name: 'Captação de recursos (R$)', measures: 'Sustentabilidade financeira' }, en: { name: 'Funds raised (R$)', measures: 'Financial sustainability' } },
      { code: '7.2', weight: 2, pt: { name: 'Diversidade de fontes (%)', measures: 'Redução de dependência' }, en: { name: 'Funding source diversity (%)', measures: 'Dependency reduction' } },
      { code: '7.3', weight: 2, pt: { name: 'Projetos internacionais ativos', measures: 'Inserção global' }, en: { name: 'Active international projects', measures: 'Global engagement' } },
      { code: '7.4', weight: 2, pt: { name: 'Processos internos eficientes', measures: 'Eficiência operacional' }, en: { name: 'Efficient internal processes', measures: 'Operational efficiency' } },
      { code: '7.5', weight: 1, pt: { name: 'Prestação de contas e transparência', measures: 'Governança e conformidade' }, en: { name: 'Accountability and transparency', measures: 'Governance and compliance' } },
    ],
  },
];

// Escalas de maturidade utilizadas nos projetos (glossário complementar).
export const maturityScales = [
  { code: 'TRL', pt: 'Maturidade Tecnológica', en: 'Technology Readiness Level' },
  { code: 'SRL', pt: 'Maturidade Científica', en: 'Scientific Readiness Level' },
  { code: 'MRL', pt: 'Maturidade de Mercado', en: 'Market Readiness Level' },
  { code: 'CRL', pt: 'Prontidão Comercial', en: 'Commercial Readiness Level' },
  { code: 'IRL', pt: 'Potencial de Inovação', en: 'Innovation Readiness Level' },
  { code: 'PRL', pt: 'Adequação Regulatória', en: 'Policy Readiness Level' },
  { code: 'ORL', pt: 'Capacidade Institucional', en: 'Organizational Readiness Level' },
  { code: 'SRL-Social', pt: 'Aceitação Social', en: 'Social Readiness Level' },
];

// Distribuição recomendada do portfólio de projetos por faixa de TRL.
export const trlPortfolioDistribution = [
  { range: 'TRL 1–3', pt: 'Pesquisa Básica', en: 'Basic Research', percent: 30 },
  { range: 'TRL 4–6', pt: 'Desenvolvimento', en: 'Development', percent: 40 },
  { range: 'TRL 7–9', pt: 'Demonstração e Escala', en: 'Demonstration and Scale', percent: 30 },
];

export const kpiFrameworkTotalWeight = kpiDimensions.reduce((sum, d) => sum + d.weight, 0);
export const kpiIndicatorCount = kpiDimensions.reduce((sum, d) => sum + d.indicators.length, 0);
