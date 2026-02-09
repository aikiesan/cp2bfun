import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Badge } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Publications = () => {
  const { language } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [groupedByYear, setGroupedByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'all',
    type: 'all',
    axis: 'all',
    search: ''
  });

  useEffect(() => {
    fetchPublications();
  }, [filters]);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year !== 'all') params.append('year', filters.year);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.axis !== 'all') params.append('axis', filters.axis);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/publications?${params}`);
      setPublications(response.data);

      // Group by year
      const grouped = response.data.reduce((acc, pub) => {
        const year = pub.year || 'Unknown';
        if (!acc[year]) acc[year] = [];
        acc[year].push(pub);
        return acc;
      }, {});
      setGroupedByYear(grouped);
    } catch (err) {
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    article: language === 'pt' ? 'Artigo' : 'Article',
    book: language === 'pt' ? 'Livro' : 'Book',
    chapter: language === 'pt' ? 'Capítulo' : 'Chapter',
    thesis: language === 'pt' ? 'Tese' : 'Thesis',
    conference: language === 'pt' ? 'Conferência' : 'Conference'
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <Container className="py-5">
      <h1 className="mb-4">{language === 'pt' ? 'Publicações' : 'Publications'}</h1>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{language === 'pt' ? 'Ano' : 'Year'}</Form.Label>
                <Form.Select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  <option value="all">{language === 'pt' ? 'Todos' : 'All'}</option>
                  {sortedYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{language === 'pt' ? 'Tipo' : 'Type'}</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">{language === 'pt' ? 'Todos' : 'All'}</option>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{language === 'pt' ? 'Buscar' : 'Search'}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={language === 'pt' ? 'Título, autores, revista...' : 'Title, authors, journal...'}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Publications grouped by year */}
      {sortedYears.map(year => (
        <div key={year} className="mb-5">
          <h2 className="mb-3">{year}</h2>
          {groupedByYear[year].map(pub => {
            const title = language === 'pt' ? pub.title_pt : (pub.title_en || pub.title_pt);
            const abstract = language === 'pt' ? pub.abstract_pt : (pub.abstract_en || pub.abstract_pt);

            return (
              <Card key={pub.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-1">{title}</h5>
                    <Badge bg="secondary">{typeLabels[pub.publication_type]}</Badge>
                  </div>
                  <p className="text-muted mb-2"><strong>{pub.authors}</strong></p>
                  {pub.journal && (
                    <p className="text-muted mb-2">
                      <em>{pub.journal}</em>, {pub.year}
                    </p>
                  )}
                  {abstract && <p className="mb-2">{abstract}</p>}
                  <div className="d-flex gap-2">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        DOI
                      </a>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        {language === 'pt' ? 'Link' : 'Link'}
                      </a>
                    )}
                    {pub.pdf_url && (
                      <a
                        href={pub.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ))}

      {publications.length === 0 && (
        <p className="text-center text-muted">
          {language === 'pt' ? 'Nenhuma publicação encontrada' : 'No publications found'}
        </p>
      )}
    </Container>
  );
};

export default Publications;
