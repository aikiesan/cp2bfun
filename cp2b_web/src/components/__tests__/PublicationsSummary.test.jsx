import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import { PublicationsSummary, PublicationsAnalysis } from '../PublicationsSummary';
import { publicationsYear1, publicationsAnalysis } from '../../data/publicationsYear1';

describe('Publicações do Ano 1', () => {
  it('derives every percentage from the recounted totals (25 publications)', () => {
    renderWithProviders(<PublicationsSummary language="pt" />);
    const pcts = [...document.querySelectorAll('.pubs-metric__pct')].map((e) => e.textContent);
    // 16, 21, 19, 7 e 10 de 25 — recontados na planilha do Ano 1.
    expect(pcts).toEqual(['64%', '84%', '76%', '28%', '40%']);
    expect(document.querySelector('.pubs-total__num').textContent).toBe('25');
  });

  it('says where the counts come from, in both languages', () => {
    const { unmount } = renderWithProviders(<PublicationsSummary language="pt" />);
    expect(screen.getByText(/Fonte: planilha de publicações do Ano 1 \(2025\)/)).toBeInTheDocument();
    unmount();
    renderWithProviders(<PublicationsSummary language="en" />);
    expect(screen.getByText(/Source: Year 1 \(2025\) publications spreadsheet/)).toBeInTheDocument();
  });

  it('only claims a target was exceeded when the count actually meets it', () => {
    publicationsYear1.metrics.filter((m) => m.goal).forEach((m) => {
      expect((m.count / publicationsYear1.total) * 100).toBeGreaterThanOrEqual(m.goal);
    });
    renderWithProviders(<PublicationsSummary language="pt" />);
    expect(screen.getByText(/Meta ≥ 80% superada/)).toBeInTheDocument();
  });

  it('shows SDGs 7, 12 and 13', () => {
    renderWithProviders(<PublicationsSummary language="pt" />);
    const sdgs = [...document.querySelectorAll('.pubs-sdgs strong')].map((e) => e.textContent);
    expect(sdgs).toEqual(['ODS 7', 'ODS 12', 'ODS 13']);
  });

  it('keeps the analysis free of the journal claims that the spreadsheet contradicts', () => {
    renderWithProviders(<PublicationsAnalysis language="pt" />);
    // Recolhida por padrão: o infográfico já traz os números.
    const details = document.querySelector('details.pubs-more');
    expect(details).not.toBeNull();
    expect(details.open).toBe(false);
    expect(document.querySelectorAll('.pubs-topics li')).toHaveLength(6);
    const text = details.textContent;
    expect(text).not.toMatch(/Renewable and Sustainable Energy Reviews/);
    expect(text).not.toMatch(/\bDesalination\b/);
    expect(publicationsAnalysis.en.topics).toHaveLength(publicationsAnalysis.pt.topics.length);
  });

  it('never mentions Marlon, who has left the group', () => {
    expect(JSON.stringify({ publicationsYear1, publicationsAnalysis }).toLowerCase()).not.toContain('marlon');
  });

  it('gives every metric a one-line insight instead of a paragraph', () => {
    renderWithProviders(<PublicationsSummary language="pt" />);
    const insights = [...document.querySelectorAll('.pubs-metric__insight')].map((e) => e.textContent);
    expect(insights).toHaveLength(5);
    insights.forEach((i) => expect(i.split(' ').length).toBeLessThanOrEqual(8));
  });
});
