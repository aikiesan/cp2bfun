import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  ROUTES,
  escapeHtml,
  escapeXml,
  buildOrganizationJsonLd,
  buildResearchProjectJsonLd,
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  buildEventJsonLd,
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

describe('Milestone M3: SEO, Schema.org JSON-LD, Sitemap & Meta Tags', () => {
  const BASE_URL = 'https://cp2b.unicamp.br';

  const SAMPLE_TEMPLATE = '<!doctype html>\n' +
    '<html lang="pt-br">\n' +
    '  <head>\n' +
    '    <meta charset="UTF-8" />\n' +
    '    <title>CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos</title>\n' +
    '    <meta name="description" content="Initial description" />\n' +
    '    <meta property="og:type" content="website" />\n' +
    '    <meta property="og:site_name" content="CP2b" />\n' +
    '    <meta property="og:title" content="Initial OG Title" />\n' +
    '    <meta property="og:description" content="Initial OG Desc" />\n' +
    '    <meta property="og:image" content="/assets/logos/cp2b-logo-og.png" />\n' +
    '    <meta name="twitter:card" content="summary_large_image" />\n' +
    '    <meta name="twitter:title" content="Initial Twitter Title" />\n' +
    '    <meta name="twitter:description" content="Initial Twitter Desc" />\n' +
    '    <meta name="twitter:image" content="/assets/logos/cp2b-logo-og.png" />\n' +
    '  </head>\n' +
    '  <body>\n' +
    '    <div id="root"></div>\n' +
    '  </body>\n' +
    '</html>';

  describe('1. Schema.org JSON-LD Structured Data Builders', () => {
    it('builds valid ResearchOrganization Schema.org JSON-LD', () => {
      const org = buildOrganizationJsonLd(BASE_URL);
      expect(org['@context']).toBe('https://schema.org');
      expect(org['@type']).toBe('ResearchOrganization');
      expect(org.name).toContain('CP2b');
      expect(org.url).toBe(BASE_URL);
      expect(org.logo).toContain('cp2b-logo-og.png');
      expect(org.parentOrganization['@type']).toBe('CollegeOrUniversity');
      expect(org.parentOrganization.alternateName).toBe('UNICAMP');
      expect(org.address['@type']).toBe('PostalAddress');
      expect(org.address.addressLocality).toBe('Campinas');
      expect(Array.isArray(org.sameAs)).toBe(true);
      expect(org.sameAs.some((s) => s.includes('instagram.com'))).toBe(true);
      expect(org.knowsAbout).toContain('biogás');
    });

    it('builds valid ResearchProject Schema.org JSON-LD with 8 thematic axes', () => {
      const project = buildResearchProjectJsonLd(BASE_URL);
      expect(project['@context']).toBe('https://schema.org');
      expect(project['@type']).toBe('ResearchProject');
      expect(project.name).toContain('CP2b');
      expect(project.funder.name).toContain('FAPESP');
      expect(project.parentOrganization.alternateName).toBe('UNICAMP');
      expect(Array.isArray(project.subProjects)).toBe(true);
      expect(project.subProjects.length).toBe(8);

      const subAxes = project.subProjects.map((p) => p.name);
      expect(subAxes.some((t) => t.includes('Inventário'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Ciência e Tecnologia'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Engenharia de Processos'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Avaliação Integrada'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Inovação em Bioprodutos'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Educação e Capacitação'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Difusão Científica'))).toBe(true);
      expect(subAxes.some((t) => t.includes('Políticas Públicas'))).toBe(true);
    });

    it('builds valid BreadcrumbList Schema.org JSON-LD for hierarchical routes', () => {
      expect(buildBreadcrumbJsonLd('/', null, BASE_URL)).toBeNull();

      const sobreBreadcrumb = buildBreadcrumbJsonLd('/sobre', 'Sobre o CP2b', BASE_URL);
      expect(sobreBreadcrumb['@type']).toBe('BreadcrumbList');
      expect(sobreBreadcrumb.itemListElement).toHaveLength(2);
      expect(sobreBreadcrumb.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: `${BASE_URL}/`,
      });
      expect(sobreBreadcrumb.itemListElement[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Sobre o CP2b',
        item: `${BASE_URL}/sobre`,
      });

      const nestedBreadcrumb = buildBreadcrumbJsonLd(
        '/sobre/governanca',
        'Governança',
        BASE_URL
      );
      expect(nestedBreadcrumb.itemListElement).toHaveLength(3);
      expect(nestedBreadcrumb.itemListElement[2].name).toBe('Governança');
      expect(nestedBreadcrumb.itemListElement[2].item).toBe(`${BASE_URL}/sobre/governanca`);

      const dynamicBreadcrumb = buildBreadcrumbJsonLd(
        '/noticias/cau-2025',
        'Visita CAU 2025',
        BASE_URL
      );
      expect(dynamicBreadcrumb.itemListElement).toHaveLength(3);
      expect(dynamicBreadcrumb.itemListElement[1].name).toBe('Notícias');
      expect(dynamicBreadcrumb.itemListElement[2].name).toBe('Visita CAU 2025');
    });

    it('builds valid NewsArticle Schema.org JSON-LD for news and opinion articles', () => {
      const articleItem = {
        slug: 'cau-2025',
        title: 'Delegação da CAU visita CP2b',
        description: 'Cooperação acadêmica internacional com a China Agricultural University.',
        image: '/assets/cau-capa.jpg',
        published_at: '2025-07-29',
        updated_at: '2025-07-30',
        author: 'CP2b Comunicação',
      };
      const newsLd = buildNewsArticleJsonLd(articleItem, '/noticias/cau-2025', BASE_URL);
      expect(newsLd['@context']).toBe('https://schema.org');
      expect(newsLd['@type']).toBe('NewsArticle');
      expect(newsLd.headline).toBe('Delegação da CAU visita CP2b');
      expect(newsLd.description).toContain('Cooperação acadêmica internacional');
      expect(newsLd.image).toBe(`${BASE_URL}/assets/cau-capa.jpg`);
      expect(newsLd.datePublished).toBe('2025-07-29');
      expect(newsLd.author.name).toBe('CP2b Comunicação');
      expect(newsLd.publisher.name).toContain('CP2b');
      expect(newsLd.mainEntityOfPage['@id']).toBe(`${BASE_URL}/noticias/cau-2025`);
    });

    it('builds valid Event Schema.org JSON-LD for events', () => {
      const eventItem = {
        slug: 'workshop-anual-2025',
        title: 'I Workshop Anual do CP2b',
        description: 'Avanços dos 8 eixos temáticos e assinatura do Regimento Interno.',
        start_date: '2025-12-02T09:00:00',
        end_date: '2025-12-02T18:00:00',
        location: 'Auditório NIPE / UNICAMP',
        location_type: 'in-person',
        image: '/assets/workshop.jpg',
        organizer: 'CP2b',
      };
      const eventLd = buildEventJsonLd(eventItem, '/eventos/workshop-anual-2025', BASE_URL);
      expect(eventLd['@context']).toBe('https://schema.org');
      expect(eventLd['@type']).toBe('Event');
      expect(eventLd.name).toBe('I Workshop Anual do CP2b');
      expect(eventLd.startDate).toBe('2025-12-02T09:00:00');
      expect(eventLd.location.name).toBe('Auditório NIPE / UNICAMP');
      expect(eventLd.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
      expect(eventLd.organizer.name).toBe('CP2b');
    });

    it('serializes single objects and multiple items via @graph cleanly', () => {
      const single = buildOrganizationJsonLd(BASE_URL);
      const serializedSingle = serializeJsonLd(single);
      expect(serializedSingle).toContain('<script type="application/ld+json">');
      expect(serializedSingle).toContain('"@type": "ResearchOrganization"');
      const parsedSingle = JSON.parse(
        serializedSingle.replace(/<script[^>]*>|<\/script>/g, '')
      );
      expect(parsedSingle['@type']).toBe('ResearchOrganization');

      const multi = [
        buildOrganizationJsonLd(BASE_URL),
        buildBreadcrumbJsonLd('/sobre', 'Sobre', BASE_URL),
      ];
      const serializedMulti = serializeJsonLd(multi);
      expect(serializedMulti).toContain('"@graph"');
      const parsedMulti = JSON.parse(
        serializedMulti.replace(/<script[^>]*>|<\/script>/g, '')
      );
      expect(parsedMulti['@graph']).toHaveLength(2);
      expect(parsedMulti['@graph'][0]['@type']).toBe('ResearchOrganization');
      expect(parsedMulti['@graph'][1]['@type']).toBe('BreadcrumbList');
    });
  });

  describe('2. Head & Metadata Rendering (renderHead)', () => {
    it('replaces title, meta description, OG tags, Twitter cards, and injects canonical and JSON-LD', () => {
      const jsonLd = buildOrganizationJsonLd(BASE_URL);
      const rendered = renderHead(SAMPLE_TEMPLATE, {
        title: 'Sobre o CP2b',
        description: 'Página institucional do centro.',
        url: `${BASE_URL}/sobre`,
        image: '/assets/sobre-og.jpg',
        type: 'website',
        jsonLd,
        injectCanonical: true,
        siteUrl: BASE_URL,
      });

      expect(rendered).toContain('<title>Sobre o CP2b</title>');
      expect(rendered).toContain('<meta name="description" content="Página institucional do centro." />');
      expect(rendered).toContain('<meta property="og:title" content="Sobre o CP2b" />');
      expect(rendered).toContain('<meta property="og:description" content="Página institucional do centro." />');
      expect(rendered).toContain(`<meta property="og:image" content="${BASE_URL}/assets/sobre-og.jpg" />`);
      expect(rendered).toContain(`<link rel="canonical" href="${BASE_URL}/sobre" />`);
      expect(rendered).toContain(`<meta property="og:url" content="${BASE_URL}/sobre" />`);
      expect(rendered).toContain('<meta name="twitter:card" content="summary_large_image" />');
      expect(rendered).toContain('<meta name="twitter:title" content="Sobre o CP2b" />');
      expect(rendered).toContain('<meta name="twitter:description" content="Página institucional do centro." />');
      expect(rendered).toContain(`<meta name="twitter:image" content="${BASE_URL}/assets/sobre-og.jpg" />`);
      expect(rendered).toContain('<script type="application/ld+json">');
      expect(rendered).toContain('"ResearchOrganization"');
    });

    it('escapes XML/HTML characters properly in head tags', () => {
      expect(escapeHtml('CP2b & Biogás <SP> "2026"')).toBe('CP2b &amp; Biogás &lt;SP&gt; &quot;2026&quot;');
      expect(escapeXml('A & B')).toBe('A &amp; B');

      const rendered = renderHead(SAMPLE_TEMPLATE, {
        title: 'Pesquisa & Desenvolvimento <Biogás>',
        description: 'Uso de resíduos "orgânicos" & biometano',
        url: `${BASE_URL}/pesquisa`,
        siteUrl: BASE_URL,
      });
      expect(rendered).toContain('Pesquisa &amp; Desenvolvimento &lt;Biogás&gt; | CP2b');
      expect(rendered).toContain('Uso de resíduos &quot;orgânicos&quot; &amp; biometano');
    });
  });

  describe('3. Offline Static Fallbacks', () => {
    it('returns valid fallback items for news, projects, events, microscopio, and opportunities', () => {
      const news = getNewsFallback();
      expect(Array.isArray(news)).toBe(true);
      expect(news.length).toBeGreaterThanOrEqual(4);
      expect(news.some((n) => n.slug === 'cau-2025')).toBe(true);
      expect(news.some((n) => n.slug === 'metaninho-mascote')).toBe(true);

      const projects = getProjectsFallback();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThanOrEqual(4);
      expect(projects.some((p) => p.slug === 'living-lab-ofmsw')).toBe(true);
      expect(projects.some((p) => p.slug === 'cooperativa-agroindustrial')).toBe(true);

      const events = getEventsFallback();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThanOrEqual(2);
      expect(events.some((e) => e.slug === 'workshop-anual-2025')).toBe(true);

      const microscopio = getMicroscopioFallback();
      expect(Array.isArray(microscopio)).toBe(true);
      expect(microscopio.length).toBeGreaterThanOrEqual(2);

      const opportunities = getOpportunitiesFallback();
      expect(Array.isArray(opportunities)).toBe(true);
      expect(opportunities.length).toBeGreaterThanOrEqual(2);
    });

    it('defines all 21 core static routes in the ROUTES table', () => {
      const expectedRoutes = [
        '/',
        '/sobre',
        '/sobre/governanca',
        '/sobre/indicadores',
        '/sobre/transparencia',
        '/sobre/parceiros',
        '/eixos',
        '/solucoes',
        '/equipe',
        '/noticias',
        '/oportunidades',
        '/publicacoes',
        '/microscopio',
        '/eventos',
        '/galeria',
        '/entrevistas',
        '/na-midia',
        '/press-kit',
        '/podcast',
        '/forum-paulista',
        '/contato',
      ];
      expect(Object.keys(ROUTES).sort()).toEqual(expectedRoutes.sort());
      expect(Object.keys(ROUTES).length).toBe(21);
    });
  });

  describe('4. Sitemap XML Generation', () => {
    it('generates valid sitemap.xml with loc, lastmod, changefreq, and priority', () => {
      const urls = [
        { loc: `${BASE_URL}/`, lastmod: '2026-08-23', changefreq: 'weekly', priority: '1.0' },
        { loc: `${BASE_URL}/sobre`, lastmod: '2026-08-23', changefreq: 'monthly', priority: '0.9' },
        { loc: `${BASE_URL}/noticias/cau-2025`, lastmod: '2025-07-29', changefreq: 'weekly', priority: '0.7' },
      ];
      const xml = generateSitemapXml(urls);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain(`<loc>${BASE_URL}/</loc>`);
      expect(xml).toContain('<lastmod>2026-08-23</lastmod>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
      expect(xml).toContain('<priority>1.0</priority>');
      expect(xml).toContain(`<loc>${BASE_URL}/noticias/cau-2025</loc>`);
      expect(xml).toContain('</urlset>');
    });
  });

  describe('5. Full SEO Pipeline Execution (generateSeo)', () => {
    let tmpDir;

    beforeEach(async () => {
      tmpDir = await mkdtemp(path.join(os.tmpdir(), 'cp2b-seo-test-'));
      await writeFile(path.join(tmpDir, 'index.html'), SAMPLE_TEMPLATE, 'utf8');
    });

    afterEach(async () => {
      if (tmpDir) {
        await rm(tmpDir, { recursive: true, force: true });
      }
    });

    it('prerenders 21 static shells + dynamic shells and writes complete sitemap.xml in offline fallback mode', async () => {
      const logs = [];
      const result = await generateSeo({
        distDir: tmpDir,
        siteUrl: BASE_URL,
        apiUrl: '',
        log: (msg) => logs.push(msg),
      });

      expect(result.prerenderedStatic).toBe(21);
      expect(result.prerenderedDynamic).toBeGreaterThanOrEqual(14);
      expect(result.sitemapUrlsCount).toBeGreaterThanOrEqual(35);

      // Verify sitemap.xml
      const sitemap = await readFile(path.join(tmpDir, 'sitemap.xml'), 'utf8');
      expect(sitemap).toContain(`<loc>${BASE_URL}/</loc>`);
      expect(sitemap).toContain(`<loc>${BASE_URL}/sobre</loc>`);
      expect(sitemap).toContain(`<loc>${BASE_URL}/eixos</loc>`);
      expect(sitemap).toContain(`<loc>${BASE_URL}/noticias/cau-2025</loc>`);
      expect(sitemap).toContain(`<loc>${BASE_URL}/entrevistas/living-lab-ofmsw</loc>`);
      expect(sitemap).toContain(`<loc>${BASE_URL}/eventos/workshop-anual-2025</loc>`);

      // Verify root index.html has ResearchOrganization JSON-LD
      const rootHtml = await readFile(path.join(tmpDir, 'index.html'), 'utf8');
      expect(rootHtml).toContain('<script type="application/ld+json">');
      expect(rootHtml).toContain('"ResearchOrganization"');
      expect(rootHtml).toContain(`<link rel="canonical" href="${BASE_URL}/" />`);

      // Verify /sobre/index.html has ResearchOrganization and BreadcrumbList
      const sobreHtml = await readFile(path.join(tmpDir, 'sobre/index.html'), 'utf8');
      expect(sobreHtml).toContain('"ResearchOrganization"');
      expect(sobreHtml).toContain('"BreadcrumbList"');
      expect(sobreHtml).toContain(`<link rel="canonical" href="${BASE_URL}/sobre" />`);

      // Verify /eixos/index.html has ResearchProject with 8 axes
      const eixosHtml = await readFile(path.join(tmpDir, 'eixos/index.html'), 'utf8');
      expect(eixosHtml).toContain('"ResearchProject"');
      expect(eixosHtml).toContain('"subProjects"');

      // Verify /noticias/cau-2025/index.html has NewsArticle
      const newsHtml = await readFile(path.join(tmpDir, 'noticias/cau-2025/index.html'), 'utf8');
      expect(newsHtml).toContain('"NewsArticle"');
      expect(newsHtml).toContain('Delegação da China Agricultural University');

      // Verify /eventos/workshop-anual-2025/index.html has Event
      const eventHtml = await readFile(path.join(tmpDir, 'eventos/workshop-anual-2025/index.html'), 'utf8');
      expect(eventHtml).toContain('"Event"');
      expect(eventHtml).toContain('I Workshop Anual do CP2b');
    });
  });
});
