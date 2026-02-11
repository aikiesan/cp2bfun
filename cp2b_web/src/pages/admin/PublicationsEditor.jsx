import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../components/admin';

const PublicationsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    url: '',
    pdf_url: '',
    abstract_pt: '',
    abstract_en: '',
    keywords_pt: '',
    keywords_en: '',
    publication_type: 'article',
    research_axis_id: '',
    featured: false,
    published_at: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [axes, setAxes] = useState([]);

  useEffect(() => {
    fetchAxes();
    if (isEditing) fetchPublication();
  }, [id]);

  const fetchAxes = async () => {
    try {
      const response = await api.get('/axes');
      setAxes(response.data);
    } catch (err) {
      console.error('Error loading axes:', err);
    }
  };

  const fetchPublication = async () => {
    try {
      const response = await api.get(`/publications/${id}`);
      const data = response.data;
      setFormData({
        ...data,
        keywords_pt: data.keywords_pt?.join(', ') || '',
        keywords_en: data.keywords_en?.join(', ') || '',
        research_axis_id: data.research_axis_id || '',
        published_at: data.published_at ? data.published_at.split('T')[0] : ''
      });
    } catch (err) {
      toast.error('Erro ao carregar publicação');
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
      const payload = {
        ...formData,
        keywords_pt: formData.keywords_pt ? formData.keywords_pt.split(',').map(k => k.trim()) : [],
        keywords_en: formData.keywords_en ? formData.keywords_en.split(',').map(k => k.trim()) : [],
        research_axis_id: formData.research_axis_id || null,
        published_at: formData.published_at || null
      };

      if (isEditing) {
        await api.put(`/publications/${id}`, payload);
        toast.success('Publicação atualizada com sucesso!');
      } else {
        await api.post('/publications', payload);
        toast.success('Publicação criada com sucesso!');
      }

      setTimeout(() => navigate('/admin/publications'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar publicação');
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

  const publicationTypes = [
    { value: 'article', label: 'Artigo' },
    { value: 'book', label: 'Livro' },
    { value: 'chapter', label: 'Capítulo de Livro' },
    { value: 'thesis', label: 'Tese/Dissertação' },
    { value: 'conference', label: 'Artigo de Conferência' }
  ];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? 'Editar Publicação' : 'Nova Publicação'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/publications')}>
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
                  <Form.Label>Resumo (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="abstract_pt"
                    value={formData.abstract_pt}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Palavras-chave (PT)</Form.Label>
                  <Form.Control
                    type="text"
                    name="keywords_pt"
                    value={formData.keywords_pt}
                    onChange={handleChange}
                    placeholder="Separadas por vírgula"
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
                  <Form.Label>Abstract (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="abstract_en"
                    value={formData.abstract_en}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Keywords (EN)</Form.Label>
                  <Form.Control
                    type="text"
                    name="keywords_en"
                    value={formData.keywords_en}
                    onChange={handleChange}
                    placeholder="Comma separated"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Bibliographic Data */}
            <Card className="mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Dados Bibliográficos</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Autores *</Form.Label>
                  <Form.Control
                    type="text"
                    name="authors"
                    value={formData.authors}
                    onChange={handleChange}
                    required
                    placeholder="Silva, J.; Santos, M.; Oliveira, P."
                  />
                </Form.Group>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Revista/Periódico</Form.Label>
                      <Form.Control
                        type="text"
                        name="journal"
                        value={formData.journal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ano *</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>DOI</Form.Label>
                  <Form.Control
                    type="text"
                    name="doi"
                    value={formData.doi}
                    onChange={handleChange}
                    placeholder="10.1000/xyz123"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>PDF URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="pdf_url"
                    value={formData.pdf_url}
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
                  <Form.Label>Tipo de Publicação *</Form.Label>
                  <Form.Select
                    name="publication_type"
                    value={formData.publication_type}
                    onChange={handleChange}
                    required
                  >
                    {publicationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Eixo de Pesquisa</Form.Label>
                  <Form.Select
                    name="research_axis_id"
                    value={formData.research_axis_id}
                    onChange={handleChange}
                  >
                    <option value="">Nenhum</option>
                    {axes.map(axis => (
                      <option key={axis.id} value={axis.id}>
                        Eixo {axis.axis_number} - {axis.title_pt?.replace(`Eixo ${axis.axis_number} – `, '')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Data de Publicação</Form.Label>
                  <Form.Control
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                  />
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
                    {isEditing ? 'Atualizar' : 'Criar'} Publicação
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

export default PublicationsEditor;
