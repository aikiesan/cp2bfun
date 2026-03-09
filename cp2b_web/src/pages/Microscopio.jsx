import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const content = {
  pt: {
    tag: 'MICROSCÓPIO DE IDEIAS',
    title: 'Microscópio de Ideias',
    subtitle: 'Um espaço para artigos de opinião e reflexões dos pesquisadores do CP2B.',
    comingSoon: 'Em breve, artigos e ideias dos pesquisadores do CP2B.',
  },
  en: {
    tag: 'MICROSCÓPIO DE IDEIAS',
    title: 'Microscópio de Ideias',
    subtitle: 'A space for opinion articles and reflections from CP2B researchers.',
    comingSoon: 'Coming soon: articles and ideas from CP2B researchers.',
  },
};

const Microscopio = () => {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="mono-label text-success">{t.tag}</span>
              <h1 className="fw-bold mt-2 mb-3">{t.title}</h1>
              <p className="lead text-muted mb-5">{t.subtitle}</p>

              {/* Empty state */}
              <div
                className="text-center py-5 rounded-4"
                style={{ background: '#f8f9fa', border: '1px dashed #dee2e6' }}
              >
                <div className="mb-3" style={{ fontSize: '2.5rem' }}>🔬</div>
                <p className="text-muted mb-0">{t.comingSoon}</p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Microscopio;
