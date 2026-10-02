import { researchAxes } from '../data/content';
import { axisTheme } from '../utils/axisTheme';
import { CAREER_LEVELS, INSTITUTION_GROUPS } from '../utils/teamProfile';
import './TeamProfile.css';

// Perfil da equipe no topo de /equipe: números e barras calculados do próprio
// cadastro da página (utils/teamProfile), para nunca divergirem dos cartões.
const LABELS = {
  pt: {
    eyebrow: 'Perfil da equipe',
    title: 'O CP2b em números',
    subtitle: 'Calculado do cadastro desta página: muda sozinho quando a equipe muda.',
    team: 'na equipe do CP2b',
    teamNote: 'direção, eixos temáticos e apoio',
    external: 'na rede externa vinculada',
    externalNote: (a, p) => `${a} pesquisadores associados e ${p} instituições parceiras`,
    leadership: 'da coordenação dos eixos é feminina',
    leadershipNote: (w, n) => `${w} de ${n} pessoas na coordenação (ANEXO 11)`,
    profiles: 'com perfil público',
    profilesNote: 'Lattes, ORCID, Google Scholar ou página institucional',
    of: 'de',
    byAxis: 'Por eixo temático',
    byAxisNote: 'Equipe do CP2b. A direção atua em dois eixos, por isso a soma passa do total.',
    byCareer: 'Por cargo declarado',
    byCareerNote: 'Equipe do CP2b, pelo cargo registrado no cadastro.',
    byInstitution: 'Por instituição',
    byInstitutionNote: 'Registro completo — equipe e rede externa.',
    axis: 'Eixo',
    career: {
      direcao: 'Direção', coordenacao: 'Coordenação de eixo', docente: 'Docente / pesquisador principal',
      pesquisador: 'Pesquisador(a)', posdoc: 'Pós-doutorado', posgrad: 'Pós-graduação (mestrado e doutorado)',
      graduacao: 'Graduação, IC e bolsa', apoio: 'Apoio técnico e administrativo', outro: 'Sem cargo classificável',
    },
    institution: { UNICAMP: 'UNICAMP', USP: 'USP', UNIFAL: 'UNIFAL', UNESP: 'UNESP', outras: 'Outras instituições e empresas', sem: 'Sem instituição registrada' },
  },
  en: {
    eyebrow: 'Team profile',
    title: 'CP2b in numbers',
    subtitle: 'Computed from the roster on this page: it updates itself when the team changes.',
    team: 'on the CP2b team',
    teamNote: 'direction, thematic axes and support',
    external: 'in the linked external network',
    externalNote: (a, p) => `${a} associate researchers and ${p} partner institutions`,
    leadership: 'of axis coordination is held by women',
    leadershipNote: (w, n) => `${w} of ${n} people in coordination (ANNEX 11)`,
    profiles: 'with a public profile',
    profilesNote: 'Lattes, ORCID, Google Scholar or institutional page',
    of: 'of',
    byAxis: 'By thematic axis',
    byAxisNote: 'CP2b team. The direction works in two axes, so the sum exceeds the total.',
    byCareer: 'By declared role',
    byCareerNote: 'CP2b team, by the role recorded in the roster.',
    byInstitution: 'By institution',
    byInstitutionNote: 'Full roster — team and external network.',
    axis: 'Axis',
    career: {
      direcao: 'Direction', coordenacao: 'Axis coordination', docente: 'Faculty / principal researcher',
      pesquisador: 'Researcher', posdoc: 'Postdoctoral', posgrad: "Graduate students (master's and PhD)",
      graduacao: 'Undergraduate, research initiation and grants', apoio: 'Technical and administrative support', outro: 'Unclassified role',
    },
    institution: { UNICAMP: 'UNICAMP', USP: 'USP', UNIFAL: 'UNIFAL', UNESP: 'UNESP', outras: 'Other institutions and companies', sem: 'No institution recorded' },
  },
};

// Nomes curtos dos eixos: o gráfico é estreito e os títulos completos saíam
// cortados. O título completo continua no detalhamento de /eixos.
const AXIS_SHORT = {
  pt: { 1: 'Inventário e mapeamento', 2: 'Ciência e tecnologia de base', 3: 'Processos e bioprocessos', 4: 'Avaliação integrada', 5: 'Bioprodutos', 6: 'Educação e capacitação', 7: 'Difusão e comunicação', 8: 'Políticas públicas' },
  en: { 1: 'Inventory and mapping', 2: 'Basic science and technology', 3: 'Processes and bioprocesses', 4: 'Integrated assessment', 5: 'Bioproducts', 6: 'Education and training', 7: 'Outreach and communication', 8: 'Public policy' },
};

