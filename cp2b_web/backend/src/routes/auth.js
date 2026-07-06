import { Router } from 'express';
import { authEnabled, createToken, verifyPassword } from '../middleware/auth.js';

const router = Router();

// Naive in-memory throttle: after 5 failures from one IP, require a 15-minute wait.
const failures = new Map();
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const isLockedOut = (ip) => {
  const entry = failures.get(ip);
  return entry && entry.count >= MAX_FAILURES && Date.now() - entry.last < LOCKOUT_MS;
};

const recordFailure = (ip) => {
  const entry = failures.get(ip) || { count: 0, last: 0 };
  const stale = Date.now() - entry.last > LOCKOUT_MS;
  failures.set(ip, { count: stale ? 1 : entry.count + 1, last: Date.now() });
};

// Whether the admin UI must show a login screen
router.get('/status', (req, res) => {
  res.json({ required: authEnabled() });
});

router.post('/login', (req, res) => {
  if (!authEnabled()) {
    return res.status(400).json({ error: 'Authentication is not enabled on this server' });
  }

  const ip = req.ip || 'unknown';
  if (isLockedOut(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  }

  const { password } = req.body || {};
  if (!verifyPassword(password)) {
    recordFailure(ip);
    return res.status(401).json({ error: 'Incorrect password' });
  }

  failures.delete(ip);
  res.json(createToken());
});

export default router;
