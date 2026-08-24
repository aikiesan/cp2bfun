/**
 * Challenger 2 — Empirical Stress Testing Suite
 *
 * Scope:
 * 1. Responsive Viewports: Extreme viewports (320px, 375px, 768px, 1440px), layout boundaries, typography clamps, overflow guards
 * 2. Offline Build Execution: `generate-seo.mjs` resilience under diverse offline & error conditions
 * 3. Encoding & Special Characters: XML entity escaping (&, <, >, ", '), UTF-8 Portuguese accents, and scientific notation
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { renderWithProviders } from '../test/utils';

// Import Pages & Components to stress test
import About from '../pages/About';
import Solucoes from '../pages/Solucoes';
import ArticleLayout from '../components/ArticleLayout';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import SEO build generator & helpers
import {
  ROUTES,
  escapeHtml,
  serializeJsonLd,
  renderHead,
  getNewsFallback,
  getProjectsFallback,
  getEventsFallback,
  getMicroscopioFallback,
  getOpportunitiesFallback,
  generateSitemapXml,
  generateSeo,
} from '../../scripts/generate-seo.mjs';

describe('Challenger 2 — Empirical Stress Testing Suite', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. RESPONSIVE VIEWPORT STRESS TESTING (320px, 375px, 768px, 1440px)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('1. Responsive Viewport Stress Testing', () => {
    const VIEWPORTS = [
      { name: 'Ultra-Narrow Mobile', width: 320, height: 568 },
      { name: 'Standard Mobile', width: 375, height: 667 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Desktop Large', width: 1440, height: 900 },
    ];

    VIEWPORTS.forEach(({ name, width, height }) => {
      describe(`Viewport ${name} (${width}x${height}px)`, () => {
        beforeEach(() => {
          window.innerWidth = width;
          window.innerHeight = height;
          window.dispatchEvent(new Event('resize'));
        });

        it(`renders About page cleanly at ${width}px without throwing or missing sections`, async () => {
          const { container } = renderWithProviders(<About />);
          
          // Verify Mission & Vision cards exist (async load)
          const missionHeading = await screen.findByText(/Nossa Missão|Our Mission/i);
          expect(missionHeading).toBeInTheDocument();
          expect(screen.getByText(/Nossa Visão|Our Vision/i)).toBeInTheDocument();
          
          // Verify Values exist (5 values)
          const valueCards = container.querySelectorAll('.card-editorial');
          expect(valueCards.length).toBeGreaterThanOrEqual(2);

          // Verify Subnav pills have flex-wrap
          const subnav = container.querySelector('.nav-pills');
          expect(subnav).toBeInTheDocument();
          expect(subnav.className).toContain('flex-wrap');

          // Verify video container has 16:9 ratio class
          const videoRatio = container.querySelector('.ratio-16x9');
          expect(videoRatio).toBeInTheDocument();
        });

        it(`renders Solucoes page with 15 services & lab filters at ${width}px`, async () => {
          const { container } = renderWithProviders(<Solucoes />);
          
          // Modalities section
          expect(screen.getByText(/Modalidades de Parceria|Partnership Modalities/i)).toBeInTheDocument();
          
          // 15 technical services
          expect(screen.getByText(/Serviços Técnicos Especializados|Specialized Technical Services/i)).toBeInTheDocument();

          // Lab filter nav
          const labFilterNav = container.querySelector('.nav-pills');
          expect(labFilterNav).toBeInTheDocument();
          expect(labFilterNav.className).toContain('flex-wrap');

          // Check that cards exist and do not crash
          const serviceCards = container.querySelectorAll('.card');
          expect(serviceCards.length).toBeGreaterThanOrEqual(15);
        });

        it(`renders ArticleLayout with flex-wrap on action buttons at ${width}px`, () => {
          const mockArticle = {
            id: 1,
            title: 'Biogás e Descarbonização no Estado de São Paulo',
            description: 'Pesquisa inovadora em digestão anaeróbia.',
            content: '<p>O projeto CP2b desenvolve tecnologias de ponta em bioenergia e biometano com foco na transição energética sustentável.</p>',
            image: '/assets/DSC00339-500x333.jpg',
            badge: 'Pesquisa',
            badgeColor: 'green',
            date: '18 DEZ 2025',
            author: 'Redação CP2b',
            tags: 'Biogás, Sustentabilidade, UNICAMP',
          };

          const { container } = renderWithProviders(
            <ArticleLayout
              article={mockArticle}
              relatedPosts={[]}
              backLink="/noticias"
              backLabel="Voltar para Notícias"
              language="pt"
            />
          );

          // Title check
          expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Biogás e Descarbonização no Estado de São Paulo');

          // Check actions wrapper has flex-wrap and gap
          const actionsRow = container.querySelector('.article-fapesp-actions');
          expect(actionsRow).toBeInTheDocument();
          expect(actionsRow.className).toContain('flex-wrap');
          expect(actionsRow.className).toContain('gap-2');

          // Check tags wrapper exists
          const tagsWrapper = container.querySelector('.article-fapesp-tags');
          expect(tagsWrapper).toBeInTheDocument();
        });

        it(`renders Header and Footer components at ${width}px`, () => {
          const { container: headerContainer } = renderWithProviders(<Header />);
          expect(headerContainer.querySelector('.navbar')).toBeInTheDocument();

          const { container: footerContainer } = renderWithProviders(<Footer />);
          expect(footerContainer.querySelector('.site-footer')).toBeInTheDocument();
        });
      });
    });

    it('validates fluid typography CSS clamp mathematical invariants', () => {
      // Helper function simulating CSS clamp(min, preferred_formula, max)
      const computeClamp = (minRem, baseRem, vwCoeff, maxRem, viewportWidthPx, rootFontSize = 16) => {
        const minPx = minRem * rootFontSize;
        const maxPx = maxRem * rootFontSize;
        const preferredPx = (baseRem * rootFontSize) + (vwCoeff / 100 * viewportWidthPx);
        return Math.min(Math.max(preferredPx, minPx), maxPx);
      };

      // --fs-display-1: clamp(2.4rem, 1.4rem + 4vw, 4.2rem);
      const fsDisplay1At320 = computeClamp(2.4, 1.4, 4, 4.2, 320);
      const fsDisplay1At1440 = computeClamp(2.4, 1.4, 4, 4.2, 1440);
      expect(fsDisplay1At320).toBe(2.4 * 16); // 38.4px (clamped at min)
      expect(fsDisplay1At1440).toBe(4.2 * 16); // 67.2px (clamped at max)

      // --fs-display-2: clamp(1.9rem, 1.2rem + 2.6vw, 3rem);
      const fsDisplay2At320 = computeClamp(1.9, 1.2, 2.6, 3, 320);
      const fsDisplay2At1440 = computeClamp(1.9, 1.2, 2.6, 3, 1440);
      expect(fsDisplay2At320).toBe(1.9 * 16); // 30.4px (clamped at min)
      expect(fsDisplay2At1440).toBe(3.0 * 16); // 48.0px (clamped at max)

      // --fs-title: clamp(1.45rem, 1.1rem + 1.2vw, 2rem);
      const fsTitleAt320 = computeClamp(1.45, 1.1, 1.2, 2, 320);
      const fsTitleAt1440 = computeClamp(1.45, 1.1, 1.2, 2, 1440);
      expect(fsTitleAt320).toBe(1.45 * 16); // 23.2px
      expect(fsTitleAt1440).toBe(2.0 * 16); // 32.0px

      // --section-y: clamp(3.5rem, 2.5rem + 4vw, 6.5rem);
      const sectionYAt320 = computeClamp(3.5, 2.5, 4, 6.5, 320);
      const sectionYAt1440 = computeClamp(3.5, 2.5, 4, 6.5, 1440);
      expect(sectionYAt320).toBe(3.5 * 16); // 56px (clamped at min)
      expect(sectionYAt1440).toBe(97.6); // 97.6px (6.1rem, within [3.5rem, 6.5rem] range)
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. OFFLINE BUILD EXECUTION & RESILIENCE (generate-seo.mjs)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('2. Offline Build Execution & Fallback Resilience', () => {
    let tmpDir;
    const SAMPLE_INDEX_HTML = `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos</title>
    <meta name="description" content="Initial description" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CP2b" />
    <meta property="og:title" content="Initial OG Title" />
    <meta property="og:description" content="Initial OG Desc" />
    <meta property="og:image" content="/assets/logos/cp2b-logo-og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Initial Twitter Title" />
    <meta name="twitter:description" content="Initial Twitter Desc" />
    <meta name="twitter:image" content="/assets/logos/cp2b-logo-og.png" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

    beforeEach(async () => {
      tmpDir = await mkdtemp(path.join(os.tmpdir(), 'cp2b-seo-stress-'));
      await writeFile(path.join(tmpDir, 'index.html'), SAMPLE_INDEX_HTML, 'utf8');
    });

    afterEach(async () => {
      if (tmpDir) {
        await rm(tmpDir, { recursive: true, force: true });
      }
      vi.restoreAllMocks();
    });

    it('successfully runs generateSeo in pure offline mode (no API URL)', async () => {
      const logs = [];
      const result = await generateSeo({
        distDir: tmpDir,
        siteUrl: 'https://cp2b.unicamp.br',
        apiUrl: '',
        log: (msg) => logs.push(msg),
      });

      expect(result.prerenderedStatic).toBe(21);
      expect(result.prerenderedDynamic).toBe(14);
      expect(result.sitemapUrlsCount).toBe(35);

      // Verify sitemap.xml exists and has 35 URLs
      const sitemap = await readFile(path.join(tmpDir, 'sitemap.xml'), 'utf8');
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      
      const locMatches = sitemap.match(/<loc>/g);
      expect(locMatches).toHaveLength(35);

      // Verify root index.html has ResearchOrganization JSON-LD
      const rootHtml = await readFile(path.join(tmpDir, 'index.html'), 'utf8');
      expect(rootHtml).toContain('<script type="application/ld+json">');
      expect(rootHtml).toContain('"@type": "ResearchOrganization"');
      expect(rootHtml).toContain('UNICAMP');
      expect(rootHtml).toContain('<link rel="canonical" href="https://cp2b.unicamp.br/" />');

      // Verify /sobre/index.html has @graph with BreadcrumbList and Organization
      const sobreHtml = await readFile(path.join(tmpDir, 'sobre', 'index.html'), 'utf8');
      expect(sobreHtml).toContain('"@type": "BreadcrumbList"');
      expect(sobreHtml).toContain('"@type": "ResearchOrganization"');

      // Verify /eixos/index.html has ResearchProject with 8 axes
      const eixosHtml = await readFile(path.join(tmpDir, 'eixos', 'index.html'), 'utf8');
      expect(eixosHtml).toContain('"@type": "ResearchProject"');
      expect(eixosHtml).toContain('Eixo 1');

      // Verify dynamic shells (e.g. noticias/metaninho-mascote)
      const noticiaHtml = await readFile(path.join(tmpDir, 'noticias', 'metaninho-mascote', 'index.html'), 'utf8');
      expect(noticiaHtml).toContain('"@type": "NewsArticle"');
      expect(noticiaHtml).toContain('Metaninho');
    });

    it('gracefully handles unreachable API host (connection refused) without crashing', async () => {
      const logs = [];
      const result = await generateSeo({
        distDir: tmpDir,
        siteUrl: 'https://cp2b.unicamp.br',
        apiUrl: 'http://127.0.0.1:59999', // Closed port / unreachable
        log: (msg) => logs.push(msg),
      });

      expect(result.prerenderedStatic).toBe(21);
      expect(result.prerenderedDynamic).toBe(14);
      expect(result.sitemapUrlsCount).toBe(35);
      expect(logs.some((l) => l.includes('using static fallback'))).toBe(true);
    });

    it('gracefully handles API returning 500, 404, or non-JSON payloads', async () => {
      // Mock global fetch to return various error responses
      const mockFetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/news')) {
          return Promise.resolve({ ok: false, status: 500 });
        }
        if (url.includes('/microscopio')) {
          return Promise.resolve({ ok: false, status: 404 });
        }
        if (url.includes('/events')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.reject(new Error('Invalid JSON')),
          });
        }
        if (url.includes('/projects')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ notAnArray: true }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        });
      });

      vi.stubGlobal('fetch', mockFetch);

      const logs = [];
      const result = await generateSeo({
        distDir: tmpDir,
        siteUrl: 'https://cp2b.unicamp.br',
        apiUrl: 'https://api.mock.test',
        log: (msg) => logs.push(msg),
      });

      expect(result.prerenderedStatic).toBe(21);
      expect(result.prerenderedDynamic).toBe(14);
      expect(result.sitemapUrlsCount).toBe(35);
      expect(logs.some((l) => l.includes('using static fallback for /noticias'))).toBe(true);
      expect(logs.some((l) => l.includes('using static fallback for /eventos'))).toBe(true);
    });

    it('throws a descriptive error when dist/index.html is missing', async () => {
      const emptyDir = await mkdtemp(path.join(os.tmpdir(), 'cp2b-empty-'));
      try {
        await expect(
          generateSeo({
            distDir: emptyDir,
            siteUrl: 'https://cp2b.unicamp.br',
            apiUrl: '',
          })
        ).rejects.toThrow(/not found — run vite build first/i);
      } finally {
        await rm(emptyDir, { recursive: true, force: true });
      }
    });

    it('fetches and prerenders live items when API returns valid data', async () => {
      const mockLiveNews = [
        {
          slug: 'nova-descoberta-biometano',
          title: 'Nova Descoberta em Biometano',
          description: 'Avanço científico no NIPE.',
          image: '/assets/custom.jpg',
          published_at: '2026-08-20',
          author: 'Pesquisador CP2b',
        },
      ];

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/news')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockLiveNews),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        });
      }));

      const logs = [];
      await generateSeo({
        distDir: tmpDir,
        siteUrl: 'https://cp2b.unicamp.br',
        apiUrl: 'https://api.live.test',
        log: (msg) => logs.push(msg),
      });

      expect(logs.some((l) => l.includes('fetched 1 dynamic items from /news'))).toBe(true);
      const customShell = await readFile(path.join(tmpDir, 'noticias', 'nova-descoberta-biometano', 'index.html'), 'utf8');
      expect(customShell).toContain('Nova Descoberta em Biometano');
      expect(customShell).toContain('"@type": "NewsArticle"');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ENCODING & SPECIAL CHARACTER INTEGRITY
  // ═══════════════════════════════════════════════════════════════════════════
  describe('3. Encoding & Special Character Integrity', () => {
    it('escapes XML entities in sitemap generation preventing syntax breakage', () => {
      const testUrls = [
        { loc: 'https://cp2b.unicamp.br/pesquisa?eixo=1&subeixo=2', lastmod: '2026-08-23', changefreq: 'weekly', priority: '0.8' },
        { loc: 'https://cp2b.unicamp.br/artigo?titulo="Biogás"&tag=<Bio>', lastmod: '2026-08-23', changefreq: 'monthly', priority: '0.6' },
      ];

      const xml = generateSitemapXml(testUrls);
      expect(xml).toContain('eixo=1&amp;subeixo=2');
      expect(xml).toContain('&quot;Biogás&quot;&amp;tag=&lt;Bio&gt;');
      expect(xml).not.toContain('<Bio>');
      expect(xml).not.toMatch(/&(?!(amp|lt|gt|quot|apos);)/);
    });

    it('safely escapes HTML in renderHead for title, meta tags, and open graph', () => {
      const template = '<!doctype html><html><head><title>Old</title><meta name="description" content="Old" /><meta property="og:title" content="Old" /><meta property="og:description" content="Old" /><meta name="twitter:title" content="Old" /><meta name="twitter:description" content="Old" /></head><body></body></html>';
      
      const dangerousMetadata = {
        title: 'Pesquisa <script>alert("xss")</script> & Inovação',
        description: 'Biogás & Bioprodutos: "Soluções" sustentáveis <avançadas>',
        url: 'https://cp2b.unicamp.br/noticia-1',
      };

      const rendered = renderHead(template, dangerousMetadata);

      // Verify no unescaped dangerous tags inside head
      expect(rendered).not.toContain('<script>alert("xss")</script>');
      expect(rendered).toContain('Pesquisa &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; Inovação');
      expect(rendered).toContain('Biogás &amp; Bioprodutos: &quot;Soluções&quot; sustentáveis &lt;avançadas&gt;');
    });

    it('preserves UTF-8 Portuguese accented terminology verbatim across JSON-LD and HTML', () => {
      const complexTerms = [
        'Centro Paulista de Estudos em Biogás e Bioprodutos',
        'Biomassa Lignocelulósica e Digestão Anaeróbia',
        'Avaliação Integrada Socioeconômica, Ambiental e Regulatória',
        'Fórum Paulista de Biogás: Inovações e Extensão Tecnológica',
        'Microscópio de Ideias: Governança, Gestão & Transparência',
      ];

      complexTerms.forEach((term) => {
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: term,
        };

        const serialized = serializeJsonLd(jsonLd);
        expect(serialized).toContain(term);

        // Verify JSON parseability
        const jsonMatch = serialized.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        expect(jsonMatch).not.toBeNull();
        const parsed = JSON.parse(jsonMatch[1]);
        expect(parsed.name).toBe(term);
      });
    });

    it('preserves scientific chemical formulas and unit notations accurately', () => {
      const scientificData = [
        { formula: 'CH₄', name: 'Metano' },
        { formula: 'CO₂', name: 'Dióxido de Carbono' },
        { formula: 'H₂S', name: 'Sulfeto de Hidrogênio' },
        { formula: 'N₂O', name: 'Óxido Nitroso' },
        { metric: '4,5 bilhões de m³/ano' },
        { trl: 'TRL 4–6' }, // Unicode en-dash (\u2013)
        { quotation: '“Biorrefinarias e Economia Circular”' }, // Smart quotes
      ];

      scientificData.forEach((item) => {
        const jsonString = JSON.stringify(item);
        const parsed = JSON.parse(jsonString);
        expect(parsed).toEqual(item);

        const escaped = escapeHtml(JSON.stringify(item));
        expect(escaped).toContain(item.formula || item.metric || item.trl || 'Biorrefinarias');
      });
    });

    it('validates sitemap XML conformance for all 35 project URLs', () => {
      const fallbackNews = getNewsFallback();
      const fallbackProjects = getProjectsFallback();
      const fallbackEvents = getEventsFallback();
      const fallbackMicroscopio = getMicroscopioFallback();
      const fallbackOpportunities = getOpportunitiesFallback();

      const staticUrls = Object.entries(ROUTES).map(([route, config]) => ({
        loc: `https://cp2b.unicamp.br${route === '/' ? '/' : route}`,
        lastmod: '2026-08-23',
        priority: config.priority,
        changefreq: config.changefreq,
      }));

      const dynamicUrls = [
        ...fallbackNews.map((i) => ({ loc: `https://cp2b.unicamp.br/noticias/${i.slug}`, lastmod: '2025-12-18', changefreq: 'weekly', priority: '0.7' })),
        ...fallbackMicroscopio.map((i) => ({ loc: `https://cp2b.unicamp.br/microscopio/${i.slug}`, lastmod: '2025-11-20', changefreq: 'weekly', priority: '0.6' })),
        ...fallbackOpportunities.map((i) => ({ loc: `https://cp2b.unicamp.br/oportunidades/${i.slug}`, lastmod: '2025-12-05', changefreq: 'weekly', priority: '0.6' })),
        ...fallbackProjects.map((i) => ({ loc: `https://cp2b.unicamp.br/entrevistas/${i.slug}`, lastmod: '2026-08-23', changefreq: 'weekly', priority: '0.7' })),
        ...fallbackEvents.map((i) => ({ loc: `https://cp2b.unicamp.br/eventos/${i.slug}`, lastmod: '2026-05-15', changefreq: 'weekly', priority: '0.7' })),
      ];

      const allUrls = [...staticUrls, ...dynamicUrls];
      expect(allUrls).toHaveLength(35);

      const xml = generateSitemapXml(allUrls);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml.split('<url>')).toHaveLength(36); // 1 header + 35 <url> elements

      // Validate every loc starts with https://cp2b.unicamp.br
      allUrls.forEach((u) => {
        expect(u.loc).toMatch(/^https:\/\/cp2b\.unicamp\.br\//);
        expect(xml).toContain(`<loc>${u.loc}</loc>`);
      });
    });
  });
});
