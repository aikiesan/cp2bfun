import { useState } from 'react';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useCrudList from '../../hooks/useCrudList';
import {
  AdminPageHeader,
  ConfirmDialog,
  EmptyState,
  TableSkeleton,
  useToast,
} from '../../components/admin';

const TYPE_LABELS = {
  workshop: 'Workshop',
  forum: 'Fórum',
  conference: 'Conferência',
  meeting: 'Reunião',
  webinar: 'Webinar',
  course: 'Curso',
};

const STATUS = {
  upcoming: { label: 'Em breve', variant: 'primary' },
  ongoing: { label: 'Em andamento', variant: 'success' },
  completed: { label: 'Realizado', variant: 'secondary' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

const fetchEvents = () => api.get('/events').then((r) => r.data);
const deleteEvent = (event) => api.delete(`/events/${event.id}`);

const formatRange = (event) => {
  const start = new Date(event.start_date);
  const end = new Date(event.end_date || event.start_date);
  const fmt = (d) => d.toLocaleDateString('pt-BR');
  return start.toDateString() === end.toDateString() ? fmt(start) : `${fmt(start)} — ${fmt(end)}`;
};

const EventsList = () => {
  const { items, loading, error, setError, deletingId, removeItem } = useCrudList({
    fetchItems: fetchEvents,
    deleteItem: deleteEvent,
  });
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();

  const confirmDelete = async () => {
    const event = pendingDelete;
    setPendingDelete(null);
    if (await removeItem(event)) {
      toast.success(`Evento "${event.title_pt}" excluído.`);
    }
  };

  return (
    <Container fluid className="py-4">
      <AdminPageHeader
        title="Eventos"
        description={
          <>
            Agenda pública em <code>/eventos</code> — eventos com slug ganham página própria em{' '}
            <code>/eventos/&lt;slug&gt;</code>
          </>
        }
        actionLabel="Novo Evento"
        actionLink="/admin/events/new"
      />

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <TableSkeleton rows={4} columns={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="bi-calendar-event"
          title="Nenhum evento cadastrado"
          description="Crie o primeiro evento para ele aparecer na agenda pública do site."
          actionLabel="Novo Evento"
          actionLink="/admin/events/new"
        />
      ) : (
        <Table hover responsive className="bg-white rounded shadow-sm align-middle">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Página própria</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((event) => {
              const status = STATUS[event.status] || { label: event.status, variant: 'secondary' };
              return (
                <tr key={event.id}>
                  <td>
                    <div className="fw-semibold">{event.title_pt}</div>
                    {event.location && <small className="text-muted">{event.location}</small>}
                  </td>
                  <td>{formatRange(event)}</td>
                  <td><Badge bg="info">{TYPE_LABELS[event.event_type] || event.event_type}</Badge></td>
                  <td><Badge bg={status.variant}>{status.label}</Badge></td>
                  <td>
                    {event.slug ? (
                      <a href={`/eventos/${event.slug}`} target="_blank" rel="noreferrer">
                        /eventos/{event.slug} <i className="bi bi-box-arrow-up-right small"></i>
                      </a>
                    ) : (
                      <span className="text-muted small">sem slug</span>
                    )}
                  </td>
                  <td className="text-end">
                    <Button
                      as={Link}
                      to={`/admin/events/${event.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      aria-label={`Editar ${event.title_pt}`}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={deletingId === event.id}
                      onClick={() => setPendingDelete(event)}
                      aria-label={`Excluir ${event.title_pt}`}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        show={pendingDelete !== null}
        title="Excluir evento"
        message={`Excluir o evento "${pendingDelete?.title_pt}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </Container>
  );
};

export default EventsList;
