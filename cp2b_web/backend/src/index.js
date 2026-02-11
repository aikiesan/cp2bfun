import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './routes/news.js';
import contentRoutes from './routes/content.js';
import teamRoutes from './routes/team.js';
import axesRoutes from './routes/axes.js';
import uploadRoutes from './routes/upload.js';
import contactRoutes from './routes/contact.js';
import partnersRoutes from './routes/partners.js';
import publicationsRoutes from './routes/publications.js';
import eventsRoutes from './routes/events.js';
import projectsRoutes from './routes/projects.js';
import featuredRoutes from './routes/featured.js';
import videosRoutes from './routes/videos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/axes', axesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/featured', featuredRoutes);
app.use('/api/videos', videosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`CP2B Backend running on port ${PORT}`);
});
