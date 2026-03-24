import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// NOTE: The 'events' table was renamed to 'microscopio' in a migration.
// This route provides backward compatibility for frontend code still using /api/events

// Get all events (from microscopio table)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_pt, title_en, description_pt, description_en,
              image, image_position, badge, badge_color, date_display, published_at, created_at,
              author, tags
       FROM microscopio
       ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      `SELECT * FROM microscopio WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const {
      slug, title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, image_position, badge, badge_color,
      date_display, published_at, author, image_caption_pt, image_caption_en, tags
    } = req.body;

    if (!slug || !title_pt) {
      return res.status(400).json({ error: 'slug and title_pt are required' });
    }

    const result = await pool.query(
      `INSERT INTO microscopio (slug, title_pt, title_en, description_pt, description_en,
                           content_pt, content_en, image, image_position, badge, badge_color,
                           date_display, published_at, author, image_caption_pt, image_caption_en, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, image_position || 'center center', badge, badge_color || 'primary',
       date_display, published_at, author, image_caption_pt, image_caption_en, tags]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'An event with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title_pt, title_en, description_pt, description_en,
      content_pt, content_en, image, image_position, badge, badge_color,
      date_display, published_at, author, image_caption_pt, image_caption_en, tags,
      new_slug
    } = req.body;

    const result = await pool.query(
      `UPDATE microscopio SET
         slug = COALESCE($1, slug),
         title_pt = COALESCE($2, title_pt),
         title_en = COALESCE($3, title_en),
         description_pt = COALESCE($4, description_pt),
         description_en = COALESCE($5, description_en),
         content_pt = COALESCE($6, content_pt),
         content_en = COALESCE($7, content_en),
         image = COALESCE($8, image),
         image_position = COALESCE($9, image_position),
         badge = COALESCE($10, badge),
         badge_color = COALESCE($11, badge_color),
         date_display = COALESCE($12, date_display),
         published_at = COALESCE($13, published_at),
         author = COALESCE($15, author),
         image_caption_pt = COALESCE($16, image_caption_pt),
         image_caption_en = COALESCE($17, image_caption_en),
         tags = COALESCE($18, tags),
         updated_at = NOW()
       WHERE slug = $14
       RETURNING *`,
      [new_slug, title_pt, title_en, description_pt, description_en,
       content_pt, content_en, image, image_position, badge, badge_color,
       date_display, published_at, slug, author, image_caption_pt, image_caption_en, tags]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'DELETE FROM microscopio WHERE slug = $1 RETURNING id',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
