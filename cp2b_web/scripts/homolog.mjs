/**
 * Homologação local, no Docker Desktop: gera o build de produção lendo a API
 * do backend local (como o deploy.sh faz na VM) e serve o dist/ por Apache
 * com o mesmo .htaccess da produção.
 *
 *   node scripts/homolog.mjs up     build + Apache em http://localhost:8080
 *   node scripts/homolog.mjs down   derruba só o Apache de homologação
 *
 * Precisa do backend do docker-compose.yml no ar (docker-compose up dev).
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compose = ['compose', '-f', 'docker-compose.yml', '-f', 'docker-compose.homolog.yml'];
const port = process.env.HOMOLOG_PORT || '8080';

const run = (cmd, args, env = {}) => {
  const res = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...env } });
  if (res.status !== 0) process.exit(res.status ?? 1);
};

const action = process.argv[2] || 'up';

if (action === 'down') {
  run('docker', [...compose, 'rm', '-sf', 'homolog']);
} else if (action === 'up') {
  const api = process.env.SEO_API_URL || `http://localhost:${process.env.BACKEND_PORT || '3001'}/api`;
  console.log(`homolog: build lendo a API em ${api}`);
  run('npm', ['run', 'build'], { SEO_API_URL: api });
  run('docker', [...compose, 'up', '-d', 'homolog']);
  console.log(`homolog: no ar em http://localhost:${port}`);
  console.log(`homolog: auditoria com  node scripts/seo-audit.mjs --url http://localhost:${port}`);
} else {
  console.error(`uso: node scripts/homolog.mjs [up|down]`);
  process.exit(2);
}
