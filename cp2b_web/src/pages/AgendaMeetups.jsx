import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container, Row, Col, Form, Button, Alert, Spinner,
  Modal, Badge, Table,
} from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { fetchMeetupSlots, createMeetupRequest, getMyMeetups } from '../services/api';
import api from '../services/api';

const INVITE_TOKEN = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';
const TABLES = Array.from({ length: 10 }, (_, i) => i + 1);

const labels = {
  pt: {
    tag: 'FORUM PAULISTA',
    title: 'Agenda de Meetups',
    loginTitle: 'Identificação',
    emailLabel: 'Seu e-mail cadastrado',
    loginBtn: 'Entrar',
    loggingIn: 'Verificando...',
    emailNotFound: 'E-mail não encontrado. Você precisa estar cadastrado para usar a agenda.',
    gridTitle: 'Grade de Disponibilidade',
    table: 'Mesa',
    available: 'Livre',
    taken: 'Ocupado',
    myMeeting: 'Minha reunião',
    inviteModal: 'Agendar Reunião',
    slot: 'Horário',
    tableLabel: 'Mesa',
    searchPlaceholder: 'Buscar por nome ou e-mail...',
    searching: 'Buscando...',
    searchLabel: 'Convidar participante',
    noResults: 'Nenhum participante encontrado.',
    optionalMsg: 'Mensagem opcional',
    sendInvite: 'Enviar Convite',
    sending: 'Enviando...',
    inviteSent: 'Convite enviado! O participante receberá um e-mail de confirmação.',
    myMeetings: 'Minhas Reuniões',
    noMeetings: 'Nenhuma reunião agendada.',
    status: { pending: 'Pendente', confirmed: 'Confirmado', declined: 'Recusado', cancelled: 'Cancelado' },
    with: 'com',
    unauthorized: 'Link de convite inválido.',
  },
  en: {
    tag: 'FORUM PAULISTA',
    title: 'Meetup Scheduler',
    loginTitle: 'Identification',
    emailLabel: 'Your registered email',
    loginBtn: 'Sign in',
    loggingIn: 'Verifying...',
    emailNotFound: 'Email not found. You need to be registered to use the scheduler.',
    gridTitle: 'Availability Grid',
    table: 'Table',
    available: 'Free',
    taken: 'Taken',
    myMeeting: 'My meeting',
    inviteModal: 'Schedule Meeting',
    slot: 'Time slot',
    tableLabel: 'Table',
    searchPlaceholder: 'Search by name or email...',
    searching: 'Searching...',
    searchLabel: 'Invite participant',
    noResults: 'No participants found.',
    optionalMsg: 'Optional message',
    sendInvite: 'Send Invite',
    sending: 'Sending...',
    inviteSent: 'Invite sent! The participant will receive a confirmation email.',
    myMeetings: 'My Meetings',
    noMeetings: 'No meetings scheduled.',
    status: { pending: 'Pending', confirmed: 'Confirmed', declined: 'Declined', cancelled: 'Cancelled' },
    with: 'with',
    unauthorized: 'Invalid invite link.',
  },
};

const statusVariant = { pending: 'warning', confirmed: 'success', declined: 'danger', cancelled: 'secondary' };

