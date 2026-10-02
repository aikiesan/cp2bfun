import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import Indicators from '../Indicators';
import { kpiDimensions, kpiIndicatorCount } from '../../../data/generated/kpiFramework';

beforeEach(() => {
  localStorage.removeItem('cp2b_lang');
});

describe('Indicadores', () => {
  it('shows the panel figures from the framework, not hardcoded numbers', () => {
    const { container } = renderWithProviders(<Indicators />);
    const figures = [...container.querySelectorAll('.indicators-stat strong')].map((el) => el.textContent);
    expect(figures).toEqual([String(kpiDimensions.length), String(kpiIndicatorCount), '2035']);
  });

  it('names the source of the figures and that they are a framework, not measured values', () => {
    renderWithProviders(<Indicators />);
    const source = screen.getByText(/Fonte: Sistema de Indicadores e Pesos do CP2b/);
    expect(source).toHaveTextContent('ago/2026');
    expect(source).toHaveTextContent('ainda não traz valores apurados');
  });

  it('switches the source line to English with the language', () => {
    localStorage.setItem('cp2b_lang', 'en');
    renderWithProviders(<Indicators />);
    expect(screen.getByText(/Source: CP2b Indicators and Weights System/)).toBeInTheDocument();
  });
});
