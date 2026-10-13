import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FlipBook from '../FlipBook';

// Livreto como o da HQ: capa, verso em branco, páginas e contracapa — número
// par, para a contracapa fechar o livro sozinha.
const pages = [
  { src: '/p/capa.webp', alt: 'capa', label: 'Capa' },
  { src: null, alt: '', label: 'Verso' },
  { src: '/p/1.webp', alt: 'um', label: 'P1' },
  { src: '/p/2.webp', alt: 'dois', label: 'P2' },
  { src: '/p/3.webp', alt: 'três', label: 'P3' },
  { src: '/p/contra.webp', alt: 'contracapa', label: 'Contracapa' },
];

const labels = {
  prev: 'Anterior', next: 'Próxima', first: 'Capa', last: 'Fim',
  fullscreen: 'Tela cheia', exitFullscreen: 'Sair', slider: 'Página', hint: '',
};

// matchMedia controlável: o setup global devolve sempre false e sem eventos.
let wide = true;
let listeners = [];
const original = window.matchMedia;
beforeEach(() => {
  wide = true;
  listeners = [];
  window.matchMedia = (query) => ({
    get matches() { return wide; },
    media: query,
    addEventListener: (_, fn) => listeners.push(fn),
    removeEventListener: (_, fn) => { listeners = listeners.filter((l) => l !== fn); },
  });
});
afterEach(() => { window.matchMedia = original; });

const setWide = (value) => act(() => { wide = value; listeners.forEach((fn) => fn()); });

const renderBook = () => render(
  <FlipBook pages={pages} pageSize={[1100, 1556]} labels={labels} pageLabel={(p) => p.label} />,
);
const position = (container) => container.querySelector('.flipbook__position').textContent;
const shift = (container) => container.querySelector('.flipbook__book').style.transform;

describe('FlipBook', () => {
  it('abre fechado na capa, centralizada, e vira em pares de páginas', () => {
    const { container } = renderBook();
    expect(position(container)).toBe('Capa');
    expect(shift(container)).toBe('translateX(-25%)');
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    // O verso da capa é branco e não entra no rótulo.
    expect(position(container)).toBe('P1');
    expect(shift(container)).toBe('translateX(0%)');

    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(position(container)).toBe('P2 · P3');
  });

  it('fecha atrás com a contracapa sozinha, à esquerda', () => {
    const { container } = renderBook();
    fireEvent.click(screen.getByRole('button', { name: 'Fim' }));
    expect(position(container)).toBe('Contracapa');
    expect(shift(container)).toBe('translateX(25%)');
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
  });

  it('com uma página por vez, pula o verso em branco', () => {
    wide = false;
    const { container } = renderBook();
    expect(container.querySelectorAll('.flipbook__leaf')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(position(container)).toBe('P1');
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(position(container)).toBe('Capa');
  });

  it('mantém a página ao alternar entre duas páginas e uma', () => {
    const { container } = renderBook();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(position(container)).toBe('P2 · P3');

    setWide(false);
    expect(position(container)).toBe('P2');
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(position(container)).toBe('P3');

    setWide(true);
    expect(position(container)).toBe('P2 · P3');
  });

  it('vira pelas setas do teclado, mas não com o foco num campo', () => {
    const { container } = renderBook();
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(position(container)).toBe('P1');
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(position(container)).toBe('Capa');

    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(position(container)).toBe('Capa');
    input.remove();
  });

  it('só as páginas à vista ficam na árvore de acessibilidade', () => {
    renderBook();
    expect(screen.getByAltText('capa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    const shown = screen.getAllByRole('img').map((img) => img.getAttribute('alt'));
    expect(shown).toEqual(['dois', 'três']);
  });
});
