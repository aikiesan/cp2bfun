// Monta e envia o e-mail mensal das estatísticas. Chamado por
// stats-monthly.sh, que prepara o relatório e os anexos e passa tudo por
// variáveis de ambiente: MES, TO, BACKEND, RELATORIO, ANEXOS (caminhos
// separados por ":") e DRY (1 = só monta e mostra, sem enviar).
//
// Usa o nodemailer e o .env do backend, sem dependência própria.
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { basename } from 'path';

const { MES, TO, BACKEND, RELATORIO, ANEXOS = '', DRY } = process.env;
const require = createRequire(`${BACKEND}/package.json`);
require('dotenv').config({ path: `${BACKEND}/.env` });
const nodemailer = require('nodemailer');

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const [ano, mes] = MES.split('-');
const nomeMes = `${MESES[Number(mes) - 1]} de ${ano}`;

const relatorio = readFileSync(RELATORIO, 'utf8');
const anexos = ANEXOS.split(':').filter(Boolean).map((p) => ({ filename: basename(p), path: p }));
const to = TO.split(',').map((s) => s.trim()).filter(Boolean);

// O remetente é o endereço do SMTP_FROM; o SMTP_USER pode ser só o login do
// serviço de envio (no Brevo, algo como xxx@smtp-brevo.com).
const enderecoFrom = (process.env.SMTP_FROM || '').replace(/.*</, '').replace(/>.*/, '').trim();
const from = `Site CP2b <${enderecoFrom}>`;
const subject = `Estatísticas do site do CP2b - ${nomeMes}`;

const intro = [
  `Relatório de visitas do site do CP2b (cp2b.unicamp.br) em ${nomeMes}.`,
  '',
  'Em anexo:',
  `- cp2b-estatisticas-${MES}.csv: uma linha por página e por dia do mês;`,
  '- cp2b-estatisticas-historico.csv: todos os dias desde o começo da contagem.',
  'Os dois abrem no Google Sheets ou no Excel. Guardar este e-mail é a cópia de',
  'segurança das estatísticas fora do servidor.',
  '',
  'Só contagens: nenhum endereço IP ou dado de quem visita.',
].join('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = `${intro}\n\n${relatorio}\n-- \nSite do CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos\n`;
const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1f2d33;max-width:760px">
  <p style="font-size:16px;font-weight:bold;margin:0 0 12px">Estatísticas do site do CP2b - ${esc(nomeMes)}</p>
  <p style="white-space:pre-line;margin:0 0 16px">${esc(intro)}</p>
  <pre style="font-family:Consolas,Menlo,monospace;font-size:12px;line-height:1.4;background:#f4f7f8;border:1px solid #dde3e5;border-radius:6px;padding:12px;overflow-x:auto">${esc(relatorio)}</pre>
  <hr style="border:none;border-top:1px solid #dde3e5;margin:20px 0 8px">
  <p style="color:#6b7b80;font-size:12px;margin:0">Site do CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos</p>
</div>`;

const mensagem = { from, to, subject, text, html, attachments: anexos };

console.log(`De:      ${from}`);
console.log(`Para:    ${to.join(', ')}`);
console.log(`Assunto: ${subject}`);
console.log(`Anexos:  ${anexos.map((a) => a.filename).join(', ')}`);

if (DRY === '1') {
  // Monta a mensagem inteira (com os anexos) sem rede, para conferir.
  const info = await nodemailer.createTransport({ jsonTransport: true }).sendMail(mensagem);
  console.log(`\n${text}`);
  console.log(`(prévia: e-mail de ${Buffer.byteLength(info.message)} bytes montado, nada enviado)`);
  process.exit(0);
}

if (!enderecoFrom || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('SMTP_FROM, SMTP_USER ou SMTP_PASS ausente no backend/.env: nada enviado.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
const info = await transporter.sendMail(mensagem);
console.log(`${new Date().toISOString()} estatísticas de ${MES} enviadas. Aceitos: ${info.accepted.join(', ')}${info.rejected.length ? ` | recusados: ${info.rejected.join(', ')}` : ''}`);
