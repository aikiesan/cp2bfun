-- Migration 053: controle das tarefas agendadas do backend.
--
-- Uma linha por tarefa, com o período (ex.: a data da segunda-feira) do
-- último envio reservado. O relatório semanal da newsletter
-- (src/jobs/newsletterReport.js) reserva a semana aqui antes de enviar, para
-- um restart do pm2 ou um segundo processo não mandar o e-mail duas vezes.
-- Idempotente.

CREATE TABLE IF NOT EXISTS scheduled_job_runs (
  job     VARCHAR(100) PRIMARY KEY,
  period  VARCHAR(40)  NOT NULL,
  ran_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
