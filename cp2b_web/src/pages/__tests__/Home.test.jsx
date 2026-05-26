import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Home from '../Home';

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
    expect(headline.style.backgroundImage).toContain('/assets/DSC00361-1920x748.jpg');

    const link = within(headline.closest('a')).getByText('Destaque A');
    expect(headline.closest('a')).toHaveAttribute('href', '/noticias/destaque-a');
    expect(link).toBeInTheDocument();
  });
});
