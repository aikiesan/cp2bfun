import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { fetchPartnersGrouped } from '../../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../../data/content';
import SeoHead from '../../components/SeoHead';
import PageHero from '../../components/PageHero';

/**
 * Extracts monogram initials from a partner name.
 * Prefers acronyms in parentheses (e.g. "UNIFAL" from "Universidade... (UNIFAL)")
 * or the first two main words' initials.
 */
const getPartnerInitials = (name) => {
  if (!name) return 'CP';
  const match = name.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    const acronym = match[1].replace(/[^a-zA-Z0-9]/g, '');
    if (acronym.length >= 2 && acronym.length <= 8) {
      return acronym.slice(0, 6);
    }
  }
  return name
    .split(' ')
    .filter((w) => w.length > 2 && !['dos', 'das', 'com', 'para', 'and', 'the', 'for', 'dos', 'del'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const PartnerCard = ({ partner, language }) => {
  const [imgError, setImgError] = useState(false);
  const name = language === 'pt' ? partner.name_pt : (partner.name_en || partner.name_pt);
  const initials = getPartnerInitials(name);
  const hasLogo = Boolean(partner.logo) && !imgError;

  const cardContent = (
    <Card
      className="h-100 border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)',
      }}
    >
      <Card.Body className="d-flex flex-column p-4">
        <div
          className="d-flex align-items-center justify-content-center mb-3 rounded"
          style={{
            height: '90px',
            backgroundColor: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            padding: 'var(--space-2)',
          }}
        >
          {hasLogo ? (
            <img
              src={partner.logo}
              alt={name}
              onError={() => setImgError(true)}
              style={{
                maxHeight: '64px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--gray-200)',
                color: 'var(--brand-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: initials.length > 3 ? '0.82rem' : '1.1rem',
                letterSpacing: 'var(--tracking-wide)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
        </div>
        <h6
          className="fw-bold mb-2 flex-grow-1"
          style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}
        >
          {name}
        </h6>
        <p className="mb-0 small" style={{ color: 'var(--text-secondary)' }}>
          {partner.location}
        </p>
        {partner.website && (
          <div className="mt-3 pt-2 border-top" style={{ borderColor: 'var(--border-divider)' }}>
            <span className="mono-label" style={{ color: 'var(--brand-primary)', fontSize: '0.7rem' }}>
              {language === 'pt' ? 'Visitar website ↗' : 'Visit website ↗'}
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none text-reset d-block h-100 hover-lift"
        aria-label={name}
      >
        {cardContent}
      </a>
    );
  }

  return <div className="h-100">{cardContent}</div>;
};

const HeadquartersCard = ({ partner, language, label }) => {
  const [imgError, setImgError] = useState(false);
  const name = language === 'pt' ? partner.name_pt : (partner.name_en || partner.name_pt);
  const initials = getPartnerInitials(name);
  const hasLogo = Boolean(partner.logo) && !imgError;

  return (
    <Card
      className="border shadow-sm mb-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Card.Body className="p-4 p-md-5">
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--radius-lg)',
              flexShrink: 0,
              padding: 'var(--space-2)',
            }}
          >
            {hasLogo ? (
              <img
                src={partner.logo}
                alt={name}
                onError={() => setImgError(true)}
                style={{
                  maxHeight: '80px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--gray-200)',
                  color: 'var(--brand-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: initials.length > 3 ? '0.92rem' : '1.3rem',
                  letterSpacing: 'var(--tracking-wide)',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <span className="mono-label" style={{ color: 'var(--brand-primary)' }}>
              {label}
            </span>
            <h4 className="fw-bold mt-1 mb-2" style={{ color: 'var(--text-primary)' }}>
              {name}
            </h4>
            <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
              {partner.location}
            </p>
            {partner.website && (
              <div className="mt-3">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm"
                >
                  {language === 'pt' ? 'Acessar website oficial' : 'Visit official website'} ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const PartnersPage = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.partners[language] || pageSeo.partners.pt;
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
      description: 'Instituições e empresas que colaboram com o CP2b',
      headquarters: 'Sede',
      public: 'Instituições Públicas',
      companies: 'Empresas Parceiras',
      research: 'Instituições de Pesquisa Associadas',
    },
    en: {
      title: 'Partners',
      description: 'Institutions and companies collaborating with CP2b',
      headquarters: 'Headquarters',
      public: 'Public Institutions',
      companies: 'Partner Companies',
      research: 'Associated Research Institutions',
    },
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

  const hostPartner = partners.host[0];

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <PageHero eyebrow="CP2b" title={labels.title} subtitle={labels.description} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container className="py-5">
          {/* Headquarters */}
          {hostPartner && (
            <Row className="mb-5">
              <Col md={12}>
                <HeadquartersCard
                  partner={hostPartner}
                  language={language}
                  label={labels.headquarters}
                />
              </Col>
            </Row>
          )}

          {/* Public Institutions (controlled by defeso eleitoral in backend) */}
          {partners.public && partners.public.length > 0 && (
            <Row className="mb-5">
              <Col md={12}>
                <h3 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {labels.public}
                </h3>
                <Row className="g-4">
                  {partners.public.map((p) => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={p.id}>
                      <PartnerCard partner={p} language={language} />
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
                <h3 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {labels.companies}
                </h3>
                <Row className="g-4">
                  {partners.companies.map((p) => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={p.id}>
                      <PartnerCard partner={p} language={language} />
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
                <h3 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {labels.research}
                </h3>
                <Row className="g-4">
                  {partners.research.map((p) => (
                    <Col xs={12} sm={6} lg={4} xl={3} key={p.id}>
                      <PartnerCard partner={p} language={language} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default PartnersPage;
