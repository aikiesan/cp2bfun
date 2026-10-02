import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Site-wide settings as a key -> JSON document store.
// GET  /api/settings          -> { contact: {...}, social: {...}, footer: {...} }
// PUT  /api/settings          -> upserts every key in the request body

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_settings');
    const settings = {};
    for (const row of result.rows) settings[row.key] = row.value;
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', async (req, res) => {
  const entries = Object.entries(req.body || {});
  if (entries.length === 0) {
    return res.status(400).json({ error: 'No settings provided' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [key, value] of entries) {
      await client.query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, JSON.stringify(value)]
      );
    }
    await client.query('COMMIT');

    const result = await client.query('SELECT key, value FROM site_settings');
    const settings = {};
    for (const row of result.rows) settings[row.key] = row.value;
    res.json(settings);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  } finally {
    client.release();
  }
});

export default router;
