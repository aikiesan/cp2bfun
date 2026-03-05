import { useState } from 'react';
import { Container, Button, Table, Image, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GalleryList = () => {
  const navigate = useNavigate(); // Ferramenta do React para mudar de página

  // Simulando as fotos que viriam do banco de dados
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://picsum.photos/id/1018/600/400', title: 'Fórum Paulista - Abertura', date: '28/05/2026' },
    { id: 2, url: 'https://picsum.photos/id/1015/600/400', title: 'Palestra Principal', date: '28/05/2026' },
  ]);

  // Função para apagar uma foto
  const handleDelete = (id) => {
    // window.confirm cria aquela caixinha nativa do navegador perguntando "Tem certeza?"
    if (window.confirm('Tem certeza que deseja apagar esta foto da galeria?')) {
      // Filtra a lista, removendo a foto com o ID clicado
      setPhotos(photos.filter(photo => photo.id !== id));
    }
  };

  return (
    <Container className="py-4">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gerenciar Galeria</h2>
        
        {/* AQUI ESTÁ O SEU BOTÃO! Ele usa o navigate para ir para a tela de Upload */}
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
            {photos.length === 0 ? (
              // Se não houver fotos, mostra esta mensagem
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  <i className="bi bi-images mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                  Nenhuma foto cadastrada na galeria.
                </td>
              </tr>
            ) : (
              // Se houver fotos, cria uma linha (tr) para cada uma
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