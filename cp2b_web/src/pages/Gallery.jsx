import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchGallery } from '../services/api';

const Gallery = () => {
  // --- ESTADOS ---
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCA DE DADOS ---
  // Carrega as fotos do backend ao montar o componente
  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery(); // retorna [] em caso de erro (ver api.js)
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Cabeçalho da Página */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Galeria de Fotos</h1>
        <p className="text-muted">Confira os registros dos nossos eventos e projetos.</p>
      </div>

      {/* --- LÓGICA DE EXIBIÇÃO: lista vazia ou grid de fotos --- */}
      {photos.length === 0 ? (
        // Empty State — exibido quando não há fotos ou a API retornou vazio
        <div className="text-center text-muted py-5">
          <i className="bi bi-camera-fill" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">Ainda não há fotos publicadas na galeria.</p>
        </div>
      ) : (
        // Grid de Fotos
        <Row xs={1} md={2} lg={3} className="g-4">
          {photos.map((photo) => (
            <Col key={photo.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={photo.url}
                  alt={photo.title}
                  style={{ objectFit: 'cover', height: '250px' }}
                />
                <Card.Body>
                  <Card.Title className="h6 fw-bold">{photo.title}</Card.Title>
                  <Card.Text className="text-muted small mb-0">
                    <i className="bi bi-calendar-event me-2"></i>
                    {photo.date}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Gallery;
