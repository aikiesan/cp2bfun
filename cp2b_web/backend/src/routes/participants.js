import { Router } from 'express';
import pool from '../db/connection.js';
import { sendWelcomeEmail } from '../services/email.js';

const router = Router();

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// POST /api/participants — register a new participant
router.post('/', async (req, res) => {
  const { name, affiliation, email, mini_bio, photo_url, keywords, abstract } = req.body;

  if (!name?.trim() || !affiliation?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Nome, afiliação e e-mail são obrigatórios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  if (mini_bio && countWords(mini_bio) > 100) {
    return res.status(400).json({ error: 'Mini-bio deve ter no máximo 100 palavras.' });
  }

  const keywordsArray = keywords
    ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()).filter(Boolean))
    : [];

  try {
    const result = await pool.query(
      `INSERT INTO event_participants (name, affiliation, email, mini_bio, photo_url, keywords, abstract)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name.trim(), affiliation.trim(), email.trim().toLowerCase(), mini_bio || null, photo_url || null, keywordsArray, abstract || null]
    );

    // Send welcome email — fire and forget (don't fail registration on email error)
    sendWelcomeEmail(result.rows[0].email, result.rows[0].name).catch(err =>
      console.error('Welcome email failed:', err.message)
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    console.error('Error registering participant:', error);
    res.status(500).json({ error: 'Erro ao cadastrar participante.' });
  }
});

// GET /api/participants/search?q=query — search by name or email
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Busca deve ter ao menos 2 caracteres.' });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, affiliation, email, mini_bio, keywords
       FROM event_participants
       WHERE name ILIKE $1 OR email ILIKE $1
       ORDER BY name
       LIMIT 20`,
      [`%${q.trim()}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching participants:', error);
    res.status(500).json({ error: 'Erro na busca.' });
  }
});

// GET /api/participants — list all (admin / meetup invite)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, affiliation, email, mini_bio, photo_url, keywords, abstract, created_at
       FROM event_participants
       ORDER BY name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Erro ao buscar participantes.' });
  }
});

// DELETE /api/participants/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM event_participants WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Participante não encontrado.' });
    res.json({ message: 'Participante excluído.' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Erro ao excluir participante.' });
  }
});

export default router;
