import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { newsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
  const { language } = useLanguage();
  const news = newsItems[language];
  
  const labels = {
    pt: {
      title: 'Agência CP2B de Notícias',
      readMore: 'Leia mais',
      latest: 'Últimas notícias'
    },
    en: {
      title: 'CP2B News Agency',
      readMore: 'Read more',
      latest: 'Latest news'
    }
  }[language];

  if (!news || news.length === 0) return null;

  const featured = news[0];
  const others = news.slice(1);

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-5 border-bottom pb-3" style={{ color: '#004a80' }}>{labels.title}</h1>

      {/* Featured News - FAPESP Style */}
      <section className="mb-5">
        <Row className="g-0 bg-white shadow-sm overflow-hidden rounded-4 border border-light">
          <Col lg={7}>
            <div style={{ height: '400px' }}>
              <img src={featured.image} alt={featured.title} className="w-100 h-100 object-fit-cover" />
            </div>
          </Col>
          <Col lg={5} className="p-4 p-lg-5 d-flex flex-column justify-content-center">
            <span className={`text-${featured.badgeColor} fw-bold text-uppercase small mb-2`}>{featured.badge}</span>
            <h2 className="fw-bold mb-3 display-6">
              <Link to={featured.link} className="text-decoration-none text-dark hover-blue">{featured.title}</Link>
            </h2>
            <p className="text-muted mb-4">{featured.description}</p>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <span className="small text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{featured.date}</span>
              <Link to={featured.link} className="fw-bold text-primary text-decoration-none">{labels.readMore} +</Link>
            </div>
          </Col>
        </Row>
      </section>

      {/* Others Grid */}
      <h4 className="fw-bold mb-4 text-muted text-uppercase small" style={{ letterSpacing: '2px' }}>{labels.latest}</h4>
      <Row className="g-4">
        {others.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card className="h-100 border-0 bg-transparent">
              <div className="overflow-hidden rounded-4 mb-3" style={{ height: '200px' }}>
                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover hover-scale" />
              </div>
              <Card.Body className="p-0">
                <span className={`text-${item.badgeColor} fw-bold text-uppercase x-small d-block mb-2`} style={{ fontSize: '0.7rem' }}>{item.badge}</span>
                <Card.Title className="fw-bold mb-2 fs-5">
                  <Link to={item.link} className="text-decoration-none text-dark hover-blue">{item.title}</Link>
                </Card.Title>
                <div className="d-flex justify-content-between align-items-center mt-3">
                   <span className="x-small text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{item.date}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default News;
