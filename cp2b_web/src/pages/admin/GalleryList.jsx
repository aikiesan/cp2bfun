import { useState, useEffect } from 'react';
import { Container, Button, Table, Image, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchGallery, deleteGalleryPhoto } from '../../services/api';

const GalleryList = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCA DE DADOS ---
  // Carrega a lista de fotos do backend ao montar o componente
  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  // --- EXCLUSÃO ---
  // Chama a API para apagar a foto e, em caso de sucesso, remove do estado local
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta foto da galeria?')) return;

    try {
      await deleteGalleryPhoto(id);
      // Atualiza a lista local sem precisar rebuscar do servidor
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (error) {
      alert('Erro ao apagar a foto. Tente novamente.');
      console.error('Error deleting gallery photo:', error);
    }
  };

  return (
    <Container className="py-4">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gerenciar Galeria</h2>
        <Button variant="primary" onClick={() => navigate('/admin/gallery/upload')}>
          <i className="bi bi-plus-lg me-2"></i>
          Nova Foto
        </Button>
      </div>

      {/* TABELA DE FOTOS */}
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
            {/* --- LOADING STATE --- */}
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                  Carregando fotos...
                </td>
              </tr>
            ) : photos.length === 0 ? (
              // Empty State — exibido quando não há fotos cadastradas
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  <i className="bi bi-images mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                  Nenhuma foto cadastrada na galeria.
                </td>
              </tr>
            ) : (
              // Lista de fotos vindas da API
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
                  <td className="fw-semibold">{photo.title}</td>
                  <td><Badge bg="secondary">{photo.date}</Badge></td>
                  <td className="text-end px-4">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
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
    </Container>
  );
};

export default GalleryList;
