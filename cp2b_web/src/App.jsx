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

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Team from './pages/Team';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import Opportunities from './pages/Opportunities';
import Publications from './pages/Publications';
import Projects from './pages/Projects';
import Media from './pages/Media';
import Others from './pages/Others';
import NotFound from './pages/NotFound';

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
  TeamEditor,
  ContentEditor,
  AxesEditor,
  MessagesPanel,
} from './pages/admin';

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
            <Route path="team" element={<TeamEditor />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="axes" element={<AxesEditor />} />
            <Route path="messages" element={<MessagesPanel />} />
          </Route>

          {/* Public Routes - With Header/Footer */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main style={{ minHeight: '80vh' }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/sobre/governanca" element={<Governance />} />
                    <Route path="/sobre/transparencia" element={<Transparency />} />
                    <Route path="/sobre/parceiros" element={<PartnersPage />} />
                    <Route path="/pesquisa" element={<Research />} />
                    <Route path="/equipe" element={<Team />} />
                    <Route path="/noticias" element={<News />} />
                    <Route path="/noticias/:slug" element={<NewsDetail />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/oportunidades" element={<Opportunities />} />
                    <Route path="/publicacoes" element={<Publications />} />
                    <Route path="/projetos" element={<Projects />} />
                    <Route path="/na-midia" element={<Media />} />
                    <Route path="/outros" element={<Others />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
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
