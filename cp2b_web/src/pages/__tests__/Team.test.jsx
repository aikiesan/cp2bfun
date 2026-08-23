import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Team from '../Team';

vi.mock('../../services/api', () => ({
  fetchTeam: vi.fn(),
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { fetchTeam } from '../../services/api';

describe('Team page — redesigned UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTeam.mockResolvedValue({});
  });

  it('renders team page with static fallback and category headings', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Pesquisadores Responsáveis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pesquisadores Principais' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pesquisadores Associados' })).toBeInTheDocument();
  });

  it('renders <img> for members with photos and initials for members without photos', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    });

    // Bruna de Souza Moraes has a photo
    const brunaImg = screen.getByRole('img', { name: 'Bruna de Souza Moraes' });
    expect(brunaImg).toHaveAttribute('src', '/assets/team/bruna-de-souza-moraes.webp');

    // Aline Veronese da Silva does not have a photo -> renders initials 'AV'
    expect(screen.getByText('Aline Veronese da Silva')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Aline Veronese da Silva' })).not.toBeInTheDocument();
    expect(screen.getByText('AV')).toBeInTheDocument();
  });

  it('filters members in real time when typing in search field', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('searchbox', { name: /buscar membro da equipe/i });
    fireEvent.change(searchInput, { target: { value: 'Lamparelli' } });

    expect(screen.getByText('Rubens Augusto Camargo Lamparelli')).toBeInTheDocument();
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();

    // Search by institution
    fireEvent.change(searchInput, { target: { value: 'POLI/USP' } });
    expect(screen.getByText('Rachel Biancalana Costa')).toBeInTheDocument();
    expect(screen.queryByText('Rubens Augusto Camargo Lamparelli')).not.toBeInTheDocument();
  });

  it('filters members when clicking category chips', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    });

    // Click on "Pesquisadores Principais" chip
    const principalsChip = screen.getByRole('button', { name: /Pesquisadores Principais/i });
    fireEvent.click(principalsChip);

    expect(screen.getByText('Rubens Augusto Camargo Lamparelli')).toBeInTheDocument();
    expect(screen.getByText('Rafael de Brito Dias')).toBeInTheDocument();
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();

    // Click on "Todos" chip
    const allChip = screen.getByRole('button', { name: /Todos/i });
    fireEvent.click(allChip);

    expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    expect(screen.getByText('Rubens Augusto Camargo Lamparelli')).toBeInTheDocument();
  });

  it('does not display email or phone numbers on public cards', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    });

    expect(screen.queryByText('bsmoraes@unicamp.br')).not.toBeInTheDocument();
    expect(screen.queryByText('+55 (19) 3521-1241')).not.toBeInTheDocument();
  });
});
