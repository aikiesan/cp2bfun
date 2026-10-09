import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure news-images subdirectory exists
const newsImagesDir = path.join(uploadsDir, 'news-images');
if (!fs.existsSync(newsImagesDir)) {
  fs.mkdirSync(newsImagesDir, { recursive: true });
}

// Ensure press-kit subdirectory exists
const pressKitDir = path.join(uploadsDir, 'press-kit');
if (!fs.existsSync(pressKitDir)) {
  fs.mkdirSync(pressKitDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Extensão e tipo conferidos por inteiro: sem as âncoras, "foto.xpngx" ou um
// tipo qualquer que contivesse "png" passavam.
const fileFilter = (req, file, cb) => {
  const extname = /^\.(jpe?g|png|gif|webp)$/.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^image\/(jpeg|png|gif|webp)$/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Formato não aceito. Use JPG, PNG, GIF ou WebP.'));
};

// Erro do multer (arquivo grande demais, formato recusado) vira 400 com o
// motivo, como já faz a galeria. Sem isto ele seguia para o handler global do
// index.js, que responde 500 genérico — o painel não tinha como dizer ao
// editor que a foto passava do limite.
const withUploadErrors = (middleware, maxMb) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `Arquivo grande demais: o limite é ${maxMb} MB.` });
    }
    return res.status(400).json({ error: err.message || 'Falha ao processar o arquivo.' });
  });
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure multer for news images (larger file size limit for GIFs)
const newsImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const newsImageUpload = multer({
  storage: newsImageStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for news images (GIFs can be large)
});

// Upload single image
router.post('/image', withUploadErrors(upload.single('image'), 5), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Upload news image (for rich text editor)
router.post('/news-image', withUploadErrors(newsImageUpload.single('image'), 10), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/news-images/${req.file.filename}`;
  res.json({ imageUrl });
});

// Upload press kit file (PDF, ZIP, PPTX, etc.)
const pressKitFileFilter = (req, file, cb) => {
  // Sem âncoras, .docm e .pptm (com macros) passavam por conter "doc" e "ppt".
  const extname = /^\.(pdf|zip|pptx?|docx?)$/.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb(new Error('Formato não aceito. Use PDF, ZIP, PPT, PPTX, DOC ou DOCX.'));
};

const pressKitStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, pressKitDir); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const pressKitUpload = multer({
  storage: pressKitStorage,
  fileFilter: pressKitFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post('/file', withUploadErrors(pressKitUpload.single('file'), 50), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/press-kit/${req.file.filename}`, filename: req.file.filename });
});

// Delete image
router.delete('/image/:filename', (req, res) => {
  const { filename } = req.params;
  // Só um nome de arquivo, nunca um caminho: "..%2F..%2Farquivo" chegava
  // decodificado e apagava fora de uploads/.
  if (path.basename(filename) !== filename || filename.startsWith('.')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  const filepath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.unlinkSync(filepath);
  res.json({ message: 'File deleted successfully' });
});

export default router;
