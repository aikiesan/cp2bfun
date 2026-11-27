import { Container } from 'react-bootstrap';
import { pilarBand } from '../data/content';
import PilarMap from './PilarMap';
import './PilarBand.css';

// Chamada para o PILAR-2b, na home: texto à esquerda, o mapa do
// potencial de biogás à direita, direto sobre o fundo da página (como no
// vídeo institucional v3). <a> cru, não <Link>: o /pilar2b é outra
// aplicação, atrás do proxy do Apache (ver Header.jsx).
const PilarBand = ({ language, className = '' }) => {
  const t = pilarBand[language] || pilarBand.pt;
  const base = `/pilar2b/${t.locale}`;

  return (
    <section className={`section pilar-band ${className}`} aria-labelledby="pilar-band-title">
      <Container>
        <div className="pilar-band__layout">
          <div className="pilar-band__intro">
            <h2 id="pilar-band-title" className="pilar-band__title">{t.title}</h2>
            <p className="pilar-band__lead">{t.lead}</p>
            <a href={base} className="btn-hero pilar-band__cta">
              {t.cta} <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </a>
            <ul className="pilar-band__links">
              {t.links.map((link) => (
                <li key={link.path}>
                  <a href={`${base}${link.path}`} className="pilar-band__link" title={link.hint}>
                    {link.label} <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <PilarMap language={language} />
        </div>
      </Container>
    </section>
  );
};

export default PilarBand;
