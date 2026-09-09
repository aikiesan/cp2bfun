import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Colunas que o admin pode gravar.
//
// Antes daqui saía uma lista fixa de oito campos, e `axes`, `is_director`,
// `photo` e `photo_url` — que só existiam via SQL — eram descartados em
// silêncio: cada edição no admin apagava o eixo e a foto da pessoa. Os
// identificadores e a biografia entram na mesma lista para não repetir o
// problema.
const WRITABLE_FIELDS = [
  'name',
  'role_pt',
  'role_en',
  'institution',
  'email',
  'phone',
  'category',
  'sort_order',
  'axes',
  'is_director',
  'photo',
  'photo_url',
  'membership',
  'orcid',
  'lattes',
  'scholar',
  'scopus',
  'wos',
  'bv_fapesp',
  'institutional_url',
  'bio_pt',
  'bio_en',
  'research_areas_pt',
  'research_areas_en',
];

const BOOLEAN_FIELDS = new Set(['is_director']);
const NUMERIC_FIELDS = new Set(['sort_order']);
// Colunas TEXT[]: o admin edita uma área por linha do textarea. Uma lista
// vazia grava NULL, e não um array de uma string vazia, para que a página
// possa simplesmente testar a ausência.
const ARRAY_FIELDS = new Set(['research_areas_pt', 'research_areas_en']);

// O formulário do admin manda string vazia para campo apagado, e apagar um
// identificador errado precisa mesmo gravar NULL — senão a página cai no valor
// da planilha e o link errado volta.
const normalize = (field, value) => {
  if (BOOLEAN_FIELDS.has(field)) return Boolean(value);
  if (NUMERIC_FIELDS.has(field)) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  if (ARRAY_FIELDS.has(field)) {
    // Aceita tanto o array pronto quanto o textarea do admin, uma área por
    // linha. Linhas em branco somem; lista vazia vira NULL, para a página
    // poder testar só a ausência.
    const list = Array.isArray(value)
      ? value
      : String(value ?? '').split('\n');
    const clean = list.map((item) => String(item).trim()).filter(Boolean);
    return clean.length > 0 ? clean : null;
  }
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
};

// Só o que o corpo traz. Campo ausente fica como está — o que permite um PUT
// parcial sem zerar o resto.
const collectFields = (body) =>
  WRITABLE_FIELDS.filter((field) => Object.prototype.hasOwnProperty.call(body, field)).map(
    (field) => [field, normalize(field, body[field])]
  );

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
    const fields = collectFields(req.body);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No team member fields provided' });
    }

    const columns = fields.map(([field]) => field);
    const placeholders = fields.map((_, index) => `$${index + 1}`);

    const result = await pool.query(
      `INSERT INTO team_members (${columns.join(', ')})
       VALUES (${placeholders.join(', ')})
       RETURNING *`,
      fields.map(([, value]) => value)
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

    const fields = collectFields(req.body);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No team member fields provided' });
    }

    const assignments = fields.map(([field], index) => `${field} = $${index + 1}`);

    const result = await pool.query(
      `UPDATE team_members SET
         ${assignments.join(',\n         ')}
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      [...fields.map(([, value]) => value), id]
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
