import { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import api from '../../services/api';

const ICON_OPTIONS = [
  { value: 'bi-file-earmark-pdf', label: 'PDF' },
  { value: 'bi-file-earmark-zip', label: 'ZIP' },
  { value: 'bi-file-earmark-slides', label: 'Apresentação' },
  { value: 'bi-images', label: 'Imagens' },
  { value: 'bi-camera', label: 'Fotos' },
  { value: 'bi-file-earmark-word', label: 'Word' },
  { value: 'bi-file-earmark-text', label: 'Documento' },
];

const EMPTY_FORM = {
  title_pt: '',
  title_en: '',
  file_url: '',
  file_type: 'pdf',
  icon: 'bi-file-earmark-pdf',
  sort_order: 0,
  active: true,
};

const PressKitAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/press-kit/all');
      setItems(res.data);
    } catch (err) {
      setError('Erro ao carregar itens do press kit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title_pt: item.title_pt || '',
      title_en: item.title_en || '',
      file_url: item.file_url || '',
      file_type: item.file_type || 'pdf',
      icon: item.icon || 'bi-file-earmark-pdf',
      sort_order: item.sort_order ?? 0,
      active: item.active !== false,
    });
    setShowModal(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/file', formData);
      setForm(prev => ({ ...prev, file_url: res.data.url }));
    } catch (err) {
      setError('Erro ao fazer upload do arquivo');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title_pt || !form.file_url) {
      setError('Título (PT) e URL do arquivo são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const res = await api.put(`/press-kit/${editingItem.id}`, form);
        setItems(items.map(i => i.id === editingItem.id ? res.data : i));
      } else {
        const res = await api.post('/press-kit', form);
        setItems([...items, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar item');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    setDeleting(id);
    try {
      await api.delete(`/press-kit/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      setError('Erro ao excluir item');
      console.error(err);
    } finally {
      setDeleting(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Press Kit</h2>
        <Button variant="primary" onClick={openNew}>
          <i className="bi bi-plus-circle me-2"></i>Novo Item
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {items.length === 0 ? (
        <Alert variant="info">Nenhum item cadastrado no press kit.</Alert>
      ) : (
        <Table responsive hover className="bg-white rounded">
          <thead>
            <tr>
              <th>Ícone</th>
              <th>Título (PT)</th>
              <th>Título (EN)</th>
              <th>Arquivo</th>
              <th>Ordem</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ width: '50px' }}>
                  <i className={`bi ${item.icon || 'bi-file-earmark-pdf'} fs-5`}></i>
                </td>
                <td><strong>{item.title_pt}</strong></td>
                <td><small className="text-muted">{item.title_en || '—'}</small></td>
                <td>
                  <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                    {item.file_url}
                  </small>
                </td>
                <td>{item.sort_order}</td>
                <td>
                  <Badge bg={item.active ? 'success' : 'secondary'}>
                    {item.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(item)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? <Spinner size="sm" /> : <i className="bi bi-trash"></i>}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Item' : 'Novo Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Título (PT) *</Form.Label>
                <Form.Control
                  value={form.title_pt}
                  onChange={e => setForm(prev => ({ ...prev, title_pt: e.target.value }))}
                  placeholder="ex: Logotipos"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Título (EN)</Form.Label>
                <Form.Control
                  value={form.title_en}
                  onChange={e => setForm(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="ex: Logos"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Arquivo *</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    value={form.file_url}
                    onChange={e => setForm(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="URL do arquivo ou faça upload"
                    className="flex-grow-1"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Spinner size="sm" /> : <><i className="bi bi-upload me-1"></i>Upload</>}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.zip,.pptx,.ppt,.docx,.doc"
                  className="d-none"
                  onChange={handleUpload}
                />
                <Form.Text className="text-muted">
                  Tipos aceitos: PDF, ZIP, PPTX, DOCX (máx. 50MB)
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Ícone</Form.Label>
                <Form.Select
                  value={form.icon}
                  onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Ordem</Form.Label>
                <Form.Control
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Check
                  type="switch"
                  label="Ativo"
                  checked={form.active}
                  onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
                  className="mt-2"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" className="me-2" /> : null}
            {editingItem ? 'Atualizar' : 'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PressKitAdmin;
