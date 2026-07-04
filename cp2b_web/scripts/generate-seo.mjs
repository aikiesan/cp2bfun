/**
 * Post-build SEO generator.
 *
 * 1. Writes a prerendered dist/<route>/index.html for every public route with
 *    route-specific <title>, meta description, canonical and Open Graph tags,
 *    so crawlers and social scrapers get correct metadata without running JS.
 *    (Both Vercel and the nginx config serve $uri/index.html before falling
 *    back to the SPA shell.)
 * 2. Regenerates dist/sitemap.xml from the same route table, appending dynamic
 *    URLs (news, microscópio, oportunidades, entrevistas) fetched from the API
 *    when it is reachable at build time.
 *
 * Env:
 *   SITE_URL     canonical origin (default https://cp2b.unicamp.br)
 *   SEO_API_URL  API origin for dynamic slugs (falls back to VITE_API_URL);
 *                skipped silently when unreachable.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageSeo } from '../src/data/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const SITE_URL = (process.env.SITE_URL || 'https://cp2b.unicamp.br').replace(/\/$/, '');
const API_URL = process.env.SEO_API_URL || process.env.VITE_API_URL || '';

// route path -> [pageSeo key, sitemap priority, changefreq]
const ROUTES = {
  '/': ['home', '1.0', 'weekly'],
  '/sobre': ['about', '0.9', 'monthly'],
  '/sobre/governanca': ['governance', '0.6', 'monthly'],
  '/sobre/transparencia': ['transparency', '0.6', 'monthly'],
  '/sobre/parceiros': ['partners', '0.6', 'monthly'],
  '/eixos': ['research', '0.9', 'monthly'],
  '/equipe': ['team', '0.8', 'monthly'],
  '/noticias': ['news', '0.9', 'daily'],
  '/oportunidades': ['opportunities', '0.8', 'weekly'],
  '/publicacoes': ['publications', '0.8', 'weekly'],
  '/microscopio': ['microscopio', '0.7', 'weekly'],
  '/eventos': ['events', '0.8', 'weekly'],
  '/galeria': ['gallery', '0.6', 'weekly'],
  '/entrevistas': ['entrevistas', '0.7', 'weekly'],
  '/na-midia': ['media', '0.6', 'weekly'],
  '/press-kit': ['pressKit', '0.5', 'monthly'],
  '/podcast': ['podcast', '0.7', 'weekly'],
  '/forum-paulista': ['forum', '0.8', 'weekly'],
  '/cronograma-evento': ['cronograma', '0.6', 'weekly'],
  '/contato': ['contact', '0.7', 'yearly'],
};

const SITE_NAME = 'CP2b';
const escapeHtml = (s = '') =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const escapeXml = escapeHtml;

function renderHead(template, { title, description, url, injectCanonical = true }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  // Canonical + og:url (not present in the template). Skipped for the root
  // shell: it doubles as the SPA fallback for dynamic URLs, where a baked-in
  // canonical pointing at "/" would conflict with the one Helmet sets at
  // runtime for the actual page.
  if (injectCanonical) {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n  </head>`
    );
  }
  return html;
}

async function fetchJson(endpoint) {
  if (!API_URL) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_URL}${endpoint}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('generate-seo: dist/index.html not found — run vite build first.');
    process.exit(1);
  }
  const template = await readFile(templatePath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);

  // 1. Prerender per-route HTML shells with correct metadata
  let prerendered = 0;
  for (const [route, [seoKey]] of Object.entries(ROUTES)) {
    const meta = pageSeo[seoKey]?.pt;
    if (!meta) continue;
    const url = `${SITE_URL}${route === '/' ? '/' : route}`;
    const html = renderHead(template, {
      title: meta.title,
      description: meta.description,
      url,
      injectCanonical: route !== '/',
    });
    if (route === '/') {
      await writeFile(templatePath, html);
    } else {
      const dir = path.join(DIST, route.slice(1));
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), html);
    }
    prerendered += 1;
  }
  console.log(`generate-seo: prerendered metadata for ${prerendered} routes`);

  // 2. Sitemap — static routes + dynamic content when the API is reachable
  const urls = Object.entries(ROUTES).map(([route, [, priority, changefreq]]) => ({
    loc: `${SITE_URL}${route === '/' ? '/' : route}`,
    lastmod: today,
    priority,
    changefreq,
  }));

  const dynamicSources = [
    { endpoint: '/news', prefix: '/noticias', priority: '0.7' },
    { endpoint: '/microscopio', prefix: '/microscopio', priority: '0.6' },
    { endpoint: '/opportunities', prefix: '/oportunidades', priority: '0.6' },
    { endpoint: '/projects', prefix: '/entrevistas', priority: '0.6' },
  ];

  for (const { endpoint, prefix, priority } of dynamicSources) {
    const items = await fetchJson(endpoint);
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item.slug) continue;
      urls.push({
        loc: `${SITE_URL}${prefix}/${item.slug}`,
        lastmod: (item.updated_at || item.created_at || today).slice(0, 10),
        priority,
        changefreq: 'monthly',
      });
    }
    console.log(`generate-seo: sitemap +${items.length} URLs from ${endpoint}`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log(`generate-seo: sitemap.xml written with ${urls.length} URLs`);
}

main().catch((err) => {
  console.error('generate-seo failed:', err);
  process.exit(1);
});
