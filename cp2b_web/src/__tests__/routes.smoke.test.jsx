/**
 * Routes smoke tests — render each public page component and verify it doesn't crash.
 * This catches import errors, missing exports, and hard render-time throws.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../test/utils';

// Mock API calls so pages don't hang waiting for network
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  fetchNews: vi.fn().mockResolvedValue([]),
  fetchTeam: vi.fn().mockResolvedValue({}),
  fetchProjects: vi.fn().mockResolvedValue([]),
  fetchPageContent: vi.fn().mockResolvedValue(null),
  fetchFeaturedContent: vi.fn().mockResolvedValue(null),
  fetchFeaturedVideos: vi.fn().mockResolvedValue([]),
  fetchAxes: vi.fn().mockResolvedValue([]),
}));

import Home from '../pages/Home';
import About from '../pages/About';
import Research from '../pages/Research';
import Team from '../pages/Team';
import News from '../pages/News';
import Contact from '../pages/Contact';
import Opportunities from '../pages/Opportunities';
import Publications from '../pages/Publications';
import Events from '../pages/Events';
import Projects from '../pages/Projects';
import Media from '../pages/Media';
import Others from '../pages/Others';
import ForumPaulista from '../pages/ForumPaulista';
import NotFound from '../pages/NotFound';

describe('Public pages smoke tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const pages = [
    ['Home (/)', Home],
    ['About (/sobre)', About],
    ['Research (/eixos)', Research],
    ['Team (/equipe)', Team],
    ['News (/noticias)', News],
    ['Contact (/contato)', Contact],
    ['Opportunities (/oportunidades)', Opportunities],
    ['Publications (/publicacoes)', Publications],
    ['Events (/eventos)', Events],
    ['Projects (/projetos)', Projects],
    ['Media (/na-midia)', Media],
    ['Others (/outros)', Others],
    ['ForumPaulista (/forum-paulista)', ForumPaulista],
    ['NotFound (404)', NotFound],
  ];

  pages.forEach(([label, PageComponent]) => {
    it(`renders ${label} without crashing`, () => {
      const { container } = renderWithProviders(<PageComponent />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});
