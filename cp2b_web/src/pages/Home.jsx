import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsItems, forumData } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchFeaturedContent, fetchPageContent } from '../services/api';
import FeaturedContent from '../components/FeaturedContent';

const Home = () => {
  const { language } = useLanguage();
  const news = newsItems[language];
  const [forum, setForum] = useState(forumData[language]);
  const [featuredContent, setFeaturedContent] = useState({ A: null, B: null, C: null });
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      setLoadingFeatured(true);
      const data = await fetchFeaturedContent();
      setFeaturedContent(data);
      setLoadingFeatured(false);
    };

    loadFeaturedContent();
  }, []);

  useEffect(() => {
    const loadForumContent = async () => {
      const data = await fetchPageContent('home');
      if (data) {
        const langContent = language === 'pt' ? data.content_pt : data.content_en;
        const staticFallback = forumData[language];
        // Map database fields to the expected forum object structure
        if (langContent && Object.keys(langContent).length > 0) {
          setForum({
            badge: langContent.forum_badge || staticFallback.badge,
            subtitle: langContent.forum_subtitle || staticFallback.subtitle,
            title: langContent.forum_title || staticFallback.title,
            description: langContent.forum_description || staticFallback.description,
            button: langContent.forum_button_text || staticFallback.button,
          });
        }
      }
    };

    loadForumContent();
  }, [language]);

  const labels = {
    pt: {
      newsTitle: 'Novidades',
      newsAll: 'Ver todas',
      newsLink: 'Ler notícia →',
      partnersTitle: 'Parceiros e Apoiadores',
      videoFallback: 'Seu navegador não suporta a tag de vídeo.'
    },
    en: {
      newsTitle: 'News',
      newsAll: 'View all',
      newsLink: 'Read more →',
      partnersTitle: 'Partners and Supporters',
      videoFallback: 'Your browser does not support the video tag.'
    }
  }[language];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Featured News Headlines Section */}
      <section className="position-relative overflow-hidden mb-5">
        {loadingFeatured ? (
          <div className="d-flex justify-content-center align-items-center"
               style={{ minHeight: '100vh', background: '#000' }}>
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <FeaturedContent
            itemA={featuredContent.A}
            itemB={featuredContent.B}
            itemC={featuredContent.C}
          />
        )}
      </section>

      {/* Video Highlight Section - FORUM 2026 with Interactive Hover */}
      <section className="py-5">
        <Container>
            <Row className="align-items-center g-5">
                <Col lg={6}>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                        <span className="text-success fw-bold text-uppercase small ls-2">{forum.badge}</span>
                        <span className="ms-2 text-muted fw-bold text-uppercase small ls-2">{forum.subtitle}</span>
                        <h2 className="display-5 fw-bold mb-4">{forum.title}</h2>
                        <p className="lead text-muted mb-4">
                            {forum.description}
                        </p>
                        <Button
                          variant="outline-primary"
                          className="rounded-pill btn-glow"
                          as={Link}
                          to="/sobre"
                        >
                          {forum.button}
                        </Button>
                    </motion.div>
                </Col>
                <Col lg={6}>
                     <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        className="hover-zoom position-relative rounded-4 overflow-hidden shadow-lg"
                     >
                        <video width="100%" height="auto" controls poster="/assets/Forum-CP2B-junho-2025-Destaque-500x230.jpg" style={{ display: 'block' }}>
                            <source src="/assets/Em-breve-960-x-540-px-2.mp4" type="video/mp4" />
                            {labels.videoFallback}
                        </video>
                        <div className="hover-overlay"></div>
                     </motion.div>
                </Col>
            </Row>
        </Container>
      </section>

      {/* News Highlights - Enhanced Cards with Interactive Hover */}
      <section className="py-5 bg-light-gray">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="mb-0 fw-bold">{labels.newsTitle}</h2>
            <Link to="/noticias" className="btn btn-outline-dark rounded-pill btn-sm">{labels.newsAll}</Link>
          </div>

          <Row className="g-4">
            {news.slice(0, 3).map((item, index) => (
              <Col md={4} key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-100 border-0 shadow-sm interactive-card">
                    <div className="card-image-wrapper position-relative" style={{ height: '240px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                       <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" />
                       <div className="card-overlay"></div>
                    </div>
                    <Card.Body className="p-4">
                      <span className={`badge bg-${item.badgeColor} bg-opacity-10 text-${item.badgeColor} mb-3 rounded-pill`}>{item.badge}</span>
                      <Card.Title className="fw-bold mb-3">{item.title}</Card.Title>
                      <Card.Text className="text-muted small mb-4">
                        {item.description}
                      </Card.Text>
                      <Link to={item.link} className="btn btn-link text-decoration-none p-0 fw-bold text-dark">{labels.newsLink}</Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Partners Image Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h3 className="fw-bold">{labels.partnersTitle}</h3>
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
  );
};

export default Home;
