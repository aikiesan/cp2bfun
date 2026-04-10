import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import api from '../services/api';

const STATIC_ITEMS = {
  pt: [
    { title_pt: 'Logotipos', icon: 'bi-images', file_url: '#' },
    { title_pt: 'Fotos Institucionais', icon: 'bi-camera', file_url: '#' },
    { title_pt: 'Apresentação CP2b', icon: 'bi-file-earmark-slides', file_url: '#' },
  ],
  en: [
    { title_pt: 'Logos', icon: 'bi-images', file_url: '#' },
    { title_pt: 'Institutional Photos', icon: 'bi-camera', file_url: '#' },
    { title_pt: 'CP2b Presentation', icon: 'bi-file-earmark-slides', file_url: '#' },
  ],
};

const PressKit = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.pressKit[language] || pageSeo.pressKit.pt;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      tag: 'IMPRENSA',
      title: 'Press Kit',
      description: 'Baixe os materiais de imprensa do CP2b: logos, fotos institucionais e apresentações.',
      download: 'Baixar',
    },
    en: {
      tag: 'PRESS',
      title: 'Press Kit',
      description: 'Download CP2b press materials: logos, institutional photos and presentations.',
      download: 'Download',
    },
  }[language];

  useEffect(() => {
    api.get('/press-kit')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems(STATIC_ITEMS[language]);
        }
      })
      .catch(() => setItems(STATIC_ITEMS[language]))
      .finally(() => setLoading(false));
  }, [language]);

  const getTitle = (item) =>
    language === 'pt' ? item.title_pt : (item.title_en || item.title_pt);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Container className="py-5">
          <Row className="justify-content-center text-center">
            <Col lg={7}>
              <i className="bi bi-file-earmark-zip text-success" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
              <div className="mt-4">
                <span className="mono-label text-success text-uppercase">{labels.tag}</span>
                <h1 className="display-5 fw-bold mt-2 mb-3">{labels.title}</h1>
                <p className="lead text-muted mb-5">{labels.description}</p>

                {loading ? (
                  <Spinner animation="border" variant="success" />
                ) : (
                  <Row className="justify-content-center g-3">
                    {items.map((item, idx) => (
                      <Col xs={12} sm={6} md={4} key={idx}>
                        <Button
                          variant="outline-success"
                          className="w-100 px-3 py-3 d-flex flex-column align-items-center gap-2"
                          href={item.file_url !== '#' ? item.file_url : undefined}
                          target={item.file_url !== '#' ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          disabled={item.file_url === '#'}
                        >
                          <i className={`bi ${item.icon || 'bi-file-earmark-pdf'}`} style={{ fontSize: '1.5rem' }}></i>
                          <span>{getTitle(item)}</span>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default PressKit;
