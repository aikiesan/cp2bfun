import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { teamMembers } from '../data/content';

const Team = () => (
  <Container className="py-5">
    <Row className="mb-5">
      <Col lg={8}>
        <span className="mono-label text-success">QUEM FAZ</span>
        <h1 className="display-5 fw-bold mb-4">Equipe CP2B</h1>
        <p className="lead text-muted">
          Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.
        </p>
      </Col>
    </Row>

    <Row className="g-4">
      {teamMembers.map((member, idx) => (
        <Col md={4} lg={3} key={idx}>
          <Card className="h-100 p-3 border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-2">{member.name}</h6>
              <p className="text-success x-small mb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>{member.role}</p>
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

export default Team;
