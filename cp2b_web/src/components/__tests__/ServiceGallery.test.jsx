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

  it('with reduced motion nothing slides or scales: cards just swap', async () => {
    motion.reduce = true;
    const { container, rerender } = render(gallery(cemara));
    rerender(gallery(ppbioen));
    await waitFor(() => expect(cards(container)).toHaveLength(ppbioen.length));
    cards(container).forEach((li) => {
      expect(li.style.transform === '' || li.style.transform === 'none').toBe(true);
      expect(li.style.opacity === '' || li.style.opacity === '1').toBe(true);
    });
  });
});
