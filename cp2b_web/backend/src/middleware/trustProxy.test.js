import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { applyTrustProxy, trustProxySetting } from './trustProxy.js';

// Os testes sem valor explícito leem o ambiente: que ele não decida por eles.
delete process.env.TRUST_PROXY;

// Sobe um app de verdade em 127.0.0.1 (o "Apache" da VM, portanto loopback) e
// devolve o req.ip que o Express calcula para um X-Forwarded-For.
async function ipFor(trust, forwardedFor) {
  const app = express();
  applyTrustProxy(app, trust);
  app.get('/', (req, res) => res.send(req.ip));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/`, {
      headers: forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {},
    });
    return await res.text();
  } finally {
    server.close();
  }
}

const PROXY = '203.0.113.7'; // o proxy da Unicamp, no exemplo
const VISITANTE = '198.51.100.20';

test('sem TRUST_PROXY, confia só no loopback', () => {
  assert.deepEqual(trustProxySetting(undefined), ['loopback']);
  assert.deepEqual(trustProxySetting(''), ['loopback']);
  assert.deepEqual(trustProxySetting(` loopback , ${PROXY} ,`), ['loopback', PROXY]);
});

test('só com loopback, o req.ip é o do proxy (um balde para todos)', async () => {
  assert.equal(await ipFor(undefined, `${VISITANTE}, ${PROXY}`), PROXY);
});

test('com o proxy da Unicamp na lista, cada visitante tem o seu IP', async () => {
  assert.equal(await ipFor(`loopback,${PROXY}`, `${VISITANTE}, ${PROXY}`), VISITANTE);
});

test('um X-Forwarded-For forjado pelo visitante não muda o IP dele', async () => {
  assert.equal(await ipFor(`loopback,${PROXY}`, `10.9.9.9, ${VISITANTE}, ${PROXY}`), VISITANTE);
});

test('valor inválido não derruba o backend: fica o loopback', async () => {
  const original = console.error;
  console.error = () => {};
  try {
    const app = express();
    applyTrustProxy(app, 'proxy.unicamp.br');
    assert.deepEqual(app.get('trust proxy'), ['loopback']);
  } finally {
    console.error = original;
  }
});
