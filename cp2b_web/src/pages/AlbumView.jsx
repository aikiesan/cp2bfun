import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGallery } from '../services/api';

const AlbumView = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [albumInfo, setAlbumInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setShowLightbox(true);
  };
  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % albumPhotos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev === 0 ? albumPhotos.length - 1 : prev - 1));

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      const photosInThisAlbum = data.filter(photo => photo.album_id === albumId);
      const cover = photosInThisAlbum.find(photo => photo.is_cover);
      const internals = photosInThisAlbum.filter(photo => !photo.is_cover);
      setAlbumInfo(cover);
      setAlbumPhotos(internals);
      setLoading(false);
    };
    loadPhotos();
  }, [albumId]);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  if (!albumInfo) {
    return <Container className="py-5 text-center text-muted">Álbum não encontrado.</Container>;
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/galeria')}>
        <i className="bi bi-arrow-left me-2"></i> Voltar para Galeria
      </Button>

      <div className="mb-5">
        <h2 className="fw-bold text-primary mb-1">{albumInfo.title}</h2>
        <p className="text-muted">
          <i className="bi bi-calendar-event me-2"></i>
          {new Date(albumInfo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {albumPhotos.map((photo, index) => (
          <Col key={photo.id}>
            <Card
              className="shadow-sm border-0"
              style={{ cursor: 'zoom-in' }}
              onClick={() => openLightbox(index)}
            >
              <Card.Img
                variant="top"
                src={photo.url}
                style={{ objectFit: 'cover', height: '250px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        size="xl"
        centered
        contentClassName="bg-transparent border-0"
      >
        <Modal.Header closeButton variant="white" className="border-0 pb-0 z-3"></Modal.Header>
        <Modal.Body className="text-center position-relative p-0 d-flex justify-content-center align-items-center">
          {albumPhotos.length > 0 && (
            <>
              <Button
                variant="dark"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="position-absolute start-0 ms-2 rounded-circle opacity-75 fs-5 z-3 d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-chevron-left"></i>
              </Button>

              <Image
                src={albumPhotos[currentPhotoIndex].url}
                className="shadow-lg rounded"
                style={{ maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain' }}
              />

              <Button
                variant="dark"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="position-absolute end-0 me-2 rounded-circle opacity-75 fs-5 z-3 d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-chevron-right"></i>
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AlbumView;
