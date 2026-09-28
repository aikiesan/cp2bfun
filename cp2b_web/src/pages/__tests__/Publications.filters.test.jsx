import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import api from '../../services/api';
import Publications from '../Publications';

const article = {
  id: 1,
  title_pt: 'Artigo sobre biogás',
  authors: 'Silva, J.',
  journal: 'Nature Energy',
  year: 2025,
  publication_type: 'article',
};
const chapter = {
  id: 2,
  title_pt: 'Capítulo sem links',
  authors: 'Costa, A.',
  year: 2024,
  publication_type: 'chapter',
};

const openAt = (url) => {
  window.history.replaceState(null, '', url);
  return renderWithProviders(<Publications />);
};

const param = (name) => new URLSearchParams(window.location.search).get(name);
const lastRequest = () => api.get.mock.calls.at(-1)[0];

const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 40, left: 0, right: 60, width: 60, height: 40, x: 0, y: 0,
  });

beforeEach(() => {
  vi.clearAllMocks();
  motion.reduce = false;
  api.get.mockResolvedValue({ data: [article, chapter] });
});

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('Publications — filters in the link', () => {
  it('opens with ?ano= and ?tipo= already applied', async () => {
    openAt('/publicacoes?ano=2025&tipo=article');
    await screen.findByText('Artigo sobre biogás');

    expect(lastRequest()).toBe('/publications?year=2025&type=article');
    expect(screen.getByLabelText('Ano')).toHaveValue('2025');
    expect(screen.getByLabelText('Tipo')).toHaveValue('article');
  });

  it('opens with ?busca= in the field and in the request', async () => {
    openAt('/publicacoes?busca=biog%C3%A1s');
    await screen.findByText('Artigo sobre biogás');

    expect(lastRequest()).toBe('/publications?search=biog%C3%A1s');
    expect(screen.getByPlaceholderText('Título, autores, revista...')).toHaveValue('biogás');
  });

  it('ignores a year or type it does not recognise', async () => {
    openAt('/publicacoes?ano=20x5&tipo=poema');
    await screen.findByText('Artigo sobre biogás');

    expect(lastRequest()).toBe('/publications?');
    expect(screen.getByLabelText('Ano')).toHaveValue('all');
    expect(screen.getByLabelText('Tipo')).toHaveValue('all');
  });

  it('leaves the URL alone when opened without parameters', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');
    await new Promise((resolve) => setTimeout(resolve, 450));

    expect(window.location.search).toBe('');
    expect(lastRequest()).toBe('/publications?');
  });

  it('writes each choice to the URL and drops it again on "Todos"', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');
    const historyLength = window.history.length;

    fireEvent.change(screen.getByLabelText('Ano'), { target: { value: '2024' } });
    expect(window.location.search).toBe('?ano=2024');

    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'chapter' } });
    expect(window.location.search).toBe('?ano=2024&tipo=chapter');
    await waitFor(() => expect(lastRequest()).toBe('/publications?year=2024&type=chapter'));

    fireEvent.change(screen.getByLabelText('Ano'), { target: { value: 'all' } });
    expect(window.location.search).toBe('?tipo=chapter');
    // Filtering is not navigation: no new history entries.
    expect(window.history.length).toBe(historyLength);
    expect(lastRequest()).toBe('/publications?type=chapter');
    await screen.findByText('2 publicações');
  });

  it('searches as you type and brings the URL along after a pause', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');

    const field = screen.getByPlaceholderText('Título, autores, revista...');
    fireEvent.change(field, { target: { value: 'Costa' } });

    expect(field).toHaveValue('Costa');
    await waitFor(() => expect(lastRequest()).toBe('/publications?search=Costa'));
    await waitFor(() => expect(param('busca')).toBe('Costa'));
  });

  it('keeps the current list on screen while the next one loads', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');

    let answer;
    api.get.mockReturnValueOnce(new Promise((resolve) => { answer = resolve; }));
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'chapter' } });

    // No spinner in place of the list: the old list stays until the new one
    // arrives, which is what lets the items glide from one to the other.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Artigo sobre biogás')).toBeInTheDocument();

    answer({ data: [chapter] });
    await waitFor(() => expect(screen.queryByText('Artigo sobre biogás')).not.toBeInTheDocument());
    expect(screen.getByText('Capítulo sem links')).toBeInTheDocument();
  });

  it('does not let a slow earlier answer overwrite the current filter', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');

    let slow;
    api.get.mockReturnValueOnce(new Promise((resolve) => { slow = resolve; }));
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'article' } });
    api.get.mockResolvedValueOnce({ data: [chapter] });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'chapter' } });

    await waitFor(() => expect(screen.queryByText('Artigo sobre biogás')).not.toBeInTheDocument());
    slow({ data: [article] });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('Artigo sobre biogás')).not.toBeInTheDocument();
    expect(screen.getByText('Capítulo sem links')).toBeInTheDocument();
  });

  it('announces the new count politely once a filter changes', async () => {
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');
    expect(screen.queryByText('2 publicações')).not.toBeInTheDocument();

    api.get.mockResolvedValueOnce({ data: [chapter] });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'chapter' } });
    expect(await screen.findByText('1 publicação')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Publications — how the list moves', () => {
  it('shows the first list as it always did, with no entrance', async () => {
    giveLayout();
    openAt('/publicacoes');
    await screen.findByText('Artigo sobre biogás');
    // The year block is already at rest, not starting a fade-in.
    const block = screen.getByRole('heading', { name: '2025' }).parentElement;
    expect(block.style.opacity).toBe('1');
  });

  it('lets a filtered-out publication fade before it leaves, when motion is allowed', async () => {
    giveLayout();
    openAt('/publicacoes');
    await screen.findByText('Capítulo sem links');

    api.get.mockResolvedValueOnce({ data: [article] });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'article' } });
    await screen.findByText('1 publicação');

    // The new list is in, and the chapter is still there on its way out...
    expect(screen.getByText('Capítulo sem links')).toBeInTheDocument();
    // ...until the fade is over.
    await waitFor(() => expect(screen.queryByText('Capítulo sem links')).not.toBeInTheDocument());
  });

  it('has no transition at all under reduced motion', async () => {
    motion.reduce = true;
    giveLayout();
    openAt('/publicacoes');
    await screen.findByText('Capítulo sem links');

    api.get.mockResolvedValueOnce({ data: [article] });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'article' } });
    await screen.findByText('1 publicação');

    expect(screen.queryByText('Capítulo sem links')).not.toBeInTheDocument();
    const card = screen.getByText('Artigo sobre biogás').closest('.card').parentElement;
    expect(card.getAttribute('style')).toBeNull();
  });
});
