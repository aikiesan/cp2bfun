import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // Map path segments to readable labels
  const labelMap = {
    admin: 'Admin',
    news: 'Notícias',
    featured: 'Destaques',
    publications: 'Publicações',
    events: 'Eventos',
    team: 'Equipe',
    axes: 'Eixos',
    content: 'Conteúdo',
    partners: 'Parceiros',
    messages: 'Mensagens',
    new: 'Novo',
    edit: 'Editar'
  };

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = labelMap[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    return {
      path,
      label,
      isLast
    };
  });

  // Don't show breadcrumbs if only on /admin
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/admin' }}>
        <i className="bi bi-house-door me-1"></i>
        Dashboard
      </Breadcrumb.Item>
      {breadcrumbItems.slice(1).map((item, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={item.isLast ? 'span' : Link}
          linkProps={item.isLast ? {} : { to: item.path }}
          active={item.isLast}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
