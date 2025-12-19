import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { teamMembers } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Team = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'QUEM FAZ',
      title: 'Equipe CP2B',
      subtitle: 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.'
    },
    en: {
      tag: 'WHO WE ARE',
      title: 'CP2B Team',
      subtitle: 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'
    }
  }[language];

  // Helper to translate roles on the fly if needed, or we could add them to content.js
  const translateRole = (role) => {
    if (language === 'pt') return role;
    return role
      .replace('Pesquisador Responsável', 'Lead Researcher')
      .replace('na Instituição Parceira', 'at Partner Institution')
      .replace('Pesquisador Principal', 'Principal Investigator')
      .replace('Pesquisador Associado', 'Associate Researcher')
      .replace('Apoio Técnico', 'Technical Support')
      .replace('Apoio Administrativo', 'Administrative Support')
      .replace('Estudante sem Bolsa', 'Student (unfunded)');
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8}>
          <span className="mono-label text-success">{labels.tag}</span>
          <h1 className="display-5 fw-bold mb-4">{labels.title}</h1>
          <p className="lead text-muted">
            {labels.subtitle}
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {teamMembers.map((member, idx) => (
          <Col md={4} lg={3} key={idx}>
            <Card className="h-100 p-3 border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold mb-2">{member.name}</h6>
                <p className="text-success x-small mb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
                    {translateRole(member.role)}
                </p>
                <p className="text-muted small mb-3 fst-italic">{member.institution}</p>
                
                {(member.email || member.phone) && (
                  <div className="text-muted small border-top pt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {member.email && <div className="mb-1 text-truncate" title={member.email}>{member.email}</div>}
                    {member.phone && <div>{member.phone}</div>}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Team;
