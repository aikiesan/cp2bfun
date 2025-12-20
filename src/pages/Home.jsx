import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { carouselSlides, newsItems, forumData } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { language } = useLanguage();
  const slides = carouselSlides[language];
  const news = newsItems[language];
  const forum = forumData[language];

  const labels = {
    pt: {
      newsTitle: 'Novidades',
      newsAll: 'Ver todas',
      newsLink: 'Ler mais',
      partnersTitle: 'Parceiros e Apoiadores',
      videoFallback: 'Seu navegador não suporta a tag de vídeo.'
    },
    en: {
      newsTitle: 'News',
      newsAll: 'View all',
      newsLink: 'Read more',
      partnersTitle: 'Partners and Supporters',
      videoFallback: 'Your browser does not support the video tag.'
    }
  }[language];

  // Subtle animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section - Refined Carousel */}
      <section className="hero-section mb-5">
        <Carousel fade interval={10000} controls={false} indicators={true}>
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div className="hero-slide">
                {/* Background with subtle Ken Burns */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{
                    duration: 15,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 0
                  }}
                />

                {/* Refined gradient overlay */}
                <div className="hero-overlay" />

                {/* Hero Content */}
                <Container className="h-100 d-flex align-items-end pb-5 position-relative" style={{ zIndex: 2 }}>
                  <motion.div
                    className="hero-content mb-4 mb-lg-5"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="hero-badge">{slide.badge}</span>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-description d-none d-md-block">
                      {slide.description}
                    </p>
                    <p className="hero-description d-block d-md-none" style={{ fontSize: '1rem' }}>
                      {slide.description.substring(0, 120)}...
                    </p>

                    <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                      <Button
                        as={Link}
                        to={slide.linkPrimary}
                        variant="primary"
                        size="lg"
                        className="rounded-pill px-4"
                      >
                        {slide.labelPrimary}
                      </Button>
                      <Button
                        as={Link}
                        to={slide.linkSecondary}
                        variant="outline-light"
                        size="lg"
                        className="rounded-pill px-4"
                      >
                        {slide.labelSecondary}
                      </Button>
                    </div>
                  </motion.div>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Forum Highlight Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span
                    className="badge-petrol px-3 py-2 rounded-pill fw-semibold"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                  >
                    {forum.badge}
                  </span>
                  <span className="text-muted small fw-medium">{forum.subtitle}</span>
                </div>
                <h2 className="display-6 fw-bold mb-4" style={{ color: 'var(--cp2b-dark)' }}>
                  {forum.title}
                </h2>
                <p className="lead mb-4">
                  {forum.description}
                </p>
                <Button variant="outline-primary" className="rounded-pill px-4">
                  {forum.button}
                </Button>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="overflow-hidden shadow-lg"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <video
                  width="100%"
                  height="auto"
                  controls
                  poster="/assets/Forum-CP2B-junho-2025-Destaque-500x230.jpg"
                  style={{ display: 'block', borderRadius: 0 }}
                >
                  <source src="/assets/Em-breve-960-x-540-px-2.mp4" type="video/mp4" />
                  {labels.videoFallback}
                </video>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Section */}
      <section className="py-5 bg-warm">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <span className="mono-label text-petrol">{language === 'pt' ? 'ATUALIZAÇÕES' : 'UPDATES'}</span>
              <h2 className="fw-bold mb-0">{labels.newsTitle}</h2>
            </div>
            <Link to="/noticias" className="btn btn-outline-dark btn-sm rounded-pill px-4">
              {labels.newsAll}
            </Link>
          </div>

          <Row className="g-4">
            {news.slice(0, 3).map((item, index) => (
              <Col md={4} key={item.id}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0">
                    <div
                      className="overflow-hidden position-relative"
                      style={{ height: '220px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-100 h-100"
                        style={{
                          objectFit: 'cover',
                          borderRadius: 0,
                          transition: 'transform 0.4s ease'
                        }}
                      />
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className={`badge bg-${item.badgeColor}-subtle text-${item.badgeColor} rounded-pill`}
                          style={{
                            background: item.badgeColor === 'success' ? 'var(--cp2b-green-tint)' :
                                       item.badgeColor === 'primary' ? 'var(--cp2b-petrol-tint)' :
                                       'var(--cp2b-orange-tint)',
                            color: item.badgeColor === 'success' ? 'var(--cp2b-green)' :
                                  item.badgeColor === 'primary' ? 'var(--cp2b-petrol)' :
                                  'var(--cp2b-orange)'
                          }}
                        >
                          {item.badge}
                        </span>
                        <span className="text-muted small">{item.date}</span>
                      </div>
                      <Card.Title className="fw-bold mb-3 h6">{item.title}</Card.Title>
                      <Card.Text className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                        {item.description.substring(0, 120)}...
                      </Card.Text>
                      <Link
                        to={item.link}
                        className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
                        style={{ color: 'var(--cp2b-petrol)' }}
                      >
                        {labels.newsLink}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Partners Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="mono-label text-green">{language === 'pt' ? 'REDE' : 'NETWORK'}</span>
            <h3 className="fw-bold">{labels.partnersTitle}</h3>
          </div>
          <motion.div
            className="text-center bg-white p-4 p-md-5 shadow-sm"
            style={{ borderRadius: 'var(--radius-xl)' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/assets/parceiros.png"
              alt="Partners"
              className="img-fluid"
              style={{ maxWidth: '100%', mixBlendMode: 'multiply', borderRadius: 0 }}
            />
          </motion.div>
        </Container>
      </section>
    </motion.div>
  );
};

export default Home;
