import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PilarMap from '../PilarMap';

const mapData = {
  w: 1000,
  h: 720,
  munis: [
    { d: 'M0 0L10 0L10 10Z', t: 0, k: 0 },
    { d: 'M20 0L30 0L30 10Z', t: 4, k: 1 },
  ],
  transmission: 'M0 0L50 50',
  gas: 'M0 50L50 0',
  substations: [[5, 5]],
  plants: [[25, 5], [40, 40]],
};

// The setup mock never fires; here everything is "on screen" at once.
class VisibleObserver {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el }]); }
  disconnect() {}
  unobserve() {}
}

describe('PilarMap', () => {
  let originalIO;

  beforeEach(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = VisibleObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = originalIO;
    vi.restoreAllMocks();
  });

  it('draws one shape per municipality, coloured by its potential tier, plus the infrastructure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => mapData });
    const { container } = render(<PilarMap language="pt" />);

    const svg = await screen.findByRole('img', { name: /potencial de biogás de cada um dos 645 municípios/ });
    expect(globalThis.fetch).toHaveBeenCalledWith('/assets/pilar2b/sp-map.json');
    expect(svg.querySelectorAll('.pilar-map__muni')).toHaveLength(2);
    expect(svg.querySelector('.pilar-map__muni--t0')).toBeTruthy();
    expect(svg.querySelector('.pilar-map__muni--t4')).toBeTruthy();
    expect(svg.querySelector('.pilar-map__line--transmission')).toHaveAttribute('d', 'M0 0L50 50');
    expect(svg.querySelector('.pilar-map__line--gas')).toHaveAttribute('d', 'M0 50L50 0');
    expect(svg.querySelectorAll('.pilar-map__plant')).toHaveLength(2);
    expect(container.querySelector('.pilar-map')).toHaveClass('is-playing');
  });

  it('has a legend in the visitor language', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => mapData });
    render(<PilarMap language="en" />);

    await screen.findByRole('img', { name: /biogas potential of each of its 645 municipalities/ });
    expect(screen.getByText('Transmission lines')).toBeInTheDocument();
    expect(screen.getByText('Gas pipelines')).toBeInTheDocument();
    expect(screen.getByText('Biogas plants')).toBeInTheDocument();
  });

  it('leaves the band without a map, and without an empty box, when the data fails to load', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, json: async () => ({}) });
    const { container } = render(<PilarMap language="pt" />);

    await waitFor(() => expect(container.querySelector('.pilar-map')).toBeNull());
  });

  it('shows the finished map without animating when the visitor asked for reduced motion', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({
      matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {},
    }));
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => mapData });
    const { container } = render(<PilarMap language="pt" />);

    await screen.findByRole('img');
    expect(container.querySelector('.pilar-map')).not.toHaveClass('is-armed');
  });
});
