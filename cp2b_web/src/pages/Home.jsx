import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { timelineData } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import api, { fetchFeaturedContent, fetchFeaturedVideos } from '../services/api';
import FeaturedContent from '../components/FeaturedContent';
import FeaturedVideos from '../components/FeaturedVideos';
import Timeline from '../components/Timeline';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const Home = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.home[language] || pageSeo.home.pt;
  const [featuredContent, setFeaturedContent] = useState({ A: null, B: null, C: null });
  const [featuredVideos, setFeaturedVideos] = useState({ A: null, B: null, C: null });
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      setLoadingFeatured(true);
      try {
        const data = await fetchFeaturedContent();
        setFeaturedContent(data);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeaturedContent();
  }, []);

  useEffect(() => {
    const loadFeaturedVideos = async () => {
      const data = await fetchFeaturedVideos();
      setFeaturedVideos(data);
    };

    loadFeaturedVideos();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get('/news');
        const sorted = (response.data || [])
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          .slice(0, 3);
        setLatestNews(sorted);
      } catch {
        setLatestNews([]);
      } finally {
        setLoadingNews(false);
      }
    };
    loadNews();
  }, []);

  const labels = {
    pt: {
      newsTitle: 'Notícias',
      newsAll: 'Ver todas',
      newsLink: 'Ler notícia →',
      videosTitle: 'Vídeos em Destaque',
      partnersTitle: 'Parceiros e Apoiadores',
      videoFallback: 'Seu navegador não suporta a tag de vídeo.'
    },
    en: {
      newsTitle: 'News',
      newsAll: 'View all',
      newsLink: 'Read more →',
      videosTitle: 'Featured Videos',
      partnersTitle: 'Partners and Supporters',
      videoFallback: 'Your browser does not support the video tag.'
    }
  }[language];

  // Map API news items to the shape the cards expect
  const displayNews = latestNews.length > 0
    ? latestNews.map((item) => ({
        id: item.id,
        title: language === 'pt' ? item.title_pt : (item.title_en || item.title_pt),
        badge: item.badge,
        badgeColor: item.badge_color || 'secondary',
        description: language === 'pt'
          ? item.description_pt || ''
          : (item.description_en || item.description_pt || ''),
        image: item.image,
        link: `/noticias/${item.slug}`,
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : null,
      }))
    : [];

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Featured News Headlines Section */}
      <section className="position-relative overflow-hidden mb-5">
        {loadingFeatured ? (
          <div className="featured-news-section featured-news-skeleton">
            <div className="featured-news-container">
              <div className="featured-news-main">
                <div className="featured-headline featured-headline-large featured-headline-skeleton" />
              </div>
              <div className="featured-news-secondary">
                <div className="featured-news-top">
                  <div className="featured-headline featured-headline-small featured-headline-skeleton" />
                </div>
                <div className="featured-news-bottom">
                  <div className="featured-headline featured-headline-small featured-headline-skeleton" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FeaturedContent
            itemA={featuredContent.A}
            itemB={featuredContent.B}
            itemC={featuredContent.C}
          />
        )}
      </section>

      {/* Institutional Video Section */}
      <section className="py-5">
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">{language === 'pt' ? 'Conheça o CP2b' : 'Meet CP2b'}</span>
            <h2 className="fw-bold mt-2">{language === 'pt' ? 'Vídeo Institucional' : 'Institutional Video'}</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="position-relative rounded-4 overflow-hidden shadow-lg mx-auto"
            style={{ maxWidth: '1100px' }}
          >
            <video
              width="100%"
              height="auto"
              autoPlay
              loop
              muted
              playsInline
              controls
              poster="/assets/cp2b-institucional-poster.jpg"
              style={{ display: 'block' }}
            >
              <source src="/assets/cp2b-institucional.mp4" type="video/mp4" />
              {labels.videoFallback}
            </video>
          </motion.div>
        </Container>
      </section>

      {/* News — 3 most recent from API */}
      <section className="section bg-light-gray">
        <Container>
          <div className="d-flex justify-content-between align-items-end section-head flex-wrap gap-3">
            <div>
              <span className="eyebrow">{language === 'pt' ? 'Comunicação' : 'Communication'}</span>
              <h2 className="mb-0 mt-2">{labels.newsTitle}</h2>
            </div>
            <Link to="/noticias" className="arrow-link">
              {labels.newsAll} <span className="arrow">→</span>
            </Link>
          </div>

          {loadingNews ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : displayNews.length === 0 ? null : (
            <Row className="g-4">
              {displayNews.map((item, index) => (
                <Col md={4} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <article className="card-editorial">
                      <Link to={item.link} className="card-media d-block" tabIndex={-1} aria-hidden="true">
                        {item.image ? (
                          <img src={item.image} alt={item.title} loading="lazy" />
                        ) : (
                          <div className="w-100 h-100" style={{ background: 'linear-gradient(135deg, var(--cp2b-petrol) 0%, #2d3748 100%)' }} />
                        )}
                      </Link>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {item.date && <span className="card-meta">{item.date}</span>}
                          {item.badge && (
                            <span className={`badge bg-${item.badgeColor} bg-opacity-10 text-${item.badgeColor} rounded-pill`}>{item.badge}</span>
                          )}
                        </div>
                        <h3 className="h5 fw-bold mb-3">
                          <Link to={item.link} className="text-decoration-none" style={{ color: 'var(--cp2b-dark)' }}>
                            {item.title}
                          </Link>
                        </h3>
                        {item.description && (
                          <p className="text-muted small mb-4">{item.description}</p>
                        )}
                        <Link to={item.link} className="arrow-link mt-auto small">
                          {labels.newsLink.replace(' →', '')} <span className="arrow">→</span>
                        </Link>
                      </div>
                    </article>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Featured Videos Section */}
      {(featuredVideos.A || featuredVideos.B || featuredVideos.C) && (
        <section className="section">
          <Container>
            <div className="text-center section-head">
              <span className="eyebrow justify-content-center">{language === 'pt' ? 'Multimídia' : 'Multimedia'}</span>
              <h2 className="fw-bold mt-2">{labels.videosTitle}</h2>
            </div>
          </Container>
          <FeaturedVideos itemA={featuredVideos.A} itemB={featuredVideos.B} itemC={featuredVideos.C} />
        </section>
      )}

      {/* Research Timeline Section */}
      <section className="section" style={{ background: 'var(--cp2b-light-gray)' }}>
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">
              {language === 'pt' ? 'Nossa Trajetória' : 'Our Journey'}
            </span>
            <h2 className="fw-bold mt-2">{language === 'pt' ? 'Marcos e Projetos em Destaque' : 'Milestones and Featured Projects'}</h2>
          </div>
          <Timeline items={timelineData[language]} />
        </Container>
      </section>

      {/* Partners Image Section */}
      <section className="section partners-section">
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">
              {language === 'pt' ? 'Rede' : 'Network'}
            </span>
            <h2 className="fw-bold mt-2">{labels.partnersTitle}</h2>
          </div>
          <div className="text-center bg-white p-5 rounded-5 shadow-sm">
            <img 
                src="/assets/parceiros.png" 
                alt="Partners" 
                className="img-fluid" 
                style={{ maxWidth: '100%', mixBlendMode: 'multiply', borderRadius: 0 }} 
            />
          </div>
        </Container>
      </section>
    </motion.div>
    </>
  );
};

export default Home;
