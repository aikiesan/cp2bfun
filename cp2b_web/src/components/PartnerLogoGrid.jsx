import { useEffect, useState } from 'react';
import api from '../services/api';
import { partnerLogos } from '../data/partnerLogos';

// Grade de logos dos parceiros na home: em cinza, ganham cor ao passar o
// mouse (ou ao receber foco pelo teclado).
//
// A lista vem do painel (GET /api/partners, só os ativos), a mesma de
// /sobre/parceiros. Não usa /api/partners/grouped de propósito: as
// estatísticas de acesso (scripts/stats-daily.sh) contam essa chamada como
// visita a /sobre/parceiros. A FAPESP, que financia o centro e não está na
// lista de parceiros, abre a grade.

const CATEGORY_ORDER = ['host', 'public', 'research', 'companies'];

const FUNDER = {
  id: 'fapesp',
  name_pt: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP)',
  name_en: 'São Paulo Research Foundation (FAPESP)',
  logo: '/assets/fapesp_1-e1724070166377-500x200.jpg',
  website: 'https://fapesp.br',
};

// Sem a API (ou no teste), o mapa estático de logos: um item por arquivo,
// com o nome por extenso, que é a primeira chave de cada logo.
const staticPartners = () => {
  const seen = new Set();
  return Object.entries(partnerLogos)
    .filter(([, logo]) => !seen.has(logo) && seen.add(logo))
    .map(([name, logo]) => ({ id: logo, name_pt: name, name_en: name, logo, website: null }));
};

const sortPartners = (rows) =>
  [...rows].sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb) || (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

const PartnerLogoGrid = ({ language }) => {
  const [partners, setPartners] = useState(staticPartners);

  useEffect(() => {
    let alive = true;
    api
      .get('/partners')
      .then(({ data }) => {
        const rows = Array.isArray(data) ? data.filter((p) => p && p.logo && p.name_pt) : [];
        if (alive && rows.length) setPartners(sortPartners(rows));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = [FUNDER, ...partners];

  return (
    <div className="partner-grid-wrap">
      <ul className="partner-grid">
        {items.map((p) => {
          const name = (language === 'en' && p.name_en) || p.name_pt;
          const logo = <img src={p.logo} alt={name} loading="lazy" decoding="async" />;
          return (
            <li key={p.id} className="partner-grid__cell">
              {p.website ? (
                <a href={p.website} target="_blank" rel="noopener noreferrer" title={name} className="partner-grid__item">
                  {logo}
                </a>
              ) : (
                <span title={name} className="partner-grid__item">{logo}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PartnerLogoGrid;
