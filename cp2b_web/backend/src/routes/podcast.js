import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all active podcast episodes (public)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM podcast_episodes WHERE active = true ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    res.status(500).json({ error: 'Failed to fetch podcast episodes' });
  }
});

// Admin: get all episodes (including inactive)
router.get('/all', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM podcast_episodes ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all podcast episodes:', error);
    res.status(500).json({ error: 'Failed to fetch podcast episodes' });
  }
});

// Get single episode by id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM podcast_episodes WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Episode not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching podcast episode:', error);
    res.status(500).json({ error: 'Failed to fetch podcast episode' });
  }
});

// Create podcast episode
router.post('/', async (req, res) => {
  try {
    const { title_pt, title_en, description_pt, description_en, spotify_url, episode_number, duration, published_at, active } = req.body;

    if (!title_pt || !spotify_url) {
      return res.status(400).json({ error: 'title_pt and spotify_url are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO podcast_episodes
         (title_pt, title_en, description_pt, description_en, spotify_url, episode_number, duration, published_at, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title_pt,
        title_en || null,
        description_pt || null,
        description_en || null,
        spotify_url,
        episode_number || null,
        duration || null,
        published_at || null,
        active !== false,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating podcast episode:', error);
    res.status(500).json({ error: 'Failed to create podcast episode' });
  }
});

// Update podcast episode
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title_pt, title_en, description_pt, description_en, spotify_url, episode_number, duration, published_at, active } = req.body;

    const { rows } = await pool.query(
      `UPDATE podcast_episodes SET
         title_pt       = COALESCE($1, title_pt),
         title_en       = COALESCE($2, title_en),
         description_pt = COALESCE($3, description_pt),
         description_en = COALESCE($4, description_en),
         spotify_url    = COALESCE($5, spotify_url),
         episode_number = COALESCE($6, episode_number),
         duration       = COALESCE($7, duration),
         published_at   = COALESCE($8, published_at),
         active         = COALESCE($9, active)
       WHERE id = $10 RETURNING *`,
      [title_pt, title_en, description_pt, description_en, spotify_url, episode_number, duration, published_at, active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Episode not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating podcast episode:', error);
    res.status(500).json({ error: 'Failed to update podcast episode' });
  }
});

// Delete podcast episode
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM podcast_episodes WHERE id = $1 RETURNING id', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Episode not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting podcast episode:', error);
    res.status(500).json({ error: 'Failed to delete podcast episode' });
  }
});

export default router;
