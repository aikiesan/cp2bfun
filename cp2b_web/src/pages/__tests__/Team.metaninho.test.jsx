import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

vi.mock('../../services/api', () => ({
  fetchTeam: vi.fn(),
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { fetchTeam } from '../../services/api';
import Team from '../Team';

const openAt = (url) => {
  window.history.replaceState(null, '', url);
  return renderWithProviders(<Team />);
};

beforeEach(() => {
  fetchTeam.mockResolvedValue({});
});

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('Team — Metaninho easter egg', () => {
  it('searching "metaninho" finds the mascot instead of the empty state', async () => {
    openAt('/equipe?busca=Metaninho');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Metaninho' })).toBeInTheDocument());
    expect(screen.getByText('Mascote oficial do CP2b')).toBeInTheDocument();
    expect(screen.queryByText('Nenhum membro encontrado com os filtros selecionados.')).not.toBeInTheDocument();
  });

  it('stays hidden for every other search', async () => {
    openAt('/equipe?busca=metano');
    await waitFor(() => expect(screen.getByText('Nenhum membro encontrado com os filtros selecionados.')).toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: 'Metaninho' })).not.toBeInTheDocument();
  });
});
