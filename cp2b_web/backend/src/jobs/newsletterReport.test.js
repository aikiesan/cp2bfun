import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reportSlot,
  buildReport,
  sendWeeklyReport,
  createReportScheduler,
  reportSchedulerEnabled,
  reportRecipient,
} from './newsletterReport.js';

// 05/10/2026 é segunda-feira. Brasília = UTC-3.
const MON_0829 = new Date('2026-10-05T11:29:00Z');
const MON_0830 = new Date('2026-10-05T11:30:00Z');
const MON_2359 = new Date('2026-10-06T02:59:00Z');
const TUE_0000 = new Date('2026-10-06T03:00:00Z');
const NEXT_MON_0830 = new Date('2026-10-12T11:30:00Z');

const SUBSCRIBERS = [
  { name: 'Ana', email: 'ana@exemplo.com', active: true, subscribed_at: new Date('2026-10-03T12:00:00Z') },
  { name: null, email: 'beto@exemplo.com', active: true, subscribed_at: new Date('2026-08-01T12:00:00Z') },
  { name: 'Caio', email: 'caio@exemplo.com', active: false, subscribed_at: new Date('2026-09-01T12:00:00Z') },
];

// Banco falso: inscritos fixos e a tabela scheduled_job_runs em memória,
// com a mesma regra do upsert de claimPeriod.
function fakeDb() {
  const runs = new Map();
  return {
    runs,
    async query(sql, params = []) {
      if (/FROM newsletter_subscribers/.test(sql)) return { rows: SUBSCRIBERS, rowCount: SUBSCRIBERS.length };
      if (/^\s*INSERT INTO scheduled_job_runs/.test(sql)) {
        const [job, period] = params;
        if (runs.get(job) === period) return { rows: [], rowCount: 0 };
        runs.set(job, period);
        return { rows: [{ job }], rowCount: 1 };
      }
      if (/^\s*DELETE FROM scheduled_job_runs/.test(sql)) {
        const [job, period] = params;
        if (runs.get(job) === period) runs.delete(job);
        return { rows: [], rowCount: 1 };
      }
      throw new Error(`SQL inesperado: ${sql}`);
    },
  };
}

const silent = { log() {}, error() {} };

function clock(start) {
  let current = start;
  return { now: () => current, set: (d) => { current = d; } };
}

test('o envio vence às 08h30 de segunda (Brasília), e só na segunda', () => {
  assert.equal(reportSlot(MON_0829).due, false);
  assert.deepEqual(reportSlot(MON_0830), { due: true, period: '2026-10-05' });
  assert.deepEqual(reportSlot(MON_2359), { due: true, period: '2026-10-05' });
  assert.equal(reportSlot(TUE_0000).due, false);
  assert.equal(reportSlot(new Date('2026-10-02T11:30:00Z')).due, false); // sexta
});

test('o relatório traz contagens, assunto e a planilha', () => {
  const report = buildReport(SUBSCRIBERS, MON_0830);
  assert.deepEqual(report.counts, { total: 3, active: 2, inactive: 1, newThisWeek: 1 });
  assert.equal(report.subject, 'Newsletter CP2b — inscritos em 05/10/2026');
  assert.equal(report.attachment.filename, 'newsletter-cp2b-inscritos-2026-10-05.xlsx');
  assert.ok(Buffer.isBuffer(report.attachment.content));
  assert.match(report.text, /Ativos: 2/);
  assert.match(report.html, /Descadastrados:<\/strong> 1/);
});

test('sendWeeklyReport manda a planilha para o marketing', async () => {
  const sent = [];
  const result = await sendWeeklyReport({ db: fakeDb(), send: async (m) => sent.push(m), now: MON_0830 });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'mrktcp2b@unicamp.br');
  assert.equal(sent[0].attachments[0].filename, 'newsletter-cp2b-inscritos-2026-10-05.xlsx');
  assert.equal(result.counts.total, 3);
});

