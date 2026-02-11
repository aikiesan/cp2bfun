# CP2B Website

Official website for **CP2B - Centro Paulista de Estudos em Biogás e Bioprodutos** (São Paulo Center for Biogas and Bioproducts Studies).

A research center funded by FAPESP, based at NIPE/UNICAMP, dedicated to developing innovative solutions for the biogas chain in the State of São Paulo.

## 🚀 Features

### Frontend
- **Modern React Application**: Built with React 18 and Vite for optimal performance
- **Responsive Design**: Mobile-first design that works on all devices
- **Progressive Web App (PWA)**: Installable, works offline, and provides app-like experience
- **Internationalization**: Portuguese and English language support
- **Accessibility**: WCAG 2.2 compliant with keyboard navigation and screen reader support
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance Optimized**: Code splitting, lazy loading, and asset optimization

### Backend & Admin
- **Full-Stack Application**: Node.js/Express backend with PostgreSQL database
- **Admin Panel**: Complete content management system for news, publications, projects, team members
- **Featured Content**: Dynamic homepage content management
- **Contact System**: Form submissions stored in database
- **File Uploads**: Image and document upload with secure storage
- **API-First**: RESTful API for all dynamic content

## 📋 Prerequisites

### For Frontend Only
- Node.js 20.x or higher
- npm 10.x or higher

### For Full Stack (Frontend + Backend)
- Node.js 20.x or higher
- PostgreSQL 15 or higher
- npm 10.x or higher

## 🛠️ Installation

### Quick Start (Frontend Only)

```bash
# Clone the repository
git clone https://github.com/aikiesan/cp2bfun.git

# Navigate to project directory
cd cp2bfun/cp2b_web

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Full Stack Setup (Frontend + Backend + Database)

For detailed setup instructions including backend and database configuration, see:
📖 **[QUICK_START.md](./QUICK_START.md)** - Complete local development setup guide

**Quick overview:**

```bash
# 1. Set up PostgreSQL database
# 2. Configure backend/.env file
# 3. Start backend server (port 3001)
# 4. Start frontend dev server (port 5173)
```

## 🐳 Docker Development

Run the entire stack (frontend + backend + database) with Docker:

```bash
cd cp2b_web

# Development mode (hot reload)
docker-compose up dev

# Production mode (optimized build)
docker-compose up prod
```

See [CLAUDE.md](./CLAUDE.md) for Docker configuration details.

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 📱 PWA Support

This application is a Progressive Web App and can be installed on devices:

- **Desktop**: Click the install icon in the address bar
- **Mobile**: Use "Add to Home Screen" from browser menu
- **Offline Support**: Core functionality available without internet connection
- **Auto-updates**: Service worker automatically updates the app

### PWA Features
- Offline-first caching strategy
- Background sync for data updates
- Push notifications (ready for implementation)
- App-like experience with no browser UI

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Bootstrap 5** - Component library
- **React Bootstrap** - React components
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Helmet Async** - Document head management
- **Vite PWA Plugin** - Progressive Web App support

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL 15** - Relational database
- **Multer** - File upload handling
- **pg** - PostgreSQL client for Node.js

### Deployment
- **Vercel** - Frontend hosting (current)
- **Apache2** - Web server (production VM)
- **Docker** - Local development and containerization
- **Systemd** - Service management (production)

### Development
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting (zero warnings policy)
- **jsdom** - DOM testing environment

## 📁 Project Structure

```
cp2b_website/
├── cp2b_web/                    # Main application directory
│   ├── src/                     # Frontend source code
│   │   ├── components/          # Reusable React components
│   │   │   ├── FeaturedNews.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── __tests__/       # Component tests
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── News.jsx
│   │   │   ├── Team.jsx
│   │   │   └── admin/           # Admin panel pages
│   │   ├── context/             # React context (i18n)
│   │   │   └── LanguageContext.jsx
│   │   ├── data/                # Content and translations
│   │   │   └── content.js       # Centralized i18n content
│   │   ├── services/            # API services
│   │   │   └── api.js           # Backend API client
│   │   ├── App.jsx              # Root component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Application entry point
│   ├── backend/                 # Backend API
│   │   ├── src/
│   │   │   ├── routes/          # API routes
│   │   │   ├── db/              # Database
│   │   │   │   ├── schema.sql   # Database schema
│   │   │   │   ├── seed.sql     # Seed data
│   │   │   │   └── migrations/  # Database migrations
│   │   │   ├── middleware/      # Express middleware
│   │   │   └── index.js         # Backend entry point
│   │   ├── uploads/             # User uploaded files
│   │   └── .env                 # Environment variables
│   ├── public/                  # Static assets
│   │   └── assets/              # Images, videos, etc.
│   ├── dist/                    # Production build (generated)
│   ├── docker-compose.yml       # Docker configuration
│   ├── nginx.conf               # Nginx config (reference)
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Dependencies and scripts
├── deployment/                  # Production deployment files
│   ├── apache2/                 # Apache configuration
│   │   └── cp2b.conf            # Virtual host config
│   ├── systemd/                 # Service configurations
│   │   └── cp2b-backend.service # Backend systemd service
│   ├── db/                      # Database setup
│   │   └── setup-postgres.sh    # DB initialization script
│   ├── deploy.sh                # Automated deployment
│   ├── backup.sh                # Backup script
│   ├── rollback.sh              # Rollback script
│   ├── health-check.sh          # Health monitoring
│   ├── .env.production          # Production env template
│   └── VM_SETUP_GUIDE.md        # Production setup guide
├── docs/                        # Documentation
│   ├── QUICK_START.md           # Local development setup
│   ├── RUN_IT_NOW.md            # Quick testing guide
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── ADMIN_*.md               # Admin documentation
├── CLAUDE.md                    # Claude Code instructions
└── README.md                    # This file
```

## 🌐 Deployment

### Frontend-Only Deployment (Vercel - Current)

The frontend is currently deployed on Vercel with automatic deployments from the `main` branch:

```bash
# Deploy to Vercel
vercel --prod
```

The `vercel.json` configuration handles routing for the SPA.

**Live URL**: https://cp2b.vercel.app *(or your custom domain)*

### Full-Stack Production Deployment (VM with Apache2)

For deploying the complete application (frontend + backend + database) on a production server:

📖 **See [deployment/VM_SETUP_GUIDE.md](./deployment/VM_SETUP_GUIDE.md)** for comprehensive step-by-step instructions.

**Quick overview for Debian 12 VM:**

1. **Initial Setup** (~30 minutes)
   ```bash
   # Install dependencies (Node.js, PostgreSQL, Apache2)
   # Set up database
   # Configure backend service
   # Build and deploy frontend
   # Configure Apache2 virtual host
   ```

2. **Future Deployments** (~2 minutes)
   ```bash
   cd /var/www/cp2b/repo/deployment
   sudo ./deploy.sh
   ```

**Deployment includes:**
- Apache2 web server with reverse proxy
- Backend running as systemd service
- PostgreSQL database
- Automated backups
- Health monitoring
- SSL/HTTPS support
- Rollback capability

### Deployment Scripts

All production deployment scripts are in the `deployment/` directory:

- `deploy.sh` - Automated deployment script
- `backup.sh` - Database and file backup
- `rollback.sh` - Rollback to previous version
- `health-check.sh` - System health monitoring
- `db/setup-postgres.sh` - Database initialization
- `apache2/cp2b.conf` - Apache virtual host config
- `systemd/cp2b-backend.service` - Backend service config

## ♿ Accessibility

This website follows WCAG 2.2 guidelines:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators
- Skip to content link
- ARIA labels and roles
- Responsive text sizing

## 🔧 Configuration

### Environment Variables

**Backend** (`cp2b_web/backend/.env`):

```bash
# Database
DATABASE_URL=postgres://username:password@localhost:5432/cp2b

