import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET unified featured content (news + projects)
router.get('/', async (req, res) => {
  try {
    // Fetch featured news
    const newsResult = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, featured_position,
              'news' as content_type
       FROM news
       WHERE featured_position IN ('A', 'B', 'C')`
    );

    // Fetch featured projects
    const projectsResult = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, badge, badge_color, date_display, featured_position,
              'project' as content_type
       FROM projects
       WHERE featured_position IN ('A', 'B', 'C')`
    );

    // Combine and organize by position
    const allFeatured = [...newsResult.rows, ...projectsResult.rows];
    const featured = {
      A: allFeatured.find(item => item.featured_position === 'A') || null,
      B: allFeatured.find(item => item.featured_position === 'B') || null,
      C: allFeatured.find(item => item.featured_position === 'C') || null
    };

    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
});

// PUT unified featured positions
router.put('/', async (req, res) => {
  const { positionA, positionB, positionC } = req.body;
  // positionA = { type: 'news', slug: 'my-news' } or { type: 'project', slug: 'my-project' }

  try {
    await pool.query('BEGIN');

    // Clear all existing featured positions
    await pool.query('UPDATE news SET featured_position = NULL WHERE featured_position IS NOT NULL');
    await pool.query('UPDATE projects SET featured_position = NULL WHERE featured_position IS NOT NULL');

    // Set new positions
    if (positionA && positionA.slug) {
      const table = positionA.type === 'news' ? 'news' : 'projects';
      await pool.query(
        `UPDATE ${table} SET featured_position = $1 WHERE slug = $2`,
        ['A', positionA.slug]
      );
    }

    if (positionB && positionB.slug) {
      const table = positionB.type === 'news' ? 'news' : 'projects';
      await pool.query(
        `UPDATE ${table} SET featured_position = $1 WHERE slug = $2`,
        ['B', positionB.slug]
      );
    }

    if (positionC && positionC.slug) {
      const table = positionC.type === 'news' ? 'news' : 'projects';
      await pool.query(
        `UPDATE ${table} SET featured_position = $1 WHERE slug = $2`,
        ['C', positionC.slug]
      );
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Featured positions updated' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating featured positions:', error);
    res.status(500).json({ error: 'Failed to update featured positions' });
  }
});

export default router;
