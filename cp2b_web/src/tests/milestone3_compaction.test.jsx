import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import Team from '../pages/Team';
import News from '../pages/News';
import Projects from '../pages/Projects';
import Solucoes from '../pages/Solucoes';
import Publications from '../pages/Publications';
import About from '../pages/About';
import Indicators from '../pages/about/Indicators';
import FeaturedVideos from '../components/FeaturedVideos';
import Timeline from '../components/Timeline';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/publications') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title_pt: 'Estudo de Biogás',
              title_en: 'Biogas Study',
              abstract_pt: 'Resumo sobre digestão anaeróbia.',
              abstract_en: 'Abstract on anaerobic digestion.',
              authors: 'Pesquisador A',
              journal: 'Revista Bio',
              year: 2025,
              publication_type: 'article',
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchNews: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: 'noticia-1',
      date_display: '01 Jan 2025',
      image: 'https://example.com/img.jpg',
      badge: 'PESQUISA',
      badge_color: 'success',
      title_pt: 'Notícia de teste',
      title_en: 'Test news',
      description_pt: 'Descrição de teste',
      description_en: 'Test description',
    }
  ]),
  fetchProjects: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: 'projeto-1',
      date_display: '01 Jan 2025',
      image: 'https://example.com/proj.jpg',
      badge: 'PROJETO',
      badge_color: 'primary',
      title_pt: 'Projeto de teste',
      title_en: 'Test project',
      description_pt: 'Descrição do projeto',
      description_en: 'Project description',
    }
  ]),
  fetchPageContent: vi.fn().mockResolvedValue({
    missao: 'Nossa missão',
    visao: 'Nossa visão',
    resumo: 'Resumo',
    objetivos: 'Objetivos',
    resultados: 'Resultados',
  }),
}));

describe('Milestone 3 — Public Pages & Card Grids Compaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Team page with category chips scroll rail and 2-column mobile cards', () => {
    const { container } = renderWithProviders(<Team />);
    const rail = container.querySelector('.category-chips-rail');
    expect(rail).toBeInTheDocument();
    expect(rail.className).toContain('overflow-x-auto');
    expect(rail.className).toContain('flex-nowrap');

    const memberCards = container.querySelectorAll('.team-member-card');
    expect(memberCards.length).toBeGreaterThan(0);
    const memberCol = memberCards[0].closest('.col-6');
    expect(memberCol).toBeInTheDocument();
  });

  it('renders News and Projects with responsive aspect ratio media wrappers', async () => {
    const { container: newsContainer } = renderWithProviders(<News />);
    await waitFor(() => {
      const newsMedia = newsContainer.querySelector('.news-featured-media');
      expect(newsMedia).toBeInTheDocument();
    });

    const { container: projContainer } = renderWithProviders(<Projects />);
    await waitFor(() => {
      const projMedia = projContainer.querySelector('.news-featured-media');
      expect(projMedia).toBeInTheDocument();
    });
  });

  it('renders FeaturedVideos with responsive ratio-16x9 player and playlist wrapper', () => {
    const videoA = {
      youtube_id: 'vid123',
      title_pt: 'Vídeo Institucional',
      title_en: 'Institutional Video',
      thumbnail_url: 'https://example.com/thumb.jpg',
      date_display: '2026',
    };
    const videoB = {
      youtube_id: 'vid456',
      title_pt: 'Segundo Vídeo',
      title_en: 'Second Video',
      thumbnail_url: 'https://example.com/thumb2.jpg',
      date_display: '2026',
    };

    const { container } = renderWithProviders(<FeaturedVideos itemA={videoA} itemB={videoB} />);
    const ratioPlayer = container.querySelector('.ratio-16x9');
    expect(ratioPlayer).toBeInTheDocument();
    const playlist = container.querySelector('.featured-videos-playlist');
    expect(playlist).toBeInTheDocument();
  });

  it('wraps the timeline in a horizontally safe responsive container', () => {
    const items = [
      { year: '2025', title: 'Lançamento', description: 'Início oficial', icon: 'bi-rocket', status: 'ongoing' },
      { year: '2024', title: 'Aprovação', description: 'Aprovação FAPESP', icon: 'bi-check', status: 'completed' },
    ];

    const { container } = renderWithProviders(<Timeline items={items} />);
    expect(container.querySelector('.cp2b-timeline-wrapper')).toBeInTheDocument();
  });

  it('renders Solucoes page with compact 2-column mobile modalities and services', () => {
    const { container } = renderWithProviders(<Solucoes />);
    const modalityCols = container.querySelectorAll('.row.g-2.g-sm-3.g-md-4 .col-6');
    expect(modalityCols.length).toBeGreaterThanOrEqual(4);
    const filterRail = container.querySelector('.solucoes-filter-rail');
    expect(filterRail).toBeInTheDocument();
  });

  it('renders Publications with compact filter card and line-clamp abstract', async () => {
    const { container } = renderWithProviders(<Publications />);
    await waitFor(() => {
      const filterCard = container.querySelector('.card.mb-4');
      expect(filterCard).toBeInTheDocument();
    });
  });

  it('renders About and Indicators with responsive nav rails and grids', async () => {
    const { container: aboutContainer } = renderWithProviders(<About />);
    await waitFor(() => {
      const subnavRail = aboutContainer.querySelector('.about-subnav-rail');
      expect(subnavRail).toBeInTheDocument();
    });

    const { container: indContainer } = renderWithProviders(<Indicators />);
    const dimNav = indContainer.querySelector('.indicators-dimension-nav');
    expect(dimNav).toBeInTheDocument();
    expect(dimNav.children.length).toBe(7);
  });
});
