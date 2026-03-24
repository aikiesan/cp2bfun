import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { fetchOpportunities } from '../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const Opportunities = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.opportunities[language] || pageSeo.opportunities.pt;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      tag: 'CP2B',
      title: 'Oportunidades',
      description: 'Vagas de pós-graduação, bolsas e chamadas abertas do CP2b.',
      empty: 'Nenhuma oportunidade disponível no momento.',
      readMore: 'Saiba mais',
    },
    en: {
      tag: 'CP2B',
      title: 'Opportunities',
      description: 'Graduate positions, scholarships and open calls from CP2b.',
      empty: 'No opportunities available at the moment.',
      readMore: 'Read more',
    },
  }[language];

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchOpportunities();
      setItems(data || []);
      setLoading(false);
    };
    loadItems();
  }, []);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        <Row className="mb-5">
          <Col>
            <span className="mono-label text-success text-uppercase">{labels.tag}</span>
            <h1 className="display-5 fw-bold mt-2 mb-2">{labels.title}</h1>
            <p className="lead text-muted">{labels.description}</p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : items.length === 0 ? (
          <Row className="justify-content-center text-center">
            <Col lg={6}>
              <i className="bi bi-briefcase text-success" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              <p className="lead text-muted mt-3">{labels.empty}</p>
            </Col>
          </Row>
        ) : (
          <Row className="g-4">
            {items.map((item) => (
              <Col lg={4} md={6} key={item.slug}>
                <Card className="h-100 border-0 shadow-sm" style={{ transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {item.image && (
                    <Card.Img
                      variant="top"
                      src={item.image}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    {item.badge && (
                      <Badge bg={item.badge_color || 'success'} className="mb-2 align-self-start">
                        {item.badge}
                      </Badge>
                    )}
                    <Card.Title className="fw-bold">
                      {language === 'pt' ? item.title_pt : (item.title_en || item.title_pt)}
                    </Card.Title>
                    <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                      {language === 'pt' ? item.description_pt : (item.description_en || item.description_pt)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      {item.date_display && (
                        <small className="text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
                          {item.date_display}
                        </small>
                      )}
                      <Link
                        to={`/oportunidades/${item.slug}`}
                        className="btn btn-outline-success btn-sm ms-auto"
                      >
                        {labels.readMore}
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </motion.div>
    </>
  );
};

export default Opportunities;
