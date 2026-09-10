import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/fonts.css';
import './styles/tokens.css';
import './index.css';
import './styles/design-system.css';
import { LanguageProvider } from './context/LanguageContext';
import { PageStatusProvider, usePageStatus } from './context/PageStatusContext';
import SeoHead from './components/SeoHead';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
  alternateName: 'CP2b',
  url: 'https://cp2b.unicamp.br',
  logo: 'https://cp2b.unicamp.br/assets/logos/cp2b-logo-og.png',
  description: 'Centro de pesquisa vinculado ao NIPE-UNICAMP dedicado ao estudo de biogás, bioprodutos e políticas públicas para energia renovável no Estado de São Paulo.',
  email: 'administrativo@cp2b.unicamp.br',
  telephone: '+55-19-3521-1244',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Cora Coralina, 330',
    addressLocality: 'Campinas',
    addressRegion: 'SP',
    postalCode: '13083-896',
    addressCountry: 'BR',
  },
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: 'Universidade Estadual de Campinas',
    alternateName: 'UNICAMP',
    url: 'https://www.unicamp.br',
  },
  sameAs: [
    'https://www.instagram.com/centro_biogas_cp2b/',
    'https://br.linkedin.com/company/centro-paulista-de-estudos-em-biog%C3%A1s-e-bioprodutos-cp2b',
    'https://www.youtube.com/@nipeunicamp4034',
  ],
  knowsAbout: ['biogás', 'bioprodutos', 'energia renovável', 'resíduos sólidos', 'saneamento', 'políticas públicas', 'biogas', 'bioproducts', 'renewable energy'],
};

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MoleculeField from './components/MoleculeField';
import SocialSidebar from './components/SocialSidebar';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Solucoes from './pages/Solucoes';
import Team from './pages/Team';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import OportunidadesDetail from './pages/OportunidadesDetail';
import MicroscopioDetail from './pages/MicroscopioDetail';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Opportunities from './pages/Opportunities';
import Publications from './pages/Publications';
import Projects from './pages/Projects';
import Microscopio from './pages/Microscopio';
import PressKit from './pages/PressKit';
import Podcast from './pages/Podcast';
import Boletins from './pages/Boletins';
import Newsletter from './pages/Newsletter';
import Others from './pages/Others';
import NotFound from './pages/NotFound';
import Manutencao from './pages/Manutencao';
import ForumPaulista from './pages/ForumPaulista';
import ConfirmarMeetup from './pages/ConfirmarMeetup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import AlbumView from './pages/AlbumView';

// About sub-pages
import Governance from './pages/about/Governance';
import Indicators from './pages/about/Indicators';
import Transparency from './pages/about/Transparency';
import PartnersPage from './pages/about/PartnersPage';

// Painel administrativo: um único chunk carregado sob demanda em /admin.
// Ver src/AdminApp.jsx para o motivo.
const AdminApp = lazy(() => import('./AdminApp'));

// Placeholder enquanto o chunk do admin é baixado. role="status" + aria-live
// fazem o leitor de tela anunciar o carregamento em vez de ficar em silêncio.
const AdminLoading = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      color: '#1E3E4C',
    }}
  >
    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
    Carregando o painel…
  </div>
);

// Route guard: redirects to /manutencao when page is disabled
const GuardedRoute = ({ pageKey, element }) => {
  const { isPageEnabled } = usePageStatus();
  return isPageEnabled(pageKey) ? element : <Navigate to="/manutencao" replace />;
};

// Legacy album URL redirect: /gallery/:albumId -> /galeria/:albumId
// (the public gallery list lives at /galeria; this unifies the previously
// mismatched detail-page prefix so both use the same Portuguese route).
const LegacyAlbumRedirect = () => {
  const { albumId } = useParams();
  return <Navigate to={`/galeria/${albumId}`} replace />;
};

