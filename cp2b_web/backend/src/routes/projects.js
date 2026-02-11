import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, featured_position
       FROM projects
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
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ error: 'Failed to fetch featured projects' });
  }
});

// Update featured positions
router.put('/featured', async (req, res) => {
  const { positionA, positionB, positionC } = req.body;

  try {
    await pool.query('BEGIN');

    // Clear all existing featured positions
    await pool.query('UPDATE projects SET featured_position = NULL WHERE featured_position IS NOT NULL');

    // Set new positions (only if slug provided)
    if (positionA) {
      await pool.query('UPDATE projects SET featured_position = $1 WHERE slug = $2', ['A', positionA]);
    }
    if (positionB) {
      await pool.query('UPDATE projects SET featured_position = $1 WHERE slug = $2', ['B', positionB]);
    }
    if (positionC) {
      await pool.query('UPDATE projects SET featured_position = $1 WHERE slug = $2', ['C', positionC]);
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Featured projects updated' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating featured projects:', error);
    res.status(500).json({ error: 'Failed to update featured projects' });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, published_at, created_at
       FROM projects
       ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT * FROM projects WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const {
      slug, title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at
    } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (slug, title_pt, title_en, description_pt, description_en,
                         content_pt, content_en, image, badge, badge_color, date_display, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, badge, badge_color, date_display, published_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A project with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, badge, badge_color, date_display, published_at,
      new_slug
    } = req.body;

    const result = await pool.query(
      `UPDATE projects SET
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
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'DELETE FROM projects WHERE slug = $1 RETURNING id',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
