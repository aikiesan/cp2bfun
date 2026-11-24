import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Depois que o painel publica, edita ou apaga uma notícia (ou artigo do
// Microscópio, oportunidade, entrevista, evento), roda de novo o
// scripts/generate-seo.mjs sobre o dist/ já publicado: sitemap.xml, as páginas
// pré-renderizadas dos itens e as listas das páginas estáticas passam a
// refletir o banco sem esperar o próximo deploy.
//
// Só roda onde há um build de produção (dist/_spa.html existe): no Docker de
// desenvolvimento e nos testes, nada acontece. SEO_REGEN=0 desliga.

const WEB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export const SEO_REGEN_PATHS = ['/api/news', '/api/microscopio', '/api/opportunities', '/api/projects', '/api/events'];

export function createSeoRegen({
  webDir = WEB_DIR,
  apiUrl = `http://127.0.0.1:${process.env.PORT || 3001}/api`,
  delayMs = 15000,
  enabled = process.env.SEO_REGEN !== '0',
  spawnFn = spawn,
  exists = existsSync,
  log = console.log,
} = {}) {
  let timer = null;
  let running = false;
  let pending = false;

  const run = () => {
    timer = null;
    if (running) {
      // Uma publicação no meio de uma rodada: roda de novo quando ela acabar.
      pending = true;
      return;
    }
    running = true;
    pending = false;
    const child = spawnFn(process.execPath, ['scripts/generate-seo.mjs'], {
      cwd: webDir,
      env: { ...process.env, SEO_API_URL: apiUrl },
      stdio: 'ignore',
    });
    const done = (code) => {
      running = false;
      log(`seo-regen: generate-seo terminou (código ${code})`);
      if (pending) schedule();
    };
    child.on('exit', done);
    child.on('error', (err) => {
      log(`seo-regen: falhou ao iniciar o generate-seo: ${err.message}`);
      done(-1);
    });
  };

  // Várias gravações seguidas (o painel salva e depois reordena, por exemplo)
  // viram uma rodada só.
  function schedule() {
    if (!enabled || !exists(path.join(webDir, 'dist', '_spa.html'))) return false;
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, delayMs);
    if (typeof timer.unref === 'function') timer.unref();
    return true;
  }

  // Middleware: agenda depois de uma escrita bem-sucedida nas rotas acima.
  function middleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      res.on('finish', () => {
        if (res.statusCode < 400) schedule();
      });
    }
    next();
  }

  return { schedule, middleware };
}
