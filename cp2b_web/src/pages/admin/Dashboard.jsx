import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CardSkeleton } from '../../components/admin';

const Dashboard = () => {
  const [stats, setStats] = useState({
    newsCount: 0,
    featuredNewsCount: 0,
    publicationsCount: 0,
    publicationsThisYear: 0,
    eventsCount: 0,
    upcomingEvents: 0,
    teamCount: 0,
    partnersCount: 0,
    axesCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          newsRes,
          featuredNewsRes,
          publicationsRes,
          eventsRes,
          upcomingEventsRes,
          teamRes,
          partnersRes,
          axesRes,
          messagesRes
        ] = await Promise.all([
          api.get('/news'),
          api.get('/news/featured'),
          api.get('/publications').catch(() => ({ data: [] })),
          api.get('/events').catch(() => ({ data: [] })),
          api.get('/events/upcoming').catch(() => ({ data: [] })),
          api.get('/team'),
          api.get('/partners').catch(() => ({ data: [] })),
          api.get('/axes'),
          api.get('/contact').catch(() => ({ data: [] })),
        ]);

        const currentYear = new Date().getFullYear();
        const publicationsThisYear = publicationsRes.data.filter(p => p.year === currentYear).length;
        const featuredCount = Object.values(featuredNewsRes.data).filter(n => n !== null).length;

        setStats({
          newsCount: newsRes.data.length,
          featuredNewsCount: featuredCount,
          publicationsCount: publicationsRes.data.length,
          publicationsThisYear,
          eventsCount: eventsRes.data.length,
          upcomingEvents: upcomingEventsRes.data.length,
          teamCount: teamRes.data.length,
          partnersCount: partnersRes.data.length,
          axesCount: axesRes.data.length,
          messagesCount: messagesRes.data.length,
          unreadMessages: messagesRes.data.filter((m) => !m.read).length,
        });
        setApiError(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Notícias',
      count: stats.newsCount,
      icon: 'bi-newspaper',
      link: '/admin/news',
      color: '#004d61',
      subtitle: stats.featuredNewsCount > 0 ? `${stats.featuredNewsCount} em destaque` : null
    },
    {
      title: 'Publicações',
      count: stats.publicationsCount,
      icon: 'bi-journal',
      link: '/admin/publications',
      color: '#1565C0',
      subtitle: stats.publicationsThisYear > 0 ? `${stats.publicationsThisYear} este ano` : null,
      isNew: true
    },
    {
      title: 'Eventos',
      count: stats.eventsCount,
      icon: 'bi-calendar-event',
      link: '/admin/events',
      color: '#6A1B9A',
      subtitle: stats.upcomingEvents > 0 ? `${stats.upcomingEvents} próximos` : null,
      isNew: true
    },
    {
      title: 'Mensagens',
      count: stats.messagesCount,
      icon: 'bi-envelope',
      link: '/admin/messages',
      color: '#E65100',
      subtitle: stats.unreadMessages > 0 ? `${stats.unreadMessages} não lida${stats.unreadMessages > 1 ? 's' : ''}` : null,
      highlight: stats.unreadMessages > 0
    },
    {
      title: 'Membros da Equipe',
      count: stats.teamCount,
      icon: 'bi-person-badge',
      link: '/admin/team',
      color: '#2E7D32'
    },
    {
      title: 'Parceiros',
      count: stats.partnersCount,
      icon: 'bi-building',
      link: '/admin/partners',
      color: '#00897B',
      isNew: true
    },
    {
      title: 'Eixos de Pesquisa',
      count: stats.axesCount,
      icon: 'bi-diagram-3',
      link: '/admin/axes',
      color: '#5E35B1'
    },
  ];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Visão geral do sistema de gerenciamento CP2B</p>
        </div>
      </div>

      {apiError && (
        <Alert variant="warning" className="d-flex align-items-center mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <strong>Backend indisponível</strong> — Não foi possível conectar ao servidor (porta 3001).
            Verifique se os containers <code>backend</code> e <code>db</code> estão rodando.
          </div>
        </Alert>
      )}

      {/* Statistics Grid */}
      {loading ? (
        <Row>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <Col key={i} xl={3} lg={4} md={6} className="mb-4">
              <CardSkeleton count={1} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="g-3 mb-4">
          {cards.map((card) => (
            <Col xl={3} lg={4} md={6} key={card.title}>
              <Card
                as={Link}
                to={card.link}
                className="text-decoration-none h-100 stat-card"
                style={{
                  borderLeft: `4px solid ${card.color}`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <Card.Body className="d-flex align-items-start justify-content-between">
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <i className={`bi ${card.icon} me-2`} style={{ fontSize: '1.5rem', color: card.color }}></i>
                      {card.isNew && <Badge bg="success" className="ms-2">NEW</Badge>}
                    </div>
                    <h2 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '700', color: card.color }}>
                      {card.count}
                    </h2>
                    <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>{card.title}</p>
                    {card.subtitle && (
                      <small className={card.highlight ? 'text-danger fw-semibold' : 'text-muted'}>
                        <i className={`bi ${card.highlight ? 'bi-exclamation-circle' : 'bi-info-circle'} me-1`}></i>
                        {card.subtitle}
                      </small>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-lightning-charge me-2"></i>
                Ações Rápidas
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-2">
                <Col md={4} sm={6}>
                  <Link to="/admin/news/new" className="btn btn-outline-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>Nova Notícia
                  </Link>
                </Col>
                <Col md={4} sm={6}>
                  <Link to="/admin/events/new" className="btn btn-outline-primary w-100">
                    <i className="bi bi-calendar-plus me-2"></i>Novo Evento
                    <Badge bg="success" className="ms-2">NEW</Badge>
                  </Link>
                </Col>
                <Col md={4} sm={6}>
                  <Link to="/admin/publications/new" className="btn btn-outline-primary w-100">
                    <i className="bi bi-journal-plus me-2"></i>Nova Publicação
                    <Badge bg="success" className="ms-2">NEW</Badge>
                  </Link>
                </Col>
                <Col md={4} sm={6}>
                  <Link to="/admin/featured" className="btn btn-outline-primary w-100">
                    <i className="bi bi-star me-2"></i>Gerenciar Destaques
                  </Link>
                </Col>
                <Col md={4} sm={6}>
                  <Link to="/admin/messages" className="btn btn-outline-primary w-100 position-relative">
                    <i className="bi bi-envelope me-2"></i>Ver Mensagens
                    {stats.unreadMessages > 0 && (
                      <Badge bg="danger" pill className="ms-2">{stats.unreadMessages}</Badge>
                    )}
                  </Link>
                </Col>
                <Col md={4} sm={6}>
                  <Link to="/admin/team" className="btn btn-outline-primary w-100">
                    <i className="bi bi-person-plus me-2"></i>Gerenciar Equipe
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Informações
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Sistema</small>
                <p className="mb-0">CP2B CMS</p>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Idiomas</small>
                <p className="mb-0">
                  <Badge bg="primary" className="me-1">PT</Badge>
                  <Badge bg="primary">EN</Badge>
                </p>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Recursos</small>
                <p className="mb-0">
                  <Badge bg="success" className="me-1">Notícias</Badge>
                  <Badge bg="success" className="me-1">Eventos</Badge>
                  <Badge bg="success" className="me-1">Publicações</Badge>
                  <Badge bg="success">Parceiros</Badge>
                </p>
              </div>
              <hr />
              <div className="d-grid">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-2"></i>
                  Voltar ao Site
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
