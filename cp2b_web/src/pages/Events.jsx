import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Collapse } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Events = () => {
  const { language } = useLanguage();
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
      // Fetch all events
      const response = await api.get('/events');
      const allEvents = response.data;

      // Separate into upcoming and past
      const now = new Date();
      const upcoming = allEvents.filter(event => {
        const endDate = new Date(event.end_date);
        return endDate >= now && event.status !== 'cancelled';
      });
      const past = allEvents.filter(event => {
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

  const typeLabels = {
    workshop: language === 'pt' ? 'Workshop' : 'Workshop',
    forum: language === 'pt' ? 'Fórum' : 'Forum',
    conference: language === 'pt' ? 'Conferência' : 'Conference',
    meeting: language === 'pt' ? 'Reunião' : 'Meeting',
    webinar: language === 'pt' ? 'Webinar' : 'Webinar',
    course: language === 'pt' ? 'Curso' : 'Course'
  };

  const locationTypeLabels = {
    'in-person': language === 'pt' ? 'Presencial' : 'In Person',
    'online': language === 'pt' ? 'Online' : 'Online',
    'hybrid': language === 'pt' ? 'Híbrido' : 'Hybrid'
  };

  const renderEventCard = (event) => {
    const title = language === 'pt' ? event.title_pt : (event.title_en || event.title_pt);
    const description = language === 'pt' ? event.description_pt : (event.description_en || event.description_pt);
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    return (
      <Col key={event.id} md={6} lg={4} className="mb-4">
        <Card className="h-100 shadow-sm">
          {event.image_url && (
            <Card.Img variant="top" src={event.image_url} style={{ height: '200px', objectFit: 'cover' }} />
          )}
          <Card.Body className="d-flex flex-column">
            <div className="mb-2">
              <Badge bg="info" className="me-2">{typeLabels[event.event_type]}</Badge>
              <Badge bg="secondary">{locationTypeLabels[event.location_type]}</Badge>
            </div>
            <Card.Title>{title}</Card.Title>
            {description && <Card.Text>{description}</Card.Text>}

            <div className="mt-auto">
              <div className="text-muted small mb-2">
                <i className="bi bi-calendar me-2"></i>
                {startDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
                {startDate.toDateString() !== endDate.toDateString() && (
                  <> - {endDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</>
                )}
              </div>

              {event.location && (
                <div className="text-muted small mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  {event.location}
                </div>
              )}

              {event.organizer && (
                <div className="text-muted small mb-2">
                  <i className="bi bi-person me-2"></i>
                  {event.organizer}
                </div>
              )}

              {event.registration_url && (
                <Button
                  variant="primary"
                  size="sm"
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-100"
                >
                  {language === 'pt' ? 'Inscrever-se' : 'Register'}
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{language === 'pt' ? 'Eventos' : 'Events'}</h1>

      {/* Upcoming Events */}
      <section className="mb-5">
        <h2 className="mb-3">{language === 'pt' ? 'Próximos Eventos' : 'Upcoming Events'}</h2>
        {upcomingEvents.length > 0 ? (
          <Row>
            {upcomingEvents.map(renderEventCard)}
          </Row>
        ) : (
          <Card className="bg-light">
            <Card.Body className="text-center text-muted py-5">
              {language === 'pt'
                ? 'Nenhum evento próximo agendado no momento.'
                : 'No upcoming events scheduled at the moment.'}
            </Card.Body>
          </Card>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>{language === 'pt' ? 'Eventos Anteriores' : 'Past Events'}</h2>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowPast(!showPast)}
            >
              {showPast
                ? (language === 'pt' ? 'Ocultar' : 'Hide')
                : (language === 'pt' ? 'Mostrar' : 'Show')
              } ({pastEvents.length})
            </Button>
          </div>
          <Collapse in={showPast}>
            <Row>
              {pastEvents.map(renderEventCard)}
            </Row>
          </Collapse>
        </section>
      )}
    </Container>
  );
};

export default Events;
