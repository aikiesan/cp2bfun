import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import api from '../services/api';

// Extract Spotify episode ID from various URL formats
const getSpotifyEmbedUrl = (url) => {
  if (!url) return null;
  // Already an embed URL
  if (url.includes('open.spotify.com/embed')) return url;
  // Extract episode ID from share/open URL
  const match = url.match(/episode\/([a-zA-Z0-9]+)/);
  if (match) return `https://open.spotify.com/embed/episode/${match[1]}`;
  // Show URL as-is if we can't parse it
  return url;
};

const Podcast = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.podcast?.[language] || pageSeo.podcast?.pt || { title: 'Podcast CP2b', description: '' };
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      tag: 'PODCAST',
      title: 'Podcast CP2b',
      description: 'Ouça os episódios do podcast CP2b sobre biogás, bioprodutos e energia renovável.',
      empty: 'Nenhum episódio disponível no momento.',
      episode: 'Episódio',
    },
    en: {
      tag: 'PODCAST',
      title: 'CP2b Podcast',
      description: 'Listen to CP2b podcast episodes on biogas, bioproducts and renewable energy.',
      empty: 'No episodes available at the moment.',
      episode: 'Episode',
    },
  }[language] || {
    tag: 'PODCAST',
    title: 'Podcast CP2b',
    description: '',
    empty: 'Nenhum episódio disponível no momento.',
    episode: 'Episódio',
  };

  useEffect(() => {
    api.get('/podcast')
      .then((res) => setEpisodes(res.data || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoading(false));
  }, []);

  const getTitle = (ep) => language === 'pt' ? ep.title_pt : (ep.title_en || ep.title_pt);
  const getDescription = (ep) => language === 'pt' ? ep.description_pt : (ep.description_en || ep.description_pt);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Container className="py-5">
          <Row className="justify-content-center text-center mb-5">
            <Col lg={7}>
              <i className="bi bi-mic-fill text-success" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
              <div className="mt-4">
                <span className="mono-label text-success text-uppercase">{labels.tag}</span>
                <h1 className="display-5 fw-bold mt-2 mb-3">{labels.title}</h1>
                <p className="lead text-muted">{labels.description}</p>
              </div>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : episodes.length === 0 ? (
            <Row className="justify-content-center">
              <Col lg={7} className="text-center text-muted py-5">
                <i className="bi bi-mic-mute" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                <p className="mt-3">{labels.empty}</p>
              </Col>
            </Row>
          ) : (
            <Row className="g-4 justify-content-center">
              {episodes.map((ep, idx) => {
                const embedUrl = getSpotifyEmbedUrl(ep.spotify_url);
                return (
                  <Col key={ep.id} xs={12} lg={10}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.06 }}
                    >
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                          <div className="d-flex align-items-start gap-3 mb-3">
                            {ep.episode_number && (
                              <Badge bg="success" className="flex-shrink-0 mt-1">
                                {labels.episode} {ep.episode_number}
                              </Badge>
                            )}
                            <div className="flex-grow-1">
                              <h5 className="fw-bold mb-1">{getTitle(ep)}</h5>
                              <div className="d-flex gap-3 text-muted small">
                                {ep.duration && (
                                  <span><i className="bi bi-clock me-1"></i>{ep.duration}</span>
                                )}
                                {ep.published_at && (
                                  <span><i className="bi bi-calendar3 me-1"></i>{formatDate(ep.published_at)}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {getDescription(ep) && (
                            <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
                              {getDescription(ep)}
                            </p>
                          )}

                          {embedUrl && (
                            <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                              <iframe
                                src={embedUrl}
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title={getTitle(ep)}
                                style={{ display: 'block' }}
                              />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default Podcast;
