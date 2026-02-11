import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all partners
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name_pt, name_en, category, location, logo, website,
              description_pt, description_en, sort_order, active, created_at, updated_at
       FROM partners
       WHERE active = TRUE
       ORDER BY category, sort_order, name_pt`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get partners grouped by category
router.get('/grouped', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name_pt, name_en, category, location, logo, website,
              description_pt, description_en, sort_order, active
       FROM partners
       WHERE active = TRUE
       ORDER BY category, sort_order, name_pt`
    );

    // Group partners by category
    const grouped = {
      host: [],
      public: [],
      research: [],
      companies: []
    };

    result.rows.forEach(partner => {
      if (grouped[partner.category]) {
        grouped[partner.category].push(partner);
      }
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped partners:', error);
    res.status(500).json({ error: 'Failed to fetch grouped partners' });
  }
});

// Get single partner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM partners WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// Create partner
router.post('/', async (req, res) => {
  try {
    const {
      name_pt, name_en, category, location, logo, website,
      description_pt, description_en, sort_order, active
    } = req.body;

    // Validate required fields
    if (!name_pt || !category) {
      return res.status(400).json({ error: 'name_pt and category are required' });
    }

    // Validate category
    const validCategories = ['host', 'public', 'research', 'companies'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be one of: host, public, research, companies' });
    }

    const result = await pool.query(
      `INSERT INTO partners (name_pt, name_en, category, location, logo, website,
                            description_pt, description_en, sort_order, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name_pt, name_en, category, location, logo, website,
       description_pt, description_en, sort_order || 0, active !== undefined ? active : true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// Update partner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_pt, name_en, category, location, logo, website,
      description_pt, description_en, sort_order, active
    } = req.body;

    // Validate category if provided
    if (category) {
      const validCategories = ['host', 'public', 'research', 'companies'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category. Must be one of: host, public, research, companies' });
      }
    }

    const result = await pool.query(
      `UPDATE partners SET
         name_pt = COALESCE($1, name_pt),
         name_en = COALESCE($2, name_en),
         category = COALESCE($3, category),
         location = COALESCE($4, location),
         logo = COALESCE($5, logo),
         website = COALESCE($6, website),
         description_pt = COALESCE($7, description_pt),
         description_en = COALESCE($8, description_en),
         sort_order = COALESCE($9, sort_order),
         active = COALESCE($10, active),
         updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [name_pt, name_en, category, location, logo, website,
       description_pt, description_en, sort_order, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM partners WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;
