import { describe, it, expect } from 'vitest';
import { kpiDimensions, kpiFrameworkTotalWeight } from './kpiFramework';

describe('kpiFramework', () => {
  it('the 7 dimension weights sum to 100%', () => {
    expect(kpiDimensions).toHaveLength(7);
    expect(kpiFrameworkTotalWeight).toBe(100);
  });

  it('each dimension\'s indicator weights sum to its own dimension weight', () => {
    kpiDimensions.forEach((dim) => {
      const sum = dim.indicators.reduce((acc, ind) => acc + ind.weight, 0);
      expect(sum).toBe(dim.weight);
    });
  });

  it('the itemized indicators (38) sum to the weight total', () => {
    // The source slide's own headline says "35 indicadores", but the
    // itemized list under each dimension has 38 entries whose weights sum
    // correctly to 100% (7+6+5+5+5+5+5). Treated as a labeling slip in the
    // source deck, not a transcription error — see the note atop kpiFramework.js.
    const total = kpiDimensions.reduce((acc, dim) => acc + dim.indicators.length, 0);
    expect(total).toBe(38);
  });

  it('every dimension and indicator has both pt and en labels', () => {
    kpiDimensions.forEach((dim) => {
      expect(dim.pt.title).toBeTruthy();
      expect(dim.en.title).toBeTruthy();
      dim.indicators.forEach((ind) => {
        expect(ind.pt.name).toBeTruthy();
        expect(ind.en.name).toBeTruthy();
      });
    });
  });
});
