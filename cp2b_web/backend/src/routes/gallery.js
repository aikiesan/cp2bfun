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
router.post('/', upload.array('images', 20), async (req, res) => {
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }


  const { title, date } = req.body;

  // 2. Validação de título com loop de limpeza
  if (!title) {
    req.files.forEach(f => fs.unlink(f.path, () => {}));
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }

  // 3. Início da Transação
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Inicia a transação

    const savedPhotos = [];

    // 4. Loop para inserir cada arquivo no banco
    for (const file of req.files) {
      const url = `/uploads/gallery/${file.filename}`;
      
      const result = await client.query(
        `INSERT INTO gallery (url, title, date, filename)
         VALUES ($1, $2, $3, $4)
         RETURNING id, url, title, date, created_at`,
        [url, title, date || null, file.filename]
      );
      
      savedPhotos.push(result.rows[0]);
    }

    await client.query("COMMIT"); // Confirma todas as inserções
    
    // Retorna a lista de fotos salvas com sucesso
    res.status(201).json(savedPhotos);

  } catch (error) {
    await client.query("ROLLBACK"); // Desfaz tudo em caso de erro
    
    // Remove todos os arquivos do disco
    req.files.forEach(f => fs.unlink(f.path, () => {}));
    
    console.error('Error saving gallery photos:', error);
    res.status(500).json({ error: 'Failed to save gallery photos' });
  } finally {
    client.release(); // Sempre devolve o cliente para o pool
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
