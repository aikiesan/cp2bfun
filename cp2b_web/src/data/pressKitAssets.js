/**
 * Logotipos oficiais do CP2b oferecidos para download no /press-kit.
 *
 * Os arquivos já são servidos estaticamente a partir de public/assets/logos/ —
 * esta lista só os apresenta com rótulo e orientação de uso. Ao acrescentar um
 * arquivo novo à pasta, acrescente a entrada aqui também: a página não varre o
 * diretório (o build é estático e não há listagem de diretório em produção).
 *
 * `usage` responde à pergunta que o jornalista realmente tem — qual destes eu
 * uso? — em vez de deixá-lo abrir sete SVGs para descobrir.
 */
export const pressKitLogos = [
  {
    file: '/assets/logos/cp2b-logo-gradient.svg',
    name: 'Logo principal — degradê',
    name_en: 'Primary logo — gradient',
    usage: 'Uso preferencial, sobre fundo claro.',
    usage_en: 'Preferred use, on light backgrounds.',
  },
  {
    file: '/assets/logos/cp2b-logo-gradient-alt.svg',
    name: 'Logo principal — degradê alternativo',
    name_en: 'Primary logo — alternate gradient',
    usage: 'Variação do degradê para composições específicas.',
    usage_en: 'Gradient variation for specific compositions.',
  },
  {
    file: '/assets/logos/cp2b-logo-flat-green.svg',
    name: 'Logo chapado — verde',
    name_en: 'Flat logo — green',
    usage: 'Impressão em uma cor e materiais de baixo custo.',
    usage_en: 'Single-colour printing and low-cost materials.',
  },
  {
    file: '/assets/logos/cp2b-logo-flat-blue.svg',
    name: 'Logo chapado — azul petróleo',
    name_en: 'Flat logo — petrol blue',
    usage: 'Impressão em uma cor, alternativa institucional.',
    usage_en: 'Single-colour printing, institutional alternative.',
  },
  {
    file: '/assets/logos/cp2b-logo-negative-white.svg',
    name: 'Logo negativo — branco',
    name_en: 'Negative logo — white',
    usage: 'Sobre fundo escuro ou fotografia.',
    usage_en: 'On dark backgrounds or photography.',
  },
  {
    file: '/assets/logos/cp2b-logo-negative-solid.svg',
    name: 'Logo negativo — sólido',
    name_en: 'Negative logo — solid',
    usage: 'Sobre fundo escuro, quando o branco puro não se aplica.',
    usage_en: 'On dark backgrounds where pure white does not apply.',
  },
  {
    file: '/assets/logos/cp2b-avatar-gradient.svg',
    name: 'Avatar — degradê',
    name_en: 'Avatar — gradient',
    usage: 'Foto de perfil em redes sociais.',
    usage_en: 'Social media profile picture.',
  },
  {
    file: '/assets/logos/cp2b-avatar-flat.svg',
    name: 'Avatar — chapado',
    name_en: 'Avatar — flat',
    usage: 'Avatar em uma cor.',
    usage_en: 'Single-colour avatar.',
  },
  {
    file: '/assets/logos/cp2b-avatar-solid.svg',
    name: 'Avatar — sólido',
    name_en: 'Avatar — solid',
    usage: 'Avatar sobre fundo de cor plena.',
    usage_en: 'Avatar on a solid colour background.',
  },
  {
    file: '/assets/logos/cp2b-avatar-black.svg',
    name: 'Avatar — preto',
    name_en: 'Avatar — black',
    usage: 'Uso monocromático e documentos em preto e branco.',
    usage_en: 'Monochrome use and black-and-white documents.',
  },
  {
    file: '/assets/logos/cp2b-avatar-512.png',
    name: 'Avatar PNG — 512px',
    name_en: 'Avatar PNG — 512px',
    usage: 'Para sistemas que não aceitam SVG.',
    usage_en: 'For systems that do not accept SVG.',
  },
];

/**
 * Documentos institucionais servidos de public/assets/press-kit/.
 *
 * Ficam no repositório (e não em /uploads) porque são materiais de marca
 * estáveis, que a imprensa deve conseguir baixar mesmo se o backend estiver
 * fora do ar — a mesma razão pela qual os logotipos moram em public/.
 */
export const pressKitDocuments = [
  {
    file: '/assets/press-kit/manual-identidade-visual-cp2b.pdf',
    icon: 'bi-book',
    name: 'Manual de Identidade Visual',
    name_en: 'Visual Identity Manual',
    description: 'Uso do logotipo, área de proteção, paleta e tipografia oficiais.',
    description_en: 'Logo usage, clear space, official palette and typography.',
    meta: 'PDF · 2,2 MB',
  },
];

/**
 * Paleta institucional, extraída do manual de identidade. Os mesmos valores
 * usados nos tokens do site — se o manual mudar, mudam os dois.
 */
export const brandColors = [
  { name: 'Azul Petróleo', hex: '#1E3E4C', onDark: true },
  { name: 'Verde Escuro', hex: '#00573A', onDark: true },
  { name: 'Verde', hex: '#5CA032', onDark: true },
  { name: 'Lima', hex: '#B6E03B', onDark: false },
  { name: 'Âmbar Intenso', hex: '#D37402', onDark: true },
];

/**
 * Tipografia institucional. Informativo, não distribuível: Neulis Sans e
 * Neulis Neue são fontes comerciais licenciadas ao CP2b — o site as usa para
 * renderizar, mas os arquivos não são oferecidos para download aqui.
 */
export const brandTypography = [
  {
    family: 'Neulis Neue',
    role: 'Títulos e display',
    role_en: 'Headings and display',
    sample: 'Biogás e Bioprodutos',
  },
  {
    family: 'Neulis Sans',
    role: 'Texto corrido e interface',
    role_en: 'Body text and interface',
    sample: 'Centro Paulista de Estudos em Biogás e Bioprodutos',
  },
];
