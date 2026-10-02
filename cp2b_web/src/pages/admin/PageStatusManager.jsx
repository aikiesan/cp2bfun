import { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { useToast } from '../../components/admin';

const PageStatusManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, page: null, newStatus: null });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(false);
      const { data } = await api.get('/page-settings');
      setPages(data);
    } catch {
      setError(true);
      showToast('Erro ao carregar status das páginas', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleRequest = (page) => {
    const newStatus = !page.is_enabled;
    if (!newStatus) {
      // Only confirm when disabling (potentially dangerous action)
      setConfirmModal({ show: true, page, newStatus });
    } else {
      doToggle(page, newStatus);
    }
  };

  const doToggle = async (page, newStatus) => {
    setSaving(true);
    try {
      const { data } = await api.request(`/page-settings/${page.page_key}`, {
        method: 'PATCH',
        body: { is_enabled: newStatus },
      });
      setPages(prev => prev.map(p => p.page_key === page.page_key ? data : p));
      showToast(
        newStatus
          ? `"${page.label}" ativada com sucesso`
          : `"${page.label}" colocada em manutenção`,
        newStatus ? 'success' : 'warning'
      );
    } catch {
      showToast('Erro ao atualizar status da página', 'danger');
    } finally {
      setSaving(false);
      setConfirmModal({ show: false, page: null, newStatus: null });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const disabledCount = pages.filter(p => !p.is_enabled).length;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Status das Páginas</h4>
          <p className="text-muted mb-0">
            Ative ou coloque páginas em manutenção. Páginas desativadas redirecionam visitantes para a tela de manutenção.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={fetchPages}>
          <i className="bi bi-arrow-clockwise me-1"></i> Atualizar
        </Button>
      </div>

      {disabledCount > 0 && (
        <Alert variant="warning" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>{disabledCount} página{disabledCount > 1 ? 's' : ''} em manutenção</strong> — visitantes estão sendo redirecionados para a tela de manutenção.
        </Alert>
      )}

      <div className="card border-0 shadow-sm">
        {error ? (
          <Alert variant="danger" className="mb-0 rounded">
            <i className="bi bi-x-circle me-2"></i>
            <strong>Erro ao carregar dados.</strong> A tabela <code>page_settings</code> pode não existir no banco de dados.
            Execute a migração no servidor e clique em <strong>Atualizar</strong>.
          </Alert>
        ) : (
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Página</th>
                <th>Rota</th>
                <th>Status</th>
                <th className="text-end">Ação</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.page_key}>
                  <td className="fw-semibold align-middle">{page.label}</td>
                  <td className="align-middle">
                    <code className="text-muted" style={{ fontSize: '0.85rem' }}>{page.route_path}</code>
                  </td>
                  <td className="align-middle">
                    {page.is_enabled ? (
                      <Badge bg="success">
                        <i className="bi bi-check-circle me-1"></i>Ativa
                      </Badge>
                    ) : (
                      <Badge bg="warning" text="dark">
                        <i className="bi bi-tools me-1"></i>Manutenção
                      </Badge>
                    )}
                  </td>
                  <td className="text-end align-middle">
                    <Button
                      variant={page.is_enabled ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      onClick={() => handleToggleRequest(page)}
                      disabled={saving}
                    >
                      {page.is_enabled ? (
                        <><i className="bi bi-tools me-1"></i>Colocar em Manutenção</>
                      ) : (
                        <><i className="bi bi-check-circle me-1"></i>Reativar</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Confirm Disable Modal */}
      <Modal show={confirmModal.show} onHide={() => setConfirmModal({ show: false, page: null, newStatus: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Manutenção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja colocar a página <strong>{confirmModal.page?.label}</strong> em manutenção?</p>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Visitantes que acessarem <code>{confirmModal.page?.route_path}</code> serão redirecionados para a tela de manutenção até que você reative a página.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal({ show: false, page: null, newStatus: null })}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={() => doToggle(confirmModal.page, confirmModal.newStatus)}
            disabled={saving}
          >
            {saving ? <Spinner size="sm" className="me-1" /> : <i className="bi bi-tools me-1"></i>}
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PageStatusManager;
