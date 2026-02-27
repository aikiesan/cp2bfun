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

  it('renders at least one SDG tag label', () => {
    renderWithProviders(<Research />);
    // Several research axes have SDG references defined in content.js.
    // Using queryAllByText (not getAllByText) lets us count without throwing
    // if somehow none exist — but we expect at least one to be present.
    // Note: .toBeGreaterThanOrEqual(0) would ALWAYS pass (array.length >= 0
    // is a tautology). Use a real lower bound instead.
    const sdgLabels = screen.queryAllByText('ODS Relacionados:');
    expect(sdgLabels.length).toBeGreaterThan(0);
  });
});
