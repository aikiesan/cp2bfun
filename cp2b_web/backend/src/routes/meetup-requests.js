import { Router } from 'express';
import { randomUUID } from 'crypto';
import pool from '../db/connection.js';
import { sendMeetupInvitation, sendMeetupConfirmation } from '../services/email.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// POST /api/meetup-requests — create a meetup request
router.post('/', async (req, res) => {
  const { requester_id, invitee_id, slot_id, table_number, message } = req.body;

  if (!requester_id || !invitee_id || !slot_id || !table_number) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  if (requester_id === invitee_id) {
    return res.status(400).json({ error: 'Você não pode convidar a si mesmo.' });
  }

  if (table_number < 1 || table_number > 10) {
    return res.status(400).json({ error: 'Mesa inválida (1–10).' });
  }

  try {
    // Check slot+table availability (only pending/confirmed block the slot)
    const taken = await pool.query(
      `SELECT id FROM meetup_requests
       WHERE slot_id = $1 AND table_number = $2 AND status IN ('pending', 'confirmed')`,
      [slot_id, table_number]
    );

    if (taken.rows.length > 0) {
      return res.status(409).json({ error: 'Este horário e mesa já estão reservados.' });
    }

    // Fetch slot and participant details for the email
    const [slotResult, requesterResult, inviteeResult] = await Promise.all([
      pool.query('SELECT * FROM meetup_slots WHERE id = $1', [slot_id]),
      pool.query('SELECT * FROM event_participants WHERE id = $1', [requester_id]),
      pool.query('SELECT * FROM event_participants WHERE id = $1', [invitee_id]),
    ]);

    if (!slotResult.rows[0] || !requesterResult.rows[0] || !inviteeResult.rows[0]) {
      return res.status(404).json({ error: 'Horário ou participante não encontrado.' });
    }

    const slot = slotResult.rows[0];
    const requester = requesterResult.rows[0];
    const invitee = inviteeResult.rows[0];

    const token = randomUUID().replace(/-/g, '');

    const result = await pool.query(
      `INSERT INTO meetup_requests (requester_id, invitee_id, slot_id, table_number, confirm_token, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [requester_id, invitee_id, slot_id, table_number, token, message || null]
    );

    const confirmLink = `${FRONTEND_URL}/confirmar-meetup?token=${token}`;

    sendMeetupInvitation(
      invitee.email,
      invitee.name,
      requester.name,
      slot,
      table_number,
      confirmLink
    ).catch(err => console.error('Invite email failed:', err.message));

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este horário e mesa já estão reservados.' });
    }
    console.error('Error creating meetup request:', error);
    res.status(500).json({ error: 'Erro ao criar convite de reunião.' });
  }
});

// GET /api/meetup-requests/confirm?token=XXX — confirm meetup
router.get('/confirm', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token ausente.' });
  }

  try {
    const requestResult = await pool.query(
      `SELECT mr.*,
              ms.label, ms.start_time, ms.end_time, ms.slot_date,
              r.name AS requester_name, r.email AS requester_email,
              i.name AS invitee_name, i.email AS invitee_email
       FROM meetup_requests mr
       JOIN meetup_slots ms ON ms.id = mr.slot_id
       JOIN event_participants r ON r.id = mr.requester_id
       JOIN event_participants i ON i.id = mr.invitee_id
       WHERE mr.confirm_token = $1`,
      [token]
    );

    if (!requestResult.rows[0]) {
      return res.status(404).json({ error: 'Token inválido ou expirado.' });
    }

    const req_ = requestResult.rows[0];

    if (req_.status === 'confirmed') {
      return res.json({ message: 'Reunião já confirmada.', meetup: req_ });
    }

    if (req_.status !== 'pending') {
      return res.status(400).json({ error: `Convite está com status "${req_.status}" e não pode ser confirmado.` });
    }

    await pool.query(
      `UPDATE meetup_requests SET status = 'confirmed', confirmed_at = NOW() WHERE confirm_token = $1`,
      [token]
    );

    const slot = { label: req_.label, start_time: req_.start_time, end_time: req_.end_time };

    // Send confirmation emails to both parties
    Promise.all([
      sendMeetupConfirmation(req_.requester_email, req_.requester_name, req_.invitee_name, slot, req_.table_number),
      sendMeetupConfirmation(req_.invitee_email, req_.invitee_name, req_.requester_name, slot, req_.table_number),
    ]).catch(err => console.error('Confirmation email failed:', err.message));

    res.json({
      message: 'Reunião confirmada com sucesso!',
      meetup: {
        ...req_,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error confirming meetup:', error);
    res.status(500).json({ error: 'Erro ao confirmar reunião.' });
  }
});

// GET /api/meetup-requests/my?email=XXX — get all meetups for a participant
router.get('/my', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'E-mail obrigatório.' });
  }

  try {
    const participantResult = await pool.query(
      'SELECT id FROM event_participants WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!participantResult.rows[0]) {
      return res.status(404).json({ error: 'Participante não encontrado.' });
    }

    const participantId = participantResult.rows[0].id;

    const result = await pool.query(
      `SELECT mr.*,
              ms.label, ms.start_time, ms.end_time, ms.slot_date,
              r.name AS requester_name, r.email AS requester_email,
              i.name AS invitee_name, i.email AS invitee_email
       FROM meetup_requests mr
       JOIN meetup_slots ms ON ms.id = mr.slot_id
       JOIN event_participants r ON r.id = mr.requester_id
       JOIN event_participants i ON i.id = mr.invitee_id
       WHERE mr.requester_id = $1 OR mr.invitee_id = $1
       ORDER BY ms.sort_order, mr.created_at`,
      [participantId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching my meetups:', error);
    res.status(500).json({ error: 'Erro ao buscar reuniões.' });
  }
});

// GET /api/meetup-requests/all  (admin — returns all)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mr.*,
        r.name AS requester_name, r.email AS requester_email,
        i.name AS invitee_name,  i.email AS invitee_email,
        ms.label AS slot_label, ms.start_time, ms.end_time, ms.slot_date
      FROM meetup_requests mr
      JOIN event_participants r  ON r.id  = mr.requester_id
      JOIN event_participants i  ON i.id  = mr.invitee_id
      JOIN meetup_slots ms       ON ms.id = mr.slot_id
      ORDER BY mr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all meetup requests:', error);
    res.status(500).json({ error: 'Erro ao buscar solicitações.' });
  }
});

// PUT /api/meetup-requests/:id/confirm-admin  (admin direct confirm — no token required)
router.put('/:id/confirm-admin', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE meetup_requests
       SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = $1 AND status = 'pending'
       RETURNING *`,
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(400).json({ error: 'Solicitação não está pendente.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error admin-confirming meetup:', error);
    res.status(500).json({ error: 'Erro ao confirmar reunião.' });
  }
});

// PUT /api/meetup-requests/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE meetup_requests SET status='cancelled'
       WHERE id=$1 AND status IN ('pending','confirmed') RETURNING *`,
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(400).json({ error: 'Solicitação não pode ser cancelada.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error cancelling meetup request:', error);
    res.status(500).json({ error: 'Erro ao cancelar solicitação.' });
  }
});

// DELETE /api/meetup-requests/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM meetup_requests WHERE id=$1 RETURNING id', [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Solicitação não encontrada.' });
    res.json({ message: 'Excluído.' });
  } catch (error) {
    console.error('Error deleting meetup request:', error);
    res.status(500).json({ error: 'Erro ao excluir solicitação.' });
  }
});

// PUT /api/meetup-requests/:id/decline — decline a meetup request
router.put('/:id/decline', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail obrigatório para autorização.' });
  }

  try {
    const participantResult = await pool.query(
      'SELECT id FROM event_participants WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!participantResult.rows[0]) {
      return res.status(403).json({ error: 'Participante não encontrado.' });
    }

    const participantId = participantResult.rows[0].id;

    const meetupResult = await pool.query(
      'SELECT * FROM meetup_requests WHERE id = $1',
      [id]
    );

    if (!meetupResult.rows[0]) {
      return res.status(404).json({ error: 'Convite não encontrado.' });
    }

    const meetup = meetupResult.rows[0];

    if (meetup.requester_id !== participantId && meetup.invitee_id !== participantId) {
      return res.status(403).json({ error: 'Não autorizado.' });
    }

    if (meetup.status !== 'pending') {
      return res.status(400).json({ error: `Convite não está pendente (status: ${meetup.status}).` });
    }

    await pool.query(
      "UPDATE meetup_requests SET status = 'declined' WHERE id = $1",
      [id]
    );

    res.json({ message: 'Convite recusado.' });
  } catch (error) {
    console.error('Error declining meetup:', error);
    res.status(500).json({ error: 'Erro ao recusar convite.' });
  }
});

export default router;
