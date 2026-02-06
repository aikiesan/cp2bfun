import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import api from '../../services/api';

const ContentEditor = () => {
  const [_content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('pt');

  const [formData, setFormData] = useState({
    content_pt: { resumo: '', objetivos: '', resultados: '' },
    content_en: { resumo: '', objetivos: '', resultados: '' },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/content/about');
      setContent(response.data);
      setFormData({
        content_pt: response.data.content_pt || { resumo: '', objetivos: '', resultados: '' },
        content_en: response.data.content_en || { resumo: '', objetivos: '', resultados: '' },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        // Content doesn't exist yet, use empty values
        setFormData({
          content_pt: { resumo: '', objetivos: '', resultados: '' },
          content_en: { resumo: '', objetivos: '', resultados: '' },
        });
      } else {
        setError('Erro ao carregar conteudo');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [`content_${lang}`]: {
        ...prev[`content_${lang}`],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put('/content/about', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar conteudo');
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

  const fields = [
    { key: 'resumo', label: 'Resumo', rows: 10 },
    { key: 'objetivos', label: 'Objetivos', rows: 8 },
    { key: 'resultados', label: 'Resultados Esperados', rows: 6 },
  ];

  return (
    <Container>
      <h2 className="mb-4">Editar Conteudo - Pagina Sobre</h2>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Conteudo salvo com sucesso!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="pt" title="Portugues">
            <Card>
              <Card.Body>
                {fields.map((field) => (
                  <Form.Group key={field.key} className="mb-4">
                    <Form.Label><strong>{field.label}</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={field.rows}
                      value={formData.content_pt[field.key] || ''}
                      onChange={(e) => handleChange('pt', field.key, e.target.value)}
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="en" title="Ingles">
            <Card>
              <Card.Body>
                {fields.map((field) => (
                  <Form.Group key={field.key} className="mb-4">
                    <Form.Label><strong>{field.label}</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={field.rows}
                      value={formData.content_en[field.key] || ''}
                      onChange={(e) => handleChange('en', field.key, e.target.value)}
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Salvar Alteracoes
              </>
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ContentEditor;
