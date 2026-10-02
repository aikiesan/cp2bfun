import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { fetchGallery } from '../../services/api';
import { RichTextEditor } from '../../components/admin';
import ImageUploadField from '../../components/ImageUploadField';

const EMPTY_SCHEDULE_ITEM = { time: '', title_pt: '', title_en: '', speaker: '' };

const toDatetimeLocal = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EventsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    slug: '',
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    content_pt: '',
    content_en: '',
    event_type: 'workshop',
    location: '',
    location_type: 'in-person',
    start_date: '',
    end_date: '',
    registration_url: '',
    image: '',
    organizer: '',
    status: 'upcoming',
    featured: false,
    schedule: [],
    gallery_album_ids: [],
  });
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) fetchItem();
    // Load gallery albums for the album picker
    fetchGallery().then((photos) => {
      setAlbums(photos.filter((p) => p.is_cover));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const data = response.data;
      setFormData({
        ...data,
        slug: data.slug || '',
        title_en: data.title_en || '',
        description_pt: data.description_pt || '',
        description_en: data.description_en || '',
        content_pt: data.content_pt || '',
        content_en: data.content_en || '',
        location: data.location || '',
        registration_url: data.registration_url || '',
        image: data.image || '',
        organizer: data.organizer || '',
        start_date: toDatetimeLocal(data.start_date),
        end_date: toDatetimeLocal(data.end_date),
        schedule: Array.isArray(data.schedule) ? data.schedule : [],
        gallery_album_ids: Array.isArray(data.gallery_album_ids) ? data.gallery_album_ids : [],
      });
    } catch (err) {
      setError('Erro ao carregar evento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (name === 'title_pt' && !isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 60);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  // --- Schedule (run of show) helpers ---
  const addScheduleItem = () =>
    setFormData((prev) => ({ ...prev, schedule: [...prev.schedule, { ...EMPTY_SCHEDULE_ITEM }] }));

  const updateScheduleItem = (index, field, value) =>
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const removeScheduleItem = (index) =>
    setFormData((prev) => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== index) }));

  const moveScheduleItem = (index, delta) =>
    setFormData((prev) => {
      const schedule = [...prev.schedule];
      const target = index + delta;
      if (target < 0 || target >= schedule.length) return prev;
      [schedule[index], schedule[target]] = [schedule[target], schedule[index]];
      return { ...prev, schedule };
    });

  const toggleAlbum = (albumId) =>
    setFormData((prev) => ({
      ...prev,
      gallery_album_ids: prev.gallery_album_ids.includes(albumId)
        ? prev.gallery_album_ids.filter((a) => a !== albumId)
        : [...prev.gallery_album_ids, albumId],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        slug: formData.slug || null,
        end_date: formData.end_date || formData.start_date,
        schedule: formData.schedule.filter((item) => item.time || item.title_pt),
      };

      if (isEditing) {
        await api.put(`/events/${id}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/events'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar evento');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">{isEditing ? 'Editar Evento' : 'Novo Evento'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/events')}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Evento salvo com sucesso! Redirecionando…</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Informações Básicas</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3" controlId="event-title-pt">
                  <Form.Label>Título (PT) *</Form.Label>
                  <Form.Control name="title_pt" value={formData.title_pt} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Título (EN)</Form.Label>
                  <Form.Control name="title_en" value={formData.title_en} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Slug (endereço da página do evento)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>/eventos/</InputGroup.Text>
                    <Form.Control
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="forum-paulista-2026"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Com slug preenchido o evento ganha página própria com programação e galeria.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Resumo (PT)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="description_pt" value={formData.description_pt} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label>Resumo (EN)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="description_en" value={formData.description_en} onChange={handleChange} />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Conteúdo da Página do Evento</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>Descrição completa (PT)</Form.Label>
                  <RichTextEditor
                    value={formData.content_pt}
                    onChange={(html) => setFormData((prev) => ({ ...prev, content_pt: html }))}
                  />
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label>Descrição completa (EN)</Form.Label>
                  <RichTextEditor
                    value={formData.content_en}
                    onChange={(html) => setFormData((prev) => ({ ...prev, content_en: html }))}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Programação</h5>
                <Button size="sm" variant="outline-primary" onClick={addScheduleItem}>
                  <i className="bi bi-plus-lg me-1"></i>Adicionar item
                </Button>
              </Card.Header>
              <Card.Body>
                {formData.schedule.length === 0 && (
                  <p className="text-muted mb-0">
                    Sem programação cadastrada. Adicione itens como &quot;09h00 — Credenciamento&quot;.
                  </p>
                )}
                {formData.schedule.map((item, index) => (
                  <Row key={index} className="g-2 align-items-start mb-2">
                    <Col xs={6} md={2}>
                      <Form.Control
                        placeholder="09h00"
                        value={item.time}
                        onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={4}>
                      <Form.Control
                        placeholder="Atividade (PT)"
                        value={item.title_pt}
                        onChange={(e) => updateScheduleItem(index, 'title_pt', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={3}>
                      <Form.Control
                        placeholder="Activity (EN)"
                        value={item.title_en}
                        onChange={(e) => updateScheduleItem(index, 'title_en', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        placeholder="Palestrante"
                        value={item.speaker}
                        onChange={(e) => updateScheduleItem(index, 'speaker', e.target.value)}
                      />
                    </Col>
                    <Col xs={12} md={1} className="d-flex gap-1">
                      <Button size="sm" variant="light" onClick={() => moveScheduleItem(index, -1)} title="Mover para cima">
                        <i className="bi bi-arrow-up"></i>
                      </Button>
                      <Button size="sm" variant="light" onClick={() => moveScheduleItem(index, 1)} title="Mover para baixo">
                        <i className="bi bi-arrow-down"></i>
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => removeScheduleItem(index)} title="Remover">
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Álbuns da Galeria vinculados</h5></Card.Header>
              <Card.Body>
                {albums.length === 0 ? (
                  <p className="text-muted mb-0">
                    Nenhum álbum na galeria ainda. Crie álbuns em <strong>Galeria</strong> e vincule-os aqui
                    para exibi-los na página do evento.
                  </p>
                ) : (
                  <Row className="g-3">
                    {albums.map((album) => {
                      const selected = formData.gallery_album_ids.includes(album.album_id);
                      return (
                        <Col key={album.id} xs={6} md={4} lg={3}>
                          <button
                            type="button"
                            onClick={() => toggleAlbum(album.album_id)}
                            className={`w-100 border rounded-3 overflow-hidden p-0 position-relative ${selected ? 'border-success border-2' : 'border-light'}`}
                            style={{ background: 'none', cursor: 'pointer' }}
                            title={album.title}
                          >
                            <img src={album.url} alt={album.title} className="w-100" style={{ height: '90px', objectFit: 'cover' }} />
                            <div className="small p-2 text-truncate text-start">{album.title}</div>
                            {selected && (
                              <span className="position-absolute top-0 end-0 m-1 badge bg-success">
                                <i className="bi bi-check-lg"></i>
                              </span>
                            )}
                          </button>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Data e Local</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Início *</Form.Label>
                  <Form.Control type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Término</Form.Label>
                  <Form.Control type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select name="event_type" value={formData.event_type} onChange={handleChange}>
                    <option value="workshop">Workshop</option>
                    <option value="forum">Fórum</option>
                    <option value="conference">Conferência</option>
                    <option value="meeting">Reunião</option>
                    <option value="webinar">Webinar</option>
                    <option value="course">Curso</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Modalidade</Form.Label>
                  <Form.Select name="location_type" value={formData.location_type} onChange={handleChange}>
                    <option value="in-person">Presencial</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Híbrido</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Local</Form.Label>
                  <Form.Control name="location" value={formData.location} onChange={handleChange} placeholder="Auditório NIPE, Unicamp" />
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label>Organização</Form.Label>
                  <Form.Control name="organizer" value={formData.organizer} onChange={handleChange} placeholder="CP2b / NIPE" />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Publicação</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="upcoming">Em breve</option>
                    <option value="ongoing">Em andamento</option>
                    <option value="completed">Realizado</option>
                    <option value="cancelled">Cancelado</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Link de inscrição</Form.Label>
                  <Form.Control
                    type="url"
                    name="registration_url"
                    value={formData.registration_url}
                    onChange={handleChange}
                    placeholder="https://…"
                  />
                </Form.Group>
                <Form.Check
                  type="switch"
                  id="event-featured"
                  label="Evento em destaque"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0">Imagem</h5></Card.Header>
              <Card.Body>
                <ImageUploadField
                  label="Imagem de capa"
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  helperText="JPEG, PNG ou WebP · máx. 5MB"
                />
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" size="lg" disabled={saving}>
                {saving ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-check-lg me-2"></i>}
                {isEditing ? 'Salvar alterações' : 'Criar evento'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EventsEditor;
