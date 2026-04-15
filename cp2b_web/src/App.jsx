import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import SeoHead from './components/SeoHead';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
  alternateName: 'CP2b',
  url: 'https://cp2b.unicamp.br',
  logo: 'https://cp2b.unicamp.br/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png',
  description: 'Centro de pesquisa vinculado ao NIPE-UNICAMP dedicado ao estudo de biogás, bioprodutos e políticas públicas para energia renovável no Estado de São Paulo.',
  email: 'nipe@nipe.unicamp.br',
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
import SocialSidebar from './components/SocialSidebar';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
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
import Media from './pages/Media';
import PressKit from './pages/PressKit';
import Podcast from './pages/Podcast';
import Others from './pages/Others';
import NotFound from './pages/NotFound';
import ForumPaulista from './pages/ForumPaulista';
import Registro from './pages/Registro';
import AgendaMeetups from './pages/AgendaMeetups';
import ConfirmarMeetup from './pages/ConfirmarMeetup';
import CronogramaEvento from './pages/CronogramaEvento';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import AlbumView from './pages/AlbumView';

// About sub-pages
import Governance from './pages/about/Governance';
import Transparency from './pages/about/Transparency';
import PartnersPage from './pages/about/PartnersPage';

// Admin Pages
import {
  AdminLayout,
  Dashboard,
  NewsList,
  NewsEditor,
  VideosList,
  VideosEditor,
  TeamEditor,
  AxesEditor,
  MessagesPanel,
  PartnersEditor,
  PublicationsList,
  PublicationsEditor,
  MicroscopioList,
  MicroscopioEditor,
  ProjectsList,
  ProjectsEditor,
  ParticipantsPanel,
  MeetupSlotsManager,
  MeetupRequestsPanel,
  ForumDashboard,
  NewsletterPanel,
  OportunidadesList,
  OportunidadesEditor,
  GalleryList,
  GalleryUpload,
  PressKitAdmin,
  PodcastList,
  PodcastEditor,
} from './pages/admin';
import FeaturedContentManager from './pages/admin/FeaturedContentManager';
import {
  HomeContentEditor,
  AboutContentEditor,
  GovernanceContentEditor,
  TransparencyContentEditor,
  MicroscopioContentEditor
} from './pages/admin/content';

function App() {
  return (
    <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SeoHead jsonLd={organizationJsonLd} />
        <ScrollToTop />
        <SocialSidebar />
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/new" element={<NewsEditor />} />
            <Route path="news/:slug" element={<NewsEditor />} />
            <Route path="videos" element={<VideosList />} />
            <Route path="videos/new" element={<VideosEditor />} />
            <Route path="videos/:id" element={<VideosEditor />} />
            <Route path="featured" element={<FeaturedContentManager />} />
            <Route path="publications" element={<PublicationsList />} />
            <Route path="publications/new" element={<PublicationsEditor />} />
            <Route path="publications/:id" element={<PublicationsEditor />} />
            <Route path="microscopio" element={<MicroscopioList />} />
            <Route path="microscopio/new" element={<MicroscopioEditor />} />
            <Route path="microscopio/:slug" element={<MicroscopioEditor />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectsEditor />} />
            <Route path="projects/:slug" element={<ProjectsEditor />} />
            <Route path="team" element={<TeamEditor />} />
            <Route path="axes" element={<AxesEditor />} />
            <Route path="content/home" element={<HomeContentEditor />} />
            <Route path="content/about" element={<AboutContentEditor />} />
            <Route path="content/governance" element={<GovernanceContentEditor />} />
            <Route path="content/transparency" element={<TransparencyContentEditor />} />
            <Route path="content/microscopio" element={<MicroscopioContentEditor />} />
            <Route path="partners" element={<PartnersEditor />} />
            <Route path="messages" element={<MessagesPanel />} />
            <Route path="forum" element={<ForumDashboard />} />
            <Route path="forum/participants" element={<ParticipantsPanel />} />
            <Route path="forum/slots"        element={<MeetupSlotsManager />} />
            <Route path="forum/meetups"      element={<MeetupRequestsPanel />} />
            <Route path="newsletter"         element={<NewsletterPanel />} />
            <Route path="oportunidades"      element={<OportunidadesList />} />
            <Route path="oportunidades/new"  element={<OportunidadesEditor />} />
            <Route path="oportunidades/:slug" element={<OportunidadesEditor />} />
            <Route path="gallery"        element={<GalleryList />} />
            <Route path="gallery/upload" element={<GalleryUpload />} />
            <Route path="press-kit"      element={<PressKitAdmin />} />
            <Route path="podcast"        element={<PodcastList />} />
            <Route path="podcast/new"    element={<PodcastEditor />} />
            <Route path="podcast/:id"    element={<PodcastEditor />} />
          </Route>

          {/* Public Routes - With Header/Footer */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <ErrorBoundary>
                <main style={{ minHeight: '80vh' }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/sobre/governanca" element={<Governance />} />
                    <Route path="/sobre/transparencia" element={<Transparency />} />
                    <Route path="/sobre/parceiros" element={<PartnersPage />} />
                    <Route path="/eixos" element={<Research />} />
                    <Route path="/equipe" element={<Team />} />
                    <Route path="/noticias" element={<News />} />
                    <Route path="/noticias/:slug" element={<NewsDetail />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/oportunidades" element={<Opportunities />} />
                    <Route path="/oportunidades/:slug" element={<OportunidadesDetail />} />
                    <Route path="/publicacoes" element={<Publications />} />
                    <Route path="/microscopio" element={<Microscopio />} />
                    <Route path="/microscopio/:slug" element={<MicroscopioDetail />} />
                    <Route path="/eventos" element={<Events />} />
                    <Route path="/galeria" element={<Gallery />} />
                    <Route path="/gallery/:albumId" element={<AlbumView />} />
                    <Route path="/entrevistas" element={<Projects />} />
                    <Route path="/entrevistas/:slug" element={<ProjectDetail />} />
                    <Route path="/na-midia" element={<Media />} />
                    <Route path="/press-kit" element={<PressKit />} />
                    <Route path="/podcast" element={<Podcast />} />
                    <Route path="/outros" element={<Others />} />
                    <Route path="/forum-paulista" element={<ForumPaulista />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/agenda-meetups" element={<AgendaMeetups />} />
                    <Route path="/cronograma-evento" element={<CronogramaEvento />} />
                    <Route path="/confirmar-meetup" element={<ConfirmarMeetup />} />
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
    </LanguageProvider>
  );
}

export default App;
