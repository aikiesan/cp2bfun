import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.type !== 'all') params.append('type', filters.type);

      const response = await api.get(`/events?${params}`);
      setEvents(response.data);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      setError('Erro ao excluir evento');
    }
  };

  const typeLabels = {
    workshop: 'Workshop',
    forum: 'Fórum',
    conference: 'Conferência',
    meeting: 'Reunião',
    webinar: 'Webinar',
    course: 'Curso'
  };

  const statusLabels = {
    upcoming: 'Próximo',
    ongoing: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  };

  const statusColors = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'secondary',
    cancelled: 'danger'
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
        <div>
          <h2 className="mb-1">Eventos</h2>
          <p className="text-muted mb-0">{events.length} eventos cadastrados</p>
        </div>
        <Button as={Link} to="/admin/events/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>Novo Evento
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
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Todos os status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
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
            <th>Tipo</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                <strong>{event.title_pt}</strong>
                {event.title_en && (
                  <small className="d-block text-muted">{event.title_en}</small>
                )}
              </td>
              <td>
                <Badge bg="info">{typeLabels[event.event_type]}</Badge>
              </td>
              <td>
                {new Date(event.start_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td>
                <Badge bg={statusColors[event.status]}>{statusLabels[event.status]}</Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/admin/events/${event.id}`)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {events.length === 0 && (
        <p className="text-center text-muted py-5">Nenhum evento cadastrado</p>
      )}
    </Container>
  );
};

export default EventsList;
