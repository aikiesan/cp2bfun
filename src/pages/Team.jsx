import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { teamMembers } from '../data/content';

const Team = () => (
  <Container className="py-5">
    <Row className="mb-5">
      <Col lg={8}>
        <span className="mono-label text-success">Quem Faz</span>
        <h1 className="display-5 fw-bold mb-4">Equipe CP2B</h1>
        <p className="lead text-muted">
          Pesquisadores e coordenadores dedicados ao desenvolvimento de soluções em biogás e bioprodutos.
        </p>
      </Col>
    </Row>

    <Row className="g-4">
      {teamMembers.map((member, idx) => (
        <Col md={4} key={idx}>
          <Card className="h-100 p-3">
            <Card.Body>
              <h5 className="fw-bold mb-1">{member.name}</h5>
              <p className="text-success small mb-3 fw-bold text-uppercase">{member.role}</p>
              <div className="text-muted small" style={{ fontFamily: 'var(--font-mono)' }}>
                <div className="mb-1">{member.email}</div>
                <div>{member.phone}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Team;
