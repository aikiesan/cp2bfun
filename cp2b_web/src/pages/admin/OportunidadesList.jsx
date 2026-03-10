import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OportunidadesList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/opportunities');
      setItems(response.data);
    } catch (err) {
      setError('Erro ao carregar oportunidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Tem certeza que deseja excluir esta oportunidade?')) return;

    setDeleting(slug);
    try {
      await api.delete(`/opportunities/${slug}`);
      setItems(items.filter((n) => n.slug !== slug));
    } catch (err) {
      setError('Erro ao excluir oportunidade');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Oportunidades</h2>
        <Button as={Link} to="/admin/oportunidades/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Nova Oportunidade
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {items.length === 0 ? (
        <Alert variant="info">Nenhuma oportunidade cadastrada.</Alert>
      ) : (
        <Table responsive hover className="bg-white rounded">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Titulo (PT)</th>
              <th>Badge</th>
              <th>Data</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td style={{ width: '80px' }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </td>
                <td>
                  <strong>{item.title_pt}</strong>
                  {item.title_en && <small className="d-block text-muted">{item.title_en}</small>}
                </td>
                <td>
                  <Badge bg={item.badge_color || 'secondary'}>{item.badge}</Badge>
                </td>
                <td>{item.date_display}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/oportunidades/${item.slug}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.slug)}
                    disabled={deleting === item.slug}
                  >
                    {deleting === item.slug ? <Spinner size="sm" /> : <i className="bi bi-trash"></i>}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OportunidadesList;
