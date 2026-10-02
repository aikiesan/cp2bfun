/**
 * Auditoria de SEO do site do CP2b.
 *
 *   node scripts/seo-audit.mjs                                 arquivos do build (dist/)
 *   node scripts/seo-audit.mjs --url http://localhost:8080     homologação no Docker
 *   node scripts/seo-audit.mjs --url https://cp2b.unicamp.br   produção (só GET)
 *
 * Em todo modo, para cada página do sitemap: <html lang>, título, descrição,
 * canonical, robots, Open Graph, Twitter e JSON-LD (JSON válido e os campos
 * que o Google exige de cada tipo), além do sitemap.xml e do robots.txt.
 *
 * Com --url também confere a resposta HTTP: status 200 sem redirecionamento,
 * Location nunca em http://, X-Robots-Tag nas páginas rasas, 410 em /na-midia,
 * o tipo do template de cursos para download, se cada página dinâmica do
 * sitemap existe na API (--api, padrão <url>/api) e quais cabeçalhos de
 * segurança e de cache vêm na resposta.
 *
 * Sai com código 1 quando há erro; aviso e info só informam.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES } from './generate-seo.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const opt = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const SITE = (opt('site') || process.env.SITE_URL || 'https://cp2b.unicamp.br').replace(/\/$/, '');
const BASE = opt('url') ? opt('url').replace(/\/$/, '') : null;
const API = (opt('api') || (BASE ? `${BASE}/api` : '')).replace(/\/$/, '');
const DIST = path.resolve(opt('dist') || path.join(here, '../dist'));

// Páginas rasas, marcadas com noindex (o .htaccess manda X-Robots-Tag nelas).
const NOINDEX_PATHS = ['/outros', '/manutencao', '/confirmar-meetup'];
// Removida em definitivo: o .htaccess responde 410.
const GONE_PATHS = ['/na-midia'];
const DYNAMIC = [
  { prefix: '/noticias', endpoint: '/news' },
  { prefix: '/microscopio', endpoint: '/microscopio' },
  { prefix: '/oportunidades', endpoint: '/opportunities' },
  { prefix: '/entrevistas', endpoint: '/projects' },
  { prefix: '/eventos', endpoint: '/events' },
];
const DOWNLOADS = [
  ['/assets/capacitacao/template-oferecimento-curso-cp2b.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['/assets/boletins/boletim-cp2b-edicao-1-setembro-2026.pdf', 'application/pdf'],
];
const SECURITY_HEADERS = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
];

// Campos que o Google pede para cada tipo de dado estruturado.
const REQUIRED = {
  Organization: ['name', 'url', 'logo'],
  ResearchOrganization: ['name', 'url', 'logo'],
  ResearchProject: ['name'],
  BreadcrumbList: ['itemListElement'],
  NewsArticle: ['headline', 'datePublished', 'image'],
  Article: ['headline', 'datePublished', 'image'],
  Event: ['name', 'startDate', 'location'],
};

// ---------- relatório ----------
const findings = [];
const report = (level) => (where, msg) => findings.push({ level, where, msg });
const erro = report('erro');
const aviso = report('aviso');
const info = report('info');

// ---------- leitura do HTML ----------
const decode = (s) => s
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const attrs = (tag) => {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) out[m[1].toLowerCase()] = decode(m[3] ?? m[4] ?? '');
  return out;
};

export function parseHead(html) {
  const head = html.split(/<\/head>/i)[0];
  const meta = {};
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const key = (a.name || a.property || '').toLowerCase();
    if (key) (meta[key] ||= []).push(a.content ?? '');
  }
  return {
    lang: (html.match(/<html[^>]*\blang=["']([^"']+)["']/i) || [])[1] || null,
    titles: [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => decode(m[1].trim())),
    meta,
    canonicals: [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0])).filter((a) => (a.rel || '').toLowerCase() === 'canonical').map((a) => a.href),
    jsonLd: [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]),
  };
}

export function checkJsonLd(where, raw, { erro: e = erro, aviso: a = aviso } = {}) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    e(where, `JSON-LD inválido: ${err.message}`);
    return [];
  }
  const nodes = Array.isArray(data) ? data : (data['@graph'] || [data]);
  const context = String(data['@context'] || nodes[0]?.['@context'] || '');
  if (!context.includes('schema.org')) e(where, 'JSON-LD sem @context do schema.org');
  const types = [];
  for (const node of nodes) {
    for (const type of [].concat(node['@type'] || [])) {
      types.push(type);
      for (const field of REQUIRED[type] || []) {
        const v = node[field];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) e(where, `${type} sem "${field}"`);
      }
      if (type === 'BreadcrumbList') {
        (node.itemListElement || []).forEach((item, i) => {
          if (item.position !== i + 1 || !item.name || !item.item) e(where, `BreadcrumbList: item ${i + 1} incompleto`);
        });
      }
      if ((type === 'NewsArticle' || type === 'Article') && String(node.headline || '').length > 110) {
        a(where, `headline com ${String(node.headline).length} caracteres (o Google usa até 110)`);
      }
      if (type === 'Event' && !node.eventStatus) a(where, 'Event sem eventStatus');
    }
  }
  return types;
}

// ---------- fontes: arquivos do build ou HTTP ----------
const toBase = (loc) => (BASE ? loc.replace(SITE, BASE) : loc);

async function get(url, { redirect = 'manual' } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { redirect, signal: controller.signal, headers: { 'user-agent': 'cp2b-seo-audit/1.0' } });
    const body = res.status === 200 && /text|json|xml|javascript/.test(res.headers.get('content-type') || '') ? await res.text() : '';
    return { status: res.status, headers: res.headers, body };
  } catch (err) {
    return { status: 0, headers: new Headers(), body: '', error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function readPage(loc) {
  const route = new URL(loc).pathname.replace(/\/$/, '') || '/';
  if (!BASE) {
    const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
    if (!existsSync(file)) return { route, missing: true };
    return { route, html: await readFile(file, 'utf8') };
  }
  const res = await get(toBase(loc));
  return { route, res, html: res.body };
}

async function readText(rel) {
  if (!BASE) {
    const file = path.join(DIST, rel);
    return existsSync(file) ? readFile(file, 'utf8') : null;
  }
  const res = await get(`${BASE}/${rel}`);
  return res.status === 200 ? res.body : null;
}

// ---------- verificações ----------
function checkPage(loc, page, seen) {
  const where = page.route;
  if (page.missing) return erro(where, 'sem HTML pré-renderizado no dist/');

  if (page.res) {
    const { status, headers, error } = page.res;
    if (status === 0) return erro(where, `sem resposta (${error})`);
    const location = headers.get('location');
    if (location && location.startsWith('http://')) erro(where, `redireciona para http:// (${location})`);
    if (status !== 200) return erro(where, `HTTP ${status}${location ? ` → ${location}` : ''} (página do sitemap deve responder 200 direto)`);
    if (/noindex/i.test(headers.get('x-robots-tag') || '')) erro(where, 'X-Robots-Tag noindex numa página do sitemap');
  }

  const h = parseHead(page.html);
  if (h.lang !== 'pt-br') aviso(where, `<html lang="${h.lang}"> (esperado pt-br)`);

  const title = h.titles[0] || '';
  if (!title) erro(where, 'sem <title>');
  else {
    if (title.length > 65) aviso(where, `título com ${title.length} caracteres (o Google mostra ~60): "${title}"`);
    (seen.titles[title] ||= []).push(where);
  }

  const description = (h.meta.description || [])[0] || '';
  if (!description) erro(where, 'sem meta description');
  else {
    if (description.length < 50 || description.length > 160) aviso(where, `descrição com ${description.length} caracteres (ideal entre 50 e 160)`);
    (seen.descriptions[description] ||= []).push(where);
  }

  if ((h.meta.robots || []).some((r) => /noindex/i.test(r))) erro(where, 'meta robots noindex numa página do sitemap');

  if (h.canonicals.length !== 1) erro(where, `${h.canonicals.length} links canonical (esperado 1)`);
  const canonical = h.canonicals[0];
  if (canonical && canonical !== loc) erro(where, `canonical ${canonical} difere da URL do sitemap ${loc}`);

  for (const key of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card']) {
    if (!(h.meta[key] || [])[0]) aviso(where, `sem ${key}`);
  }
  const ogUrl = (h.meta['og:url'] || [])[0];
  if (ogUrl && canonical && ogUrl !== canonical) aviso(where, `og:url ${ogUrl} difere do canonical`);
  const ogImage = (h.meta['og:image'] || [])[0];
  if (ogImage) {
    if (!/^https:\/\//.test(ogImage)) aviso(where, `og:image não é URL absoluta https: ${ogImage}`);
    seen.images.add(ogImage);
  }

  if (h.jsonLd.length === 0) aviso(where, 'sem JSON-LD');
  for (const raw of h.jsonLd) checkJsonLd(where, raw);
}

async function main() {
  console.log(`seo-audit: ${BASE ? `${BASE} (URLs canônicas em ${SITE})` : `arquivos de ${DIST}`}`);

  // robots.txt
  const robots = await readText('robots.txt');
  if (!robots) erro('/robots.txt', 'não encontrado');
  else {
    if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) erro('/robots.txt', `sem "Sitemap: ${SITE}/sitemap.xml"`);
    if (/^Disallow:\s*\/\s*$/m.test(robots)) erro('/robots.txt', 'bloqueia o site inteiro (Disallow: /)');
    if (!/^Disallow:\s*\/admin/m.test(robots)) aviso('/robots.txt', 'não bloqueia /admin');
  }

  // sitemap.xml
  const sitemap = await readText('sitemap.xml');
  if (!sitemap) {
    erro('/sitemap.xml', 'não encontrado');
    return finish();
  }
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim()));
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
  if (!sitemap.startsWith('<?xml')) erro('/sitemap.xml', 'sem declaração XML');
  if (new Set(locs).size !== locs.length) erro('/sitemap.xml', 'URLs repetidas');
  lastmods.filter((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d)).forEach((d) => erro('/sitemap.xml', `lastmod fora do formato AAAA-MM-DD: ${d}`));
  for (const loc of locs) {
    if (!loc.startsWith(`${SITE}/`)) erro('/sitemap.xml', `URL fora de ${SITE}: ${loc}`);
    else if (loc !== `${SITE}/` && loc.endsWith('/')) aviso('/sitemap.xml', `URL com barra no fim: ${loc}`);
    const p = new URL(loc).pathname;
    if ([...NOINDEX_PATHS, ...GONE_PATHS, '/admin'].some((x) => p === x || p.startsWith(`${x}/`))) erro('/sitemap.xml', `página sem índice listada: ${loc}`);
  }
  for (const route of Object.keys(ROUTES)) {
    const loc = `${SITE}${route === '/' ? '/' : route}`;
    if (!locs.includes(loc)) erro('/sitemap.xml', `rota estática ausente: ${route}`);
  }
  info('/sitemap.xml', `${locs.length} URLs`);

  // páginas
  const seen = { titles: {}, descriptions: {}, images: new Set() };
  for (const loc of locs) checkPage(loc, await readPage(loc), seen);
  for (const [title, where] of Object.entries(seen.titles)) if (where.length > 1) aviso(where.join(', '), `título repetido: "${title}"`);
  for (const [, where] of Object.entries(seen.descriptions)) if (where.length > 1) aviso(where.join(', '), 'descrição repetida');

  if (BASE) await checkHttp(locs, seen);
  return finish();
}

async function checkHttp(locs, seen) {
  // Páginas dinâmicas do sitemap x o que a API tem de fato.
  for (const { prefix, endpoint } of DYNAMIC) {
    const inSitemap = locs.filter((l) => l.startsWith(`${SITE}${prefix}/`)).map((l) => l.slice(`${SITE}${prefix}/`.length));
    const res = await get(`${API}${endpoint}`, { redirect: 'follow' });
    let items = null;
    try { items = JSON.parse(res.body); } catch { /* resposta não é JSON */ }
    if (!Array.isArray(items)) {
      aviso(prefix, `API ${API}${endpoint} não respondeu uma lista (HTTP ${res.status}); páginas dinâmicas não conferidas`);
      continue;
    }
    const slugs = new Set(items.map((i) => i.slug).filter(Boolean));
    inSitemap.filter((s) => !slugs.has(s)).forEach((s) => erro(`${prefix}/${s}`, 'está no sitemap mas não existe na API (abre como "não encontrada")'));
    const missing = [...slugs].filter((s) => !inSitemap.includes(s));
    if (missing.length) aviso(prefix, `${missing.length} item(ns) da API fora do sitemap: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '…' : ''}`);
  }

  // Páginas rasas e removidas.
  for (const p of NOINDEX_PATHS) {
    const res = await get(`${BASE}${p}`);
    if (!/noindex/i.test(res.headers.get('x-robots-tag') || '')) aviso(p, 'sem X-Robots-Tag noindex no cabeçalho HTTP');
  }
  for (const p of GONE_PATHS) {
    const res = await get(`${BASE}${p}`);
    if (res.status !== 410) aviso(p, `HTTP ${res.status} (esperado 410 Gone)`);
  }

  // Barra no fim nunca pode redirecionar para http:// (o erro 403 do Googlebot).
  const slash = await get(`${BASE}/sobre/`);
  const slashLocation = slash.headers.get('location') || '';
  if (slashLocation.startsWith('http://')) erro('/sobre/', `redireciona para http:// (${slashLocation})`);
  else info('/sobre/', `HTTP ${slash.status}${slashLocation ? ` → ${slashLocation}` : ''}`);

  // Arquivos para download chegam como arquivo, não como a SPA.
  for (const [p, type] of DOWNLOADS) {
    const res = await get(`${BASE}${p}`);
    const ct = res.headers.get('content-type') || '';
    if (res.status !== 200) erro(p, `HTTP ${res.status}`);
    else if (ct.includes('text/html')) erro(p, 'respondido com HTML (a SPA) em vez do arquivo');
    else if (!ct.startsWith(type)) aviso(p, `Content-Type ${ct} (esperado ${type})`);
  }

  // Imagens de compartilhamento.
  for (const image of seen.images) {
    const res = await get(image.replace(SITE, BASE), { redirect: 'follow' });
    const ct = res.headers.get('content-type') || '';
    if (res.status !== 200 || !ct.startsWith('image/')) erro(image, `og:image responde HTTP ${res.status} ${ct}`);
  }

  // Cabeçalhos de segurança e de cache (só informam: dependem do vhost da VM).
  const home = await get(`${BASE}/`);
  const missingHeaders = SECURITY_HEADERS.filter((h) => !home.headers.get(h));
  info('/', `cabeçalhos de segurança presentes: ${SECURITY_HEADERS.filter((h) => home.headers.get(h)).join(', ') || 'nenhum'}`);
  if (missingHeaders.length) aviso('/', `cabeçalhos de segurança ausentes: ${missingHeaders.join(', ')}`);
  info('/', `Cache-Control da página: ${home.headers.get('cache-control') || '(nenhum)'}; compressão: ${home.headers.get('content-encoding') || '(nenhuma)'}`);
  const script = (home.body.match(/src="(\/assets\/index-[^"]+\.js)"/) || [])[1];
  if (script) {
    const asset = await get(`${BASE}${script}`);
    info(script, `Cache-Control: ${asset.headers.get('cache-control') || '(nenhum)'}`);
  }
  const server = home.headers.get('server');
  if (server && /\d/.test(server)) aviso('/', `cabeçalho Server expõe versão: ${server}`);
}

function finish() {
  const order = { erro: 0, aviso: 1, info: 2 };
  findings.sort((a, b) => order[a.level] - order[b.level] || a.where.localeCompare(b.where));
  for (const f of findings) console.log(`${f.level.toUpperCase().padEnd(5)} ${f.where}: ${f.msg}`);
  const count = (level) => findings.filter((f) => f.level === level).length;
  console.log(`\nseo-audit: ${count('erro')} erro(s), ${count('aviso')} aviso(s)`);
  process.exitCode = count('erro') ? 1 : 0;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((err) => {
    console.error('seo-audit falhou:', err);
    process.exit(1);
  });
}
