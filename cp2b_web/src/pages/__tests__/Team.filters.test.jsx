import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

// O sistema operacional pedindo menos movimento é controlado daqui; o resto
// do Framer Motion é o de verdade.
const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

vi.mock('../../services/api', () => ({
  fetchTeam: vi.fn(),
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { fetchTeam } from '../../services/api';
import Team from '../Team';

// O BrowserRouter dos testes lê a URL da janela.
const openAt = (url) => {
  window.history.replaceState(null, '', url);
  return renderWithProviders(<Team />);
};

const param = (name) => new URLSearchParams(window.location.search).get(name);

const ready = () =>
  waitFor(() => expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0));

// Sem caixa de layout (jsdom) a lista não anima: é assim que os testes antigos
// continuam vendo o resultado na hora. Dar uma caixa liga o movimento.
const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 40, left: 0, right: 60, width: 60, height: 40, x: 0, y: 0,
  });

beforeEach(() => {
  motion.reduce = false;
  fetchTeam.mockResolvedValue({});
});

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('Team — filters in the link', () => {
  it('opens already filtered by ?categoria=', async () => {
    openAt('/equipe?categoria=eixo-1');
    await ready();

    expect(screen.getByRole('heading', { name: /^Eixo 1 —/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Eixo 2 —/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Direção do CP2b/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Eixo 1/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Todos/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('opens already filtered by ?busca=, with the text in the field', async () => {
    openAt('/equipe?busca=Lamparelli');
    await ready();

    expect(screen.getByRole('searchbox', { name: /buscar membro da equipe/i })).toHaveValue('Lamparelli');
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();
  });

  it('ignores a category the page does not have', async () => {
    openAt('/equipe?categoria=eixo-99');
    await ready();

    expect(screen.getByRole('button', { name: /Todos/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: /Direção do CP2b/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Eixo 8 —/ })).toBeInTheDocument();
  });

  it('leaves the URL alone when opened without parameters', async () => {
    openAt('/equipe');
    await ready();
    // Mais que a pausa da busca: nada é escrito só por abrir a página.
    await new Promise((resolve) => setTimeout(resolve, 450));
    expect(window.location.search).toBe('');
  });

  it('writes the chosen chip to the URL, and removes it back on "Todos"', async () => {
    openAt('/equipe');
    await ready();

    fireEvent.click(screen.getByRole('button', { name: /^Eixo 1/ }));
    expect(window.location.search).toBe('?categoria=eixo-1');
    expect(screen.getByRole('button', { name: /^Eixo 1/ })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /Todos/ }));
    expect(window.location.search).toBe('');
  });

  it('replaces the history entry instead of adding one per filter', async () => {
    openAt('/equipe');
    await ready();
    const before = window.history.length;

    fireEvent.click(screen.getByRole('button', { name: /^Eixo 1/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Eixo 2/ }));
    expect(window.history.length).toBe(before);
  });

  it('filters while typing and brings the URL along after a pause, keeping the chip', async () => {
    openAt('/equipe?categoria=eixo-1');
    await ready();

    const field = screen.getByRole('searchbox', { name: /buscar membro da equipe/i });
    fireEvent.change(field, { target: { value: 'Lamparelli ' } });

    // The field and the cards answer at once; the link follows.
    expect(field).toHaveValue('Lamparelli ');
    expect(param('busca')).toBeNull();
    await waitFor(() => expect(param('busca')).toBe('Lamparelli'));
    expect(param('categoria')).toBe('eixo-1');

    fireEvent.change(field, { target: { value: '' } });
    await waitFor(() => expect(param('busca')).toBeNull());
    expect(param('categoria')).toBe('eixo-1');
  });

  it('"Limpar filtros" clears both parameters', async () => {
    openAt('/equipe?categoria=eixo-1&busca=ninguem-com-este-nome');

    fireEvent.click(await screen.findByRole('button', { name: 'Limpar filtros' }));
    expect(param('categoria')).toBeNull();
    await waitFor(() => expect(param('busca')).toBeNull());
    expect(screen.getByRole('heading', { name: /^Eixo 2 —/ })).toBeInTheDocument();
  });

  it('announces the filtered count politely', async () => {
    openAt('/equipe?busca=Lamparelli');
    await ready();
    expect(screen.getByText(/^\d+ pesquisador(es)?$/)).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Team — how the cards move', () => {
  const sectionOf = (name) => screen.getByRole('heading', { name }).closest('section');

  it('shows the page as it always did on arrival, with no entrance', async () => {
    giveLayout();
    openAt('/equipe');
    await ready();
    expect(sectionOf(/Direção do CP2b/).style.opacity).toBe('1');
  });

  it('brings a returning group back with a rise, which then settles', async () => {
    giveLayout();
    openAt('/equipe?categoria=eixo-1');
    await ready();

    fireEvent.click(screen.getByRole('button', { name: /Todos/ }));
    // Held once: a role query on every animation frame would slow the frames
    // down enough to outlast waitFor.
    const direction = sectionOf(/Direção do CP2b/);
    expect(direction.style.opacity).toBe('0');
    await waitFor(() => expect(direction.style.opacity).toBe('1'));
  });

  it('lets a filtered-out group fade before it leaves, when motion is allowed', async () => {
    giveLayout();
    openAt('/equipe');
    await ready();

    fireEvent.change(screen.getByRole('searchbox', { name: /buscar membro da equipe/i }), {
      target: { value: 'Lamparelli' },
    });

    // Still there, on its way out...
    const leaving = screen.getAllByText('Bruna de Souza Moraes');
    expect(leaving.length).toBeGreaterThan(0);
    // ...and gone once the fade is over (checked on the held nodes, cheap on
    // every frame).
    await waitFor(() => leaving.forEach((node) => expect(node).not.toBeInTheDocument()));
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();
  });

  it('marks a group on its way out, and unmarks it when it comes back before its fade is over', async () => {
    giveLayout();
    openAt('/equipe');
    await ready();
    const search = screen.getByRole('searchbox', { name: /buscar membro da equipe/i });
    const direction = sectionOf(/Direção do CP2b/);

    fireEvent.change(search, { target: { value: 'Lamparelli' } });
    expect(direction).toHaveClass('is-leaving');

    fireEvent.change(search, { target: { value: '' } });
    // The same section, back in place, with no leftover of the way out (the
    // rule that lifts the gutter goes by this class).
    expect(sectionOf(/Direção do CP2b/)).toBe(direction);
    expect(direction).not.toHaveClass('is-leaving');
  });

  it('lets the API list arrive at rest, instead of animating it in over the static one', async () => {
    giveLayout();
    let answer;
    fetchTeam.mockReturnValue(new Promise((resolve) => { answer = resolve; }));
    openAt('/equipe');
    await ready();

    await act(async () => {
      answer({
        associates: [
          { name: 'Rubens Augusto Camargo Lamparelli', role_pt: 'Coordenador do Eixo 1', institution: 'UNICAMP', axes: '1' },
          { name: 'Pessoa Nova da Silva', role_pt: 'Pesquisadora', institution: 'UNICAMP', axes: '1' },
        ],
      });
    });

    const card = screen.getByText('Pessoa Nova da Silva').closest('.team-member-card').parentElement;
    expect(card.style.opacity).toBe('1');
    expect(card.style.transform).not.toMatch(/translateY/);
    // What the API does not list is gone at once, not fading over the rest.
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();
  });

  it('has no transition at all under reduced motion', async () => {
    motion.reduce = true;
    giveLayout();
    const { container } = openAt('/equipe');
    await ready();

    fireEvent.change(screen.getByRole('searchbox', { name: /buscar membro da equipe/i }), {
      target: { value: 'Lamparelli' },
    });

    // Out in the same update, and nothing carries an inline transform or fade.
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();
    const card = container.querySelector('.team-member-card').parentElement;
    expect(card.getAttribute('style')).toBeNull();
  });
});
