import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Nav, Badge, Collapse, Offcanvas } from 'react-bootstrap';
import api from '../../services/api';
import { ToastProvider } from '../../components/admin';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminLayout = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const _location = useLocation();

  // Load collapsed state from localStorage
  const loadCollapsedState = () => {
    const saved = localStorage.getItem('adminCategoriesCollapsed');
    return saved ? JSON.parse(saved) : {
      overview: false,
      content: false,
      about: false,
      pages: false,
      forum: false,
      engagement: false
    };
  };

  const [collapsed, setCollapsed] = useState(loadCollapsedState);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('adminCategoriesCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Fetch counts for badges
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [messagesRes, newsRes, participantsRes] = await Promise.all([
          api.get('/contact'),
          api.get('/news'),
          api.get('/participants').catch(() => ({ data: [] })),
        ]);
        setUnreadCount(messagesRes.data.filter((m) => !m.read).length);
        setNewsCount(newsRes.data.length);
        setParticipantCount(participantsRes.data.length);
      } catch {
        // silently fail
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (category) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const categories = [
    {
      id: 'overview',
      label: 'VISÃO GERAL',
      icon: 'bi-grid',
      items: [
        { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' }
      ]
    },
    {
      id: 'content',
      label: 'CONTEÚDO',
      icon: 'bi-file-text',
      items: [
        { path: '/admin/news', label: 'Notícias', icon: 'bi-newspaper', badge: newsCount },
        { path: '/admin/videos', label: 'Vídeos', icon: 'bi-youtube', },
        { path: '/admin/projects', label: 'Projetos', icon: 'bi-folder', },
        { path: '/admin/featured', label: 'Destaques', icon: 'bi-star' },
        { path: '/admin/publications', label: 'Publicações', icon: 'bi-journal', isNew: true },
        { path: '/admin/events', label: 'Eventos', icon: 'bi-calendar-event', isNew: true },
        { path: '/admin/oportunidades', label: 'Oportunidades', icon: 'bi-briefcase', isNew: true }
      ]
    },
    {
      id: 'about',
      label: 'SOBRE & EQUIPE',
      icon: 'bi-people',
      items: [
        { path: '/admin/team', label: 'Membros da Equipe', icon: 'bi-person-badge' },
        { path: '/admin/axes', label: 'Eixos de Pesquisa', icon: 'bi-diagram-3' },
        { path: '/admin/partners', label: 'Parceiros', icon: 'bi-building' }
      ]
    },
    {
      id: 'pages',
      label: 'CONTEÚDO DE PÁGINAS',
      icon: 'bi-file-earmark-text',
      items: [
        { path: '/admin/content/home', label: 'Página Inicial', icon: 'bi-house-door' },
        { path: '/admin/content/about', label: 'Página Sobre', icon: 'bi-info-circle' },
        { path: '/admin/content/governance', label: 'Governança', icon: 'bi-diagram-2' },
        { path: '/admin/content/transparency', label: 'Transparência', icon: 'bi-eye' }
      ]
    },
    {
      id: 'forum',
      label: 'FORUM PAULISTA',
      icon: 'bi-calendar-event',
      items: [
        { path: '/admin/forum',             label: 'Visão Geral',   icon: 'bi-grid-1x2' },
        { path: '/admin/forum/participants', label: 'Participantes', icon: 'bi-people-fill', badge: participantCount },
        { path: '/admin/forum/slots',        label: 'Horários',      icon: 'bi-clock' },
        { path: '/admin/forum/meetups',      label: 'Meet-ups',      icon: 'bi-diagram-2' },
      ]
    },
    {
      id: 'engagement',
      label: 'ENGAJAMENTO',
      icon: 'bi-chat-dots',
      items: [
        { path: '/admin/messages', label: 'Mensagens', icon: 'bi-envelope', badge: unreadCount }
      ]
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="px-3 mb-4">
        <h5 className="mb-0 fw-bold">CP2b Admin</h5>
        <small className="text-muted">Sistema de Gerenciamento</small>
      </div>

      <Nav className="flex-column">
        {categories.map((category) => (
          <div key={category.id} className="mb-3">
            <div
              className="category-header px-3 py-2 d-flex align-items-center justify-content-between"
              onClick={() => toggleCategory(category.id)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <i className={`bi ${category.icon} me-2`}></i>
                {category.label}
              </span>
              <i className={`bi ${collapsed[category.id] ? 'bi-chevron-down' : 'bi-chevron-up'} text-muted`} style={{ fontSize: '0.75rem' }}></i>
            </div>
            <Collapse in={!collapsed[category.id]}>
              <div>
                {category.items.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={NavLink}
                    to={item.path}
                    end={item.path === '/admin'}
                    className="px-3 py-2 d-flex align-items-center"
                    style={{
                      borderRadius: '8px',
                      margin: '2px 8px',
                      paddingLeft: '2.5rem !important',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge > 0 && (
                      <Badge bg="danger" pill className="ms-2">{item.badge}</Badge>
                    )}
                    {item.isNew && (
                      <Badge bg="success" className="ms-2">NEW</Badge>
                    )}
                  </Nav.Link>
                ))}
              </div>
            </Collapse>
          </div>
        ))}
      </Nav>

      <hr className="mx-3 my-4" />

      <Nav className="flex-column">
        <Nav.Link href="/" className="px-3 py-2">
          <i className="bi bi-arrow-left me-2"></i>
          Voltar ao Site
        </Nav.Link>
      </Nav>
    </>
  );

  return (
    <ToastProvider>
      <div className="admin-layout d-flex">
        {/* Desktop Sidebar — fixed 240 px, sticky scroll */}
        <div
          className="admin-sidebar py-4 d-none d-md-flex flex-column flex-shrink-0"
          style={{ width: '240px' }}
        >
          <SidebarContent />
        </div>

        {/* Mobile Menu Button */}
        <div className="d-md-none position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
          <button className="btn btn-primary" onClick={() => setShowMobileMenu(true)}>
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Mobile Offcanvas Menu */}
        <Offcanvas
          show={showMobileMenu}
          onHide={() => setShowMobileMenu(false)}
          placement="start"
          className="admin-sidebar"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <h5 className="mb-0 fw-bold">CP2b Admin</h5>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <SidebarContent />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content Area — fills remaining width */}
        <div className="admin-content bg-light py-4 flex-grow-1">
          <div className="px-3 px-lg-4">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
