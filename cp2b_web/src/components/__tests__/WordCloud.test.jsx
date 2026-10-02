import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/utils';
import WordCloud from '../WordCloud';
import { topWords, topExpressions } from '../../data/wordCloud';

describe('WordCloud', () => {
  it('sizes words by frequency: biogás (191) is the largest, recurso (56) the smallest', () => {
    renderWithProviders(<WordCloud language="pt" />);
    const words = [...document.querySelectorAll('.wcloud__word')];
    expect(words).toHaveLength(topWords.length);
    const size = (term) => Number(words.find((w) => w.textContent.startsWith(term)).style.getPropertyValue('--size'));
    expect(size('biogás')).toBeGreaterThan(size('ciência'));
    expect(size('ciência')).toBeGreaterThan(size('recurso'));
  });

  it('exposes each count to screen readers and on hover', () => {
    renderWithProviders(<WordCloud language="pt" />);
    const biogas = [...document.querySelectorAll('.wcloud__word')].find((w) => w.textContent.startsWith('biogás'));
    expect(biogas).toHaveAttribute('data-count', '191');
    expect(biogas.textContent).toContain('191 ocorrências');
  });

  it('draws expression bars relative to the most frequent one', () => {
    renderWithProviders(<WordCloud language="pt" />);
    const bars = [...document.querySelectorAll('.wcloud__expr-bar span')].map((b) => b.style.width);
    expect(bars[0]).toBe('100%');
    expect(bars).toHaveLength(topExpressions.length);
  });

  it('matches the counts in "Nuvem de palavras.docx"', () => {
    const get = (list, term) => list.find((w) => w.pt === term).n;
    expect(get(topWords, 'biogás')).toBe(191);
    expect(get(topWords, 'energia')).toBe(95);
    expect(get(topExpressions, 'produção de biogás')).toBe(41);
    expect(get(topExpressions, 'digestão anaeróbia')).toBe(20);
  });
});
