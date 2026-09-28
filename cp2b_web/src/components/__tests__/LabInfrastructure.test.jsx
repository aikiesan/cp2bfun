import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// jsdom não tem layout nem rolagem: "na tela" e a preferência de movimento
// vêm daqui.
const motion = vi.hoisted(() => ({ inView: false, reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useInView: () => motion.inView,
    useReducedMotion: () => motion.reduce,
  };
});

import { renderWithProviders } from '../../test/utils';
import LabInfrastructure, { labsAtTrl, trlPhases } from '../LabInfrastructure';
import { laboratories } from '../../data/generated/laboratories';

// O estado de entrada fica na seção da régua (o painel sobre o hero).
const ruler = () => document.querySelector('.lab-map');

// Dá caixa de layout aos elementos, que é o que arma a entrada.
const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 300, left: 0, right: 900, width: 900, height: 300, x: 0, y: 0,
  });

beforeEach(() => {
  motion.inView = false;
  motion.reduce = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LabInfrastructure — régua de TRL', () => {
  it('is simply there without layout (tests, crawlers): no reveal state at all', () => {
    renderWithProviders(<LabInfrastructure language="pt" />);
    expect(ruler()).not.toHaveAttribute('data-reveal');
  });

  it('holds its start pose below the fold and plays once it scrolls into view', () => {
    giveLayout();
    const { rerender } = renderWithProviders(<LabInfrastructure language="pt" />);
    expect(ruler()).toHaveAttribute('data-reveal', 'armed');

    motion.inView = true;
    rerender(<LabInfrastructure language="pt" />);
    expect(ruler()).toHaveAttribute('data-reveal', 'shown');
  });

  it('never arms under reduced motion', () => {
    motion.reduce = true;
    giveLayout();
    renderWithProviders(<LabInfrastructure language="pt" />);
    expect(ruler()).not.toHaveAttribute('data-reveal');
  });

  it('orders the rows, so the bars grow one laboratory after another', () => {
    renderWithProviders(<LabInfrastructure language="pt" />);
    const rows = [...document.querySelectorAll('.lab-trl__row')];
    expect(rows).toHaveLength(3);
    rows.forEach((row, i) => expect(row.style.getPropertyValue('--i')).toBe(String(i)));
  });

  it('keeps the three phase bands exactly where they were', () => {
    renderWithProviders(<LabInfrastructure language="pt" />);
    const phases = [...document.querySelectorAll('.lab-trl__phase')];
    expect(phases.map((p) => p.querySelector('.lab-trl__phase-range').textContent)).toEqual(['TRL 1–3', 'TRL 4–6', 'TRL 7–9']);
    expect(phases.map((p) => p.style.gridColumn)).toEqual(['1 / 4', '4 / 7', '7 / 10']);
    expect(phases.map((p) => p.querySelector('.lab-trl__phase-name').textContent)).toEqual(trlPhases('pt').map((p) => p.name));
  });
});

describe('LabInfrastructure — helpers shared with the TRL matcher', () => {
  it('finds, for each level, the bioprocess labs whose range covers it', () => {
    for (let n = 1; n <= 9; n += 1) {
      const expected = laboratories
        .filter((l) => l.group === 'bioprocessos' && l.trl.min <= n && n <= l.trl.max)
        .map((l) => l.slug);
      expect(labsAtTrl(n).map((l) => l.slug)).toEqual(expected);
    }
  });

  it('names the phases in both languages, three levels each', () => {
    expect(trlPhases('pt').map(({ from, to }) => [from, to])).toEqual([[1, 3], [4, 6], [7, 9]]);
    expect(trlPhases('en')[0].name).toBe('Concept and proof of concept');
    expect(trlPhases('pt')[0].name).toBe('Conceito e prova de conceito');
  });
});
