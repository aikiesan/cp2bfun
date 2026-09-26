import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import { emDefesoEleitoral } from '../../utils/defeso';

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  fetchPartnersGrouped: vi.fn().mockResolvedValue({
    host: [{ id: 1, name_pt: 'Núcleo Interdisciplinar de Planejamento Energético (NIPE/UNICAMP)', category: 'host', location: 'Campinas, SP' }],
    // O que a API de produção devolvia em set/2026, durante o defeso.
    public: [
      { id: 2, name_pt: 'Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)', category: 'public', location: 'São Paulo, SP' },
      { id: 3, name_pt: 'Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)', category: 'public', location: 'Campinas, SP' },
    ],
    research: [{ id: 4, name_pt: 'Universidade Federal de Alfenas (UNIFAL)', category: 'research', location: 'Alfenas, MG' }],
    companies: [],
  }),
}));

import PartnersPage from '../about/PartnersPage';

describe('Defeso eleitoral 2026', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('covers 04/07/2026 through the second round, and ends on 26/10/2026', () => {
    expect(emDefesoEleitoral(new Date('2026-07-03T23:59:00-03:00'))).toBe(false);
    expect(emDefesoEleitoral(new Date('2026-07-04T00:00:00-03:00'))).toBe(true);
    expect(emDefesoEleitoral(new Date('2026-09-28T09:00:00-03:00'))).toBe(true);
    expect(emDefesoEleitoral(new Date('2026-10-25T23:59:00-03:00'))).toBe(true);
    expect(emDefesoEleitoral(new Date('2026-10-26T00:00:00-03:00'))).toBe(false);
  });

  it('keeps government bodies off /sobre/parceiros during the defeso, even if the API returns them', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-28T09:00:00-03:00'));
    renderWithProviders(<PartnersPage />);

    await waitFor(() => expect(screen.getByText('Universidade Federal de Alfenas (UNIFAL)')).toBeInTheDocument());
    expect(screen.queryByText(/Secretaria Estadual de Agricultura/)).toBeNull();
    expect(screen.queryByText(/Secretaria Municipal do Verde/)).toBeNull();
  });

  it('shows them again once the defeso is over', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-26T09:00:00-03:00'));
    renderWithProviders(<PartnersPage />);

    await waitFor(() => expect(screen.getByText(/Secretaria Estadual de Agricultura/)).toBeInTheDocument());
    expect(screen.getByText(/Secretaria Municipal do Verde/)).toBeInTheDocument();
  });
});
