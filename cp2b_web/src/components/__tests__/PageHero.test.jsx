import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

import PageHero from '../PageHero';

const originalMatchMedia = window.matchMedia;

// A mouse by default; each test can switch the pointer type.
const setPointer = (fine) => {
  window.matchMedia = (query) => ({
    matches: query === '(pointer: fine)' ? fine : false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  });
};

beforeEach(() => {
  motion.reduce = false;
  setPointer(true);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 1; });
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

const renderHero = () =>
  render(<PageHero eyebrow="Sobre o CP2b" title="Indicadores Estratégicos" subtitle="Uma visão simples." />);

describe('PageHero', () => {
  it('keeps the title as one plain text node, so text lookups still find it', () => {
    renderHero();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(screen.getByText('Indicadores Estratégicos')).toBe(heading);
    expect(heading.children).toHaveLength(0);
  });

  it('keeps the ambient light and colour fields out of the accessibility tree', () => {
    const { container } = renderHero();
    expect(container.querySelector('.page-hero-ambient')).toHaveAttribute('aria-hidden', 'true');
  });

  it('moves the light to the pointer and lets it rest again when the pointer leaves', () => {
    const { container } = renderHero();
    const hero = container.querySelector('.page-hero');
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 1000, height: 400 });

    fireEvent.pointerMove(hero, { clientX: 250, clientY: 100 });
    expect(hero.style.getPropertyValue('--hero-x')).toBe('25.00%');
    expect(hero.style.getPropertyValue('--hero-y')).toBe('25.00%');
    expect(hero).toHaveAttribute('data-pointer', 'on');

    fireEvent.pointerLeave(hero);
    expect(hero.style.getPropertyValue('--hero-x')).toBe('');
    expect(hero).not.toHaveAttribute('data-pointer');
  });

  it('does not track the pointer under reduced motion', () => {
    motion.reduce = true;
    const { container } = renderHero();
    const hero = container.querySelector('.page-hero');
    fireEvent.pointerMove(hero, { clientX: 250, clientY: 100 });
    expect(hero.style.getPropertyValue('--hero-x')).toBe('');
  });

  it('does not track touch-only screens', () => {
    setPointer(false);
    const { container } = renderHero();
    const hero = container.querySelector('.page-hero');
    fireEvent.pointerMove(hero, { clientX: 250, clientY: 100 });
    expect(hero.style.getPropertyValue('--hero-x')).toBe('');
  });
});
