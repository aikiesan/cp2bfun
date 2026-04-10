import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EMPTY_FORM = {
  title_pt: '',
  title_en: '',
  description_pt: '',
  description_en: '',
  spotify_url: '',
  episode_number: '',
  duration: '',
  published_at: '',
  active: true,
};

// Extract Spotify episode ID for preview
const getSpotifyEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('open.spotify.com/embed')) return url;
  const match = url.match(/episode\/([a-zA-Z0-9]+)/);
  if (match) return `https://open.spotify.com/embed/episode/${match[1]}`;
  return null;
};

const PodcastEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNew) {
      api.get(`/podcast/${id}`)
        .then(res => {
          const ep = res.data;
          setForm({
            title_pt: ep.title_pt || '',
            title_en: ep.title_en || '',
            description_pt: ep.description_pt || '',
            description_en: ep.description_en || '',
            spotify_url: ep.spotify_url || '',
            episode_number: ep.episode_number ?? '',
            duration: ep.duration || '',
            published_at: ep.published_at ? ep.published_at.split('T')[0] : '',
            active: ep.active !== false,
          });
        })
        .catch(() => setError('Erro ao carregar episódio'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_pt || !form.spotify_url) {
      setError('Título (PT) e URL do Spotify são obrigatórios');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        episode_number: form.episode_number !== '' ? parseInt(form.episode_number) : null,
        published_at: form.published_at || null,
      };

      if (isNew) {
        await api.post('/podcast', payload);
      } else {
        await api.put(`/podcast/${id}`, payload);
      }
      navigate('/admin/podcast');
    } catch (err) {
      setError('Erro ao salvar episódio');
      console.error(err);
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

  const embedUrl = getSpotifyEmbedUrl(form.spotify_url);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isNew ? 'Novo Episódio' : 'Editar Episódio'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/podcast')}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header><strong>Informações do Episódio</strong></Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Título (PT) *</Form.Label>
                      <Form.Control
                        value={form.title_pt}
                        onChange={e => set('title_pt', e.target.value)}
                        placeholder="Título em português"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Título (EN)</Form.Label>
                      <Form.Control
                        value={form.title_en}
                        onChange={e => set('title_en', e.target.value)}
                        placeholder="Title in English"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Descrição (PT)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.description_pt}
                        onChange={e => set('description_pt', e.target.value)}
                        placeholder="Descrição do episódio em português"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Descrição (EN)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.description_en}
                        onChange={e => set('description_en', e.target.value)}
                        placeholder="Episode description in English"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header><strong>Spotify</strong></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>URL do Spotify *</Form.Label>
                  <Form.Control
                    value={form.spotify_url}
                    onChange={e => set('spotify_url', e.target.value)}
                    placeholder="https://open.spotify.com/episode/..."
                    required
                  />
                  <Form.Text className="text-muted">
                    Cole o link do episódio no Spotify (ex: https://open.spotify.com/episode/ABC123)
                  </Form.Text>
                </Form.Group>

                {embedUrl && (
                  <div>
                    <Form.Label className="text-muted small">Pré-visualização:</Form.Label>
                    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <iframe
                        src={embedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Preview"
                        style={{ display: 'block' }}
                      />
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header><strong>Detalhes</strong></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Número do Episódio</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.episode_number}
                    onChange={e => set('episode_number', e.target.value)}
                    placeholder="ex: 1"
                    min="1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Duração</Form.Label>
                  <Form.Control
                    value={form.duration}
                    onChange={e => set('duration', e.target.value)}
                    placeholder="ex: 45 min"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Data de Publicação</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.published_at}
                    onChange={e => set('published_at', e.target.value)}
                  />
                </Form.Group>

                <Form.Check
                  type="switch"
                  label="Ativo"
                  checked={form.active}
                  onChange={e => set('active', e.target.checked)}
                />
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving && <Spinner size="sm" className="me-2" />}
                {isNew ? 'Criar Episódio' : 'Atualizar Episódio'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/admin/podcast')}>
                Cancelar
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default PodcastEditor;
