import { useState, useEffect } from 'react';
import { Container, Button, Table, Image, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchGallery, deleteGalleryPhoto } from '../../services/api';
import {ConfirmDialog} from '../../components/admin';

const GalleryList = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  // --- ESTADOS DO MODAL DE CONFIRMAÇÃO ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

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
  

  const requestDelete = (id) => {
    setPhotoToDelete(id); // Guarda o ID da foto selecionada
    setIsConfirmOpen(true); // Abre o modal na tela
  };

  // Função ligada ao botão "Sim" dentro do modal
  const executeDelete = async () => {
    try {
      await deleteGalleryPhoto(photoToDelete);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoToDelete));
      
      // Aqui entraria o useToast de SUCESSO!
      
    } catch (error) {
      console.error('Error deleting gallery photo:', error);
      // Aqui entraria o useToast de ERRO!
    } finally {
      // Independentemente de dar certo ou errado, limpa o estado e fecha o modal
      setIsConfirmOpen(false);
      setPhotoToDelete(null);
    }
  }

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
                      src={`${photo.url}`}
                      alt={photo.title}
                      width={80}
                      height={60}
                      rounded
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-semibold">{photo.title}</td>
                  <td><Badge bg="secondary">{new Date(photo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Badge></td>
                  <td className="text-end px-4">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => requestDelete(photo.id)}
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
      {/* RENDERIZA O MODAL AQUI */}
      <ConfirmDialog 
        show={isConfirmOpen} 
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Apagar Foto"
        message="Tem certeza que deseja apagar esta foto da galeria? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};

export default GalleryList;
