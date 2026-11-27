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

  it('seats Metaninho on the edge on the Home and Comunicação pages only', () => {
    for (const path of ['/', '/noticias', '/metaninho']) {
      window.history.pushState({}, '', path);
      const { container, unmount } = renderWithProviders(<Footer />);
      const seat = container.querySelector('.footer-metaninho');
      expect(seat, path).not.toBeNull();
      expect(seat.querySelector('img')).toHaveAttribute('src', '/assets/metaninho/metaninho-tranquilo.webp');
      // Easter egg: he is a button that talks when clicked.
      expect(screen.getByRole('button', { name: 'Metaninho, o mascote do CP2b' })).toBeInTheDocument();
      unmount();
    }

    for (const path of ['/sobre', '/equipe', '/noticias/alguma-noticia']) {
      window.history.pushState({}, '', path);
      const { container, unmount } = renderWithProviders(<Footer />);
      expect(container.querySelector('.footer-metaninho'), path).toBeNull();
      unmount();
    }
    window.history.pushState({}, '', '/');
  });
});
