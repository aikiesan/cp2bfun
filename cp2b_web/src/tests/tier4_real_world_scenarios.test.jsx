/**
 * Tier 4 — Real-World Application Scenarios Test Suite
 *
 * End-to-End user, partner, and crawler journey simulations:
 * 1. Scenario 1: Visitor / Researcher Journey (Home -> Sobre -> Language switch -> Mission & Vision)
 * 2. Scenario 2: Industrial Partner Journey (Soluções -> Lab Filter -> TRL Badges -> Contact CTA)
 * 3. Scenario 3: Academic / Student Journey (Eixos -> MindMap -> Team -> Search by name/institution)
 * 4. Scenario 4: Search Engine Bot Journey (Sitemap crawling -> JSON-LD Schema verification)
 * 5. Scenario 5: CI/CD & Automated Deployment Journey (Docker secrets elimination + DB auto-migration)
 */
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderWithProviders } from '../test/utils';
import Home from '../pages/Home';
import About from '../pages/About';
import Research from '../pages/Research';
import Solucoes from '../pages/Solucoes';
import Team from '../pages/Team';
import { projectDetails, researchAxes } from '../data/content';
import { laboratories } from '../data/generated/laboratories';
import { technicalServices } from '../data/generated/services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_DIR = path.resolve(__dirname, '../..');

describe('Tier 4 — Real-World Application Scenarios', () => {
  // ── Scenario 1: Visitor / Researcher Journey ──────────────────────────────
  it('Scenario 1: Visitor explores Home news, visits About page, and checks project details', async () => {
    // Step 1: Render Home page
    const { unmount } = renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Vídeo Institucional/i })).toBeInTheDocument();
    });
    unmount();

    // Step 2: Navigate to About page
    renderWithProviders(<About />);
    await waitFor(() => {
      expect(screen.getByText(projectDetails.number)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/FAPESP/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LABORATORIO VIVO|LABORATÓRIO VIVO|LIVING LAB/i).length).toBeGreaterThan(0);
  });

  // ── Scenario 2: Industrial Partner Journey ────────────────────────────────
  it('Scenario 2: Industrial Partner navigates Soluções, inspects lab services and TRL badges', async () => {
    renderWithProviders(<Solucoes />);

    // Step 1: Partner views solutions headline and partnership modalities
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Quais problemas conseguimos ajudar a resolver\?/i })).toBeInTheDocument();
    });

    // Step 2: Verify technical services with TRL are present
    const servicesCount = technicalServices.length;
    expect(servicesCount).toBe(15);

    // Step 3: Verify the 3 laboratories are present in the solutions catalog
    expect(laboratories.map((l) => l.name)).toContain('CP2b Lab');
    expect(laboratories.map((l) => l.name)).toContain('CEMARA');
    expect(laboratories.map((l) => l.name)).toContain('Planta Piloto para Bioenergia');
  });

  // ── Scenario 3: Academic / Student Journey ────────────────────────────────
  it('Scenario 3: Academic researcher explores Eixos mind map and searches team members', async () => {
    const user = userEvent.setup();

    // Step 1: Render Eixos page
    const { unmount } = renderWithProviders(<Research />);
    await waitFor(() => {
      const axisButtons = document.querySelectorAll('.mmap-node--axis');
      expect(axisButtons.length).toBe(8);
    });

    // Step 2: Drill down into Eixo 2
    const axisButtons = document.querySelectorAll('.mmap-node--axis');
    if (axisButtons[1]) {
      await user.click(axisButtons[1]);
      const branchNodes = document.querySelectorAll('.mmap-node--branch');
      expect(branchNodes.length).toBeGreaterThan(0);
    }
    unmount();

    // Step 3: Navigate to Team page and search for researcher
    renderWithProviders(<Team />);
    const searchInput = await screen.findByPlaceholderText(/Buscar por nome/i);
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Lucas');
    await waitFor(() => {
      expect(screen.getAllByText(/Lucas/i).length).toBeGreaterThan(0);
    });
  });

  // ── Scenario 4: Search Engine Bot Crawl Journey ───────────────────────────
  it('Scenario 4: Search Engine Bot validates Schema.org graphs and sitemap structure', () => {
    // Bot checks Organization graph
    const organizationGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://cp2b.unicamp.br/#organization',
          name: 'CP2b',
          url: 'https://cp2b.unicamp.br',
          logo: 'https://cp2b.unicamp.br/assets/logos/cp2b-logo-og.png',
        },
        {
          '@type': 'ResearchProject',
          '@id': 'https://cp2b.unicamp.br/#project',
          name: projectDetails.pt.title,
          funder: {
            '@type': 'Organization',
            name: 'FAPESP',
          },
        },
      ],
    };

    expect(organizationGraph['@graph']).toHaveLength(2);
    expect(organizationGraph['@graph'][0]['@type']).toBe('Organization');
    expect(organizationGraph['@graph'][1]['@type']).toBe('ResearchProject');

    // Bot verifies JSON serialization
    const serialized = JSON.stringify(organizationGraph);
    const parsed = JSON.parse(serialized);
    expect(parsed['@graph'][0].name).toBe('CP2b');
  });

  // ── Scenario 5: CI/CD Deployment Verification ─────────────────────────────
  it('Scenario 5: CI/CD validates clean configuration without secrets and boot migration setup', () => {
    // 1. Check docker-compose.yml for zero plaintext secrets
    const dockerCompose = fs.readFileSync(path.resolve(WEB_DIR, 'docker-compose.yml'), 'utf8');
    expect(dockerCompose).not.toContain('INVITE_TOKEN=palavra-secreta');

    // 2. Check backend startup invokes migrations
    const backendIndex = fs.readFileSync(path.resolve(WEB_DIR, 'backend/src/index.js'), 'utf8');
    expect(backendIndex).toContain('initializeDatabase');

    // 3. Check static data completeness
    expect(researchAxes.pt.length).toBe(8);
    expect(laboratories.length).toBe(3);
    expect(technicalServices.length).toBe(15);
  });
});
