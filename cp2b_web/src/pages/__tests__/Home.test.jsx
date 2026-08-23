import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Home from '../Home';
import { homeContent, researchAxes, teamMembers } from '../../data/content';
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
}));

import api, { fetchFeaturedContent, fetchFeaturedVideos, fetchPageContent } from '../../services/api';

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
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });

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

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText('Primeira notícia')).not.toBeInTheDocument();
    });
    // Static partner image is always served regardless of news state.
    expect(screen.getByAltText('Partners')).toHaveAttribute('src', '/assets/parceiros.png');
  });

  it('does not crash when the news request rejects', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByAltText('Partners')).toBeInTheDocument();
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

describe('Home — institutional layer', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] });
    fetchFeaturedContent.mockResolvedValue({ A: null, B: null, C: null });
  });

  it('opens on the featured-news block, with the institutional layer below it', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    // Order matters: the newsroom leads, the institutional bands follow.
    const sections = [...container.querySelectorAll('section')];
    const featuredIndex = sections.findIndex((s) => s.querySelector('.featured-news-container'));
    const statsIndex = sections.findIndex((s) => s.querySelector('.home-stats-grid'));
    const axesIndex = sections.findIndex((s) => s.querySelector('.home-axis-grid'));

    expect(featuredIndex).toBe(0);
    expect(statsIndex).toBeGreaterThan(featuredIndex);
    expect(axesIndex).toBeGreaterThan(statsIndex);

    // No full-bleed institutional banner: the page has no <h1> of its own.
    expect(container.querySelector('.home-hero')).toBeNull();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('derives every stat from the datasets rather than hardcoding them', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    const people = teamMembers.flatMap((category) => category.members);
    const institutions = new Set(
      people
        .map((member) => (member.institution || '').trim())
        .filter((institution) => institution && institution !== '-')
    );

    const values = [...container.querySelectorAll('.home-stat-value')].map((el) => el.textContent);
    expect(values).toEqual([
      String(researchAxes.pt.length),
      String(people.length),
      String(institutions.size),
      String(laboratories.length),
      String(technicalServices.length),
    ]);

    // Guard the intent: a placeholder institution must never be counted.
    expect(institutions.has('-')).toBe(false);
  });

  it('renders one card per research axis, each linking to /eixos', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    const cards = container.querySelectorAll('.home-axis-card');
    expect(cards).toHaveLength(researchAxes.pt.length);
    cards.forEach((card) => expect(card).toHaveAttribute('href', '/eixos'));

    // Compact by design: titles only, no ODS chips.
    expect(container.querySelector('.home-sdg-chip')).toBeNull();

    // The "Eixo N – " prefix is dropped because the number has its own badge.
    const firstTitle = container.querySelector('.home-axis-title').textContent;
    expect(firstTitle).not.toMatch(/^Eixo\s*\d/);
    expect(researchAxes.pt[0].title).toContain(firstTitle);
  });

  it('pairs the axis grid with the solutions panel inside a single band', async () => {
    const { container } = renderWithProviders(<Home />);
    await screen.findByText(homeContent.pt.stats.title);

    // One section holds both halves — they used to be two full-width bands.
    const band = container.querySelector('.home-axis-grid').closest('section');
    expect(band.querySelector('.home-solutions-panel')).not.toBeNull();

    expect(
      screen.getByRole('heading', { name: homeContent.pt.solutions.title })
    ).toBeInTheDocument();

    // The panel summarises the catalog with counts, not laboratory cards.
    const metrics = [...container.querySelectorAll('.home-solutions-metric-value')].map(
      (el) => el.textContent
    );
    expect(metrics).toEqual([
      String(technicalServices.length),
      String(laboratories.length),
      homeContent.pt.solutions.trlValue,
    ]);
    expect(container.querySelector('.home-lab-card')).toBeNull();

    expect(
      screen.getByRole('link', { name: new RegExp(homeContent.pt.solutions.cta, 'i') })
    ).toHaveAttribute('href', '/solucoes');
  });

  it('renders the institutional layer in English when the stored language is en', async () => {
    localStorage.setItem('cp2b_lang', 'en');

    renderWithProviders(<Home />);

    expect(await screen.findByText(homeContent.en.stats.title)).toBeInTheDocument();
    expect(screen.getByText(homeContent.en.axes.title)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: new RegExp(homeContent.en.solutions.cta, 'i') })
    ).toHaveAttribute('href', '/solucoes');
  });
});