test('NEWSLETTER_REPORT_TO troca o destinatário', () => {
  const prev = process.env.NEWSLETTER_REPORT_TO;
  process.env.NEWSLETTER_REPORT_TO = 'outra@unicamp.br';
  try {
    assert.equal(reportRecipient(), 'outra@unicamp.br');
  } finally {
    if (prev === undefined) delete process.env.NEWSLETTER_REPORT_TO;
    else process.env.NEWSLETTER_REPORT_TO = prev;
  }
});

test('envia uma vez por segunda, mesmo com várias verificações', async () => {
  const db = fakeDb();
  const sent = [];
  const t = clock(MON_0829);
  const scheduler = createReportScheduler({ db, send: async (m) => sent.push(m), now: t.now, logger: silent });

  await scheduler.tick();
  assert.equal(sent.length, 0, 'antes das 08h30');

  t.set(MON_0830);
  await scheduler.tick();
  await scheduler.tick();
  t.set(MON_2359);
  await scheduler.tick();
  assert.equal(sent.length, 1);

  t.set(NEXT_MON_0830);
  await scheduler.tick();
  assert.equal(sent.length, 2, 'na segunda seguinte sai de novo');
});

test('um restart depois do envio não manda de novo', async () => {
  const db = fakeDb();
  const sent = [];
  const send = async (m) => sent.push(m);
  await createReportScheduler({ db, send, now: () => MON_0830, logger: silent }).tick();
  // Novo processo (pm2 restart), mesma segunda.
  await createReportScheduler({ db, send, now: () => new Date('2026-10-05T12:10:00Z'), logger: silent }).tick();
  assert.equal(sent.length, 1);
});

test('se o backend estava fora às 08h30, envia quando volta na segunda', async () => {
  const sent = [];
  await createReportScheduler({
    db: fakeDb(), send: async (m) => sent.push(m), now: () => new Date('2026-10-05T17:00:00Z'), logger: silent,
  }).tick();
  assert.equal(sent.length, 1);
});

test('fora da segunda (deploy na terça) não envia', async () => {
  const sent = [];
  await createReportScheduler({ db: fakeDb(), send: async (m) => sent.push(m), now: () => TUE_0000, logger: silent }).tick();
  assert.equal(sent.length, 0);
});

test('falha no SMTP desfaz a reserva e tenta de novo em 30 minutos', async () => {
  const db = fakeDb();
  let attempts = 0;
  let delivered = 0;
  const send = async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('SMTP fora do ar');
    delivered += 1;
  };
  const t = clock(MON_0830);
  const scheduler = createReportScheduler({ db, send, now: t.now, logger: silent });

  await scheduler.tick();
  assert.equal(attempts, 1);
  assert.equal(db.runs.size, 0, 'reserva desfeita');

  t.set(new Date('2026-10-05T11:45:00Z'));
  await scheduler.tick();
  assert.equal(attempts, 1, 'espera 30 minutos');

  t.set(new Date('2026-10-05T12:00:00Z'));
  await scheduler.tick();
  assert.equal(delivered, 1);
  assert.equal(db.runs.get('newsletter_weekly_report'), '2026-10-05');
});

test('só liga em produção, e pode ser desligado', () => {
  const keys = ['NODE_ENV', 'NEWSLETTER_REPORT_ENABLED', 'DATABASE_URL'];
  const prev = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  try {
    process.env.DATABASE_URL = 'postgres://localhost/cp2b';
    delete process.env.NEWSLETTER_REPORT_ENABLED;
    process.env.NODE_ENV = 'development';
    assert.equal(reportSchedulerEnabled(), false);
    process.env.NODE_ENV = 'production';
    assert.equal(reportSchedulerEnabled(), true);
    process.env.NEWSLETTER_REPORT_ENABLED = 'false';
    assert.equal(reportSchedulerEnabled(), false);
  } finally {
    for (const k of keys) {
      if (prev[k] === undefined) delete process.env[k];
      else process.env[k] = prev[k];
    }
  }
});
