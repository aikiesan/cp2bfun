import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

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
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Opportunities from './pages/Opportunities';
import Publications from './pages/Publications';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Media from './pages/Media';
import Others from './pages/Others';
import NotFound from './pages/NotFound';
import ForumPaulista from './pages/ForumPaulista';
import Registro from './pages/Registro';
import AgendaMeetups from './pages/AgendaMeetups';
import ConfirmarMeetup from './pages/ConfirmarMeetup';
import Gallery from './pages/Gallery';

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
  EventsList,
  EventsEditor,
  ProjectsList,
  ProjectsEditor,
  ParticipantsPanel,
  MeetupSlotsManager,
  MeetupRequestsPanel,
  ForumDashboard,
  GalleryList,
  GalleryUpload,
} from './pages/admin';
import FeaturedContentManager from './pages/admin/FeaturedContentManager';
import {
  HomeContentEditor,
  AboutContentEditor,
  GovernanceContentEditor,
  TransparencyContentEditor
} from './pages/admin/content';

function App() {
  return (
    <LanguageProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="events" element={<EventsList />} />
            <Route path="events/new" element={<EventsEditor />} />
            <Route path="events/:id" element={<EventsEditor />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectsEditor />} />
            <Route path="projects/:slug" element={<ProjectsEditor />} />
            <Route path="team" element={<TeamEditor />} />
            <Route path="axes" element={<AxesEditor />} />
            <Route path="content/home" element={<HomeContentEditor />} />
            <Route path="content/about" element={<AboutContentEditor />} />
            <Route path="content/governance" element={<GovernanceContentEditor />} />
            <Route path="content/transparency" element={<TransparencyContentEditor />} />
            <Route path="partners" element={<PartnersEditor />} />
            <Route path="messages" element={<MessagesPanel />} />
            <Route path="forum" element={<ForumDashboard />} />
            <Route path="forum/participants" element={<ParticipantsPanel />} />
            <Route path="forum/slots"        element={<MeetupSlotsManager />} />
            <Route path="forum/meetups"      element={<MeetupRequestsPanel />} />
            <Route path="gallery" element={<GalleryList />} />
            <Route path="gallery/upload" element={<GalleryUpload />} />
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
                    <Route path="/publicacoes" element={<Publications />} />
                    <Route path="/eventos" element={<Events />} />
                    <Route path="/galeria" element={<Gallery />} />
                    <Route path="/projetos" element={<Projects />} />
                    <Route path="/projetos/:slug" element={<ProjectDetail />} />
                    <Route path="/na-midia" element={<Media />} />
                    <Route path="/outros" element={<Others />} />
                    <Route path="/forum-paulista" element={<ForumPaulista />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/agenda-meetups" element={<AgendaMeetups />} />
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
