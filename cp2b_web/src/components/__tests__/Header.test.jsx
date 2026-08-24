import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Header from '../Header';

describe('Header', () => {
  it('renders the logo', () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText('CP2b Logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    // Default language is pt
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Comunicação')).toBeInTheDocument();
    expect(screen.getByText('Publicações Científicas')).toBeInTheDocument();
    expect(screen.getByText('Eixos')).toBeInTheDocument();
  });

  it('does not render a search bar', () => {
    renderWithProviders(<Header />);
    expect(screen.queryByPlaceholderText('Buscar')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  it('renders accessibility buttons with >= 44x44px touch targets', () => {
    renderWithProviders(<Header />);
    const incBtn = screen.getByLabelText('Increase font size');
    const decBtn = screen.getByLabelText('Decrease font size');
    const contrastBtn = screen.getByLabelText('Toggle high contrast');

    expect(incBtn).toBeInTheDocument();
    expect(decBtn).toBeInTheDocument();
    expect(contrastBtn).toBeInTheDocument();

    expect(incBtn).toHaveClass('header-touch-target');
    expect(decBtn).toHaveClass('header-touch-target');
    expect(contrastBtn).toHaveClass('header-touch-target');
  });

  it('renders navbar toggle with explicit aria-label', () => {
    renderWithProviders(<Header />);
    const toggleBtn = screen.getByLabelText('Alternar navegação');
    expect(toggleBtn).toBeInTheDocument();
  });

  it('toggles language when clicking language buttons', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const ptBtn = screen.getByTitle('Português');
    const enBtn = screen.getByTitle('English');

    expect(ptBtn).toHaveClass('header-touch-target');
    expect(enBtn).toHaveClass('header-touch-target');

    // Start in PT, switch to EN
    await user.click(enBtn);
    expect(screen.getByText('About')).toBeInTheDocument();

    // Switch back to PT
    await user.click(ptBtn);
    expect(screen.getByText('Sobre')).toBeInTheDocument();
  });
});
