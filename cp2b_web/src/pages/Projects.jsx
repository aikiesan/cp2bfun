import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { projectsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchProjects } from '../services/api';

const Projects = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(false);

  const labels = {
    pt: {
      title: 'Agencia CP2B de Projetos',
      readMore: 'Leia mais',
      latest: 'Ultimas projetos'
    },
    en: {
      title: 'CP2B Projects Agency',
      readMore: 'Read more',
      latest: 'Latest projects'
    }
  }[language];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const apiData = await fetchProjects();

      if (apiData && apiData.length > 0) {
        // Transform API data to match expected format
        const transformed = apiData.map(item => ({
          id: item.id,
          date: item.date_display,
          image: item.image,
          badge: item.badge,
          badgeColor: item.badge_color,
          title: language === 'pt' ? item.title_pt : (item.title_en || item.title_pt),
          description: language === 'pt' ? item.description_pt : (item.description_en || item.description_pt),
          link: `/projetos/${item.slug}`
        }));
        setProjects(transformed);
      } else {
        // Fallback to static content
        setProjects(projectsItems[language]);
        setError(true);
      }
      setLoading(false);
    };

    loadProjects();
  }, [language]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!projects || projects.length === 0) return null;

  const featured = projects[0];
  const others = projects.slice(1);

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-5 border-bottom pb-3" style={{ color: '#004a80' }}>{labels.title}</h1>

      {/* Featured Projects - FAPESP Style */}
      <section className="mb-5">
        <Row className="g-0 bg-white shadow-sm overflow-hidden rounded-4 border border-light">
          <Col lg={7}>
            <div style={{ height: '400px' }}>
              <img src={featured.image} alt={featured.title} className="w-100 h-100 object-fit-cover" />
            </div>
          </Col>
          <Col lg={5} className="p-4 p-lg-5 d-flex flex-column justify-content-center">
            <span className={`text-${featured.badgeColor} fw-bold text-uppercase small mb-2`}>{featured.badge}</span>
            <h2 className="fw-bold mb-3 display-6">
              <Link to={featured.link} className="text-decoration-none text-dark hover-blue">{featured.title}</Link>
            </h2>
            <p className="text-muted mb-4">{featured.description}</p>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <span className="small text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{featured.date}</span>
              <Link to={featured.link} className="fw-bold text-primary text-decoration-none">{labels.readMore} +</Link>
            </div>
          </Col>
        </Row>
      </section>

      {/* Others Grid */}
      <h4 className="fw-bold mb-4 text-muted text-uppercase small" style={{ letterSpacing: '2px' }}>{labels.latest}</h4>
      <Row className="g-4">
        {others.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card className="h-100 border-0 bg-transparent">
              <div className="overflow-hidden rounded-4 mb-3" style={{ height: '200px' }}>
                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover hover-scale" />
              </div>
              <Card.Body className="p-0">
                <span className={`text-${item.badgeColor} fw-bold text-uppercase x-small d-block mb-2`} style={{ fontSize: '0.7rem' }}>{item.badge}</span>
                <Card.Title className="fw-bold mb-2 fs-5">
                  <Link to={item.link} className="text-decoration-none text-dark hover-blue">{item.title}</Link>
                </Card.Title>
                <div className="d-flex justify-content-between align-items-center mt-3">
                   <span className="x-small text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{item.date}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Projects;
