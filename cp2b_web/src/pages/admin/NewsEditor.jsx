import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NewsEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);

  const [formData, setFormData] = useState({
    slug: '',
    title_pt: '',
    title_en: '',
    description_pt: '',
    description_en: '',
    content_pt: '',
    content_en: '',
    image: '',
    badge: '',
    badge_color: 'primary',
    date_display: '',
    published_at: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchNews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/news/${slug}`);
      const data = response.data;
      setFormData({
        ...data,
        published_at: data.published_at ? data.published_at.split('T')[0] : '',
      });
    } catch (err) {
      setError('Erro ao carregar noticia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === 'title_pt' && !isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        published_at: formData.published_at || null,
      };

      if (isEditing) {
        await api.put(`/news/${slug}`, payload);
      } else {
        await api.post('/news', payload);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/news'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar noticia');
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

  const badgeColors = [
    { value: 'primary', label: 'Azul' },
    { value: 'success', label: 'Verde' },
    { value: 'info', label: 'Ciano' },
    { value: 'warning', label: 'Amarelo' },
    { value: 'danger', label: 'Vermelho' },
    { value: 'secondary', label: 'Cinza' },
  ];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? 'Editar Noticia' : 'Nova Noticia'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/news')}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Noticia salva com sucesso!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Conteudo em Portugues</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Titulo (PT) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_pt"
                    value={formData.title_pt}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descricao (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_pt"
                    value={formData.description_pt}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conteudo Completo (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="content_pt"
                    value={formData.content_pt}
                    onChange={handleChange}
                    placeholder="Conteudo completo do artigo em portugues..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Conteudo em Ingles</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Titulo (EN)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descricao (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conteudo Completo (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="content_en"
                    value={formData.content_en}
                    onChange={handleChange}
                    placeholder="Full article content in English..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Configuracoes</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Slug (URL) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    disabled={isEditing}
                  />
                  <Form.Text className="text-muted">
                    Ex: /noticias/{formData.slug || 'minha-noticia'}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Data de Exibicao</Form.Label>
                  <Form.Control
                    type="text"
                    name="date_display"
                    value={formData.date_display}
                    onChange={handleChange}
                    placeholder="Ex: 18 DEZ 2025"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Data de Publicacao</Form.Label>
                  <Form.Control
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Badge</Form.Label>
                  <Form.Control
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="Ex: Eventos, Institucional"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cor do Badge</Form.Label>
                  <Form.Select
                    name="badge_color"
                    value={formData.badge_color}
                    onChange={handleChange}
                  >
                    {badgeColors.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Imagem</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>URL da Imagem</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="/assets/minha-imagem.jpg"
                  />
                </Form.Group>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                )}
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
                    {isEditing ? 'Atualizar Noticia' : 'Criar Noticia'}
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

export default NewsEditor;
