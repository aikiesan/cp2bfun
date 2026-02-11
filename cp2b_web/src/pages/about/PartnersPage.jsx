import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { fetchPartnersGrouped } from '../../services/api';

const PartnersPage = () => {
  const { language } = useLanguage();
  const [partners, setPartners] = useState({ host: [], public: [], research: [], companies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await fetchPartnersGrouped();
        if (data) {
          setPartners(data);
        }
        setError(false);
      } catch (err) {
        console.error('Error loading partners:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-3">Carregando parceiros...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Erro ao carregar parceiros</Alert.Heading>
          <p>Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.</p>
        </Alert>
      </Container>
    );
  }

  const hostPartner = partners.host[0]; // Get first host partner

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
        {hostPartner && (
          <Row className="mb-5">
            <Col md={12}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-success mb-3">{labels.headquarters}</h3>
                  <h5>{language === 'pt' ? hostPartner.name_pt : (hostPartner.name_en || hostPartner.name_pt)}</h5>
                  <p className="text-muted mb-0">{hostPartner.location}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Public Institutions */}
        {partners.public && partners.public.length > 0 && (
          <Row className="mb-5">
            <Col md={12}>
              <h3 className="fw-bold mb-4">{labels.public}</h3>
              <Row className="g-3">
                {partners.public.map((p) => (
                  <Col md={6} key={p.id}>
                    <Card className="h-100 border-0 shadow-sm hover-lift">
                      <Card.Body>
                        <h6 className="fw-bold">{language === 'pt' ? p.name_pt : (p.name_en || p.name_pt)}</h6>
                        <p className="text-muted small mb-0">{p.location}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}

        {/* Partner Companies */}
        {partners.companies && partners.companies.length > 0 && (
          <Row className="mb-5">
            <Col md={12}>
              <h3 className="fw-bold mb-4">{labels.companies}</h3>
              <Row className="g-3">
                {partners.companies.map((p) => (
                  <Col md={6} key={p.id}>
                    <Card className="h-100 border-0 shadow-sm hover-lift">
                      <Card.Body>
                        <h6 className="fw-bold">{language === 'pt' ? p.name_pt : (p.name_en || p.name_pt)}</h6>
                        <p className="text-muted small mb-0">{p.location}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}

        {/* Research Institutions */}
        {partners.research && partners.research.length > 0 && (
          <Row>
            <Col md={12}>
              <h3 className="fw-bold mb-4">{labels.research}</h3>
              <Row className="g-3">
                {partners.research.map((p) => (
                  <Col md={6} key={p.id}>
                    <Card className="h-100 border-0 shadow-sm hover-lift">
                      <Card.Body>
                        <h6 className="fw-bold">{language === 'pt' ? p.name_pt : (p.name_en || p.name_pt)}</h6>
                        <p className="text-muted small mb-0">{p.location}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default PartnersPage;
