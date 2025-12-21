import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumb from './components/Breadcrumb';

// Pages - Lazy loaded for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Research = lazy(() => import('./pages/Research'));
const Team = lazy(() => import('./pages/Team'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Publications = lazy(() => import('./pages/Publications'));
const Projects = lazy(() => import('./pages/Projects'));
const Media = lazy(() => import('./pages/Media'));
const Others = lazy(() => import('./pages/Others'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback with elegant animation
const PageLoader = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '60vh' }}
  >
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.4; transform: scale(0.98); }
        50% { opacity: 1; transform: scale(1); }
      }
    `}</style>
    <img
      src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png"
      alt="CP2B"
      height="50"
      style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
    />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
          <ScrollToTop />
          <a
            href="#main-content"
            className="visually-hidden-focusable position-absolute bg-primary text-white p-3"
            style={{ zIndex: 9999, top: 0, left: 0 }}
          >
            Skip to main content
          </a>
          <Header />
          <Breadcrumb />
          <main id="main-content" style={{ minHeight: '80vh' }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<About />} />
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
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
