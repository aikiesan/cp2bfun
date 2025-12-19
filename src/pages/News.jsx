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
      title: 'Notícias',
      subtitle: 'Acompanhe as últimas atualizações, eventos e avanços do centro.',
      readMore: 'Ler notícia →'
    },
    en: {
      title: 'News',
      subtitle: 'Follow the latest updates, events, and breakthroughs from the center.',
      readMore: 'Read more →'
    }
  }[language];

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="display-4 fw-bold mb-3">{labels.title}</h1>
        <p className="lead text-muted">{labels.subtitle}</p>
      </div>

      <Row className="g-4">
        {news.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card className="h-100 border-0 shadow-sm">
              <div className="card-img-top overflow-hidden" style={{ height: '200px' }}>
                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" />
              </div>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className={`badge bg-${item.badgeColor} bg-opacity-10 text-${item.badgeColor} rounded-pill`}>{item.badge}</span>
                  <small className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{item.date}</small>
                </div>
                <Card.Title className="fw-bold mb-3">{item.title}</Card.Title>
                <Card.Text className="text-muted small mb-4">
                  {item.description}
                </Card.Text>
                <Link to={item.link} className="btn btn-link text-decoration-none p-0 fw-bold text-dark">{labels.readMore}</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default News;
