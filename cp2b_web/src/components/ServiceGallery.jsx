import { useState } from 'react';
import { serviceVisual } from '../data/serviceVisuals';
import { formatFormulas } from '../utils/formatFormulas';
import './ServiceGallery.css';

// Catálogo de serviços técnicos como galeria: a ilustração diz o que o serviço
// é, o título e o TRL confirmam, e a descrição só abre quando pedida. Serviços
// ainda sem ilustração usam um ícone no mesmo quadro, para a grade não mudar
// de forma quando as imagens chegarem.
const shortLab = (acronym) => String(acronym || '').replace(/\s*\(.*?\)\s*/g, '').trim();

// "Catalisadores/Inóculos" não tem onde quebrar e estourava o card de duas
// colunas no celular; o <wbr> depois da barra dá a quebra sem hífen.
const breakAfterSlash = (text) =>
  text.split('/').flatMap((part, i) => (i === 0 ? [part] : ['/', <wbr key={i} />, part]));

const ServiceCard = ({ service, language, labels }) => {
  const [open, setOpen] = useState(false);
  const item = service[language] || service.pt;
  const visual = serviceVisual(service.id);
  const descId = `svc-desc-${service.id}`;
  return (
    <li className={`svc${open ? ' is-open' : ''}`}>
      <div className={`svc__art${visual.image ? '' : ' svc__art--icon'}`} aria-hidden="true">
        {visual.image
          ? <img src={visual.image} alt="" width="640" height="640" loading="lazy" decoding="async" />
          : <i className={`bi ${visual.icon}`} />}
      </div>
      <div className="svc__body">
        <span className="svc__meta">
          {shortLab(service.labAcronym)} <span aria-hidden="true">·</span> {service.trl}
        </span>
        <h3 className="svc__title">{breakAfterSlash(formatFormulas(item.title))}</h3>
        <button
          type="button"
          className="svc__more"
          aria-expanded={open}
          aria-controls={descId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? labels.hideDetails : labels.details}
          <i className={`bi bi-${open ? 'dash' : 'plus'}`} aria-hidden="true" />
        </button>
        {open && <p className="svc__text" id={descId}>{formatFormulas(item.description)}</p>}
      </div>
    </li>
  );
};

const ServiceGallery = ({ services, language, labels }) => (
  <ul className="svc-grid">
    {services.map((s) => <ServiceCard key={s.id} service={s} language={language} labels={labels} />)}
  </ul>
);

export default ServiceGallery;
