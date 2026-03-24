import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchGallery } from '../services/api';
import { useNavigate } from 'react-router-dom';


const Gallery = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Galeria de Fotos</h1>
        <p className="text-muted">Confira os registros dos nossos eventos e projetos.</p>
      </div>
      {photos.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-camera-fill" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">Ainda não há álbuns publicados na galeria.</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {photos
            .filter((photo) => photo.is_cover)
            .map((album) => (
            <Col key={album.id}>
              <Card
                className="h-100 shadow-sm border-0"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => navigate(`/gallery/${album.album_id}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Img
                  variant="top"
                  src={album.url}
                  alt={album.title}
                  style={{ objectFit: 'cover', height: '250px' }}
                />
                <Card.Body>
                  <Card.Title className="h6 fw-bold">{album.title}</Card.Title>
                  <Card.Text className="text-muted small mb-0 d-flex justify-content-between align-items-center">
                    <span>
                      <i className="bi bi-calendar-event me-2"></i>
                      {new Date(album.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                    <i className="bi bi-folder2-open text-primary fs-5"></i>
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
