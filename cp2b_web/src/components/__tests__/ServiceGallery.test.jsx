import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

import ServiceGallery from '../ServiceGallery';
import { technicalServices } from '../../data/generated/services';

const labels = { details: 'Como funciona', hideDetails: 'Fechar' };
const gallery = (services) => <ServiceGallery services={services} language="pt" labels={labels} />;
const cards = (container) => [...container.querySelectorAll('.svc')];
const cemara = technicalServices.filter((s) => s.labAcronym.includes('CEMARA'));
const ppbioen = technicalServices.filter((s) => s.labAcronym === 'PPBIOEN');

beforeEach(() => {
  motion.reduce = false;
});

describe('ServiceGallery — troca de filtro', () => {
  it('shows every card on arrival, without an entrance animation', () => {
    const { container } = render(gallery(technicalServices));
    expect(cards(container)).toHaveLength(technicalServices.length);
    cards(container).forEach((li) => expect(li.style.opacity === '' || li.style.opacity === '1').toBe(true));
  });

  it('lets the cards that leave go and keeps the ones that stay, open state included', async () => {
    const { container, rerender } = render(gallery(technicalServices));
    const kept = cemara[0];
    const keptCard = () => cards(container).find((li) => li.textContent.includes(kept.pt.title));
    fireEvent.click(keptCard().querySelector('.svc__more'));
    expect(keptCard()).toHaveClass('is-open');

    rerender(gallery(cemara));
    await waitFor(() => expect(cards(container)).toHaveLength(cemara.length));
    expect(keptCard()).toHaveClass('is-open');
  });

  it('brings new cards in faded and slightly scaled, then settles them', () => {
    const { container, rerender } = render(gallery(cemara));
    rerender(gallery([...cemara, ...ppbioen]));
    const entering = cards(container).find((li) => li.textContent.includes(ppbioen[0].pt.title));
    expect(entering.style.opacity).toBe('0');
    expect(entering.style.transform).toMatch(/scale/);
  });

  // The styles right after a swap, before any frame has run: the moment an
  // animation would show its first pose. Checked there, and not after a
  // waitFor, which would sit through a normal animation and see it settled.
  const swapNow = () => {
    const { container, rerender } = render(gallery(cemara));
    rerender(gallery(ppbioen));
    const style = (li) => ({ opacity: li.style.opacity, transform: li.style.transform });
    const find = (s) => cards(container).find((li) => li.textContent.includes(s.pt.title));
    return { container, entering: style(find(ppbioen[0])), leaving: style(find(cemara[0])) };
  };

  it('with reduced motion nothing slides or scales: cards just swap', async () => {
    motion.reduce = true;
    const { container, entering, leaving } = swapNow();
    // The new card is already at rest, at once...
    expect(entering.opacity === '' || entering.opacity === '1').toBe(true);
    expect(entering.transform).not.toMatch(/scale/);
    // ...and the card going out is either there or gone, never half-faded
    // or shrinking.
    expect(['', '0', '1']).toContain(leaving.opacity);
    expect(leaving.transform).not.toMatch(/scale/);
    await waitFor(() => expect(cards(container)).toHaveLength(ppbioen.length));
  });

  it('with motion allowed, the same check does catch the scale', () => {
    // Proof that the check above can fail: at that very point, the normal
    // animation shows the new card faded and scaled down.
    const { entering } = swapNow();
    expect(entering.opacity).toBe('0');
    expect(entering.transform).toMatch(/scale\(0\.96\)/);
  });
});

describe('ServiceGallery — nada a mostrar', () => {
  it('shows the empty message only once the leaving cards have faded out', () => {
    const { container, rerender } = render(<ServiceGallery services={cemara} language="pt" labels={labels} emptyText="Nada aqui." />);
    expect(container.querySelector('.svc-empty')).toBeNull();

    rerender(<ServiceGallery services={[]} language="pt" labels={labels} emptyText="Nada aqui." />);
    // In place, but held transparent while the cards still fade over it.
    expect(container.querySelector('.svc-empty')).toHaveTextContent('Nada aqui.');
    expect(container.querySelector('.svc-empty').style.opacity).toBe('0');
  });

  it('shows it at once with reduced motion, where the cards leave at once too', async () => {
    motion.reduce = true;
    const { container, rerender } = render(<ServiceGallery services={cemara} language="pt" labels={labels} emptyText="Nada aqui." />);
    rerender(<ServiceGallery services={[]} language="pt" labels={labels} emptyText="Nada aqui." />);
    const empty = container.querySelector('.svc-empty');
    expect(empty).toHaveTextContent('Nada aqui.');
    expect(empty.style.opacity === '' || empty.style.opacity === '1').toBe(true);
    await waitFor(() => expect(cards(container)).toHaveLength(0));
  });
});
