import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import NotFound from '../NotFound';

describe('NotFound', () => {
  it('renders 404 title', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the not found message in Portuguese by default', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('Pagina nao encontrada')).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    renderWithProviders(<NotFound />);
    const homeLink = screen.getByText('Voltar ao Inicio');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
});
