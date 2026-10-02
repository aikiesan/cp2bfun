import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../../context/LanguageContext';
import AlbumView from '../AlbumView';

vi.mock('../../services/api', () => ({
  default: { get: vi.fn() },
  fetchGallery: vi.fn(async () => [
    { id: 1, url: '/uploads/gallery/capa.jpg', title: 'Fórum 2026', caption: null, date: '2026-05-10', album_id: 'album-1', is_cover: true },
    { id: 2, url: '/uploads/gallery/a.jpg', title: 'Fórum 2026', caption: 'Abertura com a reitoria', date: '2026-05-10', album_id: 'album-1', is_cover: false },
    { id: 3, url: '/uploads/gallery/b.jpg', title: 'Fórum 2026', caption: null, date: '2026-05-10', album_id: 'album-1', is_cover: false },
  ]),
}));

const renderAlbum = () => render(
  <HelmetProvider>
    <LanguageProvider>
      <MemoryRouter initialEntries={['/galeria/album-1']}>
        <Routes>
          <Route path="/galeria/:albumId" element={<AlbumView />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  </HelmetProvider>
);

describe('AlbumView — legenda das fotos', () => {
  it('mostra a legenda sob a foto e usa como texto alternativo', async () => {
    renderAlbum();

    expect(await screen.findByText('Abertura com a reitoria')).toBeInTheDocument();
    expect(screen.getByAltText('Abertura com a reitoria')).toBeInTheDocument();
    // Foto sem legenda continua com o título do álbum, e nenhum texto extra.
    expect(screen.getByAltText('Fórum 2026 2')).toBeInTheDocument();
    expect(document.querySelectorAll('.photo-caption')).toHaveLength(1);
  });

  it('mostra a legenda na visualização ampliada, só na foto que tem', async () => {
    const user = userEvent.setup();
    renderAlbum();

    await user.click(await screen.findByRole('button', { name: 'Abertura com a reitoria — 1/2' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Abertura com a reitoria').tagName).toBe('FIGCAPTION');

    await user.click(within(dialog).getByRole('button', { name: 'Next photo' }));
    expect(within(dialog).getByText('2 / 2')).toBeInTheDocument();
    expect(within(dialog).queryByText('Abertura com a reitoria')).not.toBeInTheDocument();
  });
});
