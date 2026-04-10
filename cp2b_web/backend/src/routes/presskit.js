import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all active press kit items
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM press_kit_items WHERE active = true ORDER BY sort_order ASC, created_at ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching press kit items:', error);
    res.status(500).json({ error: 'Failed to fetch press kit items' });
  }
});

// Admin: get all items (including inactive)
router.get('/all', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM press_kit_items ORDER BY sort_order ASC, created_at ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all press kit items:', error);
    res.status(500).json({ error: 'Failed to fetch press kit items' });
  }
});

// Create press kit item
router.post('/', async (req, res) => {
  try {
    const { title_pt, title_en, file_url, file_type, icon, sort_order, active } = req.body;

    if (!title_pt || !file_url) {
      return res.status(400).json({ error: 'title_pt and file_url are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO press_kit_items (title_pt, title_en, file_url, file_type, icon, sort_order, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title_pt, title_en || null, file_url, file_type || 'pdf', icon || 'bi-file-earmark-pdf', sort_order ?? 0, active !== false]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating press kit item:', error);
    res.status(500).json({ error: 'Failed to create press kit item' });
  }
});

// Update press kit item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title_pt, title_en, file_url, file_type, icon, sort_order, active } = req.body;

    const { rows } = await pool.query(
      `UPDATE press_kit_items SET
         title_pt   = COALESCE($1, title_pt),
         title_en   = COALESCE($2, title_en),
         file_url   = COALESCE($3, file_url),
         file_type  = COALESCE($4, file_type),
         icon       = COALESCE($5, icon),
         sort_order = COALESCE($6, sort_order),
         active     = COALESCE($7, active)
       WHERE id = $8 RETURNING *`,
      [title_pt, title_en, file_url, file_type, icon, sort_order, active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating press kit item:', error);
    res.status(500).json({ error: 'Failed to update press kit item' });
  }
});

// Delete press kit item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM press_kit_items WHERE id = $1 RETURNING id', [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting press kit item:', error);
    res.status(500).json({ error: 'Failed to delete press kit item' });
  }
});

export default router;
