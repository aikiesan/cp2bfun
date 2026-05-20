import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET /api/page-settings — list all pages with their status
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT page_key, label, route_path, is_enabled, updated_at
       FROM page_settings
       ORDER BY label ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching page settings:', error);
    res.status(500).json({ error: 'Failed to fetch page settings' });
  }
});

// PATCH /api/page-settings/:key — toggle page enabled/disabled
router.patch('/:key', async (req, res) => {
  const { key } = req.params;
  const { is_enabled } = req.body;

  if (typeof is_enabled !== 'boolean') {
    return res.status(400).json({ error: 'is_enabled must be a boolean' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE page_settings
       SET is_enabled = $1, updated_at = NOW()
       WHERE page_key = $2
       RETURNING *`,
      [is_enabled, key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating page setting:', error);
    res.status(500).json({ error: 'Failed to update page setting' });
  }
});

export default router;
