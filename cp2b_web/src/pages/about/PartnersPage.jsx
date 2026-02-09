import { Container, Row, Col, Card } from 'react-bootstrap';
import { partners } from '../../data/content';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

const PartnersPage = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      title: 'Parceiros',
      description: 'Instituições e empresas que colaboram com o CP2B',
      headquarters: 'Sede',
      public: 'Instituições Públicas',
      companies: 'Empresas Parceiras',
      research: 'Instituições de Pesquisa Associadas'
    },
    en: {
      title: 'Partners',
      description: 'Institutions and companies collaborating with CP2B',
      headquarters: 'Headquarters',
      public: 'Public Institutions',
      companies: 'Partner Companies',
      research: 'Associated Research Institutions'
    }
  }[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8}>
            <span className="mono-label text-success">CP2B</span>
            <h1 className="display-4 fw-bold mb-4">{labels.title}</h1>
            <p className="lead text-muted">{labels.description}</p>
          </Col>
        </Row>

        {/* Headquarters */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="fw-bold text-success mb-3">{labels.headquarters}</h3>
                <h5>{partners.host.name}</h5>
                <p className="text-muted mb-0">{partners.host.location}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Public Institutions */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{labels.public}</h3>
            <Row className="g-3">
              {partners.public.map((p, idx) => (
                <Col md={6} key={idx}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                    <Card.Body>
                      <h6 className="fw-bold">{p.name}</h6>
                      <p className="text-muted small mb-0">{p.location}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Partner Companies */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{labels.companies}</h3>
            <Row className="g-3">
              {partners.companies.map((p, idx) => (
                <Col md={6} key={idx}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                    <Card.Body>
                      <h6 className="fw-bold">{p.name}</h6>
                      <p className="text-muted small mb-0">{p.location}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Research Institutions */}
        <Row>
          <Col md={12}>
            <h3 className="fw-bold mb-4">{labels.research}</h3>
            <Row className="g-3">
              {partners.research.map((p, idx) => (
                <Col md={6} key={idx}>
                  <Card className="h-100 border-0 shadow-sm hover-lift">
                    <Card.Body>
                      <h6 className="fw-bold">{p.name}</h6>
                      <p className="text-muted small mb-0">{p.location}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default PartnersPage;
