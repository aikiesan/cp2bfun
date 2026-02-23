import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || 'CP2b Forum Paulista <noreply@cp2b.org>';

export async function sendMeetupInvitation(inviteeEmail, inviteeName, requesterName, slot, tableNumber, confirmLink) {
  const subject = `Convite de reunião — Forum Paulista CP2b`;
  const html = `
    <p>Olá, <strong>${inviteeName}</strong>!</p>
    <p><strong>${requesterName}</strong> quer se encontrar com você no Forum Paulista CP2b.</p>
    <ul>
      <li><strong>Horário:</strong> ${slot.label}</li>
      <li><strong>Mesa:</strong> ${tableNumber}</li>
    </ul>
    <p>Para confirmar, clique no link abaixo:</p>
    <p><a href="${confirmLink}">${confirmLink}</a></p>
    <p>Caso não reconheça este convite, ignore este e-mail.</p>
    <hr/>
    <p style="color:#888;font-size:12px">Forum Paulista — CP2b</p>
  `;
  await transporter.sendMail({ from: FROM, to: inviteeEmail, subject, html });
}

export async function sendMeetupConfirmation(toEmail, toName, otherName, slot, tableNumber) {
  const subject = `Reunião confirmada — Forum Paulista CP2b`;
  const html = `
    <p>Olá, <strong>${toName}</strong>!</p>
    <p>Sua reunião com <strong>${otherName}</strong> foi confirmada.</p>
    <ul>
      <li><strong>Horário:</strong> ${slot.label}</li>
      <li><strong>Mesa:</strong> ${tableNumber}</li>
    </ul>
    <p>Até lá!</p>
    <hr/>
    <p style="color:#888;font-size:12px">Forum Paulista — CP2b</p>
  `;
  await transporter.sendMail({ from: FROM, to: toEmail, subject, html });
}

export async function sendWelcomeEmail(toEmail, toName) {
  const subject = `Cadastro confirmado — Forum Paulista CP2b`;
  const html = `
    <p>Olá, <strong>${toName}</strong>!</p>
    <p>Seu cadastro no Forum Paulista CP2b foi realizado com sucesso.</p>
    <p>Em breve você receberá mais informações sobre o evento.</p>
    <hr/>
    <p style="color:#888;font-size:12px">Forum Paulista — CP2b</p>
  `;
  await transporter.sendMail({ from: FROM, to: toEmail, subject, html });
}
