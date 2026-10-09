import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all research axes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM research_axes ORDER BY axis_number'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching research axes:', error);
    res.status(500).json({ error: 'Failed to fetch research axes' });
  }
});

// Get single research axis
router.get('/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const result = await pool.query(
      'SELECT * FROM research_axes WHERE axis_number = $1',
      [number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research axis not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching research axis:', error);
    res.status(500).json({ error: 'Failed to fetch research axis' });
  }
});

// Update research axis
router.put('/:number', async (req, res) => {
  try {
    const { number } = req.params;
    // As fotos e o segundo coordenador vêm do mesmo formulário do painel e
    // aparecem na página /eixos; antes não eram lidos aqui, e o painel dizia
    // "salvo com sucesso" sem gravá-los.
    const {
      title_pt, title_en, coordinator, coordinator_image,
      sub_coordinator, sub_coordinator_image, content_pt, content_en, sdgs,
    } = req.body;

    const result = await pool.query(
      `UPDATE research_axes SET
         title_pt = COALESCE($1, title_pt),
         title_en = COALESCE($2, title_en),
         coordinator = COALESCE($3, coordinator),
         content_pt = COALESCE($4, content_pt),
         content_en = COALESCE($5, content_en),
         sdgs = COALESCE($6, sdgs),
         coordinator_image = COALESCE($7, coordinator_image),
         sub_coordinator = COALESCE($8, sub_coordinator),
         sub_coordinator_image = COALESCE($9, sub_coordinator_image),
         updated_at = NOW()
       WHERE axis_number = $10
       RETURNING *`,
      [title_pt, title_en, coordinator, content_pt, content_en, sdgs,
       coordinator_image, sub_coordinator, sub_coordinator_image, number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research axis not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating research axis:', error);
    res.status(500).json({ error: 'Failed to update research axis' });
  }
});

export default router;
