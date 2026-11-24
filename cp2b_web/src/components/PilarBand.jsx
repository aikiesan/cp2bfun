import { Container } from 'react-bootstrap';
import { pilarBand } from '../data/content';
import './PilarBand.css';

// Chamada para o PILAR-2b, na home e em /eixos. <a> cru, não <Link>: o
// /pilar2b é outra aplicação, atrás do proxy do Apache (ver Header.jsx).
const PilarBand = ({ language, className = '' }) => {
  const t = pilarBand[language] || pilarBand.pt;
  const base = `/pilar2b/${t.locale}`;

  return (
    <section className={`section pilar-band ${className}`} aria-labelledby="pilar-band-title">
      <Container>
        <div className="pilar-band__panel">
          <div className="pilar-band__intro">
            <span className="eyebrow eyebrow--light">{t.eyebrow}</span>
            <h2 id="pilar-band-title" className="pilar-band__title">{t.title}</h2>
            <p className="pilar-band__lead">{t.lead}</p>
            <a href={base} className="btn-hero btn-hero--primary">
              {t.cta} <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
          <ul className="pilar-band__links">
            {t.links.map((link) => (
              <li key={link.path}>
                <a href={`${base}${link.path}`} className="pilar-band__link">
                  <span className="pilar-band__link-label">{link.label}</span>
                  <span className="pilar-band__link-hint">{link.hint}</span>
                  <span className="pilar-band__link-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default PilarBand;
