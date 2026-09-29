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

  it('shows Metaninho peeking over the edge on inner pages, not on the Home', () => {
    window.history.pushState({}, '', '/');
    const { container, unmount } = renderWithProviders(<Footer />);
    expect(container.querySelector('.footer-metaninho')).toBeNull();
    unmount();

    window.history.pushState({}, '', '/sobre');
    const inner = renderWithProviders(<Footer />);
    const peek = inner.container.querySelector('.footer-metaninho');
    expect(peek).toHaveAttribute('aria-hidden', 'true');
    expect(peek.querySelector('img')).toHaveAttribute('src', '/assets/metaninho/metaninho-feliz.webp');
    window.history.pushState({}, '', '/');
  });
});
