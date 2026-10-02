import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // Rótulo de cada segmento de caminho.
  //
  // Um segmento que falte aqui aparece cru na trilha — era o caso de
  // "newsletter", "page-status" e "settings", que mostravam o slug da URL
  // enquanto as vizinhas mostravam "Mensagens" e "Equipe". Ao criar uma rota
  // nova em AdminApp.jsx, acrescente o segmento dela nesta tabela.
  //
  // Segmentos dinâmicos (o :slug de uma notícia, o :id de um vídeo) não entram:
  // para esses, o próprio slug é a informação útil na trilha.
  const labelMap = {
    admin: 'Admin',
    news: 'Notícias',
    featured: 'Destaques',
    publications: 'Publicações',
    microscopio: 'Microscópio',
    oportunidades: 'Oportunidades',
    videos: 'Vídeos',
    projects: 'Entrevistas',
    team: 'Equipe',
    axes: 'Eixos',
    content: 'Conteúdo',
    partners: 'Parceiros',
    messages: 'Mensagens',
    new: 'Novo',
    edit: 'Editar',
    forum: 'Forum Paulista',
    participants: 'Participantes',
    slots: 'Horários',
    meetups: 'Meet-ups',
    newsletter: 'Newsletter',
    gallery: 'Galeria',
    upload: 'Enviar Fotos',
    events: 'Eventos',
    'press-kit': 'Identidade Visual',
    podcast: 'Podcast',
    boletins: 'Boletins',
    'page-status': 'Status das Páginas',
    settings: 'Configurações do Site',
    ajuda: 'Guia de Uso',
    // Sub-páginas de "Conteúdo de Páginas".
    home: 'Página Inicial',
    about: 'Página Sobre',
    governance: 'Governança',
    transparency: 'Transparência',
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
    <Breadcrumb className="mb-3 flex-wrap">
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
