import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { aboutContent, partners, projectDetails } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const content = aboutContent[language];
  const details = projectDetails;
  const tTitle = projectDetails[language].title;

  const labels = {
    pt: {
      tag: 'SOBRE O PROJETO',
      process: 'Processo FAPESP',
      start: 'Início',
      duration: 'Duração',
      lab: 'LABORATÓRIO VIVO',
      abstract: 'Resumo',
      goals: 'Objetivos',
      results: 'Resultados Esperados',
      partners: 'Instituições e Parceiros',
      headquarters: 'Sede',
      public: 'Instituições Públicas',
      companies: 'Empresas Parceiras',
      associated: 'Instituições de Pesquisa Associadas'
    },
    en: {
      tag: 'ABOUT THE PROJECT',
      process: 'FAPESP Process',
      start: 'Start',
      duration: 'Duration',
      lab: 'LIVING LAB',
      abstract: 'Abstract',
      goals: 'Objectives',
      results: 'Expected Results',
      partners: 'Institutions and Partners',
      headquarters: 'Headquarters',
      public: 'Public Institutions',
      companies: 'Partner Companies',
      associated: 'Associated Research Institutions'
    }
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-green">{labels.tag}</span>
              <h1 className="display-5 fw-bold mb-4">{tTitle}</h1>

              {/* FAPESP Badge */}
              <div className="d-inline-flex align-items-center gap-3 bg-petrol-tint px-4 py-3 mb-3" style={{ borderRadius: 'var(--radius-md)' }}>
                <span className="fw-semibold text-petrol">{labels.process}</span>
                <span className="text-muted">|</span>
                <span className="font-monospace">{details.number}</span>
              </div>

              <p className="text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                <span className="fw-medium">{labels.start}:</span> {details.startDate} &nbsp;&bull;&nbsp;
                <span className="fw-medium">{labels.duration}:</span> {details.duration}
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Hero Image */}
        <motion.div
          className="mb-5 position-relative overflow-hidden"
          style={{ borderRadius: 'var(--radius-xl)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/assets/DSC00617-1024x683.jpg"
            alt="Research"
            className="w-100 object-fit-cover"
            style={{ height: '450px', borderRadius: 0 }}
          />
          {/* Label overlay */}
          <div
            className="position-absolute bottom-0 start-0 bg-white py-2 px-4"
            style={{
              borderTopRightRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--cp2b-green)'
            }}
          >
            <span className="mono-label mb-0 text-green">{labels.lab}</span>
          </div>
        </motion.div>

        {/* Abstract Section */}
        <motion.section
          className="mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="h4 fw-bold mb-4 d-flex align-items-center gap-3">
            <span className="d-inline-block" style={{ width: '40px', height: '3px', background: 'var(--cp2b-petrol)', borderRadius: '2px' }} />
            {labels.abstract}
          </h2>
          <p className="text-muted" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.05rem' }}>
            {content.resumo}
          </p>
        </motion.section>

        {/* Goals & Results Section */}
        <motion.div
          className="mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 border-0 bg-petrol-tint">
                <Card.Body className="p-4">
                  <h3 className="h5 fw-bold mb-4 text-petrol">{labels.goals}</h3>
                  <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                    {content.objetivos}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 bg-green-tint">
                <Card.Body className="p-4">
                  <h3 className="h5 fw-bold mb-4 text-forest">{labels.results}</h3>
                  <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                    {content.resultados}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Partners Section */}
        <motion.section
          className="pt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="h4 fw-bold mb-5 d-flex align-items-center gap-3">
            <span className="d-inline-block" style={{ width: '40px', height: '3px', background: 'var(--cp2b-green)', borderRadius: '2px' }} />
            {labels.partners}
          </h2>

          {/* Headquarters */}
          <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="d-inline-block rounded-circle"
                style={{ width: '8px', height: '8px', background: 'var(--cp2b-orange)' }}
              />
              <h5 className="mb-0 fw-semibold text-orange" style={{ fontSize: '0.9rem' }}>{labels.headquarters}</h5>
            </div>
            <p className="text-muted mb-0 ms-4">{partners.host.name} - {partners.host.location}</p>
          </div>

          <Row className="g-5">
            {/* Public Institutions */}
            <Col lg={6}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="d-inline-block rounded-circle"
                  style={{ width: '8px', height: '8px', background: 'var(--cp2b-petrol)' }}
                />
                <h5 className="mb-0 fw-semibold text-petrol" style={{ fontSize: '0.9rem' }}>{labels.public}</h5>
              </div>
              <ul className="list-unstyled ms-4">
                {partners.public.map((p, idx) => (
                  <li key={idx} className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    {p.name}
                    <span className="text-muted opacity-75"> ({p.location})</span>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Partner Companies */}
            <Col lg={6}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="d-inline-block rounded-circle"
                  style={{ width: '8px', height: '8px', background: 'var(--cp2b-green)' }}
                />
                <h5 className="mb-0 fw-semibold text-green" style={{ fontSize: '0.9rem' }}>{labels.companies}</h5>
              </div>
              <ul className="list-unstyled ms-4">
                {partners.companies.map((p, idx) => (
                  <li key={idx} className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    {p.name}
                    <span className="text-muted opacity-75"> ({p.location})</span>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Associated Research Institutions */}
            <Col lg={12}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="d-inline-block rounded-circle"
                  style={{ width: '8px', height: '8px', background: 'var(--cp2b-lime)' }}
                />
                <h5 className="mb-0 fw-semibold text-forest" style={{ fontSize: '0.9rem' }}>{labels.associated}</h5>
              </div>
              <Row className="ms-2">
                {partners.research.map((p, idx) => (
                  <Col md={6} key={idx}>
                    <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                      {p.name}
                      <span className="text-muted opacity-75"> ({p.location})</span>
                    </p>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </motion.section>
      </Container>
    </motion.div>
  );
};

export default About;
