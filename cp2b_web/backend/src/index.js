import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import pageSettingsRoutes from './routes/pageSettings.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import { adminGate, authEnabled, PUBLIC_WRITES } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  // Uploaded gallery/press-kit images are public and served from a
  // different origin in local dev (Vite :5173 -> API :3001); the default
  // same-origin CORP would silently break <img> loads there.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rate-limit the handful of routes an unauthenticated visitor can write to
// (contact form, newsletter signup, event registration, meetup requests) —
// everything else is already behind adminGate. Reuses the same allowlist so
// a new public route only needs to be added in one place.
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

app.use('/api', (req, res, next) => {
  const isPublicWrite = PUBLIC_WRITES.some((w) => w.method === req.method && w.pattern.test(req.path));
  if (isPublicWrite) return publicWriteLimiter(req, res, next);
  next();
});

// Authentication: login/status are public; everything after passes the gate.
app.use('/api/auth', authRoutes);
app.use('/api', adminGate);
if (!authEnabled()) {
  console.warn('⚠️  ADMIN_PASSWORD is not set — the admin API is unprotected. Set it in production.');
}

// Routes
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
app.use('/api/page-settings', pageSettingsRoutes);
app.use('/api/settings', settingsRoutes);

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
  console.log(`CP2b Backend running on port ${PORT}`);
});
