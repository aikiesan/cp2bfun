import { researchAxes } from '../data/content';
import { nameKey } from './nameKey';
import { resolveAffiliation, resolveNoAxisGroup, isCoordinator, SUPPORT_GROUP, PARTNERS_GROUP } from './teamGroups';

// Perfil da equipe calculado do próprio cadastro de /equipe — a mesma lista
// que a página exibe, já sem ex-integrantes. Os números nunca divergem dos
// cartões e se atualizam quando o cadastro muda no painel.
//
// Equipe do CP2b = direção + quem atua nos eixos + apoio técnico e
// administrativo. Pesquisadores associados e instituições parceiras formam a
// rede externa vinculada: colaboram, mas não integram o quadro.

const TEAM_MEMBERSHIPS = new Set(['nucleo', 'direcao', 'apoio']);

// Vínculo de cada pessoa: o que o cadastro declara (`membership`, gravado pelo
// admin) e, na falta, o que a página já deduz — direção, eixo atribuído ou a
// seção de quem não tem eixo.
export const resolveMembership = (member) => {
  const declared = String(member.membership || '').toLowerCase();
  if (declared) return declared;
  const { axes, isDirector } = resolveAffiliation(member);
  if (isDirector) return 'direcao';
  if (axes.length > 0) return 'nucleo';
  const group = resolveNoAxisGroup(member);
  if (group === SUPPORT_GROUP) return 'apoio';
  if (group === PARTNERS_GROUP) return 'parceira';
  return 'associado';
};

// Cargo declarado -> nível. O cadastro não tem campo de titulação; o gráfico
// diz "por cargo declarado" e não afirma formação que ninguém registrou.
export const CAREER_LEVELS = ['direcao', 'coordenacao', 'docente', 'pesquisador', 'posdoc', 'posgrad', 'graduacao', 'apoio', 'outro'];
export const careerLevel = (member, membership = resolveMembership(member)) => {
  const role = [member.role_pt, member.role].filter(Boolean).join(' ');
  if (membership === 'direcao' || /diretor/i.test(role)) return 'direcao';
  if (isCoordinator(member)) return 'coordenacao';
  if (membership === 'apoio' || /apoio|administrativ|t[ée]cnic/i.test(role)) return 'apoio';
  if (/p[óo]s-?doutor|p[óo]s-?doc/i.test(role)) return 'posdoc';
  if (/doutorand|mestrand/i.test(role)) return 'posgrad';
  if (/graduand|inicia[çc][ãa]o|jornalismo|estudante/i.test(role)) return 'graduacao';
  if (/professor|docente|pesquisador(a)? principal|s[êe]nior/i.test(role)) return 'docente';
  if (/pesquisador|mestre|researcher/i.test(role)) return 'pesquisador';
  return 'outro';
};

// Instituição registrada -> instituição-mãe. "NIPE/UNICAMP", "FEEC/UNICAMP",
// "FT UNICAMP" contam como UNICAMP; "EESC/USP", "EP/USP" como USP.
export const INSTITUTION_GROUPS = ['UNICAMP', 'USP', 'UNIFAL', 'UNESP', 'outras', 'sem'];
export const institutionGroup = (institution) => {
  const s = String(institution || '').trim();
  if (!s) return 'sem';
  if (/unicamp/i.test(s)) return 'UNICAMP';
  if (/\busp\b/i.test(s)) return 'USP';
  if (/unifal/i.test(s)) return 'UNIFAL';
  if (/unesp/i.test(s)) return 'UNESP';
  return 'outras';
};

// A coordenação oficial dos eixos (ANEXO 11, em researchAxes). O gênero vem do
// título que o próprio documento usa — "Profª Drª" / "Drº" —, não de adivinhar
// pelo nome. Assentos contam a mesma pessoa em dois eixos duas vezes; pessoas,
// uma vez só. A vaga em aberto não entra.
export const leadershipComposition = (axes = researchAxes.pt) => {
  const people = new Map();
  let seats = 0;
  for (const axis of axes || []) {
    for (const c of axis.coordinators || []) {
      seats += 1;
      const key = nameKey(c.name);
      if (!people.has(key)) people.set(key, /ª|\bDra\b|\bProfa\b/.test(c.name));
    }
  }
  const women = [...people.values()].filter(Boolean).length;
  return { people: people.size, women, seats };
};

const PROFILE_FIELDS = ['orcid', 'lattes', 'scholar', 'bvFapesp', 'institutional', 'scopus', 'wos'];
export const hasPublicProfile = (member) => PROFILE_FIELDS.some((f) => member.profile && member.profile[f]);

export function computeTeamProfile(members) {
  // Uma pessoa, uma contagem — mesmo que apareça em mais de um cartão.
  const unique = new Map();
  for (const m of members || []) {
    const key = nameKey(m.name);
    if (key && !unique.has(key)) unique.set(key, m);
  }
  const people = [...unique.values()].map((m) => ({ ...m, membership: resolveMembership(m) }));
  const team = people.filter((p) => TEAM_MEMBERSHIPS.has(p.membership));
  const external = people.filter((p) => !TEAM_MEMBERSHIPS.has(p.membership));

  const byAxis = Object.fromEntries(['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => [id, 0]));
  for (const p of team) {
    for (const a of resolveAffiliation(p).axes) if (a in byAxis) byAxis[a] += 1;
  }

  const byCareer = Object.fromEntries(CAREER_LEVELS.map((k) => [k, 0]));
  for (const p of team) byCareer[careerLevel(p, p.membership)] += 1;

  const byInstitution = Object.fromEntries(INSTITUTION_GROUPS.map((k) => [k, 0]));
  for (const p of people) byInstitution[institutionGroup(p.institution)] += 1;

  return {
    total: people.length,
    team: team.length,
    external: external.length,
    associates: external.filter((p) => p.membership === 'associado').length,
    partners: external.filter((p) => p.membership === 'parceira').length,
    withProfile: people.filter(hasPublicProfile).length,
    byAxis,
    byCareer,
    byInstitution,
    leadership: leadershipComposition(),
  };
}
