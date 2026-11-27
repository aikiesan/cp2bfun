import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { homeContent, researchAxes } from '../data/content';
import { laboratories } from '../data/generated/laboratories';

// "Laboratórios centrais" são os de bioprocessos (os que têm faixa de TRL e
// serviços técnicos). LESP e LABSOS, do Eixo 8, também estão na planilha,
// mas são núcleos de ciências sociais aplicadas e não entram nessa conta.
const coreLaboratories = laboratories.filter((l) => l.group === 'bioprocessos');
import { technicalServices } from '../data/generated/services';
import { useLanguage } from '../context/LanguageContext';
import api, { fetchFeaturedContent, fetchFeaturedVideos } from '../services/api';
import FeaturedContent from '../components/FeaturedContent';
import FeaturedVideos from '../components/FeaturedVideos';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PilarBand from '../components/PilarBand';
import useTeamRoster from '../hooks/useTeamRoster';
import { computeTeamProfile } from '../utils/teamProfile';

// Reveal shared by every institutional block. The global
// prefers-reduced-motion rule in design-system.css neutralises the
// transition for users who ask for less movement.
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const Home = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.home[language] || pageSeo.home.pt;
  const t = homeContent[language] || homeContent.pt;
  const [featuredContent, setFeaturedContent] = useState({ A: null, B: null, C: null });
  const [featuredVideos, setFeaturedVideos] = useState({ A: null, B: null, C: null });
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Every figure in the stats band is derived from the datasets that already
  // drive /equipe, /eixos and /solucoes — never hardcoded, so the numbers
  // cannot drift away from the pages they summarise. People come from the
  // same roster as /equipe (database, static list as fallback): "team" is
  // the figure /equipe shows as "na equipe do CP2b".
  const { members: roster } = useTeamRoster(language);
  const stats = useMemo(() => {
    const profile = computeTeamProfile(roster);
    const institutions = new Set(
      roster
        .map((member) => (member.institution || '').trim())
        .filter((institution) => institution && institution !== '-')
    );

    return [
      { key: 'axes', value: researchAxes.pt.length, label: t.stats.axes },
      { key: 'researchers', value: profile.team, label: t.stats.researchers },
      { key: 'institutions', value: institutions.size, label: t.stats.institutions },
      { key: 'laboratories', value: coreLaboratories.length, label: t.stats.laboratories },
      { key: 'services', value: technicalServices.length, label: t.stats.services },
    ];
  }, [t, roster]);

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
          // Seis, e não três: as que entram nos Destaques saem da lista de
          // Notícias logo abaixo, e a lista ainda precisa de três.
          .slice(0, 6);
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

  // Destaques: o que a equipe marcou no painel, com as vagas que sobraram
  // preenchidas pelas notícias mais recentes que ainda não estão em
  // destaque — nunca uma caixa cinza dizendo "Nenhum conteúdo em destaque".
  // Só some se não houver nem destaque nem notícia nenhuma.
  const featuredSlots = useMemo(() => {
    const picked = [featuredContent.A, featuredContent.B, featuredContent.C];
    const used = new Set(picked.filter(Boolean).map((item) => item.slug));
    const spare = latestNews
      .filter((item) => !used.has(item.slug))
      .map((item) => ({ ...item, content_type: 'news' }));
    const slots = picked.map((item) => item || spare.shift() || null);
    return slots.some(Boolean) ? slots : null;
  }, [featuredContent, latestNews]);

  // Map API news items to the shape the cards expect, leaving out the ones
  // already shown in Destaques above.
  const inHighlights = new Set(
    (featuredSlots || []).filter((item) => item?.content_type === 'news').map((item) => item.slug)
  );
  const displayNews = latestNews.length > 0
    ? latestNews.filter((item) => !inHighlights.has(item.slug)).slice(0, 3).map((item) => ({
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
      {(loadingFeatured || loadingNews || featuredSlots) && (
      <section className="position-relative overflow-hidden">
        {loadingFeatured || loadingNews ? (
          <div className="featured-news-section featured-news-skeleton">
            <Container>
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
            </Container>
          </div>
        ) : (
          <FeaturedContent
            itemA={featuredSlots[0]}
            itemB={featuredSlots[1]}
            itemC={featuredSlots[2]}
          />
        )}
      </section>
      )}

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
                          <div className="w-100 h-100" style={{ background: 'var(--bg-surface-muted)' }} />
                        )}
                      </Link>
                      <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {item.date && <span className="card-meta">{item.date}</span>}
                          {item.badge && (
                            <span className={`badge bg-${item.badgeColor} bg-opacity-10 text-${item.badgeColor} rounded-pill`}>{item.badge}</span>
                          )}
                        </div>
                        <h3 className="h5 fw-semibold mb-2 mb-md-3">
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

      {/* PILAR-2b logo depois das notícias: é a vitrine dos resultados de
          pesquisa, e os links levam o Google às páginas da plataforma. */}
      <PilarBand language={language} />

      {/* Featured Videos Section */}
      {(featuredVideos.A || featuredVideos.B || featuredVideos.C) && (
        <section className="section">
          <Container>
            <div className="text-center section-head">
              <span className="eyebrow justify-content-center">{language === 'pt' ? 'Multimídia' : 'Multimedia'}</span>
              <h2 className="fw-semibold mt-2">{labels.videosTitle}</h2>
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

      {/* Partners Image Section */}
      <section className="section partners-section">
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">
              {language === 'pt' ? 'Rede' : 'Network'}
            </span>
            <h2 className="fw-semibold mt-2">{labels.partnersTitle}</h2>
          </div>
          <div className="text-center bg-white p-3 p-md-4 rounded-5 shadow-sm">
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
