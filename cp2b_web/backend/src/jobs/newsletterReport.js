import pool from '../db/connection.js';
import { buildXlsx } from '../services/xlsx.js';
import { sendNewsletterReport } from '../services/email.js';
import { zonedParts, zonedIsoDate, zonedBrDate } from '../utils/zonedTime.js';

// Toda segunda-feira às 08h30 (Brasília), a lista completa de inscritos da
// newsletter vai em .xlsx para o e-mail do marketing.
//
// Roda dentro do próprio backend (um processo no pm2 da VM), sem crontab
// para configurar à mão. Duas garantias:
// - Uma vez por segunda: antes de enviar, a semana é reservada no banco
//   (scheduled_job_runs). Um restart do pm2 às 08h31, ou um segundo processo,
//   não manda de novo.
// - Sem perder a segunda: se o backend estava fora às 08h30, o envio sai assim
//   que ele voltar, ainda na segunda. Se o SMTP falhar, a reserva é desfeita e
//   ele tenta de novo a cada 30 minutos até o fim do dia.
// Não sai fora da segunda: um deploy na quinta não dispara relatório. Para
// testar, use "Enviar planilha agora" no painel (POST /api/newsletter/report).

export const REPORT_TIME_ZONE = 'America/Sao_Paulo';
export const REPORT_WEEKDAY = 1; // segunda-feira
export const REPORT_MINUTES = 8 * 60 + 30; // 08h30
const JOB_NAME = 'newsletter_weekly_report';
const DEFAULT_RECIPIENT = 'mrktcp2b@unicamp.br';
const CHECK_INTERVAL_MS = 60 * 1000;
const RETRY_AFTER_MS = 30 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const reportRecipient = () => process.env.NEWSLETTER_REPORT_TO?.trim() || DEFAULT_RECIPIENT;

/**
 * Só em produção: homologação e máquinas de desenvolvimento não mandam a
 * lista de teste para o marketing. NEWSLETTER_REPORT_ENABLED=false desliga.
 */
export const reportSchedulerEnabled = () =>
  process.env.NODE_ENV === 'production'
  && process.env.NEWSLETTER_REPORT_ENABLED !== 'false'
  && Boolean(process.env.DATABASE_URL);

/**
 * O envio desta semana já deveria ter saído? `period` identifica a semana
 * (a data da segunda, em Brasília).
 */
export function reportSlot(now) {
  const p = zonedParts(now, REPORT_TIME_ZONE);
  const minutes = p.hour * 60 + p.minute;
  return {
    due: p.weekday === REPORT_WEEKDAY && minutes >= REPORT_MINUTES,
    period: zonedIsoDate(now, REPORT_TIME_ZONE),
  };
}

const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Monta o e-mail e a planilha a partir das linhas de newsletter_subscribers.
 */
export function buildReport(subscribers, now) {
  const weekAgo = now.getTime() - WEEK_MS;
  const active = subscribers.filter((s) => s.active);
  const counts = {
    total: subscribers.length,
    active: active.length,
    inactive: subscribers.length - active.length,
    newThisWeek: active.filter((s) => s.subscribed_at && new Date(s.subscribed_at).getTime() >= weekAgo).length,
  };

  const content = buildXlsx({
    sheetName: 'Inscritos',
    timeZone: REPORT_TIME_ZONE,
    columns: [
      { header: 'Nome', width: 32 },
      { header: 'E-mail', width: 38 },
      { header: 'Situação', width: 16 },
      { header: 'Inscrição em', width: 18 },
    ],
    rows: subscribers.map((s) => [
      s.name || '',
      s.email,
      s.active ? 'Ativo' : 'Descadastrado',
      s.subscribed_at ? new Date(s.subscribed_at) : null,
    ]),
  });

  const dateBr = zonedBrDate(now, REPORT_TIME_ZONE);
  const filename = `newsletter-cp2b-inscritos-${zonedIsoDate(now, REPORT_TIME_ZONE)}.xlsx`;
  const subject = `Newsletter CP2b — inscritos em ${dateBr}`;

  const text = [
    'Olá,',
    '',
    `Segue em anexo a lista completa de inscritos na newsletter do site do CP2b, atualizada em ${dateBr}.`,
    '',
    `- Ativos: ${counts.active}`,
    `- Novos nos últimos 7 dias: ${counts.newThisWeek}`,
    `- Descadastrados: ${counts.inactive}`,
    '',
    'Envio automático semanal (segundas, 08h30).',
  ].join('\n');

  const html = `
    <p>Olá,</p>
    <p>Segue em anexo a lista completa de inscritos na newsletter do site do CP2b, atualizada em <strong>${esc(dateBr)}</strong>.</p>
    <ul>
      <li><strong>Ativos:</strong> ${counts.active}</li>
      <li><strong>Novos nos últimos 7 dias:</strong> ${counts.newThisWeek}</li>
      <li><strong>Descadastrados:</strong> ${counts.inactive}</li>
    </ul>
    <p style="color:#888;font-size:12px">Envio automático semanal (segundas, 08h30).</p>
  `;

  return { subject, text, html, attachment: { filename, content }, counts };
}

