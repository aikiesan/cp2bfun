import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Breadcrumb = () => {
  const { language } = useLanguage();
  const location = useLocation();

  // Route to label mapping
  const routeLabels = {
    pt: {
      '/': 'Início',
      '/sobre': 'Sobre',
      '/pesquisa': 'Pesquisa',
      '/equipe': 'Equipe',
      '/noticias': 'Notícias',
      '/contato': 'Contato',
      '/oportunidades': 'Oportunidades',
      '/publicacoes': 'Publicações',
      '/projetos': 'Projetos',
      '/na-midia': 'Na Mídia',
      '/outros': 'Outros',
      '/faq': 'FAQ'
    },
    en: {
      '/': 'Home',
      '/sobre': 'About',
      '/pesquisa': 'Research',
      '/equipe': 'Team',
      '/noticias': 'News',
      '/contato': 'Contact',
      '/oportunidades': 'Opportunities',
      '/publicacoes': 'Publications',
      '/projetos': 'Projects',
      '/na-midia': 'In the Media',
      '/outros': 'Others',
      '/faq': 'FAQ'
    }
  }[language];

  // Don't show breadcrumb on homepage
  if (location.pathname === '/') return null;

  // Build breadcrumb items
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { path: '/', label: routeLabels['/'] }
  ];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({ path: currentPath, label });
  });

  return (
    <nav
      aria-label="breadcrumb"
      className="py-3"
      style={{ background: 'var(--cp2b-bg-warm)', borderBottom: '1px solid var(--cp2b-border-light)' }}
    >
      <Container>
        <ol
          className="breadcrumb mb-0 d-flex align-items-center gap-2"
          style={{ fontSize: '0.85rem' }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li
                key={item.path}
                className={`breadcrumb-item d-flex align-items-center gap-2 ${isLast ? 'active' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {index > 0 && (
                  <FaChevronRight
                    size={10}
                    className="text-muted"
                    style={{ marginRight: '0.5rem' }}
                  />
                )}
                {isLast ? (
                  <span style={{ color: 'var(--cp2b-petrol)', fontWeight: 500 }}>
                    {index === 0 && <FaHome size={12} className="me-1" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-decoration-none text-muted d-flex align-items-center"
                    style={{ transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--cp2b-petrol)'}
                    onMouseLeave={(e) => e.target.style.color = ''}
                  >
                    {index === 0 && <FaHome size={12} className="me-1" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
};

export default Breadcrumb;