const Bars = ({ title, note, rows, max }) => (
  <section className="tprof-chart">
    <h3 className="tprof-chart__title">{title}</h3>
    <ul className="tprof-bars">
      {rows.filter((r) => r.n > 0).map((r) => (
        <li key={r.key} style={r.color ? { '--bar': r.color } : undefined}>
          <span className="tprof-bars__label">
            {r.icon && <i className={`bi ${r.icon}`} aria-hidden="true" />}
            {r.label}
          </span>
          <span className="tprof-bars__n">{r.n}</span>
          <span className="tprof-bars__track" aria-hidden="true">
            <span style={{ width: `${(r.n / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
    <p className="tprof-chart__note">{note}</p>
  </section>
);

const TeamProfile = ({ profile, language }) => {
  const t = LABELS[language] || LABELS.pt;
  const { team, external, associates, partners, withProfile, total, byAxis, byCareer, byInstitution, leadership } = profile;
  const pctWomen = Math.round((leadership.women / leadership.people) * 100);
  const axes = researchAxes[language] || researchAxes.pt;

  const axisRows = axes.map((a) => ({
    key: a.id,
    label: `${String(a.id).padStart(2, '0')} ${(AXIS_SHORT[language] || AXIS_SHORT.pt)[a.id]}`,
    n: byAxis[a.id] || 0,
    color: axisTheme(a.id).color,
    icon: axisTheme(a.id).icon,
  }));
  const careerRows = CAREER_LEVELS.map((k) => ({ key: k, label: t.career[k], n: byCareer[k] || 0 }))
    .sort((a, b) => b.n - a.n);
  const instRows = INSTITUTION_GROUPS.map((k) => ({ key: k, label: t.institution[k], n: byInstitution[k] || 0 }));

  return (
    <section className="tprof" aria-labelledby="tprof-title">
      <header className="tprof__head">
        <span className="tprof__eyebrow">{t.eyebrow}</span>
        <h2 id="tprof-title">{t.title}</h2>
        <p>{t.subtitle}</p>
      </header>

      <ul className="tprof-stats">
        <li>
          <span className="tprof-stats__num">{team}</span>
          <span className="tprof-stats__lbl">{t.team}</span>
          <span className="tprof-stats__note">{t.teamNote}</span>
        </li>
        <li>
          <span className="tprof-stats__num">{external}</span>
          <span className="tprof-stats__lbl">{t.external}</span>
          <span className="tprof-stats__note">{t.externalNote(associates, partners)}</span>
        </li>
        <li className="is-highlight">
          <span className="tprof-stats__num">{pctWomen}<small>%</small></span>
          <span className="tprof-stats__lbl">{t.leadership}</span>
          {/* Uma marca por pessoa na coordenação: cheias as mulheres. */}
          <span className="tprof-dots" aria-hidden="true">
            {Array.from({ length: leadership.people }, (_, i) => (
              <span key={i} className={i < leadership.women ? 'is-on' : undefined} />
            ))}
          </span>
          <span className="tprof-stats__note">{t.leadershipNote(leadership.women, leadership.people)}</span>
        </li>
        <li>
          <span className="tprof-stats__num">{withProfile}<small> {t.of} {total}</small></span>
          <span className="tprof-stats__lbl">{t.profiles}</span>
          <span className="tprof-stats__note">{t.profilesNote}</span>
        </li>
      </ul>

      <div className="tprof-charts">
        <Bars title={t.byAxis} note={t.byAxisNote} rows={axisRows} max={Math.max(...axisRows.map((r) => r.n), 1)} />
        <Bars title={t.byCareer} note={t.byCareerNote} rows={careerRows} max={Math.max(...careerRows.map((r) => r.n), 1)} />
        <Bars title={t.byInstitution} note={t.byInstitutionNote} rows={instRows} max={Math.max(...instRows.map((r) => r.n), 1)} />
      </div>
    </section>
  );
};

export default TeamProfile;
