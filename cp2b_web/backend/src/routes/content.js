import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get page content by key
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const result = await pool.query(
      'SELECT * FROM page_content WHERE page_key = $1',
      [page]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page content not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Update page content
router.put('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { content_pt, content_en } = req.body;

    const result = await pool.query(
      `INSERT INTO page_content (page_key, content_pt, content_en, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (page_key) DO UPDATE SET
         content_pt = COALESCE($2, page_content.content_pt),
         content_en = COALESCE($3, page_content.content_en),
         updated_at = NOW()
       RETURNING *`,
      [page, content_pt, content_en]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

// Get all page content
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM page_content ORDER BY page_key'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

export default router;
