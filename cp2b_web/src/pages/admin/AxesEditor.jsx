import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Accordion, Badge, Row, Col } from 'react-bootstrap';
import api from '../../services/api';

const sdgOptions = [
  { value: 1, label: '1 - Erradicacao da Pobreza' },
  { value: 2, label: '2 - Fome Zero' },
  { value: 3, label: '3 - Saude e Bem-estar' },
  { value: 4, label: '4 - Educacao de Qualidade' },
  { value: 5, label: '5 - Igualdade de Genero' },
  { value: 6, label: '6 - Agua Potavel e Saneamento' },
  { value: 7, label: '7 - Energia Acessivel e Limpa' },
  { value: 8, label: '8 - Trabalho Decente' },
  { value: 9, label: '9 - Industria e Inovacao' },
  { value: 10, label: '10 - Reducao das Desigualdades' },
  { value: 11, label: '11 - Cidades Sustentaveis' },
  { value: 12, label: '12 - Consumo Responsavel' },
  { value: 13, label: '13 - Acao Climatica' },
  { value: 14, label: '14 - Vida na Agua' },
  { value: 15, label: '15 - Vida Terrestre' },
  { value: 16, label: '16 - Paz e Justica' },
  { value: 17, label: '17 - Parcerias' },
];

const AxesEditor = () => {
  const [axes, setAxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAxes();
  }, []);

  const fetchAxes = async () => {
    try {
      const response = await api.get('/axes');
      setAxes(response.data);
    } catch (err) {
      setError('Erro ao carregar eixos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (axisNumber, field, value) => {
    setAxes((prev) =>
      prev.map((axis) =>
        axis.axis_number === axisNumber ? { ...axis, [field]: value } : axis
      )
    );
  };

  const handleSdgToggle = (axisNumber, sdgValue) => {
    setAxes((prev) =>
      prev.map((axis) => {
        if (axis.axis_number !== axisNumber) return axis;
        const currentSdgs = axis.sdgs || [];
        const newSdgs = currentSdgs.includes(sdgValue)
          ? currentSdgs.filter((s) => s !== sdgValue)
          : [...currentSdgs, sdgValue].sort((a, b) => a - b);
        return { ...axis, sdgs: newSdgs };
      })
    );
  };

  const handleSave = async (axisNumber) => {
    setSaving(axisNumber);
    setError(null);
    setSuccess(null);

    const axis = axes.find((a) => a.axis_number === axisNumber);

    try {
      await api.put(`/axes/${axisNumber}`, {
        title_pt: axis.title_pt,
        title_en: axis.title_en,
        coordinator: axis.coordinator,
        content_pt: axis.content_pt,
        content_en: axis.content_en,
        sdgs: axis.sdgs,
      });
      setSuccess(`Eixo ${axisNumber} salvo com sucesso!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar eixo');
      console.error(err);
    } finally {
      setSaving(null);
    }
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
      <h2 className="mb-4">Eixos de Pesquisa</h2>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Accordion>
        {axes.map((axis) => (
          <Accordion.Item key={axis.axis_number} eventKey={String(axis.axis_number)}>
            <Accordion.Header>
              <Badge bg="primary" className="me-2">{axis.axis_number}</Badge>
              {axis.title_pt?.replace(`Eixo ${axis.axis_number} – `, '')}
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Titulo (PT)</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={axis.title_pt || ''}
                      onChange={(e) => handleChange(axis.axis_number, 'title_pt', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Titulo (EN)</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={axis.title_en || ''}
                      onChange={(e) => handleChange(axis.axis_number, 'title_en', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label><strong>Coordenador(es)</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={axis.coordinator || ''}
                  onChange={(e) => handleChange(axis.axis_number, 'coordinator', e.target.value)}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Conteudo (PT)</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={axis.content_pt || ''}
                      onChange={(e) => handleChange(axis.axis_number, 'content_pt', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Conteudo (EN)</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={axis.content_en || ''}
                      onChange={(e) => handleChange(axis.axis_number, 'content_en', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label><strong>ODS Relacionados</strong></Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {sdgOptions.map((sdg) => (
                    <Badge
                      key={sdg.value}
                      bg={axis.sdgs?.includes(sdg.value) ? 'success' : 'secondary'}
                      style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                      onClick={() => handleSdgToggle(axis.axis_number, sdg.value)}
                    >
                      {sdg.value}
                    </Badge>
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Clique para selecionar/desselecionar os ODS
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={() => handleSave(axis.axis_number)}
                  disabled={saving === axis.axis_number}
                >
                  {saving === axis.axis_number ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Salvar Eixo {axis.axis_number}
                    </>
                  )}
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default AxesEditor;
