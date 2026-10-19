import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import PageHero from '../PageHero';

const renderHero = () =>
  render(<PageHero eyebrow="Sobre o CP2b" title="Indicadores Estratégicos" subtitle="Uma visão simples." />);

describe('PageHero', () => {
  it('keeps the title as one plain text node, so text lookups still find it', () => {
    renderHero();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(screen.getByText('Indicadores Estratégicos')).toBe(heading);
    expect(heading.children).toHaveLength(0);
  });

  it('renders the eyebrow and the subtitle when given', () => {
    renderHero();
    expect(screen.getByText('Sobre o CP2b')).toHaveClass('eyebrow');
    expect(screen.getByText('Uma visão simples.')).toHaveClass('page-hero-sub');
  });

  it('keeps the leaves ornament out of the accessibility tree', () => {
    const { container } = renderHero();
    const leaves = container.querySelector('.page-hero-leaves');
    expect(leaves).toHaveAttribute('aria-hidden', 'true');
    expect(leaves).toHaveAttribute('focusable', 'false');
  });

  it('has no photo print in the band', () => {
    const { container } = renderHero();
    expect(container.querySelector('img')).toBeNull();
  });
});
