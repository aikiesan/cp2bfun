import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Opportunities = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'EM BREVE',
      title: 'Oportunidades',
      description: 'Vagas de pós-graduação, bolsas e chamadas abertas do CP2B.',
      cta: 'Fique atento às novidades',
      ctaLink: '/contato',
    },
    en: {
      tag: 'COMING SOON',
      title: 'Opportunities',
      description: 'Graduate positions, scholarships and open calls from CP2B.',
      cta: 'Stay tuned for updates',
      ctaLink: '/contato',
    },
  }[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col lg={7}>
            <i className="bi bi-briefcase text-success" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
            <div className="mt-4">
              <span className="mono-label text-success text-uppercase">{labels.tag}</span>
              <h1 className="display-5 fw-bold mt-2 mb-3">{labels.title}</h1>
              <p className="lead text-muted mb-4">{labels.description}</p>
              <Link to={labels.ctaLink} className="btn btn-outline-success px-4">
                {labels.cta}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Opportunities;
