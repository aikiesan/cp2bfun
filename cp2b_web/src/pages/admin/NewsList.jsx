import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../services/api';
import { ConfirmDialog, EmptyState, useToast } from '../../components/admin';

const NewsList = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response.data);
    } catch (err) {
      toast.error('Erro ao carregar notícias. Verifique se a API está rodando.');
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
      await api.delete(`/news/${itemToDelete.slug}`);
      setNews((prev) => prev.filter((n) => n.slug !== itemToDelete.slug));
      toast.success(`Notícia "${itemToDelete.title_pt}" excluída com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir notícia. Tente novamente.');
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(news);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setNews(reordered); // optimistic update

    const items = reordered.map((item, index) => ({ id: item.id, sort_order: index + 1 }));
    try {
      await api.post('/news/reorder', { items });
      toast.success('Ordem salva com sucesso.');
    } catch (err) {
      toast.error('Erro ao salvar ordem. Recarregando…');
      console.error(err);
      fetchNews();
    }
  };

  const filtered = news.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title_pt?.toLowerCase().includes(q) ||
      item.title_en?.toLowerCase().includes(q) ||
      item.badge?.toLowerCase().includes(q)
    );
  });

  const isDraggable = !search;

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
          <h2 className="mb-1">Notícias</h2>
          <p className="text-muted mb-0">{news.length} notícias cadastradas</p>
        </div>
        <Button as={Link} to="/admin/news/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Nova Notícia
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

      {search && (
        <Alert variant="info" className="py-2 mb-3">
          <i className="bi bi-info-circle me-2"></i>
          Limpe a busca para reordenar as notícias via arrastar e soltar.
        </Alert>
      )}

      {filtered.length === 0 ? (
        search ? (
          <p className="text-muted text-center py-5">
            Nenhuma notícia encontrada para &ldquo;{search}&rdquo;.
          </p>
        ) : (
          <EmptyState
            icon="bi-newspaper"
            title="Nenhuma notícia cadastrada"
            message="Crie a primeira notícia para aparecer no site."
            actionLabel="Nova Notícia"
            onAction={() => navigate('/admin/news/new')}
          />
        )
      ) : (
        <div className="card">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  {isDraggable && <th style={{ width: '40px' }}></th>}
                  <th style={{ width: '80px' }}>Imagem</th>
                  <th>Título</th>
                  <th>Badge</th>
                  <th>Data</th>
                  <th style={{ width: '130px' }} className="text-end">Ações</th>
                </tr>
              </thead>
              <Droppable droppableId="news-list" isDropDisabled={!isDraggable}>
                {(provided) => (
                  <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {filtered.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                        isDragDisabled={!isDraggable}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              background: snapshot.isDragging ? '#f0f4ff' : undefined,
                            }}
                          >
                            {isDraggable && (
                              <td {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#aaa' }}>
                                <i className="bi bi-grip-vertical fs-5"></i>
                              </td>
                            )}
                            <td>
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
                              {item.badge && <Badge bg={item.badge_color || 'secondary'}>{item.badge}</Badge>}
                            </td>
                            <td className="text-nowrap">{item.date_display}</td>
                            <td className="text-end">
                              <a
                                href={`/noticias/${item.slug}`}
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
                                onClick={() => navigate(`/admin/news/${item.slug}`)}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </Table>
          </DragDropContext>
        </div>
      )}

      <ConfirmDialog
        show={showDeleteDialog}
        title="Excluir Notícia"
        message={`Tem certeza que deseja excluir "${itemToDelete?.title_pt}"? Esta ação não pode ser desfeita.`}
        confirmLabel={deleting ? 'Excluindo…' : 'Excluir'}
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setItemToDelete(null); }}
      />
    </Container>
  );
};

export default NewsList;
