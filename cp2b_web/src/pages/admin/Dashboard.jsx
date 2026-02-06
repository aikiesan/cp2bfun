import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    newsCount: 0,
    teamCount: 0,
    axesCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, teamRes, axesRes, messagesRes] = await Promise.all([
          api.get('/news'),
          api.get('/team'),
          api.get('/axes'),
          api.get('/contact').catch(() => ({ data: [] })),
        ]);
        setStats({
          newsCount: newsRes.data.length,
          teamCount: teamRes.data.length,
          axesCount: axesRes.data.length,
          messagesCount: messagesRes.data.length,
          unreadMessages: messagesRes.data.filter((m) => !m.read).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Noticias', count: stats.newsCount, icon: 'bi-newspaper', link: '/admin/news', color: '#004d61' },
    { title: 'Membros da Equipe', count: stats.teamCount, icon: 'bi-people', link: '/admin/team', color: '#2E7D32' },
    { title: 'Eixos de Pesquisa', count: stats.axesCount, icon: 'bi-diagram-3', link: '/admin/axes', color: '#1565C0' },
    { title: 'Mensagens', count: stats.messagesCount, icon: 'bi-envelope', link: '/admin/messages', color: '#E65100', subtitle: stats.unreadMessages > 0 ? `${stats.unreadMessages} nao lida${stats.unreadMessages > 1 ? 's' : ''}` : null },
  ];

  return (
    <Container>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        {cards.map((card) => (
          <Col md={4} key={card.title} className="mb-4">
            <Card as={Link} to={card.link} className="text-decoration-none h-100" style={{ borderLeft: `4px solid ${card.color}` }}>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">
                  <i className={`bi ${card.icon}`} style={{ fontSize: '2.5rem', color: card.color }}></i>
                </div>
                <div>
                  <h3 className="mb-0">{loading ? '...' : card.count}</h3>
                  <p className="text-muted mb-0">{card.title}</p>
                  {card.subtitle && <small className="text-danger">{card.subtitle}</small>}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Acesso Rapido</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/admin/news/new" className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle me-2"></i>Nova Noticia
                </Link>
                <Link to="/admin/team" className="btn btn-outline-primary">
                  <i className="bi bi-person-plus me-2"></i>Gerenciar Equipe
                </Link>
                <Link to="/admin/content" className="btn btn-outline-primary">
                  <i className="bi bi-pencil-square me-2"></i>Editar Conteudo
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Informacoes</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-2">
                <i className="bi bi-info-circle me-2"></i>
                Sistema de gerenciamento de conteudo do CP2B
              </p>
              <p className="text-muted mb-2">
                <i className="bi bi-globe me-2"></i>
                Conteudo bilingue (PT/EN)
              </p>
              <p className="text-muted mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Acesso interno - sem autenticacao
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
