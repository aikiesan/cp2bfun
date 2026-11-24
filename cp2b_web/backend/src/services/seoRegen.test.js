import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createSeoRegen } from './seoRegen.js';

function fakeSpawn() {
  const calls = [];
  const fn = (cmd, args, opts) => {
    const child = new EventEmitter();
    calls.push({ cmd, args, opts, child });
    return child;
  };
  return { fn, calls };
}

test('sem build de produção (dist/_spa.html), não agenda nada', () => {
  const { fn, calls } = fakeSpawn();
  const regen = createSeoRegen({ spawnFn: fn, exists: () => false, delayMs: 0, enabled: true });
  assert.equal(regen.schedule(), false);
  assert.equal(calls.length, 0);
});

test('SEO_REGEN=0 desliga', () => {
  const { fn } = fakeSpawn();
  const regen = createSeoRegen({ spawnFn: fn, exists: () => true, enabled: false });
  assert.equal(regen.schedule(), false);
});

test('várias publicações seguidas viram uma rodada, com a API local', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { fn, calls } = fakeSpawn();
    const regen = createSeoRegen({
      spawnFn: fn, exists: () => true, enabled: true, delayMs: 1000,
      webDir: '/srv/web', apiUrl: 'http://127.0.0.1:3001/api', log: () => {},
    });
    regen.schedule();
    mock.timers.tick(500);
    regen.schedule();
    mock.timers.tick(999);
    assert.equal(calls.length, 0);
    mock.timers.tick(1);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].args, ['scripts/generate-seo.mjs']);
    assert.equal(calls[0].opts.cwd, '/srv/web');
    assert.equal(calls[0].opts.env.SEO_API_URL, 'http://127.0.0.1:3001/api');
  } finally {
    mock.timers.reset();
  }
});

test('publicação durante uma rodada gera outra quando ela termina', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { fn, calls } = fakeSpawn();
    const regen = createSeoRegen({ spawnFn: fn, exists: () => true, enabled: true, delayMs: 10, log: () => {} });
    regen.schedule();
    mock.timers.tick(10);
    assert.equal(calls.length, 1);
    regen.schedule();
    mock.timers.tick(10); // a primeira ainda roda: não dispara outra junto
    assert.equal(calls.length, 1);
    calls[0].child.emit('exit', 0);
    mock.timers.tick(10);
    assert.equal(calls.length, 2);
  } finally {
    mock.timers.reset();
  }
});

test('o middleware só agenda em escrita bem-sucedida', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { fn, calls } = fakeSpawn();
    const regen = createSeoRegen({ spawnFn: fn, exists: () => true, enabled: true, delayMs: 10, log: () => {} });
    const respond = (method, status) => {
      const res = new EventEmitter();
      res.statusCode = status;
      let nexted = false;
      regen.middleware({ method }, res, () => { nexted = true; });
      assert.equal(nexted, true);
      res.emit('finish');
      mock.timers.tick(10);
    };
    respond('GET', 200);
    respond('POST', 400);
    assert.equal(calls.length, 0);
    respond('PUT', 200);
    assert.equal(calls.length, 1);
  } finally {
    mock.timers.reset();
  }
});
