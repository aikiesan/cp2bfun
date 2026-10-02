import { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import api, {
  fetchAllBoletins,
  createBoletim,
  updateBoletim,
  deleteBoletim,
} from '../../services/api';
import ImageUploadField from '../../components/ImageUploadField';

const EMPTY_FORM = {
  title_pt: '',
  title_en: '',
  description_pt: '',
  description_en: '',
  edition_number: '',
  published_at: '',
  cover_image: '',
  pdf_url: '',
  active: true,
};

const BoletinsAdmin = () => {
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
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setItems(await fetchAllBoletins());
    } catch (err) {
      setError('Erro ao carregar boletins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title_pt: item.title_pt || '',
      title_en: item.title_en || '',
      description_pt: item.description_pt || '',
      description_en: item.description_en || '',
      edition_number: item.edition_number ?? '',
      // <input type="date"> só aceita YYYY-MM-DD; a API devolve ISO completo.
      published_at: item.published_at ? item.published_at.slice(0, 10) : '',
      cover_image: item.cover_image || '',
      pdf_url: item.pdf_url || '',
      active: item.active !== false,
    });
    setError(null);
    setShowModal(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/file', formData);
      setForm(prev => ({ ...prev, pdf_url: res.data.url }));
    } catch (err) {
      setError('Erro ao fazer upload do PDF');
      console.error(err);
    } finally {
      setUploading(false);
      // Permite reenviar o mesmo arquivo depois de um erro: sem isso o input
      // não dispara change de novo para um nome idêntico.
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.title_pt || !form.pdf_url) {
      setError('Título (PT) e o PDF são obrigatórios');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        // Campos opcionais: string vazia viraria 0 / data inválida no banco.
        edition_number: form.edition_number === '' ? null : Number(form.edition_number),
        published_at: form.published_at || null,
        title_en: form.title_en || null,
        description_pt: form.description_pt || null,
        description_en: form.description_en || null,
        cover_image: form.cover_image || null,
      };

      if (editingItem) {
        await updateBoletim(editingItem.id, payload);
      } else {
        await createBoletim(payload);
      }

      setShowModal(false);
      await loadItems();
    } catch (err) {
      // O backend devolve 409 quando o número de edição já existe.
      setError(err.response?.data?.error || 'Erro ao salvar boletim');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Excluir o boletim "${item.title_pt}"? Esta ação não pode ser desfeita.`)) return;

    setDeleting(item.id);
    try {
      await deleteBoletim(item.id);
      await loadItems();
    } catch (err) {
      setError('Erro ao excluir boletim');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  // timeZone UTC pelo mesmo motivo da página pública: published_at é dia civil,
  // e sem isso uma edição do dia 1º aparece com o mês anterior.
  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', timeZone: 'UTC' })
      : '—';

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Boletins</h1>
          <p className="text-muted mb-0">Edições do boletim CP2b disponíveis para download.</p>
        </div>
        <Button variant="success" onClick={openNew}>
          <i className="bi bi-plus-lg me-2"></i>Novo boletim
        </Button>
      </div>

      {error && !showModal && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-journal-text" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p className="mt-3">Nenhum boletim cadastrado ainda.</p>
        </div>
      ) : (
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th style={{ width: 70 }}>Capa</th>
              <th>Título</th>
              <th style={{ width: 90 }}>Edição</th>
              <th style={{ width: 160 }}>Data</th>
              <th style={{ width: 100 }}>Status</th>
              <th style={{ width: 140 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt=""
                      style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-light text-muted"
                      style={{ width: 48, height: 64, borderRadius: 4 }}
                    >
                      <i className="bi bi-journal-text"></i>
                    </div>
                  )}
                </td>
                <td>
                  <div className="fw-semibold">{item.title_pt}</div>
                  {item.title_en && <div className="text-muted small">{item.title_en}</div>}
                </td>
                <td>{item.edition_number ?? '—'}</td>
                <td>{formatDate(item.published_at)}</td>
                <td>
                  <Badge bg={item.active !== false ? 'success' : 'secondary'}>
                    {item.active !== false ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEdit(item)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={deleting === item.id}
                    onClick={() => handleDelete(item)}
                  >
                    {deleting === item.id
                      ? <Spinner size="sm" animation="border" />
                      : <i className="bi bi-trash"></i>}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar boletim' : 'Novo boletim'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Título (PT) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    value={form.title_pt}
                    onChange={e => setForm(p => ({ ...p, title_pt: e.target.value }))}
                    placeholder="Boletim CP2b — Biogás no Estado de São Paulo"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Título (EN)</Form.Label>
                  <Form.Control
                    value={form.title_en}
                    onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))}
                    placeholder="Deixe vazio para reaproveitar o título em português"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição breve (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    maxLength={300}
                    value={form.description_pt}
                    onChange={e => setForm(p => ({ ...p, description_pt: e.target.value }))}
                    placeholder="Uma ou duas linhas sobre o que traz esta edição."
                  />
                  <Form.Text muted>{form.description_pt.length}/300 — aparece no card, sob o título.</Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição breve (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    maxLength={300}
                    value={form.description_en}
                    onChange={e => setForm(p => ({ ...p, description_en: e.target.value }))}
                    placeholder="Deixe vazio para reaproveitar a descrição em português"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nº da edição</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={form.edition_number}
                    onChange={e => setForm(p => ({ ...p, edition_number: e.target.value }))}
                    placeholder="12"
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group>
                  <Form.Label>Data de publicação</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.published_at}
                    onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                  />
                  <Form.Text muted>A página mostra apenas mês e ano.</Form.Text>
                </Form.Group>
              </Col>

              <Col md={3} className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="boletim-active"
                  label="Ativo"
                  checked={form.active}
                  onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                />
              </Col>

              <Col md={12}>
                <ImageUploadField
                  label="Capa"
                  value={form.cover_image}
                  onChange={url => setForm(p => ({ ...p, cover_image: url }))}
                  helperText="Proporção recomendada 3:4 (retrato), como a capa impressa."
                />
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>PDF do boletim <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      ref={fileInputRef}
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                    {uploading && <Spinner size="sm" animation="border" />}
                  </div>
                  {form.pdf_url && (
                    <div className="mt-2 small">
                      <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                      <a href={form.pdf_url} target="_blank" rel="noopener noreferrer">{form.pdf_url}</a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleSave} disabled={saving || uploading}>
            {saving ? <><Spinner size="sm" animation="border" className="me-2" />Salvando...</> : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BoletinsAdmin;
