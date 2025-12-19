import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { aboutContent, partners, projectDetails } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const content = aboutContent[language];
  const details = projectDetails; // Shared details
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

  return (
    <Container className="py-5">
      <Row className="mb-5 align-items-center">
        <Col lg={8}>
          <span className="mono-label text-success">{labels.tag}</span>
          <h1 className="display-4 fw-bold mb-4">{tTitle}</h1>
          <p className="lead text-muted mb-2"><strong>{labels.process}:</strong> {details.number}</p>
          <p className="text-muted small">
              <strong>{labels.start}:</strong> {details.startDate} | <strong>{labels.duration}:</strong> {details.duration}
          </p>
        </Col>
      </Row>

      <div className="mb-5 position-relative">
         <img 
           src="/assets/DSC00617-1024x683.jpg" 
           alt="Research" 
           className="w-100 object-fit-cover" 
           style={{ height: '500px', filter: 'grayscale(100%)' }} 
           onMouseOver={e => e.currentTarget.style.filter='none'} 
           onMouseOut={e => e.currentTarget.style.filter='grayscale(100%)'}
         />
         <div className="position-absolute bottom-0 start-0 bg-white p-3 border-top border-end border-dark" style={{ maxWidth: '300px' }}>
            <span className="mono-label mb-0">{labels.lab}</span>
         </div>
      </div>

      <Row className="gy-5 mb-5">
        <Col md={12}>
          <h3 className="fw-bold mb-4">{labels.abstract}</h3>
          <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{content.resumo}</p>
        </Col>
      </Row>

      <Row className="gy-5 mb-5 bg-light p-4 rounded-3">
          <Col md={6}>
              <h3 className="fw-bold mb-3">{labels.goals}</h3>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{content.objetivos}</p>
          </Col>
          <Col md={6}>
              <h3 className="fw-bold mb-3">{labels.results}</h3>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{content.resultados}</p>
          </Col>
      </Row>

      {/* Partners Section */}
      <section className="mb-5">
          <h3 className="fw-bold mb-4 border-bottom pb-2">{labels.partners}</h3>
          
          <div className="mb-4">
              <h5 className="fw-bold text-success">{labels.headquarters}</h5>
              <p>{partners.host.name} - {partners.host.location}</p>
          </div>

          <Row className="g-4">
              <Col md={6}>
                  <h5 className="fw-bold mb-3">{labels.public}</h5>
                  <ul className="list-unstyled">
                      {partners.public.map((p, idx) => (
                          <li key={idx} className="mb-2 text-muted">• {p.name} ({p.location})</li>
                      ))}
                  </ul>
              </Col>
              <Col md={6}>
                  <h5 className="fw-bold mb-3">{labels.companies}</h5>
                  <ul className="list-unstyled">
                      {partners.companies.map((p, idx) => (
                          <li key={idx} className="mb-2 text-muted">• {p.name} ({p.location})</li>
                      ))}
                  </ul>
              </Col>
              <Col md={12}>
                  <h5 className="fw-bold mb-3">{labels.associated}</h5>
                  <Row>
                      {partners.research.map((p, idx) => (
                          <Col md={6} key={idx}>
                              <div className="mb-2 text-muted">• {p.name} ({p.location})</div>
                          </Col>
                      ))}
                  </Row>
              </Col>
          </Row>
      </section>
    </Container>
  );
};

export default About;