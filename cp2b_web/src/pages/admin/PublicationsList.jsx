import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PublicationsList = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ year: 'all', type: 'all' });

  useEffect(() => {
    fetchPublications();
  }, [filters]);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year !== 'all') params.append('year', filters.year);
      if (filters.type !== 'all') params.append('type', filters.type);

      const response = await api.get(`/publications?${params}`);
      setPublications(response.data);
    } catch (err) {
      setError('Erro ao carregar publicações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;

    try {
      await api.delete(`/publications/${id}`);
      setPublications(publications.filter(p => p.id !== id));
    } catch (err) {
      setError('Erro ao excluir publicação');
    }
  };

  const typeLabels = {
    article: 'Artigo',
    book: 'Livro',
    chapter: 'Capítulo',
    thesis: 'Tese',
    conference: 'Conferência'
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Publicações</h2>
          <p className="text-muted mb-0">{publications.length} publicações cadastradas</p>
        </div>
        <Button as={Link} to="/admin/publications/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Nova Publicação
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="all">Todos os anos</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">Todos os tipos</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Table responsive hover className="bg-white rounded">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autores</th>
            <th>Tipo</th>
            <th>Ano</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {publications.map(pub => (
            <tr key={pub.id}>
              <td>
                <strong>{pub.title_pt}</strong>
                {pub.title_en && (
                  <small className="d-block text-muted">{pub.title_en}</small>
                )}
              </td>
              <td>{pub.authors}</td>
              <td>
                <Badge bg="secondary">{typeLabels[pub.publication_type]}</Badge>
              </td>
              <td>{pub.year}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/admin/publications/${pub.id}`)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(pub.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {publications.length === 0 && (
        <p className="text-center text-muted py-5">Nenhuma publicação cadastrada</p>
      )}
    </Container>
  );
};

export default PublicationsList;
