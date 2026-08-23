import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import ForumPaulista from '../ForumPaulista';

// A página busca os álbuns da galeria no mount; sem mock o teste dispara
// uma chamada real e polui o console.
vi.mock('../../services/api', () => ({
  fetchGallery: vi.fn().mockResolvedValue([]),
}));

describe('ForumPaulista', () => {
  it('renders the Forum Paulista title', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByRole('heading', { name: /Fórum Paulista/i })).toBeInTheDocument();
  });

  it('presents the event as finished, not upcoming', () => {
    renderWithProviders(<ForumPaulista />);
    // O evento acabou: nada de "Inscreva-se" ou "Salvar Data na Agenda".
    expect(screen.queryByText(/Inscreva-se/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Salvar Data na Agenda/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Realizado em 28 de maio de 2026/i)).toBeInTheDocument();
  });

  it('links to the photo section instead of the removed schedule page', () => {
    renderWithProviders(<ForumPaulista />);
    const link = screen.getByText('Ver as fotos').closest('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#fotos');
  });

  it('renders the outcomes section', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByText('O que ficou do Fórum')).toBeInTheDocument();
  });

  it('renders FAQ section', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByText('Perguntas Frequentes')).toBeInTheDocument();
  });

  it('renders at least 5 FAQ items', () => {
    renderWithProviders(<ForumPaulista />);
    const faqButtons = screen.getAllByRole('button');
    expect(faqButtons.length).toBeGreaterThanOrEqual(5);
  });
});
