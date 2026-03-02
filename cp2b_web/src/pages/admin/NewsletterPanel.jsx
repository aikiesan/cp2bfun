import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Alert, Tab, Tabs, Modal } from 'react-bootstrap';
import api from '../../services/api';

const NewsletterPanel = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/newsletter/subscribers');
      setSubscribers(res.data);
    } catch {
      setAlert({ variant: 'danger', msg: 'Erro ao carregar inscritos.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/newsletter/${deleteId}`);
      setSubscribers(prev => prev.filter(s => s.id !== deleteId));
      setAlert({ variant: 'success', msg: 'Inscrito removido.' });
    } catch {
      setAlert({ variant: 'danger', msg: 'Erro ao remover inscrito.' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await api.post('/newsletter/send', { subject, html });
      setSendResult({ ok: true, msg: `${res.data.message} (${res.data.sent} destinatários)` });
      setSubject('');
      setHtml('');
    } catch (err) {
      setSendResult({ ok: false, msg: err.response?.data?.error || 'Erro ao enviar newsletter.' });
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  };

  const activeCount = subscribers.filter(s => s.active).length;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Newsletter</h2>
          <p className="text-muted mb-0">Gerenciar inscritos e enviar comunicados</p>
        </div>
        <Badge bg="success" className="fs-6">{activeCount} ativo{activeCount !== 1 ? 's' : ''}</Badge>
      </div>

      {alert && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)} className="mb-3">
          {alert.msg}
        </Alert>
      )}

      <Tabs defaultActiveKey="subscribers" className="mb-4">
        {/* — Subscribers tab — */}
        <Tab eventKey="subscribers" title={<><i className="bi bi-people me-2"></i>Inscritos</>}>
          <Card>
            <Card.Body className="p-0">
              {loading ? (
                <p className="p-4 text-muted">Carregando...</p>
              ) : subscribers.length === 0 ? (
                <p className="p-4 text-muted">Nenhum inscrito ainda.</p>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(s => (
                      <tr key={s.id}>
                        <td>{s.name || <span className="text-muted">—</span>}</td>
                        <td>{s.email}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(s.subscribed_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <Badge bg={s.active ? 'success' : 'secondary'}>
                            {s.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteId(s.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* — Send newsletter tab — */}
        <Tab eventKey="send" title={<><i className="bi bi-send me-2"></i>Enviar Newsletter</>}>
          <Card>
            <Card.Body>
              {sendResult && (
                <Alert variant={sendResult.ok ? 'success' : 'danger'} dismissible onClose={() => setSendResult(null)}>
                  {sendResult.msg}
                </Alert>
              )}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Assunto</Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Assunto do e-mail"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conteúdo HTML</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={html}
                    onChange={e => setHtml(e.target.value)}
                    placeholder="<p>Conteúdo do e-mail em HTML...</p>"
                    style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                  <Form.Text className="text-muted">
                    Um rodapé com link de descadastro será adicionado automaticamente a cada e-mail.
                  </Form.Text>
                </Form.Group>

                {html && (
                  <Card className="mb-3 border-info">
                    <Card.Header className="bg-info bg-opacity-10">
                      <small className="text-info fw-bold"><i className="bi bi-eye me-1"></i>Pré-visualização</small>
                    </Card.Header>
                    <Card.Body>
                      <div
                        style={{ maxHeight: '300px', overflow: 'auto' }}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </Card.Body>
                  </Card>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Será enviado para <strong>{activeCount}</strong> inscrito{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}.
                  </small>
                  <Button
                    variant="success"
                    onClick={() => setShowConfirm(true)}
                    disabled={!subject.trim() || !html.trim() || sending || activeCount === 0}
                  >
                    <i className="bi bi-send me-2"></i>
                    Enviar Newsletter
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Delete confirmation modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja remover este inscrito permanentemente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Remover</Button>
        </Modal.Footer>
      </Modal>

      {/* Send confirmation modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar envio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enviar newsletter <strong>"{subject}"</strong> para{' '}
          <strong>{activeCount}</strong> inscrito{activeCount !== 1 ? 's' : ''}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleSend} disabled={sending}>
            {sending ? 'Enviando...' : 'Confirmar Envio'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsletterPanel;
