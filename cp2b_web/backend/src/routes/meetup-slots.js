import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET /api/meetup-slots — return all slots with per-table availability
router.get('/', async (req, res) => {
  try {
    const slotsResult = await pool.query(
      `SELECT id, label, start_time, end_time, slot_date, sort_order
       FROM meetup_slots
       ORDER BY sort_order, start_time`
    );

    // Fetch confirmed bookings (slot_id -> table_number array)
    const bookingsResult = await pool.query(
      `SELECT slot_id, table_number, requester_id, invitee_id
       FROM meetup_requests
       WHERE status IN ('pending', 'confirmed')`
    );

    // Build a map: slot_id -> Set of taken table numbers
    const takenMap = {};
    for (const row of bookingsResult.rows) {
      if (!takenMap[row.slot_id]) takenMap[row.slot_id] = [];
      takenMap[row.slot_id].push({
        table_number: row.table_number,
        requester_id: row.requester_id,
        invitee_id: row.invitee_id,
      });
    }

    const slots = slotsResult.rows.map(slot => ({
      ...slot,
      bookings: takenMap[slot.id] || [],
    }));

    res.json(slots);
  } catch (error) {
    console.error('Error fetching meetup slots:', error);
    res.status(500).json({ error: 'Erro ao buscar horários.' });
  }
});

// POST /api/meetup-slots
router.post('/', async (req, res) => {
  const { label, slot_date, start_time, end_time, sort_order } = req.body;
  if (!label || !slot_date || !start_time || !end_time)
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  try {
    const result = await pool.query(
      `INSERT INTO meetup_slots (label, slot_date, start_time, end_time, sort_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [label, slot_date, start_time, end_time, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating meetup slot:', error);
    res.status(500).json({ error: 'Erro ao criar slot.' });
  }
});

// PUT /api/meetup-slots/:id
router.put('/:id', async (req, res) => {
  const { label, slot_date, start_time, end_time, sort_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE meetup_slots SET label=$1, slot_date=$2, start_time=$3, end_time=$4, sort_order=$5
       WHERE id=$6 RETURNING *`,
      [label, slot_date, start_time, end_time, sort_order || 0, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Slot não encontrado.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating meetup slot:', error);
    res.status(500).json({ error: 'Erro ao atualizar slot.' });
  }
});

// DELETE /api/meetup-slots/:id — blocked if active bookings
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const active = await pool.query(
      `SELECT id FROM meetup_requests WHERE slot_id=$1 AND status IN ('pending','confirmed') LIMIT 1`,
      [id]
    );
    if (active.rowCount > 0)
      return res.status(409).json({ error: 'Slot tem reservas ativas e não pode ser excluído.' });
    await pool.query('DELETE FROM meetup_slots WHERE id=$1', [id]);
    res.json({ message: 'Slot excluído.' });
  } catch (error) {
    console.error('Error deleting meetup slot:', error);
    res.status(500).json({ error: 'Erro ao excluir slot.' });
  }
});

export default router;
