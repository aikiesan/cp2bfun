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
      {/* Hero Section - Carousel with Ken Burns Effect */}
      <section className="position-relative overflow-hidden mb-5">
        <Carousel fade interval={8000} controls={false} indicators={true}>
          {slides.map((slide) => (
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

      {/* Video Highlight Section - FORUM 2026 */}
      <section className="py-5">
        <Container>
            <Row className="align-items-center g-5">
                <Col lg={6}>
                    <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                        <span className="text-success fw-bold text-uppercase small ls-2">{forum.badge}</span>
                        <span className="ms-2 text-muted fw-bold text-uppercase small ls-2">{forum.subtitle}</span>
                        <h2 className="display-5 fw-bold mb-4">{forum.title}</h2>
                        <p className="lead text-muted mb-4">
                            {forum.description}
                        </p>
                        <Button variant="outline-primary" className="rounded-pill">{forum.button}</Button>
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
                            {labels.videoFallback}
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
            <h2 className="mb-0 fw-bold">{labels.newsTitle}</h2>
            <Link to="/noticias" className="btn btn-outline-dark rounded-pill btn-sm">{labels.newsAll}</Link>
          </div>

          <Row className="g-4">
            {news.slice(0, 3).map((item) => (
              <Col md={4} key={item.id}>
                <Card className="h-100 border-0 shadow-sm hover-lift">
                  <div className="card-img-top overflow-hidden position-relative" style={{ height: '240px' }}>
                     <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" style={{ borderRadius: '24px 24px 0 0' }} />
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
