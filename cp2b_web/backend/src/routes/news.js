import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all news articles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, published_at, created_at
       FROM news
       ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get single news article by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT * FROM news WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

// Create news article
router.post('/', async (req, res) => {
  try {
    const {
      slug, title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at
    } = req.body;

    const result = await pool.query(
      `INSERT INTO news (slug, title_pt, title_en, description_pt, description_en,
                         content_pt, content_en, image, badge, badge_color, date_display, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating news:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A news article with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

// Update news article
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at,
      new_slug
    } = req.body;

    const result = await pool.query(
      `UPDATE news SET
         slug = COALESCE($1, slug),
         title_pt = COALESCE($2, title_pt),
         title_en = COALESCE($3, title_en),
         description_pt = COALESCE($4, description_pt),
         description_en = COALESCE($5, description_en),
         content_pt = COALESCE($6, content_pt),
         content_en = COALESCE($7, content_en),
         image = COALESCE($8, image),
         badge = COALESCE($9, badge),
         badge_color = COALESCE($10, badge_color),
         date_display = COALESCE($11, date_display),
         published_at = COALESCE($12, published_at),
         updated_at = NOW()
       WHERE slug = $13
       RETURNING *`,
      [new_slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at, slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

// Delete news article
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'DELETE FROM news WHERE slug = $1 RETURNING id',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

export default router;
