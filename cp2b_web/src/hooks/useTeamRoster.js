import { useEffect, useMemo, useState } from 'react';
import { teamMembers as staticTeamMembers } from '../data/content';
import { getTeamPhoto } from '../data/teamPhotos';
import { teamByAxis } from '../data/generated/teamByAxis';
import { getResearcherProfile } from '../data/generated/researcherProfiles';
import { nameKey } from '../utils/nameKey';
import { fetchTeam } from '../services/api';

// A lista de pessoas de /equipe: o cadastro do banco (painel admin) e, sem a
// API, a lista estática (content.js + teamByAxis.js). A home conta os seus
// números desta mesma lista, para nunca divergir da página da equipe.

// The API still stores people under the old ranks; the page no longer
// renders them as ranks, so this is only used to walk the response.
const apiCategories = ['coordinators', 'principals', 'associates', 'support', 'students'];

// Keep former members out of both API-backed and static-fallback results. The
// database migration removes the rows permanently; this also protects the
// public page while an older API response is still cached or being upgraded.
const removedTeamMemberKeys = new Set([
  nameKey('Marlon Fernandes de Souza'),
  nameKey('Gustavo Mockaitis'),
]);

// Identifiers and bio, in the profile shape ResearcherModal expects.
//
// The database has a column per identifier and is the editable source; the
// generated spreadsheet file fills in whoever the database does not carry yet.
// Called with just a `{ name }` for the static fallback, where the sheet is
// the only source there is.
const resolveProfile = (row) => {
  const sheet = getResearcherProfile(row.name);

  return {
    orcid: row.orcid || sheet.orcid,
    lattes: row.lattes || sheet.lattes,
    scholar: row.scholar || sheet.scholar,
    scopus: row.scopus || sheet.scopus,
    wos: row.wos || sheet.wos,
    bvFapesp: row.bv_fapesp || sheet.bvFapesp,
    institutional: row.institutional_url || sheet.institutional,
    bioPt: row.bio_pt || sheet.bioPt,
    bioEn: row.bio_en || sheet.bioEn,
    // Só o banco tem as áreas de atuação: a planilha gerada carrega
    // identificadores, não conteúdo redigido.
    researchAreasPt: row.research_areas_pt || null,
    researchAreasEn: row.research_areas_en || null,
  };
};

// Flatten the static fallback, merging content.js and teamByAxis.js
const flattenStatic = (groups, language) => {
  const seen = new Set();
  const list = groups.flatMap((group) =>
    (group.members || []).map((m) => {
      seen.add(nameKey(m.name));
      return {
        name: m.name,
        role: m[language] || m.role,
        // O cargo em português é o que a classificação de vínculo lê: em
        // inglês, `role` chega traduzido.
        role_pt: m.role,
        institution: m.institution,
        photo: m.photo || getTeamPhoto(m.name),
        axes: m.axes,
        membership: m.membership,
        profile: resolveProfile(m),
      };
    })
  );

  for (const person of teamByAxis) {
    if (!seen.has(nameKey(person.name))) {
      list.push({
        name: person.name,
        role: person.role || person.level || (language === 'pt' ? 'Pesquisador(a)' : 'Researcher'),
        role_pt: person.role || person.level,
        institution: person.institution,
        photo: getTeamPhoto(person.name),
        axes: person.axes,
        is_director: person.direction,
        profile: resolveProfile(person),
      });
    }
  }

  return list;
};

// A lista estática, já sem ex-integrantes: o que a página mostra sem a API.
export const staticRoster = (language = 'pt') =>
  flattenStatic(staticTeamMembers, language)
    .filter((member) => !removedTeamMemberKeys.has(nameKey(member.name)));

export default function useTeamRoster(language) {
  const [apiMembers, setApiMembers] = useState(null);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const apiData = await fetchTeam();
        if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
          // Flatten out of the stored rank buckets: the page regroups by
          // axis, so the ranks are just how the rows happen to be indexed.
          const flat = apiCategories
            .filter((cat) => Array.isArray(apiData[cat]))
            .flatMap((cat) =>
              apiData[cat].map((m) => ({
                name: m.name,
                role: language === 'pt' ? (m.role_pt || m.role) : (m.role_en || m.role_pt || m.role),
                role_pt: m.role_pt || m.role,
                institution: m.institution,
                photo: m.photo || m.photo_url || getTeamPhoto(m.name) || null,
                axes: m.axes,
                is_director: m.is_director,
                membership: m.membership,
                profile: resolveProfile(m),
              }))
            );
          if (flat.length > 0) {
            setApiMembers(flat);
          }
        }
      } catch {
        // Fallback already in place with the static list
      }
    };

    loadTeam();
  }, [language]);

  // Já sem ex-integrantes. Dela saem os cartões de /equipe, o perfil da
  // equipe no topo e os números da home — sempre batem.
  // `source` diz de onde veio a lista: /equipe remonta os cartões quando a
  // lista da API substitui a estática.
  return useMemo(
    () => (apiMembers
      ? { members: apiMembers.filter((member) => !removedTeamMemberKeys.has(nameKey(member.name))), source: 'api' }
      : { members: staticRoster(language), source: 'static' }),
    [apiMembers, language]
  );
}
