import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaYoutube } from 'react-icons/fa';
import { Breadcrumbs, useToast } from '../../components/admin';
import { fetchVideo, createVideo, updateVideo } from '../../services/api';

const VideosEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    youtube_url: '',
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    date_display: '',
    position: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [youtubePreview, setYoutubePreview] = useState(null);

  useEffect(() => {
    if (isEditing) {
      loadVideo();
    }
  }, [id]);

  useEffect(() => {
    // Extract YouTube ID for preview
    if (formData.youtube_url) {
      const videoId = extractYouTubeId(formData.youtube_url);
      setYoutubePreview(videoId);
    } else {
      setYoutubePreview(null);
    }
  }, [formData.youtube_url]);

  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const loadVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideo(id);
      setFormData({
        youtube_url: data.youtube_url,
        title_pt: data.title_pt,
        title_en: data.title_en || '',
        description_pt: data.description_pt || '',
        description_en: data.description_en || '',
        date_display: data.date_display || '',
        position: data.position || '',
        active: data.active,
      });
    } catch (err) {
      setError('Erro ao carregar vídeo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate YouTube URL
    const videoId = extractYouTubeId(formData.youtube_url);
    if (!videoId) {
      showToast('URL do YouTube inválida', 'error');
      return;
    }

    // Validate required fields
    if (!formData.title_pt) {
      showToast('Título em português é obrigatório', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateVideo(id, formData);
        showToast('Vídeo atualizado com sucesso!', 'success');
      } else {
        await createVideo(formData);
        showToast('Vídeo criado com sucesso!', 'success');
      }
      navigate('/admin/videos');
    } catch (err) {
      showToast(
        isEditing ? 'Erro ao atualizar vídeo' : 'Erro ao criar vídeo',
        'error'
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Vídeos', path: '/admin/videos' },
    { label: isEditing ? 'Editar' : 'Novo', path: '#' },
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Carregando vídeo...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mb-4">
        <h2>
          <FaYoutube className="me-2 text-danger" />
          {isEditing ? 'Editar Vídeo' : 'Novo Vídeo'}
        </h2>
        <p className="text-muted">
          {isEditing
            ? 'Atualize as informações do vídeo do YouTube'
            : 'Adicione um novo vídeo do YouTube para exibir na página inicial'}
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* YouTube URL */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">URL do YouTube</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>URL do Vídeo *</Form.Label>
                  <Form.Control
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <Form.Text className="text-muted">
                    Cole o link do YouTube (youtube.com/watch, youtu.be, ou
                    youtube.com/shorts)
                  </Form.Text>
                </Form.Group>

                {/* Live Preview */}
                {youtubePreview && (
                  <div className="mt-3">
                    <Form.Label>Pré-visualização</Form.Label>
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                        src={`https://www.youtube.com/embed/${youtubePreview}`}
                        title="Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

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
                    placeholder="Ex: Fórum CP2B - Junho 2025"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_pt"
                    value={formData.description_pt}
                    onChange={handleChange}
                    placeholder="Descrição curta do vídeo..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* English Content */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Conteúdo em Inglês</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Título (EN)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    placeholder="Ex: CP2B Forum - June 2025"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    placeholder="Short video description..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Display Settings */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Configurações de Exibição</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Posição na Homepage</Form.Label>
                  <Form.Select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  >
                    <option value="">Sem posição</option>
                    <option value="A">A - Grande (Esquerda)</option>
                    <option value="B">B - Pequeno (Topo direito)</option>
                    <option value="C">C - Pequeno (Base direita)</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Apenas vídeos com posição aparecem na homepage
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Data de Exibição</Form.Label>
                  <Form.Control
                    type="text"
                    name="date_display"
                    value={formData.date_display}
                    onChange={handleChange}
                    placeholder="Ex: Janeiro 2025"
                  />
                  <Form.Text className="text-muted">
                    Formato livre para exibição
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    label="Vídeo ativo"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Vídeos inativos não são exibidos
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Actions */}
            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEditing ? 'Salvar Alterações' : 'Criar Vídeo'}
                  </>
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin/videos')}
              >
                <FaTimes className="me-2" />
                Cancelar
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default VideosEditor;
