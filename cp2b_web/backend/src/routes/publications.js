import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all publications with optional filters
router.get('/', async (req, res) => {
  try {
    const { year, type, axis, search } = req.query;

    let query = `
      SELECT p.*, ra.title_pt as axis_title_pt, ra.title_en as axis_title_en
      FROM publications p
      LEFT JOIN research_axes ra ON p.research_axis_id = ra.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Apply filters
    if (year) {
      query += ` AND p.year = $${paramCount}`;
      params.push(parseInt(year));
      paramCount++;
    }

    if (type) {
      query += ` AND p.publication_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (axis) {
      query += ` AND p.research_axis_id = $${paramCount}`;
      params.push(parseInt(axis));
      paramCount++;
    }

    if (search) {
      query += ` AND (
        p.title_pt ILIKE $${paramCount} OR
        p.title_en ILIKE $${paramCount} OR
        p.authors ILIKE $${paramCount} OR
        p.journal ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY p.year DESC, p.published_at DESC NULLS LAST, p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching publications:', error);
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

// Get featured publications
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, ra.title_pt as axis_title_pt, ra.title_en as axis_title_en
       FROM publications p
       LEFT JOIN research_axes ra ON p.research_axis_id = ra.id
       WHERE p.featured = TRUE
       ORDER BY p.year DESC, p.published_at DESC NULLS LAST`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured publications:', error);
    res.status(500).json({ error: 'Failed to fetch featured publications' });
  }
});

// Get publications grouped by year
router.get('/by-year', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, ra.title_pt as axis_title_pt, ra.title_en as axis_title_en
       FROM publications p
       LEFT JOIN research_axes ra ON p.research_axis_id = ra.id
       ORDER BY p.year DESC, p.published_at DESC NULLS LAST`
    );

    // Group by year
    const grouped = {};
    result.rows.forEach(pub => {
      if (!grouped[pub.year]) {
        grouped[pub.year] = [];
      }
      grouped[pub.year].push(pub);
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching publications by year:', error);
    res.status(500).json({ error: 'Failed to fetch publications by year' });
  }
});

// Get single publication by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, ra.title_pt as axis_title_pt, ra.title_en as axis_title_en
       FROM publications p
       LEFT JOIN research_axes ra ON p.research_axis_id = ra.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching publication:', error);
    res.status(500).json({ error: 'Failed to fetch publication' });
  }
});

// Create publication
router.post('/', async (req, res) => {
  try {
    const {
      title_pt, title_en, authors, journal, year, doi, url, pdf_url,
      abstract_pt, abstract_en, keywords_pt, keywords_en, publication_type,
      research_axis_id, featured, published_at
    } = req.body;

    // Validate required fields
    if (!title_pt || !authors || !year) {
      return res.status(400).json({ error: 'title_pt, authors, and year are required' });
    }

    // Validate publication type if provided
    if (publication_type) {
      const validTypes = ['article', 'book', 'chapter', 'thesis', 'conference'];
      if (!validTypes.includes(publication_type)) {
        return res.status(400).json({
          error: 'Invalid publication_type. Must be one of: article, book, chapter, thesis, conference'
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO publications (
         title_pt, title_en, authors, journal, year, doi, url, pdf_url,
         abstract_pt, abstract_en, keywords_pt, keywords_en, publication_type,
         research_axis_id, featured, published_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        title_pt, title_en, authors, journal, year, doi, url, pdf_url,
        abstract_pt, abstract_en, keywords_pt, keywords_en, publication_type || 'article',
        research_axis_id, featured || false, published_at
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating publication:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid research_axis_id' });
    }
    res.status(500).json({ error: 'Failed to create publication' });
  }
});

// Update publication
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_pt, title_en, authors, journal, year, doi, url, pdf_url,
      abstract_pt, abstract_en, keywords_pt, keywords_en, publication_type,
      research_axis_id, featured, published_at
    } = req.body;

    // Validate publication type if provided
    if (publication_type) {
      const validTypes = ['article', 'book', 'chapter', 'thesis', 'conference'];
      if (!validTypes.includes(publication_type)) {
        return res.status(400).json({
          error: 'Invalid publication_type. Must be one of: article, book, chapter, thesis, conference'
        });
      }
    }

    const result = await pool.query(
      `UPDATE publications SET
         title_pt = COALESCE($1, title_pt),
         title_en = COALESCE($2, title_en),
         authors = COALESCE($3, authors),
         journal = COALESCE($4, journal),
         year = COALESCE($5, year),
         doi = COALESCE($6, doi),
         url = COALESCE($7, url),
         pdf_url = COALESCE($8, pdf_url),
         abstract_pt = COALESCE($9, abstract_pt),
         abstract_en = COALESCE($10, abstract_en),
         keywords_pt = COALESCE($11, keywords_pt),
         keywords_en = COALESCE($12, keywords_en),
         publication_type = COALESCE($13, publication_type),
         research_axis_id = COALESCE($14, research_axis_id),
         featured = COALESCE($15, featured),
         published_at = COALESCE($16, published_at),
         updated_at = NOW()
       WHERE id = $17
       RETURNING *`,
      [
        title_pt, title_en, authors, journal, year, doi, url, pdf_url,
        abstract_pt, abstract_en, keywords_pt, keywords_en, publication_type,
        research_axis_id, featured, published_at, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating publication:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid research_axis_id' });
    }
    res.status(500).json({ error: 'Failed to update publication' });
  }
});

// Delete publication
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM publications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found' });
    }

    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ error: 'Failed to delete publication' });
  }
});

export default router;
