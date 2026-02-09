import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../components/admin';

const EventsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    event_type: 'workshop',
    location: '',
    location_type: 'in-person',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    registration_url: '',
    image_url: '',
    organizer: '',
    max_participants: '',
    status: 'upcoming',
    featured: false
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const data = response.data;

      // Split datetime into date and time
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      setFormData({
        ...data,
        start_date: startDate.toISOString().split('T')[0],
        start_time: startDate.toTimeString().slice(0, 5),
        end_date: endDate.toISOString().split('T')[0],
        end_time: endDate.toTimeString().slice(0, 5),
        max_participants: data.max_participants || '',
        registration_url: data.registration_url || '',
        image_url: data.image_url || ''
      });
    } catch (err) {
      toast.error('Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Combine date and time
      const payload = {
        ...formData,
        start_date: `${formData.start_date}T${formData.start_time}:00`,
        end_date: `${formData.end_date}T${formData.end_time}:00`,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      };

      if (isEditing) {
        await api.put(`/events/${id}`, payload);
        toast.success('Evento atualizado com sucesso!');
      } else {
        await api.post('/events', payload);
        toast.success('Evento criado com sucesso!');
      }

      setTimeout(() => navigate('/admin/events'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar evento');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'forum', label: 'Fórum' },
    { value: 'conference', label: 'Conferência' },
    { value: 'meeting', label: 'Reunião' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'course', label: 'Curso' }
  ];

  const locationTypes = [
    { value: 'in-person', label: 'Presencial' },
    { value: 'online', label: 'Online' },
    { value: 'hybrid', label: 'Híbrido' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Próximo' },
    { value: 'ongoing', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? 'Editar Evento' : 'Novo Evento'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/events')}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            {/* Portuguese Content */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Conteúdo em Português</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Título (PT) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_pt"
                    value={formData.title_pt}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description_pt"
                    value={formData.description_pt}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* English Content */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Content in English</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Title (EN)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Event Details */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Detalhes do Evento</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data de Início *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Horário de Início *</Form.Label>
                      <Form.Control
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data de Término *</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Horário de Término *</Form.Label>
                      <Form.Control
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Local</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ex: Auditório Principal, Zoom, etc."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Local *</Form.Label>
                      <Form.Select
                        name="location_type"
                        value={formData.location_type}
                        onChange={handleChange}
                        required
                      >
                        {locationTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Organizador</Form.Label>
                  <Form.Control
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Máximo de Participantes</Form.Label>
                  <Form.Control
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    min="1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL de Inscrição</Form.Label>
                  <Form.Control
                    type="url"
                    name="registration_url"
                    value={formData.registration_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL da Imagem</Form.Label>
                  <Form.Control
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            {/* Settings */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Configurações</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Evento *</Form.Label>
                  <Form.Select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    label="Marcar como destaque"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid">
              <Button type="submit" variant="primary" size="lg" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {isEditing ? 'Atualizar' : 'Criar'} Evento
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EventsEditor;
