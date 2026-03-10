import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import api from '../../services/api';
import { ConfirmDialog, EmptyState, useToast } from '../../components/admin';

const MessagesPanel = () => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data);
    } catch {
      toast.error('Erro ao carregar mensagens. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => ({ ...prev, read: true }));
      }
    } catch {
      toast.error('Erro ao marcar mensagem como lida.');
    }
  };

  const markAllAsRead = async () => {
    const unread = messages.filter((m) => !m.read);
    if (unread.length === 0) return;
    setMarkingAllRead(true);
    try {
      await Promise.all(unread.map((m) => api.put(`/contact/${m.id}/read`)));
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      toast.success(`${unread.length} mensagem${unread.length > 1 ? 's marcadas' : ' marcada'} como lida${unread.length > 1 ? 's' : ''}.`);
    } catch {
      toast.error('Erro ao marcar mensagens. Tente novamente.');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDeleteClick = (msg, e) => {
    if (e) e.stopPropagation();
    setMessageToDelete(msg);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    try {
      await api.delete(`/contact/${messageToDelete.id}`);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) setSelectedMessage(null);
      toast.success('Mensagem excluída.');
    } catch {
      toast.error('Erro ao excluir mensagem. Tente novamente.');
    } finally {
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Mensagens</h2>
          {unreadCount > 0 && (
            <Badge bg="danger" className="ms-2">{unreadCount} nova{unreadCount > 1 ? 's' : ''}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={markAllAsRead}
            disabled={markingAllRead}
          >
            {markingAllRead
              ? <><Spinner size="sm" className="me-1" />Marcando…</>
              : <><i className="bi bi-check2-all me-1"></i>Marcar todas como lidas</>
            }
          </Button>
        )}
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon="bi-envelope"
          title="Nenhuma mensagem recebida"
          message="As mensagens enviadas pelo formulário de contato aparecerão aqui."
        />
      ) : (
        <div className="card">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '30px' }}></th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Mensagem</th>
                <th>Data</th>
                <th style={{ width: '60px' }} className="text-end">Ação</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  style={{ cursor: 'pointer', fontWeight: msg.read ? 'normal' : 'bold' }}
                  onClick={() => openMessage(msg)}
                >
                  <td>
                    {!msg.read && <Badge bg="primary" pill>&nbsp;</Badge>}
                  </td>
                  <td>{msg.name}</td>
                  <td><small>{msg.email}</small></td>
                  <td className="text-truncate" style={{ maxWidth: '280px' }}>
                    {msg.message.length > 80 ? msg.message.substring(0, 80) + '…' : msg.message}
                  </td>
                  <td className="text-nowrap"><small>{formatDate(msg.created_at)}</small></td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      title="Excluir"
                      onClick={(e) => handleDeleteClick(msg, e)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal show={!!selectedMessage} onHide={() => setSelectedMessage(null)} size="lg">
        {selectedMessage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <i className="bi bi-envelope-open me-2"></i>
                Mensagem de {selectedMessage.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <dl className="row mb-0">
                <dt className="col-sm-2">E-mail</dt>
                <dd className="col-sm-10">
                  <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                </dd>
                <dt className="col-sm-2">Data</dt>
                <dd className="col-sm-10">{formatDate(selectedMessage.created_at)}</dd>
              </dl>
              <hr />
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-danger"
                onClick={(e) => {
                  setSelectedMessage(null);
                  handleDeleteClick(selectedMessage, e);
                }}
              >
                <i className="bi bi-trash me-1"></i>Excluir
              </Button>
              <Button variant="secondary" onClick={() => setSelectedMessage(null)}>Fechar</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <ConfirmDialog
        show={showDeleteDialog}
        title="Excluir Mensagem"
        message={`Tem certeza que deseja excluir a mensagem de "${messageToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setMessageToDelete(null); }}
      />
    </Container>
  );
};

export default MessagesPanel;
