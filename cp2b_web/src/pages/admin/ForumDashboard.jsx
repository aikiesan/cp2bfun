import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllParticipants, fetchMeetupSlots, fetchAllMeetupRequests } from '../../services/api';

const STATUS_LABELS = {
  pending:   { label: 'Pendente',   bg: 'warning', text: 'dark' },
  confirmed: { label: 'Confirmado', bg: 'success',  text: 'white' },
  declined:  { label: 'Recusado',   bg: 'danger',   text: 'white' },
  cancelled: { label: 'Cancelado',  bg: 'secondary',text: 'white' },
};

const CELL_STYLES = {
  free:      { bg: '#f0f0f0', label: 'Livre',      cursor: 'default' },
  pending:   { bg: '#fff3cd', label: 'Pendente',   cursor: 'pointer' },
  confirmed: { bg: '#d1e7dd', label: 'Confirmado', cursor: 'pointer' },
  declined:  { bg: '#e9ecef', label: '—',          cursor: 'pointer' },
  cancelled: { bg: '#e9ecef', label: '—',          cursor: 'pointer' },
};

const TABLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const StatusBadge = ({ status }) => {
  const s = STATUS_LABELS[status] || { label: status, bg: 'light', text: 'dark' };
  return <Badge bg={s.bg} text={s.text}>{s.label}</Badge>;
};

const inviteToken = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';

const ForumDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [slots, setSlots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { slot, tableNumber, request }
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchAllParticipants(),
      fetchMeetupSlots(),
      fetchAllMeetupRequests(),
    ])
      .then(([p, s, r]) => {
        setParticipants(p);
        setSlots(s);
        setRequests(r);
      })
      .catch(() => setError('Erro ao carregar dados do Forum Paulista.'))
      .finally(() => setLoading(false));
  }, []);

  // Build a lookup: { slotId_tableNumber: request }
  const bookingMap = {};
  requests.forEach(r => {
    const key = `${r.slot_id}_${r.table_number}`;
    // If multiple, prefer confirmed > pending > others
    const existing = bookingMap[key];
    if (!existing) {
      bookingMap[key] = r;
    } else {
      const priority = { confirmed: 3, pending: 2, declined: 1, cancelled: 0 };
      if ((priority[r.status] || 0) > (priority[existing.status] || 0)) {
        bookingMap[key] = r;
      }
    }
  });

  const stats = {
    participants: participants.length,
    pending:   requests.filter(r => r.status === 'pending').length,
    confirmed: requests.filter(r => r.status === 'confirmed').length,
    declined:  requests.filter(r => r.status === 'declined').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  const recentParticipants = [...participants]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const handleCellClick = (slot, tableNumber) => {
    const key = `${slot.id}_${tableNumber}`;
    const request = bookingMap[key];
    if (!request) return;
    setSelectedCell({ slot, tableNumber, request });
  };

  const handleCopy = (key, url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Carregando dados do Forum Paulista...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Visão Geral — Forum Paulista</h2>
          <p className="text-muted mb-0">Painel operacional do evento</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Row */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={4} lg>
          <Card className="text-center h-100" style={{ borderTop: '3px solid #00796B' }}>
            <Card.Body className="py-3">
              <h3 className="mb-0 fw-bold" style={{ color: '#00796B' }}>{stats.participants}</h3>
              <small className="text-muted">Participantes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg>
          <Card className="text-center h-100" style={{ borderTop: '3px solid #ffc107' }}>
            <Card.Body className="py-3">
              <h3 className="mb-0 fw-bold" style={{ color: '#856404' }}>{stats.pending}</h3>
              <small className="text-muted">Pendentes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg>
          <Card className="text-center h-100" style={{ borderTop: '3px solid #198754' }}>
            <Card.Body className="py-3">
              <h3 className="mb-0 fw-bold" style={{ color: '#198754' }}>{stats.confirmed}</h3>
              <small className="text-muted">Confirmados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg>
          <Card className="text-center h-100" style={{ borderTop: '3px solid #dc3545' }}>
            <Card.Body className="py-3">
              <h3 className="mb-0 fw-bold" style={{ color: '#dc3545' }}>{stats.declined}</h3>
              <small className="text-muted">Recusados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg>
          <Card className="text-center h-100" style={{ borderTop: '3px solid #6c757d' }}>
            <Card.Body className="py-3">
              <h3 className="mb-0 fw-bold" style={{ color: '#6c757d' }}>{stats.cancelled}</h3>
              <small className="text-muted">Cancelados</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Shareable Links */}
      <Card className="mb-4">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-link-45deg me-2"></i>
            Links de Acesso
          </h5>
          <small className="text-muted">Compartilhe estes links com os participantes</small>
        </Card.Header>
        <Card.Body>
          {[
            { key: 'registro', label: 'Inscrição de Participante', url: `${window.location.origin}/registro?convite=${inviteToken}` },
            { key: 'agenda',   label: 'Agendamento de Meet-up',   url: `${window.location.origin}/agenda-meetups?convite=${inviteToken}` },
          ].map(({ key, label, url }) => (
            <div key={key} className="mb-3">
              <div className="fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>{label}</div>
              <div className="d-flex align-items-center gap-2">
                <code
                  className="flex-grow-1 bg-light rounded px-2 py-1 text-break"
                  style={{ fontSize: '0.8rem', display: 'block', wordBreak: 'break-all' }}
                >
                  {url}
                </code>
                <Button
                  size="sm"
                  variant={copiedKey === key ? 'success' : 'outline-secondary'}
                  onClick={() => handleCopy(key, url)}
                  style={{ whiteSpace: 'nowrap', minWidth: '80px' }}
                >
                  {copiedKey === key ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* Table Occupancy Grid */}
      <Card className="mb-4">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Ocupação de Mesas por Horário
          </h5>
          <small className="text-muted">Clique em uma célula reservada para ver detalhes</small>
        </Card.Header>
        <Card.Body className="p-0">
          {slots.length === 0 ? (
            <div className="text-center text-muted py-4">Nenhum horário cadastrado.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-bordered mb-0" style={{ minWidth: '700px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: '180px' }}>Horário</th>
                    {TABLE_NUMBERS.map(t => (
                      <th key={t} className="text-center" style={{ minWidth: '60px' }}>Mesa {t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map(slot => (
                    <tr key={slot.id}>
                      <td className="align-middle">
                        <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{slot.label}</div>
                        {slot.slot_date && (
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(slot.slot_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </div>
                        )}
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {slot.start_time?.slice(0, 5)}–{slot.end_time?.slice(0, 5)}
                        </div>
                      </td>
                      {TABLE_NUMBERS.map(tableNum => {
                        const key = `${slot.id}_${tableNum}`;
                        const booking = bookingMap[key];
                        const status = booking?.status || 'free';
                        const cellStyle = CELL_STYLES[status] || CELL_STYLES.free;
                        return (
                          <td
                            key={tableNum}
                            className="text-center align-middle"
                            style={{
                              backgroundColor: cellStyle.bg,
                              cursor: cellStyle.cursor,
                              fontSize: '0.75rem',
                              padding: '6px 4px',
                            }}
                            onClick={() => handleCellClick(slot, tableNum)}
                            title={booking ? `${booking.requester_name} → ${booking.invitee_name}` : 'Livre'}
                          >
                            {status === 'free' ? (
                              <span className="text-muted">Livre</span>
                            ) : (
                              <Badge
                                bg={STATUS_LABELS[status]?.bg || 'secondary'}
                                text={STATUS_LABELS[status]?.text}
                                style={{ fontSize: '0.7rem' }}
                              >
                                {STATUS_LABELS[status]?.label || status}
                              </Badge>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white border-top">
          <div className="d-flex flex-wrap gap-3 align-items-center" style={{ fontSize: '0.8rem' }}>
            <span className="text-muted">Legenda:</span>
            {Object.entries(CELL_STYLES).map(([status, style]) => (
              <span key={status} className="d-flex align-items-center gap-1">
                <span style={{ display: 'inline-block', width: 14, height: 14, backgroundColor: style.bg, border: '1px solid #dee2e6', borderRadius: 3 }}></span>
                {status === 'free' ? 'Livre' : STATUS_LABELS[status]?.label || status}
              </span>
            ))}
          </div>
        </Card.Footer>
      </Card>

      {/* Bottom two-column row */}
      <Row className="g-3">
        {/* Recent Registrations */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Últimas Inscrições
              </h5>
              <Link to="/admin/forum/participants" className="btn btn-outline-primary btn-sm">
                Ver todos
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentParticipants.length === 0 ? (
                <div className="text-center text-muted py-4">Nenhum participante inscrito.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentParticipants.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{p.name}</div>
                        <small className="text-muted">{p.affiliation}</small>
                      </div>
                      <small className="text-muted">{new Date(p.created_at).toLocaleDateString('pt-BR')}</small>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Meetup Requests */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-diagram-2 me-2"></i>
                Últimos Meet-ups
              </h5>
              <Link to="/admin/forum/meetups" className="btn btn-outline-primary btn-sm">
                Ver todos
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentRequests.length === 0 ? (
                <div className="text-center text-muted py-4">Nenhuma solicitação de meet-up.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentRequests.map(r => (
                    <li key={r.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ fontSize: '0.85rem' }}>
                          <span className="fw-semibold">{r.requester_name}</span>
                          <i className="bi bi-arrow-right mx-1 text-muted"></i>
                          <span>{r.invitee_name}</span>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {r.slot_label} · Mesa {r.table_number}
                          </div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cell Detail Modal */}
      <Modal show={!!selectedCell} onHide={() => setSelectedCell(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Detalhes da Reserva
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCell && (
            <dl className="row mb-0">
              <dt className="col-sm-4">Horário</dt>
              <dd className="col-sm-8">
                {selectedCell.slot.label}
                {selectedCell.slot.slot_date && (
                  <span className="text-muted ms-1">
                    ({new Date(selectedCell.slot.slot_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })})
                  </span>
                )}
                <br />
                <small className="text-muted">
                  {selectedCell.slot.start_time?.slice(0, 5)}–{selectedCell.slot.end_time?.slice(0, 5)}
                </small>
              </dd>
              <dt className="col-sm-4">Mesa</dt>
              <dd className="col-sm-8">{selectedCell.tableNumber}</dd>
              <dt className="col-sm-4">Status</dt>
              <dd className="col-sm-8"><StatusBadge status={selectedCell.request.status} /></dd>
              <dt className="col-sm-4">Solicitante</dt>
              <dd className="col-sm-8">
                {selectedCell.request.requester_name}
                <br />
                <small className="text-muted">{selectedCell.request.requester_email}</small>
              </dd>
              <dt className="col-sm-4">Convidado</dt>
              <dd className="col-sm-8">
                {selectedCell.request.invitee_name}
                <br />
                <small className="text-muted">{selectedCell.request.invitee_email}</small>
              </dd>
              {selectedCell.request.message && (
                <>
                  <dt className="col-sm-4">Mensagem</dt>
                  <dd className="col-sm-8">{selectedCell.request.message}</dd>
                </>
              )}
            </dl>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedCell(null)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ForumDashboard;
