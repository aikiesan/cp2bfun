import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels, flagshipProjects } from '../data/content';
import SEO from '../components/SEO';

const Projects = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];
  const projects = flagshipProjects[language];

  return (
    <Container className="py-5">
      <SEO
        title={language === 'pt' ? 'Projetos' : 'Projects'}
        description={language === 'pt'
          ? 'Projetos de pesquisa do CP2B em biogás e bioprodutos: iniciativas de alto impacto para a transição energética e desenvolvimento sustentável em São Paulo.'
          : 'CP2B research projects in biogas and bioproducts: high-impact initiatives for energy transition and sustainable development in São Paulo.'}
        keywords={language === 'pt'
          ? 'projetos CP2B, pesquisa biogás, bioprodutos, UNICAMP'
          : 'CP2B projects, biogas research, bioproducts, UNICAMP'}
        url="/projetos"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'pt' ? 'Projetos' : 'Projects', url: '/projetos' }
        ]}
      />
      <h1 className="display-4 fw-bold mb-4">{t.projects}</h1>
      <p className="lead text-muted mb-5">
        {language === 'pt' 
          ? 'Conheça nossos projetos em destaque e iniciativas de impacto.' 
          : 'Discover our flagship projects and high-impact initiatives.'}
      </p>

      <Row className="g-4">
        {projects.map((project) => (
          <Col md={6} key={project.id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden rounded-4">
              <div style={{ height: '300px' }}>
                <img src={project.image} alt={project.title} className="w-100 h-100 object-fit-cover" />
              </div>
              <Card.Body className="p-4">
                <Card.Title className="fw-bold fs-4 mb-3">{project.title}</Card.Title>
                <Card.Text className="text-muted">
                  {project.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Projects;