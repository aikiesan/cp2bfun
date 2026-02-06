import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders NIPE section', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('NIPE')).toBeInTheDocument();
  });

  it('renders social links', () => {
    renderWithProviders(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders dynamic copyright year', () => {
    renderWithProviders(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`1969 - ${year}`))).toBeInTheDocument();
  });

  it('back-to-top button calls scrollTo', async () => {
    const user = userEvent.setup();
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    renderWithProviders(<Footer />);
    // Default language is pt
    await user.click(screen.getByText('VOLTAR AO TOPO ↑'));
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    scrollSpy.mockRestore();
  });
});
