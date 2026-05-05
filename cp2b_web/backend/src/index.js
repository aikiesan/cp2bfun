import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requireAuth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import contentRoutes from './routes/content.js';
import teamRoutes from './routes/team.js';
import axesRoutes from './routes/axes.js';
import uploadRoutes from './routes/upload.js';
import contactRoutes from './routes/contact.js';
import partnersRoutes from './routes/partners.js';
import publicationsRoutes from './routes/publications.js';
import projectsRoutes from './routes/projects.js';
import featuredRoutes from './routes/featured.js';
import videosRoutes from './routes/videos.js';
import participantsRoutes from './routes/participants.js';
import meetupSlotsRoutes from './routes/meetup-slots.js';
import meetupRequestsRoutes from './routes/meetup-requests.js';
import galleryRoutes from './routes/gallery.js';
import microscopioRoutes from './routes/microscopio.js';
import opportunitiesRoutes from './routes/opportunities.js';
import eventsRoutes from './routes/events.js';
import newsletterRoutes from './routes/newsletter.js';
import pressKitRoutes from './routes/presskit.js';
import podcastRoutes from './routes/podcast.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — no open fallback to localhost in production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://cp2b.unicamp.br',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rate limiters
const publicWriteLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits before routes
app.use('/api/auth/login', loginLimit);
app.post('/api/newsletter/subscribe', publicWriteLimit);
app.post('/api/contact', publicWriteLimit);
app.post('/api/participants', publicWriteLimit);
app.post('/api/meetup-requests', publicWriteLimit);

// Public write paths — everything else requires auth
const PUBLIC_WRITE_PATHS = [
  '/api/auth/login',
  '/api/newsletter/subscribe',
  '/api/newsletter/unsubscribe',
  '/api/contact',
  '/api/participants',
  '/api/meetup-requests',
  '/api/meetup-requests/confirm',
];

app.use((req, res, next) => {
  if (req.method === 'GET') return next();
  const isPublic = PUBLIC_WRITE_PATHS.some(p => req.path === p || req.path.startsWith(p + '/'));
  if (isPublic) return next();
  requireAuth(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/axes', axesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/featured', featuredRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/meetup-slots', meetupSlotsRoutes);
app.use('/api/meetup-requests', meetupRequestsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/microscopio', microscopioRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/press-kit', pressKitRoutes);
app.use('/api/podcast', podcastRoutes);

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
