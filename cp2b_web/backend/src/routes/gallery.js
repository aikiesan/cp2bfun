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
// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    // Adicionamos album_id e is_cover no SELECT
    const result = await pool.query(
      'SELECT id, url, title, date, album_id, is_cover, created_at FROM gallery ORDER BY created_at DESC'
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
// Rota POST atualizada para aceitar múltiplos campos
router.post('/', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 20 }]), async (req, res) => {  
  
  // CORREÇÃO 1: req.files agora é um objeto
  if (!req.files || !req.files.cover || !req.files.images) {
    return res.status(400).json({ error: 'É obrigatório enviar a foto de capa e as imagens internas.' });
  }

  const { title, date } = req.body;

  // Função auxiliar para limpar arquivos do disco caso dê erro
  const clearUploadedFiles = () => {
    Object.values(req.files).flat().forEach(f => fs.unlink(f.path, () => {}));
  };

  if (!title) {
    clearUploadedFiles();
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }

  // CORREÇÃO 2: Criando o ID do álbum
  const albumId = 'album-' + Date.now() + '-' + Math.round(Math.random() * 1e9);

  const client = await pool.connect();
  try {
    await client.query("BEGIN"); 
    const savedPhotos = [];

    // Salva a capa
    const coverFile = req.files.cover[0];
    const coverUrl = `/uploads/gallery/${coverFile.filename}`;
    const coverResult = await client.query(
      `INSERT INTO gallery (url, title, date, filename, album_id, is_cover) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [coverUrl, title, date || null, coverFile.filename, albumId, true]
    );
    savedPhotos.push(coverResult.rows[0]);

    // Salva as fotos internas
    for (const file of req.files.images) {
      const imgUrl = `/uploads/gallery/${file.filename}`;
      const imgResult = await client.query(
        `INSERT INTO gallery (url, title, date, filename, album_id, is_cover) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [imgUrl, title, date || null, file.filename, albumId, false]
      );
      savedPhotos.push(imgResult.rows[0]);
    }

    await client.query("COMMIT"); 
    res.status(201).json(savedPhotos);

  } catch (error) {
    await client.query("ROLLBACK"); 
    clearUploadedFiles();
    console.error('Error saving gallery photos:', error);
    res.status(500).json({ error: 'Failed to save gallery photos' });
  } finally {
    client.release(); 
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
