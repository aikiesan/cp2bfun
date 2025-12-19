import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { aboutContent, partners, projectDetails } from '../data/content';

const About = () => (
  <Container className="py-5">
    <Row className="mb-5 align-items-center">
      <Col lg={8}>
        <span className="mono-label text-success">SOBRE O PROJETO</span>
        <h1 className="display-4 fw-bold mb-4">{projectDetails.titlePt}</h1>
        <p className="lead text-muted mb-2"><strong>Processo FAPESP:</strong> {projectDetails.number}</p>
        <p className="text-muted small">
            <strong>Início:</strong> {projectDetails.startDate} | <strong>Duração:</strong> {projectDetails.duration}
        </p>
      </Col>
    </Row>

    <div className="mb-5 position-relative">
       <img 
         src="/assets/DSC00617-1024x683.jpg" 
         alt="Pesquisa no CP2B" 
         className="w-100 object-fit-cover" 
         style={{ height: '500px', filter: 'grayscale(100%)' }} 
         onMouseOver={e => e.currentTarget.style.filter='none'} 
         onMouseOut={e => e.currentTarget.style.filter='grayscale(100%)'}
       />
       <div className="position-absolute bottom-0 start-0 bg-white p-3 border-top border-end border-dark" style={{ maxWidth: '300px' }}>
          <span className="mono-label mb-0">LABORATÓRIO VIVO</span>
       </div>
    </div>

    <Row className="gy-5 mb-5">
      <Col md={12}>
        <h3 className="fw-bold mb-4">Resumo</h3>
        <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{aboutContent.resumo}</p>
      </Col>
    </Row>

    <Row className="gy-5 mb-5 bg-light p-4 rounded-3">
        <Col md={6}>
            <h3 className="fw-bold mb-3">Objetivos</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{aboutContent.objetivos}</p>
        </Col>
        <Col md={6}>
            <h3 className="fw-bold mb-3">Resultados Esperados</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{aboutContent.resultados}</p>
        </Col>
    </Row>

    {/* Partners Section */}
    <section className="mb-5">
        <h3 className="fw-bold mb-4 border-bottom pb-2">Instituições e Parceiros</h3>
        
        <div className="mb-4">
            <h5 className="fw-bold text-success">Sede</h5>
            <p>{partners.host.name} - {partners.host.location}</p>
        </div>

        <Row className="g-4">
            <Col md={6}>
                <h5 className="fw-bold mb-3">Instituições Públicas</h5>
                <ul className="list-unstyled">
                    {partners.public.map((p, idx) => (
                        <li key={idx} className="mb-2 text-muted">• {p.name} ({p.location})</li>
                    ))}
                </ul>
            </Col>
            <Col md={6}>
                <h5 className="fw-bold mb-3">Empresas Parceiras</h5>
                <ul className="list-unstyled">
                    {partners.companies.map((p, idx) => (
                        <li key={idx} className="mb-2 text-muted">• {p.name} ({p.location})</li>
                    ))}
                </ul>
            </Col>
            <Col md={12}>
                <h5 className="fw-bold mb-3">Instituições de Pesquisa Associadas</h5>
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

export default About;