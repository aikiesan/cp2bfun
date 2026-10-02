import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Events calendar (workshops, forums, conferences...). Historical note: this
// route briefly aliased the microscopio table; article content now lives
// exclusively under /api/microscopio and this route serves the events table.

const EVENT_FIELDS = `
  id, slug, title_pt, title_en, description_pt, description_en,
  content_pt, content_en, event_type, location, location_type,
  start_date, end_date, registration_url, image, organizer,
  max_participants, current_participants, status, featured,
  schedule, gallery_album_ids, created_at, updated_at
`;

// Get all events, newest first
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${EVENT_FIELDS} FROM events ORDER BY start_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event by slug (or numeric id for admin editing)
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const byId = /^\d+$/.test(slugOrId);
    const result = await pool.query(
      `SELECT ${EVENT_FIELDS} FROM events WHERE ${byId ? 'id = $1' : 'slug = $1'}`,
      [byId ? Number(slugOrId) : slugOrId]
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
      content_pt, content_en, event_type, location, location_type,
      start_date, end_date, registration_url, image, organizer,
      max_participants, status, featured, schedule, gallery_album_ids,
    } = req.body;

    if (!title_pt || !start_date) {
      return res.status(400).json({ error: 'title_pt and start_date are required' });
    }

    const result = await pool.query(
      `INSERT INTO events (
         slug, title_pt, title_en, description_pt, description_en,
         content_pt, content_en, event_type, location, location_type,
         start_date, end_date, registration_url, image, organizer,
         max_participants, status, featured, schedule, gallery_album_ids
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING ${EVENT_FIELDS}`,
      [
        slug || null, title_pt, title_en, description_pt, description_en,
        content_pt, content_en, event_type || 'workshop', location, location_type || 'in-person',
        start_date, end_date || start_date, registration_url, image, organizer,
        max_participants, status || 'upcoming', featured || false,
        JSON.stringify(schedule || []), JSON.stringify(gallery_album_ids || []),
      ]
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

// Update event by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug, title_pt, title_en, description_pt, description_en,
      content_pt, content_en, event_type, location, location_type,
      start_date, end_date, registration_url, image, organizer,
      max_participants, status, featured, schedule, gallery_album_ids,
    } = req.body;

    const result = await pool.query(
      `UPDATE events SET
         slug = COALESCE($1, slug),
         title_pt = COALESCE($2, title_pt),
         title_en = COALESCE($3, title_en),
         description_pt = COALESCE($4, description_pt),
         description_en = COALESCE($5, description_en),
         content_pt = COALESCE($6, content_pt),
         content_en = COALESCE($7, content_en),
         event_type = COALESCE($8, event_type),
         location = COALESCE($9, location),
         location_type = COALESCE($10, location_type),
         start_date = COALESCE($11, start_date),
         end_date = COALESCE($12, end_date),
         registration_url = COALESCE($13, registration_url),
         image = COALESCE($14, image),
         organizer = COALESCE($15, organizer),
         max_participants = COALESCE($16, max_participants),
         status = COALESCE($17, status),
         featured = COALESCE($18, featured),
         schedule = COALESCE($19, schedule),
         gallery_album_ids = COALESCE($20, gallery_album_ids),
         updated_at = NOW()
       WHERE id = $21
       RETURNING ${EVENT_FIELDS}`,
      [
        slug, title_pt, title_en, description_pt, description_en,
        content_pt, content_en, event_type, location, location_type,
        start_date, end_date, registration_url, image, organizer,
        max_participants, status, featured,
        schedule !== undefined ? JSON.stringify(schedule) : null,
        gallery_album_ids !== undefined ? JSON.stringify(gallery_album_ids) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'An event with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

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
