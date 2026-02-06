import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Header from '../Header';

describe('Header', () => {
  it('renders the logo', () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText('CP2B Logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    // Default language is pt
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Equipe')).toBeInTheDocument();
    expect(screen.getByText('Novidades')).toBeInTheDocument();
  });

  it('does not render a search bar', () => {
    renderWithProviders(<Header />);
    expect(screen.queryByPlaceholderText('Buscar')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  it('renders accessibility buttons', () => {
    renderWithProviders(<Header />);
    expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle high contrast')).toBeInTheDocument();
  });

  it('toggles language when clicking flag buttons', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    // Start in PT, switch to EN
    await user.click(screen.getByTitle('English'));
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Switch back to PT
    await user.click(screen.getByTitle('Portuguese'));
    expect(screen.getByText('Início')).toBeInTheDocument();
  });
});
