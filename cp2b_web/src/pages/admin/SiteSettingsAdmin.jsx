import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import api, { saveSiteSettings } from '../../services/api';
import { siteSettingsDefaults } from '../../hooks/useSiteSettings';

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', icon: 'bi-instagram' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'bi-linkedin' },
  { key: 'youtube', label: 'YouTube', icon: 'bi-youtube' },
  { key: 'spotify', label: 'Spotify', icon: 'bi-spotify' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'bi-whatsapp' },
  { key: 'facebook', label: 'Facebook', icon: 'bi-facebook' },
];

const SiteSettingsAdmin = () => {
  const [contact, setContact] = useState(siteSettingsDefaults.contact);
  const [social, setSocial] = useState(siteSettingsDefaults.social);
  const [footer, setFooter] = useState(siteSettingsDefaults.footer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/settings');
        const data = response.data || {};
        if (data.contact) setContact((prev) => ({ ...prev, ...data.contact }));
        if (data.social) setSocial((prev) => ({ ...prev, ...data.social }));
        if (data.footer) setFooter((prev) => ({ ...prev, ...data.footer }));
      } catch {
        // keep defaults; backend may not have settings yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await saveSiteSettings({ contact, social, footer });
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Configurações do Site</h2>
        <p className="text-muted mb-0">
          Contato, redes sociais e créditos exibidos no rodapé e no cabeçalho de todo o site.
        </p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Configurações salvas! O site público já usa os novos valores.</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={6}>
            <Card>
              <Card.Header className="bg-white"><h5 className="mb-0"><i className="bi bi-geo-alt me-2"></i>Contato</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Instituição</Form.Label>
                  <Form.Control
                    value={contact.institution}
                    onChange={(e) => setContact((p) => ({ ...p, institution: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Endereço — linha 1</Form.Label>
                  <Form.Control
                    value={contact.address_line1}
                    onChange={(e) => setContact((p) => ({ ...p, address_line1: e.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Endereço — linha 2</Form.Label>
                  <Form.Control
                    value={contact.address_line2}
                    onChange={(e) => setContact((p) => ({ ...p, address_line2: e.target.value }))}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        value={contact.phone}
                        onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="mb-4">
              <Card.Header className="bg-white"><h5 className="mb-0"><i className="bi bi-share me-2"></i>Redes Sociais</h5></Card.Header>
              <Card.Body>
                {SOCIAL_FIELDS.map(({ key, label, icon }) => (
                  <Form.Group className="mb-3" key={key}>
                    <Form.Label><i className={`bi ${icon} me-2`}></i>{label}</Form.Label>
                    <Form.Control
                      type="url"
                      value={social[key] || ''}
                      placeholder={`https://…  (vazio esconde o ícone de ${label})`}
                      onChange={(e) => setSocial((p) => ({ ...p, [key]: e.target.value }))}
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header className="bg-white"><h5 className="mb-0"><i className="bi bi-card-text me-2"></i>Rodapé</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-0">
                  <Form.Label>Expediente / créditos</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={footer.credits}
                    onChange={(e) => setFooter((p) => ({ ...p, credits: e.target.value }))}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-4">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-check-lg me-2"></i>}
            Salvar configurações
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SiteSettingsAdmin;
