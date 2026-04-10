import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PodcastList = () => {
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
      const res = await api.get('/podcast/all');
      setItems(res.data);
    } catch (err) {
      setError('Erro ao carregar episódios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este episódio?')) return;
    setDeleting(id);
    try {
      await api.delete(`/podcast/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      setError('Erro ao excluir episódio');
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
        <h2>Podcast</h2>
        <Button as={Link} to="/admin/podcast/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Novo Episódio
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {items.length === 0 ? (
        <Alert variant="info">Nenhum episódio cadastrado.</Alert>
      ) : (
        <Table responsive hover className="bg-white rounded">
          <thead>
            <tr>
              <th>Ep.</th>
              <th>Título (PT)</th>
              <th>Duração</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.episode_number
                    ? <Badge bg="success">{item.episode_number}</Badge>
                    : <span className="text-muted">—</span>}
                </td>
                <td>
                  <strong>{item.title_pt}</strong>
                  {item.title_en && <small className="d-block text-muted">{item.title_en}</small>}
                </td>
                <td><small className="text-muted">{item.duration || '—'}</small></td>
                <td>
                  <small className="text-muted">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString('pt-BR')
                      : '—'}
                  </small>
                </td>
                <td>
                  <Badge bg={item.active ? 'success' : 'secondary'}>
                    {item.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/podcast/${item.id}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? <Spinner size="sm" /> : <i className="bi bi-trash"></i>}
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

export default PodcastList;
