import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Spinner, Modal, Image } from 'react-bootstrap';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchGallery } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import Metaninho from '../components/Metaninho';

const AlbumView = () => {
  const { albumId } = useParams();
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [albumInfo, setAlbumInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: { back: 'Galeria', notFound: 'Álbum não encontrado.', photos: 'fotos', photo: 'foto' },
    en: { back: 'Gallery', notFound: 'Album not found.', photos: 'photos', photo: 'photo' },
  }[language];

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setShowLightbox(true);
  };
  const nextPhoto = useCallback(
    () => setCurrentPhotoIndex((prev) => (prev + 1) % albumPhotos.length),
    [albumPhotos.length]
  );
  const prevPhoto = useCallback(
    () => setCurrentPhotoIndex((prev) => (prev === 0 ? albumPhotos.length - 1 : prev - 1)),
    [albumPhotos.length]
  );

  // Keyboard navigation inside the lightbox
  useEffect(() => {
    if (!showLightbox) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLightbox, nextPhoto, prevPhoto]);

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      const photosInThisAlbum = data.filter((photo) => photo.album_id === albumId);
      // Fall back to the oldest photo as a stand-in header if the cover row
      // was ever deleted individually — keeps the album viewable instead of
      // showing "not found" (see matching fallback in Gallery.jsx).
      const cover = photosInThisAlbum.find((photo) => photo.is_cover) || photosInThisAlbum[0];
      const internals = photosInThisAlbum.filter((photo) => photo.id !== cover?.id);
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
    return (
      <Container className="py-5 text-center text-muted">
        <Metaninho pose="surpreso" size={130} className="d-block mx-auto mb-3" />
        {labels.notFound}
      </Container>
    );
  }

  const currentPhoto = albumPhotos[currentPhotoIndex];

  const albumDate = albumInfo.date
    ? new Date(albumInfo.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
        timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <>
      <SeoHead
        title={albumInfo.title}
        description={`${albumInfo.title}${albumDate ? ` — ${albumDate}` : ''} · CP2b`}
        path={pathname}
        image={albumInfo.url}
        language={language}
      />

      <div className="page-hero">
        <Container>
          <nav aria-label="breadcrumb">
            <Link to="/galeria" className="eyebrow eyebrow--light text-decoration-none">
              ← {labels.back}
            </Link>
          </nav>
          <h1>{albumInfo.title}</h1>
          <p className="page-hero-sub">
            {albumDate && (
              <span className="me-4">
                <i className="bi bi-calendar-event me-2"></i>{albumDate}
              </span>
            )}
            <span>
              <i className="bi bi-images me-2"></i>
              {albumPhotos.length} {albumPhotos.length === 1 ? labels.photo : labels.photos}
            </span>
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <div className="photo-masonry">
          {albumPhotos.map((photo, index) => (
            <button
              type="button"
              key={photo.id}
              className="photo-item"
              onClick={() => openLightbox(index)}
              aria-label={`${photo.caption || albumInfo.title} — ${index + 1}/${albumPhotos.length}`}
            >
              <span className="photo-frame">
                <img src={photo.url} alt={photo.caption || `${albumInfo.title} ${index + 1}`} loading="lazy" />
              </span>
              {photo.caption && <span className="photo-caption">{photo.caption}</span>}
            </button>
          ))}
        </div>

        <Modal
          show={showLightbox}
          onHide={() => setShowLightbox(false)}
          size="xl"
          centered
          contentClassName="bg-transparent border-0"
        >
          <Modal.Header closeButton closeVariant="white" className="border-0 pb-0 z-3">
            <span className="lightbox-counter">
              {currentPhotoIndex + 1} / {albumPhotos.length}
            </span>
          </Modal.Header>
          <Modal.Body className="text-center position-relative p-0 d-flex justify-content-center align-items-center">
            {albumPhotos.length > 0 && (
              <>
                <Button
                  variant="dark"
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="position-absolute start-0 ms-2 rounded-circle opacity-75 fs-5 z-3 d-flex justify-content-center align-items-center"
                  style={{ width: '40px', height: '40px' }}
                  aria-label="Previous photo"
                >
                  <i className="bi bi-chevron-left"></i>
                </Button>

                <figure className="m-0">
                  <Image
                    src={currentPhoto.url}
                    alt={currentPhoto.caption || albumInfo.title}
                    className="shadow-lg rounded"
                    style={{ maxHeight: currentPhoto.caption ? '78vh' : '85vh', maxWidth: '100%', objectFit: 'contain' }}
                  />
                  {currentPhoto.caption && (
                    <figcaption className="lightbox-caption">{currentPhoto.caption}</figcaption>
                  )}
                </figure>

                <Button
                  variant="dark"
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="position-absolute end-0 me-2 rounded-circle opacity-75 fs-5 z-3 d-flex justify-content-center align-items-center"
                  style={{ width: '40px', height: '40px' }}
                  aria-label="Next photo"
                >
                  <i className="bi bi-chevron-right"></i>
                </Button>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AlbumView;
