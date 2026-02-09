import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav, Badge } from 'react-bootstrap';
import api from '../../services/api';

const AdminLayout = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await api.get('/contact');
        setUnreadCount(response.data.filter((m) => !m.read).length);
      } catch {
        // silently fail
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-grid' },
    { path: '/admin/news', label: 'Noticias', icon: 'bi-newspaper' },
    { path: '/admin/team', label: 'Equipe', icon: 'bi-people' },
    { path: '/admin/content', label: 'Conteudo', icon: 'bi-file-text' },
    { path: '/admin/axes', label: 'Eixos', icon: 'bi-diagram-3' },
    { path: '/admin/messages', label: 'Mensagens', icon: 'bi-envelope', badge: unreadCount },
  ];

  return (
    <Container fluid className="admin-layout">
      <Row>
        <Col md={2} className="admin-sidebar py-4" style={{ minHeight: '100vh' }}>
          <div className="px-3 mb-4">
            <h5 className="mb-0">CP2B Admin</h5>
            <small>Sistema de Gerenciamento</small>
          </div>
          <Nav className="flex-column">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={NavLink}
                to={item.path}
                end={item.path === '/admin'}
                className="px-3 py-2"
                style={{ borderRadius: '8px', margin: '2px 8px' }}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
                {item.badge > 0 && (
                  <Badge bg="danger" pill className="ms-2">{item.badge}</Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>
          <hr className="mx-3 my-4" />
          <Nav className="flex-column">
            <Nav.Link href="/" className="px-3 py-2">
              <i className="bi bi-arrow-left me-2"></i>
              Voltar ao Site
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="admin-content bg-light py-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
