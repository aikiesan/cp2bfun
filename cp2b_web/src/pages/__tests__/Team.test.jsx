import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
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

// A person now legitimately appears in several groups — a director shows up
// under Direção and again under each of their axes — so most assertions use
// getAllByText, or scope the query to one section.
const sectionFor = (heading) => heading.closest('section');

describe('Team page — grouped by Eixo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTeam.mockResolvedValue({});
  });

  it('groups by Eixo and direction instead of by rank', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    expect(screen.getByRole('heading', { name: /Direção do CP2b/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Eixo 1 —/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Eixo 8 —/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Colaboradores e Parceiros/ })).toBeInTheDocument();

    // The old hierarchy is gone from the page entirely.
    expect(screen.queryByRole('heading', { name: 'Pesquisadores Responsáveis' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pesquisadores Principais' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pesquisadores Associados' })).not.toBeInTheDocument();
  });

  it('shows the directors under Direção and still inside their own axes', async () => {
    renderWithProviders(<Team />);

    const direction = await waitFor(() =>
      sectionFor(screen.getByRole('heading', { name: /Direção do CP2b/ }))
    );

    // Both directors lead the centre as a whole...
    expect(within(direction).getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    expect(within(direction).getByText('Renata Piacentini Rodriguez')).toBeInTheDocument();

    // ...and still appear as members of the axes they work in (6 and 7),
    // which is the point of reading the team horizontally.
    const axis6 = sectionFor(screen.getByRole('heading', { name: /^Eixo 6 —/ }));
    expect(within(axis6).getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    expect(within(axis6).getByText('Renata Piacentini Rodriguez')).toBeInTheDocument();
  });

  it('puts people with no axis into Colaboradores rather than guessing one', async () => {
    renderWithProviders(<Team />);

    const collaborators = await waitFor(() =>
      sectionFor(screen.getByRole('heading', { name: /Colaboradores e Parceiros/ }))
    );

    // An external partner the spreadsheet never places in an axis.
    expect(within(collaborators).getByText('Jens Bo Holm-Nielsen')).toBeInTheDocument();
  });

  it('renders <img> for members with photos and initials for those without', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    const brunaImgs = screen.getAllByRole('img', { name: 'Bruna de Souza Moraes' });
    expect(brunaImgs[0]).toHaveAttribute('src', '/assets/team/bruna-de-souza-moraes.webp');

    // Aline Veronese da Silva has no photo -> initials 'AV'.
    expect(screen.getAllByText('Aline Veronese da Silva').length).toBeGreaterThan(0);
    expect(screen.queryByRole('img', { name: 'Aline Veronese da Silva' })).not.toBeInTheDocument();
    expect(screen.getAllByText('AV').length).toBeGreaterThan(0);
  });

  it('filters members in real time when typing in the search field', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByRole('searchbox', { name: /buscar membro da equipe/i });
    fireEvent.change(searchInput, { target: { value: 'Lamparelli' } });

    expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();

    // Search by institution
    fireEvent.change(searchInput, { target: { value: 'POLI/USP' } });
    expect(screen.getAllByText('Rachel Biancalana Costa').length).toBeGreaterThan(0);
    expect(screen.queryByText('Rubens Augusto Camargo Lamparelli')).not.toBeInTheDocument();
  });

  it('filters to a single axis when clicking its chip', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /^Eixo 1/ }));

    expect(screen.getByRole('heading', { name: /^Eixo 1 —/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Eixo 2 —/ })).not.toBeInTheDocument();
    expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Todos/i }));
    expect(screen.getByRole('heading', { name: /^Eixo 2 —/ })).toBeInTheDocument();
  });

  it('does not display email or phone numbers on public cards', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('bsmoraes@unicamp.br')).not.toBeInTheDocument();
    expect(screen.queryByText('+55 (19) 3521-1241')).not.toBeInTheDocument();
  });
});
