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
const PUBLIC_WRITES = [
  { method: 'POST', pattern: /^\/contact\/?$/ },
  { method: 'POST', pattern: /^\/newsletter\/subscribe\/?$/ },
  { method: 'POST', pattern: /^\/participants\/?$/ },
  { method: 'POST', pattern: /^\/meetup-requests\/?$/ },
  { method: 'PUT', pattern: /^\/meetup-requests\/[^/]+\/cancel\/?$/ },
  { method: 'POST', pattern: /^\/upload\/image\/?$/ }, // participant photo on public registration
];

// Read endpoints that expose personal data and must require a login.
const ADMIN_READS = [
  /^\/newsletter\/subscribers/,
  /^\/contact\/?$/,
  /^\/participants\/?$/,
  /^\/meetup-requests\/all/,
];

const hasValidToken = (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return token !== null && verifyToken(token);
};

/**
 * Gate mounted on /api. Auth routes themselves are mounted before this.
 */
export function adminGate(req, res, next) {
  if (!authEnabled()) return next();

  const path = req.path;
  const readMethod = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';

  if (readMethod && !ADMIN_READS.some((re) => re.test(path))) return next();
  if (!readMethod && PUBLIC_WRITES.some((w) => w.method === req.method && w.pattern.test(path))) {
    return next();
  }

  if (hasValidToken(req)) return next();
  return res.status(401).json({ error: 'Authentication required' });
}
