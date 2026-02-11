import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaYoutube } from 'react-icons/fa';
import { Breadcrumbs, ConfirmDialog, EmptyState, useToast } from '../../components/admin';
import { fetchVideos, deleteVideo } from '../../services/api';

const VideosList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      setError('Erro ao carregar vídeos. Verifique se a API está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;

    try {
      await deleteVideo(videoToDelete.id);
      showToast('Vídeo excluído com sucesso!', 'success');
      loadVideos(); // Reload list
    } catch (err) {
      showToast('Erro ao excluir vídeo', 'error');
      console.error(err);
    } finally {
      setShowDeleteDialog(false);
      setVideoToDelete(null);
    }
  };

  const getPositionBadge = (position) => {
    if (!position) return <Badge bg="secondary">Sem posição</Badge>;

    const variants = { A: 'primary', B: 'success', C: 'info' };
    return <Badge bg={variants[position]}>{position}</Badge>;
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Vídeos', path: '/admin/videos' },
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Carregando vídeos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Alert variant="danger">{error}</Alert>
        <Button onClick={loadVideos}>Tentar novamente</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <FaYoutube className="me-2 text-danger" />
            Vídeos em Destaque
          </h2>
          <p className="text-muted mt-2">
            Gerencie os vídeos do YouTube exibidos na página inicial
          </p>
        </div>
        <Button
          as={Link}
          to="/admin/videos/new"
          variant="primary"
          className="rounded-pill"
        >
          <FaPlus className="me-2" />
          Novo Vídeo
        </Button>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={FaYoutube}
          title="Nenhum vídeo cadastrado"
          message="Adicione vídeos do YouTube para exibir na página inicial"
          actionLabel="Adicionar Vídeo"
          onAction={() => navigate('/admin/videos/new')}
        />
      ) : (
        <div className="card">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '100px' }}>Posição</th>
                <th style={{ width: '120px' }}>Miniatura</th>
                <th>Título (PT)</th>
                <th style={{ width: '150px' }}>Data</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '120px' }} className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td>{getPositionBadge(video.position)}</td>
                  <td>
                    <img
                      src={video.thumbnail_url}
                      alt={video.title_pt}
                      style={{
                        width: '100px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{video.title_pt}</div>
                    {video.title_en && (
                      <div className="text-muted small">{video.title_en}</div>
                    )}
                  </td>
                  <td>{video.date_display || '-'}</td>
                  <td>
                    {video.active ? (
                      <Badge bg="success">Ativo</Badge>
                    ) : (
                      <Badge bg="secondary">Inativo</Badge>
                    )}
                  </td>
                  <td className="text-end">
                    <Button
                      as={Link}
                      to={`/admin/videos/${video.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(video)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        show={showDeleteDialog}
        title="Excluir Vídeo"
        message={`Tem certeza que deseja excluir o vídeo "${videoToDelete?.title_pt}"?`}
        confirmLabel="Excluir"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setVideoToDelete(null);
        }}
      />
    </Container>
  );
};

export default VideosList;
