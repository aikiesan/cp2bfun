import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { timelineData, homeContent, researchAxes, teamMembers } from '../data/content';
import { laboratories } from '../data/generated/laboratories';
import { technicalServices } from '../data/generated/services';
import { useLanguage } from '../context/LanguageContext';
import api, { fetchFeaturedContent, fetchFeaturedVideos } from '../services/api';
import FeaturedContent from '../components/FeaturedContent';
import FeaturedVideos from '../components/FeaturedVideos';
import Timeline from '../components/Timeline';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

// Reveal shared by every institutional block. The global
// prefers-reduced-motion rule in design-system.css neutralises the
// transition for users who ask for less movement.
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

// "Eixo 3 – Engenharia de Processos" -> "Engenharia de Processos".
// The number is already shown in its own badge, so repeating the prefix
// in the card title only costs horizontal space.
const stripAxisPrefix = (title) => title.split('–').slice(1).join('–').trim() || title;

const Home = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.home[language] || pageSeo.home.pt;
  const t = homeContent[language] || homeContent.pt;
  const axes = researchAxes[language] || researchAxes.pt;
  const [featuredContent, setFeaturedContent] = useState({ A: null, B: null, C: null });
  const [featuredVideos, setFeaturedVideos] = useState({ A: null, B: null, C: null });
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Every figure in the stats band is derived from the datasets that already
  // drive /equipe, /eixos and /solucoes — never hardcoded, so the numbers
  // cannot drift away from the pages they summarise.
  const stats = useMemo(() => {
    const people = teamMembers.flatMap((category) => category.members);
    const institutions = new Set(
      people
        .map((member) => (member.institution || '').trim())
        .filter((institution) => institution && institution !== '-')
    );

    return [
      { key: 'axes', value: researchAxes.pt.length, label: t.stats.axes },
      { key: 'researchers', value: people.length, label: t.stats.researchers },
      { key: 'institutions', value: institutions.size, label: t.stats.institutions },
      { key: 'laboratories', value: laboratories.length, label: t.stats.laboratories },
      { key: 'services', value: technicalServices.length, label: t.stats.services },
    ];
  }, [t]);

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
      <motion.div
        className="home-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      {/* Featured News Headlines Section — the page opens on the newsroom */}
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
                      <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {item.date && <span className="card-meta">{item.date}</span>}
                          {item.badge && (
                            <span className={`badge bg-${item.badgeColor} bg-opacity-10 text-${item.badgeColor} rounded-pill`}>{item.badge}</span>
                          )}
                        </div>
                        <h3 className="h5 fw-bold mb-2 mb-md-3">
                          <Link to={item.link} className="text-decoration-none" style={{ color: 'var(--cp2b-dark)' }}>
                            {item.title}
                          </Link>
                        </h3>
                        {item.description && (
                          <p className="text-muted small mb-3 mb-md-4">{item.description}</p>
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

      {/* The Centre in numbers — all figures computed from the datasets.
          The molecule field sits behind this band only: it is the one calm,
          plain-white section on the page, so the drift reads as identity
          rather than competing with the newsroom imagery above it. */}
      <section className="section">
        <Container>
          <div className="section-head text-center">
            <span className="eyebrow justify-content-center">{t.stats.eyebrow}</span>
            <h2>{t.stats.title}</h2>
            <p className="section-sub mx-auto">{t.stats.subtitle}</p>
          </div>
          <motion.div className="home-stats-grid" {...reveal} transition={{ duration: 0.5 }}>
            {stats.map((stat) => (
              <div className="home-stat" key={stat.key}>
                <span className="home-stat-value">{stat.value}</span>
                <span className="home-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Structure and capabilities in a single band: the axis index on the
          left, the doorway into /solucoes as a dark panel on the right.
          These were two full-width sections; the laboratory cards moved out
          entirely, since their competency text belongs on /solucoes. */}
      <section className="section bg-light-gray">
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                  <span className="eyebrow">{t.axes.eyebrow}</span>
                  <h2 className="home-band-title">{t.axes.title}</h2>
                </div>
                <Link to="/eixos" className="arrow-link">
                  {t.axes.cta} <span className="arrow">→</span>
                </Link>
              </div>
              <div className="home-axis-grid">
                {axes.map((axis, index) => (
                  <motion.div
                    key={axis.id}
                    {...reveal}
                    transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.05 }}
                  >
                    <Link to="/eixos" className="home-axis-card">
                      <span className="home-axis-num">{axis.id}</span>
                      <h3 className="home-axis-title">{stripAxisPrefix(axis.title)}</h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Col>

            <Col lg={5}>
              <motion.div className="home-solutions-panel" {...reveal} transition={{ duration: 0.5 }}>
                <span className="eyebrow eyebrow--light">{t.solutions.eyebrow}</span>
                <h2 className="home-solutions-panel-title">{t.solutions.title}</h2>
                <p className="home-solutions-panel-lead">{t.solutions.subtitle}</p>

                <dl className="home-solutions-metrics">
                  <div className="home-solutions-metric">
                    <dt className="home-solutions-metric-value">{technicalServices.length}</dt>
                    <dd className="home-solutions-metric-label">{t.solutions.servicesLabel}</dd>
                  </div>
                  <div className="home-solutions-metric">
                    <dt className="home-solutions-metric-value">{laboratories.length}</dt>
                    <dd className="home-solutions-metric-label">{t.solutions.labsLabel}</dd>
                  </div>
                  <div className="home-solutions-metric">
                    <dt className="home-solutions-metric-value">{t.solutions.trlValue}</dt>
                    <dd className="home-solutions-metric-label">{t.solutions.trlLabel}</dd>
                  </div>
                </dl>

                <Link to="/solucoes" className="btn-hero btn-hero--primary">
                  {t.solutions.cta} <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </Link>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Research Timeline Section */}
      <section className="section home-band-tinted">
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
          <div className="text-center bg-white p-3 p-md-5 rounded-5 shadow-sm">
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
