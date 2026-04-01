import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const PressKit = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.pressKit[language] || pageSeo.pressKit.pt;

  const labels = {
    pt: {
      tag: 'IMPRENSA',
      title: 'Press Kit',
      description: 'Baixe os materiais de imprensa do CP2b: logos, fotos institucionais e apresentações.',
      downloads: [
        { label: 'Logotipos', icon: 'bi-images' },
        { label: 'Fotos Institucionais', icon: 'bi-camera' },
        { label: 'Apresentação CP2b', icon: 'bi-file-earmark-slides' },
      ],
    },
    en: {
      tag: 'PRESS',
      title: 'Press Kit',
      description: 'Download CP2b press materials: logos, institutional photos and presentations.',
      downloads: [
        { label: 'Logos', icon: 'bi-images' },
        { label: 'Institutional Photos', icon: 'bi-camera' },
        { label: 'CP2b Presentation', icon: 'bi-file-earmark-slides' },
      ],
    },
  }[language];

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
                <Row className="justify-content-center g-3">
                  {labels.downloads.map((item) => (
                    <Col xs={12} sm={4} key={item.label}>
                      <Button
                        variant="outline-success"
                        className="w-100 px-3 py-3 d-flex flex-column align-items-center gap-2"
                        href="#"
                      >
                        <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem' }}></i>
                        <span>{item.label}</span>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default PressKit;
