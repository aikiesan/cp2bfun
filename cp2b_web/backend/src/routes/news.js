import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get featured news articles
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, featured_position
       FROM news
       WHERE featured_position IN ('A', 'B', 'C')
       ORDER BY featured_position`
    );

    // Return as object with A, B, C keys for easy access
    const featured = {
      A: result.rows.find(r => r.featured_position === 'A') || null,
      B: result.rows.find(r => r.featured_position === 'B') || null,
      C: result.rows.find(r => r.featured_position === 'C') || null
    };

    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({ error: 'Failed to fetch featured news' });
  }
});

// Update featured positions
router.put('/featured', async (req, res) => {
  const { positionA, positionB, positionC } = req.body;

  try {
    await pool.query('BEGIN');

    // Clear all existing featured positions
    await pool.query('UPDATE news SET featured_position = NULL WHERE featured_position IS NOT NULL');

    // Set new positions (only if slug provided)
    if (positionA) {
      await pool.query('UPDATE news SET featured_position = $1 WHERE slug = $2', ['A', positionA]);
    }
    if (positionB) {
      await pool.query('UPDATE news SET featured_position = $1 WHERE slug = $2', ['B', positionB]);
    }
    if (positionC) {
      await pool.query('UPDATE news SET featured_position = $1 WHERE slug = $2', ['C', positionC]);
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Featured news updated' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating featured news:', error);
    res.status(500).json({ error: 'Failed to update featured news' });
  }
});

// Get all news articles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, published_at, created_at, sort_order,
              author, tags
       FROM news
       ORDER BY sort_order ASC NULLS LAST, published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Reorder news articles
router.post('/reorder', async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, sort_order }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const item of items) {
        await client.query(
          'UPDATE news SET sort_order = $1 WHERE id = $2',
          [item.sort_order, item.id]
        );
      }

      await client.query('COMMIT');
      res.json({ message: 'News reordered successfully' });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error reordering news:', error);
    res.status(500).json({ error: 'Failed to reorder news' });
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
      content_pt, content_en, image, badge, badge_color, date_display, published_at,
      author, image_caption_pt, image_caption_en, tags
    } = req.body;

    const result = await pool.query(
      `INSERT INTO news (slug, title_pt, title_en, description_pt, description_en,
                         content_pt, content_en, image, badge, badge_color, date_display,
                         published_at, author, image_caption_pt, image_caption_en, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at,
       author, image_caption_pt, image_caption_en, tags]
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
      new_slug, author, image_caption_pt, image_caption_en, tags
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
         author = COALESCE($14, author),
         image_caption_pt = COALESCE($15, image_caption_pt),
         image_caption_en = COALESCE($16, image_caption_en),
         tags = COALESCE($17, tags),
         updated_at = NOW()
       WHERE slug = $13
       RETURNING *`,
      [new_slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at, slug,
       author, image_caption_pt, image_caption_en, tags]
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
