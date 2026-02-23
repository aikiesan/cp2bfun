import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { fetchAllParticipants, deleteParticipant, fetchAllMeetupRequests } from '../../services/api';

const ParticipantsPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [participantMeetupCount, setParticipantMeetupCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([fetchAllParticipants(), fetchAllMeetupRequests()])
      .then(([pList, rList]) => {
        setParticipants(pList);
        const countMap = {};
        rList
          .filter(r => r.status !== 'declined' && r.status !== 'cancelled')
          .forEach(r => {
            countMap[r.requester_id] = (countMap[r.requester_id] || 0) + 1;
            countMap[r.invitee_id]   = (countMap[r.invitee_id]   || 0) + 1;
          });
        setParticipantMeetupCount(countMap);
      })
      .catch(() => setError('Erro ao carregar participantes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este participante? Esta ação não pode ser desfeita.')) return;
    try {
      await deleteParticipant(id);
      setParticipants(prev => prev.filter(p => p.id !== id));
      if (selectedParticipant?.id === id) setSelectedParticipant(null);
    } catch {
      alert('Erro ao excluir participante.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Filiação', 'E-mail', 'Palavras-chave', 'Resumo', 'Cadastro em'];
    const rows = participants.map(p => [
      p.name,
      p.affiliation,
      p.email,
      Array.isArray(p.keywords) ? p.keywords.join('; ') : (p.keywords || ''),
      p.abstract || '',
      new Date(p.created_at).toLocaleDateString('pt-BR'),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`));
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participantes_cp2b.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Participantes</h2>
          <p className="text-muted mb-0">Inscritos no Forum Paulista CP2b</p>
        </div>
        <Button variant="outline-success" size="sm" onClick={handleExportCSV} disabled={participants.length === 0}>
          <i className="bi bi-download me-1"></i>Exportar CSV
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col className="d-flex align-items-center">
          <small className="text-muted">{filtered.length} participante{filtered.length !== 1 ? 's' : ''}</small>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover responsive bordered size="sm">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Filiação</th>
              <th>E-mail</th>
              <th>Palavras-chave</th>
              <th className="text-center">Reuniões</th>
              <th>Cadastro em</th>
              <th style={{ width: '80px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-muted py-4">Nenhum participante encontrado.</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedParticipant(p)}>
                <td>{p.name}</td>
                <td>{p.affiliation}</td>
                <td>{p.email}</td>
                <td>
                  {Array.isArray(p.keywords)
                    ? p.keywords.map((kw, i) => <Badge key={i} bg="secondary" className="me-1">{kw}</Badge>)
                    : p.keywords}
                </td>
                <td className="text-center">
                  {participantMeetupCount[p.id] > 0
                    ? <Badge bg="info" text="dark">{participantMeetupCount[p.id]}</Badge>
                    : <span className="text-muted">—</span>}
                </td>
                <td>{new Date(p.created_at).toLocaleDateString('pt-BR')}</td>
                <td onClick={e => e.stopPropagation()}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
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
      <Modal show={!!selectedParticipant} onHide={() => setSelectedParticipant(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedParticipant?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParticipant && (
            <Row>
              <Col md={selectedParticipant.photo_url ? 8 : 12}>
                <dl className="row mb-0">
                  <dt className="col-sm-4">Filiação</dt>
                  <dd className="col-sm-8">{selectedParticipant.affiliation}</dd>
                  <dt className="col-sm-4">E-mail</dt>
                  <dd className="col-sm-8">{selectedParticipant.email}</dd>
                  {selectedParticipant.mini_bio && (
                    <>
                      <dt className="col-sm-4">Mini-bio</dt>
                      <dd className="col-sm-8">{selectedParticipant.mini_bio}</dd>
                    </>
                  )}
                  {selectedParticipant.abstract && (
                    <>
                      <dt className="col-sm-4">Resumo</dt>
                      <dd className="col-sm-8">{selectedParticipant.abstract}</dd>
                    </>
                  )}
                  {selectedParticipant.keywords?.length > 0 && (
                    <>
                      <dt className="col-sm-4">Palavras-chave</dt>
                      <dd className="col-sm-8">
                        {(Array.isArray(selectedParticipant.keywords)
                          ? selectedParticipant.keywords
                          : [selectedParticipant.keywords]
                        ).map((kw, i) => <Badge key={i} bg="secondary" className="me-1">{kw}</Badge>)}
                      </dd>
                    </>
                  )}
                  <dt className="col-sm-4">Cadastrado em</dt>
                  <dd className="col-sm-8">{new Date(selectedParticipant.created_at).toLocaleString('pt-BR')}</dd>
                </dl>
              </Col>
              {selectedParticipant.photo_url && (
                <Col md={4} className="text-center">
                  <img
                    src={selectedParticipant.photo_url}
                    alt={selectedParticipant.name}
                    className="img-thumbnail"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedParticipant?.id)}
          >
            <i className="bi bi-trash me-1"></i>Excluir
          </Button>
          <Button variant="secondary" onClick={() => setSelectedParticipant(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ParticipantsPanel;
