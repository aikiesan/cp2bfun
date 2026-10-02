import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import GalleryList from '../GalleryList';

vi.mock('../../../services/api', () => ({
  default: { get: vi.fn() },
  fetchGallery: vi.fn(),
  fetchGalleryStorage: vi.fn(async () => null),
  deleteGalleryPhoto: vi.fn(),
  deleteGalleryAlbum: vi.fn(),
  updateGalleryCaption: vi.fn(),
}));

import { fetchGallery, updateGalleryCaption } from '../../../services/api';

const PHOTOS = [
  { id: 1, url: '/uploads/gallery/capa.jpg', title: 'Fórum 2026', caption: null, date: '2026-05-10', album_id: 'album-1', is_cover: true },
  { id: 2, url: '/uploads/gallery/a.jpg', title: 'Fórum 2026', caption: null, date: '2026-05-10', album_id: 'album-1', is_cover: false },
  { id: 3, url: '/uploads/gallery/b.jpg', title: 'Fórum 2026', caption: 'Plenária', date: '2026-05-10', album_id: 'album-1', is_cover: false },
];

describe('GalleryList — legenda das fotos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchGallery.mockResolvedValue(PHOTOS);
  });

  it('tem campo de legenda nas fotos do álbum, e não na capa', async () => {
    renderWithProviders(<GalleryList />);

    expect(await screen.findByLabelText('Legenda da foto 2')).toHaveValue('');
    expect(screen.getByLabelText('Legenda da foto 3')).toHaveValue('Plenária');
    expect(screen.queryByLabelText('Legenda da foto 1')).not.toBeInTheDocument();
    expect(screen.getByText('A capa não aparece dentro do álbum')).toBeInTheDocument();
    // Sem alteração, sem botão de salvar.
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('salva a legenda digitada', async () => {
    updateGalleryCaption.mockResolvedValueOnce({ ...PHOTOS[1], caption: 'Abertura com a reitoria' });
    const user = userEvent.setup();
    renderWithProviders(<GalleryList />);

    await user.type(await screen.findByLabelText('Legenda da foto 2'), '  Abertura com a reitoria ');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(updateGalleryCaption).toHaveBeenCalledWith(2, 'Abertura com a reitoria');
    expect(await screen.findByText('Legenda salva!')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument());
  });

  it('Enter salva e apagar o texto remove a legenda', async () => {
    updateGalleryCaption.mockResolvedValueOnce({ ...PHOTOS[2], caption: null });
    const user = userEvent.setup();
    renderWithProviders(<GalleryList />);

    const input = await screen.findByLabelText('Legenda da foto 3');
    await user.clear(input);
    await user.keyboard('{Enter}');

    expect(updateGalleryCaption).toHaveBeenCalledWith(3, '');
    expect(await screen.findByText('Legenda removida.')).toBeInTheDocument();
  });

  it('mostra o erro do servidor quando não consegue salvar', async () => {
    updateGalleryCaption.mockRejectedValueOnce({ response: { data: { error: 'A legenda pode ter até 300 caracteres.' } } });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    renderWithProviders(<GalleryList />);

    await user.type(await screen.findByLabelText('Legenda da foto 2'), 'x');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('A legenda pode ter até 300 caracteres.')).toBeInTheDocument();
  });
});
