import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import ForumPaulista from '../ForumPaulista';

describe('ForumPaulista', () => {
  it('renders the Forum Paulista title', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByRole('heading', { name: /Fórum Paulista/i })).toBeInTheDocument();
  });

  it('"Cronograma do Evento" button links to /cronograma-evento', () => {
    renderWithProviders(<ForumPaulista />);
    const link = screen.getAllByText('Cronograma do Evento')[0].closest('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toMatch(/^\/cronograma-evento/);
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
