import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { fetchAllMeetupRequests, cancelMeetupRequest, deleteMeetupRequest, confirmMeetupAdmin } from '../../services/api';

const STATUS_LABELS = {
  pending:   { label: 'Pendente',   bg: 'warning', text: 'dark' },
  confirmed: { label: 'Confirmado', bg: 'success',  text: 'white' },
  declined:  { label: 'Recusado',   bg: 'danger',   text: 'white' },
  cancelled: { label: 'Cancelado',  bg: 'secondary',text: 'white' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_LABELS[status] || { label: status, bg: 'light', text: 'dark' };
  return <Badge bg={s.bg} text={s.text}>{s.label}</Badge>;
};

const MeetupRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchAllMeetupRequests()
      .then(setRequests)
      .catch(() => setError('Erro ao carregar solicitações.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    setActionError(null);
    try {
      const updated = await cancelMeetupRequest(id);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
      if (selectedRequest?.id === id) setSelectedRequest(prev => ({ ...prev, ...updated }));
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Erro ao cancelar solicitação.');
    }
  };

  const handleAdminConfirm = async (id) => {
    setActionError(null);
    try {
      const updated = await confirmMeetupAdmin(id);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
      if (selectedRequest?.id === id) setSelectedRequest(prev => ({ ...prev, ...updated }));
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Erro ao confirmar solicitação.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta solicitação permanentemente?')) return;
    setActionError(null);
    try {
      await deleteMeetupRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      setSelectedRequest(null);
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Erro ao excluir solicitação.');
    }
  };

  const filtered = statusFilter === 'all'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  const handleExportCSV = () => {
    const headers = ['Solicitante', 'E-mail Solicitante', 'Convidado', 'E-mail Convidado', 'Slot', 'Mesa', 'Status', 'Criado em'];
    const rows = filtered.map(r => [
      r.requester_name,
      r.requester_email,
      r.invitee_name,
      r.invitee_email,
      r.slot_label,
      r.table_number,
      r.status,
      new Date(r.created_at).toLocaleDateString('pt-BR'),
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`));
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meetup_requests_cp2b.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Meet-up Requests</h2>
          <p className="text-muted mb-0">Solicitações de reunião do Forum Paulista</p>
        </div>
        <Button variant="outline-success" size="sm" onClick={handleExportCSV} disabled={filtered.length === 0}>
          <i className="bi bi-download me-1"></i>Exportar CSV
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {actionError && <Alert variant="danger" dismissible onClose={() => setActionError(null)}>{actionError}</Alert>}

      {/* Stats bar */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        {['pending', 'confirmed', 'declined', 'cancelled'].map(s => {
          const info = STATUS_LABELS[s];
          return (
            <Badge bg={info.bg} text={info.text} key={s} style={{ fontSize: '0.85rem' }}>
              {info.label}: {requests.filter(r => r.status === s).length}
            </Badge>
          );
        })}
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <Form.Select
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="declined">Recusado</option>
          <option value="cancelled">Cancelado</option>
        </Form.Select>
        <small className="text-muted">{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</small>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover responsive bordered size="sm">
          <thead className="table-light">
            <tr>
              <th>Solicitante</th>
              <th>Convidado</th>
              <th>Slot</th>
              <th>Mesa</th>
              <th>Status</th>
              <th>Criado em</th>
              <th style={{ width: '80px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-muted py-4">Nenhuma solicitação encontrada.</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedRequest(r)}>
                <td>{r.requester_name}</td>
                <td>{r.invitee_name}</td>
                <td>{r.slot_label}</td>
                <td>{r.table_number}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                <td onClick={e => e.stopPropagation()}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(r.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Detail Modal */}
      <Modal show={!!selectedRequest} onHide={() => setSelectedRequest(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Solicitação de Meet-up
            {selectedRequest && <span className="ms-2"><StatusBadge status={selectedRequest.status} /></span>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <dl className="row mb-0">
              <dt className="col-sm-4">Solicitante</dt>
              <dd className="col-sm-8">{selectedRequest.requester_name} <small className="text-muted">({selectedRequest.requester_email})</small></dd>
              <dt className="col-sm-4">Convidado</dt>
              <dd className="col-sm-8">{selectedRequest.invitee_name} <small className="text-muted">({selectedRequest.invitee_email})</small></dd>
              <dt className="col-sm-4">Slot</dt>
              <dd className="col-sm-8">
                {selectedRequest.slot_label} —{' '}
                {selectedRequest.slot_date ? new Date(selectedRequest.slot_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}
                {' '}({selectedRequest.start_time?.slice(0,5)}–{selectedRequest.end_time?.slice(0,5)})
              </dd>
              <dt className="col-sm-4">Mesa</dt>
              <dd className="col-sm-8">{selectedRequest.table_number}</dd>
              {selectedRequest.message && (
                <>
                  <dt className="col-sm-4">Mensagem</dt>
                  <dd className="col-sm-8">{selectedRequest.message}</dd>
                </>
              )}
              <dt className="col-sm-4">Criado em</dt>
              <dd className="col-sm-8">{new Date(selectedRequest.created_at).toLocaleString('pt-BR')}</dd>
              {selectedRequest.confirmed_at && (
                <>
                  <dt className="col-sm-4">Confirmado em</dt>
                  <dd className="col-sm-8">{new Date(selectedRequest.confirmed_at).toLocaleString('pt-BR')}</dd>
                </>
              )}
            </dl>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedRequest?.status === 'pending' && (
            <Button
              variant="success"
              onClick={() => handleAdminConfirm(selectedRequest.id)}
            >
              <i className="bi bi-check-circle me-1"></i>Confirmar (Admin)
            </Button>
          )}
          {selectedRequest && ['pending', 'confirmed'].includes(selectedRequest.status) && (
            <Button
              variant="warning"
              onClick={() => handleCancel(selectedRequest.id)}
            >
              <i className="bi bi-x-circle me-1"></i>Cancelar Reunião
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedRequest?.id)}
          >
            <i className="bi bi-trash me-1"></i>Excluir
          </Button>
          <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MeetupRequestsPanel;