# Server
PORT=3001
NODE_ENV=development  # or 'production'

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Security
SESSION_SECRET=your-random-secret-here
JWT_SECRET=another-random-secret

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

For production environment template, see [deployment/.env.production](./deployment/.env.production)

### PWA Configuration

PWA settings are in `cp2b_web/vite.config.js`. Customize:
- App name and description
- Theme colors
- Icons
- Caching strategies
- Offline fallback

## 🔐 Admin Panel

Access the admin panel at: `/admin`

**Default credentials** (change in production!):
- Username: `admin`
- Password: `admin123`

**Admin features:**
- ✅ Content management (news, publications, projects)
- ✅ Team member management
- ✅ Partner management
- ✅ Featured content selection
- ✅ Contact message viewing
- ✅ Research axes management

## 📊 Database

### Schema

Main tables:
- `team` - Team members with photos and bios
- `news` - News articles (bilingual)
- `publications` - Scientific publications
- `projects` - Research projects
- `partners` - Partner organizations (grouped)
- `axes` - Research axes and methodologies
- `contact_messages` - Contact form submissions
- `featured_content` - Homepage featured items (A, B, C slots)
- `page_content` - Dynamic page content (bilingual)

See `cp2b_web/backend/src/db/schema.sql` for complete schema.

### Backups

**Automated backups** (production):
```bash
# Manual backup
sudo /var/www/cp2b/repo/deployment/backup.sh

# Schedule daily backups (add to crontab)
0 2 * * * /var/www/cp2b/repo/deployment/backup.sh >> /var/log/cp2b-backup.log 2>&1
```

Backups include:
- PostgreSQL database dump
- Uploaded files
- Configuration files

**Rollback** to previous version:
```bash
sudo /var/www/cp2b/repo/deployment/rollback.sh
```

## 📄 License

[Add your license information here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**CP2B - NIPE/UNICAMP**

- Address: Rua Cora Coralina, 330, Campinas, SP 13083-896
- Website: [https://cp2b.nipe.unicamp.br/](https://cp2b.nipe.unicamp.br/)
- LinkedIn: [linkedin.com/company/cp2b-biogas](https://www.linkedin.com/company/cp2b-biogas/)

## 🙏 Acknowledgments

- Funded by FAPESP (Process 2021/10413-6)
- Hosted at NIPE/UNICAMP
- Built with open-source technologies
