import { Modal } from 'react-bootstrap';
import { SiOrcid, SiGooglescholar, SiScopus } from 'react-icons/si';
import { researchAxes } from '../data/content';
import { stripAxisPrefix } from '../utils/teamGroups';
import { getResearcherSummary } from '../utils/researcherSummary';
import { useLanguage } from '../context/LanguageContext';
import Avatar from './Avatar';

// Perfil de um pesquisador, aberto a partir do card em /equipe.
//
// Nunca mostra e-mail nem telefone: são dados privados que o banco guarda
// para uso interno, e há teste garantindo que não aparecem na página pública.
//
// `show`/`onHide` vêm do pai — um único modal no nível da página, montado só
// quando aberto. Foco e Escape ficam por conta do react-bootstrap.

const labels = {
  pt: {
    axes: 'Eixos de pesquisa',
    areas: 'Áreas de atuação',
    competencies: 'Competências',
    profiles: 'Currículo e perfis',
    empty: 'Currículo não cadastrado.',
    close: 'Fechar',
    lattes: 'Lattes',
    orcid: 'ORCID',
    scholar: 'Google Scholar',
    bvFapesp: 'BV FAPESP',
    scopus: 'Scopus',
    wos: 'Web of Science',
    institutional: 'Perfil institucional',
  },
  en: {
    axes: 'Research axes',
    areas: 'Areas of work',
    competencies: 'Competencies',
    profiles: 'CV and profiles',
    empty: 'No CV on record.',
    close: 'Close',
    lattes: 'Lattes',
    orcid: 'ORCID',
    scholar: 'Google Scholar',
    bvFapesp: 'BV FAPESP',
    scopus: 'Scopus',
    wos: 'Web of Science',
    institutional: 'Institutional profile',
  },
};

// A ordem em que os links aparecem, e como cada um se apresenta. Cada botão
// leva rótulo textual visível: ícone sozinho dependeria de o visitante
// reconhecer o símbolo, e ORCID e Scholar não têm símbolo conhecido fora da
// academia.
const LINKS = [
  { field: 'lattes', variant: 'outline-primary' },
  { field: 'orcid', variant: 'outline-success', Icon: SiOrcid },
  { field: 'scholar', variant: 'outline-primary', Icon: SiGooglescholar },
  { field: 'bvFapesp', variant: 'outline-secondary' },
  { field: 'scopus', variant: 'outline-secondary', Icon: SiScopus },
  { field: 'wos', variant: 'outline-secondary' },
  { field: 'institutional', variant: 'outline-dark' },
];

const ResearcherModal = ({ member, show, onHide }) => {
  const { language } = useLanguage();
  const t = labels[language] || labels.pt;

  // O conteúdo só existe enquanto o modal está aberto: /equipe tem testes que
  // afirmam que certos nomes não estão no DOM, e um modal sempre montado os
  // colocaria lá.
  if (!member) return null;

  const profile = member.profile || {};
  const bio = (language === 'pt' ? profile.bioPt : profile.bioEn) || profile.bioPt || null;
  const links = LINKS.filter(({ field }) => profile[field]);

  // Mini-resumo da planilha estratégica. Os textos são só em português na
  // fonte — a tradução é feita depois, pelo admin, como no resto de
  // axisDetails — então aparecem como estão nos dois idiomas.
  const summary = getResearcherSummary(member.name);

  const axes = researchAxes[language] || researchAxes.pt;
  const memberAxes = (member.axes || [])
    .map((id) => axes.find((axis) => String(axis.id) === String(id)))
    .filter(Boolean);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="fs-5 fw-bold mb-0">
          {member.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 align-items-center align-items-sm-start mb-4">
          {/* Sem axisId: o badge numérico do Avatar substituiria a pessoa
              pelo número do eixo, que é justamente o que o perfil evita. */}
          <Avatar photo={member.photo} name={member.name} size={120} />
          <div className="text-center text-sm-start" style={{ minWidth: 0 }}>
            {member.role && (
              <div
                className="fw-semibold mb-1"
                style={{ color: 'var(--brand-primary, #00573A)' }}
              >
                {member.role}
              </div>
            )}
            {member.institution && member.institution !== '-' && (
              <div className="text-muted mb-2">{member.institution}</div>
            )}
            {memberAxes.length > 0 && (
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-start">
                {memberAxes.map((axis) => (
                  <span
                    key={axis.id}
                    className="badge rounded-pill bg-light text-dark fw-normal border"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {language === 'pt' ? 'Eixo' : 'Axis'} {axis.id} — {stripAxisPrefix(axis.title)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {bio && <p className="mb-4" style={{ lineHeight: 1.7 }}>{bio}</p>}

        {summary?.areas.length > 0 && (
          <div className="mb-4">
            <h3 className="mono-label text-muted small text-uppercase mb-2">{t.areas}</h3>
            <ul className="list-unstyled mb-0">
              {summary.areas.map((area) => (
                <li key={area} className="d-flex gap-2 mb-1">
                  <i
                    className="bi bi-dot flex-shrink-0"
                    style={{ color: 'var(--brand-primary, #00573A)' }}
                    aria-hidden="true"
                  />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary?.competencies.length > 0 && (
          <div className="mb-4">
            <h3 className="mono-label text-muted small text-uppercase mb-2">{t.competencies}</h3>
            <dl className="mb-0">
              {summary.competencies.map(({ title, definition }) => (
                <div key={title} className="mb-2">
                  <dt className="fw-semibold" style={{ fontSize: '0.92rem' }}>{title}</dt>
                  {definition && (
                    <dd className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                      {definition}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        )}

        <h3 className="mono-label text-muted small text-uppercase mb-2">{t.profiles}</h3>
        {links.length > 0 ? (
          <div className="d-flex gap-2 flex-wrap">
            {links.map(({ field, variant, Icon }) => (
              <a
                key={field}
                href={profile[field]}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-sm btn-${variant} d-inline-flex align-items-center gap-2`}
              >
                {Icon ? (
                  <Icon aria-hidden="true" />
                ) : (
                  <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                )}
                {t[field]}
              </a>
            ))}
          </div>
        ) : (
          // 26 das 98 pessoas não têm nenhum identificador. O caso vazio é
          // frequente o bastante para ser desenhado, não tratado como exceção:
          // uma linha discreta, e não uma barra de botões faltando.
          <p className="text-muted small fst-italic mb-0">{t.empty}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ResearcherModal;
