import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import News from '../News';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchNews: vi.fn(),
}));

import { fetchNews } from '../../services/api';

const mockNewsItems = [
  {
    id: 1,
    slug: 'noticia-1',
    date_display: '01 Jan 2025',
    image: '/assets/test.jpg',
    badge: 'PESQUISA',
    badge_color: 'success',
    title_pt: 'Notícia de teste',
    title_en: 'Test news',
    description_pt: 'Descrição de teste',
    description_en: 'Test description',
  },
  {
    id: 2,
    slug: 'noticia-2',
    date_display: '02 Jan 2025',
    image: '/assets/test2.jpg',
    badge: 'EVENTO',
    badge_color: 'primary',
    title_pt: 'Segunda notícia',
    title_en: 'Second news',
    description_pt: 'Segunda descrição',
    description_en: 'Second description',
  },
];

describe('News', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading', () => {
    fetchNews.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<News />);
    expect(document.querySelector('.spinner-border')).toBeInTheDocument();
  });

  it('renders news cards after loading', async () => {
    fetchNews.mockResolvedValueOnce(mockNewsItems);
    renderWithProviders(<News />);

    await waitFor(() => {
      expect(screen.getByText('Notícia de teste')).toBeInTheDocument();
    });
  });

  it('renders news page title', async () => {
    fetchNews.mockResolvedValueOnce(mockNewsItems);
    renderWithProviders(<News />);

    await waitFor(() => {
      expect(screen.getByText('Agencia CP2b de Noticias')).toBeInTheDocument();
    });
  });

  it('renders article link to news detail', async () => {
    fetchNews.mockResolvedValueOnce(mockNewsItems);
    renderWithProviders(<News />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const newsLink = links.find(l => l.getAttribute('href') === '/noticias/noticia-1');
      expect(newsLink).toBeTruthy();
    });
  });
});
