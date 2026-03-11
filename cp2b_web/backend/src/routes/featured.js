import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

const TYPE_TO_TABLE = {
  news: 'news',
  project: 'projects',
  microscopio: 'microscopio',
  opportunity: 'opportunities',
};

// GET unified featured content (news + projects + microscopio + opportunities)
router.get('/', async (req, res) => {
  try {
    const queries = Object.entries(TYPE_TO_TABLE).map(([type, table]) =>
      pool.query(
        `SELECT id, slug, title_pt, title_en, description_pt, description_en,
                image, image_position, badge, badge_color, date_display, featured_position,
                '${type}' as content_type
         FROM ${table}
         WHERE featured_position IN ('A', 'B', 'C')`
      )
    );

    const results = await Promise.all(queries);
    const allFeatured = results.flatMap(r => r.rows);

    const featured = {
      A: allFeatured.find(item => item.featured_position === 'A') || null,
      B: allFeatured.find(item => item.featured_position === 'B') || null,
      C: allFeatured.find(item => item.featured_position === 'C') || null,
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

  try {
    await pool.query('BEGIN');

    // Clear all existing featured positions across all tables
    for (const table of Object.values(TYPE_TO_TABLE)) {
      await pool.query(`UPDATE ${table} SET featured_position = NULL WHERE featured_position IS NOT NULL`);
    }

    // Set new positions
    for (const [pos, data] of [['A', positionA], ['B', positionB], ['C', positionC]]) {
      if (data && data.slug && TYPE_TO_TABLE[data.type]) {
        const table = TYPE_TO_TABLE[data.type];
        await pool.query(
          `UPDATE ${table} SET featured_position = $1 WHERE slug = $2`,
          [pos, data.slug]
        );
      }
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
