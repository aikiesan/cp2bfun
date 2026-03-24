import { Router } from 'express';
import pool from '../db/connection.js';
import { sendNewsletterConfirmation, sendNewsletterBroadcast } from '../services/email.js';

const router = Router();

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// POST /api/newsletter/subscribe — public
router.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (email, name)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET active = TRUE
       RETURNING *`,
      [email.trim().toLowerCase(), name?.trim() || null]
    );

    const subscriber = result.rows[0];
    const unsubscribeLink = `${BASE_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`;

    sendNewsletterConfirmation(subscriber.email, subscriber.name, unsubscribeLink).catch(err =>
      console.error('Newsletter confirmation email failed:', err.message)
    );

    res.status(201).json({ message: 'Inscrição realizada com sucesso!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Erro ao realizar inscrição.' });
  }
});

// GET /api/newsletter/unsubscribe?token=XXX — public
router.get('/unsubscribe', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<p>Token inválido.</p>');
  }

  try {
    const result = await pool.query(
      `UPDATE newsletter_subscribers SET active = FALSE WHERE unsubscribe_token = $1 RETURNING email`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('<p>Token não encontrado.</p>');
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="pt">
      <head><meta charset="UTF-8"><title>Descadastro — CP2b</title>
      <style>body{font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#333}
      h2{color:#004d61}</style></head>
      <body>
        <h2>Descadastro realizado</h2>
        <p>O e-mail <strong>${result.rows[0].email}</strong> foi removido da lista de newsletter do CP2b.</p>
        <p><a href="/">Voltar ao site</a></p>
      </body></html>
    `);
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).send('<p>Erro ao processar descadastro.</p>');
  }
});

// GET /api/newsletter/subscribers — admin
router.get('/subscribers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, subscribed_at, active FROM newsletter_subscribers ORDER BY subscribed_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Erro ao buscar inscritos.' });
  }
});

// POST /api/newsletter/send — admin
router.post('/send', async (req, res) => {
  const { subject, html } = req.body;

  if (!subject?.trim() || !html?.trim()) {
    return res.status(400).json({ error: 'Assunto e conteúdo são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `SELECT email, name, unsubscribe_token FROM newsletter_subscribers WHERE active = TRUE`
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'Nenhum inscrito ativo.', sent: 0 });
    }

    const BASE = process.env.FRONTEND_URL || 'http://localhost:5173';
    const subscribers = result.rows.map(s => ({
      ...s,
      unsubscribeLink: `${BASE}/api/newsletter/unsubscribe?token=${s.unsubscribe_token}`,
    }));

    await sendNewsletterBroadcast(subscribers, subject.trim(), html.trim());

    res.json({ message: 'Newsletter enviada com sucesso!', sent: subscribers.length });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ error: 'Erro ao enviar newsletter.' });
  }
});

// DELETE /api/newsletter/:id — admin
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Inscrito não encontrado.' });
    res.json({ message: 'Inscrito removido.' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'Erro ao remover inscrito.' });
  }
});

export default router;
