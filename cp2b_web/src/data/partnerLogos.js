// Mapeamento explícito de logos dos parceiros do CP2b.
import { nameKey } from '../utils/nameKey';

export const partnerLogos = {
  'Núcleo Interdisciplinar de Planejamento Energético (NIPE/UNICAMP)': '/assets/partners/nucleo-interdisciplinar-de-planejamento-energetico-logo.png',
  'NIPE/UNICAMP': '/assets/partners/nucleo-interdisciplinar-de-planejamento-energetico-logo.png',
  'NIPE': '/assets/partners/nucleo-interdisciplinar-de-planejamento-energetico-logo.png',
  'Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)': '/assets/partners/secretaria-estadual-de-agricultura-e-abastecimento-de-sao-paulo-saasp.png',
  'SAASP': '/assets/partners/secretaria-estadual-de-agricultura-e-abastecimento-de-sao-paulo-saasp.png',
  'Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)': '/assets/partners/secretaria-municipal-do-verde-meio-ambiente-e-desenvolvimento-sustentavel-de-campinas.jpg',
  'SMVMADS': '/assets/partners/secretaria-municipal-do-verde-meio-ambiente-e-desenvolvimento-sustentavel-de-campinas.jpg',
  'Universidade Federal de Alfenas (UNIFAL)': '/assets/partners/unifal-mg.jpg',
  'UNIFAL': '/assets/partners/unifal-mg.jpg',
  'Instituto Agronômico de Campinas (IAC/SAASP)': '/assets/partners/instituto-agronomico-de-campinas.jpg',
  'IAC': '/assets/partners/instituto-agronomico-de-campinas.jpg',
  'Associação Brasileira de Pesquisa e Inovação Industrial (EMBRAPII)': '/assets/partners/associacao-brasileira-de-pesquisa-e-inovacao-industrial-embrapii.png',
  'EMBRAPII': '/assets/partners/associacao-brasileira-de-pesquisa-e-inovacao-industrial-embrapii.png',
  'Instituto de Zootecnia (IZ/SAASP)': '/assets/partners/instituto-de-zootecnia.jpg',
  'IZ': '/assets/partners/instituto-de-zootecnia.jpg',
  'Escola Politécnica (EP/USP)': '/assets/partners/escola-politecnica-epusp.jpg',
  'EPUSP': '/assets/partners/escola-politecnica-epusp.jpg',
  'POLI/USP': '/assets/partners/escola-politecnica-epusp.jpg',
  'Universidad de Cádiz (UCA)': '/assets/partners/universidad-de-cadiz-uca.jpg',
  'UCA': '/assets/partners/universidad-de-cadiz-uca.jpg',
  'Delft University of Technology (TUDELFT)': '/assets/partners/delft-university-of-technology.png',
  'TUDELFT': '/assets/partners/delft-university-of-technology.png',
  'Laboratório Nacional de Energia e Geologia (LNEG)': '/assets/partners/laboratorio-nacional-de-energia-e-geologia-lneg.png',
  'LNEG': '/assets/partners/laboratorio-nacional-de-energia-e-geologia-lneg.png',
  'Companhia de Gás de São Paulo (COMGAS)': '/assets/partners/comgas.png',
  'COMGAS': '/assets/partners/comgas.png',
  'Amplum Biogás e Energias Renováveis Ltda.': '/assets/partners/amplum-biogas-e-energias-renovaveis.webp',
  'Amplum Biogás': '/assets/partners/amplum-biogas-e-energias-renovaveis.webp',
  'Companhia de Saneamento Básico do Estado de São Paulo (SABESP)': '/assets/partners/sabesp.jpg',
  'SABESP': '/assets/partners/sabesp.jpg',
  'Cooperativa dos Plantadores de Cana do Oeste do Estado de São Paulo (COPERCANA)': '/assets/partners/cooperativa-dos-plantadores-de-cana-do-oeste-do-estado-de-sao-paulo-copercana.jpg',
  'COPERCANA': '/assets/partners/cooperativa-dos-plantadores-de-cana-do-oeste-do-estado-de-sao-paulo-copercana.jpg',
};

const logosByKey = new Map(
  Object.entries(partnerLogos).map(([name, path]) => [nameKey(name), path])
);

export function getPartnerLogo(name) {
  if (!name) return null;
  if (partnerLogos[name]) return partnerLogos[name];
  const k = nameKey(name);
  if (logosByKey.has(k)) return logosByKey.get(k);

  // Acronym/fuzzy check
  const lower = name.toLowerCase();
  for (const [key, path] of Object.entries(partnerLogos)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return path;
    }
  }
  return null;
}

export default partnerLogos;
