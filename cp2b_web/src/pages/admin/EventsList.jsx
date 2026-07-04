import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const TYPE_LABELS = {
  workshop: 'Workshop',
  forum: 'Fórum',
  conference: 'Conferência',
  meeting: 'Reunião',
  webinar: 'Webinar',
  course: 'Curso',
};

const STATUS_VARIANTS = {
  upcoming: 'primary',
  ongoing: 'success',
  completed: 'secondary',
  cancelled: 'danger',
};

const STATUS_LABELS = {
  upcoming: 'Em breve',
  ongoing: 'Em andamento',
  completed: 'Realizado',
  cancelled: 'Cancelado',
};

const EventsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/events');
      setItems(response.data);
    } catch (err) {
      setError('Erro ao carregar eventos. O backend está rodando?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Excluir o evento "${event.title_pt}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(event.id);
    try {
      await api.delete(`/events/${event.id}`);
      setItems((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      setError('Erro ao excluir evento');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Eventos</h2>
          <p className="text-muted mb-0">
            Agenda pública em <code>/eventos</code> — eventos com slug ganham página própria em <code>/eventos/&lt;slug&gt;</code>
          </p>
        </div>
        <Button as={Link} to="/admin/events/new" variant="primary">
          <i className="bi bi-plus-lg me-2"></i>Novo Evento
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {items.length === 0 ? (
        <Alert variant="light" className="text-center py-5 border">
          <i className="bi bi-calendar-event fs-1 d-block mb-3 text-muted"></i>
          Nenhum evento cadastrado ainda. Clique em <strong>Novo Evento</strong> para começar.
        </Alert>
      ) : (
        <Table hover responsive className="bg-white rounded shadow-sm align-middle">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Página própria</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="fw-semibold">{event.title_pt}</div>
                  {event.location && <small className="text-muted">{event.location}</small>}
                </td>
                <td>
                  {new Date(event.start_date).toLocaleDateString('pt-BR')}
                  {event.end_date && new Date(event.end_date).toDateString() !== new Date(event.start_date).toDateString() && (
                    <> — {new Date(event.end_date).toLocaleDateString('pt-BR')}</>
                  )}
                </td>
                <td><Badge bg="info">{TYPE_LABELS[event.event_type] || event.event_type}</Badge></td>
                <td>
                  <Badge bg={STATUS_VARIANTS[event.status] || 'secondary'}>
                    {STATUS_LABELS[event.status] || event.status}
                  </Badge>
                </td>
                <td>
                  {event.slug ? (
                    <a href={`/eventos/${event.slug}`} target="_blank" rel="noreferrer">
                      /eventos/{event.slug} <i className="bi bi-box-arrow-up-right small"></i>
                    </a>
                  ) : (
                    <span className="text-muted small">sem slug</span>
                  )}
                </td>
                <td className="text-end">
                  <Button
                    as={Link}
                    to={`/admin/events/${event.id}`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={deleting === event.id}
                    onClick={() => handleDelete(event)}
                  >
                    {deleting === event.id ? <Spinner size="sm" animation="border" /> : <i className="bi bi-trash"></i>}
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

export default EventsList;
