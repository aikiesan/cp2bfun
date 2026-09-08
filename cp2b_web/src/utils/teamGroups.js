import { researchAxes } from '../data/content';
import { teamByAxis } from '../data/generated/teamByAxis';
import { nameKey } from './nameKey';

// "Eixo 3 – Engenharia de Processos" -> "Engenharia de Processos".
// The number is already shown separately, so repeating the prefix only
// costs horizontal space.
export const stripAxisPrefix = (title) =>
  String(title || '').split('–').slice(1).join('–').trim() || String(title || '');

export const DIRECTION_GROUP = 'direcao';
export const SUPPORT_GROUP = 'apoio';
// "Colaboradores e Parceiros" reunia dois vínculos incomparáveis: pesquisadores
// e estudantes do próprio CP2b sem eixo atribuído, e pesquisadores responsáveis
// em instituições parceiras — colaboração externa formalizada por carta de
// apoio à FAPESP. Lidos sob o mesmo título, o centro parecia menor do que é e o
// parceiro externo, mais interno do que é.
export const ASSOCIATES_GROUP = 'associados';
export const PARTNERS_GROUP = 'parceiras';

const GROUP_LABELS = {
  [DIRECTION_GROUP]: { pt: 'Direção do CP2b', en: 'CP2b Direction' },
  [SUPPORT_GROUP]: {
    pt: 'Apoio Técnico e Administrativo',
    en: 'Technical and Administrative Support',
  },
  [ASSOCIATES_GROUP]: {
    pt: 'Pesquisadores Associados',
    en: 'Associate Researchers',
  },
  [PARTNERS_GROUP]: {
    pt: 'Instituições Parceiras',
    en: 'Partner Institutions',
  },
};

// O título sozinho não desfaz a confusão — cada seção nova diz que vínculo
// reúne.
const GROUP_BLURBS = {
  [ASSOCIATES_GROUP]: {
    pt: 'Pesquisadores e estudantes do CP2b que ainda não têm eixo de pesquisa atribuído. Integram o centro do mesmo modo que quem aparece nos eixos acima.',
    en: 'CP2b researchers and students not yet assigned to a research axis. They are part of the centre just as those listed under the axes above.',
  },
  [PARTNERS_GROUP]: {
    pt: 'Pesquisadores responsáveis nas instituições parceiras do CP2b — colaboração externa formalizada por carta de apoio à FAPESP. Não integram o quadro do centro.',
    en: 'Lead researchers at CP2b partner institutions — external collaboration formalised through a letter of support to FAPESP. They are not part of the centre’s own staff.',
  },
};

// Person -> axes, from Luciana's spreadsheet. Used to enrich the static
// fallback list, which has no axis of its own; when the API is up the
// members already carry `axes` and this is only a backstop.
const sheetByKey = new Map(teamByAxis.map((p) => [nameKey(p.name), p]));

const parseAxes = (value) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

/**
 * Resolve a member's axes and directorship, preferring what the record
 * already carries and falling back to the spreadsheet.
 */
export function resolveAffiliation(member) {
  const own = parseAxes(member.axes);
  const fromSheet = sheetByKey.get(nameKey(member.name));

  return {
    axes: own.length > 0 ? own : parseAxes(fromSheet?.axes),
    isDirector: Boolean(
      member.is_director ?? member.isDirector ?? fromSheet?.direction ?? false
    ),
  };
}

// A heurística lê o cargo, e o cargo chega traduzido quando a página está em
// inglês — por isso os dois idiomas. Sem a metade inglesa, /equipe em inglês
// perdia a seção de parceiras inteira e jogava as 14 pessoas em associados.
const SUPPORT_ROLE = /apoio|administrativ|técnico|tecnico|\bsupport\b/i;
// O cargo separa os dois vínculos sem ambiguidade: "Pesquisador Responsável na
// Instituição Parceira" é o rótulo formal da colaboração externa.
const PARTNER_ROLE = /institui(ç|c)(ã|a)o parceira|partner institution/i;

