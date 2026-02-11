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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed'));
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
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Upload news image (for rich text editor)
router.post('/news-image', newsImageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/news-images/${req.file.filename}`;
  res.json({ imageUrl });
});

// Delete image
router.delete('/image/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.unlinkSync(filepath);
  res.json({ message: 'File deleted successfully' });
});

export default router;
