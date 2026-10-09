import crypto from 'node:crypto';

/**
 * Stateless admin authentication with zero dependencies.
 *
 * Enabled by setting ADMIN_PASSWORD in the backend environment. When unset,
 * every request is allowed (local development / docker-compose), and
 * GET /api/auth/status reports { required: false } so the admin UI skips the
 * login screen. On the production VM, set ADMIN_PASSWORD in the systemd unit
 * or .env to require login.
 *
 * Tokens are `<expiresAtMs>.<hmac>` where the HMAC-SHA256 key is derived from
 * the password, so changing the password invalidates every issued token.
 */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const getPassword = () => process.env.ADMIN_PASSWORD || '';

export const authEnabled = () => getPassword().length > 0;

const hmac = (payload, password) =>
  crypto.createHmac('sha256', `cp2b-admin:${password}`).update(payload).digest('hex');

export function createToken(now = Date.now()) {
  const expiresAt = now + TOKEN_TTL_MS;
  const payload = String(expiresAt);
  return { token: `${payload}.${hmac(payload, getPassword())}`, expires_at: expiresAt };
}

export function verifyToken(token, now = Date.now()) {
  if (typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  if (!/^\d+$/.test(payload) || Number(payload) < now) return false;
  const expected = hmac(payload, getPassword());
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyPassword(candidate) {
  const password = getPassword();
  const a = Buffer.from(String(candidate ?? ''));
  const b = Buffer.from(password);
  // Compare a keyed digest of both sides so length differences don't leak.
  const da = crypto.createHash('sha256').update(a).digest();
  const db = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(da, db);
}

// Visitor-facing endpoints that must accept writes without a login.
// Exported so the rate limiter (index.js) can throttle exactly this same
// set — the only /api routes writable by an unauthenticated visitor.
//
// As inscrições do Fórum de 2026 (participantes, pedidos e cancelamento de
// meetup, foto do participante) saíram daqui junto com as páginas: o site não
// as usa mais, e abertas elas permitiam cancelar meetups alheios pelo id e
// subir arquivos sem login.
export const PUBLIC_WRITES = [
  { method: 'POST', pattern: /^\/contact\/?$/i },
  { method: 'POST', pattern: /^\/newsletter\/subscribe\/?$/i },
];

// Read endpoints that expose personal data or unpublished drafts and must
// require a login.
//
// Sem diferenciar maiúsculas: o Express casa rotas assim, e com a lista
// sensível a caixa /api/Contact passava pelo portão e entregava as mensagens.
// Cada uma dessas rotas também exige login na própria definição
// (requireAdmin), para não depender só desta lista.
const ADMIN_READS = [
  /^\/newsletter\/subscribers/i,
  /^\/contact\/?$/i,
  /^\/participants(\/|$)/i,
  /^\/meetup-requests\/(all|my)/i,
  /^\/(boletins|podcast|press-kit|partners)\/all/i,
  /^\/videos\/?$/i,
];

const hasValidToken = (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return token !== null && verifyToken(token);
};

// Sem ADMIN_PASSWORD o painel fica aberto, o que só serve em desenvolvimento.
// Em produção (NODE_ENV=production) ele fica trancado: um .env incompleto não
// pode deixar o site editável por qualquer um.
export const adminLocked = () => !authEnabled() && process.env.NODE_ENV === 'production';

const locked = (res) => res.status(503).json({ error: 'Admin locked: ADMIN_PASSWORD is not configured' });

/**
 * Gate mounted on /api. Auth routes themselves are mounted before this.
 */
export function adminGate(req, res, next) {
  if (!authEnabled() && !adminLocked()) return next();

  const path = req.path;
  const readMethod = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';

  if (readMethod && !ADMIN_READS.some((re) => re.test(path))) return next();
  if (!readMethod && PUBLIC_WRITES.some((w) => w.method === req.method && w.pattern.test(path))) {
    return next();
  }

  if (adminLocked()) return locked(res);
  if (hasValidToken(req)) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

/**
 * O pedido vem de quem pode editar o site: login válido, ou painel aberto em
 * desenvolvimento (sem ADMIN_PASSWORD e fora de produção).
 */
export const isAdminRequest = (req) => !adminLocked() && (!authEnabled() || hasValidToken(req));

/**
 * Para montar na própria rota: exige login sem depender de lista de caminhos.
 */
export function requireAdmin(req, res, next) {
  if (adminLocked()) return locked(res);
  if (isAdminRequest(req)) return next();
  return res.status(401).json({ error: 'Authentication required' });
}
