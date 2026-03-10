import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all opportunities
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, published_at, created_at
       FROM opportunities
       ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// Get single opportunity by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT * FROM opportunities WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// Create opportunity
router.post('/', async (req, res) => {
  try {
    const {
      slug, title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at
    } = req.body;

    const result = await pool.query(
      `INSERT INTO opportunities (slug, title_pt, title_en, description_pt, description_en,
                                  content_pt, content_en, image, badge, badge_color, date_display, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating opportunity:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'An opportunity with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

// Update opportunity
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at,
      new_slug
    } = req.body;

    const result = await pool.query(
      `UPDATE opportunities SET
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
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
});

// Delete opportunity
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'DELETE FROM opportunities WHERE slug = $1 RETURNING id',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
});

export default router;
