// Nomes de pessoas vindos dos dados dos eixos: sem os títulos acadêmicos
// ("Profª Drª", "Prof. Dr.") e sem a vaga, que o painel grava como texto no
// campo do nome ("Vaga temporariamente em aberto") — tratada como pessoa, ela
// apareceria em destaque, como um nome.
const HONORIFICS = /^(?:(?:Prof|Dr)[ºªa]?\.?\s+)+/i;
const VACANCY = /^\s*(vaga|position)\b.*\b(aberto|aberta|open)\b/i;

export const cleanName = (name) => String(name || '').replace(HONORIFICS, '').trim();

export const isVacancy = (name) => VACANCY.test(String(name || ''));
