import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ConfirmDialog, EmptyState, useToast } from '../../components/admin';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      toast.error('Erro ao carregar projetos. Verifique se a API está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${itemToDelete.slug}`);
      setProjects((prev) => prev.filter((p) => p.slug !== itemToDelete.slug));
      toast.success(`Projeto "${itemToDelete.title_pt}" excluído com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir projeto. Tente novamente.');
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const filtered = projects.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title_pt?.toLowerCase().includes(q) ||
      item.title_en?.toLowerCase().includes(q) ||
      item.badge?.toLowerCase().includes(q)
    );
  });

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
        <div>
          <h2 className="mb-1">Projetos</h2>
          <p className="text-muted mb-0">{projects.length} projetos cadastrados</p>
        </div>
        <Button as={Link} to="/admin/projects/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Novo Projeto
        </Button>
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: '360px' }}>
        <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
        <Form.Control
          placeholder="Buscar por título ou badge…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button variant="outline-secondary" onClick={() => setSearch('')}>
            <i className="bi bi-x"></i>
          </Button>
        )}
      </InputGroup>

      {filtered.length === 0 ? (
        search ? (
          <p className="text-muted text-center py-5">
            Nenhum projeto encontrado para &ldquo;{search}&rdquo;.
          </p>
        ) : (
          <EmptyState
            icon="bi-folder"
            title="Nenhum projeto cadastrado"
            message="Crie o primeiro projeto para aparecer no site."
            actionLabel="Novo Projeto"
            onAction={() => navigate('/admin/projects/new')}
          />
        )
      ) : (
        <div className="card">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '80px' }}>Imagem</th>
                <th>Título</th>
                <th>Badge</th>
                <th>Data</th>
                <th style={{ width: '130px' }} className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.slug}>
                  <td>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title_pt}
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </td>
                  <td>
                    <strong>{item.title_pt}</strong>
                    {item.title_en && <small className="d-block text-muted">{item.title_en}</small>}
                  </td>
                  <td>
                    {item.badge && <Badge bg={item.badge_color || 'primary'}>{item.badge}</Badge>}
                  </td>
                  <td className="text-nowrap">{item.date_display || '-'}</td>
                  <td className="text-end">
                    <a
                      href={`/projetos/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm me-1"
                      title="Ver no site"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => navigate(`/admin/projects/${item.slug}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                      title="Excluir"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        show={showDeleteDialog}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${itemToDelete?.title_pt}"? Esta ação não pode ser desfeita.`}
        confirmLabel={deleting ? 'Excluindo…' : 'Excluir'}
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setItemToDelete(null); }}
      />
    </Container>
  );
};

export default ProjectsList;
