import React from 'react';
import { Container, Accordion, Row, Col, Card } from 'react-bootstrap';
import { researchAxes, flagshipProjects, sdgMap } from '../data/content';

const Research = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8}>
          <span className="mono-label text-success">Oito Eixos Temáticos</span>
          <h1 className="display-5 fw-bold mb-4">Estrutura de Pesquisa</h1>
          <p className="lead text-muted">
            Para atingir suas metas, a atuação do CP2B está organizada em oito eixos temáticos integrados, cobrindo desde o inventário de resíduos até políticas públicas.
          </p>
        </Col>
      </Row>

      {/* Flagship Projects Section */}
      <section className="mb-5">
        <h3 className="fw-bold mb-4">Projetos em Destaque</h3>
        <Row className="g-4">
          {flagshipProjects.map((project) => (
            <Col md={4} key={project.id}>
              <Card className="h-100 border-0 shadow-sm">
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                  <img src={project.image} alt={project.title} className="w-100 h-100 object-fit-cover" />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold fs-6">{project.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {project.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <div className="border-top border-dark pt-5">
        <h3 className="fw-bold mb-4">Detalhamento dos Eixos</h3>
        <Accordion flush alwaysOpen>
          {researchAxes.map((axis) => (
            <Accordion.Item eventKey={axis.id} key={axis.id} className="border-bottom border-dark bg-transparent">
              <Accordion.Header>
                <div className="py-2">
                    <span className="d-block mono-label text-muted mb-1">EIXO {axis.id}</span>
                    <span className="fw-bold fs-5">{axis.title.split('–')[1] || axis.title}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pb-4 pt-0">
                <p className="fw-bold text-success mb-3 small text-uppercase">{axis.coordinator}</p>
                <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>{axis.content}</p>
                
                {/* SDG Images */}
                {axis.sdgs && axis.sdgs.length > 0 && (
                  <div>
                    <span className="mono-label text-muted d-block mb-2">ODS Relacionados:</span>
                    <div className="d-flex flex-wrap gap-2">
                      {axis.sdgs.map((sdgId) => (
                        <img 
                          key={sdgId} 
                          src={sdgMap[sdgId]} 
                          alt={`ODS ${sdgId}`} 
                          title={`Objetivo de Desenvolvimento Sustentável ${sdgId}`}
                          style={{ width: '60px', height: '60px', borderRadius: '8px' }} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Container>
  );
};

export default Research;
