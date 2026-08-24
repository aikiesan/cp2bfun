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
export const COLLABORATORS_GROUP = 'colaboradores';

const GROUP_LABELS = {
  [DIRECTION_GROUP]: { pt: 'Direção do CP2b', en: 'CP2b Direction' },
  [SUPPORT_GROUP]: {
    pt: 'Apoio Técnico e Administrativo',
    en: 'Technical and Administrative Support',
  },
  [COLLABORATORS_GROUP]: {
    pt: 'Colaboradores e Parceiros',
    en: 'Collaborators and Partners',
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

/**
 * Group the team horizontally by Eixo rather than by rank.
 *
 * The centre asked to be read as units working side by side, not as a
 * hierarchy — so there are no "principal / associate / support" tiers here.
 * The direction sits at the top; each Eixo forms a working unit;
 * technical & administrative support has a dedicated section, and partner
 * collaborators form the final section.
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
      category: SUPPORT_GROUP,
      title: GROUP_LABELS[SUPPORT_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Apoio' : 'Support',
      members: [],
    },
    {
      category: COLLABORATORS_GROUP,
      title: GROUP_LABELS[COLLABORATORS_GROUP][lang],
      shortTitle: lang === 'pt' ? 'Colaboradores' : 'Collaborators',
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

    const isSupport =
      member.category === 'support' ||
      /apoio|administrativ|técnico|tecnico/i.test(member.role || '') ||
      /apoio|administrativ|técnico|tecnico/i.test(member.role_pt || '');

    if (memberAxes.length === 0) {
      if (!isDirector) {
        if (isSupport) {
          byId.get(SUPPORT_GROUP)?.members.push(enriched);
        } else {
          byId.get(COLLABORATORS_GROUP)?.members.push(enriched);
        }
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