const AgendaMeetups = () => {
  const { language } = useLanguage();
  const t = labels[language];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [authorized, setAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { id, name, email }
  const [emailInput, setEmailInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [slots, setSlots] = useState([]);
  const [myMeetups, setMyMeetups] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ open: false, slot: null, table: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedInvitee, setSelectedInvitee] = useState(null);
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteStatus, setInviteStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const token = searchParams.get('convite');
    if (token === INVITE_TOKEN) {
      setAuthorized(true);
    } else {
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const loadData = useCallback(async (email) => {
    setSlotsLoading(true);
    try {
      const [slotsData, meetupsData] = await Promise.all([
        fetchMeetupSlots(),
        getMyMeetups(email),
      ]);
      setSlots(slotsData || []);
      setMyMeetups(meetupsData || []);
    } catch {
      // ignore — slots/meetups will be empty
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      // Search by exact email
      const results = await api.get(`/participants/search?q=${encodeURIComponent(emailInput.trim())}`).then(r => r.data);
      const match = results.find(p => p.email.toLowerCase() === emailInput.trim().toLowerCase());
      if (!match) {
        setLoginError(t.emailNotFound);
        setLoginLoading(false);
        return;
      }
      setCurrentUser(match);
      await loadData(match.email);
    } catch {
      setLoginError(t.emailNotFound);
    } finally {
      setLoginLoading(false);
    }
  };

  // Cell status for a given slot + table
  const getCellStatus = (slot, tableNum) => {
    const booking = slot.bookings?.find(b => b.table_number === tableNum);
    if (!booking) return 'available';
    if (
      booking.requester_id === currentUser?.id ||
      booking.invitee_id === currentUser?.id
    ) return 'mine';
    return 'taken';
  };

  const openModal = (slot, tableNum) => {
    const status = getCellStatus(slot, tableNum);
    if (status !== 'available') return;
    setModal({ open: true, slot, table: tableNum });
    setSearchQuery('');
    setSearchResults([]);
    setSelectedInvitee(null);
    setInviteMsg('');
    setInviteStatus({ loading: false, success: false, error: null });
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const results = await api.get(`/participants/search?q=${encodeURIComponent(q.trim())}`).then(r => r.data);
      setSearchResults(results.filter(p => p.id !== currentUser?.id));
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!selectedInvitee) return;
    setInviteStatus({ loading: true, success: false, error: null });
    try {
      await createMeetupRequest({
        requester_id: currentUser.id,
        invitee_id: selectedInvitee.id,
        slot_id: modal.slot.id,
        table_number: modal.table,
        message: inviteMsg.trim() || undefined,
      });
      setInviteStatus({ loading: false, success: true, error: null });
      await loadData(currentUser.email);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro ao enviar convite.';
      setInviteStatus({ loading: false, success: false, error: msg });
    }
  };

  if (!authorized) return null;

  // Step 1: login
  if (!currentUser) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={5}>
            <span className="mono-label text-success">{t.tag}</span>
            <h1 className="fw-bold mt-2 mb-4">{t.title}</h1>
            <div className="bg-light p-4 border border-dark">
              <h5 className="fw-bold mb-3">{t.loginTitle}</h5>
              {loginError && <Alert variant="danger">{loginError}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="mono-label text-muted">{t.emailLabel}</Form.Label>
                  <Form.Control
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    className="rounded-0 border-dark bg-transparent"
                    disabled={loginLoading}
                    required
                  />
                </Form.Group>
                <Button variant="dark" type="submit" className="w-100 py-3" disabled={loginLoading}>
                  {loginLoading
                    ? <><Spinner animation="border" size="sm" className="me-2" />{t.loggingIn}</>
                    : t.loginBtn}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Step 2: grid
  return (
    <Container className="py-5" fluid>
      <Row className="mb-4">
        <Col>
          <span className="mono-label text-success">{t.tag}</span>
          <h1 className="fw-bold mt-2">{t.title}</h1>
          <p className="text-muted">
            {currentUser.name} — {currentUser.email}
          </p>
        </Col>
      </Row>

      {/* Legend */}
      <Row className="mb-3">
        <Col>
          <span className="me-3">
            <Badge bg="success" className="me-1">&nbsp;&nbsp;</Badge>{t.available}
          </span>
          <span className="me-3">
            <Badge bg="secondary" className="me-1">&nbsp;&nbsp;</Badge>{t.taken}
          </span>
          <span>
            <Badge bg="primary" className="me-1">&nbsp;&nbsp;</Badge>{t.myMeeting}
          </span>
        </Col>
      </Row>

      {slotsLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table bordered hover size="sm" style={{ minWidth: '900px' }}>
            <thead className="table-dark">
              <tr>
                <th style={{ width: '140px' }}>Horário</th>
                {TABLES.map(n => (
                  <th key={n} className="text-center">{t.table} {n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot.id}>
                  <td className="fw-semibold small align-middle">{slot.label}</td>
                  {TABLES.map(tableNum => {
                    const cellStatus = getCellStatus(slot, tableNum);
                    const bg = cellStatus === 'available' ? 'success' : cellStatus === 'mine' ? 'primary' : 'secondary';
                    const cursor = cellStatus === 'available' ? 'pointer' : 'default';
                    return (
                      <td
                        key={tableNum}
                        className={`text-center align-middle bg-${bg} bg-opacity-25`}
                        style={{ cursor, userSelect: 'none' }}
                        onClick={() => openModal(slot, tableNum)}
                        title={cellStatus === 'available' ? t.available : cellStatus === 'mine' ? t.myMeeting : t.taken}
                      >
                        <span className="small">
                          {cellStatus === 'available' ? '✓' : cellStatus === 'mine' ? '★' : '✗'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* My Meetings */}
      <Row className="mt-5">
        <Col lg={8}>
          <h4 className="fw-bold mb-3">{t.myMeetings}</h4>
          {myMeetups.length === 0 ? (
            <p className="text-muted">{t.noMeetings}</p>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>{t.tableLabel}</th>
                  <th>{t.with}</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myMeetups.map(m => {
                  const other = m.requester_id === currentUser.id ? m.invitee_name : m.requester_name;
                  return (
                    <tr key={m.id}>
                      <td>{m.label}</td>
                      <td className="text-center">{m.table_number}</td>
                      <td>{other}</td>
                      <td>
                        <Badge bg={statusVariant[m.status] || 'secondary'}>
                          {t.status[m.status] || m.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Invite Modal */}
      <Modal show={modal.open} onHide={() => setModal({ open: false, slot: null, table: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t.inviteModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.slot && (
            <p className="text-muted small mb-3">
              <strong>{t.slot}:</strong> {modal.slot.label} &nbsp;|&nbsp;
              <strong>{t.tableLabel}:</strong> {modal.table}
            </p>
          )}

          {inviteStatus.success ? (
            <Alert variant="success">{t.inviteSent}</Alert>
          ) : (
            <>
              {inviteStatus.error && <Alert variant="danger">{inviteStatus.error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.searchLabel}</Form.Label>
                <Form.Control
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="rounded-0 border-dark"
                  disabled={inviteStatus.loading}
                />
              </Form.Group>

              {searchLoading && <Spinner animation="border" size="sm" className="mb-2" />}

              {searchResults.length > 0 && !selectedInvitee && (
                <div className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => { setSelectedInvitee(p); setSearchQuery(p.name); setSearchResults([]); }}
                    >
                      <strong>{p.name}</strong>
                      <span className="text-muted small ms-2">{p.affiliation}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && !selectedInvitee && (
                <p className="text-muted small">{t.noResults}</p>
              )}

              {selectedInvitee && (
                <Alert variant="info" dismissible onClose={() => { setSelectedInvitee(null); setSearchQuery(''); }}>
                  {selectedInvitee.name} — {selectedInvitee.affiliation}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.optionalMsg}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inviteMsg}
                  onChange={e => setInviteMsg(e.target.value)}
                  className="rounded-0 border-dark"
                  disabled={inviteStatus.loading}
                />
              </Form.Group>

              <Button
                variant="dark"
                className="w-100 py-3"
                onClick={handleSendInvite}
                disabled={!selectedInvitee || inviteStatus.loading}
              >
                {inviteStatus.loading
                  ? <><Spinner animation="border" size="sm" className="me-2" />{t.sending}</>
                  : t.sendInvite}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AgendaMeetups;
