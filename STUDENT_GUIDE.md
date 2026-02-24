# CP2B Website — Student Guide
> Onboarding reference for the Computer Engineering graduate student.

---

## 1. What Is This Project?

**CP2B** (Centro Paulista de Estudos em Biogás e Bioprodutos) is an institutional website for a FAPESP-funded research center at UNICAMP. It is a **bilingual (Portuguese / English) Single Page Application (SPA)** served by React and backed by a Node.js REST API with a PostgreSQL database.

---

## 2. Tech Stack at a Glance

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite 5 | Component model, fast HMR dev server |
| UI | React Bootstrap 5 | Pre-built responsive components |
| Routing | React Router v6 | Client-side navigation without page reloads |
| Animations | Framer Motion | Entrance transitions on page load |
| Backend | Node.js + Express | REST API for dynamic content |
| Database | PostgreSQL 15 | Relational, bilingual content storage |
| Containerization | Docker + Docker Compose | Consistent dev/prod environments |
| Deployment | Vercel (frontend) + Docker VM (backend) | |

---

## 3. Repository Layout

```
cp2b_website/
├── CLAUDE.md               ← instructions for Claude Code (AI assistant)
├── STUDENT_GUIDE.md        ← this file
├── QA_GUIDE.md             ← quality assurance reference
└── cp2b_web/
    ├── src/                ← all React source code
    │   ├── App.jsx         ← root: router + layout (Header + Footer wrapping)
    │   ├── main.jsx        ← React entry point (mounts App into index.html)
    │   ├── index.css       ← global styles and CSS variables
    │   ├── components/     ← shared UI (Header, Footer, sidebars, admin widgets)
    │   ├── context/
    │   │   └── LanguageContext.jsx  ← global PT/EN state
    │   ├── data/
    │   │   └── content.js  ← ALL static and fallback content (bilingual)
    │   ├── pages/          ← one file per route; admin pages in pages/admin/
    │   └── services/
    │       └── api.js      ← every HTTP call to the backend lives here
    ├── backend/
    │   └── src/
    │       ├── index.js        ← Express server entry (registers all routes)
    │       ├── routes/         ← one file per resource (news, events, projects…)
    │       └── db/             ← PostgreSQL schema, migrations, connection pool
    ├── public/assets/      ← images, logos, videos (served as static files)
    ├── docker-compose.yml  ← orchestrates frontend + backend + database
    ├── Dockerfile          ← builds the production Nginx image
    └── nginx.conf          ← Nginx config for the production container
```

---

## 4. How Routing Works

All routes are declared in `src/App.jsx`. There are two groups:

### Public routes (with Header + Footer)
```
/                    → Home.jsx
/sobre               → About.jsx
/sobre/governanca    → about/Governance.jsx
/sobre/transparencia → about/Transparency.jsx
/sobre/parceiros     → about/PartnersPage.jsx
/eixos               → Research.jsx        (8 research axes)
/equipe              → Team.jsx
/noticias            → News.jsx
/noticias/:slug      → NewsDetail.jsx
/publicacoes         → Publications.jsx
/projetos            → Projects.jsx
/projetos/:slug      → ProjectDetail.jsx
/eventos             → Events.jsx
/contato             → Contact.jsx
/oportunidades       → Opportunities.jsx
/na-midia            → Media.jsx
/forum-paulista      → ForumPaulista.jsx
```

### Admin routes (`/admin/*`, no Header/Footer)
Full CRUD management for: news, projects, publications, events, videos, team, partners, axes, featured content, page content, forum / meetups.

### Vercel SPA rewrite
`vercel.json` rewrites every path to `index.html` so React Router handles navigation entirely in the browser.

---

## 5. Internationalization (i18n)

The site supports Portuguese and English. The pattern has three parts:

**Step 1 — Global state** (`src/context/LanguageContext.jsx`)
```jsx
const { language, setLanguage } = useLanguage(); // 'pt' | 'en'
```
The chosen language is persisted to `localStorage`.

**Step 2 — Content store** (`src/data/content.js`)
Every piece of text has a PT and EN version:
```js
export const menuLabels = {
  pt: { team: 'Equipe', events: 'Eventos', ... },
  en: { team: 'Team',   events: 'Events',  ... }
};
```

**Step 3 — Consumption in pages**
```jsx
import { menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const { language } = useLanguage();
const t = menuLabels[language]; // 't' is now the correct language object
<h1>{t.events}</h1>
```

When you add new UI text, always add both `pt` and `en` keys to `content.js`.

---

## 6. The API Layer (`src/services/api.js`)

The file exports:
- A default `api` object (a lightweight fetch wrapper) — used by admin and some pages directly via `api.get('/endpoint')`.
- Named helper functions — used by public pages, e.g. `fetchNews()`, `fetchProjects()`.

The base URL is configured via the environment variable `VITE_API_URL`.

**Adding a new API call:**
```js
// In api.js
export const fetchWidgets = async () => {
  try {
    const response = await api.get('/widgets');
    return response.data;
  } catch (error) {
    return null; // page will fall back to static content
  }
};
```

---

## 7. Common Page Patterns

Every public page follows one or more of these patterns:

### Pattern A — Fetch from API with static fallback
```jsx
useEffect(() => {
  const load = async () => {
    const data = await fetchSomething();
    setItems(data?.length ? data : staticFallback[language]);
    setLoading(false);
  };
  load();
}, [language]);

if (loading) return <Spinner />;
```

### Pattern B — Language-aware rendering
```jsx
const { language } = useLanguage();
const t = someLabels[language];
const items = someItems[language];
```

### Pattern C — Framer Motion entrance animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

---

## 8. How to Add a Feature (Step-by-Step)

**Example: add a new public page `/mapa`**

1. Create `src/pages/Map.jsx` (use an existing page as template).
2. Register the route in `src/App.jsx` inside the public `<Routes>` block:
   ```jsx
   <Route path="/mapa" element={<Map />} />
   ```
3. Add import at the top of `App.jsx`:
   ```jsx
   import Map from './pages/Map';
   ```
4. Add the nav label to `menuLabels` in `src/data/content.js`:
   ```js
   pt: { ..., map: 'Mapa' },
   en: { ..., map: 'Map'  },
   ```
5. Add the nav link in `src/components/Header.jsx`:
   ```jsx
   <Nav.Link as={Link} to="/mapa">{t.map}</Nav.Link>
   ```
6. If data comes from the backend:
   - Add a route file in `backend/src/routes/map.js`
   - Register it in `backend/src/index.js`
   - Add a `fetchMap()` function to `src/services/api.js`

---

## 9. Running the Project Locally

All commands are run from the `cp2b_web/` directory.

```bash
# Start everything with Docker (recommended)
cd cp2b_web
docker-compose up dev        # dev server at http://localhost:5173

# Or without Docker
npm install
npm run dev                  # frontend only (backend won't work)

# Run linter (zero warnings policy)
npm run lint

# Production build
npm run build
```

---

## 10. Key Files Reference

| File | What to edit there |
|---|---|
| `src/data/content.js` | Any new text / translations |
| `src/App.jsx` | New routes |
| `src/components/Header.jsx` | New nav links |
| `src/services/api.js` | New API calls |
| `backend/src/routes/*.js` | Backend endpoints for a resource |
| `backend/src/index.js` | Register new route files |
| `public/assets/` | Images and static files |
