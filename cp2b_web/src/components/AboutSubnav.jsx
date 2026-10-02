import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './AboutSubnav.css';

// Navegação entre as páginas da seção Sobre, presente em todas elas (Visão
// Geral, Governança, Indicadores, Transparência e Parceiros). Controle
// segmentado que divide a largura: no celular vira duas linhas (3 + 2), sem
// rolagem lateral.
const ITEMS = [
  { to: '/sobre', icon: 'bi-info-circle', pt: 'Visão Geral', en: 'Overview' },
  { to: '/sobre/governanca', icon: 'bi-diagram-3', pt: 'Governança', en: 'Governance' },
  { to: '/sobre/indicadores', icon: 'bi-speedometer2', pt: 'Indicadores', en: 'Indicators' },
  { to: '/sobre/transparencia', icon: 'bi-file-earmark-text', pt: 'Transparência', en: 'Transparency' },
  { to: '/sobre/parceiros', icon: 'bi-building', pt: 'Parceiros', en: 'Partners' },
];

const AboutSubnav = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const current = pathname.replace(/\/+$/, '') || '/';
  return (
    <nav className="about-subnav" aria-label={language === 'en' ? 'About CP2b' : 'Sobre o CP2b'}>
      {ITEMS.map((item) => {
        const active = current === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`about-subnav__link${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <span>{item[language] || item.pt}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default AboutSubnav;
