import { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { fetchMeetupSlots, createMeetupSlot, updateMeetupSlot, deleteMeetupSlot } from '../../services/api';

const emptyForm = { label: '', slot_date: '', start_time: '', end_time: '', sort_order: 0 };

const MeetupSlotsManager = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = () => {
    setLoading(true);
    fetchMeetupSlots()
      .then(setSlots)
      .catch(() => setError('Erro ao carregar horários.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingSlot(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (slot) => {
    setEditingSlot(slot);
    setForm({
      label: slot.label,
      slot_date: slot.slot_date ? slot.slot_date.slice(0, 10) : '',
      start_time: slot.start_time ? slot.start_time.slice(0, 5) : '',
      end_time: slot.end_time ? slot.end_time.slice(0, 5) : '',
      sort_order: slot.sort_order ?? 0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.label || !form.slot_date || !form.start_time || !form.end_time) {
      setFormError('Preencha todos os campos obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      if (editingSlot) {
        const updated = await updateMeetupSlot(editingSlot.id, form);
        setSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...updated } : s));
      } else {
        const created = await createMeetupSlot(form);
        setSlots(prev => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Erro ao salvar slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slot) => {
    if (!window.confirm(`Excluir o slot "${slot.label}"?`)) return;
    try {
      await deleteMeetupSlot(slot.id);
      setSlots(prev => prev.filter(s => s.id !== slot.id));
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao excluir slot.';
      alert(msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'sort_order' ? Number(value) : value }));
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Horários de Meet-up</h2>
          <p className="text-muted mb-0">Gerenciar slots de tempo para reuniões</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <i className="bi bi-plus-circle me-1"></i>Adicionar Slot
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover responsive bordered size="sm">
          <thead className="table-light">
            <tr>
              <th>Label</th>
              <th>Data</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Ordem</th>
              <th>Bookings</th>
              <th style={{ width: '100px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {slots.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-muted py-4">Nenhum horário cadastrado.</td></tr>
            ) : slots.map(slot => (
              <tr key={slot.id}>
                <td>{slot.label}</td>
                <td>{slot.slot_date ? new Date(slot.slot_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'}</td>
                <td>{slot.start_time ? slot.start_time.slice(0, 5) : '—'}</td>
                <td>{slot.end_time ? slot.end_time.slice(0, 5) : '—'}</td>
                <td>{slot.sort_order}</td>
                <td>{slot.bookings?.length ?? 0}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => openEdit(slot)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(slot)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSlot ? 'Editar Slot' : 'Adicionar Slot'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Label *</Form.Label>
              <Form.Control name="label" value={form.label} onChange={handleChange} placeholder="ex: Horário 1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data *</Form.Label>
              <Form.Control type="date" name="slot_date" value={form.slot_date} onChange={handleChange} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Início *</Form.Label>
                  <Form.Control type="time" name="start_time" value={form.start_time} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Fim *</Form.Label>
                  <Form.Control type="time" name="end_time" value={form.end_time} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ordem de exibição</Form.Label>
              <Form.Control type="number" name="sort_order" value={form.sort_order} onChange={handleChange} min={0} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MeetupSlotsManager;
