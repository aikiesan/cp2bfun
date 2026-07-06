import test from 'node:test';
import assert from 'node:assert/strict';
import { authEnabled, createToken, verifyToken, verifyPassword, adminGate } from './auth.js';

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
  withPassword('s3cret', () => assert.equal(authEnabled(), true));
});

test('createToken/verifyToken round-trip', () => {
  withPassword('s3cret', () => {
    const { token, expires_at } = createToken();
    assert.ok(expires_at > Date.now());
    assert.equal(verifyToken(token), true);
  });
});

test('verifyToken rejects expired tokens', () => {
  withPassword('s3cret', () => {
    const past = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const { token } = createToken(past);
    assert.equal(verifyToken(token), false);
  });
});

test('verifyToken rejects tampered payloads and garbage', () => {
  withPassword('s3cret', () => {
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
  const { token } = withPassword('old-password', () => createToken());
  withPassword('new-password', () => {
    assert.equal(verifyToken(token), false);
  });
});

test('verifyPassword compares safely', () => {
  withPassword('s3cret', () => {
    assert.equal(verifyPassword('s3cret'), true);
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
  withPassword('s3cret', () => {
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'GET', path: '/news' });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), true);
  });
});

test('adminGate blocks writes without a token', () => {
  withPassword('s3cret', () => {
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path: '/news' });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), false);
    assert.equal(res.statusCode, 401);
  });
});

test('adminGate allows writes with a valid token', () => {
  withPassword('s3cret', () => {
    const { token } = createToken();
    const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path: '/news', token });
    adminGate(req, res, next);
    assert.equal(wasAllowed(), true);
  });
});

test('adminGate whitelists visitor-facing form posts', () => {
  withPassword('s3cret', () => {
    for (const path of ['/contact', '/newsletter/subscribe', '/participants', '/meetup-requests', '/upload/image']) {
      const { req, res, next, wasAllowed } = mockReqRes({ method: 'POST', path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), true, `expected POST ${path} to be public`);
    }
    const cancel = mockReqRes({ method: 'PUT', path: '/meetup-requests/42/cancel' });
    adminGate(cancel.req, cancel.res, cancel.next);
    assert.equal(cancel.wasAllowed(), true);
  });
});

test('adminGate protects personal-data reads', () => {
  withPassword('s3cret', () => {
    for (const path of ['/newsletter/subscribers', '/contact', '/participants', '/meetup-requests/all']) {
      const { req, res, next, wasAllowed } = mockReqRes({ method: 'GET', path });
      adminGate(req, res, next);
      assert.equal(wasAllowed(), false, `expected GET ${path} to require auth`);
      assert.equal(res.statusCode, 401);
    }
    // ...but the public participant search stays open (used by the meetup agenda)
    const search = mockReqRes({ method: 'GET', path: '/participants/search' });
    adminGate(search.req, search.res, search.next);
    assert.equal(search.wasAllowed(), true);
  });
});
