import { describe, it, expect } from 'vitest';
import { formatFormulas } from '../formatFormulas';

describe('formatFormulas', () => {
  it('turns LaTeX chemical formulas from the spreadsheet into Unicode subscripts', () => {
    expect(formatFormulas('biogás ($CH_4$, $CO_2$, $H_2S$)')).toBe('biogás (CH₄, CO₂, H₂S)');
    expect(formatFormulas('$\text{CO}_{2}$')).toBe('CO₂');
  });

  it('leaves plain text untouched', () => {
    expect(formatFormulas('Ensaios de BMP em vinhaça')).toBe('Ensaios de BMP em vinhaça');
    expect(formatFormulas(null)).toBe('');
  });
});
