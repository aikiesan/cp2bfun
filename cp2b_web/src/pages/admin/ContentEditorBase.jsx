import { useState, useEffect } from 'react';
import { Container, Form, Button, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { useToast } from '../../components/admin';

const ContentEditorBase = ({ pageKey, pageLabel, fields }) => {
  const [formData, setFormData] = useState({ content_pt: {}, content_en: {} });
  const [activeTab, setActiveTab] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/content/${pageKey}`);
      setFormData({
        content_pt: response.data.content_pt || {},
        content_en: response.data.content_en || {},
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Erro ao carregar conteúdo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`content_${lang}`]: {
        ...prev[`content_${lang}`],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields for both languages
    const requiredFields = fields.filter(f => f.required);
    const missingPT = requiredFields.filter(f => !formData.content_pt[f.key]?.trim());
    const missingEN = requiredFields.filter(f => !formData.content_en[f.key]?.trim());

    if (missingPT.length > 0 || missingEN.length > 0) {
      let errorMsg = 'Por favor, preencha todos os campos obrigatórios.';
      if (missingPT.length > 0) errorMsg += ` (Português: ${missingPT.map(f => f.label).join(', ')})`;
      if (missingEN.length > 0) errorMsg += ` (English: ${missingEN.map(f => f.label).join(', ')})`;
      
      toast.error(errorMsg);
      
      // Switch to the tab with errors if current one is okay
      if (activeTab === 'pt' && missingPT.length === 0 && missingEN.length > 0) {
        setActiveTab('en');
      } else if (activeTab === 'en' && missingEN.length === 0 && missingPT.length > 0) {
        setActiveTab('pt');
      }
      return;
    }

    setSaving(true);
    try {
      await api.put(`/content/${pageKey}`, formData);
      toast.success('Conteúdo salvo com sucesso!');
    } catch (err) {
      toast.error('Erro ao salvar conteúdo');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field, lang) => {
    const value = formData[`content_${lang}`][field.key] || '';

    if (field.type === 'textarea') {
      return (
        <Form.Control
          as="textarea"
          rows={field.rows || 4}
          value={value}
          onChange={(e) => handleChange(lang, field.key, e.target.value)}
        />
      );
    }

    return (
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => handleChange(lang, field.key, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3 text-muted">Carregando conteúdo...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{pageLabel}</h2>
          <p className="text-muted mb-0">Edite o conteúdo da página em português e inglês</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          <Tab eventKey="pt" title="🇧🇷 Português">
            <div className="pt-4">
              {fields.map(field => (
                <Form.Group key={field.key} className="mb-4">
                  <Form.Label>
                    <strong>{field.label}</strong>
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </Form.Label>
                  {renderField(field, 'pt')}
                  {field.helpText && (
                    <Form.Text className="text-muted">{field.helpText}</Form.Text>
                  )}
                </Form.Group>
              ))}
            </div>
          </Tab>

          <Tab eventKey="en" title="🇺🇸 English">
            <div className="pt-4">
              {fields.map(field => (
                <Form.Group key={field.key} className="mb-4">
                  <Form.Label>
                    <strong>{field.label}</strong>
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </Form.Label>
                  {renderField(field, 'en')}
                  {field.helpText && (
                    <Form.Text className="text-muted">{field.helpText}</Form.Text>
                  )}
                </Form.Group>
              ))}
            </div>
          </Tab>
        </Tabs>

        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ContentEditorBase;
