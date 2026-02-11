import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

/**
 * Extracts YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
 */
const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Generates YouTube thumbnail URL from video ID
 * Uses maxresdefault for highest quality, falls back to hqdefault
 */
const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * GET /api/videos/featured
 * Returns videos at positions A, B, C for homepage display
 */
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM featured_videos
       WHERE active = true AND position IN ('A', 'B', 'C')
       ORDER BY position ASC`
    );

    const videos = {
      A: result.rows.find(v => v.position === 'A') || null,
      B: result.rows.find(v => v.position === 'B') || null,
      C: result.rows.find(v => v.position === 'C') || null,
    };

    res.json(videos);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    res.status(500).json({ error: 'Failed to fetch featured videos' });
  }
});

/**
 * GET /api/videos
 * Returns all videos (for admin management)
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM featured_videos
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

/**
 * GET /api/videos/:id
 * Returns a single video by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM featured_videos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

/**
 * POST /api/videos
 * Creates a new video
 */
router.post('/', async (req, res) => {
  const {
    youtube_url,
    title_pt,
    title_en,
    description_pt,
    description_en,
    date_display,
    position,
    active = true,
  } = req.body;

  // Validate required fields
  if (!youtube_url || !title_pt) {
    return res.status(400).json({ error: 'YouTube URL and Portuguese title are required' });
  }

  // Extract YouTube ID
  const youtube_id = extractYouTubeId(youtube_url);
  if (!youtube_id) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  // Generate thumbnail URL
  const thumbnail_url = getYouTubeThumbnail(youtube_id);

  try {
    // If position is specified, check if it's already taken
    if (position) {
      const existingResult = await pool.query(
        'SELECT id FROM featured_videos WHERE position = $1 AND active = true AND id != $2',
        [position, 0] // 0 as placeholder for new records
      );

      if (existingResult.rows.length > 0) {
        // Unset position of existing video at this position
        await pool.query(
          'UPDATE featured_videos SET position = NULL WHERE position = $1',
          [position]
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO featured_videos
       (youtube_url, youtube_id, title_pt, title_en, description_pt, description_en,
        thumbnail_url, date_display, position, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        youtube_url,
        youtube_id,
        title_pt,
        title_en,
        description_pt,
        description_en,
        thumbnail_url,
        date_display,
        position,
        active,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

/**
 * PUT /api/videos/:id
 * Updates an existing video
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    youtube_url,
    title_pt,
    title_en,
    description_pt,
    description_en,
    date_display,
    position,
    active,
  } = req.body;

  // Validate required fields
  if (!youtube_url || !title_pt) {
    return res.status(400).json({ error: 'YouTube URL and Portuguese title are required' });
  }

  // Extract YouTube ID
  const youtube_id = extractYouTubeId(youtube_url);
  if (!youtube_id) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  // Generate thumbnail URL
  const thumbnail_url = getYouTubeThumbnail(youtube_id);

  try {
    // If position is specified, check if it's already taken by another video
    if (position) {
      const existingResult = await pool.query(
        'SELECT id FROM featured_videos WHERE position = $1 AND active = true AND id != $2',
        [position, id]
      );

      if (existingResult.rows.length > 0) {
        // Unset position of existing video at this position
        await pool.query(
          'UPDATE featured_videos SET position = NULL WHERE position = $1 AND id != $2',
          [position, id]
        );
      }
    }

    const result = await pool.query(
      `UPDATE featured_videos
       SET youtube_url = $1, youtube_id = $2, title_pt = $3, title_en = $4,
           description_pt = $5, description_en = $6, thumbnail_url = $7,
           date_display = $8, position = $9, active = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        youtube_url,
        youtube_id,
        title_pt,
        title_en,
        description_pt,
        description_en,
        thumbnail_url,
        date_display,
        position,
        active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

/**
 * DELETE /api/videos/:id
 * Deletes a video
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM featured_videos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully', video: result.rows[0] });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
