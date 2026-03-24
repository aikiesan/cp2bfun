import { useState, useEffect } from 'react';
import { Container, Button, Table, Image, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchGallery, deleteGalleryPhoto } from '../../services/api';
import { ConfirmDialog, useToast } from '../../components/admin';

const GalleryList = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  const requestDelete = (photo) => {
    setPhotoToDelete(photo);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    try {
      await deleteGalleryPhoto(photoToDelete.id);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoToDelete.id));
      success('Foto excluída com sucesso!');
    } catch (err) {
      console.error('Error deleting gallery photo:', err);
      error('Ocorreu um erro ao excluir a foto. Tente novamente.');
    } finally {
      setIsConfirmOpen(false);
      setPhotoToDelete(null);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gerenciar Galeria</h2>
        <Button variant="primary" onClick={() => navigate('/admin/gallery/upload')}>
          <i className="bi bi-plus-lg me-2"></i>
          Nova Foto
        </Button>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-4">Imagem</th>
              <th className="py-3">Título</th>
              <th className="py-3">Data</th>
              <th className="py-3 text-end px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                  Carregando fotos...
                </td>
              </tr>
            ) : photos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  <i className="bi bi-images mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                  Nenhuma foto cadastrada na galeria.
                </td>
              </tr>
            ) : (
              photos.map((photo) => (
                <tr key={photo.id}>
                  <td className="px-4">
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      width={80}
                      height={60}
                      rounded
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-semibold">
                    {photo.title}
                    {photo.is_cover && (
                      <Badge bg="warning" text="dark" className="ms-2">Capa do Álbum</Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {new Date(photo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => requestDelete(photo)}
                    >
                      <i className="bi bi-trash"></i> Apagar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <ConfirmDialog
        show={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title={photoToDelete?.is_cover ? '⚠️ ALERTA: Apagar Capa do Álbum' : 'Apagar Foto'}
        message={
          photoToDelete?.is_cover
            ? `Tem certeza que deseja apagar a capa do álbum "${photoToDelete?.title}"? ALERTA: Sem a capa, o álbum inteiro deixará de aparecer no site público, e as fotos internas ficarão "órfãs".`
            : 'Tem certeza que deseja apagar esta foto da galeria? Esta ação não pode ser desfeita.'
        }
      />
    </Container>
  );
};

export default GalleryList;