// Vínculos que nomeiam uma seção de quem não tem eixo. 'nucleo' e 'direcao'
// não nomeiam nenhuma — quem os carrega aparece nos eixos ou na direção — por
// isso um registro assim cai na heurística de cargo.
const MEMBERSHIP_GROUPS = {
  associado: ASSOCIATES_GROUP,
  parceira: PARTNERS_GROUP,
  apoio: SUPPORT_GROUP,
};

/**
 * Em que seção cai quem não tem eixo atribuído.
 *
 * Prefere o que o registro carrega (`membership`, gravado pelo admin) e só cai
 * para a heurística de cargo — mesma ordem de precedência de
 * `resolveAffiliation`.
 */
export function resolveNoAxisGroup(member) {
  const declared = MEMBERSHIP_GROUPS[String(member.membership || '').toLowerCase()];
  if (declared) return declared;

  const roles = [member.role, member.role_pt].filter(Boolean).join(' ');
  if (member.category === 'support' || SUPPORT_ROLE.test(roles)) return SUPPORT_GROUP;
  if (PARTNER_ROLE.test(roles)) return PARTNERS_GROUP;
  return ASSOCIATES_GROUP;
}

/**
 * Group the team horizontally by Eixo rather than by rank.
 *
 * The centre asked to be read as units working side by side, not as a
 * hierarchy — so there are no "principal / associate / support" tiers here.
 * The direction sits at the top; each Eixo forms a working unit; then come the
 * centre's own researchers with no axis yet, then the partner institutions —
 * two different bonds, read separately — and technical & administrative
 * support closes the page.
 */
export function groupTeamByAxis(members, language = 'pt') {
  const axes = researchAxes[language] || researchAxes.pt;
  const lang = GROUP_LABELS[DIRECTION_GROUP][language] ? language : 'pt';

  // `title` heads the section; `shortTitle` labels the filter chip, where
  // the full axis name would not fit.
  const groups = [
    {
      category: DIRECTION_GROUP,
      title: GROUP_LABELS[DIRECTION_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Direção' : 'Direction',
      members: [],
    },
    ...axes.map((axis) => ({
      category: `eixo-${axis.id}`,
      axisId: axis.id,
      title: `${lang === 'pt' ? 'Eixo' : 'Axis'} ${axis.id} — ${stripAxisPrefix(axis.title)}`,
      shortTitle: `${lang === 'pt' ? 'Eixo' : 'Axis'} ${axis.id}`,
      members: [],
    })),
    {
      category: ASSOCIATES_GROUP,
      title: GROUP_LABELS[ASSOCIATES_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Associados' : 'Associates',
      blurb: GROUP_BLURBS[ASSOCIATES_GROUP][lang],
      members: [],
    },
    {
      category: PARTNERS_GROUP,
      title: GROUP_LABELS[PARTNERS_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Parceiras' : 'Partners',
      blurb: GROUP_BLURBS[PARTNERS_GROUP][lang],
      members: [],
    },
    {
      category: SUPPORT_GROUP,
      title: GROUP_LABELS[SUPPORT_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Apoio' : 'Support',
      members: [],
    },
  ];

  const byId = new Map(groups.map((g) => [g.category, g]));

  for (const member of members) {
    const { axes: memberAxes, isDirector } = resolveAffiliation(member);
    const enriched = { ...member, axes: memberAxes, isDirector };

    if (isDirector) {
      byId.get(DIRECTION_GROUP).members.push(enriched);
    }

    if (memberAxes.length === 0) {
      if (!isDirector) {
        byId.get(resolveNoAxisGroup(member))?.members.push(enriched);
      }
      continue;
    }

    for (const axisId of memberAxes) {
      byId.get(`eixo-${axisId}`)?.members.push(enriched);
    }
  }

  return groups.filter((g) => g.members.length > 0);
}

export default groupTeamByAxis;
