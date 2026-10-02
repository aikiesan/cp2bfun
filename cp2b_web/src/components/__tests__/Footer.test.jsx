import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders NIPE contact section', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/NIPE/)).toBeInTheDocument();
    expect(screen.getByText(/Rua Cora Coralina, 330/)).toBeInTheDocument();
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
    await user.click(screen.getByText('Voltar ao topo ↑'));
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    scrollSpy.mockRestore();
  });

  it('seats Metaninho on the edge on inner pages, not on the Home', () => {
    window.history.pushState({}, '', '/');
    const { container, unmount } = renderWithProviders(<Footer />);
    expect(container.querySelector('.footer-metaninho')).toBeNull();
    unmount();

    window.history.pushState({}, '', '/sobre');
    const inner = renderWithProviders(<Footer />);
    const seat = inner.container.querySelector('.footer-metaninho');
    expect(seat.querySelector('img')).toHaveAttribute('src', '/assets/metaninho/metaninho-tranquilo.webp');
    // Easter egg: he is a button that talks when clicked.
    expect(screen.getByRole('button', { name: 'Metaninho, o mascote do CP2b' })).toBeInTheDocument();
    window.history.pushState({}, '', '/');
  });
});
