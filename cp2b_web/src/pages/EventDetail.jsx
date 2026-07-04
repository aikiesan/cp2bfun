import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Spinner, Button } from 'react-bootstrap';
import { useParams, useLocation, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchEventBySlug, fetchGallery } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import NotFound from './NotFound';

const EventDetail = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [event, setEvent] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      back: 'Eventos',
      register: 'Inscrever-se',
      about: 'Sobre o evento',
      schedule: 'Programação',
      gallery: 'Galeria do evento',
      date: 'Data',
      location: 'Local',
      organizer: 'Organização',
      photos: 'fotos',
      photo: 'foto',
      statusLabels: { upcoming: 'Em breve', ongoing: 'Acontecendo agora', completed: 'Realizado', cancelled: 'Cancelado' },
    },
    en: {
      back: 'Events',
      register: 'Register',
      about: 'About the event',
      schedule: 'Schedule',
      gallery: 'Event gallery',
      date: 'Date',
      location: 'Location',
      organizer: 'Organizer',
      photos: 'photos',
      photo: 'photo',
      statusLabels: { upcoming: 'Upcoming', ongoing: 'Happening now', completed: 'Completed', cancelled: 'Cancelled' },
    },
  }[language];

  const typeLabels = {
    workshop: 'Workshop',
    forum: language === 'pt' ? 'Fórum' : 'Forum',
    conference: language === 'pt' ? 'Conferência' : 'Conference',
    meeting: language === 'pt' ? 'Reunião' : 'Meeting',
    webinar: 'Webinar',
    course: language === 'pt' ? 'Curso' : 'Course',
  };

  const locationTypeLabels = {
    'in-person': language === 'pt' ? 'Presencial' : 'In Person',
    'online': 'Online',
    'hybrid': language === 'pt' ? 'Híbrido' : 'Hybrid',
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await fetchEventBySlug(slug);
      if (!mounted) return;
      setEvent(data);

      const albumIds = Array.isArray(data?.gallery_album_ids) ? data.gallery_album_ids : [];
      if (albumIds.length > 0) {
        const photos = await fetchGallery();
        if (!mounted) return;
        const counts = photos.reduce((acc, p) => {
          if (!p.is_cover && p.album_id) acc[p.album_id] = (acc[p.album_id] || 0) + 1;
          return acc;
        }, {});
        setAlbums(
          photos
            .filter((p) => p.is_cover && albumIds.includes(p.album_id))
            .map((a) => ({ ...a, photoCount: counts[a.album_id] || 0 }))
        );
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  if (!event) {
    return <NotFound />;
  }

  const title = language === 'pt' ? event.title_pt : (event.title_en || event.title_pt);
  const description = language === 'pt' ? event.description_pt : (event.description_en || event.description_pt);
  const content = language === 'pt' ? event.content_pt : (event.content_en || event.content_pt);
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date || event.start_date);
  const multiDay = startDate.toDateString() !== endDate.toDateString();
  const isUpcoming = endDate >= new Date() && event.status !== 'cancelled';
  const schedule = Array.isArray(event.schedule) ? event.schedule : [];

  const formatDate = (d) =>
    d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title_pt,
    startDate: event.start_date,
    endDate: event.end_date || event.start_date,
    eventStatus: event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: {
      'in-person': 'https://schema.org/OfflineEventAttendanceMode',
      'online': 'https://schema.org/OnlineEventAttendanceMode',
      'hybrid': 'https://schema.org/MixedEventAttendanceMode',
    }[event.location_type] || 'https://schema.org/OfflineEventAttendanceMode',
    ...(event.location ? { location: { '@type': 'Place', name: event.location } } : {}),
    ...(event.description_pt ? { description: event.description_pt } : {}),
    ...(event.image ? { image: event.image } : {}),
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
      url: 'https://cp2b.unicamp.br',
    },
  };

  return (
    <>
      <SeoHead
        title={title}
        description={description || title}
        path={pathname}
        image={event.image}
        type="article"
        language={language}
        jsonLd={jsonLd}
      />

      <div className="page-hero">
        <Container>
          <nav aria-label="breadcrumb">
            <Link to="/eventos" className="eyebrow eyebrow--light text-decoration-none">
              ← {labels.back}
            </Link>
          </nav>
          <div className="d-flex flex-wrap gap-2 mt-3 mb-2">
            <Badge bg="info">{typeLabels[event.event_type]}</Badge>
            <Badge bg="secondary">{locationTypeLabels[event.location_type]}</Badge>
            {event.status && (
              <Badge bg={event.status === 'cancelled' ? 'danger' : 'success'}>
                {labels.statusLabels[event.status]}
              </Badge>
            )}
          </div>
          <h1>{title}</h1>
          {description && <p className="page-hero-sub">{description}</p>}
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-5">
          <Col lg={8}>
            {event.image && (
              <img
                src={event.image}
                alt={title}
                className="img-fluid w-100 mb-4"
                style={{ borderRadius: 'var(--cp2b-radius)', maxHeight: '480px', objectFit: 'cover' }}
              />
            )}

            {content && (
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">{labels.about}</h2>
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                />
              </section>
            )}

            {schedule.length > 0 && (
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-4">{labels.schedule}</h2>
                <div className="d-flex flex-column gap-3">
                  {schedule.map((item, i) => (
                    <div key={i} className="d-flex gap-3 p-3 bg-white rounded-4 shadow-sm">
                      <div
                        className="fw-bold flex-shrink-0 text-center"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp2b-petrol)', minWidth: '5rem' }}
                      >
                        {item.time}
                      </div>
                      <div>
                        <div className="fw-bold">
                          {language === 'pt' ? item.title_pt : (item.title_en || item.title_pt)}
                        </div>
                        {item.speaker && <div className="text-muted small">{item.speaker}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {albums.length > 0 && (
              <section>
                <h2 className="h4 fw-bold mb-4">{labels.gallery}</h2>
                <div className="album-grid">
                  {albums.map((album) => (
                    <Link key={album.id} to={`/gallery/${album.album_id}`} className="album-card">
                      <img src={album.url} alt={album.title} loading="lazy" />
                      <span className="album-overlay">
                        <span className="album-title">{album.title}</span>
                        <span className="album-meta">
                          {album.photoCount > 0 && (
                            <span>
                              <i className="bi bi-images me-1"></i>
                              {album.photoCount} {album.photoCount === 1 ? labels.photo : labels.photos}
                            </span>
                          )}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </Col>

          <Col lg={4}>
            <div className="bg-white rounded-4 shadow-sm p-4 position-sticky" style={{ top: '110px' }}>
              <dl className="mb-0">
                <dt className="card-meta mb-1">{labels.date}</dt>
                <dd className="fw-semibold mb-3">
                  {formatDate(startDate)}
                  {multiDay && <> — {formatDate(endDate)}</>}
                </dd>

                {event.location && (
                  <>
                    <dt className="card-meta mb-1">{labels.location}</dt>
                    <dd className="fw-semibold mb-3">{event.location}</dd>
                  </>
                )}

                {event.organizer && (
                  <>
                    <dt className="card-meta mb-1">{labels.organizer}</dt>
                    <dd className="fw-semibold mb-3">{event.organizer}</dd>
                  </>
                )}
              </dl>

              {isUpcoming && event.registration_url && (
                <Button
                  variant="primary"
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-100 mt-2"
                >
                  {labels.register}
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EventDetail;
