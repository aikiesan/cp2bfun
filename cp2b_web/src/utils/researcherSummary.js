import { axisDetails } from '../data/generated/axisDetails';
import { nameKey } from './nameKey';

// Mini-resumo de um pesquisador, para o modal de perfil em /equipe.
//
// O texto não é inventado nem redigido aqui: sai do bloco "competencias" de
// axisDetails.js, gerado da planilha estratégica da Luciana, que é a mesma
// fonte que /eixos já usa. Hoje cobre as 15 pessoas na coordenação dos eixos;
// para as demais, o resumo é o campo de biografia editável no admin.
//
// Uma pessoa pode aparecer em mais de um eixo — a direção aparece no 6 e no 7 —
// então áreas e competências são reunidas e deduplicadas.

const buildIndex = () => {
  const index = new Map();

  for (const blocks of Object.values(axisDetails)) {
    for (const block of blocks) {
      if (block.id !== 'competencias') continue;

      for (const item of block.items || []) {
        const key = nameKey(item.person);
        if (!key) continue;

        const entry = index.get(key) || { areas: new Set(), competencies: new Map() };
        if (item.area) entry.areas.add(item.area.trim().replace(/\s+/g, ' '));
        if (item.competency && !entry.competencies.has(item.competency)) {
          entry.competencies.set(item.competency, item.definition || null);
        }
        index.set(key, entry);
      }
    }
  }

  return new Map(
    [...index].map(([key, entry]) => [
      key,
      {
        areas: [...entry.areas].sort(),
        competencies: [...entry.competencies].map(([title, definition]) => ({
          title,
          definition,
        })),
      },
    ])
  );
};

const summaryByKey = buildIndex();

/**
 * Resumo de uma pessoa pelo nome, ou null quando a planilha não a cobre —
 * o caso da maioria, e o modal é desenhado para ele.
 */
export function getResearcherSummary(name) {
  return summaryByKey.get(nameKey(name)) || null;
}

export default getResearcherSummary;
