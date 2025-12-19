import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { carouselSlides, newsItems } from '../data/content';

const Home = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section - Carousel with Ken Burns Effect */}
      <section className="position-relative overflow-hidden mb-5">
        <Carousel fade interval={8000} controls={false} indicators={true}>
          {carouselSlides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div style={{ 
                height: '80vh', 
                minHeight: '600px',
                borderRadius: '0 0 40px 40px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.15 }}
                  transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: -1
                  }}
                />
                
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }}></div>
                
                <Container className="h-100 d-flex align-items-end pb-5 position-relative">
                  <div className="text-white mb-5" style={{ maxWidth: '900px', width: '100%' }}>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                      <span className="badge bg-white text-dark mb-3 px-3 py-2 rounded-pill fw-bold">{slide.badge}</span>
                      <h1 className="display-3 fw-bold mb-3 text-white">{slide.title}</h1>
                      <p className="lead mb-4 text-white-50 d-none d-md-block" style={{ maxWidth: '600px' }}>
                        {slide.description}
                      </p>
                      {/* Mobile description visible but shorter if needed, or hidden as per design */}
                      <p className="d-block d-md-none text-white-50 mb-4 small">
                        {slide.description.substring(0, 100)}...
                      </p>
                      
                      <div className="d-flex flex-column flex-md-row gap-3">
                          <Button as={Link} to={slide.linkPrimary} variant="primary" size="lg" className="rounded-pill px-5 py-3 py-md-2">{slide.labelPrimary}</Button>
                          <Button as={Link} to={slide.linkSecondary} variant="outline-light" size="lg" className="rounded-pill px-5 py-3 py-md-2">{slide.labelSecondary}</Button>
                      </div>
                    </motion.div>
                  </div>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Video Highlight Section */}
      <section className="py-5">
        <Container>
            <Row className="align-items-center g-5">
                <Col lg={6}>
                    <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                        <span className="text-success fw-bold text-uppercase small ls-2">Fórum Paulista</span>
                        <h2 className="display-5 fw-bold mb-4">Fórum de Biogás e Bioprodutos</h2>
                        <p className="lead text-muted mb-4">
                            Confira os destaques do nosso último encontro, reunindo especialistas, pesquisadores e parceiros estratégicos para discutir o futuro da bioenergia.
                        </p>
                        <Button variant="outline-primary" className="rounded-pill">Ver cobertura completa</Button>
                    </motion.div>
                </Col>
                <Col lg={6}>
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        whileInView={{ scale: 1, opacity: 1 }} 
                        viewport={{ once: true }}
                        className="rounded-4 overflow-hidden shadow-lg position-relative"
                     >
                        <video width="100%" height="auto" controls poster="/assets/Forum-CP2B-junho-2025-Destaque-500x230.jpg" style={{ display: 'block' }}>
                            <source src="/assets/Em-breve-960-x-540-px-2.mp4" type="video/mp4" />
                            Seu navegador não suporta a tag de vídeo.
                        </video>
                     </motion.div>
                </Col>
            </Row>
        </Container>
      </section>

      {/* News Highlights - Cards */}
      <section className="py-5 bg-light-gray">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="mb-0 fw-bold">Últimas Atualizações</h2>
            <Link to="/noticias" className="btn btn-outline-dark rounded-pill btn-sm">Ver todas</Link>
          </div>

          <Row className="g-4">
            {newsItems.map((news) => (
              <Col md={4} key={news.id}>
                <Card className="h-100 border-0 shadow-sm hover-lift">
                  <div className="card-img-top overflow-hidden position-relative" style={{ height: '240px' }}>
                     <img src={news.image} alt={news.title} className="w-100 h-100 object-fit-cover" style={{ borderRadius: '24px 24px 0 0' }} />
                  </div> 
                  <Card.Body className="p-4">
                    <span className={`badge bg-${news.badgeColor} bg-opacity-10 text-${news.badgeColor} mb-3 rounded-pill`}>{news.badge}</span>
                    <Card.Title className="fw-bold mb-3">{news.title}</Card.Title>
                    <Card.Text className="text-muted small mb-4">
                      {news.description}
                    </Card.Text>
                    <Link to={news.link} className="btn btn-link text-decoration-none p-0 fw-bold text-dark">Ler notícia →</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Partners Image Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h3 className="fw-bold">Parceiros e Apoiadores</h3>
          </div>
          <div className="text-center bg-white p-5 rounded-5 shadow-sm">
            <img 
                src="/assets/parceiros.png" 
                alt="Parceiros e Apoiadores CP2B" 
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
