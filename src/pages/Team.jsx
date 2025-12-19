import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { teamMembers, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Team = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8}>
          <span className="mono-label text-success">{t.team}</span>
          <h1 className="display-5 fw-bold mb-4">{language === 'pt' ? 'Quem Faz o CP2B' : 'Our Team'}</h1>
          <p className="lead text-muted">
            {language === 'pt' 
              ? 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.' 
              : 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'}
          </p>
        </Col>
      </Row>

      {teamMembers.map((group, gIdx) => (
        <section key={group.category} className="mb-5">
          <h3 className="fw-bold mb-4 border-bottom pb-2 text-uppercase fs-5" style={{ letterSpacing: '1px' }}>
            {group[language]}
          </h3>
          <Row className="g-4">
            {group.members.map((member, idx) => (
              <Col md={4} lg={3} key={idx}>
                <Card className="h-100 p-3 border-0 shadow-sm hover-lift" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-2">
                    <h6 className="fw-bold mb-1" style={{ color: '#222' }}>{member.name}</h6>
                    <p className="text-success small mb-2 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {member.role}
                    </p>
                    <p className="text-muted small mb-3 fst-italic" style={{ fontSize: '0.8rem' }}>{member.institution}</p>
                    
                    {(member.email || member.phone) && (
                      <div className="text-muted small border-top pt-2 mt-auto" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        {member.email && <div className="mb-1 text-truncate" title={member.email}>{member.email}</div>}
                        {member.phone && <div>{member.phone}</div>}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </Container>
  );
};

export default Team;
