import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ConfirmDialog, EmptyState, useToast } from '../../components/admin';

const PublicationsList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: 'all', type: 'all' });
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPublications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error('Erro ao carregar publicações. Verifique se a API está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (pub) => {
    setItemToDelete(pub);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/publications/${itemToDelete.id}`);
      setPublications((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      toast.success(`Publicação excluída com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir publicação. Tente novamente.');
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
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

  const filtered = publications.filter((pub) => {
    const q = search.toLowerCase();
    return (
      pub.title_pt?.toLowerCase().includes(q) ||
      pub.title_en?.toLowerCase().includes(q) ||
      pub.authors?.toLowerCase().includes(q)
    );
  });

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

      {/* Filters + Search */}
      <Row className="mb-3 g-2">
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
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Buscar por título ou autor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button variant="outline-secondary" onClick={() => setSearch('')}>
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {filtered.length === 0 ? (
        search || filters.year !== 'all' || filters.type !== 'all' ? (
          <p className="text-muted text-center py-5">Nenhuma publicação encontrada para os filtros selecionados.</p>
        ) : (
          <EmptyState
            icon="bi-journal"
            title="Nenhuma publicação cadastrada"
            message="Adicione a primeira publicação científica do grupo."
            actionLabel="Nova Publicação"
            onAction={() => navigate('/admin/publications/new')}
          />
        )
      ) : (
        <div className="card">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th>Título</th>
                <th>Autores</th>
                <th>Tipo</th>
                <th>Ano</th>
                <th style={{ width: '90px' }} className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pub => (
                <tr key={pub.id}>
                  <td>
                    <strong>{pub.title_pt}</strong>
                    {pub.title_en && (
                      <small className="d-block text-muted">{pub.title_en}</small>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-block small text-primary"
                      >
                        DOI: {pub.doi}
                      </a>
                    )}
                  </td>
                  <td><small>{pub.authors}</small></td>
                  <td>
                    <Badge bg="secondary">{typeLabels[pub.publication_type]}</Badge>
                  </td>
                  <td>{pub.year}</td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => navigate(`/admin/publications/${pub.id}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(pub)}
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
        title="Excluir Publicação"
        message={`Tem certeza que deseja excluir a publicação "${itemToDelete?.title_pt}"? Esta ação não pode ser desfeita.`}
        confirmLabel={deleting ? 'Excluindo…' : 'Excluir'}
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setItemToDelete(null); }}
      />
    </Container>
  );
};

export default PublicationsList;