/**
 * Lê os inscritos e envia o relatório agora. Usado pelo agendador e pelo
 * botão do painel.
 */
export async function sendWeeklyReport({ db = pool, send = sendNewsletterReport, now = new Date() } = {}) {
  const { rows } = await db.query(
    `SELECT name, email, active, subscribed_at
       FROM newsletter_subscribers
      ORDER BY active DESC, subscribed_at DESC`
  );
  const report = buildReport(rows, now);
  const to = reportRecipient();
  await send({
    to,
    subject: report.subject,
    html: report.html,
    text: report.text,
    attachments: [{
      filename: report.attachment.filename,
      content: report.attachment.content,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }],
  });
  return { to, counts: report.counts, filename: report.attachment.filename };
}

// Reserva a semana: só uma chamada por `period` recebe true.
async function claimPeriod(db, period) {
  const result = await db.query(
    `INSERT INTO scheduled_job_runs (job, period) VALUES ($1, $2)
     ON CONFLICT (job) DO UPDATE SET period = EXCLUDED.period, ran_at = NOW()
       WHERE scheduled_job_runs.period <> EXCLUDED.period
     RETURNING job`,
    [JOB_NAME, period]
  );
  return result.rowCount > 0;
}

async function releasePeriod(db, period) {
  await db.query('DELETE FROM scheduled_job_runs WHERE job = $1 AND period = $2', [JOB_NAME, period]);
}

/**
 * Agendador sem timer próprio: `tick()` decide se é hora e envia. Separado
 * de startNewsletterReportScheduler para os testes controlarem o relógio.
 */
export function createReportScheduler({
  db = pool,
  send = sendNewsletterReport,
  now = () => new Date(),
  logger = console,
} = {}) {
  let sentPeriod = null;
  let retryAt = 0;
  let running = false;

  async function tick() {
    if (running) return;
    const current = now();
    const { due, period } = reportSlot(current);
    if (!due || sentPeriod === period || current.getTime() < retryAt) return;

    running = true;
    let claimed = false;
    try {
      claimed = await claimPeriod(db, period);
      if (!claimed) {
        // Já enviado nesta segunda (antes de um restart, ou por outro processo).
        sentPeriod = period;
        return;
      }
      const result = await sendWeeklyReport({ db, send, now: current });
      sentPeriod = period;
      logger.log(`📧 Relatório semanal da newsletter enviado para ${result.to} (${result.counts.total} inscritos).`);
    } catch (error) {
      if (claimed) await releasePeriod(db, period).catch(() => {});
      retryAt = current.getTime() + RETRY_AFTER_MS;
      logger.error('❌ Falha no relatório semanal da newsletter; nova tentativa em 30 min:', error.message);
    } finally {
      running = false;
    }
  }

  return { tick };
}

export function startNewsletterReportScheduler(options) {
  if (!reportSchedulerEnabled()) {
    console.log('📧 Relatório semanal da newsletter: desligado (só roda com NODE_ENV=production).');
    return null;
  }
  const scheduler = createReportScheduler(options);
  const timer = setInterval(() => scheduler.tick(), CHECK_INTERVAL_MS);
  timer.unref();
  scheduler.tick();
  console.log(`📧 Relatório semanal da newsletter: segundas às 08h30 (Brasília) para ${reportRecipient()}.`);
  return { stop: () => clearInterval(timer), tick: scheduler.tick };
}
