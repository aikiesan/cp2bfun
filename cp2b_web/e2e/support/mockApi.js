/**
 * Deterministic /api mocking for E2E.
 *
 * The public site is API-driven (src/services/api.js, base "/api"). We intercept
 * every /api/** request and return fixture JSON so pages render predictably
 * without a backend or database. Endpoints not listed fall through to an empty
 * 200 ([]), which matches how the app degrades when data is missing.
 */

export const newsFixture = [
  {
    id: 1,
    slug: 'noticia-um',
    title_pt: 'Primeira notícia de teste',
    title_en: 'First test news',
    description_pt: 'Resumo da primeira notícia.',
    description_en: 'First news summary.',
    image: '/assets/DSC00339-500x333.jpg',
    badge: 'Eventos',
    badge_color: 'primary',
    date_display: '01 MAR 2025',
    created_at: '2025-03-01T00:00:00Z',
  },
  {
    id: 2,
    slug: 'noticia-dois',
    title_pt: 'Segunda notícia de teste',
    title_en: 'Second test news',
    description_pt: 'Resumo da segunda notícia.',
    description_en: 'Second news summary.',
    image: '/assets/biogas-2919235_1280.jpg',
    badge: 'Artigo',
    badge_color: 'info',
    date_display: '15 FEV 2025',
    created_at: '2025-02-15T00:00:00Z',
  },
  {
    id: 3,
    slug: 'noticia-tres',
    title_pt: 'Terceira notícia de teste',
    title_en: 'Third test news',
    description_pt: 'Resumo da terceira notícia.',
    description_en: 'Third news summary.',
    image: '/assets/CP2B-AVATAR-BR@8x.png',
    badge: 'Institucional',
    badge_color: 'success',
    date_display: '02 JAN 2025',
    created_at: '2025-01-02T00:00:00Z',
  },
];

export const featuredFixture = {
  A: {
    slug: 'destaque-a',
    title_pt: 'Destaque principal',
    title_en: 'Main headline',
    description_pt: 'Resumo do destaque principal da home.',
    image: '/assets/DSC00361-1920x748.jpg',
    badge: 'Destaque',
    badge_color: 'success',
    date_display: '10 MAR 2025',
  },
  B: null,
  C: null,
};

export const publicationsFixture = [
  {
    id: 1,
    title_pt: 'Artigo sobre biogás',
    title_en: 'Biogas article',
    authors: 'Silva, J.; Souza, M.',
    journal: 'Nature Energy',
    year: 2025,
    doi: '10.1234/example.doi',
    url: 'https://example.com/paper',
    pdf_url: 'https://cdn.example.com/paper.pdf',
    publication_type: 'article',
  },
  {
    id: 2,
    title_pt: 'Capítulo sem links',
    title_en: 'Chapter without links',
    authors: 'Costa, A.',
    year: 2024,
    publication_type: 'chapter',
  },
];

// endpoint suffix -> JSON body. Matched against the request pathname.
const ROUTES = [
  [/\/api\/featured$/, () => featuredFixture],
  [/\/api\/videos\/featured$/, () => ({ A: null, B: null, C: null })],
  [/\/api\/news$/, () => newsFixture],
  [/\/api\/news\/[^/]+$/, () => newsFixture[0]],
  [/\/api\/publications(\?.*)?$/, () => publicationsFixture],
  [/\/api\/content\/[^/]+$/, () => null],
  [/\/api\/team\/grouped$/, () => ({})],
  [/\/api\/partners\/grouped$/, () => ({ host: [], public: [], research: [], companies: [] })],
  [/\/api\/page-settings$/, () => []],
];

export async function mockApi(page) {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const match = ROUTES.find(([re]) => re.test(url.pathname + url.search) || re.test(url.pathname));
    const body = match ? match[1]() : [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}
