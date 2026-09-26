/**
 * Lighthouse (celular) dentro do Docker, contra a homologação ou a produção.
 *
 *   node scripts/lighthouse.mjs                          homologação (npm run homolog)
 *   node scripts/lighthouse.mjs --url https://cp2b.unicamp.br
 *   node scripts/lighthouse.mjs --pages /,/sobre,/capacitacao
 *
 * Roda num contêiner, e não no navegador da máquina, de propósito: antivírus
 * com varredura de tráfego (o Kaspersky desta máquina, por exemplo) injetam
 * ~870 KB de script e CSS nas páginas HTTP e derrubam a nota de desempenho
 * com um peso que não é do site. Entre contêineres o tráfego não passa por eles.
 *
 * Relatórios HTML e JSON em reports/lighthouse/. Sai com código 1 se SEO
 * ficar abaixo de 100 ou acessibilidade abaixo de 90.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

// A homologação precisa estar no ar (npm run homolog); no contêiner ela
// responde pelo nome do serviço.
if (!opt('url')) {
  const r = spawnSync('docker', ['inspect', '--format', '{{.State.Running}}', 'cp2b_web-homolog-1'], { encoding: 'utf8' });
  if (r.status !== 0 || r.stdout.trim() !== 'true') {
    console.error('lighthouse: homologação fora do ar — rode npm run homolog antes (ou passe --url).');
    process.exit(1);
  }
}
const base = (opt('url') || 'http://homolog').replace(/\/$/, '');
const network = opt('network', 'cp2b_web_default');
const pages = opt('pages', '/,/sobre,/eixos,/solucoes,/capacitacao,/publicacoes,/equipe').split(',');
// No Git Bash, um argumento que começa com "/" vira caminho do Windows antes
// de chegar aqui ("/" vira "C:/Program Files/Git/"), e a URL sai quebrada.
const mangled = pages.filter((p) => !p.startsWith('/') || /^[A-Za-z]:/.test(p) || p.includes('Program Files'));
if (mangled.length) {
  console.error(`lighthouse: caminho inválido: ${mangled.join(', ')}. No Git Bash, rode com MSYS_NO_PATHCONV=1.`);
  process.exit(2);
}
const outDir = path.join(root, 'reports', 'lighthouse');
mkdirSync(outDir, { recursive: true });

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_'));
const quote = (s) => `'${s.replace(/'/g, `'\\''`)}'`;

// Um contêiner só para todas as páginas: o Chromium e o Lighthouse são
// instalados uma vez por execução.
const runs = pages.map((p) => [
  'lighthouse', quote(`${base}${p}`),
  '--quiet', '--chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage"',
  '--only-categories=performance,accessibility,best-practices,seo',
  '--output=json', '--output=html', `--output-path=/out/${slug(p)}`,
].join(' ')).join('\n');
// O roteiro vai num arquivo montado no contêiner, e não em "sh -c": assim as
// aspas das flags do Chrome não dependem das regras da linha de comando do
// Windows.
writeFileSync(path.join(outDir, 'run.sh'), [
  'set -e',
  'apk add --no-cache chromium >/dev/null',
  'npm install -g lighthouse@12 >/dev/null 2>&1',
  'export CHROME_PATH=/usr/bin/chromium-browser',
  runs,
  '',
].join('\n'));

console.log(`lighthouse: ${pages.length} página(s) em ${base} (rede ${network})`);
const res = spawnSync('docker', [
  'run', '--rm', '--network', network,
  '-v', `${outDir}:/out`,
  'node:20-alpine', 'sh', '/out/run.sh',
], { stdio: 'inherit' });
if (res.status !== 0) {
  console.error('lighthouse: a execução no Docker falhou');
  process.exit(res.status ?? 1);
}

let failed = false;
const pct = (v) => Math.round((v ?? 0) * 100);
console.log(`\n${'página'.padEnd(22)} perf  a11y  bp   seo   LCP      FCP      TBT      CLS`);
for (const p of pages) {
  const file = path.join(outDir, `${slug(p)}.report.json`);
  if (!existsSync(file)) {
    console.log(`${p.padEnd(22)} (sem relatório)`);
    failed = true;
    continue;
  }
  const { categories: c, audits: a } = JSON.parse(readFileSync(file, 'utf8'));
  const seo = pct(c.seo.score);
  const a11y = pct(c.accessibility.score);
  if (seo < 100 || a11y < 90) failed = true;
  const m = (k) => (a[k]?.displayValue || '-').padEnd(8);
  console.log(`${p.padEnd(22)} ${String(pct(c.performance.score)).padEnd(5)} ${String(a11y).padEnd(5)} ${String(pct(c['best-practices'].score)).padEnd(4)} ${String(seo).padEnd(5)} ${m('largest-contentful-paint')} ${m('first-contentful-paint')} ${m('total-blocking-time')} ${m('cumulative-layout-shift')}`);
  for (const cat of ['seo', 'accessibility', 'best-practices']) {
    for (const ref of c[cat].auditRefs) {
      const audit = a[ref.id];
      if (ref.weight > 0 && audit.score !== null && audit.score < 1) console.log(`   [${cat}] ${audit.title}`);
    }
  }
}
console.log(`\nlighthouse: relatórios em ${outDir}`);
process.exitCode = failed ? 1 : 0;
