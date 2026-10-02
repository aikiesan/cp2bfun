import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Metaninho from '../Metaninho';

const img = (container) => container.querySelector('img.metaninho');

describe('Metaninho', () => {
  it('is decoration only: empty alt and hidden from assistive tech', () => {
    const { container } = render(<Metaninho pose="surpreso" />);
    expect(img(container)).toHaveAttribute('alt', '');
    expect(img(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the requested pose and reserves its space for the given height', () => {
    const { container } = render(<Metaninho pose="feliz" size={72} />);
    expect(img(container)).toHaveAttribute('src', '/assets/metaninho/metaninho-feliz.webp');
    expect(img(container)).toHaveAttribute('height', '72');
    // feliz is 273 × 360 → 55 × 72
    expect(img(container)).toHaveAttribute('width', '55');
  });

  it('falls back to the neutral pose for an unknown one', () => {
    const { container } = render(<Metaninho pose="dançando" />);
    expect(img(container)).toHaveAttribute('src', '/assets/metaninho/metaninho-neutro.webp');
    expect(img(container)).toHaveAttribute('data-pose', 'neutro');
  });

  it('keeps extra classes next to its own', () => {
    const { container } = render(<Metaninho className="mb-3" />);
    expect(img(container)).toHaveClass('metaninho', 'mb-3');
  });
});
