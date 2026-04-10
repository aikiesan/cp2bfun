import { Container, Row, Col, Card } from 'react-bootstrap';
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
      tag: 'NA MÍDIA',
      title: 'Na Mídia',
      description: 'Cobertura jornalística, entrevistas e menções ao CP2b na mídia nacional e internacional.',
      podcastTitle: 'Podcast CP2b',
      podcastDesc: 'Ouça nossos episódios sobre biogás, bioprodutos e transição energética.',
      podcastLink: 'Ouvir episódios',
      pressKitTitle: 'Press Kit',
      pressKitDesc: 'Baixe materiais de imprensa: logos, fotos institucionais e apresentações.',
      pressKitLink: 'Acessar materiais',
    },
    en: {
      tag: 'IN THE MEDIA',
      title: 'In the Media',
      description: 'Journalistic coverage, interviews and mentions of CP2b in national and international media.',
      podcastTitle: 'CP2b Podcast',
      podcastDesc: 'Listen to our episodes on biogas, bioproducts and energy transition.',
      podcastLink: 'Listen to episodes',
      pressKitTitle: 'Press Kit',
      pressKitDesc: 'Download press materials: logos, institutional photos and presentations.',
      pressKitLink: 'Access materials',
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
          <Row className="justify-content-center text-center mb-5">
            <Col lg={7}>
              <i className="bi bi-newspaper text-success" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
              <div className="mt-4">
                <span className="mono-label text-success text-uppercase">{labels.tag}</span>
                <h1 className="display-5 fw-bold mt-2 mb-3">{labels.title}</h1>
                <p className="lead text-muted">{labels.description}</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center g-4">
            <Col xs={12} sm={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <i className="bi bi-mic-fill text-success mb-3" style={{ fontSize: '2.5rem' }}></i>
                <h4 className="fw-bold mb-2">{labels.podcastTitle}</h4>
                <p className="text-muted mb-4 flex-grow-1">{labels.podcastDesc}</p>
                <Link to="/podcast" className="btn btn-outline-success">
                  {labels.podcastLink}
                </Link>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <i className="bi bi-file-earmark-zip text-success mb-3" style={{ fontSize: '2.5rem' }}></i>
                <h4 className="fw-bold mb-2">{labels.pressKitTitle}</h4>
                <p className="text-muted mb-4 flex-grow-1">{labels.pressKitDesc}</p>
                <Link to="/press-kit" className="btn btn-outline-success">
                  {labels.pressKitLink}
                </Link>
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default Media;
