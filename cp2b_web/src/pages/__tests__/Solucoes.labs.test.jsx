import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Solucoes from '../Solucoes';

describe('Infraestrutura e Soluções — laboratórios', () => {
  it('shows only the bioprocess labs; LESP and LABSOS live in the Axis 8 details', () => {
    renderWithProviders(<Solucoes />);
    expect([...document.querySelectorAll('.lab-rail__acr')].map((e) => e.textContent)).toEqual(['CEMARA', 'CP2b Lab', 'PPBIOEN']);
    expect(screen.queryByText('LESP')).toBeNull();
    expect(screen.queryByText('LABSOS')).toBeNull();
  });

  it('renders chemical formulas from the spreadsheet with subscripts, not LaTeX', () => {
    renderWithProviders(<Solucoes />);
    expect(document.body.textContent).not.toMatch(/\$CH_4\$/);
  });
});
