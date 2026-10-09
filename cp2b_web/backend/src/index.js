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
import boletinsRoutes from './routes/boletins.js';
import pageSettingsRoutes from './routes/pageSettings.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import { adminGate, adminLocked, authEnabled, isAdminRequest, PUBLIC_WRITES } from './middleware/auth.js';
import { applyTrustProxy } from './middleware/trustProxy.js';
import { initializeDatabase } from './db/init.js';
import { startNewsletterReportScheduler } from './jobs/newsletterReport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// O IP do visitante chega pelo X-Forwarded-For do Apache (ver trustProxy.js).
applyTrustProxy(app);

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
// Corpo JSON. O padrão do Express é 100 KB, e o HTML que sai do editor de
// texto do painel passa disso com folga — basta uma imagem colada no texto,
// que o Quill guarda em base64. A notícia voltava 500 "Something went wrong!"
// e o editor perdia o envio. O limite maior vale só para quem pode editar: as
// rotas públicas de escrita (contato, newsletter) seguem com os 100 KB.
const adminJson = express.json({ limit: '25mb' });
const publicJson = express.json();
app.use((req, res, next) => (isAdminRequest(req) ? adminJson : publicJson)(req, res, next));
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
if (adminLocked()) {
  console.error('⛔ ADMIN_PASSWORD is not set and NODE_ENV=production — the admin API is locked until it is set.');
} else if (!authEnabled()) {
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
app.use('/api/boletins', boletinsRoutes);
app.use('/api/page-settings', pageSettingsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  // Corpo grande demais ou JSON malformado é erro do pedido, não do servidor:
  // devolve o motivo para o painel mostrar a quem está editando.
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'O conteúdo é grande demais para salvar. Se houver imagens coladas no texto, '
        + 'remova-as e insira-as pelo botão de imagem do editor.',
    });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Requisição inválida: o corpo não é um JSON válido.' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// O Express 4 não repassa ao handler de erro a promessa rejeitada de uma
// rota async. Uma rejeição fora do try (um número no lugar de texto no corpo,
// por exemplo) virava rejeição não tratada, e o Node encerrava o processo:
// uma requisição anônima derrubava a API. Registra e segue.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

// Server startup with automated database migration
async function startServer() {
  if (process.env.DATABASE_URL) {
    try {
      console.log('🔄 Checking and applying database migrations...');
      await initializeDatabase();
    } catch (err) {
      console.error('❌ Failed to run database migrations on boot:', err);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`CP2b Backend running on port ${PORT}`);
  });
  startNewsletterReportScheduler();
  return server;
}

startServer();

export { app, startServer };
