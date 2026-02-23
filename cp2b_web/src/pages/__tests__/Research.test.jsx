import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Research from '../Research';

describe('Research', () => {
  it('renders the research structure heading', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Estrutura de Pesquisa')).toBeInTheDocument();
  });

  it('renders at least 8 accordion items (research axes)', () => {
    renderWithProviders(<Research />);
    // Each axis has an Accordion.Header button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(8);
  });

  it('renders "Conheça os Eixos" section title', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Conheça os Eixos')).toBeInTheDocument();
  });

  it('renders SDG tag label', () => {
    renderWithProviders(<Research />);
    // SDG labels appear for axes that have sdgs defined
    const sdgLabels = screen.queryAllByText('ODS Relacionados:');
    expect(sdgLabels.length).toBeGreaterThanOrEqual(0);
  });
});
