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

// Quem coordena o eixo. Como em SUPPORT_ROLE e PARTNER_ROLE, os dois idiomas
// entram: o cargo de um registro vindo da API chega traduzido quando a página
// está em inglês, enquanto o do teamByAxis é sempre português.
const COORDINATOR_ROLE = /coordenador|coordenadora|coordinator/i;

/**
 * O cargo da pessoa já anuncia que ela coordena?
 *
 * Só decide a APRESENTAÇÃO — quem de fato coordena vem de
 * researchAxes[].coordinators, abaixo. A diferença importa para Bruna e
 * Renata: elas coordenam os eixos 6 e 7, mas o cargo delas diz "Diretora" e
 * "Vice-diretora", então precisam de uma tag a mais em vez de ter o cargo
 * transformado em tag.
 */
export function isCoordinator(member) {
  const roles = [member.role, member.role_pt].filter(Boolean).join(' ');
  return COORDINATOR_ROLE.test(roles);
}

/**
 * Eixo -> nomes de quem coordena, na ordem em que researchAxes os lista.
 *
 * Essa ordem não é alfabética nem acidental: é a hierarquia da coordenação, e
 * a página precisa respeitá-la (Eixo 1 abre com Rubens, não com Lucas). Os
 * nomes vêm com títulos — "Profº Drº Rubens..." — e nameKey os descarta, que é
 * o que permite casar com o registro da pessoa na lista da equipe.
 */
const coordinatorRankByAxis = new Map(
  (researchAxes.pt || []).map((axis) => [
    String(axis.id),
    new Map((axis.coordinators || []).map((c, i) => [nameKey(c.name), i])),
  ])
);

/**
 * Posição da pessoa na coordenação do eixo, ou Infinity se ela não coordena.
 */
export function coordinatorRank(member, axisId) {
  const ranks = coordinatorRankByAxis.get(String(axisId));
  if (!ranks) return Infinity;
  const rank = ranks.get(nameKey(member.name));
  return rank === undefined ? Infinity : rank;
}

// Dentro do eixo: a coordenação primeiro, na ordem do researchAxes; o resto em
// ordem alfabética. Antes a lista saía na ordem da planilha, que é alfabética
// pelo primeiro nome, e enterrava a coordenação no meio do grupo.
// `localeCompare` com 'pt' ordena acento junto da letra base, senão "Ângela"
// cairia depois de "Zuleica".
const byCoordinationThenName = (axisId) => (a, b) => {
  const rankA = coordinatorRank(a, axisId);
  const rankB = coordinatorRank(b, axisId);
  if (rankA !== rankB) return rankA - rankB;
  return String(a.name || '').localeCompare(String(b.name || ''), 'pt');
};

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
      // `coordinatesAxis` guarda o eixo, não um booleano: a mesma pessoa pode
      // coordenar um eixo e apenas integrar outro — a Renata coordena o 6 e o
      // 7, e o card precisa dizer de qual eixo a tag fala.
      byId.get(`eixo-${axisId}`)?.members.push({
        ...enriched,
        coordinatesAxis: coordinatorRank(member, axisId) < Infinity ? String(axisId) : null,
      });
    }
  }

  // Só os grupos de eixo são reordenados. Direção, associados, parceiras e
  // apoio mantêm a ordem que já tinham: ali coordenação não é um papel da
  // seção, e mexer nelas seria mudança que ninguém pediu.
  for (const group of groups) {
    if (group.category.startsWith('eixo-')) {
      group.members.sort(byCoordinationThenName(group.category.slice('eixo-'.length)));
    }
  }

  return groups.filter((g) => g.members.length > 0);
}

export default groupTeamByAxis;
