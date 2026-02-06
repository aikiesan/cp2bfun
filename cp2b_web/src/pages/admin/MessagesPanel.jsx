import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data);
    } catch {
      setError('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch {
      setError('Erro ao atualizar mensagem');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter((m) => m.id !== id));
      setSelectedMessage(null);
    } catch {
      setError('Erro ao deletar mensagem');
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markAsRead(msg.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">Mensagens</h2>
        {unreadCount > 0 && (
          <Badge bg="danger" className="ms-2">{unreadCount} nova{unreadCount > 1 ? 's' : ''}</Badge>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>
      )}

      {messages.length === 0 ? (
        <Alert variant="info">Nenhuma mensagem recebida.</Alert>
      ) : (
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th style={{ width: '30px' }}></th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Mensagem</th>
              <th>Data</th>
              <th>Acoes</th>
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
                <td>{msg.email}</td>
                <td>{msg.message.length > 60 ? msg.message.substring(0, 60) + '...' : msg.message}</td>
                <td className="text-nowrap">
                  {new Date(msg.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={!!selectedMessage} onHide={() => setSelectedMessage(null)} size="lg">
        {selectedMessage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Mensagem de {selectedMessage.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>E-mail:</strong> {selectedMessage.email}</p>
              <p><strong>Data:</strong> {new Date(selectedMessage.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <hr />
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={() => deleteMessage(selectedMessage.id)}>
                <i className="bi bi-trash me-1"></i>Excluir
              </Button>
              <Button variant="secondary" onClick={() => setSelectedMessage(null)}>Fechar</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default MessagesPanel;
