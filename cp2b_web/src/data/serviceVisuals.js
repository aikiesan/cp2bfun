// Representação visual de cada serviço técnico (src/data/generated/services.js),
// pelo id do serviço. Serve para o catálogo de Infraestrutura e Soluções mostrar
// o que o serviço é de relance, em vez de um paredão de texto.
//
// `image`: ilustração em /public/assets/services (vetorial, fundo recortado).
// `icon`: ícone do Bootstrap Icons, usado se um serviço novo entrar na planilha
// antes de ganhar ilustração (hoje os 15 têm imagem).
// O `title` repete o título do serviço só para o teste garantir que o id não
// passou a apontar para outro serviço depois de uma nova extração da planilha.
export const serviceVisuals = {
  // CEMARA (UNIFAL)
  1: { image: '/assets/services/cemara-molecular.webp', icon: 'bi-virus', title: 'Identificação e Caracterização Molecular de Microrganismos' },
  2: { image: '/assets/services/cemara-hplc.webp', icon: 'bi-graph-up', title: 'Quantificação de Compostos de Alto Valor por HPLC' },
  3: { image: '/assets/services/cemara-screening.webp', icon: 'bi-funnel', title: 'Desenvolvimento e Triagem de Bioprocessos (Screening)' },
  4: { image: '/assets/services/cemara-qualidade.webp', icon: 'bi-clipboard-check', title: 'Análises Físico-Químicas de Controle de Qualidade' },
  5: { image: '/assets/services/cemara-vias.webp', icon: 'bi-diagram-3', title: 'Elucidação de Vias Metabólicas' },
  // CP2b Lab
  6: { image: '/assets/services/cp2b-lab-biomassa.webp', icon: 'bi-flower1', title: 'Caracterização Profunda de Biomassa' },
  7: { image: '/assets/services/cp2b-lab-biorreatores.webp', icon: 'bi-cup-straw', title: 'Provas de Conceito em Biorreatores de Bancada' },
  8: { image: '/assets/services/cp2b-lab-microrganismos.webp', icon: 'bi-virus', title: 'Triagem e Seleção de Microrganismos' },
  9: { image: '/assets/services/cp2b-lab-cromatografia.webp', icon: 'bi-graph-up', title: 'Análise Quantitativa de Bioprodutos (Cromatografia)' },
  10: { image: '/assets/services/cp2b-lab-otimizacao.webp', icon: 'bi-sliders', title: 'Otimização de Parâmetros de Processo' },
  // PPBIOEN
  11: { image: '/assets/services/ppbioen-bmp.webp', icon: 'bi-fire', title: 'Ensaios de Potencial Bioquímico de Metano (BMP)' },
  12: { image: '/assets/services/ppbioen-scaleup.webp', icon: 'bi-arrows-angle-expand', title: 'Testes de Escalonamento (Scale-up)' },
  13: { image: '/assets/services/ppbioen-biogas.webp', icon: 'bi-bar-chart-line', title: 'Perfil de Bioprodutos e Pureza (Cromatografia - HPLC/GC)' },
  14: { image: '/assets/services/ppbioen-estabilizacao.webp', icon: 'bi-sliders', title: 'Otimização e Estabilização de Processos' },
  15: { image: '/assets/services/ppbioen-inoculos.webp', icon: 'bi-droplet-half', title: 'P&D de Novos Catalisadores/Inóculos' },
};

export const serviceVisual = (id) => serviceVisuals[id] || { icon: 'bi-gear' };
