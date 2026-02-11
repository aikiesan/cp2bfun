import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Erro ao carregar projetos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

    setDeleting(slug);
    try {
      await api.delete(`/projects/${slug}`);
      setProjects(projects.filter((p) => p.slug !== slug));
    } catch (err) {
      setError('Erro ao excluir projeto');
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
        <h2>Projetos</h2>
        <Button as={Link} to="/admin/projects/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Novo Projeto
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {projects.length === 0 ? (
        <Alert variant="info">Nenhum projeto cadastrado.</Alert>
      ) : (
        <Table responsive hover className="bg-white rounded">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título (PT)</th>
              <th>Badge</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr key={item.slug}>
                <td style={{ width: '80px' }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title_pt}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </td>
                <td>
                  <strong>{item.title_pt}</strong>
                  {item.title_en && <><br /><small className="text-muted">{item.title_en}</small></>}
                </td>
                <td>
                  {item.badge && <Badge bg={item.badge_color || 'primary'}>{item.badge}</Badge>}
                </td>
                <td>{item.date_display || '-'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/projects/${item.slug}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.slug)}
                    disabled={deleting === item.slug}
                  >
                    {deleting === item.slug ? (
                      <Spinner size="sm" />
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
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

export default ProjectsList;
