import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels, flagshipProjects } from '../data/content';

const Projects = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];
  const projects = flagshipProjects[language];

  return (
    <Container className="py-5">
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