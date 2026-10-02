import { describe, it, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import ForumPaulista from '../ForumPaulista';

describe('ForumPaulista', () => {
  it('presents the Forum as a completed event memoir', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByRole('heading', { name: 'Este foi o nosso Fórum. E foi incrível.' })).toBeInTheDocument();
    expect(screen.getByText('Até o ano que vem!')).toBeInTheDocument();
    expect(screen.queryByText(/Inscreva-se/i)).not.toBeInTheDocument();
  });

  it('shows the final attendance total supplied by the organizers', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByText('140')).toBeInTheDocument();
    expect(screen.getByText('pessoas presentes')).toBeInTheDocument();
  });

  it('links the main action to the photographic record', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByText('Rever os melhores momentos').closest('a')).toHaveAttribute('href', '#fotos');
  });

  it('keeps the Forum-to-opening memory and omits the removed long sections', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getByRole('heading', { name: 'Dois dias que marcaram a história do CP2b' })).toBeInTheDocument();
    expect(screen.queryByText('Um evento contado em quatro momentos')).not.toBeInTheDocument();
    expect(screen.queryByText('Os assuntos que moveram o dia')).not.toBeInTheDocument();
  });

  it('starts with a curated selection and can reveal all 30 photographs', () => {
    renderWithProviders(<ForumPaulista />);
    expect(screen.getAllByRole('button', { name: /^Foto \d+ de 30:/ })).toHaveLength(12);
    fireEvent.click(screen.getByRole('button', { name: 'Ver as 30 fotos' }));
    expect(screen.getAllByRole('button', { name: /^Foto \d+ de 30:/ })).toHaveLength(30);
  });

  it('opens and closes the accessible photo viewer', () => {
    renderWithProviders(<ForumPaulista />);
    fireEvent.click(screen.getByRole('button', { name: /^Foto 1 de 30:/ }));
    expect(screen.getByRole('dialog', { name: 'Foto 1 de 30' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
