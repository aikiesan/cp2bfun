# Original User Request

## Initial Request — 2026-08-23T18:37:24-03:00

Refine, enhance, and optimize the CP2B web portal: implement Missão, Visão e Valores on `/sobre` with bilingual support, integrate and verify strategic data from CP2B source documents (PPTX, DOCX, XLSX), maximize Google SEO discoverability with JSON-LD structured data and comprehensive sitemap generation, elevate UI/UX visual aesthetics and responsiveness across core pages, remove leftover secrets in docker configurations, and ensure seamless database migration execution and 100% passing test coverage.

Working directory: A:/cp2b_fun/cp2b_web
Integrity mode: development

## Reference Sources
- Strategic Presentation: `A:\cp2b_fun\New_Data_To_Update_Website\drive-download-20260821T194336Z-1-001\Planejamento e gestão integrada do CP2b.pptx` (slides 5 and 6 for Missão, Visão, Valores)
- Strategic Spreadsheet: `A:\cp2b_fun\New_Data_To_Update_Website\drive-download-20260821T194336Z-1-001\Planejamento_Estrategico_CP2B_Integrado_projetos_pesquisadores_labs_v2.xlsx`
- Year 1 Scientific Report: `A:\cp2b_fun\New_Data_To_Update_Website\drive-download-20260821T194336Z-1-001\Relatório Científico Ano 1 CP2B_CCD FAPESP.docx`

## Requirements

### R1. Institutional Content & Visual Polish (Missão, Visão, Valores & UI/UX)
- Add "Missão, Visão e Valores" section to `/sobre` based verbatim on slides 5 & 6 of `Planejamento e gestão integrada do CP2b.pptx`, supporting both Portuguese and English.
- Refine visual presentation, typography, card spacing, and component alignments across `/`, `/sobre`, `/eixos`, `/solucoes`, `/equipe`, and `/noticias` for modern, responsive UI/UX.

### R2. Strategic Data Enrichment & Synchronization
- Synchronize research axes, laboratories, technical services, indicators, and researcher assignments using the latest data from the Excel spreadsheet and Year 1 Scientific Report.
- Ensure all static generated data files in `src/data/generated/` and database seed/migration files are up to date and consistent.

### R3. Google SEO, Metadata & Sitemap Optimization
- Enhance `scripts/generate-seo.mjs` and HTML head rendering:
  - Generate a complete, valid `sitemap.xml` in `dist/` covering all static routes and dynamically fetched API slugs (news, events, opportunities, interviews).
  - Inject Schema.org JSON-LD structured data (`Organization`, `ResearchProject`, `NewsArticle`, `BreadcrumbList`) in prerendered HTML shells for rich Google snippet discovery.
  - Verify Open Graph, Twitter Cards, and canonical URL meta tags for all routes.

### R4. Security & Deployment Cleanliness
- Remove leftover hardcoded secret values (such as `VITE_INVITE_TOKEN=palavra-secreta` in `docker-compose.yml`).
- Ensure backend startup or container initialization executes any pending database migrations automatically so production stays in sync.

## Acceptance Criteria

### Content & Visuals
- [ ] `/sobre` displays Missão, Visão, and all 5 Valores with correct PT/EN translations matching slides 5 & 6.
- [ ] Layout displays smoothly on mobile (375px+), tablet (768px), and desktop (1280px+) without layout shifting or horizontal overflow.

### SEO & Sitemap
- [ ] `dist/sitemap.xml` is generated upon build with correct canonical URLs, `lastmod` dates, and valid XML formatting.
- [ ] Prerendered HTML shells in `dist/` include valid `<script type="application/ld+json">` structured data and canonical links.

### Security & Deployment
- [ ] `docker-compose.yml` contains no hardcoded secret credentials.
- [ ] Backend container initialization or startup script includes automatic migration execution.

### Quality & Tests
- [ ] `npm.cmd run lint` (or `npm run lint`) passes with 0 errors and 0 warnings.
- [ ] `npm.cmd run test:run` passes all Vitest test suites.
- [ ] `npm.cmd run build` successfully compiles the application and runs post-build SEO generation.
