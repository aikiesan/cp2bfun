import test from 'node:test';
import assert from 'node:assert/strict';
import { authEnabled, createToken, verifyToken, verifyPassword, adminGate, requireAdmin, adminLocked } from './auth.js';

const withPassword = (password, fn) => {
  const prev = process.env.ADMIN_PASSWORD;
  if (password === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = password;
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = prev;
  }
};

const mockReqRes = ({ method = 'GET', path = '/news', token = null } = {}) => {
  const req = {
    method,
    path,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };
  return { req, res, next, wasAllowed: () => nextCalled };
};

test('authEnabled reflects ADMIN_PASSWORD', () => {
  withPassword(undefined, () => assert.equal(authEnabled(), false));
  withPassword('test-password-123', () => assert.equal(authEnabled(), true));
});

test('createToken/verifyToken round-trip', () => {
  withPassword('test-password-123', () => {
    const { token, expires_at } = createToken();
    assert.ok(expires_at > Date.now());
    assert.equal(verifyToken(token), true);
  });
});

test('verifyToken rejects expired tokens', () => {
  withPassword('test-password-123', () => {
    const past = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const { token } = createToken(past);
    assert.equal(verifyToken(token), false);
  });
});

test('verifyToken rejects tampered payloads and garbage', () => {
  withPassword('test-password-123', () => {
    const { token } = createToken();
    const [payload, sig] = token.split('.');
    const farFuture = String(Number(payload) + 1000000);
    assert.equal(verifyToken(`${farFuture}.${sig}`), false);
    assert.equal(verifyToken('not-a-token'), false);
    assert.equal(verifyToken(''), false);
    assert.equal(verifyToken(null), false);
  });
});

test('tokens become invalid when the password changes', () => {
  const { token } = withPassword('test-old-password', () => createToken());
  withPassword('test-new-password', () => {
    assert.equal(verifyToken(token), false);
  });
});

test('verifyPassword compares safely', () => {
  withPassword('test-password-123', () => {
    assert.equal(verifyPassword('test-password-123'), true);
    assert.equal(verifyPassword('wrong'), false);
    assert.equal(verifyPassword(''), false);
    assert.equal(verifyPassword(undefined), false);
  });
});

test('adminGate allows everything when auth is disabled', () => {
  withPassword(undefined, () => {
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'DELETE', path: '/news/1' });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), true);
  });
});

test('adminGate allows public reads without a token', () => {
  withPassword('test-password-123', () => {
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'GET', path: '/news' });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), true);
  });
});

test('adminGate blocks writes without a token', () => {
  withPassword('test-password-123', () => {
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path: '/news' });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), false);
    assert.equal(res.statusCode, 401);
  });
});

test('adminGate allows writes with a valid token', () => {
  withPassword('test-password-123', () => {
    const { token } = createToken();
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path: '/news', token });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), true);
  });
});

test('adminGate keeps only the contact form and the newsletter signup open to visitors', () => {
  withPassword('test-password-123', () => {
    for (const path of ['/contact', '/newsletter/subscribe', '/Contact', '/newsletter/Subscribe/']) {
      const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), true, `expected POST ${path} to be public`);
    }
    // Inscrições do Fórum de 2026, encerrado: agora exigem login.
    for (const [method, path] of [['POST', '/participants'], ['POST', '/meetup-requests'], ['POST', '/upload/image'], ['PUT', '/meetup-requests/42/cancel']]) {
      const { req, res, next, wasAllowed } = mockReqRes({ method, path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), false, `expected ${method} ${path} to require auth`);
      assert.equal(res.statusCode, 401);
    }
  });
});

test('adminGate protects personal-data and draft reads, whatever the letter case', () => {
  withPassword('test-password-123', () => {
    const paths = [
      '/newsletter/subscribers', '/contact', '/participants', '/participants/search', '/meetup-requests/all', '/meetup-requests/my',
      '/boletins/all', '/podcast/all', '/press-kit/all', '/videos',
      // O Express casa rotas sem diferenciar maiúsculas; o portão também não pode.
      '/Contact', '/CONTACT/', '/Participants', '/newsletter/Subscribers', '/meetup-requests/ALL', '/Boletins/All',
    ];
    for (const path of paths) {
      const { req, res, next, wasAllowed } = mockReqRes({ method: 'GET', path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), false, `expected GET ${path} to require auth`);
      assert.equal(res.statusCode, 401);
    }
    // O que o site público lê continua aberto.
    for (const path of ['/news', '/boletins', '/podcast', '/press-kit', '/videos/featured', '/meetup-requests/confirm', '/page-settings']) {
      const { req, res, next, wasAllowed } = mockReqRes({ method: 'GET', path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), true, `expected GET ${path} to stay public`);
    }
  });
});

test('requireAdmin guards a route on its own, without a path list', () => {
  withPassword('test-password-123', () => {
    const anon = mockReqRes({ method: 'GET', path: '/qualquer-coisa' });
    requireAdmin(anon.req, anon.res, anon.next);
    assert.equal(anon.wasAllowed(), false);
    assert.equal(anon.res.statusCode, 401);

    const { token } = createToken();
    const admin = mockReqRes({ method: 'GET', path: '/qualquer-coisa', token });
    requireAdmin(admin.req, admin.res, admin.next);
    assert.equal(admin.wasAllowed(), true);
  });
  withPassword(undefined, () => {
    const dev = mockReqRes({ method: 'GET', path: '/qualquer-coisa' });
    requireAdmin(dev.req, dev.res, dev.next);
    assert.equal(dev.wasAllowed(), true, 'without a password (development) the admin stays open');
  });
});

test('without ADMIN_PASSWORD in production the admin is locked, not open', () => {
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    withPassword(undefined, () => {
      assert.equal(adminLocked(), true);
      const write = mockReqRes({ method: 'DELETE', path: '/news/1' });
      adminGate(write.req, write.res, write.next);
      assert.equal(write.wasAllowed(), false);
      assert.equal(write.res.statusCode, 503);

      const read = mockReqRes({ method: 'GET', path: '/contact' });
      requireAdmin(read.req, read.res, read.next);
      assert.equal(read.wasAllowed(), false);
      assert.equal(read.res.statusCode, 503);

      // O site público segue no ar.
      const visitor = mockReqRes({ method: 'GET', path: '/news' });
      adminGate(visitor.req, visitor.res, visitor.next);
      assert.equal(visitor.wasAllowed(), true);
    });
    withPassword('test-password-123', () => assert.equal(adminLocked(), false));
  } finally {
    if (prevEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevEnv;
  }
});
