import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Gallery = () => {
  // 1. O ESTADO: Simulando fotos vindas de um servidor (Mock Data)
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://picsum.photos/id/1018/600/400', title: 'Fórum Paulista - Abertura', date: '28/05/2026' },
    { id: 2, url: 'https://picsum.photos/id/1015/600/400', title: 'Palestra Principal', date: '28/05/2026' },
    { id: 3, url: 'https://picsum.photos/id/1019/600/400', title: 'Networking Meet-up', date: '28/05/2026' },
    { id: 4, url: 'https://picsum.photos/id/1043/600/400', title: 'Encerramento', date: '29/05/2026' },
  ]);

  return (
    <Container className="py-5">
      {/* Cabeçalho da Página */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Galeria de Fotos</h1>
        <p className="text-muted">Confira os registros dos nossos eventos e projetos.</p>
      </div>

      {/* 2. LÓGICA DE EXIBIÇÃO: Tem foto ou está vazio? */}
      {photos.length === 0 ? (
        // Empty State (Estado Vazio) - O que mostra se não houver fotos
        <div className="text-center text-muted py-5">
          <i className="bi bi-camera-fill" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">Ainda não há fotos publicadas na galeria.</p>
        </div>
      ) : (
        // O Grid de Fotos usando Bootstrap
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* 3. O LOOP: map() percorre a lista e cria um Card para cada foto */}
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