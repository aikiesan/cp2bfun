// Contagem regressiva de um evento, feita por DATA DE CALENDÁRIO local, e não
// por instante.
//
// Por quê: new Date('2026-10-05') lê a data sem horário como meia-noite UTC,
// que em Brasília ainda é 4 de outubro às 21h; comparando instantes, o evento
// pareceria um dia mais perto. Aqui a data sem horário vale pelo dia que ela
// escreve, e a data com horário (o ISO que a API devolve) vale pelo dia local
// do visitante, que é o mesmo dia que a página mostra ao lado.

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

// Número do dia de calendário (dias desde 1970-01-01), ou null se inválido.
// Date.UTC só serve para contar: assim a diferença entre dois dias é sempre
// um inteiro, mesmo onde há horário de verão.
export const calendarDay = (value) => {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const dateOnly = DATE_ONLY.exec(value.trim());
    if (dateOnly) return Date.UTC(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]) / DAY_MS;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
};

// { kind, days } para o selo ao lado da data, ou null quando não há o que
// contar (evento que já passou, ou data inválida):
//   'days'      faltam `days` dias (2 ou mais)
//   'tomorrow'  começa amanhã
//   'today'     começa hoje (também no 1º dia de um evento de vários dias)
//   'ongoing'   evento de vários dias, do 2º ao último dia
// Não há horário de término confiável (a API grava end_date = start_date
// quando o término não é informado), então o evento só conta como passado a
// partir do dia seguinte ao último.
export const getEventCountdown = (start, end, now = new Date()) => {
  const startDay = calendarDay(start);
  const today = calendarDay(now);
  if (startDay === null || today === null) return null;
  const endDay = Math.max(calendarDay(end) ?? startDay, startDay);

  if (today > endDay) return null;
  if (today > startDay) return { kind: 'ongoing', days: 0 };
  const days = startDay - today;
  if (days === 0) return { kind: 'today', days };
  if (days === 1) return { kind: 'tomorrow', days };
  return { kind: 'days', days };
};

export default getEventCountdown;
