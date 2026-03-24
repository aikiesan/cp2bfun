import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const Media = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.media[language] || pageSeo.media.pt;

  const labels = {
    pt: {
      tag: 'EM BREVE',
      title: 'Na Mídia',
      description: 'Cobertura jornalística, entrevistas e menções ao CP2b na mídia nacional e internacional.',
      cta: 'Fique atento às novidades',
      ctaLink: '/contato',
    },
    en: {
      tag: 'COMING SOON',
      title: 'In the Media',
      description: 'Journalistic coverage, interviews and mentions of CP2b in national and international media.',
      cta: 'Stay tuned for updates',
      ctaLink: '/contato',
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
            <i className="bi bi-newspaper text-success" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
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
    </>
  );
};

export default Media;
