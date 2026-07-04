import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Spinner, Button, Collapse, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import api from '../services/api';

const Events = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.events?.[language] || pageSeo.events?.pt || {};
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      const allEvents = response.data;

      const now = new Date();
      const upcoming = allEvents.filter((event) => {
        const endDate = new Date(event.end_date);
        return endDate >= now && event.status !== 'cancelled';
      });
      const past = allEvents.filter((event) => {
        const endDate = new Date(event.end_date);
        return endDate < now || event.status === 'completed';
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    pt: {
      eyebrow: 'Agenda',
      title: 'Eventos',
      subtitle: 'Fóruns, workshops e encontros do CP2b sobre biogás, bioprodutos e transição energética.',
      upcoming: 'Próximos Eventos',
      past: 'Eventos Anteriores',
      none: 'Nenhum evento próximo agendado no momento.',
      register: 'Inscrever-se',
      details: 'Ver detalhes',
      hide: 'Ocultar',
      show: 'Mostrar',
    },
    en: {
      eyebrow: 'Agenda',
      title: 'Events',
      subtitle: 'CP2b forums, workshops and meetings on biogas, bioproducts and the energy transition.',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      none: 'No upcoming events scheduled at the moment.',
      register: 'Register',
      details: 'View details',
      hide: 'Hide',
      show: 'Show',
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

  // schema.org Event structured data for upcoming events
  const eventsJsonLd = upcomingEvents.length > 0
    ? {
        '@context': 'https://schema.org',
        '@graph': upcomingEvents.map((event) => ({
          '@type': 'Event',
          name: event.title_pt,
          startDate: event.start_date,
          endDate: event.end_date,
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
            name: 'CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos',
            url: 'https://cp2b.unicamp.br',
          },
        })),
      }
    : null;

  const renderEventCard = (event, index) => {
    const title = language === 'pt' ? event.title_pt : (event.title_en || event.title_pt);
    const description = language === 'pt' ? event.description_pt : (event.description_en || event.description_pt);
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';

    return (
      <Col key={event.id} md={6} lg={4} className="mb-4">
        <motion.article
          className="event-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
        >
          <div className="event-media">
            {event.image && <img src={event.image} alt={title} loading="lazy" />}
            <div className="event-date-badge">
              <span className="day">{startDate.toLocaleDateString(locale, { day: '2-digit' })}</span>
              <span className="month">{startDate.toLocaleDateString(locale, { month: 'short' })}</span>
            </div>
          </div>
          <div className="event-body">
            <div>
              <Badge bg="info" className="me-2">{typeLabels[event.event_type]}</Badge>
              <Badge bg="secondary">{locationTypeLabels[event.location_type]}</Badge>
            </div>
            <h3 className="event-title">
              {event.slug ? (
                <Link to={`/eventos/${event.slug}`} className="text-decoration-none" style={{ color: 'inherit' }}>
                  {title}
                </Link>
              ) : title}
            </h3>
            {description && <p className="text-muted small mb-2">{description}</p>}

            <div className="mt-auto d-flex flex-column gap-1">
              <span className="event-info">
                <i className="bi bi-calendar"></i>
                <span>
                  {startDate.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
                  {startDate.toDateString() !== endDate.toDateString() && (
                    <> — {endDate.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}</>
                  )}
                </span>
              </span>

              {event.location && (
                <span className="event-info">
                  <i className="bi bi-geo-alt"></i>
                  <span>{event.location}</span>
                </span>
              )}

              {event.organizer && (
                <span className="event-info">
                  <i className="bi bi-person"></i>
                  <span>{event.organizer}</span>
                </span>
              )}

              {event.slug ? (
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  to={`/eventos/${event.slug}`}
                  className="mt-3 w-100"
                >
                  {labels.details}
                </Button>
              ) : event.registration_url && (
                <Button
                  variant="primary"
                  size="sm"
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-100"
                >
                  {labels.register}
                </Button>
              )}
            </div>
          </div>
        </motion.article>
      </Col>
    );
  };

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={pathname}
        language={language}
        jsonLd={eventsJsonLd}
      />

      <div className="page-hero">
        <Container>
          <span className="eyebrow">{labels.eyebrow}</span>
          <h1>{labels.title}</h1>
          <p className="page-hero-sub">{labels.subtitle}</p>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <section className="mb-5">
              <h2 className="h3 fw-bold mb-4">{labels.upcoming}</h2>
              {upcomingEvents.length > 0 ? (
                <Row>{upcomingEvents.map(renderEventCard)}</Row>
              ) : (
                <Card className="bg-light border-0">
                  <Card.Body className="text-center text-muted py-5">{labels.none}</Card.Body>
                </Card>
              )}
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h3 fw-bold mb-0">{labels.past}</h2>
                  <Button variant="outline-secondary" size="sm" onClick={() => setShowPast(!showPast)}>
                    {showPast ? labels.hide : labels.show} ({pastEvents.length})
                  </Button>
                </div>
                <Collapse in={showPast}>
                  <Row>{pastEvents.map(renderEventCard)}</Row>
                </Collapse>
              </section>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Events;
