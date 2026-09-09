import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// A ordem é a mesma em toda listagem: edição mais recente primeiro, caindo para
// a data de criação quando o boletim não tem data de publicação.
const ORDER_BY = `ORDER BY published_at DESC NULLS LAST, edition_number DESC NULLS LAST, created_at DESC`;

// Lista pública: só boletins ativos.
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM boletins WHERE active = true ${ORDER_BY}`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching boletins:', error);
    res.status(500).json({ error: 'Failed to fetch boletins' });
  }
});

// Admin: inclui os inativos.
router.get('/all', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM boletins ${ORDER_BY}`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all boletins:', error);
    res.status(500).json({ error: 'Failed to fetch boletins' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM boletins WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Boletim not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching boletim:', error);
    res.status(500).json({ error: 'Failed to fetch boletim' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title_pt, title_en, description_pt, description_en,
      edition_number, published_at, cover_image, pdf_url, active,
    } = req.body;

    // O PDF é a razão de ser do boletim: sem ele o card não tem o que oferecer.
    if (!title_pt || !pdf_url) {
      return res.status(400).json({ error: 'title_pt and pdf_url are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO boletins
         (title_pt, title_en, description_pt, description_en,
          edition_number, published_at, cover_image, pdf_url, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title_pt,
        title_en || null,
        description_pt || null,
        description_en || null,
        edition_number || null,
        published_at || null,
        cover_image || null,
        pdf_url,
        active !== false,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    // Índice parcial de edição única — devolve 409 em vez de 500 para o admin
    // conseguir mostrar "já existe um boletim com esse número".
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Já existe um boletim com esse número de edição.' });
    }
    console.error('Error creating boletim:', error);
    res.status(500).json({ error: 'Failed to create boletim' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_pt, title_en, description_pt, description_en,
      edition_number, published_at, cover_image, pdf_url, active,
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE boletins SET
         title_pt       = COALESCE($1, title_pt),
         title_en       = COALESCE($2, title_en),
         description_pt = COALESCE($3, description_pt),
         description_en = COALESCE($4, description_en),
         edition_number = COALESCE($5, edition_number),
         published_at   = COALESCE($6, published_at),
         cover_image    = COALESCE($7, cover_image),
         pdf_url        = COALESCE($8, pdf_url),
         active         = COALESCE($9, active),
         updated_at     = now()
       WHERE id = $10 RETURNING *`,
      [title_pt, title_en, description_pt, description_en,
       edition_number, published_at, cover_image, pdf_url, active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Boletim not found' });
    res.json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Já existe um boletim com esse número de edição.' });
    }
    console.error('Error updating boletim:', error);
    res.status(500).json({ error: 'Failed to update boletim' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM boletins WHERE id = $1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Boletim not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting boletim:', error);
    res.status(500).json({ error: 'Failed to delete boletim' });
  }
});

export default router;
