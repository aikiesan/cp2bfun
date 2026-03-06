import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db/connection.js';

const router = Router();

// --- DIRETÓRIO DE UPLOADS ---
const galleryDir = path.join('uploads', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// --- CONFIGURAÇÃO DO MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, galleryDir);
  },
  filename: (req, file, cb) => {
    // Prefixo de timestamp garante nomes únicos e ordenaçao natural
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const validExt  = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) return cb(null, true);
  cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ============================================================
// GET /api/gallery — lista todas as fotos, mais recentes primeiro
// ============================================================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, url, title, date, created_at FROM gallery ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// ============================================================
// POST /api/gallery — faz upload da imagem e cria registro no banco
// Campos esperados no FormData: image (arquivo), title (texto), date (texto)
// ============================================================
router.post('/', upload.single('image'), async (req, res) => {
  // Multer já processou o arquivo; valida campos de texto
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo de imagem foi enviado.' });
  }

  const { title, date } = req.body;

  if (!title) {
    // Remove o arquivo já salvo para não deixar lixo no disco
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }

  // Monta a URL pública acessível pelo frontend
  const url = `/uploads/gallery/${req.file.filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO gallery (url, title, date, filename)
       VALUES ($1, $2, $3, $4)
       RETURNING id, url, title, date, created_at`,
      [url, title, date || null, req.file.filename]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Remove arquivo do disco se a inserção no banco falhar
    fs.unlink(req.file.path, () => {});
    console.error('Error saving gallery photo:', error);
    res.status(500).json({ error: 'Failed to save gallery photo' });
  }
});

// ============================================================
// DELETE /api/gallery/:id — remove registro do banco e arquivo do disco
// ============================================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o filename antes de deletar para poder remover do disco
    const found = await pool.query(
      'SELECT filename FROM gallery WHERE id = $1',
      [id]
    );

    if (found.rows.length === 0) {
      return res.status(404).json({ error: 'Foto não encontrada.' });
    }

    const { filename } = found.rows[0];

    // Remove registro do banco
    await pool.query('DELETE FROM gallery WHERE id = $1', [id]);

    // Remove arquivo físico (falha silenciosa se já não existir)
    const filepath = path.join(galleryDir, filename);
    fs.unlink(filepath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.warn('Could not delete gallery file:', filepath, err.message);
      }
    });

    res.json({ message: 'Foto removida com sucesso.' });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    res.status(500).json({ error: 'Failed to delete gallery photo' });
  }
});

export default router;
