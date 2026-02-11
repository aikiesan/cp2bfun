import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all events with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, type, from, to } = req.query;

    let query = `SELECT * FROM events WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    // Apply filters
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND event_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (from) {
      query += ` AND start_date >= $${paramCount}`;
      params.push(from);
      paramCount++;
    }

    if (to) {
      query += ` AND start_date <= $${paramCount}`;
      params.push(to);
      paramCount++;
    }

    query += ` ORDER BY start_date DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events
       WHERE status = 'upcoming' AND start_date > NOW()
       ORDER BY start_date ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

// Get featured events
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events
       WHERE featured = TRUE
       ORDER BY start_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    res.status(500).json({ error: 'Failed to fetch featured events' });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM events WHERE id = $1`,
      [id]
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
      title_pt, title_en, description_pt, description_en, event_type,
      location, location_type, start_date, end_date, registration_url,
      image, organizer, max_participants, current_participants, status, featured
    } = req.body;

    // Validate required fields
    if (!title_pt || !start_date) {
      return res.status(400).json({ error: 'title_pt and start_date are required' });
    }

    // Validate event type if provided
    if (event_type) {
      const validTypes = ['workshop', 'forum', 'conference', 'meeting', 'webinar', 'course'];
      if (!validTypes.includes(event_type)) {
        return res.status(400).json({
          error: 'Invalid event_type. Must be one of: workshop, forum, conference, meeting, webinar, course'
        });
      }
    }

    // Validate location type if provided
    if (location_type) {
      const validLocationTypes = ['in-person', 'online', 'hybrid'];
      if (!validLocationTypes.includes(location_type)) {
        return res.status(400).json({
          error: 'Invalid location_type. Must be one of: in-person, online, hybrid'
        });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status. Must be one of: upcoming, ongoing, completed, cancelled'
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO events (
         title_pt, title_en, description_pt, description_en, event_type,
         location, location_type, start_date, end_date, registration_url,
         image, organizer, max_participants, current_participants, status, featured
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        title_pt, title_en, description_pt, description_en, event_type || 'workshop',
        location, location_type || 'in-person', start_date, end_date, registration_url,
        image, organizer, max_participants, current_participants || 0, status || 'upcoming', featured || false
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_pt, title_en, description_pt, description_en, event_type,
      location, location_type, start_date, end_date, registration_url,
      image, organizer, max_participants, current_participants, status, featured
    } = req.body;

    // Validate event type if provided
    if (event_type) {
      const validTypes = ['workshop', 'forum', 'conference', 'meeting', 'webinar', 'course'];
      if (!validTypes.includes(event_type)) {
        return res.status(400).json({
          error: 'Invalid event_type. Must be one of: workshop, forum, conference, meeting, webinar, course'
        });
      }
    }

    // Validate location type if provided
    if (location_type) {
      const validLocationTypes = ['in-person', 'online', 'hybrid'];
      if (!validLocationTypes.includes(location_type)) {
        return res.status(400).json({
          error: 'Invalid location_type. Must be one of: in-person, online, hybrid'
        });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status. Must be one of: upcoming, ongoing, completed, cancelled'
        });
      }
    }

    const result = await pool.query(
      `UPDATE events SET
         title_pt = COALESCE($1, title_pt),
         title_en = COALESCE($2, title_en),
         description_pt = COALESCE($3, description_pt),
         description_en = COALESCE($4, description_en),
         event_type = COALESCE($5, event_type),
         location = COALESCE($6, location),
         location_type = COALESCE($7, location_type),
         start_date = COALESCE($8, start_date),
         end_date = COALESCE($9, end_date),
         registration_url = COALESCE($10, registration_url),
         image = COALESCE($11, image),
         organizer = COALESCE($12, organizer),
         max_participants = COALESCE($13, max_participants),
         current_participants = COALESCE($14, current_participants),
         status = COALESCE($15, status),
         featured = COALESCE($16, featured),
         updated_at = NOW()
       WHERE id = $17
       RETURNING *`,
      [
        title_pt, title_en, description_pt, description_en, event_type,
        location, location_type, start_date, end_date, registration_url,
        image, organizer, max_participants, current_participants, status, featured, id
      ]
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

// Update event participant count
router.put('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const { current_participants } = req.body;

    if (current_participants === undefined) {
      return res.status(400).json({ error: 'current_participants is required' });
    }

    const result = await pool.query(
      `UPDATE events SET
         current_participants = $1,
         updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [current_participants, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event participants:', error);
    res.status(500).json({ error: 'Failed to update event participants' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [id]
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
