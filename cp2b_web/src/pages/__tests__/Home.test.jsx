import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Home from '../Home';
import { homeContent, researchAxes } from '../../data/content';
import { staticRoster } from '../../hooks/useTeamRoster';
import { computeTeamProfile } from '../../utils/teamProfile';
import { laboratories } from '../../data/generated/laboratories';
import { technicalServices } from '../../data/generated/services';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchFeaturedContent: vi.fn(),
  fetchFeaturedVideos: vi.fn(),
  fetchPageContent: vi.fn(),
  fetchTeam: vi.fn(),
}));

import api, { fetchFeaturedContent, fetchFeaturedVideos, fetchPageContent, fetchTeam } from '../../services/api';

const mockNews = [
  {
    id: 1,
    slug: 'noticia-um',
    title_pt: 'Primeira notícia',
    title_en: 'First news',
    description_pt: 'Descrição um',
    image: '/assets/DSC00339-500x333.jpg',
    badge: 'Eventos',
    badge_color: 'primary',
    created_at: '2025-03-01',
  },
  {
    id: 2,
    slug: 'noticia-dois',
    title_pt: 'Segunda notícia',
    title_en: 'Second news',
    description_pt: 'Descrição dois',
    image: '/assets/biogas-2919235_1280.jpg',
    badge: 'Artigo',
    badge_color: 'info',
    created_at: '2025-02-01',
  },
  {
    id: 3,
    slug: 'noticia-tres',
    title_pt: 'Terceira notícia',
    title_en: 'Third news',
    description_pt: 'Descrição três',
    image: '/assets/CP2B-AVATAR-BR@8x.png',
    badge: 'Institucional',
    badge_color: 'success',
    created_at: '2025-01-01',
  },
];

const featured = {
  A: {
    slug: 'destaque-a',
    title_pt: 'Destaque A',
    title_en: 'Headline A',
    description_pt: 'Resumo do destaque principal',
    image: '/assets/DSC00361-1920x748.jpg',
    badge: 'Destaque',
    badge_color: 'success',
    date_display: '10 MAR 2025',
  },
  B: null,
  C: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  // LanguageContext seeds itself from localStorage, so a test that switches
  // to English would otherwise leak into every test that follows.
  localStorage.removeItem('cp2b_lang');
  fetchFeaturedVideos.mockResolvedValue({ A: null, B: null, C: null });
  fetchPageContent.mockResolvedValue(null);
});

describe('Home — news serving', () => {
  it('renders the 3 latest news with their images and links', async () => {
    api.get.mockResolvedValue({ data: mockNews });
    // All three Destaques taken by other content, so the news stay in the
    // Notícias cards (free Destaques slots would take the newest ones).
    fetchFeaturedContent.mockResolvedValue({
      A: featured.A,
      B: { ...featured.A, slug: 'destaque-b', title_pt: 'Destaque B' },
      C: { ...featured.A, slug: 'destaque-c', title_pt: 'Destaque C' },
    });

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Primeira notícia')).toBeInTheDocument();
    });

    // Each news card renders an <img> whose src is the served asset path.
    expect(screen.getByAltText('Primeira notícia')).toHaveAttribute('src', '/assets/DSC00339-500x333.jpg');
    expect(screen.getByAltText('Segunda notícia')).toHaveAttribute('src', '/assets/biogas-2919235_1280.jpg');
    expect(screen.getByAltText('Terceira notícia')).toHaveAttribute('src', '/assets/CP2B-AVATAR-BR@8x.png');

    // Badge and "view all" link.
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    const viewAll = screen.getByRole('link', { name: /ver todas/i });
    expect(viewAll).toHaveAttribute('href', '/noticias');
  });

  it('renders no news cards when the API returns an empty list', async () => {
    api.get.mockResolvedValue({ data: [] });
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });

    const { container } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText('Primeira notícia')).not.toBeInTheDocument();
    });
    // Sem lista na API, a grade de parceiros usa os logos estáticos, com a
    // FAPESP na frente.
    const logos = within(container.querySelector('.partner-grid')).getAllByRole('img');
    expect(logos[0]).toHaveAttribute('alt', expect.stringMatching(/FAPESP/));
    expect(logos.length).toBeGreaterThan(10);
  });

  it('builds the partner grid from the admin list, FAPESP first, by category', async () => {
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });
    api.get.mockImplementation((url) =>
      Promise.resolve({
        data: url === '/partners'
          ? [
              { id: 3, name_pt: 'Empresa X', category: 'companies', sort_order: 1, logo: '/x.png', website: 'https://x.example' },
              { id: 1, name_pt: 'Sede Y', category: 'host', sort_order: 1, logo: '/y.png' },
              { id: 2, name_pt: 'Sem logo', category: 'research', sort_order: 1, logo: null },
            ]
          : [],
      })
    );

    const { container } = renderWithProviders(<Home />);
    const grid = container.querySelector('.partner-grid');
    await waitFor(() => expect(within(grid).getAllByRole('img')).toHaveLength(3));

    const alts = within(grid).getAllByRole('img').map((img) => img.getAttribute('alt'));
    expect(alts[0]).toMatch(/FAPESP/);
    expect(alts.slice(1)).toEqual(['Sede Y', 'Empresa X']);
    expect(within(grid).getByRole('link', { name: 'Empresa X' })).toHaveAttribute('href', 'https://x.example');
    // /partners/grouped conta como visita a /sobre/parceiros nas estatísticas.
    expect(api.get).not.toHaveBeenCalledWith('/partners/grouped');
  });

  it('does not crash when the news request rejects', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByAltText(/FAPESP/)).toBeInTheDocument();
    });
  });
});

