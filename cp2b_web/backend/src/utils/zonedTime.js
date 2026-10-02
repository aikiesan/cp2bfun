// Data e hora de parede num fuso específico, sem depender do TZ do servidor.
// A VM e os containers rodam em UTC; o relatório da newsletter e as datas da
// planilha precisam seguir o horário de Brasília.

const WEEKDAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const formatters = new Map();

function formatterFor(timeZone) {
  if (!formatters.has(timeZone)) {
    formatters.set(timeZone, new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));
  }
  return formatters.get(timeZone);
}

/**
 * Partes de `date` no fuso `timeZone`. weekday: 1 = segunda … 7 = domingo.
 */
export function zonedParts(date, timeZone) {
  const parts = {};
  for (const { type, value } of formatterFor(timeZone).formatToParts(date)) {
    parts[type] = value;
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAYS[parts.weekday],
  };
}

const pad = (n) => String(n).padStart(2, '0');

/** "AAAA-MM-DD" no fuso dado. */
export function zonedIsoDate(date, timeZone) {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** "DD/MM/AAAA" no fuso dado. */
export function zonedBrDate(date, timeZone) {
  const p = zonedParts(date, timeZone);
  return `${pad(p.day)}/${pad(p.month)}/${p.year}`;
}
