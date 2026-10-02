/**
 * Post-build SEO generator.
 *
 * 1. Writes a prerendered dist/<route>/index.html for every public route with
 *    route-specific <title>, meta description, canonical, Open Graph tags,
 *    and Schema.org JSON-LD structured data graphs before </head>, so crawlers
 *    and social scrapers get complete metadata without executing JS.
 * 2. Generates dist/sitemap.xml containing all static routes AND the dynamic
 *    slugs (news, events, opportunities, interviews, microscópio) read from the API.
 * 3. Prerenders HTML shells for those dynamic slugs.
 *
 * Env:
 *   SITE_URL            canonical origin (default https://cp2b.unicamp.br)
 *   SEO_API_URL         API origin for dynamic slugs (falls back to VITE_API_URL).
 *                       On the VM, deploy.sh points it at http://localhost:3001/api.
 *   SEO_ALLOW_FALLBACK  "1" swaps an unreachable API for the sample items in
 *                       src/data/content.js. Only for tests and offline builds:
 *                       the sample slugs do not exist in the database, and in
 *                       production they went into the sitemap as "not found"
 *                       pages while the real articles were left out.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageSeo, researchAxes, newsItems, projectsItems } from '../src/data/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DIST = path.resolve(__dirname, '../dist');
const DEFAULT_SITE_URL = (process.env.SITE_URL || 'https://cp2b.unicamp.br').replace(/\/$/, '');
const DEFAULT_API_URL = process.env.SEO_API_URL || process.env.VITE_API_URL || '';

export const SITE_NAME = 'CP2b';
export const DEFAULT_OG_IMAGE = '/assets/logos/cp2b-logo-og.png';

export const ROUTES = {
  '/': { seoKey: 'home', priority: '1.0', changefreq: 'weekly', schemaType: 'organization' },
  '/sobre': { seoKey: 'about', priority: '0.9', changefreq: 'monthly', schemaType: 'organization_breadcrumb' },
  '/sobre/governanca': { seoKey: 'governance', priority: '0.6', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/sobre/indicadores': { seoKey: 'indicators', priority: '0.6', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/sobre/transparencia': { seoKey: 'transparency', priority: '0.6', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/sobre/parceiros': { seoKey: 'partners', priority: '0.6', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/eixos': { seoKey: 'research', priority: '0.9', changefreq: 'monthly', schemaType: 'research_project' },
  '/solucoes': { seoKey: 'solucoes', priority: '0.9', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/capacitacao': { seoKey: 'capacitacao', priority: '0.8', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/equipe': { seoKey: 'team', priority: '0.8', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/noticias': { seoKey: 'news', priority: '0.9', changefreq: 'daily', schemaType: 'breadcrumb' },
  '/oportunidades': { seoKey: 'opportunities', priority: '0.8', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/publicacoes': { seoKey: 'publications', priority: '0.8', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/microscopio': { seoKey: 'microscopio', priority: '0.7', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/eventos': { seoKey: 'events', priority: '0.8', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/galeria': { seoKey: 'gallery', priority: '0.6', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/entrevistas': { seoKey: 'entrevistas', priority: '0.7', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/press-kit': { seoKey: 'pressKit', priority: '0.5', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/podcast': { seoKey: 'podcast', priority: '0.7', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/boletins': { seoKey: 'boletins', priority: '0.7', changefreq: 'monthly', schemaType: 'breadcrumb' },
  '/newsletter': { seoKey: 'newsletter', priority: '0.5', changefreq: 'yearly', schemaType: 'breadcrumb' },
  '/forum-paulista': { seoKey: 'forum', priority: '0.8', changefreq: 'weekly', schemaType: 'breadcrumb' },
  '/contato': { seoKey: 'contact', priority: '0.7', changefreq: 'yearly', schemaType: 'breadcrumb' },
};

export const ROUTE_TITLES_PT = {
  '': 'Início',
  'sobre': 'Sobre o CP2b',
  'governanca': 'Governança',
  'indicadores': 'Indicadores',
  'transparencia': 'Transparência',
  'parceiros': 'Parceiros',
  'eixos': 'Eixos Temáticos',
  'solucoes': 'Infraestrutura e Soluções',
  'capacitacao': 'Cursos e Capacitação',
  'equipe': 'Equipe',
  'noticias': 'Notícias',
  'oportunidades': 'Oportunidades',
  'publicacoes': 'Publicações',
  'microscopio': 'Microscópio de Ideias',
  'eventos': 'Eventos',
  'galeria': 'Galeria',
  'entrevistas': 'Entrevistas e Projetos',
  'press-kit': 'Identidade Visual',
  'podcast': 'Podcast',
  'boletins': 'Boletins',
  'newsletter': 'Newsletter',
  'forum-paulista': 'Fórum Paulista de Biogás',
  'contato': 'Contato',
};

export const escapeHtml = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export const escapeXml = escapeHtml;

export function buildOrganizationJsonLd(baseUrl = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    '@id': `${baseUrl}/#organization`,
    name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
    alternateName: 'CP2b',
    url: baseUrl,
    logo: `${baseUrl}/assets/logos/cp2b-logo-og.png`,
    description: 'Centro de pesquisa vinculado ao NIPE-UNICAMP dedicado ao estudo de biogás, bioprodutos e políticas públicas para energia renovável no Estado de São Paulo.',
    email: 'administrativo@cp2b.unicamp.br',
    telephone: '+55-19-3521-1244',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Cora Coralina, 330',
      addressLocality: 'Campinas',
      addressRegion: 'SP',
      postalCode: '13083-896',
      addressCountry: 'BR',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade Estadual de Campinas',
      alternateName: 'UNICAMP',
      url: 'https://www.unicamp.br',
    },
    sameAs: [
      'https://www.instagram.com/centro_biogas_cp2b/',
      'https://br.linkedin.com/company/centro-paulista-de-estudos-em-biog%C3%A1s-e-bioprodutos-cp2b',
      'https://www.youtube.com/@CP2B_Biog%C3%A1s',
      'https://open.spotify.com/show/4TiFNi6N2BZiokWvGpaZnb',
    ],
    knowsAbout: [
      'biogás',
      'bioprodutos',
      'energia renovável',
      'resíduos sólidos',
      'saneamento',
      'políticas públicas',
      'biogas',
      'bioproducts',
      'renewable energy',
    ],
  };
}

export function buildResearchProjectJsonLd(baseUrl = DEFAULT_SITE_URL) {
  const axes = (researchAxes?.pt || []).map((axis) => ({
    '@type': 'ResearchProject',
    '@id': `${baseUrl}/eixos#eixo-${axis.id}`,
    name: axis.title,
    description: axis.description || axis.summary || axis.title,
    url: `${baseUrl}/eixos#eixo-${axis.id}`,
    funder: {
      '@type': 'FundingAgency',
      name: 'FAPESP - Fundação de Amparo à Pesquisa do Estado de São Paulo',
      alternateName: 'FAPESP',
      url: 'https://fapesp.br',
    },
    parentProject: {
      '@type': 'ResearchProject',
      name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      url: `${baseUrl}/eixos`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    '@id': `${baseUrl}/eixos#project`,
    name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
    alternateName: 'CP2b',
    url: `${baseUrl}/eixos`,
    description: 'Centro de pesquisa dedicado ao avanço científico, tecnológico e de políticas públicas para a cadeia de biogás e bioprodutos no Estado de São Paulo, estruturado em 8 eixos temáticos.',
    funder: {
      '@type': 'FundingAgency',
      name: 'FAPESP - Fundação de Amparo à Pesquisa do Estado de São Paulo',
      alternateName: 'FAPESP',
      url: 'https://fapesp.br',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade Estadual de Campinas',
      alternateName: 'UNICAMP',
      url: 'https://www.unicamp.br',
    },
    subProjects: axes,
  };
}

export function buildBreadcrumbJsonLd(routePath, pageTitle = null, baseUrl = DEFAULT_SITE_URL) {
  const cleanPath = routePath.replace(/\/$/, '');
  if (!cleanPath || cleanPath === '/') return null;

  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: `${baseUrl}/`,
    },
  ];

  let currentPath = '';
  segments.forEach((seg, idx) => {
    currentPath += `/${seg}`;
    const isLast = idx === segments.length - 1;
    const fallbackName = ROUTE_TITLES_PT[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const name = (isLast && pageTitle) ? pageTitle : fallbackName;
    itemListElement.push({
      '@type': 'ListItem',
      position: idx + 2,
      name,
      item: `${baseUrl}${currentPath}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function buildNewsArticleJsonLd(item, routePath, baseUrl = DEFAULT_SITE_URL) {
  const url = `${baseUrl}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;
  const imagePath = item.image || DEFAULT_OG_IMAGE;
  const imageUrl = imagePath.startsWith('http')
    ? imagePath
    : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

  const publishedDate = item.published_at || item.created_at || item.date_iso || '2025-12-18';
  const modifiedDate = item.updated_at || publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: item.title || item.title_pt,
    description: item.description || item.description_pt || item.title || item.title_pt,
    image: imageUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: item.author || 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/logos/cp2b-logo-og.png`,
      },
    },
  };
}

export function buildEventJsonLd(event, routePath, baseUrl = DEFAULT_SITE_URL) {
  const url = `${baseUrl}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;
  const imagePath = event.image || DEFAULT_OG_IMAGE;
  const imageUrl = imagePath.startsWith('http')
    ? imagePath
    : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title || event.title_pt,
    description: event.description || event.description_pt || event.title || event.title_pt,
    startDate: event.start_date || '2025-12-02',
    endDate: event.end_date || event.start_date || '2025-12-02',
    eventStatus: event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: {
      'in-person': 'https://schema.org/OfflineEventAttendanceMode',
      'online': 'https://schema.org/OnlineEventAttendanceMode',
      'hybrid': 'https://schema.org/MixedEventAttendanceMode',
    }[event.location_type] || 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'Auditório NIPE/UNICAMP - Campinas, SP',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Campinas',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
    image: imageUrl,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      url: baseUrl,
    },
  };
}

export function serializeJsonLd(jsonLd) {
  if (!jsonLd) return '';
  let payload;
  if (Array.isArray(jsonLd)) {
    const valid = jsonLd.filter(Boolean);
    if (valid.length === 0) return '';
    if (valid.length === 1) {
      payload = valid[0];
    } else {
      payload = {
        '@context': 'https://schema.org',
        '@graph': valid.map((item) => {
          const { '@context': _, ...rest } = item;
          return rest;
        }),
      };
    }
  } else {
    payload = jsonLd;
  }
  // "<" vira <: um título vindo do banco com "</script>" fecharia a tag no
  // HTML pré-renderizado. Continua JSON válido, com o mesmo conteúdo.
  const json = JSON.stringify(payload, null, 2).replace(/</g, '\\u003c');
  return `    <script type="application/ld+json">\n${json.replace(/^/gm, '    ')}\n    </script>\n`;
}

export function renderHead(template, {
  title,
  description,
  url,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  jsonLd = null,
  injectCanonical = true,
  siteUrl = DEFAULT_SITE_URL,
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullImageUrl = image.startsWith('http')
    ? image
    : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`;

  let html = template;

  // Title
  if (/<title>[^<]*<\/title>/.test(html)) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  }

  // Meta description
  if (/<meta name="description" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`
    );
  }

  // Open Graph
  if (/<meta property="og:title" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
    );
  }
  if (/<meta property="og:description" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    );
  }
  if (/<meta property="og:image" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(fullImageUrl)}" />`
    );
  }
  if (type && /<meta property="og:type" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${escapeHtml(type)}" />`
    );
  }

  // Twitter Cards
  if (/<meta name="twitter:title" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
    );
  }
  if (/<meta name="twitter:description" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`
    );
  }
  if (/<meta name="twitter:image" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(fullImageUrl)}" />`
    );
  }

  // Inject Canonical, OG URL and Schema.org JSON-LD before </head>
  let extraHead = '';
  if (injectCanonical && url) {
    extraHead += `    <link rel="canonical" href="${url}" />\n`;
    extraHead += `    <meta property="og:url" content="${url}" />\n`;
  }
  if (jsonLd) {
    extraHead += serializeJsonLd(jsonLd);
  }

  if (extraHead) {
    html = html.replace('</head>', `${extraHead}  </head>`);
  }

  return html;
}

export function getNewsFallback() {
  const items = newsItems?.pt || [];
  const slugMap = {
    10: 'metaninho-mascote',
    11: 'workshop-anual-2025',
    12: 'biogas-cop30',
    1: 'cau-2025',
  };
  return items.map((item) => {
    let slug = item.slug;
    if (!slug && item.link && item.link.startsWith('/noticias/')) {
      slug = item.link.replace('/noticias/', '');
    }
    if (!slug) {
      slug = slugMap[item.id] || `noticia-${item.id}`;
    }
    return {
      slug,
      title: item.title,
      description: item.description,
      image: item.image || DEFAULT_OG_IMAGE,
      date: item.date,
      published_at: item.date === '18 DEZ 2025' ? '2025-12-18' : (item.date === '02 DEZ 2025' ? '2025-12-02' : (item.date === '29 JUL 2025' ? '2025-07-29' : '2025-11-15')),
      badge: item.badge,
    };
  });
}

export function getProjectsFallback() {
  const items = projectsItems?.pt || [];
  return items.map((item) => {
    let slug = item.slug;
    if (!slug && item.link && item.link.startsWith('/entrevistas/')) {
      slug = item.link.replace('/entrevistas/', '');
    }
    return {
      slug: slug || `projeto-${item.id}`,
      title: item.title,
      description: item.description,
      image: item.image || DEFAULT_OG_IMAGE,
      date: item.date,
      badge: item.badge,
    };
  });
}

export function getEventsFallback() {
  return [
    {
      slug: 'workshop-anual-2025',
      title: 'I Workshop Anual do CP2b marca avanços em 2025',
      description: 'Evento reuniu pesquisadores para apresentar resultados dos oito eixos temáticos e assinar o Regimento Interno, consolidando a governança do centro.',
      image: '/assets/DSC00339-500x333.jpg',
      start_date: '2025-12-02',
      end_date: '2025-12-02',
      location: 'Auditório NIPE/UNICAMP',
      location_type: 'in-person',
      organizer: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
    },
    {
      slug: 'forum-paulista-biogas-2026',
      title: 'Fórum Paulista de Biogás e Bioprodutos - Maio/2026',
      description: 'O maior encontro de biogás de São Paulo reuniu especialistas, pesquisadores e parceiros estratégicos para discutir o futuro da bioenergia.',
      image: '/assets/DSC00361-1920x748.jpg',
      start_date: '2026-05-15',
      end_date: '2026-05-16',
      location: 'Centro de Convenções UNICAMP',
      location_type: 'hybrid',
      organizer: 'CP2b / NIPE-UNICAMP',
    },
  ];
}

export function getMicroscopioFallback() {
  return [
    {
      slug: 'biogas-sustentabilidade-paulista',
      title: 'Biogás e a Transição Energética no Estado de São Paulo',
      description: 'Reflexão sobre o potencial de descarbonização da matriz paulista através do aproveitamento de resíduos orgânicos.',
      image: '/assets/biogas-2919235_1280.jpg',
      published_at: '2025-10-10',
      author: 'Pesquisadores CP2b',
    },
    {
      slug: 'desafios-regulatorios-biometano',
      title: 'Desafios Regulatórios para a Injeção de Biometano na Rede',
      description: 'Análise dos marcos regulatórios da ARSESP e ANP para a expansão do biometano no setor de saneamento e sucroenergético.',
      image: '/assets/gas-1.jpg',
      published_at: '2025-11-20',
      author: 'Eixo 8 CP2b',
    },
  ];
}

export function getOpportunitiesFallback() {
  return [
    {
      slug: 'bolsa-pos-doutorado-bioprocessos',
      title: 'Bolsa de Pós-Doutorado em Engenharia de Bioprocessos',
      description: 'Oportunidade de pesquisa em digestão anaeróbia e produção de biohitano no NIPE/UNICAMP.',
      image: DEFAULT_OG_IMAGE,
      published_at: '2025-12-01',
    },
    {
      slug: 'bolsa-doutorado-direto-biogas',
      title: 'Bolsa de Doutorado Direto em Avaliação de Ciclo de Vida (ACV)',
      description: 'Pesquisa com foco em modelagem ambiental e pegada de carbono da cadeia do biogás.',
      image: DEFAULT_OG_IMAGE,
      published_at: '2025-12-05',
    },
  ];
}

export async function fetchJson(apiUrl, endpoint) {
  if (!apiUrl) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${apiUrl}${endpoint}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function generateSitemapXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

export async function generateSeo({
  distDir = DEFAULT_DIST,
  siteUrl = DEFAULT_SITE_URL,
  apiUrl = DEFAULT_API_URL,
  allowFallback = process.env.SEO_ALLOW_FALLBACK === '1',
  log = console.log,
} = {}) {
  const templatePath = path.join(distDir, 'index.html');
  if (!existsSync(templatePath)) {
    throw new Error(`generate-seo: ${templatePath} not found — run vite build first.`);
  }
  const template = await readFile(templatePath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);

  // 1. Prerender static route HTML shells with JSON-LD
  let prerenderedCount = 0;
  for (const [route, config] of Object.entries(ROUTES)) {
    const meta = pageSeo[config.seoKey]?.pt;
    if (!meta) continue;
    const url = `${siteUrl}${route === '/' ? '/' : route}`;

    let jsonLd = null;
    if (config.schemaType === 'organization') {
      jsonLd = buildOrganizationJsonLd(siteUrl);
    } else if (config.schemaType === 'organization_breadcrumb') {
      jsonLd = [
        buildOrganizationJsonLd(siteUrl),
        buildBreadcrumbJsonLd(route, meta.title, siteUrl),
      ];
    } else if (config.schemaType === 'research_project') {
      jsonLd = [
        buildResearchProjectJsonLd(siteUrl),
        buildBreadcrumbJsonLd(route, meta.title, siteUrl),
      ];
    } else if (config.schemaType === 'breadcrumb') {
      jsonLd = buildBreadcrumbJsonLd(route, meta.title, siteUrl);
    }

    const html = renderHead(template, {
      title: meta.title,
      description: meta.description,
      url,
      jsonLd,
      injectCanonical: true,
      siteUrl,
    });

    if (route === '/') {
      await writeFile(templatePath, html);
    } else {
      const dir = path.join(distDir, route.slice(1));
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), html);
    }
    prerenderedCount += 1;
  }
  log(`generate-seo: prerendered metadata and JSON-LD for ${prerenderedCount} static routes`);

  // 2. Fetch or fallback dynamic content
  const sitemapUrls = Object.entries(ROUTES).map(([route, config]) => ({
    loc: `${siteUrl}${route === '/' ? '/' : route}`,
    lastmod: today,
    priority: config.priority,
    changefreq: config.changefreq,
  }));

  const dynamicSources = [
    { endpoint: '/news', prefix: '/noticias', priority: '0.7', changefreq: 'weekly', type: 'news', getFallback: getNewsFallback },
    { endpoint: '/microscopio', prefix: '/microscopio', priority: '0.6', changefreq: 'weekly', type: 'microscopio', getFallback: getMicroscopioFallback },
    { endpoint: '/opportunities', prefix: '/oportunidades', priority: '0.6', changefreq: 'weekly', type: 'opportunity', getFallback: getOpportunitiesFallback },
    { endpoint: '/projects', prefix: '/entrevistas', priority: '0.7', changefreq: 'weekly', type: 'project', getFallback: getProjectsFallback },
    { endpoint: '/events', prefix: '/eventos', priority: '0.7', changefreq: 'weekly', type: 'event', getFallback: getEventsFallback },
  ];

  let dynamicShellsCount = 0;

  for (const { endpoint, prefix, priority, changefreq, type, getFallback } of dynamicSources) {
    // Uma lista vazia é resposta válida (hoje /api/events devolve []): vira
    // zero páginas, não amostras. Só a API fora do ar cai nas amostras, e só
    // com allowFallback; sem ele a seção fica de fora do sitemap.
    let items = await fetchJson(apiUrl, endpoint);
    if (Array.isArray(items)) {
      log(`generate-seo: fetched ${items.length} dynamic items from ${endpoint}`);
    } else if (allowFallback) {
      items = getFallback();
      log(`generate-seo: using static fallback for ${prefix} (${items.length} items)`);
    } else {
      items = [];
      log(`generate-seo: AVISO: ${apiUrl ? `API indisponível em ${apiUrl}${endpoint}` : 'SEO_API_URL não definido'}; ${prefix} fica fora do sitemap`);
    }

    for (const item of items) {
      const slug = item.slug;
      if (!slug) continue;
      const route = `${prefix}/${slug}`;
      const itemUrl = `${siteUrl}${route}`;
      const itemLastmod = (item.updated_at || item.published_at || item.created_at || item.date_iso || today).slice(0, 10);

      sitemapUrls.push({
        loc: itemUrl,
        lastmod: itemLastmod,
        priority,
        changefreq,
      });

      // Build JSON-LD structured data for dynamic item
      let dynamicJsonLd = null;
      let pageType = 'website';
      const itemTitle = item.title || item.title_pt || '';
      const itemDesc = item.description || item.description_pt || itemTitle;
      const itemImage = item.image || DEFAULT_OG_IMAGE;

      if (type === 'news' || type === 'microscopio') {
        pageType = 'article';
        dynamicJsonLd = [
          buildNewsArticleJsonLd(item, route, siteUrl),
          buildBreadcrumbJsonLd(route, itemTitle, siteUrl),
        ];
      } else if (type === 'event') {
        dynamicJsonLd = [
          buildEventJsonLd(item, route, siteUrl),
          buildBreadcrumbJsonLd(route, itemTitle, siteUrl),
        ];
      } else {
        dynamicJsonLd = buildBreadcrumbJsonLd(route, itemTitle, siteUrl);
      }

      const shellHtml = renderHead(template, {
        title: itemTitle,
        description: itemDesc,
        url: itemUrl,
        image: itemImage,
        type: pageType,
        jsonLd: dynamicJsonLd,
        injectCanonical: true,
        siteUrl,
      });

      const dir = path.join(distDir, prefix.slice(1), slug);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), shellHtml);
      dynamicShellsCount += 1;
    }
  }

  log(`generate-seo: prerendered ${dynamicShellsCount} dynamic HTML shells`);

  // 3. Write Sitemap XML
  const sitemapXml = generateSitemapXml(sitemapUrls);
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml);
  log(`generate-seo: sitemap.xml written with ${sitemapUrls.length} URLs`);

  return {
    prerenderedStatic: prerenderedCount,
    prerenderedDynamic: dynamicShellsCount,
    sitemapUrlsCount: sitemapUrls.length,
  };
}

const isDirectRun = process.argv[1] && (
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('generate-seo.mjs')
);

if (isDirectRun) {
  generateSeo()
    .catch((err) => {
      console.error('generate-seo failed:', err);
      process.exit(1);
    });
}