describe('Home — featured content serving', () => {
  it('renders the featured headline image and title from the API', async () => {
    api.get.mockResolvedValue({ data: [] });
    fetchFeaturedContent.mockResolvedValue(featured);

    const { container } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Destaque A')).toBeInTheDocument();
    });

    const headline = container.querySelector('.featured-headline-large');
    expect(headline).toBeTruthy();
    expect(headline.querySelector('img.featured-image-bg').getAttribute('src')).toContain('/assets/DSC00361-1920x748.jpg');

    const link = within(headline.closest('a')).getByText('Destaque A');
    expect(headline.closest('a')).toHaveAttribute('href', '/noticias/destaque-a');
    expect(link).toBeInTheDocument();
  });
});

describe('Home — Destaques never shows an empty box', () => {
  const news = [1, 2, 3, 4, 5].map((n) => ({
    id: n, slug: `n${n}`, title_pt: `Notícia ${n}`, created_at: `2026-11-0${n}`,
  }));

  it('fills empty slots with the latest news and leaves those out of Notícias', async () => {
    api.get.mockResolvedValue({ data: news });
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });

    const { container } = renderWithProviders(<Home />);
    const highlights = await waitFor(() => {
      const block = container.querySelector('.featured-news-container');
      expect(within(block).getByText('Notícia 5')).toBeInTheDocument();
      return block;
    });

    expect(screen.queryByText('Nenhum conteúdo em destaque')).not.toBeInTheDocument();
    // Newest first: 5, 4, 3 lead; Notícias carries on with 2 and 1.
    ['Notícia 5', 'Notícia 4', 'Notícia 3'].forEach((t) => expect(within(highlights).getByText(t)).toBeInTheDocument());
    const cards = [...container.querySelectorAll('.card-editorial')].map((c) => c.textContent);
    expect(cards).toHaveLength(2);
    expect(cards.join(' ')).toContain('Notícia 2');
    expect(cards.join(' ')).not.toContain('Notícia 5');
  });

  it('keeps what the team featured and fills only the gaps', async () => {
    api.get.mockResolvedValue({ data: news });
    fetchFeaturedContent.mockResolvedValue({ A: { ...news[0], slug: 'n1', title_pt: 'Notícia 1', content_type: 'news' }, B: null, C: null });

    const { container } = renderWithProviders(<Home />);
    await screen.findAllByText('Notícia 1');
    const highlights = container.querySelector('.featured-news-container');
    const large = highlights.querySelector('.featured-headline-large');
    expect(within(large).getByText('Notícia 1')).toBeInTheDocument();
    expect(within(highlights).getByText('Notícia 5')).toBeInTheDocument();
    expect(within(highlights).getByText('Notícia 4')).toBeInTheDocument();
  });
});

