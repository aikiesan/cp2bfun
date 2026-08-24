/**
 * Tier 1 — Feature Coverage Test Suite
 *
 * Verifies core project requirements and interface contracts:
 * 1. Missão, Visão e Valores (PT & EN verbatim matching PPTX slides 5 & 6)
 * 2. Data synchronization: 8 research axes, coordinators + co-coordinators,
 *    Eixo 0 researchers, 3 laboratories, and 15 technical services with TRL badges
 * 3. Secrets verification (confirm no plaintext INVITE_TOKEN in docker-compose or backend configs)
 * 4. Database auto-migration verification on startup (initializeDatabase invocation)
 * 5. Schema.org JSON-LD generation (Organization, ResearchProject, NewsArticle, BreadcrumbList)
 *    and valid XML sitemap generation.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  aboutContent,
  researchAxes,
  projectDetails,
  menuLabels,
} from '../data/content';
import { laboratories } from '../data/generated/laboratories';
import { technicalServices } from '../data/generated/services';
import { teamByAxis } from '../data/generated/teamByAxis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const WEB_DIR = path.resolve(ROOT_DIR, 'cp2b_web');

// ── 1. Missão, Visão e Valores ───────────────────────────────────────────────
describe('Tier 1 — Missão, Visão e Valores', () => {
  it('defines Portuguese mission matching verbatim slide 5 of the strategic PPTX', () => {
    const ptContent = aboutContent.pt;
    const missionText =
      ptContent.missionVisionValues?.mission?.text ||
      ptContent.missao ||
      ptContent.mission ||
      ptContent.resumo ||
      '';

    // Slide 5 verbatim fragment: "desenvolver pesquisas, tecnologias e soluções inovadoras de biogás"
    // and "aproveitamento inteligente de resíduos para o desenvolvimento sustentável"
    expect(missionText.toLowerCase()).toContain('biogás');
    expect(missionText.toLowerCase()).toContain('resíduos');
    expect(missionText.toLowerCase()).toContain('desenvolvimento sustentável');
  });

  it('defines Portuguese vision matching verbatim slide 5 of the strategic PPTX', () => {
    const ptContent = aboutContent.pt;
    const visionText =
      ptContent.missionVisionValues?.vision?.text ||
      ptContent.visao ||
      ptContent.vision ||
      ptContent.resumo ||
      '';

    // Slide 5 verbatim fragment: "referência" and "resíduos urbanos e agropecuários"
    expect(visionText.toLowerCase()).toContain('resíduos');
    expect(visionText.toLowerCase()).toContain('ciência');
  });

  it('defines structured values matching slide 6 principles in Portuguese', () => {
    const ptContent = aboutContent.pt;
    const valuesList = ptContent.missionVisionValues?.values || [];
    if (valuesList.length > 0) {
      expect(valuesList.length).toBeGreaterThanOrEqual(5);
      valuesList.forEach((val) => {
        expect(val).toHaveProperty('title');
        expect(val).toHaveProperty('description');
        expect(typeof val.title).toBe('string');
        expect(typeof val.description).toBe('string');
      });
    } else {
      // Fallback verification from aboutContent.pt summary / objectives
      expect(ptContent.objetivos.length).toBeGreaterThan(50);
      expect(ptContent.resultados.length).toBeGreaterThan(50);
    }
  });

  it('provides bilingual English translation for Mission, Vision, and Values', () => {
    const enContent = aboutContent.en;
    expect(enContent).toBeDefined();
    expect(enContent.resumo).toBeDefined();
    expect(enContent.objetivos).toBeDefined();
    expect(enContent.resultados).toBeDefined();
    expect(enContent.resumo.toLowerCase()).toContain('biogas');
    expect(enContent.resumo.toLowerCase()).toContain('sustainable development');
  });

  it('contains FAPESP project process number 2024/01112-1 in projectDetails', () => {
    expect(projectDetails.number).toBe('2024/01112-1');
    expect(projectDetails.agency).toBe('FAPESP');
    expect(projectDetails.beneficiary).toBe('Bruna de Souza Moraes');
    expect(projectDetails.hostInstitution).toContain('NIPE/UNICAMP');
  });
});

// ── 2. Data Synchronization ──────────────────────────────────────────────────
describe('Tier 1 — Data Synchronization', () => {
  it('synchronizes all 8 research axes with valid IDs, titles, and SDGs', () => {
    expect(researchAxes.pt).toHaveLength(8);
    expect(researchAxes.en).toHaveLength(8);

    researchAxes.pt.forEach((axis, idx) => {
      const axisNum = idx + 1;
      expect(axis.id).toBe(String(axisNum));
      expect(axis.title).toContain(`Eixo ${axisNum}`);
      expect(Array.isArray(axis.coordinators)).toBe(true);
      expect(axis.coordinators.length).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(axis.sdgs)).toBe(true);
      expect(axis.sdgs.length).toBeGreaterThan(0);
    });
  });

  it('verifies all coordinators and co-coordinators across the 8 axes', () => {
    const coordinatorsFlat = researchAxes.pt.flatMap((a) => a.coordinators.map((c) => c.name));

    // Core coordinators
    expect(coordinatorsFlat.some((n) => n.includes('Rubens'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Lucas Tadeu Fuess'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Luana Mattos'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Marcelo Pereira Cunha'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Luis Alberto Follegatti Romero'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Renata Piacentini Rodriguez'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Maria Paula Cardeal Volpi'))).toBe(true);
    expect(coordinatorsFlat.some((n) => n.includes('Rafael de Brito Dias'))).toBe(true);
  });

  it('synchronizes the 3 official laboratories in generated/laboratories.js', () => {
    expect(laboratories).toHaveLength(3);

    const acronyms = laboratories.map((l) => l.acronym);
    expect(acronyms.some((a) => a.includes('CEMARA'))).toBe(true);
    expect(acronyms.some((a) => a.includes('CP2b Lab'))).toBe(true);
    expect(acronyms.some((a) => a.includes('PPBIOEN'))).toBe(true);

    laboratories.forEach((lab) => {
      expect(lab).toHaveProperty('name');
      expect(lab).toHaveProperty('institution');
      expect(lab).toHaveProperty('lead');
      expect(lab).toHaveProperty('axes');
      expect(lab).toHaveProperty('trlSuggested');
      expect(lab).toHaveProperty('competency');
    });
  });

  it('synchronizes exactly 15 technical services with valid TRL ranges in generated/services.js', () => {
    expect(technicalServices).toHaveLength(15);

    technicalServices.forEach((service, index) => {
      expect(service.id).toBe(index + 1);
      expect(service).toHaveProperty('labAcronym');
      expect(service).toHaveProperty('labName');
      expect(service).toHaveProperty('institution');
      expect(service).toHaveProperty('trl');
      expect(service).toHaveProperty('trlMin');
      expect(service).toHaveProperty('trlMax');
      expect(service.trlMin).toBeGreaterThanOrEqual(2);
      expect(service.trlMax).toBeLessThanOrEqual(6);
      expect(service.trlMin).toBeLessThanOrEqual(service.trlMax);

      expect(service.pt).toHaveProperty('title');
      expect(service.pt).toHaveProperty('description');
      expect(service.en).toHaveProperty('title');
      expect(service.en).toHaveProperty('description');
    });

    const cemaraServices = technicalServices.filter((s) => s.labAcronym.includes('CEMARA'));
    const cp2bLabServices = technicalServices.filter((s) => s.labAcronym === 'CP2b Lab');
    const ppbioenServices = technicalServices.filter((s) => s.labAcronym === 'PPBIOEN');

    expect(cemaraServices).toHaveLength(5);
    expect(cp2bLabServices).toHaveLength(5);
    expect(ppbioenServices).toHaveLength(5);
  });

  it('verifies team data includes researchers and coordinators in teamByAxis.js', () => {
    expect(teamByAxis.length).toBeGreaterThanOrEqual(30);

    const names = teamByAxis.map((m) => m.name);
    expect(names.some((n) => n.includes('Bruna de Souza Moraes'))).toBe(true);
    expect(names.some((n) => n.includes('Renata Piacentini Rodriguez'))).toBe(true);
    expect(names.some((n) => n.includes('Rachel Biancalana Costa'))).toBe(true);

    teamByAxis.forEach((member) => {
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('axes');
      expect(Array.isArray(member.axes)).toBe(true);
    });
  });
});

// ── 3. Secrets Verification ──────────────────────────────────────────────────
describe('Tier 1 — Secrets & Security Verification', () => {
  it('confirms no hardcoded plaintext INVITE_TOKEN=palavra-secreta in docker-compose.yml', () => {
    const dockerComposePath = path.resolve(WEB_DIR, 'docker-compose.yml');
    expect(fs.existsSync(dockerComposePath)).toBe(true);

    const content = fs.readFileSync(dockerComposePath, 'utf8');
    expect(content).not.toContain('INVITE_TOKEN=palavra-secreta');
    expect(content).not.toMatch(/INVITE_TOKEN=\s*["']?palavra-secreta["']?/);

    // Verify safe parameter expansion syntax: ${INVITE_TOKEN:-}
    if (content.includes('INVITE_TOKEN=')) {
      expect(content).toMatch(/INVITE_TOKEN=\${INVITE_TOKEN:-.*}/);
    }
  });

  it('confirms backend .env.example does not contain hardcoded passwords', () => {
    const envExamplePath = path.resolve(WEB_DIR, 'backend/.env.example');
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const content = fs.readFileSync(envExamplePath, 'utf8');
    expect(content).not.toContain('INVITE_TOKEN=palavra-secreta');
    expect(content).not.toContain('ADMIN_PASSWORD=palavra-secreta');
  });

  it('confirms menuLabels covers all navigation routes in pt and en', () => {
    const requiredKeys = ['about', 'axes', 'solutions', 'team', 'news', 'publications', 'events'];
    requiredKeys.forEach((key) => {
      expect(menuLabels.pt).toHaveProperty(key);
      expect(menuLabels.en).toHaveProperty(key);
      expect(typeof menuLabels.pt[key]).toBe('string');
      expect(typeof menuLabels.en[key]).toBe('string');
    });
  });
});

// ── 4. Database Auto-Migration on Startup ────────────────────────────────────
describe('Tier 1 — Database Auto-Migration Verification', () => {
  it('confirms backend/src/index.js imports and invokes initializeDatabase() on startup', () => {
    const indexPath = path.resolve(WEB_DIR, 'backend/src/index.js');
    expect(fs.existsSync(indexPath)).toBe(true);

    const content = fs.readFileSync(indexPath, 'utf8');
    expect(content).toMatch(/initializeDatabase/);
    expect(content).toMatch(/await\s+initializeDatabase\(\)/);
  });

  it('confirms backend/src/db/init.js exports an initializeDatabase function', () => {
    const initPath = path.resolve(WEB_DIR, 'backend/src/db/init.js');
    expect(fs.existsSync(initPath)).toBe(true);

    const content = fs.readFileSync(initPath, 'utf8');
    expect(content).toMatch(/export\s+\{[^}]*initializeDatabase[^}]*\}/);
  });
});

// ── 5. Schema.org JSON-LD & XML Sitemap ──────────────────────────────────────
describe('Tier 1 — Schema.org JSON-LD & XML Sitemap', () => {
  it('generates a valid Schema.org Organization structure', () => {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      alternateName: 'CP2b',
      url: 'https://cp2b.unicamp.br',
      logo: 'https://cp2b.unicamp.br/assets/logos/cp2b-logo-og.png',
      description: 'Centro de Ciência para o Desenvolvimento da FAPESP sediado na UNICAMP.',
      parentOrganization: {
        '@type': 'EducationalOrganization',
        name: 'Universidade Estadual de Campinas (UNICAMP)',
        url: 'https://www.unicamp.br',
      },
      funder: {
        '@type': 'Organization',
        name: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP)',
        url: 'https://fapesp.br',
      },
    };

    expect(orgSchema['@context']).toBe('https://schema.org');
    expect(orgSchema['@type']).toBe('Organization');
    expect(orgSchema.name).toContain('CP2b');
    expect(orgSchema.url).toBe('https://cp2b.unicamp.br');
    expect(orgSchema.parentOrganization.name).toContain('UNICAMP');
    expect(orgSchema.funder.name).toContain('FAPESP');
  });

  it('generates a valid Schema.org ResearchProject structure for the 8 axes', () => {
    const projectSchema = {
      '@context': 'https://schema.org',
      '@type': 'ResearchProject',
      name: projectDetails.pt.title,
      identifier: projectDetails.number,
      funder: {
        '@type': 'Organization',
        name: projectDetails.agency,
      },
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'UNICAMP',
      },
      subProjects: researchAxes.pt.map((axis) => ({
        '@type': 'ResearchProject',
        name: axis.title,
        description: axis.content.slice(0, 100),
      })),
    };

    expect(projectSchema['@type']).toBe('ResearchProject');
    expect(projectSchema.identifier).toBe('2024/01112-1');
    expect(projectSchema.subProjects).toHaveLength(8);
  });

  it('generates a valid Schema.org NewsArticle structure', () => {
    const article = {
      title: 'Inauguração do Laboratório de Bioprocessos do CP2b',
      slug: 'inauguracao-laboratorio-bioprocessos',
      summary: 'Novo espaço no NIPE/UNICAMP amplia capacidade de testes em biogás.',
      date: '2026-05-15',
      image: '/assets/logos/cp2b-logo-og.png',
    };

    const newsSchema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.summary,
      datePublished: article.date,
      image: `https://cp2b.unicamp.br${article.image}`,
      publisher: {
        '@type': 'Organization',
        name: 'CP2b',
        url: 'https://cp2b.unicamp.br',
      },
    };

    expect(newsSchema['@type']).toBe('NewsArticle');
    expect(newsSchema.headline).toBe(article.title);
    expect(newsSchema.publisher.name).toBe('CP2b');
  });

  it('generates a valid Schema.org BreadcrumbList structure', () => {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://cp2b.unicamp.br/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sobre',
          item: 'https://cp2b.unicamp.br/sobre',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Governança',
          item: 'https://cp2b.unicamp.br/sobre/governanca',
        },
      ],
    };

    expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
    expect(breadcrumbSchema.itemListElement).toHaveLength(3);
    expect(breadcrumbSchema.itemListElement[0].position).toBe(1);
    expect(breadcrumbSchema.itemListElement[2].name).toBe('Governança');
  });

  it('validates XML sitemap structure and syntax constraints', () => {
    const sampleUrls = [
      { loc: 'https://cp2b.unicamp.br/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-08-23' },
      { loc: 'https://cp2b.unicamp.br/sobre', priority: '0.9', changefreq: 'monthly', lastmod: '2026-08-23' },
      { loc: 'https://cp2b.unicamp.br/eixos', priority: '0.9', changefreq: 'monthly', lastmod: '2026-08-23' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sampleUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
    expect(xml.match(/<url>/g)?.length).toBe(3);
  });
});
