import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import About from '../About';
import { missionVisionValues, projectDetails, partners } from '../../data/content';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchPageContent: vi.fn(),
}));

import { fetchPageContent } from '../../services/api';

describe('About Page — Missão, Visão e Valores & Redesign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem('cp2b_lang');
    fetchPageContent.mockResolvedValue(null);
  });

  it('renders strategic Mission, Vision and Values in Portuguese by default', async () => {
    const { container } = renderWithProviders(<About />);

    await waitFor(() => {
      expect(screen.getByText(/Missão, Visão e Valores/i)).toBeInTheDocument();
    });

    // FAPESP Project metadata
    expect(screen.getByText(projectDetails.number)).toBeInTheDocument();
    expect(screen.getByText(projectDetails.pt.title)).toBeInTheDocument();

    // Section Tag & Subtitle
    expect(screen.getByText(missionVisionValues.pt.sectionTag)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.sectionSubtitle)).toBeInTheDocument();

    // Mission & Vision Headings & Tags
    expect(screen.getByText(missionVisionValues.pt.mission.tag)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.mission.title)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.mission.text)).toBeInTheDocument();

    expect(screen.getByText(missionVisionValues.pt.vision.tag)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.vision.title)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.vision.text)).toBeInTheDocument();

    // 5 Values rendered in grid
    expect(screen.getByText(missionVisionValues.pt.valuesTitle)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.pt.valuesStatement)).toBeInTheDocument();

    missionVisionValues.pt.values.forEach((val) => {
      expect(screen.getByText(val.title)).toBeInTheDocument();
      expect(screen.getByText(val.description)).toBeInTheDocument();
    });

    // Sub-navigation links
    expect(screen.getByRole('link', { name: /Visão Geral/i })).toHaveAttribute('href', '/sobre');
    expect(screen.getByRole('link', { name: /Governança/i })).toHaveAttribute('href', '/sobre/governanca');
    expect(screen.getByRole('link', { name: /Indicadores/i })).toHaveAttribute('href', '/sobre/indicadores');
    expect(screen.getByRole('link', { name: /Transparência/i })).toHaveAttribute('href', '/sobre/transparencia');
    expect(screen.getByRole('link', { name: /Parceiros/i })).toHaveAttribute('href', '/sobre/parceiros');

    // Video 16:9 container
    const videoRatio = container.querySelector('.ratio.ratio-16x9');
    expect(videoRatio).toBeTruthy();
    expect(container.querySelector('video')).toBeTruthy();
    expect(screen.getByText('LABORATÓRIO VIVO')).toBeInTheDocument();

    // Resumo Executivo, Objetivos and Resultados
    expect(screen.getByText('Resumo Executivo')).toBeInTheDocument();
    expect(screen.getByText('Objetivos')).toBeInTheDocument();
    expect(screen.getByText('Resultados Esperados')).toBeInTheDocument();

    // Partners section & Headquarters
    expect(screen.getByText(partners.host.name)).toBeInTheDocument();
    const partnerLinkPt = screen.getByText('Ver Catálogo de Parceiros').closest('a');
    expect(partnerLinkPt).toHaveAttribute('href', '/sobre/parceiros');
  });

  it('renders strategic Mission, Vision and Values in English when language is en', async () => {
    localStorage.setItem('cp2b_lang', 'en');

    renderWithProviders(<About />);

    await waitFor(() => {
      expect(screen.getByText(missionVisionValues.en.sectionTitle)).toBeInTheDocument();
    });

    // Section Tag
    expect(screen.getByText(missionVisionValues.en.sectionTag)).toBeInTheDocument();

    // Mission & Vision
    expect(screen.getByText(missionVisionValues.en.mission.tag)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.en.mission.title)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.en.mission.text)).toBeInTheDocument();

    expect(screen.getByText(missionVisionValues.en.vision.tag)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.en.vision.title)).toBeInTheDocument();
    expect(screen.getByText(missionVisionValues.en.vision.text)).toBeInTheDocument();

    // 5 English Values
    expect(screen.getByText(missionVisionValues.en.valuesTitle)).toBeInTheDocument();
    missionVisionValues.en.values.forEach((val) => {
      expect(screen.getByText(val.title)).toBeInTheDocument();
      expect(screen.getByText(val.description)).toBeInTheDocument();
    });

    // English Sub-navigation
    expect(screen.getByRole('link', { name: /Overview/i })).toHaveAttribute('href', '/sobre');
    expect(screen.getByRole('link', { name: /Governance/i })).toHaveAttribute('href', '/sobre/governanca');
    expect(screen.getByRole('link', { name: /Indicators/i })).toHaveAttribute('href', '/sobre/indicadores');
    expect(screen.getByRole('link', { name: /Transparency/i })).toHaveAttribute('href', '/sobre/transparencia');
    expect(screen.getByRole('link', { name: /Partners/i })).toHaveAttribute('href', '/sobre/parceiros');

    expect(screen.getByText('LIVING LAB')).toBeInTheDocument();
    const partnerLinkEn = screen.getByText('View Partners Catalog').closest('a');
    expect(partnerLinkEn).toHaveAttribute('href', '/sobre/parceiros');
  });

  it('renders API-provided dynamic content when available', async () => {
    fetchPageContent.mockResolvedValue({
      content_pt: {
        resumo: 'Resumo customizado retornado da API.',
        objetivos: 'Objetivos customizados retornados da API.',
        resultados: 'Resultados customizados retornados da API.',
      },
    });

    renderWithProviders(<About />);

    await waitFor(() => {
      expect(screen.getByText('Resumo customizado retornado da API.')).toBeInTheDocument();
      expect(screen.getByText('Objetivos customizados retornados da API.')).toBeInTheDocument();
      expect(screen.getByText('Resultados customizados retornados da API.')).toBeInTheDocument();
    });
  });
});