function App() {
  return (
    <LanguageProvider>
      <PageStatusProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SeoHead jsonLd={organizationJsonLd} />
        <ScrollToTop />
        <SocialSidebar />
        <CookieConsent />
        <Routes>
          {/* Admin: chunk próprio, sem Header/Footer */}
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminApp />
              </Suspense>
            }
          />

          {/* Public Routes - With Header/Footer */}
          <Route
            path="*"
            element={
              <>
                <Header />
                {/* Ambient CH4 field: mounted once so it persists across
                    route changes, at full density on Home and lower
                    elsewhere. See MoleculeField for the reasoning. */}
                <MoleculeField />
                <ErrorBoundary>
                <main id="main-content" style={{ minHeight: '80vh' }}>
                  <Routes>
                    <Route path="/" element={<GuardedRoute pageKey="home" element={<Home />} />} />
                    <Route path="/sobre" element={<GuardedRoute pageKey="sobre" element={<About />} />} />
                    <Route path="/sobre/governanca" element={<GuardedRoute pageKey="governanca" element={<Governance />} />} />
                    <Route path="/sobre/indicadores" element={<GuardedRoute pageKey="indicadores" element={<Indicators />} />} />
                    <Route path="/sobre/transparencia" element={<GuardedRoute pageKey="transparencia" element={<Transparency />} />} />
                    <Route path="/sobre/parceiros" element={<GuardedRoute pageKey="parceiros" element={<PartnersPage />} />} />
                    <Route path="/eixos" element={<GuardedRoute pageKey="eixos" element={<Research />} />} />
                    <Route path="/solucoes" element={<GuardedRoute pageKey="solucoes" element={<Solucoes />} />} />
                    <Route path="/equipe" element={<GuardedRoute pageKey="equipe" element={<Team />} />} />
                    <Route path="/noticias" element={<GuardedRoute pageKey="noticias" element={<News />} />} />
                    <Route path="/noticias/:slug" element={<GuardedRoute pageKey="noticias" element={<NewsDetail />} />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/oportunidades" element={<GuardedRoute pageKey="oportunidades" element={<Opportunities />} />} />
                    <Route path="/oportunidades/:slug" element={<GuardedRoute pageKey="oportunidades" element={<OportunidadesDetail />} />} />
                    <Route path="/publicacoes" element={<GuardedRoute pageKey="publicacoes" element={<Publications />} />} />
                    <Route path="/microscopio" element={<GuardedRoute pageKey="microscopio" element={<Microscopio />} />} />
                    <Route path="/microscopio/:slug" element={<GuardedRoute pageKey="microscopio" element={<MicroscopioDetail />} />} />
                    <Route path="/eventos" element={<GuardedRoute pageKey="eventos" element={<Events />} />} />
                    <Route path="/eventos/:slug" element={<GuardedRoute pageKey="eventos" element={<EventDetail />} />} />
                    <Route path="/galeria" element={<GuardedRoute pageKey="galeria" element={<Gallery />} />} />
                    <Route path="/galeria/:albumId" element={<GuardedRoute pageKey="galeria" element={<AlbumView />} />} />
                    {/* Legacy album URL — redirect old /gallery/:albumId links to the unified /galeria/:albumId */}
                    <Route path="/gallery/:albumId" element={<LegacyAlbumRedirect />} />
                    <Route path="/entrevistas" element={<GuardedRoute pageKey="entrevistas" element={<Projects />} />} />
                    <Route path="/entrevistas/:slug" element={<GuardedRoute pageKey="entrevistas" element={<ProjectDetail />} />} />
                    <Route path="/press-kit" element={<GuardedRoute pageKey="press-kit" element={<PressKit />} />} />
                    <Route path="/podcast" element={<GuardedRoute pageKey="podcast" element={<Podcast />} />} />
                    <Route path="/boletins" element={<GuardedRoute pageKey="boletins" element={<Boletins />} />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/outros" element={<Others />} />
                    <Route path="/forum-paulista" element={<GuardedRoute pageKey="forum-paulista" element={<ForumPaulista />} />} />
                    {/* Fórum de 2026 encerrado: /registro, /agenda-meetups e
                        /cronograma-evento foram removidos. /confirmar-meetup
                        permanece porque e-mails já enviados apontam para ele. */}
                    <Route path="/confirmar-meetup" element={<ConfirmarMeetup />} />
                    <Route path="/manutencao" element={<Manutencao />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                </ErrorBoundary>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
      </PageStatusProvider>
    </LanguageProvider>
  );
}

export default App;