describe('Home — institutional layer', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] });
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });
  });

  it('opens with highlights, then the CP2b band (logo + name), PILAR, numbers, videos, news and partners', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, slug: 'uma', title_pt: 'Uma notícia', created_at: '2026-11-01' }] });
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    // Destaques primeiro; logo abaixo, a faixa do CP2b (logo à esquerda, nome
    // e frase à direita) e em seguida o PILAR-2b; as notícias descem para
    // antes dos parceiros.
    const sections = [...container.querySelectorAll('section')];
    const at = (fn) => sections.findIndex(fn);
    const featured = at((s) => s.classList.contains('featured-news-section'));
    const intro = at((s) => s.classList.contains('home-intro'));
    const pilar = at((s) => s.classList.contains('pilar-band'));
    const stats = at((s) => s.querySelector('.home-stats-grid'));
    const news = at((s) => s.querySelector('h2')?.textContent === 'Notícias');
    const partners = at((s) => s.classList.contains('partners-section'));

    expect(featured).toBeGreaterThanOrEqual(0);
    expect(featured).toBeLessThanOrEqual(1); // seção externa + a do FeaturedContent
    expect(intro).toBe(featured + 1);
    expect(pilar).toBe(intro + 1);
    expect(stats).toBeGreaterThan(pilar);
    expect(news).toBeGreaterThan(stats);
    expect(partners).toBe(news + 1);
    expect(container.querySelector('.home-strip')).toBeNull();

    // Um só <h1>, com o nome do centro, na faixa; o logo vem antes do texto.
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(homeContent.pt.intro.title);
    expect(sections[intro]).toContainElement(h1s[0]);
    const logo = within(sections[intro]).getByRole('img', { name: homeContent.pt.intro.logoAlt });
    expect(logo).toHaveAttribute('src', '/assets/logos/cp2b-logo-gradient.svg');
    expect(logo.compareDocumentPosition(h1s[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(homeContent.pt.intro.lede)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: homeContent.pt.intro.primary })).toHaveAttribute('href', '/sobre');
    expect(screen.getByRole('link', { name: homeContent.pt.intro.secondary })).toHaveAttribute('href', '/solucoes');
  });

  it('derives every stat from the datasets rather than hardcoding them', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    // Without the API, the same static roster /equipe falls back to.
    const roster = staticRoster('pt');
    const institutions = new Set(
      roster
        .map((member) => (member.institution || '').trim())
        .filter((institution) => institution && institution !== '-')
    );

    const values = [...container.querySelectorAll('.home-stat-value')].map((el) => el.textContent);
    expect(values).toEqual([
      String(researchAxes.pt.length),
      String(computeTeamProfile(roster).team),
      String(institutions.size),
      String(laboratories.filter((l) => l.group === 'bioprocessos').length),
      String(technicalServices.length),
    ]);

    // Guard the intent: a placeholder institution must never be counted.
    expect(institutions.has('-')).toBe(false);
  });

  it('counts the team from the same roster as /equipe when the API answers', async () => {
    fetchTeam.mockResolvedValueOnce({
      coordinators: [{ name: 'Diretora Teste', role_pt: 'Diretora', institution: 'NIPE/UNICAMP', is_director: true, membership: 'direcao' }],
      associates: [
        { name: 'Pós-doc Teste', role_pt: 'Pós-Doutoranda', institution: 'USP', axes: '2', membership: 'nucleo' },
        { name: 'Parceiro Teste', role_pt: 'Pesquisador Responsável na Instituição Parceira', institution: 'COMGAS', membership: 'parceira' },
      ],
      support: [{ name: 'Apoio Teste', role_pt: 'Apoio técnico', institution: 'NIPE/UNICAMP', membership: 'apoio' }],
    });
    const { container } = renderWithProviders(<Home />);

    // Direction, axis and support count; the partner institution does not.
    await waitFor(() => {
      const values = [...container.querySelectorAll('.home-stat-value')].map((el) => el.textContent);
      expect(values[1]).toBe('3');
      expect(values[2]).toBe('3');
    });
  });

  it('leaves the axis index, the solutions panel and the timeline to their own pages', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    expect(container.querySelector('.home-axis-grid')).toBeNull();
    expect(container.querySelector('.home-solutions-panel')).toBeNull();
    expect(screen.queryByText('Marcos e Projetos em Destaque')).not.toBeInTheDocument();
  });

  it('renders the institutional layer in English when the stored language is en', async () => {
    localStorage.setItem('cp2b_lang', 'en');

    renderWithProviders(<Home />);

    expect(await screen.findByText(homeContent.en.stats.title)).toBeInTheDocument();
    expect(screen.getByText(homeContent.en.stats.subtitle)).toBeInTheDocument();
  });
});
