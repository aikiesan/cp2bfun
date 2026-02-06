import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all team members
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT * FROM team_members
      ${category ? 'WHERE category = $1' : ''}
      ORDER BY category, sort_order, name
    `;

    const result = category
      ? await pool.query(query, [category])
      : await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get team members grouped by category
router.get('/grouped', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM team_members ORDER BY category, sort_order, name'
    );

    const grouped = result.rows.reduce((acc, member) => {
      if (!acc[member.category]) {
        acc[member.category] = [];
      }
      acc[member.category].push(member);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM team_members WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create team member
router.post('/', async (req, res) => {
  try {
    const {
      name, role_pt, role_en, institution, email, phone, category, sort_order
    } = req.body;

    const result = await pool.query(
      `INSERT INTO team_members (name, role_pt, role_en, institution, email, phone, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, role_pt, role_en, institution, email, phone, category, sort_order || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, role_pt, role_en, institution, email, phone, category, sort_order
    } = req.body;

    const result = await pool.query(
      `UPDATE team_members SET
         name = COALESCE($1, name),
         role_pt = COALESCE($2, role_pt),
         role_en = COALESCE($3, role_en),
         institution = COALESCE($4, institution),
         email = COALESCE($5, email),
         phone = COALESCE($6, phone),
         category = COALESCE($7, category),
         sort_order = COALESCE($8, sort_order)
       WHERE id = $9
       RETURNING *`,
      [name, role_pt, role_en, institution, email, phone, category, sort_order, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM team_members WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Reorder team members
router.post('/reorder', async (req, res) => {
  try {
    const { members } = req.body; // Array of { id, sort_order }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const member of members) {
        await client.query(
          'UPDATE team_members SET sort_order = $1 WHERE id = $2',
          [member.sort_order, member.id]
        );
      }

      await client.query('COMMIT');
      res.json({ message: 'Team members reordered successfully' });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error reordering team members:', error);
    res.status(500).json({ error: 'Failed to reorder team members' });
  }
});

export default router;
